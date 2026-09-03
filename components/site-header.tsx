import Link from "next/link";
import { Brand } from "@/components/brand";

export function SiteHeader({ compact = false }: { compact?: boolean }) {
  return <header className={`site-header ${compact ? "site-header-compact" : ""}`}><div className="shell header-inner"><Brand /><nav className="header-nav" aria-label="公開ナビゲーション"><Link href="/#how">できること</Link><Link href="/result?sample=1">結果の例</Link><Link href="/methodology">調べ方</Link><Link href="/pricing">料金</Link><Link className="header-cta" href="/#scan">無料で診断</Link></nav><details className="mobile-menu"><summary>メニュー</summary><nav aria-label="モバイルナビゲーション"><Link href="/#how">できること</Link><Link href="/result?sample=1">結果の例</Link><Link href="/methodology">調べ方</Link><Link href="/pricing">料金</Link></nav></details></div></header>;
}
