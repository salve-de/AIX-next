import "server-only";
import { env } from "@/lib/env";
import { id } from "@/lib/ids";
import { durableStorageAvailable } from "@/lib/runtime-readiness";
import { getWatch, updateWatch } from "@/lib/storage";
import type { BuyerPrompt, CompanyDiscovery, Observation, PromptPanelKind, ScanResult, WatchMeasurementRun, WatchStatus } from "@/lib/types";

const globalRuns = globalThis as unknown as { aixNextWatchRuns?: Map<string, WatchMeasurementRun> };
const memoryRuns = globalRuns.aixNextWatchRuns ?? new Map<string, WatchMeasurementRun>();
globalRuns.aixNextWatchRuns = memoryRuns;

function durable() {
  return durableStorageAvailable();
}

async function supabase<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(`${env.supabaseUrl}/rest/v1/${path}`, {
    signal: AbortSignal.timeout(15_000),
    ...init,
    headers: {
      apikey: env.supabaseServiceKey,
      authorization: `Bearer ${env.supabaseServiceKey}`,
      "content-type": "application/json",
      ...(init.headers || {}),
    },
  });
  if (!response.ok) throw new Error(`測定履歴を保存できませんでした (${response.status})。`);
  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
}

function fromRow(row: any): WatchMeasurementRun {
  return {
    id: row.id,
    watchId: row.watch_id,
    watchToken: row.watch_token,
    status: row.status,
    targetUrl: row.target_url,
    discovery: row.discovery,
    prompts: row.prompts || [],
    panelKind: row.panel_kind,
    repetitions: Number(row.repetitions),
    switchToCore: Boolean(row.switch_to_core),
    nextPromptIndex: Number(row.next_prompt_index || 0),
    observations: row.observations || [],
    error: row.error || null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    completedAt: row.completed_at || undefined,
  };
}

export async function getActiveWatchRun(watchId: string) {
  if (durable()) {
    const rows = await supabase<any[]>(`aix_next_watch_runs?watch_id=eq.${encodeURIComponent(watchId)}&status=in.(pending,running)&order=created_at.desc&limit=1`);
    return rows[0] ? fromRow(rows[0]) : null;
  }
  return [...memoryRuns.values()].find((run) => run.watchId === watchId && ["pending", "running"].includes(run.status)) || null;
}

export async function createWatchRun(input: {
  watchId: string;
  watchToken: string;
  targetUrl: string;
  discovery: CompanyDiscovery;
  prompts: BuyerPrompt[];
  panelKind: PromptPanelKind;
  repetitions: number;
  switchToCore: boolean;
}) {
  const existing = await getActiveWatchRun(input.watchId);
  if (existing) return existing;
  const now = new Date().toISOString();
  const run: WatchMeasurementRun = {
    id: id("watchrun"),
    watchId: input.watchId,
    watchToken: input.watchToken,
    status: "pending",
    targetUrl: input.targetUrl,
    discovery: input.discovery,
    prompts: input.prompts,
    panelKind: input.panelKind,
    repetitions: input.repetitions,
    switchToCore: input.switchToCore,
    nextPromptIndex: 0,
    observations: [],
    error: null,
    createdAt: now,
    updatedAt: now,
  };
  if (durable()) {
    try {
      const rows = await supabase<any[]>("aix_next_watch_runs", {
        method: "POST",
        headers: { prefer: "return=representation" },
        body: JSON.stringify({
          id: run.id,
          watch_id: run.watchId,
          watch_token: run.watchToken,
          status: run.status,
          target_url: run.targetUrl,
          discovery: run.discovery,
          prompts: run.prompts,
          panel_kind: run.panelKind,
          repetitions: run.repetitions,
          switch_to_core: run.switchToCore,
          next_prompt_index: 0,
          observations: [],
        }),
      });
      return fromRow(rows[0]);
    } catch (error) {
      const concurrent = await getActiveWatchRun(input.watchId);
      if (concurrent) return concurrent;
      throw error;
    }
  }
  memoryRuns.set(run.id, run);
  return run;
}

export async function updateWatchRun(runId: string, patch: Partial<Pick<WatchMeasurementRun, "status" | "nextPromptIndex" | "observations" | "error" | "completedAt">>) {
  const updatedAt = new Date().toISOString();
  if (durable()) {
    const body: Record<string, unknown> = { updated_at: updatedAt };
    if (patch.status !== undefined) body.status = patch.status;
    if (patch.nextPromptIndex !== undefined) body.next_prompt_index = patch.nextPromptIndex;
    if (patch.observations !== undefined) body.observations = patch.observations;
    if (patch.error !== undefined) body.error = patch.error;
    if (patch.completedAt !== undefined) body.completed_at = patch.completedAt || null;
    const rows = await supabase<any[]>(`aix_next_watch_runs?id=eq.${encodeURIComponent(runId)}`, {
      method: "PATCH",
      headers: { prefer: "return=representation" },
      body: JSON.stringify(body),
    });
    return rows[0] ? fromRow(rows[0]) : null;
  }
  const current = memoryRuns.get(runId);
  if (!current) return null;
  const next = { ...current, ...patch, updatedAt };
  memoryRuns.set(runId, next);
  return next;
}

export async function finalizeWatchRun(input: {
  run: WatchMeasurementRun;
  latest: ScanResult;
  baseline: ScanResult;
  history: ScanResult[];
  status: WatchStatus;
  nextRunAt: string;
}) {
  const completedAt = new Date().toISOString();
  if (durable()) {
    await supabase("rpc/aix_next_finalize_watch_run", {
      method: "POST",
      body: JSON.stringify({
        p_run_id: input.run.id,
        p_watch_token: input.run.watchToken,
        p_latest: input.latest,
        p_baseline: input.baseline,
        p_history: input.history,
        p_watch_status: input.status,
        p_next_run_at: input.nextRunAt,
        p_completed_at: completedAt,
      }),
    });
    const watch = await getWatch(input.run.watchToken);
    if (!watch) throw new Error("Watch完了後の状態を取得できませんでした。");
    return watch;
  }
  const watch = await updateWatch(input.run.watchToken, { latest: input.latest, baseline: input.baseline, history: input.history, status: input.status, nextRunAt: input.nextRunAt });
  if (!watch) throw new Error("Watch完了後の状態を取得できませんでした。");
  await updateWatchRun(input.run.id, { status: "completed", nextPromptIndex: input.run.prompts.length, error: null, completedAt });
  return watch;
}

export function mergeObservations(current: Observation[], incoming: Observation[]) {
  const merged = new Map<string, Observation>();
  for (const observation of [...current, ...incoming]) {
    const key = `${observation.promptId}:${observation.provider}:${observation.repetition}`;
    merged.set(key, observation);
  }
  return [...merged.values()];
}
