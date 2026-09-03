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
    return <section className="public-profile-card" aria-label="AI専用公式データベースの即時発行">
      <div className="public-profile-card-copy">
        <p className="overline">【ステップ 1】AI専用公式データベースの公開（自社サイト改修ゼロ）</p>
        <h2>主要な生成AIに対応した「AI公式データベース」を即座に発行しました。</h2>
        <p>自社のホームページをいじる必要はありません。AIの検索エンジン（GPTBot等）が直接巡回して学習・推薦に使う「公式構造化ページ」をあなたの会社専用に自動発行しました。AIに直接自社の強みを認知させられます。</p>
        <ul>
          <li><CheckIcon />自社サイトへの公式リンクを自動設置</li>
          <li><CheckIcon />ChatGPTやGeminiが読み取りやすい構造化データ（JSON-LD）対応</li>
          <li><CheckIcon />公開・停止はいつでも自由に切り替え可能</li>
        </ul>
      </div>
      <div className="public-profile-card-actions">
        <div className="public-profile-sample-links">
          <Link className="button button-primary" href="/ai/company/aoba-souzoku?sample=1" target="_blank" rel="noreferrer">発行されたAI専用ページを見る <ArrowIcon /></Link>
          <Link className="text-button" href="/ai-info?sample=1">掲載内容の下書きを確認する <ArrowIcon /></Link>
        </div>
        <small><LockIcon />自社サイトを書き換えたり、勝手に情報を改変することはありません。</small>
      </div>
    </section>;
  }

  return <section className="public-profile-card" aria-label="AI専用公式データベースの即時発行">
    <div className="public-profile-card-copy">
      <p className="overline">【ステップ 1】AI専用公式データベースの公開（自社サイト改修ゼロ）</p>
      <h2>主要な生成AIに対応した「AI公式データベース」を即座に発行しました。</h2>
      <p>自社のホームページをいじる必要はありません。AIの検索エンジン（GPTBot等）が直接巡回して学習・推薦に使う「公式構造化ページ」をあなたの会社専用に自動発行しました。AIに直接自社の強みを認知させられます。</p>
      <ul>
        <li><CheckIcon />自社サイトへの公式リンクを自動設置</li>
        <li><CheckIcon />ChatGPTやGeminiが読み取りやすい構造化データ（JSON-LD）対応</li>
        <li><CheckIcon />公開・停止はいつでも自由に切り替え可能</li>
      </ul>
    </div>
    <div className="public-profile-card-actions">
      {!profile ? <button className="button button-primary" type="button" onClick={() => void preview()} disabled={busy !== ""}>{busy === "preview" ? "専用ページを準備しています…" : "AI専用ページの掲載内容を確認する"}<ArrowIcon /></button> : <>
        <div className={`public-profile-status public-profile-status-${profile.status}`}><span>{profile.status === "published" ? "AI向け公開中" : profile.status === "revoked" ? "公開停止中" : "下書き"}</span><strong>{profile.brandName}</strong><small>{profile.sourcePages.length}ページをもとに作成</small></div>
        <div className="public-profile-preview" aria-label="公開内容のプレビュー"><div className="public-profile-preview-head"><span>AIに学習させる内容</span><strong>{profile.title}</strong></div>{profile.summary ? <p>{profile.summary}</p> : null}<div className="public-profile-preview-meta">{profile.market ? <span><small>分野</small><b>{profile.market}</b></span> : null}{profile.targetCustomers.length ? <span><small>対象</small><b>{profile.targetCustomers.slice(0, 2).join("・")}</b></span> : null}{profile.useCases.length ? <span><small>用途</small><b>{profile.useCases.slice(0, 2).join("・")}</b></span> : null}</div><div className="public-profile-preview-source"><small>公式ページの出典</small>{profile.sourcePages.slice(0, 3).map((page) => <a key={page.url} href={page.url} target="_blank" rel="noreferrer">{page.title}</a>)}{profile.sourcePages.length > 3 ? <span>ほか{profile.sourcePages.length - 3}ページ</span> : null}</div></div>
        {profile.status !== "published" ? <button className="button button-primary" type="button" onClick={() => void changeStatus("publish")} disabled={busy !== ""}>{busy === "publish" ? "AI向けに公開しています…" : "この内容でAI向けに公開する"}<ArrowIcon /></button> : <Link className="button button-primary" href={`/ai/company/${encodeURIComponent(profile.slug)}`} target="_blank" rel="noreferrer">公開されたAI専用ページを見る <ArrowIcon /></Link>}
        {profile.status === "published" ? <button className="text-button public-profile-revoke" type="button" onClick={() => void changeStatus("revoke")} disabled={busy !== ""}>{busy === "revoke" ? "停止しています…" : "公開を停止する"}</button> : null}
      </>}
      <small><LockIcon />自社サイトを書き換えたり、勝手に情報を改変することはありません。</small>
      {error ? <p className="form-error" role="alert">{error}</p> : null}
    </div>
  </section>;
}
