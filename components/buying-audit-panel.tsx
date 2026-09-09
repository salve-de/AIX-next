import { buildBaseBuyingAudit, getBuyingAudit, type BuyingAuditSeverity } from "@/lib/buying-audit-core";
import type { ProviderName, ScanResult } from "@/lib/types";

function providerLabel(provider: ProviderName) {
  return provider === "openai" ? "OpenAI" : provider === "gemini" ? "Gemini" : "Perplexity";
}

function severityLabel(severity: BuyingAuditSeverity) {
  if (severity === "critical") return "重大";
  if (severity === "high") return "高";
  if (severity === "medium") return "中";
  return "低";
}

function severityStyle(severity: BuyingAuditSeverity) {
  if (severity === "critical" || severity === "high") return { background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca" };
  if (severity === "medium") return { background: "#fffbeb", color: "#92400e", border: "1px solid #fde68a" };
  return { background: "#f8fafc", color: "#475569", border: "1px solid #e2e8f0" };
}

export function BuyingAuditPanel({ result }: { result: ScanResult }) {
  const audit = getBuyingAudit(result) || buildBaseBuyingAudit(result);
  const risks = audit.candidateRisks.filter((risk) => risk.totalVotes > 0).slice(0, 5);
  const issues = audit.factIssues.slice(0, 5);
  const externalSources = audit.citationDependencies.filter((row) => !row.owned).slice(0, 5);

  return <section aria-label="AI上の購買監査" style={{ margin: "28px 0", border: "1px solid #cbd5e1", borderRadius: "12px", background: "#ffffff", overflow: "hidden" }}>
    <div style={{ padding: "22px 24px", borderBottom: "1px solid #e2e8f0", background: "#f8fafc" }}>
      <p className="overline" style={{ marginBottom: "6px" }}>AI上の購買監査</p>
      <h3 style={{ margin: "0 0 8px", fontSize: "1.25rem", color: "#0f172a" }}>AIが御社をどう選び、どう説明しているか。</h3>
      <p style={{ margin: 0, color: "#475569", lineHeight: 1.7, fontSize: ".86rem" }}>購入に近い質問を優先し、候補落ち・公式情報との食い違い・外部の参照元をまとめています。</p>
    </div>

    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1px", background: "#e2e8f0" }}>
      <div style={{ background: "#fff", padding: "18px 20px" }}><span style={{ display: "block", fontSize: ".74rem", color: "#64748b" }}>重要質問で候補外</span><strong style={{ fontSize: "1.55rem", color: audit.candidateGapCount ? "#991b1b" : "#0f172a" }}>{audit.candidateGapCount}件</strong></div>
      <div style={{ background: "#fff", padding: "18px 20px" }}><span style={{ display: "block", fontSize: ".74rem", color: "#64748b" }}>公式情報との明確な食い違い</span><strong style={{ fontSize: "1.55rem", color: audit.misinformationCount ? "#991b1b" : "#0f172a" }}>{audit.misinformationCount}件</strong></div>
      <div style={{ background: "#fff", padding: "18px 20px" }}><span style={{ display: "block", fontSize: ".74rem", color: "#64748b" }}>重要質問で使われた外部情報源</span><strong style={{ fontSize: "1.55rem", color: "#0f172a" }}>{audit.externalCitationDomainCount}件</strong></div>
    </div>

    {audit.changeSummary && (audit.changeSummary.newCandidateDrops || audit.changeSummary.newFactErrors || audit.changeSummary.newCompetitors || audit.changeSummary.newCitationDomains || audit.changeSummary.recoveries) ? (
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #e2e8f0", background: "#fff" }}>
        <strong style={{ display: "block", marginBottom: "8px", color: "#0f172a" }}>前回からの重要変化</strong>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", fontSize: ".78rem" }}>
          {audit.changeSummary.newCandidateDrops ? <span style={{ padding: "5px 9px", borderRadius: "999px", background: "#fef2f2", color: "#991b1b" }}>新たな候補落ち {audit.changeSummary.newCandidateDrops}件</span> : null}
          {audit.changeSummary.newFactErrors ? <span style={{ padding: "5px 9px", borderRadius: "999px", background: "#fef2f2", color: "#991b1b" }}>新しい誤情報 {audit.changeSummary.newFactErrors}件</span> : null}
          {audit.changeSummary.newCompetitors ? <span style={{ padding: "5px 9px", borderRadius: "999px", background: "#fffbeb", color: "#92400e" }}>新しい競合 {audit.changeSummary.newCompetitors}件</span> : null}
          {audit.changeSummary.newCitationDomains ? <span style={{ padding: "5px 9px", borderRadius: "999px", background: "#f8fafc", color: "#475569" }}>新しい参照元 {audit.changeSummary.newCitationDomains}件</span> : null}
          {audit.changeSummary.recoveries ? <span style={{ padding: "5px 9px", borderRadius: "999px", background: "#f0fdf4", color: "#166534" }}>候補入り回復 {audit.changeSummary.recoveries}件</span> : null}
        </div>
      </div>
    ) : null}

    {audit.alerts.length ? <div style={{ padding: "18px 24px", borderBottom: "1px solid #e2e8f0" }}>
      <strong style={{ display: "block", marginBottom: "10px", color: "#0f172a" }}>いま確認すべきこと</strong>
      <div style={{ display: "grid", gap: "8px" }}>
        {audit.alerts.slice(0, 5).map((alert) => <div key={alert.id} style={{ padding: "11px 13px", borderRadius: "8px", ...severityStyle(alert.severity) }}>
          <div style={{ display: "flex", gap: "8px", alignItems: "center", marginBottom: "3px" }}><span style={{ fontSize: ".68rem", fontWeight: 800 }}>重要度 {severityLabel(alert.severity)}</span><strong style={{ fontSize: ".84rem" }}>{alert.title}</strong></div>
          <p style={{ margin: 0, fontSize: ".78rem", lineHeight: 1.6 }}>{alert.detail}</p>
        </div>)}
      </div>
    </div> : null}

    {issues.length ? <div style={{ padding: "20px 24px", borderBottom: "1px solid #e2e8f0" }}>
      <strong style={{ display: "block", marginBottom: "4px", color: "#0f172a" }}>AIの説明と公式情報の食い違い</strong>
      <p style={{ margin: "0 0 12px", fontSize: ".76rem", color: "#64748b" }}>AI回答と公式サイト本文の両方に明記された内容が矛盾した場合だけ表示します。</p>
      <div style={{ display: "grid", gap: "10px" }}>
        {issues.map((issue) => <article key={issue.id} style={{ border: "1px solid #e2e8f0", borderRadius: "8px", padding: "13px 15px" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", alignItems: "center", marginBottom: "8px" }}><strong style={{ fontSize: ".82rem", color: "#0f172a" }}>{providerLabel(issue.provider)}</strong><span style={{ fontSize: ".68rem", padding: "2px 7px", borderRadius: "999px", ...severityStyle(issue.severity) }}>重要度 {severityLabel(issue.severity)}</span></div>
          <p style={{ margin: "4px 0", fontSize: ".8rem", color: "#7f1d1d" }}><strong>AI:</strong> {issue.aiClaim}</p>
          <p style={{ margin: "4px 0", fontSize: ".8rem", color: "#14532d" }}><strong>公式:</strong> {issue.officialFact}</p>
          <p style={{ margin: "7px 0 0", fontSize: ".74rem", color: "#64748b" }}>{issue.explanation} <a href={issue.officialSourceUrl} target="_blank" rel="noreferrer">公式ページを確認 ↗</a></p>
        </article>)}
      </div>
    </div> : audit.factCheckStatus !== "completed" ? <div style={{ padding: "14px 24px", borderBottom: "1px solid #e2e8f0", fontSize: ".76rem", color: "#64748b" }}>公式情報との事実照合は{audit.factCheckStatus === "failed" ? "今回完了できませんでした。候補入りと参照元の監視結果は利用できます。" : "実測時に、取得できた公式ページとAI回答を使って行います。"}</div> : null}

    {risks.length ? <div style={{ padding: "20px 24px", borderBottom: externalSources.length ? "1px solid #e2e8f0" : undefined }}>
      <strong style={{ display: "block", marginBottom: "10px", color: "#0f172a" }}>購入に近い質問の候補入り状況</strong>
      <div style={{ display: "grid", gap: "8px" }}>
        {risks.map((risk) => <div key={risk.promptId} style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) auto", gap: "12px", padding: "10px 0", borderBottom: "1px solid #f1f5f9" }}>
          <div><strong style={{ display: "block", fontSize: ".82rem", color: "#0f172a" }}>{risk.prompt}</strong><small style={{ color: "#64748b", lineHeight: 1.5 }}>{risk.excludedProviders.length ? `候補外が多いAI: ${risk.excludedProviders.map(providerLabel).join(" / ")}` : "取得できた回答では候補入りが優勢"}{risk.topCompetitors.length ? ` · 他社候補: ${risk.topCompetitors.join("、")}` : ""}</small></div>
          <strong style={{ fontSize: ".9rem", color: (risk.ownRecommendationRate ?? 100) < 50 ? "#991b1b" : "#166534", whiteSpace: "nowrap" }}>{risk.ownRecommendationRate === null ? "未取得" : `${risk.ownRecommendationRate}%`}</strong>
        </div>)}
      </div>
    </div> : null}

    {externalSources.length ? <div style={{ padding: "18px 24px" }}>
      <strong style={{ display: "block", marginBottom: "8px", color: "#0f172a" }}>AIが使った主な外部情報源</strong>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>{externalSources.map((source) => <span key={source.domain} style={{ border: "1px solid #e2e8f0", borderRadius: "999px", padding: "5px 9px", fontSize: ".72rem", color: "#475569", background: "#f8fafc" }}>{source.domain} · {source.promptCount}問</span>)}</div>
    </div> : null}
  </section>;
}
