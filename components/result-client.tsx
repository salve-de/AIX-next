"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ArrowIcon, QuoteIcon } from "@/components/icons";
import { CitationMap } from "@/components/citation-map";
import { QuestionList } from "@/components/question-list";
import { ReportActions } from "@/components/report-actions";
import { PositioningPanel } from "@/components/positioning-panel";
import { PublicProfileActions } from "@/components/public-profile-actions";
import { sampleResult } from "@/lib/sample-data";
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
  const sample = params.get("sample") === "1";
  const scanId = params.get("id");
  const [result, setResult] = useState<ScanResult | null>(sample ? sampleResult : null);
  const [loading, setLoading] = useState(!sample);
  const [error, setError] = useState("");
  const [openObservation, setOpenObservation] = useState("");
  const [email, setEmail] = useState("");
  const [watchBusy, setWatchBusy] = useState(false);

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
    <section className="report-header">
      <div className="shell">
        <div className="report-header-top">
          <div>
            <p className="overline">AI推薦・競合分析カルテ</p>
            <h1>{result.discovery.brandName}</h1>
            <p className="report-host">{host}</p>
          </div>
          <span className={sample ? "sample-badge" : "report-date"}>{sample ? "架空データの見本" : formatDate(result.measuredAt)}</span>
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
        {sample ? <p className="sample-note">画面の使い方を見るためのサンプルです。実在の診断結果ではありません。</p> : null}
        {!sample ? displayWarnings.map((warning) => <p className="report-warning" key={warning}>{warning}</p>) : null}
      </div>
    </section>

    {/* 1. 現状の診断サマリー */}
    <section className="report-summary shell">
      <div className="summary-copy">
        <p className={`overline ${primaryLoss ? "summary-urgent-label" : ""}`}>{primaryLoss ? "AI推薦のいまの状況" : "診断結果"}</p>
        <h2>{primaryLoss ? <>AIは、<strong>{primaryWinner || "競合"}</strong>を<br />先に勧めました。</> : "AIの比較で、自社も選ばれています。"}</h2>
        {primaryLoss ? <p className="summary-question">「{primaryLoss.prompt}」</p> : null}
        <p>
          {primaryLoss
            ? `競合大手は全国的な認知量で先行していますが、貴社が長年培ってきた専門性や親身な対応自体に問題はありません。下の戦略提言から貴社の強みに合致するポジショニングを選択し、AI専用データベースに学習させましょう。`
            : "測定した質問では、自社もしっかりおすすめに入っています。"}
        </p>
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

    {/* 2. 【最優先】自社の勝てる看板・競合の弱点・すぐに使える紹介文（ファーストビュー直下） */}
    <PositioningPanel positioning={result.positioning} />

    {/* 3. 【即時発行特典】自社サイト改修ゼロでOK！ChatGPT専用のAI公式データベース */}
    <div className="shell" style={{ margin: "32px auto" }}>
      <PublicProfileActions result={result} sample={sample} />
    </div>

    {/* 4. 顧客が比較する具体的な質問一覧 */}
    <section className="report-section shell">
      <div className="section-heading-simple">
        <p className="overline">買い手がAIに聞く質問</p>
        <h2>どの比較で、ライバルに流れているか。</h2>
        <p>お客様がAIに質問する場面ごとに、先に選ばれた会社と自社の状況を確認できます。</p>
      </div>
      <QuestionList result={result} />
    </section>

    {/* 4. ライバル各社との比較 */}
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

    {/* 5. 毎週の自動見守り（継続モニタリング） */}
    <section className="report-watch" id="watch-plan">
      <div className="shell report-watch-inner">
        <div>
          <p className="overline">継続的AI最適化プログラム</p>
          <h2>AI検索市場の変動に合わせ、<br />貴社の推薦ポジションを継続管理します。</h2>
          <p>毎週の競合動向を定点観測し、発行されたAI専用公式データベースの構造化データを最新状態へ自動更新。社内工数をかけることなく、AIからの第一想起ポジションを維持します。</p>
          <ul>
            <li>月額 10,780円（税込 / 税別 ¥9,800）</li>
            <li>契約期間の縛りなし・いつでも管理画面から即時停止可能</li>
            <li>最初14日間は全機能を無料でお試しいただけます</li>
          </ul>
        </div>
        <form onSubmit={startWatch}>
          <label htmlFor="watch-email">ご連絡先メールアドレス（14日間無料トライアル）</label>
          <input id="watch-email" type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@company.jp" />
          <button className="button button-primary" disabled={watchBusy}>{watchBusy ? "準備しています…" : "14日間無料で試してみる"}<ArrowIcon /></button>
          <small>見本画面では入力不要です。そのままお試しいただけます。</small>
        </form>
      </div>
    </section>

    {/* 6. 詳細データ・参考情報（必要な方向け） */}
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

    {/* 7. 詳細な回答履歴（アコーディオン） */}
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

    {error ? <p className="floating-error" role="alert">{error}</p> : null}
    <SiteFooter />
  </main>;
}
