import Link from "next/link";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { MarketingShell } from "@/components/marketing-shell";

const free = ["会社URL 1件", "Buyer Prompt 12件を自動生成", "ChatGPT・Gemini・Perplexityで競合比較", "候補外になった購買質問", "先に選ばれた競合とCitation", "最大のEvidence Gapと最優先Action 1件"];
const paid = ["1ブランド", "固定Core Prompt 50件 + Discovery Prompt 20件", "3 AI × 各3回 × 週次で再測定", "新しく候補入り / 候補外になった質問の差分", "全生回答・全Citation", "Evidence Inbox", "Change Pack（必要事実・見出し・本文・FAQ）", "優先Actionの再ランキング", "12か月履歴"];

export default function PricingPage() {
  return <MarketingShell eyebrow="PRICING" title="負けている場所を知るのは無料。改善を回し続けるところから有料。" lead="AIXは順位表を見るためのサブスクではありません。どこで競合に負け、何を直し、その変更が効いたかを同じ条件で追い続けるためのサービスです。">
    <div className="pricing-value-strip">
      <article><small>FREE SCAN</small><strong>まず、見つける</strong><span>どの購買質問で候補外か、誰に負けているか、最初に何を直すか。</span></article>
      <article><small>14-DAY WATCH</small><strong>次に、確かめる</strong><span>同じ質問でもう一度測り、改善後に順位・候補入りが動いたかを見る。</span></article>
      <article><small>FOUNDER WATCH</small><strong>その後、回し続ける</strong><span>毎週の差分から次のActionを更新し、AI比較での取りこぼしを継続的に減らす。</span></article>
    </div>

    <div className="pricing-grid">
      <article><p className="eyebrow">FREE MARKET SCAN</p><h2>¥0</h2><p>「AIで自社は強いのか？」を曖昧なスコアではなく、買う前の質問ごとの勝敗で確認します。</p><ul>{free.map((item) => <li key={item}><CheckIcon />{item}</li>)}</ul><Link className="button button-dark" href="/#scan">競合に負けている質問を無料診断 <ArrowIcon /></Link></article>
      <article className="featured"><p className="eyebrow">FOUNDER WATCH</p><h2>¥29,800<small> / 月・税別</small></h2><p>毎週「何が動いたか → 次に何を直すか」を更新。担当者がダッシュボードを読み解かなくても改善サイクルを回せる状態を目指します。</p><ul>{paid.map((item) => <li key={item}><CheckIcon />{item}</li>)}</ul><Link className="button button-accent" href="/#scan">まず無料診断で必要性を確認 <ArrowIcon /></Link><small className="price-note">月ごとの自動更新。契約後は次回更新日前まで解約できます。</small></article>
    </div>

    <h2>14日間の無料Watchで、払う価値があるか先に確認</h2><p>無料Scanの結果を保存した後、会社メールだけで開始します。Baselineと次回測定を比較し、「直したあとに本当に候補入りが増えたか」というAIXの継続価値を体験してから有料を判断できます。カード登録は不要で、有料契約へ自動移行しません。</p>

    <h2>特に価値が出やすい会社</h2><p>B2B SaaS、ITサービス、コンサルティングなど、買い手が複数社を比較してから問い合わせる会社です。1件の有望商談の価値が高いほど、「問い合わせが発生する前の比較候補に入れているか」を把握する意味が大きくなります。</p>

    <h2>保証しないこと</h2><p>AIXが測るのは、設定したBuyer PromptとAI観測面における再現可能な観測です。AI上の絶対順位、推薦、Citation、問い合わせ、売上の増加を保証しません。外部媒体掲載費、広告費、大規模サイト改修、法務確認、個別コンサルティングも料金には含みません。</p>
  </MarketingShell>;
}
