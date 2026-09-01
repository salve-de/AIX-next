import "server-only";
import { createHash } from "node:crypto";
import { env } from "@/lib/env";

const globalLimits = globalThis as unknown as { aixNextLimits?: Map<string, { count: number; resetAt: number }> };
const memory = globalLimits.aixNextLimits ?? new Map<string, { count: number; resetAt: number }>();
globalLimits.aixNextLimits = memory;

function hash(value: string) {
  return createHash("sha256").update(`${env.rateLimitSalt}:${value}`).digest("hex");
}

function clientIp(request: Request) {
  return (request.headers.get("cf-connecting-ip") || request.headers.get("x-real-ip") || request.headers.get("x-forwarded-for")?.split(",")[0] || "unknown").trim();
}

async function consumeSupabase(key: string, limit: number, windowSeconds: number) {
  if (!env.supabaseUrl || !env.supabaseServiceKey) return null;
  const response = await fetch(`${env.supabaseUrl}/rest/v1/rpc/aix_next_consume_rate_limit`, {
    method: "POST",
    headers: { apikey: env.supabaseServiceKey, authorization: `Bearer ${env.supabaseServiceKey}`, "content-type": "application/json" },
    body: JSON.stringify({ p_key: key, p_limit: limit, p_window_seconds: windowSeconds }),
  });
  if (!response.ok) return null;
  return await response.json() as { allowed: boolean; reset_at: string };
}

function consumeMemory(key: string, limit: number, windowSeconds: number) {
  const now = Date.now();
  const current = memory.get(key);
  const next = !current || current.resetAt <= now ? { count: 1, resetAt: now + windowSeconds * 1000 } : { count: current.count + 1, resetAt: current.resetAt };
  memory.set(key, next);
  return { allowed: next.count <= limit, reset_at: new Date(next.resetAt).toISOString() };
}

async function consume(key: string, limit: number, windowSeconds: number) {
  return await consumeSupabase(key, limit, windowSeconds) || consumeMemory(key, limit, windowSeconds);
}

export async function consumeFreeScan(request: Request, url: string) {
  const domain = new URL(url).hostname.replace(/^www\./, "");
  const ip = await consume(`ip:${hash(clientIp(request))}`, env.freeScansPerHour, 3600);
  const target = await consume(`domain:${hash(domain)}`, 3, 3600);
  const allowed = ip.allowed && target.allowed;
  const resetAt = Math.max(new Date(ip.reset_at).getTime(), new Date(target.reset_at).getTime());
  return { allowed, retryAfter: Math.max(1, Math.ceil((resetAt - Date.now()) / 1000)) };
}
