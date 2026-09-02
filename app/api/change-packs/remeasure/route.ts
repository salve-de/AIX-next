import { id } from "@/lib/ids";
import { freeProviders, paidProviders } from "@/lib/providers";
import { runScan } from "@/lib/scan-runner";
import { getWatch, saveChangePack } from "@/lib/storage";
import type { Observation } from "@/lib/types";
import { resolveWatchToken } from "@/lib/watch-session";

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
    const token = resolveWatchToken(request, body.token);
    if (!token) return Response.json({ error: "Watch sessionが必要です。" }, { status: 401 });
    if (!body.packId) return Response.json({ error: "packIdが必要です。" }, { status: 400 });
    const watch = await getWatch(token);
    if (!watch) return Response.json({ error: "Watchが見つかりません。" }, { status: 404 });
    const pack = (watch.changePacks || []).find((item) => item.id === body.packId);
    if (!pack) return Response.json({ error: "Change Packが見つかりません。" }, { status: 404 });
    if (pack.status !== "approved") return Response.json({ error: "再測定にはChange Packの明示承認が必要です。" }, { status: 409 });

    const promptIds = new Set(pack.remeasurePromptIds);
    const prompts = watch.latest.prompts.filter((prompt) => promptIds.has(prompt.id));
    if (!prompts.length) return Response.json({ error: "再測定対象Promptがありません。" }, { status: 409 });
    const beforeRows = watch.latest.observations.filter((item) => promptIds.has(item.promptId));
    const providerNames = watch.paid ? paidProviders : freeProviders;
    const result = await runScan({
      scanId: id("validation"),
      url: watch.latest.targetUrl,
      prompts,
      promptCount: prompts.length,
      repetitions: watch.paid ? 3 : 1,
      panelKind: "custom",
      providerNames,
    });
    const validation = {
      measuredAt: result.measuredAt,
      promptIds: prompts.map((prompt) => prompt.id),
      beforeCoverage: coverage(beforeRows),
      afterCoverage: result.recommendationCoverage,
      successfulObservations: result.successfulObservations,
      note: `同じ対象Promptを${providerNames.length} AI surfaceで再観測した差です。Change Packが差の原因であるとは断定しません。`,
    };
    const updatedPack = { ...pack, validation };
    const updatedWatch = await saveChangePack(token, updatedPack);
    return Response.json({ pack: updatedPack, watch: updatedWatch, result }, { headers: { "cache-control": "private, no-store", "referrer-policy": "no-referrer" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "再測定できませんでした。" }, { status: 400 });
  }
}
