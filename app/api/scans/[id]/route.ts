import { getScan } from "@/lib/store";

export const runtime = "nodejs";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const scan = await getScan(id);
  if (!scan) return Response.json({ error: "診断が見つかりません。" }, { status: 404 });
  return Response.json(scan, { headers: { "cache-control": "private, no-store", "referrer-policy": "no-referrer" } });
}
