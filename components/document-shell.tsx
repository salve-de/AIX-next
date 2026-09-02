import type { ReactNode } from "react";
import Link from "next/link";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

export function DocumentShell({
  label,
  title,
  lead,
  children,
  updatedAt,
}: {
  label: string;
  title: string;
  lead: string;
  children: ReactNode;
  updatedAt?: string;
}) {
  return <main className="ux2-document-page">
    <SiteHeader compact />
    <header className="ux2-document-header">
      <div className="ux2-narrow">
        <p className="ux2-label">{label}</p>
        <h1>{title}</h1>
        <p>{lead}</p>
        {updatedAt ? <small>最終更新: {updatedAt}</small> : null}
      </div>
    </header>
    <div className="ux2-document-layout ux2-narrow">
      <aside className="ux2-document-nav" aria-label="関連ページ">
        <strong>信頼・サポート</strong>
        <Link href="/methodology">測定方法</Link>
        <Link href="/privacy">プライバシー</Link>
        <Link href="/terms">利用規約</Link>
        <Link href="/commerce">特商法表記</Link>
        <Link href="/support">サポート</Link>
      </aside>
      <article className="ux2-document-content">{children}</article>
    </div>
    <SiteFooter />
  </main>;
}
