import type { BuyerPrompt, CrawledPage, LostPrompt, Observation, PageIntelligence, PageRole, PromptCluster } from "@/lib/types";

function normalizeUrl(value: string) {
  try { const url = new URL(value); url.hash = ""; return url.toString().replace(/\/$/, ""); }
  catch { return value.replace(/\/$/, ""); }
}

function roleFor(page: CrawledPage): PageRole {
  let path = "";
  try { path = new URL(page.url).pathname.toLowerCase(); } catch { path = page.url.toLowerCase(); }
  const haystack = `${path} ${page.title} ${page.headings.join(" ")}`.toLowerCase();
  if (path === "/" || path === "") return "home";
  if (/pricing|price|料金|価格|費用/.test(haystack)) return "pricing";
  if (/case|customer|導入事例|導入実績|success|実績/.test(haystack)) return "proof";
  if (/security|trust|セキュリティ|認証|安全|privacy/.test(haystack)) return "security";
  if (/support|help|faq|サポート|よくある/.test(haystack)) return "support";
  if (/docs|documentation|guide|manual|developer|api/.test(haystack)) return "docs";
  if (/product|service|feature|機能|サービス|製品|solution/.test(haystack)) return "product";
  return "other";
}

const roleClusters: Record<PageRole, PromptCluster[]> = {
  home: ["category", "comparison"],
  product: ["category", "feature", "use_case", "comparison", "alternative"],
  pricing: ["value", "comparison", "alternative"],
  proof: ["segment", "use_case", "value", "trust", "comparison"],
  security: ["trust", "feature", "comparison"],
  support: ["support", "implementation", "comparison"],
  docs: ["feature", "implementation", "support"],
  other: ["category"],
};

function rationale(role: PageRole, lostCount: number, citationEvents: number) {
  const roleLabel: Record<PageRole, string> = { home: "ホーム", product: "製品・機能", pricing: "料金", proof: "導入事例・実績", security: "Security・Trust", support: "Support・FAQ", docs: "Docs", other: "その他" };
  if (citationEvents && lostCount) return `${roleLabel[role]}ページはAI回答で引用されていますが、同系統の${lostCount}件の候補外Promptもあります。引用の有無だけで勝敗を説明せず、内容と競合Evidenceを確認します。`;
  if (citationEvents) return `${roleLabel[role]}ページは今回の成功ObservationでCitationとして使われています。どのPrompt・surfaceで使われたかを追跡します。`;
  if (lostCount) return `${roleLabel[role]}ページは${lostCount}件の候補外Promptと意図上関連しますが、今回の成功ObservationではCitationを確認できませんでした。編集が結果を改善するとは断定しません。`;
  return `${roleLabel[role]}ページを公開ページ在庫として監視します。Citation未確認は品質不良を意味しません。`;
}

export function buildPageIntelligence(input: { pages: CrawledPage[]; prompts: BuyerPrompt[]; observations: Observation[]; lostPrompts: LostPrompt[] }): PageIntelligence[] {
  const lost = new Set(input.lostPrompts.map((item) => item.promptId));
  const pageMap = new Map(input.pages.map((page) => [normalizeUrl(page.url), page]));

  const citationMap = new Map<string, { events: number; promptIds: Set<string>; providers: Set<Observation["provider"]>; recommendationEvents: number }>();
  for (const observation of input.observations.filter((item) => item.status === "success")) {
    for (const citation of observation.citations) {
      const key = normalizeUrl(citation.url);
      if (!pageMap.has(key)) continue;
      const row = citationMap.get(key) || { events: 0, promptIds: new Set<string>(), providers: new Set<Observation["provider"]>(), recommendationEvents: 0 };
      row.events += 1;
      row.promptIds.add(observation.promptId);
      row.providers.add(observation.provider);
      if (observation.ownRecommended) row.recommendationEvents += 1;
      citationMap.set(key, row);
    }
  }

  return input.pages.map((page) => {
    const url = normalizeUrl(page.url);
    const role = roleFor(page);
    const relevantClusters = new Set(roleClusters[role]);
    const relatedPromptIds = input.prompts.filter((prompt) => relevantClusters.has(prompt.cluster)).map((prompt) => prompt.id);
    const relatedLostPromptCount = relatedPromptIds.filter((promptId) => lost.has(promptId)).length;
    const citation = citationMap.get(url);
    const citationEvents = citation?.events || 0;
    const opportunity: PageIntelligence["opportunity"] = relatedLostPromptCount >= 3 && citationEvents === 0 ? "high" : relatedLostPromptCount > 0 || citationEvents > 0 ? "medium" : "low";
    return {
      url,
      title: page.title || (() => { try { return new URL(page.url).pathname || "/"; } catch { return page.url; } })(),
      role,
      hasDescription: Boolean(page.description.trim()),
      bodyChars: page.text.length,
      citationEvents,
      citedPromptCount: citation?.promptIds.size || 0,
      citedProviders: citation ? [...citation.providers] : [],
      recommendationEventsWhenCited: citation?.recommendationEvents || 0,
      relatedPromptIds,
      relatedLostPromptCount,
      status: citationEvents ? "cited" : "uncited",
      opportunity,
      rationale: rationale(role, relatedLostPromptCount, citationEvents),
    } satisfies PageIntelligence;
  }).sort((a, b) => {
    const rank = { high: 0, medium: 1, low: 2 } as const;
    return rank[a.opportunity] - rank[b.opportunity] || b.relatedLostPromptCount - a.relatedLostPromptCount || b.citationEvents - a.citationEvents;
  });
}
