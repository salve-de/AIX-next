"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Icon, Logo } from "@/components/ui";
import { ScanRadar } from "@/components/visuals";
import type { ProgressEvent, ScanStage } from "@/lib/types";

const steps: Array<[ScanStage,string]> = [
  ["validating","公開URLを検証"],
  ["crawling","会社サイトを読む"],
  ["discovering","市場と競合を作る"],
  ["prompting","購買質問を作る"],
  ["measuring","3つのAIを測る"],
  ["analyzing","根拠と不足を比べる"],
];

export function ScanClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const target = searchParams.get("url") || "";
  const [stage,setStage] = useState<ScanStage>("queued");
  const [progress,setProgress] = useState(0);
  const [message,setMessage] = useState("診断を準備しています");
  const [detail,setDetail] = useState("");
  const [error,setError] = useState("");
  const abort = useRef<AbortController | null>(null);
  const domain = useMemo(() => { try { return new URL(/^https?:\/\//i.test(target)?target:`https://${target}`).hostname; } catch { return target; } },[target]);

  useEffect(() => {
    if (!target) { setError("URLがありません。トップページから入力してください。"); return; }
    const controller = new AbortController(); abort.current = controller;
    async function run() {
      try {
        const response = await fetch("/api/scans/stream", { method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify({url:target}), signal:controller.signal });
        if (!response.ok || !response.body) {
          const data = await response.json().catch(()=>({}));
          throw new Error(data.error || `診断を開始できませんでした (${response.status})`);
        }
        const reader=response.body.getReader(); const decoder=new TextDecoder(); let buffer="";
        while(true){
          const {done,value}=await reader.read(); if(done) break;
          buffer+=decoder.decode(value,{stream:true}); const lines=buffer.split("\n"); buffer=lines.pop()||"";
          for(const line of lines){
            if(!line.trim()) continue;
            const event=JSON.parse(line) as {type:string;scanId?:string;error?:string}&Partial<ProgressEvent>;
            if(event.type==="progress"){
              if(event.stage) setStage(event.stage); if(typeof event.progress==="number") setProgress(event.progress); if(event.message) setMessage(event.message); setDetail(event.detail||"");
            }
            if(event.type==="complete"&&event.scanId){ router.replace(`/report/${encodeURIComponent(event.scanId)}`); return; }
            if(event.type==="error") throw new Error(event.error||"診断に失敗しました。");
          }
        }
      } catch(caught){
        if(controller.signal.aborted) return;
        setStage("failed"); setError(caught instanceof Error?caught.message:"診断に失敗しました。");
      }
    }
    run(); return()=>controller.abort();
  },[target,router]);

  const currentIndex=steps.findIndex(([value])=>value===stage);
  return <main className="scan-page">
    <header className="scan-page-header"><div className="container"><Logo /></div></header>
    <div className="container scan-layout">
      <section className="scan-copy">
        <p className="kicker light"><span/>BUILDING YOUR AI MARKET</p>
        <h1>{domain || "御社"}の<br/>比較市場を作っています。</h1>
        <p>{message}</p>
        <div className="scan-progress-bar" aria-label={`診断進捗 ${progress}%`}><span style={{width:`${progress}%`}}/></div>
        <div className="scan-progress-meta"><strong>{progress}%</strong><span>{detail || "公開Webだけを使用"}</span></div>
        <ol className="scan-steps">{steps.map(([value,label],index)=>{const state=index<currentIndex?"done":index===currentIndex?"active":"";return <li className={state} key={value}><span>{state==="done"?<Icon name="check" size={15}/>:String(index+1).padStart(2,"0")}</span><div><strong>{label}</strong><small>{state==="active"?message:state==="done"?"完了":"待機中"}</small></div></li>})}</ol>
        {error?<div className="scan-error"><strong>診断を完了できませんでした。</strong><p>{error}</p><button className="button button-light" onClick={()=>window.location.reload()}>再試行</button></div>:<button className="demo-link" type="button" onClick={()=>abort.current?.abort()}>診断を停止</button>}
      </section>
      <ScanRadar progress={progress} detail={detail}/>
    </div>
  </main>;
}
