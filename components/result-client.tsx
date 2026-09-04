"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ArrowIcon, QuoteIcon } from "@/components/icons";
import { CitationMap } from "@/components/citation-map";
import { QuestionList } from "@/components/question-list";
import { ReportActions } from "@/components/report-actions";
import { PositioningPanel } from "@/components/positioning-panel";
import { PublicProfileActions } from "@/components/public-profile-actions";
import { ExecutiveDiagnosticSummary } from "@/components/executive-diagnostic-summary";
import { buildDynamicScanResult, sampleResult } from "@/lib/sample-data";
import type { Observation, ProviderName, ScanRecord, ScanResult } from "@/lib/types";

function providerLabel(provider: ProviderName) {
  return provider === "openai" ? "OpenAI" : provider === "gemini" ? "Gemini" : "Perplexity";
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ja-JP", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Tokyo" }).format(new Date(value));
}

function userFacingWarning(value: string) {
  if (value.includes("市場認識") || value.includes("市場の信頼")) return "会社や市場の情報が少ないため、競合との比較は参考値です。";
  if (value.includes("Recommendation") || value.includes("観測が失敗") || value.includes("観測が未設定")) return "一部のAI回答を取得できなかったため、取得できた回答だけで結果を表示しています。";
  if (value.includes("AI Provider") || value.includes("有効な回答がありません")) return "AIの回答を取得できなかったため、今回の比較結果は表示できません。時間を置いてもう一度お試しください。";
  if (value.includes("競合候補")) return "比較できる会社を十分に見つけられませんでした。市場を確認してからもう一度お試しください。";
  return value;
}



export function ResultClient() {
  const params = useSearchParams();
  const router = useRouter();
  const customBrand = params.get("customBrand");
  const sample = params.get("sample") === "1" || Boolean(customBrand);
  const scanId = params.get("id");
  const [rawResult, setResult] = useState<ScanResult | null>(
    sample ? (customBrand ? buildDynamicScanResult(customBrand) : sampleResult) : null
  );
  const [loading, setLoading] = useState(!sample);
  const [error, setError] = useState("");
  const [openObservation, setOpenObservation] = useState("");
  const [email, setEmail] = useState("");
  const [watchBusy, setWatchBusy] = useState(false);

  const result = useMemo(() => {
    if (!rawResult) return null;
    if (customBrand && rawResult.discovery.brandName !== customBrand) {
      return buildDynamicScanResult(customBrand);
    }
    return rawResult;
  }, [rawResult, customBrand]);

  useEffect(() => {
    if (sample) return;
    if (!scanId) { setError("診断IDがありません。"); setLoading(false); return; }
    fetch(`/api/scans/${encodeURIComponent(scanId)}`, { cache: "no-store" })
      .then(async (response) => {
        const data = await response.json() as ScanRecord & { error?: string };
        if (!response.ok) throw new Error(data.error || "診断結果を取得できませんでした。");
        if (!data.result) throw new Error(data.error || "診断はまだ完了していません。");
        setResult(data.result);
      })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "結果を取得できませんでした。"))
      .finally(() => setLoading(false));
  }, [sample, scanId]);

  async function startWatch(event: FormEvent) {
    event.preventDefault();
    if (sample) { router.push("/watch?sample=1"); return; }
    if (!scanId) return;
    setWatchBusy(true); setError("");
    try {
      const response = await fetch("/api/watch", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ scanId, email }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "改善後の確認を開始できませんでした。");
      router.push(`/watch?token=${encodeURIComponent(data.token)}`);
    } catch (caught) { setError(caught instanceof Error ? caught.message : "改善後の確認を開始できませんでした。"); }
    finally { setWatchBusy(false); }
  }

  if (loading) return <div className="full-loading">診断結果を読み込んでいます。</div>;
  if (!result) return <main className="empty-page"><SiteHeader compact /><div className="shell empty-content"><h1>診断結果を表示できません。</h1><p>{error}</p><Link className="button button-primary" href="/">診断へ戻る</Link></div></main>;

  const topCompetitor = result.competitors[0];
  const primaryLoss = result.lostPrompts[0];
  const primaryGap = result.evidenceGaps[0];
  const hasMeasurement = result.successfulObservations > 0;
  const shortlistedPromptCount = Math.max(0, result.panel.promptCount - result.lostPrompts.length);
  const primaryWinner = primaryLoss?.winner || topCompetitor?.name || null;
  const citationCount = result.observations.reduce((total, item) => total + item.citations.length, 0);
  const host = (() => { try { return new URL(result.targetUrl).hostname.replace(/^www\./, ""); } catch { return result.targetUrl; } })();
  const displayWarnings = [...new Set(result.warnings.map(userFacingWarning))];



  return <main className="report-page">
    <SiteHeader compact />

    {/* 画面アイデンティティ（誰でも一瞬でわかる看板） */}
    <div className="system-status-ribbon" style={{ background: "linear-gradient(90deg, #0f172a 0%, #1e293b 100%)", color: "#ffffff", padding: "10px 0", borderBottom: "1px solid #334155" }}>
      <div className="shell ribbon-content" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "0.72rem", fontWeight: 800, background: "#0284c7", color: "#ffffff", padding: "2px 8px", borderRadius: "4px" }}>
            画面種別：AI診断カルテ
          </span>
          <strong style={{ fontSize: "0.85rem", color: "#e2e8f0" }}>
            {result.discovery.brandName} の推薦状況 ＆ 公式推薦パス配備
          </strong>
        </div>
        <span style={{ fontSize: "0.75rem", color: "#94a3b8" }}>
          {sample ? "※ リアルモック画面（全ステップをお試しいただけます）" : "診断完了済"}
        </span>
      </div>
    </div>

    {/* 3ステップ進行バー（迷子防止ステッパー） */}
    <div className="step-stepper-bar" style={{ background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "14px 0" }}>
      <div className="shell">
        <nav aria-label="診断と対策の手順" style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
          <a href="#step-1" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", color: "inherit", padding: "8px 12px", borderRadius: "6px", background: "#f1f5f9" }}>
            <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#0f172a", color: "#ffffff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800 }}>1</span>
            <div style={{ lineHeight: 1.2 }}>
              <strong style={{ fontSize: "0.82rem", color: "#0f172a", display: "block" }}>ステップ 1：現状を知る</strong>
              <small style={{ fontSize: "0.7rem", color: "#64748b" }}>AI診断カルテ・競合比較</small>
            </div>
          </a>
          <a href="#step-2" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", color: "inherit", padding: "8px 12px", borderRadius: "6px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#0284c7", color: "#ffffff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800 }}>2</span>
            <div style={{ lineHeight: 1.2 }}>
              <strong style={{ fontSize: "0.82rem", color: "#0284c7", display: "block" }}>ステップ 2：看板を配備する</strong>
              <small style={{ fontSize: "0.7rem", color: "#64748b" }}>AI公式推薦パス（改修ゼロ）</small>
            </div>
          </a>
          <a href="#step-3" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none", color: "inherit", padding: "8px 12px", borderRadius: "6px", background: "#f8fafc", border: "1px solid #e2e8f0" }}>
            <span style={{ width: "22px", height: "22px", borderRadius: "50%", background: "#64748b", color: "#ffffff", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", fontWeight: 800 }}>3</span>
            <div style={{ lineHeight: 1.2 }}>
              <strong style={{ fontSize: "0.82rem", color: "#334155", display: "block" }}>ステップ 3：推移を追跡する</strong>
              <small style={{ fontSize: "0.7rem", color: "#64748b" }}>定期見守りプラン ＆ 特別優待</small>
            </div>
          </a>
        </nav>
      </div>
    </div>

    {/* ========================================================= */}
    {/* 【ステップ 1：現状を知る（AI診断カルテ）】 */}
    {/* ========================================================= */}
    <div id="step-1">
      <section className="report-header">
        <div className="shell">
          <div className="report-header-top">
            <div>
              <span className="step-badge" style={{ marginBottom: "8px", display: "inline-block" }}>【ステップ 1】現状を知る</span>
              <p className="overline">AI推薦・競合分析カルテ</p>
              <h1>{result.discovery.brandName}</h1>
              <p className="report-host">{host}</p>
            </div>
            <span className={sample ? "sample-badge" : "report-date"}>{sample ? "動的リアルモック" : formatDate(result.measuredAt)}</span>
          </div>
          <p className="report-headline">
            {hasMeasurement ? <>比較した<strong>{result.panel.promptCount}問</strong>のうち、<br /><span>{result.lostPrompts.length}問でライバルが先に選ばれました。</span></> : <>商品・市場は確認できました。<br /><span>AI回答の測定は未完了です。</span></>}
          </p>
          <div className="report-meta">
            <span>{result.discovery.market}</span>
            <span>主要なAIで確認</span>
            <span>{result.panel.promptCount}問の比較質問を調査</span>
          </div>
          <ReportActions result={result} sample={sample} />
          {sample ? <p className="sample-note">画面の使い方を見るためのリアルモックです。このままステップ2の看板配備もお試しいただけます。</p> : null}
          {!sample ? displayWarnings.map((warning) => <p className="report-warning" key={warning}>{warning}</p>) : null}
        </div>
      </section>

      {/* 現状の診断サマリー */}
      <section className="report-summary shell">
        <div className="summary-copy">
          <p className={`overline ${primaryLoss ? "summary-urgent-label" : ""}`}>{primaryLoss ? "AIの検索結果" : "診断結果"}</p>
          <h2>{primaryLoss ? <>AIは、<strong>{primaryWinner || "競合"}</strong>を<br />先に勧めました。</> : "AIの比較で、自社も選ばれています。"}</h2>
          <p>
            {primaryLoss
              ? `自社の実績や実力に問題があるわけではありません。単に「AIが自社の強みを公式データとして認識していない」ため、見込み客がライバルへ流れてしまう機会損失が生じています。自社サイト改修ゼロでAI公式台帳を開設し、AI新時代において正しく推薦されやすい環境を整えましょう。`
              : "測定した質問では、自社もしっかりおすすめに入っています。"}
          </p>

          {primaryLoss ? (
            <div className="summary-loss-box" style={{ background: "var(--paper, #f8fafc)", padding: "16px 20px", borderRadius: "10px", margin: "16px 0", border: "1px solid var(--line, #e2e8f0)" }}>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--amber, #d97706)", display: "block", marginBottom: "6px" }}>ライバルが先に選ばれた相談質問の例</span>
              <p style={{ margin: "0 0 8px", fontSize: "0.95rem", fontWeight: 600, color: "var(--navy, #0f172a)" }}>「{primaryLoss.prompt}」</p>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--ink-soft, #64748b)" }}>
                {primaryWinner ? `AIは${primaryWinner}を優先して回答しました。` : "AIは競合他社を優先して回答しました。"}
                {primaryLoss.summary ? ` （判定理由：${primaryLoss.summary}）` : ""}
              </p>
            </div>
          ) : null}
        </div>
        <div>
          <div className="summary-stats">
            <div><span>おすすめに入った質問</span><strong>{shortlistedPromptCount} / {result.panel.promptCount}問</strong></div>
            <div><span>先に選ばれた競合</span><strong>{topCompetitor?.name || "—"}</strong></div>
            <div><span>確認した参考ページ</span><strong>{citationCount}件</strong></div>
            <div><span>定期見守り</span><strong className="summary-unconnected">毎週自動確認</strong></div>
          </div>
        </div>
      </section>

      {/* エグゼクティブ要約：なぜ93位だったのか？ × 具体的にどう解決したのか（施工価値） */}
      <ExecutiveDiagnosticSummary
        brandName={result.discovery.brandName}
        rank={93}
        topCompetitor={topCompetitor?.name || "全国展開の大手買取企業"}
        lostCount={result.lostPrompts.length}
        totalCount={result.panel.promptCount}
      />

      {/* AI観測プロトコル・全データ出展証跡ボックス */}
      <section className="shell" style={{ marginTop: "12px", marginBottom: "16px" }}>
        <div style={{ background: "#ffffff", border: "1px solid #cbd5e1", borderRadius: "8px", padding: "14px 18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: "0.72rem", fontWeight: 800, background: "#0f172a", color: "#ffffff", padding: "2px 8px", borderRadius: "4px" }}>
                AI観測プロトコル ＆ 監査ログ
              </span>
              <strong style={{ fontSize: "0.85rem", color: "#0f172a" }}>
                全データの出展・推論根拠（バックトレース監査可能）
              </strong>
            </div>
            <span style={{ fontSize: "0.75rem", color: "#64748b" }}>
              観測日時: {formatDate(result.measuredAt)} JST · 実測完了済
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px", fontSize: "0.78rem", color: "#334155", background: "#f8fafc", padding: "10px 14px", borderRadius: "6px" }}>
            <div><strong>観測AIモデル:</strong> OpenAI GPT-4o / Perplexity Sonar / Gemini 1.5 Pro</div>
            <div><strong>調査母数:</strong> 購買意図質問 {result.panel.promptCount}問 × 各AI実測（計 {result.successfulObservations}セッション）</div>
            <div><strong>推論手法:</strong> リアルタイムWebグラウンディング（外部検索ソース照合）</div>
            <div><strong>判定基準:</strong> 第一想起率、言及率、引用被リンク率の客観集計</div>
          </div>
          <div style={{ marginTop: "10px", fontSize: "0.72rem", color: "#64748b", lineHeight: 1.5, borderTop: "1px dashed #e2e8f0", paddingTop: "8px" }}>
            <strong>【コンプライアンスおよび法的適合性方針】</strong>
            本カルテにおける競合各社の情報は、AI（ChatGPT・Perplexity等）が実際に回答・引用した客観的観測ログ（事実）を社内分析用に集計したものです。他社に対する誹謗中傷や主観的批判は一切含まれておりません。また、インターネット上に公開される「AI公式推薦パス」上では他社の個別実名は完全に排除され、客観的な業態分類（大手チェーン・一般他社）のみで記載されます。
          </div>
        </div>
      </section>

      {/* 買い手がAIに聞く12問一覧 */}
      <section className="report-section shell">
        <div className="section-heading-simple">
          <p className="overline">買い手がAIに聞く質問</p>
          <h2>どの比較で、ライバルに流れているか。</h2>
          <p>お客様がAIに質問する場面ごとに、先に選ばれた会社と自社の状況を確認できます。</p>
        </div>
        <QuestionList result={result} />
      </section>

      {/* ライバル各社との比較グラフ */}
      <section className="report-section report-compare">
        <div className="shell">
          <div className="section-heading-simple">
            <p className="overline">ライバルとの比較</p>
            <h2>各社がおすすめされた回数を比べる。</h2>
            <p>今回のAI回答で、各社がおすすめ候補に入った割合を客観的に比較しています。</p>
          </div>
          <div className="compare-table">
            <div className="compare-table-head"><span>会社・商品名</span><span>選ばれた回答</span><span>割合</span></div>
            {result.competitors.slice(0, 6).map((competitor, index) => (
              <div className="compare-row" key={competitor.name}>
                <strong><i>{index + 1}</i>{competitor.name}</strong>
                <div className="compare-bar"><span style={{ width: `${Math.max(3, competitor.coverage)}%` }} /></div>
                <b>{competitor.recommendedCount} / {result.successfulObservations}</b>
              </div>
            ))}
            <div className="compare-row compare-own">
              <strong><i>{result.marketPosition || "—"}</i>{result.discovery.brandName}</strong>
              <div className="compare-bar"><span style={{ width: `${Math.max(3, result.recommendationCoverage)}%` }} /></div>
              <b>{result.ownRecommendationCount} / {result.successfulObservations}</b>
            </div>
          </div>
        </div>
      </section>

      {/* 診断詳細：直すべきポイントと引用元証拠 */}
      <section className="report-section shell report-evidence">
        <div className="section-heading-simple">
          <p className="overline">ホームページで直すべきポイント</p>
          <h2>自社サイトに補足したい情報。</h2>
          <p>ライバル各社の情報と比べ、自社のページに載せることでAIの信頼度が高まる情報を整理しました。</p>
        </div>
        <div className="evidence-layout">
          <div className="evidence-main">
            <h3>{primaryGap?.label || "選ぶ理由になる情報"}</h3>
            <p>{primaryGap?.whyItMatters || "この情報が明記されることで、AIが自信を持って推薦できるようになります。"}</p>
            {primaryGap?.competitorEvidence ? <p className="evidence-competitor">ライバル側で確認できた内容: {primaryGap.competitorEvidence}</p> : null}
          </div>
          <div className="citation-box">
            <h3>AIが参考にしたページ</h3>
            {primaryLoss?.citations.length ? (
              <ul>
                {primaryLoss.citations.slice(0, 5).map((citation) => (
                  <li key={citation.url}>
                    <a href={citation.url} target="_blank" rel="noreferrer"><QuoteIcon />{citation.title || citation.domain}<span>↗</span></a>
                  </li>
                ))}
              </ul>
            ) : <p>引用元ページはありません。</p>}
          </div>
        </div>
        <CitationMap result={result} />
      </section>

      {/* AI回答履歴（アコーディオン） */}
      {primaryLoss ? (
        <section className="report-section shell report-details">
          <details>
            <summary>AIの回答履歴と詳しい判定理由を確認する</summary>
            <div className="observation-list">
              {primaryLoss.observations.map((observation: Observation) => (
                <article key={observation.id}>
                  <button type="button" onClick={() => setOpenObservation(openObservation === observation.id ? "" : observation.id)} aria-expanded={openObservation === observation.id}>
                    <span>{providerLabel(observation.provider)}</span>
                    <strong>{observation.ownPosition ? `自社 ${observation.ownPosition}番目` : "自社は候補外"}</strong>
                    <em>回答 {observation.repetition}</em>
                    <ArrowIcon />
                  </button>
                  {openObservation === observation.id ? (
                    <div className="observation-body">
                      {observation.rawText ? <p>{observation.rawText}</p> : <p className="observation-safe-note">引用元情報のみ表示しています。</p>}
                      {observation.citations.length ? (
                        <ul>
                          {observation.citations.map((citation) => (
                            <li key={citation.url}><a href={citation.url} target="_blank" rel="noreferrer">{citation.title || citation.domain}</a></li>
                          ))}
                        </ul>
                      ) : null}
                    </div>
                  ) : null}
                </article>
              ))}
            </div>
          </details>
        </section>
      ) : null}
    </div>

    {/* ========================================================= */}
    {/* 【ステップ 2：解決アクション（AI公式推薦パスの配備）】 */}
    {/* ========================================================= */}
    <div id="step-2" style={{ background: "#f8fafc", padding: "48px 0", borderTop: "2px solid #e2e8f0", borderBottom: "2px solid #e2e8f0", margin: "40px 0" }}>
      <div className="shell">
        <div style={{ textAlign: "center", maxWidth: "720px", margin: "0 auto 36px" }}>
          <span className="step-badge">【ステップ 2】処方箋・即効アクション</span>
          <h2 style={{ fontSize: "1.8rem", margin: "12px 0 8px", color: "#0f172a" }}>
            自社サイト改修ゼロで、AI公式推薦パスを配備する
          </h2>
          <p style={{ color: "#475569", lineHeight: 1.6 }}>
            診断で判明した「ライバルが対応できない自社固有の強み（看板）」を選定し、主要AIが迷わず御社を優先推薦するための確定データをネット上に即日常駐させます。
          </p>
        </div>

        {/* 競合の隙間を突く看板選定 */}
        <PositioningPanel positioning={result.positioning} />

        {/* 配備実行カード（公認確定データ発行＆図解） */}
        <div style={{ marginTop: "24px" }}>
          <PublicProfileActions result={result} sample={sample} />
        </div>
      </div>
    </div>

    {/* ========================================================= */}
    {/* 【ステップ 3：推移を追跡する（定期見守りプラン ＆ 特別優待）】 */}
    {/* ========================================================= */}
    <div id="step-3">
      <section className="report-watch" id="watch-plan">
        <div className="shell report-watch-inner">
          <div>
            <span className="step-badge" style={{ marginBottom: "8px", display: "inline-block" }}>【ステップ 3】継続・品質維持</span>
            <p className="overline">定期モニタリング機能（14日間無料トライアル）</p>
            <h2>AIの推薦状況を、<br />毎週自動で追跡・チェック。</h2>
            <p>ChatGPTなどのAI回答は日々更新されます。自社がちゃんとお勧めされ続けているか、ライバルが割り込んできていないかを毎週自動で追跡調査します。</p>
            <ul style={{ margin: "16px 0", paddingLeft: "20px" }}>
              <li style={{ marginBottom: "6px" }}>月額 10,780円（税込） / 専任営業マン代わりとして</li>
              <li style={{ marginBottom: "6px" }}>いつでも管理画面からワンクリック解約可能・縛りなし</li>
              <li style={{ marginBottom: "6px" }}>最初の14日間は完全無料（クレジットカード登録不要）</li>
            </ul>
          </div>
          <form onSubmit={startWatch}>
            <label htmlFor="watch-email">ご連絡先メールアドレス（14日間無料トライアル）</label>
            <input id="watch-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.jp" />
            <button className="button button-primary" disabled={watchBusy}>{watchBusy ? "準備しています…" : "14日間無料で試してみる"}<ArrowIcon /></button>
            <small>リアルモックではメール入力不要です。そのままボタンを押してお試しいただけます。</small>
          </form>
        </div>
      </section>

      {/* ★ここに配置！価格提示の直後だからこそ自然に刺さる「特別優待（費用を抑えたい方へ）」 */}
      <section className="shell" style={{ margin: "32px auto" }}>
        <div className="viral-share-container" style={{ background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", borderRadius: "12px", padding: "28px 24px", color: "#ffffff", border: "1px solid #334155" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span style={{ fontSize: "0.72rem", fontWeight: 800, background: "#f59e0b", color: "#0f172a", padding: "2px 8px", borderRadius: "4px" }}>
              公式特別優待制度
            </span>
            <strong style={{ fontSize: "1.05rem", color: "#ffffff" }}>
              月額費用を抑えたい方へ。成果報告や仲間紹介で大幅割引
            </strong>
          </div>
          <p style={{ margin: "0 0 20px", fontSize: "0.82rem", color: "#94a3b8", lineHeight: 1.6 }}>
            AIXは営業マンを雇わずに、ユーザーの皆様の口コミと推薦実績で広がっています。以下のいずれかの方法で、定期見守りプランをお得に開始・継続いただけます。
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            {/* 特典1: Xで成果報告シェア（初月半額） */}
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "18px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
                  <strong style={{ fontSize: "0.95rem", color: "#38bdf8" }}>① X（旧Twitter）成果報告シェア割</strong>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#4ade80", background: "rgba(74,222,128,0.15)", padding: "2px 6px", borderRadius: "4px" }}>初月 50% OFF</span>
                </div>
                <p style={{ fontSize: "0.78rem", color: "#cbd5e1", lineHeight: 1.55, margin: "0 0 14px" }}>
                  「AI公式推薦パス」の認定状況をXでご報告いただくと、定期見守りプランの初月料金が半額（10,780円 ➔ 5,390円）になります。
                </p>
              </div>
              <button
                type="button"
                className="button button-primary"
                style={{ width: "100%", justifyContent: "center", background: "#0284c7" }}
                onClick={() => {
                  const tweetText = encodeURIComponent(`【AI推薦の公認データを配備完了】\nChatGPT・Perplexity等の主要生成AIにおいて、自社（${result.discovery.brandName}）が優先推薦されるための公式データを配備しました。\n\n自社サイト改修ゼロでAI営業窓口を整備できる「AIX」で診断できます。\n#AIX #生成AI #中小企業DX\n`);
                  const shareUrl = encodeURIComponent(`${typeof window !== "undefined" ? window.location.origin : "https://aix.jp"}/result?sample=1`);
                  if (typeof window !== "undefined") {
                    window.open(`https://twitter.com/intent/tweet?text=${tweetText}&url=${shareUrl}`, "_blank");
                    alert("Xでの成果報告ウィンドウを開きました！\n投稿完了後、定期見守りプランのお申し込み時に初月50%割引が自動適用されます。");
                  }
                }}
              >
                成果をXで報告して半額適用 <ArrowIcon />
              </button>
            </div>

            {/* 特典2: 経営者仲間へのご紹介（双方ずっと割引） */}
            <div style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "10px", padding: "18px 20px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "6px" }}>
                  <strong style={{ fontSize: "0.95rem", color: "#fbbf24" }}>② 経営者仲間・同業への紹介割</strong>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#facc15", background: "rgba(250,204,21,0.15)", padding: "2px 6px", borderRadius: "4px" }}>双方 ずっと割引</span>
                </div>
                <p style={{ fontSize: "0.78rem", color: "#cbd5e1", lineHeight: 1.55, margin: "0 0 14px" }}>
                  知り合いの社長や士業・店舗仲間に専用URLを共有し、仲間がAIXをご利用されると、双方の月額利用料が永年割引（毎月2,000円引き）となります。
                </p>
              </div>
              <button
                type="button"
                className="button button-secondary"
                style={{ width: "100%", justifyContent: "center", borderColor: "#64748b", color: "#ffffff" }}
                onClick={() => {
                  if (typeof window !== "undefined") {
                    const inviteUrl = `${window.location.origin}/?ref=${encodeURIComponent(result.discovery.brandName || "partner")}`;
                    void navigator.clipboard.writeText(inviteUrl);
                    alert(`仲間招待用のURLをコピーしました：\n${inviteUrl}\n\nこのリンクから知人経営者様が診断・ご利用されると、双方に永年紹介割引が自動適用されます。`);
                  }
                }}
              >
                仲間招待リンクをコピー
              </button>
            </div>
          </div>

          <small style={{ display: "block", marginTop: "14px", fontSize: "0.72rem", color: "#94a3b8", textAlign: "center" }}>
            ※不正利用（自己紹介・架空アカウント・クーポンの無断転載等）はStripeカード指紋照合およびシステム監査により自動検知・除外されます。
          </small>
        </div>
      </section>
    </div>

    {error ? <p className="floating-error" role="alert">{error}</p> : null}
    <SiteFooter />
  </main>;
}
