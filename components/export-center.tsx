"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowIcon, QuoteIcon } from "@/components/icons";
import { datasetCsv, executiveMarkdown, safeReportData } from "@/lib/reporting";
import { sampleWatch } from "@/lib/sample-data";

function saveText(name: string, text: string, type: string) {
  const blob = new Blob([text], { type }); const url = URL.createObjectURL(blob); const anchor = document.createElement("a"); anchor.href = url; anchor.download = name; anchor.click(); setTimeout(() => URL.revokeObjectURL(url), 0);
}

export function ExportCenter() {
  const params = useSearchParams(); const sample = params.get("sample") === "1"; const token = params.get("token") || ""; const [open, setOpen] = useState(false);
  function download(format: "md" | "json" | "csv", scope = "prompts") {
    if (sample) { const watch = sampleWatch(); if (format === "md") saveText("aix-sample-executive.md", executiveMarkdown(watch), "text/markdown"); else if (format === "json") saveText("aix-sample-intelligence.json", JSON.stringify(safeReportData(watch), null, 2), "application/json"); else saveText(`aix-sample-${scope}.csv`, datasetCsv(watch, scope as "prompts" | "citations" | "competitors" | "history"), "text/csv"); return; }
    const query = new URLSearchParams({ token, format }); if (format === "csv") query.set("scope", scope); window.location.assign(`/api/intelligence-export?${query.toString()}`);
  }
  return <div className="export-center"><button className="export-trigger" type="button" onClick={() => setOpen((value) => !value)}><QuoteIcon />Reports & Export</button>{open ? <section><header><strong>共有・分析用に出す</strong><button onClick={() => setOpen(false)}>×</button></header><p>Workspaceの秘密tokenや認証情報はReport datasetへ含めません。</p><button onClick={() => download("md")}>Executive Brief (.md)<ArrowIcon /></button><button onClick={() => download("json")}>Full Intelligence (.json)<ArrowIcon /></button><hr /><small>CSV DATASETS</small><button onClick={() => download("csv", "prompts")}>Buyer Prompts.csv</button><button onClick={() => download("csv", "citations")}>Citations.csv</button><button onClick={() => download("csv", "competitors")}>Competitors.csv</button><button onClick={() => download("csv", "history")}>Core History.csv</button></section> : null}</div>;
}
