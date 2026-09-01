import { env, providerReadiness } from "@/lib/env";

export const runtime = "nodejs";

export async function GET() {
  const providers = providerReadiness();
  return Response.json({
    status: providers.openai ? "ready-partial" : "configuration-required",
    version: "0.1.0",
    providers,
    persistence: env.supabaseUrl && env.supabaseServiceKey ? "supabase" : "local-json",
    billing: Boolean(env.stripeSecretKey && env.stripePriceId && env.stripeWebhookSecret),
    scheduler: Boolean(env.cronSecret),
    generatedAt: new Date().toISOString(),
  }, { status: providers.openai ? 200 : 503, headers: { "cache-control": "no-store" } });
}
