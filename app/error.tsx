"use client";

import { useEffect } from "react";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error("AIX Next route error", error); }, [error]);
  return <main className="empty-page"><p className="eyebrow">AIX ERROR</p><h1>処理を完了できませんでした。</h1><p>再試行しても解決しない場合は、時間を空けてください。</p>{error.digest ? <small>Reference: {error.digest}</small> : null}<button className="button button-dark" type="button" onClick={reset}>再試行する</button></main>;
}
