import { addEvidence } from "@/lib/storage";

export const runtime = "nodejs";

function sourceUrl(value: string) {
  if (!value) return undefined;
  const parsed = new URL(value);
  if (!["http:", "https:"].includes(parsed.protocol) || parsed.username || parsed.password) throw new Error("根拠URLは公開http/https URLにしてください。");
  parsed.hash = "";
  return parsed.toString();
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { token?: string; gapId?: string; value?: string; sourceUrl?: string };
    const token = body.token?.trim() || "";
    const gapId = body.gapId?.trim().slice(0, 160) || "";
    const value = body.value?.trim().slice(0, 5_000) || "";
    if (!token || !gapId || !value) return Response.json({ error: "入力内容が不足しています。" }, { status: 400 });
    const watch = await addEvidence(token, { gapId, value, sourceUrl: sourceUrl(body.sourceUrl?.trim() || "") });
    if (!watch) return Response.json({ error: "Watchが見つかりません。" }, { status: 404 });
    return Response.json(watch, { headers: { "cache-control": "private, no-store" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Evidenceを保存できませんでした。" }, { status: 400 });
  }
}
