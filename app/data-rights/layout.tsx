import type { Metadata } from "next";
import "../utility.css";

export const metadata: Metadata = { title: "データ管理", robots: { index: true, follow: true } };

export default function DataRightsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
