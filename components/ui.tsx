import Link from "next/link";
import type { ReactNode, SVGProps } from "react";

export function Logo() {
  return <Link className="logo" href="/" aria-label="AIX home"><span className="logo-mark" aria-hidden="true"><i /><i /><i /></span><span>AIX</span><small>Recommendation Signal</small></Link>;
}

export function Header() {
  return <header className="site-header"><div className="container header-inner"><Logo /><nav aria-label="Primary"><Link href="/demo">デモ</Link><Link href="/methodology">測定方法</Link><Link href="/pricing">料金</Link><Link className="nav-cta" href="/#scan">無料診断</Link></nav></div></header>;
}

export function Footer() {
  return <footer className="site-footer"><div className="container footer-inner"><Logo /><p>AIが企業を比較する瞬間を、観測可能な市場に変える。</p><nav><Link href="/methodology">測定方法</Link><Link href="/pricing">料金</Link><Link href="/privacy">プライバシー</Link><Link href="/terms">利用規約</Link></nav><small>© 2026 株式会社ジュジュベコンサルティング</small></div></footer>;
}

export function PageShell({ children }: { children: ReactNode }) {
  return <><Header /><main>{children}</main><Footer /></>;
}

export function Icon({ name, size = 20, ...props }: SVGProps<SVGSVGElement> & { name: "search" | "spark" | "graph" | "shield" | "link" | "check" | "alert" | "arrow" | "eye" | "document" | "clock"; size?: number }) {
  const paths: Record<string, ReactNode> = {
    search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
    spark: <><path d="m12 2 1.7 5.1L19 9l-5.3 1.9L12 16l-1.7-5.1L5 9l5.3-1.9L12 2Z"/><path d="m19 15 .8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/></>,
    graph: <><path d="M4 19V9m6 10V5m6 14v-7m4 7V3"/><path d="M3 19h19"/></>,
    shield: <><path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6l-8-3Z"/><path d="m9 12 2 2 4-5"/></>,
    link: <><path d="M10 13a5 5 0 0 0 7.5.5l2-2a5 5 0 0 0-7-7l-1.1 1.1"/><path d="M14 11a5 5 0 0 0-7.5-.5l-2 2a5 5 0 0 0 7 7l1.1-1.1"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    alert: <><path d="M12 3 2.5 20h19L12 3Z"/><path d="M12 9v4m0 3h.01"/></>,
    arrow: <><path d="M5 12h14"/><path d="m14 7 5 5-5 5"/></>,
    eye: <><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z"/><circle cx="12" cy="12" r="2.5"/></>,
    document: <><path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5M9 12h6M9 16h6"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  };
  return <svg aria-hidden="true" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" {...props}>{paths[name]}</svg>;
}

export function Pill({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "good" | "bad" | "accent" }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}
