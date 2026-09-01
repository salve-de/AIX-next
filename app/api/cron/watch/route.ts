import { env } from "@/lib/env";
import { runScan } from "@/lib/scan-engine";
import { createScan, listDueWatches, updateWatch } from "@/lib/store";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function GET(request: Request) {
  if (!env.cronSecret || request.headers.get("authorization") !== `Bearer ${env.cronSecret}`) return Response.json({ error: "Unauthorized" }, { status: 401 });
  const watches = await listDueWatches(5);
  const output: Array<{ id: string; status: string; error?: string }> = [];
  for (const watch of watches) {
    try {
      const scan = await createScan(watch.latest.url);
      const paid = watch.paid && watch.status === "active";
      const result = await runScan({ scanId: scan.id, url: watch.latest.url, fixedPrompts: watch.baseline.prompts.slice(0, paid ? 50 : 30), promptCount: paid ? 50 : 30, repetitions: paid ? 3 : 1 });
      const history = [...watch.history, result].slice(-60);
      await updateWatch(watch.id, watch.token, { latest: result, history, nextRunAt: new Date(Date.now() + 7 * 86_400_000).toISOString() });
      output.push({ id: watch.id, status: "complete" });
    } catch (error) {
      output.push({ id: watch.id, status: "failed", error: error instanceof Error ? error.message : "Watch failed" });
    }
  }
  return Response.json({ processed: output.length, output, generatedAt: new Date().toISOString() });
}
