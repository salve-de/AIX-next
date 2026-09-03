import type { ActionableMessage, CompetitorWeakness, PositioningAdvice, ScanResult } from "@/lib/types";

export function derivePositioningAdvice(result: ScanResult): PositioningAdvice {
  const brand = result.discovery.brandName || "自社製品";
  const market = result.discovery.market || "関連市場";
  const competitors = result.competitors.slice(0, 3);
  const primaryGap = result.evidenceGaps[0];
  const primaryLoss = result.lostPrompts[0];
  const gapLabel = primaryGap?.label || "選ぶ理由";
  const audience = result.discovery.targetCustomers[0] || "検討中の顧客";

  // 競合各社が対応しきれていない「隙間・構造的な弱み」を整理
  const competitorWeaknesses: CompetitorWeakness[] = competitors.map((comp, idx) => {
    if (idx === 0) {
      return {
        competitor: comp.name,
        weakness: "大手・知名度重視のため、細かな要望への柔軟な対応や特急・小ロット対応が難しい",
        rationale: `AIは「知名度や一般的な実績」で${comp.name}を先に挙げやすい傾向がありますが、「細かな小回り」や「個別対応の早さ」を求める買い手の質問では、自社が選ばれる大きな隙間が存在します。`,
      };
    }
    if (idx === 1) {
      return {
        competitor: comp.name,
        weakness: "品揃えや機能は広いが、相談から納品・利用開始までの手続きやハードルが重い",
        rationale: `比較検討の段階で「いますぐ相談したい」「手軽に試したい」と考える顧客にとって、${comp.name}の手順の重さは離脱要因になりやすく、自社の身軽さが強みになります。`,
      };
    }
    return {
      competitor: comp.name,
      weakness: "一般的なスペック表示にとどまり、「なぜここを選ぶべきか」という決定打のこだわりが薄い",
      rationale: `ネット上の公開情報が画一的なため、強いこだわりや特定の用途を持つ買い手に対して、自社の専門特化の看板が明確な差別化として刺さります。`,
    };
  });

  if (!competitorWeaknesses.length) {
    competitorWeaknesses.push({
      competitor: "大手・先行ライバル各社",
      weakness: "画一的なサービス・商品展開ゆえの、柔軟性・個別対応力の不足",
      rationale: "大手がカバーしきれない細かなニーズや、即座の相談対応にこそ、自社が選ばれる最大の商機があります。",
    });
  }

  // 自社が選ばれる看板（独自の強み）
  const winningAngle = primaryGap?.label
    ? `「${primaryGap.label}」に妥協しない、${brand}だけの特化ポジション`
    : `大手・競合が対応できない「小回り・即応・高品質」の駆け込み寺`;

  const summary = primaryLoss?.winner
    ? `AIは現在、知名度や一般的な情報量で「${primaryLoss.winner}」を先に勧めています。しかし、競合が対応しきれない「小回りや独自のこだわり（${gapLabel}）」をネットやSNSで明確に宣言することで、真剣に比較している買い手の質問で1位推薦を狙えます。`
    : `${market}において、ライバルの隙間となる「確かなこだわり」を前面に出すことで、AIが『このお悩みならここ一択』と迷わず推薦する状態をつくります。`;

  // そのまま使える紹介文（SNSプロフィール・ブログ・チラシ）
  const actionableMessages: ActionableMessage[] = [
    {
      channel: "profile",
      channelLabel: "公式SNS・Webプロフィール（X / Instagram / HP概要）",
      headline: "最初の1行で「誰のどんなお悩みを解決するか」を宣言する",
      copy: `【${brand}】${market}の専門。${audience}向けに、他社で対応が難しかった方もご安心ください。${gapLabel}にこだわり、1点・少量から丁寧・迅速に対応いたします。実績やお問い合わせはこちら→`,
      instruction: "X（旧Twitter）、Instagram、自社サイトの会社概要など、プロフィールの1行目にそのままコピペして設定してください。AIの読み取り優先度が最も高い情報です。",
    },
    {
      channel: "blog",
      channelLabel: "自社ブログ・note・お知らせ記事",
      headline: "「他社で断られたお客様の事例」をストーリーで届ける",
      copy: `記事タイトル: 「他社で条件が合わなかったお客様へ。${brand}が選ばれ続けている3つの理由」\n\n構成案:\n1. 業界でよくあるお悩み（納期・ロット・価格・相談のしにくさ）\n2. ${brand}だからこそ柔軟に対応できる仕組みと、現場のこだわり\n3. 実際にご利用いただいたお客様の声と具体的な実績\n4. まずはお気軽にご相談ください（お問い合わせ窓口）`,
      instruction: "この構成に沿って記事を作成し、自社サイトに投稿してください。AIが『比較検討の信頼できる根拠』として優先的に引用元（参考リンク）に採用します。",
    },
    {
      channel: "flyer",
      channelLabel: "展示会チラシ・商品同梱状・名刺裏面",
      headline: "手元に届いたお客様が、AIやネットで検索するキッカケをつくる",
      copy: `「${market}でお困りなら、まず一度${brand}へご相談ください」\n大手にはできない小回りと、確かなこだわり品質。\nネット検索・AIで『${brand} ${gapLabel}』と検索していただければ、詳しい実績をご確認いただけます。`,
      instruction: "チラシや名刺、商品に同封する手紙にそのまま印刷してください。手元でスマホやChatGPTを開いた顧客が、迷わず自社の名前で検索するようになります。",
    },
  ];

  return {
    winningAngle,
    summary,
    competitorWeaknesses,
    actionableMessages,
  };
}
