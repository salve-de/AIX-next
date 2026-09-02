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
      <div className="shell home-hero-grid-instant">
        <div className="home-hero-copy-instant">
          <p className="home-service-kicker">ChatGPT・Gemini・Perplexityでの競合順位を診断</p>
          <h1>ChatGPTで、<br />あなたの会社は<br /><span>競合何社中何位に出る？</span></h1>
          <p className="home-hero-copy">会社URLを入れるだけ。「おすすめの○○会社は？」と聞かれたときに、自社が候補に入るか、代わりにどの競合が選ばれるか、その理由まで調べます。</p>
          <ScanForm />
          <div className="hero-trust"><span><LockIcon />登録不要</span><span>カード不要</span><span>公開Webのみ</span></div>
          <Link className="text-link" href="/result?sample=1">実際に何が分かるか見る <ArrowIcon /></Link>
        </div>

        <aside className="hero-rank-snapshot" aria-label="AIXで分かる内容の架空サンプル">
          <header><span>架空サンプル</span><small>ChatGPT · Gemini · Perplexity</small></header>
          <div className="hero-rank-main">
            <small>AI上の競合順位</small>
            <strong><span>13社中</span><b>9位</b></strong>
            <p>「取引先審査ツールを比較したい」など12の購買質問で測定</p>
          </div>
          <div className="hero-rank-kpis">
            <article><small>自社が候補入り</small><strong>2 / 12</strong></article>
            <article><small>首位競合</small><strong>7 / 12</strong><span>TrustOrbit</span></article>
          </div>
          <div className="hero-rank-loss">
            <small>この質問では自社が候補外</small>
            <strong>「従業員300名に合う取引先審査ツールは？」</strong>
            <div><span><small>選ばれた競合</small><b>TrustOrbit</b></span><span><small>自社</small><b className="lost">候補外</b></span></div>
          </div>
          <footer><EvidenceIcon /><span><small>候補外の主因</small><strong>同規模企業の導入実績を公開Webで確認できない</strong></span></footer>
        </aside>
      </div>
    </section>

    <section className="home-sample-section">
      <div className="shell">
        <div className="home-sample-heading">
          <div><p className="eyebrow">SAMPLE RESULT</p><h2>順位だけでなく、なぜ負けたかまで出す。</h2></div>
          <p>どの購買質問で候補外になったか、先に選ばれた競合は誰か、その差を生んでいる公開情報まで同じ結果画面で確認します。</p>
        </div>
        <ProductOutputPreview />
        <div className="home-sample-link"><Link className="button button-dark" href="/result?sample=1">診断結果を最後まで見る <ArrowIcon /></Link></div>
      </div>
    </section>

    <section className="home-free-section">
      <div className="shell">
        <div className="section-heading"><p className="eyebrow">FREE SCAN</p><h2>URLひとつで、4つを確認。</h2><p>AI SEOの抽象スコアではなく、競合比較で実際に判断できる数字と根拠を出します。</p></div>
        <div className="home-answer-grid">
          <article><EyeIcon /><span>01</span><h3>競合何社中何位か</h3><p>同じ購買質問とAI観測条件で、自社と競合の現在地を比較します。</p></article>
          <article><QuoteIcon /><span>02</span><h3>どの質問で候補外か</h3><p>買い手が聞く比較質問ごとに、自社が候補に入ったかを確認します。</p></article>
          <article><BotIcon /><span>03</span><h3>代わりに誰が選ばれたか</h3><p>ChatGPT・Gemini・Perplexityの回答から、先に推薦された競合を出します。</p></article>
          <article><EvidenceIcon /><span>04</span><h3>何が足りないか</h3><p>競合にはあり、自社では確認できない公開情報から最優先の改善点を絞ります。</p></article>
        </div>
      </div>
    </section>

    <section className="home-watch-section">
      <div className="shell home-watch-grid">
        <WatchTrendVisual />
        <div className="home-watch-copy">
          <p className="eyebrow">14-DAY FREE WATCH</p>
          <h2>直したあと、<br />順位が動いたか追跡する。</h2>
          <p>同じ購買質問を再測定し、競合順位、候補入り質問、候補外質問、Citationの変化を比較します。無料Watchは会社メールだけで開始でき、カード登録も自動課金もありません。</p>
          <div className="home-watch-points"><span><TrendIcon />9位 → 7位のように変化を比較</span><span><EvidenceIcon />次に確認すべき事実だけを提示</span></div>
          <div className="home-watch-actions"><Link className="button button-accent" href="/watch?sample=1">Watchの変化を見る <ArrowIcon /></Link><Link className="home-inline-link" href="/pricing">料金と測定条件を見る</Link></div>
        </div>
      </div>
    </section>

    <SiteFooter />
  </main>;
}
