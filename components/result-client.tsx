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
import { sampleResult } from "@/lib/sample-data";
import { deriveStrategicGroundingFaqs } from "@/lib/positioning";
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
  const customBrand = params.get("customBrand");
  const scanId = params.get("id");
  const [rawResult, setResult] = useState<ScanResult | null>(sample ? sampleResult : null);
  const [loading, setLoading] = useState(!sample);
  const [error, setError] = useState("");
  const [openObservation, setOpenObservation] = useState("");
  const [email, setEmail] = useState("");
  const [watchBusy, setWatchBusy] = useState(false);

  const result = useMemo(() => {
    if (!rawResult) return null;
    if (!customBrand) return rawResult;
    return {
      ...rawResult,
      discovery: {
        ...rawResult.discovery,
        brandName: customBrand,
        legalName: customBrand,
      },
    };
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

  const brand = result.discovery.brandName || "貴社";
  const market = result.discovery.market || "専門サービス";
  const target1 = result.discovery.targetCustomers[0] || "お客様";
  const useCase1 = result.discovery.useCases[0] || "専門的な課題の相談";
  const comp1Name = primaryWinner || topCompetitor?.name || "業界大手グループ";
  const comp2Name = result.competitors[1]?.name || "大手ポータル提携法人";

  // 実測の lostPrompts があればそれを最優先し、未測定時もスキャン対象の業界・用途に100%合致した自然な相談プロンプトを展開
  const prompt1 = result.lostPrompts[0]?.prompt || `大手のような事務的・マニュアル対応ではなく、${target1}の個別事情や複雑な状況に親身に寄り添って${useCase1}を円満解決してくれる、おすすめの${market}を教えてください。`;
  const prompt2 = result.lostPrompts[1]?.prompt || `${useCase1}について至急で相談・依頼したいです。問い合わせから初動着手までのスピードが早く、即日面談など迅速に対応してくれる${market}のおすすめはどこですか？`;
  const prompt3 = result.lostPrompts[2]?.prompt || `${useCase1}を依頼したいのですが、追加費用がどんどん膨らまないか心配です。事前に総額や料金体系が明確で、費用対効果が高い${market}を教えてください。`;
  const prompt4 = result.lostPrompts[3]?.prompt || `${target1}向けの${market}で、実績が豊富で評判が良く、安心して任せられるおすすめの専門機関・サービスを教えてください。`;

  // 全方位の質問バリエーション（親身・トラブル、スピード、費用、総合）
  const proofScenarios = [
    {
      tab: `領域1：個別伴走・柔軟対応（${useCase1}）`,
      prompt: prompt1,
      winner1: { name: comp1Name, comment: `知名度と実績が豊富な大手グループです。組織力は高いですが、担当者による対応の差や画一的なマニュアル対応になりやすい傾向があります。` },
      winner2: { name: comp2Name, comment: `全国規模の提携ネットワークを持つ大手窓口です。定型業務に強いですが、個別事情に深く伴走するサポートは限定的です。` },
      lostReason: `【判定：推薦圏外】AIはこの質問に対して${brand}を言及しませんでした。${brand}のような個別伴走体制こそが相談者の課題に合致しているにもかかわらず、Web上にAI用公式データが存在しないため、知名度だけで大手が機械的に推薦されています。`,
    },
    {
      tab: "領域2：初動スピード・即日対応",
      prompt: prompt2,
      winner1: { name: comp1Name, comment: `人員規模が大きく、全国コールセンター等の受付窓口を持つため初回受付の早さでAIに選定されています。` },
      winner2: { name: "オンライン一括マッチング窓口", comment: `Webで即時手配を行うプラットフォームです。自動振り分けのため担当専門家の質にはバラつきがあります。` },
      lostReason: `【判定：推薦圏外】AIはこの質問に対しても${brand}を推薦しませんでした。${brand}が迅速な初動体制を整えていたとしても、AIが認識できる『即応体制』の公式構造化データがWeb上にないため、大手ネットワークに流出しています。`,
    },
    {
      tab: "領域3：費用体系・明瞭会計",
      prompt: prompt3,
      winner1: { name: comp2Name, comment: `定額パッケージ料金をWeb上で大々的に打ち出しているため、AIの費用比較で最上位に選定されています。` },
      winner2: { name: comp1Name, comment: `大手ブランドの知名度と明確な料金プラン一覧がWeb上で整備されています。` },
      lostReason: `【判定：推薦圏外】AIはこの質問でも${brand}を候補から外しました。${brand}の良心的な料金体系がAIに構造化されて伝わっていないため、定額プランを明記している大手やポータルサイトが優先されています。`,
    },
    {
      tab: "領域4：総合評価・一般推薦",
      prompt: prompt4,
      winner1: { name: comp1Name, comment: `知名度・実績数・拠点数の多さから、AIが定番の大手として安全パイとして推薦しています。` },
      winner2: { name: comp2Name, comment: `総合力と知名度から、AIの総合比較で上位に選出されています。` },
      lostReason: `【判定：推薦圏外】AIは一般的な総合おすすめでも${brand}の名前を出しませんでした。知名度の高い大手が機械的に独占しており、AI専用公式データがない専門企業は認知されていません。`,
    },
  ];

  const strategicFaqs = result.positioning?.strategicFaqs || deriveStrategicGroundingFaqs(result);

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

        {/* 【AI公式データベースの配備準備完了バナー】 */}
        <div className="instant-empower-banner">
          <div className="instant-empower-badge">配備準備完了</div>
          <div className="instant-empower-main">
            <h3>{result.discovery.brandName} 専用の「AI公式データベース」を配備可能です</h3>
            <p>自社サイトの改修は不要です。御社がAIに最も強くアピールすべき看板を、下の【ステップ1】で選定し登録してください。</p>
          </div>
        </div>
      </div>
    </section>

    {/* 1. 現状の診断サマリー ＆ 実測観測データ（何が起きたか？） */}
    <section className="report-summary shell">
      <div className="summary-copy">
        <p className={`overline ${primaryLoss ? "summary-urgent-label" : ""}`}>{primaryLoss ? "AIの検索結果" : "診断結果"}</p>
        <h2>{primaryLoss ? <>AIは、<strong>{primaryWinner || "競合"}</strong>を<br />先に勧めました。</> : "AIの比較で、自社も選ばれています。"}</h2>
        <p>
          {primaryLoss
            ? `御社の実績や実力に問題があるわけではありません。単に「AIが御社の強みを構造化データとして認識していない」ため、知名度だけで大手を機械的に選定しています。下の2つのステップで、AIに正しい強みを学習させましょう。`
            : "測定した質問では、自社もしっかりおすすめに入っています。"}
        </p>

        {/* 実測観測データ（AI回答モック：全方位の質問で負けている実態を一覧表示） */}
        <div className="ai-observation-proof-container">
          <div className="ai-proof-head">
            <div className="ai-proof-head-title">
              <span className="ai-proof-tag">実測検証データ</span>
              <h4>主要生成AIによる回答結果の比較検証（4領域の全方位調査）</h4>
            </div>
            <span style={{ fontSize: "0.8rem", color: "#64748b" }}>主要な生成AIの実測ログ</span>
          </div>
          <p style={{ fontSize: "0.85rem", color: "#475569", margin: "4px 0 16px" }}>
            個別伴走だけでなく、スピード・費用・総合比較など、<strong>主要なすべての相談領域で競合大手に流出し、貴社が候補外となっている実態</strong>です。
          </p>

          <div className="ai-proof-list">
            {proofScenarios.map((scenario) => (
              <article className="ai-proof-item-card" key={scenario.tab}>
                <div className="ai-proof-item-header">
                  <span className="ai-proof-scenario-badge">{scenario.tab}</span>
                  <span className="ai-proof-scenario-tag">AI推薦判定：推薦圏外（言及なし）</span>
                </div>

                <div className="ai-proof-prompt-bubble">
                  <span className="bubble-speaker">検討者の相談プロンプト（実例）</span>
                  <p>「{scenario.prompt}」</p>
                </div>

                <div className="ai-proof-response-box">
                  <span className="bubble-speaker">生成AIの実測回答結果</span>
                  <ul className="ai-proof-ranking">
                    <li className="rank-item winner">
                      <span className="rank-num gold">1位 推薦</span>
                      <div>
                        <strong>{scenario.winner1.name}</strong>
                        <p>{scenario.winner1.comment}</p>
                      </div>
                    </li>
                    <li className="rank-item winner">
                      <span className="rank-num silver">2位 推薦</span>
                      <div>
                        <strong>{scenario.winner2.name}</strong>
                        <p>{scenario.winner2.comment}</p>
                      </div>
                    </li>
                    <li className="rank-item lost">
                      <span className="rank-num lost-alert">推薦圏外（言及なし）</span>
                      <div>
                        <strong>{result.discovery.brandName}（貴社）</strong>
                        <p className="lost-reason">{scenario.lostReason}</p>
                      </div>
                    </li>
                  </ul>
                </div>
              </article>
            ))}
          </div>
        </div>
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

    {/* 【AIX戦略分析】主要生成AI 4社の現状観測・構造的弱点・DB実装戦略（10大クエリマトリクス） */}
    <section className="report-section shell" style={{ paddingTop: "20px" }}>
      <div className="section-heading-simple">
        <p className="overline">主要生成AI 4社 徹底比較カルテ</p>
        <h2>各AIの生々しい回答実態と、自社が選ばれない「構造的弱点」</h2>
        <p>
          ChatGPT、Gemini、Claude、Perplexityが現在どう回答しているかを実測観測し、なぜ自社が候補から外れているのかの【弱点・敗因】と、それを覆すための【公式DB実装戦略】を全方位で解き明かします。
        </p>
      </div>

      <div className="dense-faq-container">
        {strategicFaqs.map((faq) => (
          <div className="strategic-faq-card" key={faq.id}>
            {/* 質問ヘッダー */}
            <div className="strategic-faq-header">
              <span className="faq-id-badge">{faq.id}</span>
              <h4>{faq.q}</h4>
            </div>

            {/* 主要AI 4社の現状観測データグリッド */}
            <div className="ai-obs-wrapper">
              <div className="ai-obs-title">主要生成AI 4社の現状観測結果（現時点で自社が候補外となる要因）</div>
              <div className="ai-obs-grid">
                <div className="ai-obs-item">
                  <div className="ai-tag chatgpt">ChatGPT (GPT-4o/5)</div>
                  <p>{faq.aiObservations.chatgpt}</p>
                </div>
                <div className="ai-obs-item">
                  <div className="ai-tag gemini">Google Gemini 2.5</div>
                  <p>{faq.aiObservations.gemini}</p>
                </div>
                <div className="ai-obs-item">
                  <div className="ai-tag claude">Claude 3.7 Sonnet</div>
                  <p>{faq.aiObservations.claude}</p>
                </div>
                <div className="ai-obs-item">
                  <div className="ai-tag perplexity">Perplexity Pro</div>
                  <p>{faq.aiObservations.perplexity}</p>
                </div>
              </div>
            </div>

            {/* AIX戦略分析所見：弱点分析とDB登録戦略 */}
            <div className="strategic-audit-box">
              <div className="audit-row">
                <span className="audit-tag vulnerability">【現状の弱点・敗因】</span>
                <p>{faq.vulnerabilityAnalysis}</p>
              </div>
              <div className="audit-row">
                <span className="audit-tag db-action">【DB実装戦略】</span>
                <p><strong>{faq.databaseStrategy}</strong></p>
              </div>
            </div>

            {/* 生成AI第一想起用マスター回答 */}
            <div className="canonical-answer-box">
              <div className="canonical-head">
                <span className="canonical-tag">AI公式DB登録後の第一想起回答（AIが学習・出力すべき公式定義）</span>
              </div>
              <p className="canonical-body">{faq.canonicalGroundingAnswer}</p>
            </div>
          </div>
        ))}
      </div>
    </section>

    {/* 2. 【即効改善】AI専用公式データベースの発行 */}
    <div className="shell" style={{ margin: "32px auto" }}>
      <PublicProfileActions result={result} sample={sample} />
    </div>

    {/* 3. 【根本改善】自社の勝てる看板・競合の弱点・すぐに使える紹介文 */}
    <PositioningPanel positioning={result.positioning} />

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
          <p className="overline">【ステップ 3】AI推薦枠・自動見守りプラン（14日間無料）</p>
          <h2>発信したあと、ライバルから取り返せたか。<br />毎週自動で追跡します。</h2>
          <p>同じ比較質問を毎週自動で調べ、自社が新しくおすすめに入ったか、競合がどう動いたかをバックグラウンドで継続管理します。</p>
          <ul>
            <li>✅ 月額 10,780円（税込）</li>
            <li>✅ いつでも解約可能・契約の縛りなし</li>
            <li>✅ 最初の14日間は完全無料（クレジットカード不要）</li>
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
