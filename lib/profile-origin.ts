import { siteUrl } from "./site";

/** Only an unconfigured local development server may use its request origin.
 * Callers supply Request.url and the browser Origin header, never body fields.
 * Next may canonicalize the request host; validate the browser origin against
 * the local server's protocol/port before retaining its loopback hostname.
 */
export function directProfileOrigin(requestUrl?: string, requestOrigin?: string) {
  if (process.env.NODE_ENV !== "development" || process.env.NEXT_PUBLIC_SITE_URL?.trim() || !requestUrl) return siteUrl;
  const local = (value: string) => {
    const url = new URL(value);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password || !["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)) throw new Error("開発環境の公開先URLを確認できませんでした。");
    return url;
  };
  const request = local(requestUrl);
  if (!requestOrigin) return request.origin;
  const origin = local(requestOrigin);
  if (origin.protocol !== request.protocol || origin.port !== request.port || origin.pathname !== "/" || origin.search || origin.hash) throw new Error("開発環境の公開先URLを確認できませんでした。");
  return origin.origin;
}
