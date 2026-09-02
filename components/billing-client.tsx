"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowIcon } from "@/components/icons";
import type { WatchRecord } from "@/lib/types";

export function BillingClient() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [watch, setWatch] = useState<WatchRecord | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/watch?token=${encodeURIComponent(token)}`, { cache: "no-store" })
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error || "契約情報を取得できませんでした。"); setWatch(data); })
      .catch((error) => setMessage(error instanceof Error ? error.message : "契約情報を取得できませんでした。"));
  }, [token]);

  async function openPortal() {
    if (!token) return;
    setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/billing/portal", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "契約管理を開始できませんでした。");
      window.location.assign(data.url);
    } catch (error) { setMessage(error instanceof Error ? error.message : "契約管理を開始できませんでした。"); }
    finally { setBusy(false); }
  }

  if (!token) return <div className="ux2-account-card"><h2>モニタリング画面から開いてください</h2><p>契約対象を安全に特定するため、通常はAIX Monitor画面の「契約を管理」からこのページを開きます。</p><Link className="button button-dark" href="/">AIXへ戻る</Link></div>;

  return <div className="ux2-account-card">
    <p className="ux2-label">Stripe Customer Portal</p>
    <h2>支払・請求・解約</h2>
    <p>カード情報はStripeが管理し、AIXでは保持しません。</p>
    {watch ? <div className="ux2-account-summary"><span>対象</span><strong>{watch.latest.discovery.brandName}</strong><small>{watch.paid ? "AIX Monitor 契約中" : "有料契約なし"}</small></div> : null}
    <button className="button button-dark" type="button" onClick={openPortal} disabled={busy || !watch?.paid}>{busy ? "準備中…" : watch?.paid ? <>Stripeで契約を管理 <ArrowIcon /></> : "有料契約後に利用できます"}</button>
    {message ? <p className="form-error" role="status">{message}</p> : null}
    {watch ? <p><Link className="ux2-link" href={`/watch?token=${encodeURIComponent(token)}`}>モニタリングへ戻る</Link></p> : null}
  </div>;
}
