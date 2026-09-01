import { generateBuyerPrompts } from "@/lib/discovery";
import { id } from "@/lib/ids";
import { runScan } from "@/lib/scan-runner";
import { createWatch, getScan, getWatch } from "@/lib/storage";

export const runtime = "nodejs";
export const maxDuration = 300;
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

    // The free 12-prompt snapshot is directional. A Watch starts a separate,
    // stable 30-prompt Core baseline so later trend comparisons do not mix panels.
    const corePrompts = await generateBuyerPrompts(scan.result.discovery, 30, "core");
    const coreBaseline = await runScan({
      scanId: id("trialcore"),
      url: scan.result.targetUrl,
      prompts: corePrompts,
      promptCount: corePrompts.length,
      repetitions: 1,
      panelKind: "core",
    });
    if (!coreBaseline.successfulObservations) return Response.json({ error: "Watch用Core Panelを測定できませんでした。Provider設定を確認してください。" }, { status: 409 });

    const watch = await createWatch(scan, email, coreBaseline);
    return Response.json({
      token: watch.token,
      watchUrl: `/watch?token=${encodeURIComponent(watch.token)}`,
      trialEndsAt: watch.trialEndsAt,
      corePromptCount: coreBaseline.panel.promptCount,
    }, { headers: { "cache-control": "no-store", "referrer-policy": "no-referrer" } });
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
