import { rotateAgentIngestKey } from "@/lib/agent-analytics-store";
import { resolveWatchToken } from "@/lib/watch-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { token?: string };
    const token = resolveWatchToken(request, body.token);
    if (!token) return Response.json({ error: "Watch sessionが必要です。" }, { status: 401 });
    const result = await rotateAgentIngestKey(token);
    if (!result) return Response.json({ error: "Watchが見つかりません。" }, { status: 404 });
    return Response.json({ ingestKey: result.key, message: "このキーは今だけ表示します。再発行すると以前のキーは無効になります。" }, { headers: { "cache-control": "private, no-store", "referrer-policy": "no-referrer" } });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Ingest keyを発行できませんでした。" }, { status: 400 }); }
}
