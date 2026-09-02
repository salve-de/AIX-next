import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import test from "node:test";
import { stripeWatchPatch, validStripeSignature, watchTokenFromStripeEvent } from "../lib/stripe-webhook";

function signature(payload: string, secret: string, timestamp: number) {
  const hash = createHmac("sha256", secret).update(`${timestamp}.${payload}`).digest("hex");
  return `t=${timestamp},v1=${hash}`;
}

test("validStripeSignature verifies a current signed payload", () => {
  const payload = JSON.stringify({ id: "evt_1", type: "checkout.session.completed" });
  const secret = "whsec_test_secret";
  const timestamp = 1_800_000_000;
  assert.equal(validStripeSignature(payload, signature(payload, secret, timestamp), secret, timestamp + 30), true);
  assert.equal(validStripeSignature(`${payload}x`, signature(payload, secret, timestamp), secret, timestamp + 30), false);
  assert.equal(validStripeSignature(payload, signature(payload, secret, timestamp), secret, timestamp + 301), false);
});

test("checkout completion binds customer and subscription to the Watch", () => {
  const event = {
    id: "evt_checkout",
    type: "checkout.session.completed",
    data: { object: { customer: "cus_123", subscription: "sub_123", payment_status: "paid", metadata: { watch_token: "token_abc" } } },
  };
  assert.equal(watchTokenFromStripeEvent(event), "token_abc");
  assert.deepEqual(stripeWatchPatch(event), {
    stripeCustomerId: "cus_123",
    stripeSubscriptionId: "sub_123",
    paid: true,
    status: "active",
  });
});

test("subscription events preserve Stripe identity and map lifecycle status", () => {
  const active = stripeWatchPatch({ id: "evt_a", type: "customer.subscription.updated", data: { object: { id: "sub_1", customer: "cus_1", status: "active", items: { data: [{ price: { id: "price_1" } }] }, metadata: { watch_token: "t" } } } });
  assert.deepEqual(active, { stripeCustomerId: "cus_1", stripePriceId: "price_1", stripeSubscriptionId: "sub_1", paid: true, status: "active" });

  const due = stripeWatchPatch({ id: "evt_b", type: "customer.subscription.updated", data: { object: { id: "sub_1", customer: "cus_1", status: "past_due" } } });
  assert.equal(due.paid, true);
  assert.equal(due.status, "past_due");

  const canceled = stripeWatchPatch({ id: "evt_c", type: "customer.subscription.deleted", data: { object: { id: "sub_1", customer: "cus_1", status: "canceled" } } });
  assert.equal(canceled.paid, false);
  assert.equal(canceled.status, "cancelled");
});

test("subscription metadata can recover the Watch token when Checkout metadata is nested", () => {
  const event = { id: "evt_2", type: "checkout.session.completed", data: { object: { subscription_details: { metadata: { watch_token: "nested_token" } } } } };
  assert.equal(watchTokenFromStripeEvent(event), "nested_token");
});
