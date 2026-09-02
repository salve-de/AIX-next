import { listWordPressPages } from "@/lib/wordpress";
import { getWatch } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const token = new URL(request.url).searchParams.get("token") || "";
    if (!token) return Response.json({ error: "Watch tokenが必要です。" }, { status: 400 });
    const watch = await getWatch(token); if (!watch) return Response.json({ error: "Watchが見つかりません。" }, { status: 404 });
    const pages = await listWordPressPages(watch.id);
    return Response.json({ pages }, { headers: { "cache-control": "private, no-store", "referrer-policy": "no-referrer" } });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "WordPressページを取得できませんでした。" }, { status: 400 }); }
}
