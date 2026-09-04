"use client";

import { useMemo, useState } from "react";
import type { Citation, LostPrompt, Observation, ScanResult } from "@/lib/types";

type Stage = "すべて" | "認知" | "比較" | "検討" | "導入";

function stageFor(result: ScanResult, loss: LostPrompt) {
  const prompt = result.prompts?.find((item) => item.id === loss.promptId);
  if (prompt?.stage) return prompt.stage;
  if (prompt?.cluster === "comparison" || prompt?.cluster === "alternative" || prompt?.cluster === "value") return "比較";
  if (prompt?.cluster === "implementation" || prompt?.cluster === "support") return "導入";
  if (prompt?.cluster === "trust" || prompt?.cluster === "feature") return "検討";
  const text = `${prompt?.text || loss.prompt}`;
  if (/比較|違い|乗り換え|選んで|主要|代替/.test(text)) return "比較";
  if (/料金|費用|効果|実績|信頼|おすすめ/.test(text)) return "検討";
  if (/導入|期間|対応|サポート|始め|使い/.test(text)) return "導入";
  return "認知";
}

function stageLabel(stage: string) {
  return stage === "認知" ? "候補を探す質問" : stage === "比較" ? "比較の質問" : stage === "導入" ? "導入の質問" : "検討の質問";
}

function providerLabel(provider: string) {
  if (provider === "openai") return "OpenAI (ChatGPT)";
  if (provider === "perplexity") return "Perplexity AI";
  if (provider === "gemini") return "Google (Gemini)";
  return provider;
}

export function QuestionList({ result }: { result: ScanResult }) {
  const [stage, setStage] = useState<Stage>("すべて");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => result.lostPrompts.filter((loss) => stage === "すべて" || stageFor(result, loss) === stage), [result, stage]);
  const counts = useMemo(() => ( ["認知", "比較", "検討", "導入"] as const).map((item) => ({ stage: item, count: result.lostPrompts.filter((loss) => stageFor(result, loss) === item).length })), [result]);

  function toggleExpand(id: string) {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    if (expandedIds.size === filtered.length) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(filtered.map((item) => item.promptId)));
    }
  }

  return (
    <div className="question-list-wrap">
      <div className="question-list-toolbar" aria-label="質問を絞り込む" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label htmlFor="question-stage">購入段階</label>
          <select id="question-stage" value={stage} onChange={(event) => setStage(event.target.value as Stage)}>
            <option value="すべて">すべて（{result.lostPrompts.length}問）</option>
            {counts.map((item) => <option value={item.stage} key={item.stage}>{item.stage}（{item.count}問）</option>)}
          </select>
          <span>{filtered.length}問を表示</span>
        </div>

        <button
          type="button"
          onClick={toggleAll}
          style={{
            fontSize: "0.78rem",
            padding: "4px 12px",
            background: "#f1f5f9",
            border: "1px solid #cbd5e1",
            borderRadius: "6px",
            cursor: "pointer",
            fontWeight: 600,
            color: "#334155",
          }}
        >
          {expandedIds.size === filtered.length ? "全問の出展・AI推論根拠を閉じる" : "全問の出展・AI推論根拠を一括展開（検証）"}
        </button>
      </div>

      <div className="question-list">
        {filtered.slice(0, 12).map((loss, index) => {
          const stageName = stageFor(result, loss);
          const isExpanded = expandedIds.has(loss.promptId);

          return (
            <article key={loss.promptId} style={{ display: "block", marginBottom: "16px" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "14px", width: "100%" }}>
                <div className="question-number">{String(index + 1).padStart(2, "0")}</div>
                <div className="question-main" style={{ flex: 1 }}>
                  <small className="question-context">{stageLabel(stageName)}</small>
                  <h3>「{loss.prompt}」</h3>
                  <p>{loss.summary}</p>
                </div>
                <div className="question-outcome" style={{ flexShrink: 0 }}>
                  <span>先に選ばれた競合<strong>{loss.winner || "特定できず"}</strong></span>
                  <span>自社<strong className="lost-text">候補外</strong></span>
                </div>
              </div>

              {/* 出展・AI推論検証トグルボタン */}
              <div style={{ marginTop: "10px", paddingTop: "8px", borderTop: "1px dashed #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <button
                  type="button"
                  onClick={() => toggleExpand(loss.promptId)}
                  style={{
                    background: isExpanded ? "#e0f2fe" : "#f8fafc",
                    border: isExpanded ? "1px solid #7dd3fc" : "1px solid #e2e8f0",
                    color: isExpanded ? "#0369a1" : "#475569",
                    padding: "4px 10px",
                    borderRadius: "4px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                  aria-expanded={isExpanded}
                >
                  <span>{isExpanded ? "▲" : "▼"}</span>
                  <span>{isExpanded ? "AI推論根拠・出展ソースを閉じる" : "AI推論根拠・出展ソースを検証する（バックトレース証跡ログ）"}</span>
                </button>
                <span style={{ fontSize: "0.7rem", color: "#94a3b8", fontFamily: "var(--font-mono, monospace)" }}>
                  AUDIT: {loss.observations.length} MODELS OBSERVED
                </span>
              </div>

              {/* 展開される証跡・出展ログ（バックトレースビューア） */}
              {isExpanded ? (
                <div
                  className="question-evidence-panel"
                  style={{
                    marginTop: "10px",
                    padding: "14px",
                    background: "#f8fafc",
                    border: "1px solid #cbd5e1",
                    borderRadius: "8px",
                    fontSize: "0.8rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", borderBottom: "1px solid #e2e8f0", paddingBottom: "6px" }}>
                    <strong style={{ color: "#0f172a", fontSize: "0.82rem" }}>
                      AI観測生ログ ＆ 一次情報出展リスト（バックトレース監査）
                    </strong>
                    <span style={{ fontSize: "0.72rem", color: "#64748b" }}>
                      入力質問: 「{loss.prompt}」
                    </span>
                  </div>

                  {/* 各AIモデルごとの実測ログ */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {loss.observations.map((obs: Observation) => (
                      <div
                        key={obs.id}
                        style={{
                          background: "#ffffff",
                          border: "1px solid #e2e8f0",
                          borderRadius: "6px",
                          padding: "10px 12px",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px", flexWrap: "wrap", gap: "6px" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span
                              style={{
                                fontSize: "0.7rem",
                                fontWeight: 800,
                                background: obs.provider === "openai" ? "#10a37f" : obs.provider === "perplexity" ? "#20808d" : "#4285f4",
                                color: "#ffffff",
                                padding: "2px 6px",
                                borderRadius: "4px",
                              }}
                            >
                              {providerLabel(obs.provider)}
                            </span>
                            <code style={{ fontSize: "0.72rem", color: "#475569" }}>{obs.model}</code>
                          </div>
                          <div style={{ fontSize: "0.7rem", color: "#64748b" }}>
                            観測日時: {new Date(obs.startedAt).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })} · 応答: {obs.latencyMs}ms
                          </div>
                        </div>

                        {/* AIの生回答抜粋 */}
                        <div style={{ background: "#f1f5f9", padding: "8px 10px", borderRadius: "4px", marginBottom: "8px", fontSize: "0.78rem", color: "#1e293b", lineHeight: 1.5 }}>
                          <strong style={{ display: "block", fontSize: "0.72rem", color: "#64748b", marginBottom: "2px" }}>AIの推論回答（抜粋）:</strong>
                          {obs.rawText}
                        </div>

                        {/* AIが参照した一次情報ソース（出展URL） */}
                        {obs.citations && obs.citations.length > 0 ? (
                          <div>
                            <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#475569", display: "block", marginBottom: "4px" }}>
                              AIが推論根拠として参照・引用した一次情報出展（Web Search Sources）:
                            </span>
                            <ul style={{ margin: 0, paddingLeft: "16px", fontSize: "0.75rem" }}>
                              {obs.citations.map((cite: Citation, cIdx: number) => (
                                <li key={cIdx} style={{ marginBottom: "2px" }}>
                                  <a
                                    href={cite.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    style={{ color: "#0284c7", textDecoration: "underline", wordBreak: "break-all" }}
                                  >
                                    {cite.title || cite.domain} ({cite.domain}) ↗
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : (
                          <span style={{ fontSize: "0.72rem", color: "#94a3b8" }}>
                            ※ 本クエリではAIの事前知識ベースおよび公的学習データから推論されました。
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}
            </article>
          );
        })}
        {!filtered.length ? <p className="empty-inline">この購入段階では候補外になった質問はありません。</p> : null}
        {filtered.length > 12 ? <p className="question-list-limit">重要度の高い12問を表示しています。全件はCSVで取得できます。</p> : null}
      </div>
    </div>
  );
}
