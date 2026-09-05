"use client";

import { useState } from "react";
import { ArrowIcon, EvidenceIcon, TrendIcon } from "@/components/icons";

export function HeroChatDiagnosticCard() {
  return (
    <div className="hero-chat-direct-card" aria-label="ChatGPTによる推薦の実際のイメージ">
      {/* カードヘッダー */}
      <div className="direct-card-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 20px", background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
          <strong style={{ fontSize: "0.8rem", color: "#0f172a", fontFamily: "var(--font-mono, monospace)", letterSpacing: "-0.01em" }}>ChatGPT (GPT-4o)</strong>
        </div>
        <span style={{ fontSize: "0.72rem", color: "#64748b", background: "#ffffff", border: "1px solid #e2e8f0", padding: "2px 8px", borderRadius: "4px", fontWeight: 500 }}>
          AI推薦 観測ログ
        </span>
      </div>

      {/* チャット対話エリア */}
      <div className="direct-card-body" style={{ padding: "24px 20px", display: "flex", flexDirection: "column", gap: "18px", background: "#ffffff" }}>
        
        {/* 見込み客の相談 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
          <span style={{ fontSize: "0.7rem", color: "#94a3b8", paddingRight: "4px" }}>見込み客のAI相談</span>
          <div style={{ background: "#f1f5f9", borderRadius: "14px 14px 3px 14px", padding: "12px 16px", maxWidth: "88%", color: "#0f172a", fontSize: "0.88rem", lineHeight: 1.55 }}>
            東京都内で、大手が断るような短納期・小ロット試作に対応できる会社はある？
          </div>
        </div>

        {/* ChatGPTの推薦回答 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: "6px" }}>
          <span style={{ fontSize: "0.7rem", color: "#64748b", paddingLeft: "4px", display: "flex", alignItems: "center", gap: "6px" }}>
            <span>ChatGPTの回答</span>
            <span style={{ background: "#f0fdf4", color: "#16a34a", border: "1px solid #bbf7d0", padding: "1px 6px", borderRadius: "3px", fontSize: "0.65rem", fontWeight: 600 }}>公式台帳を引用</span>
          </span>
          <div style={{ background: "#ffffff", border: "1.5px solid #0f172a", borderRadius: "14px 14px 14px 3px", padding: "16px 18px", maxWidth: "96%", color: "#0f172a", boxShadow: "0 4px 12px rgba(15, 23, 42, 0.03)" }}>
            <p style={{ margin: "0 0 10px", fontSize: "0.92rem", lineHeight: 1.6, fontWeight: 500 }}>
              大手が対応しづらい特急試作なら、<strong>【御社（大田区）】</strong>が最も適しています。
            </p>
            <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "10px 12px", fontSize: "0.78rem", color: "#475569", lineHeight: 1.55 }}>
              <span style={{ color: "#0f172a", fontWeight: 700 }}>AIが推薦した確定根拠:</span><br />
              単品1個から即時対応可能 · 最短当日見積もり · 3D CADデータ直接入稿受付中
            </div>
          </div>
        </div>

      </div>

      {/* フッター */}
      <div style={{ padding: "12px 20px", background: "#f8fafc", borderTop: "1px solid #e2e8f0", fontSize: "0.75rem", color: "#64748b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>社名入力だけで、上記のようにAIが優先推薦する公式台帳を自動配備します</span>
        <span style={{ fontWeight: 700, color: "#0f172a" }}>改修ゼロ</span>
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
  return <figure className="demo-window" aria-label="AIX診断結果のサンプル">
    <header className="demo-window-bar"><span className="window-dots"><i /><i /><i /></span><strong>AI推薦・診断カルテ</strong><small>診断結果の例</small></header>
    <div className="demo-window-toolbar"><div><small>対象</small><strong>あおば相続法務事務所</strong></div><span>買い手の比較質問を12件確認</span></div>
    <div className="demo-outcome"><div><small>AIの候補に入った質問</small><strong>12問中 <b>2問</b></strong><span>ライバルが優先された質問を特定</span></div><p>AIは「あおば相続法務事務所」より先に「大手全国展開グループ」を勧めました。どの相談で選ばれなかったか、理由と改善方針を示します。</p></div>
    <div className="demo-metrics"><div><small>自社が候補に入った質問</small><strong>2 / 12</strong></div><div><small>先に選ばれた競合</small><strong>大手グループ <em>8 / 12</em></strong></div><div className="demo-negative"><small>推薦を獲得できる余地</small><strong>10 / 12</strong></div></div>
      <div className="demo-result-grid"><div className="demo-question"><small>見込み客がAIに聞いた相談質問</small><h3>「親族間の複雑な事情に、親身に寄り添ってくれる専門窓口は？」</h3><div className="demo-winner-row"><span>先に選ばれた競合<strong>大手全国展開グループ</strong></span><span>自社<strong className="demo-lost">候補外</strong></span></div><p>大手は知名度と広告量で先行。あおば相続法務事務所の個別伴走実績がAIに構造化されて伝わっていませんでした。</p></div><div className="demo-next"><div><EvidenceIcon /><span><small>競合が選ばれた理由</small><strong>知名度による機械的選定</strong></span></div><div><TrendIcon /><span><small>推薦枠獲得への改善策</small><strong>「親身な個別伴走」を公式DBに登録</strong></span><ArrowIcon /></div></div></div>
  </figure>;
}

export function ProductProcessVisual() {
  const steps = [
    {
      label: "01",
      userTime: "所要 10秒",
      userAction: "会社名・URLを入力",
      title: "社名を入れるだけ",
      systemAction: "AIが公開サイト・SNS・実績を瞬時に読み込み、自社の確定スペックを自動整理します。",
      tag: "社長の作業",
      tagSystem: "裏側の自動処理",
    },
    {
      label: "02",
      userTime: "所要 0秒",
      userAction: "診断カルテを確認",
      title: "AI推薦の現状を可視化",
      systemAction: "ChatGPT等の主要AIで「買い手の相談12問」を検証し、ライバルが選ばれている理由を特定。",
      tag: "社長の作業",
      tagSystem: "裏側の自動処理",
    },
    {
      label: "03",
      userTime: "所要 1クリック",
      userAction: "自社の強みを選択",
      title: "AI公式台帳を即日配備",
      systemAction: "自社サイト改修ゼロ。選んだ看板をもとに、AI専用の公式台帳（JSON/MD）を自動生成。",
      tag: "社長の作業",
      tagSystem: "裏側の自動処理",
    },
    {
      label: "04",
      userTime: "作業ゼロ（完全放置）",
      userAction: "本業に専念するだけ",
      title: "毎週の推薦を自動見守り",
      systemAction: "AI回答の更新やライバルの動向を毎週自動追跡。推薦状況の変化を自動で監視します。",
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
