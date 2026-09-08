import { NextResponse } from "next/server";
import { buildClearCookieHeader } from "@/lib/auth";

export async function POST(request: Request) {
  const url = new URL(request.url);
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
