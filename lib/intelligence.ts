import { PROVIDER_ORDER } from "@/lib/provider-meta";
import type { BuyerPrompt, CompanyDiscovery, NarrativeInsight, Observation, PromptCluster, ProviderName, ScanResult } from "@/lib/types";

export type PromptIntelligenceRow = {
  prompt: BuyerPrompt;
  successful: number;
  mentions: number;
  recommendations: number;
  firstChoices: number;
  citations: number;
  recommendationCoverage: number;
  providerOutcomes: Array<{ provider: ProviderName; successful: number; mentioned: number; recommended: number; firstChoice: number; cited: number }>;
};

export type CitationIntelligenceRow = {
  domain: string;
  citations: number;
  promptCount: number;
  providers: ProviderName[];
  kind: "owned" | "competitor" | "third_party";
  urls: Array<{ url: string; title: string; count: number }>;
};

export type ClusterIntelligenceRow = { cluster: PromptCluster; prompts: number; successful: number; recommended: number; coverage: number };

function lower(value: string) { return value.trim().toLowerCase(); }
function pct(a: number, b: number) { return b ? Math.round((a / b) * 100) : 0; }
function mentionsBrand(item: Observation, discovery: CompanyDiscovery) {
  const text = lower(item.rawText);
  return discovery.aliases.some((alias) => alias.trim().length >= 2 && text.includes(lower(alias)));
}

export function withPromptRationale(prompts: BuyerPrompt[], discovery: CompanyDiscovery) {
  const segment = discovery.targetCustomers[0] || "対象顧客";
  const useCase = discovery.useCases[0] || "主要用途";
  const reasons: Record<PromptCluster, string> = {
    category: `${discovery.market}のカテゴリ選定で比較が起きるため`,
    segment: `${segment}という対象条件で候補が変わるため`,
    use_case: `${useCase}という実利用場面で比較が起きるため`,
    feature: "機能要件が購入候補の絞り込みに使われるため",
    alternative: "乗り換え・代替検討は購入意図が強いため",
    comparison: "複数ベンダーを直接比較する購入直前の質問だから",
    value: "価格・ROI・費用対効果が最終選定に使われるため",
    implementation: "導入期間・負担が採用判断を左右するため",
    trust: "セキュリティ・信頼性が候補除外条件になりやすいため",
    support: "導入支援・運用支援が比較材料になるため",
  };
  return prompts.map((prompt) => ({ ...prompt, whyTracked: prompt.whyTracked || reasons[prompt.cluster] }));
}

export function buildPromptIntelligence(result: Pick<ScanResult, "prompts" | "observations" | "discovery">): PromptIntelligenceRow[] {
  return result.prompts.map((prompt) => {
    const rows = result.observations.filter((item) => item.promptId === prompt.id && item.status === "success");
    const providers = PROVIDER_ORDER.map((provider) => {
      const providerRows = rows.filter((item) => item.provider === provider);
      return {
        provider,
        successful: providerRows.length,
        mentioned: providerRows.filter((item) => mentionsBrand(item, result.discovery)).length,
        recommended: providerRows.filter((item) => item.ownRecommended).length,
        firstChoice: providerRows.filter((item) => item.ownPosition === 1).length,
        cited: providerRows.filter((item) => item.citations.some((citation) => lower(citation.domain) === lower(result.discovery.domain))).length,
      };
    });
    const recommendations = rows.filter((item) => item.ownRecommended).length;
    return {
      prompt,
      successful: rows.length,
      mentions: rows.filter((item) => mentionsBrand(item, result.discovery)).length,
      recommendations,
      firstChoices: rows.filter((item) => item.ownPosition === 1).length,
      citations: rows.reduce((sum, item) => sum + item.citations.length, 0),
      recommendationCoverage: pct(recommendations, rows.length),
      providerOutcomes: providers,
    };
  });
}

export function buildCitationIntelligence(result: Pick<ScanResult, "observations" | "discovery">): CitationIntelligenceRow[] {
  const competitorDomains = new Set(result.discovery.competitors.map((item) => lower(item.domain || "")).filter(Boolean));
  const map = new Map<string, { citations: number; prompts: Set<string>; providers: Set<ProviderName>; urls: Map<string, { title: string; count: number }> }>();
  for (const observation of result.observations.filter((item) => item.status === "success")) {
    for (const citation of observation.citations) {
      const domain = lower(citation.domain || (() => { try { return new URL(citation.url).hostname.replace(/^www\./, ""); } catch { return "unknown"; } })());
      const row = map.get(domain) || { citations: 0, prompts: new Set<string>(), providers: new Set<ProviderName>(), urls: new Map<string, { title: string; count: number }>() };
      row.citations += 1;
      row.prompts.add(observation.promptId);
      row.providers.add(observation.provider);
      const page = row.urls.get(citation.url) || { title: citation.title || citation.url, count: 0 };
      page.count += 1;
      row.urls.set(citation.url, page);
      map.set(domain, row);
    }
  }
  return [...map.entries()].map(([domain, row]) => ({
    domain,
    citations: row.citations,
    promptCount: row.prompts.size,
    providers: [...row.providers],
    kind: domain === lower(result.discovery.domain) ? "owned" as const : competitorDomains.has(domain) ? "competitor" as const : "third_party" as const,
    urls: [...row.urls.entries()].map(([url, value]) => ({ url, title: value.title, count: value.count })).sort((a, b) => b.count - a.count).slice(0, 8),
  })).sort((a, b) => b.citations - a.citations);
}

export function buildClusterIntelligence(result: Pick<ScanResult, "prompts" | "observations">): ClusterIntelligenceRow[] {
  const clusters = [...new Set(result.prompts.map((item) => item.cluster))];
  return clusters.map((cluster) => {
    const promptIds = new Set(result.prompts.filter((item) => item.cluster === cluster).map((item) => item.id));
    const rows = result.observations.filter((item) => promptIds.has(item.promptId) && item.status === "success");
    const recommended = rows.filter((item) => item.ownRecommended).length;
    return { cluster, prompts: promptIds.size, successful: rows.length, recommended, coverage: pct(recommended, rows.length) };
  }).sort((a, b) => a.coverage - b.coverage);
}

export function buildNarratives(observations: Observation[], discovery: CompanyDiscovery): NarrativeInsight[] {
  const success = observations.filter((item) => item.status === "success");
  if (!success.length) return [];
  const own = success.filter((item) => item.ownRecommended);
  const omitted = success.filter((item) => !item.ownRecommended);
  const citedOwn = success.filter((item) => item.citations.some((citation) => lower(citation.domain) === lower(discovery.domain)));
  const insights: NarrativeInsight[] = [];
  if (own.length) insights.push({ id: "narrative-shortlist", theme: "推薦文脈", stance: own.length >= omitted.length ? "positive" : "mixed", summary: `${success.length}件の成功回答中${own.length}件で購入候補として扱われています。`, evidenceObservationIds: own.slice(0, 12).map((item) => item.id), confidence: Math.min(.95, .55 + own.length / Math.max(20, success.length * 2)) });
  if (omitted.length) insights.push({ id: "narrative-omission", theme: "候補外文脈", stance: "negative", summary: `${omitted.length}件では購入候補に入りませんでした。競合推薦と引用元を合わせて原因候補を確認します。`, evidenceObservationIds: omitted.slice(0, 12).map((item) => item.id), confidence: Math.min(.92, .55 + omitted.length / Math.max(20, success.length * 2)) });
  insights.push({ id: "narrative-citation", theme: "自社Citation", stance: citedOwn.length ? "positive" : "neutral", summary: citedOwn.length ? `${citedOwn.length}件の回答で自社ドメインがCitationとして使われました。` : "成功回答内で自社ドメインのCitationを確認できませんでした。", evidenceObservationIds: citedOwn.slice(0, 12).map((item) => item.id), confidence: .8 });
  return insights;
}
