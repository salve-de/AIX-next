"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { buildBuyerOpportunities } from "@/lib/opportunity-priority";
import { sampleWatch } from "@/lib/sample-data";
import type { WatchRecord } from "@/lib/types";

export function OpportunityQueue() {
  const params = useSearchParams();
  const sample = params.get("sample") === "1";
  const token = params.get("token") || "";
  const [watch, setWatch] = useState<WatchRecord | null>(sample ? sampleWatch() : null);

  useEffect(() => {
    if (sample || !token) return;
    fetch(`/api/watch?token=${encodeURIComponent(token)}`, { cache: "no-store" })
      .then(async (response) => response.ok ? response.json() : null)
      .then((data) => { if (data) setWatch(data as WatchRecord); })
      .catch(() => undefined);
  }, [sample, token]);

  const opportunities = useMemo(() => watch ? buildBuyerOpportunities(watch.latest).slice(0, 5) : [], [watch]);
  if (!watch || !opportunities.length) return null;
  const workspaceHref = sample ? "/workspace?sample=1&view=prompts" : `/workspace?token=${encodeURIComponent(token)}&view=prompts`;

  return <section className="opportunity-queue">
    <div className="opportunity-head"><div><p>BUYER OPPORTUNITY QUEUE</p><h2>今、どの購買質問から直すか。</h2><span>検索量の推定ではありません。重要度・実測の候補外率・勝者の一致・比較材料不足から、説明可能な順番を付けています。</span></div><Link href={workspaceHref}>全Buyer Promptを見る →</Link></div>
    <div className="opportunity-list">{opportunities.map((item, index) => <article key={item.promptId} className={`band-${item.band}`}>
      <div className="opportunity-rank"><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.priority}</strong><small>priority</small></div>
      <div className="opportunity-copy"><div><span className="opportunity-band">{item.band}</span><small>候補外 {item.lostRate}%</small></div><h3>「{item.prompt}」</h3><p>{item.why.join(" · ") || "継続観測"}</p></div>
      <aside><small>最頻第一候補</small><strong>{item.winner || "—"}</strong><span>関連比較材料 {item.relatedEvidence}</span></aside>
    </article>)}</div>
    <footer>PriorityはAIX内の観測値だけで算出します。実ユーザーPrompt Volumeや売上規模を推定した値ではありません。</footer>
  </section>;
}
