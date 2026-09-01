import Link from "next/link";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { MarketingShell } from "@/components/marketing-shell";

const free = ["会社URL 1件", "Buyer Prompt 12件", "OpenAI・Gemini・Perplexity", "各1回の方向性診断", "市場・競合・候補外質問", "Citation・Evidence Gap・最優先Action"];
const paid = ["1ブランド", "固定Core Prompt 50件", "Discovery Prompt 20件", "3 AI × 各3回 × 週次", "全生回答・全Citation", "Evidence Inbox", "優先Action", "12か月履歴"];

export default function PricingPage() {
  return <MarketingShell eyebrow="PRICING" title="問題の発見は無料。継続観測から有料。" lead="最初に結果を見せ、必要性を確認してから14日間Watchへ進みます。無料Watchから自動課金はされません。">
    <div className="pricing-grid">
      <article><p className="eyebrow">FREE MARKET SCAN</p><h2>¥0</h2><p>URLを入力して、自社がAIの購入候補に入る場面と候補外になる質問を確認します。</p><ul>{free.map((item) => <li key={item}><CheckIcon />{item}</li>)}</ul><Link className="button button-dark" href="/#scan">無料で診断 <ArrowIcon /></Link></article>
      <article className="featured"><p className="eyebrow">FOUNDER WATCH</p><h2>¥29,800<small> / 月・税別</small></h2><p>同じAI購買市場を毎週追跡し、競合差と不足Evidenceを更新します。</p><ul>{paid.map((item) => <li key={item}><CheckIcon />{item}</li>)}</ul><Link className="button button-accent" href="/#scan">無料診断から開始 <ArrowIcon /></Link><small className="price-note">月ごとの自動更新。契約後は次回更新日前まで解約できます。</small></article>
    </div>
    <h2>14日間の無料Watch</h2><p>無料Scanの結果を保存した後、会社メールだけで開始します。Baselineと次回測定を比較し、Evidence Taskを体験できます。カード登録は不要で、有料契約へ自動移行しません。</p>
    <h2>料金に含まれないもの</h2><p>外部媒体掲載費、広告費、取材費、顧客サイトの大規模改修、法務確認、個別コンサルティングは含みません。AIXはAI上の絶対順位、推薦、Citation、問い合わせ、売上を保証しません。</p>
  </MarketingShell>;
}
