import "server-only";
import { id } from "@/lib/ids";
import { env } from "@/lib/env";
import type { BuyerPrompt, ChangePack, DomainClaim, EvidenceAnswer, ExecutionRecord, ScanRecord, ScanResult, WatchRecord } from "@/lib/types";

const globalMemory = globalThis as unknown as { aixNextScans?: Map<string, ScanRecord>; aixNextWatches?: Map<string, WatchRecord> };
const scans = globalMemory.aixNextScans ?? new Map<string, ScanRecord>();
const watches = globalMemory.aixNextWatches ?? new Map<string, WatchRecord>();
globalMemory.aixNextScans = scans; globalMemory.aixNextWatches = watches;

function durable() { return Boolean(env.supabaseUrl && env.supabaseServiceKey); }
async function supabase<T>(path: string, init: RequestInit = {}) {
  const response = await fetch(`${env.supabaseUrl}/rest/v1/${path}`, { ...init, headers: { apikey: env.supabaseServiceKey, authorization: `Bearer ${env.supabaseServiceKey}`, "content-type": "application/json", ...(init.headers || {}) } });
  if (!response.ok) throw new Error(`Storage ${response.status}: ${(await response.text()).slice(0, 300)}`);
  const text = await response.text(); return (text ? JSON.parse(text) : null) as T;
}
function scanFromRow(row: any): ScanRecord { return { id: row.id, targetUrl: row.target_url, stage: row.stage, progress: Number(row.progress), message: row.message || "", result: row.result || null, error: row.error || null, createdAt: row.created_at, updatedAt: row.updated_at }; }
function trialEndFromRow(row: any) { if (row.trial_ends_at) return String(row.trial_ends_at); const created = row.created_at ? new Date(row.created_at).getTime() : Date.now(); return new Date(created + 14 * 86_400_000).toISOString(); }
function watchFromRow(row: any): WatchRecord {
  return { id: row.id, token: row.token, email: row.email, scanId: row.scan_id, status: row.status, paid: Boolean(row.paid), baseline: row.baseline, latest: row.latest, history: row.history || [], discoveryLatest: row.discovery_latest || null, discoveryHistory: row.discovery_history || [], customPrompts: row.custom_prompts || [], customLatest: row.custom_latest || null, customHistory: row.custom_history || [], evidence: row.evidence || [], changePacks: row.change_packs || [], domainClaim: row.domain_claim || null, executions: row.executions || [], trialEndsAt: trialEndFromRow(row), nextRunAt: row.next_run_at, createdAt: row.created_at, updatedAt: row.updated_at };
}

export async function createScan(targetUrl: string) {
  const now = new Date().toISOString(); const record: ScanRecord = { id: id("scan"), targetUrl, stage: "created", progress: 0, message: "診断を準備しています。", result: null, error: null, createdAt: now, updatedAt: now };
  if (durable()) { const rows = await supabase<any[]>("aix_next_scans", { method: "POST", headers: { prefer: "return=representation" }, body: JSON.stringify({ id: record.id, target_url: targetUrl, stage: record.stage, progress: 0, message: record.message }) }); return scanFromRow(rows[0]); }
  scans.set(record.id, record); return record;
}
export async function updateScan(scanId: string, patch: Partial<Pick<ScanRecord, "stage" | "progress" | "message" | "result" | "error">>) {
  const updatedAt = new Date().toISOString();
  if (durable()) { const body: Record<string, unknown> = { updated_at: updatedAt }; if (patch.stage !== undefined) body.stage = patch.stage; if (patch.progress !== undefined) body.progress = patch.progress; if (patch.message !== undefined) body.message = patch.message; if (patch.result !== undefined) body.result = patch.result; if (patch.error !== undefined) body.error = patch.error; const rows = await supabase<any[]>(`aix_next_scans?id=eq.${encodeURIComponent(scanId)}`, { method: "PATCH", headers: { prefer: "return=representation" }, body: JSON.stringify(body) }); return rows[0] ? scanFromRow(rows[0]) : null; }
  const current = scans.get(scanId); if (!current) return null; const next = { ...current, ...patch, updatedAt }; scans.set(scanId, next); return next;
}
export async function getScan(scanId: string) { if (durable()) { const rows = await supabase<any[]>(`aix_next_scans?id=eq.${encodeURIComponent(scanId)}&limit=1`); return rows[0] ? scanFromRow(rows[0]) : null; } return scans.get(scanId) || null; }

export async function createWatch(scan: ScanRecord, email: string, coreBaseline?: ScanResult) {
  if (!scan.result) throw new Error("診断結果が完成していません。");
  const now = new Date(); const baseline = coreBaseline || scan.result;
  const record: WatchRecord = { id: id("watch"), token: id("token"), email: email.toLowerCase(), scanId: scan.id, status: "trial", paid: false, baseline, latest: baseline, history: [baseline], discoveryLatest: null, discoveryHistory: [], customPrompts: [], customLatest: null, customHistory: [], evidence: [], changePacks: [], domainClaim: null, executions: [], trialEndsAt: new Date(now.getTime() + 14 * 86_400_000).toISOString(), nextRunAt: new Date(now.getTime() + 7 * 86_400_000).toISOString(), createdAt: now.toISOString(), updatedAt: now.toISOString() };
  if (durable()) {
    const rows = await supabase<any[]>("aix_next_watches", { method: "POST", headers: { prefer: "return=representation" }, body: JSON.stringify({ id: record.id, token: record.token, email: record.email, scan_id: record.scanId, status: record.status, paid: false, baseline: record.baseline, latest: record.latest, history: record.history, discovery_latest: null, discovery_history: [], custom_prompts: [], custom_latest: null, custom_history: [], evidence: [], change_packs: [], domain_claim: null, executions: [], trial_ends_at: record.trialEndsAt, next_run_at: record.nextRunAt }) });
    return watchFromRow(rows[0]);
  }
  watches.set(record.token, record); return record;
}
export async function getWatch(token: string) { if (durable()) { const rows = await supabase<any[]>(`aix_next_watches?token=eq.${encodeURIComponent(token)}&limit=1`); return rows[0] ? watchFromRow(rows[0]) : null; } return watches.get(token) || null; }
export async function getWatchById(watchId: string) { if (durable()) { const rows = await supabase<any[]>(`aix_next_watches?id=eq.${encodeURIComponent(watchId)}&limit=1`); return rows[0] ? watchFromRow(rows[0]) : null; } return [...watches.values()].find((watch) => watch.id === watchId) || null; }

type WatchPatch = Partial<Pick<WatchRecord, "status" | "paid" | "baseline" | "latest" | "history" | "discoveryLatest" | "discoveryHistory" | "customPrompts" | "customLatest" | "customHistory" | "evidence" | "changePacks" | "domainClaim" | "executions" | "trialEndsAt" | "nextRunAt">>;
export async function updateWatch(token: string, patch: WatchPatch) {
  const updatedAt = new Date().toISOString();
  if (durable()) {
    const body: Record<string, unknown> = { updated_at: updatedAt };
    if (patch.status !== undefined) body.status = patch.status; if (patch.paid !== undefined) body.paid = patch.paid; if (patch.baseline !== undefined) body.baseline = patch.baseline; if (patch.latest !== undefined) body.latest = patch.latest; if (patch.history !== undefined) body.history = patch.history; if (patch.discoveryLatest !== undefined) body.discovery_latest = patch.discoveryLatest; if (patch.discoveryHistory !== undefined) body.discovery_history = patch.discoveryHistory; if (patch.customPrompts !== undefined) body.custom_prompts = patch.customPrompts; if (patch.customLatest !== undefined) body.custom_latest = patch.customLatest; if (patch.customHistory !== undefined) body.custom_history = patch.customHistory; if (patch.evidence !== undefined) body.evidence = patch.evidence; if (patch.changePacks !== undefined) body.change_packs = patch.changePacks; if (patch.domainClaim !== undefined) body.domain_claim = patch.domainClaim; if (patch.executions !== undefined) body.executions = patch.executions; if (patch.trialEndsAt !== undefined) body.trial_ends_at = patch.trialEndsAt; if (patch.nextRunAt !== undefined) body.next_run_at = patch.nextRunAt;
    const rows = await supabase<any[]>(`aix_next_watches?token=eq.${encodeURIComponent(token)}`, { method: "PATCH", headers: { prefer: "return=representation" }, body: JSON.stringify(body) }); return rows[0] ? watchFromRow(rows[0]) : null;
  }
  const current = watches.get(token); if (!current) return null; const next = { ...current, ...patch, updatedAt }; watches.set(token, next); return next;
}

export async function addEvidence(token: string, answer: Omit<EvidenceAnswer, "status" | "updatedAt">) { const watch = await getWatch(token); if (!watch) return null; const evidence = [...watch.evidence.filter((item) => item.gapId !== answer.gapId), { ...answer, status: "company_asserted" as const, updatedAt: new Date().toISOString() }]; return updateWatch(token, { evidence }); }
export async function saveChangePack(token: string, pack: ChangePack) { const watch = await getWatch(token); if (!watch) return null; const changePacks = [...(watch.changePacks || []).filter((item) => item.id !== pack.id), pack]; return updateWatch(token, { changePacks }); }
export async function saveCustomPrompts(token: string, prompts: BuyerPrompt[]) { return updateWatch(token, { customPrompts: prompts }); }
export async function saveDomainClaim(token: string, claim: DomainClaim) { return updateWatch(token, { domainClaim: claim }); }
export async function addExecution(token: string, execution: ExecutionRecord) { const watch = await getWatch(token); if (!watch) return null; return updateWatch(token, { executions: [...(watch.executions || []), execution].slice(-100) }); }
export async function listDueWatches(limit = 10) { const now = new Date().toISOString(); if (durable()) { const rows = await supabase<any[]>(`aix_next_watches?status=in.(trial,active,past_due)&next_run_at=lte.${encodeURIComponent(now)}&order=next_run_at.asc&limit=${Math.min(50, Math.max(1, limit))}`); return rows.map(watchFromRow); } return [...watches.values()].filter((watch) => ["trial", "active", "past_due"].includes(watch.status) && watch.nextRunAt <= now).slice(0, limit); }
