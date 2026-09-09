import { NextResponse } from "next/server";
import { buildClearCookieHeader } from "@/lib/auth";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function POST(_request?: Request) {
  const response = NextResponse.json({ ok: true });
  response.headers.set("Set-Cookie", buildClearCookieHeader());
  return response;
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const response = NextResponse.redirect(new URL("/", url.origin));
  response.headers.set("Set-Cookie", buildClearCookieHeader());
  return response;
}
