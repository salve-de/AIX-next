import { consumeFreeScan } from "@/lib/rate-limit";
import { runScan } from "@/lib/scan-runner";
import { createScan, getRecentCompletedScan, updateScan } from "@/lib/storage";
import { normalizePublicUrl } from "@/lib/url-security";
import { FREE_PANEL_SIZE } from "@/lib/prompt-panels";

export const runtime = "nodejs";
export const maxDuration = 300;
export const dynamic = "force-dynamic";

function ndjsonResponse(run: (emit: (payload: unknown) => void, close: () => void) => void | Promise<void>) {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const emit = (payload: unknown) => controller.enqueue(encoder.encode(`${JSON.stringify(payload)}\n`));
      await run(emit, () => controller.close());
    },
  });
  return new Response(stream, { headers: { "content-type": "application/x-ndjson; charset=utf-8", "cache-control": "no-store", "x-accel-buffering": "no", "referrer-policy": "no-referrer" } });
}

export async function POST(request: Request) {
  let targetUrl: string;
  try {
    const body = await request.json() as { url?: string };
    targetUrl = normalizePublicUrl(body.url || "");
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "URLが不正です。" }, { status: 400 });
  }

  const cached = await getRecentCompletedScan(targetUrl, 10 * 60_000).catch(() => null);
  if (cached?.stage === "complete" && cached.result) {
    return ndjsonResponse((emit, close) => {
      emit({ type: "accepted", scanId: cached.id, reused: true });
      emit({ type: "progress", scanId: cached.id, stage: cached.stage, progress: 100, message: "前回の確認結果を表示します。", detail: "結果を準備しました" });
      emit({ type: "complete", scanId: cached.id, reused: true });
      close();
    });
  }

  const limit = await consumeFreeScan(request, targetUrl);
  if (!limit.allowed) return Response.json({ error: "無料診断の利用上限に達しました。時間を空けて再度お試しください。" }, { status: 429, headers: { "retry-after": String(limit.retryAfter) } });

  const scan = await createScan(targetUrl);
  return ndjsonResponse(async (emit, close) => {
    emit({ type: "accepted", scanId: scan.id });
    try {
      const result = await runScan({
        scanId: scan.id,
        url: targetUrl,
        promptCount: FREE_PANEL_SIZE,
        repetitions: 1,
        panelKind: "free",
        onProgress: async (event) => {
          await updateScan(scan.id, { stage: event.stage, progress: event.progress, message: event.message });
          emit({ type: "progress", scanId: scan.id, ...event });
        },
      });
      const stage = result.successfulObservations === result.scheduledObservations ? "complete" : "partial";
      await updateScan(scan.id, { stage, progress: 100, message: "結果と、最初に直すことをまとめました。", result, error: null });
      emit({ type: "complete", scanId: scan.id });
    } catch (error) {
      const message = error instanceof Error ? error.message : "診断に失敗しました。";
      await updateScan(scan.id, { stage: "failed", message, error: message });
      emit({ type: "error", scanId: scan.id, error: message });
    } finally {
      close();
    }
  });
}
