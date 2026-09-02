import { connectWordPress } from "@/lib/wordpress";
import { getWatch } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { token?: string; baseUrl?: string; username?: string; applicationPassword?: string };
    if (!body.token || !body.baseUrl || !body.username || !body.applicationPassword) return Response.json({ error: "token、WordPress URL、username、Application Passwordが必要です。" }, { status: 400 });
    const watch = await getWatch(body.token); if (!watch) return Response.json({ error: "Watchが見つかりません。" }, { status: 404 });
    if (watch.domainClaim?.status !== "verified") return Response.json({ error: "Domain ownershipを確認してからWordPressを接続してください。" }, { status: 409 });
    const integration = await connectWordPress({ watchId: watch.id, claimedDomain: watch.domainClaim.domain, baseUrl: body.baseUrl, username: body.username, applicationPassword: body.applicationPassword });
    return Response.json({ integration }, { headers: { "cache-control": "private, no-store", "referrer-policy": "no-referrer" } });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "WordPressを接続できませんでした。" }, { status: 400 }); }
}
