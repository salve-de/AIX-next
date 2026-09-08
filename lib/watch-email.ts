import { brandedEmailSender } from "@/lib/brand";
import "server-only";
import { northStarShare } from "@/lib/north-star";
import { compareMeasurementReadouts, measurementReadout } from "@/lib/measurement-readout";
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
  return result.observations.filter((observation) => observation.status === "success");
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
  const readout = measurementReadout(result);
  const observations = answerObservationCount(result);
  const subject = `[Rovan] ${brand}のAI推薦状況の追跡を開始しました`;
  const text = `${brand}のAI推薦状況の追跡を開始しました。\n\n予定質問パネル: ${result.panel.promptCount}問（v${result.panel.version}）\n自社が候補に含まれた質問: ${readout.label}\n候補外として記録された質問: ${readout.successful ? readout.excluded + " / " + readout.successful : "未測定"}\nAI回答観測: ${observations.successful} / ${observations.scheduled}件\n参照元URL: ${citationUrls(result).size}件\n\nこの通知は指定した質問・AI・日時の観測結果です。事業成果は測定していません。\n\n結果を見る: ${url}\n\n無料期間は14日で終了し、自動課金されません。`;
  const rows = [
    tableRow("予定質問パネル", `${result.panel.promptCount}問（v${result.panel.version}）`),
    tableRow("自社が候補に含まれた質問", `${readout.label}`),
    tableRow("候補外として記録された質問", `${readout.successful ? readout.excluded + " / " + readout.successful : "未測定"}`),
    tableRow("AI回答観測", `${observations.successful} / ${observations.scheduled}件`),
    tableRow("参照元URL", `${citationUrls(result).size}件`),
  ].join("");
  const html = `<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111827;line-height:1.65;max-width:620px"><p style="font-size:12px;letter-spacing:.08em;color:#64748b">Rovan</p><h1 style="font-size:24px;margin:8px 0 20px">${escapeHtml(brand)}のAI推薦状況の追跡を開始しました。</h1><table style="border-collapse:collapse;width:100%;margin:0 0 24px">${rows}</table><p style="font-size:13px;color:#475569">指定した質問・AI・日時の観測結果です。事業成果は測定していません。</p><p><a href="${escapeHtml(url)}" style="display:inline-block;background:#0b1b2a;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700">結果を見る</a></p><p style="font-size:12px;color:#64748b;margin-top:24px">無料期間は14日で終了し、自動課金されません。</p></div>`;
  return sendEmail({ to: watch.email, subject, text, html, idempotencyKey: `watch-start/${watch.id}` });
}

export async function sendWatchUpdate(watch: WatchRecord, previous: ScanResult, options: { trialEnded?: boolean } = {}) {
  const latest = watch.latest;
  const northStar = northStarShare(latest, watch.baseline);
  const northStarText = northStar.status === "short-panel"
    ? "AI顧客奪還シェア：50問パネルの測定開始後に記録します。"
    : `AI顧客奪還シェア（固定50問・実顧客シェアではありません）\n${northStar.providers.map((row) => `${row.provider}: ${row.value === null ? "未測定" : `${row.value}%`}（候補入り${row.included}/取得成功${row.successful}問、未取得・反復不足${row.missing}問）${row.comparison ? ` 同条件${row.comparison.count}問: ${row.comparison.before}% → ${row.comparison.after}%` : " 比較不可"}`).join("\n")}`;
  const brand = latest.discovery.brandName;
  const url = watchUrl(watch);
  const readout = compareMeasurementReadouts(previous, latest);
  const comparable = readout.comparable;
  const comparisonAvailable = comparable;
  const comparisonNote = readout.note.replace("初回（基準）", "前回");
  const previousIncluded = readout.before.included;
  const latestIncluded = readout.after.included;
  const newIncluded = readout.wins.length;
  const newlyExcludedCount = readout.losses.length;
  const previousCitations = citationUrls(previous);
  const latestCitations = citationUrls(latest);
  const addedCitations = [...latestCitations].filter((citation) => !previousCitations.has(citation)).length;
  const removedCitations = [...previousCitations].filter((citation) => !latestCitations.has(citation)).length;
  const previousObservations = answerObservationCount(previous);
  const latestObservations = answerObservationCount(latest);
  const observationCountChanged = previousObservations.successful !== latestObservations.successful
    || previousObservations.scheduled !== latestObservations.scheduled;
  const meaningfulChange = options.trialEnded
    || readout.meaningful
    || newIncluded > 0
    || newlyExcludedCount > 0
    || addedCitations > 0
    || removedCitations > 0
    || observationCountChanged;
  if (!meaningfulChange) return { sent: false as const, reason: "no_meaningful_change" as const };
  const notificationHeading = options.trialEnded
    ? `${brand}のAI推薦・自動見守りの無料トライアル期間が終了しました。`
    : !comparisonAvailable
      ? `${brand}のAI推薦状況を比較できませんでした。${comparisonNote}`
      : readout.answerChanged || newIncluded > 0 || newlyExcludedCount > 0
        ? `${brand}のAI推薦状況に変化がありました。`
        : `${brand}のAI回答の取得状況・参照元URLに変化がありました。`;
  const competitorText = readout.answerChanged ? `AI別の候補入り・比較候補の回答に変化があります。\n${readout.competitorMovements.filter((row) => row.name !== brand && (row.newcomer || row.departed || row.diff)).map((row) => `${row.name}: ${row.newcomer ? "新規候補" : row.departed ? "今回の回答では未出現" : `${row.baselineCoverage}% → ${row.latestCoverage}%`}`).join("\n")}\n詳細は測定ログを確認してください。` : "";
  const subject = `[Rovan] ${notificationHeading}`;
  const endNote = options.trialEnded ? "\n\n今回で14日間の無料トライアルが終了しました。自動課金はされません。" : "";
  const latestAction = watch.autoActions?.find((action) => (action.status === "planned" || action.status === "applied") && action.factValue && action.sourceUrl);
  const actionHeading = latestAction?.status === "applied" ? "Rovanの自動対処・完了報告" : "更新案を作成しました。まだ公開には反映していません。";
  const actionStatus = latestAction?.status === "applied" ? "AI推薦データを自動更新しました。許可された範囲で公開ページに反映済み。AI回答への影響は再測定で確認します。" : "公開前の確認待ち（未反映）";
  const actionTimestamp = latestAction?.status === "applied"
    ? `実行日時: ${latestAction.executedAt || "記録なし"}`
    : `案の作成日時: ${latestAction?.plannedAt || "記録なし"}`;
  const latestImpact = watch.autoActionImpacts?.[0];

  const autonomousText = latestAction
    ? `\n\n【${actionHeading}】\n保存済みの対処記録（過去の更新・案を含みます）\n・${actionTimestamp}\n・${latestAction.factLabel}: ${latestAction.factValue}\n・出典URL: ${latestAction.sourceUrl}\n・状態: ${actionStatus}\n`
    : "\n\n競合サイトの変更は、クロール前後差分が保存されていないため判定していません。\n";

  const impactText = comparisonAvailable && latestImpact
    ? `\n・再測定: 対象${latestImpact.affectedPromptCount}問${latestImpact.comparedAnswerGroups ? `・AI別${latestImpact.comparedAnswerGroups}件` : ""}の候補入り件数差分 ${signed(latestImpact.observedUplift)}件（因果効果は未検証）\n`
    : "";

  const autonomousHtml = latestAction
    ? `<div style="background:#f8fafc;border:1px solid #cbd5e1;border-radius:8px;padding:14px 18px;margin:20px 0;text-align:left"><strong style="color:#0f172a;font-size:14px">${actionHeading}</strong><p style="font-size:12px;color:#64748b">保存済みの対処記録（過去の更新・案を含みます）<br />${escapeHtml(actionTimestamp)}</p><p style="margin:8px 0 4px;font-size:13px;color:#334155"><strong>${escapeHtml(latestAction.factLabel)}:</strong> ${escapeHtml(latestAction.factValue)}</p><p style="margin:4px 0;font-size:13px;color:#334155"><strong>出典URL:</strong> ${escapeHtml(latestAction.sourceUrl)}</p><p style="margin:4px 0 0;font-size:12px;color:#64748b">状態: ${actionStatus}</p></div>`
    : `<p style="font-size:12px;color:#64748b;margin:20px 0">競合サイトの変更は、クロール前後差分が保存されていないため判定していません。</p>`;

  const text = `${notificationHeading}\n\n${comparisonAvailable ? `比較可能な質問パネル: ${latest.panel.promptCount}問（v${latest.panel.version}）\n自社が候補に含まれた質問: ${previousIncluded} → ${latestIncluded} / ${latest.panel.promptCount}\n候補外として記録された質問: ${readout.before.excluded} → ${readout.after.excluded} / ${latest.panel.promptCount}\n${newIncluded ? `新しく候補に含まれた質問: ${newIncluded}問\n` : ""}${newlyExcludedCount ? `新しく候補外になった質問: ${newlyExcludedCount}問\n` : ""}` : `比較不可: ${comparisonNote}\n自社の候補入り・候補外の変化: 未確定\n`}AI回答観測: ${latestObservations.successful} / ${latestObservations.scheduled}件\n${observationCountChanged ? `前回のAI回答観測: ${previousObservations.successful} / ${previousObservations.scheduled}件\n` : ""}${addedCitations || removedCitations ? `参照元URLの変化: 追加${addedCitations}件 / 削除${removedCitations}件\n` : ""}${impactText}${autonomousText}\nこの通知は指定した質問・AI・日時の観測結果です。事業成果は測定していません。\n結果を見る: ${url}${endNote}`;
  const rows = [
    tableRow("比較可能な質問パネル", comparisonAvailable ? `${latest.panel.promptCount}問（v${latest.panel.version}）` : `比較不可：${comparisonNote}`),
    tableRow("自社が候補に含まれた質問", comparisonAvailable ? `${previousIncluded} → ${latestIncluded} / ${latest.panel.promptCount}` : "未確定"),
    tableRow("候補外として記録された質問", comparisonAvailable ? `${readout.before.excluded} → ${readout.after.excluded} / ${latest.panel.promptCount}` : "未確定"),
    tableRow("AI回答観測", `${latestObservations.successful} / ${latestObservations.scheduled}件`),
    ...(addedCitations || removedCitations ? [tableRow("参照元URLの変化", `追加${addedCitations}件 / 削除${removedCitations}件`)] : []),
  ].join("");
  const impactHtml = comparisonAvailable && latestImpact
    ? `<p style="margin:4px 0;font-size:13px;color:#334155"><strong>再測定:</strong> 対象${latestImpact.affectedPromptCount}問${latestImpact.comparedAnswerGroups ? `・AI別${latestImpact.comparedAnswerGroups}件` : ""}の候補入り件数差分 ${signed(latestImpact.observedUplift)}件（因果効果は未検証）</p>`
    : "";
  const html = `<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111827;line-height:1.65;max-width:620px"><p style="font-size:12px;letter-spacing:.08em;color:#64748b">Rovan</p><h1 style="font-size:24px;margin:8px 0 20px">${escapeHtml(notificationHeading)}</h1><table style="border-collapse:collapse;width:100%;margin:0 0 24px">${rows}</table>${impactHtml}${autonomousHtml}<p style="font-size:13px;color:#475569">指定した質問・AI・日時の観測結果です。事業成果は測定していません。</p><p><a href="${escapeHtml(url)}" style="display:inline-block;background:#0b1b2a;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700">結果を見る</a></p>${options.trialEnded ? '<p style="font-size:12px;color:#64748b;margin-top:24px">今回で14日間の無料トライアルが終了しました。自動課金はされません。</p>' : ""}</div>`;
  const readoutText = `前回（${previous.measuredAt}）: ${readout.before.label}\n今回（${latest.measuredAt}）: ${readout.after.label}\n${competitorText}\n通知解除・通知先変更: ${url}`;
  return sendEmail({ to: watch.email, subject, text: `${northStarText}\n\n${readoutText}\n\n${text}`, html: `<p style="white-space:pre-line">${escapeHtml(northStarText)}<br />${escapeHtml(readoutText)}</p><p><a href="${escapeHtml(url)}">通知解除・通知先変更</a></p>${html}`, idempotencyKey: `watch-update/${watch.id}/${shortHash(latest.measuredAt)}` });
}
