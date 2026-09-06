import type { Metadata } from "next";
import { MarketingShell } from "@/components/marketing-shell";
import { env, providerReadiness } from "@/lib/env";
import { sellerReady } from "@/lib/legal";

export const metadata: Metadata = { title: "本番設定", robots: { index: false, follow: false } };

export default function SetupPage() {
  const providers = providerReadiness();
  const rows = [
    ["OpenAI / 市場発見・AI観測・Change Pack", providers.openai],
    ["Gemini / AI観測", providers.gemini],
    ["Perplexity / AI観測", providers.perplexity],
    ["Supabase / Scan・Watch・公開プロフィール永続化", Boolean(env.supabaseUrl && env.supabaseServiceKey)],
    ["Resend / Watchメール", Boolean(env.resendApiKey && env.watchFromEmail)],
    ["Stripe / 継続課金", Boolean(env.stripeSecretKey && env.stripePriceId && env.stripeWebhookSecret)],
    ["Scheduler / Watch再測定", Boolean(env.cronSecret || process.env.GCP_PROJECT_ID)],
    ["販売者情報", sellerReady()],
    ["本番URL", !env.siteUrl.includes("localhost")],
    ["Rate-limit salt", env.rateLimitSalt !== "development-only"],
  ] as const;
  return <MarketingShell eyebrow="PRODUCTION READINESS" title="Rovanの本番設定。" lead="秘密値そのものは表示せず、診断・週次測定・公開情報の下書き生成に必要な設定が揃っているかを確認します。">
    <div className="readiness-list">{rows.map(([label, ready]) => <div key={label}><strong>{label}</strong><span className={ready ? "ready" : "missing"}>{ready ? "設定済み" : "未設定"}</span></div>)}</div>
    <h2>サンプルだけを見る</h2><p>API Keyがなくても、<code>/result?sample=1</code>と<code>/watch?sample=1</code>で主要画面を確認できます。表示値・会社・競合データはすべてシミュレーションです。</p>
    <h2>実URL診断を動かす</h2><p>市場・競合発見にはOpenAI、3面測定にはOpenAI・Gemini・Perplexityが必要です。3社のうち一部が未設定・失敗した観測は欠損として残し、架空補完しません。</p>
    <h2>Watchの週次測定を動かす</h2><p>Supabaseの全migrationを適用し、ジョブ実行基盤（<code>scripts/deploy-cloud-run-job.sh</code>）で <strong>Cloud Run Jobs ＋ Cloud Scheduler</strong> を配備します。実行頻度、並列数、リース制御は実際の運用条件とコストを確認して設定してください。</p>
    <p>必要migrationは<code>001_core.sql</code>〜<code>010_public_profiles.sql</code>です。004以降でWatch重複防止、Stripe ID保存、ジョブlease、分割測定、最終反映の原子化、公開情報ページの永続化を追加しています。</p>
    <h2>公開情報の下書きと通知</h2><p>OpenAIとSupabaseが必要です。有料Watchでは、実際に取得できた公開ページと確認済み入力をもとに、公開前の下書きと測定結果を保存します。対象サイトやRovanの公開プロフィールを、承認なしに自動変更しません。</p>
    <p>Resendを設定すると開始時と比較可能な変化がある場合に測定結果をメール送信します。未設定でもWatch自体は稼働します。</p>
    <h2>一般販売前</h2><p>Stripe Webhook、全DB migration、販売者情報、本番ドメイン、Privacy/Termsの最終法務確認、Provider契約条件・データ処理条件の確認を完了してください。</p>
  </MarketingShell>;
}
