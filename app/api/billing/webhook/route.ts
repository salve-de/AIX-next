import { updateWatch } from "@/lib/store";
import { verifyStripeSignature } from "@/lib/stripe";

export const runtime = "nodejs";

type StripeEvent = { id?: string; type?: string; data?: { object?: { status?: string; payment_status?: string; metadata?: Record<string,string>; subscription_details?: { metadata?: Record<string,string> } } } };

export async function POST(request: Request) {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature") || "";
  if (!verifyStripeSignature(payload, signature)) return new Response("Invalid signature", { status: 400 });
  let event: StripeEvent;
  try { event = JSON.parse(payload) as StripeEvent; } catch { return new Response("Invalid JSON", { status: 400 }); }
  const object = event.data?.object || {};
  const metadata = { ...(object.subscription_details?.metadata || {}), ...(object.metadata || {}) };
  const id = metadata.watch_id; const token = metadata.watch_token;
  if (!id || !token) return Response.json({ received: true, ignored: "missing Watch metadata" });
  try {
    if (event.type === "checkout.session.completed") {
      const active = ["paid", "no_payment_required"].includes(object.payment_status || "");
      await updateWatch(id, token, { paid: active, status: active ? "active" : "trial" });
    } else if (["customer.subscription.created", "customer.subscription.updated"].includes(event.type || "")) {
      const status = object.status || "";
      if (["active", "trialing"].includes(status)) await updateWatch(id, token, { paid: true, status: "active" });
      else if (status === "past_due" || status === "unpaid") await updateWatch(id, token, { paid: status === "past_due", status: "past_due" });
      else if (["canceled", "incomplete_expired"].includes(status)) await updateWatch(id, token, { paid: false, status: "cancelled" });
    } else if (event.type === "customer.subscription.deleted") {
      await updateWatch(id, token, { paid: false, status: "cancelled" });
    }
    return Response.json({ received: true });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Webhook failed" }, { status: 500 });
  }
}
