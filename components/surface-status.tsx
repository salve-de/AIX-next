"use client";

import { useMemo, useState } from "react";
import { PROVIDER_LABELS, PROVIDER_ORDER, PROVIDER_SURFACE_NOTES } from "@/lib/provider-meta";
import type { ProviderName, WatchRecord } from "@/lib/types";

export function SurfaceStatus({ watch }: { watch: WatchRecord }) {
  const [open, setOpen] = useState(false);
  const rows = useMemo(() => PROVIDER_ORDER.map((provider) => {
    const observations = watch.latest.observations.filter((item) => item.provider === provider);
    const success = observations.filter((item) => item.status === "success");
    const scheduled = observations.length;
    const recommended = success.filter((item) => item.ownRecommended).length;
    const ownCitations = success.filter((item) => item.citations.some((citation) => citation.domain === watch.latest.discovery.domain)).length;
    const expected = watch.paid || (["openai", "gemini", "perplexity"] as ProviderName[]).includes(provider);
    const state = !expected ? "upgrade" : !scheduled ? "missing" : success.length === scheduled ? "ready" : success.length ? "partial" : "down";
    return { provider, scheduled, success: success.length, recommended, ownCitations, state };
  }), [watch]);
  const expected = rows.filter((row) => row.state !== "upgrade");
  const healthy = expected.filter((row) => row.state === "ready").length;

  return <div className={`surface-status ${open ? "open" : ""}`}>
    <button className="surface-status-trigger" type="button" onClick={() => setOpen((value) => !value)} aria-expanded={open}>
      <span className="surface-dots">{rows.map((row) => <i key={row.provider} className={`surface-dot ${row.state}`} />)}</span>
      <strong>{healthy}/{expected.length} AI surfaces</strong>
      <small>{watch.paid ? "Founder Watch" : "Trial"}</small>
    </button>
    {open ? <section className="surface-popover">
      <header><div><small>MEASUREMENT SURFACES</small><strong>何を測っているか</strong></div><button type="button" onClick={() => setOpen(false)}>Close</button></header>
      <p>各surfaceの観測方法と成功状態を表示します。</p>
      <div className="surface-list">{rows.map((row) => <article key={row.provider}>
        <div><i className={`surface-dot ${row.state}`} /><strong>{PROVIDER_LABELS[row.provider]}</strong><span>{row.state === "upgrade" ? "Founderで追加" : row.state === "ready" ? "測定成功" : row.state === "partial" ? "一部失敗" : row.state === "missing" ? "未測定" : "測定失敗"}</span></div>
        <small>{PROVIDER_SURFACE_NOTES[row.provider]}</small>
        {row.state !== "upgrade" ? <dl><div><dt>成功</dt><dd>{row.success}/{row.scheduled}</dd></div><div><dt>候補入り</dt><dd>{row.recommended}</dd></div><div><dt>自社Citation</dt><dd>{row.ownCitations}</dd></div></dl> : null}
      </article>)}</div>
      <footer>失敗・未設定surfaceはRecommendationの負けとして数えず、Measurement Completenessへ反映します。</footer>
    </section> : null}
  </div>;
}
