import { Suspense } from "react";
import { CustomPromptLab } from "@/components/custom-prompt-lab";
import { WorkspaceClientV3 } from "@/components/workspace-client-v3";

export default function WorkspacePage() {
  return <Suspense fallback={<main className="workspace-loading">Workspaceを読み込んでいます。</main>}><WorkspaceClientV3 /><CustomPromptLab /></Suspense>;
}
