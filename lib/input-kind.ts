import { parseSocialInput } from "@/lib/social-input";

export type ScanInputKind = "url" | "name" | "social";

/**
 * This only decides whether a search step is needed. URL validation still
 * happens on the server with normalizePublicUrl before anything is fetched.
 * SNS profiles (Instagram, X, etc.) are treated as special profiles, not standard crawl targets.
 */
export function isUrlInput(value: string) {
  const raw = value.trim();
  if (!raw) return false;
  // SNSアカウントやSNSのURLは通常のWebクローラー対象から除外し、専用フローで処理する
  if (parseSocialInput(raw).isSocial) return false;
  // Keep product names such as "Acme: Pro" in the name flow. Treat an
  // explicit web protocol (including unsupported ones, which the server will
  // reject) as a URL, but do not mistake ordinary punctuation for a scheme.
  if (/^[a-z][a-z\d+.-]*:\/\//i.test(raw)) return true;
  return /^\S+\.\S{2,}(?:[/:?#].*)?$/u.test(raw);
}

export function classifyScanInput(value: string): ScanInputKind {
  if (parseSocialInput(value).isSocial) return "social";
  return isUrlInput(value) ? "url" : "name";
}
