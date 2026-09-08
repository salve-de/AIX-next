import type { Metadata } from "next";
import { Suspense } from "react";
import { MarketingShell } from "@/components/marketing-shell";
import { LoginClient } from "@/components/login-client";
import "../utility.css";

export const metadata: Metadata = {
  title: "ログイン",
  description: "Rovanアカウントへのログイン。自社専用AI推薦ダッシュボード、週次見守り、契約・決済管理画面を開きます。",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <MarketingShell
      eyebrow="ログイン"
      title="Rovan アカウントへログイン。"
      lead="パスワードの記憶は不要です。Googleアカウント、またはメールアドレスへの直通リンクで1クリックで安全にログインできます。"
    >
      <Suspense fallback={<div className="billing-panel"><p>読み込み中…</p></div>}>
        <LoginClient />
      </Suspense>
    </MarketingShell>
  );
}
