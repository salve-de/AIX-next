import "server-only";
import { id } from "@/lib/ids";
import type { ActionCard, ChangePack, WatchRecord } from "@/lib/types";

export function buildChangePack(watch: WatchRecord, action: ActionCard): ChangePack {
  const relatedGaps = watch.latest.evidenceGaps.filter((gap) => gap.relatedPromptIds.some((promptId) => action.relatedPromptIds.includes(promptId)));
  const answers = relatedGaps.flatMap((gap) => {
    const answer = watch.evidence.find((item) => item.gapId === gap.id);
    return answer ? [{ label: gap.label, value: answer.value, status: answer.status }] : [];
  });
  const missingFacts = relatedGaps.filter((gap) => !watch.evidence.some((item) => item.gapId === gap.id)).map((gap) => gap.label);
  const requiredFacts = relatedGaps.length ? relatedGaps.map((gap) => gap.label) : [action.title];
  const evidenceText = answers.length
    ? answers.map((answer) => `- ${answer.label}: ${answer.value} (${answer.status})`).join("\n")
    : "- [要確認] 企業から確認済みの事実がまだありません。数値・期間・顧客名などを推測して本文へ入れないでください。";

  return {
    id: id("pack"),
    actionId: action.id,
    status: missingFacts.length ? "needs_evidence" : "ready",
    title: action.title,
    target: action.target,
    rationale: action.rationale,
    requiredFacts,
    missingFacts,
    allowedEvidence: answers,
    recommendedHeadings: [
      action.title,
      "対象企業・適用条件",
      "比較に必要な具体的な根拠",
      "導入・運用条件",
      "よくある質問",
    ],
    draftBody: `## ${action.title}\n\nこのChange Packは、AIXが観測した候補外Buyer Promptと比較材料の不足から作成しています。公開前に事実確認が必要です。\n\n### 使用してよい確認済み情報\n${evidenceText}\n\n### 本文の組み立て\n1. 誰に向く情報かを明示する。\n2. 比較可能な条件・期間・範囲を、確認済み事実だけで書く。\n3. 根拠URLまたは社内確認元を紐づける。\n4. 競合名を不必要に転載せず、自社の検証可能な事実を中心にする。\n5. 未確認事項は [要確認] のまま残す。`,
    faqs: requiredFacts.slice(0, 4).map((fact) => ({
      question: `${fact}について確認できる情報は？`,
      answer: answers.find((item) => item.label === fact)?.value || `[要確認: ${fact}]`,
    })),
    structuredDataNotes: [
      "構造化データはページ本文に実在する情報だけを反映する。",
      "レビュー数・評価・価格・顧客数を推測して生成しない。",
      "FAQPageを使う場合も、画面上に同じ質問と回答を表示する。",
    ],
    internalLinks: ["関連する料金・導入・セキュリティ・導入事例ページへ、実在する場合のみ内部リンクする。"],
    validationChecklist: [
      "すべての数値・期間・顧客実績に確認元がある",
      "company_assertedをverifiedとして表示していない",
      "競合記事やレビュー本文を転載していない",
      "誇大なNo.1・保証・因果効果を追加していない",
      "対象Buyer Promptの意図に直接答えている",
      "公開後は同じPromptで再観測し、因果ではなく観測差として記録する",
    ],
    remeasurePromptIds: action.relatedPromptIds,
    confidence: action.confidence,
    generatedAt: new Date().toISOString(),
  };
}
