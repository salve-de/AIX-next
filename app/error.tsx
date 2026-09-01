"use client";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <main className="error-page"><p className="kicker"><span/>AIX ERROR</p><h1>処理を完了できませんでした。</h1><p>{error.message || "時間を空けて再度お試しください。"}</p><button className="button button-primary" type="button" onClick={reset}>再試行する</button></main>;
}
