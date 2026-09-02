import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { env, providerReadiness } from "@/lib/env";
import { sellerReady } from "@/lib/legal";

export const metadata: Metadata = { title: "開発用セットアップ", robots: { index: false, follow: false, noarchive: true } };

export default function SetupPage() {
  if (process.env.NODE_ENV === "production") notFound();

  const providers = providerReadiness();
  const rows = [
    ["OpenAI", providers.openai],
    ["Gemini", providers.gemini],
    ["Perplexity", providers.perplexity],
    ["Supabase", Boolean(env.supabaseUrl && env.supabaseServiceKey)],
    ["Resend", Boolean(env.resendApiKey && env.watchFromEmail)],
    ["Stripe", Boolean(env.stripeSecretKey && env.stripePriceId && env.stripeWebhookSecret)],
    ["Scheduler", Boolean(env.cronSecret)],
    ["販売者情報", sellerReady()],
    ["本番URL", !env.siteUrl.includes("localhost")],
    ["Rate limit", env.rateLimitSalt !== "development-only"],
  ] as const;

  return <main className="ux2-account-page">
    <SiteHeader compact />
    <header className="ux2-account-header"><div className="ux2-narrow"><p className="ux2-label">Development only</p><h1>開発用セットアップ</h1><p>このページはproductionでは404になります。秘密値そのものは表示しません。</p></div></header>
    <section className="ux2-account-body"><div className="ux2-narrow"><div className="readiness-list">{rows.map(([label, ready]) => <div key={label}><strong>{label}</strong><span className={ready ? "ready" : "missing"}>{ready ? "設定済み" : "未設定"}</span></div>)}</div><div className="ux2-pricing-note"><h2>実URL診断</h2><p>市場・競合発見にOpenAI、3面測定にOpenAI・Gemini・Perplexityを使います。未設定や失敗は架空補完せず欠損として扱います。</p></div><div className="ux2-pricing-note"><h2>継続モニタリング</h2><p>Supabaseの全migration、Scheduler、必要に応じてResendとStripeを設定します。変更原稿の保存には009_watch_change_pack.sqlも必要です。</p></div></div></section>
  </main>;
}
