import { env } from "@/lib/env";
import { generateBuyerPrompts } from "@/lib/discovery";
import { id } from "@/lib/ids";
import { runScan } from "@/lib/scan-runner";
import { listDueWatches, updateWatch } from "@/lib/storage";
import type { BuyerPrompt } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 300;
export const dynamic = "force-dynamic";

const DAY_MS = 86_400_000;
const FREE_WATCH_DAYS = 14;

function authorized(request: Request) {
  const header = request.headers.get("authorization") || "";
  return Boolean(env.cronSecret) && header === `Bearer ${env.cronSecret}`;
}

function existingPrompts(watch: Awaited<ReturnType<typeof listDueWatches>>[number]): BuyerPrompt[] {
  if (watch.latest.prompts?.length) return watch.latest.prompts;
  const seen = new Map<string, BuyerPrompt>();
  for (const observation of watch.latest.observations) {
    if (!seen.has(observation.promptId)) {
      seen.set(observation.promptId, {
        id: observation.promptId,
        text: observation.prompt,
        cluster: "category",
        importance: 3,
        panel: watch.latest.panel.kind,
        version: watch.latest.panel.version,
      });
    }
  }
  return [...seen.values()];
}

function trialEndsAt(createdAt: string) {
  return new Date(new Date(createdAt).getTime() + FREE_WATCH_DAYS * DAY_MS).getTime();
}

export async function GET(request: Request) {
  if (!authorized(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const due = await listDueWatches(5);
  const results: Array<{ token: string; status: string; error?: string }> = [];

  for (const watch of due) {
    try {
      const switchToCore = watch.paid && watch.latest.panel.kind !== "core";
      const prompts = switchToCore ? await generateBuyerPrompts(watch.latest.discovery, 50, "core") : existingPrompts(watch);
      if (!prompts.length) throw new Error("再測定に使えるBuyer Promptがありません。");

      const repetitions = watch.paid ? 3 : 1;
      const result = await runScan({
        scanId: id("watchscan"),
        url: watch.latest.targetUrl,
        prompts,
        promptCount: prompts.length,
        repetitions,
        panelKind: switchToCore ? "core" : watch.latest.panel.kind,
      });

      const now = Date.now();
      const expiresAfterRun = !watch.paid && watch.status === "trial" && now >= trialEndsAt(watch.createdAt);
      const nextRunAt = new Date(now + 7 * DAY_MS).toISOString();
      const history = switchToCore ? [result] : [...watch.history, result].slice(-52);
      await updateWatch(watch.token, {
        latest: result,
        baseline: switchToCore ? result : watch.baseline,
        history,
        nextRunAt,
        ...(expiresAfterRun ? { status: "expired" as const } : {}),
      });
      results.push({ token: watch.token, status: expiresAfterRun ? "completed_and_expired" : switchToCore ? "core_baseline_created" : "completed" });
    } catch (error) {
      await updateWatch(watch.token, { nextRunAt: new Date(Date.now() + DAY_MS).toISOString() });
      results.push({ token: watch.token, status: "failed", error: error instanceof Error ? error.message : String(error) });
    }
  }

  return Response.json({ processed: results.length, results, generatedAt: new Date().toISOString() }, { headers: { "cache-control": "no-store" } });
}
