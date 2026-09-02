import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing-shell";
import { env, providerReadiness } from "@/lib/env";
import { sellerReady } from "@/lib/legal";

export const metadata: Metadata = { title: "本番設定", robots: { index: false, follow: false } };

export default function SetupPage() {
  const providers = providerReadiness();
  const rows = [
    ["OpenAI / 市場発見・AI観測", providers.openai],
    ["Gemini / AI観測", providers.gemini],
    ["Perplexity / AI観測", providers.perplexity],
    ["Supabase / Scan・Watch永続化", Boolean(env.supabaseUrl && env.supabaseServiceKey)],
    ["Resend / Watchメール", Boolean(env.resendApiKey && env.watchFromEmail)],
    ["Stripe / 継続課金", Boolean(env.stripeSecretKey && env.stripePriceId && env.stripeWebhookSecret)],
    ["Scheduler / Watch再測定", Boolean(env.cronSecret)],
    ["販売者情報", sellerReady()],
    ["本番URL", !env.siteUrl.includes("localhost")],
    ["Rate-limit salt", env.rateLimitSalt !== "development-only"],
  ] as const;
  return <MarketingShell eyebrow="PRODUCTION READINESS" title="AIX Nextの本番設定。" lead="秘密値そのものは表示せず、商品として稼働できる設定が揃っているかだけを確認します。">
    <div className="readiness-list">{rows.map(([label, ready]) => <div key={label}><strong>{label}</strong><span className={ready ? "ready" : "missing"}>{ready ? "設定済み" : "未設定"}</span></div>)}</div>
    <h2>サンプルだけを見る</h2><p>API Keyがなくても、<code>/result?sample=1</code>と<code>/watch?sample=1</code>で全画面を確認できます。表示値はすべて架空です。</p>
    <h2>実URL診断を動かす</h2><p>市場・競合発見にはOpenAI、3面測定にはOpenAI・Gemini・Perplexityが必要です。3社のうち一部が未設定・失敗した観測は欠損として残し、架空補完しません。</p>
    <h2>14日無料Watch・有料Watchを動かす</h2><p>Supabaseの全migrationを適用し、外部Schedulerから<code>/api/cron/watch</code>をBearer CRON_SECRET付きで定期実行します。Scheduler自体は週次ではなく、既定では15分程度の間隔で呼びます。実際に処理するかはDBの<code>next_run_at</code>で判定し、無料Watchは7日ごと、有料Watchは週次、450観測の有料測定は8 Promptずつ再開可能なchunkに分けます。</p>
    <p>必要migrationは<code>001_core.sql</code>〜<code>008_finalize_watch_run.sql</code>です。004以降でWatch重複防止、Stripe ID保存、ジョブlease、分割測定、最終反映の原子化を追加しています。</p>
    <p>Resendを設定すると開始時と測定完了時にWatchリンクと変化をメール送信します。未設定でもWatch自体は作成できます。</p>
    <h2>一般販売前</h2><p>Stripe Webhook、全DB migration、販売者情報、本番ドメイン、Privacy/Termsの最終法務確認を完了してください。</p>
  </MarketingShell>;
}
