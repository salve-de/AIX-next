"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { SurfaceStatus } from "@/components/surface-status";
import { WorkspaceLoadedV4 } from "@/components/workspace-loaded-v4";
import { sampleWatch } from "@/lib/sample-data";
import type { WatchRecord } from "@/lib/types";

export function WorkspaceClientV3() {
  const params = useSearchParams();
  const sample = params.get("sample") === "1";
  const legacyToken = params.get("token") || "";
  const requestedView = params.get("view");
  const [watch, setWatch] = useState<WatchRecord | null>(sample ? sampleWatch() : null);
  const [loading, setLoading] = useState(!sample);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sample) return;
    let cancelled = false;
    async function load() {
      try {
        if (legacyToken) {
          const exchange = await fetch("/api/session/exchange", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token: legacyToken }) });
          const exchangeData = await exchange.json().catch(() => ({}));
          if (!exchange.ok) throw new Error(exchangeData.error || "Workspace sessionを開始できませんでした。");
          const clean = new URL(window.location.href);
          clean.searchParams.delete("token");
          window.history.replaceState({}, "", `${clean.pathname}${clean.search}${clean.hash}`);
        }
        const response = await fetch("/api/watch", { cache: "no-store" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Workspaceを取得できませんでした。");
        if (!cancelled) setWatch(data as WatchRecord);
      } catch (caught) {
        if (!cancelled) setError(caught instanceof Error ? caught.message : "Workspaceを取得できませんでした。");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [sample, legacyToken]);

  if (loading) return <main className="workspace-loading">AIX Workspaceを読み込んでいます。</main>;
  if (!watch) return <main className="workspace-loading"><div><strong>Workspaceを表示できません。</strong><p>{error}</p><Link href="/">無料診断へ戻る</Link></div></main>;
  return <><SurfaceStatus watch={watch} /><WorkspaceLoadedV4 initialWatch={watch} sample={sample} token={legacyToken} initialView={requestedView} /></>;
}
