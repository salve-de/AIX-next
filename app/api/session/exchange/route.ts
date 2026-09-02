import { getWatch } from "@/lib/storage";
import { clearWatchSessionCookie, safeSessionReturnPath, watchSessionCookie } from "@/lib/watch-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function validate(token: string) {
  if (!token || token.length > 300) return null;
  return getWatch(token);
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token")?.trim() || "";
  const next = safeSessionReturnPath(url.searchParams.get("next"));
  const watch = await validate(token);
  if (!watch) return new Response("Watch link is invalid or expired.", { status: 401, headers: { "cache-control": "no-store", "referrer-policy": "no-referrer" } });

  const response = Response.redirect(new URL(next, request.url), 303);
  response.headers.set("set-cookie", watchSessionCookie(watch.token, request.url));
  response.headers.set("cache-control", "no-store");
  response.headers.set("referrer-policy", "no-referrer");
  return response;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { token?: string };
    const token = body.token?.trim() || "";
    const watch = await validate(token);
    if (!watch) return Response.json({ error: "Watch linkが無効です。" }, { status: 401, headers: { "cache-control": "no-store" } });
    return Response.json({ ok: true, brandName: watch.latest.discovery.brandName }, {
      headers: {
        "set-cookie": watchSessionCookie(watch.token, request.url),
        "cache-control": "no-store",
        "referrer-policy": "no-referrer",
      },
    });
  } catch {
    return Response.json({ error: "Sessionを開始できませんでした。" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  return Response.json({ ok: true }, {
    headers: {
      "set-cookie": clearWatchSessionCookie(request.url),
      "cache-control": "no-store",
    },
  });
}
