import { ensureDomainClaim, ownershipInstructions, verifyDomainClaim } from "@/lib/site-ownership";
import type { DomainClaimMethod } from "@/lib/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const token = new URL(request.url).searchParams.get("token") || "";
    if (!token) return Response.json({ error: "Watch tokenが必要です。" }, { status: 400 });
    const claim = await ensureDomainClaim(token); if (!claim) return Response.json({ error: "Watchが見つかりません。" }, { status: 404 });
    return Response.json({ claim, instructions: ownershipInstructions(claim) }, { headers: { "cache-control": "private, no-store", "referrer-policy": "no-referrer" } });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Ownership challengeを作成できませんでした。" }, { status: 400 }); }
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { token?: string; method?: DomainClaimMethod };
    if (!body.token || !body.method || !["dns", "meta", "file"].includes(body.method)) return Response.json({ error: "tokenとverification methodが必要です。" }, { status: 400 });
    const claim = await verifyDomainClaim(body.token, body.method);
    return Response.json({ claim, instructions: ownershipInstructions(claim) }, { headers: { "cache-control": "private, no-store", "referrer-policy": "no-referrer" } });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Domain ownershipを確認できませんでした。" }, { status: 400 }); }
}
