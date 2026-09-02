import { deleteWatchData } from "@/lib/privacy-data";
import { resolveWatchToken } from "@/lib/watch-session";

export const runtime = "nodejs";

export async function DELETE(request: Request) {
  try {
    const body = await request.json() as { token?: string; email?: string; confirmation?: string };
    const token = resolveWatchToken(request, body.token);
    if (!token || !body.email || body.confirmation !== "DELETE AIX DATA") return Response.json({ error: "Watch session、登録メール、確認文字列 DELETE AIX DATA が必要です。" }, { status: 400 });
    const result = await deleteWatchData(token, body.email);
    return Response.json(result, { headers: { "cache-control": "no-store", "referrer-policy": "no-referrer" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "データを削除できませんでした。" }, { status: 400 });
  }
}
