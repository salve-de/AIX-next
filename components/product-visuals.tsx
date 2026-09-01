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
  return <div className="product-preview" aria-label="AIX診断結果のサンプル画面">
    <div className="preview-sidebar"><div className="preview-logo">AIX</div><span className="active">Overview</span><span>Buyer Prompts</span><span>Evidence</span><span>Actions</span><span>History</span></div>
    <div className="preview-main">
      <header><div><small>AI SHORTLIST POSITION</small><strong>4 / 5</strong></div><span>36 observations · 3 surfaces</span></header>
      <div className="preview-kpis"><article><small>推薦カバレッジ</small><strong>22%</strong><i className="negative">-59pt vs leader</i></article><article><small>候補外テーマ</small><strong>8 / 12</strong><i>Buyer Prompt</i></article><article><small>Citation Coverage</small><strong>8%</strong><i>owned domain</i></article></div>
      <div className="preview-content"><div className="preview-chart"><small>候補入り率</small>{[["TrustOrbit",81],["VendorLens",56],["RiskCanvas",36],["NEXORA",22]].map(([name,value]) => <div className={name === "NEXORA" ? "self" : ""} key={String(name)}><span>{name}</span><i><b style={{ width: `${value}%` }} /></i><strong>{value}%</strong></div>)}</div><div className="preview-loss"><small>BIGGEST LOST PROMPT</small><strong>従業員300名に合う取引先審査ツールは？</strong><p><span>TrustOrbit</span><b>推薦</b></p><p><span>NEXORA</span><b className="lost">候補外</b></p></div></div>
      <div className="preview-footer"><article><EvidenceIcon /><div><small>NEED YOU</small><strong>標準導入期間</strong></div><span>8 prompts</span></article><article><TrendIcon /><div><small>FIRST ACTION</small><strong>企業規模別の導入実績を公開</strong></div><span>critical</span></article></div>
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
  return <div className="watch-visual" aria-label="週次Watchの変化サンプル">
    <header><div><i /><strong>AIX WATCH</strong></div><span>WEEK 4 / CORE PANEL</span></header>
    <div className="watch-visual-chart"><svg viewBox="0 0 640 210" preserveAspectRatio="none" aria-hidden="true"><defs><linearGradient id="watchArea" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="currentColor" stopOpacity=".28"/><stop offset="1" stopColor="currentColor" stopOpacity="0"/></linearGradient></defs><path className="watch-grid" d="M20 35H620M20 95H620M20 155H620" /><path className="watch-area" d="M35 160 C130 150 160 140 225 128 S340 132 420 94 S535 74 605 54 L605 190 L35 190Z" /><path className="watch-line" d="M35 160 C130 150 160 140 225 128 S340 132 420 94 S535 74 605 54" /><circle cx="35" cy="160" r="6" /><circle cx="225" cy="128" r="6" /><circle cx="420" cy="94" r="6" /><circle className="last" cx="605" cy="54" r="7" /></svg><div className="watch-label start"><small>Baseline</small><strong>22%</strong></div><div className="watch-label end"><small>Now</small><strong>31%</strong></div></div>
    <div className="watch-events"><article><span>+4</span><p><strong>新しく候補入り</strong><small>Buyer responses</small></p></article><article><span>7</span><p><strong>新しいCitation</strong><small>source changes</small></p></article><article><span>2</span><p><strong>確認が必要</strong><small>Evidence tasks</small></p></article></div>
  </div>;
}
