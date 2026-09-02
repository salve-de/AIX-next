import { id } from "@/lib/ids";
import { rewriteWordPressHtml } from "@/lib/rewrite-engine";
import { addExecution, getWatch } from "@/lib/storage";
import { createWordPressDraftCopy, fetchWordPressPage } from "@/lib/wordpress";
import type { ExecutionRecord } from "@/lib/types";
import { resolveWatchToken } from "@/lib/watch-session";

export const runtime = "nodejs";
export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let token = ""; let packId = "unknown";
  try {
    const body = await request.json() as { token?: string; packId?: string; pageId?: number };
    token = resolveWatchToken(request, body.token);
    packId = body.packId || "unknown";
    if (!token) return Response.json({ error: "Watch sessionが必要です。" }, { status: 401 });
    if (!body.packId || !Number.isInteger(body.pageId) || Number(body.pageId) <= 0) return Response.json({ error: "packIdとpageIdが必要です。" }, { status: 400 });
    const watch = await getWatch(token);
    if (!watch) return Response.json({ error: "Watchが見つかりません。" }, { status: 404 });
    if (watch.domainClaim?.status !== "verified") return Response.json({ error: "Domain ownershipを確認してから外部実行してください。" }, { status: 409 });
    const pack = (watch.changePacks || []).find((item) => item.id === body.packId);
    if (!pack) return Response.json({ error: "Change Packが見つかりません。" }, { status: 404 });
    if (pack.status !== "approved" || pack.missingFacts.length) return Response.json({ error: "実行には不足材料のないApproved Change Packが必要です。" }, { status: 409 });
    const page = await fetchWordPressPage(watch.id, Number(body.pageId));
    const content = await rewriteWordPressHtml({ title: page.title, currentHtml: page.html, pack });
    const draft = await createWordPressDraftCopy(watch.id, { originalPageId: page.id, title: page.title, content });
    const execution: ExecutionRecord = { id: id("execution"), packId: pack.id, target: "wordpress", status: "created", summary: `WordPress draft #${draft.id} created from page #${page.id}. Existing page was not modified.`, externalUrl: draft.editUrl, metadata: { draftId: draft.id, originalPageId: page.id }, createdAt: new Date().toISOString() };
    const updated = await addExecution(token, execution);
    return Response.json({ execution, watch: updated }, { headers: { "cache-control": "private, no-store", "referrer-policy": "no-referrer" } });
  } catch (error) {
    if (token) { try { await addExecution(token, { id: id("execution"), packId, target: "wordpress", status: "failed", summary: (error instanceof Error ? error.message : "WordPress execution failed").slice(0, 500), createdAt: new Date().toISOString() }); } catch { /* best effort audit */ } }
    return Response.json({ error: error instanceof Error ? error.message : "WordPress Draftを作成できませんでした。" }, { status: 400 });
  }
}
