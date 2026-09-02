import { datasetCsv, executiveMarkdown, safeReportData } from "@/lib/reporting";
import { getWatch } from "@/lib/storage";
import { resolveWatchToken } from "@/lib/watch-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function attachment(name: string, type: string) { return { "content-type": `${type}; charset=utf-8`, "content-disposition": `attachment; filename="${name}"`, "cache-control": "private, no-store", "referrer-policy": "no-referrer" }; }

export async function GET(request: Request) {
  const url = new URL(request.url);
  const token = resolveWatchToken(request, url.searchParams.get("token"));
  const format = url.searchParams.get("format") || "json";
  if (!token) return Response.json({ error: "Watch sessionが必要です。" }, { status: 401 });
  const watch = await getWatch(token);
  if (!watch) return Response.json({ error: "Watchが見つかりません。" }, { status: 404 });
  const slug = watch.latest.discovery.domain.replace(/[^a-z0-9.-]+/gi, "-").slice(0, 80) || "aix-project";
  if (format === "md") return new Response(executiveMarkdown(watch), { headers: attachment(`aix-${slug}-executive.md`, "text/markdown") });
  if (format === "csv") {
    const rawScope = url.searchParams.get("scope") || "prompts";
    const scope = ["prompts", "citations", "competitors", "history"].includes(rawScope) ? rawScope as "prompts" | "citations" | "competitors" | "history" : "prompts";
    return new Response(datasetCsv(watch, scope), { headers: attachment(`aix-${slug}-${scope}.csv`, "text/csv") });
  }
  return new Response(JSON.stringify(safeReportData(watch), null, 2), { headers: attachment(`aix-${slug}-intelligence.json`, "application/json") });
}
