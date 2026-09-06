"use client";

import { DATA_DELETION_CONFIRMATION } from "@/lib/brand";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowIcon, LockIcon, WarningIcon } from "@/components/icons";

export function DataRightsClient() {
  const params = useSearchParams();
  const [token, setToken] = useState(params.get("token") || "");
  const [email, setEmail] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState<"" | "export" | "delete">("");
  const [message, setMessage] = useState("");

  async function exportData(event: FormEvent) {
    event.preventDefault(); setBusy("export"); setMessage("");
    try {
      const response = await fetch("/api/privacy/export", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, email }) });
      if (!response.ok) { const data = await response.json(); throw new Error(data.error || "書き出せませんでした。"); }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url; anchor.download = `rovan-export-${Date.now()}.json`; anchor.click();
      URL.revokeObjectURL(url); setMessage("データを書き出しました。");
    } catch (error) { setMessage(error instanceof Error ? error.message : "書き出せませんでした。"); }
    finally { setBusy(""); }
  }

  async function deleteData(event: FormEvent) {
    event.preventDefault(); setBusy("delete"); setMessage("");
    try {
      const response = await fetch("/api/privacy/delete", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, email, confirmation }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "削除できませんでした。");
      setMessage("Watchと元の診断データを削除しました。"); setToken(""); setEmail(""); setConfirmation("");
    } catch (error) { setMessage(error instanceof Error ? error.message : "削除できませんでした。"); }
    finally { setBusy(""); }
  }

  return <div className="data-rights-grid">
    <form onSubmit={exportData}><div className="data-rights-icon"><LockIcon /></div><h2>データを書き出す</h2><p>Watch、測定履歴、EvidenceをJSONで取得します。</p><label>Watch token<input value={token} onChange={(event) => setToken(event.target.value)} /></label><label>登録メール<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label><button className="button button-dark" disabled={busy === "export"}>{busy === "export" ? "作成中…" : <>JSONを取得 <ArrowIcon /></>}</button></form>
    <form onSubmit={deleteData}><div className="data-rights-icon warning"><WarningIcon /></div><h2>完全に削除する</h2><p>Watchと元Scanを削除します。元に戻せません。</p><label>Watch token<input value={token} onChange={(event) => setToken(event.target.value)} /></label><label>登録メール<input type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>確認文字列<input value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder={DATA_DELETION_CONFIRMATION} /></label><button className="button button-dark" disabled={busy === "delete"}>{busy === "delete" ? "削除中…" : "完全削除"}</button></form>
    {message ? <p className="data-rights-message" role="status">{message}</p> : null}
  </div>;
}
