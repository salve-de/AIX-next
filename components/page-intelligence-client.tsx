"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowIcon, EyeIcon, QuoteIcon, SearchIcon, WarningIcon } from "@/components/icons";
import { Brand } from "@/components/brand";
import { PROVIDER_LABELS } from "@/lib/provider-meta";
import { sampleWatch } from "@/lib/sample-data";
import type { PageIntelligence, WatchRecord } from "@/lib/types";

const roleLabel: Record<PageIntelligence["role"], string> = { home: "Home", product: "Product", pricing: "Pricing", proof: "Proof", security: "Security", support: "Support", docs: "Docs", other: "Other" };

function samplePages(): PageIntelligence[] {
  return [
    { url: "https://nexora.example/", title: "NEXORA Cloud", role: "home", hasDescription: true, bodyChars: 4200, citationEvents: 1, citedPromptCount: 1, citedProviders: ["openai"], recommendationEventsWhenCited: 0, relatedPromptIds: ["prompt_1", "prompt_6"], relatedLostPromptCount: 2, status: "cited", opportunity: "medium", rationale: "ホームはカテゴリ比較と関連し、引用は確認されていますが候補外Promptも残っています。引用が推薦の原因だとは断定しません。" },
    { url: "https://nexora.example/cases", title: "導入事例", role: "proof", hasDescription: true, bodyChars: 2900, citationEvents: 0, citedPromptCount: 0, citedProviders: [], recommendationEventsWhenCited: 0, relatedPromptIds: ["prompt_2", "prompt_3", "prompt_7", "prompt_9"], relatedLostPromptCount: 4, status: "uncited", opportunity: "high", rationale: "導入事例ページは企業条件・用途・価値・信頼の4件の候補外Promptと意図上関連しますが、今回の成功ObservationではCitationを確認できませんでした。編集が結果を改善するとは断定しません。" },
    { url: "https://nexora.example/pricing", title: "料金", role: "pricing", hasDescription: false, bodyChars: 980, citationEvents: 0, citedPromptCount: 0, citedProviders: [], recommendationEventsWhenCited: 0, relatedPromptIds: ["prompt_5", "prompt_7"], relatedLostPromptCount: 2, status: "uncited", opportunity: "medium", rationale: "料金ページは価値・比較の候補外Promptと関連します。Citation未確認だけで品質不良とは判断しません。" },
    { url: "https://nexora.example/security", title: "Security", role: "security", hasDescription: true, bodyChars: 3100, citationEvents: 2, citedPromptCount: 2, citedProviders: ["gemini", "perplexity"], recommendationEventsWhenCited: 1, relatedPromptIds: ["prompt_4", "prompt_9"], relatedLostPromptCount: 1, status: "cited", opportunity: "medium", rationale: "Securityページは信頼・機能PromptでCitationとして使われています。推薦との同時発生は記録しますが因果とは扱いません。" },
  ];
}

export function PageIntelligenceClient() {
  const params = useSearchParams();
  const sample = params.get("sample") === "1";
  const token = params.get("token") || "";
  const [watch, setWatch] = useState<WatchRecord | null>(sample ? sampleWatch() : null);
  const [loading, setLoading] = useState(!sample);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "high" | "cited" | "uncited">("all");

  useEffect(() => {
    if (sample) return;
    if (!token) { setError("Workspace tokenがありません。"); setLoading(false); return; }
    fetch(`/api/watch?token=${encodeURIComponent(token)}`, { cache: "no-store" })
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error || "Page Intelligenceを取得できませんでした。"); setWatch(data); })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Page Intelligenceを取得できませんでした。"))
      .finally(() => setLoading(false));
  }, [sample, token]);

  const pages = useMemo(() => {
    const source = watch?.latest.pageIntelligence?.length ? watch.latest.pageIntelligence : sample ? samplePages() : [];
    if (filter === "high") return source.filter((page) => page.opportunity === "high");
    if (filter === "cited") return source.filter((page) => page.status === "cited");
    if (filter === "uncited") return source.filter((page) => page.status === "uncited");
    return source;
  }, [watch, sample, filter]);

  if (loading) return <main className="page-intel-loading">Page Intelligenceを読み込んでいます。</main>;
  if (!watch) return <main className="page-intel-loading"><strong>表示できません。</strong><p>{error}</p><Link href="/">無料診断へ戻る</Link></main>;

  const all = watch.latest.pageIntelligence?.length ? watch.latest.pageIntelligence : sample ? samplePages() : [];
  const cited = all.filter((page) => page.status === "cited");
  const high = all.filter((page) => page.opportunity === "high");
  const citationEvents = all.reduce((sum, page) => sum + page.citationEvents, 0);
  const workspaceHref = sample ? "/workspace?sample=1" : `/workspace?token=${encodeURIComponent(token)}`;

  return <main className="page-intel-root">
    <header className="page-intel-top"><div className="shell"><Brand /><Link href={workspaceHref}>← Workspace</Link></div></header>
    <section className="page-intel-hero"><div className="shell"><p className="eyebrow">PAGE INTELLIGENCE</p><h1>どのページがAIに使われ、<br /><span>どこが購買機会とズレているか。</span></h1><p>サイト内ページ、Citation、Buyer Prompt、候補外テーマを同じ表にします。未引用ページを「悪いページ」とは扱わず、関連する購買Intentと一緒に優先順位を見ます。</p></div></section>

    <section className="shell page-intel-kpis">
      <article><SearchIcon /><small>Tracked Pages</small><strong>{all.length}</strong><span>今回取得できた公開ページ</span></article>
      <article><QuoteIcon /><small>Cited Pages</small><strong>{cited.length}</strong><span>{citationEvents} citation events</span></article>
      <article><WarningIcon /><small>High Opportunity</small><strong>{high.length}</strong><span>候補外Intentと重なる未引用ページ</span></article>
      <article><EyeIcon /><small>Own Citation Coverage</small><strong>{watch.latest.citationCoverage}%</strong><span>成功AI回答ベース</span></article>
    </section>

    <section className="shell page-intel-controls"><div><button className={filter === "all" ? "active" : ""} onClick={() => setFilter("all")}>すべて</button><button className={filter === "high" ? "active" : ""} onClick={() => setFilter("high")}>優先</button><button className={filter === "cited" ? "active" : ""} onClick={() => setFilter("cited")}>Cited</button><button className={filter === "uncited" ? "active" : ""} onClick={() => setFilter("uncited")}>Uncited</button></div><span>Correlation ≠ causation</span></section>

    <section className="shell page-intel-list">{pages.length ? pages.map((page) => <article key={page.url} className={`page-intel-row opportunity-${page.opportunity}`}>
      <div className="page-intel-status"><span className={`page-role role-${page.role}`}>{roleLabel[page.role]}</span><strong className={`citation-state ${page.status}`}>{page.status === "cited" ? "CITED" : "NOT CITED"}</strong></div>
      <div className="page-intel-main"><h2>{page.title}</h2><a href={page.url} target="_blank" rel="noreferrer">{page.url}</a><p>{page.rationale}</p><div className="page-intel-meta"><span>本文 {page.bodyChars.toLocaleString()} chars</span><span>Meta description {page.hasDescription ? "あり" : "未確認"}</span><span>関連候補外 {page.relatedLostPromptCount}</span></div></div>
      <div className="page-intel-citations"><small>CITATION EVENTS</small><strong>{page.citationEvents}</strong><span>{page.citedPromptCount} prompts</span><p>{page.citedProviders.length ? page.citedProviders.map((provider) => PROVIDER_LABELS[provider]).join(" / ") : "—"}</p></div>
      <div className="page-intel-action"><span>{page.opportunity.toUpperCase()} PRIORITY</span><Link href={`${workspaceHref}&view=${page.relatedLostPromptCount ? "actions" : "citations"}`}>{page.relatedLostPromptCount ? "関連Actionを見る" : "Citationを見る"}<ArrowIcon /></Link></div>
    </article>) : <div className="page-intel-empty"><strong>Page Intelligenceは次回Scanから生成されます。</strong><p>既存の保存結果にはページ在庫が含まれていない場合があります。次回のCore観測で自動作成します。</p></div>}</section>
  </main>;
}
