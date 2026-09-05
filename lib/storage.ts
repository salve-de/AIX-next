import "server-only";
import { id } from "@/lib/ids";
import { env } from "@/lib/env";
import type {
  EvidenceAnswer,
  PublicProfileDraft,
  PublicProfileFact,
  PublicProfileRecord,
  ScanRecord,
  ScanResult,
  WatchRecord,
} from "@/lib/types";
import { buildPublicProfileDraft } from "@/lib/public-profile";

const globalMemory = globalThis as unknown as {
  aixNextScans?: Map<string, ScanRecord>;
  aixNextWatches?: Map<string, WatchRecord>;
  aixNextPublicProfiles?: Map<string, PublicProfileRecord>;
};
const scans = globalMemory.aixNextScans ?? new Map<string, ScanRecord>();
const watches = globalMemory.aixNextWatches ?? new Map<string, WatchRecord>();
const publicProfiles = globalMemory.aixNextPublicProfiles ?? new Map<string, PublicProfileRecord>();
globalMemory.aixNextScans = scans;
globalMemory.aixNextWatches = watches;
globalMemory.aixNextPublicProfiles = publicProfiles;

const PUBLIC_PROFILE_DEFAULT_TTL_DAYS = 30;
const PUBLIC_PROFILE_MAX_TTL_DAYS = 365;
const DAY_MS = 86_400_000;

type PublicProfileStorageOptions = {
  sourceScanId?: string;
  expiresInDays?: number;
  /** Test/maintenance hook; regular callers should use the current time. */
  now?: Date | string;
  /** Explicit expiry is useful when restoring a record; it is not user input. */
  expiresAt?: string;
};

function profileDate(value?: Date | string) {
  const date = value instanceof Date ? new Date(value.getTime()) : new Date(value || Date.now());
  if (Number.isNaN(date.getTime())) throw new Error("公開レコードの日時が不正です。");
  return date;
}

function profileSlug(targetUrl: string) {
  let host = "company";
  try {
    host = new URL(targetUrl).hostname.replace(/^www\./i, "").replace(/[^a-z0-9]+/gi, "-").replace(/^-+|-+$/g, "").toLowerCase() || host;
  } catch {
    host = "company";
  }
  return host;
}

function clonePublicProfileDraft(draft: PublicProfileDraft): PublicProfileDraft {
  return {
    title: draft.title,
    brandName: draft.brandName,
    targetUrl: draft.targetUrl,
    summary: draft.summary,
    market: draft.market,
    targetCustomers: [...draft.targetCustomers],
    useCases: [...draft.useCases],
    facts: draft.facts.map((fact) => ({ ...fact })),
    sourcePages: draft.sourcePages.map((page) => ({ ...page })),
    structuredData: draft.structuredData,
    markdown: draft.markdown,
    json: draft.json,
  };
}

function markExpired(record: PublicProfileRecord, now: Date) {
  if ((record.status === "draft" || record.status === "published") && new Date(record.expiresAt).getTime() <= now.getTime()) {
    const expired = { ...record, status: "expired" as const, updatedAt: now.toISOString() };
    publicProfiles.set(record.id, expired);
    return expired;
  }
  return record;
}

function durable() {
  return Boolean(env.supabaseUrl && env.supabaseServiceKey);
}

async function supabase<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${env.supabaseUrl}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: env.supabaseServiceKey,
      authorization: `Bearer ${env.supabaseServiceKey}`,
      "content-type": "application/json",
      ...(options.headers || {}),
    },
  });
  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(`Supabase operation failed: ${response.status} ${message}`);
  }
  return response.json() as Promise<T>;
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
    changePack: row.change_pack || null,
    competitorEvents: row.competitor_events || undefined,
    autoActions: row.auto_actions || undefined,
    autoActionImpacts: row.auto_action_impacts || undefined,
    nextRunAt: row.next_run_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function publicProfileFromRow(row: any): PublicProfileRecord {
  return {
    id: String(row.id),
    slug: String(row.slug),
    status: row.status as PublicProfileRecord["status"],
    title: String(row.title || ""),
    brandName: String(row.brand_name || ""),
    targetUrl: String(row.target_url || ""),
    summary: String(row.summary || ""),
    market: String(row.market || ""),
    targetCustomers: Array.isArray(row.target_customers) ? row.target_customers.map(String) : [],
    useCases: Array.isArray(row.use_cases) ? row.use_cases.map(String) : [],
    facts: Array.isArray(row.facts) ? row.facts : [],
    sourcePages: Array.isArray(row.source_pages) ? row.source_pages : [],
    structuredData: String(row.structured_data || ""),
    markdown: String(row.markdown || ""),
    json: String(row.json || ""),
    token: String(row.token || ""),
    sourceScanId: String(row.source_scan_id || "unknown"),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at),
    expiresAt: String(row.expires_at),
    ...(row.published_at ? { publishedAt: String(row.published_at) } : {}),
  };
}

function publicProfileRow(record: PublicProfileRecord) {
  return {
    id: record.id,
    slug: record.slug,
    status: record.status,
    title: record.title,
    brand_name: record.brandName,
    target_url: record.targetUrl,
    summary: record.summary,
    market: record.market,
    target_customers: record.targetCustomers,
    use_cases: record.useCases,
    facts: record.facts,
    source_pages: record.sourcePages,
    structured_data: record.structuredData,
    markdown: record.markdown,
    json: record.json,
    token: record.token,
    source_scan_id: record.sourceScanId,
    created_at: record.createdAt,
    updated_at: record.updatedAt,
    expires_at: record.expiresAt,
    published_at: record.publishedAt || null,
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

/**
 * Create a non-public preview. With Supabase configured the record is durable;
 * local development keeps it in the process store. Only an explicit publish
 * call changes its status to indexable. The bearer token is returned to the
 * caller once and is never included in public views.
 */
export async function createPublicProfilePreview(draft: PublicProfileDraft, options: PublicProfileStorageOptions = {}) {
  const now = profileDate(options.now);
  const expiresAt = options.expiresAt
    ? profileDate(options.expiresAt).toISOString()
    : (() => {
        const days = options.expiresInDays ?? PUBLIC_PROFILE_DEFAULT_TTL_DAYS;
        if (!Number.isInteger(days) || days < 1 || days > PUBLIC_PROFILE_MAX_TTL_DAYS) {
          throw new Error(`公開ページの期限は1〜${PUBLIC_PROFILE_MAX_TTL_DAYS}日で指定してください。`);
        }
        return new Date(now.getTime() + days * DAY_MS).toISOString();
      })();
  const record: PublicProfileRecord = {
    ...clonePublicProfileDraft(draft),
    id: id("profile"),
    slug: profileSlug(draft.targetUrl),
    status: "draft",
    token: id("profile_token"),
    sourceScanId: options.sourceScanId || "unknown",
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
    expiresAt,
  };
  if (durable()) {
    try {
      const rows = await supabase<any[]>("aix_next_public_profiles", { method: "POST", headers: { prefer: "return=representation" }, body: JSON.stringify(publicProfileRow(record)) });
      const persisted = rows[0] ? publicProfileFromRow(rows[0]) : null;
      if (!persisted) throw new Error("公開レコードを保存できませんでした。");
      publicProfiles.set(persisted.id, persisted);
      return persisted;
    } catch (error) {
      publicProfiles.delete(record.id);
      throw error;
    }
  }
  publicProfiles.set(record.id, record);
  return record;
}

/** Alias that makes the lifecycle verb explicit at call sites. */
export const previewPublicProfile = createPublicProfilePreview;
export const previewPublicProfileRecord = createPublicProfilePreview;

/**
 * Read an internal profile record by id. Callers serving a response must pass
 * it through `toPublicProfile` so the bearer token and source scan id cannot
 * accidentally cross the API boundary.
 */
export async function getPublicProfile(profileId: string, now?: Date | string) {
  const at = profileDate(now);
  if (durable()) {
    const rows = await supabase<any[]>(`aix_next_public_profiles?id=eq.${encodeURIComponent(profileId)}&limit=1`);
    const record = rows[0] ? publicProfileFromRow(rows[0]) : null;
    return record ? markExpired(record, at) : null;
  }
  const record = publicProfiles.get(profileId);
  return record ? markExpired(record, at) : null;
}

export async function getPublicProfileByToken(token: string, now?: Date | string) {
  if (!token) return null;
  const at = profileDate(now);
  if (durable()) {
    const rows = await supabase<any[]>(`aix_next_public_profiles?token=eq.${encodeURIComponent(token)}&limit=1`);
    const record = rows[0] ? publicProfileFromRow(rows[0]) : null;
    return record ? markExpired(record, at) : null;
  }
  const record = [...publicProfiles.values()].find((candidate) => candidate.token === token);
  return record ? markExpired(record, at) : null;
}

export async function getPublicProfileBySlug(slug: string, now?: Date | string) {
  if (!slug) return null;
  const at = profileDate(now);
  if (durable()) {
    const rows = await supabase<any[]>(`aix_next_public_profiles?slug=eq.${encodeURIComponent(slug)}&limit=1`);
    const record = rows[0] ? publicProfileFromRow(rows[0]) : null;
    return record ? markExpired(record, at) : null;
  }
  const record = [...publicProfiles.values()].find((candidate) => candidate.slug === slug);
  return record ? markExpired(record, at) : null;
}

/** A public route may resolve only an explicitly published, non-expired record. */
export async function getActivePublicProfileBySlug(slug: string, now?: Date | string) {
  const at = profileDate(now);
  const record = await getPublicProfileBySlug(slug, at);
  return record && record.status === "published" && new Date(record.expiresAt).getTime() > at.getTime() ? record : null;
}

export async function listActivePublicProfiles(now?: Date | string) {
  const at = profileDate(now);
  if (durable()) {
    const rows = await supabase<any[]>(`aix_next_public_profiles?status=eq.published&expires_at=gt.${encodeURIComponent(at.toISOString())}&order=updated_at.desc`);
    return rows.map(publicProfileFromRow);
  }
  return [...publicProfiles.values()]
    .map((record) => markExpired(record, at))
    .filter((record) => record.status === "published" && new Date(record.expiresAt).getTime() > at.getTime());
}

export const getActivePublicProfiles = listActivePublicProfiles;

/** Publish requires both the profile id and the unguessable preview token. */
export async function publishPublicProfile(profileId: string, token: string, now?: Date | string) {
  const at = profileDate(now);
  const record = await getPublicProfile(profileId, at);
  if (!record || record.token !== token) return null;
  if (!record || record.status === "revoked" || record.status === "expired") return null;
  if (record.status === "published") return record;
  const publishedAt = record.publishedAt || at.toISOString();
  const published: PublicProfileRecord = {
    ...record,
    status: "published",
    publishedAt,
    updatedAt: at.toISOString(),
  };
  if (durable()) {
    const rows = await supabase<any[]>(`aix_next_public_profiles?id=eq.${encodeURIComponent(profileId)}&token=eq.${encodeURIComponent(token)}&status=eq.draft`, { method: "PATCH", headers: { prefer: "return=representation" }, body: JSON.stringify({ status: "published", published_at: publishedAt, updated_at: at.toISOString() }) });
    return rows[0] ? publicProfileFromRow(rows[0]) : null;
  }
  publicProfiles.set(profileId, published);
  return published;
}

/** Revoke is immediate for both the durable and local public route/list. */
export async function revokePublicProfile(profileId: string, token: string, now?: Date | string) {
  const at = profileDate(now);
  const record = await getPublicProfile(profileId, at);
  if (!record || record.token !== token) return null;
  if (!record || record.status === "revoked") return null;
  const revoked: PublicProfileRecord = { ...record, status: "revoked", updatedAt: at.toISOString() };
  if (durable()) {
    const rows = await supabase<any[]>(`aix_next_public_profiles?id=eq.${encodeURIComponent(profileId)}&token=eq.${encodeURIComponent(token)}&status=in.(draft,published)`, { method: "PATCH", headers: { prefer: "return=representation" }, body: JSON.stringify({ status: "revoked", updated_at: at.toISOString() }) });
    return rows[0] ? publicProfileFromRow(rows[0]) : null;
  }
  publicProfiles.set(profileId, revoked);
  return revoked;
}

export async function updatePublicProfileDirect(slug: string, patch: {
  brandName?: string;
  market?: string;
  summary?: string;
  facts?: PublicProfileRecord["facts"];
}) {
  const current = await getPublicProfileBySlug(slug);
  if (!current) return null;

  const updatedAt = new Date().toISOString();
  const nextBrand = patch.brandName || current.brandName;
  const nextMarket = patch.market || current.market;
  const nextSummary = patch.summary || current.summary;
  const nextFacts = patch.facts || current.facts;

  const updated: PublicProfileRecord = {
    ...current,
    brandName: nextBrand,
    market: nextMarket,
    summary: nextSummary,
    facts: nextFacts,
    updatedAt,
  };

  if (durable()) {
    const rows = await supabase<any[]>(`aix_next_public_profiles?slug=eq.${encodeURIComponent(slug)}`, {
      method: "PATCH",
      headers: { prefer: "return=representation" },
      body: JSON.stringify({
        brand_name: nextBrand,
        market: nextMarket,
        summary: nextSummary,
        facts: nextFacts,
        updated_at: updatedAt,
      }),
    });
    return rows[0] ? publicProfileFromRow(rows[0]) : null;
  }
  publicProfiles.set(current.id, updated);
  return updated;
}

export async function getRecentCompletedScan(targetUrl: string, maxAgeMs = 10 * 60_000) {
  const cutoff = Date.now() - maxAgeMs;
  if (durable()) {
    const rows = await supabase<any[]>(`aix_next_scans?target_url=eq.${encodeURIComponent(targetUrl)}&stage=in.(complete,partial)&order=updated_at.desc&limit=1`);
    if (!rows[0]) return null;
    const scan = scanFromRow(rows[0]);
    return scan.result && new Date(scan.updatedAt).getTime() >= cutoff ? scan : null;
  }
  return [...scans.values()]
    .filter((scan) => scan.targetUrl === targetUrl && scan.result && ["complete", "partial"].includes(scan.stage) && new Date(scan.updatedAt).getTime() >= cutoff)
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())[0] || null;
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
    changePack: null,
    nextRunAt: new Date(now.getTime() + 7 * 86_400_000).toISOString(),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
  if (durable()) {
    try {
      const rows = await supabase<any[]>("aix_next_watches", { method: "POST", headers: { prefer: "return=representation" }, body: JSON.stringify({ id: record.id, token: record.token, email: record.email, scan_id: record.scanId, status: record.status, paid: false, baseline: record.baseline, latest: record.latest, history: record.history, evidence: [], change_pack: null, next_run_at: record.nextRunAt }) });
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

/**
 * Remove local fallback records used when Supabase is not configured.
 * Production deletion is handled by the privacy service with its audit row;
 * keeping this operation here prevents that service from reaching into the
 * storage maps directly.
 */
export function deleteMemoryWatchData(token: string, scanId: string) {
  const removed = watches.delete(token);
  if (!removed) return false;
  const scanStillReferenced = [...watches.values()].some((watch) => watch.scanId === scanId);
  if (!scanStillReferenced) scans.delete(scanId);
  return true;
}

export async function updateWatch(token: string, patch: Partial<Pick<WatchRecord, "status" | "paid" | "stripeCustomerId" | "stripeSubscriptionId" | "baseline" | "latest" | "history" | "evidence" | "changePack" | "competitorEvents" | "autoActions" | "autoActionImpacts" | "nextRunAt">>) {
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
    if (patch.changePack !== undefined) body.change_pack = patch.changePack;
    if (patch.competitorEvents !== undefined) body.competitor_events = patch.competitorEvents;
    if (patch.autoActions !== undefined) body.auto_actions = patch.autoActions;
    if (patch.autoActionImpacts !== undefined) body.auto_action_impacts = patch.autoActionImpacts;
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

/**
 * 週次Watch測定完了時に、最新のクロール・診断結果からAI公開台帳（Public Profile）を自動同期・更新する。
 * （P0-2: 台帳自動メンテナンスの完全自動化）
 */
export async function refreshPublicProfileFromScan(targetUrl: string, scan: ScanResult, now?: Date | string) {
  const at = profileDate(now);
  const slug = profileSlug(targetUrl);
  const existing = await getPublicProfileBySlug(slug, at);
  if (!existing || existing.status !== "published") return null;

  const draft = buildPublicProfileDraft(scan, at.toISOString());

  const updated: PublicProfileRecord = {
    ...existing,
    title: draft.title,
    summary: draft.summary,
    market: draft.market,
    targetCustomers: draft.targetCustomers,
    useCases: draft.useCases,
    facts: draft.facts,
    sourcePages: draft.sourcePages,
    structuredData: draft.structuredData,
    markdown: draft.markdown,
    json: draft.json,
    updatedAt: at.toISOString(),
    expiresAt: new Date(at.getTime() + PUBLIC_PROFILE_DEFAULT_TTL_DAYS * DAY_MS).toISOString(),
  };

  if (durable()) {
    const rows = await supabase<any[]>(`aix_next_public_profiles?id=eq.${encodeURIComponent(existing.id)}`, {
      method: "PATCH",
      headers: { prefer: "return=representation" },
      body: JSON.stringify(publicProfileRow(updated)),
    });
    return rows[0] ? publicProfileFromRow(rows[0]) : null;
  }

  publicProfiles.set(existing.id, updated);
  return updated;
}

/**
 * 競合の動きに対する自律対応（AutoAction）として、検証済みFactをAI公式台帳に自動追加・補強する。
 */
export async function addFactToPublicProfile(targetUrl: string, fact: PublicProfileFact, now?: Date | string) {
  const at = profileDate(now);
  const slug = profileSlug(targetUrl);
  const existing = await getPublicProfileBySlug(slug, at);
  if (!existing || existing.status !== "published") return null;

  const facts = [...existing.facts.filter((f) => f.label !== fact.label), fact];
  const updated: PublicProfileRecord = {
    ...existing,
    facts,
    updatedAt: at.toISOString(),
  };

  if (durable()) {
    const rows = await supabase<any[]>(`aix_next_public_profiles?id=eq.${encodeURIComponent(existing.id)}`, {
      method: "PATCH",
      headers: { prefer: "return=representation" },
      body: JSON.stringify(publicProfileRow(updated)),
    });
    return rows[0] ? publicProfileFromRow(rows[0]) : null;
  }

  publicProfiles.set(existing.id, updated);
  return updated;
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

export async function claimDueWatches(limit = 5, leaseSeconds = 900) {
  const safeLimit = Math.min(50, Math.max(1, Math.floor(limit)));
  const safeLease = Math.max(60, Math.floor(leaseSeconds));
  if (durable()) {
    const rows = await supabase<any[]>("rpc/aix_next_claim_due_watches", {
      method: "POST",
      body: JSON.stringify({ p_limit: safeLimit, p_lease_seconds: safeLease }),
    });
    return rows.map(watchFromRow);
  }
  const now = Date.now();
  const claimedAt = new Date().toISOString();
  const leaseUntil = new Date(now + safeLease * 1000).toISOString();
  const due = [...watches.values()]
    .filter((watch) => ["trial", "active"].includes(watch.status) && new Date(watch.nextRunAt).getTime() <= now)
    .sort((a, b) => new Date(a.nextRunAt).getTime() - new Date(b.nextRunAt).getTime())
    .slice(0, safeLimit);
  return due.map((watch) => {
    const claimed = { ...watch, nextRunAt: leaseUntil, updatedAt: claimedAt };
    watches.set(watch.token, claimed);
    return claimed;
  });
}
