"use client";

import Link from "next/link";
import { FormEvent, ReactNode, useMemo, useState } from "react";
import { Brand } from "@/components/brand";
import { ArrowIcon, BotIcon, EyeIcon, NetworkIcon, QuoteIcon, SearchIcon, TrophyIcon, WarningIcon } from "@/components/icons";
import { buildCitationIntelligence, buildClusterIntelligence, buildPromptIntelligence } from "@/lib/intelligence";
import { PROVIDER_LABELS, PROVIDER_ORDER } from "@/lib/provider-meta";
import type { ActionCard, ChangePack, ChangePackStatus, EvidenceAnswer, ProviderName, WatchRecord } from "@/lib/types";

type View = "overview" | "visibility" | "prompts" | "recommendations" | "citations" | "competitors" | "narratives" | "evidence" | "actions" | "history";

const nav: Array<{ id: View; label: string; hint: string }> = [
  { id: "overview", label: "Overview", hint: "今やること" },
  { id: "visibility", label: "AI Surfaces", hint: "AI別の状態" },
  { id: "prompts", label: "Buyer Prompts", hint: "追跡質問" },
  { id: "recommendations", label: "Recommendations", hint: "候補入り・候補外" },
  { id: "citations", label: "Citations", hint: "引用元・URL" },
  { id: "competitors", label: "Competitors", hint: "誰に負けているか" },
  { id: "narratives", label: "Narratives", hint: "AIの語り方" },
  { id: "evidence", label: "Evidence", hint: "比較材料" },
  { id: "actions", label: "Actions", hint: "Change Pack" },
  { id: "history", label: "History", hint: "Core / Discovery / Custom" },
];

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Tokyo" }).format(new Date(value));
}
function clusterLabel(value: string) {
  return ({ category: "カテゴリ", segment: "企業条件", use_case: "用途", feature: "機能", alternative: "乗換・代替", comparison: "直接比較", value: "価格・価値", implementation: "導入", trust: "信頼・安全", support: "支援" } as Record<string, string>)[value] || value;
}
function statusLabel(value: string) {
  return ({ company_asserted: "企業申告", verified: "確認済み", disputed: "要確認", expired: "期限切れ", missing: "未確認", partial: "一部確認", needs_evidence: "材料待ち", ready: "承認待ち", approved: "承認済み", rejected: "却下", draft: "下書き" } as Record<string, string>)[value] || value;
}
function ViewHead({ eyebrow, title, children }: { eyebrow: string; title: string; children: ReactNode }) {
  return <div className="workspace-view-head"><div><p>{eyebrow}</p><h1>{title}</h1><span>{children}</span></div></div>;
}
function Focus({ title, meta, headline, body, action, onClick, danger, accent }: { title: string; meta: string; headline: string; body: string; action?: string; onClick?: () => void; danger?: boolean; accent?: boolean }) {
  return <article className={`ws-focus ${danger ? "danger" : ""} ${accent ? "accent" : ""}`}><header><span>{title}</span><strong>{meta}</strong></header><h3>{headline}</h3><p>{body}</p>{action && onClick ? <button type="button" onClick={onClick}>{action}<ArrowIcon /></button> : null}</article>;
}
function sampleChangePack(action: ActionCard, watch: WatchRecord): ChangePack {
  const related = watch.latest.evidenceGaps.filter((gap) => gap.relatedPromptIds.some((id) => action.relatedPromptIds.includes(id)));
  const allowedEvidence = related.flatMap((gap) => { const answer = watch.evidence.find((item) => item.gapId === gap.id); return answer ? [{ label: gap.label, value: answer.value, status: answer.status }] : []; });
  const missingFacts = related.filter((gap) => !watch.evidence.some((item) => item.gapId === gap.id)).map((gap) => gap.label);
  return {
    id: `sample_pack_${action.id}`,
    actionId: action.id,
    status: missingFacts.length ? "needs_evidence" : "ready",
    title: action.title,
    target: action.target,
    rationale: action.rationale,
    requiredFacts: related.map((gap) => gap.label),
    missingFacts,
    allowedEvidence,
    recommendedHeadings: [action.title, "対象企業・適用条件", "比較できる具体的な根拠", "導入・運用条件", "よくある質問"],
    draftBody: "確認済みの企業情報だけを使って本文を生成します。未確認の数値・導入期間・顧客実績は [要確認] のまま残します。",
    faqs: related.slice(0, 3).map((gap) => ({ question: `${gap.label}について確認できる情報は？`, answer: allowedEvidence.find((item) => item.label === gap.label)?.value || `[要確認: ${gap.label}]` })),
    structuredDataNotes: ["本文に実在する情報だけを構造化データへ反映する。"],
    internalLinks: ["関連する実在ページのみ内部リンクする。"],
    validationChecklist: ["数値と期間に確認元がある", "企業申告をverifiedと誤表示していない", "公開後は同じPromptで再観測する"],
    remeasurePromptIds: action.relatedPromptIds,
    confidence: action.confidence,
    generatedAt: "2026-09-02T00:00:00.000Z",
  };
}
function replacePack(watch: WatchRecord, pack: ChangePack): WatchRecord {
  return { ...watch, changePacks: [...(watch.changePacks || []).filter((item) => item.id !== pack.id && item.actionId !== pack.actionId), pack] };
}

export function WorkspaceLoadedV4({ initialWatch, sample, token, initialView }: { initialWatch: WatchRecord; sample: boolean; token: string; initialView?: string | null }) {
  const requested = initialView as View | null;
  const [view, setView] = useState<View>(requested && nav.some((item) => item.id === requested) ? requested : "overview");
  const [watch, setWatch] = useState(initialWatch);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState("");
  const [evidenceValue, setEvidenceValue] = useState<Record<string, string>>({});
  const latest = watch.latest;
  const promptRows = useMemo(() => buildPromptIntelligence(latest), [latest]);
  const citationRows = useMemo(() => buildCitationIntelligence(latest), [latest]);
  const clusterRows = useMemo(() => buildClusterIntelligence(latest), [latest]);
  const expectedProviders = watch.paid ? PROVIDER_ORDER : (["openai", "gemini", "perplexity"] as ProviderName[]);
  const providerRows = useMemo(() => expectedProviders.map((provider) => {
    const scheduled = latest.observations.filter((item) => item.provider === provider);
    const rows = scheduled.filter((item) => item.status === "success");
    const recommended = rows.filter((item) => item.ownRecommended).length;
    return {
      provider,
      scheduled: scheduled.length,
      successful: rows.length,
      recommended,
      coverage: rows.length ? Math.round(recommended / rows.length * 100) : 0,
      first: rows.filter((item) => item.ownPosition === 1).length,
      cited: rows.filter((item) => item.citations.some((citation) => citation.domain === latest.discovery.domain)).length,
    };
  }), [latest, watch.paid]);
  const topCompetitor = latest.competitors[0];
  const topLoss = latest.lostPrompts[0];
  const topGap = latest.evidenceGaps[0];
  const topAction = latest.actions[0];
  const ownCitationCount = citationRows.filter((item) => item.kind === "owned").reduce((sum, item) => sum + item.citations, 0);
  const thirdPartyCitationCount = citationRows.filter((item) => item.kind === "third_party").reduce((sum, item) => sum + item.citations, 0);
  const pageHref = sample ? "/workspace/pages?sample=1" : `/workspace/pages?token=${encodeURIComponent(token)}`;
  const agentHref = sample ? "/workspace/agent-analytics?sample=1" : `/workspace/agent-analytics?token=${encodeURIComponent(token)}`;
  const executionHref = sample ? "/workspace/execution?sample=1" : `/workspace/execution?token=${encodeURIComponent(token)}`;

  async function saveEvidence(event: FormEvent, gapId: string) {
    event.preventDefault();
    const value = evidenceValue[gapId]?.trim();
    if (!value) return;
    if (sample) {
      const answer: EvidenceAnswer = { gapId, value, status: "company_asserted", updatedAt: new Date().toISOString() };
      setWatch((current) => ({ ...current, evidence: [...current.evidence.filter((item) => item.gapId !== gapId), answer] }));
      setEvidenceValue((current) => ({ ...current, [gapId]: "" }));
      return;
    }
    setBusy(`evidence:${gapId}`); setError("");
    try {
      const response = await fetch("/api/evidence", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, gapId, value }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "保存できませんでした。");
      setWatch(data);
      setEvidenceValue((current) => ({ ...current, [gapId]: "" }));
    } catch (caught) { setError(caught instanceof Error ? caught.message : "保存できませんでした。"); }
    finally { setBusy(""); }
  }

  async function createPack(action: ActionCard) {
    if (sample) { setWatch((current) => replacePack(current, sampleChangePack(action, current))); setView("actions"); return; }
    setBusy(`pack:${action.id}`); setError("");
    try {
      const response = await fetch("/api/change-packs", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, actionId: action.id }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Change Packを作成できませんでした。");
      setWatch(data.watch); setView("actions");
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Change Packを作成できませんでした。"); }
    finally { setBusy(""); }
  }

  async function updatePack(pack: ChangePack, status: ChangePackStatus) {
    if (sample) {
      if (status === "approved" && pack.missingFacts.length) { setError("未確認の比較材料を埋めてからChange Packを作り直してください。"); return; }
      setWatch((current) => replacePack(current, { ...pack, status })); return;
    }
    setBusy(`status:${pack.id}`); setError("");
    try {
      const response = await fetch("/api/change-packs", { method: "PATCH", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, packId: pack.id, status }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Change Packを更新できませんでした。");
      setWatch(data.watch);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "Change Packを更新できませんでした。"); }
    finally { setBusy(""); }
  }

  async function remeasure(pack: ChangePack) {
    if (sample) {
      const validation = { measuredAt: "2026-09-09T00:00:00.000Z", promptIds: pack.remeasurePromptIds, beforeCoverage: 18, afterCoverage: 31, successfulObservations: pack.remeasurePromptIds.length * 3, note: "同じ対象Promptの観測差です。Change Packが差の原因であるとは断定しません。" };
      setWatch((current) => replacePack(current, { ...pack, validation })); return;
    }
    setBusy(`remeasure:${pack.id}`); setError("");
    try {
      const response = await fetch("/api/change-packs/remeasure", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, packId: pack.id }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "再測定できませんでした。");
      setWatch(data.watch);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "再測定できませんでした。"); }
    finally { setBusy(""); }
  }

  return <main className="workspace-root">
    <aside className="workspace-sidebar">
      <Brand />
      <div className="workspace-project"><small>PROJECT</small><strong>{latest.discovery.brandName}</strong><span>{latest.discovery.market}</span></div>
      <nav>{nav.map((item) => <button key={item.id} className={view === item.id ? "active" : ""} onClick={() => setView(item.id)}><span>{item.label}</span><small>{item.hint}</small></button>)}</nav>
      <div className="workspace-plan"><small>{watch.paid ? "FOUNDER WATCH" : "14-DAY WATCH"}</small><strong>{watch.paid ? "Active" : "Trial"}</strong><span>次回 {formatDate(watch.nextRunAt)}</span></div>
      <Link className="workspace-back" href={sample ? "/watch?sample=1" : `/watch?token=${encodeURIComponent(token)}`}>← Weekly Briefへ戻る</Link>
    </aside>
    <section className="workspace-main">
      <header className="workspace-topbar"><div><span className="workspace-live"><i />{watch.status.toUpperCase()}</span><strong>{latest.discovery.domain}</strong></div><div><span>{expectedProviders.length} AI surfaces</span><span>Core {latest.panel.promptCount}</span><span>{latest.panel.repetitions} reps</span></div></header>
      {error ? <div className="workspace-error"><WarningIcon />{error}</div> : null}

      {view === "overview" ? <div className="workspace-view">
        <ViewHead eyebrow="EXECUTIVE CONTROL CENTER" title="AI購買面を、ここだけで管理する。">測定、原因候補、比較材料、変更案、実行、再観測を同じProjectでつなぎます。</ViewHead>
        <div className="ws-kpis"><article><EyeIcon /><small>Recommendation Coverage</small><strong>{latest.recommendationCoverage}%</strong><span>{latest.ownRecommendationCount}/{latest.successfulObservations}成功回答</span></article><article><BotIcon /><small>Mention Coverage</small><strong>{latest.mentionCoverage}%</strong><span>ブランド言及</span></article><article><QuoteIcon /><small>Own Citation</small><strong>{latest.citationCoverage}%</strong><span>{ownCitationCount} citation events</span></article><article><TrophyIcon /><small>First Choice</small><strong>{latest.firstChoiceRate}%</strong><span>第一候補</span></article></div>
        <div className="ws-overview-grid"><Focus title="BIGGEST BUYER LOSS" meta={`${latest.lostPrompts.length}/${latest.prompts.length} themes`} headline={topLoss ? `「${topLoss.prompt}」` : "主要な候補外テーマなし"} body={topLoss?.summary || "Discoveryで新しい購買場面を探索します。"} action="詳細を見る" onClick={() => setView("recommendations")} danger /><Focus title="TOP REPLACEMENT" meta={`${topCompetitor?.coverage || 0}%`} headline={topCompetitor?.name || "未特定"} body="同じ成功Observationで自社より先に候補へ入る競合です。" action="競合を見る" onClick={() => setView("competitors")} /><Focus title="MISSING COMPARISON MATERIAL" meta={`${topGap?.relatedPromptCount || 0} prompts`} headline={topGap?.label || "重大な不足なし"} body={topGap?.whyItMatters || "主要比較材料を確認できています。"} action="比較材料を見る" onClick={() => setView("evidence")} /><Focus title="NEXT BEST ACTION" meta={topAction?.priority.toUpperCase() || "—"} headline={topAction?.title || "Actionなし"} body={topAction?.rationale || "観測を継続します。"} action={topAction ? "Change Packを作る" : undefined} onClick={topAction ? () => createPack(topAction) : undefined} accent /></div>
        <div className="ws-loop"><span>Observe</span><i>→</i><span>Explain</span><i>→</i><span>Evidence</span><i>→</i><span>Change Pack</span><i>→</i><span>Approve</span><i>→</i><span>Execute</span><i>→</i><span>Re-measure</span></div>
        <div className="ws-citation-summary"><Link href={pageHref}><QuoteIcon /><strong>Page Intelligence</strong><span>ページ×Citation×Lost Prompt</span></Link><Link href={agentHref}><NetworkIcon /><strong>Agent Analytics</strong><span>実crawler / referral</span></Link><Link href={executionHref}><ArrowIcon /><strong>Execution</strong><span>GitHub PR / WordPress Draft</span></Link></div>
      </div> : null}

      {view === "visibility" ? <div className="workspace-view">
        <ViewHead eyebrow="AI SURFACE INTELLIGENCE" title="AIごとの差を、混ぜずに見る。">一つのVisibility Scoreに潰さず、各surfaceの成功数・Recommendation・First Choice・自社Citationを分けます。</ViewHead>
        <div className="ws-provider-grid">{providerRows.map((row) => <article key={row.provider}><header><strong>{PROVIDER_LABELS[row.provider]}</strong><span>{row.successful}/{row.scheduled} success</span></header><b>{row.coverage}%</b><small>Recommendation Coverage</small><dl><div><dt>候補入り</dt><dd>{row.recommended}</dd></div><div><dt>First Choice</dt><dd>{row.first}</dd></div><div><dt>Own Citation</dt><dd>{row.cited}</dd></div></dl></article>)}</div>
        <div className="ws-table-card"><header><strong>Buyer Intent別</strong><span>弱いIntentから表示</span></header><div className="ws-cluster-list">{clusterRows.map((row) => <div key={row.cluster}><span>{clusterLabel(row.cluster)}</span><i><b style={{ width: `${row.coverage}%` }} /></i><strong>{row.coverage}%</strong><small>{row.recommended}/{row.successful}</small></div>)}</div></div>
      </div> : null}

      {view === "prompts" ? <div className="workspace-view"><ViewHead eyebrow="BUYER PROMPT INTELLIGENCE" title="何を追っているか、理由まで見える。">検索量を捏造せず、市場・企業条件・用途・比較条件から追跡理由を明示します。</ViewHead><div className="ws-prompt-list">{promptRows.map((row, index) => <article key={row.prompt.id}><span className="ws-index">{String(index + 1).padStart(2, "0")}</span><div className="ws-prompt-main"><header><span>{clusterLabel(row.prompt.cluster)}</span><em>Intent {row.prompt.importance}/5</em></header><h3>{row.prompt.text}</h3><p>{row.prompt.whyTracked}</p><div className="ws-engine-pills">{row.providerOutcomes.filter((provider) => expectedProviders.includes(provider.provider)).map((provider) => <span key={provider.provider} className={provider.recommended ? "win" : "loss"}>{PROVIDER_LABELS[provider.provider]} {provider.recommended}/{provider.successful}</span>)}</div></div><aside><strong>{row.recommendationCoverage}%</strong><small>候補入り率</small><span>{row.citations} citations</span></aside></article>)}</div></div> : null}

      {view === "recommendations" ? <div className="workspace-view"><ViewHead eyebrow="RECOMMENDATION INTELLIGENCE" title="名前が出たかではなく、購入候補に入ったか。">候補順、AI surface、反復、First ChoiceをPrompt単位で監査します。</ViewHead><div className="ws-loss-list">{latest.lostPrompts.map((loss, index) => <article key={loss.promptId}><header><span>LOSS {String(index + 1).padStart(2, "0")}</span><strong>{loss.winner || "競合候補"}</strong></header><h3>{loss.prompt}</h3><p>{latest.prompts.find((prompt) => prompt.id === loss.promptId)?.whyTracked}</p><div className="ws-outcome-grid">{loss.observations.map((observation) => <div key={observation.id}><span>{PROVIDER_LABELS[observation.provider]} · Run {observation.repetition}</span><strong className={observation.ownRecommended ? "good" : "bad"}>{observation.ownRecommended ? `自社 ${observation.ownPosition || "候補"}` : "候補外"}</strong><small>First: {observation.firstCandidate || "—"}</small></div>)}</div><p>{loss.summary}</p></article>)}</div></div> : null}

      {view === "citations" ? <div className="workspace-view"><ViewHead eyebrow="CITATION INTELLIGENCE" title="AIが使った情報源を、URLまで分解する。">Owned / Competitor / Third-partyを分け、Promptとsurfaceへ戻れます。</ViewHead><div className="ws-citation-summary"><article><QuoteIcon /><strong>{ownCitationCount}</strong><span>Own-domain citations</span></article><article><NetworkIcon /><strong>{thirdPartyCitationCount}</strong><span>Third-party citations</span></article><article><SearchIcon /><strong>{citationRows.length}</strong><span>Cited domains</span></article><Link href={pageHref}><ArrowIcon /><strong>Pages</strong><span>ページ在庫と照合</span></Link></div><div className="ws-citation-list">{citationRows.map((row) => <article key={row.domain}><header><span className={`source-kind ${row.kind}`}>{row.kind.replace("_", " ")}</span><h3>{row.domain}</h3><strong>{row.citations}</strong></header><p>{row.promptCount} prompts · {row.providers.map((provider) => PROVIDER_LABELS[provider]).join(" / ")}</p><ul>{row.urls.slice(0, 5).map((url) => <li key={url.url}><a href={url.url} target="_blank" rel="noreferrer">{url.title}</a><span>×{url.count}</span></li>)}</ul></article>)}</div></div> : null}

      {view === "competitors" ? <div className="workspace-view"><ViewHead eyebrow="COMPETITIVE INTELLIGENCE" title="同じ購買面で、誰に負けているか。">会社規模ではなく、同じObservation上のRecommendation CoverageとFirst Choiceで比較します。</ViewHead><div className="ws-competitor-list">{latest.competitors.map((competitor, index) => <article key={competitor.name}><span>{index + 1}</span><div><h3>{competitor.name}</h3><p>{latest.discovery.competitors.find((item) => item.name === competitor.name)?.reason || "同じ購買場面の競合"}</p></div><div className="ws-competitor-bar"><i><b style={{ width: `${competitor.coverage}%` }} /></i><strong>{competitor.coverage}%</strong></div><aside><span>{competitor.recommendedCount} recommendations</span><span>{competitor.firstChoiceCount} first choices</span></aside></article>)}<article className="self"><span>{latest.marketPosition || "—"}</span><div><h3>{latest.discovery.brandName}</h3><p>自社</p></div><div className="ws-competitor-bar"><i><b style={{ width: `${latest.recommendationCoverage}%` }} /></i><strong>{latest.recommendationCoverage}%</strong></div><aside><span>{latest.ownRecommendationCount} recommendations</span><span>{latest.firstChoiceRate}% first-choice rate</span></aside></article></div></div> : null}

      {view === "narratives" ? <div className="workspace-view"><ViewHead eyebrow="NARRATIVE INTELLIGENCE" title="AIは自社を、どんな文脈で扱っているか。">曖昧なSentiment点だけにせず、実Observationへ紐づけます。</ViewHead><div className="ws-narrative-grid">{latest.narratives.map((item) => <article key={item.id} className={`stance-${item.stance}`}><header><span>{item.theme}</span><strong>{item.stance.toUpperCase()}</strong></header><h3>{item.summary}</h3><p>{item.evidenceObservationIds.length} observations · Confidence {Math.round(item.confidence * 100)}%</p></article>)}</div></div> : null}

      {view === "evidence" ? <div className="workspace-view"><ViewHead eyebrow="COMPARISON MATERIALS / EVIDENCE" title="公開Webで足りない事実だけ聞く。">入力作業そのものではなく、どのBuyer Promptに関係するかを先に示します。</ViewHead><div className="evidence-grid evidence-input-grid">{latest.evidenceGaps.map((gap) => { const answer = watch.evidence.find((item) => item.gapId === gap.id); return <article key={gap.id}><header><span>{gap.relatedPromptCount} prompts</span><strong>{answer ? statusLabel(answer.status) : statusLabel(gap.status)}</strong></header><h3>{gap.label}</h3><p>{answer ? answer.value : gap.whyItMatters}</p>{gap.competitorEvidence ? <small>競合側: {gap.competitorEvidence}</small> : null}{!answer ? <form onSubmit={(event) => saveEvidence(event, gap.id)}><input value={evidenceValue[gap.id] || ""} onChange={(event) => setEvidenceValue((current) => ({ ...current, [gap.id]: event.target.value }))} placeholder="分かる範囲で入力" /><button className="button button-dark" disabled={busy === `evidence:${gap.id}`}>{busy === `evidence:${gap.id}` ? "保存中…" : "非公開で保存"}<ArrowIcon /></button></form> : null}</article>; })}</div></div> : null}

      {view === "actions" ? <div className="workspace-view"><ViewHead eyebrow="ACTION / CHANGE PACK" title="診断を、実行可能な変更単位へ。">未確認情報を捏造せず、必要材料、変更案、承認、実行、同じPromptでの再観測まで管理します。</ViewHead><div className="action-list">{latest.actions.map((action) => { const pack = (watch.changePacks || []).find((item) => item.actionId === action.id); return <article key={action.id}><span className={`priority priority-${action.priority}`}>{action.priority}</span><div><small>{action.type}</small><h3>{action.title}</h3><p>{action.rationale}</p>{pack ? <p>Change Pack: <strong>{statusLabel(pack.status)}</strong>{pack.missingFacts.length ? ` · 材料待ち ${pack.missingFacts.length}` : ""}</p> : null}{pack?.validation ? <p>再観測: {pack.validation.beforeCoverage}% → {pack.validation.afterCoverage}% <small>因果は未証明</small></p> : null}</div><aside><strong>{action.relatedPromptCount}</strong><small>related prompts</small>{!pack ? <button type="button" onClick={() => createPack(action)} disabled={busy === `pack:${action.id}`}>この変更案を作る</button> : <><button type="button" onClick={() => updatePack(pack, "approved")} disabled={pack.status === "approved" || Boolean(pack.missingFacts.length) || busy === `status:${pack.id}`}>承認</button>{pack.status === "approved" ? <><Link href={executionHref}>安全に実行</Link><button type="button" onClick={() => remeasure(pack)} disabled={busy === `remeasure:${pack.id}`}>対象Promptを再測定</button></> : null}</>}</aside></article>; })}</div></div> : null}

      {view === "history" ? <div className="workspace-view"><ViewHead eyebrow="MEASUREMENT HISTORY" title="Core・Discovery・Customを混ぜない。">公式トレンドは固定Coreだけ。探索や追加質問でグラフを良く見せません。</ViewHead><div className="ws-history-grid"><article><header><span>STABLE CORE</span><strong>{watch.history.length} runs</strong></header>{watch.history.slice().reverse().map((item) => <div key={`${item.scanId}-${item.measuredAt}`}><span>{formatDate(item.measuredAt)}</span><strong>{item.recommendationCoverage}%</strong><small>{item.panel.promptCount} prompts · {item.panel.repetitions} reps</small></div>)}</article><article><header><span>ROTATING DISCOVERY</span><strong>{watch.discoveryHistory?.length || 0} runs</strong></header>{watch.discoveryHistory?.length ? watch.discoveryHistory.slice().reverse().map((item) => <div key={`${item.scanId}-${item.measuredAt}`}><span>{formatDate(item.measuredAt)}</span><strong>{item.lostPrompts.length} losses</strong><small>{item.panel.promptCount} prompts</small></div>) : <p>まだDiscovery履歴はありません。</p>}</article><article><header><span>CUSTOM PROMPTS</span><strong>{watch.customHistory?.length || 0} runs</strong></header><p>{watch.customPrompts?.length || 0} custom prompts configured.</p></article></div></div> : null}
    </section>
  </main>;
}
