import { id } from "@/lib/ids";
import { runScan } from "@/lib/scan-runner";
import { getWatch, saveChangePack } from "@/lib/storage";
import type { Observation } from "@/lib/types";

export const runtime = "nodejs";
export const maxDuration = 300;
export const dynamic = "force-dynamic";

function coverage(rows: Observation[]) {
  const success = rows.filter((item) => item.status === "success");
  return success.length ? Math.round(success.filter((item) => item.ownRecommended).length / success.length * 100) : 0;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { token?: string; packId?: string };
    if (!body.token || !body.packId) return Response.json({ error: "tokenとpackIdが必要です。" }, { status: 400 });
    const watch = await getWatch(body.token);
    if (!watch) return Response.json({ error: "Watchが見つかりません。" }, { status: 404 });
    const pack = (watch.changePacks || []).find((item) => item.id === body.packId);
    if (!pack) return Response.json({ error: "Change Packが見つかりません。" }, { status: 404 });
    if (pack.status !== "approved") return Response.json({ error: "再測定にはChange Packの明示承認が必要です。" }, { status: 409 });

    const promptIds = new Set(pack.remeasurePromptIds);
    const prompts = watch.latest.prompts.filter((prompt) => promptIds.has(prompt.id));
    if (!prompts.length) return Response.json({ error: "再測定対象Promptがありません。" }, { status: 409 });
    const beforeRows = watch.latest.observations.filter((item) => promptIds.has(item.promptId));
    const result = await runScan({
      scanId: id("validation"),
      url: watch.latest.targetUrl,
      prompts,
      promptCount: prompts.length,
      repetitions: watch.paid ? 3 : 1,
      panelKind: "discovery",
    });
    const validation = {
      measuredAt: result.measuredAt,
      promptIds: prompts.map((prompt) => prompt.id),
      beforeCoverage: coverage(beforeRows),
      afterCoverage: result.recommendationCoverage,
      successfulObservations: result.successfulObservations,
      note: "同じ対象Promptの観測差です。Change Packが差の原因であるとは断定しません。",
    };
    const updatedPack = { ...pack, validation };
    const updatedWatch = await saveChangePack(body.token, updatedPack);
    return Response.json({ pack: updatedPack, watch: updatedWatch, result }, { headers: { "cache-control": "private, no-store", "referrer-policy": "no-referrer" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "再測定できませんでした。" }, { status: 400 });
  }
}
