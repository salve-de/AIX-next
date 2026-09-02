import type { CompanyDiscovery } from "@/lib/types";

function normalized(value: string) {
  return value
    .toLowerCase()
    .normalize("NFKC")
    .replace(/(?:株式会社|合同会社|有限会社)/g, "")
    .replace(/(?:\binc\.?\b|\bcorp\.?\b|\bcorporation\b|\bllc\b|\bltd\.?\b)/gi, "")
    .replace(/[\s・･_\-—–/（）(),.]/g, "");
}

function candidateLines(text: string) {
  const lines = text.split(/\r?\n/).map((line) => line.trim()).filter(Boolean);
  const listed = lines.filter((line) => /^(?:[-*•]|\d+[.)、]|[①-⑳]|候補\s*\d+)\s*/.test(line.replace(/^\*\*/, "")));
  return listed.length ? listed : lines.slice(0, 20);
}

function cleanCandidateName(value: string) {
  return value
    .replace(/^\*+|\*+$/g, "")
    .replace(/^`+|`+$/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function knownEntities(discovery: CompanyDiscovery) {
  return [
    { name: discovery.brandName, aliases: discovery.aliases },
    ...discovery.competitors.map((competitor) => ({ name: competitor.name, aliases: [competitor.name, competitor.domain || ""] })),
  ];
}

function canonicalName(value: string, discovery: CompanyDiscovery) {
  const normalizedValue = normalized(value);
  for (const entity of knownEntities(discovery)) {
    const aliases = [...new Set([entity.name, ...entity.aliases])].map(normalized).filter((alias) => alias.length >= 2);
    if (aliases.some((alias) => alias === normalizedValue)) return entity.name;
  }
  return cleanCandidateName(value);
}

function structuredCandidates(text: string, discovery: CompanyDiscovery) {
  const result: string[] = [];
  for (const rawLine of text.split(/\r?\n/)) {
    const line = rawLine.trim().replace(/^[-*•]\s*/, "").replace(/^\*\*/, "").replace(/\*\*$/, "");
    const match = line.match(/^候補\s*\d+\s*[|｜]\s*([^|｜]+?)(?:\s*[|｜]|$)/i);
    if (!match) continue;
    const name = canonicalName(match[1], discovery);
    if (normalized(name).length >= 2 && !result.includes(name)) result.push(name);
  }
  return result;
}

export function extractRecommendedEntities(text: string, discovery: CompanyDiscovery) {
  const structured = structuredCandidates(text, discovery);
  if (structured.length) return structured;

  const entities = knownEntities(discovery);
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
