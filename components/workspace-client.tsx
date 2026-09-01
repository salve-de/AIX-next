"use client";

import Link from "next/link";
import { FormEvent, useMemo, useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Brand } from "@/components/brand";
import { ArrowIcon, BotIcon, CheckIcon, EvidenceIcon, EyeIcon, NetworkIcon, QuoteIcon, SearchIcon, SparkIcon, TrendIcon, TrophyIcon, WarningIcon } from "@/components/icons";
import { buildCitationIntelligence, buildClusterIntelligence, buildPromptIntelligence } from "@/lib/intelligence";
import { sampleWatch } from "@/lib/sample-data";
import type { ActionCard, ChangePack, EvidenceAnswer, ProviderName, WatchRecord } from "@/lib/types";

type View = "overview" | "visibility" | "prompts" | "recommendations" | "citations" | "competitors" | "narratives" | "evidence" | "actions" | "history";
const views: Array<{ id: View; label: string; hint: string }> = [
  { id: "overview", label: "Overview", hint: "今見るべきこと" },
  { id: "visibility", label: "Visibility", hint: "AI別・Intent別" },
  { id: "prompts", label: "Buyer Prompts", hint: "追跡質問" },
  { id: "recommendations", label: "Recommendations", hint: "候補入り・候補外" },
  { id: "citations", label: "Citations", hint: "引用元" },
  { id: "competitors", label: "Competitors", hint: "直接比較" },
  { id: "narratives", label: "Narratives", hint: "AIの語り方" },
  { id: "evidence", label: "Evidence", hint: "不足する比較材料" },
  { id: "actions", label: "Actions", hint: "Change Pack" },
  { id: "history", label: "History", hint: "Core / Discovery" },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Tokyo" }).format(new Date(value));
}
function providerLabel(provider: ProviderName) { return provider === "openai" ? "OpenAI" : provider === "gemini" ? "Gemini" : "Perplexity"; }
function clusterLabel(value: string) {
  const labels: Record<string, string> = { category: "カテゴリ", segment: "企業条件", use_case: "用途", feature: "機能", alternative: "乗換・代替", comparison: "直接比較", value: "価格・価値", implementation: "導入", trust: "信頼・安全", support: "支援" };
  return labels[value] || value;
}
function statusLabel(value: string) {
  const labels: Record<string, string> = { company_asserted: "企業申告", verified: "確認済み", disputed: "要確認", expired: "期限切れ", missing: "未確認", partial: "一部確認", needs_evidence: "材料待ち", ready: "作成可能", approved: "承認済み", rejected: "却下", draft: "下書き" };
  return labels[value] || value;
}

function samplePack(action: ActionCard, watch: WatchRecord): ChangePack {
  const related = watch.latest.evidenceGaps.filter((gap) => gap.relatedPromptIds.some((id) => action.relatedPromptIds.includes(id)));
  return {
    id: `sample_pack_${action.id}`, actionId: action.id, status: "needs_evidence", title: action.title, target: action.target, rationale: action.rationale,
    requiredFacts: related.map((gap) => gap.label), missingFacts: related.map((gap) => gap.label), allowedEvidence: [],
    recommendedHeadings: [action.title, "対象企業・適用条件", "比較できる具体的な根拠", "導入・運用条件", "よくある質問"],
    draftBody: "確認済みの企業情報だけを使って本文を生成します。未確認の数値・導入期間・顧客実績は [要確認] のまま残します。",
    faqs: related.slice(0, 3).map((gap) => ({ question: `${gap.label}について確認できる情報は？`, answer: `[要確認: ${gap.label}]` })),
    structuredDataNotes: ["本文に実在する情報だけを構造化データへ反映する。"], internalLinks: ["関連する実在ページのみ内部リンクする。"],
    validationChecklist: ["数値と期間に確認元がある", "申告情報をverifiedと誤表示していない", "公開後は同じPromptで再観測する"],
    remeasurePromptIds: action.relatedPromptIds, confidence: action.confidence, generatedAt: new Date().toISOString(),
  };
}

export function WorkspaceClient() {
  const params = useSearchParams();
  const sample = params.get("sample") === "1";
  const token = params.get("token") || "";
  const initial = (params.get("view") as View) || "overview";
  const [view, setView] = useState<View>(views.some((item) => item.id === initial) ? initial : "overview");
  const [watch, setWatch] = useState<WatchRecord | null>(sample ? sampleWatch() : null);
  const [loading, setLoading] = useState(!sample);
  const [error, setError] = useState("");
  const [evidenceValue, setEvidenceValue] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState("");

  useEffect(() => {
    if (sample) return;
    if (!token) { setError("Workspace tokenがありません。Watchから開いてください。"); setLoading(false); return; }
    fetch(`/api/watch?token=${encodeURIComponent(token)}`, { cache: "no-store" })
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error || "Workspaceを取得できませんでした。"); setWatch(data); })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Workspaceを取得できませんでした。"))
      .finally(() => setLoading(false));
  }, [sample, token]);

  const latest = watch?.latest || null;
  const promptRows = useMemo(() => latest ? buildPromptIntelligence(latest) : [], [latest]);
  const citationRows = useMemo(() => latest ? buildCitationIntelligence(latest) : [], [latest]);
  const clusterRows = useMemo(() => latest ? buildClusterIntelligence(latest) : [], [latest]);
  const providerRows = useMemo(() => {
    if (!latest) return [];
    return (["openai", "gemini", "perplexity"] as ProviderName[]).map((provider) => {
      const rows = latest.observations.filter((item) => item.provider === provider && item.status === "success");
      const recommended = rows.filter((item) => item.ownRecommended).length;
      const first = rows.filter((item) => item.ownPosition === 1).length;
      const cited = rows.filter((item) => item.citations.some((citation) => citation.domain === latest.discovery.domain)).length;
      return { provider, successful: rows.length, recommended, coverage: rows.length ? Math.round(recommended / rows.length * 100) : 0, first, cited };
    });
  }, [latest]);

  if (loading) return <main className="workspace-loading">AIX Workspaceを読み込んでいます。</main>;
  if (!watch || !latest) return <main className="workspace-loading"><strong>Workspaceを表示できません。</strong><p>{error}</p><Link href="/">無料診断へ戻る</Link></main>;

  const topCompetitor = latest.competitors[0];
  const topLoss = latest.lostPrompts[0];
  const topGap = latest.evidenceGaps[0];
  const topAction = latest.actions[0];
  const ownCitationCount = citationRows.filter((item) => item.kind === "owned").reduce((sum, item) => sum + item.citations, 0);
  const thirdPartyCitationCount = citationRows.filter((item) => item.kind === "third_party").reduce((sum, item) => sum + item.citations, 0);
  const trialDays = Math.max(0, Math.ceil((new Date(watch.trialEndsAt).getTime() - Date.now()) / 86_400_000));

  async function saveEvidence(event: FormEvent, gapId: string) {
    event.preventDefault();
    const value = evidenceValue[gapId]?.trim();
    if (!value) return;
    if (sample) {
      const answer: EvidenceAnswer = { gapId, value, status: "company_asserted", updatedAt: new Date().toISOString() };
      setWatch({ ...watch, evidence: [...watch.evidence.filter((item) => item.gapId !== gapId), answer] });
      setEvidenceValue((current) => ({ ...current, [gapId]: "" }));
      return;
    }
    setBusy(`evidence:${gapId}`); setError("");
    try {
      const response = await fetch("/api/evidence", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, gapId, value }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "保存できませんでした。"); setWatch(data); setEvidenceValue((current) => ({ ...current, [gapId]: "" }));
    } catch (caught) { setError(caught instanceof Error ? caught.message : "保存できませんでした。"); } finally { setBusy(""); }
  }

  async function createPack(action: ActionCard) {
    if (sample) {
      const pack = samplePack(action, watch);
      setWatch({ ...watch, changePacks: [...(watch.changePacks || []).filter((item) => item.actionId !== action.id), pack] });
      setView("actions"); return;
    }
    setBusy(`pack:${action.id}`); setError("");
    try {
      const response = await fetch("/api/change-packs", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, actionId: action.id }) });
      const data = await response.json(); if (!response.ok) throw new Error(data.error || "Change Packを作成できませんでした。"); setWatch(data.watch); setView("actions");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Change Packを作成できませんでした。"); } finally { setBusy(""); }
  }

  function navButton(id: View, label: string, hint: string) {
    return <button key={id} className={view === id ? "active" : ""} onClick={() => setView(id)}><span>{label}</span><small>{hint}</small></button>;
  }

  return <main className="workspace-root">
    <aside className="workspace-sidebar">
      <Brand />
      <div className="workspace-project"><small>PROJECT</small><strong>{latest.discovery.brandName}</strong><span>{latest.discovery.market}</span></div>
      <nav>{views.map((item) => navButton(item.id, item.label, item.hint))}</nav>
      <div className="workspace-plan"><small>{watch.paid ? "FOUNDER WATCH" : "14-DAY WATCH"}</small><strong>{watch.paid ? "Active" : `${trialDays}日残り`}</strong><span>次回 {formatDate(watch.nextRunAt)}</span></div>
      <Link className="workspace-back" href={sample ? "/watch?sample=1" : `/watch?token=${encodeURIComponent(token)}`}>← Weekly Briefへ戻る</Link>
    </aside>

    <section className="workspace-main">
      <header className="workspace-topbar"><div><span className="workspace-live"><i />{watch.status.toUpperCase()}</span><strong>{latest.discovery.domain}</strong></div><div><span>Core {latest.panel.promptCount} prompts</span><span>{latest.panel.repetitions} reps</span><span>{formatDate(latest.measuredAt)}</span></div></header>
      {error ? <div className="workspace-error"><WarningIcon />{error}</div> : null}

      {view === "overview" ? <div className="workspace-view">
        <div className="workspace-view-head"><div><p>EXECUTIVE CONTROL CENTER</p><h1>AI購買面を、ここだけで管理する。</h1><span>Visibilityを見るだけで終わらず、Prompt・推薦・Citation・競合・比較材料・変更案・再観測まで同じProjectでつなぎます。</span></div></div>
        <div className="ws-kpis"><article><EyeIcon /><small>Recommendation Coverage</small><strong>{latest.recommendationCoverage}%</strong><span>{latest.ownRecommendationCount}/{latest.successfulObservations}成功回答</span></article><article><BotIcon /><small>Mention Coverage</small><strong>{latest.mentionCoverage}%</strong><span>名前が出た回答</span></article><article><QuoteIcon /><small>Own Citation</small><strong>{latest.citationCoverage}%</strong><span>{ownCitationCount} citation events</span></article><article><TrophyIcon /><small>First Choice</small><strong>{latest.firstChoiceRate}%</strong><span>第一候補になった回答</span></article></div>
        <div className="ws-overview-grid">
          <article className="ws-focus-card danger"><header><span>BIGGEST BUYER LOSS</span><strong>{latest.lostPrompts.length}/{latest.prompts.length} themes lost</strong></header><h2>{topLoss ? `「${topLoss.prompt}」` : "主要な候補外テーマは未確認"}</h2><p>{topLoss?.summary || "次回Discoveryで新しい購買場面を探索します。"}</p><button onClick={() => setView("recommendations")}>Recommendation詳細 <ArrowIcon /></button></article>
          <article className="ws-focus-card"><header><span>TOP REPLACEMENT</span><strong>{topCompetitor?.coverage || 0}%</strong></header><h2>{topCompetitor?.name || "未特定"}</h2><p>同じ成功Observationで、自社より先に候補へ入る競合を比較します。</p><button onClick={() => setView("competitors")}>競合比較を見る <ArrowIcon /></button></article>
          <article className="ws-focus-card"><header><span>MISSING PROOF</span><strong>{topGap?.relatedPromptCount || 0} prompts</strong></header><h2>{topGap?.label || "不足する比較材料なし"}</h2><p>{topGap?.whyItMatters || "公開Webで必要な比較材料を確認できています。"}</p><button onClick={() => setView("evidence")}>比較材料を確認 <ArrowIcon /></button></article>
          <article className="ws-focus-card accent"><header><span>NEXT ACTION</span><strong>{topAction?.priority.toUpperCase() || "—"}</strong></header><h2>{topAction?.title || "次のActionはありません"}</h2><p>{topAction?.rationale || "観測を継続します。"}</p>{topAction ? <button onClick={() => createPack(topAction)} disabled={busy === `pack:${topAction.id}`}>{busy === `pack:${topAction.id}` ? "作成中…" : "この変更案を作る"} <ArrowIcon /></button> : null}</article>
        </div>
        <div className="ws-loop"><span>Visibility</span><i>→</i><span>Prompts</span><i>→</i><span>Recommendation</span><i>→</i><span>Citations</span><i>→</i><span>Evidence</span><i>→</i><span>Change Pack</span><i>→</i><span>Re-measure</span></div>
      </div> : null}

      {view === "visibility" ? <div className="workspace-view"><div className="workspace-view-head"><div><p>VISIBILITY</p><h1>一つのVisibility Scoreで潰さない。</h1><span>AI surfaceとBuyer Intent別に分解し、どこで見えていて、どこで推薦まで進んでいないかを確認します。</span></div></div><div className="ws-provider-grid">{providerRows.map((row) => <article key={row.provider}><header><strong>{providerLabel(row.provider)}</strong><span>{row.successful} answers</span></header><b>{row.coverage}%</b><small>Recommendation Coverage</small><dl><div><dt>候補入り</dt><dd>{row.recommended}</dd></div><div><dt>First Choice</dt><dd>{row.first}</dd></div><div><dt>Own Citation</dt><dd>{row.cited}</dd></div></dl></article>)}</div><div className="ws-table-card"><header><strong>Buyer Intent別の候補入り率</strong><span>弱いIntentから表示</span></header><div className="ws-cluster-list">{clusterRows.map((row) => <div key={row.cluster}><span>{clusterLabel(row.cluster)}</span><i><b style={{ width: `${row.coverage}%` }} /></i><strong>{row.coverage}%</strong><small>{row.recommended}/{row.successful}</small></div>)}</div></div></div> : null}

      {view === "prompts" ? <div className="workspace-view"><div className="workspace-view-head"><div><p>BUYER PROMPT INTELLIGENCE</p><h1>何を追うかにも、理由を持たせる。</h1><span>AIXは検索量を捏造しません。市場・対象顧客・用途・比較条件から、なぜその購買質問を追うのかを明示します。</span></div></div><div className="ws-prompt-list">{promptRows.map((row, index) => <article key={row.prompt.id}><span className="ws-index">{String(index + 1).padStart(2, "0")}</span><div className="ws-prompt-main"><header><span>{clusterLabel(row.prompt.cluster)}</span><em>Intent {row.prompt.importance}/5</em></header><h3>{row.prompt.text}</h3><p>{row.prompt.whyTracked}</p><div className="ws-engine-pills">{row.providerOutcomes.map((provider) => <span key={provider.provider} className={provider.recommended ? "win" : "loss"}>{providerLabel(provider.provider)} {provider.recommended}/{provider.successful}</span>)}</div></div><aside><strong>{row.recommendationCoverage}%</strong><small>候補入り率</small><span>{row.citations} citations</span></aside></article>)}</div></div> : null}

      {view === "recommendations" ? <div className="workspace-view"><div className="workspace-view-head"><div><p>RECOMMENDATIONS</p><h1>名前が出たかではなく、候補に入ったか。</h1><span>Buyer Promptごとに、第一候補・自社順位・候補外・AI別の生回答を追います。</span></div></div><div className="ws-loss-list">{latest.lostPrompts.map((loss, index) => <article key={loss.promptId}><header><span>LOSS {String(index + 1).padStart(2, "0")}</span><strong>{loss.winner || "競合候補"}</strong></header><h3>{loss.prompt}</h3><p>{latest.prompts.find((prompt) => prompt.id === loss.promptId)?.whyTracked}</p><div className="ws-outcome-grid">{loss.observations.map((observation) => <div key={observation.id}><span>{providerLabel(observation.provider)}</span><strong className={observation.ownRecommended ? "good" : "bad"}>{observation.ownRecommended ? `自社 ${observation.ownPosition || "候補"}` : "候補外"}</strong><small>First: {observation.firstCandidate || "—"}</small></div>)}</div><p>{loss.summary}</p></article>)}</div></div> : null}

      {view === "citations" ? <div className="workspace-view"><div className="workspace-view-head"><div><p>CITATION INTELLIGENCE</p><h1>AIが判断に使う情報源を分解する。</h1><span>自社、競合、第三者を分け、どのDomain・Pageが何Prompt・何AIで繰り返し使われているかを見ます。</span></div></div><div className="ws-citation-summary"><article><QuoteIcon /><strong>{ownCitationCount}</strong><span>Own-domain citations</span></article><article><NetworkIcon /><strong>{thirdPartyCitationCount}</strong><span>Third-party citations</span></article><article><SearchIcon /><strong>{citationRows.length}</strong><span>Cited domains</span></article></div><div className="ws-citation-list">{citationRows.map((row) => <article key={row.domain}><header><span className={`source-kind ${row.kind}`}>{row.kind.replace("_", " ")}</span><h3>{row.domain}</h3><strong>{row.citations}</strong></header><p>{row.promptCount} prompts · {row.providers.map(providerLabel).join(" / ")}</p><ul>{row.urls.slice(0, 4).map((url) => <li key={url.url}><a href={url.url} target="_blank" rel="noreferrer">{url.title}</a><span>×{url.count}</span></li>)}</ul></article>)}</div></div> : null}

      {view === "competitors" ? <div className="workspace-view"><div className="workspace-view-head"><div><p>COMPETITIVE INTELLIGENCE</p><h1>同じ購買面で、誰に負けているか。</h1><span>会社規模ではなく、同じ成功Observation上のRecommendation CoverageとFirst Choiceで比較します。</span></div></div><div className="ws-competitor-list">{latest.competitors.map((competitor, index) => <article key={competitor.name}><span>{index + 1}</span><div><h3>{competitor.name}</h3><p>{latest.discovery.competitors.find((item) => item.name === competitor.name)?.reason || "同じ購買場面で比較される競合"}</p></div><div className="ws-competitor-bar"><i><b style={{ width: `${competitor.coverage}%` }} /></i><strong>{competitor.coverage}%</strong></div><aside><span>{competitor.recommendedCount} recommendations</span><span>{competitor.firstChoiceCount} first choices</span></aside></article>)}<article className="self"><span>{latest.marketPosition || "—"}</span><div><h3>{latest.discovery.brandName}</h3><p>自社</p></div><div className="ws-competitor-bar"><i><b style={{ width: `${latest.recommendationCoverage}%` }} /></i><strong>{latest.recommendationCoverage}%</strong></div><aside><span>{latest.ownRecommendationCount} recommendations</span><span>{latest.firstChoiceRate}% first-choice rate</span></aside></article></div></div> : null}

      {view === "narratives" ? <div className="workspace-view"><div className="workspace-view-head"><div><p>NARRATIVE INTELLIGENCE</p><h1>AIは自社を、どんな文脈で扱っているか。</h1><span>単純なSentiment点ではなく、Recommendation・候補外・Citationの実Observationに紐づけたNarrativeを表示します。</span></div></div><div className="ws-narrative-grid">{latest.narratives.map((item) => <article key={item.id} className={`stance-${item.stance}`}><header><span>{item.theme}</span><strong>{item.stance.toUpperCase()}</strong></header><h3>{item.summary}</h3><p>{item.evidenceObservationIds.length} observationsに紐づく · Confidence {Math.round(item.confidence * 100)}%</p></article>)}</div></div> : null}

      {view === "evidence" ? <div className="workspace-view"><div className="workspace-view-head"><div><p>EVIDENCE OS</p><h1>企業にしか分からない比較材料だけ聞く。</h1><span>「プロフィールを完成してください」ではなく、何の購買質問に関係する不足かを先に見せます。入力はcompany_assertedから始まり、勝手にverifiedにはしません。</span></div></div><div className="ws-evidence-grid">{latest.evidenceGaps.map((gap) => { const answer = watch.evidence.find((item) => item.gapId === gap.id); return <article key={gap.id}><header><span>{statusLabel(answer?.status || gap.status)}</span><strong>{gap.relatedPromptCount} prompts</strong></header><h3>{gap.label}</h3><p>{gap.whyItMatters}</p>{gap.competitorEvidence ? <blockquote>{gap.competitorEvidence}</blockquote> : null}{answer ? <div className="ws-answer"><CheckIcon /><div><strong>{answer.value}</strong><small>{statusLabel(answer.status)} · {formatDate(answer.updatedAt)}</small></div></div> : <form onSubmit={(event) => saveEvidence(event, gap.id)}><input value={evidenceValue[gap.id] || ""} onChange={(event) => setEvidenceValue((current) => ({ ...current, [gap.id]: event.target.value }))} placeholder="分かる範囲で事実を入力" /><button disabled={busy === `evidence:${gap.id}`}>{busy === `evidence:${gap.id}` ? "保存中…" : "非公開で保存"} <ArrowIcon /></button></form>}</article>; })}</div></div> : null}

      {view === "actions" ? <div className="workspace-view"><div className="workspace-view-head"><div><p>ACTION & CHANGE PACKS</p><h1>Recommendationを、実装単位へ落とす。</h1><span>不足材料・対象ページ・使用可能な事実・見出し・本文・FAQ・構造化データ・再測定Promptを一つの変更単位にします。</span></div></div><div className="ws-action-list">{latest.actions.map((action, index) => { const pack = (watch.changePacks || []).find((item) => item.actionId === action.id); return <article key={action.id}><span className={`priority priority-${action.priority}`}>{action.priority}</span><div><small>{String(index + 1).padStart(2, "0")} · {action.type}</small><h3>{action.title}</h3><p>{action.rationale}</p><em>{action.target}</em></div><aside><strong>{action.relatedPromptCount}</strong><small>related prompts</small>{pack ? <span className="pack-status">{statusLabel(pack.status)}</span> : <button onClick={() => createPack(action)} disabled={busy === `pack:${action.id}`}>{busy === `pack:${action.id}` ? "作成中…" : "変更案を作る"}</button>}</aside></article>; })}</div>{(watch.changePacks || []).length ? <div className="ws-pack-list"><h2>Change Packs</h2>{(watch.changePacks || []).map((pack) => <article key={pack.id}><header><span>{statusLabel(pack.status)}</span><strong>{pack.remeasurePromptIds.length} prompts to re-measure</strong></header><h3>{pack.title}</h3><p>{pack.rationale}</p><div className="ws-pack-columns"><div><small>REQUIRED FACTS</small><ul>{pack.requiredFacts.map((fact) => <li key={fact}>{fact}</li>)}</ul></div><div><small>MISSING</small><ul>{pack.missingFacts.length ? pack.missingFacts.map((fact) => <li key={fact}>{fact}</li>) : <li>なし</li>}</ul></div><div><small>HEADINGS</small><ul>{pack.recommendedHeadings.slice(0, 4).map((heading) => <li key={heading}>{heading}</li>)}</ul></div></div><pre>{pack.draftBody}</pre><footer><span>Confidence {Math.round(pack.confidence * 100)}%</span><span>生成 {formatDate(pack.generatedAt)}</span></footer></article>)}</div> : null}</div> : null}

      {view === "history" ? <div className="workspace-view"><div className="workspace-view-head"><div><p>MEASUREMENT HISTORY</p><h1>CoreとDiscoveryを混ぜない。</h1><span>固定Coreだけがトレンドを作ります。新しい購買場面を探すDiscoveryは別履歴に置き、質問の入替を改善に見せません。</span></div></div><div className="ws-history-grid"><section><header><strong>Stable Core</strong><span>{watch.history.length} runs</span></header>{watch.history.slice().reverse().map((result, index) => <article key={`${result.scanId}-${index}`}><span>{formatDate(result.measuredAt)}</span><strong>{result.recommendationCoverage}%</strong><small>{result.panel.promptCount} prompts × {result.panel.repetitions} reps · Agreement {result.repeatAgreement}%</small></article>)}</section><section><header><strong>Rotating Discovery</strong><span>{watch.discoveryHistory?.length || 0} runs</span></header>{watch.discoveryHistory?.length ? watch.discoveryHistory.slice().reverse().map((result, index) => <article key={`${result.scanId}-${index}`}><span>{formatDate(result.measuredAt)}</span><strong>{result.lostPrompts.length} losses</strong><small>{result.panel.promptCount} rotating prompts · トレンド非算入</small></article>) : <div className="ws-empty"><SparkIcon /><strong>{watch.paid ? "次回観測でDiscoveryを実行" : "Founder Watchで有効化"}</strong><p>20の新しいBuyer Promptを毎週探索します。</p></div>}</section></div></div> : null}
    </section>
  </main>;
}
