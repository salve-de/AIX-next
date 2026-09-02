import type { Metadata } from "next";
import "./workspace.css";
import "./workspace-v3.css";
import "./custom-prompt-lab.css";
import "./site-readiness.css";
import "./export-center.css";
import "./agent-analytics.css";
import "./surface-status.css";
import "./opportunity-queue.css";

export const metadata: Metadata = {
  title: "AI Buyer Intelligence Workspace",
  robots: { index: false, follow: false, noarchive: true },
  referrer: "no-referrer",
};

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
