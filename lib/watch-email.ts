import "server-only";
import { env } from "@/lib/env";
import { shortHash } from "@/lib/ids";
import type { ScanResult, WatchRecord } from "@/lib/types";

const HTML_ESCAPE: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => HTML_ESCAPE[character] || character);
}

function cleanSubject(value: string) {
  return value.replace(/[\r\n]+/g, " ").trim().slice(0, 160);
}

function watchUrl(watch: WatchRecord) {
  return `${env.siteUrl.replace(/\/$/, "")}/watch?token=${encodeURIComponent(watch.token)}`;
}

function shortlistedPromptCount(result: ScanResult) {
  return Math.max(0, result.panel.promptCount - result.lostPrompts.length);
}

function newlyShortlisted(previous: ScanResult, latest: ScanResult) {
  if (previous.panel.kind !== latest.panel.kind || previous.panel.version !== latest.panel.version || previous.panel.promptCount !== latest.panel.promptCount) return 0;
  const previousLost = new Set(previous.lostPrompts.map((item) => item.promptId));
  const latestLost = new Set(latest.lostPrompts.map((item) => item.promptId));
  return [...previousLost].filter((promptId) => !latestLost.has(promptId)).length;
}

async function sendEmail(input: { to: string; subject: string; text: string; html: string; idempotencyKey: string }) {
  if (!env.resendApiKey || !env.watchFromEmail) return { sent: false as const, reason: "unconfigured" };
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.resendApiKey}`,
        "content-type": "application/json",
        "idempotency-key": input.idempotencyKey.slice(0, 256),
      },
      body: JSON.stringify({ from: env.watchFromEmail, to: [input.to], subject: cleanSubject(input.subject), text: input.text, html: input.html }),
    });
    if (!response.ok) {
      const body = await response.text();
      console.error("Watch email delivery failed", response.status, body.slice(0, 240));
      return { sent: false as const, reason: `resend_${response.status}` };
    }
    const data = await response.json().catch(() => ({})) as { id?: string };
    return { sent: true as const, id: data.id || "sent" };
  } catch (error) {
    console.error("Watch email delivery failed", error instanceof Error ? error.message : String(error));
    return { sent: false as const, reason: "network_error" };
  }
}

export async function sendWatchStarted(watch: WatchRecord) {
  const result = watch.latest;
  const brand = result.discovery.brandName;
  const url = watchUrl(watch);
  const shortlisted = shortlistedPromptCount(result);
  const subject = `[AIX] ${brand}の14日無料Watchを開始しました`;
  const text = `${brand}のAIX Watchを開始しました。\n\nAI比較での順位: ${result.marketPosition} / ${result.marketSize}\n候補に入った購買質問: ${shortlisted} / ${result.panel.promptCount}\n候補外になった購買質問: ${result.lostPrompts.length} / ${result.panel.promptCount}\n\nWatchを開く: ${url}\n\n無料Watchは14日で終了し、自動課金されません。`;
  const html = `<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111827;line-height:1.65;max-width:620px"><p style="font-size:12px;letter-spacing:.08em;color:#64748b">AIX WATCH</p><h1 style="font-size:24px;margin:8px 0 20px">${escapeHtml(brand)}の14日無料Watchを開始しました。</h1><table style="border-collapse:collapse;width:100%;margin:0 0 24px"><tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0">AI比較での順位</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700">${result.marketPosition} / ${result.marketSize}</td></tr><tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0">候補に入った購買質問</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700">${shortlisted} / ${result.panel.promptCount}</td></tr><tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0">候補外になった購買質問</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700">${result.lostPrompts.length} / ${result.panel.promptCount}</td></tr></table><p><a href="${escapeHtml(url)}" style="display:inline-block;background:#0b1b2a;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700">Watchを開く</a></p><p style="font-size:12px;color:#64748b;margin-top:24px">無料Watchは14日で終了し、自動課金されません。</p></div>`;
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
  const subject = comparable ? `[AIX] ${brand}: AI比較 ${previous.marketPosition}位 → ${latest.marketPosition}位` : `[AIX] ${brand}: 新しい測定Baselineを作成しました`;
  const endNote = options.trialEnded ? "\n\n今回で14日無料Watchは終了しました。継続監視はWatch画面から開始できます。" : "";
  const text = `${brand}のAIX Watchを更新しました。\n\nAI比較での順位: ${comparable ? `${previous.marketPosition}位 → ` : ""}${latest.marketPosition}位 / ${latest.marketSize}社\n候補に入った購買質問: ${comparable ? `${previousShortlisted} → ` : ""}${latestShortlisted} / ${latest.panel.promptCount}\n候補外になった購買質問: ${comparable ? `${previous.lostPrompts.length} → ` : ""}${latest.lostPrompts.length} / ${latest.panel.promptCount}\n${comparable ? `新しく候補入り: +${newWins}質問\n` : ""}\nWatchを開く: ${url}${endNote}`;
  const html = `<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111827;line-height:1.65;max-width:620px"><p style="font-size:12px;letter-spacing:.08em;color:#64748b">AIX WATCH UPDATE</p><h1 style="font-size:24px;margin:8px 0 20px">${escapeHtml(brand)}の測定結果が更新されました。</h1><table style="border-collapse:collapse;width:100%;margin:0 0 24px"><tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0">AI比較での順位</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700">${comparable ? `${previous.marketPosition}位 → ` : ""}${latest.marketPosition}位 / ${latest.marketSize}社</td></tr><tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0">候補に入った購買質問</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700">${comparable ? `${previousShortlisted} → ` : ""}${latestShortlisted} / ${latest.panel.promptCount}</td></tr><tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0">候補外になった購買質問</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700">${comparable ? `${previous.lostPrompts.length} → ` : ""}${latest.lostPrompts.length} / ${latest.panel.promptCount}</td></tr>${comparable ? `<tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0">新しく候補入り</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700">+${newWins}質問</td></tr>` : ""}</table><p><a href="${escapeHtml(url)}" style="display:inline-block;background:#0b1b2a;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700">Watchを開く</a></p>${options.trialEnded ? '<p style="font-size:12px;color:#64748b;margin-top:24px">今回で14日無料Watchは終了しました。自動課金はされません。</p>' : ""}</div>`;
  return sendEmail({ to: watch.email, subject, text, html, idempotencyKey: `watch-update/${watch.id}/${shortHash(latest.measuredAt)}` });
}
