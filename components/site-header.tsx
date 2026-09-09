import Link from "next/link";
import { Brand } from "@/components/brand";

export type NavigationContext = { resultHref: string; profileHref: string; watchHref: string };

export function SiteHeader({ compact = false, context }: { compact?: boolean; context?: NavigationContext }) {
  const links = context ? [
    [context.resultHref, "① AI購買監査"], [context.profileHref, "② 公開情報"], [context.watchHref, "③ 継続Watch"],
  ] : [
    ["/result?sample=1", "AI購買監査の見本"], ["/ai/company/aoba-souzoku?sample=1", "公開情報の見本"], ["/watch?sample=1", "Watchの見本"],
  ];
  return (
    <header className={`site-header ${compact ? "site-header-compact" : ""}`}>
      <div className="shell header-inner">
        <Brand />
        <nav className="header-nav" aria-label="主要ナビゲーション">
          <div className="header-nav-links">
            {links.map(([href, label]) => <Link key={label} href={href} prefetch={false}>{label}</Link>)}
            <Link href="/pricing" title="料金プラン">料金プラン</Link>
          </div>
          <div className="header-nav-actions">
            <Link href="/manage" className="header-manage-link" title="管理画面を開く">管理画面を開く</Link>
            <Link href="/login" className="header-login-link">ログイン</Link>
            <Link className="header-cta" href="/#scan">無料AI購買監査</Link>
          </div>
        </nav>
        <details className="mobile-menu">
          <summary>メニュー</summary>
          <nav aria-label="モバイルナビゲーション">
            <Link href="/#scan">無料AI購買監査</Link>
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
