"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowIcon, CheckIcon, LockIcon, NetworkIcon, WarningIcon } from "@/components/icons";
import { sampleWatch } from "@/lib/sample-data";
import type { ChangePack, DomainClaim, DomainClaimMethod, ExecutionRecord, WatchRecord } from "@/lib/types";

type OwnershipResponse = { claim: DomainClaim; instructions: { dns: { host: string; type: string; value: string }; meta: string; file: { path: string; content: string } } };
type IntegrationStatus = { github: { connected: boolean; installationId?: number; accountLogin?: string }; wordpress: { connected: boolean; baseUrl?: string; username?: string; displayName?: string } };
type Repo = { fullName: string; defaultBranch: string; private: boolean };
type WpPage = { id: number; title: string; slug: string; status: string; modified: string; link: string };

const sampleOwnership: OwnershipResponse = { claim: { domain: "nexora.example", challenge: "sample-verification-token", status: "verified", method: "dns", createdAt: "2026-09-02T00:00:00.000Z", checkedAt: "2026-09-02T00:00:00.000Z", verifiedAt: "2026-09-02T00:00:00.000Z" }, instructions: { dns: { host: "_aix.nexora.example", type: "TXT", value: "aix-site-verification=sample-verification-token" }, meta: '<meta name="aix-site-verification" content="sample-verification-token">', file: { path: "https://nexora.example/.well-known/aix-site-verification.txt", content: "aix-site-verification=sample-verification-token" } } };
const sampleRepos: Repo[] = [{ fullName: "nexora/example-site", defaultBranch: "main", private: true }, { fullName: "nexora/marketing-site", defaultBranch: "main", private: true }];
const samplePages: WpPage[] = [{ id: 101, title: "サービス概要", slug: "service", status: "publish", modified: "2026-09-01T12:00:00", link: "https://nexora.example/service" }, { id: 102, title: "導入の流れ", slug: "implementation", status: "publish", modified: "2026-08-28T12:00:00", link: "https://nexora.example/implementation" }];

function formatDate(value?: string) { return value ? new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Tokyo" }).format(new Date(value)) : "—"; }
function approvedPacks(watch: WatchRecord) { return (watch.changePacks || []).filter((pack) => pack.status === "approved" && !pack.missingFacts.length); }

export function ExecutionCenterClient() {
  const params = useSearchParams(); const sample = params.get("sample") === "1"; const token = params.get("token") || "";
  const [watch, setWatch] = useState<WatchRecord | null>(sample ? sampleWatch() : null);
  const [ownership, setOwnership] = useState<OwnershipResponse | null>(sample ? sampleOwnership : null);
  const [integrations, setIntegrations] = useState<IntegrationStatus>(sample ? { github: { connected: true, installationId: 12345, accountLogin: "nexora" }, wordpress: { connected: true, baseUrl: "https://nexora.example", username: "editor", displayName: "NEXORA Editor" } } : { github: { connected: false }, wordpress: { connected: false } });
  const [repos, setRepos] = useState<Repo[]>(sample ? sampleRepos : []); const [pages, setPages] = useState<WpPage[]>(sample ? samplePages : []);
  const [method, setMethod] = useState<DomainClaimMethod>("dns"); const [repo, setRepo] = useState(sampleRepos[0]?.fullName || ""); const [path, setPath] = useState("app/page.tsx"); const [pageId, setPageId] = useState<number>(samplePages[0]?.id || 0); const [packId, setPackId] = useState("");
  const [wpUrl, setWpUrl] = useState(""); const [wpUser, setWpUser] = useState(""); const [wpPassword, setWpPassword] = useState(""); const [busy, setBusy] = useState(""); const [error, setError] = useState(""); const [success, setSuccess] = useState<ExecutionRecord | null>(null);

  useEffect(() => {
    if (sample) return;
    if (!token) { setError("Workspace tokenがありません。"); return; }
    Promise.all([
      fetch(`/api/watch?token=${encodeURIComponent(token)}`, { cache: "no-store" }).then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d.error || "Watchを取得できませんでした。"); return d as WatchRecord; }),
      fetch(`/api/ownership?token=${encodeURIComponent(token)}`, { cache: "no-store" }).then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d.error || "Ownershipを取得できませんでした。"); return d as OwnershipResponse; }),
      fetch(`/api/integrations/status?token=${encodeURIComponent(token)}`, { cache: "no-store" }).then(async (r) => { const d = await r.json(); if (!r.ok) throw new Error(d.error || "Integration statusを取得できませんでした。"); return d as { integrations: IntegrationStatus; executions: ExecutionRecord[] }; }),
    ]).then(([w, own, status]) => { setWatch({ ...w, executions: status.executions }); setOwnership(own); setIntegrations(status.integrations); }).catch((caught) => setError(caught instanceof Error ? caught.message : "Execution Centerを取得できませんでした。"));
  }, [sample, token]);

  const packs = useMemo(() => watch ? approvedPacks(watch) : [], [watch]);
  useEffect(() => { if (!packId && packs[0]) setPackId(packs[0].id); }, [packId, packs]);

  async function verifyOwnership() {
    if (sample) return;
    setBusy("verify"); setError("");
    try { const response = await fetch("/api/ownership", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, method }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Ownershipを確認できませんでした。"); setOwnership(data); if (data.claim.status !== "verified") setError("まだverification値を確認できません。設定反映後に再確認してください。"); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "Ownershipを確認できませんでした。"); } finally { setBusy(""); }
  }

  async function connectGitHub() {
    if (sample) return;
    setBusy("github-connect"); setError("");
    try { const response = await fetch(`/api/integrations/github/start?token=${encodeURIComponent(token)}`, { cache: "no-store" }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "GitHub App接続を開始できませんでした。"); window.location.assign(data.url); }
    catch (caught) { setBusy(""); setError(caught instanceof Error ? caught.message : "GitHub App接続を開始できませんでした。"); }
  }
  async function loadRepos() {
    if (sample) return;
    setBusy("repos"); setError(""); try { const response = await fetch(`/api/integrations/github/repos?token=${encodeURIComponent(token)}`, { cache: "no-store" }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Repositoryを取得できませんでした。"); setRepos(data.repositories); if (!repo && data.repositories[0]) setRepo(data.repositories[0].fullName); } catch (caught) { setError(caught instanceof Error ? caught.message : "Repositoryを取得できませんでした。"); } finally { setBusy(""); }
  }
  async function createPr() {
    if (sample) { setSuccess({ id: "sample_pr", packId, target: "github", status: "created", summary: `Draft PR created for ${repo}:${path}`, externalUrl: "https://github.com/example/example/pull/42", createdAt: "2026-09-02T00:00:00.000Z" }); return; }
    setBusy("github-run"); setError(""); setSuccess(null); try { const response = await fetch("/api/integrations/github/execute", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, packId, repo, path }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "PRを作成できませんでした。"); setSuccess(data.execution); setWatch(data.watch); } catch (caught) { setError(caught instanceof Error ? caught.message : "PRを作成できませんでした。"); } finally { setBusy(""); }
  }

  async function connectWp(event: FormEvent) {
    event.preventDefault(); if (sample) return;
    setBusy("wp-connect"); setError(""); try { const response = await fetch("/api/integrations/wordpress/connect", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, baseUrl: wpUrl, username: wpUser, applicationPassword: wpPassword }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "WordPressを接続できませんでした。"); setIntegrations((current) => ({ ...current, wordpress: { connected: true, ...data.integration } })); setWpPassword(""); } catch (caught) { setError(caught instanceof Error ? caught.message : "WordPressを接続できませんでした。"); } finally { setBusy(""); }
  }
  async function loadPages() {
    if (sample) return;
    setBusy("pages"); setError(""); try { const response = await fetch(`/api/integrations/wordpress/pages?token=${encodeURIComponent(token)}`, { cache: "no-store" }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "ページを取得できませんでした。"); setPages(data.pages); if (!pageId && data.pages[0]) setPageId(data.pages[0].id); } catch (caught) { setError(caught instanceof Error ? caught.message : "ページを取得できませんでした。"); } finally { setBusy(""); }
  }
  async function createWpDraft() {
    if (sample) { setSuccess({ id: "sample_wp", packId, target: "wordpress", status: "created", summary: `WordPress draft created from page #${pageId}. Existing page was not modified.`, externalUrl: "https://nexora.example/wp-admin/post.php?post=999&action=edit", createdAt: "2026-09-02T00:00:00.000Z" }); return; }
    setBusy("wp-run"); setError(""); setSuccess(null); try { const response = await fetch("/api/integrations/wordpress/execute", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, packId, pageId }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "Draftを作成できませんでした。"); setSuccess(data.execution); setWatch(data.watch); } catch (caught) { setError(caught instanceof Error ? caught.message : "Draftを作成できませんでした。"); } finally { setBusy(""); }
  }

  if (!watch || !ownership) return <main className="execution-loading"><div><strong>Execution Centerを準備しています。</strong>{error ? <p>{error}</p> : null}</div></main>;
  const verified = ownership.claim.status === "verified";
  const back = sample ? "/workspace?sample=1&view=actions" : `/workspace?token=${encodeURIComponent(token)}&view=actions`;

  return <main className="execution-page"><header><Link href={back}>← Actionsへ戻る</Link><span>SAFE EXECUTION CENTER</span></header><section className="execution-hero"><div><p>APPROVAL-GATED EXECUTION</p><h1>作るところまで自動。<br />公開は、人が決める。</h1><span>Domain ownershipとApproved Change Packを必須にし、GitHubはDraft PR、WordPressは新規Draft copyだけを作ります。mainへの直接書き込み・自動Merge・自動Publishはありません。</span></div><LockIcon /></section>

  <section className="execution-steps"><article className={verified ? "done" : "active"}><span>{verified ? <CheckIcon /> : "1"}</span><div><small>DOMAIN OWNERSHIP</small><strong>{ownership.claim.domain}</strong><p>{verified ? `確認済み · ${ownership.claim.method} · ${formatDate(ownership.claim.verifiedAt)}` : "外部サイトへ書き込む前に、このドメインを管理していることを確認します。"}</p></div></article><article className={packs.length ? "done" : "blocked"}><span>{packs.length ? <CheckIcon /> : "2"}</span><div><small>APPROVED CHANGE PACK</small><strong>{packs.length ? `${packs.length}件が実行可能` : "承認済み変更なし"}</strong><p>{packs.length ? "不足する比較材料がなく、人が明示承認したChange Packだけ選べます。" : "WorkspaceのActionsで比較材料を埋め、Change Packを承認してください。"}</p></div></article><article className={verified && packs.length ? "active" : "blocked"}><span>3</span><div><small>CREATE REVIEWABLE DRAFT</small><strong>PR / WordPress Draft</strong><p>既存本番を直接変更せず、レビュー可能な成果物を作ります。</p></div></article></section>

  {!verified ? <section className="ownership-card"><div><p>STEP 1 · VERIFY DOMAIN</p><h2>3つの方法から1つだけ。</h2><span>設定してから「確認する」を押してください。値はこのProject専用です。</span></div><div className="ownership-methods"><label><input type="radio" checked={method === "dns"} onChange={() => setMethod("dns")} /><strong>DNS TXT</strong><code>{ownership.instructions.dns.host}</code><code>{ownership.instructions.dns.value}</code></label><label><input type="radio" checked={method === "meta"} onChange={() => setMethod("meta")} /><strong>HTML meta</strong><code>{ownership.instructions.meta}</code></label><label><input type="radio" checked={method === "file"} onChange={() => setMethod("file")} /><strong>.well-known file</strong><code>{ownership.instructions.file.path}</code><code>{ownership.instructions.file.content}</code></label><button onClick={verifyOwnership} disabled={busy === "verify"}>{busy === "verify" ? "確認中…" : "Domain ownershipを確認"}</button></div></section> : null}

  <section className={`execution-connectors${verified && packs.length ? "" : " disabled"}`}><article className="connector-card"><header><NetworkIcon /><div><small>GITHUB APP</small><h2>Draft Pull Request</h2></div><span className={integrations.github.connected ? "connected" : "not-connected"}>{integrations.github.connected ? "CONNECTED" : "NOT CONNECTED"}</span></header><p>選択したRepositoryだけにアクセス。Contents read/write + Pull requests writeで、専用BranchとDraft PRを作ります。Workflow・secret系ファイルは対象外です。</p>{!integrations.github.connected ? <button onClick={connectGitHub} disabled={!verified || busy === "github-connect"}>{busy === "github-connect" ? "GitHubへ移動中…" : "GitHub Appを接続"}</button> : <><div className="connector-meta"><span>Account <strong>{integrations.github.accountLogin || "GitHub"}</strong></span><button onClick={loadRepos} disabled={busy === "repos"}>{busy === "repos" ? "取得中…" : "許可済みRepositoryを取得"}</button></div>{repos.length ? <div className="execution-form"><label>Approved Change Pack<select value={packId} onChange={(e) => setPackId(e.target.value)}>{packs.map((pack) => <option value={pack.id} key={pack.id}>{pack.title}</option>)}</select></label><label>Repository<select value={repo} onChange={(e) => setRepo(e.target.value)}>{repos.map((item) => <option key={item.fullName} value={item.fullName}>{item.fullName} · {item.defaultBranch}</option>)}</select></label><label>修正するSource File<input value={path} onChange={(e) => setPath(e.target.value)} placeholder="app/page.tsx" /><small>AIXはこの1ファイルだけを読み、最小修正したDraft PRを作ります。</small></label><button className="execution-primary" onClick={createPr} disabled={!packId || !repo || !path || busy === "github-run"}>{busy === "github-run" ? "Draft PRを生成中…" : "Draft PRを作成"}<ArrowIcon /></button></div> : null}</>}</article>

  <article className="connector-card"><header><NetworkIcon /><div><small>WORDPRESS REST</small><h2>Draft Copy</h2></div><span className={integrations.wordpress.connected ? "connected" : "not-connected"}>{integrations.wordpress.connected ? "CONNECTED" : "NOT CONNECTED"}</span></header><p>Application Passwordを暗号化保存し、既存公開ページを直接更新せず、新しいDraft copyを作ります。接続先は確認済みDomainまたはそのsubdomainだけです。</p>{!integrations.wordpress.connected ? <form className="wp-connect" onSubmit={connectWp}><input type="url" required placeholder="https://company.jp" value={wpUrl} onChange={(e) => setWpUrl(e.target.value)} /><input required placeholder="WordPress username" value={wpUser} onChange={(e) => setWpUser(e.target.value)} /><input type="password" required placeholder="Application Password" value={wpPassword} onChange={(e) => setWpPassword(e.target.value)} /><button disabled={!verified || busy === "wp-connect"}>{busy === "wp-connect" ? "接続確認中…" : "WordPressを安全に接続"}</button></form> : <><div className="connector-meta"><span>{integrations.wordpress.baseUrl} · <strong>{integrations.wordpress.displayName || integrations.wordpress.username}</strong></span><button onClick={loadPages} disabled={busy === "pages"}>{busy === "pages" ? "取得中…" : "ページ一覧を取得"}</button></div>{pages.length ? <div className="execution-form"><label>Approved Change Pack<select value={packId} onChange={(e) => setPackId(e.target.value)}>{packs.map((pack) => <option value={pack.id} key={pack.id}>{pack.title}</option>)}</select></label><label>元にする公開ページ<select value={pageId} onChange={(e) => setPageId(Number(e.target.value))}>{pages.map((page) => <option key={page.id} value={page.id}>{page.title} · /{page.slug}</option>)}</select></label><p className="draft-rule"><LockIcon />元ページは変更しません。AIXは完全な新規Draft copyを作り、WordPress管理画面で人が確認します。</p><button className="execution-primary" onClick={createWpDraft} disabled={!packId || !pageId || busy === "wp-run"}>{busy === "wp-run" ? "Draftを生成中…" : "WordPress Draftを作成"}<ArrowIcon /></button></div> : null}</>}</article></section>

  {success ? <section className="execution-success"><CheckIcon /><div><strong>{success.target === "github" ? "レビュー可能なDraft PRを作成しました。" : "レビュー可能なWordPress Draftを作成しました。"}</strong><p>{success.summary}</p>{success.externalUrl ? <a href={success.externalUrl} target="_blank" rel="noreferrer">作成物を開く <ArrowIcon /></a> : null}</div></section> : null}
  <section className="execution-audit"><header><div><p>EXECUTION AUDIT</p><h2>何を外部へ作ったか残す。</h2></div><span>自動Merge / Publish = 0</span></header>{(watch.executions || []).length ? <div>{watch.executions!.slice().reverse().map((item) => <article key={item.id}><span className={item.status}>{item.status}</span><strong>{item.target}</strong><p>{item.summary}</p><time>{formatDate(item.createdAt)}</time>{item.externalUrl ? <a href={item.externalUrl} target="_blank" rel="noreferrer">open</a> : null}</article>)}</div> : <div className="execution-empty"><LockIcon /><strong>まだ外部実行はありません。</strong><p>Approved Change PackをPRまたはDraftに変換すると、ここへ記録します。</p></div>}</section>
  {error ? <div className="execution-error"><WarningIcon />{error}</div> : null}</main>;
}
