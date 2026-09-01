import "server-only";
import { crawlCompanySite } from "@/lib/crawler";
import { analyzeEvidence, discoverCompany, generateBuyerPrompts } from "@/lib/discovery";
import { buildNarratives, withPromptRationale } from "@/lib/intelligence";
import { competitorMetrics, citationCoverage, firstChoiceRate, lostPrompts, marketPosition, mentionCoverage, recommendationCoverage, repeatAgreement, successful } from "@/lib/measurement";
import { runObservationPanel } from "@/lib/providers";
import { normalizePublicUrl } from "@/lib/url-security";
import type { BuyerPrompt, PromptPanelKind, ScanProgressEvent, ScanResult } from "@/lib/types";

export async function runScan(input: {
  scanId: string;
  url: string;
  promptCount?: number;
  repetitions?: number;
  panelKind?: PromptPanelKind;
  prompts?: BuyerPrompt[];
  onProgress?: (event: ScanProgressEvent) => Promise<void> | void;
}) {
  const url = normalizePublicUrl(input.url);
  const promptCount = input.promptCount ?? 12;
  const repetitions = input.repetitions ?? 1;
  const panelKind = input.panelKind ?? "free";
  const emit = async (stage: ScanProgressEvent["stage"], progress: number, message: string, detail?: string) => input.onProgress?.({ stage, progress, message, detail });

  await emit("validating", 5, "公開URLと接続先を検証しています。", new URL(url).hostname);
  await emit("crawling", 12, "サービス、料金、導入事例などの公開ページを読んでいます。");
  const crawl = await crawlCompanySite(url, panelKind === "free" ? 24 : 40);

  await emit("discovering", 30, "運営会社、ブランド、市場、買い手、競合を特定しています。", `${crawl.pages.length}ページ取得`);
  const discovery = await discoverCompany(url, crawl.pages);

  await emit("prompting", 45, "購入直前に聞かれるBuyer Promptを構成しています。", discovery.market);
  const generated = input.prompts || await generateBuyerPrompts(discovery, promptCount, panelKind);
  const prompts = withPromptRationale(generated, discovery);

  await emit("measuring", 55, "OpenAI、Gemini、Perplexityで購入候補を観測しています。", `${prompts.length}質問 × 3 AI × ${repetitions}回`);
  const observations = await runObservationPanel({
    prompts,
    discovery,
    repetitions,
    onProgress: async (completed, total, detail) => emit("measuring", 55 + Math.round((completed / total) * 25), `AI回答を観測しています。${completed}/${total}`, detail),
  });

  await emit("analyzing", 84, "Visibility、推薦、Citation、競合差、比較材料を統合集計しています。");
  const eligible = successful(observations);
  const lost = lostPrompts(prompts, observations, discovery);
  const analysis = await analyzeEvidence({ discovery, pages: crawl.pages, lostPrompts: lost });
  const narratives = buildNarratives(observations, discovery);
  const position = marketPosition(observations, discovery);
  const warnings: string[] = [];
  if (discovery.confidence < .65) warnings.push("市場認識の信頼度が低いため、Watch開始前に市場と競合を確認してください。");
  if (eligible.length < observations.length) warnings.push(`${observations.length - eligible.length}件のAI観測が失敗または未設定です。Recommendation指標の分母から除外しています。`);
  if (!eligible.length) warnings.push("AI Providerの有効な回答がありません。API設定後に再測定してください。サンプル結果は /result?sample=1 で確認できます。");
  if (!discovery.competitors.length) warnings.push("十分な競合候補を特定できませんでした。市場認識を確認してください。");

  const result: ScanResult = {
    scanId: input.scanId,
    targetUrl: url,
    discovery,
    panel: { kind: panelKind, version: 1, promptCount: prompts.length, repetitions, locale: "ja-JP", country: "JP" },
    prompts,
    measuredAt: new Date().toISOString(),
    observations,
    scheduledObservations: observations.length,
    successfulObservations: eligible.length,
    measurementCompleteness: observations.length ? Math.round((eligible.length / observations.length) * 100) : 0,
    recommendationCoverage: recommendationCoverage(observations),
    firstChoiceRate: firstChoiceRate(observations, discovery.brandName),
    mentionCoverage: mentionCoverage(observations, discovery.aliases),
    citationCoverage: citationCoverage(observations, discovery.domain),
    repeatAgreement: repeatAgreement(observations),
    ownRecommendationCount: eligible.filter((item) => item.ownRecommended).length,
    marketPosition: eligible.length ? position.position : 0,
    marketSize: position.size,
    competitors: competitorMetrics(observations, discovery),
    lostPrompts: lost,
    narratives,
    evidenceGaps: analysis.gaps,
    actions: analysis.actions,
    totalCostUsd: observations.reduce((sum, item) => sum + (item.costUsd || 0), 0),
    warnings,
  };
  await emit(eligible.length === observations.length ? "complete" : "partial", 100, eligible.length ? "統合診断を作成しました。" : "市場解析は完了しましたが、AI観測を完了できませんでした。", discovery.brandName);
  return result;
}
