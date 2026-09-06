"use client";

import { DATA_DELETION_CONFIRMATION } from "@/lib/brand";

import { FormEvent, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowIcon, LockIcon, WarningIcon } from "@/components/icons";

export function DataRightsClient() {
  const params = useSearchParams();
  const [token, setToken] = useState(params.get("token") || "");
  const [email, setEmail] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [busy, setBusy] = useState<"" | "export" | "delete">("");
  const [message, setMessage] = useState("");
  const submitting = useRef(false);

  async function exportData(event: FormEvent) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true; setBusy("export"); setMessage("");
    try {
      const response = await fetch("/api/privacy/export", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, email }) });
      if (!response.ok) { const data = await response.json(); throw new Error(data.error || "書き出せませんでした。"); }
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url; anchor.download = `rovan-export-${Date.now()}.json`;
      document.body.appendChild(anchor); anchor.click(); anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1_000); setMessage("データを書き出しました。");
    } catch (error) { setMessage(error instanceof Error ? error.message : "書き出せませんでした。"); }
    finally { submitting.current = false; setBusy(""); }
  }

  async function deleteData(event: FormEvent) {
    event.preventDefault();
    if (submitting.current) return;
    submitting.current = true; setBusy("delete"); setMessage("");
    try {
      const response = await fetch("/api/privacy/delete", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, email, confirmation }) });
      const data = await response.json();
      if (!response.ok || data.deleted !== true) throw new Error(data.error || "削除できませんでした。");
      setMessage("Watchとその測定履歴を削除しました。他のWatchや公開プロフィールが参照する診断は保持されます。公開プロフィールの掲載停止は別途管理画面またはお問い合わせ窓口をご利用ください。"); setToken(""); setEmail(""); setConfirmation("");
    } catch (error) { setMessage(error instanceof Error ? error.message : "削除できませんでした。"); }
    finally { submitting.current = false; setBusy(""); }
  }

  return <div className="data-rights-grid">
    <p className="document-note">対象は、このWatchとその測定履歴です。公開プロフィールは管理権限が別のため、書き出し・削除に含まれません。公開プロフィールの掲載停止は公開時の管理画面またはお問い合わせ窓口をご利用ください。他のWatchや公開プロフィールから参照される診断、法令・運用上必要な削除記録は保持されます。</p>
    <form onSubmit={exportData}><div className="data-rights-icon"><LockIcon /></div><h2>データを書き出す</h2><p>Watch、測定履歴、EvidenceをJSONで取得します。</p><label>Watch token<input required disabled={!!busy} value={token} onChange={(event) => setToken(event.target.value)} /></label><label>登録メール<input required disabled={!!busy} type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label><button className="button button-dark" disabled={!!busy}>{busy === "export" ? "作成中…" : <>JSONを取得 <ArrowIcon /></>}</button></form>
    <form onSubmit={deleteData}><div className="data-rights-icon warning"><WarningIcon /></div><h2>完全に削除する</h2><p>Watchを削除します。共有されていない元Scanも削除します。元に戻せません。</p><label>Watch token<input required disabled={!!busy} value={token} onChange={(event) => setToken(event.target.value)} /></label><label>登録メール<input required disabled={!!busy} type="email" value={email} onChange={(event) => setEmail(event.target.value)} /></label><label>確認文字列<input required disabled={!!busy} value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder={DATA_DELETION_CONFIRMATION} /></label><button className="button button-dark" disabled={!!busy}>{busy === "delete" ? "削除中…" : "完全削除"}</button></form>
    {message ? <p className="data-rights-message" role="status">{message}</p> : null}
  </div>;
}
