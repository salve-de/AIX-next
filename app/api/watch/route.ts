import { createWatch, getScan } from "@/lib/store";

export const runtime = "nodejs";

function normalizeEmail(value: string) {
  const email = value.trim().toLowerCase().slice(0, 254);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("有効な会社メールを入力してください。");
  return email;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { scanId?: string; email?: string };
    if (!body.scanId) return Response.json({ error: "診断結果が必要です。" }, { status: 400 });
    const scan = await getScan(body.scanId);
    if (!scan?.result) return Response.json({ error: "診断結果が見つかりません。" }, { status: 404 });
    if (!scan.result.metrics.successfulObservations) return Response.json({ error: "成功したAI観測がないためWatchを開始できません。" }, { status: 409 });
    const watch = await createWatch(scan, normalizeEmail(body.email || ""));
    return Response.json({ id: watch.id, token: watch.token, watchUrl: `/watch/${watch.id}?token=${encodeURIComponent(watch.token)}` }, { headers: { "cache-control": "no-store", "referrer-policy": "no-referrer" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Watchを開始できませんでした。" }, { status: 400 });
  }
}
