import "server-only";
import { env } from "@/lib/env";
import type { ScanResult, WatchRecord } from "@/lib/types";

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] || char);
}

function majorityOutcomes(result: ScanResult) {
  const groups = new Map<string, boolean[]>();
  for (const row of result.observations.filter((item) => item.status === "success")) {
    const key = `${row.promptId}:${row.provider}`;
    groups.set(key, [...(groups.get(key) || []), row.ownRecommended]);
  }
  return new Map([...groups].map(([key, values]) => [key, values.filter(Boolean).length > values.length / 2]));
}

function changes(previous: ScanResult, latest: ScanResult) {
  const before = majorityOutcomes(previous); const after = majorityOutcomes(latest);
  let newWins = 0; let newLosses = 0;
  for (const [key, outcome] of after) {
    if (!before.has(key)) continue;
    if (!before.get(key) && outcome) newWins += 1;
    if (before.get(key) && !outcome) newLosses += 1;
  }
  const oldCitations = new Set(previous.observations.flatMap((item) => item.citations.map((citation) => citation.url)));
  const newCitationUrls = [...new Set(latest.observations.flatMap((item) => item.citations.map((citation) => citation.url)))].filter((url) => !oldCitations.has(url));
  return { coverageDelta: latest.recommendationCoverage - previous.recommendationCoverage, newWins, newLosses, newCitationUrls };
}

export async function sendWeeklyBrief(watch: WatchRecord, previous: ScanResult, latest: ScanResult) {
  if (!env.resendApiKey || !env.mailFrom || !watch.email) return { sent: false, reason: "email_not_configured" };
  const delta = changes(previous, latest);
  const brand = latest.discovery.brandName;
  const topLoss = latest.lostPrompts[0]; const topGap = latest.evidenceGaps[0]; const action = latest.actions[0];
  const workspaceUrl = `${env.siteUrl.replace(/\/$/, "")}/workspace?token=${encodeURIComponent(watch.token)}`;
  const sign = delta.coverageDelta > 0 ? "+" : "";
  const subject = `AIX Weekly · ${brand} · ${sign}${delta.coverageDelta}pt / 候補外変化 ${delta.newLosses}`;
  const html = `<!doctype html><html><body style="margin:0;background:#f4f7f6;font-family:Arial,'Noto Sans JP',sans-serif;color:#10212b"><div style="max-width:640px;margin:0 auto;padding:32px 18px"><div style="background:#081820;color:#eafff5;padding:26px;border-radius:14px 14px 0 0"><div style="font-size:11px;letter-spacing:.12em;color:#79e2b4;font-weight:700">AIX WEEKLY BUYER INTELLIGENCE</div><h1 style="font-size:24px;margin:10px 0 5px">${escapeHtml(brand)}</h1><p style="font-size:12px;color:#9eb3ae;margin:0">同じCore Panelで観測した前回との差です。因果効果を示すものではありません。</p></div><div style="background:#fff;padding:24px;border:1px solid #dde6e5;border-top:0"><table style="width:100%;border-collapse:collapse"><tr><td style="padding:10px;border-bottom:1px solid #edf1f0;font-size:11px">Recommendation Coverage</td><td style="padding:10px;border-bottom:1px solid #edf1f0;text-align:right;font-size:20px;font-weight:700">${latest.recommendationCoverage}% <span style="font-size:11px;color:#60736d">(${sign}${delta.coverageDelta}pt)</span></td></tr><tr><td style="padding:10px;border-bottom:1px solid #edf1f0;font-size:11px">新しく候補入り</td><td style="padding:10px;border-bottom:1px solid #edf1f0;text-align:right;font-weight:700">${delta.newWins}</td></tr><tr><td style="padding:10px;border-bottom:1px solid #edf1f0;font-size:11px">新しく候補外</td><td style="padding:10px;border-bottom:1px solid #edf1f0;text-align:right;font-weight:700">${delta.newLosses}</td></tr><tr><td style="padding:10px;font-size:11px">新しいCitation</td><td style="padding:10px;text-align:right;font-weight:700">${delta.newCitationUrls.length}</td></tr></table>${topLoss ? `<div style="margin-top:22px"><div style="font-size:9px;color:#7b8b87;font-weight:700">MOST IMPORTANT LOSS</div><h2 style="font-size:16px;line-height:1.5;margin:6px 0">「${escapeHtml(topLoss.prompt)}」</h2><p style="font-size:11px;line-height:1.7;color:#657670">${escapeHtml(topLoss.summary)}</p></div>` : ""}${topGap ? `<div style="margin-top:20px;padding:14px;background:#f3f7f5;border-left:3px solid #6db18e"><div style="font-size:9px;color:#607870;font-weight:700">比較材料（Evidence）</div><strong style="display:block;font-size:13px;margin-top:5px">${escapeHtml(topGap.label)}</strong><span style="font-size:10px;color:#71817c">${topGap.relatedPromptCount}件の追跡Promptと関連</span></div>` : ""}${action ? `<div style="margin-top:20px"><div style="font-size:9px;color:#7b8b87;font-weight:700">NEXT ACTION</div><strong style="display:block;font-size:14px;margin-top:5px">${escapeHtml(action.title)}</strong></div>` : ""}<a href="${escapeHtml(workspaceUrl)}" style="display:inline-block;margin-top:24px;background:#0b2b21;color:#fff;text-decoration:none;padding:12px 16px;border-radius:8px;font-size:12px;font-weight:700">AIX Workspaceで確認する</a><p style="margin:22px 0 0;font-size:9px;line-height:1.6;color:#899693">AIXは外部AIの順位・推薦・売上を保証しません。このメールは観測条件内の変化を要約しています。</p></div></div></body></html>`;
  const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { authorization: `Bearer ${env.resendApiKey}`, "content-type": "application/json" }, body: JSON.stringify({ from: env.mailFrom, to: [watch.email], subject, html }) });
  if (!response.ok) throw new Error(`Weekly brief delivery failed (${response.status}): ${(await response.text()).slice(0, 240)}`);
  return { sent: true };
}
