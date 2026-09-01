import type { CompanyDiscovery, LostPrompt, MetricSummary, Observation, BuyerPrompt } from "@/lib/types";

function ownedDomainMatch(url: string, ownedDomain: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "");
    return host === ownedDomain || host.endsWith(`.${ownedDomain}`);
  } catch { return false; }
}

function winnerOf(rows: Observation[], ownNames: string[]) {
  const counts = new Map<string, number>();
  for (const row of rows.filter((item) => item.status === "success")) {
    const first = row.rankedBrands[0];
    if (first && !ownNames.some((name) => name.toLowerCase() === first.toLowerCase())) counts.set(first, (counts.get(first) || 0) + 1);
  }
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || null;
}

export function calculateMetrics(input: { discovery: CompanyDiscovery; prompts: BuyerPrompt[]; observations: Observation[]; repetitions: number }) {
  const success = input.observations.filter((item) => item.status === "success");
  const ownRecommended = success.filter((item) => item.ownRecommended);
  const topChoice = success.filter((item) => item.ownPosition === 1);
  const cited = success.filter((item) => item.citations.some((citation) => ownedDomainMatch(citation.url, input.discovery.domain)));
  const competitorCounts = new Map<string, number>();
  for (const row of success) for (const brand of row.rankedBrands) {
    if ([input.discovery.brandName, input.discovery.legalName, ...input.discovery.aliases].some((own) => own.toLowerCase() === brand.toLowerCase())) continue;
    competitorCounts.set(brand, (competitorCounts.get(brand) || 0) + 1);
  }
  const competitors = [...competitorCounts.entries()].map(([name, count]) => ({ name, count, coverage: success.length ? Math.round((count / success.length) * 100) : 0 })).sort((a, b) => b.coverage - a.coverage);
  const ownCoverage = success.length ? Math.round((ownRecommended.length / success.length) * 100) : 0;
  const marketPosition = 1 + competitors.filter((item) => item.coverage > ownCoverage).length;

  const groups = new Map<string, Observation[]>();
  for (const row of success) {
    const key = `${row.promptId}:${row.provider}`;
    groups.set(key, [...(groups.get(key) || []), row]);
  }
  const agreement = [...groups.values()].map((rows) => {
    if (rows.length <= 1) return 1;
    const signatures = rows.map((row) => `${row.ownRecommended}:${row.ownPosition || 0}:${row.rankedBrands[0] || "none"}`);
    const counts = new Map<string, number>();
    for (const signature of signatures) counts.set(signature, (counts.get(signature) || 0) + 1);
    return Math.max(...counts.values()) / rows.length;
  });

  const ownNames = [input.discovery.brandName, input.discovery.legalName, ...input.discovery.aliases];
  const lostPrompts: LostPrompt[] = input.prompts.map((prompt) => {
    const rows = success.filter((item) => item.promptId === prompt.id);
    const ownWins = rows.some((item) => item.ownRecommended);
    const citations = [...new Map(rows.flatMap((item) => item.citations).map((citation) => [citation.url, citation])).values()];
    return ownWins ? null : { prompt, winner: winnerOf(rows, ownNames), observations: rows, citations };
  }).filter((value): value is LostPrompt => Boolean(value));

  const metrics: MetricSummary = {
    successfulObservations: success.length,
    scheduledObservations: input.observations.length,
    measurementCompleteness: input.observations.length ? Math.round((success.length / input.observations.length) * 100) : 0,
    shortlistCoverage: ownCoverage,
    topChoiceRate: success.length ? Math.round((topChoice.length / success.length) * 100) : 0,
    citationCoverage: success.length ? Math.round((cited.length / success.length) * 100) : 0,
    stability: agreement.length ? Math.round((agreement.reduce((sum, value) => sum + value, 0) / agreement.length) * 100) : 0,
    marketPosition,
    marketSize: Math.max(1, competitors.length + 1),
    ownRecommendationCount: ownRecommended.length,
    lostPromptCount: lostPrompts.length,
    competitors,
  };
  return { metrics, lostPrompts };
}
