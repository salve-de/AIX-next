import type { ActionableMessage, CompetitorWeakness, PositioningAdvice, ScanResult, StrategyOption } from "@/lib/types";

function deriveStrategies(result: ScanResult): StrategyOption[] {
  const brand = result.discovery.brandName || "貴社";
  const market = result.discovery.market || "専門市場";
  const target1 = result.discovery.targetCustomers[0] || "検討中のお客様";
  const target2 = result.discovery.targetCustomers[1] || target1;
  const useCase1 = result.discovery.useCases[0] || "専門的な課題の解決";
  const useCase2 = result.discovery.useCases[1] || useCase1;
  const competitors = result.competitors.slice(0, 3);

  const compAnalysis1 = competitors.map((c, i) => {
    const gaps = [
      "画一的な定型処理が中心で、個別事情や感情面への寄り添いが手薄になりがち",
      "大量処理のため担当者の交代が多く、密な意思疎通が難しい",
      "表面的な価格訴求が主で、複雑なトラブルや個別事情の調停力が不足",
    ];
    const diffs = [
      `マニュアルなし。${brand}は${target1}の個別事情を丁寧に聞き取る個別伴走体制`,
      `専任の専門担当者が初動から完了まで一貫して担当する責任体制`,
      `対面・個別対話を通じ、複雑な課題を円満にまとめる調整力`,
    ];
    return { name: c.name, gap: gaps[i % gaps.length], differentiation: diffs[i % diffs.length] };
  });

  const compAnalysis2 = competitors.map((c, i) => {
    const gaps = [
      "手続きが多層的で、初回対応や着手までにリードタイムが発生",
      "総合窓口からの社内引き継ぎに時間を要し、タイムリーな回答が得にくい",
      "マッチングや手配に日数を要し、期限が迫る緊急対応に間に合わないリスク",
    ];
    const diffs = [
      `最短即日の初動対応。期限が迫る緊急案件も待たせず迅速に着手`,
      `直接専門家とつながる即応体制で、突発的な不安も即座に解消`,
      `ご相談から速やかに具体的な対応方針とスケジュールを提示`,
    ];
    return { name: c.name, gap: gaps[i % gaps.length], differentiation: diffs[i % diffs.length] };
  });

  const compAnalysis3 = competitors.map((c, i) => {
    const gaps = [
      "定型業務には強いが、専門特化領域の泥臭い実務調整が不得手",
      "大手企業向けの超高額な料金設定で、現実的な事業規模に適合しない",
      "画一的な書類作成にとどまり、根本的な問題解決や予防策が薄い",
    ];
    const diffs = [
      `${useCase2}に特化した実践的な設計力と問題解決力`,
      `現場の実態に即した、明瞭・適正な費用体系での継続支援`,
      `将来的なトラブルまで深く配慮し、関係者全員が納得する解決を実現`,
    ];
    return { name: c.name, gap: gaps[i % gaps.length], differentiation: diffs[i % diffs.length] };
  });

  return [
    {
      id: "personal",
      code: "戦略 01",
      name: "個別伴走・柔軟対応型",
      targetMarket: `大手の画一的な対応に不安を抱える${target1}`,
      coreThesis: `「画一的な大手には相談しづらい」層を受け止める、親身な個別伴走の専門窓口`,
      strategicReason: `AI検索は現在、競合大手の『知名度・規模』を参照して機械的に推薦しています。貴社が持つ『${useCase1}への個別伴走実績』をAI専用データベースに構造化して認知させることで、『事務的ではない親身な専門家』を探す高確度な検討者を独占的に引き戻すことが可能です。`,
      isRecommended: true,
      revenueImpact: "受任単価・利益率が最も高い中核領域（相見積もりなしの指名獲得）",
      passionateReason: "【分析所見】御社が最も差別化され、かつ受任単価・利益率が最大化する中核領域です。大手全国グループはマニュアル対応に依存しており、親族間の複雑な個別事情の調整力に構造的な弱点を抱えています。一方、御社はここに明確な優位性と解決実績を持っています。この高付加価値な相談者がAIの認識不足によって大手に流出している現状は、重大な機会損失です。AI公式データベースへ本看板を最優先で登録することを強く推奨します。",
      competitorAnalysis: compAnalysis1,
      deliverables: {
        profile: {
          label: "公式プロフィール（SNS・ポータル）",
          text: `${brand}｜大手の事務的対応に不安を感じる方のための、親身な${market}相談窓口。${useCase1}をとことん個別伴走で円満解決へ導きます。初回個別相談受付中。`,
        },
        website: {
          label: "Webサイト・コラム掲載用",
          text: `【他社で相談が合わなかった方へ】${market}は画一的なマニュアルでは解決できません。私たちが「親身な個別伴走」にこだわり、${useCase1}を円満に解決してきた理由と具体的な進め方を解説します。`,
        },
        brief: {
          label: "相談案内・配布用サマリー",
          text: `「大手のマニュアル対応では話しづらい…」そんなご相談者様へ。\n${brand}は、1件1件の背景に寄り添う専門相談所です。\n他社で断られた複雑な${useCase1}も、安心してお話しください。`,
        },
      },
    },
    {
      id: "speed",
      code: "戦略 02",
      name: "初動即応・スピード解決型",
      targetMarket: `期限が迫っている、または他社で面談・納期待ちが発生している${target1}`,
      coreThesis: `待たせない初動対応。「最短即日着手・迅速なレスポンス」の特急相談窓口`,
      strategicReason: `AI検索は大手チェーンを優先表示しますが、相談者の緊急度が極めて高い場合、AIは『初動スピードの確実性』を評価軸に切り替えます。貴社のフットワークと即応体制をAIにインデックスさせることで、即決性の高い緊急案件を確実に獲得できます。`,
      isRecommended: false,
      revenueImpact: "即決・成約スピードが最速（問い合わせから受任までのリードタイム短縮）",
      passionateReason: "【分析所見】初回面談までのリードタイムを重視する検討者を即座に獲得する実効性の高い戦略です。ただし無料枠（1枠）で最大の売上インパクトと競合差別化を狙う場合、まずは戦略01をAIへインデックスさせることを推奨します。",
      competitorAnalysis: compAnalysis2,
      deliverables: {
        profile: {
          label: "公式プロフィール（SNS・ポータル）",
          text: `${brand}｜「期限が迫っている」「待たずに相談したい」方のための特急${market}窓口。最短即日の面談・迅速な初動対応で、緊急手続きを確実に支援します。お急ぎの相談窓口はこちら。`,
        },
        website: {
          label: "Webサイト・コラム掲載用",
          text: `【お急ぎの方へ】${useCase1}の初動で焦っていませんか？大手の予約待ちで時間を失うリスクと、最短即日で専門家が動き出す緊急対応の進め方を解説します。`,
        },
        brief: {
          label: "相談案内・配布用サマリー",
          text: `「他社に相談したら2週間先と言われた…」\n${brand}なら【最短即日面談】で迅速着手！\n緊急性の高い手続きを、最優先でサポートします。`,
        },
      },
    },
    {
      id: "succession",
      code: "戦略 03",
      name: `${useCase2 || "特定領域"}・専門特化型`,
      targetMarket: `${target2}のための${useCase2 || "専門課題"}特化`,
      coreThesis: `${target2}の課題を防ぐ。${useCase2}に特化した、専門戦略参謀`,
      strategicReason: `AI検索は一般的な相談と高度な専門課題を混同しがちです。貴社が『${useCase2}』に特化した専門性を持つことをAI専用ページで明確に証明することで、高単価な案件の第一想起を獲得できます。`,
      isRecommended: false,
      revenueImpact: "競合との価格競争を無効化する高付加価値特化",
      passionateReason: "【分析所見】大手が対応できない高難度・専門領域に特化し、価格競争を無効化する高付加価値戦略です。戦略01の伴走支援と併用することで、市場シェアを強固に防衛できます。",
      competitorAnalysis: compAnalysis3,
      deliverables: {
        profile: {
          label: "公式プロフィール（SNS・ポータル）",
          text: `${brand}｜${target2}のための${useCase2}特化窓口。専門参謀として伴走支援します。専用個別相談を受付中。`,
        },
        website: {
          label: "Webサイト・コラム掲載用",
          text: `【${target2}向け】大手の定型サービスではカバーできない、${useCase2}の現実的な解決ステップを解説します。`,
        },
        brief: {
          label: "相談案内・配布用サマリー",
          text: `ご担当者様、${useCase2}の準備は万全ですか？\n現場を知る専門家が、貴社を強力にサポートします。`,
        },
      },
    },
  ];
}

/**
 * Build a small marketing handoff from observed scan evidence.
 * It intentionally does not invent a competitor's weakness or promise a
 * ranking/revenue outcome; every suggestion remains a draft for review.
 */
export function derivePositioningAdvice(result: ScanResult): PositioningAdvice {
  const brand = result.discovery.brandName || "自社製品";
  const market = result.discovery.market || "関連市場";
  const competitors = result.competitors.slice(0, 3);
  const primaryGap = result.evidenceGaps[0];
  const primaryLoss = result.lostPrompts[0];
  const gapLabel = primaryGap?.label || "選ぶ理由";
  const audience = result.discovery.targetCustomers[0] || "検討中の顧客";

  // 競合の弱点を推測せず、今回の比較で確認できた自社側の差だけを表示する。
  const competitorWeaknesses: CompetitorWeakness[] = competitors.map((comp, idx) => {
    const gap = result.evidenceGaps[idx % Math.max(result.evidenceGaps.length, 1)];
    const loss = result.lostPrompts.find((item) => item.winner === comp.name);
    const weakness = gap
      ? `${gap.label}を、自社の公開ページで確認できる情報が不足`
      : loss
        ? `「${loss.prompt}」で${comp.name}が先に候補に入った`
        : `今回の比較で${comp.name}が候補に入った`;
    const rationale = loss
      ? `今回の「${loss.prompt}」では${comp.name}が先に挙がりました。${gap?.whyItMatters || "自社を選ぶ根拠を、比較時に確認できる形へ整理します。"}`
      : gap?.whyItMatters || "この差が生じた質問と公開根拠を、次回の比較でも確認します。";
    return { competitor: comp.name, weakness, rationale };
  });

  if (!competitorWeaknesses.length) {
    competitorWeaknesses.push({
      competitor: "今回の比較結果",
      weakness: `${gapLabel}を、自社の公開ページで確認できる情報が不足`,
      rationale: primaryGap?.whyItMatters || "比較された質問と、自社を選ぶ根拠を公開情報から確認できる形に整理します。",
    });
  }

  const winningAngle = primaryGap
    ? `「${primaryGap.label}」を、${brand}を選ぶ理由として確認できる形にする`
    : `${brand}が選ばれた質問の共通点を、次の発信に生かす`;
  const summary = primaryLoss?.winner
    ? `今回の「${primaryLoss.prompt}」では${primaryLoss.winner}が先に挙がりました。${gapLabel}を公開情報で確認できるよう整理し、比較する人が判断できる材料を増やします。`
    : `${market}の比較で確認できた質問をもとに、${brand}を選ぶ根拠を公開情報で伝わる形に整えます。`;

  const actionableMessages: ActionableMessage[] = [
    {
      channel: "profile",
      channelLabel: "公式サイト・SNSのプロフィール",
      headline: "誰向けのサービスかを最初の1行で伝える",
      copy: `${brand}｜${audience}向けの${market}。${gapLabel}を、公開している事実と条件つきで案内します。詳しくはこちら→`,
      instruction: "実際に確認できる対象・条件・実績だけを入れて、プロフィールに掲載してください。",
    },
    {
      channel: "blog",
      channelLabel: "自社サイトの記事・FAQ",
      headline: "比較される質問に、確認できる答えを置く",
      copy: `記事タイトル案：${brand}の${gapLabel}について\n\n${gapLabel}の対象・条件・手順・実績を、確認できる事実と出典つきで説明します。分からない項目は「確認中」と明記し、問い合わせ先を案内します。`,
      instruction: "今回の比較で不足していた情報だけを選び、事実を確認してから記事やFAQに追加してください。",
    },
    {
      channel: "flyer",
      channelLabel: "営業資料・提案書・商品ページ",
      headline: "選ぶ前に知りたい条件を短く示す",
      copy: `${brand}\n${audience}向けの${market}\n\n${gapLabel}：対象・条件・確認方法を掲載\n詳しい内容と問い合わせ先→`,
      instruction: "営業資料や商品ページに置き、記載内容が現在の提供条件と一致しているか確認してください。",
    },
  ];

  const strategies = deriveStrategies(result);

  return { winningAngle, summary, competitorWeaknesses, actionableMessages, strategies };
}
