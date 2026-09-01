import { env, providerReadiness } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const providers = providerReadiness();
  const readiness = {
    providers: { openai: providers.openai, gemini: providers.gemini, perplexity: providers.perplexity },
    weeklyEmail: providers.email,
    persistence: Boolean(env.supabaseUrl && env.supabaseServiceKey),
    billing: Boolean(env.stripeSecretKey && env.stripePriceId && env.stripeWebhookSecret),
    scheduler: Boolean(env.cronSecret),
    abuseProtection: Boolean(env.rateLimitSalt && env.rateLimitSalt !== "development-only"),
  };
  const liveProviders = Object.values(readiness.providers).filter(Boolean).length;
  return Response.json({ product: "AIX Next", version: "0.3.0", status: liveProviders === 3 && readiness.persistence ? "production-data-ready" : liveProviders ? "partially-configured" : "sample-only", generatedAt: new Date().toISOString(), readiness }, { headers: { "cache-control": "no-store" } });
}
