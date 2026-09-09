import "server-only";
import { brandedEmailSender } from "@/lib/brand";
import { getBuyingAudit } from "@/lib/buying-audit-core";
import { env } from "@/lib/env";
import type { WatchRecord } from "@/lib/types";

const HTML_ESCAPE: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => HTML_ESCAPE[character] || character);
}

function watchUrl(watch: WatchRecord) {
  return `${env.siteUrl.replace(/\/$/u, "")}/watch?token=${encodeURIComponent(watch.token)}`;
}

export async function sendBuyingAuditAlert(watch: WatchRecord) {
  const audit = getBuyingAudit(watch.latest);
  if (!audit) return { sent: false as const, reason: "no_audit" };
  const actionable = audit.alerts.filter((alert) => ["candidate_drop", "new_fact_error", "new_competitor"].includes(alert.kind));
  if (!actionable.length) return { sent: false as const, reason: "no_new_risk" };
  if (!watch.email?.trim()) return { sent: false as const, reason: "no_recipient" };
  if (!env.resendApiKey || !env.watchFromEmail) return { sent: false as const, reason: "unconfigured" };

  const brand = watch.latest.discovery.brandName;
  const url = watchUrl(watch);
  const critical = actionable.filter((alert) => alert.severity === "critical" || alert.severity === "high");
  const subject = `[Rovan] ${brand}のAI上の購買リスクに変化がありました`;
  const lines = actionable.slice(0, 5).map((alert) => `・${alert.title}: ${alert.detail}`);
  const text = `${brand}のAI上の購買監査で新しい変化を検出しました。\n\n${lines.join("\n")}\n\n重大・高: ${critical.length}件\n新たな候補落ち: ${audit.changeSummary?.newCandidateDrops || 0}件\n新しい誤情報: ${audit.changeSummary?.newFactErrors || 0}件\n新しい競合: ${audit.changeSummary?.newCompetitors || 0}件\n\n詳細を見る: ${url}\n\nこれは指定した質問・AI・日時の観測と、取得できた公式サイト本文との照合です。売上や実顧客の流出を直接測定するものではありません。`;
  const items = actionable.slice(0, 5).map((alert) => `<li style="margin:0 0 12px"><strong>${escapeHtml(alert.title)}</strong><br><span style="color:#475569">${escapeHtml(alert.detail)}</span></li>`).join("");
  const html = `<div style="font-family:system-ui,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#111827;line-height:1.65;max-width:640px"><p style="font-size:12px;letter-spacing:.08em;color:#64748b">Rovan / AI購買監査</p><h1 style="font-size:23px;margin:8px 0 18px">${escapeHtml(brand)}のAI上の購買リスクに変化がありました。</h1><ul style="padding-left:20px">${items}</ul><table style="border-collapse:collapse;width:100%;margin:20px 0"><tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">新たな候補落ち</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700">${audit.changeSummary?.newCandidateDrops || 0}件</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">新しい誤情報</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700">${audit.changeSummary?.newFactErrors || 0}件</td></tr><tr><td style="padding:8px;border-bottom:1px solid #e2e8f0">新しい競合</td><td style="padding:8px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700">${audit.changeSummary?.newCompetitors || 0}件</td></tr></table><p><a href="${escapeHtml(url)}" style="display:inline-block;background:#0f172a;color:#fff;text-decoration:none;padding:12px 18px;border-radius:8px;font-weight:700">監査結果を見る</a></p><p style="font-size:12px;color:#64748b;margin-top:20px">指定した質問・AI・日時の観測と、取得できた公式サイト本文との照合です。売上や実顧客の流出を直接測定するものではありません。</p></div>`;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.resendApiKey}`,
        "content-type": "application/json",
        "idempotency-key": `buying-audit/${watch.latest.scanId}`.slice(0, 256),
      },
      body: JSON.stringify({ from: brandedEmailSender(env.watchFromEmail), to: [watch.email], subject, text, html }),
    });
    if (!response.ok) return { sent: false as const, reason: `resend_${response.status}` };
    return { sent: true as const };
  } catch {
    return { sent: false as const, reason: "network_error" };
  }
}
