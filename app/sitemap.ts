import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const now = new Date();
  return [
    { url: base, lastModified: now, priority: 1, changeFrequency: "weekly" },
    { url: `${base}/pricing`, lastModified: now, priority: .8, changeFrequency: "monthly" },
    { url: `${base}/methodology`, lastModified: now, priority: .8, changeFrequency: "monthly" },
    { url: `${base}/privacy`, lastModified: now, priority: .3, changeFrequency: "yearly" },
    { url: `${base}/terms`, lastModified: now, priority: .3, changeFrequency: "yearly" },
    { url: `${base}/bot`, lastModified: now, priority: .2, changeFrequency: "yearly" },
  ];
}
