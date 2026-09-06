"use client";

import Link from "next/link";
import { ArrowIcon, CheckIcon, LockIcon } from "@/components/icons";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { AiReadableDraft, WatchRecord } from "@/lib/types";

function normalizeDomain(value: string) {
  return value.trim().replace(/^https?:\/\//i, "").replace(/^www\./i, "").split(/[/?#]/)[0] || "yourcompany.jp";
}

function demoDraft(domain: string): AiReadableDraft {
  return {
    generatedAt: "2026-09-01T09:00:00.000Z",
    sourceMeasurementId: "sample_clean_room",
    sourceUrl: `https://${domain}`,
    suggestedFileName: `ai-public-info-${domain}`,
    llmsTxt: `# ${domain}\n\n> 会社が確認した公開情報を、AIが読み取りやすい順番に整理した下書きです。\n\n## 公式ページ\n\n- [サービス概要](https://${domain}/service) — 対象・用途・利用条件\n- [導入事例](https://${domain}/cases) — 導入背景・対象規模・期間\n\n## 公開前に確認すること\n\n- 会社名・サービス名・説明が公開ページと一致しているか確認する。\n- 料金・実績・導入期間などの数値を原典と照合する。\n- 自社ドメインに掲載する権限と更新担当者を確認する。\n`,
    jsonLd: JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: domain,
      url: `https://${domain}`,
      description: "公開ページから確認した会社情報の下書き",
      inLanguage: "ja-JP",
    }, null, 2) + "\n",
    sourcePages: [
      { url: `https://${domain}/service`, title: "サービス概要", description: "対象・用途・利用条件" },
      { url: `https://${domain}/cases`, title: "導入事例", description: "導入背景・対象規模・期間" },
    ],
    publishChecks: [
      "会社名・サービス名・説明を原典と照合する",
      "料金・実績・導入期間を公開前に確認する",
      "自社ドメインへ掲載する権限と更新担当者を確認する",
      "見える本文と構造化データの内容をそろえる",
      "robots.txtでAI検索クローラーを意図せず拒否していないか確認する",
    ],
  };
}

function downloadText(fileName: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = fileName;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function AiReadableClient() {
  const params = useSearchParams();
  const sample = params.get("sample") === "1";
  const token = params.get("token") || "";
  const domain = normalizeDomain(params.get("url") || (sample ? "nexora.example" : "yourcompany.jp"));
  const [watch, setWatch] = useState<WatchRecord | null>(null);
  const [loading, setLoading] = useState(Boolean(token) && !sample);
  const [error, setError] = useState("");

  useEffect(() => {
    if (sample || !token) return;
    fetch(`/api/watch?token=${encodeURIComponent(token)}`, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json() as WatchRecord & { error?: string };
        if (!response.ok) throw new Error(data.error || "Watchを取得できませんでした。");
        setWatch(data);
      })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Watchを取得できませんでした。"))
      .finally(() => setLoading(false));
  }, [sample, token]);

  if (loading) return <div className="full-loading">下書きを読み込んでいます。</div>;

  const draft = sample ? demoDraft(domain) : watch?.changePack?.aiReadable || null;
  const resolvedDomain = watch ? normalizeDomain(watch.latest.targetUrl) : domain;
  const backHref = sample ? "/result?sample=1" : token ? `/watch?token=${encodeURIComponent(token)}` : "/";

  return <main className="document-page ai-info-page">
    <header className="site-header site-header-compact"><div className="shell header-inner"><Link className="brand" href={backHref}><span className="brand-mark" aria-hidden="true"><i /><i /><i /></span><span><strong>Rovan</strong><small>AI競合診断</small></span></Link><Link className="text-button" href={backHref}>戻る <ArrowIcon /></Link></div></header>
    <section className="document-hero ai-info-hero"><div className="shell"><p className="overline">AI向け公開情報 / {resolvedDomain}</p><h1>AIが比較しやすい、<br />会社の事実を整える。</h1><p>公開ページから確認できた対象・用途・実績・導入条件を、AIにも人にも読みやすい下書きにまとめます。推薦や順位を買うページではありません。</p><div className="ai-info-boundary"><LockIcon /><span><strong>公開前に確認します。</strong> Rovanがサイトを勝手に変更したり、外部の評価を装ったりすることはありません。</span></div></div></section>

    <section className="document-body shell ai-info-body">
      {error ? <div className="document-callout ai-info-error"><strong>下書きを表示できません。</strong><p>{error}</p></div> : null}
      {!draft ? <section className="ai-info-empty"><p className="overline">下書きの作成</p><h2>まずWatchで、競合に負けた理由を確認します。</h2><p>有料Watchでは、実際に取得できた公開ページだけを使って、AI向け情報の下書きを作成できます。作成後はこの専用画面で内容を確認し、ファイルとして取得できます。</p><Link className="button button-primary" href={token ? `/watch?token=${encodeURIComponent(token)}` : "/result?sample=1"}>Watchへ戻る <ArrowIcon /></Link></section> : <>
        <div className="ai-info-source"><div><p className="overline">取得した公開ページから作成</p><h2>下書きの中身を確認する。</h2><p>{draft.sourcePages.length}ページをもとに作成。自動公開はしません。</p></div><span>{sample ? "架空データの見本" : "人が確認する下書き"}</span></div>
        <div className="ai-info-grid">
          <section className="ai-info-panel"><header><div><p className="overline">1 / 確認できるページ</p><h3>どのページを使ったか。</h3></div><span>{draft.sourcePages.length}ページ</span></header><ul className="ai-info-page-list">{draft.sourcePages.map((page) => <li key={page.url}><strong>{page.title}</strong><span>{page.description || "説明を確認中"}</span><small>{page.url}</small></li>)}</ul></section>
          <section className="ai-info-panel"><header><div><p className="overline">2 / 取得するファイル</p><h3>使う前に、内容を確認する。</h3></div><span>2種類</span></header><div className="ai-info-downloads"><button className="button button-secondary" type="button" onClick={() => downloadText(`${draft.suggestedFileName}.txt`, draft.llmsTxt, "text/plain;charset=utf-8")}>公開情報のテキストを取得 <ArrowIcon /></button><button className="button button-secondary" type="button" onClick={() => downloadText(`${draft.suggestedFileName}.jsonld`, draft.jsonLd, "application/ld+json;charset=utf-8")}>構造化データを取得 <ArrowIcon /></button></div><details className="ai-info-code"><summary>ファイルの内容を見る</summary><pre>{draft.llmsTxt}</pre></details></section>
        </div>
        <section className="ai-info-review"><div><p className="overline">3 / 公開前チェック</p><h2>確認してから、自社のページで使う。</h2><p>内容が事実と一致し、掲載する権限があることを確認してください。Rovanから自社サイトへ直接公開することはありません。</p></div><ul>{draft.publishChecks.map((check) => <li key={check}><CheckIcon />{check}</li>)}</ul></section>
        <section className="ai-info-next"><div><p className="overline">次にすること</p><h2>公開したあと、同じ質問で測り直す。</h2><p>AIがこの情報を参照したか、候補に入る質問が増えたかを、前回と同じ条件で確認します。</p></div><Link className="button button-primary" href={token ? `/watch?token=${encodeURIComponent(token)}` : "/watch?sample=1"}>変化を確認する <ArrowIcon /></Link></section>
      </>}
    </section>
    <footer className="site-footer"><div className="shell"><p className="footer-meta">Rovan / 公開情報から、比較される根拠を整える。</p></div></footer>
  </main>;
}
