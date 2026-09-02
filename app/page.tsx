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
        <p className="home-hero-copy">ChatGPTなどで競合が選ばれている購買質問と、あなたが候補から外れる理由まで無料で調べます。</p>
        <ScanForm />
        <div className="hero-trust"><span><LockIcon />登録不要</span><span>カード不要</span><span>公開Webのみ</span></div>
        <Link className="text-link" href="/result?sample=1">架空企業の結果を先に見る <ArrowIcon /></Link>
      </div>
    </section>

    <section className="home-sample-section">
      <div className="shell">
        <div className="home-sample-heading">
          <div><p className="eyebrow">WHAT YOU GET</p><h2>無料診断で、ここまで出します。</h2></div>
          <p>順位だけで終わらせず、候補外になった購買質問、先に選ばれた競合、根拠、不足情報、最優先Actionまで一続きで確認できます。</p>
        </div>
        <ProductOutputPreview />
        <div className="home-sample-link"><Link className="button button-dark" href="/result?sample=1">サンプル結果をすべて見る <ArrowIcon /></Link></div>
      </div>
    </section>

    <section className="home-free-section">
      <div className="shell">
        <div className="section-heading"><p className="eyebrow">FREE MARKET SCAN</p><h2>無料で答えるのは、4つだけ。</h2><p>抽象的なAI SEOスコアではなく、購買判断に直結する問いに絞ります。</p></div>
        <div className="home-answer-grid">
          <article><EyeIcon /><span>01</span><h3>何社中何位か</h3><p>同じBuyer PromptとAI観測面で、自社と競合を比較します。</p></article>
          <article><QuoteIcon /><span>02</span><h3>どの質問で候補外か</h3><p>「失った顧客」ではなく、候補外になった購買質問をPrompt単位で出します。</p></article>
          <article><BotIcon /><span>03</span><h3>誰が代わりに選ばれたか</h3><p>OpenAI・Gemini・Perplexityの観測結果とCitationを残します。</p></article>
          <article><EvidenceIcon /><span>04</span><h3>次に何を足すべきか</h3><p>競合にはあり、自社では確認できないEvidenceから最優先Actionを1件に絞ります。</p></article>
        </div>
      </div>
    </section>

    <section className="home-watch-section">
      <div className="shell home-watch-grid">
        <WatchTrendVisual />
        <div className="home-watch-copy">
          <p className="eyebrow">14-DAY FREE WATCH</p>
          <h2>診断後は、<br />順位が動いたかを見る。</h2>
          <p>同じCore Promptを再測定し、順位、候補入り質問、候補外質問、Citationの差分を比較します。無料Watchは会社メールだけで開始でき、カード登録も自動課金もありません。</p>
          <div className="home-watch-points"><span><TrendIcon />Before → Nowを同条件で比較</span><span><EvidenceIcon />必要な事実だけ企業に確認</span></div>
          <div className="home-watch-actions"><Link className="button button-accent" href="/watch?sample=1">Watchサンプルを見る <ArrowIcon /></Link><Link className="home-inline-link" href="/pricing">料金と測定条件を見る</Link></div>
        </div>
      </div>
    </section>

    <SiteFooter />
  </main>;
}
