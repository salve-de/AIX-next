"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowIcon, SearchIcon } from "@/components/icons";

export function ScanForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [url, setUrl] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent) {
    event.preventDefault();
    const value = url.trim();
    if (!value) { setError("会社サイトのURLを入力してください。"); return; }
    setError("");
    router.push(`/scan?url=${encodeURIComponent(value)}`);
  }

  return <form className={`scan-form ${compact ? "scan-form-compact" : ""}`} id={compact ? undefined : "scan"} onSubmit={submit} noValidate>
    <div className="scan-field"><SearchIcon /><input aria-label="会社サイトURL" autoCapitalize="none" autoCorrect="off" inputMode="url" placeholder="会社サイトのURL  例: https://yourcompany.jp" value={url} onChange={(event) => setUrl(event.target.value)} /><button type="submit"><span>{compact ? "競合負けを無料診断" : "競合に負ける質問を無料診断"}</span><ArrowIcon /></button></div>
    {error ? <p className="form-error" role="alert">{error}</p> : null}
  </form>;
}
