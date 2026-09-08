import { NextResponse } from "next/server";
import { parseSessionCookie, verifySessionToken } from "@/lib/auth";
import { findWatchesByEmail } from "@/lib/storage";

export async function GET(request: Request) {
  const cookieHeader = request.headers.get("cookie");
  const rawToken = parseSessionCookie(cookieHeader);
  if (!rawToken) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  const session = verifySessionToken(rawToken);
  if (!session) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  // 最新のWatchTokenを再確認
  let watchToken = session.watchToken;
  let brandName = session.brandName;
  if (!watchToken) {
    const watches = await findWatchesByEmail(session.email);
    if (watches[0]) {
      watchToken = watches[0].token;
      brandName = watches[0].latest?.discovery?.brandName || brandName;
    }
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      email: session.email,
      watchToken,
      brandName,
    },
  });
}
