import { env } from "@/lib/env";
import { sellerReady } from "@/lib/legal";
import { getWatch, updateWatch } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { token?: string };
    if (!body.token) return Response.json({ error: "Watch tokenが必要です。" }, { status: 400 });
    const watch = await getWatch(body.token);
    if (!watch) return Response.json({ error: "Watchが見つかりません。" }, { status: 404 });
    if (watch.paid) return Response.json({ error: "このWatchはすでに契約中です。" }, { status: 409 });
    if (!sellerReady()) return Response.json({ error: "販売者情報の本番設定が完了していないため、決済を開始できません。" }, { status: 503 });
    if (!env.stripeSecretKey || !env.stripePriceId) return Response.json({ error: "Stripeの本番設定が完了していません。" }, { status: 503 });

    const form = new URLSearchParams();
    form.set("mode", "subscription");
    form.set("locale", "ja");
    form.set("line_items[0][price]", env.stripePriceId);
    form.set("line_items[0][quantity]", "1");
    form.set("client_reference_id", watch.id);
    if (watch.stripeCustomerId) form.set("customer", watch.stripeCustomerId);
    else form.set("customer_email", watch.email);
    form.set("billing_address_collection", "required");
    form.set("success_url", `${env.siteUrl}/watch?token=${encodeURIComponent(watch.token)}&checkout=success`);
    form.set("cancel_url", `${env.siteUrl}/watch?token=${encodeURIComponent(watch.token)}&checkout=cancelled`);
    form.set("metadata[watch_token]", watch.token);
    form.set("metadata[watch_id]", watch.id);
    form.set("subscription_data[metadata][watch_token]", watch.token);
    form.set("subscription_data[metadata][watch_id]", watch.id);

    // Repeated button clicks within the same five-minute window reuse the same Stripe request.
    const idempotencyKey = `aix-checkout-${watch.id}-${Math.floor(Date.now() / 300_000)}`;
    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.stripeSecretKey}`,
        "content-type": "application/x-www-form-urlencoded",
        "idempotency-key": idempotencyKey,
      },
      body: form,
    });
    const data = await response.json() as any;
    if (!response.ok || !data.url) throw new Error(data.error?.message || "Checkoutを作成できませんでした。");

    await updateWatch(watch.token, { stripePriceId: env.stripePriceId });
    return Response.json({ url: data.url }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Checkoutを開始できませんでした。" }, { status: 400 });
  }
}
