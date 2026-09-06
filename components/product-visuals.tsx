"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowIcon, TrendIcon } from "@/components/icons";

export function HeroChatDiagnosticCard() {
  return (
    <div className="hero-chat-split-container" aria-label="AI回答の比較イメージ">
      <p className="split-demo-note">説明用の表示例（実測値・効果を示すものではありません）</p>
      {/* 共通の起点：利用者による相談例 */}
      <div className="split-user-prompt-box">
        <div className="split-prompt-header">
          <span className="split-prompt-dot" aria-hidden="true" />
          <span className="split-prompt-label">利用者によるAIへの相談例</span>
        </div>
        <p className="split-prompt-text">「急ぎの小ロット試作を相談できる事業者は？」</p>
      </div>

      {/* 左右対比グリッド（隙間なくピタッと並べて一瞬で比較可能に） */}
      <div className="split-comparison-grid">
        
        {/* 左：公開情報を確認できない場合の表示例 */}
        <div className="split-card card-before">
          <div className="split-card-header header-before">
            <span className="split-status-badge tag-lost">確認前の表示例</span>
            <span className="split-outcome-label outcome-lost">自社が候補外になる例</span>
          </div>
          <div className="split-card-body">
            <div className="ai-speaker-bar">
              <span className="ai-name">AIの回答</span>
              <span className="ai-status">回答例</span>
            </div>
            <p className="ai-dialogue-text">
              「条件に合う候補として、公開情報の多い事業者が表示されることがあります。」
            </p>
            <div className="split-cause-box cause-lost">
              <strong>【この例で見えること】</strong> 測定時点で参照できる情報が少ないと、自社が候補に含まれない回答になることがあります。
            </div>
          </div>
        </div>

        {/* 右：参照元付き公開情報を用意した場合の表示例 */}
        <div className="split-card card-after">
          <div className="split-card-header header-after">
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span className="split-status-badge tag-won">公開情報を整理した場合の表示例</span>
              <span className="after-arrow-indicator" aria-hidden="true">➔</span>
            </div>
            <span className="split-outcome-label outcome-won">候補に含まれる場合</span>
          </div>
          <div className="split-card-body">
            <div className="ai-speaker-bar">
              <span className="ai-name">AIの回答</span>
              <span className="ai-status status-won">回答例</span>
            </div>
            <p className="ai-dialogue-text ai-dialogue-won">
              「公開情報で条件を確認できる場合、その条件に合う事業者が候補として表示されることがあります。」
            </p>
            <div className="split-cause-box cause-won">
              <strong>【この例で見えること】</strong> 参照元付きの事実を公開しても、AIの回答・推薦・順位は質問や時点によって変わります。効果は再測定で確認します。
            </div>
          </div>
        </div>

      </div>

      {/* カード下部の安心注記 */}
      <div className="split-footer-bar">
        <span>※ 既存ホームページの改修は不要。公開ページは内容を確認してから公開できます。</span>
        <span className="split-footer-tag">ChatGPT / Google Gemini / Perplexity などで同じ条件を測定</span>
      </div>
    </div>
  );
}

export function ChatGptComparisonVisual() {
  const [tab, setTab] = useState<"service" | "mfg" | "brand">("service");

  return <div className="chatgpt-compare-container" aria-label="AI回答の表示例">
    <p className="chatgpt-demo-note">説明用の表示例（実測値・効果を示すものではありません）</p>
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
      {/* 左：参照できる情報が少ない場合の表示例 */}
      <div className="chatgpt-mock-card mock-lost">
        <div className="mock-badge badge-lost">参照情報が少ない場合（表示例）</div>
        <div className="mock-chat-bubble user-bubble">
          <span className="bubble-role">利用者</span>
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
            ? "一般的な大手法律グループや、比較ポータルサイトの情報が候補として表示されることがあります。"
            : tab === "mfg" 
            ? "一般的な大手総合部品メーカーやカタログ通販をご検討ください。" 
            : "有名百貨店のギフトコーナーや大手通販の情報が候補として表示されることがあります。"
          }</p>
          <div className="mock-verdict verdict-lost">
            <span>自社が候補に含まれない回答の例</span>
            <small>回答は質問・参照元・モデルの更新で変わります</small>
          </div>
        </div>
      </div>

      {/* 右：参照元付き情報を整理した場合の表示例 */}
      <div className="chatgpt-mock-card mock-won">
        <div className="mock-badge badge-won">参照元付き情報を整理した場合（表示例）</div>
        <div className="mock-chat-bubble user-bubble">
          <span className="bubble-role">利用者</span>
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
            ? <>個別の事情に関する相談では、<strong>【〇〇事務所】が候補に挙がることがあります。</strong> 対応内容は参照元で確認してください。</>
            : tab === "mfg" 
            ? <>小ロット試作の相談では、<strong>【〇〇製作所】が候補に挙がることがあります。</strong> 対応範囲や納期は参照元で確認してください。</>
            : <>商品条件を公開情報で確認できる場合、<strong>【〇〇ブランド】が候補に挙がることがあります。</strong> 仕様や購入条件は参照元で確認してください。</>
          }</p>
          <div className="mock-verdict verdict-won">
            <span>公開した事実が回答の参照対象になる場合があります</span>
            <small>回答の変化は、同じ条件で再測定して確認します</small>
          </div>
        </div>
      </div>
    </div>
  </div>;
}

export function ProductOutputPreview() {
  return (
    <div className="deliverables-dual-grid" aria-label="確認できる2つの表示例">
      {/* ============================================================= */}
      {/* 成果物 01：AI回答診断レポート */}
      {/* ============================================================= */}
      <div className="deliverable-showcase-card card-report">
        {/* カードヘッダー */}
        <div className="deliv-card-head">
          <div className="deliv-badge-row">
              <span className="deliv-step-badge badge-blue">確認できるもの 01</span>
              <span className="deliv-speed-badge">無料で現状を確認</span>
          </div>
          <h4 className="deliv-card-title">AI回答診断レポート</h4>
          <p className="deliv-card-desc">
            URLまたは社名を入力すると、買い手の質問を想定した固定パネルでAI回答の現状を確認します。
          </p>
        </div>

        {/* カード本体：実物プレビューモック */}
        <div className="deliv-card-body">
          {/* 検証結果アラート */}
          <div className="deliv-metric-strip strip-danger">
            <span className="deliv-metric-label">表示例（架空データ）</span>
            <strong className="deliv-metric-value">自社が候補に含まれない質問がある場合の表示</strong>
          </div>

          {/* 実際のAI相談プレビュー */}
          <div className="deliv-mock-card">
          <span className="deliv-mock-label">利用者がAIにする相談の例</span>
            <div className="deliv-mock-query">
              「親族間の複雑な事情に、親身に寄り添ってくれる専門窓口は？」
            </div>
            <div className="deliv-mock-result-box">
              <div className="deliv-mock-row">
                <span className="deliv-tag-ai">AIの回答</span>
              <span className="deliv-text-loss">他社候補が先に表示され、自社が候補外になる回答の例</span>
              </div>
            </div>
          </div>

          {/* レポートに含まれる内容 */}
          <div className="deliv-features-list">
            <span className="deliv-features-heading">レポートで確認すること</span>
            <ul className="deliv-check-items">
              <li>測定対象にしたAIの回答と参照元</li>
              <li>自社が候補に含まれた質問・含まれなかった質問</li>
              <li>公開情報で補足できる項目の整理案</li>
            </ul>
          </div>
        </div>

        {/* カードフッター */}
        <div className="deliv-card-foot">
          <Link href="/result?sample=1" className="deliv-action-btn btn-navy">
            <span>診断レポートの設計見本を見る</span>
            <ArrowIcon />
          </Link>
          <div className="deliv-guarantee-note">
            ✓ URL・社名入力 • ✓ 無料診断 • ✓ 公開は確認後
          </div>
        </div>
      </div>

      {/* ============================================================= */}
      {/* 成果物 02：参照元付き公開情報ページ */}
      {/* ============================================================= */}
      <div className="deliverable-showcase-card card-data">
        {/* カードヘッダー */}
        <div className="deliv-card-head">
          <div className="deliv-badge-row">
              <span className="deliv-step-badge badge-green">確認できるもの 02</span>
            <span className="deliv-speed-badge">下書きを確認して公開</span>
          </div>
          <h4 className="deliv-card-title">参照元付き公開情報ページ</h4>
          <p className="deliv-card-desc">
            既存ホームページを改修せず、参照元で確認できる事実を機械可読形式の下書きに整理します。公開は内容を確認してから行えます。
          </p>
        </div>

        {/* カード本体：実物プレビューモック */}
        <div className="deliv-card-body">
          {/* 配備ステータス */}
          <div className="deliv-metric-strip strip-active">
            <span className="deliv-metric-label">公開ステータスの例</span>
            <strong className="deliv-metric-value">下書き → 内容確認 → 公開</strong>
          </div>

          {/* 公開ページに含める情報の例 */}
          <div className="deliv-mock-card">
            <span className="deliv-mock-label">公開ページに含める情報（例）</span>
            <div className="deliv-specs-grid">
              <div className="deliv-spec-item">
                <span className="spec-key">名称</span>
                <span className="spec-val">入力・参照元で確認した名称</span>
              </div>
              <div className="deliv-spec-item">
                <span className="spec-key">確認できた事実</span>
                <span className="spec-val">参照元に記載された内容だけ</span>
              </div>
              <div className="deliv-spec-item">
                <span className="spec-key">参照元</span>
                <span className="spec-val">確認したページへのリンク</span>
              </div>
              <div className="deliv-spec-item">
                <span className="spec-key">形式</span>
                <span className="spec-val">JSON-LD・Markdown</span>
              </div>
            </div>
          </div>

          {/* 配備によって得られる効果 */}
          <div className="deliv-features-list">
            <span className="deliv-features-heading">公開ページの役割</span>
            <ul className="deliv-check-items">
              <li>既存ホームページの改修・新規開設は不要</li>
              <li>参照元付きの事実を機械可読形式で整理</li>
              <li>AI回答の変化は公開後の再測定で確認</li>
            </ul>
          </div>
        </div>

        {/* カードフッター */}
        <div className="deliv-card-foot">
          <Link href="/ai/company/aoba-souzoku?sample=1" className="deliv-action-btn btn-green">
            <span>公開情報ページの見本を見る</span>
            <ArrowIcon />
          </Link>
          <div className="deliv-guarantee-note">
            ✓ HP改修不要 • ✓ 下書きを確認 • ✓ 公開後に再測定
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
      userTime: "入力",
      userAction: "URLまたは社名を入力",
      title: "診断の起点を入力",
      systemAction: "公開ページから確認できる情報を読み取り、参照元付きで整理します。",
      tag: "利用者の操作",
      tagSystem: "サービスの処理",
    },
    {
      label: "02",
      userTime: "確認",
      userAction: "診断レポートを確認",
      title: "AI回答の現状がわかる",
      systemAction: "固定した買い手質問パネルで、自社が候補に含まれた状況を確認します。",
      tag: "利用者の操作",
      tagSystem: "サービスの処理",
    },
    {
      label: "03",
      userTime: "承認",
      userAction: "下書きを確認して公開",
      title: "公開情報ページを整える",
      systemAction: "確認できた事実だけを機械可読形式にまとめ、公開前に内容を確認できます。",
      tag: "利用者の操作",
      tagSystem: "サービスの処理",
    },
    {
      label: "04",
      userTime: "継続",
      userAction: "必要な時だけ結果を確認",
      title: "同じ条件でAI回答を再測定",
      systemAction: "同じ質問パネルで回答の変化を確認し、公開情報の見直し候補を記録します。",
      tag: "利用者の操作",
      tagSystem: "サービスの処理",
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
  return <figure className="watch-demo-window" aria-label="AI回答の定期測定レポート例">
    <header><strong>AI回答の推移レポート</strong><span>週次測定の表示例</span></header>
    <div className="watch-demo-rank"><small>同じ質問パネルで比較</small><strong><span>初回</span><ArrowIcon /><b>再測定</b></strong><p>質問・対象AI・条件をそろえて変化を確認</p></div>
    <div className="watch-demo-rows"><div><span>自社が候補に含まれた質問</span><strong>初回 → 再測定</strong></div><div><span>自社が候補外だった質問</span><strong>初回 → 再測定</strong></div><div><span>参照元リンク</span><strong>取得件数を表示</strong></div></div>
    <footer><TrendIcon /><span><small>変化の確認</small><strong>回答・参照元・候補入り率を同じ条件で比較します</strong></span></footer>
  </figure>;
}
