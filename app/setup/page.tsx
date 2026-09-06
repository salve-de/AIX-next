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
  return <MarketingShell eyebrow="PRODUCTION READINESS" title="Rovanの本番設定。" lead="秘密値そのものは表示せず、診断 → 見守り（Watch） → 公開参照インデックス自動配備 → 週次定期防衛まで商品として自走できる設定が揃っているかを確認します。">
    <div className="readiness-list">{rows.map(([label, ready]) => <div key={label}><strong>{label}</strong><span className={ready ? "ready" : "missing"}>{ready ? "設定済み" : "未設定"}</span></div>)}</div>
    <h2>サンプルだけを見る</h2><p>API Keyがなくても、<code>/result?sample=1</code>と<code>/watch?sample=1</code>で主要画面を確認できます。表示値・会社・競合データはすべてシミュレーションです。</p>
    <h2>実URL診断を動かす</h2><p>市場・競合発見にはOpenAI、3面測定にはOpenAI・Gemini・Perplexityが必要です。3社のうち一部が未設定・失敗した観測は欠損として残し、架空補完しません。</p>
    <h2>14日無料Watch・有料Watchを動かす（完全放置・10,000社スケール対応）</h2><p>Supabaseの全migrationを適用し、10,000社スケール対応のコンテナバッチ基盤（<code>scripts/deploy-cloud-run-job.sh</code>）で <strong>Cloud Run Jobs ＋ Cloud Scheduler</strong> を配備します。毎週月曜朝9時に最大1,000並列分散で自動実行され、DBの<code>next_run_at</code>に基づき排他リース制御で完全自走します。</p>
    <p>必要migrationは<code>001_core.sql</code>〜<code>010_public_profiles.sql</code>です。004以降でWatch重複防止、Stripe ID保存、ジョブlease、分割測定、最終反映の原子化、AI公開参照インデックス永続化を追加しています。</p>
    <h2>自走防衛とAI公開参照インデックス</h2><p>OpenAIとSupabaseが必要です。有料Watchの週次再測定完了時に競合差分を検知し、自社の公開確定事実に基づきAI向け参照インデックス（<code>/ai/company/[slug]</code>）を自律更新します。自社サイト改修ゼロで、完全放置の防衛ループを回します。</p>
    <p>Resendを設定すると開始時と重要変化検知時に防衛レポートをメール送信します。未設定でもWatch自体は稼働します。</p>
    <h2>一般販売前</h2><p>Stripe Webhook、全DB migration、販売者情報、本番ドメイン、Privacy/Termsの最終法務確認、Provider契約条件・データ処理条件の確認を完了してください。</p>
  </MarketingShell>;
}
