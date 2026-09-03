"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowIcon, CheckIcon, LockIcon } from "@/components/icons";
import type { PublicProfile, ScanResult } from "@/lib/types";

type ProfileShape = PublicProfile;

type PublicProfileActionsProps = {
  result: ScanResult;
  sample?: boolean;
};

function profileFromPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") return null;
  const candidate = (payload as { profile?: unknown }).profile;
  if (!candidate || typeof candidate !== "object") return null;
  return candidate as ProfileShape;
}

/**
 * Publishing is deliberately a second, explicit action. A scan never writes
 * to the customer's site and never creates an AIX public page by itself.
 */
export function PublicProfileActions({ result, sample = false }: PublicProfileActionsProps) {
  const [profile, setProfile] = useState<ProfileShape | null>(null);
  const [publishToken, setPublishToken] = useState("");
  const [busy, setBusy] = useState<"preview" | "publish" | "revoke" | "">("");
  const [error, setError] = useState("");

  async function preview() {
    if (sample) return;
    setBusy("preview");
    setError("");
    try {
      const response = await fetch("/api/ai-profile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ scanId: result.scanId, action: "preview" }),
      });
      const payload = await response.json() as { error?: string; token?: string; profile?: ProfileShape };
      if (!response.ok) throw new Error(payload.error || "公開ページを作成できませんでした。");
      const next = profileFromPayload(payload);
      if (!next || !payload.token) throw new Error("公開ページの確認情報を取得できませんでした。");
      setProfile(next);
      setPublishToken(payload.token);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "公開ページを作成できませんでした。");
    } finally {
      setBusy("");
    }
  }

  async function changeStatus(action: "publish" | "revoke") {
    if (!profile || !publishToken) return;
    setBusy(action);
    setError("");
    try {
      const response = await fetch("/api/ai-profile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ profileId: profile.id, token: publishToken, action }),
      });
      const payload = await response.json() as { error?: string; profile?: ProfileShape };
      if (!response.ok) throw new Error(payload.error || "公開ページを更新できませんでした。");
      const next = profileFromPayload(payload);
      if (!next) throw new Error("公開ページの状態を確認できませんでした。");
      setProfile(next);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "公開ページを更新できませんでした。");
    } finally {
      setBusy("");
    }
  }

  if (sample) {
    return <section className="public-profile-card" aria-label="AIX上の公開ページの見本">
      <div className="public-profile-card-copy"><p className="overline">AIX上の公開ページ</p><h2>会社の情報を、AIが読みやすいページにする。</h2><p>診断で確認した公開情報を、AIX上の会社ページとして整理できます。会社サイトの変更や、第三者の評価づくりは行いません。</p></div>
      <div className="public-profile-card-actions"><div className="public-profile-sample-links"><Link className="button button-secondary" href="/ai-info?sample=1">公開前の見本を見る <ArrowIcon /></Link><Link className="text-button" href="/ai/company/nexora-cloud?sample=1">公開後のページを見る <ArrowIcon /></Link></div><small><LockIcon />実際の公開は、内容を確認してから</small></div>
    </section>;
  }

  return <section className="public-profile-card" aria-label="AIX上の公開ページ">
    <div className="public-profile-card-copy"><p className="overline">AIX上の公開ページ</p><h2>この会社の情報を、AIが参照しやすいページにする。</h2><p>診断で取得した公開ページだけを整理し、AIX上で会社・サービスの説明を公開できます。内容は公開前に確認できます。</p><ul><li><CheckIcon />公式ページへのリンク付き</li><li><CheckIcon />AIの回答や社内情報は掲載しない</li><li><CheckIcon />公開・停止をいつでも選べる</li></ul></div>
    <div className="public-profile-card-actions">
      {!profile ? <button className="button button-primary" type="button" onClick={() => void preview()} disabled={busy !== ""}>{busy === "preview" ? "内容をまとめています…" : "公開内容を確認する"}<ArrowIcon /></button> : <>
        <div className={`public-profile-status public-profile-status-${profile.status}`}><span>{profile.status === "published" ? "公開中" : profile.status === "revoked" ? "停止中" : "下書き"}</span><strong>{profile.brandName}</strong><small>{profile.sourcePages.length}ページをもとに作成</small></div>
        <div className="public-profile-preview" aria-label="公開内容のプレビュー"><div className="public-profile-preview-head"><span>公開される内容</span><strong>{profile.title}</strong></div>{profile.summary ? <p>{profile.summary}</p> : null}<div className="public-profile-preview-meta">{profile.market ? <span><small>分野</small><b>{profile.market}</b></span> : null}{profile.targetCustomers.length ? <span><small>対象</small><b>{profile.targetCustomers.slice(0, 2).join("・")}</b></span> : null}{profile.useCases.length ? <span><small>用途</small><b>{profile.useCases.slice(0, 2).join("・")}</b></span> : null}</div><div className="public-profile-preview-source"><small>公式ページの出典</small>{profile.sourcePages.slice(0, 3).map((page) => <a key={page.url} href={page.url} target="_blank" rel="noreferrer">{page.title}</a>)}{profile.sourcePages.length > 3 ? <span>ほか{profile.sourcePages.length - 3}ページ</span> : null}</div></div>
        {profile.status !== "published" ? <button className="button button-primary" type="button" onClick={() => void changeStatus("publish")} disabled={busy !== ""}>{busy === "publish" ? "公開しています…" : "この内容で公開する"}<ArrowIcon /></button> : <Link className="button button-primary" href={`/ai/company/${encodeURIComponent(profile.slug)}`} target="_blank" rel="noreferrer">公開ページを見る <ArrowIcon /></Link>}
        {profile.status === "published" ? <button className="text-button public-profile-revoke" type="button" onClick={() => void changeStatus("revoke")} disabled={busy !== ""}>{busy === "revoke" ? "停止しています…" : "公開を停止する"}</button> : null}
      </>}
      <small><LockIcon />AIXが自社サイトを変更したり、勝手に公開したりすることはありません。</small>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
    </div>
  </section>;
}
