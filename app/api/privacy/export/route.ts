import { exportWatchData } from "@/lib/privacy-data";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { token?: string; email?: string };
    if (!body.token || !body.email) return Response.json({ error: "Watch tokenと登録メールが必要です。" }, { status: 400 });
    const data = await exportWatchData(body.token, body.email);
    return new Response(JSON.stringify(data, null, 2), { headers: { "content-type": "application/json; charset=utf-8", "content-disposition": `attachment; filename="rovan-export-${Date.now()}.json"`, "cache-control": "private, no-store", "referrer-policy": "no-referrer" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "データを書き出せませんでした。" }, { status: 400 });
  }
}
