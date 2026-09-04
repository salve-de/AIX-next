"use client";

import { useState } from "react";
import { ArrowIcon, EvidenceIcon, TrendIcon } from "@/components/icons";

export function HeroChatDiagnosticCard() {
  return (
    <div className="hero-chat-direct-card" aria-label="AIによる推薦判定の比較">
      {/* カードヘッダー */}
      <div className="direct-card-head">
        <span className="direct-card-title">AIの選定プロセス</span>
        <span className="direct-card-sub">ChatGPTなどの生成AIは「確定仕様の有無」で判定します</span>
      </div>

      <div className="direct-card-body">
        {/* 見込み客の質問 */}
        <div className="direct-query-box">
          <span className="query-label">見込み客（発注者）のAI検索例</span>
          <p className="query-text">「東京都内で、短納期・小ロット対応の試作板金加工会社はどこ？」</p>
        </div>

        {/* 客観的な選定判定フロー */}
        <div className="flow-compare-container">
          
          {/* 【台帳なし】仕様がAIに伝わらない状態 */}
          <div className="flow-box status-excluded">
            <div className="flow-box-top">
              <span className="state-tag tag-excluded">AI台帳なし（自社サイトのみ）</span>
              <span className="state-result result-excluded">判定：仕様不明のため推薦対象外</span>
            </div>
            <p className="flow-quote">ChatGPT「競合A社、競合B社がおすすめです。」</p>
            <p className="flow-subtext">※ サイトからロットや納期の確定仕様がAIに読み取れず、選定から外れます。</p>
          </div>

          {/* 変化の架け橋（矢印） */}
          <div className="flow-arrow-bridge">
            <div className="bridge-pill">
              <span>会社名を入れるだけで「AI専用台帳」を自動生成</span>
              <span className="bridge-arrow">↓</span>
            </div>
          </div>

          {/* 【台帳あり】公式仕様が認識された状態 */}
          <div className="flow-box status-included">
            <div className="flow-box-top">
              <span className="state-tag tag-included">AI専用台帳を自動配備後</span>
              <span className="state-result result-included">判定：公式根拠をもとに推薦候補へ採用</span>
            </div>
            <div className="flow-quote-row">
              <p className="flow-quote">ChatGPT「貴社（大田区）がご希望の条件に合致します。」</p>
              <span className="flow-source">公式台帳を引用</span>
            </div>
            <p className="flow-subtext included-sub">【AIが認識した根拠】単品1個対応・短納期試作・3D CAD入稿可能</p>
          </div>

        </div>
      </div>

      {/* 下部：客観的な技術解説 */}
      <div className="direct-card-foot">
        <span className="foot-tag">仕組み</span>
        <p className="foot-desc">
          自社サイト改修ゼロ。社名からAI専用の公式台帳を自動生成し、AIが確実に引用できる状態をつくります。
        </p>
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
    { label: "01", title: "社名を入力する", body: "会社名や店舗名を入れるだけで、AIが公開情報を自動整理" },
    { label: "02", title: "AI推薦状況を確認", body: "ChatGPTがライバルを優先している質問と理由を特定" },
    { label: "03", title: "AI専用台帳を自動生成", body: "自社の強みを選び、サイト改修ゼロで公式データを配備" },
    { label: "04", title: "毎週自動で見守り", body: "AIの回答変化を追跡し、推薦枠の獲得を定期チェック" },
  ];
  return <ol className="process-visual">{steps.map((step) => <li key={step.label}><span>{step.label}</span><h3>{step.title}</h3><p>{step.body}</p></li>)}</ol>;
}

export function WatchTrendVisual() {
  return <figure className="watch-demo-window" aria-label="AI推薦の定期追跡レポート例">
    <header><strong>AI推薦の推移レポート</strong><span>毎週の自動観測</span></header>
    <div className="watch-demo-rank"><small>自社が推薦された質問数</small><strong><span>2件</span><ArrowIcon /><b>4件</b></strong><p>同じ比較質問を毎週自動で再チェック</p></div>
    <div className="watch-demo-rows"><div><span>自社がおすすめに入った質問</span><strong>2件　→　4件</strong></div><div><span>まだ競合が優先された質問</span><strong>10件　→　8件</strong></div><div><span>AIに新しく参照されたデータ</span><strong>+3件</strong></div></div>
    <footer><TrendIcon /><span><small>推薦枠の獲得</small><strong>新たに2つの質問で、自社がおすすめ枠に入りました</strong></span></footer>
  </figure>;
}
