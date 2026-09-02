import { env } from "@/lib/env";
import { githubInstallationInfo, parseGitHubInstallState } from "@/lib/github-app";
import { saveIntegration } from "@/lib/integration-store";
import { getWatchById } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const url = new URL(request.url);
  try {
    const installationId = Number(url.searchParams.get("installation_id") || 0); const state = url.searchParams.get("state") || "";
    if (!Number.isInteger(installationId) || installationId <= 0 || !state) throw new Error("GitHub installation_id and state are required.");
    const payload = parseGitHubInstallState(state); const watch = await getWatchById(String(payload.watchId || "")); if (!watch) throw new Error("Watchが見つかりません。");
    const info = await githubInstallationInfo(installationId);
    await saveIntegration(watch.id, "github", { installationId, accountLogin: info.accountLogin, repositorySelection: info.repositorySelection, connectedAt: new Date().toISOString() });
    return Response.redirect(`${env.siteUrl.replace(/\/$/, "")}/workspace/execution?token=${encodeURIComponent(watch.token)}&github=connected`, 302);
  } catch (error) {
    const message = encodeURIComponent(error instanceof Error ? error.message : "GitHub接続に失敗しました。");
    return Response.redirect(`${env.siteUrl.replace(/\/$/, "")}/workspace/execution?integration_error=${message}`, 302);
  }
}
