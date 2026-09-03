"use client";

import { useMemo, useState } from "react";
import type { LostPrompt, ScanResult } from "@/lib/types";

type Stage = "すべて" | "認知" | "比較" | "検討" | "導入";

function stageFor(result: ScanResult, loss: LostPrompt) {
  const prompt = result.prompts?.find((item) => item.id === loss.promptId);
  if (prompt?.stage) return prompt.stage;
  if (prompt?.cluster === "comparison" || prompt?.cluster === "alternative" || prompt?.cluster === "value") return "比較";
  if (prompt?.cluster === "implementation" || prompt?.cluster === "support") return "導入";
  if (prompt?.cluster === "trust" || prompt?.cluster === "feature") return "検討";
  // Older saved scans and the demo panel may not have a derived stage yet.
  // Use the buyer's wording as a conservative display fallback so the demo
  // does not imply that every lost question is only an awareness question.
  const text = `${prompt?.text || loss.prompt}`;
  if (/比較|違い|乗り換え|選んで|主要|代替/.test(text)) return "比較";
  if (/料金|費用|効果|実績|信頼|おすすめ/.test(text)) return "検討";
  if (/導入|期間|対応|サポート|始め|使い/.test(text)) return "導入";
  return "認知";
}

function stageLabel(stage: string) {
  return stage === "認知" ? "候補を探す質問" : stage === "比較" ? "比較の質問" : stage === "導入" ? "導入の質問" : "検討の質問";
}

export function QuestionList({ result }: { result: ScanResult }) {
  const [stage, setStage] = useState<Stage>("すべて");
  const filtered = useMemo(() => result.lostPrompts.filter((loss) => stage === "すべて" || stageFor(result, loss) === stage), [result, stage]);
  const counts = useMemo(() => ( ["認知", "比較", "検討", "導入"] as const).map((item) => ({ stage: item, count: result.lostPrompts.filter((loss) => stageFor(result, loss) === item).length })), [result]);

  return <div className="question-list-wrap">
    <div className="question-list-toolbar" aria-label="質問を絞り込む">
      <label htmlFor="question-stage">購入段階</label>
      <select id="question-stage" value={stage} onChange={(event) => setStage(event.target.value as Stage)}>
        <option value="すべて">すべて（{result.lostPrompts.length}問）</option>
        {counts.map((item) => <option value={item.stage} key={item.stage}>{item.stage}（{item.count}問）</option>)}
      </select>
      <span>{filtered.length}問を表示</span>
    </div>
    <div className="question-list">
      {filtered.slice(0, 12).map((loss, index) => {
        const stageName = stageFor(result, loss);
        return <article key={loss.promptId}>
          <div className="question-number">{String(index + 1).padStart(2, "0")}</div>
          <div className="question-main"><small className="question-context">{stageLabel(stageName)}</small><h3>「{loss.prompt}」</h3><p>{loss.summary}</p></div>
          <div className="question-outcome"><span>先に選ばれた競合<strong>{loss.winner || "特定できず"}</strong></span><span>自社<strong className="lost-text">候補外</strong></span></div>
        </article>;
      })}
      {!filtered.length ? <p className="empty-inline">この購入段階では候補外になった質問はありません。</p> : null}
      {filtered.length > 12 ? <p className="question-list-limit">重要度の高い12問を表示しています。全件はCSVで取得できます。</p> : null}
    </div>
  </div>;
}
