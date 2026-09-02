import { listInstallationRepositories } from "@/lib/github-app";
import { getIntegration } from "@/lib/integration-store";
import { getWatch } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const token = new URL(request.url).searchParams.get("token") || "";
    if (!token) return Response.json({ error: "Watch tokenが必要です。" }, { status: 400 });
    const watch = await getWatch(token); if (!watch) return Response.json({ error: "Watchが見つかりません。" }, { status: 404 });
    const integration = await getIntegration(watch.id, "github"); if (!integration) return Response.json({ error: "GitHub Appが接続されていません。" }, { status: 409 });
    const installationId = Number(integration.publicConfig.installationId || 0); if (!installationId) return Response.json({ error: "GitHub installationが不正です。" }, { status: 409 });
    const repositories = await listInstallationRepositories(installationId);
    return Response.json({ repositories }, { headers: { "cache-control": "private, no-store", "referrer-policy": "no-referrer" } });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Repository一覧を取得できませんでした。" }, { status: 400 }); }
}
