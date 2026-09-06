"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowIcon, EvidenceIcon, TrendIcon } from "@/components/icons";

export function HeroChatDiagnosticCard() {
  return (
    <div className="hero-chat-split-container" aria-label="AIでの推薦ビフォーアフター比較">
      {/* 共通の起点：見込み客による相談例 */}
      <div className="split-user-prompt-box">
        <div className="split-prompt-header">
          <span className="split-prompt-dot" aria-hidden="true" />
          <span className="split-prompt-label">見込み客によるAIへの相談例</span>
        </div>
        <p className="split-prompt-text">
          「大手が断るような急ぎの小ロット試作、親身に対応してくれる町工場はある？」
        </p>
      </div>

      {/* 左右対比グリッド（隙間なくピタッと並べて一瞬で比較可能に） */}
      <div className="split-comparison-grid">
        
        {/* 左：【BEFORE】対策前（他社のみ推薦・自社除外） */}
        <div className="split-card card-before">
          <div className="split-card-header header-before">
            <span className="split-status-badge tag-lost">対策前（現状）</span>
            <span className="split-outcome-label outcome-lost">他社のみ推薦（自社除外）</span>
          </div>
          <div className="split-card-body">
            <div className="ai-speaker-bar">
              <span className="ai-name">AIの回答</span>
              <span className="ai-status">大手優先</span>
            </div>
            <p className="ai-dialogue-text">
              「東京都内でしたら、大手量産メーカーの〇〇社や、広告で知名度の高い〇〇社が候補になります。」
            </p>
            <div className="split-cause-box cause-lost">
              <strong>【結果】</strong> 自社データがないため、AIは知名度のある大手を推薦。御社は候補から除外されます。
            </div>
          </div>
        </div>

        {/* 右：【AFTER】公式データ配備後（御社が推薦候補に浮上） */}
        <div className="split-card card-after">
          <div className="split-card-header header-after">
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="split-status-badge tag-won">公式データ配備後</span>
              <span className="after-arrow-indicator" aria-hidden="true">➔</span>
            </div>
            <span className="split-outcome-label outcome-won">御社が推薦候補に浮上</span>
          </div>
          <div className="split-card-body">
            <div className="ai-speaker-bar">
              <span className="ai-name">AIの回答</span>
              <span className="ai-status status-won">強みに合致して選定</span>
            </div>
            <p className="ai-dialogue-text ai-dialogue-won">
              「1点からの特急試作なら、<strong>御社（山田板金製作所）</strong>が適しています。最短即日対応と個別特注を強みとしています。」
            </p>
            <div className="split-cause-box cause-won">
              <strong>【結果】</strong> AIが御社の公式強みデータを直接参照し、相談内容に合致する推薦候補として御社が提示されるようになります。
            </div>
          </div>
        </div>

      </div>

      {/* カード下部の安心注記 */}
      <div className="split-footer-bar">
        <span>※ ホームページの改修・新たな開設は不要（所要10秒）</span>
        <span className="split-footer-tag">ChatGPT / Google Gemini / Perplexity / Claude / Copilot 対応</span>
      </div>
    </div>
  );
}

export function ChatGptComparisonVisual() {
  const [tab, setTab] = useState<"service" | "mfg" | "brand">("service");

  return <div className="chatgpt-compare-container" aria-label="ChatGPTでの推薦ビフォーアフター">
    <div className="chatgpt-tab-bar">
      <button type="button" className={`chatgpt-tab ${tab === "service" ? "active" : ""}`} onClick={() => setTab("service")}>
        専門サービス・士業・工務店
      </button>
      <button type="button" className={`chatgpt-tab ${tab === "mfg" ? "active" : ""}`} onClick={() => setTab("mfg")}>
        中小製造・B2B受託・専門加工
      </button>
      <button type="button" className={`chatgpt-tab ${tab === "brand" ? "active" : ""}`} onClick={() => setTab("brand")}>
        自社商品・地域ブランド・特産品
      </button>
    </div>

    <div className="chatgpt-mock-grid">
      {/* 左：情報未整備の場合（AIに推薦されない） */}
      <div className="chatgpt-mock-card mock-lost">
        <div className="mock-badge badge-lost">情報未登録の場合（競合が優先推薦）</div>
        <div className="mock-chat-bubble user-bubble">
          <span className="bubble-role">買い手（見込み客）</span>
          <p>{tab === "service" 
            ? "「相続の相談、大手に聞いたら事務的で合わなかった。親身に対応してくれる事務所は？」" 
            : tab === "mfg" 
            ? "「特殊部品の小ロット試作、他社で断られた。短納期で相談できる工場ある？」" 
            : "「大切な方への特別なギフト、量産品ではなく本物のこだわりが伝わる逸品は？」"
          }</p>
        </div>
        <div className="mock-chat-bubble ai-bubble">
          <span className="bubble-role">ChatGPT</span>
          <p>{tab === "service" 
            ? "一般的な大手法律グループや、比較ポータルサイトの一覧がおすすめです。" 
            : tab === "mfg" 
            ? "一般的な大手総合部品メーカーやカタログ通販をご検討ください。" 
            : "有名百貨店のギフトコーナーや大手通販のランキングがおすすめです。"
          }</p>
          <div className="mock-verdict verdict-lost">
            <span>自社の情報がAIに伝わっていない状態</span>
            <small>大手チェーンやポータル掲載企業が優先して回答されます</small>
          </div>
        </div>
      </div>

      {/* 右：公式情報台帳を開設した場合（強みに合致して推薦） */}
      <div className="chatgpt-mock-card mock-won">
        <div className="mock-badge badge-won">公式情報台帳を開設した場合（強みで推薦）</div>
        <div className="mock-chat-bubble user-bubble">
          <span className="bubble-role">買い手（見込み客）</span>
          <p>{tab === "service" 
            ? "「相続の相談、大手に聞いたら事務的で合わなかった。親身に対応してくれる事務所は？」" 
            : tab === "mfg" 
            ? "「特殊部品の小ロット試作、他社で断られた。短納期で相談できる工場ある？」" 
            : "「大切な方への特別なギフト、量産品ではなく本物のこだわりが伝わる逸品は？」"
          }</p>
        </div>
        <div className="mock-chat-bubble ai-bubble ai-bubble-highlight">
          <span className="bubble-role">ChatGPT</span>
          <p>{tab === "service" 
            ? <>個別の事情に寄り添う親身な相談なら、<strong>【〇〇事務所】が適しています。</strong> 大手が対応しづらい柔軟な個別対応を公式に掲げています。</>
            : tab === "mfg" 
            ? <>1点からの特急対応なら、<strong>【〇〇製作所】が候補に挙がります。</strong> 大手が断る複雑形状や短納期に対応する体制を整えています。</>
            : <>本物の鮮度と品質にこだわるなら、<strong>【〇〇ブランド】が適しています。</strong> 生産者直売の確かな仕様が確認できます。</>
          }</p>
          <div className="mock-verdict verdict-won">
            <span>自社の強みに合致した質問で推薦候補に入りやすくなる</span>
            <small>公式スペックに基づき、比較検討時に自社が候補に入りやすくなります</small>
          </div>
        </div>
      </div>
    </div>
  </div>;
}

export function ProductOutputPreview() {
  return (
    <div className="deliverables-dual-grid" aria-label="手に入る2つの成果物実物見本">
      {/* ============================================================= */}
      {/* 成果物 01：自社専用 AI診断レポート（10秒で即時発行） */}
      {/* ============================================================= */}
      <div className="deliverable-showcase-card card-report">
        {/* カードヘッダー */}
        <div className="deliv-card-head">
          <div className="deliv-badge-row">
            <span className="deliv-step-badge badge-blue">手に入るもの 01</span>
            <span className="deliv-speed-badge">10秒で即時発行・無料</span>
          </div>
          <h4 className="deliv-card-title">自社専用 AI診断レポート</h4>
          <p className="deliv-card-desc">
            社名を入力するだけ。ChatGPTやGeminiが見込み客の相談にどう答えているかを12問で徹底検証。
          </p>
        </div>

        {/* カード本体：実物プレビューモック */}
        <div className="deliv-card-body">
          {/* 検証結果アラート */}
          <div className="deliv-metric-strip strip-danger">
            <span className="deliv-metric-label">12問の実地検証結果（見本例：あおば相続法務事務所）</span>
            <strong className="deliv-metric-value">12問中 10問で大手チェーンが優先推薦（自社は選定外）</strong>
          </div>

          {/* 実際のAI相談プレビュー */}
          <div className="deliv-mock-card">
            <span className="deliv-mock-label">見込み客がAIにする相談の例</span>
            <div className="deliv-mock-query">
              「親族間の複雑な事情に、親身に寄り添ってくれる専門窓口は？」
            </div>
            <div className="deliv-mock-result-box">
              <div className="deliv-mock-row">
                <span className="deliv-tag-ai">AIの回答</span>
                <span className="deliv-text-loss">大手全国展開グループを優先推薦（御社はデータ不足により選定外）</span>
              </div>
            </div>
          </div>

          {/* レポートに含まれる内容 */}
          <div className="deliv-features-list">
            <span className="deliv-features-heading">レポートで判明する3大分析</span>
            <ul className="deliv-check-items">
              <li>主要5大AI（ChatGPT / Gemini / Perplexity等）の回答状況</li>
              <li>大手チェーンへ奪われている推薦客の損失分析</li>
              <li>AIに選ばれるための自社専用の改善方針</li>
            </ul>
          </div>
        </div>

        {/* カードフッター */}
        <div className="deliv-card-foot">
          <Link href="/result?sample=1" className="deliv-action-btn btn-navy">
            <span>診断レポートの実例を見る</span>
            <ArrowIcon />
          </Link>
          <div className="deliv-guarantee-note">
            ✓ 社名入力で10秒 • ✓ 完全無料 • ✓ 登録不要
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* 成果物 02：自社専用 AI公式推薦データ（即日開設） */}
      {/* ============================================================= */}
      <div className="deliverable-showcase-card card-data">
        {/* カードヘッダー */}
        <div className="deliv-card-head">
          <div className="deliv-badge-row">
            <span className="deliv-step-badge badge-green">手に入るもの 02</span>
            <span className="deliv-speed-badge">即日配備・作業ゼロ</span>
          </div>
          <h4 className="deliv-card-title">自社専用 AI公式推薦データ</h4>
          <p className="deliv-card-desc">
            今のホームページはいじらず、AI探索ロボットが最も読みやすい形式で御社の強みをネット上に自動公開。
          </p>
        </div>

        {/* カード本体：実物プレビューモック */}
        <div className="deliv-card-body">
          {/* 配備ステータス */}
          <div className="deliv-metric-strip strip-active">
            <span className="deliv-metric-label">配備ステータス</span>
            <strong className="deliv-metric-value">ネット上に常時公開中（主要AIが常時自動参照）</strong>
          </div>

          {/* AIが読み込む御社の確定データ */}
          <div className="deliv-mock-card">
            <span className="deliv-mock-label">AIが参照する御社の確定仕様（例）</span>
            <div className="deliv-specs-grid">
              <div className="deliv-spec-item">
                <span className="spec-key">屋号・企業名</span>
                <span className="spec-val">あおば相続法務事務所</span>
              </div>
              <div className="deliv-spec-item">
                <span className="spec-key">AI向け公式データ</span>
                <span className="spec-val">親身な個別対応・複雑トラブル専門・最短即日着手</span>
              </div>
              <div className="deliv-spec-item">
                <span className="spec-key">安心の裏付け</span>
                <span className="spec-val">国家資格・実務実績・相談実績などの公的データ</span>
              </div>
              <div className="deliv-spec-item">
                <span className="spec-key">常時参照するAI</span>
                <span className="spec-val">ChatGPT • Google Gemini • Perplexity • Claude • Copilot</span>
              </div>
            </div>
          </div>

          {/* 配備によって得られる効果 */}
          <div className="deliv-features-list">
            <span className="deliv-features-heading">配備によって得られる3大成果</span>
            <ul className="deliv-check-items">
              <li>今の自社ホームページの改修・開設作業は一切不要</li>
              <li>AI探索ロボットが御社の強みを正しく認識・インデックス</li>
              <li>相談内容に合致した有力候補としてAI推薦枠へ堂々参入</li>
            </ul>
          </div>
        </div>

        {/* カードフッター */}
        <div className="deliv-card-foot">
          <Link href="/ai/company/aoba-souzoku?sample=1" className="deliv-action-btn btn-green">
            <span>公式推薦データの実例を見る</span>
            <ArrowIcon />
          </Link>
          <div className="deliv-guarantee-note">
            ✓ HP改修不要 • ✓ 1文字も作業なし • ✓ 全自動運用
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductProcessVisual() {
  const steps = [
    {
      label: "01",
      userTime: "所要 10秒",
      userAction: "会社名を入力",
      title: "社名を入れるだけ",
      systemAction: "AIが公開サイトや取引実績を瞬時に読み込み、御社の強みを自動整理します。",
      tag: "社長の作業",
      tagSystem: "裏側の自動処理",
    },
    {
      label: "02",
      userTime: "所要 0秒",
      userAction: "診断レポートを確認",
      title: "AI推薦の現状がわかる",
      systemAction: "客がAIにする12の質問で、競合との推薦状況の違いを客観的に可視化します。",
      tag: "社長の作業",
      tagSystem: "裏側の自動処理",
    },
    {
      label: "03",
      userTime: "所要 1クリック",
      userAction: "自社の強みを選択",
      title: "AI推薦データを配備",
      systemAction: "今のホームページはそのままで、選んだ強みをもとにAI向け公式推薦データをネット上に自動開設。",
      tag: "社長の作業",
      tagSystem: "裏側の自動処理",
    },
    {
      label: "04",
      userTime: "作業ゼロ（完全放置）",
      userAction: "本業に専念するだけ",
      title: "毎週のAI回答を自動見守り",
      systemAction: "AIのおすすめ状況や競合の動向を毎週自動チェック。社長は普段どおり本業に集中するだけ。",
      tag: "社長の作業",
      tagSystem: "裏側の自動処理",
    },
  ];

  return (
    <div className="process-visual-enhanced">
      <div className="process-visual-grid">
        {steps.map((step) => (
          <div key={step.label} className="process-card">
            <div className="process-card-header">
              <span className="process-step-num">{step.label}</span>
              <span className="process-user-time">{step.userTime}</span>
            </div>
            <h3 className="process-card-title">{step.title}</h3>
            
            <div className="process-block-user">
              <span className="process-block-tag user-tag">{step.tag}</span>
              <p className="process-block-text">{step.userAction}</p>
            </div>

            <div className="process-block-system">
              <span className="process-block-tag system-tag">{step.tagSystem}</span>
              <p className="process-block-text">{step.systemAction}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function WatchTrendVisual() {
  return <figure className="watch-demo-window" aria-label="AI推薦の定期追跡レポート例">
    <header><strong>AI推薦の推移レポート</strong><span>毎週の自動観測</span></header>
    <div className="watch-demo-rank"><small>自社が推薦された質問数</small><strong><span>2件</span><ArrowIcon /><b>4件</b></strong><p>同じ比較質問を毎週自動で再チェック</p></div>
    <div className="watch-demo-rows"><div><span>自社がおすすめに入った質問</span><strong>2件　→　4件</strong></div><div><span>まだ競合が優先された質問</span><strong>10件　→　8件</strong></div><div><span>AIに新しく参照されたデータ</span><strong>+3件</strong></div></div>
    <footer><TrendIcon /><span><small>推薦枠の獲得</small><strong>新たに2つの質問で、自社がおすすめ枠に入りました</strong></span></footer>
  </figure>;
}
