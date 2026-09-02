import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/$/, "");
  const lastModified = new Date();
  return [
    { url: base, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/pricing`, lastModified, changeFrequency: "monthly", priority: .8 },
    { url: `${base}/methodology`, lastModified, changeFrequency: "monthly", priority: .8 },
    { url: `${base}/privacy`, lastModified, changeFrequency: "yearly", priority: .4 },
    { url: `${base}/terms`, lastModified, changeFrequency: "yearly", priority: .4 },
    { url: `${base}/commerce`, lastModified, changeFrequency: "yearly", priority: .3 },
    { url: `${base}/support`, lastModified, changeFrequency: "monthly", priority: .3 },
    { url: `${base}/data-rights`, lastModified, changeFrequency: "yearly", priority: .2 },
  ];
}
