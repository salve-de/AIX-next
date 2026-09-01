import { env } from "@/lib/env";
import { generateBuyerPrompts } from "@/lib/discovery";
import { id } from "@/lib/ids";
import { runScan } from "@/lib/scan-runner";
import { listDueWatches, updateWatch } from "@/lib/storage";

export const runtime = "nodejs";
export const maxDuration = 300;
export const dynamic = "force-dynamic";

function authorized(request: Request) {
  const header = request.headers.get("authorization") || "";
  return Boolean(env.cronSecret) && header === `Bearer ${env.cronSecret}`;
}

export async function GET(request: Request) {
  if (!authorized(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const due = await listDueWatches(5);
  const results: Array<{ token: string; status: string; error?: string }> = [];

  for (const watch of due) {
    try {
      const now = Date.now();
      if (!watch.paid && watch.status === "trial" && now >= new Date(watch.trialEndsAt).getTime()) {
        await updateWatch(watch.token, { status: "expired", nextRunAt: new Date(now + 365 * 86_400_000).toISOString() });
        results.push({ token: watch.token, status: "trial_expired" });
        continue;
      }

      const needsPaidCore = watch.paid && (watch.latest.panel.kind !== "core" || watch.latest.panel.promptCount !== 50 || watch.latest.panel.repetitions !== 3);
      const corePrompts = needsPaidCore
        ? await generateBuyerPrompts(watch.latest.discovery, 50, "core")
        : watch.latest.prompts;
      const coreRepetitions = watch.paid ? 3 : 1;
      const core = await runScan({
        scanId: id("watchcore"),
        url: watch.latest.targetUrl,
        prompts: corePrompts,
        promptCount: corePrompts.length,
        repetitions: coreRepetitions,
        panelKind: "core",
      });

      let discoveryLatest = watch.discoveryLatest || null;
      let discoveryHistory = watch.discoveryHistory || [];
      if (watch.paid) {
        const discoveryPrompts = await generateBuyerPrompts(watch.latest.discovery, 20, "discovery");
        discoveryLatest = await runScan({
          scanId: id("watchdiscovery"),
          url: watch.latest.targetUrl,
          prompts: discoveryPrompts,
          promptCount: 20,
          repetitions: 3,
          panelKind: "discovery",
        });
        discoveryHistory = [...discoveryHistory, discoveryLatest].slice(-26);
      }

      const nextRunAt = new Date(now + 7 * 86_400_000).toISOString();
      const resetBaseline = needsPaidCore || watch.baseline.panel.kind !== "core" || watch.baseline.panel.promptCount !== core.panel.promptCount;
      const baseline = resetBaseline ? core : watch.baseline;
      const history = resetBaseline ? [core] : [...watch.history, core].slice(-52);

      await updateWatch(watch.token, {
        latest: core,
        baseline,
        history,
        discoveryLatest,
        discoveryHistory,
        nextRunAt,
      });
      results.push({ token: watch.token, status: watch.paid ? "core_and_discovery_completed" : "trial_core_completed" });
    } catch (error) {
      await updateWatch(watch.token, { nextRunAt: new Date(Date.now() + 24 * 3_600_000).toISOString() });
      results.push({ token: watch.token, status: "failed", error: error instanceof Error ? error.message : String(error) });
    }
  }

  return Response.json({ processed: results.length, results, generatedAt: new Date().toISOString() }, { headers: { "cache-control": "no-store" } });
}
