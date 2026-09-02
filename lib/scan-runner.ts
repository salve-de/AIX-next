import "server-only";
import { crawlCompanySite } from "@/lib/crawler";
import { discoverCompany, generateBuyerPrompts } from "@/lib/discovery";
import { runObservationPanel } from "@/lib/providers";
import { buildScanResult } from "@/lib/scan-result";
import { normalizePublicUrl } from "@/lib/url-security";
import type { BuyerPrompt, PromptPanelKind, ScanProgressEvent } from "@/lib/types";

export async function runScan(input: {
  scanId: string;
  url: string;
  promptCount?: number;
  repetitions?: number;
  panelKind?: PromptPanelKind;
  prompts?: BuyerPrompt[];
  observationConcurrency?: number;
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
  const prompts = input.prompts || await generateBuyerPrompts(discovery, promptCount, panelKind);

  await emit("measuring", 55, "OpenAI、Gemini、Perplexityで購入候補を観測しています。", `${prompts.length}質問 × 3 AI × ${repetitions}回`);
  const observations = await runObservationPanel({
    prompts,
    discovery,
    repetitions,
    concurrency: input.observationConcurrency,
    onProgress: async (completed, total, detail) => emit("measuring", 55 + Math.round((completed / total) * 25), `AI回答を観測しています。${completed}/${total}`, detail),
  });

  await emit("analyzing", 84, "推薦、Citation、競合差を同じ定義で集計しています。");
  const result = await buildScanResult({ scanId: input.scanId, targetUrl: url, discovery, prompts, repetitions, panelKind, observations, pages: crawl.pages });
  await emit(result.successfulObservations === result.scheduledObservations ? "complete" : "partial", 100, result.successfulObservations ? "診断結果を作成しました。" : "市場解析は完了しましたが、AI観測を完了できませんでした。", discovery.brandName);
  return result;
}
