import Link from "next/link";
import { Brand } from "@/components/brand";

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  return <header className={`site-header ${compact ? "site-header-compact" : ""}`}>
    <div className="shell header-inner">
      <Brand />
      <nav aria-label="公開ナビゲーション">
        <Link href="/result?sample=1">サンプル結果</Link>
        <Link href="/pricing">料金</Link>
        <Link href="/methodology">測定方法</Link>
        <Link className="header-cta" href="/#scan">無料診断</Link>
      </nav>
      <details className="ux2-mobile-nav">
        <summary aria-label="メニュー"><span /></summary>
        <nav className="ux2-mobile-menu" aria-label="モバイルナビゲーション">
          <Link href="/result?sample=1">サンプル結果</Link>
          <Link href="/pricing">料金</Link>
          <Link href="/methodology">測定方法</Link>
          <Link href="/#scan">無料診断</Link>
        </nav>
      </details>
    </div>
  </header>;
}
