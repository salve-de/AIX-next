import type { AiReadableDraft, CrawledPage, ScanResult } from "@/lib/types";

function oneLine(value: string | undefined, fallback = "") {
  return (value || "").replace(/[\u0000-\u001f\u007f]+/g, " ").replace(/\s+/g, " ").trim().slice(0, 1_000) || fallback;
}

function pagePath(page: CrawledPage) {
  try { return new URL(page.url).pathname || "/"; }
  catch { return "/"; }
}

function pageName(page: CrawledPage) {
  return oneLine(page.title, pagePath(page) === "/" ? "ホーム" : pagePath(page));
}

function homePage(pages: CrawledPage[], targetUrl: string) {
  try {
    const target = new URL(targetUrl);
    const targetPath = target.pathname.replace(/\/$/, "") || "/";
    return pages.find((page) => {
      const current = new URL(page.url);
      return current.origin === target.origin && (current.pathname.replace(/\/$/, "") || "/") === targetPath;
    }) || pages.find((page) => pagePath(page) === "/") || pages[0];
  } catch {
    return pages.find((page) => pagePath(page) === "/") || pages[0];
  }
}

function jsonLd(value: unknown) {
  // The profile is built from crawled text. Escape HTML-sensitive characters before
  // returning a block that a customer may paste into a script element.
  return JSON.stringify(value, null, 2).replace(/</g, "\\u003c");
}

function safeFileHost(value: string) {
  try { return new URL(value).hostname.replace(/^www\./, "").replace(/[^a-z0-9.-]/gi, "-") || "site"; }
  catch { return "site"; }
}

/**
 * Creates a human-reviewed public-information draft from the pages actually
 * crawled during a measurement. It contains no competitor observations or
 * company-entered Evidence and is never published automatically.
 */
export function buildAiReadableDraft(input: { result: ScanResult; pages: CrawledPage[]; generatedAt?: string }): AiReadableDraft {
  const pages = input.pages.filter((page) => page.url && page.title !== undefined).slice(0, 12);
  const home = homePage(pages, input.result.targetUrl);
  const targetUrl = input.result.targetUrl;
  const name = oneLine(home?.title?.split(/[|｜–—-]/)[0], input.result.discovery.brandName || safeFileHost(targetUrl));
  const description = oneLine(home?.description || input.result.discovery.summary, "");
  const publicPages = pages.map((page) => ({ url: page.url, title: pageName(page), description: oneLine(page.description) })).filter((page) => page.url);
  const organizationId = `${targetUrl.replace(/\/$/, "")}/#organization`;
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": organizationId,
        name: input.result.discovery.brandName || name,
        ...(input.result.discovery.legalName && input.result.discovery.legalName !== input.result.discovery.brandName ? { legalName: input.result.discovery.legalName } : {}),
        url: targetUrl,
        ...(description ? { description } : {}),
      },
      {
        "@type": "WebSite",
        "@id": `${targetUrl.replace(/\/$/, "")}/#website`,
        name,
        url: targetUrl,
        ...(description ? { description } : {}),
        inLanguage: "ja-JP",
        publisher: { "@id": organizationId },
        hasPart: publicPages.slice(0, 8).map((page) => ({ "@type": "WebPage", url: page.url, name: page.title, ...(page.description ? { description: page.description } : {}) })),
      },
    ],
  };
  const lines = [
    `# ${name}`,
    description ? `\n> ${description}` : "",
    "\n## 公式ページ",
    ...publicPages.slice(0, 8).map((page) => `- [${page.title}](${page.url})${page.description ? ` — ${page.description}` : ""}`),
    "\n## 公開前に確認すること",
    "- 会社名・サービス名・説明が、実際の公開ページと一致しているか確認する。",
    "- 料金、実績、認証、導入期間などの数値は原典と照合する。",
    "- 自社ドメインに掲載する権限と、更新担当者を確認する。",
    "- JSON-LDやこのファイルの内容を、ページ上で見える説明と一致させる。",
    "- robots.txtで、AI検索クローラーを意図せず拒否していないか確認する。",
    "\n## この下書きについて",
    "Rovanが実際に取得できた公開ページをもとにした下書きです。公開前に内容を確認してください。AIの推薦、引用、検索順位、問い合わせ、契約、売上は保証しません。",
  ].filter(Boolean);
  return {
    generatedAt: input.generatedAt || new Date().toISOString(),
    sourceMeasurementId: input.result.scanId,
    sourceUrl: targetUrl,
    suggestedFileName: `ai-public-info-${safeFileHost(targetUrl)}`,
    llmsTxt: `${lines.join("\n")}\n`,
    jsonLd: `${jsonLd(schema)}\n`,
    sourcePages: publicPages,
    publishChecks: [
      "会社名・サービス名・説明を原典と照合する",
      "料金・実績・認証・数値を公開前に確認する",
      "自社ドメインへ掲載する権限と更新担当者を確認する",
      "ページ上の見える説明とJSON-LD・llms.txtを一致させる",
      "robots.txtでAI検索クローラーを意図せず拒否していないか確認する",
    ],
  };
}
