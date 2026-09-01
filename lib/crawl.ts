import "server-only";
import { env } from "@/lib/env";
import { safeFetchText } from "@/lib/security";
import type { CrawledPage } from "@/lib/types";

function decodeEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
}

function stripHtml(html: string) {
  return decodeEntities(html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim());
}

function tagText(html: string, pattern: RegExp) {
  const values: string[] = [];
  for (const match of html.matchAll(pattern)) {
    const value = stripHtml(match[1] || "");
    if (value && !values.includes(value)) values.push(value);
  }
  return values;
}

function meta(html: string, name: string) {
  const pattern = new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]+content=["']([^"']+)["'][^>]*>|<meta[^>]+content=["']([^"']+)["'][^>]+(?:name|property)=["']${name}["'][^>]*>`, "i");
  const match = html.match(pattern);
  return decodeEntities(match?.[1] || match?.[2] || "").trim();
}

function parseLinks(html: string, base: URL) {
  const urls = new Set<string>();
  for (const match of html.matchAll(/<a\b[^>]*href=["']([^"'#]+)["'][^>]*>/gi)) {
    try {
      const url = new URL(match[1], base);
      if (url.origin !== base.origin || !["http:", "https:"].includes(url.protocol)) continue;
      url.hash = "";
      if (/\.(?:jpg|jpeg|png|gif|webp|svg|zip|mp4|mp3|css|js)$/i.test(url.pathname)) continue;
      urls.add(url.toString());
    } catch {}
  }
  return [...urls];
}

function parseRobots(text: string, userAgent: string) {
  const groups: Array<{ agents: string[]; rules: Array<{ type: "allow" | "disallow"; path: string }> }> = [];
  let group: (typeof groups)[number] | null = null;
  for (const raw of text.split(/\r?\n/)) {
    const line = raw.replace(/#.*/, "").trim();
    if (!line) continue;
    const [name, ...rest] = line.split(":");
    const value = rest.join(":").trim();
    if (name.toLowerCase() === "user-agent") {
      if (!group || group.rules.length) { group = { agents: [], rules: [] }; groups.push(group); }
      group.agents.push(value.toLowerCase());
    } else if (group && ["allow", "disallow"].includes(name.toLowerCase())) {
      group.rules.push({ type: name.toLowerCase() as "allow" | "disallow", path: value });
    }
  }
  const agent = userAgent.toLowerCase();
  const specific = groups.filter((item) => item.agents.some((entry) => agent.includes(entry) || entry === "aixsignalbot"));
  const applicable = specific.length ? specific : groups.filter((item) => item.agents.includes("*"));
  return (pathname: string) => {
    const matches = applicable.flatMap((item) => item.rules).filter((rule) => rule.path && pathname.startsWith(rule.path)).sort((a, b) => b.path.length - a.path.length);
    return matches[0]?.type !== "disallow";
  };
}

function priority(url: string) {
  const path = new URL(url).pathname.toLowerCase();
  const keys = ["service", "product", "pricing", "price", "case", "customer", "about", "company", "faq", "security", "support", "integration", "solution", "feature", "導入", "料金", "事例", "会社", "機能"];
  const index = keys.findIndex((key) => path.includes(key));
  return index < 0 ? 100 : index;
}

function parsePage(url: string, html: string): CrawledPage {
  const title = tagText(html, /<title[^>]*>([\s\S]*?)<\/title>/gi)[0] || new URL(url).hostname;
  const description = meta(html, "description") || meta(html, "og:description");
  const headings = tagText(html, /<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi).slice(0, 40);
  const text = stripHtml(html).slice(0, 45_000);
  return { url, title, description, headings, text };
}

export async function crawlSite(input: string, onProgress?: (message: string) => void) {
  const origin = new URL(input).origin;
  let allowed = (_pathname: string) => true;
  try {
    const robots = await safeFetchText(`${origin}/robots.txt`, 250_000);
    allowed = parseRobots(robots.text, "AIXSignalBot");
  } catch {}

  const queue = [new URL(input).toString()];
  try {
    const sitemap = await safeFetchText(`${origin}/sitemap.xml`, 1_500_000);
    for (const match of sitemap.text.matchAll(/<loc>([^<]+)<\/loc>/gi)) {
      try {
        const url = new URL(decodeEntities(match[1].trim()));
        if (url.origin === origin && allowed(url.pathname)) queue.push(url.toString());
      } catch {}
    }
  } catch {}

  const seen = new Set<string>();
  const pages: CrawledPage[] = [];
  while (queue.length && pages.length < env.freeScanMaxPages) {
    queue.sort((a, b) => priority(a) - priority(b));
    const url = queue.shift()!;
    if (seen.has(url)) continue;
    seen.add(url);
    const parsed = new URL(url);
    if (!allowed(parsed.pathname)) continue;
    try {
      onProgress?.(`${pages.length + 1}/${env.freeScanMaxPages}: ${parsed.pathname || "/"}`);
      const fetched = await safeFetchText(url);
      const contentType = fetched.response.headers.get("content-type") || "";
      if (!/html|xhtml/i.test(contentType)) continue;
      const page = parsePage(fetched.response.url || url, fetched.text);
      if (page.text.length < 120) continue;
      pages.push(page);
      if (pages.length < 5) {
        for (const link of parseLinks(fetched.text, new URL(page.url))) if (!seen.has(link)) queue.push(link);
      }
    } catch {}
  }
  if (!pages.length) throw new Error("公開ページを取得できませんでした。robots.txtやアクセス制限をご確認ください。");
  return pages;
}
