import type { ProviderName, ScanResult } from "@/lib/types";

export type SurfaceOutcome = {
  key: string;
  promptId: string;
  provider: ProviderName;
  successful: number;
  requiredForStable: number;
  recommended: boolean;
  firstChoice: boolean;
  stable: boolean;
};

export type WatchDiff = {
  comparable: boolean;
  reasons: string[];
  coverageDelta: number | null;
  rankDelta: number | null;
  newWins: number;
  newLosses: number;
  newFirstChoices: number;
  lostFirstChoices: number;
  newCitations: string[];
  removedCitations: string[];
  stableCells: number;
  skippedCells: number;
};

function providerSet(result: ScanResult) {
  return [...new Set(result.observations.map((item) => item.provider))].sort();
}

function sameList(left: string[], right: string[]) {
  return left.length === right.length && left.every((item, index) => item === right[index]);
}

function surfaceOutcomes(result: ScanResult) {
  const map = new Map<string, SurfaceOutcome>();
  const providers = providerSet(result) as ProviderName[];
  const requiredForStable = Math.max(1, Math.ceil(result.panel.repetitions / 2));

  for (const prompt of result.prompts) {
    for (const provider of providers) {
      const rows = result.observations.filter((item) => item.promptId === prompt.id && item.provider === provider && item.status === "success");
      const recommendedCount = rows.filter((item) => item.ownRecommended).length;
      const firstChoiceCount = rows.filter((item) => item.ownPosition === 1).length;
      const stable = rows.length >= requiredForStable;
      map.set(`${prompt.id}:${provider}`, {
        key: `${prompt.id}:${provider}`,
        promptId: prompt.id,
        provider,
        successful: rows.length,
        requiredForStable,
        recommended: stable && recommendedCount > rows.length / 2,
        firstChoice: stable && firstChoiceCount > rows.length / 2,
        stable,
      });
    }
  }
  return map;
}

function citationSet(result: ScanResult) {
  return new Set(result.observations
    .filter((item) => item.status === "success")
    .flatMap((item) => item.citations.map((citation) => citation.url))
    .filter(Boolean));
}

export function compareWatchRuns(baseline: ScanResult, latest: ScanResult): WatchDiff {
  const reasons: string[] = [];
  if (baseline.panel.kind !== latest.panel.kind) reasons.push("panel_kind_changed");
  if (baseline.panel.version !== latest.panel.version) reasons.push("panel_version_changed");
  if (baseline.panel.promptCount !== latest.panel.promptCount) reasons.push("prompt_count_changed");
  if (baseline.panel.repetitions !== latest.panel.repetitions) reasons.push("repetitions_changed");
  if (!sameList(providerSet(baseline), providerSet(latest))) reasons.push("provider_set_changed");

  const comparable = reasons.length === 0;
  const before = surfaceOutcomes(baseline);
  const after = surfaceOutcomes(latest);
  let newWins = 0;
  let newLosses = 0;
  let newFirstChoices = 0;
  let lostFirstChoices = 0;
  let stableCells = 0;
  let skippedCells = 0;

  if (comparable) {
    for (const [key, current] of after) {
      const previous = before.get(key);
      if (!previous || !previous.stable || !current.stable) { skippedCells += 1; continue; }
      stableCells += 1;
      if (!previous.recommended && current.recommended) newWins += 1;
      if (previous.recommended && !current.recommended) newLosses += 1;
      if (!previous.firstChoice && current.firstChoice) newFirstChoices += 1;
      if (previous.firstChoice && !current.firstChoice) lostFirstChoices += 1;
    }
  }

  const beforeCitations = citationSet(baseline);
  const afterCitations = citationSet(latest);
  const newCitations = comparable ? [...afterCitations].filter((url) => !beforeCitations.has(url)) : [];
  const removedCitations = comparable ? [...beforeCitations].filter((url) => !afterCitations.has(url)) : [];

  return {
    comparable,
    reasons,
    coverageDelta: comparable ? latest.recommendationCoverage - baseline.recommendationCoverage : null,
    rankDelta: comparable ? baseline.marketPosition - latest.marketPosition : null,
    newWins,
    newLosses,
    newFirstChoices,
    lostFirstChoices,
    newCitations,
    removedCitations,
    stableCells,
    skippedCells,
  };
}
