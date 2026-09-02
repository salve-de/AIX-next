import type { BuyerPrompt, ScanResult } from "@/lib/types";

export type BuyerOpportunity = {
  promptId: string;
  prompt: string;
  priority: number;
  band: "critical" | "high" | "medium" | "monitor";
  why: string[];
  lostRate: number;
  winner: string | null;
  relatedEvidence: number;
  importance: number;
};

function promptById(result: ScanResult, id: string): BuyerPrompt | undefined {
  return result.prompts.find((prompt) => prompt.id === id);
}

export function buildBuyerOpportunities(result: ScanResult): BuyerOpportunity[] {
  const rows = result.prompts.map((prompt) => {
    const observations = result.observations.filter((item) => item.promptId === prompt.id && item.status === "success");
    const losses = observations.filter((item) => !item.ownRecommended);
    const lostRate = observations.length ? Math.round(losses.length / observations.length * 100) : 0;
    const firstChoiceCounts = new Map<string, number>();
    for (const item of observations) {
      if (!item.firstCandidate) continue;
      firstChoiceCounts.set(item.firstCandidate, (firstChoiceCounts.get(item.firstCandidate) || 0) + 1);
    }
    const winner = [...firstChoiceCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] || null;
    const winnerAgreement = observations.length && winner ? (firstChoiceCounts.get(winner) || 0) / observations.length : 0;
    const relatedGaps = result.evidenceGaps.filter((gap) => gap.relatedPromptIds.includes(prompt.id));
    const evidenceConfidence = relatedGaps.length ? Math.max(...relatedGaps.map((gap) => gap.confidence)) : 0;

    // Transparent priority, not a market-demand score.
    // 35% buyer importance, 35% observed loss rate, 15% repeated winner agreement,
    // 15% evidence-gap confidence. All components are visible in AIX.
    const importanceScore = Math.max(1, Math.min(5, prompt.importance)) / 5;
    const lossScore = lostRate / 100;
    const score = Math.round((importanceScore * .35 + lossScore * .35 + winnerAgreement * .15 + evidenceConfidence * .15) * 100);
    const why: string[] = [];
    if (prompt.importance >= 5) why.push("購入意図の重要度が高い");
    if (lostRate >= 67) why.push(`${lostRate}%の成功回答で候補外`);
    else if (lostRate >= 34) why.push(`${lostRate}%の成功回答で候補外`);
    if (winner && winnerAgreement >= .5) why.push(`${winner}が複数AIで第一候補`);
    if (relatedGaps.length) why.push(`${relatedGaps.length}件の比較材料不足と関連`);
    if (!observations.length) why.push("成功Observationがなく優先度の確度が低い");

    return {
      promptId: prompt.id,
      prompt: prompt.text,
      priority: score,
      band: score >= 75 ? "critical" as const : score >= 60 ? "high" as const : score >= 40 ? "medium" as const : "monitor" as const,
      why,
      lostRate,
      winner,
      relatedEvidence: relatedGaps.length,
      importance: prompt.importance,
    };
  });
  return rows.sort((a, b) => b.priority - a.priority || b.importance - a.importance);
}

export function opportunityForPrompt(result: ScanResult, promptId: string) {
  const prompt = promptById(result, promptId);
  return prompt ? buildBuyerOpportunities(result).find((item) => item.promptId === prompt.id) || null : null;
}
