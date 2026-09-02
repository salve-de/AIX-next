import Link from "next/link";
import { ArrowIcon, CheckIcon } from "@/components/icons";
import { MarketingShell } from "@/components/marketing-shell";

const free = ["会社URL 1件", "Buyer Prompt 12件", "OpenAI・Gemini・Perplexity", "各1回の方向性診断", "Recommendation / Mention / Citationを分離", "競合・候補外質問・比較材料・最優先Action", "AI Crawlability監査"];
const paid = ["1ブランド", "固定Core Prompt 50件", "Discovery Prompt 20件", "Custom Prompt 最大25件", "OpenAI・Gemini・Perplexity・Claude・Grok", "5 AI × 各3回 × 週次", "Visibility / Recommendation / Citation / Competitor", "Narrative / Evidence / Change Pack / 対象Prompt再測定", "AI Crawlability + 実Agent Analytics ingest", "週次Executive Brief", "Executive / JSON / CSV Export", "12か月Core履歴"];

export default function PricingPage() {
  return <MarketingShell eyebrow="PRICING" title="問題の発見は無料。継続観測と改善ループから有料。" lead="最初に結果を見せ、必要性を確認してから14日間Watchへ進みます。無料Watchから自動課金はされません。">
    <div className="pricing-grid">
      <article><p className="eyebrow">FREE AI BUYER MARKET SCAN</p><h2>¥0</h2><p>URLを入力して、自社がAIの購入候補に入る場面と候補外になる購買質問、その理由、公開サイトの読みやすさまで確認します。</p><ul>{free.map((item) => <li key={item}><CheckIcon />{item}</li>)}</ul><Link className="button button-dark" href="/#scan">候補外になる質問を無料で調べる <ArrowIcon /></Link></article>
      <article className="featured"><p className="eyebrow">FOUNDER WATCH</p><h2>¥29,800<small> / 月・税別</small></h2><p>AI購買市場を固定Coreで追跡し、新しい機会はDiscovery、固有質問はCustom、実crawler/referralはAgent Analyticsで分離して管理します。</p><ul>{paid.map((item) => <li key={item}><CheckIcon />{item}</li>)}</ul><Link className="button button-accent" href="/#scan">無料診断から開始 <ArrowIcon /></Link><small className="price-note">月ごとの自動更新。契約後は次回更新日前まで解約できます。</small></article>
    </div>
    <h2>14日間の無料Watch</h2><p>無料Scanの後、会社メールだけで30件の固定Core Baselineを新しく作ります。無料期間はOpenAI・Gemini・Perplexityを各1回で追跡し、カード登録も自動課金もありません。</p>
    <h2>有料化したときに何が増えるか</h2><p>Founder WatchではCoreを50件へ拡張し、ClaudeとGrokを追加した5 AI × 各3回へ切り替えます。この時点で新しいCore Baselineを作るため、3面のTrialと5面のPaidを同じ時系列として混ぜません。</p>
    <h2>なぜCore / Discovery / Customを分けるのか</h2><p>質問を入れ替えるだけでVisibilityが上がったように見せないためです。固定Coreだけをトレンドに使い、DiscoveryとCustomは探索用の別Panelとして保存します。測定AI surfaceの構成が変わった場合もPanel versionを変えます。</p>
    <h2>Agent Analyticsについて</h2><p>公開クロールだけから「AI botが来た」「ChatGPTから流入した」と推測しません。実アクセスを見たい場合は、サーバー・CDN・分析基盤からAIXのIngest APIへ認識済みAI crawler / AI referrerイベントを送ります。Raw IPは保存対象にしていません。</p>
    <h2>料金に含まれないもの</h2><p>外部媒体掲載費、広告費、取材費、顧客サイトの大規模改修、法務確認、個別コンサルティングは含みません。AIXはAI上の絶対順位、推薦、Citation、問い合わせ、売上を保証しません。</p>
  </MarketingShell>;
}
