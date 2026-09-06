
import type {
  PublicProfile,
  PublicProfileDraft,
  PublicProfileRecord,
  ScanRecord,
  ScanResult,
} from "@/lib/types";
import { env } from "@/lib/env";

const MAX_SUMMARY_LENGTH = 600;
const MAX_LIST_ITEMS = 8;
const MAX_LIST_ITEM_LENGTH = 180;

/**
 * Text that belongs to the private measurement layer rather than an AIX
 * public record. The source fields are discovery summaries, but keeping this
 * guard here prevents accidental publication when a future prompt changes
 * the discovery wording.
 */
const PRIVATE_MARKERS = [
  /rawtext/i,
  /候補外/u,
  /競合/u,
  /プロンプト/u,
  /観測/u,
  /課金/u,
  /メール/u,
  /秘密/u,
  /api.?key/i,
  /stripe/i,
];

function cleanText(value: unknown, maxLength: number) {
  if (typeof value !== "string") return "";
  return value
    .replace(/[\u0000-\u001f\u007f]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, maxLength);
}

function publicText(value: unknown, maxLength: number) {
  const cleaned = cleanText(value, maxLength);
  return cleaned && !PRIVATE_MARKERS.some((marker) => marker.test(cleaned)) ? cleaned : "";
}

function publicUrl(value: unknown) {
  if (typeof value !== "string") return "";
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") return "";
    // Query strings and fragments can contain identifiers or session values.
    // A public company record needs the page, not those request parameters.
    parsed.username = "";
    parsed.password = "";
    parsed.search = "";
    parsed.hash = "";
    parsed.pathname = parsed.pathname.replace(/\/{2,}/g, "/");
    if (parsed.pathname !== "/") parsed.pathname = parsed.pathname.replace(/\/+$/, "");
    return parsed.toString();
  } catch {
    return "";
  }
}

function uniquePublicList(values: unknown[], maxItems = MAX_LIST_ITEMS) {
  const seen = new Set<string>();
  const result: string[] = [];
  for (const value of values) {
    const cleaned = publicText(value, MAX_LIST_ITEM_LENGTH);
    if (!cleaned || seen.has(cleaned)) continue;
    seen.add(cleaned);
    result.push(cleaned);
    if (result.length >= maxItems) break;
  }
  return result;
}

function containsCompetitorName(summary: string, competitorNames: string[]) {
  const normalized = summary.toLocaleLowerCase("ja-JP");
  return competitorNames.some((name) => {
    const cleaned = cleanText(name, MAX_LIST_ITEM_LENGTH);
    return cleaned.length > 1 && normalized.includes(cleaned.toLocaleLowerCase("ja-JP"));
  });
}

function jsonText(value: unknown) {
  // Escape characters that would be interpreted as HTML when a customer
  // copies the JSON-LD into a script element.
  return JSON.stringify(value, null, 2).replace(/</g, "\\u003c");
}

function markdownText(value: string) {
  return value.replace(/[\r\n]+/g, " ").replace(/\[/g, "\\[").replace(/\]/g, "\\]").trim();
}

function sourceLink(url: string, label: string) {
  return `[${markdownText(label)}](${url})`;
}

function buildMarkdown(input: {
  title: string;
  brandName: string;
  targetUrl: string;
  summary: string;
  market: string;
  targetCustomers: string[];
  useCases: string[];
  facts: PublicProfileDraft["facts"];
  sourcePages: PublicProfileDraft["sourcePages"];
}) {
  const lines = [`# ${markdownText(input.title)}`, "", `> ${markdownText(input.brandName)}の公開情報`];
  if (input.summary) lines.push("", "## 概要", "", markdownText(input.summary));
  if (input.market) lines.push("", "## 分野", "", markdownText(input.market));
  if (input.targetCustomers.length) {
    lines.push("", "## 対象", "", ...input.targetCustomers.map((item) => `- ${markdownText(item)}`));
  }
  if (input.useCases.length) {
    lines.push("", "## 用途", "", ...input.useCases.map((item) => `- ${markdownText(item)}`));
  }
  if (input.facts.length) {
    lines.push("", "## 公開されている情報", "", ...input.facts.map((fact) => `- **${markdownText(fact.label)}**: ${markdownText(fact.value)}`));
  }
  lines.push("", "## 公式サイト", "", `- ${sourceLink(input.targetUrl, input.targetUrl)}`);
  if (input.sourcePages.length) {
    lines.push("", "## 出典", "", ...input.sourcePages.map((page) => `- ${sourceLink(page.url, page.title)}${page.description ? ` — ${markdownText(page.description)}` : ""}`));
  }
  return `${lines.join("\n")}\n`;
}

/**
 * Converts an existing ScanResult into a deliberately small public draft.
 * ScanResult has no persisted CrawledPage list, so this layer only uses the
 * public discovery summary and the official target URL already present in the
 * result. Citation URLs from the measured answers may add more official pages;
 * only URLs on the target's own host are retained. It never publishes answer
 * text, prompts, competitor metrics, evidence gaps, actions, warnings, costs,
 * or model fields.
 */
export function buildPublicProfileDraft(input: ScanResult | ScanRecord, generatedAt = new Date().toISOString()): PublicProfileDraft {
  const result = "result" in input ? input.result : input;
  if (!result) throw new Error("診断結果が完成していません。");

  const targetUrl = publicUrl(result.targetUrl);
  if (!targetUrl) throw new Error("公開用の公式URLを確認できませんでした。");

  const discovery = result.discovery;
  const competitorNames = Array.isArray(discovery.competitors) ? discovery.competitors.map((item) => item.name) : [];
  const legalName = publicText(discovery.legalName, 180);
  const discoveredBrand = publicText(discovery.brandName, 180);
  const brandName = discoveredBrand || legalName || new URL(targetUrl).hostname.replace(/^www\./i, "");
  const summaryCandidate = publicText(discovery.summary, MAX_SUMMARY_LENGTH);
  // A discovery summary that repeats a competitor observation is not a
  // company fact. Omit it rather than attempting to rewrite the statement.
  const summary = summaryCandidate && !containsCompetitorName(summaryCandidate, competitorNames) ? summaryCandidate : "";
  const market = publicText(discovery.market, MAX_LIST_ITEM_LENGTH);
  const targetCustomers = uniquePublicList(Array.isArray(discovery.targetCustomers) ? discovery.targetCustomers : []);
  const useCases = uniquePublicList(Array.isArray(discovery.useCases) ? discovery.useCases : []);
  const title = `${brandName} | AIX公開情報`;
  const facts: PublicProfileDraft["facts"] = [];

  const addFact = (label: string, value: string) => {
    if (!value) return;
    facts.push({ label, value, sourceUrl: targetUrl });
  };

  if (legalName && legalName !== brandName) addFact("法人名", legalName);
  addFact("説明", summary);
  addFact("分野", market);
  targetCustomers.forEach((item) => addFact("対象", item));
  useCases.forEach((item) => addFact("用途", item));

  const sourcePages: PublicProfileDraft["sourcePages"] = [{
    url: targetUrl,
    title: `${brandName} 公式サイト`,
    description: summary,
  }];
  const ownHost = new URL(targetUrl).hostname.replace(/^www\./i, "").toLowerCase();
  const seenSourceUrls = new Set([targetUrl]);
  for (const observation of result.observations || []) {
    for (const citation of observation.citations || []) {
      const citationUrl = publicUrl(citation.url);
      if (!citationUrl || seenSourceUrls.has(citationUrl)) continue;
      let citationHost = "";
      try { citationHost = new URL(citationUrl).hostname.replace(/^www\./i, "").toLowerCase(); } catch { continue; }
      if (citationHost !== ownHost && !citationHost.endsWith(`.${ownHost}`)) continue;
      seenSourceUrls.add(citationUrl);
      sourcePages.push({
        url: citationUrl,
        title: publicText(citation.title, 180) || "公式ページ",
        description: "",
      });
      if (sourcePages.length >= 8) break;
    }
    if (sourcePages.length >= 8) break;
  }

  const validThroughDate = new Date(new Date(generatedAt).getTime() + 30 * 86_400_000).toISOString();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brandName,
    ...(legalName && legalName !== brandName ? { legalName } : {}),
    url: targetUrl,
    ...(summary ? { description: summary } : {}),
    ...(market ? { knowsAbout: [market] } : {}),
    ...(useCases.length ? { keywords: useCases } : {}),
    inLanguage: "ja-JP",
    validThrough: validThroughDate,
  };

  const json = JSON.stringify({
    recordVersion: "1",
    publisher: "AIX",
    subject: {
      name: brandName,
      officialUrl: targetUrl,
    },
    ...(summary ? { summary } : {}),
    ...(market ? { market } : {}),
    ...(targetCustomers.length ? { targetCustomers } : {}),
    ...(useCases.length ? { useCases } : {}),
    facts,
    sourcePages,
    updatedAt: generatedAt,
  }, null, 2);

  return {
    title,
    brandName,
    targetUrl,
    summary,
    market,
    targetCustomers,
    useCases,
    facts,
    sourcePages,
    structuredData: `${jsonText(schema)}\n`,
    markdown: buildMarkdown({ title, brandName, targetUrl, summary, market, targetCustomers, useCases, facts, sourcePages }),
    json: `${json}\n`,
  };
}

/** Removes bearer credentials and internal source identifiers from responses. */
export function toPublicProfile(record: PublicProfileRecord): PublicProfile {
  return {
    id: record.id,
    slug: record.slug,
    status: record.status,
    title: record.title,
    brandName: record.brandName,
    targetUrl: record.targetUrl,
    summary: record.summary,
    market: record.market,
    targetCustomers: [...record.targetCustomers],
    useCases: [...record.useCases],
    facts: record.facts.map((fact) => ({ ...fact })),
    sourcePages: record.sourcePages.map((page) => ({ ...page })),
    structuredData: record.structuredData,
    markdown: record.markdown,
    json: record.json,
    createdAt: record.createdAt,
    updatedAt: record.updatedAt,
    expiresAt: record.expiresAt,
    ...(record.publishedAt ? { publishedAt: record.publishedAt } : {}),
  };
}

export type DirectProfileInput = {
  brandName: string;
  market?: string;
  summary?: string;
  targetCustomers?: string[];
  useCases?: string[];
  location?: string;
  phone?: string;
  hours?: string;
  pricingInfo?: string;
};

/**
 * 自社サイトを持たない企業（町工場・農家・個人商店等）向けに、
 * 入力された会社名や強みから直接「公式Web拠点」のドラフトを構築する。
 */
export function buildDirectPublicProfileDraft(input: DirectProfileInput, generatedAt = new Date().toISOString()): PublicProfileDraft {
  const brandName = publicText(input.brandName, 180);
  if (!brandName) throw new Error("会社名または屋号を入力してください。");

  // 自社サイトがない場合、このAIX参照インデックスそのものがWeb参照拠点URLとなる
  const slug = brandName.toLowerCase().replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf-]+/gi, "-").replace(/^-+|-+$/g, "") || "company";
  const targetUrl = `${env.siteUrl}/ai/company/${encodeURIComponent(slug)}`;
  const title = `${brandName} 公開情報参照インデックス`;
  const market = publicText(input.market || "専門技術・サービス", MAX_LIST_ITEM_LENGTH);
  const summary = publicText(input.summary || `${brandName}の公開情報参照インデックス。主要生成AI（ChatGPT/Gemini/Claude等）が客観的な事実に基づいて参照するための構造化データです。`, MAX_SUMMARY_LENGTH);
  const targetCustomers = uniquePublicList(input.targetCustomers?.length ? input.targetCustomers : []);
  const useCases = uniquePublicList(input.useCases?.length ? input.useCases : []);

  const facts: PublicProfileDraft["facts"] = [
    { label: "正式名称・屋号", value: brandName, sourceUrl: targetUrl },
    { label: "専門分野・業種", value: market, sourceUrl: targetUrl },
  ];

  if (input.location?.trim()) {
    facts.push({ label: "所在地・対応エリア", value: publicText(input.location, MAX_LIST_ITEM_LENGTH), sourceUrl: targetUrl });
  }
  if (input.phone?.trim()) {
    facts.push({ label: "電話番号・窓口", value: publicText(input.phone, MAX_LIST_ITEM_LENGTH), sourceUrl: targetUrl });
  }
  if (input.hours?.trim()) {
    facts.push({ label: "営業時間・受付体制", value: publicText(input.hours, MAX_LIST_ITEM_LENGTH), sourceUrl: targetUrl });
  }
  if (input.pricingInfo?.trim()) {
    facts.push({ label: "料金規約・費用目安", value: publicText(input.pricingInfo, MAX_LIST_ITEM_LENGTH), sourceUrl: targetUrl });
  }

  const sourcePages: PublicProfileDraft["sourcePages"] = [
    { url: targetUrl, title: `${brandName} AIX登録公式ナレッジ台帳`, description: "AI巡回・推論用公式データ台帳" },
  ];

  const validThroughDate = new Date(new Date(generatedAt).getTime() + 30 * 86_400_000).toISOString();

  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: brandName,
    url: targetUrl,
    description: summary,
    knowsAbout: [market],
    keywords: useCases,
    inLanguage: "ja-JP",
    validThrough: validThroughDate,
  };

  const json = JSON.stringify({
    recordVersion: "1",
    publisher: "AIX",
    subject: {
      name: brandName,
      officialUrl: targetUrl,
    },
    summary,
    market,
    targetCustomers,
    useCases,
    facts,
    sourcePages,
    updatedAt: generatedAt,
  }, null, 2);

  return {
    title,
    brandName,
    targetUrl,
    summary,
    market,
    targetCustomers,
    useCases,
    facts,
    sourcePages,
    structuredData: `${jsonText(schema)}\n`,
    markdown: buildMarkdown({ title, brandName, targetUrl, summary, market, targetCustomers, useCases, facts, sourcePages }),
    json: `${json}\n`,
  };
}
