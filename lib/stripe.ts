import "server-only";
import { createHmac, timingSafeEqual } from "node:crypto";
import { env } from "@/lib/env";

export async function stripeRequest(path: string, form: URLSearchParams) {
  if (!env.stripeSecretKey) throw new Error("Stripeが設定されていません。");
  const response = await fetch(`https://api.stripe.com/v1${path}`, { method: "POST", headers: { authorization: `Bearer ${env.stripeSecretKey}`, "content-type": "application/x-www-form-urlencoded" }, body: form });
  const data = await response.json() as any;
  if (!response.ok) throw new Error(data.error?.message || `Stripe ${response.status}`);
  return data;
}

export function verifyStripeSignature(payload: string, header: string) {
  if (!env.stripeWebhookSecret) return false;
  const values = header.split(",").map((part) => part.split("=", 2));
  const timestamp = values.find(([key]) => key === "t")?.[1];
  const signatures = values.filter(([key]) => key === "v1").map(([, value]) => value);
  if (!timestamp || !signatures.length || Math.abs(Date.now() / 1000 - Number(timestamp)) > 300) return false;
  const expected = createHmac("sha256", env.stripeWebhookSecret).update(`${timestamp}.${payload}`).digest("hex");
  const left = Buffer.from(expected);
  return signatures.some((signature) => { const right = Buffer.from(signature); return left.length === right.length && timingSafeEqual(left, right); });
}
