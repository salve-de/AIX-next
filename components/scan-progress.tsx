"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Brand } from "@/components/brand";
import { BotIcon, BuildingIcon, EvidenceIcon, NetworkIcon, SearchIcon, SparkIcon } from "@/components/icons";
import type { ScanProgressEvent, ScanStage } from "@/lib/types";

const steps: Array<{ stage: ScanStage; label: string }> = [
  { stage: "validating", label: "公開URLを検証" },
  { stage: "crawling", label: "製品・料金・導入事例を読む" },
  { stage: "discovering", label: "会社・市場・競合を特定" },
  { stage: "prompting", label: "Buyer Promptを構成" },
  { stage: "measuring", label: "3つのAIで候補を観測" },
  { stage: "analyzing", label: "CitationとEvidence差を解析" },
];

function normalize(value: string | null) {
  const raw = value?.trim() || "";
  if (!raw) return "";
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

export function ScanProgress() {
  const router = useRouter();
  const params = useSearchParams();
  const targetUrl = useMemo(() => normalize(params.get("url")), [params]);
  const host = useMemo(() => { try { return new URL(targetUrl).hostname.replace(/^www\./, ""); } catch { return targetUrl; } }, [targetUrl]);
  const controller = useRef<AbortController | null>(null);
  const [stage, setStage] = useState<ScanStage>("created");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("診断を準備しています。");
  const [detail, setDetail] = useState("URLを受け取りました");
  const [scanId, setScanId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!targetUrl) { setError("会社サイトのURLがありません。"); return; }
    const abort = new AbortController();
    controller.current = abort;
    async function run() {
      try {
        const response = await fetch("/api/scan", { method: "POST", headers: { "content-type": "application/json", accept: "application/x-ndjson" }, body: JSON.stringify({ url: targetUrl }), signal: abort.signal });
        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || `診断を開始できませんでした (${response.status})`);
        }
        if (!response.body) throw new Error("進捗ストリームを開始できませんでした。");
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let buffer = "";
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";
          for (const line of lines) {
            if (!line.trim()) continue;
            const event = JSON.parse(line) as ({ type: "accepted" | "progress" | "complete" | "error"; scanId?: string; error?: string } & Partial<ScanProgressEvent>);
            if (event.scanId) setScanId(event.scanId);
            if (event.type === "progress") {
              if (event.stage) setStage(event.stage);
              if (typeof event.progress === "number") setProgress(event.progress);
              if (event.message) setMessage(event.message);
              if (event.detail) setDetail(event.detail);
            }
            if (event.type === "complete" && event.scanId) {
              setProgress(100); setStage("complete"); setMessage("診断結果を作成しました。");
              router.replace(`/result?id=${encodeURIComponent(event.scanId)}`);
              return;
            }
            if (event.type === "error") throw new Error(event.error || "診断に失敗しました。");
          }
        }
      } catch (caught) {
        if (abort.signal.aborted) return;
        setStage("failed");
        setError(caught instanceof Error ? caught.message : "診断に失敗しました。");
      }
    }
    run();
    return () => abort.abort();
  }, [targetUrl, router]);

  const activeIndex = steps.findIndex((item) => item.stage === stage);
  return <main className="scan-page">
    <header className="scan-header shell"><Brand /><span>FREE AI BUYER SCAN</span></header>
    <section className="scan-layout shell">
      <div className="scan-copy">
        <p className="eyebrow">ANALYZING {host.toUpperCase()}</p>
        <h1>{host}の<br />AI比較市場を作成中。</h1>
        <p className="scan-message">{message}</p>
        <div className="scan-progress-bar"><span style={{ width: `${progress}%` }} /></div>
        <div className="scan-progress-meta"><strong>{Math.round(progress)}%</strong><span>{scanId ? `Scan ${scanId.slice(-8)}` : "公開Webだけを取得"}</span></div>
        <ol className="scan-steps">{steps.map((item, index) => {
          const state = index < activeIndex || stage === "complete" ? "done" : index === activeIndex ? "active" : "pending";
          return <li className={state} key={item.stage}><span>{state === "done" ? "✓" : String(index + 1).padStart(2, "0")}</span><strong>{item.label}</strong></li>;
        })}</ol>
        {!error ? <button className="quiet-button" type="button" onClick={() => { controller.current?.abort(); router.push("/"); }}>診断を停止</button> : null}
        {error ? <div className="scan-error" role="alert"><strong>診断を完了できませんでした。</strong><p>{error}</p><button className="button button-light" type="button" onClick={() => window.location.reload()}>再試行する</button></div> : null}
      </div>
      <div className="scan-radar" aria-label="現在発見している市場要素">
        <svg viewBox="0 0 640 640" aria-hidden="true"><circle cx="320" cy="320" r="250" /><circle cx="320" cy="320" r="170" /><circle cx="320" cy="320" r="90" /><path d="M320 45V595M45 320H595M125 125l390 390M515 125 125 515" /><path className="radar-sweep" d="M320 320 320 65A255 255 0 0 1 535 182Z" /></svg>
        <div className="radar-core"><SparkIcon /><strong>AIX</strong><small>{progress}%</small></div>
        <div className={`radar-node node-company ${progress >= 20 ? "found" : ""}`}><BuildingIcon /><span>会社</span></div>
        <div className={`radar-node node-market ${progress >= 35 ? "found" : ""}`}><NetworkIcon /><span>市場</span></div>
        <div className={`radar-node node-competitor ${progress >= 45 ? "found" : ""}`}><SearchIcon /><span>競合</span></div>
        <div className={`radar-node node-ai ${progress >= 55 ? "found" : ""}`}><BotIcon /><span>AI回答</span></div>
        <div className={`radar-node node-evidence ${progress >= 84 ? "found" : ""}`}><EvidenceIcon /><span>Evidence</span></div>
        <div className="radar-detail"><small>LIVE FINDING</small><strong>{detail}</strong></div>
      </div>
    </section>
  </main>;
}
