import "server-only";
import { env } from "@/lib/env";
import { shortHash } from "@/lib/ids";
import type { ScanResult, WatchRecord } from "@/lib/types";

const HTML_ESCAPE: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

function escapeHtml(value: string) { return value.replace(/[&<>"']/g, (character) => HTML_ESCAPE[character] || character); }
function cleanSubject(value: string) { return value.replace(/[\r\n]+/g, " ").trim().slice(0, 160); }
function watchUrl(watch: WatchRecord) { return `${env.siteUrl.replace(/\/$/, "")}/watch?token=${encodeURIComponent(watch.token)}`; }
function shortlistedPromptCount(result: ScanResult) { return Math.max(0, result.panel.promptCount - result.lostPrompts.length); }
function newlyShortlisted(previous: ScanResult, latest: ScanResult) {
  if (previous.panel.kind !== latest.panel.kind || previous.panel.version !== latest.panel.version || previous.panel.promptCount !== latest.panel.promptCount) return 0;
  const previousLost = new Set(previous.lostPrompts.map((item) => item.promptId));
  const latestLost = new Set(latest.lostPrompts.map((item) => item.promptId));
  return [...previousLost].filter((promptId) => !latestLost.has(promptId)).length;
}

async function sendEmail(input: { to: string; subject: string; text: string; html: string; idempotencyKey: string }) {
  if (!env.resendApiKey || !env.watchFromEmail) return { sent: false as const, reason: "unconfigured" };
  try {
    const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { authorization: `Bearer ${env.resendApiKey}`, "content-type": "application/json", "idempotency-key": input.idempotencyKey.slice(0, 256) }, body: JSON.stringify({ from: env.watchFromEmail, to: [input.to], subject: cleanSubject(input.subject), text: input.text, html: input.html }) });
    if (!response.ok) { console.error("AIX monitoring email failed", response.status, (await response.text()).slice(0, 240)); return { sent: false as const, reason: `resend_${response.status}` }; }
    const data = await response.json().catch(() => ({})) as { id?: string };
    return { sent: true as const, id: data.id || "sent" };
  } catch (error) {
    console.error("AIX monitoring email failed", error instanceof Error ? error.message : String(error));
    return { sent: false as const, reason: "network_error" };
  }
}

export async function sendWatchStarted(watch: WatchRecord) {
  const result = watch.latest;
  const brand = result.discovery.brandName;
  const url = watchUrl(watch);
  const shortlisted = shortlistedPromptCount(result);
  const subject = `[AIX] ${brand}の14日間無料モニタリングを開始しました`;
  const text = `${brand}の継続モニタリングを開始しました。\n\nAI比較での位置: ${result.marketPosition} / ${result.marketSize}\n候補入り質問: ${shortlisted} / ${result.panel.promptCount}\n候補外質問: ${result.lostPrompts.length} / ${result.panel.promptCount}\n\n結果を開く: ${url}\n\n無料期間は14日で終了し、自動課金されません。`;
  const html = `<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#13212c;line-height:1.65;max-width:620px"><p style="font-size:12px;color:#64748b">AIX · 14日間無料モニタリング</p><h1 style="font-size:24px;margin:8px 0 20px">${escapeHtml(brand)}の変化を追跡します。</h1><table style="border-collapse:collapse;width:100%;margin:0 0 24px"><tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0">AI比較での位置</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700">${result.marketPosition} / ${result.marketSize}</td></tr><tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0">候補入り質問</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700">${shortlisted} / ${result.panel.promptCount}</td></tr><tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0">候補外質問</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700">${result.lostPrompts.length} / ${result.panel.promptCount}</td></tr></table><p><a href="${escapeHtml(url)}" style="display:inline-block;background:#0b1720;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700">モニタリングを開く</a></p><p style="font-size:12px;color:#64748b;margin-top:24px">14日後に終了し、自動課金されません。</p></div>`;
  return sendEmail({ to: watch.email, subject, text, html, idempotencyKey: `watch-start/${watch.id}` });
}

export async function sendWatchUpdate(watch: WatchRecord, previous: ScanResult, options: { trialEnded?: boolean } = {}) {
  const latest = watch.latest;
  const brand = latest.discovery.brandName;
  const url = watchUrl(watch);
  const comparable = previous.panel.kind === latest.panel.kind && previous.panel.version === latest.panel.version && previous.panel.promptCount === latest.panel.promptCount;
  const previousShortlisted = shortlistedPromptCount(previous);
  const latestShortlisted = shortlistedPromptCount(latest);
  const newWins = comparable ? newlyShortlisted(previous, latest) : 0;
  const subject = comparable ? `[AIX] ${brand}: AI比較 ${previous.marketPosition}位 → ${latest.marketPosition}位` : `[AIX] ${brand}: 新しい基準値を作成しました`;
  const endNote = options.trialEnded ? "\n\n今回で14日間の無料モニタリングは終了しました。継続する場合だけAIX Monitorを開始してください。" : "";
  const text = `${brand}の測定結果を更新しました。\n\nAI比較での位置: ${comparable ? `${previous.marketPosition}位 → ` : ""}${latest.marketPosition}位 / ${latest.marketSize}社\n候補入り質問: ${comparable ? `${previousShortlisted} → ` : ""}${latestShortlisted} / ${latest.panel.promptCount}\n候補外質問: ${comparable ? `${previous.lostPrompts.length} → ` : ""}${latest.lostPrompts.length} / ${latest.panel.promptCount}\n${comparable ? `新しく候補入り: +${newWins}質問\n` : ""}\n結果を開く: ${url}${endNote}`;
  const html = `<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#13212c;line-height:1.65;max-width:620px"><p style="font-size:12px;color:#64748b">AIX · 測定更新</p><h1 style="font-size:24px;margin:8px 0 20px">${escapeHtml(brand)}の比較結果が更新されました。</h1><table style="border-collapse:collapse;width:100%;margin:0 0 24px"><tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0">AI比較での位置</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700">${comparable ? `${previous.marketPosition}位 → ` : ""}${latest.marketPosition}位 / ${latest.marketSize}社</td></tr><tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0">候補入り質問</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700">${comparable ? `${previousShortlisted} → ` : ""}${latestShortlisted} / ${latest.panel.promptCount}</td></tr><tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0">候補外質問</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700">${comparable ? `${previous.lostPrompts.length} → ` : ""}${latest.lostPrompts.length} / ${latest.panel.promptCount}</td></tr>${comparable ? `<tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0">新しく候補入り</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700">+${newWins}質問</td></tr>` : ""}</table><p><a href="${escapeHtml(url)}" style="display:inline-block;background:#0b1720;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700">結果を確認</a></p>${options.trialEnded ? '<p style="font-size:12px;color:#64748b;margin-top:24px">今回で14日間の無料モニタリングは終了しました。自動課金はされません。</p>' : ""}</div>`;
  return sendEmail({ to: watch.email, subject, text, html, idempotencyKey: `watch-update/${watch.id}/${shortHash(latest.measuredAt)}` });
}
