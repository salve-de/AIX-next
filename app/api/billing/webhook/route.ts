import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "@/lib/env";
import { getWatch, updateWatch } from "@/lib/storage";
import { stripe, stripeId, terminalSubscription, validToken } from "../_shared";

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

export async function POST(request: Request) {
  const payload = await request.text();
  if (!validSignature(payload, request.headers.get("stripe-signature") || "")) return new Response("Invalid signature", { status: 400 });
  let event: any;
  try { event = JSON.parse(payload); } catch { return new Response("Invalid payload", { status: 400 }); }

  if (!event || typeof event !== "object") return new Response("Invalid payload", { status: 400 });
  if (!["checkout.session.completed", "checkout.session.async_payment_succeeded", "customer.subscription.created", "customer.subscription.updated", "customer.subscription.deleted"].includes(event.type)) return Response.json({ received: true });
  const object = event.data?.object || {};
  const metadata = { ...(object.subscription_details?.metadata || {}), ...(object.metadata || {}) };
  const token = metadata.watch_token;
  if (!validToken(token)) return Response.json({ received: true, ignored: "watch_token missing" });
  try {
  const current = await getWatch(token);
  if (!current) return Response.json({ received: true, ignored: "watch not found" });

  const checkout = event.type.startsWith("checkout.session.");
  const subscriptionId = stripeId(checkout ? object.subscription : object.id);
  if (!subscriptionId || (checkout && object.mode !== "subscription")) return Response.json({ received: true, ignored: "subscription missing" });
  if (current.stripeSubscriptionId && current.stripeSubscriptionId !== subscriptionId) {
    // A delayed event from a previous subscription must never replace the current one.
    if (!checkout) return Response.json({ received: true, ignored: "different subscription" });
    const previous = await stripe(`/subscriptions/${encodeURIComponent(current.stripeSubscriptionId)}`);
    if (!terminalSubscription(previous.status)) return new Response("Conflicting subscription", { status: 409 });
  }
  // Stripe does not guarantee event order. Reconcile from the current resource,
  // including for Checkout completion, instead of granting access from old payloads.
  const subscription = await stripe(`/subscriptions/${encodeURIComponent(subscriptionId)}`);
  const customerId = stripeId(subscription.customer);
  if (subscription.id !== subscriptionId || subscription.metadata?.watch_token !== token || !customerId ||
      (stripeId(object.customer) && stripeId(object.customer) !== customerId) ||
      (current.stripeCustomerId && current.stripeCustomerId !== customerId)) {
    return new Response("Subscription binding mismatch", { status: 400 });
  }
  const active = ["active", "trialing"].includes(subscription.status);
  const pastDue = subscription.status === "past_due";
  const updated = await updateWatch(token, {
    stripeCustomerId: customerId,
    stripeSubscriptionId: subscriptionId,
    paid: active || pastDue,
    status: active ? "active" : pastDue ? "past_due" : "cancelled",
    ...(active && (!current.paid || current.status !== "active") ? { nextRunAt: new Date().toISOString() } : {}),
  });
  if (!updated) throw new Error("Watch update failed");
  return Response.json({ received: true });
  } catch {
    return new Response("Billing reconciliation failed; retry required", { status: 503 });
  }
}
