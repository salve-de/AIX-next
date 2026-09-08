import { NextResponse } from "next/server";
import { findWatchesByEmail } from "@/lib/storage";
import { createOneTimeLoginToken } from "@/lib/auth";
import { env } from "@/lib/env";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "有効なメールアドレスを入力してください。" }, { status: 400 });
    }

    const watches = await findWatchesByEmail(email);
    if (watches.length === 0) {
      return NextResponse.json({
        error: "ご入力のメールアドレスで登録された診断・契約データが見つかりません。まずはトップページから無料診断をお試しください。",
        notFound: true,
      }, { status: 404 });
    }

    const latestWatch = watches[0];
    const loginToken = createOneTimeLoginToken(email);
    const origin = env.siteUrl || request.headers.get("origin") || "http://localhost:3000";
    const loginUrl = `${origin}/api/auth/verify?token=${encodeURIComponent(loginToken)}`;

    let emailSent = false;
    if (env.resendApiKey && env.watchFromEmail) {
      try {
        const emailResponse = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            authorization: `Bearer ${env.resendApiKey}`,
            "content-type": "application/json",
          },
          body: JSON.stringify({
            from: env.watchFromEmail,
            to: email,
            subject: "【Rovan】ログイン用リンクをお届けします",
            text: `Rovanへのログインリクエストを受け付けました。\n\n以下のリンクをクリックしてログインしてください（有効期限15分）：\n${loginUrl}\n\n※このメールに心当たりがない場合は、安全のため破棄してください。`,
            html: `<p>Rovanへのログインリクエストを受け付けました。</p><p><a href="${loginUrl}" style="display:inline-block;background:#0f172a;color:#ffffff;padding:12px 24px;border-radius:6px;text-decoration:none;font-weight:bold;">Rovanにログインする</a></p><p style="color:#64748b;font-size:0.85rem;">リンクの有効期限は15分です。<br />※このメールに心当たりがない場合は破棄してください。</p>`,
          }),
        });
        emailSent = emailResponse.ok;
      } catch (err) {
        console.error("Failed to send login email via Resend:", err);
      }
    }

    return NextResponse.json({
      ok: true,
      emailSent,
      brandName: latestWatch.latest?.discovery?.brandName || "御社",
      // 開発環境またはResend未設定時は、開発者が確認できるようにURLを返却
      devLoginUrl: (!env.resendApiKey || process.env.NODE_ENV !== "production") ? loginUrl : undefined,
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "ログインリンクの送信に失敗しました。" }, { status: 500 });
  }
}
