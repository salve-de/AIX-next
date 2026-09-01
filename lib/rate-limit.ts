import "server-only";
import { createHash } from "node:crypto";
import { env } from "@/lib/env";

const globalMap = globalThis as unknown as { aixNextRate?: Map<string, { count: number; resetAt: number }> };
const limits = globalMap.aixNextRate || new Map<string, { count: number; resetAt: number }>();
globalMap.aixNextRate = limits;

function hash(value: string) {
  return createHash("sha256").update(`${env.appSecret}:${value}`).digest("hex");
}

export function consumeFreeScan(request: Request, url: string) {
  const now = Date.now();
  const ip = (request.headers.get("cf-connecting-ip") || request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown").trim();
  const domain = new URL(url).hostname.replace(/^www\./, "");
  const keys = [`ip:${hash(ip)}`, `domain:${hash(domain)}`];
  let retryAfter = 0;
  for (const key of keys) {
    const current = limits.get(key);
    const next = !current || current.resetAt <= now ? { count: 1, resetAt: now + 3_600_000 } : { count: current.count + 1, resetAt: current.resetAt };
    limits.set(key, next);
    const cap = key.startsWith("domain:") ? 3 : env.freeScanLimitPerHour;
    if (next.count > cap) retryAfter = Math.max(retryAfter, Math.ceil((next.resetAt - now) / 1000));
  }
  return { allowed: retryAfter === 0, retryAfter };
}
