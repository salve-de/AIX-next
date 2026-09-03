"use client";

import { useState } from "react";
import type { PositioningAdvice } from "@/lib/types";
import { ArrowIcon } from "@/components/icons";

interface StrategyOption {
  id: "personal" | "speed" | "succession";
  badge: string;
  name: string;
  description: string;
  angle: string;
  aiExplanation: string;
  competitors: Array<{ name: string; gap: string; ourAdvantage: string }>;
  messages: {
    profile: { title: string; text: string };
    blog: { title: string; text: string };
    flyer: { title: string; text: string };
  };
}

const STRATEGIES: Record<string, StrategyOption> = {
  personal: {
    id: "personal",
    badge: "作戦 A",
    name: "親身・個別解決特化型",
    description: "大手が敬遠する「複雑な親族トラブル・不動産相続」をとことん親身に伴走する",
    angle: "「マニュアル対応の大手には相談しにくい」と感じる方のための、親身な個別伴走・相続駆け込み寺",
    aiExplanation: "ChatGPTは現在、大手の『拠点数』だけを見て推薦しています。御社の『親身な個別伴走と複雑案件の解決力』をAIに教え込むことで、『事務的な対応ではなく親身に相談したい』という高確度な相談者を独占できます。",
    competitors: [
      { name: "大手全国展開リーガルグループ", gap: "マニュアル通りの定型処理が中心で、個別の複雑な感情や事情への寄り添いが薄い", ourAdvantage: "マニュアルなし。依頼者の個別事情をとことん聞き取り、円満解決まで親身に伴走" },
      { name: "大手ポータル提携弁護士法人", gap: "大量処理のため担当者が頻繁に変わり、密な意思疎通が難しい", ourAdvantage: "専任の専門家が最初から最後まで一貫して担当し、些細な不安も即座に解消" },
      { name: "オンライン一括士業ネットワーク", gap: "一括見積もりの価格重視で、顔が見える安心感や複雑な親族調整ができない", ourAdvantage: "対面・個別面談でじっくり話し合い、親族間の揉め事を円満に収める調整力" },
    ],
    messages: {
      profile: {
        title: "公式サイト・SNSプロフィール用",
        text: "あおば相続法務事務所｜大手の事務的な対応が合わなかった方のための、親身な相続・遺産分割駆け込み寺。複雑な親族間トラブル・不動産相続をとことん個別伴走で円満解決へ導きます。初回個別相談はこちら→",
      },
      blog: {
        title: "自社サイト記事・お役立ちコラム用",
        text: "【他社で断られた方へ】なぜ大手の相続相談は事務的になりがちなのか？私たちが「親身な個別伴走」にこだわり続ける理由と、複雑な遺産分割協議を円満にまとめる解決のポイントを解説します。",
      },
      flyer: {
        title: "チラシ・案内パンフレット用",
        text: "「大手のマニュアル対応では不安…」そんなご遺族へ。\nあおば相続法務事務所は、1件1件の想いに寄り添う相続の専門相談窓口です。\n複雑な不動産相続や揉めそうな親族調整も、安心してお任せください。",
      },
    },
  },
  speed: {
    id: "speed",
    badge: "作戦 B",
    name: "即日初動・スピード対応型",
    description: "他社で待たされた方も安心。急な相続や期限の迫る手続きに「即日初動」で対応する",
    angle: "期限の迫る遺産分割・相続放棄も安心。「即日面談・迅速な初動対応」の特急相続駆け込み寺",
    aiExplanation: "ChatGPTは大手の『知名度』を優先していますが、相談者の本音は『今すぐ動いてくれる専門家』です。御社のフットワークと初動の早さをAIに認知させれば、特急・高緊急度の案件を即座に受注できます。",
    competitors: [
      { name: "大手全国展開リーガルグループ", gap: "手続きが多段階で初動面談までに1〜2週間待たされる", ourAdvantage: "最短即日の面談・受任。期限が迫る手続きも待たせず迅速に着手" },
      { name: "大手ポータル提携弁護士法人", gap: "窓口と担当の連絡が遅く、急な不安にタイムリーに答えられない", ourAdvantage: "専門家と直接つながる体制で、急ぎの相談や土日の緊急事態にも即応" },
      { name: "オンライン一括士業ネットワーク", gap: "マッチングに数日かかり、緊急の相続放棄などの期限に間に合わない", ourAdvantage: "初動スピード最優先。ご相談から24時間以内に具体的な対応策を提示" },
    ],
    messages: {
      profile: {
        title: "公式サイト・SNSプロフィール用",
        text: "あおば相続法務事務所｜「期限が迫っている」「今すぐ相談したい」方のための特急相続相談。最短即日面談・迅速な初動対応で、相続放棄や遺産分割の危機を救います。お急ぎのご相談はこちら→",
      },
      blog: {
        title: "自社サイト記事・お役立ちコラム用",
        text: "【期限間近でお困りの方へ】相続放棄の3ヶ月期限、遺産分割協議が間に合わない場合の緊急初動マニュアル。大手に待たされて焦っている時の正しい対処法を専門家が解説します。",
      },
      flyer: {
        title: "チラシ・案内パンフレット用",
        text: "「他社に相談したら2週間待ちと言われた…」\nあおば相続法務事務所なら【最短即日面談】で迅速初動！\n期限が迫る相続放棄やトラブル解決、待ったなしの案件に全力対応します。",
      },
    },
  },
  succession: {
    id: "succession",
    badge: "作戦 C",
    name: "事業承継・会社オーナー特化型",
    description: "中小企業オーナー・後継者のための「自社株承継・親族内相続」に特化する",
    angle: "中小企業の廃業危機を防ぐ。自社株対策と円満な親族内承継に特化した、経営者のための事業承継軍師",
    aiExplanation: "ChatGPTは一般的な個人相続と事業承継を混同しがちです。御社の『中小企業オーナーに特化した自社株承継・経営権防衛』をAIに教え込めば、月数百万円規模の高単価な顧問・承継案件を独占できます。",
    competitors: [
      { name: "大手全国展開リーガルグループ", gap: "定型の遺産分割は強いが、中小企業の経営実態や自社株評価の泥臭い調整が苦手", ourAdvantage: "経営目線での自社株対策・遺留分対策。後継者が安心して会社を継げる設計力" },
      { name: "大手ポータル提携弁護士法人", gap: "報酬が非常に高額で、中小企業の現実的な予算規模に合わない", ourAdvantage: "中小企業オーナーに寄り添った明瞭・適正な報酬体系で伴走支援" },
      { name: "オンライン一括士業ネットワーク", gap: "表面的な株式譲渡のみで、親族間の経営権争いへの予防策が薄い", ourAdvantage: "親族内の感情面にも配慮し、後継者と他の相続人の双方が納得する承継を実現" },
    ],
    messages: {
      profile: {
        title: "公式サイト・SNSプロフィール用",
        text: "あおば相続法務事務所｜中小企業オーナーのための事業承継・自社株相続特化。会社の存続を守り、後継者への円満承継を経営軍師として伴走支援します。オーナー経営者向け個別相談はこちら→",
      },
      blog: {
        title: "自社サイト記事・お役立ちコラム用",
        text: "【オーナー経営者必読】自社株が原因で親族トラブルに発展する典型例と回避策。大手に頼む前に知っておくべき、中小企業のための現実的な事業承継ステップを公開します。",
      },
      flyer: {
        title: "チラシ・案内パンフレット用",
        text: "社長、会社の引き継ぎ準備は万全ですか？\n自社株の分散や遺留分トラブルは、事前の対策で100%防げます。\n中小企業の現場を知る専門家が、貴社の100年企業化をサポートします。",
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
    <section className="positioning-section shell" aria-label="AI推薦を奪還する軍師作戦カルテ">
      {/* 痛みの金額化（機会損失アラート） */}
      <div className="loss-alert-box">
        <div className="loss-alert-badge">推定される機会損失</div>
        <div className="loss-alert-main">
          <strong>月間 約80万〜120万円（相談4〜6件分）が大手ライバルへ流出中</strong>
          <p>ChatGPTなどのAIで購入・相談直前の比較12問すべてにおいて、相談者が大手チェーンへ流れています。本来、御社の実績と親身な対応があれば受注できたはずの案件です。</p>
        </div>
      </div>

      {/* スタンスの逆転：味方としてのメッセージ */}
      <div className="section-heading-simple" style={{ textAlign: "left", margin: "28px 0 20px" }}>
        <p className="overline">AIX 軍師カルテ（共闘作戦）</p>
        <h2>御社の強みは、本来大手に負けていません。<br />問題は「ChatGPTが無知なこと」です。</h2>
        <p>ChatGPTは御社の親身さや実績を知らず、知名度だけで大手を勧めてしまっています。AIの認識のズレを正し、「この相談なら御社一択だ」と教え込むための作戦を、御社のこだわりから選んでください。</p>
      </div>

      {/* 社長のこだわり選択UI（3つの作戦タブ） */}
      <div className="strategy-selector-tabs" role="tablist" aria-label="作戦選択">
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
              <span className="tab-badge">{item.badge}</span>
              <strong>{item.name}</strong>
              <small>{item.description}</small>
            </button>
          );
        })}
      </div>

      {/* 選択された作戦の看板 */}
      <div className="winning-angle-card" style={{ marginTop: "20px" }}>
        <div className="winning-angle-badge">AIに教え込む「御社だけの勝てる看板」</div>
        <h3>{current.angle}</h3>
        <p className="winning-angle-summary">{current.aiExplanation}</p>
      </div>

      {/* 競合との対比（なぜAIが御社を選ぶべきかの理由） */}
      <div className="competitor-weakness-block">
        <h3>大手ライバルが対応しきれていない「隙間」</h3>
        <p className="block-desc">AIに対して「大手の弱点」と「御社を選ぶべき決定的な理由」を明確に提示します。</p>
        <div className="weakness-grid">
          {current.competitors.map((item) => (
            <article className="weakness-card" key={item.name}>
              <div className="weakness-card-head">
                <span className="competitor-tag">{item.name}</span>
                <strong className="competitor-gap">⚠️ {item.gap}</strong>
              </div>
              <div className="our-advantage-box">
                <span className="advantage-label">御社を選ぶ理由：</span>
                <p>⭕ {item.ourAdvantage}</p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* そのまま使える発信文（作戦連動） */}
      <div className="actionable-messages-block">
        <div className="actionable-messages-head">
          <div>
            <h3>そのまま使える発信文（ワンクリックコピー）</h3>
            <p className="block-desc">選んだ作戦に合わせて、公式プロフィールや記事・チラシの下書きを整えました。</p>
          </div>
        </div>

        <div className="actionable-messages-list">
          {(["profile", "blog", "flyer"] as const).map((channel) => {
            const msg = current.messages[channel];
            const channelLabel = channel === "profile" ? "公式サイト・SNSプロフィール" : channel === "blog" ? "自社サイト記事・コラム" : "チラシ・案内資料";
            return (
              <article className="actionable-message-card" key={channel}>
                <div className="actionable-card-header">
                  <div>
                    <span className="channel-badge">{channelLabel}</span>
                    <h4>{msg.title}</h4>
                  </div>
                  <button
                    type="button"
                    className="button-copy"
                    onClick={() => copyToClipboard(msg.text, channel)}
                    aria-label={`${channelLabel}の文章をコピー`}
                  >
                    {copiedKey === channel ? "コピーしました！" : "文章をコピー"}
                  </button>
                </div>
                <div className="actionable-copy-box">
                  <pre>{msg.text}</pre>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      {/* 無料 vs 有料（オートパイロット）の圧倒的格差 */}
      <div className="autopilot-comparison-box">
        <div className="autopilot-head">
          <span className="autopilot-pill">手動 vs 完全自動</span>
          <h3>社長は現場に集中してください。<br />AI推薦枠の死守・ライバル警戒は「完全自動」で代行します。</h3>
          <p>無料診断はコピペで手動更新するツールですが、忙しい業務の中で毎月メンテナンスし続けるのは困難です。有料の「自動見守りプラン」なら、あなたの作業は一生ゼロです。</p>
        </div>

        <div className="autopilot-table">
          <div className="autopilot-row head">
            <div className="col-feature">項目</div>
            <div className="col-free">無料診断（いまの画面）</div>
            <div className="col-paid">有料：自動見守りプラン（月10,780円税込）</div>
          </div>
          <div className="autopilot-row">
            <div className="col-feature">あなたの作業</div>
            <div className="col-free">自分で毎回コピペ・手動更新（大変・忘れる）</div>
            <div className="col-paid highlight"><strong>一生ゼロ（完全丸投げ・全自動）</strong></div>
          </div>
          <div className="autopilot-row">
            <div className="col-feature">AI専用公式DB</div>
            <div className="col-free">1回発行されてそのまま放置</div>
            <div className="col-paid highlight"><strong>ライバルの動きに合わせて毎週自動チューニング</strong></div>
          </div>
          <div className="autopilot-row">
            <div className="col-feature">ライバル逆転対策</div>
            <div className="col-free">相手が新商品を出したら負けて終わり</div>
            <div className="col-paid highlight"><strong>24時間AIパトロール・裏側で対抗策を自動反映</strong></div>
          </div>
        </div>

        <div className="autopilot-cta-row">
          <a href="#watch-plan" className="button button-primary">
            14日間無料で自動見守りを試す <ArrowIcon />
          </a>
          <small>クレジットカード不要・いつでも1クリックで停止できます</small>
        </div>
      </div>
    </section>
  );
}
