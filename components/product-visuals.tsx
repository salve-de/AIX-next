"use client";

import { useState } from "react";
import { ArrowIcon, EvidenceIcon, TrendIcon } from "@/components/icons";

export function HeroChatDiagnosticCard() {
  const [industry, setIndustry] = useState<"mfg" | "service" | "local">("mfg");
  const [mode, setMode] = useState<"after" | "before">("after");

  const data = {
    mfg: {
      query: "「東京都内で、短納期・小ロット対応の試作板金加工会社はどこ？」",
      before: {
        statusVal: "自社の言及なし（競合2社を推薦）",
        evidenceDesc: "競合サイト上の「1個から対応」「即日見積」の確定情報",
        aiAnswerLead: "東京都内で小ロット・試作板金に対応している実績豊富な企業として、以下の2社がよく挙げられます：",
        competitor1: "三和試作板金（大田区）",
        competitor1Desc: "単品1個からの精密加工に対応。即日見積もり体制。",
        competitor2: "大伸プレシジョン（品川区）",
        competitor2Desc: "短納期試作に特化。3D CADデータから直接加工対応。",
        aiNote: "※ 貴社サイトには対応最小ロットや納期の明確な公開仕様が確認できず、回答に含まれていません。",
        actionDesc: "自社サイト改修不要。社名入力だけでAI専用DBを自動作成し、ChatGPTへ強みを直接伝達",
      },
      after: {
        statusVal: "自社がおすすめ第1位で推薦枠を獲得",
        evidenceDesc: "AI専用DB（公式台帳）に配備された即納・単品対応仕様",
        aiAnswerLead: "「公式AI台帳」の確定データに基づき、ご要望の短納期・小ロット試作に合致する企業をご案内します：",
        topTitle: "1. 貴社（大田区）",
        topBadge: "公式AI台帳を参照",
        topDesc: "単品1個からの短納期試作に即応。3D CAD直接入稿・即時見積もり体制を公式公表。",
        competitor1: "三和試作板金（大田区）",
        competitor1Desc: "単品加工に対応。即日見積もり。",
        aiNote: "★ 自社サイトの改修ゼロ。社名から自動生成されたAI専用DBをChatGPTが公式根拠として引用しました。",
        actionDesc: "社名を入れるだけで「AI専用DB」を自動生成。ChatGPTが回答根拠として優先参照します",
      },
    },
    service: {
      query: "「親身に個別相談に乗ってくれる、相続専門の信頼できる税理士事務所は？」",
      before: {
        statusVal: "自社の言及なし（他社を優先推薦）",
        evidenceDesc: "公式料金プランと「初回直接面談」の確定情報",
        aiAnswerLead: "相続や事業承継で、親身な個別伴走や直接面談に定評のある事務所として以下が候補に挙がります：",
        competitor1: "あおば相続税理士法人（千代田区）",
        competitor1Desc: "担当税理士が初回から直接面談。個別伴走プランを明示。",
        competitor2: "日本相続承継パートナーズ（中央区）",
        competitor2Desc: "中小企業オーナー向け事業承継の実績多数。",
        aiNote: "※ 貴社サイトは個別対応の実績や料金体系がAIに読み取れず、比較候補から外れています。",
        actionDesc: "自社サイト改修不要。社名入力だけでAI専用DBを自動作成し、個別伴走の強みを直接伝達",
      },
      after: {
        statusVal: "自社がおすすめ第1位で推薦枠を獲得",
        evidenceDesc: "AI専用DB（公式台帳）に配備された初回面談・伴走仕様",
        aiAnswerLead: "「公式AI台帳」の確定データに基づき、親身な個別相談に特化した事務所をご案内します：",
        topTitle: "1. 貴社税理士事務所（千代田区）",
        topBadge: "公式AI台帳を参照",
        topDesc: "担当税理士が初回から直接面談。相続・事業承継の個別伴走プランと明確な費用体系を公表。",
        competitor1: "あおば相続税理士法人（千代田区）",
        competitor1Desc: "初回面談対応・伴走プランあり。",
        aiNote: "★ 個別対応の実績と相談仕様がAI専用DBから直接読み取られ、ChatGPTの推薦根拠に採用されました。",
        actionDesc: "社名を入れるだけで「AI専用DB」を自動生成。ChatGPTが回答根拠として優先参照します",
      },
    },
    local: {
      query: "「近隣で休日の急患や夜間診療に対応しているクリニックはある？」",
      before: {
        statusVal: "自社の言及なし（大手ポータルが優先）",
        evidenceDesc: "Schema構造化された診療カレンダーと受付時間",
        aiAnswerLead: "休日や夜間の診療体制が確認できる医療機関として、以下が案内されます：",
        competitor1: "桜通り夜間救急クリニック",
        competitor1Desc: "土日祝・夜間22時まで診療。WEB問診・即時受付対応。",
        competitor2: "駅前セントラル総合診療所",
        competitor2Desc: "休日当番医として年中無休体制を公式公表。",
        aiNote: "※ 貴院の診療時間や受付仕様のデータがAIクローラーに正しく伝達されていません。",
        actionDesc: "自社サイト改修不要。社名入力だけでAI専用DBを自動作成し、最新の診療仕様を直接伝達",
      },
      after: {
        statusVal: "自院がおすすめ第1位で推薦枠を獲得",
        evidenceDesc: "AI専用DB（公式台帳）に配備された休日夜間診療カレンダー",
        aiAnswerLead: "「公式AI台帳」の最新診療データに基づき、即時対応可能なクリニックをご案内します：",
        topTitle: "1. 貴院（クリニック）",
        topBadge: "公式AI台帳を参照",
        topDesc: "土日祝の急患対応・夜間診療体制。WEB即時受付および最新の診療スケジュールを公式公表。",
        competitor1: "桜通り夜間救急クリニック",
        competitor1Desc: "土日祝・夜間22時まで診療。",
        aiNote: "★ 最新の診療スケジュールがAIクローラー向け台帳から読み取られ、ChatGPTで優先案内されました。",
        actionDesc: "社名を入れるだけで「AI専用DB」を自動生成。ChatGPTが回答根拠として優先参照します",
      },
    },
  };

  const item = data[industry];
  const isAfter = mode === "after";
  const current = isAfter ? item.after : item.before;

  return (
    <div className="hero-chat-card" aria-label="ChatGPTでの競合推薦と観測結果プレビュー">
      {/* 最上部：Before / After モード切替スイッチ（理屈を1秒で腑に落とす） */}
      <div className="hero-chat-mode-switcher">
        <button
          type="button"
          className={`mode-switch-btn ${isAfter ? "active-after" : ""}`}
          onClick={() => setMode("after")}
          aria-label="AI専用DB配備後の推薦プレビューを表示"
        >
          <span className="mode-dot">●</span>
          <span>AI専用DBを配備後（推薦枠を獲得）</span>
        </button>
        <button
          type="button"
          className={`mode-switch-btn ${!isAfter ? "active-before" : ""}`}
          onClick={() => setMode("before")}
          aria-label="対策前のスルーされた状態を表示"
        >
          <span className="mode-dot">×</span>
          <span>対策前の現状（自社がスルーされる）</span>
        </button>
      </div>

      {/* 業種タブバー */}
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
        <span className={`card-topbar-label ${isAfter ? "success-label" : ""}`}>
          {isAfter ? "AI推薦の成功状態" : "自社スルーの未対策状態"}
        </span>
      </div>

      {/* チャット対話エリア */}
      <div className="hero-chat-card-body">
        {/* 発注者の質問 */}
        <div className="hero-chat-msg user-msg">
          <span className="msg-author">発注者（見込み客）のプロンプト</span>
          <p>{item.query}</p>
        </div>

        {/* ChatGPTの回答 */}
        <div className="hero-chat-msg ai-msg">
          <div className="ai-msg-header">
            <span className="msg-author ai-author">ChatGPT (GPT-4o)</span>
            <span className={`ai-status-tag ${isAfter ? "success" : ""}`}>
              {isAfter ? "自社を最優先推薦" : "競合2社を推奨"}
            </span>
          </div>
          <p className="ai-intro">{current.aiAnswerLead}</p>

          <div className="ai-rec-box">
            {isAfter ? (
              <>
                {/* 1位：自社（公式台帳を参照した確定推薦） */}
                <div className="ai-rec-item highlighted">
                  <div className="rec-item-header">
                    <strong className="rec-name">{item.after.topTitle}</strong>
                    <span className="rec-source-pill">{item.after.topBadge}</span>
                  </div>
                  <p className="rec-desc">{item.after.topDesc}</p>
                </div>
                {/* 2位：競合他社 */}
                <div className="ai-rec-item sub">
                  <strong>2. {item.after.competitor1}</strong>
                  <span> — {item.after.competitor1Desc}</span>
                </div>
              </>
            ) : (
              <>
                <div>
                  <strong>1. {item.before.competitor1}</strong>
                  <span> — {item.before.competitor1Desc}</span>
                </div>
                <div>
                  <strong>2. {item.before.competitor2}</strong>
                  <span> — {item.before.competitor2Desc}</span>
                </div>
              </>
            )}
          </div>

          <div className={`ai-fact-note ${isAfter ? "success-note" : ""}`}>
            <span className="fact-dot">{isAfter ? "✔" : "●"}</span>
            <p>{current.aiNote}</p>
          </div>
        </div>
      </div>

      {/* AIXの仕組み・観測レポートバー */}
      <div className="hero-chat-card-report">
        <div className="report-status-header">
          <div className="status-rank-block">
            <span className="status-label">AIの推薦判定</span>
            <strong className={`status-rank-val ${isAfter ? "rank-success" : "neutral"}`}>
              {current.statusVal}
            </strong>
          </div>
          <div className="status-cause-block">
            <span className="status-label">AIが引用した根拠</span>
            <span className="status-cause-val">{current.evidenceDesc}</span>
          </div>
        </div>
        <div className={`report-action-row ${isAfter ? "action-row-success" : ""}`}>
          <span className={`action-tag ${isAfter ? "tag-success" : ""}`}>
            {isAfter ? "自動配備の仕組み" : "改善の起点"}
          </span>
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
