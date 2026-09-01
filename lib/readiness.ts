import { isAllowedByRobots } from "@/lib/robots";
import type { CrawledPage, ReadinessCheck, SiteReadiness } from "@/lib/types";

function pageMatches(pages: CrawledPage[], pattern: RegExp) { return pages.filter((page) => pattern.test(`${new URL(page.url).pathname} ${page.title} ${page.headings.join(" ")}`.toLowerCase())); }
function check(id: string, label: string, status: ReadinessCheck["status"], detail: string, affectedUrls?: string[]): ReadinessCheck { return { id, label, status, detail, ...(affectedUrls?.length ? { affectedUrls: affectedUrls.slice(0, 8) } : {}) }; }

export function auditSiteReadiness(input: { pages: CrawledPage[]; robots: string; sitemapFound: boolean }): SiteReadiness {
  const { pages, robots, sitemapFound } = input; const rootPath = "/"; const botChecks: Array<[string, string]> = [["oai-searchbot", "OAI-SearchBot"], ["googlebot", "Googlebot"], ["perplexitybot", "PerplexityBot"]]; const checks: ReadinessCheck[] = [];
  checks.push(robots ? check("robots", "robots.txt", "pass", "robots.txtを取得し、User-agent単位の公開方針を確認できました。") : check("robots", "robots.txt", "warn", "robots.txtを確認できませんでした。未配置は通常allow相当ですが、意図したAI crawler方針を明示できません。"));
  for (const [agent, label] of botChecks) { const allowed = !robots || isAllowedByRobots(robots, rootPath, agent); checks.push(check(`bot-${agent}`, `${label} root access`, allowed ? "pass" : "fail", allowed ? `${label}はrobots.txt上でルート取得を拒否されていません。実際にbotが訪問したことを意味しません。` : `${label}はrobots.txt上でルート取得を拒否されています。`)); }
  checks.push(sitemapFound ? check("sitemap", "XML sitemap", "pass", "ルートsitemap.xmlから同一ドメインURLを確認できました。") : check("sitemap", "XML sitemap", "warn", "ルートsitemap.xmlからURLを確認できませんでした。別URLのsitemapはこの診断では未確認です。"));
  const patterns: Array<[string, string, RegExp, string]> = [["pricing", "料金・価格情報", /pricing|price|料金|価格|費用/, "価格・契約条件を比較できる公開ページ"], ["proof", "導入事例・顧客実績", /case|customer|導入事例|導入実績|実績/, "顧客・導入実績を比較できる公開ページ"], ["security", "Security・Trust", /security|trust|セキュリティ|認証|安全/, "セキュリティ・認証を確認できる公開ページ"], ["support", "FAQ・Support・Docs", /faq|support|help|docs|サポート|よくある/, "導入・運用・サポート条件を確認できる公開ページ"]];
  for (const [id, label, pattern, purpose] of patterns) { const found = pageMatches(pages, pattern); checks.push(found.length ? check(id, label, "pass", `${purpose}を${found.length}ページ確認しました。`, found.map((page) => page.url)) : check(id, label, "warn", `${purpose}を今回取得した公開ページから確認できませんでした。`)); }
  const described = pages.filter((page) => page.title.trim() && page.description.trim()); const metadataRate = pages.length ? Math.round(described.length / pages.length * 100) : 0; checks.push(check("metadata", "Title + meta description", metadataRate >= 75 ? "pass" : metadataRate >= 40 ? "warn" : "fail", `${described.length}/${pages.length}ページでtitleとmeta descriptionの両方を確認しました。`));
  const substantive = pages.filter((page) => page.text.length >= 500); checks.push(check("substantive", "公開本文の取得", substantive.length >= Math.min(5, pages.length) ? "pass" : "warn", `${substantive.length}/${pages.length}ページで500文字以上の公開本文を取得しました。JavaScript描画だけの内容は取得できない場合があります。`));
  return { checkedAt: new Date().toISOString(), passCount: checks.filter((item) => item.status === "pass").length, warnCount: checks.filter((item) => item.status === "warn").length, failCount: checks.filter((item) => item.status === "fail").length, checks };
}
