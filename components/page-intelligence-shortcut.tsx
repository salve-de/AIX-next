"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ArrowIcon, QuoteIcon } from "@/components/icons";

export function PageIntelligenceShortcut() {
  const params = useSearchParams();
  const sample = params.get("sample") === "1";
  const token = params.get("token") || "";
  const href = sample ? "/workspace/pages?sample=1" : token ? `/workspace/pages?token=${encodeURIComponent(token)}` : "/workspace/pages";
  return <Link className="page-intel-shortcut" href={href}><QuoteIcon /><span><small>PAGE INTELLIGENCE</small><strong>引用ページと未獲得機会を見る</strong></span><ArrowIcon /></Link>;
}
