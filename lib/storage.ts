import "server-only";
import { id } from "@/lib/ids";
import { env } from "@/lib/env";
import type { EvidenceAnswer, ScanRecord, WatchRecord } from "@/lib/types";

const globalMemory = globalThis as unknown as {
  aixNextScans?: Map<string, ScanRecord>;
  aixNextWatches?: Map<string, WatchRecord>;
};
const scans = globalMemory.aixNextScans ?? new Map<string, ScanRecord>();
const watches = globalMemory.aixNextWatches ?? new Map<string, WatchRecord>();
globalMemory.aixNextScans = scans;
globalMemory.aixNextWatches = watches;

function durable() {
  return Boolean(env.supabaseUrl && env.supabaseServiceKey);
}

async function supabase<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(`${env.supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: {
      apikey: env.supabaseServiceKey,
      authorization: `Bearer ${env.supabaseServiceKey}`,
      "content-type": "application/json",
      ...(init.headers || {}),
    },
  });
  if (!response.ok) throw new Error(`Storage ${response.status}: ${(await response.text()).slice(0, 300)}`);
  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
}

function scanFromRow(row: any): ScanRecord {
  return { id: row.id, targetUrl: row.target_url, stage: row.stage, progress: Number(row.progress), message: row.message || "", result: row.result || null, error: row.error || null, createdAt: row.created_at, updatedAt: row.updated_at };
}

function watchFromRow(row: any): WatchRecord {
  return {
    id: row.id,
    token: row.token,
    email: row.email,
    scanId: row.scan_id,
    status: row.status,
    paid: Boolean(row.paid),
    stripeCustomerId: row.stripe_customer_id || undefined,
    stripeSubscriptionId: row.stripe_subscription_id || undefined,
    baseline: row.baseline,
    latest: row.latest,
    history: row.history || [],
    evidence: row.evidence || [],
    nextRunAt: row.next_run_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function createScan(targetUrl: string) {
  const now = new Date().toISOString();
  const record: ScanRecord = { id: id("scan"), targetUrl, stage: "created", progress: 0, message: "診断を準備しています。", result: null, error: null, createdAt: now, updatedAt: now };
  if (durable()) {
    const rows = await supabase<any[]>("aix_next_scans", { method: "POST", headers: { prefer: "return=representation" }, body: JSON.stringify({ id: record.id, target_url: targetUrl, stage: record.stage, progress: 0, message: record.message }) });
    return scanFromRow(rows[0]);
  }
  scans.set(record.id, record);
  return record;
}

export async function updateScan(scanId: string, patch: Partial<Pick<ScanRecord, "stage" | "progress" | "message" | "result" | "error">>) {
  const updatedAt = new Date().toISOString();
  if (durable()) {
    const body: Record<string, unknown> = { updated_at: updatedAt };
    if (patch.stage !== undefined) body.stage = patch.stage;
    if (patch.progress !== undefined) body.progress = patch.progress;
    if (patch.message !== undefined) body.message = patch.message;
    if (patch.result !== undefined) body.result = patch.result;
    if (patch.error !== undefined) body.error = patch.error;
    const rows = await supabase<any[]>(`aix_next_scans?id=eq.${encodeURIComponent(scanId)}`, { method: "PATCH", headers: { prefer: "return=representation" }, body: JSON.stringify(body) });
    return rows[0] ? scanFromRow(rows[0]) : null;
  }
  const current = scans.get(scanId);
  if (!current) return null;
  const next = { ...current, ...patch, updatedAt };
  scans.set(scanId, next);
  return next;
}

export async function getScan(scanId: string) {
  if (durable()) {
    const rows = await supabase<any[]>(`aix_next_scans?id=eq.${encodeURIComponent(scanId)}&limit=1`);
    return rows[0] ? scanFromRow(rows[0]) : null;
  }
  return scans.get(scanId) || null;
}

async function existingWatch(scanId: string, email: string) {
  if (durable()) {
    const rows = await supabase<any[]>(`aix_next_watches?scan_id=eq.${encodeURIComponent(scanId)}&email=eq.${encodeURIComponent(email)}&order=created_at.desc&limit=1`);
    return rows[0] ? watchFromRow(rows[0]) : null;
  }
  return [...watches.values()].find((watch) => watch.scanId === scanId && watch.email === email) || null;
}

export async function createWatch(scan: ScanRecord, email: string) {
  if (!scan.result) throw new Error("診断結果が完成していません。");
  const normalizedEmail = email.toLowerCase();
  const existing = await existingWatch(scan.id, normalizedEmail);
  if (existing) return existing;

  const now = new Date();
  const record: WatchRecord = {
    id: id("watch"),
    token: id("token"),
    email: normalizedEmail,
    scanId: scan.id,
    status: "trial",
    paid: false,
    baseline: scan.result,
    latest: scan.result,
    history: [scan.result],
    evidence: [],
    nextRunAt: new Date(now.getTime() + 7 * 86_400_000).toISOString(),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
  if (durable()) {
    try {
      const rows = await supabase<any[]>("aix_next_watches", { method: "POST", headers: { prefer: "return=representation" }, body: JSON.stringify({ id: record.id, token: record.token, email: record.email, scan_id: record.scanId, status: record.status, paid: false, baseline: record.baseline, latest: record.latest, history: record.history, evidence: [], next_run_at: record.nextRunAt }) });
      return watchFromRow(rows[0]);
    } catch (error) {
      const concurrent = await existingWatch(scan.id, normalizedEmail);
      if (concurrent) return concurrent;
      throw error;
    }
  }
  watches.set(record.token, record);
  return record;
}

export async function getWatch(token: string) {
  if (durable()) {
    const rows = await supabase<any[]>(`aix_next_watches?token=eq.${encodeURIComponent(token)}&limit=1`);
    return rows[0] ? watchFromRow(rows[0]) : null;
  }
  return watches.get(token) || null;
}

export async function updateWatch(token: string, patch: Partial<Pick<WatchRecord, "status" | "paid" | "stripeCustomerId" | "stripeSubscriptionId" | "baseline" | "latest" | "history" | "evidence" | "nextRunAt">>) {
  const updatedAt = new Date().toISOString();
  if (durable()) {
    const body: Record<string, unknown> = { updated_at: updatedAt };
    if (patch.status !== undefined) body.status = patch.status;
    if (patch.paid !== undefined) body.paid = patch.paid;
    if (patch.stripeCustomerId !== undefined) body.stripe_customer_id = patch.stripeCustomerId || null;
    if (patch.stripeSubscriptionId !== undefined) body.stripe_subscription_id = patch.stripeSubscriptionId || null;
    if (patch.baseline !== undefined) body.baseline = patch.baseline;
    if (patch.latest !== undefined) body.latest = patch.latest;
    if (patch.history !== undefined) body.history = patch.history;
    if (patch.evidence !== undefined) body.evidence = patch.evidence;
    if (patch.nextRunAt !== undefined) body.next_run_at = patch.nextRunAt;
    const rows = await supabase<any[]>(`aix_next_watches?token=eq.${encodeURIComponent(token)}`, { method: "PATCH", headers: { prefer: "return=representation" }, body: JSON.stringify(body) });
    return rows[0] ? watchFromRow(rows[0]) : null;
  }
  const current = watches.get(token);
  if (!current) return null;
  const next = { ...current, ...patch, updatedAt };
  watches.set(token, next);
  return next;
}

export async function addEvidence(token: string, answer: Omit<EvidenceAnswer, "status" | "updatedAt">) {
  const watch = await getWatch(token);
  if (!watch) return null;
  const evidence = [...watch.evidence.filter((item) => item.gapId !== answer.gapId), { ...answer, status: "company_asserted" as const, updatedAt: new Date().toISOString() }];
  return updateWatch(token, { evidence });
}

export async function listDueWatches(limit = 10) {
  const now = new Date().toISOString();
  if (durable()) {
    const rows = await supabase<any[]>(`aix_next_watches?status=in.(trial,active)&next_run_at=lte.${encodeURIComponent(now)}&order=next_run_at.asc&limit=${Math.min(50, Math.max(1, limit))}`);
    return rows.map(watchFromRow);
  }
  return [...watches.values()].filter((watch) => ["trial", "active"].includes(watch.status) && watch.nextRunAt <= now).slice(0, limit);
}
