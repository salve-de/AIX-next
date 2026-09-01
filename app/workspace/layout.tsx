import type { Metadata } from "next";
import "./workspace.css";

export const metadata: Metadata = {
  title: "AI Buyer Intelligence Workspace",
  robots: { index: false, follow: false, noarchive: true },
  referrer: "no-referrer",
};

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return children;
}
