"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/ui";

export function ScanForm({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const input = value.trim();
    if (!input) {
      setError("会社サイトのURLを入力してください。");
      return;
    }
    let normalized = /^https?:\/\//i.test(input) ? input : `https://${input}`;
    try {
      const parsed = new URL(normalized);
      if (!parsed.hostname || !["http:", "https:"].includes(parsed.protocol)) throw new Error();
      normalized = parsed.toString();
    } catch {
      setError("有効な会社サイトURLを入力してください。");
      return;
    }
    setError("");
    router.push(`/scan?url=${encodeURIComponent(normalized)}`);
  }

  return (
    <form className={`scan-form${compact ? " scan-form-compact" : ""}`} onSubmit={submit} noValidate>
      <div className="scan-form-field">
        <label htmlFor={compact ? "company-url-compact" : "company-url"}>会社サイトURL</label>
        <div className="scan-form-control">
          <span className="scan-form-icon"><Icon name="search" size={18} /></span>
          <input
            id={compact ? "company-url-compact" : "company-url"}
            type="url"
            inputMode="url"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            placeholder="example.co.jp"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            aria-invalid={Boolean(error)}
            aria-describedby={error ? `${compact ? "company-url-compact" : "company-url"}-error` : undefined}
          />
          <button className="button button-primary" type="submit">
            無料で調べる <Icon name="arrow" size={17} />
          </button>
        </div>
        <div className="scan-form-meta"><span>登録不要</span><span>カード不要</span><span>公開Webだけを調査</span></div>
        {error ? <p className="form-error" id={`${compact ? "company-url-compact" : "company-url"}-error`} role="alert">{error}</p> : null}
      </div>
    </form>
  );
}
