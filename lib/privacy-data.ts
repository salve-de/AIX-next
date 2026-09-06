import "server-only";
import { createHash } from "node:crypto";
import { env } from "@/lib/env";
import { deleteMemoryWatchData, getWatch } from "@/lib/storage";

function hash(value: string) {
  return createHash("sha256").update(value.trim().toLowerCase()).digest("hex");
}

async function supabase<T = unknown>(path: string, init: RequestInit = {}) {
  if (!env.supabaseUrl || !env.supabaseServiceKey) throw new Error("データ削除にはSupabaseの本番設定が必要です。");
  const response = await fetch(`${env.supabaseUrl}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: env.supabaseServiceKey, authorization: `Bearer ${env.supabaseServiceKey}`, "content-type": "application/json", ...(init.headers || {}) },
  });
  if (!response.ok) throw new Error(`Storage ${response.status}: ${(await response.text()).slice(0, 300)}`);
  const text = await response.text();
  return (text ? JSON.parse(text) : null) as T;
}

async function cancelStripeSubscription(subscriptionId: string) {
  if (!env.stripeSecretKey) throw new Error("有料契約の停止に必要なStripe設定がありません。データ削除を中断しました。");
  const response = await fetch(`https://api.stripe.com/v1/subscriptions/${encodeURIComponent(subscriptionId)}`, {
    method: "DELETE",
    headers: { authorization: `Bearer ${env.stripeSecretKey}` },
  });
  if (!response.ok) {
    const data = await response.json().catch(() => ({})) as any;
    const code = data.error?.code;
    if (response.status === 404 || code === "resource_missing") return;
    throw new Error(data.error?.message || `Stripe契約を停止できませんでした (${response.status})`);
  }
}

export async function exportWatchData(token: string, email: string) {
  const watch = await getWatch(token);
  if (!watch || watch.email !== email.trim().toLowerCase()) throw new Error("Watch tokenと登録メールが一致しません。");
  return { product: "Rovan", exportedAt: new Date().toISOString(), watch };
}

export async function deleteWatchData(token: string, email: string) {
  const watch = await getWatch(token);
  if (!watch || watch.email !== email.trim().toLowerCase()) throw new Error("Watch tokenと登録メールが一致しません。");

  if (watch.stripeSubscriptionId && watch.paid) await cancelStripeSubscription(watch.stripeSubscriptionId);

  const subscriptionCancelled = Boolean(watch.stripeSubscriptionId && watch.paid);
  if (!env.supabaseUrl || !env.supabaseServiceKey) {
    // The app intentionally supports a memory-only preview/development mode.
    // A privacy request must still remove those records instead of claiming
    // that production storage is configured when it is not.
    const deleted = deleteMemoryWatchData(token, watch.scanId);
    if (!deleted) throw new Error("Watchデータを削除できませんでした。");
    return { deleted: true, subscriptionCancelled, completedAt: new Date().toISOString() };
  }

  await supabase("aix_next_deletion_audit", {
    method: "POST",
    body: JSON.stringify({ email_hash: hash(watch.email), domain_hash: hash(watch.latest.discovery.domain), watch_id: watch.id, scan_id: watch.scanId }),
  });
  await supabase(`aix_next_watches?id=eq.${encodeURIComponent(watch.id)}`, { method: "DELETE" });

  const remaining = await supabase<Array<{ id: string }>>(`aix_next_watches?scan_id=eq.${encodeURIComponent(watch.scanId)}&select=id&limit=1`);
  if (!remaining?.length) await supabase(`aix_next_scans?id=eq.${encodeURIComponent(watch.scanId)}`, { method: "DELETE" });

  return { deleted: true, subscriptionCancelled, completedAt: new Date().toISOString() };
}
