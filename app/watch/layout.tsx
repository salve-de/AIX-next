import type { Metadata } from "next";
import "./watch-v3.css";
import "./competitor-movers.css";

export const metadata: Metadata = {
  title: "AIX Watch",
  robots: { index: false, follow: false, noarchive: true },
  referrer: "no-referrer",
};

export default function WatchLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return children;
}
