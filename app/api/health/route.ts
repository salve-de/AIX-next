import { env, providerReadiness } from "@/lib/env";
import { sellerReady } from "@/lib/legal";
import { configurationFailures, isProductionRuntime } from "@/lib/runtime-readiness";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const providers = providerReadiness();
  const liveProviders = Object.values(providers).filter(Boolean).length;
  const readiness = {
    providers,
    discovery: providers.openai,
    inputResolution: liveProviders > 0,
    aiMeasurement: liveProviders === 3,
    persistence: Boolean(env.supabaseUrl && env.supabaseServiceKey),
    watchEmail: Boolean(env.resendApiKey && env.watchFromEmail),
    billing: Boolean(env.stripeSecretKey && env.stripePriceId && env.stripeWebhookSecret),
    seller: sellerReady(),
    scheduler: Boolean(env.cronSecret),
    productionUrl: !configurationFailures().some((key) => key.startsWith("NEXT_PUBLIC_SITE_URL")),
    abuseProtection: env.rateLimitSalt.length >= 32 && env.rateLimitSalt !== "development-only",
  };
  const scanReady = readiness.discovery && readiness.aiMeasurement && readiness.persistence && readiness.productionUrl && readiness.abuseProtection;
  const watchReady = scanReady && readiness.persistence && readiness.scheduler;
  const paidReady = watchReady && readiness.billing && readiness.seller;
  return Response.json({
    product: "Rovan",
    version: "0.1.0",
    status: paidReady ? "paid-watch-configured" : watchReady ? "watch-configured" : scanReady ? "scan-configured" : liveProviders ? "partially-configured" : "sample-only",
    verification: "configuration-only",
    generatedAt: new Date().toISOString(),
    readiness,
  }, { status: isProductionRuntime() && configurationFailures().length ? 503 : 200, headers: { "cache-control": "no-store" } });
}
