import type { ContentQuality, DemandProxy, MarketMap, ScanResult } from "@/lib/types";

function unique(values: string[]) {
  return [...new Set(values.map((value) => value.trim()).filter(Boolean))];
}

function fallbackMarket(result: ScanResult): MarketMap {
  const direct = result.competitors.slice(0, 4).map((item) => item.name);
  const keywords = unique([result.discovery.market, ...result.discovery.useCases, ...result.discovery.targetCustomers]).slice(0, 6);
  return { direct, alternatives: [], adjacent: [], upstream: [], downstream: [], keywords };
}

function fallbackDemand(result: ScanResult): DemandProxy {
  const prompts = (result.prompts || []).slice().sort((a, b) => (b.urgency || b.importance) - (a.urgency || a.importance));
  return {
    signals: [
      { label: "比較の質問", value: `${result.panel.promptCount}問`, detail: "購入前にAIへ聞かれる場面を確認", confidence: "observed" },
      { label: "候補外の質問", value: `${result.lostPrompts.length}問`, detail: "他社候補が先に含まれた今回の観測", confidence: "observed" },
      { label: "優先度", value: prompts[0]?.stage || "比較", detail: "質問の重要度・購入段階から整理", confidence: "inferred" },
    ],
    priorityPrompts: result.lostPrompts.slice(0, 3).map((item, index) => ({ promptId: item.promptId, label: item.prompt, score: Math.max(1, 5 - index) })),
    limitations: ["検索ボリュームや売上を示す数字ではありません。"],
  };
}

function fallbackQuality(result: ScanResult): ContentQuality {
  const audit = result.visibilityAudit;
  const missing = audit?.checks.filter((item) => item.status === "missing").length || 0;
  const review = audit?.checks.filter((item) => item.status === "review").length || 0;
  const ready = audit?.checks.filter((item) => item.status === "ready").length || 0;
  return {
    pages: [],
    summary: { ready, review, missing },
    limitations: ["取得できた公開ページだけを、機械的な確認項目で見ています。"],
  };
}

function pillValues(values: string[], empty = "今回の公開情報からは未整理") {
  const list = unique(values).slice(0, 5);
  return list.length ? <div className="insight-pills">{list.map((value) => <span key={value}>{value}</span>)}</div> : <p className="insight-empty">{empty}</p>;
}

export function InsightPanels({ result }: { result: ScanResult }) {
  const market = result.marketMap || fallbackMarket(result);
  const demand = result.demandProxy || fallbackDemand(result);
  const quality = result.contentQuality || fallbackQuality(result);
  const topPrompt = demand.priorityPrompts[0];
  const weakestPage = quality.pages.slice().sort((a, b) => a.score - b.score)[0];

  return <section className="report-section report-insights" aria-label="診断から分かる追加のマーケティング情報">
    <div className="shell">
      <div className="section-heading-simple"><p className="overline">診断から分かること</p><h2>市場・需要・ページを、<br />次の判断に使える形で。</h2><p>外部サービスをつながなくても、今回取得した公開情報とAI回答から整理できる範囲を一枚にまとめます。</p></div>
      <div className="insight-panels-grid">
        <article className="insight-panel"><div className="insight-panel-head"><span>01</span><div><strong>市場のつながり</strong><small>誰と比べられているか</small></div></div><p className="insight-label">直接比較される会社</p>{pillValues(market.direct)}<p className="insight-label">代替・隣接の手がかり</p>{pillValues(unique([...market.alternatives, ...market.adjacent]).slice(0, 5))}<p className="insight-label">市場を表す言葉</p>{pillValues(market.keywords.slice(0, 5))}</article>
        <article className="insight-panel"><div className="insight-panel-head"><span>02</span><div><strong>需要の手がかり</strong><small>先に見るべき購入場面</small></div></div><div className="insight-signal-list">{demand.signals.slice(0, 3).map((signal) => <div key={`${signal.label}-${signal.value}`}><span>{signal.label}</span><strong>{signal.value}</strong><small>{signal.detail}</small></div>)}</div>{topPrompt ? <div className="insight-focus"><small>最初に確認する質問</small><strong>「{topPrompt.label}」</strong><span>相対スコア {topPrompt.score}</span></div> : null}<p className="insight-footnote">検索数や売上の予測ではなく、今回の質問と観測からの優先順位です。</p></article>
        <article className="insight-panel"><div className="insight-panel-head"><span>03</span><div><strong>ページの状態</strong><small>AIと買い手が読めるか</small></div></div><div className="quality-summary"><div><strong>{quality.summary.ready}</strong><span>整っている</span></div><div><strong>{quality.summary.review}</strong><span>確認が必要</span></div><div><strong>{quality.summary.missing}</strong><span>不足</span></div></div>{weakestPage ? <div className="insight-focus"><small>最初に見るページ</small><strong>{weakestPage.title || weakestPage.url}</strong><span>確認スコア {weakestPage.score}/100</span></div> : <div className="insight-focus"><small>最初に見る場所</small><strong>{result.actions[0]?.target || "公開ページ"}</strong><span>ページごとの確認を作成済み</span></div>}<p className="insight-footnote">タイトル・説明・見出し・構造化データ・購入前の事実を公開ページから確認します。</p></article>
      </div>
    </div>
  </section>;
}
