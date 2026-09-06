import { env } from "@/lib/env";

export function validToken(value: unknown): value is string {
  return typeof value === "string" && value.length > 0 && value.length <= 256 && value.trim() === value;
}

export function stripeId(value: unknown): string | undefined {
  if (typeof value === "string" && value) return value;
  if (value && typeof value === "object" && "id" in value && typeof value.id === "string") return value.id;
  return undefined;
}

export async function stripe(path: string, body?: URLSearchParams, method?: string) {
  if (!env.stripeSecretKey) throw new Error("Stripe unavailable");
  const response = await fetch(`https://api.stripe.com/v1${path}`, {
    method: method || (body ? "POST" : "GET"),
    headers: { authorization: `Bearer ${env.stripeSecretKey}`, ...(body ? { "content-type": "application/x-www-form-urlencoded" } : {}) },
    body,
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  if (!response.ok) throw new Error("Stripe request failed");
  return response.json();
}

export const terminalSubscription = (status: string) => ["canceled", "incomplete_expired"].includes(status);
