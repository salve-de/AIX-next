import { env } from "@/lib/env";
import { getWatch } from "@/lib/storage";

export const runtime = "nodejs";

async function stripe(path: string, body: URLSearchParams) {
  if (!env.stripeSecretKey) throw new Error("Stripeが設定されていません。");
  const response = await fetch(`https://api.stripe.com/v1${path}`, {
    method: "POST",
    headers: { authorization: `Bearer ${env.stripeSecretKey}`, "content-type": "application/x-www-form-urlencoded" },
    body,
  });
  const data = await response.json() as any;
  if (!response.ok) throw new Error(data.error?.message || `Stripe ${response.status}`);
  return data;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { token?: string };
    if (!body.token) return Response.json({ error: "Watch tokenが必要です。" }, { status: 400 });
    const watch = await getWatch(body.token);
    if (!watch) return Response.json({ error: "Watchが見つかりません。" }, { status: 404 });
    if (!watch.paid) return Response.json({ error: "有料契約後に利用できます。" }, { status: 403 });
    if (!watch.stripeCustomerId) return Response.json({ error: "Stripe Customerとの紐付けを確認できません。Webhook設定を確認してください。" }, { status: 409 });

    const form = new URLSearchParams();
    form.set("customer", watch.stripeCustomerId);
    form.set("return_url", `${env.siteUrl}/watch?token=${encodeURIComponent(watch.token)}`);
    const session = await stripe("/billing_portal/sessions", form);
    if (!session.url) throw new Error("Customer Portalを作成できませんでした。");
    return Response.json({ url: session.url }, { headers: { "cache-control": "no-store" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "契約管理を開始できませんでした。" }, { status: 400 });
  }
}
