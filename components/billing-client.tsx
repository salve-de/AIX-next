"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowIcon, LockIcon } from "@/components/icons";
import type { WatchRecord } from "@/lib/types";

export function BillingClient() {
  const params = useSearchParams();
  const [token, setToken] = useState(params.get("token") || "");
  const [watch, setWatch] = useState<WatchRecord | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`/api/watch?token=${encodeURIComponent(token)}`, { cache: "no-store" })
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error || "Watchを取得できませんでした。"); setWatch(data); })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Watchを取得できませんでした。"));
  }, [token]);

  async function submit(event: FormEvent) {
    event.preventDefault(); setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/billing/portal", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "契約管理を開始できませんでした。");
      window.location.assign(data.url);
    } catch (error) { setMessage(error instanceof Error ? error.message : "契約管理を開始できませんでした。"); }
    finally { setBusy(false); }
  }

  return <div className="billing-panel">
    <form onSubmit={submit}>
      <div className="billing-icon"><LockIcon /></div>
      <h2>Stripe Customer Portal</h2>
      <p>支払方法、請求履歴、次回更新、解約をStripeの安全な画面で管理します。</p>
      <label>Watch token<input value={token} onChange={(event) => setToken(event.target.value)} placeholder="token_..." /></label>
      {watch ? <div className="billing-watch-summary"><span>対象</span><strong>{watch.latest.discovery.brandName}</strong><small>{watch.paid ? "有料Watch契約中" : "無料Watch"}</small></div> : null}
      <button className="button button-dark" type="submit" disabled={busy || !token || !watch?.paid}>{busy ? "準備中…" : watch?.paid ? <>契約を管理 <ArrowIcon /></> : "有料契約後に利用できます"}</button>
      {message ? <p className="form-error" role="status">{message}</p> : null}
    </form>
    <p className="billing-note">カード情報はStripeが管理し、AIX Nextでは保持しません。</p>
    {watch ? <Link className="document-link" href={`/watch?token=${encodeURIComponent(token)}`}>Watchへ戻る</Link> : null}
  </div>;
}
