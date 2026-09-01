import "server-only";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { randomUUID } from "node:crypto";
import { env } from "@/lib/env";
import { randomToken } from "@/lib/security";
import type { EvidenceAnswer, ScanRecord, ScanResult, ScanStage, WatchRecord } from "@/lib/types";

type JsonDatabase = { scans: Record<string, ScanRecord>; watches: Record<string, WatchRecord> };
const emptyDb = (): JsonDatabase => ({ scans: {}, watches: {} });
let queue = Promise.resolve();

function hasSupabase() { return Boolean(env.supabaseUrl && env.supabaseServiceKey); }

async function supabase<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(`${env.supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: env.supabaseServiceKey, authorization: `Bearer ${env.supabaseServiceKey}`, "content-type": "application/json", ...(init.headers || {}) },
  });
  if (!response.ok) throw new Error(`Supabase ${response.status}: ${(await response.text()).slice(0, 300)}`);
  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
}

async function readDb() {
  try { return JSON.parse(await readFile(env.storePath, "utf8")) as JsonDatabase; }
  catch { return emptyDb(); }
}

async function writeDb(db: JsonDatabase) {
  await mkdir(dirname(env.storePath), { recursive: true });
  const temporary = `${env.storePath}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(temporary, JSON.stringify(db, null, 2), "utf8");
  await rename(temporary, env.storePath);
}

async function mutate<T>(fn: (db: JsonDatabase) => Promise<T> | T) {
  let output!: T;
  queue = queue.then(async () => { const db = await readDb(); output = await fn(db); await writeDb(db); });
  await queue;
  return output;
}

function rowToScan(row: any): ScanRecord { return row.payload as ScanRecord; }
function rowToWatch(row: any): WatchRecord { return row.payload as WatchRecord; }

export async function createScan(url: string) {
  const now = new Date().toISOString();
  const record: ScanRecord = { id: randomUUID(), url, stage: "queued", progress: 0, message: "診断を準備しています", result: null, error: null, createdAt: now, updatedAt: now };
  if (hasSupabase()) {
    const rows = await supabase<any[]>("aix_next_scans", { method: "POST", headers: { prefer: "return=representation" }, body: JSON.stringify({ id: record.id, payload: record }) });
    return rowToScan(rows[0]);
  }
  await mutate((db) => { db.scans[record.id] = record; });
  return record;
}

export async function updateScan(id: string, patch: Partial<Pick<ScanRecord, "stage" | "progress" | "message" | "result" | "error">>) {
  if (hasSupabase()) {
    const current = await getScan(id); if (!current) return null;
    const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
    const rows = await supabase<any[]>(`aix_next_scans?id=eq.${encodeURIComponent(id)}`, { method: "PATCH", headers: { prefer: "return=representation" }, body: JSON.stringify({ payload: next, updated_at: next.updatedAt }) });
    return rows[0] ? rowToScan(rows[0]) : null;
  }
  return mutate((db) => { const current = db.scans[id]; if (!current) return null; const next = { ...current, ...patch, updatedAt: new Date().toISOString() }; db.scans[id] = next; return next; });
}

export async function getScan(id: string) {
  if (hasSupabase()) {
    const rows = await supabase<any[]>(`aix_next_scans?id=eq.${encodeURIComponent(id)}&limit=1`);
    return rows[0] ? rowToScan(rows[0]) : null;
  }
  return (await readDb()).scans[id] || null;
}

export async function createWatch(scan: ScanRecord, email: string) {
  if (!scan.result) throw new Error("診断結果がありません。");
  const now = new Date();
  const record: WatchRecord = {
    id: randomUUID(), token: randomToken(), email, scanId: scan.id, baseline: scan.result, latest: scan.result, history: [scan.result], evidence: [], status: "trial", paid: false,
    nextRunAt: new Date(now.getTime() + 7 * 86_400_000).toISOString(), createdAt: now.toISOString(), updatedAt: now.toISOString(),
  };
  if (hasSupabase()) {
    const rows = await supabase<any[]>("aix_next_watches", { method: "POST", headers: { prefer: "return=representation" }, body: JSON.stringify({ id: record.id, token: record.token, payload: record }) });
    return rowToWatch(rows[0]);
  }
  await mutate((db) => { db.watches[record.id] = record; });
  return record;
}

export async function getWatch(id: string, token: string) {
  if (hasSupabase()) {
    const rows = await supabase<any[]>(`aix_next_watches?id=eq.${encodeURIComponent(id)}&token=eq.${encodeURIComponent(token)}&limit=1`);
    return rows[0] ? rowToWatch(rows[0]) : null;
  }
  const record = (await readDb()).watches[id];
  return record?.token === token ? record : null;
}

export async function updateWatch(id: string, token: string, patch: Partial<Pick<WatchRecord, "latest" | "history" | "evidence" | "status" | "paid" | "nextRunAt">>) {
  const current = await getWatch(id, token); if (!current) return null;
  const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
  if (hasSupabase()) {
    const rows = await supabase<any[]>(`aix_next_watches?id=eq.${encodeURIComponent(id)}&token=eq.${encodeURIComponent(token)}`, { method: "PATCH", headers: { prefer: "return=representation" }, body: JSON.stringify({ payload: next, updated_at: next.updatedAt }) });
    return rows[0] ? rowToWatch(rows[0]) : null;
  }
  return mutate((db) => { db.watches[id] = next; return next; });
}

export async function addEvidence(id: string, token: string, answer: Omit<EvidenceAnswer, "updatedAt" | "status">) {
  const watch = await getWatch(id, token); if (!watch) return null;
  const evidence: EvidenceAnswer[] = [...watch.evidence.filter((item) => item.gapId !== answer.gapId), { ...answer, status: "company_asserted", updatedAt: new Date().toISOString() }];
  return updateWatch(id, token, { evidence });
}

export async function listDueWatches(limit = 10) {
  const now = new Date().toISOString();
  if (hasSupabase()) {
    const rows = await supabase<any[]>(`aix_next_watches?order=updated_at.asc&limit=${Math.min(100, limit)}`);
    return rows.map(rowToWatch).filter((item) => ["trial", "active"].includes(item.status) && item.nextRunAt <= now);
  }
  return Object.values((await readDb()).watches).filter((item) => ["trial", "active"].includes(item.status) && item.nextRunAt <= now).slice(0, limit);
}

export async function markScanFailure(id: string, stage: ScanStage, error: unknown) {
  return updateScan(id, { stage, error: error instanceof Error ? error.message : "診断に失敗しました。", message: "診断を完了できませんでした" });
}
