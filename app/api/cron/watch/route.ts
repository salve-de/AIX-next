import { env } from "@/lib/env";
import { claimDueWatches, updateWatch } from "@/lib/storage";
import { processWatchMeasurement } from "@/lib/watch-measurement";

export const runtime = "nodejs";
export const maxDuration = 300;
export const dynamic = "force-dynamic";

function authorized(request: Request) {
  const header = request.headers.get("authorization") || "";
  return Boolean(env.cronSecret) && header === `Bearer ${env.cronSecret}`;
}

export async function GET(request: Request) {
  if (!authorized(request)) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const due = await claimDueWatches(5, 15 * 60);
  const results: Array<Record<string, unknown>> = [];

  for (const watch of due) {
    try {
      const result = await processWatchMeasurement(watch);
      results.push({ token: watch.token, ...result });
    } catch (error) {
      const retryAt = new Date(Date.now() + 60 * 60_000).toISOString();
      await updateWatch(watch.token, { nextRunAt: retryAt });
      results.push({ token: watch.token, status: "failed", retryAt, error: error instanceof Error ? error.message : String(error) });
    }
  }

  return Response.json({ processed: results.length, results, generatedAt: new Date().toISOString() }, { headers: { "cache-control": "no-store" } });
}
