import { NextResponse } from "next/server";
import { verifyOneTimeLoginToken, createSessionToken, buildSessionCookieHeader } from "@/lib/auth";
import { findWatchesByEmail } from "@/lib/storage";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = url.searchParams.get("token") || "";

  if (!token) {
    return NextResponse.redirect(new URL("/login?error=invalid", url.origin));
  }

  const verified = verifyOneTimeLoginToken(token);
  if (!verified) {
    return NextResponse.redirect(new URL("/login?error=expired", url.origin));
  }

  const email = verified.email;
  const watches = await findWatchesByEmail(email);
  const latestWatch = watches[0];

  const sessionToken = createSessionToken({
    email,
    watchToken: latestWatch?.token,
    brandName: latestWatch?.latest?.discovery?.brandName,
  });

  const destination = latestWatch?.token
    ? new URL(`/watch?token=${encodeURIComponent(latestWatch.token)}`, url.origin)
    : new URL("/", url.origin);

  const response = NextResponse.redirect(destination);
  response.headers.set("Set-Cookie", buildSessionCookieHeader(sessionToken));
  return response;
}
