import { listActivePublicProfiles } from "@/lib/storage";
import { siteUrl } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function escapeXml(value: string) {
  return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&apos;");
}

export async function GET() {
  const urls = (await listActivePublicProfiles()).map((profile) => ({
    url: `${siteUrl}/ai/company/${encodeURIComponent(profile.slug)}`,
    updatedAt: profile.updatedAt,
  }));
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map((item) => `<url><loc>${escapeXml(item.url)}</loc><lastmod>${escapeXml(item.updatedAt)}</lastmod><changefreq>monthly</changefreq><priority>0.6</priority></url>`).join("")}</urlset>\n`;
  return new Response(body, { headers: { "content-type": "application/xml; charset=utf-8", "cache-control": "public, max-age=300, s-maxage=300", "x-content-type-options": "nosniff" } });
}
