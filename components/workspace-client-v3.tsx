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
  const token = params.get("token") || "";
  const requestedView = params.get("view");
  const [watch, setWatch] = useState<WatchRecord | null>(sample ? sampleWatch() : null);
  const [loading, setLoading] = useState(!sample);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sample) return;
    if (!token) { setError("Workspace tokenがありません。Watchから開いてください。"); setLoading(false); return; }
    fetch(`/api/watch?token=${encodeURIComponent(token)}`, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Workspaceを取得できませんでした。");
        setWatch(data as WatchRecord);
      })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Workspaceを取得できませんでした。"))
      .finally(() => setLoading(false));
  }, [sample, token]);

  if (loading) return <main className="workspace-loading">AIX Workspaceを読み込んでいます。</main>;
  if (!watch) return <main className="workspace-loading"><div><strong>Workspaceを表示できません。</strong><p>{error}</p><Link href="/">無料診断へ戻る</Link></div></main>;
  return <><SurfaceStatus watch={watch} /><WorkspaceLoadedV4 initialWatch={watch} sample={sample} token={token} initialView={requestedView} /></>;
}
