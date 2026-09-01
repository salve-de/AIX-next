import type { CompanyDiscovery } from "@/lib/types";

function normalized(value: string) {
  return value.toLowerCase().normalize("NFKC").replace(/[\s・･_\-—–/（）()株式会社合同会社有限会社,.]/g, "");
}

function candidateLines(text: string) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const listed = lines.filter((line) => /^(?:[-*•]|\d+[.)、]|[①-⑳])\s*/.test(line));
  return listed.length ? listed : lines.slice(0, 20);
}

export function extractRecommendedEntities(text: string, discovery: CompanyDiscovery) {
  const entities = [
    { name: discovery.brandName, aliases: discovery.aliases },
    ...discovery.competitors.map((competitor) => ({ name: competitor.name, aliases: [competitor.name, competitor.domain || ""] })),
  ];
  const lines = candidateLines(text);
  const found: Array<{ name: string; index: number }> = [];
  for (const entity of entities) {
    const aliases = [...new Set([entity.name, ...entity.aliases])].map(normalized).filter((value) => value.length >= 2);
    let index = Number.POSITIVE_INFINITY;
    lines.forEach((line, lineIndex) => {
      const normalizedLine = normalized(line);
      if (aliases.some((alias) => normalizedLine.includes(alias))) index = Math.min(index, lineIndex);
    });
    if (Number.isFinite(index)) found.push({ name: entity.name, index });
  }
  return found.sort((a, b) => a.index - b.index).map((item) => item.name);
}

export function isOwnedCitation(url: string, companyDomain: string) {
  try {
    const host = new URL(url).hostname.replace(/^www\./, "").toLowerCase();
    const domain = companyDomain.replace(/^www\./, "").toLowerCase();
    return host === domain || host.endsWith(`.${domain}`);
  } catch { return false; }
}
