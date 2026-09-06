import type { ActionableMessage, CompetitorWeakness, PositioningAdvice, ScanResult, StrategicGroundingFaq, StrategyOption } from "@/lib/types";

function deriveStrategies(result: ScanResult): StrategyOption[] {
  const brand = result.discovery.brandName || "自社";
  const market = result.discovery.market || "関連市場";
  const audience = result.discovery.targetCustomers[0] || "検討中の人";
  const useCase = result.discovery.useCases[0] || "利用場面";
  const gap = result.evidenceGaps[0]?.label || "選ぶために必要な情報";
  const observedCandidates = result.competitors.slice(0, 3);
  const candidateRows = observedCandidates.map((candidate) => {
    return {
      name: candidate.name,
      gap: `今回の回答で、${candidate.name}が候補に含まれました`,
      differentiation: `${brand}について、${gap}を参照元付きで確認できるように整理します`,
    };
  });

  const makeStrategy = (input: {
    id: string;
    code: string;
    name: string;
    title: string;
    target: string;
    reason: string;
    index: number;
  }): StrategyOption => ({
    id: input.id,
    code: input.code,
    name: input.name,
    targetMarket: input.target,
    coreThesis: input.title,
    strategicReason: input.reason,
    isRecommended: input.index === 0,
    competitorAnalysis: candidateRows,
    passionateReason: "これは公開情報に追加できる候補を示すもので、事実確認と公開前の承認が必要です。AIの推薦・順位・成果は保証しません。",
    deliverables: {
      profile: {
        label: "公開情報プロフィール案",
        text: `${brand}｜${audience}向けの${market}。${gap}について、確認できる事実と条件を参照元付きで案内します。`,
      },
      website: {
        label: "Webサイト・FAQ案",
        text: `${useCase}を検討する人向けに、${gap}の対象・条件・確認方法を、事実と参照元付きで説明します。`,
      },
      brief: {
        label: "案内文の下書き",
        text: `${brand}\n${audience}向けの${market}\n\n${gap}：対象・条件・参照元を確認できます。`,
      },
    },
  });

  return [
    makeStrategy({ id: "clarity", code: "整理 01", name: "対象・用途を明確にする", title: `${audience}が確認したい対象と用途を整理する`, target: `${audience}が${useCase}を検討する場面`, reason: `今回の質問で確認された${gap}を起点に、${brand}が対応する対象・用途・条件を、公開できる事実だけで整理します。`, index: 0 }),
    makeStrategy({ id: "conditions", code: "整理 02", name: "条件・対応範囲を明確にする", title: "利用条件と対応範囲を確認できる形にする", target: `${market}の条件を比較したい人`, reason: `価格、納期、地域、受付方法など、記載がある項目と未確認の項目を分け、比較する人が確認できる材料に整えます。`, index: 1 }),
    makeStrategy({ id: "sources", code: "整理 03", name: "参照元と更新日を整える", title: "事実の参照元と更新状況をそろえる", target: "情報の出どころと鮮度を確認したい人", reason: "参照元ページと更新日時を保持し、公開情報の変更後に同じ質問パネルで回答の変化を確認します。", index: 2 }),
  ];
}

export function deriveStrategicGroundingFaqs(result: ScanResult): StrategicGroundingFaq[] {
  const brand = result.discovery.brandName || "自社";
  const market = result.discovery.market || "関連市場";
  const gap = result.evidenceGaps[0]?.label || "選ぶために必要な情報";
  const primaryLoss = result.lostPrompts[0];
  const measuredQuestion = primaryLoss?.prompt || `${market}の候補を教えてください`;
  const answer = `今回の測定では、質問・AI・測定時点における回答を確認しました。${brand}については、${gap}を参照元付きで整理し、公開後に同じ条件で変化を確認します。`;
  const observation = primaryLoss?.winner
    ? `今回の「${measuredQuestion}」では「${primaryLoss.winner}」が先に候補に含まれました。`
    : "今回の回答ログから、比較対象になった候補を確認しました。";

  return [
    { id: "FAQ-01", q: `${brand}と他の候補を比較するとき、何を確認できますか？`, aiObservations: { chatgpt: observation, gemini: observation, claude: observation, perplexity: observation }, vulnerabilityAnalysis: "この画面で確認できるのは、指定した質問と測定条件における回答差です。市場全体の優劣や他社の弱点を断定しません。", databaseStrategy: `公開する場合は、${gap}を事実・参照元・更新状況と一緒に確認します。`, canonicalGroundingAnswer: answer },
    { id: "FAQ-02", q: `${brand}の対応条件をAIが確認できるようにするには？`, aiObservations: { chatgpt: "質問や参照元によって回答は変わります。", gemini: "掲載されている事実と参照元を確認します。", claude: "未確認の条件は推測せず、確認中として扱います。", perplexity: "参照元リンクがある情報を測定ログと照合します。" }, vulnerabilityAnalysis: "情報が見つからないことと、サービスが存在しないことは同じではありません。", databaseStrategy: "名称、分野、対応範囲、料金、受付方法などは、記載と参照元を確認してから公開します。", canonicalGroundingAnswer: answer },
    { id: "FAQ-03", q: "公開情報を整理すると、AIの回答は必ず変わりますか？", aiObservations: { chatgpt: "必ず変わるとは言えません。", gemini: "モデルや検索結果の更新で変化する可能性があります。", claude: "同じ質問・条件で再測定して確認します。", perplexity: "引用された参照元も測定時点で変わります。" }, vulnerabilityAnalysis: "公開情報の整理は参照しやすさを高める手段で、推薦結果を保証するものではありません。", databaseStrategy: "公開後に同じパネルを再測定し、結果と参照元の変化を記録します。", canonicalGroundingAnswer: "いいえ。公開情報を整理しても、AIの回答・推薦・順位・問い合わせ・売上が変わることは保証されません。" },
  ];
}

/**
 * Build an evidence-linked communication draft. Every item is a hypothesis
 * for review; the function never infers a competitor's weakness or a business
 * outcome from a prompt count.
 */
export function derivePositioningAdvice(result: ScanResult): PositioningAdvice {
  const brand = result.discovery.brandName || "自社";
  const market = result.discovery.market || "関連市場";
  const primaryGap = result.evidenceGaps[0];
  const primaryLoss = result.lostPrompts[0];
  const gapLabel = primaryGap?.label || "選ぶために必要な情報";
  const audience = result.discovery.targetCustomers[0] || "検討中の人";
  const competitors = result.competitors.slice(0, 3);

  const competitorWeaknesses: CompetitorWeakness[] = competitors.map((comp, index) => {
      const gap = result.evidenceGaps[index % Math.max(result.evidenceGaps.length, 1)];
      const loss = result.lostPrompts.find((item) => item.winner === comp.name);
      return {
        competitor: comp.name,
        weakness: loss ? `今回の「${loss.prompt}」で先に候補に含まれた` : "今回の回答で候補に含まれた",
        rationale: gap ? `${gap.label}を、自社側で確認できる情報と参照元に分けて整理します。` : "測定ログと参照元を確認し、次回も同じ条件で比較します。",
      };
    });

  const winningAngle = primaryGap
    ? `「${primaryGap.label}」を、${brand}が確認できる形にする`
    : `${brand}が候補に含まれた質問の共通点を整理する`;
  const summary = primaryLoss?.winner
    ? `今回の「${primaryLoss.prompt}」では「${primaryLoss.winner}」が先に候補に含まれました。${gapLabel}を参照元付きで整理し、公開後に同じ条件で再測定します。`
    : `${market}の測定結果をもとに、${brand}を確認するための情報を参照元付きで整理します。`;

  const actionableMessages: ActionableMessage[] = [
    { channel: "profile", channelLabel: "公開プロフィール案", headline: "誰向けの情報かを最初に示す", copy: `${brand}｜${audience}向けの${market}。${gapLabel}について、確認できる事実と条件を参照元付きで案内します。`, instruction: "記載内容と現在の提供条件を確認してから公開してください。" },
    { channel: "blog", channelLabel: "Webサイト・FAQ案", headline: "比較される質問に答えを置く", copy: `記事タイトル案：${brand}の${gapLabel}について\n\n対象・条件・手順・参照元を、確認できる事実だけで説明します。未確認の項目は推測せず、確認方法を案内します。`, instruction: "参照元と公開範囲を確認し、必要な部分だけ掲載してください。" },
    { channel: "flyer", channelLabel: "営業資料・商品ページ案", headline: "選ぶ前に知りたい条件を示す", copy: `${brand}\n${audience}向けの${market}\n\n${gapLabel}：対象・条件・確認方法を掲載\n詳しい内容と参照元→`, instruction: "記載内容が現在の提供条件と一致するか確認してください。" },
  ];

  return { winningAngle, summary, competitorWeaknesses, actionableMessages, strategies: deriveStrategies(result), strategicFaqs: deriveStrategicGroundingFaqs(result) };
}
