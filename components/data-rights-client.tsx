"use client";

import { FormEvent, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowIcon } from "@/components/icons";

export function DataRightsClient() {
  const params = useSearchParams();
  const queryToken = params.get("token") || "";
  const [token, setToken] = useState(queryToken);
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
      anchor.href = url; anchor.download = `aix-export-${Date.now()}.json`; anchor.click();
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
      setMessage("継続モニタリングと関連データを削除しました。"); setEmail(""); setConfirmation("");
    } catch (error) { setMessage(error instanceof Error ? error.message : "削除できませんでした。"); }
    finally { setBusy(""); }
  }

  return <div className="ux2-data-grid">
    <form className="ux2-data-card" onSubmit={exportData}>
      <p className="ux2-label">Export</p><h2>データを書き出す</h2><p>測定履歴、企業入力、変更原稿など、保存されている継続モニタリングのデータをJSONで取得します。</p>
      <label>登録メール<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.jp" /></label>
      {!queryToken ? <details className="ux2-fallback-token"><summary>モニタリング画面から来ていない場合</summary><label>モニタリングtoken<input required value={token} onChange={(event) => setToken(event.target.value)} placeholder="token_..." /></label></details> : null}
      <button className="button button-dark" disabled={busy === "export" || !token}>{busy === "export" ? "作成中…" : <>JSONを取得 <ArrowIcon /></>}</button>
    </form>

    <form className="ux2-data-card warning" onSubmit={deleteData}>
      <p className="ux2-label">Delete</p><h2>完全に削除する</h2><p>継続モニタリングと関連する元診断を削除します。元に戻せません。</p>
      <label>登録メール<input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.jp" /></label>
      {!queryToken ? <details className="ux2-fallback-token"><summary>モニタリング画面から来ていない場合</summary><label>モニタリングtoken<input required value={token} onChange={(event) => setToken(event.target.value)} placeholder="token_..." /></label></details> : null}
      <label>確認文字列<input required value={confirmation} onChange={(event) => setConfirmation(event.target.value)} placeholder="DELETE AIX DATA" /></label>
      <button className="button button-dark" disabled={busy === "delete" || !token}>{busy === "delete" ? "削除中…" : "完全に削除"}</button>
    </form>
    {message ? <p className="ux2-data-message" role="status">{message}</p> : null}
  </div>;
}
