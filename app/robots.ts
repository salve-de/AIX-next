import type { MetadataRoute } from "next";
import { privateRoutes, siteUrl } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Keep public pages crawlable for ChatGPT Search and other OpenAI crawlers.
      { userAgent: ["OAI-SearchBot", "OAI-AdsBot"], allow: "/", disallow: [...privateRoutes] },
      { userAgent: "GPTBot", allow: "/", disallow: [...privateRoutes] },
      { userAgent: "*", allow: "/", disallow: [...privateRoutes] },
    ],
    sitemap: [`${siteUrl}/sitemap.xml`, `${siteUrl}/ai/sitemap.xml`],
  };
}
