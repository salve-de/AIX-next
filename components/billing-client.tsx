"use client";

import Link from "next/link";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowIcon, LockIcon } from "@/components/icons";
import type { WatchRecord } from "@/lib/types";

export function BillingClient() {
  const params = useSearchParams();
  const [token, setToken] = useState(params.get("token") || "");
  const [watch, setWatch] = useState<WatchRecord | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const submitting = useRef(false);

  useEffect(() => {
    let stale = false;
    const controller = new AbortController();
    setWatch(null);
    setMessage("");
    if (!token) return;
    fetch(`/api/watch?token=${encodeURIComponent(token)}`, { cache: "no-store", signal: controller.signal })
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error || "Watchを取得できませんでした。"); if (!stale) setWatch(data); })
      .catch((error) => { if (!stale) setMessage(error instanceof Error ? error.message : "Watchを取得できませんでした。"); });
    return () => { stale = true; controller.abort(); };
  }, [token]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (submitting.current || !token || !watch) return;
    submitting.current = true; setBusy(true); setMessage("");
    try {
      const response = await fetch("/api/billing/portal", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "契約管理を開始できませんでした。");
      window.location.assign(data.url);
    } catch (error) { setMessage(error instanceof Error ? error.message : "契約管理を開始できませんでした。"); }
    finally { submitting.current = false; setBusy(false); }
  }

  return <div className="billing-panel">
    <form onSubmit={submit}>
      <div className="billing-icon"><LockIcon /></div>
      <span style={{ fontSize: "0.75rem", fontWeight: 800, background: "#0f172a", color: "#ffffff", padding: "3px 10px", borderRadius: "4px", display: "inline-block", marginBottom: "8px" }}>
        画面種別：ご契約・お支払い管理
      </span>
      <h2>AI推薦・自動見守りプランのご契約管理</h2>
      <p>お支払い方法の変更、請求書・領収書の発行、次回更新日の確認、解約手続きをStripeの管理画面で行えます。</p>
      <label>管理コード（Watch token）<input value={token} disabled={busy} onChange={(event) => { setWatch(null); setToken(event.target.value); }} placeholder="token_..." /></label>
      {watch ? <div className="billing-watch-summary"><span>対象企業</span><strong>{watch.latest.discovery.brandName}</strong><small>{watch.paid ? "有料見守り契約中" : watch.status === "trial" ? "無料トライアル中" : "契約状況をご確認ください"}</small></div> : null}
      <button className="button button-dark" type="submit" disabled={busy || !token || !watch}>{busy ? "準備中…" : <>契約・決済管理画面を開く <ArrowIcon /></>}</button>
      {message ? <p className="form-error" role="status">{message}</p> : null}

      <div style={{ marginTop: "24px", padding: "16px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", textAlign: "left" }}>
        <span style={{ display: "block", fontSize: "0.74rem", fontWeight: 700, color: "#475569", marginBottom: "8px", letterSpacing: "0.02em" }}>
          ご解約・契約終了時のデータ取り扱いについて
        </span>
        <ul style={{ margin: 0, paddingLeft: "18px", fontSize: "0.76rem", color: "#64748b", lineHeight: 1.6 }}>
          <li><strong>公開ページの停止：</strong>解約に伴い、AI向け公開ページは非公開となり、毎週の自動調整が停止します。</li>
          <li><strong>30日間のデータ保持：</strong>解約後30日間は設定および過去ログが安全に保持され、期間内であればいつでも即座に再開可能です。</li>
          <li><strong>期限後の完全消去：</strong>解約から30日を経過すると蓄積データは完全に消去され、再契約時は初期状態からの再測定となります。</li>
        </ul>
      </div>

    </form>
    <p className="billing-note">クレジットカード情報はStripeが管理し、Rovanでは保持しません。</p>
    {watch ? <Link className="document-link" href={`/watch?token=${encodeURIComponent(token)}`}>← 見守りダッシュボードへ戻る</Link> : <Link className="document-link" href="/">← トップページへ戻る</Link>}
  </div>;
}
