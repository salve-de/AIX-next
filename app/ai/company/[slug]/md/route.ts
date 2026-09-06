import { getActivePublicProfileBySlug } from "@/lib/storage";
import { toPublicProfile } from "@/lib/public-profile";
import { getSampleProfile } from "@/lib/sample-profiles";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  if (new URL(request.url).searchParams.get("sample") === "1") {
    const profile = getSampleProfile(slug);
    if (!profile) return new Response("設計見本が見つかりません。\n", { status: 404, headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" } });
    return new Response(profile.markdown, { headers: { "content-type": "text/markdown; charset=utf-8", "cache-control": "public, max-age=300, s-maxage=300", "x-content-type-options": "nosniff", "x-robots-tag": "noindex" } });
  }
  const record = await getActivePublicProfileBySlug(slug);
  if (!record) return new Response("公開ページが見つかりません。\n", { status: 404, headers: { "content-type": "text/plain; charset=utf-8", "cache-control": "no-store", "x-robots-tag": "noindex" } });
  return new Response(toPublicProfile(record).markdown, { headers: { "content-type": "text/markdown; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff" } });
}
