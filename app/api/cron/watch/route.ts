import { generateBuyerPrompts } from "@/lib/discovery";
import { env } from "@/lib/env";
import { id } from "@/lib/ids";
import { sendWeeklyBrief } from "@/lib/notifications";
import { freeProviders, paidProviders } from "@/lib/providers";
import { runScan } from "@/lib/scan-runner";
import { listDueWatches, updateWatch } from "@/lib/storage";
import type { ScanResult } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 300;
export const dynamic = "force-dynamic";

function authorized(request: Request) { const header = request.headers.get("authorization") || ""; return Boolean(env.cronSecret) && header === `Bearer ${env.cronSecret}`; }

export async function GET(request: Request) {
  if (!authorized(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const due = await listDueWatches(5);
  const results: Array<{ token: string; status: string; details?: string[]; error?: string }> = [];

  for (const watch of due) {
    try {
      const now = Date.now();
      if (!watch.paid && watch.status === "trial" && now >= new Date(watch.trialEndsAt).getTime()) {
        await updateWatch(watch.token, { status: "expired", nextRunAt: new Date(now + 365 * 86_400_000).toISOString() });
        results.push({ token: watch.token, status: "trial_expired" }); continue;
      }

      const previousCore = watch.latest;
      const needsPaidCore = watch.paid && (watch.latest.panel.kind !== "core" || watch.latest.panel.promptCount !== 50 || watch.latest.panel.repetitions !== 3 || !watch.latest.observations.some((item) => item.provider === "claude" || item.provider === "grok"));
      const corePrompts = needsPaidCore ? await generateBuyerPrompts(watch.latest.discovery, 50, "core") : watch.latest.prompts;
      const coreProviders = watch.paid ? paidProviders : freeProviders;
      const core = await runScan({ scanId: id("watchcore"), url: watch.latest.targetUrl, prompts: corePrompts, promptCount: corePrompts.length, repetitions: watch.paid ? 3 : 1, panelKind: "core", providerNames: coreProviders });
      const resetBaseline = needsPaidCore || watch.baseline.panel.kind !== "core" || watch.baseline.panel.promptCount !== core.panel.promptCount || watch.baseline.panel.repetitions !== core.panel.repetitions || (watch.paid && !watch.baseline.observations.some((item) => item.provider === "claude" || item.provider === "grok"));
      const baseline = resetBaseline ? core : watch.baseline;
      const history = resetBaseline ? [core] : [...watch.history, core].slice(-52);
      const nextRunAt = new Date(now + 7 * 86_400_000).toISOString();

      let discoveryLatest = watch.discoveryLatest || null; let discoveryHistory = watch.discoveryHistory || [];
      let customLatest = watch.customLatest || null; let customHistory = watch.customHistory || [];
      const details: string[] = [resetBaseline ? "core_new_baseline" : "core_completed", `surfaces:${coreProviders.length}`];

      if (watch.paid) {
        try {
          const discoveryPrompts = await generateBuyerPrompts(watch.latest.discovery, 20, "discovery");
          discoveryLatest = await runScan({ scanId: id("watchdiscovery"), url: watch.latest.targetUrl, prompts: discoveryPrompts, promptCount: 20, repetitions: 3, panelKind: "discovery", providerNames: paidProviders });
          discoveryHistory = [...discoveryHistory, discoveryLatest].slice(-26); details.push("discovery_completed");
        } catch (error) { details.push(`discovery_failed:${error instanceof Error ? error.message : String(error)}`); }
      }

      if ((watch.customPrompts || []).length) {
        try {
          customLatest = await runScan({ scanId: id("watchcustom"), url: watch.latest.targetUrl, prompts: watch.customPrompts, promptCount: watch.customPrompts!.length, repetitions: watch.paid ? 3 : 1, panelKind: "custom", providerNames: watch.paid ? paidProviders : freeProviders });
          customHistory = [...customHistory, customLatest].slice(-52); details.push("custom_completed");
        } catch (error) { details.push(`custom_failed:${error instanceof Error ? error.message : String(error)}`); }
      }

      const updated = await updateWatch(watch.token, { latest: core, baseline, history, discoveryLatest, discoveryHistory, customLatest, customHistory, nextRunAt });
      if (updated && !resetBaseline) {
        try { const delivery = await sendWeeklyBrief(updated, previousCore, core); details.push(delivery.sent ? "weekly_brief_sent" : delivery.reason || "weekly_brief_skipped"); }
        catch (error) { details.push(`weekly_brief_failed:${error instanceof Error ? error.message : String(error)}`); }
      } else if (resetBaseline) details.push("weekly_brief_skipped_new_baseline");
      results.push({ token: watch.token, status: "completed", details });
    } catch (error) {
      await updateWatch(watch.token, { nextRunAt: new Date(Date.now() + 24 * 3_600_000).toISOString() });
      results.push({ token: watch.token, status: "core_failed", error: error instanceof Error ? error.message : String(error) });
    }
  }

  return Response.json({ processed: results.length, results, generatedAt: new Date().toISOString() }, { headers: { "cache-control": "no-store" } });
}
