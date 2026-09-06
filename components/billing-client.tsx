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
      <span style={{ fontSize: "0.75rem", fontWeight: 800, background: "#0f172a", color: "#ffffff", padding: "3px 10px", borderRadius: "4px", display: "inline-block", marginBottom: "8px" }}>
        画面種別：ご契約・お支払い管理
      </span>
      <h2>定期見守りプランのご契約管理</h2>
      <p>お支払い方法の変更、請求書・領収書の発行、次回更新日の確認、解約手続きをStripeの管理画面で行えます。</p>
      <label>管理コード（Watch token）<input value={token} onChange={(event) => setToken(event.target.value)} placeholder="token_..." /></label>
      {watch ? <div className="billing-watch-summary"><span>対象企業</span><strong>{watch.latest.discovery.brandName}</strong><small>{watch.paid ? "有料見守り契約中" : "無料トライアル中"}</small></div> : null}
      <button className="button button-dark" type="submit" disabled={busy || !token || !watch?.paid}>{busy ? "準備中…" : watch?.paid ? <>契約・決済管理画面を開く <ArrowIcon /></> : "有料契約後にご利用いただけます"}</button>
      {message ? <p className="form-error" role="status">{message}</p> : null}
    </form>
    <p className="billing-note">クレジットカード情報はStripeが管理し、Rovanでは保持しません。</p>
    {watch ? <Link className="document-link" href={`/watch?token=${encodeURIComponent(token)}`}>← 見守りダッシュボードへ戻る</Link> : <Link className="document-link" href="/">← トップページへ戻る</Link>}
  </div>;
}
