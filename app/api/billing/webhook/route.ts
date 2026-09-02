import { env } from "@/lib/env";
import { beginStripeEvent, completeStripeEvent, releaseStripeEvent, updateWatch } from "@/lib/storage";
import { stripeWatchPatch, validStripeSignature, watchTokenFromStripeEvent, type StripeEventLike } from "@/lib/stripe-webhook";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const payload = await request.text();
  if (!validStripeSignature(payload, request.headers.get("stripe-signature") || "", env.stripeWebhookSecret)) {
    return new Response("Invalid signature", { status: 400 });
  }

  let event: StripeEventLike;
  try { event = JSON.parse(payload) as StripeEventLike; }
  catch { return new Response("Invalid payload", { status: 400 }); }
  if (!event.id || !event.type) return new Response("Invalid event", { status: 400 });

  const requiredTypes = new Set([
    "checkout.session.completed",
    "checkout.session.async_payment_succeeded",
    "customer.subscription.created",
    "customer.subscription.updated",
    "customer.subscription.deleted",
  ]);
  if (!requiredTypes.has(event.type)) return Response.json({ received: true, ignored: event.type });

  const firstAttempt = await beginStripeEvent(event.id, event.type);
  if (!firstAttempt) return Response.json({ received: true, duplicate: true });

  try {
    const token = watchTokenFromStripeEvent(event);
    if (!token) {
      await completeStripeEvent(event.id);
      return Response.json({ received: true, ignored: "watch_token missing" });
    }

    const patch = stripeWatchPatch(event);
    const updated = await updateWatch(token, patch);
    if (!updated) throw new Error("Watch referenced by Stripe event was not found.");

    await completeStripeEvent(event.id);
    return Response.json({ received: true });
  } catch (error) {
    // Release the event lock so Stripe's automatic/manual retry can safely retry the same Event ID.
    await releaseStripeEvent(event.id).catch(() => undefined);
    console.error("Stripe webhook processing failed", event.id, event.type, error);
    return new Response("Webhook processing failed", { status: 500 });
  }
}
