import { env } from "@/lib/env";
import { getWatch } from "@/lib/storage";
import { stripe, validToken } from "../_shared";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => null);
    if (!validToken(body?.token)) return Response.json({ error: "Watch tokenが必要です。" }, { status: 400 });
    const watch = await getWatch(body.token);
    if (!watch) return Response.json({ error: "Watchが見つかりません。" }, { status: 404 });
    const customerId = watch.stripeCustomerId;
    if (!customerId) {
      return Response.json({ error: "契約に紐づくStripe Customerを確認できません。サポートへお問い合わせください。" }, { status: 409 });
    }

    if (!customerId) throw new Error("契約に紐づくStripe Customerを確認できません。");

    const form = new URLSearchParams();
    form.set("customer", customerId);
    form.set("return_url", `${env.siteUrl}/watch?token=${encodeURIComponent(watch.token)}`);
    const session = await stripe("/billing_portal/sessions", form);
    if (!session.url) throw new Error("Customer Portalを作成できませんでした。");
    return Response.json({ url: session.url }, { headers: { "cache-control": "no-store", "referrer-policy": "no-referrer" } });
  } catch {
    return Response.json({ error: "契約管理を開始できませんでした。時間をおいて再度お試しください。" }, { status: 502 });
  }
}
