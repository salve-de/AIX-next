import type { CrawledPage, PublicProfileFact, PublicProfileRecord } from "./types";
import { toPublicProfile } from "./public-profile";

const SIGNAL = /料金|価格|円|対応|地域|エリア|専門|対象|納期|受付|営業時間/u;
const normalize = (text: string) => text.replace(/\s+/gu, " ").trim();
const key = (fact: PublicProfileFact) => JSON.stringify([fact.label, fact.value, fact.sourceUrl]);

/** Only short verbatim source statements, never generated selling claims. */
export function buildAutomatedFacts(record: PublicProfileRecord, pages: CrawledPage[]): PublicProfileFact[] | null {
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
  for (const page of eligible) {
    const value = normalize(page.text).match(/[^。！？!?]+[。！？!?]/gu)?.find((sentence) => sentence.length >= 8 && sentence.length <= 140 && SIGNAL.test(sentence));
    // A missing extract is not proof that an earlier service/fact expired.
    if (!value && previous.some((fact) => fact.sourceUrl === page.url)) return null;
    if (!value || retained.some((fact) => fact.value === value.trim())) continue;
    additions.push({ label: "参照元の記載", value: value.trim(), sourceUrl: page.url });
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
