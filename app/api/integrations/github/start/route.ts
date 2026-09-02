import { createGitHubInstallUrl } from "@/lib/github-app";
import { getWatch } from "@/lib/storage";
import { resolveWatchToken } from "@/lib/watch-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const token = resolveWatchToken(request, new URL(request.url).searchParams.get("token"));
    if (!token) return Response.json({ error: "Watch sessionが必要です。" }, { status: 401 });
    const watch = await getWatch(token);
    if (!watch) return Response.json({ error: "Watchが見つかりません。" }, { status: 404 });
    return Response.json({ url: createGitHubInstallUrl(watch.id) }, { headers: { "cache-control": "private, no-store", "referrer-policy": "no-referrer" } });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "GitHub接続を開始できませんでした。" }, { status: 400 }); }
}
