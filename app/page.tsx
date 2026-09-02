import Link from "next/link";
import { ScanForm } from "@/components/scan-form";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ProductOutputPreview, WatchTrendVisual } from "@/components/product-visuals";
import { ArrowIcon } from "@/components/icons";

export default function HomePage() {
  return <main className="ux2-home">
    <SiteHeader />

    <section className="ux3-home-hero">
      <div className="shell ux3-home-hero-inner">
        <p className="ux2-label">ChatGPT・Gemini・Perplexityの競合比較を診断</p>
        <h1>ChatGPTで、<br /><span>競合に負けている質問</span>がわかる。</h1>
        <p className="ux3-home-promise">URLを入れるだけ。候補外の質問 → 選ばれる競合 → 足りない根拠 → まず直す内容まで。</p>
        <p className="ux3-home-lead">買い手がAIに「おすすめは？」「どの会社が合う？」と聞く場面を再現し、自社が比較候補から外れる場所と理由を特定します。</p>
        <div className="ux3-home-form"><ScanForm /></div>
        <div className="ux3-home-trust"><span>登録不要</span><span>カード不要</span><span>公開Webのみ</span><span>架空サンプルを先に確認可能</span></div>
        <div className="ux3-home-secondary"><Link href="/result?sample=1">サンプル結果を開く <ArrowIcon /></Link><Link href="/methodology">測定方法を見る</Link></div>

        <div className="ux3-product-stage">
          <div className="ux3-product-stage-label"><strong>実際に出る画面</strong><span>FICTIONAL SAMPLE · NEXORA CLOUD</span></div>
          <ProductOutputPreview />
        </div>

        <div className="ux3-value-rail" aria-label="AIXで行うこと">
          <span><b>1</b>負けている比較質問を特定</span><ArrowIcon /><span><b>2</b>競合との差をEvidenceで確認</span><ArrowIcon /><span><b>3</b>直す内容を1件に絞る</span><ArrowIcon /><span><b>4</b>同じ質問で再測定</span>
        </div>
      </div>
    </section>

    <section className="ux2-home-section soft">
      <div className="shell">
        <div className="ux2-section-head">
          <p className="ux2-label">WHAT YOU GET</p>
          <h2>「9位だった」で終わらず、次にやる作業まで決める。</h2>
          <p>AIXの価値は順位表ではありません。自社が比較候補から外れる具体的な場面を、原因と修正作業へ変えることです。</p>
        </div>
        <div className="ux2-value-steps">
          <article><span>1</span><h3>どこで負けているか分かる</h3><strong>候補外 10 / 12</strong><p>買い手が聞く比較質問ごとに、自社が候補に入ったかを確認します。</p></article>
          <article><span>2</span><h3>なぜ負けているか分かる</h3><strong>同規模の導入実績</strong><p>競合のCitationと自社の公開情報を比べ、確認できない比較材料を特定します。</p></article>
          <article><span>3</span><h3>そのまま直し始められる</h3><strong>見出し・本文・FAQ</strong><p>有料Watchでは、確認済み事実だけを使ったChange Packを作り、公開前チェックまで出します。</p></article>
        </div>
      </div>
    </section>

    <section className="ux2-home-section">
      <div className="shell ux2-why-grid">
        <div className="ux2-section-head">
          <p className="ux2-label">WHY IT MATTERS</p>
          <h2>サイトに来る前に、比較は始まっています。</h2>
          <p>アクセス解析で見えるのは、すでにサイトへ来た人です。AIXはその手前、AIの比較回答で自社が候補に入るかどうかを観測します。</p>
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
          <div className="ux2-home-links"><Link className="button button-dark" href="/watch?sample=1">変化のサンプルを見る <ArrowIcon /></Link><Link className="ux2-link" href="/pricing">料金と継続価値を見る</Link></div>
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
