"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { LockIcon } from "@/components/icons";

export function ExecutionShortcut() {
  const params = useSearchParams(); const sample = params.get("sample") === "1"; const token = params.get("token") || "";
  if (!sample && !token) return null;
  const href = sample ? "/workspace/execution?sample=1" : `/workspace/execution?token=${encodeURIComponent(token)}`;
  return <Link className="execution-shortcut" href={href}><LockIcon />Safe Execution</Link>;
}
