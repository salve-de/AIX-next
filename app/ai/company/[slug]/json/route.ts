import { getActivePublicProfileBySlug } from "@/lib/storage";
import { buildPublicProfileDraft, toPublicProfile } from "@/lib/public-profile";
import { sampleResult } from "@/lib/sample-data";
import type { PublicProfile } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function sampleProfile(): PublicProfile {
  const draft = buildPublicProfileDraft(sampleResult, "2026-09-01T09:00:00.000Z");
  return { ...draft, id: "sample_public_profile", slug: "nexora-cloud", status: "published", createdAt: "2026-09-01T09:00:00.000Z", updatedAt: "2026-09-01T09:00:00.000Z", expiresAt: "2027-09-01T09:00:00.000Z", publishedAt: "2026-09-01T09:00:00.000Z" };
}

export async function GET(request: Request, context: { params: Promise<{ slug: string }> }) {
  const { slug } = await context.params;
  if ((slug === "nexora-cloud" || slug === "aoba-souzoku") && new URL(request.url).searchParams.get("sample") === "1") {
    return new Response(JSON.stringify(sampleProfile(), null, 2), { headers: { "content-type": "application/json; charset=utf-8", "cache-control": "public, max-age=300, s-maxage=300", "x-content-type-options": "nosniff" } });
  }
  const record = await getActivePublicProfileBySlug(slug);
  if (!record) return Response.json({ error: "公開ページが見つかりません。" }, { status: 404, headers: { "cache-control": "no-store", "x-robots-tag": "noindex" } });
  return new Response(JSON.stringify(toPublicProfile(record), null, 2), { headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store", "x-content-type-options": "nosniff" } });
}
