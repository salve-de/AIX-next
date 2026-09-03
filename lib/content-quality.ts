import type { ContentQuality, ContentQualityCheck, ContentQualityPage, ContentQualityStatus, CrawledPage, ScanResult } from "@/lib/types";

type ContentQualityInput = {
  pages: CrawledPage[];
  result?: ScanResult;
  targetUrl?: string;
  generatedAt?: string;
} | CrawledPage[];

type PageContext = {
  result?: ScanResult;
  duplicateTitles: Set<string>;
  duplicateDescriptions: Set<string>;
};

function normalize(value: string) {
  return value.toLocaleLowerCase("ja-JP").normalize("NFKC").replace(/[\s・･_\-—–/（）(),.「」『』]/g, "");
}

function clamp(value: number, min = 0, max = 100) {
  return Math.min(max, Math.max(min, Number.isFinite(value) ? value : min));
}

function hasAny(value: string, patterns: ReadonlyArray<RegExp>) {
  return patterns.some((pattern) => pattern.test(value));
}

function includesAny(value: string, terms: string[]) {
  const normalizedValue = normalize(value);
  return terms.map(normalize).filter(Boolean).some((term) => normalizedValue.includes(term));
}

function contentOf(page: CrawledPage) {
  return [page.title, page.description, ...page.headings, page.text].filter(Boolean).join(" ");
}

function statusFor(found: boolean, uncertain = false): ContentQualityStatus {
  if (found) return "ready";
  return uncertain ? "review" : "missing";
}

function check(input: {
  id: string;
  label: string;
  status: ContentQualityStatus;
  detail: string;
  action: string;
  page: CrawledPage;
  evidenceType?: ContentQualityCheck["evidenceType"];
  confidence?: number;
}): ContentQualityCheck {
  return {
    id: input.id,
    label: input.label,
    status: input.status,
    detail: input.detail,
    action: input.action,
    pageUrls: [input.page.url],
    evidenceType: input.evidenceType || "observed",
    confidence: input.confidence ?? (input.evidenceType === "heuristic" ? .7 : .98),
  };
}

function pageChecks(page: CrawledPage, context: PageContext) {
  const result = context.result;
  const content = contentOf(page);
  const normalizedTitle = normalize(page.title);
  const normalizedDescription = normalize(page.description);
  const checks: ContentQualityCheck[] = [];
  const titleDuplicate = Boolean(normalizedTitle && context.duplicateTitles.has(normalizedTitle));
  const descriptionDuplicate = Boolean(normalizedDescription && context.duplicateDescriptions.has(normalizedDescription));

  checks.push(check({
    id: "title",
    label: "ページのタイトル",
    status: statusFor(Boolean(page.title.trim())),
    detail: page.title.trim() ? `タイトル「${page.title.trim()}」を確認しました。` : "タイトルを確認できませんでした。",
    action: page.title.trim() ? "内容と対象が伝わるタイトルを保つ" : "ページの内容と対象が分かるタイトルを付ける",
    page,
  }));
  if (titleDuplicate) {
    checks.push(check({
      id: "duplicate-title",
      label: "ページごとのタイトルの違い",
      status: "review",
      detail: "同じタイトルのページが複数あります。どのページを選ぶべきか機械的に区別しにくくなります。",
      action: "ページごとに対象と役割が分かるタイトルへ分ける",
      page,
      evidenceType: "observed",
    }));
  }
  checks.push(check({
    id: "description",
    label: "ページの説明",
    status: statusFor(Boolean(page.description.trim())),
    detail: page.description.trim() ? "検索結果やAIが要点をつかむための説明を確認しました。" : "ページの説明を確認できませんでした。",
    action: page.description.trim() ? "ページの対象・提供価値が伝わる説明を保つ" : "誰向けに何を提供するページかを一文で説明する",
    page,
  }));
  if (descriptionDuplicate) {
    checks.push(check({
      id: "duplicate-description",
      label: "ページごとの説明の違い",
      status: "review",
      detail: "同じ説明のページが複数あります。ページごとの違いを判断しにくくなります。",
      action: "ページの役割に合わせて説明を分ける",
      page,
      evidenceType: "observed",
    }));
  }

  const h1Count = page.h1Count;
  const headingKnown = h1Count !== undefined;
  const h1Ready = h1Count === 1;
  checks.push(check({
    id: "heading",
    label: "主見出し",
    status: h1Ready ? "ready" : headingKnown && h1Count === 0 ? "missing" : page.headings.some((heading) => heading.trim()) ? "review" : "missing",
    detail: h1Ready
      ? "主見出しを一つ確認しました。"
      : headingKnown && h1Count === 0
        ? "主見出しがありません。"
        : page.headings.some((heading) => heading.trim())
          ? "見出しはありますが、主見出しの数は公開データから確定できません。"
          : "見出しを確認できませんでした。",
    action: h1Ready ? "ページの主題と見出しの対応を保つ" : "ページの主題を表す主見出しを一つ置く",
    page,
    evidenceType: headingKnown ? "observed" : "heuristic",
    confidence: headingKnown ? .98 : .65,
  }));

  if (result) {
    const identityTerms = [result.discovery.brandName, result.discovery.domain, ...result.discovery.aliases];
    const identityFound = includesAny(content, identityTerms);
    checks.push(check({
      id: "identity",
      label: "会社・サービス名",
      status: statusFor(identityFound, true),
      detail: identityFound
        ? `公開本文から「${result.discovery.brandName}」または登録された別名を確認しました。`
        : `公開本文から「${result.discovery.brandName}」または登録された別名を確認できませんでした。`,
      action: identityFound ? "会社名・サービス名と提供内容の対応を保つ" : "会社名・サービス名と提供内容を本文で明確にする",
      page,
      evidenceType: "heuristic",
      confidence: .8,
    }));
  }

  const audienceTerms = result?.discovery.targetCustomers || [];
  const audienceFound = audienceTerms.length
    ? includesAny(content, audienceTerms)
    : hasAny(content, [/対象|法人|企業|個人|担当者|部門|向け|for|business|enterprise|consumer/i]);
  checks.push(check({
    id: "audience",
    label: "誰向けか",
    status: statusFor(audienceFound, true),
    detail: audienceFound ? "対象となる顧客・利用者の手掛かりを本文から確認しました。" : "対象となる顧客・利用者の説明を本文から確認できませんでした。",
    action: audienceFound ? "対象と利用条件を具体的に保つ" : "誰が使うサービスか、対象と条件を本文で示す",
    page,
    evidenceType: "heuristic",
    confidence: .75,
  }));

  const offerTerms = result ? [result.discovery.market, ...result.discovery.useCases] : [];
  const offerFound = offerTerms.length
    ? includesAny(content, offerTerms)
    : hasAny(content, [/サービス|製品|プロダクト|ツール|機能|支援|解決|提供|use|feature/i]);
  checks.push(check({
    id: "offer",
    label: "何を解決するか",
    status: statusFor(offerFound, true),
    detail: offerFound ? "提供内容・利用目的の手掛かりを本文から確認しました。" : "提供内容・利用目的の説明を本文から確認できませんでした。",
    action: offerFound ? "対象の課題と提供内容を一続きで説明する" : "何ができ、どの課題を解決するかを本文で説明する",
    page,
    evidenceType: "heuristic",
    confidence: .75,
  }));

  const priceFound = hasAny(content, [/料金|価格|費用|月額|年額|無料|見積|pricing|price|cost|trial/i]);
  checks.push(check({
    id: "commercial-facts",
    label: "料金・導入条件",
    status: statusFor(priceFound, true),
    detail: priceFound ? "料金・費用・導入条件の手掛かりを本文から確認しました。" : "料金・費用・導入条件の説明を本文から確認できませんでした。",
    action: priceFound ? "料金と導入条件の適用範囲・更新日を保つ" : "料金または見積条件、使い始めるまでの条件を事実に基づいて示す",
    page,
    evidenceType: "heuristic",
    confidence: .7,
  }));

  const proofFound = hasAny(content, [/実績|事例|導入|顧客|レビュー|評価|認証|証明|case|customer|testimonial|review|certif/i]);
  checks.push(check({
    id: "proof",
    label: "導入実績・根拠",
    status: statusFor(proofFound, true),
    detail: proofFound ? "導入事例・顧客・評価などの根拠の手掛かりを確認しました。" : "導入事例・顧客・評価などの根拠を確認できませんでした。",
    action: proofFound ? "根拠の原典・対象・時点を明らかにする" : "許諾を得た導入事例や第三者が確認できる根拠を事実として示す",
    page,
    evidenceType: "heuristic",
    confidence: .7,
  }));

  const ctaFound = hasAny(content, [/問い合わせ|資料請求|デモ|相談|申し込|始める|contact|demo|request|start|sign\s*up/i]);
  checks.push(check({
    id: "next-step",
    label: "次の行動",
    status: statusFor(ctaFound, true),
    detail: ctaFound ? "問い合わせ・資料・デモなど、次の行動の手掛かりを確認しました。" : "次に何をすればよいかを示す案内を確認できませんでした。",
    action: ctaFound ? "対象条件に合う次の行動を一つに絞って案内する" : "問い合わせ・資料・デモなど、読後の次の行動を明確にする",
    page,
    evidenceType: "heuristic",
    confidence: .7,
  }));

  const structuredStatus = page.structuredDataMatchesVisible === false
    ? "review"
    : page.hasStructuredData
      ? "ready"
      : "review";
  checks.push(check({
    id: "structured-data",
    label: "構造化データと本文",
    status: structuredStatus,
    detail: page.structuredDataMatchesVisible === false
      ? "構造化データと見える本文が一致しない可能性があります。"
      : page.hasStructuredData
        ? "構造化データを確認しました。見える本文との一致を前提に利用してください。"
        : "構造化データを確認できませんでした。必須条件ではありませんが、内容を機械に伝える補助になります。",
    action: page.structuredDataMatchesVisible === false
      ? "構造化データを見える本文と照合してから公開する"
      : page.hasStructuredData
        ? "見える本文と構造化データの内容をそろえる"
        : "会社・サービスなど、内容に合う構造化データを検討する",
    page,
    evidenceType: "observed",
    confidence: page.structuredDataMatchesVisible === false || page.hasStructuredData ? .95 : .8,
  }));

  const indexabilityStatus = page.noindex ? "missing" : "ready";
  checks.push(check({
    id: "indexability",
    label: "検索対象の設定",
    status: indexabilityStatus,
    detail: page.noindex ? "noindexを確認しました。このページは検索対象から外れる設定です。" : "noindexは確認されませんでした。",
    action: page.noindex ? "検索対象にするページかを確認し、意図しないnoindexを外す" : "重要ページの検索対象設定を定期確認する",
    page,
    evidenceType: "observed",
  }));

  return checks;
}

function pageScore(checks: ContentQualityCheck[]) {
  if (!checks.length) return 0;
  const value = checks.reduce((sum, item) => sum + (item.status === "ready" ? 100 : item.status === "review" ? 50 : 0), 0) / checks.length;
  return clamp(Math.round(value));
}

function pageSummary(page: CrawledPage, checks: ContentQualityCheck[]): ContentQualityPage {
  const score = pageScore(checks);
  return { url: page.url, title: page.title, score, checks };
}

function pageStatus(page: ContentQualityPage): ContentQualityStatus {
  const missing = page.checks.filter((check) => check.status === "missing").length;
  const review = page.checks.filter((check) => check.status === "review").length;
  if (missing >= 2 || page.checks.some((check) => check.id === "title" && check.status === "missing")) return "missing";
  if (missing || review) return "review";
  return "ready";
}

/**
 * Audits public page copy and machine-readable signals without external
 * connections. Keyword presence is a heuristic for clarity, not a ranking
 * score; the returned score is only a compact checklist completion signal.
 */
export function buildContentQuality(input: ContentQualityInput): ContentQuality {
  const pages = Array.isArray(input) ? input : input.pages;
  const result = Array.isArray(input) ? undefined : input.result;
  const generatedAt = Array.isArray(input) ? undefined : input.generatedAt;
  const targetUrl = Array.isArray(input) ? pages[0]?.url || "" : input.targetUrl || result?.targetUrl || pages[0]?.url || "";
  const titleCounts = new Map<string, number>();
  const descriptionCounts = new Map<string, number>();
  pages.forEach((page) => {
    const title = normalize(page.title);
    const description = normalize(page.description);
    if (title) titleCounts.set(title, (titleCounts.get(title) || 0) + 1);
    if (description) descriptionCounts.set(description, (descriptionCounts.get(description) || 0) + 1);
  });
  const duplicateTitles = new Set([...titleCounts.entries()].filter(([, count]) => count > 1).map(([value]) => value));
  const duplicateDescriptions = new Set([...descriptionCounts.entries()].filter(([, count]) => count > 1).map(([value]) => value));
  const context: PageContext = { result, duplicateTitles, duplicateDescriptions };
  const summaries = pages.map((page) => pageSummary(page, pageChecks(page, context)));
  const summary = summaries.reduce((counts, page) => {
    counts[pageStatus(page)] += 1;
    return counts;
  }, { ready: 0, review: 0, missing: 0 });

  return {
    pages: summaries,
    summary,
    generatedAt: generatedAt || result?.measuredAt || new Date().toISOString(),
    targetUrl,
    limitations: [
      "公開ページの取得結果だけを機械的に確認しています。非公開ページ、GA4、Search Console、広告、CRMの実績は含みません。",
      "語句の有無は内容が正しいことやAIに選ばれることを保証しません。構造化データは見える本文と照合してください。",
      "ページscoreはランキングや売上の予測ではなく、今回確認できた項目の相対的な整理です。",
    ],
  };
}

/** Descriptive alias for callers that prefer the report terminology. */
export const buildContentQualityReport = buildContentQuality;

