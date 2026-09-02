import { createHmac, timingSafeEqual } from "node:crypto";
import type { WatchRecord } from "@/lib/types";

export type StripeEventLike = {
  id: string;
  type: string;
  data?: { object?: any };
};

export type StripeWatchPatch = Partial<Pick<WatchRecord,
  "paid" | "status" | "stripeCustomerId" | "stripeSubscriptionId" | "stripePriceId"
>>;

export function validStripeSignature(payload: string, header: string, secret: string, nowSeconds = Date.now() / 1000) {
  if (!secret || !header) return false;
  const parts = header.split(",").map((part) => part.trim().split("=", 2));
  const timestamp = parts.find(([key]) => key === "t")?.[1];
  const signatures = parts.filter(([key]) => key === "v1").map(([, value]) => value).filter(Boolean);
  if (!timestamp || !signatures.length) return false;
  const issuedAt = Number(timestamp);
  if (!Number.isFinite(issuedAt) || Math.abs(nowSeconds - issuedAt) > 300) return false;
  const expectedHex = createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
  const expected = Buffer.from(expectedHex, "hex");
  return signatures.some((signature) => {
    if (!/^[a-f0-9]{64}$/i.test(signature)) return false;
    const received = Buffer.from(signature, "hex");
    return expected.length === received.length && timingSafeEqual(expected, received);
  });
}

function idFrom(value: any) {
  if (typeof value === "string") return value;
  if (value && typeof value.id === "string") return value.id;
  return undefined;
}

export function watchTokenFromStripeEvent(event: StripeEventLike) {
  const object = event.data?.object || {};
  const metadata = {
    ...(object.subscription_details?.metadata || {}),
    ...(object.metadata || {}),
  };
  return typeof metadata.watch_token === "string" ? metadata.watch_token : "";
}

export function stripeWatchPatch(event: StripeEventLike): StripeWatchPatch {
  const object = event.data?.object || {};
  const patch: StripeWatchPatch = {};
  const customerId = idFrom(object.customer);
  const priceId = idFrom(object.items?.data?.[0]?.price);

  if (customerId) patch.stripeCustomerId = customerId;
  if (priceId) patch.stripePriceId = priceId;

  if (event.type === "checkout.session.completed") {
    const subscriptionId = idFrom(object.subscription);
    if (subscriptionId) patch.stripeSubscriptionId = subscriptionId;
    const paid = ["paid", "no_payment_required"].includes(object.payment_status || "");
    if (paid) {
      patch.paid = true;
      patch.status = "active";
    }
    return patch;
  }

  if (event.type === "customer.subscription.created" || event.type === "customer.subscription.updated") {
    const subscriptionId = idFrom(object);
    if (subscriptionId) patch.stripeSubscriptionId = subscriptionId;
    if (["active", "trialing"].includes(object.status)) {
      patch.paid = true;
      patch.status = "active";
    } else if (object.status === "past_due") {
      patch.paid = true;
      patch.status = "past_due";
    } else if (["canceled", "unpaid", "incomplete_expired"].includes(object.status)) {
      patch.paid = false;
      patch.status = "cancelled";
    }
    return patch;
  }

  if (event.type === "customer.subscription.deleted") {
    const subscriptionId = idFrom(object);
    if (subscriptionId) patch.stripeSubscriptionId = subscriptionId;
    patch.paid = false;
    patch.status = "cancelled";
    return patch;
  }

  return patch;
}
