import { env, providerReadiness } from "@/lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const providers = providerReadiness();
  const liveProviders = Object.values(providers).filter(Boolean).length;
  const readiness = {
    providers,
    discovery: providers.openai,
    aiMeasurement: liveProviders === 3,
    persistence: Boolean(env.supabaseUrl && env.supabaseServiceKey),
    watchEmail: Boolean(env.resendApiKey && env.watchFromEmail),
    billing: Boolean(env.stripeSecretKey && env.stripePriceId && env.stripeWebhookSecret),
    scheduler: Boolean(env.cronSecret),
    productionUrl: !env.siteUrl.includes("localhost"),
    abuseProtection: Boolean(env.rateLimitSalt && env.rateLimitSalt !== "development-only"),
  };
  const scanReady = readiness.discovery && readiness.aiMeasurement;
  const watchReady = scanReady && readiness.persistence && readiness.scheduler;
  const paidReady = watchReady && readiness.billing;
  return Response.json({
    product: "AIX Next",
    version: "0.1.0",
    status: paidReady ? "paid-watch-ready" : watchReady ? "watch-ready" : scanReady ? "scan-ready" : liveProviders ? "partially-configured" : "sample-only",
    generatedAt: new Date().toISOString(),
    readiness,
  }, { headers: { "cache-control": "no-store" } });
}
