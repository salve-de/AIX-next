import type { Observation, ProviderName, ScanResult } from "./types";
import { CORE_PANEL_SIZE } from "./prompt-panels";

const providers: ProviderName[] = ["openai", "gemini", "perplexity"];
type Input = Pick<ScanResult, "panel" | "prompts" | "observations" | "measuredAt" | "targetUrl">;

function promptVotes(result: Input, provider: ProviderName) {
  const votes = new Map<string, { included: boolean; condition: string }>();
  for (const prompt of result.prompts || []) {
    const rows = result.observations.filter((row) => row.provider === provider && row.promptId === prompt.id);
    const repetitions = new Set(rows.map((row) => row.repetition));
    if (rows.length !== result.panel.repetitions || repetitions.size !== result.panel.repetitions || rows.some((row) => row.status !== "success" || row.prompt !== prompt.text)) continue;
    const condition = JSON.stringify([prompt.text, rows.map((row: Observation) => `${row.model}:${row.repetition}`).sort()]);
    votes.set(prompt.id, { included: rows.filter((row) => row.ownRecommended).length > rows.length / 2, condition });
  }
  return votes;
}

/** Fixed-panel share is NOT recovery among initially lost questions. */
export function northStarShare(latest: Input, baseline?: Input) {
  const validPanel = latest.panel.kind === "core" && latest.panel.promptCount === CORE_PANEL_SIZE && new Set(latest.prompts?.map((prompt) => prompt.id)).size === CORE_PANEL_SIZE;
  const samePanel = validPanel && baseline?.panel.kind === latest.panel.kind && baseline.panel.version === latest.panel.version && baseline.panel.promptCount === latest.panel.promptCount && baseline.panel.repetitions === latest.panel.repetitions && baseline.targetUrl === latest.targetUrl;
  return {
    status: validPanel ? "measured" as const : "short-panel" as const,
    scheduled: CORE_PANEL_SIZE,
    measuredAt: latest.measuredAt,
    baselineMeasuredAt: baseline?.measuredAt || null,
    providers: providers.map((provider) => {
      const current = validPanel ? promptVotes(latest, provider) : new Map();
      const previous = samePanel && baseline ? promptVotes(baseline, provider) : new Map();
      const included = [...current.values()].filter((vote) => vote.included).length;
      const paired = [...current.keys()].filter((id) => previous.get(id)?.condition === current.get(id)?.condition);
      const oldCount = paired.filter((id) => previous.get(id)!.included).length;
      const newCount = paired.filter((id) => current.get(id)!.included).length;
      return {
        provider, included, successful: current.size, missing: CORE_PANEL_SIZE - current.size,
        value: current.size ? Math.round(included / current.size * 100) : null,
        comparison: paired.length ? { count: paired.length, before: Math.round(oldCount / paired.length * 100), after: Math.round(newCount / paired.length * 100) } : null,
      };
    }),
  };
}
