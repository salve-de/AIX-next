import { NextResponse } from "next/server";
import { env } from "@/lib/env";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const redirectUri = `${url.origin}/api/auth/callback/google`;

  if (!env.googleClientId) {
    // Google Client ID が未設定の開発環境向けフォールバック
    return NextResponse.json({
      configured: false,
      message: "GOOGLE_CLIENT_ID が設定されていません。.env.local に GOOGLE_CLIENT_ID と GOOGLE_CLIENT_SECRET を設定してください。",
      setupUrl: "https://console.cloud.google.com/apis/credentials",
    }, { status: 503 });
  }

  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", env.googleClientId);
  googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid email profile");
  googleAuthUrl.searchParams.set("prompt", "select_account");

  return NextResponse.redirect(googleAuthUrl.toString());
}
