import { getAgentAnalytics } from "@/lib/agent-analytics-store";
import { getWatch } from "@/lib/storage";
import { resolveWatchToken } from "@/lib/watch-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const token = resolveWatchToken(request, url.searchParams.get("token"));
    const days = Math.max(1, Math.min(365, Number(url.searchParams.get("days") || 30)));
    if (!token) return Response.json({ error: "Watch sessionが必要です。" }, { status: 401 });
    const watch = await getWatch(token);
    if (!watch) return Response.json({ error: "Watchが見つかりません。" }, { status: 404 });
    const summary = await getAgentAnalytics(watch.id, days);
    return Response.json(summary, { headers: { "cache-control": "private, no-store", "referrer-policy": "no-referrer" } });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Agent Analyticsを取得できませんでした。" }, { status: 400 }); }
}
