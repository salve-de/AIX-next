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

  await emit("validating", 5, "サイトにつながるか確認しています。", new URL(url).hostname);
  await emit("crawling", 12, "サービスや導入事例など、会社の公開ページを読んでいます。");
  const crawl = await crawlCompanySite(url, panelKind === "free" ? 12 : 36);

  await emit("discovering", 30, "比較される市場と会社を整理しています。", `公開ページ ${crawl.pages.length}件`);
  const discovery = await discoverCompany(url, crawl.pages);

  await emit("prompting", 45, "買う前に聞かれる質問を作っています。", discovery.market);
  const prompts = input.prompts || await generateBuyerPrompts(discovery, promptCount, panelKind);

  await emit("measuring", 55, "AIに質問し、選ばれた会社を確認しています。", `${prompts.length}問を確認`);
  const observations = await runObservationPanel({
    prompts,
    discovery,
    repetitions,
    concurrency: input.observationConcurrency,
    onProgress: async (completed, total) => emit("measuring", 55 + Math.round((completed / total) * 25), `AIの回答を確認しています。${completed}/${total}`, `質問 ${completed}/${total}`),
  });

  await emit("analyzing", 84, "AIが競合を先に勧めた理由を整理しています。");
  const result = await buildScanResult({ scanId: input.scanId, targetUrl: url, discovery, prompts, repetitions, panelKind, observations, pages: crawl.pages, crawlAudit: crawl.audit });
  await emit(result.successfulObservations === result.scheduledObservations ? "complete" : "partial", 100, result.successfulObservations ? "結果と、最初に直すことをまとめました。" : "市場の確認は終わりましたが、AIの回答を最後まで取得できませんでした。", discovery.brandName);
  return result;
}
