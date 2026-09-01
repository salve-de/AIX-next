import "server-only";
import { createHash } from "node:crypto";
import { env } from "@/lib/env";
import { getWatch } from "@/lib/storage";

function hash(value: string) {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

async function supabase(path: string, init: RequestInit = {}) {
  if (!env.supabaseUrl || !env.supabaseServiceKey) throw new Error("データ削除にはSupabaseの本番設定が必要です。");
  const response = await fetch(`${env.supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: env.supabaseServiceKey, authorization: `Bearer ${env.supabaseServiceKey}`, "content-type": "application/json", ...(init.headers || {}) },
  });
  if (!response.ok) throw new Error(`Storage ${response.status}: ${(await response.text()).slice(0, 300)}`);
}

export async function exportWatchData(token: string, email: string) {
  const watch = await getWatch(token);
  if (!watch || watch.email !== email.trim().toLowerCase()) throw new Error("Watch tokenと登録メールが一致しません。");
  return { product: "AIX Next", exportedAt: new Date().toISOString(), watch };
}

export async function deleteWatchData(token: string, email: string) {
  const watch = await getWatch(token);
  if (!watch || watch.email !== email.trim().toLowerCase()) throw new Error("Watch tokenと登録メールが一致しません。");
  await supabase("aix_next_deletion_audit", { method: "POST", body: JSON.stringify({ email_hash: hash(watch.email), domain_hash: hash(watch.latest.discovery.domain), watch_id: watch.id, scan_id: watch.scanId }) });
  await supabase(`aix_next_watches?id=eq.${encodeURIComponent(watch.id)}`, { method: "DELETE" });
  await supabase(`aix_next_scans?id=eq.${encodeURIComponent(watch.scanId)}`, { method: "DELETE" });
  return { deleted: true, completedAt: new Date().toISOString() };
}
