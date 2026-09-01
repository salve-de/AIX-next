"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowIcon } from "@/components/icons";

export function WorkspaceShortcut() {
  const params = useSearchParams();
  const sample = params.get("sample") === "1";
  const token = params.get("token") || "";
  if (!sample && !token) return null;
  const href = sample ? "/workspace?sample=1" : `/workspace?token=${encodeURIComponent(token)}`;
  return <Link href={href} style={{ position: "fixed", right: 18, bottom: 18, zIndex: 50, display: "inline-flex", alignItems: "center", gap: 8, padding: "12px 15px", borderRadius: 10, background: "#0b2b21", color: "#eafff5", textDecoration: "none", boxShadow: "0 12px 32px rgba(7,25,20,.22)", fontSize: 12, fontWeight: 800 }}>AIX Workspaceを開く <ArrowIcon style={{ width: 15 }} /></Link>;
}
