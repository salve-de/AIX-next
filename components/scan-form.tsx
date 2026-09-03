"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowIcon } from "@/components/icons";

export function ScanForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    const value = input.trim();
    if (!value) { setError("会社名・商品名・サービス名・URLを入力してください。"); return; }
    setError("");
    router.push(`/scan?input=${encodeURIComponent(value)}`);
  }

  return <form className={`scan-form ${compact ? "scan-form-compact" : ""}`} id={compact ? undefined : "scan"} onSubmit={submit} noValidate>
    <div className="scan-field"><input aria-label="会社名・商品名・店舗名・URL" autoCapitalize="none" autoCorrect="off" inputMode="text" placeholder="例: 会社名、店舗名、商品名、またはホームページURL" value={input} onChange={(event) => setInput(event.target.value)} /><button type="submit"><span>{compact ? "無料で診断" : "無料で理由を診断する"}</span><ArrowIcon /></button></div>
    <p className="scan-form-note">会社名・店舗名・商品名・URLに対応。自社サイト改修不要・最短1分で完了します。</p>
    {error ? <p className="form-error" role="alert">{error}</p> : null}
  </form>;
}
