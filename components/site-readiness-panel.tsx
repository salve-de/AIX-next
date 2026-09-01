"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CheckIcon, NetworkIcon, WarningIcon } from "@/components/icons";
import { sampleWatch } from "@/lib/sample-data";
import type { SiteReadiness, WatchRecord } from "@/lib/types";

const sampleReadiness: SiteReadiness = {
  checkedAt: "2026-09-02T00:00:00.000Z", passCount: 6, warnCount: 3, failCount: 0,
  checks: [
    { id: "robots", label: "robots.txt", status: "pass", detail: "robots.txtの公開方針を確認できました。" },
    { id: "bot-oai", label: "OAI-SearchBot root access", status: "pass", detail: "robots.txt上でルート取得を拒否されていません。実訪問を意味しません。" },
    { id: "bot-google", label: "Googlebot root access", status: "pass", detail: "robots.txt上でルート取得を拒否されていません。" },
    { id: "bot-perplexity", label: "PerplexityBot root access", status: "pass", detail: "robots.txt上でルート取得を拒否されていません。" },
    { id: "sitemap", label: "XML sitemap", status: "pass", detail: "sitemap.xmlから公開URLを確認できました。" },
    { id: "pricing", label: "料金・価格情報", status: "warn", detail: "明確な料金ページを今回の公開クロールで確認できませんでした。" },
    { id: "proof", label: "導入事例・顧客実績", status: "pass", detail: "導入事例ページを確認しました。" },
    { id: "security", label: "Security・Trust", status: "warn", detail: "専用Securityページを確認できませんでした。" },
    { id: "support", label: "FAQ・Support・Docs", status: "warn", detail: "FAQまたはDocsページを確認できませんでした。" },
  ],
};

export function SiteReadinessPanel() {
  const params = useSearchParams(); const sample = params.get("sample") === "1"; const token = params.get("token") || "";
  const [open, setOpen] = useState(false); const [watch, setWatch] = useState<WatchRecord | null>(sample ? sampleWatch() : null); const [error, setError] = useState("");
  useEffect(() => { if (!open || sample || !token) return; fetch(`/api/watch?token=${encodeURIComponent(token)}`, { cache: "no-store" }).then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error || "Crawlability監査を取得できませんでした。"); setWatch(data); }).catch((caught) => setError(caught instanceof Error ? caught.message : "取得できませんでした。")); }, [open, sample, token]);
  const readiness = sample ? sampleReadiness : watch?.latest.siteReadiness;
  return <><button className="readiness-trigger" type="button" onClick={() => setOpen(true)}><NetworkIcon />AI Crawlability<span>{readiness ? readiness.failCount ? `${readiness.failCount} fail` : `${readiness.warnCount} warn` : "—"}</span></button>{open ? <div className="readiness-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}><section className="readiness-panel"><header><div><small>PUBLIC-SITE AUDIT · NOT TRAFFIC ANALYTICS</small><h2>AI Crawlability</h2><p>AI crawlerが実際に来た回数ではなく、公開サイトがrobots・sitemap・比較材料の観点で取得可能かを監査します。</p></div><button onClick={() => setOpen(false)}>×</button></header>{readiness ? <><div className="readiness-counts"><article><strong>{readiness.passCount}</strong><span>PASS</span></article><article><strong>{readiness.warnCount}</strong><span>WARN</span></article><article><strong>{readiness.failCount}</strong><span>FAIL</span></article></div><div className="readiness-list">{readiness.checks.map((item) => <article key={item.id} className={`readiness-${item.status}`}><span>{item.status === "pass" ? <CheckIcon /> : <WarningIcon />}</span><div><strong>{item.label}</strong><p>{item.detail}</p>{item.affectedUrls?.length ? <details><summary>確認URL</summary>{item.affectedUrls.map((url) => <a href={url} target="_blank" rel="noreferrer" key={url}>{url}</a>)}</details> : null}</div><em>{item.status}</em></article>)}</div><footer>実アクセス・AI referral conversionはサーバーログ/分析基盤との接続が必要な別データです。AIXは公開クロールだけから訪問数を推測しません。</footer></> : <div className="readiness-empty"><NetworkIcon /><strong>次回ScanでCrawlability監査を作成します。</strong><p>このWatchは旧形式のScan結果を保持しているため、まだ監査結果がありません。</p></div>}{error ? <p className="readiness-error">{error}</p> : null}</section></div> : null}</>;
}
