import { proofProviders, proofVote, sameProofPanel } from "./value-proof";
import type {
  AutoAction,
  AutoActionImpact,
  CompetitorEvent,
  CrawledPage,
  MonthlyValueReport,
  PublicProfileFact,
  ScanResult,
} from "@/lib/types";

/**
 * 競合Web側の意味ある変更を検知する（Phase 3: Competitive Change Monitor）。
 *
 * ScanResult にあるのは、同じ質問に対する AI 回答の観測結果です。
 * 競合サイトのクロール前後本文、差分、保存時刻を含まないため、これだけで
 * 「競合Webが変更された」と判定することはできません。実際のクロール差分を
 * 永続化した入力をこの境界に追加するまで、イベントは生成しません。
 */
export function detectCompetitorWebChanges(
  latest: ScanResult,
  previous?: ScanResult | null,
  now = new Date().toISOString()
): CompetitorEvent[] {
  // 競合候補の増減は AI 回答の観測であり、競合Webの本文差分ではありません。
  // 現在の引数には永続化済みの競合クロール差分がないため、誤ったイベントを作らず空配列を返します。
  void latest;
  void previous;
  void now;
  return [];
}

export type PlannedAutoActionsResult = {
  actions: AutoAction[];
  factsToApply: PublicProfileFact[];
};

const SOURCE_FACT_SIGNAL = /料金|費用|価格|円|見積|無料|最短|即日|迅速|24時間|短納期|急ぎ|当日|翌日|個別|親身|伴走|専任|相談|オンライン|来社|出張|サポート|創業|実績|件|選ばれ|免許|認証|登録|受賞|対応|エリア|地域|範囲|保証/u;

function exactSourceSnippet(text: string) {
  const candidates = text
    .match(/[^。\n！？!?]+(?:[。！？!?]|$)/gu)
    ?.map((candidate) => candidate.trim())
    .filter((candidate) => candidate.length >= 8 && candidate.length <= 180) || [];

  // キーワードは候補文を選ぶためだけに使い、値はページ本文の原文をそのまま保持します。
  return candidates.find((candidate) => SOURCE_FACT_SIGNAL.test(candidate)) || null;
}

/**
 * 競合の動きに対し、自社一次情報から根拠候補を探して公開前の確認案を導出する。
 * ※ 一次情報にない事実は1ミリも作文せず、公開プロフィールへ自動反映しない。
 */
export function planAndExecuteAutoActions(options: {
  targetUrl: string;
  events: CompetitorEvent[];
  crawledPages: CrawledPage[];
  now?: string;
}): PlannedAutoActionsResult {
  const { targetUrl, events, crawledPages, now = new Date().toISOString() } = options;
  const actions: AutoAction[] = [];
  const factsToApply: PublicProfileFact[] = [];

  // 互換性のため factsToApply という返却名を残しますが、ここで返すのは
  // 承認前の候補です。公開プロフィールへの適用・公開はこの関数では行いません。

  for (const event of events) {
    let matchedFact: { label: string; value: string; sourceUrl: string } | null = null;

    for (const page of crawledPages) {
      const value = exactSourceSnippet(page.text);
      if (value && page.url) {
        matchedFact = {
          label: "自社ページの原文",
          value,
          sourceUrl: page.url,
        };
        break;
      }
    }

    // 自社ページ本文に実際に存在する短い原文がある場合だけ、公開前確認案を生成します。
    if (matchedFact) {
      const fact: PublicProfileFact = {
        label: matchedFact.label,
        value: matchedFact.value,
        sourceUrl: matchedFact.sourceUrl,
      };

      factsToApply.push(fact);

      actions.push({
        id: `act_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        triggerEventIds: [event.id],
        actionType: "profile_fact_updated",
        factLabel: fact.label,
        factValue: fact.value,
        sourceUrl: fact.sourceUrl || targetUrl,
        affectedPromptIds: event.affectedPromptIds,
        summary: `自社ページ（${matchedFact.sourceUrl}）から原文スニペットを確認案として記録しました。公開前の確認が必要です。自動反映はしません。`,
        status: "planned",
        plannedAt: now,
      });
    }
  }

  return { actions, factsToApply };
}

/**
 * 前回の自動対応がAI測定にどう影響したかを検証する（Phase 5: Remeasure & Lineage）
 * ※ 因果断定は行わず、客観的な観測変化として記録
 */
export function evaluateAutoActionImpact(
  previousActions: AutoAction[],
  latest: ScanResult,
  previous?: ScanResult | null,
  now = new Date().toISOString()
): AutoActionImpact[] {
  if (!previous || !sameProofPanel(previous, latest)) return [];
  return previousActions.flatMap(action => {
    if (action.status !== "applied" || !action.executedAt || action.beforeScanId !== previous.scanId || !(Date.parse(latest.measuredAt) > Date.parse(action.executedAt))) return [];
    const pairs = [...new Set(action.affectedPromptIds)].flatMap(id => proofProviders.flatMap(provider => {
      const b = proofVote(previous, id, provider), n = proofVote(latest, id, provider);
      return b.complete && n.complete && b.signature === n.signature ? [{id,provider,before:b.included!,after:n.included!}] : [];
    }));
    if (!pairs.length) return [];
    const before = pairs.filter(p=>p.before).length, after = pairs.filter(p=>p.after).length;
    const movement = (provider: typeof proofProviders[number]) => {
      const rows = pairs.filter(p=>p.provider===provider);
      if(!rows.length)return "unavailable" as const;
      const b=rows.filter(p=>p.before).length, n=rows.filter(p=>p.after).length;
      return n>b?"improved" as const:n<b?"declined" as const:"unchanged" as const;
    };
    return [{id:`imp_${action.id}_${latest.scanId}`,actionId:action.id,afterScanId:latest.scanId,observedUplift:after-before,
      affectedPromptCount:new Set(pairs.map(p=>p.id)).size,comparedAnswerGroups:pairs.length,
      providerAgreement:{openai:movement("openai"),gemini:movement("gemini"),perplexity:movement("perplexity")},causalConfidence:"low" as const,
      summary:`同条件の相談×AI ${pairs.length}件で、自社が候補に含まれた件数は公開前${before}件から今回${after}件へ変化しました。因果効果は未検証です。`,measuredAt:now}];
  });
}

type ReportObservation = {
  promptId: string;
  ownRecommended?: boolean;
  status?: "success" | "failed" | "skipped";
  citations?: Array<{ url?: string; domain?: string }>;
};

type ReportRun = {
  observations?: ReportObservation[];
  citations?: Array<{ url?: string; domain?: string }>;
};

function reportCitationKeys(run: ReportRun | null | undefined) {
  if (!run) return new Set<string>();
  const keys = [
    ...(run.citations || []),
    ...(run.observations || []).flatMap((observation) => observation.citations || []),
  ]
    .map((citation) => citation.url?.trim() || citation.domain?.trim() || "")
    .filter(Boolean);
  return new Set(keys);
}

function isReportObservationCountable(observation: ReportObservation) {
  // status がない旧保存データは、従来の観測レコードとして数えます。
  return !observation.status || observation.status === "success";
}

/**
 * 月次レポートを、同一質問パネルに対するAI回答観測・参照元URL差分・
 * 承認済み反映の記録として生成します。競合Web変更や事業成果は判定しません。
 */
export function buildMonthlyValueReport(options: {
  latest: ReportRun;
  previous?: ReportRun | null;
  history?: ReportRun[];
  competitorEvents?: CompetitorEvent[];
  autoActions?: AutoAction[];
  impacts?: AutoActionImpact[];
  now?: string;
}): MonthlyValueReport {
  const {
    latest,
    previous,
    competitorEvents = [],
    autoActions = [],
    impacts = [],
    now = new Date().toISOString(),
    history = [],
  } = options;

  const observedRuns = history.length ? history : [latest];
  const aiObservationCount = observedRuns.reduce(
    (sum, run) => sum + (run.observations || []).filter(isReportObservationCountable).length,
    0
  );

  // competitorEvents にはWeb本文の前後差分を証明するフィールドがないため、
  // 旧保存イベントを含めて競合Web変更件数には数えません。
  void competitorEvents;
  const competitorChangeCount = 0;

  // 参照元URLは件数の差ではなく、追加・削除された識別子の対称差で数えます。
  const previousCitationKeys = reportCitationKeys(previous);
  const currentCitationKeys = reportCitationKeys(latest);
  const citationChangeCount = previous
    ? [...previousCitationKeys].filter((key) => !currentCitationKeys.has(key)).length
      + [...currentCitationKeys].filter((key) => !previousCitationKeys.has(key)).length
    : 0;

  const profileUpdateCount = autoActions.filter((action) => action.status === "applied" || (!action.status && Boolean(action.executedAt))).length;
  const autoActionCount = autoActions.filter((action) => action.status === "planned" || (!action.status && !action.executedAt)).length;

  const observedChange = impacts.reduce((sum, impact) => sum + impact.observedUplift, 0);
  const observedUpliftSummary = impacts.length
    ? `比較可能な質問パネルのAI回答観測で、自社が候補に含まれた件数は前回から${observedChange >= 0 ? "+" : ""}${observedChange}件変化しました。因果効果は未検証です。`
    : "比較可能な質問パネルのAI回答を記録しました。施策による因果効果は未検証です。";

  const topRisks = [
    "競合サイトのクロール前後差分が保存された入力ではないため、競合Web変更は判定していません。",
    "このレポートは指定した質問・AI・日時の観測であり、事業成果を測定したものではありません。",
  ];

  const upcomingTracking = [
    "次回も同じ比較可能な質問パネル・AI・地域条件でAI回答を観測",
    "前回観測と比較して参照元URLの追加・削除を記録",
    "自社ページの原文スニペットは、承認後のみ公開プロフィールへ反映",
    "競合Web変更は、クロール前後の本文差分が保存された場合だけ記録",
  ];

  const date = new Date(now);
  const period = `${date.getFullYear()}年${date.getMonth() + 1}月度`;

  return {
    period,
    aiObservationCount,
    competitorChangeCount,
    citationChangeCount,
    profileUpdateCount,
    autoActionCount,
    observedUpliftSummary,
    topRisks,
    upcomingTracking,
  };
}
