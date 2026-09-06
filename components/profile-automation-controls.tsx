"use client";

import { useEffect, useState } from "react";
import type { PublicProfileFact } from "@/lib/types";

type Automation = { enabled: boolean; lastUpdatedAt: string | null; canRollback: boolean; changedFactCount: number; previousFacts: PublicProfileFact[]; currentFacts: PublicProfileFact[] };

export function ProfileAutomationControls({ scanId, watchToken, sample = false }: { scanId: string; watchToken: string; sample?: boolean }) {
  const [management, setManagement] = useState<{ id: string; token: string } | null>(null);
  const [state, setState] = useState<Automation | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (sample) return;
    const controller = new AbortController();
    try {
      const saved = JSON.parse(sessionStorage.getItem(`rovan:profile:${scanId}`) || "null");
      if (typeof saved?.id !== "string" || typeof saved?.token !== "string") return;
      setManagement(saved);
      void fetch(`/api/ai-profile?profileId=${encodeURIComponent(saved.id)}&token=${encodeURIComponent(saved.token)}`, { cache: "no-store", signal: controller.signal })
        .then(async (response) => {
          if (!response.ok) throw new Error("公開ページの管理状態を取得できませんでした。");
          const payload = await response.json();
          setState(payload.automation);
        }).catch((caught) => { if (!controller.signal.aborted) setError(caught.message); });
    } catch { setError("このタブに公開ページの管理情報がありません。"); }
    return () => controller.abort();
  }, [scanId, sample]);

  async function operate(action: "enable" | "disable" | "rollback") {
    if (!management || sample) return;
    setBusy(true); setError("");
    try {
      const response = await fetch("/api/ai-profile", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ action: `automation_${action}`, profileId: management.id, token: management.token, watchToken }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error || "保存できませんでした。");
      setState(payload.automation);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "保存できませんでした。"); }
    finally { setBusy(false); }
  }

  return <section className="watch-section shell" aria-label="公開情報の自動更新">
    <h2>公開情報の補強を、Rovanに任せる。</h2>
    <p>一度許可すれば、有効な有料Watchの週次処理で、同じサイトの料金・対応地域・専門分野などの短い原文を出典付きで追加・更新します。会社紹介文や顧客サイトは書き換えません。公開ページの有効期限内で動作します。</p>
    {sample ? <p>設計見本です。自動更新や公開操作は行いません。</p> : !management ? <p>診断結果からこのタブで公開ページを作成・公開すると設定できます。管理情報がない場合はサポートへお問い合わせください。</p> : <>
      <p role="status">自動更新：{state ? state.enabled ? "許可済み" : "停止中" : "確認中"}{state?.lastUpdatedAt ? `／直近の反映：${new Date(state.lastUpdatedAt).toLocaleString("ja-JP", { timeZone: "Asia/Tokyo" })}（${state.changedFactCount}件の差分）` : ""}</p>
      <button type="button" className="button button-primary" disabled={busy || !state} onClick={() => void operate(state?.enabled ? "disable" : "enable")}>{state?.enabled ? "自動更新を停止する" : "参照元の記載の自動更新を許可する"}</button>
      {state?.canRollback ? <button type="button" className="button button-secondary" disabled={busy} onClick={() => void operate("rollback")}>直前の更新を取り消し、自動更新を停止する</button> : null}
      {state?.canRollback ? <details><summary>直前の更新内容を見る</summary><h3>更新前</h3><ul>{state.previousFacts.map((fact, index) => <li key={index}>{fact.label}：{fact.value} <a href={fact.sourceUrl} target="_blank" rel="noreferrer">出典</a></li>)}</ul><h3>更新後</h3><ul>{state.currentFacts.map((fact, index) => <li key={index}>{fact.label}：{fact.value} <a href={fact.sourceUrl} target="_blank" rel="noreferrer">出典</a></li>)}</ul></details> : null}
    </>}
    {error ? <p role="alert" className="form-error">{error}</p> : null}
  </section>;
}
