import { brandedEmailSender } from "@/lib/brand";
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

function countableObservation(result: ScanResult) {
  return result.observations.filter((observation) => !observation.status || observation.status === "success");
}

function candidateInclusionPromptIds(result: ScanResult) {
  return new Set(
    countableObservation(result)
      .filter((observation) => observation.ownRecommended)
      .map((observation) => observation.promptId)
  );
}

function candidateInclusionCount(result: ScanResult) {
  return candidateInclusionPromptIds(result).size;
}

function answerObservationCount(result: ScanResult) {
  const successful = countableObservation(result).length;
  const scheduled = Math.max(result.scheduledObservations || 0, successful);
  return { successful, scheduled };
}

function citationUrls(result: ScanResult) {
  return new Set(
    countableObservation(result)
      .flatMap((observation) => observation.citations || [])
      .map((citation) => citation.url || citation.domain)
      .filter(Boolean)
  );
}

function comparablePanel(previous: ScanResult, latest: ScanResult) {
  return previous.panel.kind === latest.panel.kind
    && previous.panel.version === latest.panel.version
    && previous.panel.promptCount === latest.panel.promptCount
    && previous.panel.repetitions === latest.panel.repetitions
    && previous.panel.locale === latest.panel.locale
    && previous.panel.country === latest.panel.country;
}

function newlyIncluded(previous: ScanResult, latest: ScanResult) {
  if (!comparablePanel(previous, latest)) return 0;
  const previousIds = candidateInclusionPromptIds(previous);
  return [...candidateInclusionPromptIds(latest)].filter((promptId) => !previousIds.has(promptId)).length;
}

function newlyExcluded(previous: ScanResult, latest: ScanResult) {
  if (!comparablePanel(previous, latest)) return 0;
  const latestIds = candidateInclusionPromptIds(latest);
  return [...candidateInclusionPromptIds(previous)].filter((promptId) => !latestIds.has(promptId)).length;
}

function tableRow(label: string, value: string) {
  return `<tr><td style="padding:10px 0;border-bottom:1px solid #e2e8f0">${escapeHtml(label)}</td><td style="padding:10px 0;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700">${escapeHtml(value)}</td></tr>`;
}

function signed(value: number) {
  return `${value >= 0 ? "+" : ""}${value}`;
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
      body: JSON.stringify({ from: brandedEmailSender(env.watchFromEmail), to: [input.to], subject: cleanSubject(input.subject), text: input.text, html: input.html }),
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
  const included = candidateInclusionCount(result);
  const observations = answerObservationCount(result);
  const subject = `[Rovan] ${brand}のAI回答測定を開始しました`;
  const text = `${brand}の週次AI回答測定を開始しました。\n\n比較可能な質問パネル: ${result.panel.promptCount}問（v${result.panel.version}）\n自社が候補に含まれた質問: ${included} / ${result.panel.promptCount}\n候補外として記録された質問: ${result.lostPrompts.length} / ${result.panel.promptCount}\nAI回答観測: ${observations.successful} / ${observations.scheduled}件\n参照元URL: ${citationUrls(result).size}件\n\nこの通知は指定した質問・AI・日時の観測結果です。事業成果は測定していません。\n\n結果を見る: ${url}\n\n無料期間は14日で終了し、自動課金されません。`;
  const rows = [
    tableRow("比較可能な質問パネル", `${result.panel.promptCount}問（v${result.panel.version}）`),
    tableRow("自社が候補に含まれた質問", `${included} / ${result.panel.promptCount}`),
    tableRow("候補外として記録された質問", `${result.lostPrompts.length} / ${result.panel.promptCount}`),
    tableRow("AI回答観測", `${observations.successful} / ${observations.scheduled}件`),
    tableRow("参照元URL", `${citationUrls(result).size}件`),
  ].join("");
  const html = `<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111827;line-height:1.65;max-width:620px"><p style="font-size:12px;letter-spacing:.08em;color:#64748b">Rovan</p><h1 style="font-size:24px;margin:8px 0 20px">${escapeHtml(brand)}のAI回答測定を開始しました。</h1><table style="border-collapse:collapse;width:100%;margin:0 0 24px">${rows}</table><p style="font-size:13px;color:#475569">指定した質問・AI・日時の観測結果です。事業成果は測定していません。</p><p><a href="${escapeHtml(url)}" style="display:inline-block;background:#0b1b2a;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700">結果を見る</a></p><p style="font-size:12px;color:#64748b;margin-top:24px">無料期間は14日で終了し、自動課金されません。</p></div>`;
  return sendEmail({ to: watch.email, subject, text, html, idempotencyKey: `watch-start/${watch.id}` });
}

export async function sendWatchUpdate(watch: WatchRecord, previous: ScanResult, options: { trialEnded?: boolean } = {}) {
  const latest = watch.latest;
  const brand = latest.discovery.brandName;
  const url = watchUrl(watch);
  const comparable = comparablePanel(previous, latest);
  const previousIncluded = candidateInclusionCount(previous);
  const latestIncluded = candidateInclusionCount(latest);
  const newIncluded = comparable ? newlyIncluded(previous, latest) : 0;
  const newlyExcludedCount = comparable ? newlyExcluded(previous, latest) : 0;
  const previousCitations = citationUrls(previous);
  const latestCitations = citationUrls(latest);
  const addedCitations = [...latestCitations].filter((citation) => !previousCitations.has(citation)).length;
  const removedCitations = [...previousCitations].filter((citation) => !latestCitations.has(citation)).length;
  const previousObservations = answerObservationCount(previous);
  const latestObservations = answerObservationCount(latest);
  const observationCountChanged = previousObservations.successful !== latestObservations.successful
    || previousObservations.scheduled !== latestObservations.scheduled;
  const meaningfulChange = options.trialEnded
    || !comparable
    || newIncluded > 0
    || newlyExcludedCount > 0
    || addedCitations > 0
    || removedCitations > 0
    || observationCountChanged;
  if (!meaningfulChange) return { sent: false as const, reason: "no_meaningful_change" as const };
  const subject = options.trialEnded
    ? `[Rovan] ${brand}: AI回答測定の無料確認期間が終了しました`
    : comparable
      ? `[Rovan] ${brand}: AI回答測定に変化がありました`
      : `[Rovan] ${brand}: 比較可能な質問パネルを更新しました`;
  const endNote = options.trialEnded ? "\n\n今回で14日間の無料確認が終了しました。自動課金はされません。" : "";
  const latestAction = watch.autoActions?.find((action) => action.status === "planned" && action.factValue && action.sourceUrl);
  const latestImpact = watch.autoActionImpacts?.[0];

  const autonomousText = latestAction
    ? `\n\n【公開前の確認案】\n・自社ページの原文スニペット: 「${latestAction.factValue}」\n・出典URL: ${latestAction.sourceUrl}\n・状態: 公開前の確認待ち（自動反映なし）\n`
    : "\n\n競合サイトの変更は、クロール前後差分が保存されていないため判定していません。\n";

  const impactText = latestImpact
    ? `\n・再測定: 対象${latestImpact.affectedPromptCount}問の候補入り件数差分 ${signed(latestImpact.observedUplift)}件（因果効果は未検証）\n`
    : "";

  const autonomousHtml = latestAction
    ? `<div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;padding:14px 18px;margin:20px 0;text-align:left"><strong style="color:#0f172a;font-size:14px">公開前の確認案</strong><p style="margin:8px 0 4px;font-size:13px;color:#334155"><strong>自社ページの原文スニペット:</strong> 「${escapeHtml(latestAction.factValue)}」</p><p style="margin:4px 0;font-size:13px;color:#334155"><strong>出典URL:</strong> ${escapeHtml(latestAction.sourceUrl)}</p><p style="margin:4px 0 0;font-size:12px;color:#64748b">状態: 公開前の確認待ち（自動反映なし）</p></div>`
    : `<p style="font-size:12px;color:#64748b;margin:20px 0">競合サイトの変更は、クロール前後差分が保存されていないため判定していません。</p>`;

  const text = `${brand}のAI回答測定に変化がありました。\n\n${comparable ? `比較可能な質問パネル: ${latest.panel.promptCount}問（v${latest.panel.version}）\n自社が候補に含まれた質問: ${previousIncluded} → ${latestIncluded} / ${latest.panel.promptCount}\n候補外として記録された質問: ${previous.lostPrompts.length} → ${latest.lostPrompts.length} / ${latest.panel.promptCount}\n${newIncluded ? `新しく候補に含まれた質問: ${newIncluded}問\n` : ""}${newlyExcludedCount ? `新しく候補外になった質問: ${newlyExcludedCount}問\n` : ""}` : `比較可能な質問パネル: 前回と条件が異なるため、今回を新しい基準として記録\n自社が候補に含まれた質問: ${latestIncluded} / ${latest.panel.promptCount}\n候補外として記録された質問: ${latest.lostPrompts.length} / ${latest.panel.promptCount}\n`}AI回答観測: ${latestObservations.successful} / ${latestObservations.scheduled}件\n${observationCountChanged ? `前回のAI回答観測: ${previousObservations.successful} / ${previousObservations.scheduled}件\n` : ""}${addedCitations || removedCitations ? `参照元URLの変化: 追加${addedCitations}件 / 削除${removedCitations}件\n` : ""}${impactText}${autonomousText}\nこの通知は指定した質問・AI・日時の観測結果です。事業成果は測定していません。\n結果を見る: ${url}${endNote}`;
  const rows = [
    tableRow("比較可能な質問パネル", comparable ? `${latest.panel.promptCount}問（v${latest.panel.version}）` : "今回を新しい基準として記録"),
    tableRow("自社が候補に含まれた質問", comparable ? `${previousIncluded} → ${latestIncluded} / ${latest.panel.promptCount}` : `${latestIncluded} / ${latest.panel.promptCount}`),
    tableRow("候補外として記録された質問", comparable ? `${previous.lostPrompts.length} → ${latest.lostPrompts.length} / ${latest.panel.promptCount}` : `${latest.lostPrompts.length} / ${latest.panel.promptCount}`),
    tableRow("AI回答観測", `${latestObservations.successful} / ${latestObservations.scheduled}件`),
    ...(addedCitations || removedCitations ? [tableRow("参照元URLの変化", `追加${addedCitations}件 / 削除${removedCitations}件`)] : []),
  ].join("");
  const impactHtml = latestImpact
    ? `<p style="margin:4px 0;font-size:13px;color:#334155"><strong>再測定:</strong> 対象${latestImpact.affectedPromptCount}問の候補入り件数差分 ${signed(latestImpact.observedUplift)}件（因果効果は未検証）</p>`
    : "";
  const html = `<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111827;line-height:1.65;max-width:620px"><p style="font-size:12px;letter-spacing:.08em;color:#64748b">Rovan</p><h1 style="font-size:24px;margin:8px 0 20px">${escapeHtml(brand)}のAI回答測定に変化がありました。</h1><table style="border-collapse:collapse;width:100%;margin:0 0 24px">${rows}</table>${impactHtml}${autonomousHtml}<p style="font-size:13px;color:#475569">指定した質問・AI・日時の観測結果です。事業成果は測定していません。</p><p><a href="${escapeHtml(url)}" style="display:inline-block;background:#0b1b2a;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700">結果を見る</a></p>${options.trialEnded ? '<p style="font-size:12px;color:#64748b;margin-top:24px">今回で14日間の無料確認が終了しました。自動課金はされません。</p>' : ""}</div>`;
  return sendEmail({ to: watch.email, subject, text, html, idempotencyKey: `watch-update/${watch.id}/${shortHash(latest.measuredAt)}` });
}
