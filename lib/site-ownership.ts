import "server-only";
import { randomBytes } from "node:crypto";
import { resolveTxt } from "node:dns/promises";
import { safeFetchText } from "@/lib/url-security";
import { getWatch, saveDomainClaim } from "@/lib/storage";
import type { DomainClaim, DomainClaimMethod } from "@/lib/types";

function domain(value: string) { return value.toLowerCase().replace(/^www\./, "").replace(/\.$/, ""); }
function expected(claim: DomainClaim) { return `aix-site-verification=${claim.challenge}`; }

export async function ensureDomainClaim(token: string) {
  const watch = await getWatch(token); if (!watch) return null;
  const target = domain(watch.latest.discovery.domain);
  if (watch.domainClaim?.domain === target) return watch.domainClaim;
  const now = new Date().toISOString();
  const claim: DomainClaim = { domain: target, challenge: randomBytes(24).toString("base64url"), status: "pending", createdAt: now };
  await saveDomainClaim(token, claim); return claim;
}

function metaContent(html: string) {
  const tags = html.match(/<meta\b[^>]*>/gi) || [];
  for (const tag of tags) {
    const name = tag.match(/\bname\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase();
    if (name !== "aix-site-verification") continue;
    return tag.match(/\bcontent\s*=\s*["']([^"']+)["']/i)?.[1] || "";
  }
  return "";
}

export async function verifyDomainClaim(token: string, method: DomainClaimMethod) {
  const watch = await getWatch(token); if (!watch) throw new Error("Watchが見つかりません。");
  const claim = watch.domainClaim || await ensureDomainClaim(token); if (!claim) throw new Error("Ownership challengeを作成できませんでした。");
  const value = expected(claim); let verified = false;
  if (method === "dns") {
    try { const records = await resolveTxt(`_aix.${claim.domain}`); verified = records.some((chunks) => chunks.join("").trim() === value); } catch { verified = false; }
  } else if (method === "meta") {
    try { const { text } = await safeFetchText(`https://${claim.domain}/`, 1_500_000); verified = metaContent(text).trim() === claim.challenge || metaContent(text).trim() === value; } catch { verified = false; }
  } else {
    try { const { text } = await safeFetchText(`https://${claim.domain}/.well-known/aix-site-verification.txt`, 50_000); verified = text.trim() === value || text.trim() === claim.challenge; } catch { verified = false; }
  }
  const checkedAt = new Date().toISOString();
  const next: DomainClaim = verified ? { ...claim, status: "verified", method, checkedAt, verifiedAt: checkedAt } : { ...claim, status: "pending", method, checkedAt };
  await saveDomainClaim(token, next); return next;
}

export function ownershipInstructions(claim: DomainClaim) {
  const value = expected(claim);
  return {
    dns: { host: `_aix.${claim.domain}`, type: "TXT", value },
    meta: `<meta name="aix-site-verification" content="${claim.challenge}">`,
    file: { path: `https://${claim.domain}/.well-known/aix-site-verification.txt`, content: value },
  };
}
