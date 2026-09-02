import Link from "next/link";
import { ScanForm } from "@/components/scan-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ProductOutputPreview, WatchTrendVisual } from "@/components/product-visuals";
import { ArrowIcon } from "@/components/icons";

export default function HomePage() {
  return <main className="ux2-home">
    <SiteHeader />

    <section className="ux2-home-hero">
      <div className="shell ux2-home-hero-grid">
        <div className="ux2-home-copy">
          <p className="ux2-label">AI競合診断 · 会社URLだけ</p>
          <h1>ChatGPTで、<br /><span>競合に負けている質問</span>がわかる。</h1>
          <p>会社URLを入れるだけ。自社が候補から外れる比較質問、代わりに選ばれる競合、その理由、まず直すべき1件まで診断します。</p>
          <ScanForm />
          <p className="ux2-home-micro"><span>登録不要</span><span>カード不要</span><span>公開Webのみ</span></p>
          <div className="ux2-home-links"><Link className="ux2-link" href="/result?sample=1">サンプル結果を見る <ArrowIcon /></Link><Link className="ux2-link" href="/methodology">どう測るか</Link></div>
        </div>
        <ProductOutputPreview />
      </div>
    </section>

    <section className="ux2-home-section soft">
      <div className="shell">
        <div className="ux2-section-head">
          <p className="ux2-label">WHAT YOU GET</p>
          <h2>AIで9位だった。では終わりません。</h2>
          <p>順位そのものではなく、「どこで候補から外れ、なぜ競合が選ばれ、まず何を直すか」まで一続きで分かることがAIXの価値です。</p>
        </div>
        <div className="ux2-value-steps">
          <article><span>1</span><h3>どこで負けているか分かる</h3><strong>候補外 10 / 12</strong><p>買い手が実際に聞く比較質問ごとに、自社が候補に入ったかを確認します。</p></article>
          <article><span>2</span><h3>なぜ負けているか分かる</h3><strong>同規模の導入実績</strong><p>競合の引用元と自社の公開情報を比べ、確認できない比較材料を特定します。</p></article>
          <article><span>3</span><h3>まず何を直すか分かる</h3><strong>導入実績ページを改善</strong><p>一般的なSEOチェックリストではなく、今回の比較質問に関係するActionを1件に絞ります。</p></article>
        </div>
      </div>
    </section>

    <section className="ux2-home-section">
      <div className="shell ux2-why-grid">
        <div className="ux2-section-head">
          <p className="ux2-label">WHY NOW</p>
          <h2>サイトに来る前に、比較は始まっています。</h2>
          <p>アクセス解析で見えるのは、すでにサイトへ来た人です。AIXはその手前、AIの比較回答で自社が候補に入るかどうかを確認します。</p>
        </div>
        <div className="ux2-why-flow" aria-label="買い手の比較行動">
          <article><small>1 · 検討開始</small><h3>AIに比較を聞く</h3><p>「おすすめは？」「A社とB社なら？」と条件を伝える。</p></article><span>→</span>
          <article className="emphasis"><small>2 · AIXが見る場所</small><h3>候補が絞られる</h3><p>ここで自社が外れる質問と、競合が選ばれる理由を確認。</p></article><span>→</span>
          <article><small>3 · 詳細検討</small><h3>サイト・資料・営業へ</h3><p>候補に入った会社をさらに調べ、問い合わせや商談へ進む。</p></article>
        </div>
      </div>
    </section>

    <section className="ux2-home-section soft">
      <div className="shell ux2-watch-preview">
        <WatchTrendVisual />
        <div className="ux2-watch-copy">
          <p className="ux2-label">14日間無料</p>
          <h2>直したあと、効いたか確認する。</h2>
          <p>同じ比較質問をもう一度測り、「新しく候補入りした質問」「まだ候補外の質問」「競合や引用元の変化」を見ます。無料期間から自動課金はありません。</p>
          <div className="ux2-home-links"><Link className="button button-dark" href="/watch?sample=1">変化のサンプルを見る <ArrowIcon /></Link><Link className="ux2-link" href="/pricing">料金を見る</Link></div>
        </div>
      </div>
    </section>

    <section className="ux2-final-cta">
      <div className="shell ux2-final-cta-grid">
        <div><h2>まず、自社がどこで外れているか確認する。</h2><p>無料診断は12の比較質問。登録・カードは不要です。</p></div>
        <ScanForm compact />
      </div>
    </section>

    <SiteFooter />
  </main>;
}
