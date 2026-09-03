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
    <div className="scan-field"><input aria-label="会社名・商品名・サービス名・URL" autoCapitalize="none" autoCorrect="off" inputMode="text" placeholder="商品名・会社名・サービス名（例: 特選ぶどう、試作ネジ、Notion）またはURL" value={input} onChange={(event) => setInput(event.target.value)} /><button type="submit"><span>{compact ? "無料で診断" : "AIが競合を勧める理由を見る"}</span><ArrowIcon /></button></div>
    <p className="scan-form-note">商品名・ブランド名・会社名・URLに対応。AIが競合を優先する理由と、勝てる看板をその場で判定します。</p>
    {error ? <p className="form-error" role="alert">{error}</p> : null}
  </form>;
}
