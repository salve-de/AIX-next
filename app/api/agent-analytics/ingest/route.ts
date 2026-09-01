import { addAgentEvents, resolveAgentIngestKey } from "@/lib/agent-analytics-store";
import { classifyAgentSignal } from "@/lib/agent-signals";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const key = request.headers.get("x-aix-ingest-key") || "";
    if (!key || key.length > 200) return Response.json({ error: "Invalid ingest key" }, { status: 401 });
    const resolved = await resolveAgentIngestKey(key);
    if (!resolved) return Response.json({ error: "Invalid ingest key" }, { status: 401 });
    const body = await request.json() as { events?: Array<{ occurredAt?: string; userAgent?: string; path?: string; referrer?: string; statusCode?: number; conversion?: boolean }> };
    const input = Array.isArray(body.events) ? body.events.slice(0, 100) : [];
    const normalized = input.flatMap((event) => {
      const signal = classifyAgentSignal(String(event.userAgent || ""), String(event.referrer || ""));
      if (!signal) return [];
      const occurredAt = event.occurredAt && !Number.isNaN(new Date(event.occurredAt).getTime()) ? new Date(event.occurredAt).toISOString() : new Date().toISOString();
      const path = String(event.path || "/").trim().slice(0, 500) || "/";
      return [{ occurredAt, kind: signal.kind, agent: signal.agent, path, referrerDomain: signal.referrerDomain, statusCode: event.statusCode, conversion: Boolean(event.conversion) }];
    });
    const accepted = normalized.length ? await addAgentEvents(resolved.watchId, normalized) : 0;
    return Response.json({ received: input.length, accepted, ignored: input.length - accepted }, { headers: { "cache-control": "no-store" } });
  } catch (error) { return Response.json({ error: error instanceof Error ? error.message : "Agent eventsを保存できませんでした。" }, { status: 400 }); }
}
