import { env } from "@/lib/env";
import { getWatch, updateWatch } from "@/lib/storage";

export const runtime = "nodejs";

async function stripe(path: string, body?: URLSearchParams) {
  if (!env.stripeSecretKey) throw new Error("現在、契約管理を利用できません。");
  const response = await fetch(`https://api.stripe.com/v1${path}`, { method: body ? "POST" : "GET", headers: { authorization: `Bearer ${env.stripeSecretKey}`, ...(body ? { "content-type": "application/x-www-form-urlencoded" } : {}) }, body });
  const data = await response.json() as any;
  if (!response.ok) throw new Error(data.error?.message || `Stripe ${response.status}`);
  return data;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { token?: string };
    if (!body.token) return Response.json({ error: "モニタリングURLが正しくありません。" }, { status: 400 });
    const watch = await getWatch(body.token);
    if (!watch) return Response.json({ error: "モニタリング結果が見つかりません。" }, { status: 404 });
    if (!watch.paid) return Response.json({ error: "AIX Monitor契約後に利用できます。" }, { status: 403 });

    let customerId = watch.stripeCustomerId;
    if (!customerId) {
      const customers = await stripe(`/customers?email=${encodeURIComponent(watch.email)}&limit=2`);
      if (customers.data?.length !== 1 || !customers.data[0]?.id) return Response.json({ error: "契約情報を確認できません。サポートへお問い合わせください。" }, { status: 409 });
      customerId = customers.data[0].id;
      await updateWatch(watch.token, { stripeCustomerId: customerId });
    }

    const form = new URLSearchParams();
    form.set("customer", customerId);
    form.set("return_url", `${env.siteUrl}/watch?token=${encodeURIComponent(watch.token)}`);
    const session = await stripe("/billing_portal/sessions", form);
    if (!session.url) throw new Error("契約管理画面を作成できませんでした。");
    return Response.json({ url: session.url });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "契約管理を開始できませんでした。" }, { status: 400 });
  }
}
