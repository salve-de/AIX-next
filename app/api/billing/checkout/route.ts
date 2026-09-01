import { env } from "@/lib/env";
import { getWatch } from "@/lib/store";
import { stripeRequest } from "@/lib/stripe";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { watchId?: string; token?: string };
    if (!body.watchId || !body.token) return Response.json({ error: "Watch情報が不足しています。" }, { status: 400 });
    const watch = await getWatch(body.watchId, body.token);
    if (!watch) return Response.json({ error: "Watchが見つかりません。" }, { status: 404 });
    if (watch.paid) return Response.json({ error: "すでに契約中です。" }, { status: 409 });
    if (!env.stripePriceId) return Response.json({ error: "販売価格が未設定です。" }, { status: 503 });
    const form = new URLSearchParams();
    form.set("mode", "subscription");
    form.set("locale", "ja");
    form.set("line_items[0][price]", env.stripePriceId);
    form.set("line_items[0][quantity]", "1");
    form.set("customer_email", watch.email);
    form.set("billing_address_collection", "required");
    form.set("tax_id_collection[enabled]", "true");
    form.set("success_url", `${env.siteUrl}/watch/${watch.id}?token=${encodeURIComponent(watch.token)}&checkout=success`);
    form.set("cancel_url", `${env.siteUrl}/watch/${watch.id}?token=${encodeURIComponent(watch.token)}&checkout=cancelled`);
    form.set("metadata[watch_id]", watch.id);
    form.set("metadata[watch_token]", watch.token);
    form.set("subscription_data[metadata][watch_id]", watch.id);
    form.set("subscription_data[metadata][watch_token]", watch.token);
    const session = await stripeRequest("/checkout/sessions", form);
    if (!session.url) throw new Error("Checkout URLを作成できませんでした。");
    return Response.json({ url: session.url }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Checkoutを開始できませんでした。" }, { status: 400 });
  }
}
