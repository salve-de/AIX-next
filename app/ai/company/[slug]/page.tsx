import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowIcon } from "@/components/icons";
import { sampleResult } from "@/lib/sample-data";
import { buildPublicProfileDraft, toPublicProfile } from "@/lib/public-profile";
import { getActivePublicProfileBySlug } from "@/lib/storage";
import type { PublicProfile } from "@/lib/types";
import { siteUrl } from "@/lib/site";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{ slug: string }>;
  searchParams?: Promise<{ sample?: string | string[] }>;
};

function sampleProfile(): PublicProfile {
  const draft = buildPublicProfileDraft(sampleResult, "2026-09-01T09:00:00.000Z");
  return {
    ...draft,
    id: "sample_public_profile",
    slug: "nexora-cloud",
    status: "published",
    createdAt: "2026-09-01T09:00:00.000Z",
    updatedAt: "2026-09-01T09:00:00.000Z",
    expiresAt: "2027-09-01T09:00:00.000Z",
    publishedAt: "2026-09-01T09:00:00.000Z",
  };
}

async function profileFor(slug: string, sample = false) {
  if (sample && slug === "nexora-cloud") return sampleProfile();
  const record = await getActivePublicProfileBySlug(slug);
  return record ? toPublicProfile(record) : null;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const query = searchParams ? await searchParams : {};
  const sample = query.sample === "1" || (Array.isArray(query.sample) && query.sample.includes("1"));
  const profile = await profileFor(decodeURIComponent(slug), sample);
  if (!profile) return { title: "公開ページが見つかりません", robots: { index: false, follow: false } };
  return {
    title: profile.title,
    description: profile.summary || `${profile.brandName}の公開情報を確認できます。`,
    alternates: { canonical: `${siteUrl}/ai/company/${encodeURIComponent(profile.slug)}` },
    robots: { index: true, follow: true, noarchive: true },
    openGraph: { title: profile.title, description: profile.summary || `${profile.brandName}の公開情報`, type: "article" },
  };
}

function dateLabel(value: string) {
  return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeZone: "Asia/Tokyo" }).format(new Date(value));
}

export default async function PublicCompanyPage({ params, searchParams }: PageProps) {
  const { slug } = await params;
  const query = searchParams ? await searchParams : {};
  const sample = query.sample === "1" || (Array.isArray(query.sample) && query.sample.includes("1"));
  const profile = await profileFor(decodeURIComponent(slug), sample);
  if (!profile) notFound();

  const jsonLd = profile.structuredData.trim();
  return <main className="public-company-page">
    <header className="site-header site-header-compact"><div className="shell header-inner"><Link className="brand" href="/"><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span><strong>AIX</strong><small>AI競合診断</small></span></Link><Link className="text-button" href="/">AIXで診断する <ArrowIcon /></Link></div></header>
    <section className="public-company-hero"><div className="shell"><p className="overline">AIX公開情報</p><h1>{profile.brandName}</h1><p className="public-company-domain"><a href={profile.targetUrl} target="_blank" rel="noreferrer">{profile.targetUrl}</a></p><p className="public-company-summary">{profile.summary || "公式サイトから確認できた公開情報を整理しています。"}</p><div className="public-company-notice"><strong>AIXが公開している情報ページです。</strong><span>公式サイトの内容をもとに作成しており、公式サイトそのものや第三者評価ではありません。</span></div></div></section>
    <section className="public-company-body shell">
      <div className="public-company-main">
        {profile.market ? <section><p className="overline">分野</p><h2>{profile.market}</h2></section> : null}
        {profile.targetCustomers.length ? <section><p className="overline">対象</p><ul className="public-company-tags">{profile.targetCustomers.map((item) => <li key={item}>{item}</li>)}</ul></section> : null}
        {profile.useCases.length ? <section><p className="overline">用途</p><ul className="public-company-list">{profile.useCases.map((item) => <li key={item}>{item}</li>)}</ul></section> : null}
        {profile.facts.length ? <section><p className="overline">公開されている情報</p><dl className="public-company-facts">{profile.facts.slice(0, 16).map((fact, index) => <div key={`${fact.label}-${fact.value}-${index}`}><dt>{fact.label}</dt><dd>{fact.value}<a href={fact.sourceUrl} target="_blank" rel="noreferrer">出典 ↗</a></dd></div>)}</dl></section> : null}
      </div>
      <aside className="public-company-aside"><div className="public-company-source"><p className="overline">出典</p><h2>公式ページ</h2>{profile.sourcePages.map((page) => <a key={page.url} href={page.url} target="_blank" rel="noreferrer"><strong>{page.title}</strong><span>{page.url}</span></a>)}</div><div className="public-company-files"><p className="overline">AIが読み取れる形式</p><h2>同じ情報を取得</h2><a href={`/ai/company/${encodeURIComponent(profile.slug)}.json${sample ? "?sample=1" : ""}`}>JSON <span>↗</span></a><a href={`/ai/company/${encodeURIComponent(profile.slug)}.md${sample ? "?sample=1" : ""}`}>Markdown <span>↗</span></a></div></aside>
    </section>
    <footer className="public-company-footer"><div className="shell"><p>AIX公開ページ · 更新 {dateLabel(profile.updatedAt)} · 有効期限 {dateLabel(profile.expiresAt)}</p><p>内容の修正・停止は、公開した会社がAIXの確認画面から行えます。</p></div></footer>
    {jsonLd ? <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jsonLd }} /> : null}
  </main>;
}
