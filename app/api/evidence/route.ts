import { addEvidence, getWatch, updateWatch } from "@/lib/storage";
import { toPublicWatch } from "@/lib/public-dto";
import { normalizePublicUrl } from "@/lib/url-security";

export const runtime = "nodejs";

function sourceUrl(value: string) {
  if (!value) return undefined;
  return normalizePublicUrl(value);
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { token?: string; gapId?: string; value?: string; sourceUrl?: string };
    const token = body.token?.trim() || "";
    const gapId = body.gapId?.trim().slice(0, 160) || "";
    const value = body.value?.trim().slice(0, 5_000) || "";
    if (!token || !gapId || !value) return Response.json({ error: "入力内容が不足しています。" }, { status: 400 });
    const current = await getWatch(token);
    if (!current) return Response.json({ error: "Watchが見つかりません。" }, { status: 404 });
    if (!["trial", "active"].includes(current.status)) return Response.json({ error: "停止中のWatchには情報を追加できません。" }, { status: 409 });
    if (!current.latest.evidenceGaps.some((gap) => gap.id === gapId)) return Response.json({ error: "今回の結果にない項目です。" }, { status: 400 });
    const watch = await addEvidence(token, { gapId, value, sourceUrl: sourceUrl(body.sourceUrl?.trim() || "") });
    if (!watch) return Response.json({ error: "Watchを更新できませんでした。" }, { status: 500 });
    const updated = watch.changePack ? (await updateWatch(token, { changePack: null }) || watch) : watch;
    return Response.json(toPublicWatch(updated), { headers: { "cache-control": "private, no-store", "referrer-policy": "no-referrer" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Evidenceを保存できませんでした。" }, { status: 400 });
  }
}
