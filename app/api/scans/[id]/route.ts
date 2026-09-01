import { getScan } from "@/lib/storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const scan = await getScan(id);
  if (!scan) return Response.json({ error: "診断結果が見つかりません。" }, { status: 404 });
  return Response.json(scan, { headers: { "cache-control": "private, no-store", "referrer-policy": "no-referrer" } });
}
