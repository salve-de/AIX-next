import type { ActionableMessage, CompetitorWeakness, PositioningAdvice, ScanResult } from "@/lib/types";

export function derivePositioningAdvice(result: ScanResult): PositioningAdvice {
  const brand = result.discovery.brandName || "自社製品";
  const market = result.discovery.market || "関連市場";
  const competitors = result.competitors.slice(0, 3);
  const primaryGap = result.evidenceGaps[0];
  const primaryLoss = result.lostPrompts[0];

  // 競合ごとの典型的な弱点パターンの導出
  const competitorWeaknesses: CompetitorWeakness[] = competitors.map((comp, idx) => {
    if (idx === 0) {
      return {
        competitor: comp.name,
        weakness: "大手・汎用型ゆえに、個別ニーズへの柔軟な対応や即時小ロット対応が難しい",
        rationale: `AIの回答では「知名度や実績」で選ばれていますが、「細かな要望への小回り」や「特定用途への特化度」では比較の隙が存在します。`,
      };
    }
    if (idx === 1) {
      return {
        competitor: comp.name,
        weakness: "機能やラインナップは広いが、導入・購入までの期間や手順が重い",
        rationale: `比較質問において、手続きの煩雑さや初期ハードルに関する公開情報が不足しており、スピード感を求める顧客を取りこぼしています。`,
      };
    }
    return {
      competitor: comp.name,
      weakness: "特定セグメントへの深掘りや、明確な差別化の根拠（こだわり・数値）が薄い",
      rationale: `一般的なスペック表示に留まっており、買い手が「なぜここでなければならないのか」を判断するための決定打が示されていません。`,
    };
  });

  if (!competitorWeaknesses.length) {
    competitorWeaknesses.push({
      competitor: "大手既存ベンダー",
      weakness: "大量生産・標準化ゆえの柔軟性・特急対応の不足",
      rationale: "大手が対応しきれないニッチな要望やスピード対応が狙い目です。",
    });
  }

  // 自社が勝てる看板（ポジショニング）
  const winningAngle = primaryGap?.label
    ? `【${primaryGap.label}】に特化した、${brand}だけの直行便ポジション`
    : `大手・競合が対応できない「小回り・即応・高品質」の駆け込み寺`;

  const summary = primaryLoss?.winner
    ? `AIは現在、知名度や一般情報で「${primaryLoss.winner}」を先に推薦しています。しかし、競合がカバーしきれない「${primaryGap?.label || "具体的対応力"}」を明確な看板として掲げることで、特定のこだわりを持つ買い手の質問で1位逆転を狙えます。`
    : `${market}において、競合の隙間となる「特化型の強み」を前面に出すことで、AIが『この用途ならここ一択』と自信を持って推薦する状態を作れます。`;

  // 全方位のアクション指示（SNS/ブログ/チラシ/プロフィール）
  const actionableMessages: ActionableMessage[] = [
    {
      channel: "profile",
      channelLabel: "公式SNS・Webプロフィール（X / Instagram / HP概要）",
      headline: "1行目で「誰のどんな困りごとを解決するか」を宣言する",
      copy: `【${brand}】${market}の専門。${primaryGap?.label ? `「${primaryGap.label}」に妥協したくない方へ。` : "大手にはない即応性と高品質。"}1個・少量からご相談可能。詳細・お問い合わせはこちら→`,
      instruction: "アカウントのプロフィール冒頭にそのままコピペして設定してください。AIのクローラーが最優先で参照する要約情報になります。",
    },
    {
      channel: "blog",
      channelLabel: "自社ブログ・note・お知らせ記事",
      headline: "「競合で断られた顧客の事例」を具体的なストーリーで書く",
      copy: `タイトル: 「他社で納期や条件が合わなかったお客様へ。${brand}が選ばれている3つの理由」\n\n本文骨子:\n1. 多くの会社が対応できない理由（業界の構造的課題）\n2. ${brand}がそれを実現できている仕組みと現場の工夫\n3. 実際にご利用いただいたお客様の声と具体的な対応実績（数値・期間）`,
      instruction: "記事として公開後、URLをサイト内からリンクしてください。AIが『比較検討記事』として高確率で引用元（Citation）に採用します。",
    },
    {
      channel: "flyer",
      channelLabel: "商品同梱状・展示会チラシ・名刺裏面",
      headline: "オフラインの印刷物にもAI検索される「指名フレーズ」を刷り込む",
      copy: `「${market}でお困りなら、まず${brand}へ」\n大手で断られた特注・こだわり品も迅速対応。\nネット検索・AIで『${brand} ${primaryGap?.label || "特徴"}』と検索してください。`,
      instruction: "顧客やバイヤーが手元でスマホやChatGPTを開いた際に、迷わず自社の特徴をプロンプトに入力させることができます。",
    },
  ];

  return {
    winningAngle,
    summary,
    competitorWeaknesses,
    actionableMessages,
  };
}
