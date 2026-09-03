import { consumeNameResolution } from "@/lib/rate-limit";
import { resolvePublicInput } from "@/lib/input-resolution";

export const runtime = "nodejs";
export const maxDuration = 30;
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json() as { input?: string };
    const limit = await consumeNameResolution(request);
    if (!limit.allowed) return Response.json({ error: "名前検索の利用上限に達しました。時間を空けて再度お試しください。" }, { status: 429, headers: { "retry-after": String(limit.retryAfter), "cache-control": "no-store" } });
    const result = await resolvePublicInput(body.input || "");
    return Response.json(result, { headers: { "cache-control": "no-store", "referrer-policy": "no-referrer" } });
  } catch (error) {
    const message = error instanceof Error ? error.message : "公開サイトを探せませんでした。";
    const status = /設定が必要/.test(message) ? 503 : 422;
    return Response.json({ error: message }, { status, headers: { "cache-control": "no-store", "referrer-policy": "no-referrer" } });
  }
}
