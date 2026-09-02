import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { env } from "@/lib/env";
import { getWatch } from "@/lib/storage";
import type { AgentSignalKind } from "@/lib/agent-signals";

export type AgentEventInput = {
  occurredAt: string;
  kind: AgentSignalKind;
  agent: string;
  path: string;
  referrerDomain?: string;
  statusCode?: number;
  conversion?: boolean;
  conversionType?: string;
  conversionValue?: number;
  currency?: string;
};

export type AgentAnalyticsSummary = {
  since: string;
  crawlerVisits: number;
  referralVisits: number;
  conversions: number;
  observedValue: number;
  currency: string | null;
  agents: Array<{ agent: string; kind: AgentSignalKind; events: number; conversions: number; observedValue: number }>;
  pages: Array<{ path: string; crawlerVisits: number; referralVisits: number; conversions: number; observedValue: number }>;
  conversionTypes: Array<{ type: string; conversions: number; observedValue: number }>;
};

const memory = globalThis as unknown as { aixAgentKeyToToken?: Map<string, string>; aixAgentEvents?: Map<string, AgentEventInput[]> };
const keys = memory.aixAgentKeyToToken ?? new Map<string, string>(); const events = memory.aixAgentEvents ?? new Map<string, AgentEventInput[]>(); memory.aixAgentKeyToToken = keys; memory.aixAgentEvents = events;
function durable() { return Boolean(env.supabaseUrl && env.supabaseServiceKey); }
function hashKey(value: string) { return createHash("sha256").update(value).digest("hex"); }
async function supabase<T>(path: string, init: RequestInit = {}) { const response = await fetch(`${env.supabaseUrl}/rest/v1/${path}`, { ...init, headers: { apikey: env.supabaseServiceKey, authorization: `Bearer ${env.supabaseServiceKey}`, "content-type": "application/json", ...(init.headers || {}) } }); if (!response.ok) throw new Error(`Agent analytics storage ${response.status}: ${(await response.text()).slice(0, 240)}`); const text = await response.text(); return (text ? JSON.parse(text) : null) as T; }

export async function rotateAgentIngestKey(token: string) {
  const watch = await getWatch(token); if (!watch) return null;
  const key = `aix_ingest_${randomBytes(24).toString("base64url")}`; const hash = hashKey(key);
  if (durable()) await supabase(`aix_next_watches?token=eq.${encodeURIComponent(token)}`, { method: "PATCH", body: JSON.stringify({ agent_ingest_key_hash: hash, updated_at: new Date().toISOString() }) });
  keys.set(hash, token); return { key, watchId: watch.id };
}

export async function resolveAgentIngestKey(key: string) {
  const hash = hashKey(key);
  if (durable()) { const rows = await supabase<Array<{ token: string; id: string }>>(`aix_next_watches?agent_ingest_key_hash=eq.${hash}&select=token,id&limit=1`); if (!rows[0]) return null; const watch = await getWatch(rows[0].token); return watch ? { watch, watchId: rows[0].id } : null; }
  const token = keys.get(hash); if (!token) return null; const watch = await getWatch(token); return watch ? { watch, watchId: watch.id } : null;
}

function normalizeValue(value: unknown) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.round(parsed * 100) / 100 : undefined;
}

export async function addAgentEvents(watchId: string, input: AgentEventInput[]) {
  const rows = input.slice(0, 100).map((event) => ({
    ...event,
    occurredAt: new Date(event.occurredAt).toISOString(),
    path: event.path.slice(0, 500),
    agent: event.agent.slice(0, 80),
    referrerDomain: event.referrerDomain?.slice(0, 160),
    statusCode: event.statusCode ? Math.max(100, Math.min(599, Math.round(event.statusCode))) : undefined,
    conversion: Boolean(event.conversion),
    conversionType: event.conversionType?.trim().slice(0, 80) || undefined,
    conversionValue: normalizeValue(event.conversionValue),
    currency: event.currency?.trim().toUpperCase().slice(0, 8) || undefined,
  }));
  if (durable()) {
    await supabase("aix_next_agent_events", {
      method: "POST",
      headers: { prefer: "return=minimal" },
      body: JSON.stringify(rows.map((event) => ({
        id: `agent_${randomBytes(12).toString("hex")}`,
        watch_id: watchId,
        occurred_at: event.occurredAt,
        kind: event.kind,
        agent: event.agent,
        path: event.path,
        referrer_domain: event.referrerDomain || null,
        status_code: event.statusCode || null,
        conversion: event.conversion,
        conversion_type: event.conversionType || null,
        conversion_value: event.conversionValue ?? null,
        currency: event.currency || null,
      })),
    });
    return rows.length;
  }
  const current = events.get(watchId) || []; events.set(watchId, [...current, ...rows].slice(-5000)); return rows.length;
}

export async function getAgentAnalytics(watchId: string, days = 30): Promise<AgentAnalyticsSummary> {
  const since = new Date(Date.now() - Math.max(1, Math.min(365, days)) * 86_400_000).toISOString();
  let rows: AgentEventInput[];
  if (durable()) {
    const db = await supabase<Array<{ occurred_at: string; kind: AgentSignalKind; agent: string; path: string; referrer_domain?: string | null; status_code?: number | null; conversion?: boolean; conversion_type?: string | null; conversion_value?: number | string | null; currency?: string | null }>>(`aix_next_agent_events?watch_id=eq.${encodeURIComponent(watchId)}&occurred_at=gte.${encodeURIComponent(since)}&order=occurred_at.desc&limit=5000`);
    rows = db.map((row) => ({ occurredAt: row.occurred_at, kind: row.kind, agent: row.agent, path: row.path, referrerDomain: row.referrer_domain || undefined, statusCode: row.status_code || undefined, conversion: Boolean(row.conversion), conversionType: row.conversion_type || undefined, conversionValue: normalizeValue(row.conversion_value), currency: row.currency || undefined }));
  } else rows = (events.get(watchId) || []).filter((row) => row.occurredAt >= since);

  const currencies = [...new Set(rows.filter((row) => row.conversionValue !== undefined && row.currency).map((row) => row.currency!))];
  const comparableCurrency = currencies.length === 1 ? currencies[0] : null;
  const eventValue = (row: AgentEventInput) => comparableCurrency && row.currency === comparableCurrency ? row.conversionValue || 0 : 0;
  const agentMap = new Map<string, { agent: string; kind: AgentSignalKind; events: number; conversions: number; observedValue: number }>();
  const pageMap = new Map<string, { path: string; crawlerVisits: number; referralVisits: number; conversions: number; observedValue: number }>();
  const typeMap = new Map<string, { type: string; conversions: number; observedValue: number }>();

  for (const row of rows) {
    const agentKey = `${row.kind}:${row.agent}`;
    const a = agentMap.get(agentKey) || { agent: row.agent, kind: row.kind, events: 0, conversions: 0, observedValue: 0 };
    a.events += 1; if (row.conversion) a.conversions += 1; a.observedValue += eventValue(row); agentMap.set(agentKey, a);
    const page = pageMap.get(row.path) || { path: row.path, crawlerVisits: 0, referralVisits: 0, conversions: 0, observedValue: 0 };
    if (row.kind === "crawler") page.crawlerVisits += 1; else page.referralVisits += 1; if (row.conversion) page.conversions += 1; page.observedValue += eventValue(row); pageMap.set(row.path, page);
    if (row.conversion) {
      const type = row.conversionType || "conversion";
      const entry = typeMap.get(type) || { type, conversions: 0, observedValue: 0 };
      entry.conversions += 1; entry.observedValue += eventValue(row); typeMap.set(type, entry);
    }
  }

  return {
    since,
    crawlerVisits: rows.filter((row) => row.kind === "crawler").length,
    referralVisits: rows.filter((row) => row.kind === "referral").length,
    conversions: rows.filter((row) => row.conversion).length,
    observedValue: comparableCurrency ? rows.reduce((sum, row) => sum + eventValue(row), 0) : 0,
    currency: comparableCurrency,
    agents: [...agentMap.values()].sort((a, b) => b.events - a.events),
    pages: [...pageMap.values()].sort((a, b) => (b.referralVisits + b.conversions * 3 + b.crawlerVisits * .2) - (a.referralVisits + a.conversions * 3 + a.crawlerVisits * .2)).slice(0, 30),
    conversionTypes: [...typeMap.values()].sort((a, b) => b.conversions - a.conversions),
  };
}
