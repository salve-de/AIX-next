/** Only known local capability routes may be opened from a pasted management link. */
export function managementDestination(value: string, origin: string): string | null {
  try {
    const url = new URL(value.trim(), origin);
    if (url.origin !== origin || url.username || url.password) return null;
    const params = url.searchParams;
    if (url.pathname === "/watch" && params.get("token")) return `/watch?token=${encodeURIComponent(params.get("token")!)}`;
    if (url.pathname === "/result" && params.get("id")) return `/result?id=${encodeURIComponent(params.get("id")!)}`;
    if (url.pathname === "/profile/manage") {
      if (params.get("profileId") && params.get("token")) return `/profile/manage?profileId=${encodeURIComponent(params.get("profileId")!)}&token=${encodeURIComponent(params.get("token")!)}${params.get("watchToken") ? `&watchToken=${encodeURIComponent(params.get("watchToken")!)}` : ""}`;
      if (params.get("watchToken")) return `/profile/manage?watchToken=${encodeURIComponent(params.get("watchToken")!)}`;
    }
  } catch { /* Invalid links remain in the form, never navigated. */ }
  return null;
}

export function watchTokenFromInput(value: string): string {
  const input = value.trim();
  if (!input.includes("://") && !input.startsWith("/")) return input;
  try {
    const url = new URL(input, "https://management.invalid");
    return url.pathname === "/watch" ? url.searchParams.get("token") || "" : "";
  } catch { return ""; }
}
