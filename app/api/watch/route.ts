import { createWatch, getScan, getWatch } from "@/lib/storage";
import { sendWatchStarted } from "@/lib/watch-email";
import { getActiveWatchRun } from "@/lib/watch-runs";

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
    if (!scan.result.successfulObservations) return Response.json({ error: "成功したAI回答がないため継続モニタリングを開始できません。再度診断してください。" }, { status: 409 });
    const watch = await createWatch(scan, email);
    const delivery = await sendWatchStarted(watch);
    return Response.json({ token: watch.token, watchUrl: `/watch?token=${encodeURIComponent(watch.token)}`, emailSent: delivery.sent }, { headers: { "cache-control": "no-store", "referrer-policy": "no-referrer" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "継続モニタリングを開始できませんでした。" }, { status: 400 });
  }
}

export async function GET(request: Request) {
  const token = new URL(request.url).searchParams.get("token") || "";
  if (!token) return Response.json({ error: "モニタリングURLが正しくありません。" }, { status: 400 });
  const watch = await getWatch(token);
  if (!watch) return Response.json({ error: "モニタリング結果が見つかりません。" }, { status: 404 });
  const run = await getActiveWatchRun(watch.id);
  return Response.json({
    ...watch,
    measurementRun: run ? {
      id: run.id,
      status: run.status,
      panelKind: run.panelKind,
      completedPrompts: run.nextPromptIndex,
      totalPrompts: run.prompts.length,
      completedObservations: run.observations.length,
      totalObservations: run.prompts.length * 3 * run.repetitions,
      updatedAt: run.updatedAt,
    } : null,
  }, { headers: { "cache-control": "private, no-store", "referrer-policy": "no-referrer" } });
}
