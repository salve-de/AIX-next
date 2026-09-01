import type { Metadata } from "next";
import "./result-v3.css";

export const metadata: Metadata = { title: "AI Buyer Market Scan", robots: { index: false, follow: false, noarchive: true }, referrer: "no-referrer" };

export default function ResultLayout({ children }: { children: React.ReactNode }) { return children; }
