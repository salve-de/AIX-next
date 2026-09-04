"use client";

import { useState } from "react";
import { ArrowIcon, EvidenceIcon, TrendIcon } from "@/components/icons";

export function HeroChatDiagnosticCard() {
  const [industry, setIndustry] = useState<"mfg" | "service" | "local">("mfg");

  const data = {
    mfg: {
      query: "「東京都内で、短納期・小ロット対応の試作板金加工会社はどこ？」",
      aiAnswerLead: "東京都内で小ロット・試作板金に対応している実績豊富な企業として、以下の2社がよく挙げられます：",
      competitor1: "三和試作板金（大田区）",
      competitor1Desc: "単品1個からの精密加工に対応。即日見積もり体制。",
      competitor2: "大伸プレシジョン（品川区）",
      competitor2Desc: "短納期試作に特化。3D CADデータから直接加工対応。",
      aiNote: "※ 貴社サイトには対応最小ロットや納期の明確な公開仕様が確認できず、回答に含まれていません。",
      statusVal: "自社の言及なし（競合2社を推薦）",
      evidenceDesc: "競合サイト上の「1個から対応」「即日見積」の確定情報",
      actionDesc: "自社サイト改修不要。AI専用DBを自動生成し、ChatGPTへ強みを勝手に学習",
    },
    service: {
      query: "「親身に個別相談に乗ってくれる、相続専門の信頼できる税理士事務所は？」",
      aiAnswerLead: "相続や事業承継で、親身な個別伴走や直接面談に定評のある事務所として以下が候補に挙がります：",
      competitor1: "あおば相続税理士法人（千代田区）",
      competitor1Desc: "担当税理士が初回から直接面談。個別伴走プランを明示。",
      competitor2: "日本相続承継パートナーズ（中央区）",
      competitor2Desc: "中小企業オーナー向け事業承継の実績多数。",
      aiNote: "※ 貴社サイトは個別対応の実績や料金体系がAIに読み取れず、比較候補から外れています。",
      statusVal: "自社の言及なし（他社を優先推薦）",
      evidenceDesc: "公式料金プランと「初回直接面談」の確定情報",
      actionDesc: "自社サイト改修不要。AI専用DBを自動生成し、個別伴走の強みを勝手に学習",
    },
    local: {
      query: "「近隣で休日の急患や夜間診療に対応しているクリニックはある？」",
      aiAnswerLead: "休日や夜間の診療体制が確認できる医療機関として、以下が案内されます：",
      competitor1: "桜通り夜間救急クリニック",
      competitor1Desc: "土日祝・夜間22時まで診療。WEB問診・即時受付対応。",
      competitor2: "駅前セントラル総合診療所",
      competitor2Desc: "休日当番医として年中無休体制を公式公表。",
      aiNote: "※ 貴院の診療時間や受付仕様のデータがAIクローラーに正しく伝達されていません。",
      statusVal: "自社の言及なし（大手ポータルが優先）",
      evidenceDesc: "Schema構造化された診療カレンダーと受付時間",
      actionDesc: "自社サイト改修不要。AI専用DBを自動生成し、最新の診療仕様を勝手に公開",
    },
  };

  const current = data[industry];

  return (
    <div className="hero-chat-card" aria-label="ChatGPTでの競合推薦と観測結果プレビュー">
      {/* 上部タブバー */}
      <div className="hero-chat-card-topbar">
        <div className="card-topbar-tabs">
          <button
            type="button"
            className={`topbar-tab ${industry === "mfg" ? "active" : ""}`}
            onClick={() => setIndustry("mfg")}
          >
            製造・加工
          </button>
          <button
            type="button"
            className={`topbar-tab ${industry === "service" ? "active" : ""}`}
            onClick={() => setIndustry("service")}
          >
            専門サービス・士業
          </button>
          <button
            type="button"
            className={`topbar-tab ${industry === "local" ? "active" : ""}`}
            onClick={() => setIndustry("local")}
          >
            店舗・地域
          </button>
        </div>
        <span className="card-topbar-label">AI回答の観測例</span>
      </div>

      {/* チャット対話エリア */}
      <div className="hero-chat-card-body">
        {/* 発注者の質問 */}
        <div className="hero-chat-msg user-msg">
          <span className="msg-author">発注者（見込み客）のプロンプト</span>
          <p>{current.query}</p>
        </div>

        {/* ChatGPTの回答 */}
        <div className="hero-chat-msg ai-msg">
          <div className="ai-msg-header">
            <span className="msg-author ai-author">ChatGPT (GPT-4o)</span>
            <span className="ai-status-tag">競合2社を推奨</span>
          </div>
          <p className="ai-intro">{current.aiAnswerLead}</p>
          <div className="ai-rec-box">
            <div>
              <strong>1. {current.competitor1}</strong>
              <span> — {current.competitor1Desc}</span>
            </div>
            <div>
              <strong>2. {current.competitor2}</strong>
              <span> — {current.competitor2Desc}</span>
            </div>
          </div>
          <div className="ai-fact-note">
            <span className="fact-dot">●</span>
            <p>{current.aiNote}</p>
          </div>
        </div>
      </div>

      {/* AIXの観測・分析レポートバー */}
      <div className="hero-chat-card-report">
        <div className="report-status-header">
          <div className="status-rank-block">
            <span className="status-label">観測ステータス</span>
            <strong className="status-rank-val neutral">{current.statusVal}</strong>
          </div>
          <div className="status-cause-block">
            <span className="status-label">AIが引用した根拠</span>
            <span className="status-cause-val">{current.evidenceDesc}</span>
          </div>
        </div>
        <div className="report-action-row">
          <span className="action-tag">自動配備</span>
          <span className="action-desc">{current.actionDesc}</span>
        </div>
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
            <span>自社の強みに合致した質問で的確に推薦</span>
            <small>公式スペックに基づき、比較検討時に自社が候補に入ります</small>
          </div>
        </div>
      </div>
    </div>
  </div>;
}

export function ProductOutputPreview() {
  return <figure className="demo-window" aria-label="AIX診断結果の架空サンプル">
    <header className="demo-window-bar"><span className="window-dots"><i /><i /><i /></span><strong>集客機会レポート</strong><small>診断結果の例</small></header>
    <div className="demo-window-toolbar"><div><small>対象サイト</small><strong>NEXORA Cloud</strong></div><span>購入前の比較質問を12件確認</span></div>
    <div className="demo-outcome"><div><small>AIの候補に入った質問</small><strong>12問中 <b>2問</b></strong><span>競合に流れた質問を特定</span></div><p>AIはNEXORA Cloudより先にTrustOrbitを勧めました。どの顧客の比較で負けたか、理由と最初の改善機会を示します。</p></div>
    <div className="demo-metrics"><div><small>自社が候補に入った質問</small><strong>2 / 12</strong></div><div><small>先に選ばれた競合</small><strong>TrustOrbit <em>7 / 12</em></strong></div><div className="demo-negative"><small>取り戻す余地</small><strong>10 / 12</strong></div></div>
      <div className="demo-result-grid"><div className="demo-question"><small>顧客がAIに聞いた比較質問</small><h3>「従業員300名の企業に合う取引先審査ツールは？」</h3><div className="demo-winner-row"><span>先に選ばれた競合<strong>TrustOrbit</strong></span><span>自社<strong className="demo-lost">候補外</strong></span></div><p>TrustOrbitには同じ規模の導入事例がありました。NEXORA Cloudでは確認できませんでした。</p></div><div className="demo-next"><div><EvidenceIcon /><span><small>競合が選ばれた理由</small><strong>同規模企業の導入実績</strong></span></div><div><TrendIcon /><span><small>集客の改善機会</small><strong>導入事例を比べられる形にする</strong></span><ArrowIcon /></div></div></div>
  </figure>;
}

export function ProductProcessVisual() {
  const steps = [
    { label: "01", title: "対象を入力する", body: "会社名・商品名・URLから公開情報を整理" },
    { label: "02", title: "負けている比較を特定", body: "AIが先に勧めた競合を確認" },
    { label: "03", title: "選ばれた理由を比べる", body: "集客を逃している情報の差を確認" },
    { label: "04", title: "次の施策を決める", body: "1か所を見直し、同じ質問で再確認" },
  ];
  return <ol className="process-visual">{steps.map((step) => <li key={step.label}><span>{step.label}</span><h3>{step.title}</h3><p>{step.body}</p></li>)}</ol>;
}

export function WatchTrendVisual() {
  return <figure className="watch-demo-window" aria-label="競合から取り返せたかの架空サンプル">
    <header><strong>集客機会の変化</strong><span>改善後の結果</span></header>
    <div className="watch-demo-rank"><small>自社が候補に入った質問</small><strong><span>2問</span><ArrowIcon /><b>4問</b></strong><p>同じ比較質問を再確認</p></div>
    <div className="watch-demo-rows"><div><span>候補に入った質問</span><strong>2　→　4</strong></div><div><span>まだ競合が先の質問</span><strong>10　→　8</strong></div><div><span>新しく参照されたページ</span><strong>+3</strong></div></div>
    <footer><TrendIcon /><span><small>取り戻せた比較</small><strong>2つの質問で、自社が新しく候補に入りました</strong></span></footer>
  </figure>;
}
