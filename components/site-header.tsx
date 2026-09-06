import Link from "next/link";
import { Brand } from "@/components/brand";

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  return (
    <header className={`site-header ${compact ? "site-header-compact" : ""}`}>
      <div className="shell header-inner">
        <Brand />
        <nav className="header-nav" aria-label="主要ナビゲーション">
          <Link href="/result?sample=1" title="自社専用 AI診断レポートの見本">
            ① 診断レポート
          </Link>
          <Link href="/ai/company/aoba-souzoku?sample=1" title="自社専用 AI公式推薦データの実物">
            ② AI公式データ
          </Link>
          <Link href="/watch?sample=1" title="週次自動モニタリングの管理画面">
            ③ 週次見守り
          </Link>
          <Link href="/pricing" title="料金プランと特別優待">
            料金プラン
          </Link>
          <Link className="header-cta" href="/#scan">
            無料でAI推薦を調べる
          </Link>
        </nav>
        <details className="mobile-menu">
          <summary>メニュー</summary>
          <nav aria-label="モバイルナビゲーション">
            <Link href="/#scan">無料診断</Link>
            <Link href="/result?sample=1">① 診断レポート（見本）</Link>
            <Link href="/ai/company/aoba-souzoku?sample=1">② AI公式データ（実物）</Link>
            <Link href="/watch?sample=1">③ 週次見守り（見本）</Link>
            <Link href="/pricing">料金プラン・特別優待</Link>
          </nav>
        </details>
      </div>
    </header>
  );
}

