import { Suspense } from "react";
import { WatchClient } from "@/components/watch-client";
import { WorkspaceShortcut } from "@/components/workspace-shortcut";

export default function WatchPage() {
  return <Suspense fallback={<div className="full-loading">Watchを読み込んでいます。</div>}><WatchClient /><WorkspaceShortcut /></Suspense>;
}
