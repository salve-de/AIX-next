import "server-only";

function text(name: string, fallback = "") {
  return process.env[name]?.trim() || fallback;
}

function integer(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) ? Math.floor(value) : fallback;
}

export const env = {
  siteUrl: text("NEXT_PUBLIC_SITE_URL", "http://localhost:3000").replace(/\/$/, ""),
  appSecret: text("AIX_APP_SECRET", "development-only-change-me"),
  storePath: text("AIX_STORE_PATH", ".data/aix-next.json"),
  openAiKey: text("OPENAI_API_KEY"),
  openAiDiscoveryModel: text("OPENAI_DISCOVERY_MODEL", "gpt-5-mini"),
  openAiSearchModel: text("OPENAI_SEARCH_MODEL", "gpt-5-mini"),
  geminiKey: text("GEMINI_API_KEY"),
  geminiModel: text("GEMINI_MODEL", "gemini-2.5-flash"),
  perplexityKey: text("PERPLEXITY_API_KEY"),
  perplexityModel: text("PERPLEXITY_MODEL", "sonar"),
  supabaseUrl: text("SUPABASE_URL"),
  supabaseServiceKey: text("SUPABASE_SERVICE_ROLE_KEY"),
  stripeSecretKey: text("STRIPE_SECRET_KEY"),
  stripePriceId: text("STRIPE_PRICE_ID"),
  stripeWebhookSecret: text("STRIPE_WEBHOOK_SECRET"),
  resendKey: text("RESEND_API_KEY"),
  mailFrom: text("MAIL_FROM", "AIX <watch@example.com>"),
  cronSecret: text("CRON_SECRET"),
  adminSecret: text("ADMIN_SECRET"),
  freeScanLimitPerHour: Math.max(1, integer("FREE_SCAN_LIMIT_PER_HOUR", 4)),
  freeScanMaxPages: Math.max(5, Math.min(50, integer("FREE_SCAN_MAX_PAGES", 20))),
};

export function providerReadiness() {
  return {
    openai: Boolean(env.openAiKey),
    gemini: Boolean(env.geminiKey),
    perplexity: Boolean(env.perplexityKey),
  };
}
