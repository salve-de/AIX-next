import "server-only";
import { analyzeEvidence } from "@/lib/discovery";
import { citationCoverage, competitorMetrics, firstChoiceRate, lostPrompts, marketPosition, mentionCoverage, recommendationCoverage, repeatAgreement, successful } from "@/lib/measurement";
import type { BuyerPrompt, CompanyDiscovery, CrawledPage, Observation, PromptPanelKind, ScanResult } from "@/lib/types";

export async function buildScanResult(input: {
  scanId: string;
  targetUrl: string;
  discovery: CompanyDiscovery;
  prompts: BuyerPrompt[];
  repetitions: number;
  panelKind: PromptPanelKind;
  observations: Observation[];
  pages: CrawledPage[];
  measuredAt?: string;
}) {
  const eligible = successful(input.observations);
  const lost = lostPrompts(input.prompts, input.observations, input.discovery);
  const analysis = await analyzeEvidence({ discovery: input.discovery, pages: input.pages, lostPrompts: lost });
  const position = marketPosition(input.observations, input.discovery);
  const warnings: string[] = [];
  if (input.discovery.confidence < .65) warnings.push("市場認識の信頼度が低いため、Watch開始前に市場と競合を確認してください。");
  if (eligible.length < input.observations.length) warnings.push(`${input.observations.length - eligible.length}件のAI観測が失敗または未設定です。Recommendation指標の分母から除外しています。`);
  if (!eligible.length) warnings.push("AI Providerの有効な回答がありません。API設定後に再測定してください。サンプル結果は /result?sample=1 で確認できます。");
  if (!input.discovery.competitors.length) warnings.push("十分な競合候補を特定できませんでした。市場認識を確認してください。");

  return {
    scanId: input.scanId,
    targetUrl: input.targetUrl,
    discovery: input.discovery,
    panel: { kind: input.panelKind, version: 1, promptCount: input.prompts.length, repetitions: input.repetitions, locale: "ja-JP", country: "JP" },
    prompts: input.prompts,
    measuredAt: input.measuredAt || new Date().toISOString(),
    observations: input.observations,
    scheduledObservations: input.observations.length,
    successfulObservations: eligible.length,
    measurementCompleteness: input.observations.length ? Math.round((eligible.length / input.observations.length) * 100) : 0,
    recommendationCoverage: recommendationCoverage(input.observations),
    firstChoiceRate: firstChoiceRate(input.observations, input.discovery.brandName),
    mentionCoverage: mentionCoverage(input.observations, input.discovery.aliases),
    citationCoverage: citationCoverage(input.observations, input.discovery.domain),
    repeatAgreement: repeatAgreement(input.observations),
    ownRecommendationCount: eligible.filter((item) => item.ownRecommended).length,
    marketPosition: eligible.length ? position.position : 0,
    marketSize: position.size,
    competitors: competitorMetrics(input.observations, input.discovery),
    lostPrompts: lost,
    evidenceGaps: analysis.gaps,
    actions: analysis.actions,
    totalCostUsd: input.observations.reduce((sum, item) => sum + (item.costUsd || 0), 0),
    warnings,
  } satisfies ScanResult;
}
