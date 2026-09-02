import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "@/lib/env";
import { updateWatch } from "@/lib/storage";

export const runtime = "nodejs";

function validSignature(payload: string, header: string) {
  if (!env.stripeWebhookSecret) return false;
  const parts = header.split(",").map((part) => part.split("=", 2));
  const timestamp = parts.find(([key]) => key === "t")?.[1];
  const signatures = parts.filter(([key]) => key === "v1").map(([, value]) => value);
  if (!timestamp || !signatures.length) return false;
  const issuedAt = Number(timestamp);
  if (!Number.isFinite(issuedAt) || Math.abs(Date.now() / 1000 - issuedAt) > 300) return false;
  const expected = createHmac("sha256", env.stripeWebhookSecret).update(`${timestamp}.${payload}`).digest("hex");
  const left = Buffer.from(expected);
  return signatures.some((signature) => {
    const right = Buffer.from(signature || "");
    return left.length === right.length && timingSafeEqual(left, right);
  });
}

function stripeId(value: unknown) {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "id" in value && typeof (value as { id?: unknown }).id === "string") return (value as { id: string }).id;
  return undefined;
}

export async function POST(request: Request) {
  const payload = await request.text();
  if (!validSignature(payload, request.headers.get("stripe-signature") || "")) return new Response("Invalid signature", { status: 400 });
  let event: any;
  try { event = JSON.parse(payload); } catch { return new Response("Invalid payload", { status: 400 }); }

  const object = event.data?.object || {};
  const metadata = { ...(object.subscription_details?.metadata || {}), ...(object.metadata || {}) };
  const token = metadata.watch_token;
  if (!token) return Response.json({ received: true, ignored: "watch_token missing" });

  if (event.type === "checkout.session.completed") {
    const paid = ["paid", "no_payment_required"].includes(object.payment_status || "");
    await updateWatch(token, {
      paid,
      status: paid ? "active" : "trial",
      stripeCustomerId: stripeId(object.customer),
      stripeSubscriptionId: stripeId(object.subscription),
    });
  } else if (["customer.subscription.created", "customer.subscription.updated"].includes(event.type)) {
    const base = {
      stripeCustomerId: stripeId(object.customer),
      stripeSubscriptionId: stripeId(object.id),
    };
    if (["active", "trialing"].includes(object.status)) await updateWatch(token, { ...base, paid: true, status: "active" });
    else if (object.status === "past_due") await updateWatch(token, { ...base, paid: true, status: "past_due" });
    else if (["canceled", "unpaid", "incomplete_expired"].includes(object.status)) await updateWatch(token, { ...base, paid: false, status: "cancelled" });
    else await updateWatch(token, base);
  } else if (event.type === "customer.subscription.deleted") {
    await updateWatch(token, {
      paid: false,
      status: "cancelled",
      stripeCustomerId: stripeId(object.customer),
      stripeSubscriptionId: stripeId(object.id),
    });
  }

  return Response.json({ received: true });
}
