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

function newlyLost(previous: ScanResult, latest: ScanResult) {
  if (previous.panel.kind !== latest.panel.kind || previous.panel.version !== latest.panel.version || previous.panel.promptCount !== latest.panel.promptCount) return 0;
  const previousLost = new Set(previous.lostPrompts.map((item) => item.promptId));
  const latestLost = new Set(latest.lostPrompts.map((item) => item.promptId));
  return [...latestLost].filter((promptId) => !previousLost.has(promptId)).length;
}

function firstCompetitor(result: ScanResult) {
  return result.competitors.find((item) => item.firstChoiceCount > 0)?.name || result.competitors[0]?.name || null;
}

async function sendEmail(input: { to: string; subject: string; text: string; html: string; idempotencyKey: string }) {
  if (!input.to || !input.to.trim()) return { sent: false as const, reason: "no_recipient" };
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
  const subject = `[AIX] ${brand}のAI推薦を再確認します`;
  const text = `${brand}のAI推薦を再確認します。\n\nAIの推薦順位: ${result.marketPosition}位 / ${result.marketSize}社\nAIに選ばれた質問: ${shortlisted} / ${result.panel.promptCount}\nまだ競合が先の質問: ${result.lostPrompts.length} / ${result.panel.promptCount}\n\n結果を見る: ${url}\n\n無料期間は14日で終了し、自動課金されません。`;
  const html = `<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111827;line-height:1.65;max-width:620px"><p style="font-size:12px;letter-spacing:.08em;color:#64748b">AIX</p><h1 style="font-size:24px;margin:8px 0 20px">${escapeHtml(brand)}のAI推薦を再確認します。</h1><table style="border-collapse:collapse;width:100%;margin:0 0 24px"><tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0">AIの推薦順位</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700">${result.marketPosition}位 / ${result.marketSize}社</td></tr><tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0">AIに選ばれた質問</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700">${shortlisted} / ${result.panel.promptCount}</td></tr><tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0">まだ競合が先の質問</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700">${result.lostPrompts.length} / ${result.panel.promptCount}</td></tr></table><p><a href="${escapeHtml(url)}" style="display:inline-block;background:#0b1b2a;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700">結果を見る</a></p><p style="font-size:12px;color:#64748b;margin-top:24px">無料期間は14日で終了し、自動課金されません。</p></div>`;
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
  const newLosses = comparable ? newlyLost(previous, latest) : 0;
  const previousCitations = new Set(previous.observations.flatMap((item) => item.citations.map((citation) => citation.url)));
  const latestCitations = new Set(latest.observations.flatMap((item) => item.citations.map((citation) => citation.url)));
  const newCitations = [...latestCitations].filter((url) => !previousCitations.has(url)).length;
  const leaderChanged = comparable && firstCompetitor(previous) !== firstCompetitor(latest);
  const meaningfulChange = options.trialEnded || !comparable || newWins > 0 || newLosses > 0 || newCitations > 0 || (comparable && previous.marketPosition !== latest.marketPosition) || leaderChanged;
  if (!meaningfulChange) return { sent: false as const, reason: "no_meaningful_change" as const };
  const subject = comparable ? `[AIX] ${brand}: AIの推薦 ${previous.marketPosition}位 → ${latest.marketPosition}位` : `[AIX] ${brand}: 今回の結果を新しい基準にしました`;
  const endNote = options.trialEnded ? "\n\n今回で14日間の無料確認が終了しました。自動課金はされません。" : "";
  const latestEvent = watch.competitorEvents?.[0];
  const latestAction = watch.autoActions?.[0];
  const latestImpact = watch.autoActionImpacts?.[0];

  const autonomousText = latestAction
    ? `\n\n【AIXの自律防衛（御社作業ゼロ）】\n・検知した競合の動き: ${latestEvent ? latestEvent.summary : "競合の強み訴求の強化"}\n・AIXの対応: ${latestAction.summary}\n${latestImpact ? `・再測定結果: ${latestImpact.summary}\n` : ""}・次回予定: 関連質問のAI推薦状況を自動継続監視します\n`
    : "";

  const autonomousHtml = latestAction
    ? `<div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;padding:14px 18px;margin:20px 0;text-align:left"><strong style="color:#0f172a;font-size:14px">🛡️ AIXによる自律防衛（御社作業：完全ゼロ）</strong><p style="margin:8px 0 4px;font-size:13px;color:#334155"><strong>検知した競合の動き:</strong> ${escapeHtml(latestEvent ? latestEvent.summary : "競合の強み訴求の強化")}</p><p style="margin:4px 0 4px;font-size:13px;color:#0369a1"><strong>AIXの自動対処:</strong> ${escapeHtml(latestAction.summary)}</p>${latestImpact ? `<p style="margin:4px 0 4px;font-size:13px;color:#16a34a"><strong>再測定成果:</strong> ${escapeHtml(latestImpact.summary)}</p>` : ""}<p style="margin:4px 0 0;font-size:12px;color:#64748b">※御社公式サイトの確認済み事実のみを用いてAI参照インデックスを自動同期しました。架空の作文は一切含まれていません。</p></div>`
    : "";

  const text = `${brand}のAI推薦で変化がありました。\n\nAIの推薦順位: ${comparable ? `${previous.marketPosition}位 → ` : ""}${latest.marketPosition}位 / ${latest.marketSize}社\nAIに選ばれた質問: ${comparable ? `${previousShortlisted} → ` : ""}${latestShortlisted} / ${latest.panel.promptCount}\nまだ競合が先の質問: ${comparable ? `${previous.lostPrompts.length} → ` : ""}${latest.lostPrompts.length} / ${latest.panel.promptCount}\n${newWins ? `新しく候補に入った質問: ${newWins}問\n` : ""}${newLosses ? `新しく候補から外れた質問: ${newLosses}問\n` : ""}${newCitations ? `新しく参照されたページ: ${newCitations}件\n` : ""}${leaderChanged ? `先に選ばれた競合: ${firstCompetitor(previous) || "—"} → ${firstCompetitor(latest) || "—"}\n` : ""}${autonomousText}\n結果を見る: ${url}${endNote}`;
  const html = `<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111827;line-height:1.65;max-width:620px"><p style="font-size:12px;letter-spacing:.08em;color:#64748b">AIX</p><h1 style="font-size:24px;margin:8px 0 20px">${escapeHtml(brand)}のAI推薦で変化がありました。</h1><table style="border-collapse:collapse;width:100%;margin:0 0 24px"><tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0">AIの推薦順位</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700">${comparable ? `${previous.marketPosition}位 → ` : ""}${latest.marketPosition}位 / ${latest.marketSize}社</td></tr><tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0">AIに選ばれた質問</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700">${comparable ? `${previousShortlisted} → ` : ""}${latestShortlisted} / ${latest.panel.promptCount}</td></tr><tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0">まだ競合が先の質問</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700">${comparable ? `${previous.lostPrompts.length} → ` : ""}${latest.lostPrompts.length} / ${latest.panel.promptCount}</td></tr>${newWins ? `<tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0">新しく候補に入った質問</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700">${newWins}問</td></tr>` : ""}${newLosses ? `<tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0">新しく候補から外れた質問</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700">${newLosses}問</td></tr>` : ""}${newCitations ? `<tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0">新しく参照されたページ</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700">${newCitations}件</td></tr>` : ""}</table>${autonomousHtml}<p><a href="${escapeHtml(url)}" style="display:inline-block;background:#0b1b2a;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700">結果を見る</a></p>${options.trialEnded ? '<p style="font-size:12px;color:#64748b;margin-top:24px">今回で14日間の無料確認が終了しました。自動課金はされません。</p>' : ""}</div>`;
  return sendEmail({ to: watch.email, subject, text, html, idempotencyKey: `watch-update/${watch.id}/${shortHash(latest.measuredAt)}` });
}
