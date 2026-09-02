import Link from "next/link";
import { ScanForm } from "@/components/scan-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ProductOutputPreview, WatchTrendVisual } from "@/components/product-visuals";
import { ArrowIcon, BotIcon, EvidenceIcon, EyeIcon, LockIcon, QuoteIcon, TrendIcon } from "@/components/icons";

export default function HomePage() {
  return <main>
    <SiteHeader />

    <section className="home-hero-section">
      <div className="shell home-hero-inner">
        <p className="eyebrow">AI BUYER INTELLIGENCE</p>
        <h1>AI検索で、あなたの会社は<br /><span>何社中何位か。</span></h1>
        <p className="home-hero-copy">ChatGPTなどのAI比較で、どの購買質問なら候補に入り、どこで競合に負けているかまでURLひとつで調べます。</p>
        <ScanForm />
        <div className="hero-trust"><span><LockIcon />登録不要</span><span>カード不要</span><span>公開Webのみ</span></div>
        <Link className="text-link" href="/result?sample=1">架空企業の診断結果を見る <ArrowIcon /></Link>
      </div>
    </section>

    <section className="home-sample-section">
      <div className="shell">
        <div className="home-sample-heading">
          <div><p className="eyebrow">SAMPLE RESULT</p><h2>まず、AI比較での現在地を見る。</h2></div>
          <p>順位だけではなく、候補外になったBuyer Prompt、先に選ばれた競合、その差を生んでいるEvidenceまで同じ画面で確認します。</p>
        </div>
        <ProductOutputPreview />
        <div className="home-sample-link"><Link className="button button-dark" href="/result?sample=1">診断結果を最後まで見る <ArrowIcon /></Link></div>
      </div>
    </section>

    <section className="home-free-section">
      <div className="shell">
        <div className="section-heading"><p className="eyebrow">FREE MARKET SCAN</p><h2>無料診断で判断するのは、4点。</h2><p>曖昧なAI SEOスコアではなく、次の行動につながる比較結果だけを出します。</p></div>
        <div className="home-answer-grid">
          <article><EyeIcon /><span>01</span><h3>何社中何位か</h3><p>同じBuyer PromptとAI観測条件で、自社と競合の現在地を比較します。</p></article>
          <article><QuoteIcon /><span>02</span><h3>どの質問で候補外か</h3><p>買い手が実際に聞く比較質問ごとに、候補入り・候補外を分けます。</p></article>
          <article><BotIcon /><span>03</span><h3>誰が代わりに選ばれたか</h3><p>OpenAI・Gemini・Perplexityの回答とCitationから、先に出る競合を確認します。</p></article>
          <article><EvidenceIcon /><span>04</span><h3>何を直すべきか</h3><p>競合にはあり、自社では確認できないEvidenceから最優先Actionを1件に絞ります。</p></article>
        </div>
      </div>
    </section>

    <section className="home-watch-section">
      <div className="shell home-watch-grid">
        <WatchTrendVisual />
        <div className="home-watch-copy">
          <p className="eyebrow">14-DAY FREE WATCH</p>
          <h2>直したあと、<br />本当に順位が動いたかを見る。</h2>
          <p>同じCore Promptを再測定し、順位、候補入り質問、候補外質問、Citationの差分を比較します。無料Watchは会社メールだけで開始でき、カード登録も自動課金もありません。</p>
          <div className="home-watch-points"><span><TrendIcon />9位 → 7位のように変化を比較</span><span><EvidenceIcon />次に確認すべき事実だけを提示</span></div>
          <div className="home-watch-actions"><Link className="button button-accent" href="/watch?sample=1">Watchの変化を見る <ArrowIcon /></Link><Link className="home-inline-link" href="/pricing">料金と測定条件を見る</Link></div>
        </div>
      </div>
    </section>

    <SiteFooter />
  </main>;
}
