"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SiteHeader } from "@/components/site-header";
import { ArrowIcon } from "@/components/icons";
import { isUrlInput } from "@/lib/input-kind";
import { parseSocialInput } from "@/lib/social-input";
import type { InputResolutionCandidate } from "@/lib/input-resolution";
import type { ScanProgressEvent, ScanStage } from "@/lib/types";

const steps: Array<{ stage: ScanStage; label: string }> = [
  { stage: "validating", label: "診断先を確認" },
  { stage: "crawling", label: "公開ページを読む" },
  { stage: "discovering", label: "市場と競合を整理" },
  { stage: "prompting", label: "購入前の質問を作る" },
  { stage: "measuring", label: "AI回答を確認" },
  { stage: "analyzing", label: "結果と優先順位をまとめる" },
];

type ResolutionPayload = {
  candidates?: InputResolutionCandidate[];
  error?: string;
};

function normalize(value: string | null) {
  const raw = value?.trim() || "";
  if (!raw) return "";
  return /^https?:\/\//i.test(raw) || /^[a-z][a-z\d+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;
}

function hostOf(value: string) {
  try { return new URL(value).hostname.replace(/^www\./, ""); } catch { return value; }
}

function displayInput(value: string) {
  return value.length > 72 ? `${value.slice(0, 72)}…` : value;
}

export function ScanProgress() {
  const router = useRouter();
  const params = useSearchParams();
  const rawInput = useMemo(() => (params.get("input") || params.get("url") || "").trim(), [params]);
  const extraUrl = params.get("extraUrl");
  const extraSocial = params.get("extraSocial");
  const extraProduct = params.get("extraProduct");
  const inputKind = params.get("kind");
  const socialInfo = useMemo(() => parseSocialInput(rawInput || extraSocial || ""), [extraSocial, rawInput]);
  const directUrl = useMemo(() => isUrlInput(rawInput) ? normalize(rawInput) : extraUrl && isUrlInput(extraUrl) ? normalize(extraUrl) : "", [extraUrl, rawInput]);
  const controller = useRef<AbortController | null>(null);
  const startedScan = useRef("");
  const resolvedInput = useRef("");
  const [phase, setPhase] = useState<"resolving" | "choose" | "scanning" | "failed" | "no_site" | "social_site" | "product_site">("resolving");
  const [candidates, setCandidates] = useState<InputResolutionCandidate[]>([]);
  const [selectedUrl, setSelectedUrl] = useState("");
  const [stage, setStage] = useState<ScanStage>("created");
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("診断を準備しています。");
  const [detail, setDetail] = useState("診断先を確認しています");
  const [error, setError] = useState("");
  const [directBrandName, setDirectBrandName] = useState(
    extraProduct ? extraProduct : socialInfo.username ? socialInfo.username : rawInput
  );
  const [directMarket, setDirectMarket] = useState(
    extraProduct || inputKind === "product"
      ? "D2Cブランド・特産品・プロダクト"
      : socialInfo.isSocial
      ? "飲食・美容・小売・地域サービス"
      : "専門技術・加工・サービス"
  );
  const [directLocation, setDirectLocation] = useState(
    extraProduct || inputKind === "product" ? "全国通販・オンライン直販 / 発送" : "全国対応 / 地域密着"
  );
  const [directCreating, setDirectCreating] = useState(false);

  const createDirectProfile = useCallback(async () => {
    setDirectCreating(true);
    setError("");
    try {
      const finalBrand = (directBrandName || rawInput).trim();
      const summaryParts = [
        `${finalBrand}の公式エンタープライズ・ナレッジ台帳。`,
        extraSocial ? `Instagram公式（${extraSocial}）と連携。` : socialInfo.isSocial ? `${socialInfo.displayLabel || "SNS"}公式と連携。` : "",
        extraProduct ? `主力製品「${extraProduct}」の仕様・推薦データを包含。` : "",
        extraUrl ? `自社公式サイト（${extraUrl}）と完全同期。` : "自社サイトを持たない企業様向けに直接発行され、",
        `主要生成AI（ChatGPT/Gemini/Claude等）推薦用の公式マスターデータです。`
      ].filter(Boolean).join(" ");

      const response = await fetch("/api/ai-profile", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "create_direct",
          brandName: finalBrand,
          market: directMarket,
          location: directLocation,
          summary: summaryParts,
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.slug) throw new Error(data.error || "公式Web拠点の発行に失敗しました。");
      
      // 発行された本物の公式ナレッジ台帳ページへジャンプ！
      router.push(`/ai/company/${encodeURIComponent(data.slug)}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "公式Web拠点の発行に失敗しました。");
      setDirectCreating(false);
    }
  }, [directBrandName, directLocation, directMarket, extraProduct, extraSocial, extraUrl, rawInput, router, socialInfo.displayLabel, socialInfo.isSocial]);

  const startScan = useCallback(async (inputUrl: string) => {
    const targetUrl = normalize(inputUrl);
    if (!targetUrl) {
      setPhase("failed");
      setError("診断する公開サイトがありません。");
      return;
    }
    startedScan.current = targetUrl;
    controller.current?.abort();
    const abort = new AbortController();
    controller.current = abort;
    setPhase("scanning");
    setError("");
    setStage("created");
    setProgress(0);
    setMessage("診断を準備しています。");
    setDetail("診断先を確認しています");
    try {
      const response = await fetch("/api/scan", { method: "POST", headers: { "content-type": "application/json", accept: "application/x-ndjson" }, body: JSON.stringify({ url: targetUrl }), signal: abort.signal });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || `診断を開始できませんでした (${response.status})`);
      }
      if (!response.body) throw new Error("診断の進行状況を取得できませんでした。");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";
        for (const line of lines) {
          if (!line.trim()) continue;
          const event = JSON.parse(line) as ({ type: "accepted" | "progress" | "complete" | "error"; scanId?: string; error?: string } & Partial<ScanProgressEvent>);
          if (event.type === "progress") {
            if (event.stage) setStage(event.stage);
            if (typeof event.progress === "number") setProgress(event.progress);
            if (event.message) setMessage(event.message);
            if (event.detail) setDetail(event.detail);
          }
          if (event.type === "complete" && event.scanId) {
            setProgress(100); setStage("complete"); setMessage("結果をまとめました。");
            router.replace(`/result?id=${encodeURIComponent(event.scanId)}`);
            return;
          }
          if (event.type === "error") throw new Error(event.error || "診断に失敗しました。");
        }
      }
    } catch (caught) {
      if (abort.signal.aborted) return;
      setPhase("failed");
      setStage("failed");
      setError(caught instanceof Error ? caught.message : "診断に失敗しました。");
    }
  }, [router]);

  useEffect(() => {
    controller.current?.abort();
    if (!rawInput) {
      setPhase("failed");
      setError("会社名・商品名・サービス名・URLがありません。");
      return () => undefined;
    }
    if (socialInfo.isSocial) {
      setPhase("social_site");
      setMessage("Instagram等のSNS連携フロー");
      setDetail("SNSアカウントからAI公式Web拠点を発行します");
      return () => undefined;
    }
    if (inputKind === "product") {
      setPhase("product_site");
      setMessage("商品・サービス専用の公式台帳フロー");
      setDetail("商品名から直接AI推薦用台帳を発行します");
      return () => undefined;
    }
    if (directUrl) {
      if (startedScan.current !== directUrl) void startScan(directUrl);
      return () => controller.current?.abort();
    }
    if (resolvedInput.current === rawInput && candidates.length) return () => controller.current?.abort();
    resolvedInput.current = rawInput;
    const abort = new AbortController();
    controller.current = abort;
    setPhase("resolving");
    setCandidates([]);
    setSelectedUrl("");
    setError("");
    setMessage("公開サイトを探しています。");
    setDetail("入力名に対応する候補を検索しています");
    async function resolve() {
      try {
        const response = await fetch("/api/resolve", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ input: rawInput }), signal: abort.signal });
        const data = await response.json().catch(() => ({})) as ResolutionPayload;
        if (!response.ok) throw new Error(data.error || `公開サイトを探せませんでした (${response.status})`);
        const nextCandidates = Array.isArray(data.candidates) ? data.candidates.filter((candidate) => candidate?.url) : [];
        if (!nextCandidates.length) {
          setPhase("no_site");
          setMessage("自社サイトがない企業様専用の発行フロー");
          setDetail("会社名から直接公式Web拠点を発行できます");
          return;
        }
        setCandidates(nextCandidates);
        setSelectedUrl(nextCandidates[0].url);
        setPhase("choose");
        setMessage("診断先を確認してください。");
        setDetail(`${nextCandidates.length}件の公開サイト候補`);
      } catch (caught) {
        if (abort.signal.aborted) return;
        setPhase("failed");
        setError(caught instanceof Error ? caught.message : "公開サイトを探せませんでした。");
      }
    }
    void resolve();
    return () => abort.abort();
  }, [candidates.length, directUrl, inputKind, rawInput, socialInfo.isSocial, startScan]);

  const targetHost = hostOf(selectedUrl || directUrl);
  const isDirectTarget = isUrlInput(rawInput);
  const activeIndex = steps.findIndex((item) => item.stage === stage);
  const completedCount = stage === "complete" ? steps.length : Math.max(0, activeIndex);

  if (phase !== "scanning") {
    return <main className="scan-page">
      <SiteHeader compact />
      <section className="scan-stage shell scan-resolve-stage">
        <div className="scan-stage-main scan-resolve-main">
          <p className="overline">
            {phase === "resolving"
              ? "診断先を検索中"
              : phase === "social_site"
              ? "📸 Instagram連携・AI公式拠点発行"
              : phase === "product_site"
              ? "📦 商品専用AI公式台帳発行"
              : phase === "no_site"
              ? "🏢 公式Web拠点ダイレクト発行"
              : "診断先の同定確認"}
          </p>
          <h1>
            {phase === "resolving"
              ? `「${displayInput(rawInput)}」の公開サイトを探しています。`
              : phase === "social_site"
              ? `Instagram「${displayInput(rawInput)}」からAI公式Web拠点を発行します`
              : phase === "product_site"
              ? `商品「${displayInput(rawInput)}」のAI推薦用台帳を発行します`
              : phase === "no_site"
              ? `「${displayInput(rawInput)}」のAI公式Web拠点を直接発行します`
              : `「${displayInput(rawInput)}」の公式サイトを確認してください`}
          </h1>
          <p className="scan-message">
            {phase === "resolving"
              ? "会社名・商品名から、診断できる公開サイトを調べています。"
              : phase === "social_site"
              ? "Instagramは画像が中心のため、ChatGPTやGemini等の生成AIは料金やサービス詳細を読み取れません。AIが直接引用できる公的台帳を発行し、おすすめの第一想起を獲得します。"
              : phase === "product_site"
              ? "商品名・サービス名から、AIが第一想起で推薦するための専用スペック台帳を即座に無料発行します。"
              : phase === "no_site"
              ? "自社サイトをお持ちでない企業様でも、会社名だけでAI専用の公式Web拠点を即座に発行できます。"
              : "AIが同名の別会社と誤認しないよう、ドメインを確認して公式サイトを確定します。"}
          </p>
          {phase === "resolving" ? <div className="scan-resolve-loading" role="status"><span className="scan-resolve-spinner" aria-hidden="true" />公開情報を検索しています…</div> : null}
          {phase === "choose" ? <>
            <div className="disambiguation-guide-box">
              <span className="disambiguation-tag">🛡️ 同名他社・人違い防止確認</span>
              <p>
                「{displayInput(rawInput)}」に該当する公開候補が見つかりました。AIが別の会社と誤認しないよう、<strong>ご自身の会社・店舗・サービスのサイト</strong>を選択してください。
              </p>
            </div>
            <fieldset className="scan-resolve-options">
              <legend>診断する公開サイト（目視で確定）</legend>
              {candidates.map((candidate) => {
                const host = hostOf(candidate.url);
                return <label className={`scan-resolve-option ${selectedUrl === candidate.url ? "selected" : ""}`} key={candidate.url}>
                  <input type="radio" name="scan-candidate" value={candidate.url} checked={selectedUrl === candidate.url} onChange={() => setSelectedUrl(candidate.url)} />
                  <span className="scan-resolve-option-copy"><strong>{candidate.title}</strong><small>{host}</small><span>{candidate.reason}</span></span>
                </label>;
              })}
            </fieldset>
            <div className="scan-resolve-actions">
              <button className="button button-primary scan-resolve-start" type="button" disabled={!selectedUrl} onClick={() => void startScan(selectedUrl)}>このサイトを確定して診断する <span aria-hidden="true">→</span></button>
              <button className="button button-secondary" type="button" onClick={() => setPhase("no_site")} style={{ marginLeft: "12px" }}>自社サイトがない・候補にない（直接発行する）</button>
            </div>
            <p className="scan-resolve-note">※ドメインとサイト内容を目視確認してから確定するため、同名他社との誤認を100%防ぎます。</p>
          </> : null}
          {phase === "no_site" ? (
            <div className="scan-no-site-container">
              <div className="no-site-card">
                <span className="no-site-tag">ホームページがなくても大丈夫</span>
                <h3>高額なWebサイト制作は不要です</h3>
                <p>
                  公式Webサイトが見つかりませんでした。自社サイトをお持ちでない場合でも、AIXでは会社名（屋号）をもとに、<strong>AI専用の公式Web拠点（公的ナレッジ台帳）</strong>を即座に無料発行できます。
                </p>

                <div className="no-site-form-grid">
                  <div className="no-site-input-group">
                    <label>会社名・屋号（表示名）</label>
                    <input type="text" value={rawInput} readOnly className="input-readonly" />
                  </div>
                  <div className="no-site-input-group">
                    <label>専門分野・主な取扱品目</label>
                    <input
                      type="text"
                      value={directMarket}
                      onChange={(e) => setDirectMarket(e.target.value)}
                      placeholder="例: 精密板金加工、有機野菜栽培、地域密着リフォーム"
                    />
                  </div>
                  <div className="no-site-input-group">
                    <label>所在地・対応エリア</label>
                    <input
                      type="text"
                      value={directLocation}
                      onChange={(e) => setDirectLocation(e.target.value)}
                      placeholder="例: 東京都大田区 / 全国対応"
                    />
                  </div>
                </div>

                <div className="no-site-action-row" style={{ marginTop: "18px" }}>
                  <div className="no-site-target-brand">
                    <span>発行される公式URL：</span>
                    <strong>{`https://aix.jp/ai/company/${encodeURIComponent(rawInput.toLowerCase().replace(/\s+/g, "-"))}`}</strong>
                  </div>
                  <button
                    className="button button-primary scan-resolve-start"
                    type="button"
                    disabled={directCreating}
                    onClick={() => void createDirectProfile()}
                  >
                    {directCreating ? "公式拠点を即時発行中…" : "この会社名でAI公式Web拠点を無料発行する"} <ArrowIcon />
                  </button>
                </div>
                {error ? <p className="form-error" style={{ marginTop: "10px" }}>{error}</p> : null}
                <small className="no-site-small-note">
                  ※発行されたページは、名刺・SNS・Googleマップのウェブサイト欄にそのまま公式URLとしてご利用いただけます。
                </small>
              </div>
              <button className="button button-secondary" type="button" onClick={() => router.push("/")} style={{ marginTop: "16px" }}>
                ← 別の会社名やURLでやり直す
              </button>
            </div>
          ) : null}
          {phase === "social_site" ? (
            <div className="scan-no-site-container">
              <div className="no-site-card">
                <span className="no-site-tag" style={{ background: "linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)", color: "#fff" }}>
                  {socialInfo.displayLabel || "Instagram連携モード"}
                </span>
                <h3>Instagramをホームページ代わりにされている事業者様へ</h3>
                <p>
                  Instagramの写真や投稿は人間に魅力が伝わる一方、画像中心のため<strong>生成AI（ChatGPTやGemini）は料金や詳細なサービス内容を正確に読み取れず、おすすめの候補からスルーされてしまいます。</strong><br />
                  AIXなら、SNSアカウントから<strong>AIが100%読み取れる公式Web拠点（公的ナレッジ台帳）</strong>を即座に無料発行できます。
                </p>

                <div className="no-site-form-grid">
                  <div className="no-site-input-group">
                    <label>店舗名・屋号・ブランド名</label>
                    <input
                      type="text"
                      value={directBrandName}
                      onChange={(e) => setDirectBrandName(e.target.value)}
                      placeholder="例: サロン名、店舗名、農園名"
                    />
                  </div>
                  <div className="no-site-input-group">
                    <label>専門ジャンル・主な取扱メニュー</label>
                    <input
                      type="text"
                      value={directMarket}
                      onChange={(e) => setDirectMarket(e.target.value)}
                      placeholder="例: オーガニックカフェ、プライベートサロン、産直野菜"
                    />
                  </div>
                  <div className="no-site-input-group">
                    <label>所在地・店舗エリア</label>
                    <input
                      type="text"
                      value={directLocation}
                      onChange={(e) => setDirectLocation(e.target.value)}
                      placeholder="例: 東京都目黒区 / 自由が丘駅徒歩3分"
                    />
                  </div>
                </div>

                <div className="no-site-action-row" style={{ marginTop: "18px" }}>
                  <div className="no-site-target-brand">
                    <span>連携SNSアカウント：</span>
                    <strong>{socialInfo.displayLabel || rawInput}</strong>
                  </div>
                  <button
                    className="button button-primary scan-resolve-start"
                    type="button"
                    disabled={directCreating}
                    onClick={() => void createDirectProfile()}
                  >
                    {directCreating ? "公式拠点を即時発行中…" : "Instagram連携のAI公式Web拠点を無料発行する"} <ArrowIcon />
                  </button>
                </div>
                {error ? <p className="form-error" style={{ marginTop: "10px" }}>{error}</p> : null}
                <small className="no-site-small-note">
                  ※発行されたURLは、Instagramのプロフィール欄（リンク）に貼ることで、フォロワーにもAIにも伝わる公式拠点として機能します。
                </small>
              </div>
              <button className="button button-secondary" type="button" onClick={() => router.push("/")} style={{ marginTop: "16px" }}>
                ← 別の会社名やURLでやり直す
              </button>
            </div>
          ) : null}
          {phase === "product_site" ? (
            <div className="scan-no-site-container">
              <div className="no-site-card">
                <span className="no-site-tag" style={{ background: "#7c3aed", color: "#fff" }}>
                  📦 商品・サービス専用台帳モード
                </span>
                <h3>「{displayInput(rawInput)}」のAI推薦用公式台帳を発行します</h3>
                <p>
                  生成AI（ChatGPTやGemini）は「おすすめの〇〇（商品ジャンル）」を聞かれた際、<strong>商品名と用途、独自の強みがWeb上で構造化されていないと他社製品を優先推薦してしまいます。</strong><br />
                  AIXなら、商品名・サービス名単体からでも、AIが第一想起で推薦する公式商品台帳（Product Knowledge Master）を即座に無料発行できます。
                </p>

                <div className="no-site-form-grid">
                  <div className="no-site-input-group">
                    <label>商品名・サービス名（ブランド名）</label>
                    <input
                      type="text"
                      value={directBrandName}
                      onChange={(e) => setDirectBrandName(e.target.value)}
                      placeholder="例: 熟成黒にんにく、Nexoraクラウド、匠の包丁"
                    />
                  </div>
                  <div className="no-site-input-group">
                    <label>カテゴリー・主な用途</label>
                    <input
                      type="text"
                      value={directMarket}
                      onChange={(e) => setDirectMarket(e.target.value)}
                      placeholder="例: 健康食品・滋養強壮、業務効率化SaaS、特注調理器具"
                    />
                  </div>
                  <div className="no-site-input-group">
                    <label>提供形態・購入方法</label>
                    <input
                      type="text"
                      value={directLocation}
                      onChange={(e) => setDirectLocation(e.target.value)}
                      placeholder="例: 公式通販・全国送料無料 / 初回お試し1,980円"
                    />
                  </div>
                </div>

                <div className="no-site-action-row" style={{ marginTop: "18px" }}>
                  <div className="no-site-target-brand">
                    <span>発行対象プロダクト：</span>
                    <strong>{directBrandName || rawInput}</strong>
                  </div>
                  <button
                    className="button button-primary scan-resolve-start"
                    type="button"
                    disabled={directCreating}
                    onClick={() => void createDirectProfile()}
                  >
                    {directCreating ? "商品台帳を即時発行中…" : "この商品のAI公式台帳を無料発行する"} <ArrowIcon />
                  </button>
                </div>
                {error ? <p className="form-error" style={{ marginTop: "10px" }}>{error}</p> : null}
                <small className="no-site-small-note">
                  ※発行された商品台帳は、ChatGPTやGeminiなどのAIクローラーが「商品仕様・おすすめ理由」として直接引用・グラウンディングされます。
                </small>
              </div>
              <button className="button button-secondary" type="button" onClick={() => router.push("/")} style={{ marginTop: "16px" }}>
                ← 別の会社名やURLでやり直す
              </button>
            </div>
          ) : null}
          {phase === "failed" ? <div className="scan-error" role="alert"><strong>{isDirectTarget ? "診断を開始できませんでした。" : "公開サイトを見つけられませんでした。"}</strong><p>{error}</p><button className="button button-secondary" type="button" onClick={() => router.push("/")}>入力をやり直す</button></div> : null}
        </div>
        {phase === "choose" || phase === "resolving" ? (
          <aside className="scan-stage-list scan-resolve-aside">
            <div className="scan-stage-list-head">
              <strong>入力できるもの</strong>
              <span>URL / 名前</span>
            </div>
            <ul className="scan-input-types">
              <li><strong>会社名</strong><span>例：株式会社○○</span></li>
              <li><strong>サービス名・商品名</strong><span>例：Notion、○○クラウド</span></li>
              <li><strong>公開サイトのURL</strong><span>例：https://yourcompany.jp</span></li>
            </ul>
            <p className="scan-stage-note">名前で探した場合も、公開サイトを選んでから診断します。</p>
          </aside>
        ) : null}
      </section>
    </main>;
  }

  return <main className="scan-page">
    <SiteHeader compact />
    <section className="scan-stage shell">
      <div className="scan-stage-main">
        <p className="overline">診断中</p>
        <h1>{targetHost || "会社サイト"}を確認しています。</h1>
        <p className="scan-message">{message}</p>
        <div className="scan-progress-track" aria-label={`進捗 ${Math.round(progress)}%`}><span style={{ width: `${progress}%` }} /></div>
        <div className="scan-progress-summary"><strong>{Math.round(progress)}%</strong><span>{detail}</span></div>
        {!error ? <button className="scan-cancel" type="button" onClick={() => { controller.current?.abort(); router.push("/"); }}>診断をやめる</button> : null}
        {error ? <div className="scan-error" role="alert"><strong>診断を完了できませんでした。</strong><p>{error}</p><button className="button button-secondary" type="button" onClick={() => window.location.reload()}>もう一度試す</button></div> : null}
      </div>
      <div className="scan-stage-list" aria-label="診断の進み具合"><div className="scan-stage-list-head"><strong>今回確認すること</strong><span>{completedCount} / {steps.length}</span></div><ol>{steps.map((item, index) => {
        const state = stage === "failed" ? (index < activeIndex ? "done" : index === activeIndex ? "failed" : "pending") : index < activeIndex || stage === "complete" ? "done" : index === activeIndex ? "active" : "pending";
        return <li className={state} key={item.stage}><span>{state === "done" ? "✓" : state === "failed" ? "!" : index + 1}</span><strong>{item.label}</strong>{state === "active" ? <em>確認中</em> : state === "done" ? <em>完了</em> : null}</li>;
      })}</ol><p className="scan-stage-note">サイトの内容とAIの回答を順番に照合しています。完了すると結果ページへ移動します。</p></div>
    </section>
  </main>;
}
