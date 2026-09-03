import { toPublicScanResult } from "@/lib/public-dto";
import type { PublicObservation, PublicScanResult } from "@/lib/public-dto";
import type { ScanRecord } from "@/lib/types";
import { getScan } from "@/lib/storage";

/**
 * The result page predates the public DTO and still reads two compatibility
 * fields: `warnings` and `lostPrompts[].observations`. Keep those fields
 * present, but only with safe values. In particular, the nested observations
 * are rebuilt from `toPublicScanResult` and therefore contain no answer text,
 * provider internals, token counts, cost, or error details.
 */
type PublicScanResultForReport = PublicScanResult & {
  warnings: string[];
  lostPrompts: Array<PublicScanResult["lostPrompts"][number] & { observations: PublicObservation[] }>;
};

type PublicScanRecord = {
  id: ScanRecord["id"];
  targetUrl: ScanRecord["targetUrl"];
  stage: ScanRecord["stage"];
  progress: ScanRecord["progress"];
  message: ScanRecord["message"];
  result: PublicScanResultForReport | null;
  createdAt: ScanRecord["createdAt"];
  updatedAt: ScanRecord["updatedAt"];
};

function toPublicScanResultForReport(result: ScanRecord["result"]): PublicScanResultForReport | null {
  if (!result) return null;

  const publicResult = toPublicScanResult(result);
  const observationsByPrompt = new Map<string, PublicObservation[]>();
  for (const observation of publicResult.observations) {
    const observations = observationsByPrompt.get(observation.promptId) || [];
    observations.push(observation);
    observationsByPrompt.set(observation.promptId, observations);
  }

  return {
    ...publicResult,
    // Warnings can contain provider/storage details. The result UI only needs
    // an array for backwards compatibility; user-facing warning copy is not
    // part of this public response.
    warnings: [],
    lostPrompts: publicResult.lostPrompts.map((lostPrompt) => ({
      ...lostPrompt,
      observations: observationsByPrompt.get(lostPrompt.promptId) || [],
    })),
  };
}

function toPublicScanRecord(scan: ScanRecord): PublicScanRecord {
  return {
    id: scan.id,
    targetUrl: scan.targetUrl,
    stage: scan.stage,
    progress: scan.progress,
    message: scan.message,
    result: toPublicScanResultForReport(scan.result),
    createdAt: scan.createdAt,
    updatedAt: scan.updatedAt,
  };
}

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const scan = await getScan(id);
  if (!scan) return Response.json({ error: "診断結果が見つかりません。" }, { status: 404 });
  return Response.json(toPublicScanRecord(scan), { headers: { "cache-control": "private, no-store", "referrer-policy": "no-referrer" } });
}
