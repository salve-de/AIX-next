import Link from "next/link";
import { ScanForm } from "@/components/scan-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ProductOutputPreview, WatchTrendVisual } from "@/components/product-visuals";
import { ArrowIcon, EvidenceIcon, LockIcon, TrendIcon } from "@/components/icons";

export default function HomePage() {
  return <main>
    <SiteHeader />

    <section className="home-hero-section">
      <div className="shell home-hero-grid-instant">
        <div className="home-hero-copy-instant">
          <p className="home-service-kicker">ChatGPT競合診断 · 会社URLだけ</p>
          <h1>ChatGPTで、<br /><span>競合に負けている質問</span>がわかる。</h1>
          <p className="home-value-promise">自社が候補に入るために、何を直すかまで出します。</p>
          <p className="home-hero-copy">買い手が「おすすめの○○会社は？」「A社とB社ならどっち？」とAIに聞く場面を再現。どの質問で自社が候補外になり、代わりに誰が選ばれ、公開情報の何が足りないかを調べます。</p>
          <ScanForm />
          <div className="hero-operation-line" aria-label="AIXの流れ"><span>自社が外れる質問を発見</span><ArrowIcon /><span>直す場所を1つに絞る</span><ArrowIcon /><span>同じ質問で再測定</span></div>
          <div className="hero-trust"><span><LockIcon />登録不要</span><span>カード不要</span><span>公開Webのみ</span></div>
          <Link className="text-link" href="/result?sample=1">架空サンプルで結果を見る <ArrowIcon /></Link>
        </div>

        <aside className="hero-rank-snapshot" aria-label="AIXで分かる内容の架空サンプル">
          <header><span>架空サンプル</span><small>ChatGPT · Gemini · Perplexity</small></header>
          <div className="hero-rank-main">
            <small>AI上の競合順位</small>
            <strong><span>13社中</span><b>9位</b></strong>
            <p>12の「買う前に聞く質問」で測定</p>
          </div>
          <div className="hero-rank-kpis">
            <article className="negative"><small>自社が候補外</small><strong>10 / 12</strong><span>購買質問</span></article>
            <article><small>首位競合が候補入り</small><strong>7 / 12</strong><span>TrustOrbit</span></article>
          </div>
          <div className="hero-rank-loss">
            <small>競合が選ばれ、自社が外れた質問</small>
            <strong>「従業員300名に合う取引先審査ツールは？」</strong>
            <div><span><small>選ばれた競合</small><b>TrustOrbit</b></span><span><small>自社</small><b className="lost">候補外</b></span></div>
          </div>
          <footer><EvidenceIcon /><span><small>最優先Action · 10問に関連</small><strong>同規模企業の導入実績を、比較できる形で公開する</strong></span></footer>
        </aside>
      </div>
    </section>

    <section className="value-loop-section">
      <div className="shell">
        <div className="value-loop-heading">
          <div><p className="eyebrow">WHAT CHANGES</p><h2>順位表を見るためではない。<br />負けている理由を、次にやる作業へ変える。</h2></div>
          <p>AIXの価値は「AIで9位だった」と知ることではありません。どの比較場面で競合が選ばれ、自社が外れているかを特定し、何を足せば改善を狙えるかを決め、同じ条件で結果が動いたかまで確認できることです。</p>
        </div>
        <div className="value-loop-grid">
          <article><span>01</span><small>FIND</small><h3>取りこぼしている比較場面を見つける</h3><strong>候補外 10 / 12</strong><p>「どこで負けているか分からない」を、Buyer Prompt単位の具体的な勝敗に変えます。</p></article>
          <article><span>02</span><small>EXPLAIN</small><h3>競合が選ばれる理由を特定する</h3><strong>TrustOrbit 7 / 12</strong><p>競合のCitationと自社の公開情報を照合し、比較材料の差を確認します。</p></article>
          <article><span>03</span><small>ACT</small><h3>直す場所を1つに絞る</h3><strong>「導入実績を追加」</strong><p>抽象的なSEO助言ではなく、関連する購買質問数と一緒に最優先Actionを出します。</p></article>
          <article><span>04</span><small>PROVE</small><h3>直したあと、本当に動いたか見る</h3><strong>9位 → 7位</strong><p>同じCore Promptを再測定し、候補入り・候補外・競合・Citationの変化を追跡します。</p></article>
        </div>
        <div className="value-loop-outcome"><TrendIcon /><p><small>最終的に狙うこと</small><strong>AIの点数を上げることではなく、買い手が営業へ連絡する前の比較で、自社が検討候補に入る機会を増やすこと。</strong></p></div>
      </div>
    </section>

    <section className="buyer-journey-section">
      <div className="shell buyer-journey-grid">
        <div className="buyer-journey-copy"><p className="eyebrow">WHY IT MATTERS</p><h2>サイトに来る前に、<br />比較は始まっている。</h2><p>通常のアクセス解析で見えるのは「サイトに来た人」だけです。AIの比較回答で候補から外れ、そもそも訪問しなかった場面はGAやCRMには残りません。AIXは、その手前の比較段階を観測します。</p></div>
        <div className="buyer-journey-flow">
          <article><span>1</span><small>BUYER</small><h3>AIに比較を聞く</h3><p>「おすすめは？」「どっちが合う？」と購入前の条件を伝える。</p></article>
          <ArrowIcon />
          <article className="critical"><span>2</span><small>AI SHORTLIST</small><h3>数社が候補に出る</h3><p>ここで自社が出なければ、その後の比較対象になりにくい。</p></article>
          <ArrowIcon />
          <article><span>3</span><small>DEEPER EVALUATION</small><h3>サイト確認・問い合わせ</h3><p>候補に入った会社をさらに調べ、商談・資料請求などへ進む。</p></article>
          <div className="buyer-journey-aix"><strong>AIXが見るのはここ</strong><span>②で自社が外れる質問と、その理由を特定</span></div>
        </div>
      </div>
    </section>

    <section className="home-sample-section">
      <div className="shell">
        <div className="home-sample-heading">
          <div><p className="eyebrow">ACTUAL OUTPUT</p><h2>診断すると、こう見える。</h2></div>
          <p>順位だけでなく、候補外になった購買質問、先に選ばれた競合、確認できないEvidence、最優先Actionまで一続きで出します。</p>
        </div>
        <ProductOutputPreview />
        <div className="home-sample-link"><Link className="button button-dark" href="/result?sample=1">診断結果を最後まで見る <ArrowIcon /></Link></div>
      </div>
    </section>

    <section className="home-watch-section">
      <div className="shell home-watch-grid">
        <WatchTrendVisual />
        <div className="home-watch-copy">
          <p className="eyebrow">14-DAY FREE WATCH</p>
          <h2>改善したあと、<br />効いたかまで確認する。</h2>
          <p>一度の診断で終わらせず、同じ購買質問を再測定します。順位だけでなく「新しく候補入りした質問」「逆に落ちた質問」「Citationの変化」を見て、次の改善を決めます。</p>
          <div className="home-watch-points"><span><TrendIcon />9位 → 7位のように変化を比較</span><span><EvidenceIcon />次に直すべき事実を再優先順位付け</span></div>
          <div className="home-watch-actions"><Link className="button button-accent" href="/watch?sample=1">Watchの変化を見る <ArrowIcon /></Link><Link className="home-inline-link" href="/pricing">料金と継続価値を見る</Link></div>
        </div>
      </div>
    </section>

    <SiteFooter />
  </main>;
}
