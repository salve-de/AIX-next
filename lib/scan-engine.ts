import "server-only";
import { crawlSite } from "@/lib/crawl";
import { analyzeEvidence, discoverCompany, generateBuyerPrompts } from "@/lib/discovery";
import { calculateMetrics } from "@/lib/metrics";
import { runProvider } from "@/lib/providers";
import { normalizePublicUrl } from "@/lib/security";
import { updateScan } from "@/lib/store";
import type { BuyerPrompt, ProgressEvent, ProviderName, ScanResult } from "@/lib/types";

const providers: ProviderName[] = ["openai", "gemini", "perplexity"];

export async function runScan(input: {
  scanId: string;
  url: string;
  promptCount?: number;
  repetitions?: number;
  fixedPrompts?: BuyerPrompt[];
  onProgress?: (event: ProgressEvent) => void | Promise<void>;
}) {
  const emit = async (stage: ProgressEvent["stage"], progress: number, message: string, detail?: string) => {
    const event = { stage, progress, message, detail };
    await updateScan(input.scanId, { stage, progress, message });
    await input.onProgress?.(event);
  };

  const url = normalizePublicUrl(input.url);
  await emit("validating", 5, "公開URLと接続先を検証しています", new URL(url).hostname);
  const pages = await crawlSite(url, (detail) => void emit("crawling", 15, "会社サイトを読み取っています", detail));
  await emit("discovering", 30, "会社・市場・競合を特定しています", `${pages.length}ページを解析`);
  const discovery = await discoverCompany(url, pages);
  await emit("prompting", 43, "見込み客がAIへ聞く購買質問を作っています", discovery.market);
  const prompts = input.fixedPrompts || await generateBuyerPrompts(discovery, input.promptCount || 15);
  const repetitions = Math.max(1, Math.min(3, input.repetitions || 1));
  const observations = [];
  const scheduled = prompts.length * providers.length * repetitions;
  let completed = 0;
  await emit("measuring", 50, "OpenAI・Gemini・Perplexityを調査しています", `0/${scheduled}回答`);
  for (const prompt of prompts) {
    for (const provider of providers) {
      for (let repetition = 1; repetition <= repetitions; repetition += 1) {
        const observation = await runProvider(provider, prompt, discovery, repetition);
        observations.push(observation);
        completed += 1;
        const progress = 50 + Math.round((completed / scheduled) * 30);
        await emit("measuring", Math.min(80, progress), `${provider}で購買回答を調査しています`, `${completed}/${scheduled}回答`);
      }
    }
  }
  await emit("analyzing", 85, "候補入り・競合・引用元を比較しています");
  const { metrics, lostPrompts } = calculateMetrics({ discovery, prompts, observations, repetitions });
  const evidence = await analyzeEvidence({ discovery, pages, lostPrompts });
  const warnings: string[] = [];
  if (discovery.confidence < .72) warnings.push("市場認識の確度が低いため、競合とカテゴリを確認してください。");
  if (metrics.measurementCompleteness < 100) warnings.push(`AI測定の完了率は${metrics.measurementCompleteness}%です。未設定または失敗したProviderがあります。`);
  if (repetitions === 1) warnings.push("無料Snapshotは各AIを1回だけ観測します。Watchでは反復測定で揺らぎを確認します。");
  const result: ScanResult = {
    scanId: input.scanId,
    url,
    measuredAt: new Date().toISOString(),
    discovery,
    pages: pages.map(({ url: pageUrl, title }) => ({ url: pageUrl, title })),
    prompts,
    observations,
    metrics,
    lostPrompts,
    evidenceGaps: evidence.gaps,
    actions: evidence.actions,
    warnings,
  };
  await updateScan(input.scanId, { stage: metrics.successfulObservations ? (metrics.measurementCompleteness === 100 ? "complete" : "partial") : "partial", progress: 100, message: "診断が完了しました", result, error: null });
  await input.onProgress?.({ stage: "complete", progress: 100, message: "診断が完了しました", detail: `${metrics.successfulObservations}/${metrics.scheduledObservations}回答` });
  return result;
}
