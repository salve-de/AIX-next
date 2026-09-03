import type { MetadataRoute } from "next";
import { indexableRoutes, siteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  // Do not emit a moving timestamp: lastmod should describe a real content change.
  return indexableRoutes.map((route) => ({ url: route === "/" ? siteUrl : `${siteUrl}${route}` }));
}
