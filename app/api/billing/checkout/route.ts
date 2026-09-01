import { env } from "@/lib/env";
import { getWatch } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { token?: string };
    if (!body.token) return Response.json({ error: "Watch tokenが必要です。" }, { status: 400 });
    const watch = await getWatch(body.token);
    if (!watch) return Response.json({ error: "Watchが見つかりません。" }, { status: 404 });
    if (watch.paid) return Response.json({ error: "このWatchはすでに契約中です。" }, { status: 409 });
    if (!env.stripeSecretKey || !env.stripePriceId) return Response.json({ error: "Stripeの本番設定が完了していません。" }, { status: 503 });
    const form = new URLSearchParams();
    form.set("mode", "subscription");
    form.set("locale", "ja");
    form.set("line_items[0][price]", env.stripePriceId);
    form.set("line_items[0][quantity]", "1");
    form.set("customer_email", watch.email);
    form.set("billing_address_collection", "required");
    form.set("success_url", `${env.siteUrl}/watch?token=${encodeURIComponent(watch.token)}&checkout=success`);
    form.set("cancel_url", `${env.siteUrl}/watch?token=${encodeURIComponent(watch.token)}&checkout=cancelled`);
    form.set("metadata[watch_token]", watch.token);
    form.set("subscription_data[metadata][watch_token]", watch.token);
    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", { method: "POST", headers: { authorization: `Bearer ${env.stripeSecretKey}`, "content-type": "application/x-www-form-urlencoded" }, body: form });
    const data = await response.json() as any;
    if (!response.ok || !data.url) throw new Error(data.error?.message || "Checkoutを作成できませんでした。");
    return Response.json({ url: data.url });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Checkoutを開始できませんでした。" }, { status: 400 });
  }
}
