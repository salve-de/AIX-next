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
        <h1>AIがライバルをおすすめする理由と、<br /><em>選ばれる看板を1分で見つける。</em></h1>
        <p className="landing-hero-lead">特選ぶどう、試作ネジ、地域の名店、各種サービスに対応。買い手がChatGPT等で比較する場面を調べ、競合が対応しきれない隙間と、自社が選ばれる看板（独自の強み）、すぐに使える紹介文をその場で作成します。</p>
        <ScanForm />
        <p className="landing-hero-note"><span>商品名・会社名・URL</span><span>競合の隙間を解明</span><span>選ばれる看板を決定</span><span>SNS・チラシ文を即出力</span></p>
        <Link className="hero-sample-link" href="/result?sample=1">診断結果の見本を見る <span aria-hidden="true">→</span></Link>
      </div>
    </section>

    <section className="landing-proof" id="example">
      <div className="shell">
        <div className="section-intro"><p className="overline">診断結果のイメージ</p><h2>AIに選ばれない質問と、<br />自社が選ばれる理由を見せます。</h2><p>買い手が比較する質問ごとに、自社が候補に入ったか、競合が先に出たか、自社の何を伝えるべきかを確認できます。</p></div>
        <ProductOutputPreview />
        <div className="center-link"><Link className="text-button" href="/result?sample=1">この結果を最初から見る <span aria-hidden="true">→</span></Link></div>
      </div>
    </section>

    <section className="landing-how" id="how">
      <div className="shell">
        <div className="section-intro section-intro-wide"><p className="overline">調査から、集客改善まで</p><h2>競合に競り負けた質問を見つけ、<br />次の集客に活かす。</h2></div>
        <ProductProcessVisual />
      </div>
    </section>

    <section className="landing-value">
      <div className="shell landing-value-grid">
        <div className="section-intro"><p className="overline">集客に役立つ理由</p><h2>お客様がホームページを見る前に、<br />どこで負けたかが分かる。</h2><p>買い手はAIで候補を絞ってから、商品や会社を詳しく調べます。AIXは、その比較の場面を調べ、競合に流れてしまった理由を自社の強みへ変える道筋を示します。</p></div>
        <div className="plain-points"><div><strong>01</strong><span>お客様が比較する質問</span></div><div><strong>02</strong><span>ライバルが先に選ばれた理由</span></div><div><strong>03</strong><span>自社が勝てる独自の看板</span></div></div>
      </div>
    </section>

    <section className="landing-watch">
      <div className="shell landing-watch-grid">
        <WatchTrendVisual />
        <div className="section-intro"><p className="overline">改善の効果を確認</p><h2>発信したあと、<br />ライバルから取り返せたか。</h2><p>同じ比較質問をもう一度調べ、自社が新しくおすすめに入ったかを確認します。順位だけでなく、お客様が選ぶ場面の変化を毎週見守れます。</p><Link className="text-button" href="/watch?sample=1">変化の例を見る <span aria-hidden="true">→</span></Link></div>
      </div>
    </section>

    <section className="landing-trust">
      <div className="shell landing-trust-grid"><div><p className="overline">商品名でも会社名でも</p><h2>ネット集客のいまの状況が、<br />一枚で分かる。</h2></div><div className="trust-list"><div><strong>市場の見え方</strong><span>どんなお客様や用途で比較されているかを整理します。</span></div><div><strong>競合との差</strong><span>AIが先に勧めた会社と、自社の強みを比べます。</span></div><div><strong>見込み客の比較質問</strong><span>自社が外れてしまっている購入前の質問を確認できます。</span></div><div><strong>すぐに使える紹介文</strong><span>SNS、ブログ、チラシなど、すぐに使える文章を用意します。</span></div></div></div>
    </section>

    <section className="landing-final-cta"><div className="shell"><p className="overline">無料で、今の比較を調べる</p><h2>ライバルに流れている質問を、<br />今すぐ見つける。</h2><ScanForm compact /><Link className="final-secondary-link" href="/pricing">料金プランを見る <span aria-hidden="true">→</span></Link></div></section>

    <SiteFooter />
  </main>;
}
