import Link from "next/link";
import { Brand } from "@/components/brand";

export type NavigationContext = { resultHref: string; profileHref: string; watchHref: string };

export function SiteHeader({ compact = false, context }: { compact?: boolean; context?: NavigationContext }) {
  const links = context ? [
    [context.resultHref, "① 診断レポート"], [context.profileHref, "② AI推薦データ"], [context.watchHref, "③ 週次見守り"],
  ] : [
    ["/result?sample=1", "診断レポートの見本"], ["/ai/company/aoba-souzoku?sample=1", "AI推薦データの見本"], ["/watch?sample=1", "週次見守りの見本"],
  ];
  return (
    <header className={`site-header ${compact ? "site-header-compact" : ""}`}>
      <div className="shell header-inner">
        <Brand />
        <nav className="header-nav" aria-label="主要ナビゲーション">
          {links.map(([href, label]) => <Link key={label} href={href} prefetch={false}>{label}</Link>)}
          <Link href="/pricing" title="料金プラン">
            料金プラン
          </Link>
          <Link href="/login" style={{ fontWeight: 600, marginLeft: "4px" }}>
            ログイン
          </Link>
          <Link className="header-cta" href="/#scan">
            AI推薦の現状を無料診断
          </Link>
        </nav>
        <details className="mobile-menu">
          <summary>メニュー</summary>
          <nav aria-label="モバイルナビゲーション">
            <Link href="/#scan">AI推薦の現状を無料診断</Link>
            {links.map(([href, label]) => <Link key={label} href={href} prefetch={false}>{label}</Link>)}
            <Link href="/pricing">料金プラン</Link>
            <Link href="/login">ログイン</Link>
            <Link href="/manage">管理画面を開く</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
