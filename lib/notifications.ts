import "server-only";
import { env } from "@/lib/env";
import { compareWatchRuns } from "@/lib/watch-diff";
import type { ScanResult, WatchRecord } from "@/lib/types";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] || char);
}

export async function sendWeeklyBrief(watch: WatchRecord, previous: ScanResult, latest: ScanResult) {
  if (!env.resendApiKey || !env.mailFrom || !watch.email) return { sent: false, reason: "email_not_configured" };

  const delta = compareWatchRuns(previous, latest);
  const brand = latest.discovery.brandName;
  const topLoss = latest.lostPrompts[0];
  const topGap = latest.evidenceGaps[0];
  const action = latest.actions[0];
  const competitorMover = delta.competitorDeltas.find((item) => item.coverageDelta > 0 || item.newlyObserved);
  const workspaceUrl = `${env.siteUrl.replace(/\/$/, "")}/workspace?token=${encodeURIComponent(watch.token)}`;
  const watchUrl = `${env.siteUrl.replace(/\/$/, "")}/watch?token=${encodeURIComponent(watch.token)}`;
  const coverageDelta = delta.coverageDelta;
  const sign = coverageDelta !== null && coverageDelta > 0 ? "+" : "";
  const subject = delta.comparable
    ? `AIX Weekly · ${brand} · ${sign}${coverageDelta ?? 0}pt / 候補外変化 ${delta.newLosses}`
    : `AIX Weekly · ${brand} · 新しいBaselineを開始`;

  const comparisonNote = delta.comparable
    ? `同じCore Panel・反復数・AI surface構成で、必要な成功反復を満たしたPrompt×surfaceだけを比較しています。${delta.skippedCells ? `${delta.skippedCells}セルは回答不足のため差分判定から除外しました。` : ""}`
    : `観測PanelまたはAI surface構成が変わったため、前回との増減を表示していません。新しいBaselineとして扱います。`;

  const html = `<!doctype html><html><body style="margin:0;background:#f4f7f6;font-family:Arial,'Noto Sans JP',sans-serif;color:#10212b"><div style="max-width:640px;margin:0 auto;padding:32px 18px"><div style="background:#081820;color:#eafff5;padding:26px;border-radius:14px 14px 0 0"><div style="font-size:11px;letter-spacing:.12em;color:#79e2b4;font-weight:700">AIX WEEKLY BUYER INTELLIGENCE</div><h1 style="font-size:24px;margin:10px 0 5px">${escapeHtml(brand)}</h1><p style="font-size:12px;color:#9eb3ae;margin:0;line-height:1.6">${escapeHtml(comparisonNote)}</p></div><div style="background:#fff;padding:24px;border:1px solid #dde6e5;border-top:0"><table style="width:100%;border-collapse:collapse"><tr><td style="padding:10px;border-bottom:1px solid #edf1f0;font-size:11px">Recommendation Coverage</td><td style="padding:10px;border-bottom:1px solid #edf1f0;text-align:right;font-size:20px;font-weight:700">${latest.recommendationCoverage}% ${delta.comparable ? `<span style="font-size:11px;color:#60736d">(${sign}${coverageDelta ?? 0}pt)</span>` : `<span style="font-size:11px;color:#60736d">NEW BASELINE</span>`}</td></tr><tr><td style="padding:10px;border-bottom:1px solid #edf1f0;font-size:11px">新しく候補入り</td><td style="padding:10px;border-bottom:1px solid #edf1f0;text-align:right;font-weight:700">${delta.comparable ? delta.newWins : "—"}</td></tr><tr><td style="padding:10px;border-bottom:1px solid #edf1f0;font-size:11px">新しく候補外</td><td style="padding:10px;border-bottom:1px solid #edf1f0;text-align:right;font-weight:700">${delta.comparable ? delta.newLosses : "—"}</td></tr><tr><td style="padding:10px;font-size:11px">新しいCitation</td><td style="padding:10px;text-align:right;font-weight:700">${delta.comparable ? delta.newCitations.length : "—"}</td></tr></table>${competitorMover ? `<div style="margin-top:20px;padding:14px;background:#fff7ef;border-left:3px solid #cf7a43"><div style="font-size:9px;color:#806650;font-weight:700">COMPETITOR MOVEMENT</div><strong style="display:block;font-size:14px;margin-top:5px">${escapeHtml(competitorMover.name)} ${competitorMover.newlyObserved ? "を新規観測" : `${competitorMover.coverageDelta >= 0 ? "+" : ""}${competitorMover.coverageDelta}pt`}</strong><span style="font-size:10px;color:#7a6d61">Coverage ${competitorMover.beforeCoverage}% → ${competitorMover.afterCoverage}% / First Choice ${competitorMover.beforeFirstChoices} → ${competitorMover.afterFirstChoices}</span></div>` : ""}${topLoss ? `<div style="margin-top:22px"><div style="font-size:9px;color:#7b8b87;font-weight:700">MOST IMPORTANT LOSS</div><h2 style="font-size:16px;line-height:1.5;margin:6px 0">「${escapeHtml(topLoss.prompt)}」</h2><p style="font-size:11px;line-height:1.7;color:#657670">${escapeHtml(topLoss.summary)}</p></div>` : ""}${topGap ? `<div style="margin-top:20px;padding:14px;background:#f3f7f5;border-left:3px solid #6db18e"><div style="font-size:9px;color:#607870;font-weight:700">比較材料（Evidence）</div><strong style="display:block;font-size:13px;margin-top:5px">${escapeHtml(topGap.label)}</strong><span style="font-size:10px;color:#71817c">${topGap.relatedPromptCount}件の追跡Promptと関連</span></div>` : ""}${action ? `<div style="margin-top:20px"><div style="font-size:9px;color:#7b8b87;font-weight:700">NEXT ACTION</div><strong style="display:block;font-size:14px;margin-top:5px">${escapeHtml(action.title)}</strong></div>` : ""}<a href="${escapeHtml(watchUrl)}" style="display:inline-block;margin-top:24px;background:#0b2b21;color:#fff;text-decoration:none;padding:12px 16px;border-radius:8px;font-size:12px;font-weight:700">Weekly Briefを見る</a><a href="${escapeHtml(workspaceUrl)}" style="display:inline-block;margin:24px 0 0 8px;color:#244d3f;text-decoration:none;padding:11px 14px;border:1px solid #cddbd5;border-radius:8px;font-size:12px;font-weight:700">Workspaceで深掘り</a><p style="margin:22px 0 0;font-size:9px;line-height:1.6;color:#899693">AIXは外部AIの順位・推薦・Citation・売上を保証しません。このメールは記録された観測条件内の差を要約しています。</p></div></div></body></html>`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.resendApiKey}`, "content-type": "application/json" },
    body: JSON.stringify({ from: env.mailFrom, to: [watch.email], subject, html }),
  });
  if (!response.ok) throw new Error(`Weekly brief delivery failed (${response.status}): ${(await response.text()).slice(0, 240)}`);
  return { sent: true };
}
