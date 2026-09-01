import { Icon, Pill } from "@/components/ui";

export function HeroSignalMap() {
  return <div className="signal-console" aria-label="AIXが購買質問から競合推薦と不足Evidenceを発見する図">
    <div className="console-top"><div><span/><span/><span/></div><strong>LIVE BUYER SIMULATION</strong><small>JA · JP</small></div>
    <div className="console-canvas">
      <div className="buyer-question"><span className="avatar-dot">買</span><div><small>見込み客の質問</small><strong>社員50名におすすめの<br/>勤怠管理システムは？</strong></div></div>
      <svg className="signal-lines" viewBox="0 0 620 360" preserveAspectRatio="none" aria-hidden="true">
        <path d="M310 78 C310 125 126 112 126 174"/><path d="M310 78 C310 125 310 112 310 174"/><path d="M310 78 C310 125 494 112 494 174"/>
        <path className="signal-hot" d="M126 222 C126 262 222 250 250 286"/><path className="signal-hot" d="M310 222 C310 258 276 258 250 286"/><path className="signal-hot" d="M494 222 C494 262 332 250 250 286"/>
        <path d="M126 222 C126 268 388 258 430 286"/><path d="M310 222 C310 270 390 264 430 286"/><path d="M494 222 C494 262 464 270 430 286"/>
      </svg>
      <div className="engine-nodes"><div><span>O</span><strong>OpenAI</strong><i/></div><div><span>G</span><strong>Gemini</strong><i/></div><div><span>P</span><strong>Perplexity</strong><i/></div></div>
      <div className="company-outcomes"><article className="outcome-winner"><small>3/3 AIが推薦</small><strong>Orbit勤怠</strong><span><Icon name="check" size={15}/> 導入実績・移行期間を引用</span></article><article className="outcome-lost"><small>候補外</small><strong>御社</strong><span><Icon name="alert" size={15}/> 比較に必要な証拠が不足</span></article></div>
      <div className="aix-finding"><span className="finding-mark"><Icon name="spark" size={20}/></span><div><small>AIX FINDING</small><strong>「50名規模の導入実績」が<br/>6つの購買質問で未確認</strong></div><Pill tone="bad">優先度 CRITICAL</Pill></div>
    </div>
  </div>;
}

export function FourOutputs() {
  const outputs = [
    ["graph", "市場での位置", "競合と同じ質問で比較"],
    ["alert", "候補外の質問", "誰が代わりに選ばれたか"],
    ["link", "引用された根拠", "AIが使ったSource"],
    ["spark", "次の一手", "不足Evidenceから優先化"],
  ] as const;
  return <div className="four-outputs">{outputs.map(([icon, title, body]) => <article key={title}><span><Icon name={icon}/></span><div><strong>{title}</strong><small>{body}</small></div></article>)}</div>;
}

export function ProductDashboardVisual() {
  return <div className="product-preview" aria-label="AIX診断結果の視覚サンプル">
    <div className="preview-nav"><strong>AIX / MARKET SIGNAL</strong><span>Snapshot · 12 questions</span></div>
    <div className="preview-head"><div><small>LatticeTime / 勤怠管理SaaS</small><strong>AIの比較候補で<br/><em>9 / 13位</em></strong></div><div className="score-orbit"><svg viewBox="0 0 120 120"><circle cx="60" cy="60" r="50"/><circle className="score-arc" cx="60" cy="60" r="50"/></svg><span><b>17%</b><small>SHORTLIST</small></span></div></div>
    <div className="preview-main"><div className="preview-bars"><small>SHORTLIST COVERAGE</small>{[["Orbit勤怠",58],["Shiftbase One",47],["ClockPilot",39],["御社",17]].map(([name,value]) => <div className={name === "御社" ? "bar-row self" : "bar-row"} key={String(name)}><span>{name}</span><i><b style={{width:`${value}%`}}/></i><strong>{value}%</strong></div>)}</div><div className="preview-loss"><small>BIGGEST LOSS</small><strong>「社員50名で導入しやすい勤怠管理は？」</strong><div><span>Orbit勤怠</span><b>推薦</b></div><div className="self"><span>LatticeTime</span><b>候補外</b></div></div></div>
    <div className="preview-evidence"><article><Icon name="link"/><div><small>CITATIONS</small><strong>競合 8件 / 自社 1件</strong></div></article><article className="missing"><Icon name="alert"/><div><small>MISSING PROOF</small><strong>企業規模別の導入実績</strong></div></article><article className="action"><Icon name="spark"/><div><small>NEXT ACTION</small><strong>実績を比較可能な表へ</strong></div></article></div>
  </div>;
}

export function ProductLoop() {
  const steps = [
    ["01", "eye", "観測する", "見込み客の質問を再現し、候補入りを測る。"],
    ["02", "graph", "比較する", "同じ質問で競合・順位・引用元を照合。"],
    ["03", "alert", "不足を見つける", "AIが判断に使えないEvidenceを特定。"],
    ["04", "spark", "改善へ変える", "必要な事実と具体的な変更案を作る。"],
  ] as const;
  return <div className="product-loop"><div className="loop-line"/>{steps.map(([number,icon,title,body], index) => <article key={number}><span className="loop-icon"><Icon name={icon}/></span><small>{number}</small><strong>{title}</strong><p>{body}</p>{index < steps.length - 1 ? <i><Icon name="arrow" size={15}/></i> : null}</article>)}</div>;
}

export function WatchTrendVisual() {
  return <div className="watch-visual" aria-label="AIX Watchで推薦カバレッジと競合変化を週次追跡する図">
    <div className="watch-visual-head"><div><span className="pulse-dot"/><strong>AIX WATCH</strong></div><small>WEEK 1 → WEEK 4</small></div>
    <div className="watch-chart"><svg viewBox="0 0 700 250" preserveAspectRatio="none"><path className="grid" d="M40 40H670M40 100H670M40 160H670M40 220H670"/><path className="area" d="M50 190 C170 185 205 160 270 165 S400 120 470 128 S590 80 650 72 L650 220 L50 220Z"/><path className="line" d="M50 190 C170 185 205 160 270 165 S400 120 470 128 S590 80 650 72"/><circle cx="50" cy="190" r="6"/><circle cx="270" cy="165" r="6"/><circle cx="470" cy="128" r="6"/><circle className="last" cx="650" cy="72" r="7"/></svg><span className="chart-start"><small>BASELINE</small><strong>17%</strong></span><span className="chart-end"><small>CURRENT</small><strong>29%</strong></span></div>
    <div className="watch-events"><article><span><Icon name="check"/></span><div><strong>+4候補入り</strong><small>新しく推薦されたAI回答</small></div></article><article><span><Icon name="link"/></span><div><strong>新Citation 7件</strong><small>競合と自社の根拠変化</small></div></article><article><span><Icon name="document"/></span><div><strong>Need You 2件</strong><small>企業にしか分からない証拠</small></div></article></div>
  </div>;
}

export function ScanRadar({ progress, detail }: { progress: number; detail?: string }) {
  const active = Math.max(0, Math.min(5, Math.ceil(progress / 20)));
  const nodes = [["会社","company"],["商品","product"],["市場","market"],["競合","competitor"],["質問","prompt"]];
  return <div className="scan-radar" aria-label="スキャン中に会社・商品・市場・競合・購買質問を発見する図"><div className="radar-grid"/><div className="radar-sweep"/><div className="radar-center"><span>AIX</span><strong>{progress}%</strong></div>{nodes.map(([label,className],index) => <div key={label} className={`radar-node radar-${className} ${index < active ? "found" : ""}`}><span>{index < active ? <Icon name="check" size={15}/> : index + 1}</span><strong>{label}</strong></div>)}<p>{detail || "公開Webから市場の輪郭を作成中"}</p></div>;
}

export function BuyerDecisionMap({ winner, own, lostCount }: { winner: string; own: string; lostCount: number }) {
  return <div className="decision-map"><div className="decision-question"><Icon name="search"/><div><small>BUYER PROMPT</small><strong>「この条件で、最も合うサービスは？」</strong></div></div><div className="decision-engines"><span>OpenAI</span><span>Gemini</span><span>Perplexity</span></div><div className="decision-branches"><article><small>MOST RECOMMENDED</small><strong>{winner || "競合候補"}</strong><span><Icon name="check" size={15}/> 比較できるEvidence</span></article><article className="decision-own"><small>YOUR COMPANY</small><strong>{own}</strong><span><Icon name="alert" size={15}/> {lostCount}テーマで候補外</span></article></div><p><Icon name="spark" size={16}/> AIXは「なぜ」をCitationとEvidence差から説明します。</p></div>;
}
