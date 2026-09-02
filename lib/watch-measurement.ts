import "server-only";
import { crawlCompanySite } from "@/lib/crawler";
import { generateBuyerPrompts } from "@/lib/discovery";
import { env } from "@/lib/env";
import { runObservationPanel } from "@/lib/providers";
import { buildScanResult } from "@/lib/scan-result";
import { updateWatch } from "@/lib/storage";
import { sendWatchUpdate } from "@/lib/watch-email";
import { createWatchRun, finalizeWatchRun, getActiveWatchRun, mergeObservations, updateWatchRun } from "@/lib/watch-runs";
import type { BuyerPrompt, WatchMeasurementRun, WatchRecord } from "@/lib/types";

const DAY_MS = 86_400_000;
const FREE_WATCH_DAYS = 14;

function exactPrompts(watch: WatchRecord): BuyerPrompt[] {
  if (watch.latest.prompts?.length) return watch.latest.prompts;
  const seen = new Map<string, BuyerPrompt>();
  for (const observation of watch.latest.observations) {
    if (!seen.has(observation.promptId)) {
      seen.set(observation.promptId, {
        id: observation.promptId,
        text: observation.prompt,
        cluster: "category",
        importance: 3,
        panel: watch.latest.panel.kind,
        version: watch.latest.panel.version,
      });
    }
  }
  return [...seen.values()];
}

async function ensureRun(watch: WatchRecord) {
  const active = await getActiveWatchRun(watch.id);
  if (active) return active;
  const switchToCore = watch.paid && watch.latest.panel.kind !== "core";
  const prompts = switchToCore ? await generateBuyerPrompts(watch.latest.discovery, 50, "core") : exactPrompts(watch);
  if (!prompts.length) throw new Error("再測定に使えるBuyer Promptがありません。");
  return createWatchRun({
    watchId: watch.id,
    watchToken: watch.token,
    targetUrl: watch.latest.targetUrl,
    discovery: watch.latest.discovery,
    prompts,
    panelKind: switchToCore ? "core" : watch.latest.panel.kind,
    repetitions: watch.paid ? 3 : 1,
    switchToCore,
  });
}

function trialExpiredAfterThisRun(watch: WatchRecord) {
  return !watch.paid && watch.status === "trial" && Date.now() >= new Date(watch.createdAt).getTime() + FREE_WATCH_DAYS * DAY_MS;
}

function nextWeeklyRun() {
  return new Date(Date.now() + 7 * DAY_MS).toISOString();
}

function nextResume() {
  return new Date(Date.now() + env.watchResumeMinutes * 60_000).toISOString();
}

function chunkSize(watch: WatchRecord, run: WatchMeasurementRun) {
  return watch.paid && run.repetitions > 1 ? env.watchPromptBatchSize : run.prompts.length;
}

export async function processWatchMeasurement(watch: WatchRecord) {
  let run = await ensureRun(watch);
  const previous = watch.latest;

  if (run.nextPromptIndex < run.prompts.length) {
    const size = chunkSize(watch, run);
    const prompts = run.prompts.slice(run.nextPromptIndex, run.nextPromptIndex + size);
    const observations = await runObservationPanel({
      prompts,
      discovery: run.discovery,
      repetitions: run.repetitions,
      concurrency: watch.paid ? env.watchObservationConcurrency : Math.min(6, env.watchObservationConcurrency),
    });
    const merged = mergeObservations(run.observations, observations);
    const nextPromptIndex = Math.min(run.prompts.length, run.nextPromptIndex + prompts.length);
    const updatedRun = await updateWatchRun(run.id, { status: "running", observations: merged, nextPromptIndex, error: null });
    if (!updatedRun) throw new Error("Watch測定の途中状態を保存できませんでした。");
    run = updatedRun;

    if (run.nextPromptIndex < run.prompts.length) {
      const resumeAt = nextResume();
      await updateWatch(watch.token, { nextRunAt: resumeAt });
      return {
        status: "in_progress" as const,
        runId: run.id,
        completedPrompts: run.nextPromptIndex,
        totalPrompts: run.prompts.length,
        observations: run.observations.length,
        resumeAt,
      };
    }
  }

  const crawl = await crawlCompanySite(run.targetUrl, run.panelKind === "free" ? 24 : 40);
  const result = await buildScanResult({
    scanId: run.id,
    targetUrl: run.targetUrl,
    discovery: run.discovery,
    prompts: run.prompts,
    repetitions: run.repetitions,
    panelKind: run.panelKind,
    observations: run.observations,
    pages: crawl.pages,
  });
  if (!result.successfulObservations) {
    await updateWatchRun(run.id, { status: "failed", error: "成功したAI観測が0件だったため公開しませんでした。" });
    const retryAt = new Date(Date.now() + 60 * 60_000).toISOString();
    await updateWatch(watch.token, { nextRunAt: retryAt });
    throw new Error("成功したAI観測が0件だったためWatch結果を更新しませんでした。");
  }

  const expiresAfterRun = trialExpiredAfterThisRun(watch);
  const history = run.switchToCore ? [result] : [...watch.history, result].slice(-52);
  const baseline = run.switchToCore ? result : watch.baseline;
  const status = expiresAfterRun ? "expired" as const : watch.status;
  const updated = await finalizeWatchRun({ run, latest: result, baseline, history, status, nextRunAt: nextWeeklyRun() });
  await sendWatchUpdate(updated, previous, { trialEnded: expiresAfterRun });
  return {
    status: expiresAfterRun ? "completed_and_expired" as const : run.switchToCore ? "core_baseline_created" as const : "completed" as const,
    runId: run.id,
    completedPrompts: run.prompts.length,
    totalPrompts: run.prompts.length,
    observations: run.observations.length,
  };
}
