import { ArrowIcon } from "@/components/icons";

export function HeroShortlistVisual() {
  return <div className="ux2-report-preview" aria-label="AIX診断の架空サンプル">
    <header><strong>架空サンプル · NEXORA Cloud</strong><span>ChatGPT · Gemini · Perplexity</span></header>
    <div className="ux2-preview-summary"><small>AI比較での位置</small><strong>13社中 <b>9位</b></strong><p>12の比較質問のうち10問で候補外</p></div>
    <div className="ux2-preview-loss"><small>候補外になっている重要な比較質問</small><strong>「従業員300名の企業に合う取引先審査ツールは？」</strong><div><span>最も選ばれた競合<b>TrustOrbit</b></span><span>自社<b>候補外</b></span></div></div>
    <div className="ux2-preview-action"><span><small>まず直すこと</small><strong>企業規模別の導入実績を公開する</strong></span><span>10質問に関連</span></div>
  </div>;
}

export function ProductOutputPreview() {
  return <div className="ux2-report-preview ux3-report-preview" aria-label="AIX無料診断の架空サンプル">
    <header><strong>AIX REPORT · NEXORA Cloud</strong><span>架空データ · 2026/09/02 · 36 / 36観測完了</span></header>
    <div className="ux3-preview-top">
      <div className="ux2-preview-summary"><small>今回の結論</small><strong>AI比較で <b>13社中9位</b></strong><p>12の「買う前に聞く質問」のうち、候補入り2問 / 候補外10問。</p></div>
      <div className="ux3-preview-engines"><span>ChatGPT</span><span>Gemini</span><span>Perplexity</span></div>
    </div>
    <div className="ux3-preview-kpis">
      <article><small>自社が候補入り</small><strong>2 / 12</strong><span>NEXORA Cloud</span></article>
      <article className="negative"><small>自社が候補外</small><strong>10 / 12</strong><span>比較質問</span></article>
      <article><small>首位競合が候補入り</small><strong>7 / 12</strong><span>TrustOrbit</span></article>
      <article><small>AI観測</small><strong>36 / 36</strong><span>3 AI × 12質問</span></article>
    </div>
    <div className="ux3-preview-body">
      <div className="ux2-preview-loss"><small>候補外になっている重要な比較質問</small><strong>「従業員300名の企業に合う取引先審査ツールは？」</strong><div><span>最も選ばれた競合<b>TrustOrbit</b></span><span>自社<b>候補外</b></span><span>確認できない根拠<b>同規模の導入実績</b></span></div></div>
      <aside className="ux3-preview-why"><small>なぜこの差が重要か</small><p>競合は企業規模別の導入実績を比較できる形で公開。自社では同条件の事実を公開Webから確認できませんでした。</p></aside>
    </div>
    <div className="ux2-preview-action ux3-preview-action"><span><small>最優先Action · 10質問に関連</small><strong>企業規模別の導入実績を、比較できる形で公開する</strong></span><span>Change Packで見出し・本文・FAQへ <ArrowIcon /></span></div>
  </div>;
}

export function ProductProcessVisual() {
  const steps = ["候補外の質問を見つける", "競合との差を確認する", "まず直す1件を決める", "同じ質問で再測定する"];
  return <div className="ux2-value-steps">{steps.map((step, index) => <article key={step}><span>{index + 1}</span><h3>{step}</h3></article>)}</div>;
}

export function WatchTrendVisual() {
  return <div className="ux2-watch-card" aria-label="継続モニタリングの架空サンプル">
    <header>架空サンプル · 2回目の測定</header>
    <div className="ux2-watch-main"><small>AI比較での位置</small><strong>9位 <ArrowIcon /> <b>7位</b></strong></div>
    <div className="ux2-watch-deltas">
      <article><small>候補入り質問</small><strong>2 → 4</strong></article>
      <article><small>候補外質問</small><strong>10 → 8</strong></article>
      <article><small>新しく候補入り</small><strong>+2質問</strong></article>
    </div>
  </div>;
}
