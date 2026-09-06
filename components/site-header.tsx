import Link from "next/link";
import { Brand } from "@/components/brand";

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header className={`site-header ${compact ? "site-header-compact" : ""}`}>
      <div className="shell header-inner">
        <Brand />
        <nav className="header-nav" aria-label="主要ナビゲーション">
          <Link href="/result?sample=1" title="AI診断レポートの設計見本">
            ① 診断レポート
          </Link>
          <Link href="/ai/company/aoba-souzoku?sample=1" title="公開情報参照ページの設計見本">
            ② 公開情報の見本
          </Link>
          <Link href="/watch?sample=1" title="週次測定の管理画面の見本">
            ③ 週次見守り
          </Link>
          <Link href="/pricing" title="料金プラン">
            料金プラン
          </Link>
          <Link className="header-cta" href="/#scan">
            AI推薦の現状を無料診断
          </Link>
        </nav>
        <details className="mobile-menu">
          <summary>メニュー</summary>
          <nav aria-label="モバイルナビゲーション">
            <Link href="/#scan">AI推薦の現状を無料診断</Link>
            <Link href="/result?sample=1">① 診断レポート（見本）</Link>
            <Link href="/ai/company/aoba-souzoku?sample=1">② 公開情報の見本</Link>
            <Link href="/watch?sample=1">③ 週次見守り（見本）</Link>
            <Link href="/pricing">料金プラン</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
