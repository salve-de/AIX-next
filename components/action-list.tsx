import type { ActionCard } from "@/lib/types";

function priorityLabel(priority: ActionCard["priority"]) {
  return priority === "critical" ? "最優先" : priority === "high" ? "優先" : "候補";
}

export function ActionList({ actions }: { actions: ActionCard[] }) {
  if (actions.length < 2) return null;
  return <section className="report-section report-action-list" aria-label="次に確認する改善候補">
    <div className="shell">
      <div className="section-heading-simple">
        <p className="overline">次に確認する改善候補</p>
        <h2>最初の一手のあとに、<br />確認する順番。</h2>
        <p>候補外の質問、公開情報の差、作業量をもとに並べています。売上の予測ではありません。</p>
      </div>
      <div className="action-list-compact">
        {actions.slice(1, 6).map((action, index) => <article key={action.id}>
          <span className={`action-priority action-priority-${action.priority}`}>{priorityLabel(action.priority)}</span>
          <div><small>0{index + 2} · {action.target}</small><h3>{action.title}</h3><p>{action.rationale}</p></div>
          <strong>{action.relatedPromptCount}<small>問に関係</small></strong>
        </article>)}
      </div>
    </div>
  </section>;
}
