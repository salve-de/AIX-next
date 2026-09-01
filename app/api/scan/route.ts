import { consumeFreeScan } from "@/lib/rate-limit";
import { runScan } from "@/lib/scan-runner";
import { createScan, updateScan } from "@/lib/storage";
import { normalizePublicUrl } from "@/lib/url-security";

export const runtime = "nodejs";
export const maxDuration = 300;
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  let targetUrl: string;
  try {
    const body = await request.json() as { url?: string };
    targetUrl = normalizePublicUrl(body.url || "");
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "URLが不正です。" }, { status: 400 });
  }

  const limit = await consumeFreeScan(request, targetUrl);
  if (!limit.allowed) return Response.json({ error: "無料診断の利用上限に達しました。時間を空けて再度お試しください。" }, { status: 429, headers: { "retry-after": String(limit.retryAfter) } });

  const scan = await createScan(targetUrl);
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const emit = (payload: unknown) => controller.enqueue(encoder.encode(`${JSON.stringify(payload)}\n`));
      emit({ type: "accepted", scanId: scan.id });
      try {
        const result = await runScan({
          scanId: scan.id,
          url: targetUrl,
          promptCount: 12,
          repetitions: 1,
          panelKind: "free",
          onProgress: async (event) => {
            await updateScan(scan.id, { stage: event.stage, progress: event.progress, message: event.message });
            emit({ type: "progress", scanId: scan.id, ...event });
          },
        });
        const stage = result.successfulObservations === result.scheduledObservations ? "complete" : "partial";
        await updateScan(scan.id, { stage, progress: 100, message: "診断結果を作成しました。", result, error: null });
        emit({ type: "complete", scanId: scan.id });
      } catch (error) {
        const message = error instanceof Error ? error.message : "診断に失敗しました。";
        await updateScan(scan.id, { stage: "failed", message, error: message });
        emit({ type: "error", scanId: scan.id, error: message });
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, { headers: { "content-type": "application/x-ndjson; charset=utf-8", "cache-control": "no-store", "x-accel-buffering": "no", "referrer-policy": "no-referrer" } });
}
