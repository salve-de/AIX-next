import { createWatch, getScan, getWatch } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function normalizeEmail(value: string) {
  const email = value.trim().toLowerCase().slice(0, 254);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error("有効な会社メールを入力してください。");
  return email;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { scanId?: string; email?: string };
    if (!body.scanId) return Response.json({ error: "診断結果が必要です。" }, { status: 400 });
    const email = normalizeEmail(body.email || "");
    const scan = await getScan(body.scanId);
    if (!scan?.result) return Response.json({ error: "診断結果が見つかりません。" }, { status: 404 });
    if (!scan.result.successfulObservations) return Response.json({ error: "成功したAI観測がないためWatchを開始できません。API設定後に再測定してください。" }, { status: 409 });
    const watch = await createWatch(scan, email);
    return Response.json({ token: watch.token, watchUrl: `/watch?token=${encodeURIComponent(watch.token)}` }, { headers: { "cache-control": "no-store", "referrer-policy": "no-referrer" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Watchを開始できませんでした。" }, { status: 400 });
  }
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") || "";
  if (!token) return Response.json({ error: "Watch tokenが必要です。" }, { status: 400 });
  const watch = await getWatch(token);
  if (!watch) return Response.json({ error: "Watchが見つかりません。" }, { status: 404 });
  return Response.json(watch, { headers: { "cache-control": "private, no-store", "referrer-policy": "no-referrer" } });
}
