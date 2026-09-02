import { id } from "@/lib/ids";
import { freeProviders, paidProviders } from "@/lib/providers";
import { runScan } from "@/lib/scan-runner";
import { getWatch, updateWatch } from "@/lib/storage";
import { resolveWatchToken } from "@/lib/watch-session";

export const runtime = "nodejs";
export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { token?: string };
    const token = resolveWatchToken(request, body.token);
    if (!token) return Response.json({ error: "Watch sessionが必要です。" }, { status: 401 });
    const watch = await getWatch(token);
    if (!watch) return Response.json({ error: "Watchが見つかりません。" }, { status: 404 });
    const prompts = watch.customPrompts || [];
    if (!prompts.length) return Response.json({ error: "Custom Promptを1件以上追加してください。" }, { status: 409 });
    const repetitions = watch.paid ? 3 : 1;
    const providerNames = watch.paid ? paidProviders : freeProviders;
    const result = await runScan({ scanId: id("custom"), url: watch.latest.targetUrl, prompts, promptCount: prompts.length, repetitions, panelKind: "custom", providerNames });
    const customHistory = [...(watch.customHistory || []), result].slice(-52);
    const updated = await updateWatch(token, { customLatest: result, customHistory });
    return Response.json({ result, watch: updated }, { headers: { "cache-control": "private, no-store", "referrer-policy": "no-referrer" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Custom Promptを測定できませんでした。" }, { status: 400 });
  }
}
