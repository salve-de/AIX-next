import { buildChangePack } from "@/lib/change-pack";
import { getWatch, saveChangePack } from "@/lib/storage";
import type { ChangePackStatus } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { token?: string; actionId?: string };
    if (!body.token || !body.actionId) return Response.json({ error: "tokenとactionIdが必要です。" }, { status: 400 });
    const watch = await getWatch(body.token);
    if (!watch) return Response.json({ error: "Watchが見つかりません。" }, { status: 404 });
    const action = watch.latest.actions.find((item) => item.id === body.actionId);
    if (!action) return Response.json({ error: "Actionが見つかりません。" }, { status: 404 });
    const pack = buildChangePack(watch, action);
    const updated = await saveChangePack(body.token, pack);
    if (!updated) return Response.json({ error: "Change Packを保存できませんでした。" }, { status: 500 });
    return Response.json({ pack, watch: updated }, { headers: { "cache-control": "private, no-store", "referrer-policy": "no-referrer" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Change Packを作成できませんでした。" }, { status: 400 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json() as { token?: string; packId?: string; status?: ChangePackStatus };
    if (!body.token || !body.packId || !body.status) return Response.json({ error: "token、packId、statusが必要です。" }, { status: 400 });
    if (!["draft", "needs_evidence", "ready", "approved", "rejected"].includes(body.status)) return Response.json({ error: "不正なstatusです。" }, { status: 400 });
    const watch = await getWatch(body.token);
    if (!watch) return Response.json({ error: "Watchが見つかりません。" }, { status: 404 });
    const current = (watch.changePacks || []).find((item) => item.id === body.packId);
    if (!current) return Response.json({ error: "Change Packが見つかりません。" }, { status: 404 });
    if (body.status === "approved" && current.missingFacts.length) return Response.json({ error: "未確認の比較材料が残っているため承認できません。" }, { status: 409 });
    const next = { ...current, status: body.status };
    const updated = await saveChangePack(body.token, next);
    return Response.json({ pack: next, watch: updated }, { headers: { "cache-control": "private, no-store", "referrer-policy": "no-referrer" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Change Packを更新できませんでした。" }, { status: 400 });
  }
}
