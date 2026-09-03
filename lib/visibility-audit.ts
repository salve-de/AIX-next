import type { AiCrawlerName, AiVisibilityAudit, AiVisibilityCheck, CrawlAudit, CrawledPage, ScanResult } from "@/lib/types";

const emptyCrawlAudit: CrawlAudit = {
  robotsTxtFound: false,
  sitemapFound: false,
  attempted: 0,
  pagesCrawled: 0,
  pagesBlockedByRobots: 0,
  pagesNoindex: 0,
  pagesMissingCanonical: 0,
  pagesCanonicalMismatch: 0,
  pagesWithStructuredData: 0,
  pagesMissingTitle: 0,
  pagesMissingDescription: 0,
  pagesMissingH1: 0,
  aiSearchBotAllowed: true,
  gptBotAllowed: true,
};

function corpus(pages: CrawledPage[]) {
  return pages.map((page) => `${page.title} ${page.description} ${page.headings.join(" ")} ${page.text}`).join(" ").toLowerCase();
}

function hasAny(source: string, patterns: ReadonlyArray<RegExp>) {
  return patterns.some((pattern) => pattern.test(source));
}

function inferredAudit(pages: CrawledPage[], result: ScanResult): CrawlAudit {
  return {
    ...emptyCrawlAudit,
    attempted: pages.length,
    pagesCrawled: pages.length,
    pagesNoindex: pages.filter((page) => page.noindex).length,
    pagesMissingCanonical: pages.filter((page) => !page.canonicalUrl).length,
    pagesWithStructuredData: pages.filter((page) => page.hasStructuredData).length,
    pagesMissingTitle: pages.filter((page) => !page.title.trim()).length,
    pagesMissingDescription: pages.filter((page) => !page.description.trim()).length,
    pagesMissingH1: pages.filter((page) => !(page.h1Count || page.headings.filter((heading) => heading).length)).length,
    aiSearchBotAllowed: !result.warnings.some((warning) => /OAI-SearchBot|AI検索クローラー.*拒否/i.test(warning)),
    gptBotAllowed: !result.warnings.some((warning) => /GPTBot/i.test(warning)),
    crawlerAccess: {
      "OAI-SearchBot": !result.warnings.some((warning) => /OAI-SearchBot|AI検索クローラー.*拒否/i.test(warning)),
      GPTBot: !result.warnings.some((warning) => /GPTBot/i.test(warning)),
    },
  };
}

function crawlerAllowed(crawl: CrawlAudit, crawler: AiCrawlerName) {
  if (crawl.crawlerAccess?.[crawler] !== undefined) return crawl.crawlerAccess[crawler] !== false;
  if (crawler === "OAI-SearchBot") return crawl.aiSearchBotAllowed;
  if (crawler === "GPTBot") return crawl.gptBotAllowed;
  return true;
}

function homePage(pages: CrawledPage[], targetUrl: string) {
  try {
    const target = new URL(targetUrl);
    const targetPath = target.pathname.replace(/\/$/, "") || "/";
    return pages.find((page) => {
      const current = new URL(page.url);
      return current.origin === target.origin && (current.pathname.replace(/\/$/, "") || "/") === targetPath;
    }) || pages.find((page) => {
      try { return new URL(page.url).pathname.replace(/\/$/, "") === ""; } catch { return false; }
    }) || pages[0];
  } catch {
    return pages[0];
  }
}

function check(input: Omit<AiVisibilityCheck, "status"> & { status: AiVisibilityCheck["status"] }): AiVisibilityCheck {
  return input;
}

/**
 * Turns a crawl and the observed AI result into a short, non-scoring action list.
 * It describes conditions AIX can observe; it does not claim to know an AI
 * provider's ranking formula or promise a recommendation outcome.
 */
export function buildAiVisibilityAudit(input: { result: ScanResult; pages: CrawledPage[]; crawl?: CrawlAudit; generatedAt?: string }): AiVisibilityAudit {
  const pages = input.pages;
  const crawl = input.crawl || inferredAudit(pages, input.result);
  const text = corpus(pages);
  const home = homePage(pages, input.result.targetUrl);
  const externalCitationDomains = new Set(
    input.result.observations
      .flatMap((observation) => observation.citations)
      .filter((citation) => citation.domain && citation.domain !== input.result.discovery.domain && !citation.domain.endsWith(`.${input.result.discovery.domain}`))
      .map((citation) => citation.domain),
  );
  const checks: AiVisibilityCheck[] = [];

  const crawlerLabels: Array<[AiCrawlerName, string]> = [
    ["OAI-SearchBot", "ChatGPT Search"],
    ["Googlebot", "Google Search"],
    ["Bingbot", "Bing / Copilot"],
    ["PerplexityBot", "Perplexity"],
    ["Claude-User", "Claude"],
  ];
  const blockedCrawlers = crawlerLabels.filter(([crawler]) => !crawlerAllowed(crawl, crawler)).map(([, label]) => label);
  const oaiSearchAllowed = crawlerAllowed(crawl, "OAI-SearchBot");

  checks.push(check({
    id: "crawler-access",
    group: "access",
    status: !oaiSearchAllowed ? "missing" : blockedCrawlers.length ? "review" : "ready",
    title: "AI検索が公開ページを読める",
    detail: blockedCrawlers.length
      ? `${blockedCrawlers.join("・")}の公開ページ取得がrobots.txtで拒否されています。`
      : "ChatGPT Search、Google、Bing、Perplexity、Claudeが公開ページを取得できる設定です。",
    action: !oaiSearchAllowed ? "robots.txtでOAI-SearchBotを許可する" : blockedCrawlers.length ? "robots.txtの対象AI向けルールを見直す" : "この設定を維持する",
  }));

  checks.push(check({
    id: "indexability",
    group: "access",
    status: home?.noindex ? "missing" : crawl.pagesNoindex ? "review" : "ready",
    title: "重要ページが検索対象になっている",
    detail: home?.noindex
      ? "トップページにnoindexがあり、検索・AIから見つかりにくい状態です。"
      : crawl.pagesNoindex
        ? `${crawl.pagesNoindex}ページにnoindexがあります。意図した設定か確認してください。`
        : "取得したページにnoindexは見つかりませんでした。",
    action: home?.noindex ? "トップページのnoindexを意図した設定か確認する" : crawl.pagesNoindex ? "noindex対象を整理する" : "重要ページのindex設定を定期確認する",
  }));

  checks.push(check({
    id: "sitemap",
    group: "access",
    status: crawl.sitemapFound ? "ready" : "review",
    title: "更新ページを知らせる入口がある",
    detail: crawl.sitemapFound ? "sitemap.xmlを取得できました。" : "sitemap.xmlは取得できませんでした。必須ではありませんが、更新ページを知らせる入口になります。",
    action: crawl.sitemapFound ? "sitemapのURLと内容を定期確認する" : "主要な公開URLを含むsitemap.xmlを用意する",
  }));

  checks.push(check({
    id: "canonical",
    group: "access",
    status: crawl.pagesCanonicalMismatch ? "review" : crawl.pagesMissingCanonical === crawl.pagesCrawled ? "review" : "ready",
    title: "同じページのURLが一つに整理されている",
    detail: crawl.pagesCanonicalMismatch
      ? `${crawl.pagesCanonicalMismatch}ページでcanonicalと取得URLが一致しません。`
      : crawl.pagesMissingCanonical
        ? `${crawl.pagesMissingCanonical}ページでcanonicalを確認できませんでした。`
        : "取得したページのcanonicalを確認できました。",
    action: crawl.pagesCanonicalMismatch ? "重複URLの代表ページとcanonicalをそろえる" : "主要ページの代表URLを確認する",
  }));

  const schemaMismatchCount = crawl.pagesWithStructuredDataMismatch ?? pages.filter((page) => page.hasStructuredData && page.structuredDataMatchesVisible === false).length;
  checks.push(check({
    id: "structured-data",
    group: "clarity",
    status: schemaMismatchCount ? "review" : crawl.pagesWithStructuredData ? "ready" : "review",
    title: "ページの内容を機械にも説明できる",
    detail: schemaMismatchCount
      ? `${schemaMismatchCount}ページで、構造化データと見える本文の一致を確認できませんでした。`
      : crawl.pagesWithStructuredData
        ? `${crawl.pagesWithStructuredData}ページでJSON-LDを確認しました。`
      : "JSON-LDは確認できませんでした。AI検索の必須条件ではありませんが、ページの内容を明示する補助になります。",
    action: schemaMismatchCount
      ? "構造化データを見える本文と照合してから公開する"
      : crawl.pagesWithStructuredData
        ? "見える本文とJSON-LDの内容をそろえる"
        : "会社・サービス・各ページに合う構造化データを検討する",
  }));

  const organizationSchemaPages = pages.filter((page) => (page.structuredDataTypes || []).some((type) => /^(Organization|Corporation|LocalBusiness)$/i.test(type))).length;
  const serviceSchemaPages = pages.filter((page) => (page.structuredDataTypes || []).some((type) => /^(Service|Product|SoftwareApplication)$/i.test(type))).length;
  checks.push(check({
    id: "entity-clarity",
    group: "clarity",
    status: organizationSchemaPages && serviceSchemaPages ? "ready" : "review",
    title: "会社とサービスの関係が分かる",
    detail: organizationSchemaPages && serviceSchemaPages
      ? `会社情報を${organizationSchemaPages}ページ、サービス情報を${serviceSchemaPages}ページで確認しました。`
      : "会社またはサービスとして識別できる公開情報を十分に確認できませんでした。",
    action: organizationSchemaPages && serviceSchemaPages ? "見える会社情報・サービス情報と構造化データをそろえる" : "会社概要とサービス概要を、見える本文と構造化データで明確にする",
  }));

  const missingPageBasics = crawl.pagesMissingTitle + crawl.pagesMissingH1 + crawl.pagesMissingDescription;
  checks.push(check({
    id: "page-basics",
    group: "clarity",
    status: missingPageBasics ? "review" : "ready",
    title: "各ページの要点がすぐ分かる",
    detail: missingPageBasics
      ? `タイトル・説明・見出しを確認できないページが合計${missingPageBasics}件あります。`
      : "取得したページにタイトル・説明・見出しがあります。",
    action: missingPageBasics ? "ページごとにタイトル・説明・主見出しを一つずつ整える" : "ページの見出しと説明を更新時に確認する",
  }));

  const buyerFacts = [
    ["誰向けか", [/対象|法人|企業|部門|担当者|向け/]],
    ["何ができるか", [/サービス|製品|機能|できる|解決|用途|利用/]],
    ["いくら・どう始めるか", [/料金|価格|費用|月額|導入|開始|期間|試用/]],
    ["安心して使えるか", [/セキュリティ|認証|ISO|SOC|サポート|問い合わせ|SLA|規約/]],
  ] as const;
  const missingFactLabels = buyerFacts.filter(([, patterns]) => !hasAny(text, patterns)).map(([label]) => label);
  checks.push(check({
    id: "buyer-facts",
    group: "clarity",
    status: missingFactLabels.length >= 2 ? "missing" : missingFactLabels.length ? "review" : "ready",
    title: "購入前に知りたい情報がそろっている",
    detail: missingFactLabels.length ? `${missingFactLabels.join("・")}の説明を公開ページから確認できませんでした。` : "対象・機能・費用・導入・安心材料を公開ページから確認できました。",
    action: missingFactLabels.length ? `${missingFactLabels.join("・")}を、事実と条件つきで公開する` : "公開情報の更新日と原典を定期確認する",
  }));

  const proofGap = input.result.evidenceGaps[0];
  checks.push(check({
    id: "proof",
    group: "proof",
    status: proofGap ? "missing" : externalCitationDomains.size ? "ready" : "review",
    title: "選ぶ理由を第三者が確かめられる",
    detail: proofGap
      ? `${proofGap.label}を自社の公開ページから確認できませんでした。`
      : externalCitationDomains.size
        ? `AI回答で自社以外の参照先${externalCitationDomains.size}ドメインを確認しました。`
        : "第三者の参照先は今回のAI回答から確認できませんでした。",
    action: proofGap ? `${proofGap.label}を、許諾と原典を確認したうえで公開する` : externalCitationDomains.size ? "実在する第三者情報の正確さと更新日を確認する" : "実在する導入事例・レビュー・業界情報を、許諾と原典つきで整える",
  }));

  const measurementStatus = !input.result.successfulObservations ? "missing" : input.result.measurementCompleteness < 100 ? "review" : "ready";
  checks.push(check({
    id: "measurement",
    group: "measurement",
    status: measurementStatus,
    title: "同じ質問で変化を確かめられる",
    detail: !input.result.successfulObservations
      ? "AI回答を取得できていないため、推薦の変化を判定できません。"
      : input.result.measurementCompleteness < 100
        ? `予定した回答の${input.result.measurementCompleteness}%を取得しました。欠けた回答があります。`
        : `${input.result.panel.promptCount}問を同じ条件で確認しました。`,
    action: !input.result.successfulObservations ? "AI Provider設定後に再測定する" : input.result.measurementCompleteness < 100 ? "取得できなかったAI回答を再測定する" : "変更後も同じ質問・地域・AI面で再測定する",
  }));

  const priority = checks.find((item) => item.status === "missing") || checks.find((item) => item.status === "review") || checks[0];
  const blocked = checks.some((item) => item.status === "missing" && ["crawler-access", "indexability"].includes(item.id));
  return {
    generatedAt: input.generatedAt || new Date().toISOString(),
    readiness: blocked ? "blocked" : checks.some((item) => item.status !== "ready") ? "needs-review" : "ready",
    checks,
    priorityCheckId: priority?.id || "measurement",
    crawl,
  };
}
