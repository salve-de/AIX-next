export const WATCH_SESSION_COOKIE = "aix_watch_session";
const MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

function decodeCookie(value: string) {
  try { return decodeURIComponent(value); } catch { return value; }
}

export function watchTokenFromCookie(request: Request) {
  const cookie = request.headers.get("cookie") || "";
  for (const part of cookie.split(";")) {
    const [name, ...rest] = part.trim().split("=");
    if (name === WATCH_SESSION_COOKIE) return decodeCookie(rest.join("=")).trim();
  }
  return "";
}

export function resolveWatchToken(request: Request, explicit?: string | null) {
  return explicit?.trim() || watchTokenFromCookie(request);
}

export function watchSessionCookie(token: string, requestUrl: string) {
  const secure = new URL(requestUrl).protocol === "https:";
  return [
    `${WATCH_SESSION_COOKIE}=${encodeURIComponent(token)}`,
    "Path=/",
    `Max-Age=${MAX_AGE_SECONDS}`,
    "HttpOnly",
    "SameSite=Lax",
    secure ? "Secure" : "",
  ].filter(Boolean).join("; ");
}

export function clearWatchSessionCookie(requestUrl: string) {
  const secure = new URL(requestUrl).protocol === "https:";
  return [
    `${WATCH_SESSION_COOKIE}=`,
    "Path=/",
    "Max-Age=0",
    "HttpOnly",
    "SameSite=Lax",
    secure ? "Secure" : "",
  ].filter(Boolean).join("; ");
}

export function safeSessionReturnPath(value: string | null | undefined) {
  const path = value?.trim() || "/watch";
  if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return "/watch";
  const pathname = path.split("?", 1)[0];
  if (pathname === "/watch" || pathname === "/billing" || pathname === "/workspace" || pathname.startsWith("/workspace/")) return path;
  return "/watch";
}
