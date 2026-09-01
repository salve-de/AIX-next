import { buildCitationIntelligence, buildClusterIntelligence, buildPromptIntelligence } from "@/lib/intelligence";
import type { WatchRecord } from "@/lib/types";

function csvCell(value: unknown) { const text = value == null ? "" : String(value); return /[",\n]/.test(text) ? `"${text.replaceAll('"', '""')}"` : text; }
function csv(rows: unknown[][]) { return rows.map((row) => row.map(csvCell).join(",")).join("\n") + "\n"; }

export function safeReportData(watch: WatchRecord) {
  const latest = watch.latest;
  return {
    generatedAt: new Date().toISOString(),
    project: { brandName: latest.discovery.brandName, domain: latest.discovery.domain, market: latest.discovery.market, status: watch.status, paid: watch.paid },
    panel: latest.panel,
    metrics: { recommendationCoverage: latest.recommendationCoverage, firstChoiceRate: latest.firstChoiceRate, mentionCoverage: latest.mentionCoverage, citationCoverage: latest.citationCoverage, repeatAgreement: latest.repeatAgreement, measurementCompleteness: latest.measurementCompleteness, successfulObservations: latest.successfulObservations, scheduledObservations: latest.scheduledObservations },
    prompts: buildPromptIntelligence(latest),
    citations: buildCitationIntelligence(latest),
    clusters: buildClusterIntelligence(latest),
    competitors: latest.competitors,
    narratives: latest.narratives,
    siteReadiness: latest.siteReadiness || null,
    evidenceGaps: latest.evidenceGaps,
    evidence: watch.evidence,
    actions: latest.actions,
    changePacks: watch.changePacks || [],
    coreHistory: watch.history.map((result) => ({ measuredAt: result.measuredAt, recommendationCoverage: result.recommendationCoverage, firstChoiceRate: result.firstChoiceRate, citationCoverage: result.citationCoverage, repeatAgreement: result.repeatAgreement, panel: result.panel })),
    discoveryLatest: watch.discoveryLatest ? { measuredAt: watch.discoveryLatest.measuredAt, prompts: watch.discoveryLatest.prompts, lostPrompts: watch.discoveryLatest.lostPrompts, recommendationCoverage: watch.discoveryLatest.recommendationCoverage } : null,
    customPrompts: watch.customPrompts || [],
    customLatest: watch.customLatest ? { measuredAt: watch.customLatest.measuredAt, recommendationCoverage: watch.customLatest.recommendationCoverage, observations: watch.customLatest.successfulObservations } : null,
  };
}

export function executiveMarkdown(watch: WatchRecord) {
  const latest = watch.latest; const topCompetitor = latest.competitors[0]; const topLoss = latest.lostPrompts[0]; const gap = latest.evidenceGaps[0]; const action = latest.actions[0];
  const lines = [
    `# AIX Executive Brief — ${latest.discovery.brandName}`,
    "", `Generated: ${new Date().toISOString()}`, `Market: ${latest.discovery.market}`, `Domain: ${latest.discovery.domain}`,
    "", "## Core observation", `- Recommendation Coverage: ${latest.recommendationCoverage}% (${latest.ownRecommendationCount}/${latest.successfulObservations} successful observations)`, `- First Choice Rate: ${latest.firstChoiceRate}%`, `- Mention Coverage: ${latest.mentionCoverage}%`, `- Citation Coverage: ${latest.citationCoverage}%`, `- Repeat Agreement: ${latest.repeatAgreement}%`, `- Panel: ${latest.panel.promptCount} prompts × ${latest.panel.repetitions} repetitions, ${latest.panel.locale}/${latest.panel.country}`,
    "", "## Competitive context", `- Most frequent competitor: ${topCompetitor?.name || "Not identified"}${topCompetitor ? ` (${topCompetitor.coverage}% coverage)` : ""}`,
    "", "## Most important buyer loss", topLoss ? `- Prompt: ${topLoss.prompt}\n- Winner: ${topLoss.winner || "Unknown"}\n- Observation: ${topLoss.summary}` : "- No primary lost prompt identified in this panel.",
    "", "## Missing comparison material", gap ? `- ${gap.label}: ${gap.whyItMatters}\n- Related prompts: ${gap.relatedPromptCount}` : "- No major evidence gap identified.",
    "", "## Next action", action ? `- ${action.title}\n- Target: ${action.target}\n- Related prompts: ${action.relatedPromptCount}\n- Rationale: ${action.rationale}` : "- Continue observation.",
    "", "## Method note", "This report summarizes AIX observations under the recorded prompt/provider/panel conditions. It does not represent a universal AI rank and does not establish that a content change caused a later observation difference.",
  ];
  return lines.join("\n") + "\n";
}

export function datasetCsv(watch: WatchRecord, scope: "prompts" | "citations" | "competitors" | "history") {
  const latest = watch.latest;
  if (scope === "prompts") return csv([["prompt_id", "prompt", "cluster", "importance", "why_tracked", "successful", "recommendations", "first_choices", "recommendation_coverage"], ...buildPromptIntelligence(latest).map((row) => [row.prompt.id, row.prompt.text, row.prompt.cluster, row.prompt.importance, row.prompt.whyTracked || "", row.successful, row.recommendations, row.firstChoices, row.recommendationCoverage])]);
  if (scope === "citations") return csv([["domain", "kind", "citations", "prompt_count", "providers", "top_url"], ...buildCitationIntelligence(latest).map((row) => [row.domain, row.kind, row.citations, row.promptCount, row.providers.join("|"), row.urls[0]?.url || ""])]);
  if (scope === "competitors") return csv([["competitor", "coverage", "recommended_count", "first_choice_count"], ...latest.competitors.map((row) => [row.name, row.coverage, row.recommendedCount, row.firstChoiceCount]), [latest.discovery.brandName, latest.recommendationCoverage, latest.ownRecommendationCount, Math.round(latest.firstChoiceRate / 100 * latest.successfulObservations)]]);
  return csv([["measured_at", "recommendation_coverage", "first_choice_rate", "citation_coverage", "repeat_agreement", "prompt_count", "repetitions"], ...watch.history.map((row) => [row.measuredAt, row.recommendationCoverage, row.firstChoiceRate, row.citationCoverage, row.repeatAgreement, row.panel.promptCount, row.panel.repetitions])]);
}
