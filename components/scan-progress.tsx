"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Brand } from "@/components/brand";
import type { ScanProgressEvent, ScanStage } from "@/lib/types";

const stageOrder: ScanStage[] = ["created", "validating", "crawling", "discovering", "prompting", "measuring", "analyzing", "complete"];
const steps = [
  { label: "会社サイトを確認", from: "validating" as ScanStage, through: "crawling" as ScanStage, detail: "製品・料金・導入事例などの公開情報を確認" },
  { label: "比較対象と質問を整理", from: "discovering" as ScanStage, through: "prompting" as ScanStage, detail: "市場・競合と、買い手が比較時に聞く質問を整理" },
  { label: "AIの回答を確認", from: "measuring" as ScanStage, through: "measuring" as ScanStage, detail: "ChatGPT・Gemini・Perplexityで候補入りを確認" },
  { label: "改善点をまとめる", from: "analyzing" as ScanStage, through: "complete" as ScanStage, detail: "競合との差と、まず直すべき1件を整理" },
];

function normalize(value: string | null) {
  const raw = value?.trim() || "";
  if (!raw) return "";
  return /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
}

function stepState(stage: ScanStage, from: ScanStage, through: ScanStage) {
  if (stage === "failed") return "pending";
  const current = stageOrder.indexOf(stage);
  const start = stageOrder.indexOf(from);
  const end = stageOrder.indexOf(through);
  if (current > end || stage === "complete") return "done";
  if (current >= start && current <= end) return "active";
  return "pending";
}

function retryText(seconds: number) {
  if (!seconds) return "時間を空けて再度お試しください。";
  if (seconds < 60) return `約${seconds}秒後に再試行できます。`;
  return `約${Math.ceil(seconds / 60)}分後に再試行できます。`;
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
  const [scanId, setScanId] = useState("");
  const [error, setError] = useState("");
  const [errorCode, setErrorCode] = useState("");
  const [retryAfter, setRetryAfter] = useState(0);

  useEffect(() => {
    if (!targetUrl) { setError("会社サイトのURLがありません。"); setErrorCode("invalid_url"); return; }
    const abort = new AbortController();
    controller.current = abort;
    async function run() {
      try {
        const response = await fetch("/api/scan", { method: "POST", headers: { "content-type": "application/json", accept: "application/x-ndjson" }, body: JSON.stringify({ url: targetUrl }), signal: abort.signal });
        if (!response.ok) {
          const data = await response.json().catch(() => ({})) as { error?: string; code?: string; retryAfter?: number };
          setErrorCode(data.code || "request_failed");
          setRetryAfter(Number(data.retryAfter || response.headers.get("retry-after") || 0));
          throw new Error(data.error || `診断を開始できませんでした (${response.status})`);
        }
        if (!response.body) throw new Error("診断を開始できませんでした。");
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
            }
            if (event.type === "complete" && event.scanId) {
              setProgress(100); setStage("complete");
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

  if (error) return <main className="ux2-scan-page">
    <header className="ux2-scan-header shell"><Brand /><span>無料診断</span></header>
    <section className="ux2-scan-error">
      <div className="ux2-scan-error-card">
        <p className="ux2-label">診断を開始できませんでした</p>
        <h1>{errorCode === "rate_limited" ? "無料診断の利用上限に達しています。" : "診断を完了できませんでした。"}</h1>
        <p>{errorCode === "rate_limited" ? retryText(retryAfter) : error}</p>
        <div className="ux2-scan-error-actions"><button className="button button-dark" type="button" onClick={() => window.location.reload()}>再試行</button><Link className="button" href="/result?sample=1">サンプル結果を見る</Link><Link className="ux2-link" href="/">URL入力へ戻る</Link></div>
      </div>
    </section>
  </main>;

  return <main className="ux2-scan-page">
    <header className="ux2-scan-header shell"><Brand /><span>無料診断</span></header>
    <section className="ux2-scan-wrap">
      <p className="ux2-scan-domain">{host || "会社サイト"}</p>
      <h1>AIでの比較状況を診断しています。</h1>
      <p className="ux2-scan-lead">{message}</p>
      <div className="ux2-progress" aria-label={`診断進捗 ${Math.round(progress)}%`}><span style={{ width: `${progress}%` }} /></div>
      <div className="ux2-progress-meta"><strong>{Math.round(progress)}%</strong><span>{scanId ? `診断ID ${scanId.slice(-8)}` : "公開情報を確認中"}</span></div>
      <ol className="ux2-scan-steps">{steps.map((item, index) => {
        const state = stepState(stage, item.from, item.through);
        return <li className={state} key={item.label}><span>{state === "done" ? "✓" : index + 1}</span><strong>{item.label}</strong><small>{item.detail}</small></li>;
      })}</ol>
      <div className="ux2-scan-actions"><button className="quiet-button" type="button" onClick={() => { controller.current?.abort(); router.push("/"); }}>診断を中止</button></div>
    </section>
  </main>;
}
