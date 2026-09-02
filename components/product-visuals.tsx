import { ArrowIcon, BotIcon, BuildingIcon, EvidenceIcon, NetworkIcon, SearchIcon, SparkIcon, TrendIcon, TrophyIcon, WarningIcon } from "@/components/icons";

export function HeroShortlistVisual() {
  return <div className="hero-visual" aria-label="買い手の質問から競合推薦とEvidence不足を特定する流れ">
    <div className="visual-window-bar"><span /><span /><span /><strong>AIX / LIVE BUYER MAP</strong><small>fictional sample</small></div>
    <div className="hero-visual-body">
      <div className="query-card"><SearchIcon /><div><small>BUYER PROMPT</small><strong>「従業員300名に合う<br />取引先リスク管理SaaSは？」</strong></div></div>
      <div className="engine-lane"><div><BotIcon /><span>OpenAI</span><i /></div><div><SparkIcon /><span>Gemini</span><i /></div><div><NetworkIcon /><span>Perplexity</span><i /></div></div>
      <svg className="flow-map" viewBox="0 0 600 210" preserveAspectRatio="none" aria-hidden="true"><path d="M300 0 C300 45 105 45 105 100" /><path d="M300 0 C300 45 300 45 300 100" /><path d="M300 0 C300 45 495 45 495 100" /><path className="flow-hot" d="M105 100 C105 155 210 155 210 210" /><path className="flow-hot" d="M300 100 C300 155 210 155 210 210" /><path d="M495 100 C495 155 390 155 390 210" /></svg>
      <div className="shortlist-grid"><article className="shortlist-winner"><span><TrophyIcon /> 3 AIが推薦</span><strong>TrustOrbit</strong><small>導入実績・標準導入期間・監査証跡を確認</small></article><article className="shortlist-lost"><span><WarningIcon /> 候補外</span><strong>NEXORA Cloud</strong><small>同規模の導入実績と導入期間を確認できず</small></article></div>
      <div className="diagnosis-ribbon"><div><EvidenceIcon /></div><p><small>AIX DIAGNOSIS</small><strong>不足Evidenceを10 Buyer Promptsで検出</strong></p><span>次のAction <ArrowIcon /></span></div>
    </div>
  </div>;
}

export function ProductOutputPreview() {
  return <div className="home-result-preview" aria-label="AIX無料診断の架空サンプル">
    <header className="home-result-preview-header">
      <div><p className="eyebrow">FICTIONAL SAMPLE · NEXORA CLOUD</p><h3>AI比較で、<strong>13社中9位</strong>です。</h3><p>12の購買質問のうち、候補に入ったのは2問。首位競合は7問で候補入りしています。</p></div>
      <span>2026/09/02 · 架空データ<br />3 AI · 12 prompts · 36 / 36 observations</span>
    </header>
    <div className="home-result-preview-kpis">
      <article><small>自社の候補入り</small><strong>2 / 12</strong><span>NEXORA Cloud</span></article>
      <article><small>首位競合の候補入り</small><strong>7 / 12</strong><span>TrustOrbit</span></article>
      <article className="negative"><small>候補外になった質問</small><strong>10 / 12</strong><span>Buyer Prompts</span></article>
      <article><small>AI観測の完了</small><strong>36 / 36</strong><span>OpenAI · Gemini · Perplexity</span></article>
    </div>
    <div className="home-result-preview-body">
      <article className="home-result-loss-preview">
        <small>最も重要な候補外Buyer Prompt</small>
        <h4>「従業員300名の企業に合う取引先審査ツールは？」</h4>
        <div><span><small>最頻推薦</small><strong>TrustOrbit</strong></span><span><small>NEXORA Cloud</small><strong className="lost">候補外</strong></span></div>
        <p>競合は企業規模別の導入実績と標準導入期間を比較可能な形で公開。自社では同条件の根拠を公開Webから確認できませんでした。</p>
      </article>
      <aside className="home-result-action-preview">
        <div><EvidenceIcon /><span><small>確認できないEvidence</small><strong>従業員100〜500名での導入実績</strong></span></div>
        <div><TrendIcon /><span><small>最優先Action</small><strong>企業規模別の導入実績を公開する</strong></span></div>
      </aside>
    </div>
  </div>;
}

export function ProductProcessVisual() {
  const steps = [
    { icon: <BuildingIcon />, label: "01", title: "会社を理解", body: "URLから法人・ブランド・商品・買い手を特定" },
    { icon: <NetworkIcon />, label: "02", title: "市場を生成", body: "同じ購買場面の競合とBuyer Promptを構成" },
    { icon: <BotIcon />, label: "03", title: "AIを観測", body: "3つのAIで候補入り・順位・Citationを保存" },
    { icon: <EvidenceIcon />, label: "04", title: "不足をActionへ", body: "競合差をEvidence Taskと変更案へ変換" },
  ];
  return <div className="process-visual"><div className="process-line" />{steps.map((step, index) => <article key={step.label}><div className="process-icon">{step.icon}</div><span>{step.label}</span><h3>{step.title}</h3><p>{step.body}</p>{index < steps.length - 1 ? <ArrowIcon className="process-arrow" /> : null}</article>)}</div>;
}

export function WatchTrendVisual() {
  return <div className="watch-home-visual" aria-label="Watchで追跡する変化の架空サンプル">
    <header><div><i /><strong>AIX WATCH</strong></div><span>FICTIONAL SAMPLE · WEEK 2</span></header>
    <div className="watch-home-rank"><small>AI比較での順位</small><strong><span>9位</span><ArrowIcon /><b>7位</b></strong><p>同じCore Prompt・同じAI観測面で比較</p></div>
    <div className="watch-home-deltas">
      <article><small>候補に入った質問</small><strong>2 <ArrowIcon /> 4</strong></article>
      <article><small>候補外の質問</small><strong>10 <ArrowIcon /> 8</strong></article>
      <article><small>新しく候補入り</small><strong className="positive">+2質問</strong></article>
      <article><small>新しいCitation</small><strong>+3 URLs</strong></article>
    </div>
    <div className="watch-home-footer"><TrendIcon /><span><small>今回の変化</small><strong>順位 +2 / 候補入り質問 +2</strong></span></div>
  </div>;
}
