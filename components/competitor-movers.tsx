"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useSearchParams } from "next/navigation";
import { ArrowIcon, NetworkIcon, TrophyIcon } from "@/components/icons";
import { sampleWatch } from "@/lib/sample-data";
import { compareWatchRuns } from "@/lib/watch-diff";
import type { WatchRecord } from "@/lib/types";

export function CompetitorMovers() {
  const params = useSearchParams();
  const sample = params.get("sample") === "1";
  const legacyToken = params.get("token") || "";
  const [watch, setWatch] = useState<WatchRecord | null>(sample ? sampleWatch() : null);
  const [host, setHost] = useState<HTMLElement | null>(null);

  useEffect(() => {
    const anchor = document.querySelector(".watch-v3-core");
    if (!anchor) return;
    const node = document.createElement("div");
    node.dataset.aixCompetitorMovers = "true";
    anchor.insertAdjacentElement("afterend", node);
    setHost(node);
    return () => node.remove();
  }, []);

  useEffect(() => {
    if (sample) return;
    const endpoint = legacyToken ? `/api/watch?token=${encodeURIComponent(legacyToken)}` : "/api/watch";
    fetch(endpoint, { cache: "no-store" })
      .then(async (response) => response.ok ? response.json() : null)
      .then((data) => { if (data) setWatch(data); })
      .catch(() => undefined);
  }, [sample, legacyToken]);

  const diff = useMemo(() => watch ? compareWatchRuns(watch.baseline, watch.latest) : null, [watch]);
  if (!host || !watch || !diff?.comparable) return null;

  const movers = diff.competitorDeltas.filter((item) => item.coverageDelta !== 0 || item.firstChoiceDelta !== 0 || item.newlyObserved).slice(0, 4);
  if (!movers.length) return null;

  const workspaceHref = sample ? "/workspace?sample=1&view=competitors" : "/workspace?view=competitors";
  const top = movers[0];

  return createPortal(<section className="competitor-movers-section">
    <div className="shell competitor-movers-head">
      <div><p className="eyebrow">COMPETITOR MOVEMENT</p><h2>今週、誰が買い手の候補面を取ったか。</h2><p>同じCore Panel・同じAI surface構成だけを比較しています。競合Coverageの変化は観測差であり、市場シェアそのものではありません。</p></div>
      <div className="competitor-movers-alert"><TrophyIcon /><span><small>最大上昇</small><strong>{top.name}</strong><em>{top.coverageDelta >= 0 ? "+" : ""}{top.coverageDelta}pt</em></span></div>
    </div>
    <div className="shell competitor-movers-grid">{movers.map((item) => <article key={item.name} className={item.coverageDelta > 0 ? "up" : item.coverageDelta < 0 ? "down" : "new"}>
      <header><NetworkIcon /><span>{item.newlyObserved ? "NEWLY OBSERVED" : item.coverageDelta > 0 ? "GAINING" : "DECLINING"}</span></header>
      <h3>{item.name}</h3>
      <div className="competitor-mover-numbers"><strong>{item.afterCoverage}%</strong><span>{item.coverageDelta >= 0 ? "+" : ""}{item.coverageDelta}pt</span></div>
      <p>First Choice {item.beforeFirstChoices} → {item.afterFirstChoices}{item.firstChoiceDelta ? ` (${item.firstChoiceDelta > 0 ? "+" : ""}${item.firstChoiceDelta})` : ""}</p>
    </article>)}</div>
    <div className="shell competitor-movers-foot"><Link href={workspaceHref}>競合のPrompt・Citationまで見る <ArrowIcon /></Link></div>
  </section>, host);
}
