"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { isUrlInput } from "@/lib/input-kind";
import type { InputResolutionCandidate } from "@/lib/input-resolution";
import type { ScanProgressEvent, ScanStage } from "@/lib/types";

const steps: Array<{ stage: ScanStage; label: string }> = [
  { stage: "validating", label: "診断先を確認" },
  { stage: "crawling", label: "公開ページを読む" },
  { stage: "discovering", label: "市場と競合を整理" },
  { stage: "prompting", label: "購入前の質問を作る" },
  { stage: "measuring", label: "AI回答を確認" },
  { stage: "analyzing", label: "結果と優先順位をまとめる" },
];

type ResolutionPayload = {
  candidates?: InputResolutionCandidate[];
  error?: string;
};

function normalize(value: string | null) {
  const raw = value?.trim() || "";
  if (!raw) return "";
  return /^https?:\/\//i.test(raw) || /^[a-z][a-z\d+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;
}

function hostOf(value: string) {
  try { return new URL(value).hostname.replace(/^www\./, ""); } catch { return value; }
}

function displayInput(value: string) {
  return value.length > 72 ? `${value.slice(0, 72)}…` : value;
}

export function ScanProgress() {
  const router = useRouter();
  const params = useSearchParams();
  const rawInput = useMemo(() => (params.get("input") || params.get("url") || "").trim(), [params]);
  const directUrl = useMemo(() => isUrlInput(rawInput) ? normalize(rawInput) : "", [rawInput]);
  const controller = useRef<AbortController | null>(null);
  const startedScan = useRef("");
  const resolvedInput = useRef("");
  const [phase, setPhase] = useState<"resolving" | "choose" | "scanning" | "failed">("resolving");
  const [candidates, setCandidates] = useState<InputResolutionCandidate[]>([]);
  const [selectedUrl, setSelectedUrl] = useState("");
  const [stage, setStage] = useState<ScanStage>("created");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("診断を準備しています。");
  const [detail, setDetail] = useState("診断先を確認しています");
  const [error, setError] = useState("");

  const startScan = useCallback(async (inputUrl: string) => {
    const targetUrl = normalize(inputUrl);
    if (!targetUrl) {
      setPhase("failed");
      setError("診断する公開サイトがありません。");
      return;
    }
    startedScan.current = targetUrl;
    controller.current?.abort();
    const abort = new AbortController();
    controller.current = abort;
    setPhase("scanning");
    setError("");
    setStage("created");
    setProgress(0);
    setMessage("診断を準備しています。");
    setDetail("診断先を確認しています");
    try {
      const response = await fetch("/api/scan", { method: "POST", headers: { "content-type": "application/json", accept: "application/x-ndjson" }, body: JSON.stringify({ url: targetUrl }), signal: abort.signal });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `診断を開始できませんでした (${response.status})`);
      }
      if (!response.body) throw new Error("診断の進行状況を取得できませんでした。");
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
          if (event.type === "progress") {
            if (event.stage) setStage(event.stage);
            if (typeof event.progress === "number") setProgress(event.progress);
            if (event.message) setMessage(event.message);
            if (event.detail) setDetail(event.detail);
          }
          if (event.type === "complete" && event.scanId) {
            setProgress(100); setStage("complete"); setMessage("結果をまとめました。");
            router.replace(`/result?id=${encodeURIComponent(event.scanId)}`);
            return;
          }
          if (event.type === "error") throw new Error(event.error || "診断に失敗しました。");
        }
      }
    } catch (caught) {
      if (abort.signal.aborted) return;
      setPhase("failed");
      setStage("failed");
      setError(caught instanceof Error ? caught.message : "診断に失敗しました。");
    }
  }, [router]);

  useEffect(() => {
    controller.current?.abort();
    if (!rawInput) {
      setPhase("failed");
      setError("会社名・商品名・サービス名・URLがありません。");
      return () => undefined;
    }
    if (isUrlInput(rawInput)) {
      if (startedScan.current !== directUrl) void startScan(directUrl);
      return () => controller.current?.abort();
    }
    if (resolvedInput.current === rawInput && candidates.length) return () => controller.current?.abort();
    resolvedInput.current = rawInput;
    const abort = new AbortController();
    controller.current = abort;
    setPhase("resolving");
    setCandidates([]);
    setSelectedUrl("");
    setError("");
    setMessage("公開サイトを探しています。");
    setDetail("入力名に対応する候補を検索しています");
    async function resolve() {
      try {
        const response = await fetch("/api/resolve", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ input: rawInput }), signal: abort.signal });
        const data = await response.json().catch(() => ({})) as ResolutionPayload;
        if (!response.ok) throw new Error(data.error || `公開サイトを探せませんでした (${response.status})`);
        const nextCandidates = Array.isArray(data.candidates) ? data.candidates.filter((candidate) => candidate?.url) : [];
        if (!nextCandidates.length) throw new Error("入力に一致する公開サイトを見つけられませんでした。正式名称か公式サイトのURLを入力してください。");
        setCandidates(nextCandidates);
        setSelectedUrl(nextCandidates[0].url);
        setPhase("choose");
        setMessage("診断先を確認してください。");
        setDetail(`${nextCandidates.length}件の公開サイト候補`);
      } catch (caught) {
        if (abort.signal.aborted) return;
        setPhase("failed");
        setError(caught instanceof Error ? caught.message : "公開サイトを探せませんでした。");
      }
    }
    void resolve();
    return () => abort.abort();
  }, [candidates.length, directUrl, rawInput, startScan]);

  const targetHost = hostOf(selectedUrl || directUrl);
  const isDirectTarget = isUrlInput(rawInput);
  const activeIndex = steps.findIndex((item) => item.stage === stage);
  const completedCount = stage === "complete" ? steps.length : Math.max(0, activeIndex);

  if (phase !== "scanning") {
    return <main className="scan-page">
      <SiteHeader compact />
      <section className="scan-stage shell scan-resolve-stage">
        <div className="scan-stage-main scan-resolve-main">
          <p className="overline">{phase === "resolving" ? "診断先を検索中" : "診断先を確認"}</p>
          <h1>{phase === "resolving" ? `「${displayInput(rawInput)}」の公開サイトを探しています。` : `「${displayInput(rawInput)}」の診断先を選んでください。`}</h1>
          <p className="scan-message">{phase === "resolving" ? "会社名・商品名から、診断できる公開サイトを調べています。" : "候補のドメインを確認して、診断するサイトを選びます。"}</p>
          {phase === "resolving" ? <div className="scan-resolve-loading" role="status"><span className="scan-resolve-spinner" aria-hidden="true" />公開情報を検索しています…</div> : null}
          {phase === "choose" ? <>
            <fieldset className="scan-resolve-options">
              <legend>診断する公開サイト</legend>
              {candidates.map((candidate) => {
                const host = hostOf(candidate.url);
                return <label className={`scan-resolve-option ${selectedUrl === candidate.url ? "selected" : ""}`} key={candidate.url}>
                  <input type="radio" name="scan-candidate" value={candidate.url} checked={selectedUrl === candidate.url} onChange={() => setSelectedUrl(candidate.url)} />
                  <span className="scan-resolve-option-copy"><strong>{candidate.title}</strong><small>{host}</small><span>{candidate.reason}</span></span>
                </label>;
              })}
            </fieldset>
            <button className="button button-primary scan-resolve-start" type="button" disabled={!selectedUrl} onClick={() => void startScan(selectedUrl)}>このサイトを診断する <span aria-hidden="true">→</span></button>
            <p className="scan-resolve-note">候補は公開検索から見つけたサイトです。ドメインを確認してから診断を開始します。</p>
          </> : null}
          {phase === "failed" ? <div className="scan-error" role="alert"><strong>{isDirectTarget ? "診断を開始できませんでした。" : "公開サイトを見つけられませんでした。"}</strong><p>{error}</p><button className="button button-secondary" type="button" onClick={() => router.push("/")}>入力をやり直す</button></div> : null}
        </div>
        <aside className="scan-stage-list scan-resolve-aside"><div className="scan-stage-list-head"><strong>入力できるもの</strong><span>URL / 名前</span></div><ul className="scan-input-types"><li><strong>会社名</strong><span>例：株式会社○○</span></li><li><strong>サービス名・商品名</strong><span>例：Notion、○○クラウド</span></li><li><strong>公開サイトのURL</strong><span>例：https://yourcompany.jp</span></li></ul><p className="scan-stage-note">名前で探した場合も、公開サイトを選んでから診断します。</p></aside>
      </section>
    </main>;
  }

  return <main className="scan-page">
    <SiteHeader compact />
    <section className="scan-stage shell">
      <div className="scan-stage-main">
        <p className="overline">診断中</p>
        <h1>{targetHost || "会社サイト"}を確認しています。</h1>
        <p className="scan-message">{message}</p>
        <div className="scan-progress-track" aria-label={`進捗 ${Math.round(progress)}%`}><span style={{ width: `${progress}%` }} /></div>
        <div className="scan-progress-summary"><strong>{Math.round(progress)}%</strong><span>{detail}</span></div>
        {!error ? <button className="scan-cancel" type="button" onClick={() => { controller.current?.abort(); router.push("/"); }}>診断をやめる</button> : null}
        {error ? <div className="scan-error" role="alert"><strong>診断を完了できませんでした。</strong><p>{error}</p><button className="button button-secondary" type="button" onClick={() => window.location.reload()}>もう一度試す</button></div> : null}
      </div>
      <div className="scan-stage-list" aria-label="診断の進み具合"><div className="scan-stage-list-head"><strong>今回確認すること</strong><span>{completedCount} / {steps.length}</span></div><ol>{steps.map((item, index) => {
        const state = stage === "failed" ? (index < activeIndex ? "done" : index === activeIndex ? "failed" : "pending") : index < activeIndex || stage === "complete" ? "done" : index === activeIndex ? "active" : "pending";
        return <li className={state} key={item.stage}><span>{state === "done" ? "✓" : state === "failed" ? "!" : index + 1}</span><strong>{item.label}</strong>{state === "active" ? <em>確認中</em> : state === "done" ? <em>完了</em> : null}</li>;
      })}</ol><p className="scan-stage-note">サイトの内容とAIの回答を順番に照合しています。完了すると結果ページへ移動します。</p></div>
    </section>
  </main>;
}
