"use client";

import { useState } from "react";
import type { PositioningAdvice } from "@/lib/types";
import { ArrowIcon } from "@/components/icons";

interface StrategyOption {
  id: "personal" | "speed" | "succession";
  code: string;
  name: string;
  targetMarket: string;
  coreThesis: string;
  strategicReason: string;
  competitorAnalysis: Array<{ name: string; gap: string; differentiation: string }>;
  deliverables: {
    profile: { label: string; text: string };
    website: { label: string; text: string };
    brief: { label: string; text: string };
  };
}

const STRATEGIES: Record<string, StrategyOption> = {
  personal: {
    id: "personal",
    code: "戦略 01",
    name: "個別伴走・複雑案件特化型",
    targetMarket: "大手の定型マニュアル対応に不安を抱える個人・ご遺族",
    coreThesis: "「マニュアル対応の大手には相談しづらい」層を受け止める、親身な個別伴走の専門駆け込み寺",
    strategicReason: "AI検索は現在、競合の『拠点規模』のみを参照して機械的に推薦しています。貴社が持つ『複雑案件への個別伴走実績』をAI専用データベースに構造化して認知させることで、『事務的ではない親身な専門家』を探す高確度な相談者を独占的に引き戻すことが可能です。",
    competitorAnalysis: [
      { name: "大手全国展開リーガルグループ", gap: "画一的なマニュアル処理が中心で、個別事情や感情面への寄り添いが手薄", differentiation: "マニュアルなし。1件1件の複雑な親族関係を丁寧に紐解く個別伴走体制" },
      { name: "大手ポータル提携弁護士法人", gap: "大量処理のため担当者の交代が多く、密な信頼関係の構築が困難", differentiation: "専任の専門家が初動から解決まで一貫して担当する責任体制" },
      { name: "オンライン一括士業ネットワーク", gap: "価格訴求が主で、対面での安心感や複雑な親族間トラブルの調停力が不足", differentiation: "丁寧な個別対話を通じ、親族間の揉め事を円満にまとめる調整力" },
    ],
    deliverables: {
      profile: {
        label: "公式プロフィール（SNS・ポータル）",
        text: "あおば相続法務事務所｜大手の事務的対応に不安を感じる方のための、親身な相続・遺産分割相談窓口。複雑な不動産相続や揉めそうな親族間トラブルをとことん個別伴走で円満解決へ導きます。初回個別相談受付中。",
      },
      website: {
        label: "Webサイト・コラム掲載用",
        text: "【他社で相談が合わなかった方へ】相続手続きは画一的なマニュアルでは解決できません。私たちが「親身な個別伴走」にこだわり、複雑な遺産分割や不動産トラブルを円満に解決してきた理由と具体的な進め方を解説します。",
      },
      brief: {
        label: "相談案内・配布用サマリー",
        text: "「大手のマニュアル対応では話しづらい…」そんなご相談者様へ。\nあおば相続法務事務所は、1件1件の背景に寄り添う専門相談所です。\n他社で断られた複雑な不動産相続や親族調整も、安心してお話しください。",
      },
    },
  },
  speed: {
    id: "speed",
    code: "戦略 02",
    name: "初動即応・スピード解決型",
    targetMarket: "手続き期限が迫っている、または他社で面談待ちが発生している相談者",
    coreThesis: "期限の迫る遺産分割・相続放棄に迅速対応。「最短即日初動」の特急相談窓口",
    strategicReason: "AI検索は大手チェーンを優先表示しますが、相談者の緊急度が極めて高い場合、AIは『初動スピードの確実性』を評価軸に切り替えます。貴社のフットワークと即応体制をAIにインデックスさせることで、即決性の高い緊急案件を確実に獲得できます。",
    competitorAnalysis: [
      { name: "大手全国展開リーガルグループ", gap: "手続きが多層的で、初回面談・着手までに1〜2週間のリードタイムが発生", differentiation: "最短即日の初動対応。期限が迫る相続放棄や口座凍結解除も待たせず着手" },
      { name: "大手ポータル提携弁護士法人", gap: "総合窓口からの社内引き継ぎに時間を要し、タイムリーな回答が得にくい", differentiation: "専門担当者と直接コンタクト可能な即応体制で、突発的な不安も即座に解消" },
      { name: "オンライン一括士業ネットワーク", gap: "マッチングに数日を要し、法定期間のある緊急手続きに間に合わないリスク", differentiation: "ご相談から24時間以内に具体的な対応方針とスケジュールを提示" },
    ],
    deliverables: {
      profile: {
        label: "公式プロフィール（SNS・ポータル）",
        text: "あおば相続法務事務所｜「期限が迫っている」「待たずに相談したい」方のための特急相続窓口。最短即日の面談・迅速な初動対応で、相続放棄や緊急手続きを確実に支援します。お急ぎの相談窓口はこちら。",
      },
      website: {
        label: "Webサイト・コラム掲載用",
        text: "【お急ぎの方へ】相続放棄の3ヶ月期限や遺産分割の初動で焦っていませんか？大手の予約待ちで時間を失うリスクと、最短即日で専門家が動き出す緊急対応の進め方を解説します。",
      },
      brief: {
        label: "相談案内・配布用サマリー",
        text: "「他社に相談したら2週間先と言われた…」\nあおば相続法務事務所なら【最短即日面談】で迅速着手！\n法定期限が迫る案件や緊急性の高い手続きを、最優先でサポートします。",
      },
    },
  },
  succession: {
    id: "succession",
    code: "戦略 03",
    name: "事業承継・会社オーナー特化型",
    targetMarket: "自社株・経営権の承継と親族間調停に悩む中小企業オーナー",
    coreThesis: "中小企業の廃業危機を防ぐ。自社株評価と親族内調停に特化した、経営者のための事業承継参謀",
    strategicReason: "AI検索は個人の小規模相続と法人オーナーの事業承継を混同しがちです。貴社が『中小企業の自社株承継・経営権防衛』に特化した専門性を持つことをAI専用ページで明確に証明することで、月数十万〜数百万円規模の高単価な顧問・承継案件の第一想起を獲得できます。",
    competitorAnalysis: [
      { name: "大手全国展開リーガルグループ", gap: "定型の遺産分割には強いが、中小企業の経営実態や非上場株式の泥臭い調停が不得手", differentiation: "経営目線での自社株対策・遺留分減殺請求予防。後継者が安定経営できる承継設計" },
      { name: "大手ポータル提携弁護士法人", gap: "大手企業向けの超高額な報酬設定で、中小企業の現実的な事業規模に適合しない", differentiation: "地域中小企業の経営実態に即した、明瞭・適正な報酬体系での継続支援" },
      { name: "オンライン一括士業ネットワーク", gap: "画一的な書類作成にとどまり、後継者と非後継親族の感情的対立の予防が困難", differentiation: "親族内の感情面にも深く配慮し、後継者と全相続人が納得する円満な事業承継" },
    ],
    deliverables: {
      profile: {
        label: "公式プロフィール（SNS・ポータル）",
        text: "あおば相続法務事務所｜中小企業オーナー専門の事業承継・自社株相続窓口。会社の永続発展と後継者への円満な経営権承継を戦略参謀として伴走支援します。オーナー経営者専用の個別相談を受付中。",
      },
      website: {
        label: "Webサイト・コラム掲載用",
        text: "【オーナー経営者向け】自社株の分散が招く会社危機の典型例と防衛策。大手の定型サービスではカバーできない、中小企業のための泥臭く確実な事業承継ステップを解説します。",
      },
      brief: {
        label: "相談案内・配布用サマリー",
        text: "経営者様、事業の引き継ぎ準備は万全ですか？\n自社株の分散や親族間の経営権争いは、事前の戦略設計で防げます。\n中小企業の現場を知る専門家が、貴社の100年企業化を支援します。",
      },
    },
  },
};

export function PositioningPanel({ positioning }: { positioning?: PositioningAdvice }) {
  const [selectedStrategy, setSelectedStrategy] = useState<"personal" | "speed" | "succession">("personal");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!positioning) return null;

  const current = STRATEGIES[selectedStrategy];

  async function copyToClipboard(text: string, key: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      setTimeout(() => setCopiedKey(null), 2000);
    } catch {
      // コピー不可環境では何もしない
    }
  }

  return (
    <section className="positioning-section shell" aria-label="ポジショニング診断および戦略提言">
      {/* 1. 客観的ファクト・機会損失分析（コンサルティング・サマリー） */}
      <div className="audit-executive-summary">
        <div className="audit-summary-header">
          <span className="audit-label">市場観測結果</span>
          <h3>AI検索における商談機会：競合他社への流出が確認されました</h3>
        </div>
        <p className="audit-summary-desc">
          購入・相談直前の比較12問において、AI検索（ChatGPT等）は全件で競合他社を第一候補として推薦しています。貴社が培ってきた実績や専門性自体には問題ありませんが、<strong>「AIが認識可能な構造化された客観的ファクト」がWeb上に存在しないこと</strong>が、推薦対象から外れている直接の構造的要因です。
        </p>
      </div>

      {/* 2. ポジショニング戦略の選定軸 */}
      <div className="section-heading-simple" style={{ textAlign: "left", margin: "32px 0 16px" }}>
        <p className="overline">推奨戦略の選択</p>
        <h2>AIに認識させる「貴社独自のポジショニング」を選択してください。</h2>
        <p>AI検索のアルゴリズムは、単なる知名度ではなく「明確な比較軸」を持つ企業を優先します。貴社の事業方針や得意領域に合わせて、AI専用データベースに学習させる発信軸を決定してください。</p>
      </div>

      {/* 3つの戦略タブ */}
      <div className="strategy-selector-tabs" role="tablist" aria-label="戦略方針の選択">
        {(Object.keys(STRATEGIES) as Array<"personal" | "speed" | "succession">).map((key) => {
          const item = STRATEGIES[key];
          const isActive = selectedStrategy === key;
          return (
            <button
              type="button"
              role="tab"
              aria-selected={isActive}
              key={item.id}
              className={`strategy-tab-btn ${isActive ? "active" : ""}`}
              onClick={() => setSelectedStrategy(key)}
            >
              <span className="tab-badge">{item.code}</span>
              <strong>{item.name}</strong>
              <small>{item.targetMarket}</small>
            </button>
          );
        })}
      </div>

      {/* 選択された戦略の核（Core Thesis） */}
      <div className="winning-angle-card" style={{ marginTop: "24px" }}>
        <div className="winning-angle-badge">AIに学習させる独自の看板（提供価値）</div>
        <h3>{current.coreThesis}</h3>
        <p className="winning-angle-summary">{current.strategicReason}</p>
      </div>

      {/* 競合他社との構造的差別化分析 */}
      <div className="competitor-weakness-block">
        <h3>競合大手に対する構造的差別化ポイント</h3>
        <p className="block-desc">AI検索エンジンが「なぜ貴社を優先すべきか」を論理的に判定するための客観的優位性です。</p>
        <div className="weakness-grid">
          {current.competitorAnalysis.map((item) => (
            <article className="weakness-card" key={item.name}>
              <div className="weakness-card-head">
                <span className="competitor-tag">{item.name}</span>
                <strong className="competitor-gap">競合の課題: {item.gap}</strong>
              </div>
              <div className="our-advantage-box">
                <span className="advantage-label">貴社が提示する優位性：</span>
                <p>{item.differentiation}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* 成果物：すぐに公式展開できるテキスト群 */}
      <div className="actionable-messages-block">
        <div className="actionable-messages-head">
          <div>
            <h3>公式チャネル向け展開案（実務用成果物）</h3>
            <p className="block-desc">選定した戦略軸に合わせて整合させた公式プロフィール・Webコンテンツ・配布資料の下書きです。</p>
          </div>
        </div>

        <div className="actionable-messages-list">
          {(["profile", "website", "brief"] as const).map((key) => {
            const item = current.deliverables[key];
            return (
              <article className="actionable-message-card" key={key}>
                <div className="actionable-card-header">
                  <div>
                    <span className="channel-badge">{item.label}</span>
                  </div>
                  <button
                    type="button"
                    className="button-copy"
                    onClick={() => copyToClipboard(item.text, key)}
                    aria-label={`${item.label}をコピー`}
                  >
                    {copiedKey === key ? "コピーしました" : "文章をコピー"}
                  </button>
                </div>
                <div className="actionable-copy-box">
                  <pre>{item.text}</pre>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* 運用体制の比較：手動運用 vs 自動継続モニタリング */}
      <div className="autopilot-comparison-box">
        <div className="autopilot-head">
          <span className="autopilot-pill">運用体制の検討</span>
          <h3>AI検索市場の変化に合わせた「継続的アップデート」が必要です。</h3>
          <p>
            AI検索エンジンの回答ロジックや競合他社のWeb更新は毎週変動しています。一度の施策で終わらせず、貴社が常に最適な候補として推薦され続けるための運用体制をお選びいただけます。
          </p>
        </div>

        <div className="autopilot-table">
          <div className="autopilot-row head">
            <div className="col-feature">管理項目</div>
            <div className="col-free">無料診断（手動運用）</div>
            <div className="col-paid">AI推薦枠・自動見守りプラン（月額 10,780円 税込）</div>
          </div>
          <div className="autopilot-row">
            <div className="col-feature">AI専用公式DBの更新</div>
            <div className="col-free">現時点の静的ページを1回発行のみ</div>
            <div className="col-paid highlight"><strong>競合の動向・市場の変化に応じて毎週自動最適化</strong></div>
          </div>
          <div className="autopilot-row">
            <div className="col-feature">競合動向の監視</div>
            <div className="col-free">なし（自社での都度手動確認が必要）</div>
            <div className="col-paid highlight"><strong>同一条件での週次定点観測 ＆ 変動アラート自動送信</strong></div>
          </div>
          <div className="autopilot-row">
            <div className="col-feature">運用にかかる社内工数</div>
            <div className="col-free">都度の調査・改修に月数時間の工数が発生</div>
            <div className="col-paid highlight"><strong>完全バックグラウンド実行（実務作業工数ゼロ）</strong></div>
          </div>
        </div>

        <div className="autopilot-cta-row">
          <a href="#watch-plan" className="button button-primary">
            14日間無料トライアルで効果を検証する <ArrowIcon />
          </a>
          <small>初期費用ゼロ・契約期間の縛りなし・いつでも管理画面から即時停止可能</small>
        </div>
      </div>
    </section>
  );
}
