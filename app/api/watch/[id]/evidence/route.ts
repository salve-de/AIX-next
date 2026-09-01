import { addEvidence } from "@/lib/store";

export const runtime = "nodejs";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json() as { token?: string; gapId?: string; value?: string; sourceUrl?: string };
    const token = body.token || "";
    const gapId = (body.gapId || "").trim().slice(0, 120);
    const value = (body.value || "").trim().slice(0, 5000);
    if (!token || !gapId || !value) return Response.json({ error: "入力内容が不足しています。" }, { status: 400 });
    let sourceUrl: string | undefined;
    if (body.sourceUrl) {
      const parsed = new URL(body.sourceUrl);
      if (!["http:", "https:"].includes(parsed.protocol) || parsed.username || parsed.password) throw new Error("根拠URLは公開http/https URLにしてください。");
      sourceUrl = parsed.toString();
    }
    const watch = await addEvidence(id, token, { gapId, value, sourceUrl });
    if (!watch) return Response.json({ error: "Watchが見つかりません。" }, { status: 404 });
    return Response.json({ watch }, { headers: { "cache-control": "private, no-store", "referrer-policy": "no-referrer" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Evidenceを保存できませんでした。" }, { status: 400 });
  }
}
