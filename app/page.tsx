import Link from "next/link";
import { ScanForm } from "@/components/scan-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ProductOutputPreview, ProductProcessVisual, WatchTrendVisual } from "@/components/product-visuals";

export default function HomePage() {
  return <main className="landing-page">
    <SiteHeader />

    <section className="landing-hero">
      <div className="shell landing-hero-inner">
        <p className="overline">商品名・ブランド名・会社名から</p>
        <h1>AIがライバルを勧める理由と、<br /><em>勝てる看板を1分で暴く。</em></h1>
        <p className="landing-hero-lead">特選ぶどう、試作ネジ、SaaS、各種サービスに対応。買い手がChatGPT等で比較する場面を調べ、競合3社の弱点と自社が勝てるポジショニング、すぐに使える発信文を自動作成します。</p>
        <ScanForm />
        <p className="landing-hero-note"><span>商品名・会社名・URL</span><span>競合3社の弱点を解明</span><span>勝てる独自の看板を決定</span><span>SNS・チラシ文を即出力</span></p>
        <Link className="hero-sample-link" href="/result?sample=1">診断結果の見本を見る <span aria-hidden="true">→</span></Link>
      </div>
    </section>

    <section className="landing-proof" id="example">
      <div className="shell">
        <div className="section-intro"><p className="overline">診断結果のイメージ</p><h2>AIに選ばれない質問と、<br />失っている集客機会を見せます。</h2><p>買い手が比較する質問ごとに、自社が候補に入ったか、競合が先に出たか、何を見直すべきかを確認できます。</p></div>
        <ProductOutputPreview />
        <div className="center-link"><Link className="text-button" href="/result?sample=1">この結果を最初から見る <span aria-hidden="true">→</span></Link></div>
      </div>
    </section>

    <section className="landing-how" id="how">
      <div className="shell">
        <div className="section-intro section-intro-wide"><p className="overline">調査から、集客改善まで</p><h2>競合に負けた質問を見つけ、<br />次のマーケティングに使う。</h2></div>
        <ProductProcessVisual />
      </div>
    </section>

    <section className="landing-value">
      <div className="shell landing-value-grid">
        <div className="section-intro"><p className="overline">マーケティングに使える理由</p><h2>顧客がサイトを見る前に、<br />どこで負けたか分かる。</h2><p>買い手はAIや検索で候補を絞ってから、会社サイトを訪れます。AIXは、その比較の場面を調べ、競合に流れた理由を集客の改善機会として整理します。</p></div>
        <div className="plain-points"><div><strong>01</strong><span>顧客が比較する質問</span></div><div><strong>02</strong><span>競合が先に選ばれた理由</span></div><div><strong>03</strong><span>集客に近い最初の改善</span></div></div>
      </div>
    </section>

    <section className="landing-watch">
      <div className="shell landing-watch-grid">
        <WatchTrendVisual />
        <div className="section-intro"><p className="overline">改善の効果を確認</p><h2>直したあと、<br />競合から取り返せたか。</h2><p>同じ比較質問をもう一度調べ、自社が新しく候補に入ったかを確認します。順位だけでなく、顧客が選ぶ場面の変化を追えます。</p><Link className="text-button" href="/watch?sample=1">変化の例を見る <span aria-hidden="true">→</span></Link></div>
      </div>
    </section>

    <section className="landing-trust">
      <div className="shell landing-trust-grid"><div><p className="overline">会社名でもURLでも</p><h2>マーケティングの現在地が、<br />一枚で分かる。</h2></div><div className="trust-list"><div><strong>市場の見え方</strong><span>どんな顧客・用途・比較軸が見えているかを整理します。</span></div><div><strong>競合との差</strong><span>AIが先に勧めた会社と、確認できた根拠を比べます。</span></div><div><strong>見込み客の比較質問</strong><span>候補から外れている購入前の場面を確認できます。</span></div><div><strong>次に使う施策</strong><span>ページ、FAQ、事例など、集客に近い改善を一つに絞ります。</span></div></div></div>
    </section>

    <section className="landing-final-cta"><div className="shell"><p className="overline">無料で、今の比較を調べる</p><h2>競合に流れている質問を、<br />今すぐ見つける。</h2><ScanForm compact /><Link className="final-secondary-link" href="/pricing">継続して変化を見る <span aria-hidden="true">→</span></Link></div></section>

    <SiteFooter />
  </main>;
}
