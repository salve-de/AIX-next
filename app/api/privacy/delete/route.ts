import { isDataDeletionConfirmation } from "@/lib/brand-compatibility";
import { deleteWatchData } from "@/lib/privacy-data";

export const runtime = "nodejs";

export async function DELETE(request: Request) {
  try {
    const body = await request.json() as { token?: string; email?: string; confirmation?: string };
    if (!body.token || !body.email || !isDataDeletionConfirmation(body.confirmation)) return Response.json({ error: "Watch token、登録メール、確認文字列 DELETE ROVAN DATA が必要です。" }, { status: 400 });
    const result = await deleteWatchData(body.token, body.email);
    return Response.json(result, { headers: { "cache-control": "no-store", "referrer-policy": "no-referrer" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "データを削除できませんでした。" }, { status: 400 });
  }
}
