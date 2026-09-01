import { isOwnedCitation } from "@/lib/entity-extraction";
import type { BuyerPrompt, CompanyDiscovery, CompetitorMetric, LostPrompt, Observation } from "@/lib/types";

function percent(numerator: number, denominator: number) {
  return denominator ? Math.round((numerator / denominator) * 100) : 0;
}

export function successful(observations: Observation[]) {
  return observations.filter((item) => item.status === "success");
}

export function recommendationCoverage(observations: Observation[]) {
  const eligible = successful(observations);
  return percent(eligible.filter((item) => item.ownRecommended).length, eligible.length);
}

export function firstChoiceRate(observations: Observation[], brandName: string) {
  const eligible = successful(observations);
  return percent(eligible.filter((item) => item.firstCandidate === brandName).length, eligible.length);
}

export function mentionCoverage(observations: Observation[], aliases: string[]) {
  const eligible = successful(observations);
  const normalized = aliases.map((alias) => alias.toLowerCase()).filter(Boolean);
  return percent(eligible.filter((item) => normalized.some((alias) => item.rawText.toLowerCase().includes(alias))).length, eligible.length);
}

export function citationCoverage(observations: Observation[], domain: string) {
  const eligible = successful(observations);
  return percent(eligible.filter((item) => item.citations.some((citation) => isOwnedCitation(citation.url, domain))).length, eligible.length);
}

export function repeatAgreement(observations: Observation[]) {
  const groups = new Map<string, Observation[]>();
  for (const item of successful(observations)) {
    const key = `${item.promptId}:${item.provider}`;
    groups.set(key, [...(groups.get(key) || []), item]);
  }
  const eligible = [...groups.values()].filter((group) => group.length > 1);
  if (!eligible.length) return 100;
  const scores = eligible.map((group) => {
    const signatures = group.map((item) => `${item.ownRecommended}:${item.ownPosition || 0}:${item.firstCandidate || ""}`);
    const counts = new Map<string, number>();
    signatures.forEach((signature) => counts.set(signature, (counts.get(signature) || 0) + 1));
    return Math.max(...counts.values()) / signatures.length;
  });
  return Math.round((scores.reduce((sum, value) => sum + value, 0) / scores.length) * 100);
}

export function competitorMetrics(observations: Observation[], discovery: CompanyDiscovery) {
  const eligible = successful(observations);
  const names = new Set(discovery.competitors.map((item) => item.name));
  eligible.forEach((item) => item.recommendedEntities.forEach((entity) => {
    if (entity !== discovery.brandName) names.add(entity);
  }));
  const metrics: CompetitorMetric[] = [...names].map((name) => ({
    name,
    recommendedCount: eligible.filter((item) => item.recommendedEntities.includes(name)).length,
    firstChoiceCount: eligible.filter((item) => item.firstCandidate === name).length,
    coverage: percent(eligible.filter((item) => item.recommendedEntities.includes(name)).length, eligible.length),
  }));
  return metrics.sort((a, b) => b.coverage - a.coverage || b.firstChoiceCount - a.firstChoiceCount || a.name.localeCompare(b.name, "ja"));
}

function modal(values: Array<string | null>) {
  const counts = new Map<string, number>();
  for (const value of values.filter((item): item is string => Boolean(item))) counts.set(value, (counts.get(value) || 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || null;
}

export function lostPrompts(prompts: BuyerPrompt[], observations: Observation[], discovery: CompanyDiscovery): LostPrompt[] {
  return prompts.flatMap((prompt) => {
    const rows = successful(observations.filter((item) => item.promptId === prompt.id));
    if (!rows.length) return [];
    const ownWins = rows.filter((item) => item.ownRecommended).length;
    if (ownWins >= Math.ceil(rows.length / 2)) return [];
    const winner = modal(rows.map((item) => item.firstCandidate).filter((name) => name !== discovery.brandName));
    const citations = [...new Map(rows.flatMap((item) => item.citations).map((citation) => [citation.url, citation])).values()];
    return [{
      promptId: prompt.id,
      prompt: prompt.text,
      winner,
      summary: winner ? `${winner}がより多くのAI回答で購入候補として先に挙げられ、${discovery.brandName}は過半数の回答で候補に入りませんでした。` : `${discovery.brandName}は過半数のAI回答で購入候補に入りませんでした。`,
      citations,
      observations: rows,
    }];
  }).sort((a, b) => {
    const promptA = prompts.find((item) => item.id === a.promptId)?.importance || 0;
    const promptB = prompts.find((item) => item.id === b.promptId)?.importance || 0;
    return promptB - promptA || b.observations.length - a.observations.length;
  });
}

export function marketPosition(observations: Observation[], discovery: CompanyDiscovery) {
  const eligible = successful(observations);
  const own = { name: discovery.brandName, coverage: percent(eligible.filter((item) => item.ownRecommended).length, eligible.length) };
  const all = [...competitorMetrics(observations, discovery).map((item) => ({ name: item.name, coverage: item.coverage })), own]
    .sort((a, b) => b.coverage - a.coverage || a.name.localeCompare(b.name, "ja"));
  return { position: Math.max(1, all.findIndex((item) => item.name === discovery.brandName) + 1), size: all.length };
}
