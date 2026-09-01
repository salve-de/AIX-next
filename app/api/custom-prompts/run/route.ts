import { id } from "@/lib/ids";
import { runScan } from "@/lib/scan-runner";
import { getWatch, updateWatch } from "@/lib/storage";

export const runtime = "nodejs";
export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { token?: string };
    if (!body.token) return Response.json({ error: "Watch tokenが必要です。" }, { status: 400 });
    const watch = await getWatch(body.token);
    if (!watch) return Response.json({ error: "Watchが見つかりません。" }, { status: 404 });
    const prompts = watch.customPrompts || [];
    if (!prompts.length) return Response.json({ error: "Custom Promptを1件以上追加してください。" }, { status: 409 });
    const repetitions = watch.paid ? 3 : 1;
    const result = await runScan({ scanId: id("custom"), url: watch.latest.targetUrl, prompts, promptCount: prompts.length, repetitions, panelKind: "custom" });
    const customHistory = [...(watch.customHistory || []), result].slice(-52);
    const updated = await updateWatch(body.token, { customLatest: result, customHistory });
    return Response.json({ result, watch: updated }, { headers: { "cache-control": "private, no-store", "referrer-policy": "no-referrer" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Custom Promptを測定できませんでした。" }, { status: 400 });
  }
}
