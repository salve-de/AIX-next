import "server-only";
import { env } from "@/lib/env";
import { shortHash } from "@/lib/ids";
import type { ActionCard, BuyerPrompt, BuyerPromptIntent, BuyerPromptStage, CompanyDiscovery, CrawledPage, EvidenceGap, LostPrompt, PromptCluster } from "@/lib/types";

function compactPages(pages: CrawledPage[]) {
  return pages.slice(0, 24).map((page) => ({ url: page.url, title: page.title, description: page.description, headings: page.headings, text: page.text.slice(0, 9_000) }));
}

function homePage(url: string, pages: CrawledPage[]) {
  try {
    const target = new URL(url);
    const targetPath = target.pathname.replace(/\/$/, "") || "/";
    return pages.find((page) => {
      const current = new URL(page.url);
      return current.origin === target.origin && (current.pathname.replace(/\/$/, "") || "/") === targetPath;
    }) || pages.find((page) => {
      try { return new URL(page.url).pathname.replace(/\/$/, "") === ""; } catch { return false; }
    }) || pages[0];
  } catch {
    return pages[0];
  }
}

function responseText(data: any) {
  if (typeof data.output_text === "string") return data.output_text;
  return (Array.isArray(data.output) ? data.output : []).flatMap((item: any) => item.content || []).map((part: any) => part.text || "").filter(Boolean).join("\n");
}

function parseJson<T>(text: string): T {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const object = cleaned.indexOf("{");
  const array = cleaned.indexOf("[");
  const starts = [object, array].filter((value) => value >= 0);
  const source = starts.length ? cleaned.slice(Math.min(...starts)) : cleaned;
  try { return JSON.parse(source) as T; }
  catch {
    const end = Math.max(source.lastIndexOf("}"), source.lastIndexOf("]"));
    if (end < 0) throw new Error("解析モデルがJSONを返しませんでした。");
    return JSON.parse(source.slice(0, end + 1)) as T;
  }
}

async function askJson<T>(prompt: string, webSearch = false) {
  if (!env.openAiKey) throw new Error("OPENAI_API_KEYが未設定です。");
  const response = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { authorization: `Bearer ${env.openAiKey}`, "content-type": "application/json" },
    body: JSON.stringify({ model: env.openAiDiscoveryModel, input: prompt, ...(webSearch ? { tools: [{ type: "web_search" }], tool_choice: "required" } : {}) }),
  });
  const data = await response.json() as any;
  if (!response.ok) throw new Error(data.error?.message || `OpenAI discovery ${response.status}`);
  return parseJson<T>(responseText(data));
}

function heuristicDiscovery(url: string, pages: CrawledPage[]): CompanyDiscovery {
  const domain = new URL(url).hostname.replace(/^www\./, "");
  const home = homePage(url, pages);
  const brandName = (home?.title || domain).split(/[|｜–—-]/)[0].trim().slice(0, 120) || domain;
  const summary = home?.description || home?.text.slice(0, 500) || "公開サイトから会社概要を抽出";
  const heading = pages.flatMap((page) => page.headings).find((item) => item.length >= 4 && item.length <= 80);
  const market = heading || "法人向けサービス";
  return { legalName: brandName, brandName, domain, summary, market, targetCustomers: ["日本の法人"], useCases: [], aliases: [brandName, domain], competitors: [], confidence: 0.35 };
}

export async function discoverCompany(url: string, pages: CrawledPage[]) {
  const domain = new URL(url).hostname.replace(/^www\./, "");
  if (!env.openAiKey) return heuristicDiscovery(url, pages);
  const raw = await askJson<any>(`あなたは日本のB2B市場調査責任者です。入力された会社サイトと公開Webを調べ、同じ買い手が同じ予算で比較する市場を特定してください。単なる同業や補完製品を競合にしないでください。JSONだけを返してください。\n\n形式:{"legalName":"","brandName":"","summary":"","market":"","targetCustomers":[""],"useCases":[""],"aliases":[""],"competitors":[{"name":"","domain":"","reason":"","confidence":0.0}],"confidence":0.0}\n\n対象URL:${url}\nサイト情報:${JSON.stringify(compactPages(pages))}`, true);
  const brandName = String(raw.brandName || raw.legalName || domain).trim().slice(0, 160);
  const legalName = String(raw.legalName || brandName).trim().slice(0, 160);
  const competitors = (Array.isArray(raw.competitors) ? raw.competitors : []).slice(0, 12).map((item: any) => ({
    name: String(item.name || "").trim().slice(0, 160),
    domain: item.domain ? String(item.domain).replace(/^https?:\/\//, "").replace(/\/$/, "") : undefined,
    reason: String(item.reason || "同じ購買場面で比較される代替候補").slice(0, 500),
    confidence: Math.max(0, Math.min(1, Number(item.confidence || .6))),
  })).filter((item: any) => item.name && item.name.toLowerCase() !== brandName.toLowerCase());
  return {
    legalName,
    brandName,
    domain,
    summary: String(raw.summary || homePage(url, pages)?.description || "").slice(0, 1_200),
    market: String(raw.market || "法人向けサービス").slice(0, 160),
    targetCustomers: (Array.isArray(raw.targetCustomers) ? raw.targetCustomers : []).map(String).slice(0, 12),
    useCases: (Array.isArray(raw.useCases) ? raw.useCases : []).map(String).slice(0, 12),
    aliases: [...new Set([brandName, legalName, domain, ...(Array.isArray(raw.aliases) ? raw.aliases.map(String) : [])])].slice(0, 20),
    competitors,
    confidence: Math.max(0, Math.min(1, Number(raw.confidence || .5))),
  } satisfies CompanyDiscovery;
}

const clusters: PromptCluster[] = ["category", "segment", "use_case", "feature", "alternative", "comparison", "value", "implementation", "trust", "support"];

function promptIntent(cluster: PromptCluster): BuyerPromptIntent {
  if (cluster === "comparison" || cluster === "value") return "compare";
  if (cluster === "alternative") return "switch";
  if (cluster === "implementation" || cluster === "support") return "implement";
  if (cluster === "trust" || cluster === "feature") return "evaluate";
  return "discover";
}

function promptStage(cluster: PromptCluster): BuyerPromptStage {
  if (cluster === "category" || cluster === "segment" || cluster === "use_case") return "認知";
  if (cluster === "comparison" || cluster === "alternative" || cluster === "value") return "比較";
  if (cluster === "implementation" || cluster === "support") return "導入";
  return "検討";
}

function promptUrgency(cluster: PromptCluster, importance: number) {
  const base = cluster === "comparison" || cluster === "value" || cluster === "implementation" ? 5 : cluster === "alternative" || cluster === "trust" ? 4 : 3;
  return Math.max(1, Math.min(5, Math.max(base, importance)));
}

function enrichPrompt(input: { id: string; text: string; cluster: PromptCluster; importance: number; panel: BuyerPrompt["panel"]; version?: number }): BuyerPrompt {
  return {
    id: input.id,
    text: input.text,
    cluster: input.cluster,
    importance: input.importance,
    intent: promptIntent(input.cluster),
    stage: promptStage(input.cluster),
    urgency: promptUrgency(input.cluster, input.importance),
    panel: input.panel,
    version: input.version || 1,
  };
}

function fallbackPrompts(discovery: CompanyDiscovery, count: number, panel: BuyerPrompt["panel"]) {
  const market = discovery.market;
  const segment = discovery.targetCustomers[0] || "中小企業";
  const useCase = discovery.useCases[0] || "業務改善";
  const templates: Array<[string, PromptCluster, number]> = [
    [`日本でおすすめの${market}は？`, "category", 5],
    [`${segment}に合う${market}は？`, "segment", 5],
    [`${useCase}に強い${market}は？`, "use_case", 5],
    [`導入しやすい${market}は？`, "implementation", 4],
    [`費用対効果が高い${market}を比較して`, "value", 5],
    [`信頼できる${market}の選び方と候補は？`, "trust", 4],
    [`サポートが充実した${market}は？`, "support", 4],
    [`代表的な${market}を機能で比較して`, "feature", 4],
    [`既存サービスから乗り換えやすい${market}は？`, "alternative", 4],
    [`${market}の主要ベンダーを比較して`, "comparison", 5],
  ];
  return Array.from({ length: count }, (_, index) => {
    const template = templates[index % templates.length];
    const round = Math.floor(index / templates.length) + 1;
    const text = round === 1 ? template[0] : template[0].replace("は？", `を${round}つ挙げると？`);
    return enrichPrompt({ id: shortHash(`${panel}:${index}:${text}`), text, cluster: template[1], importance: template[2], panel });
  });
}

export async function generateBuyerPrompts(discovery: CompanyDiscovery, count: number, panel: BuyerPrompt["panel"]) {
  if (!env.openAiKey) return fallbackPrompts(discovery, count, panel);
  const raw = await askJson<any[]>(`あなたは日本のB2B購買リサーチャーです。営業へ連絡する前の買い手がAIへ聞く、購入意図の強い質問を${count}件作ってください。ブランド名を直接含めず、カテゴリ選定、企業規模、用途、機能、代替、直接比較、価格価値、導入、信頼・安全、サポートを重複なく含めます。JSON配列だけ返してください。\n形式:[{"text":"","cluster":"category|segment|use_case|feature|alternative|comparison|value|implementation|trust|support","importance":1-5}]\n市場:${JSON.stringify(discovery)}`);
  const prompts: BuyerPrompt[] = [];
  for (const [index, item] of (Array.isArray(raw) ? raw : []).entries()) {
    const text = String(item.text || "").trim().slice(0, 500);
    if (!text || prompts.some((prompt) => prompt.text === text)) continue;
    const cluster = clusters.includes(item.cluster) ? item.cluster as PromptCluster : "category";
    prompts.push(enrichPrompt({ id: shortHash(`${panel}:${index}:${text}`), text, cluster, importance: Math.max(1, Math.min(5, Number(item.importance || 3))), panel }));
  }
  if (prompts.length < Math.min(8, count)) return fallbackPrompts(discovery, count, panel);
  return prompts.slice(0, count);
}

function textCorpus(pages: CrawledPage[]) {
  return pages.map((page) => `${page.title} ${page.description} ${page.headings.join(" ")} ${page.text}`).join(" ").toLowerCase();
}

function actionImpactScore(action: Pick<ActionCard, "relatedPromptCount" | "confidence" | "priority">) {
  const priorityWeight = action.priority === "critical" ? 1.25 : action.priority === "high" ? 1 : .8;
  return Math.round(action.relatedPromptCount * Math.max(0, Math.min(1, action.confidence)) * priorityWeight * 100) / 100;
}

function fallbackEvidence(discovery: CompanyDiscovery, pages: CrawledPage[], lostPrompts: LostPrompt[]): { gaps: EvidenceGap[]; actions: ActionCard[] } {
  const corpus = textCorpus(pages);
  const fields: Array<[string, string, RegExp]> = [
    ["customer-proof", "導入企業・顧客実績", /導入.{0,8}(社|企業|件)|利用.{0,8}(社|企業|件)/],
    ["implementation", "標準導入期間", /(導入|開始).{0,12}(日|週間|か月|ヶ月)/],
    ["roi", "導入効果・削減工数", /(削減|改善|短縮|向上).{0,12}(時間|%|パーセント|工数)/],
    ["pricing", "料金・総コスト", /(料金|価格|月額|初期費用|見積)/],
    ["security", "セキュリティ・認証", /(iso ?27001|isms|soc ?2|セキュリティ|認証)/],
  ];
  const related = lostPrompts.map((item) => item.promptId);
  const gaps = fields.filter(([, , pattern]) => !pattern.test(corpus)).slice(0, 3).map(([id, label], index) => ({ id, label, whyItMatters: "この情報が公開ページから見つからず、比べる材料が足りません。", relatedPromptIds: related.slice(0, Math.max(1, related.length - index)), relatedPromptCount: Math.max(1, related.length - index), confidence: .55, status: "missing" as const }));
  const actions = gaps.map((gap, index) => {
    const priority = index === 0 ? "critical" as const : "high" as const;
    return {
      id: `action-${gap.id}`,
      title: `${gap.label}を、比べられる形で載せる`,
      rationale: gap.whyItMatters,
      type: "owned" as const,
      relatedPromptIds: gap.relatedPromptIds,
      relatedPromptCount: gap.relatedPromptCount,
      priority,
      confidence: gap.confidence,
      target: "自社サイト",
      impactScore: actionImpactScore({ relatedPromptCount: gap.relatedPromptCount, confidence: gap.confidence, priority }),
      effort: "medium" as const,
      audience: discovery.targetCustomers.slice(0, 2).join("・") || "公開ページから確認できる対象顧客",
      stage: "比較" as const,
      customerConcern: gap.label,
      placement: "導入事例・サービス概要・FAQ",
      cta: "導入条件を確認する",
      successMetric: "同じ比較質問で自社が候補に入ったか",
      evidenceType: "observed" as const,
    };
  });
  return { gaps, actions };
}

export async function analyzeEvidence(input: { discovery: CompanyDiscovery; pages: CrawledPage[]; lostPrompts: LostPrompt[] }) {
  if (!env.openAiKey) return fallbackEvidence(input.discovery, input.pages, input.lostPrompts);
  const raw = await askJson<any>(`あなたはB2Bサイト改善の責任者です。自社公開ページと、競合が先に推薦されたAI回答・引用元を比べ、公開Webから確認できない情報と次に直す内容を出してください。「存在しない」と断定せず、「確認できない」と表現してください。順位上昇や因果効果を捏造しないでください。画面に出すlabel、whyItMatters、title、rationale、customerConcern、ctaは、専門用語や英語の内部用語を使わず、普通の日本語で短く書いてください。actionのaudience、stage、placement、successMetricは今回の比較質問から導ける仮説として書き、売上や順位の保証にしないでください。JSONだけ返してください。\n形式:{"gaps":[{"id":"","label":"","whyItMatters":"","relatedPromptIds":[""],"competitorEvidence":"","confidence":0.0,"status":"missing|partial"}],"actions":[{"id":"","title":"","rationale":"","type":"owned|third_party|technical|positioning|entity","relatedPromptIds":[""],"priority":"critical|high|medium","confidence":0.0,"target":"","audience":"","stage":"認知|比較|検討|導入","customerConcern":"","placement":"","cta":"","successMetric":""}]}\n会社:${JSON.stringify(input.discovery)}\n自社ページ:${JSON.stringify(compactPages(input.pages))}\n候補外質問:${JSON.stringify(input.lostPrompts.slice(0, 10))}`);
  const gaps: EvidenceGap[] = (Array.isArray(raw.gaps) ? raw.gaps : []).slice(0, 10).map((item: any, index: number) => {
    const ids = Array.isArray(item.relatedPromptIds) ? item.relatedPromptIds.map(String) : [];
    return { id: String(item.id || `gap-${index}`), label: String(item.label || "確認できる情報の差"), whyItMatters: String(item.whyItMatters || "比較に必要な情報を公開ページから確認できません。"), relatedPromptIds: ids, relatedPromptCount: ids.length, competitorEvidence: item.competitorEvidence ? String(item.competitorEvidence) : undefined, confidence: Math.max(0, Math.min(1, Number(item.confidence || .6))), status: item.status === "partial" ? "partial" : "missing" };
  });
  const actions: ActionCard[] = (Array.isArray(raw.actions) ? raw.actions : []).slice(0, 10).map((item: any, index: number) => {
    const ids = Array.isArray(item.relatedPromptIds) ? item.relatedPromptIds.map(String) : [];
    const type = ["owned", "third_party", "technical", "positioning", "entity"].includes(item.type) ? item.type : "owned";
    const priority = ["critical", "high", "medium"].includes(item.priority) ? item.priority : "medium";
    const confidence = Math.max(0, Math.min(1, Number(item.confidence || .6)));
    const stage = ["認知", "比較", "検討", "導入"].includes(item.stage) ? item.stage as ActionCard["stage"] : "比較";
    return {
      id: String(item.id || `action-${index}`),
      title: String(item.title || "足りない情報を、比べられる形で載せる"),
      rationale: String(item.rationale || "複数の質問で比べる材料が増えます。"),
      type,
      relatedPromptIds: ids,
      relatedPromptCount: ids.length,
      priority,
      confidence,
      target: String(item.target || "自社サイト"),
      impactScore: actionImpactScore({ relatedPromptCount: ids.length, confidence, priority }),
      effort: type === "technical" ? "high" as const : "medium" as const,
      audience: String(item.audience || input.discovery.targetCustomers.slice(0, 2).join("・") || "公開ページから確認できる対象顧客"),
      stage,
      customerConcern: String(item.customerConcern || "選ぶ前に確認したい情報"),
      placement: String(item.placement || item.target || "自社サイト"),
      cta: String(item.cta || "導入条件を確認する"),
      successMetric: String(item.successMetric || "同じ比較質問で自社が候補に入ったか"),
      evidenceType: item.evidenceType === "observed" ? "observed" : "hypothesis",
    };
  }).sort((a: ActionCard, b: ActionCard) => (b.impactScore || 0) - (a.impactScore || 0));
  return gaps.length || actions.length ? { gaps, actions } : fallbackEvidence(input.discovery, input.pages, input.lostPrompts);
}
