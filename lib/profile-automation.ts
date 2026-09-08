import type { CrawledPage, PublicProfileFact, PublicProfileRecord, ScanResult } from "./types";
import { toPublicProfile } from "./public-profile";

import { excludedConsultations, matchingConsultations } from "./prompt-evidence";

const SIGNAL = /料金|価格|円|対応|地域|エリア|専門|対象|納期|受付|営業時間/u;
const normalize = (text: string) => text.replace(/\s+/gu, " ").trim();
const key = (fact: PublicProfileFact) => JSON.stringify([fact.label, fact.value, fact.sourceUrl]);

/** Only short verbatim source statements, never generated selling claims. */
export function buildAutomatedFacts(record: PublicProfileRecord, pages: CrawledPage[], scan?: ScanResult): PublicProfileFact[] | null {
  // A no-site page is not independent verification of its own entered claims.
  if (record.sourceScanId === "direct-creation") return null;
  const origin = new URL(record.targetUrl).origin;
  const eligible = pages.filter((page) => {
    try {
      const url = new URL(page.url);
      return url.origin === origin && !url.username && !url.password && !url.search && !url.hash && !page.noindex && page.text.trim().length > 0 && page.text.length < 30_000;
    } catch { return false; }
  });
  // Partial crawls must not erase earlier managed source statements.
  const previous = record.automation?.managedFacts || [];
  if (!eligible.length || previous.some((fact) => !eligible.some((page) => page.url === fact.sourceUrl))) return null;
  const managedKeys = new Set(previous.map(key));
  const retained = record.facts.filter((fact) => !managedKeys.has(key(fact)));
  const additions: PublicProfileFact[] = [];
  const prompts = scan ? excludedConsultations(scan) : [];
  const candidates = eligible.flatMap(page => {
    const sentences = page.text.match(/[^。！？!?\n]+[。！？!?]/gu) || [];
    return sentences.map(normalize).filter(value => value.length >= 8 && value.length <= 140 && SIGNAL.test(value))
      .map(value => ({ label: "参照元の記載", value, sourceUrl: page.url, provenance: "source_excerpt" as const }));
  });
  // Never treat a failed extraction or changed selection as evidence of expiry.
  if (previous.some(fact => !candidates.some(next => next.sourceUrl === fact.sourceUrl))) return null;
  const ranked = candidates.map(fact => ({ fact, matches: matchingConsultations(fact, prompts) }))
    .sort((a,b) => b.matches.length - a.matches.length);
  for (const { fact } of ranked) {
    if (retained.some(old => old.value === fact.value) || additions.some(old => old.value === fact.value)) continue;
    additions.push(fact);
    if (additions.length === 5) break;
  }
  // Reuse the publication allow-list, including private-marker filtering.
  const safe = toPublicProfile({ ...record, facts: additions }).facts;
  if (previous.some((fact) => !safe.some((next) => next.sourceUrl === fact.sourceUrl))) return null;
  return safe;
}

export function changedFacts(before: PublicProfileFact[], after: PublicProfileFact[]) {
  const oldKeys = new Set(before.map(key));
  const newKeys = new Set(after.map(key));
  return [...oldKeys].filter((item) => !newKeys.has(item)).length + [...newKeys].filter((item) => !oldKeys.has(item)).length;
}

export function mergeAutomatedFacts(record: PublicProfileRecord, managed: PublicProfileFact[]) {
  const previous = new Set((record.automation?.managedFacts || []).map(key));
  return [...record.facts.filter((fact) => !previous.has(key(fact))), ...managed];
}
