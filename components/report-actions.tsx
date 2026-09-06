"use client";

import { useState } from "react";
import type { ScanResult } from "@/lib/types";

type ReportActionsProps = {
  result: ScanResult;
  sample?: boolean;
};

function safeFilename(value: string) {
  return value.replace(/[^a-z0-9\u3040-\u30ff\u3400-\u9fff._-]+/gi, "-").replace(/^-+|-+$/g, "").slice(0, 80) || "rovan-report";
}

function download(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

function csvCell(value: unknown) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

function reportPayload(result: ScanResult) {
  return {
    reportType: "Rovan診断結果",
    measuredAt: result.measuredAt,
    targetUrl: result.targetUrl,
    discovery: result.discovery,
    panel: result.panel,
    metrics: {
      measurementCompleteness: result.measurementCompleteness,
      recommendationCoverage: result.recommendationCoverage,
      firstChoiceRate: result.firstChoiceRate,
      mentionCoverage: result.mentionCoverage,
      citationCoverage: result.citationCoverage,
      repeatAgreement: result.panel.repetitions > 1 ? result.repeatAgreement : null,
      successfulObservations: result.successfulObservations,
      scheduledObservations: result.scheduledObservations,
    },
    competitors: result.competitors,
    lostPrompts: result.lostPrompts.map((loss) => ({
      promptId: loss.promptId,
      prompt: loss.prompt,
      winner: loss.winner,
      summary: loss.summary,
      citations: loss.citations,
      observationCount: loss.observations.length,
    })),
    evidenceGaps: result.evidenceGaps,
    actions: result.actions,
    visibilityAudit: result.visibilityAudit,
    marketMap: result.marketMap,
    demandProxy: result.demandProxy,
    contentQuality: result.contentQuality,
    warnings: result.warnings,
  };
}

function markdownReport(result: ScanResult) {
  const payload = reportPayload(result);
  const losses = payload.lostPrompts.length
    ? payload.lostPrompts.map((loss, index) => `${index + 1}. **${loss.prompt}**\n   - 先に含まれた候補: ${loss.winner || "特定できず"}\n   - ${loss.summary}`).join("\n")
    : "候補外になった質問はありません。";
  const actions = result.actions.length
    ? result.actions.slice(0, 5).map((action, index) => `${index + 1}. **${action.title}**（${action.priority}）\n   - ${action.rationale}\n   - 確認する指標: ${action.successMetric || "同じ質問で自社が候補に入ったか"}`).join("\n")
    : "今回のActionはありません。";
  return `# Rovan診断結果\n\n- 対象: ${result.discovery.brandName}\n- URL: ${result.targetUrl}\n- 測定日時: ${result.measuredAt}\n- 比較した質問: ${result.panel.promptCount}問\n- 測定できた回答: ${result.successfulObservations}/${result.scheduledObservations}\n- 自社が候補に入った割合: ${result.recommendationCoverage}%\n\n## 自社が候補外だった質問\n\n${losses}\n\n## 最初に確認すること\n\n${actions}\n\n## 注意\n\nこのレポートはRovanの観測パネルによるものです。AIの全会話における順位、推薦、問い合わせ、契約、売上を保証するものではありません。\n`;
}

function lostPromptCsv(result: ScanResult) {
  const rows = [
    ["質問", "先に選ばれた競合", "概要", "引用ページ数", "観測数"],
    ...result.lostPrompts.map((loss) => [loss.prompt, loss.winner || "", loss.summary, loss.citations.length, loss.observations.length]),
  ];
  // BOM keeps Japanese labels readable when the CSV is opened directly in
  // spreadsheet apps that otherwise guess Shift_JIS.
  return `\ufeff${rows.map((row) => row.map(csvCell).join(",")).join("\n")}\n`;
}

export function ReportActions({ result, sample = false }: ReportActionsProps) {
  const [copied, setCopied] = useState(false);
  const filename = safeFilename(`rovan-${result.discovery.brandName}`);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return <div className="report-actions" aria-label="結果を保存する">
    <span className="report-actions-label">レポートの保存</span>
    <button type="button" onClick={() => window.print()}>印刷 / PDF保存</button>
    <button type="button" onClick={() => download(`${filename}.csv`, lostPromptCsv(result), "text/csv;charset=utf-8")}>質問一覧（CSV）</button>
    <button type="button" onClick={() => download(`${filename}.md`, markdownReport(result), "text/markdown;charset=utf-8")}>要約テキスト</button>
    {!sample ? <button type="button" onClick={() => void copyLink()}>{copied ? "✓ リンクをコピーしました" : "結果リンクをコピー"}</button> : null}
  </div>;
}
