"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowIcon, EvidenceIcon, TrendIcon } from "@/components/icons";

export function HeroChatDiagnosticCard() {
  return (
    <div className="hero-chat-direct-card" aria-label="ChatGPTでの推薦実況シミュレーション">
      {/* カードヘッダー */}
      <div
        className="direct-card-head"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 18px",
          background: "#f8fafc",
          borderBottom: "1px solid #e2e8f0",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#0f172a", display: "inline-block" }} />
          <strong style={{ fontSize: "0.8rem", color: "#0f172a", fontFamily: "var(--font-mono, monospace)", letterSpacing: "-0.01em" }}>
            ChatGPT (GPT-4o) での実況シミュレーション
          </strong>
        </div>
        <span style={{ fontSize: "0.7rem", color: "#64748b", background: "#ffffff", border: "1px solid #e2e8f0", padding: "2px 8px", borderRadius: "4px", fontWeight: 600 }}>
          回答観測
        </span>
      </div>

      {/* チャット対話エリア */}
      <div className="direct-card-body" style={{ padding: "18px", display: "flex", flexDirection: "column", gap: "14px", background: "#ffffff" }}>
        
        {/* 見込み客の相談 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
          <span style={{ fontSize: "0.68rem", color: "#64748b", fontFamily: "var(--font-mono, monospace)", paddingRight: "4px" }}>客がAIにした相談</span>
          <div style={{ background: "#f8fafc", border: "1px solid #cbd5e1", borderRadius: "12px 12px 2px 12px", padding: "10px 14px", maxWidth: "92%", color: "#0f172a", fontSize: "0.85rem", lineHeight: 1.5, fontWeight: 500 }}>
            「大手が断るような急ぎの小ロット試作、親身に対応してくれる町工場はある？」
          </div>
        </div>

        {/* ❌ 対策前：大手に客を奪われる現実 */}
        <div style={{ border: "1px solid #fecaca", borderRadius: "8px", padding: "12px 14px", background: "#fffbfb" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#991b1b", background: "#fee2e2", padding: "2px 8px", borderRadius: "3px" }}>
              ❌ いまの現実（対策前）
            </span>
            <span style={{ fontSize: "0.68rem", color: "#b91c1c", fontWeight: 700 }}>自社は完全にスルー</span>
          </div>
          <p style={{ margin: "0 0 8px", fontSize: "0.82rem", color: "#475569", lineHeight: 1.55 }}>
            ChatGPT「東京都内でしたら、大手量産メーカーの〇〇社や、ネット広告で有名な〇〇社が候補になります。」
          </p>
          <div style={{ fontSize: "0.72rem", color: "#991b1b", background: "#ffffff", border: "1px solid #fecaca", padding: "6px 10px", borderRadius: "4px", lineHeight: 1.5 }}>
            ⚠️ 御社の良さを知らないAIは、知名度や広告量の多い大手ばかり紹介します。
          </div>
        </div>

        {/* ⭕️ 配備後：自社が名指しでおすすめされる未来 */}
        <div style={{ border: "1.5px solid #0f172a", borderRadius: "8px", padding: "12px 14px", background: "#f8fafc", boxShadow: "0 2px 8px rgba(15, 23, 42, 0.05)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
            <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#ffffff", background: "#0f172a", padding: "2px 8px", borderRadius: "3px" }}>
              ⭕️ 専用看板をネットに置いた後
            </span>
            <span style={{ fontSize: "0.68rem", color: "#0f172a", fontWeight: 700 }}>自社を名指し推薦</span>
          </div>
          <p style={{ margin: "0 0 8px", fontSize: "0.84rem", color: "#0f172a", fontWeight: 600, lineHeight: 1.55 }}>
            ChatGPT「1点からの特急試作なら、<strong>御社（山田板金製作所）</strong>が適しています。最短即日対応と個別特注を強みとしています。」
          </p>
          <div style={{ fontSize: "0.72rem", color: "#0f172a", background: "#ffffff", border: "1px solid #cbd5e1", padding: "6px 10px", borderRadius: "4px", lineHeight: 1.5 }}>
            ✅ AIが御社の本当の強みを理解し、客にピンポイントで指名推薦します。
          </div>
        </div>

      </div>

      {/* カードフッター */}
      <div style={{ padding: "10px 18px", background: "#f8fafc", borderTop: "1px solid #e2e8f0", fontSize: "0.74rem", color: "#64748b", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>今のホームページはそのままでOK</span>
        <span style={{ fontWeight: 700, color: "#0f172a" }}>所要10秒で無料診断</span>
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
    <figure
      className="deliverable-card-preview"
      style={{
        margin: 0,
        background: "#ffffff",
        border: "1px solid #cbd5e1",
        borderRadius: "8px",
        boxShadow: "0 2px 12px rgba(15, 23, 42, 0.05)",
        overflow: "hidden",
      }}
      aria-label="手に入るもの 01：AI推薦診断レポートの見本"
    >
      {/* 成果物ラベルヘッダー */}
      <div
        style={{
          background: "#0f172a",
          color: "#ffffff",
          padding: "12px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "8px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span
            style={{
              background: "#1e293b",
              border: "1px solid #475569",
              color: "#ffffff",
              fontSize: "0.68rem",
              fontWeight: 700,
              padding: "2px 7px",
              borderRadius: "3px",
              fontFamily: "var(--font-mono, monospace)",
              letterSpacing: "0.05em",
            }}
          >
            手に入るもの 01
          </span>
          <strong style={{ fontSize: "0.88rem", letterSpacing: "-0.01em" }}>
            自社専用 AI推薦診断レポート（10秒で即時発行）
          </strong>
        </div>
        <span style={{ fontSize: "0.7rem", color: "#94a3b8" }}>
          ※ 社名入力後、約10秒で画面に届く実況レポートです
        </span>
      </div>

      {/* 対象企業と診断サマリー */}
      <div
        style={{
          padding: "18px 22px",
          borderBottom: "1px solid #e2e8f0",
          background: "#f8fafc",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "14px",
        }}
      >
        <div>
          <span style={{ display: "block", fontSize: "0.7rem", color: "#64748b", fontFamily: "var(--font-mono, monospace)", marginBottom: "2px" }}>
            診断対象（見本例）
          </span>
          <strong style={{ fontSize: "1.15rem", color: "#0f172a", letterSpacing: "-0.02em" }}>
            あおば相続法務事務所
          </strong>
          <span style={{ marginLeft: "12px", fontSize: "0.76rem", color: "#64748b" }}>
            （客がAIにする相談 12問をAIで実況検証）
          </span>
        </div>

        {/* 端正なメトリクス */}
        <div
          style={{
            background: "#ffffff",
            border: "1px solid #cbd5e1",
            padding: "6px 14px",
            borderRadius: "6px",
            display: "flex",
            alignItems: "baseline",
            gap: "8px",
          }}
        >
          <span style={{ fontSize: "0.72rem", color: "#64748b", fontFamily: "var(--font-mono, monospace)" }}>
            実況結果:
          </span>
          <span style={{ fontSize: "0.92rem", fontWeight: 700, color: "#991b1b" }}>
            12問中 10問で大手チェーンが優先推薦（自社はスルー）
          </span>
        </div>
      </div>

      {/* 実測例 */}
      <div style={{ padding: "22px" }}>
        <div style={{ marginBottom: "14px" }}>
          <span
            style={{
              display: "inline-block",
              fontSize: "0.68rem",
              fontWeight: 700,
              color: "#64748b",
              fontFamily: "var(--font-mono, monospace)",
              letterSpacing: "0.02em",
              marginBottom: "4px",
            }}
          >
            実況質問（買い手がChatGPTにした相談の例）
          </span>
          <h4
            style={{
              margin: 0,
              fontSize: "1.02rem",
              fontWeight: 700,
              color: "#0f172a",
              lineHeight: 1.45,
            }}
          >
            「親族間の複雑な事情に、親身に寄り添ってくれる専門窓口は？」
          </h4>
        </div>

        {/* AIの回答対比 */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "12px",
            marginBottom: "16px",
          }}
        >
          {/* 優先選定 */}
          <div
            style={{
              background: "#ffffff",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              padding: "14px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontSize: "0.68rem", color: "#64748b", fontFamily: "var(--font-mono, monospace)" }}>優先選定された相手</span>
              <span style={{ fontSize: "0.68rem", fontWeight: 600, color: "#0f172a", background: "#f1f5f9", padding: "1px 6px", borderRadius: "3px" }}>AI選定候補</span>
            </div>
            <strong style={{ fontSize: "0.94rem", color: "#0f172a", display: "block", marginBottom: "4px" }}>
              大手全国展開グループ
            </strong>
            <p style={{ margin: 0, fontSize: "0.76rem", color: "#64748b", lineHeight: 1.5 }}>
              選ばれた理由：一般的な知名度とネット広告量により、AIが機械的に選定。
            </p>
          </div>

          {/* 自社 */}
          <div
            style={{
              background: "#fffbfb",
              border: "1px solid #fecaca",
              borderRadius: "6px",
              padding: "14px",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
              <span style={{ fontSize: "0.68rem", color: "#991b1b", fontFamily: "var(--font-mono, monospace)" }}>自社の状況</span>
              <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#991b1b", background: "#fee2e2", padding: "1px 6px", borderRadius: "3px" }}>選定外（スルー）</span>
            </div>
            <strong style={{ fontSize: "0.94rem", color: "#475569", display: "block", marginBottom: "4px" }}>
              あおば相続法務事務所
            </strong>
            <p style={{ margin: 0, fontSize: "0.76rem", color: "#991b1b", lineHeight: 1.5 }}>
              スルーされた理由：親身な個別相談という「本当の強み」がAIに伝わっておらず除外。
            </p>
          </div>
        </div>

        {/* 改善提案 */}
        <div
          style={{
            background: "#f8fafc",
            border: "1px solid #0f172a",
            borderRadius: "6px",
            padding: "12px 16px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <div>
            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: "#0f172a", fontFamily: "var(--font-mono, monospace)", display: "block", marginBottom: "2px" }}>
              診断結果の改善策
            </span>
            <strong style={{ fontSize: "0.85rem", color: "#0f172a", fontWeight: 600 }}>
              「親身な個別相談」をAI専用看板としてネット上に配備することで、AIが自社を名指しでおすすめするようになります
            </strong>
          </div>
          <Link
            href="/result?sample=1"
            style={{
              fontSize: "0.78rem",
              fontWeight: 700,
              color: "#ffffff",
              background: "#0f172a",
              padding: "7px 14px",
              borderRadius: "4px",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            <span>診断レポートの実物を見る</span>
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </figure>
  );
}

export function ProductProcessVisual() {
  const steps = [
    {
      label: "01",
      userTime: "所要 10秒",
      userAction: "会社名を入力",
      title: "社名を入れるだけ",
      systemAction: "AIが公開サイトや取引実績を瞬時に読み込み、御社の本当の強みを自動整理します。",
      tag: "社長の作業",
      tagSystem: "裏側の自動処理",
    },
    {
      label: "02",
      userTime: "所要 0秒",
      userAction: "診断レポートを確認",
      title: "AI推薦の現状がわかる",
      systemAction: "客がAIにする12の質問で、なぜ大手に客を奪われているかを白日の元に暴きます。",
      tag: "社長の作業",
      tagSystem: "裏側の自動処理",
    },
    {
      label: "03",
      userTime: "所要 1クリック",
      userAction: "自社の強みを選択",
      title: "AI専用看板を配備",
      systemAction: "今のHPはいじらず、選んだ強みをもとにAI専用の紹介看板をネットに自動開設。",
      tag: "社長の作業",
      tagSystem: "裏側の自動処理",
    },
    {
      label: "04",
      userTime: "作業ゼロ（完全放置）",
      userAction: "本業に専念するだけ",
      title: "毎週のAI回答を自動見守り",
      systemAction: "AIのおすすめ状況やライバルの動向を毎週自動追跡。社長は普段どおり本業に集中するだけ。",
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
