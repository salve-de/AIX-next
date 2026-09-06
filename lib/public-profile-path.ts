import { siteUrl } from "@/lib/site";

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf-]+/gi, "-")
    .replace(/^-+|-+$/g, "") || "company";
}

export function publicProfileSlug(targetUrl: string) {
  try {
    const parsed = new URL(targetUrl);
    const configured = new URL(siteUrl);
    const segments = parsed.pathname.split("/").filter(Boolean);
    // Direct profiles use a Rovan URL as their source because no external
    // site exists. Derive the slug from that path, not from the shared host.
    if (parsed.origin === configured.origin && segments.length === 3 && segments[0] === "ai" && segments[1] === "company") {
      return slugify(decodeURIComponent(segments[2]));
    }
    return slugify(parsed.hostname.replace(/^www\./i, ""));
  } catch {
    return "company";
  }
}

export function publicProfileHref(targetUrl: string, sample = false) {
  const slug = sample ? "aoba-souzoku" : publicProfileSlug(targetUrl);
  return `/ai/company/${encodeURIComponent(slug)}${sample ? "?sample=1" : ""}`;
}
