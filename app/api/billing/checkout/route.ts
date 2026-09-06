import { env } from "@/lib/env";
import { sellerReady } from "@/lib/legal";
import { getWatch } from "@/lib/storage";
import { stripe, terminalSubscription, validToken } from "../_shared";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!validToken(body?.token)) return Response.json({ error: "Watch tokenが必要です。" }, { status: 400 });
    const watch = await getWatch(body.token);
    if (!watch) return Response.json({ error: "Watchが見つかりません。" }, { status: 404 });
    if (watch.paid) return Response.json({ error: "このWatchはすでに契約中です。" }, { status: 409 });
    if (!sellerReady()) return Response.json({ error: "販売者情報の設定が完了していないため、現在は有料契約を開始できません。" }, { status: 503 });
    if (!env.stripeSecretKey || !env.stripePriceId) return Response.json({ error: "Stripeの本番設定が完了していません。" }, { status: 503 });
    if (watch.stripeSubscriptionId) {
      const subscription = await stripe(`/subscriptions/${encodeURIComponent(watch.stripeSubscriptionId)}`);
      if (!terminalSubscription(subscription.status)) return Response.json({ error: "既存の契約があります。契約管理からお支払い状況を確認してください。" }, { status: 409 });
    }

    const form = new URLSearchParams();
    form.set("mode", "subscription");
    form.set("locale", "ja");
    form.set("line_items[0][price]", env.stripePriceId);
    form.set("line_items[0][quantity]", "1");
    if (watch.stripeCustomerId) form.set("customer", watch.stripeCustomerId);
    else form.set("customer_email", watch.email);
    form.set("billing_address_collection", "required");
    form.set("success_url", `${env.siteUrl}/watch?token=${encodeURIComponent(watch.token)}&checkout=success`);
    form.set("cancel_url", `${env.siteUrl}/watch?token=${encodeURIComponent(watch.token)}&checkout=cancelled`);
    form.set("client_reference_id", watch.id);
    form.set("metadata[watch_token]", watch.token);
    form.set("subscription_data[metadata][watch_token]", watch.token);

    const data = await stripe("/checkout/sessions", form);
    if (!data.url) throw new Error("Checkout unavailable");
    return Response.json({ url: data.url }, { headers: { "cache-control": "no-store", "referrer-policy": "no-referrer" } });
  } catch {
    return Response.json({ error: "Checkoutを開始できませんでした。時間をおいて再度お試しください。" }, { status: 502 });
  }
}
