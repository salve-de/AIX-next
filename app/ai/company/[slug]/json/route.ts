import { getActivePublicProfileBySlug } from "@/lib/storage";
import { toPublicProfile } from "@/lib/public-profile";
import { getSampleProfile } from "@/lib/sample-profiles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  if (new URL(request.url).searchParams.get("sample") === "1") {
    const profile = getSampleProfile(slug);
    if (!profile) return Response.json({ error: "見本が見つかりません。" }, { status: 404, headers: { "cache-control": "no-store", "x-robots-tag": "noindex" } });
    return new Response(JSON.stringify(profile, null, 2), { headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=300, s-maxage=300", "x-content-type-options": "nosniff", "x-robots-tag": "noindex" } });
  }
  const record = await getActivePublicProfileBySlug(slug);
  if (!record) return Response.json({ error: "公開ページが見つかりません。" }, { status: 404, headers: { "cache-control": "no-store", "x-robots-tag": "noindex" } });
  return new Response(JSON.stringify(toPublicProfile(record), null, 2), { headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff" } });
}
