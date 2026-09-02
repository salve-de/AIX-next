"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowIcon, LockIcon, WarningIcon } from "@/components/icons";
import type { WatchRecord } from "@/lib/types";

export function DataRightsClient() {
  const [watch, setWatch] = useState<WatchRecord | null>(null);
  const [email, setEmail] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState<"" | "export" | "delete">("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/watch", { cache: "no-store" })
      .then(async (response) => response.ok ? response.json() : null)
      .then((data) => { if (data) setWatch(data); })
      .catch(() => undefined)
      .finally(() => setLoading(false));
  }, []);

  async function exportData(event: FormEvent) {
    event.preventDefault(); setBusy("export"); setMessage("");
    try {
      const response = await fetch("/api/privacy/export", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email }) });
      if (!response.ok) { const data = await response.json(); throw new Error(data.error || "書き出せませんでした。"); }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url; anchor.download = `aix-next-export-${Date.now()}.json`; anchor.click();
      URL.revokeObjectURL(url); setMessage("データを書き出しました。");
    } catch (error) { setMessage(error instanceof Error ? error.message : "書き出せませんでした。"); }
    finally { setBusy(""); }
  }

  async function deleteData(event: FormEvent) {
    event.preventDefault(); setBusy("delete"); setMessage("");
    try {
      const response = await fetch("/api/privacy/delete", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, confirmation }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "削除できませんでした。");
      await fetch("/api/session/exchange", { method: "DELETE" }).catch(() => undefined);
      setMessage("Watchと元の診断データを削除しました。Sessionも終了しました。");
      setWatch(null); setEmail(""); setConfirmation("");
    } catch (error) { setMessage(error instanceof Error ? error.message : "削除できませんでした。"); }
    finally { setBusy(""); }
  }

  if (loading) return <div className="data-rights-message">Project sessionを確認しています。</div>;
  if (!watch) return <div className="data-rights-grid"><section className="data-rights-session-required"><LockIcon /><h2>対象ProjectのWatchから開いてください。</h2><p>Data RightsはHttpOnly sessionで対象Projectを特定します。秘密Tokenをコピー・入力する必要はありません。</p><Link className="button button-dark" href="/">AIXへ戻る <ArrowIcon /></Link></section></div>;

  return <div className="data-rights-grid">
    <div className="data-rights-project"><LockIcon /><div><small>対象Project</small><strong>{watch.latest.discovery.brandName}</strong><span>{watch.latest.discovery.domain}</span></div></div>
    <form onSubmit={exportData}><div className="data-rights-icon"><LockIcon /></div><h2>データを書き出す</h2><p>Watch、測定履歴、EvidenceをJSONで取得します。対象Projectは現在の安全なSessionから自動特定します。</p><label>登録メール<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></label><button className="button button-dark" disabled={busy === "export"}>{busy === "export" ? "作成中…" : <>JSONを取得 <ArrowIcon /></>}</button></form>
    <form onSubmit={deleteData}><div className="data-rights-icon warning"><WarningIcon /></div><h2>完全に削除する</h2><p>Watchと元Scanを削除します。元に戻せません。</p><label>登録メール<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required autoComplete="email" /></label><label>確認文字列<input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="DELETE AIX DATA" required /></label><button className="button button-dark" disabled={busy === "delete"}>{busy === "delete" ? "削除中…" : "完全削除"}</button></form>
    {message ? <p className="data-rights-message" role="status">{message}</p> : null}
  </div>;
}
