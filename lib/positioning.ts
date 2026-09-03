import type { ActionableMessage, CompetitorWeakness, PositioningAdvice, ScanResult } from "@/lib/types";

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

  return { winningAngle, summary, competitorWeaknesses, actionableMessages };
}
