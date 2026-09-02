import { id } from "@/lib/ids";
import { createContentPullRequest, fetchRepositoryFile } from "@/lib/github-app";
import { getIntegration } from "@/lib/integration-store";
import { rewriteSourceFile } from "@/lib/rewrite-engine";
import { addExecution, getWatch } from "@/lib/storage";
import type { ExecutionRecord } from "@/lib/types";
import { resolveWatchToken } from "@/lib/watch-session";

export const runtime = "nodejs";
export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let token = "";
  try {
    const body = await request.json() as { token?: string; packId?: string; repo?: string; path?: string };
    token = resolveWatchToken(request, body.token);
    if (!token) return Response.json({ error: "Watch sessionが必要です。" }, { status: 401 });
    if (!body.packId || !body.repo || !body.path) return Response.json({ error: "packId、repo、pathが必要です。" }, { status: 400 });
    const watch = await getWatch(token);
    if (!watch) return Response.json({ error: "Watchが見つかりません。" }, { status: 404 });
    if (watch.domainClaim?.status !== "verified") return Response.json({ error: "Domain ownershipを確認してから外部実行してください。" }, { status: 409 });
    const pack = (watch.changePacks || []).find((item) => item.id === body.packId);
    if (!pack) return Response.json({ error: "Change Packが見つかりません。" }, { status: 404 });
    if (pack.status !== "approved" || pack.missingFacts.length) return Response.json({ error: "実行には不足材料のないApproved Change Packが必要です。" }, { status: 409 });
    const integration = await getIntegration(watch.id, "github");
    if (!integration) return Response.json({ error: "GitHub Appが接続されていません。" }, { status: 409 });
    const installationId = Number(integration.publicConfig.installationId || 0);
    if (!installationId) throw new Error("GitHub installation is invalid.");
    const file = await fetchRepositoryFile(installationId, body.repo, body.path);
    const newContent = await rewriteSourceFile({ path: file.path, currentContent: file.content, pack });
    const pr = await createContentPullRequest({ installationId, repoFullName: body.repo, path: file.path, packId: pack.id, title: `AIX: ${pack.title}`, body: `## AIX Change Pack\n\n${pack.rationale}\n\n- Target: ${pack.target}\n- Related Buyer Prompts: ${pack.remeasurePromptIds.length}\n- Evidence status: approved for draft generation\n- Auto-merge: **disabled**\n\nThis PR is generated for human review. AIX does not claim that merging it will cause ranking, citation, recommendation, or revenue changes. Re-measure the same tracked prompts after publication.`, newContent });
    const execution: ExecutionRecord = { id: id("execution"), packId: pack.id, target: "github", status: "created", summary: `Draft PR #${pr.number} created for ${body.repo}:${pr.path}`, externalUrl: pr.url, metadata: { repo: body.repo, path: pr.path, prNumber: pr.number, branch: pr.branch }, createdAt: new Date().toISOString() };
    const updated = await addExecution(token, execution);
    return Response.json({ execution, watch: updated }, { headers: { "cache-control": "private, no-store", "referrer-policy": "no-referrer" } });
  } catch (error) {
    if (token) {
      try { const execution: ExecutionRecord = { id: id("execution"), packId: "unknown", target: "github", status: "failed", summary: (error instanceof Error ? error.message : "GitHub execution failed").slice(0, 500), createdAt: new Date().toISOString() }; await addExecution(token, execution); } catch { /* best effort audit */ }
    }
    return Response.json({ error: error instanceof Error ? error.message : "GitHub PRを作成できませんでした。" }, { status: 400 });
  }
}
