import "server-only";
import { env } from "@/lib/env";
import { deleteMemoryWatchData, getScan, getWatch } from "@/lib/storage";
import type { WatchMeasurementRun } from "@/lib/types";

async function supabase<T = unknown>(path: string, init: RequestInit = {}) {
  if (!env.supabaseUrl || !env.supabaseServiceKey) throw new Error("データ削除にはSupabaseの本番設定が必要です。");
  const response = await fetch(`${env.supabaseUrl}/rest/v1/${path}`, {
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
    ...init,
    headers: { apikey: env.supabaseServiceKey, authorization: `Bearer ${env.supabaseServiceKey}`, "content-type": "application/json", ...(init.headers || {}) },
  });
  if (!response.ok) throw new Error(`データ処理を完了できませんでした (${response.status})。`);
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
  if (!token || typeof token !== "string" || typeof email !== "string") throw new Error("管理情報を確認できません。");
  if (env.supabaseUrl && env.supabaseServiceKey) {
    const data = await supabase<Record<string, unknown>>("rpc/aix_next_export_watch_data", {
      method: "POST", body: JSON.stringify({ p_token: token, p_email: email.trim().toLowerCase() }),
    });
    return { product: "Rovan", formatVersion: 2, exportedAt: new Date().toISOString(), ...data };
  }
  const watch = await getWatch(token);
  if (!watch || watch.email !== email.trim().toLowerCase()) throw new Error("Watch tokenと登録メールが一致しません。");
  const ownedWatch = { ...watch } as Partial<typeof watch>;
  delete ownedWatch.token;
  const runs = (globalThis as { aixNextWatchRuns?: Map<string, WatchMeasurementRun> }).aixNextWatchRuns;
  const measurementRuns = [...(runs?.values() || [])].filter(run => run.watchId === watch.id && run.watchToken === token)
    .map(run => { const ownedRun = { ...run } as Partial<WatchMeasurementRun>; delete ownedRun.watchToken; return ownedRun; });
  return { product: "Rovan", formatVersion: 2, exportedAt: new Date().toISOString(), watch: ownedWatch,
    scan: await getScan(watch.scanId), measurementRuns,
    excluded: ["public_profiles: independent ownership not verified", "deletion_audit: operational retention record"] };
}

export async function deleteWatchData(token: string, email: string) {
  if (!token || typeof token !== "string" || typeof email !== "string") throw new Error("管理情報を確認できません。");
  const durable = Boolean(env.supabaseUrl && env.supabaseServiceKey);
  const watch = await getWatch(token);
  if (!watch && durable) {
    // A committed deletion may have lost its HTTP response. The service-only
    // receipt RPC authenticates the original token hash AND normalized email.
    return supabase<{ deleted: boolean; subscriptionCancelled: boolean; completedAt: string }>("rpc/aix_next_delete_watch_data", {
      method: "POST", body: JSON.stringify({ p_token: token, p_email: email.trim().toLowerCase(), p_expected_subscription_id: null, p_subscription_cancelled: false }),
    });
  }
  if (!watch || watch.email !== email.trim().toLowerCase()) throw new Error("Watch tokenと登録メールが一致しません。");

  if (watch.stripeSubscriptionId && watch.paid) await cancelStripeSubscription(watch.stripeSubscriptionId);

  const subscriptionCancelled = Boolean(watch.stripeSubscriptionId && watch.paid);
  if (!durable) {
    // The app intentionally supports a memory-only preview/development mode.
    // A privacy request must still remove those records instead of claiming
    // that production storage is configured when it is not.
    const deleted = deleteMemoryWatchData(token, watch.scanId);
    if (!deleted) throw new Error("Watchデータを削除できませんでした。");
    return { deleted: true, subscriptionCancelled, completedAt: new Date().toISOString(), publicProfiles: "retained: independent ownership not verified" };
  }

  return supabase<{ deleted: boolean; subscriptionCancelled: boolean; completedAt: string }>("rpc/aix_next_delete_watch_data", {
    method: "POST", body: JSON.stringify({ p_token: token, p_email: email.trim().toLowerCase(),
      p_expected_subscription_id: watch.stripeSubscriptionId || null, p_subscription_cancelled: subscriptionCancelled }),
  });
}
