import "server-only";
import { isAllowedByRobots } from "@/lib/robots";
import { safeFetchText } from "@/lib/url-security";
import type { CrawledPage } from "@/lib/types";

function decode(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&#(\d+);/g, (_, number) => String.fromCharCode(Number(number)));
}

function cleanText(html: string) {
  return decode(html
    .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim());
}

function firstMatch(source: string, pattern: RegExp) {
  return decode(source.match(pattern)?.[1]?.replace(/\s+/g, " ").trim() || "");
}

function parsePage(url: string, html: string): CrawledPage {
  const title = firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i);
  const description = firstMatch(html, /<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["'][^>]*>/i)
    || firstMatch(html, /<meta[^>]+content=["']([^"']*)["'][^>]+name=["']description["'][^>]*>/i);
  const headings = [...html.matchAll(/<h[1-3][^>]*>([\s\S]*?)<\/h[1-3]>/gi)].map((match) => cleanText(match[1])).filter(Boolean).slice(0, 24);
  return { url, title, description, headings, text: cleanText(html).slice(0, 30_000) };
}

function linksFromHtml(base: URL, html: string) {
  const links = new Set<string>();
  for (const match of html.matchAll(/<a\b[^>]+href=["']([^"'#]+)["']/gi)) {
    try {
      const url = new URL(match[1], base);
      if (url.origin !== base.origin || !["http:", "https:"].includes(url.protocol)) continue;
      url.hash = "";
      if (/\.(?:jpg|jpeg|png|gif|webp|svg|zip|mp4|mp3|css|js|woff2?|ttf)(?:$|\?)/i.test(url.pathname)) continue;
      links.add(url.toString());
    } catch { /* ignore malformed links */ }
  }
  return [...links];
}

function priority(url: string) {
  const path = new URL(url).pathname.toLowerCase();
  const patterns = [
    /product|service|solution|機能|サービス|製品/,
    /pricing|price|料金|費用/,
    /case|customer|導入|事例|実績/,
    /about|company|会社|企業/,
    /security|trust|安全|セキュリティ|認証/,
    /faq|help|support|docs|よくある|サポート/,
    /integration|連携/,
  ];
  const index = patterns.findIndex((pattern) => pattern.test(path));
  return index < 0 ? 50 + path.split("/").length : index;
}

function sitemapUrls(base: URL, xml: string) {
  const urls: string[] = [];
  for (const match of xml.matchAll(/<loc>([\s\S]*?)<\/loc>/gi)) {
    try {
      const url = new URL(decode(match[1].trim()), base);
      if (url.origin === base.origin) urls.push(url.toString());
    } catch { /* ignore */ }
  }
  return urls;
}

async function robotsFor(url: URL, cache: Map<string, string>) {
  if (cache.has(url.origin)) return cache.get(url.origin) || "";
  let robots = "";
  try { robots = (await safeFetchText(`${url.origin}/robots.txt`, 300_000)).text; } catch { /* absent robots */ }
  cache.set(url.origin, robots);
  return robots;
}

export async function crawlCompanySite(input: string, maxPages = 24) {
  const start = new URL(input);
  const robotsCache = new Map<string, string>();
  const startRobots = await robotsFor(start, robotsCache);
  const queue = new Set<string>([start.toString(), `${start.origin}/`]);

  try {
    const sitemap = await safeFetchText(`${start.origin}/sitemap.xml`, 1_500_000);
    const sitemapBase = new URL(sitemap.response.url || `${start.origin}/sitemap.xml`);
    sitemapUrls(sitemapBase, sitemap.text).sort((a, b) => priority(a) - priority(b)).slice(0, maxPages * 4).forEach((url) => queue.add(url));
  } catch { /* sitemap is optional */ }

  const pages: CrawledPage[] = [];
  const visited = new Set<string>();
  while (queue.size && pages.length < maxPages) {
    const next = [...queue].sort((a, b) => priority(a) - priority(b))[0];
    queue.delete(next);
    if (visited.has(next)) continue;
    visited.add(next);
    const requestedUrl = new URL(next);
    const requestedRobots = await robotsFor(requestedUrl, robotsCache);
    if (requestedRobots && !isAllowedByRobots(requestedRobots, requestedUrl.pathname, "aixnextbot")) continue;
    try {
      const { text, response } = await safeFetchText(requestedUrl.toString(), 1_500_000);
      const type = response.headers.get("content-type") || "";
      if (!/html|xhtml/i.test(type)) continue;
      const effectiveUrl = new URL(response.url || requestedUrl.toString());
      const effectiveRobots = await robotsFor(effectiveUrl, robotsCache);
      if (effectiveRobots && !isAllowedByRobots(effectiveRobots, effectiveUrl.pathname, "aixnextbot")) continue;
      const page = parsePage(effectiveUrl.toString(), text);
      if (page.text.length < 80) continue;
      pages.push(page);
      linksFromHtml(effectiveUrl, text).sort((a, b) => priority(a) - priority(b)).slice(0, 40).forEach((link) => {
        if (!visited.has(link)) queue.add(link);
      });
    } catch { /* partial crawl is valid */ }
  }
  if (!pages.length) throw new Error("公開ページを取得できませんでした。robots.txt、URL、サイト構成を確認してください。");
  return { pages, robots: startRobots, attempted: visited.size };
}
