import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing-shell";
import { env, providerReadiness } from "@/lib/env";
import { sellerReady } from "@/lib/legal";

export const metadata: Metadata = { title: "本番設定", robots: { index: false, follow: false } };

export default function SetupPage() {
  const providers = providerReadiness();
  const rows = [
    ["OpenAI", providers.openai],
    ["Gemini", providers.gemini],
    ["Perplexity", providers.perplexity],
    ["Supabase", Boolean(env.supabaseUrl && env.supabaseServiceKey)],
    ["Stripe", Boolean(env.stripeSecretKey && env.stripePriceId && env.stripeWebhookSecret)],
    ["Weekly scheduler", Boolean(env.cronSecret)],
    ["販売者情報", sellerReady()],
    ["本番URL", !env.siteUrl.includes("localhost")],
    ["Rate-limit salt", env.rateLimitSalt !== "development-only"],
  ] as const;
  return <MarketingShell eyebrow="PRODUCTION READINESS" title="AIX Nextの本番設定。" lead="秘密値そのものは表示せず、商品として稼働できる設定が揃っているかだけを確認します。">
    <div className="readiness-list">{rows.map(([label, ready]) => <div key={label}><strong>{label}</strong><span className={ready ? "ready" : "missing"}>{ready ? "設定済み" : "未設定"}</span></div>)}</div>
    <h2>サンプルだけを見る</h2><p>API Keyがなくても、<code>/result?sample=1</code>と<code>/watch?sample=1</code>で全画面を確認できます。</p>
    <h2>実URL診断を動かす</h2><p>会社・市場の高精度な発見にはOpenAI、3面測定にはOpenAI・Gemini・Perplexityを設定します。永続WatchにはSupabase、課金にはStripeが必要です。</p>
    <h2>一般販売前</h2><p>販売者情報、特商法表記、Stripe Webhook、Scheduler、本番ドメイン、Privacy/Termsの最終法務確認を完了してください。</p>
  </MarketingShell>;
}
