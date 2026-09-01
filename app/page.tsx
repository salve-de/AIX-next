import Link from "next/link";
import { ScanForm } from "@/components/scan-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { HeroShortlistVisual, ProductOutputPreview, ProductProcessVisual, WatchTrendVisual } from "@/components/product-visuals";
import { ArrowIcon, BotIcon, EvidenceIcon, EyeIcon, LockIcon, QuoteIcon, TrendIcon } from "@/components/icons";

export default function HomePage() {
  return <main>
    <SiteHeader />
    <section className="hero-section">
      <div className="shell hero-grid">
        <div className="hero-copy-block">
          <p className="eyebrow">AI BUYER INTELLIGENCE</p>
          <h1>AIの比較候補から、<br /><span>自社が落ちる理由を特定する。</span></h1>
          <p className="hero-copy">会社URLだけで、見込み客がAIに聞く購買質問、先に選ばれる競合、使われたCitation、不足しているEvidenceを調べます。</p>
          <ScanForm />
          <div className="hero-trust"><span><LockIcon />登録不要</span><span>カード不要</span><span>公開Webのみ</span></div>
          <Link className="text-link" href="/result?sample=1">架空企業の診断サンプルを見る <ArrowIcon /></Link>
        </div>
        <HeroShortlistVisual />
      </div>
    </section>

    <section className="signal-strip"><div className="shell signal-grid"><article><EyeIcon /><div><strong>どの質問で候補外か</strong><small>Buyer Prompt単位</small></div></article><article><BotIcon /><div><strong>誰が代わりに選ばれたか</strong><small>3つのAIで観測</small></div></article><article><QuoteIcon /><div><strong>何が根拠に使われたか</strong><small>Raw回答とCitation</small></div></article><article><EvidenceIcon /><div><strong>次に何を足すべきか</strong><small>Evidence Taskへ変換</small></div></article></div></section>

    <section className="section section-light">
      <div className="shell split-section">
        <div className="section-copy"><p className="eyebrow">THE OUTPUT</p><h2>「AI SEO 43点」ではなく、<br />購買機会の勝敗を出す。</h2><p>経営者が知りたいのは、曖昧な評価点ではありません。どの比較質問で候補に入り、どこで競合が先に選ばれ、その理由を支える証拠は何かです。</p><ul className="check-list"><li>同じ観測パネルでの市場位置</li><li>購入候補としてのRecommendation Coverage</li><li>最も重要な候補外Buyer Prompt</li><li>AIが使ったCitationと競合Evidence</li><li>企業に確認すべき不足情報</li></ul><Link className="button button-dark" href="/result?sample=1">結果画面をすべて見る <ArrowIcon /></Link></div>
        <ProductOutputPreview />
      </div>
    </section>

    <section className="section section-deep">
      <div className="shell"><div className="section-heading centered"><p className="eyebrow">HOW AIX WORKS</p><h2>URLから、次の一手まで。</h2><p>ユーザーにPromptや競合を設定させず、同じ購買場面を自動で組み立てます。</p></div><ProductProcessVisual /></div>
    </section>

    <section className="section section-light">
      <div className="shell split-section watch-split">
        <WatchTrendVisual />
        <div className="section-copy"><p className="eyebrow">NOT A ONE-TIME REPORT</p><h2>一回の診断で終わらず、<br />同じ市場を追い続ける。</h2><p>固定Core Promptを週次で再測定します。質問を入れ替えて数値を良く見せず、候補入り、候補外、Citation、競合、新しいEvidence不足を同じ条件で比較します。</p><div className="watch-value-list"><article><TrendIcon /><div><strong>Before → Now</strong><small>同じPanelだけを比較</small></div></article><article><EvidenceIcon /><div><strong>Need You</strong><small>企業しか知らない事実だけ確認</small></div></article><article><ArrowIcon /><div><strong>First Action</strong><small>次に直す一件へ絞る</small></div></article></div><Link className="button button-dark" href="/watch?sample=1">Watch画面を見る <ArrowIcon /></Link></div>
      </div>
    </section>

    <section className="section pricing-preview-section">
      <div className="shell pricing-preview-grid"><div><p className="eyebrow">START WITH THE LOSS</p><h2>問題と根拠までは無料。<br />追い続ける部分から有料。</h2><p>無料結果を見た後に、14日間のWatchをカードなしで開始できます。無料期間から自動課金へは移行しません。</p><Link className="text-link light-link" href="/pricing">料金と測定範囲を確認 <ArrowIcon /></Link></div><article className="price-card"><span>FOUNDER WATCH</span><strong>¥29,800<small> / 月・税別</small></strong><ul><li>固定Core Prompt 50件</li><li>OpenAI・Gemini・Perplexity</li><li>各3回・週次観測</li><li>全回答・Citation・Evidence Task</li><li>12か月履歴</li></ul><a className="button button-accent" href="#scan">まず無料で診断 <ArrowIcon /></a></article></div>
    </section>

    <section className="section final-scan-section"><div className="shell final-scan"><p className="eyebrow">FREE MARKET SCAN</p><h2>自社がAIの候補に入っているか、<br />URL一つで確認する。</h2><p>結果を見るまで登録もカードも不要です。</p><ScanForm compact /></div></section>
    <SiteFooter />
  </main>;
}
