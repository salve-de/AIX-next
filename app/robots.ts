import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  return {
    rules: [{
      userAgent: "*",
      allow: ["/", "/pricing", "/methodology", "/privacy", "/terms", "/commerce", "/support"],
      disallow: ["/api/", "/scan", "/result", "/watch", "/billing", "/data-rights", "/setup"],
    }],
    sitemap: `${siteUrl.replace(/\/$/, "")}/sitemap.xml`,
  };
}
