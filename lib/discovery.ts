import "server-only";
import { createHash } from "node:crypto";
import { env } from "@/lib/env";
import type { ActionCard, BuyerPrompt, CompanyDiscovery, CrawledPage, EvidenceGap, LostPrompt, PromptCluster } from "@/lib/types";

function compactPages(pages: CrawledPage[]) {
  return pages.map((page) => ({ url: page.url, title: page.title, description: page.description, headings: page.headings.slice(0, 20), text: page.text.slice(0, 10_000) }));
}

function parseJson<T>(text: string): T {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const start = Math.min(...[cleaned.indexOf("{"), cleaned.indexOf("[")].filter((value) => value >= 0));
  const source = Number.isFinite(start) ? cleaned.slice(start) : cleaned;
  try { return JSON.parse(source) as T; }
  catch {
    const objectEnd = source.lastIndexOf("}");
    const arrayEnd = source.lastIndexOf("]");
    return JSON.parse(source.slice(0, Math.max(objectEnd, arrayEnd) + 1)) as T;
  }
}

async function askJson<T>(instruction: string) {
  if (!env.openAiKey) throw new Error("OPENAI_API_KEYが未設定です。実URL診断には会社・市場の解析モデルが必要です。");
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { authorization: `Bearer ${env.openAiKey}`, "content-type": "application/json" },
    body: JSON.stringify({ model: env.openAiDiscoveryModel, input: instruction }),
  });
  const data = await response.json() as any;
  if (!response.ok) throw new Error(data.error?.message || `OpenAI discovery ${response.status}`);
  const text = data.output_text || (data.output || []).flatMap((item: any) => item.content || []).map((item: any) => item.text || "").join("\n");
  if (!text) throw new Error("解析モデルが空の結果を返しました。");
  return parseJson<T>(text);
}

export async function discoverCompany(url: string, pages: CrawledPage[]): Promise<CompanyDiscovery> {
  const raw = await askJson<any>(`あなたは日本のB2B市場調査責任者です。次の公開Web情報から、運営法人、主要ブランド、主力サービス、市場、買い手、用途、実際の代替候補を特定してください。広告文を信じ込まず、同じ顧客が比較する代替だけを競合にしてください。JSONだけを返してください。\n\nJSON形式:\n{"legalName":"","brandName":"","summary":"","market":"","targetCustomers":[""],"useCases":[""],"aliases":[""],"competitors":[{"name":"","domain":"","reason":"","confidence":0.0}],"confidence":0.0}\n\n対象URL: ${url}\n公開ページ: ${JSON.stringify(compactPages(pages))}`);
  const domain = new URL(url).hostname.replace(/^www\./, "");
  const legalName = String(raw.legalName || raw.brandName || domain).slice(0, 160);
  const brandName = String(raw.brandName || legalName).slice(0, 160);
  const competitors = Array.isArray(raw.competitors) ? raw.competitors.slice(0, 12).map((item: any) => ({
    name: String(item.name || "").trim().slice(0, 160),
    domain: item.domain ? String(item.domain).replace(/^https?:\/\//, "").replace(/\/$/, "") : undefined,
    reason: String(item.reason || "同じ購買場面で比較される代替候補").slice(0, 500),
    confidence: Math.max(0, Math.min(1, Number(item.confidence || .6))),
  })).filter((item: any) => item.name) : [];
  return {
    legalName,
    brandName,
    domain,
    summary: String(raw.summary || "").slice(0, 1200),
    market: String(raw.market || "法人向けサービス").slice(0, 160),
    targetCustomers: Array.isArray(raw.targetCustomers) ? raw.targetCustomers.map(String).slice(0, 12) : [],
    useCases: Array.isArray(raw.useCases) ? raw.useCases.map(String).slice(0, 12) : [],
    aliases: [...new Set([brandName, legalName, domain, ...(Array.isArray(raw.aliases) ? raw.aliases.map(String) : [])])].slice(0, 20),
    competitors,
    confidence: Math.max(0, Math.min(1, Number(raw.confidence || .5))),
  };
}

const clusters: PromptCluster[] = ["category", "segment", "use_case", "comparison", "alternative", "value", "implementation", "trust", "support", "feature"];

export async function generateBuyerPrompts(discovery: CompanyDiscovery, count = 15): Promise<BuyerPrompt[]> {
  const raw = await askJson<any[]>(`あなたはB2B購買リサーチャーです。次の市場で、営業担当へ連絡する前の日本の買い手がAIへ実際に聞きそうな購入意図の強い質問を${count}件作ってください。ブランド名を直接検索する質問ではなく、カテゴリ選定、用途、企業規模、比較、代替、価格価値、導入、信頼、安全、サポートをMECEに含めます。意味が重複する言い換えは禁止です。JSON配列だけ返してください。\n形式:[{"text":"","cluster":"category|segment|use_case|comparison|alternative|value|implementation|trust|support|feature","importance":1-5}]\n市場情報:${JSON.stringify(discovery)}`);
  const result: BuyerPrompt[] = [];
  for (const [index, item] of (Array.isArray(raw) ? raw : []).entries()) {
    const text = String((item as any).text || "").trim();
    if (!text || result.some((existing) => existing.text === text)) continue;
    const cluster = clusters.includes((item as any).cluster) ? (item as any).cluster as PromptCluster : "category";
    result.push({ id: createHash("sha1").update(`${index}:${text}`).digest("hex").slice(0, 12), text: text.slice(0, 500), cluster, importance: Math.max(1, Math.min(5, Number((item as any).importance || 3))), version: 1 });
  }
  if (result.length < Math.min(8, count)) throw new Error("Buyer Promptを十分に生成できませんでした。");
  return result.slice(0, count);
}

export async function analyzeEvidence(input: { discovery: CompanyDiscovery; pages: CrawledPage[]; lostPrompts: LostPrompt[] }): Promise<{ gaps: EvidenceGap[]; actions: ActionCard[] }> {
  const raw = await askJson<any>(`あなたはLLMO/AEOの監査責任者です。次の自社公開ページ、競合を先に推薦したAI回答、引用元を比較し、自社の公開Webから確認できないEvidenceと、次に取るべきActionを特定してください。確認できないことを「存在しない」と断定しないでください。因果効果や順位上昇を捏造しないでください。JSONだけ返してください。\n形式:{"gaps":[{"id":"slug","label":"","whyItMatters":"","relatedPromptIds":[""],"competitorEvidence":"","confidence":0.0,"status":"missing|partial"}],"actions":[{"id":"slug","title":"","rationale":"","type":"owned|third_party|technical|positioning|entity","relatedPromptIds":[""],"priority":"critical|high|medium","confidence":0.0,"target":""}]}\n会社:${JSON.stringify(input.discovery)}\n自社ページ:${JSON.stringify(compactPages(input.pages))}\n候補外質問:${JSON.stringify(input.lostPrompts.slice(0, 10))}`);
  const gaps: EvidenceGap[] = (Array.isArray(raw.gaps) ? raw.gaps : []).slice(0, 10).map((item: any, index: number) => {
    const ids = Array.isArray(item.relatedPromptIds) ? item.relatedPromptIds.map(String) : [];
    return { id: String(item.id || `gap-${index}`), label: String(item.label || "未確認のEvidence"), whyItMatters: String(item.whyItMatters || "比較判断に使える公開情報を確認できません。"), relatedPromptIds: ids, relatedPromptCount: ids.length, competitorEvidence: String(item.competitorEvidence || "競合側の公開根拠を確認"), confidence: Math.max(0, Math.min(1, Number(item.confidence || .6))), status: item.status === "partial" ? "partial" : "missing" };
  });
  const actions: ActionCard[] = (Array.isArray(raw.actions) ? raw.actions : []).slice(0, 10).map((item: any, index: number) => {
    const ids = Array.isArray(item.relatedPromptIds) ? item.relatedPromptIds.map(String) : [];
    const type = ["owned", "third_party", "technical", "positioning", "entity"].includes(item.type) ? item.type : "owned";
    const priority = ["critical", "high", "medium"].includes(item.priority) ? item.priority : "medium";
    return { id: String(item.id || `action-${index}`), title: String(item.title || "Evidenceを明確化する"), rationale: String(item.rationale || "複数の購買質問に共通する不足を埋めます。"), type, relatedPromptIds: ids, relatedPromptCount: ids.length, priority, confidence: Math.max(0, Math.min(1, Number(item.confidence || .6))), target: String(item.target || "自社サイト") };
  });
  return { gaps, actions };
}
