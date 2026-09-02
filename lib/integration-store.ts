import "server-only";
import { env } from "@/lib/env";
import { id } from "@/lib/ids";

type IntegrationKind = "github" | "wordpress";
export type GitHubIntegration = { kind: "github"; installationId: number; accountLogin?: string; connectedAt: string };
export type WordPressIntegration = { kind: "wordpress"; baseUrl: string; username: string; displayName?: string; connectedAt: string };
export type PublicIntegration = GitHubIntegration | WordPressIntegration;
type StoredIntegration = { id: string; watchId: string; kind: IntegrationKind; publicConfig: Record<string, unknown>; secretCiphertext?: string | null; createdAt: string; updatedAt: string };

const memory = globalThis as unknown as { aixIntegrations?: Map<string, StoredIntegration> };
const integrations = memory.aixIntegrations ?? new Map<string, StoredIntegration>(); memory.aixIntegrations = integrations;
function durable() { return Boolean(env.supabaseUrl && env.supabaseServiceKey); }
async function supabase<T>(path: string, init: RequestInit = {}) { const response = await fetch(`${env.supabaseUrl}/rest/v1/${path}`, { ...init, headers: { apikey: env.supabaseServiceKey, authorization: `Bearer ${env.supabaseServiceKey}`, "content-type": "application/json", ...(init.headers || {}) } }); if (!response.ok) throw new Error(`Integration storage ${response.status}: ${(await response.text()).slice(0, 240)}`); const text = await response.text(); return (text ? JSON.parse(text) : null) as T; }
function key(watchId: string, kind: IntegrationKind) { return `${watchId}:${kind}`; }
function row(row: any): StoredIntegration { return { id: row.id, watchId: row.watch_id, kind: row.kind, publicConfig: row.public_config || {}, secretCiphertext: row.secret_ciphertext || null, createdAt: row.created_at, updatedAt: row.updated_at }; }

export async function saveIntegration(watchId: string, kind: IntegrationKind, publicConfig: Record<string, unknown>, secretCiphertext?: string | null) {
  const now = new Date().toISOString();
  if (durable()) {
    const rows = await supabase<any[]>("aix_next_integrations?on_conflict=watch_id,kind", { method: "POST", headers: { prefer: "resolution=merge-duplicates,return=representation" }, body: JSON.stringify({ id: id("integration"), watch_id: watchId, kind, public_config: publicConfig, secret_ciphertext: secretCiphertext || null, updated_at: now }) });
    return row(rows[0]);
  }
  const existing = integrations.get(key(watchId, kind)); const stored: StoredIntegration = { id: existing?.id || id("integration"), watchId, kind, publicConfig, secretCiphertext: secretCiphertext ?? existing?.secretCiphertext ?? null, createdAt: existing?.createdAt || now, updatedAt: now }; integrations.set(key(watchId, kind), stored); return stored;
}

export async function getIntegration(watchId: string, kind: IntegrationKind) {
  if (durable()) { const rows = await supabase<any[]>(`aix_next_integrations?watch_id=eq.${encodeURIComponent(watchId)}&kind=eq.${kind}&limit=1`); return rows[0] ? row(rows[0]) : null; }
  return integrations.get(key(watchId, kind)) || null;
}

export async function integrationStatus(watchId: string) {
  const [github, wordpress] = await Promise.all([getIntegration(watchId, "github"), getIntegration(watchId, "wordpress")]);
  return {
    github: github ? { connected: true, installationId: Number(github.publicConfig.installationId || 0), accountLogin: String(github.publicConfig.accountLogin || ""), connectedAt: String(github.publicConfig.connectedAt || github.createdAt) } : { connected: false },
    wordpress: wordpress ? { connected: true, baseUrl: String(wordpress.publicConfig.baseUrl || ""), username: String(wordpress.publicConfig.username || ""), displayName: String(wordpress.publicConfig.displayName || ""), connectedAt: String(wordpress.publicConfig.connectedAt || wordpress.createdAt) } : { connected: false },
  };
}
