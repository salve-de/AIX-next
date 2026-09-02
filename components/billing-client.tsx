"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowIcon, LockIcon } from "@/components/icons";
import type { WatchRecord } from "@/lib/types";

export function BillingClient() {
  const params = useSearchParams();
  const token = params.get("token") || "";
  const [watch, setWatch] = useState<WatchRecord | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(Boolean(token));

  useEffect(() => {
    if (!token) return;
    fetch(`/api/watch?token=${encodeURIComponent(token)}`, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Watchを取得できませんでした。");
        setWatch(data);
      })
      .catch((error) => setMessage(error instanceof Error ? error.message : "Watchを取得できませんでした。"))
      .finally(() => setLoading(false));
  }, [token]);

  async function submit(event: FormEvent) {
    event.preventDefault();
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

  if (!token) return <div className="billing-panel"><div className="billing-empty"><div className="billing-icon"><LockIcon /></div><h2>Watchから契約管理を開いてください。</h2><p>契約管理は対象Projectと安全に紐づいた状態で開きます。Watch tokenを手入力する必要はありません。</p><Link className="button button-dark" href="/">AIXへ戻る <ArrowIcon /></Link></div></div>;

  return <div className="billing-panel">
    <form onSubmit={submit}>
      <div className="billing-icon"><LockIcon /></div>
      <p className="eyebrow">SECURE SUBSCRIPTION MANAGEMENT</p>
      <h2>契約・支払情報はStripeで管理。</h2>
      <p>支払方法、請求履歴、次回更新、解約をStripe Customer Portalで管理します。カード番号はAIXへ保存しません。</p>
      {loading ? <div className="billing-watch-summary"><span>対象Projectを確認中</span></div> : null}
      {watch ? <div className="billing-watch-summary"><span>対象Project</span><strong>{watch.latest.discovery.brandName}</strong><small>{watch.paid ? "Founder Watch契約中" : "無料Watch"}</small></div> : null}
      <button className="button button-dark" type="submit" disabled={busy || loading || !watch?.paid}>{busy ? "Stripeを開いています…" : watch?.paid ? <>Stripeで契約を管理 <ArrowIcon /></> : "有料契約後に利用できます"}</button>
      {message ? <p className="form-error" role="status">{message}</p> : null}
    </form>
    <div className="billing-trust-row"><span><LockIcon />カード情報はStripe管理</span><Link href="/terms">利用規約</Link><Link href="/commerce">特定商取引法に基づく表示</Link></div>
    {watch ? <Link className="document-link" href={`/watch?token=${encodeURIComponent(token)}`}>Watchへ戻る</Link> : null}
  </div>;
}
