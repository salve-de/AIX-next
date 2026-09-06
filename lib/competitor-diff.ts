/**
 * 競合Webサイトの客観テキスト差分（Diff）検知モジュール
 * 料金・対応スピード・実績・仕様に関する変更前後の証拠をプログラムで抽出し、架空作文を完全排除する。
 */

export type CompetitorDiffEvidence = {
  dimension: "料金・費用" | "納期・対応スピード" | "相談・対応体制" | "実績・認証" | "サービス仕様";
  beforeSnippet?: string;
  afterSnippet: string;
  detectedAt: string;
};

export type CompetitorTextDiffResult = {
  competitorName: string;
  sourceUrl: string;
  hasMeaningfulDiff: boolean;
  evidences: CompetitorDiffEvidence[];
  summary: string;
};

const DIMENSION_KEYWORDS: Record<CompetitorDiffEvidence["dimension"], RegExp> = {
  "料金・費用": /料金|費用|価格|円|見積|無料|相場|コミコミ|定額/u,
  "納期・対応スピード": /最短|即日|迅速|24時間|スピード|短納期|急ぎ|当日|翌日/u,
  "相談・対応体制": /個別|親身|伴走|専任|相談|オンライン|来社|出張|サポート/u,
  "実績・認証": /創業|年|実績|件|選ばれ|免許|認証|ISO|登録|受賞/u,
  "サービス仕様": /対応|エリア|地域|範囲|買取|仲介|解体|処分|保証/u,
};

/**
 * 2つのテキスト（過去と現在）を行単位で比較し、主要次元に関連する変更スニペットを客観抽出する
 */
export function extractCompetitorTextDiff(options: {
  competitorName: string;
  sourceUrl: string;
  previousText?: string;
  currentText: string;
  now?: string;
}): CompetitorTextDiffResult {
  const {
    competitorName,
    sourceUrl,
    previousText = "",
    currentText,
    now = new Date().toISOString(),
  } = options;

  const prevLines = new Set(
    previousText
      .split(/[\n。]+/u)
      .map((l) => l.trim())
      .filter((l) => l.length > 8)
  );

  const currentLines = currentText
    .split(/[\n。]+/u)
    .map((l) => l.trim())
    .filter((l) => l.length > 8);

  const evidences: CompetitorDiffEvidence[] = [];

  for (const line of currentLines) {
    if (prevLines.has(line)) continue; // 変化なし行はスキップ

    for (const [dimension, regex] of Object.entries(DIMENSION_KEYWORDS) as Array<[
      CompetitorDiffEvidence["dimension"],
      RegExp
    ]>) {
      if (regex.test(line)) {
        // すでに同一次元が登録済みの場合はスキップ（最大1件ずつ）
        if (evidences.some((e) => e.dimension === dimension)) continue;

        evidences.push({
          dimension,
          afterSnippet: line.slice(0, 100),
          detectedAt: now,
        });
      }
    }

    if (evidences.length >= 3) break;
  }

  const hasMeaningfulDiff = evidences.length > 0;
  const dimensionLabels = evidences.map((e) => e.dimension).join("・");

  const summary = hasMeaningfulDiff
    ? `競合「${competitorName}」の公開ページ（${sourceUrl}）において【${dimensionLabels}】に関する新規公開・変更記述を検知`
    : `競合「${competitorName}」の公開ページに変更は検出されませんでした`;

  return {
    competitorName,
    sourceUrl,
    hasMeaningfulDiff,
    evidences,
    summary,
  };
}
