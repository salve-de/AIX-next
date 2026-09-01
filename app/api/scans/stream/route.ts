import { consumeFreeScan } from "@/lib/rate-limit";
import { runScan } from "@/lib/scan-engine";
import { normalizePublicUrl } from "@/lib/security";
import { createScan, markScanFailure } from "@/lib/store";

export const runtime = "nodejs";
export const maxDuration = 300;

export async function POST(request: Request) {
  let url: string;
  try {
    const body = await request.json() as { url?: string };
    url = normalizePublicUrl(body.url || "");
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "URLが不正です。" }, { status: 400 });
  }
  const limit = consumeFreeScan(request, url);
  if (!limit.allowed) return Response.json({ error: "無料診断の上限に達しました。時間を空けて再度お試しください。" }, { status: 429, headers: { "retry-after": String(limit.retryAfter) } });

  const scan = await createScan(url);
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: unknown) => controller.enqueue(encoder.encode(`${JSON.stringify(payload)}\n`));
      send({ type: "accepted", scanId: scan.id });
      try {
        const result = await runScan({ scanId: scan.id, url, promptCount: 12, repetitions: 1, onProgress: (event) => send({ type: "progress", ...event }) });
        send({ type: "complete", scanId: scan.id, result });
      } catch (error) {
        await markScanFailure(scan.id, "failed", error);
        send({ type: "error", scanId: scan.id, error: error instanceof Error ? error.message : "診断に失敗しました。" });
      } finally { controller.close(); }
    },
  });
  return new Response(stream, { headers: { "content-type": "application/x-ndjson; charset=utf-8", "cache-control": "no-store", "x-accel-buffering": "no", "referrer-policy": "no-referrer" } });
}
