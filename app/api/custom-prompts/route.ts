import { shortHash } from "@/lib/ids";
import { getWatch, saveCustomPrompts } from "@/lib/storage";
import type { BuyerPrompt, PromptCluster } from "@/lib/types";
import { resolveWatchToken } from "@/lib/watch-session";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const clusters: PromptCluster[] = ["category", "segment", "use_case", "feature", "alternative", "comparison", "value", "implementation", "trust", "support"];

function cleanText(value: string) {
  const text = value.trim().replace(/\s+/g, " ");
  if (text.length < 8) throw new Error("Custom Promptは8文字以上で入力してください。");
  if (text.length > 500) throw new Error("Custom Promptは500文字以内で入力してください。");
  return text;
}

export async function POST(request: Request) {
  try {
    const body = await request.json() as { token?: string; text?: string; cluster?: PromptCluster; importance?: number };
    const token = resolveWatchToken(request, body.token);
    if (!token) return Response.json({ error: "Watch sessionが必要です。" }, { status: 401 });
    const watch = await getWatch(token);
    if (!watch) return Response.json({ error: "Watchが見つかりません。" }, { status: 404 });
    const current = watch.customPrompts || [];
    const limit = watch.paid ? 25 : 5;
    if (current.length >= limit) return Response.json({ error: `Custom Promptは現在のプランで${limit}件までです。` }, { status: 409 });
    const text = cleanText(body.text || "");
    if (current.some((item) => item.text.toLowerCase() === text.toLowerCase())) return Response.json({ error: "同じCustom Promptがすでにあります。" }, { status: 409 });
    const cluster = body.cluster && clusters.includes(body.cluster) ? body.cluster : "comparison";
    const importance = Math.max(1, Math.min(5, Math.round(Number(body.importance || 5))));
    const prompt: BuyerPrompt = {
      id: `custom_${shortHash(`${watch.id}:${text}:${Date.now()}`)}`,
      text,
      cluster,
      importance,
      panel: "custom",
      version: 1,
      whyTracked: "ユーザーが自社の購買プロセス上、明示的に追跡指定したCustom Promptです。Coreトレンドには自動で混ぜません。",
    };
    const updated = await saveCustomPrompts(token, [...current, prompt]);
    return Response.json({ prompt, watch: updated }, { headers: { "cache-control": "private, no-store", "referrer-policy": "no-referrer" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Custom Promptを追加できませんでした。" }, { status: 400 });
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json() as { token?: string; promptId?: string };
    const token = resolveWatchToken(request, body.token);
    if (!token) return Response.json({ error: "Watch sessionが必要です。" }, { status: 401 });
    if (!body.promptId) return Response.json({ error: "promptIdが必要です。" }, { status: 400 });
    const watch = await getWatch(token);
    if (!watch) return Response.json({ error: "Watchが見つかりません。" }, { status: 404 });
    const next = (watch.customPrompts || []).filter((item) => item.id !== body.promptId);
    if (next.length === (watch.customPrompts || []).length) return Response.json({ error: "Custom Promptが見つかりません。" }, { status: 404 });
    const updated = await saveCustomPrompts(token, next);
    return Response.json({ watch: updated }, { headers: { "cache-control": "private, no-store", "referrer-policy": "no-referrer" } });
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Custom Promptを削除できませんでした。" }, { status: 400 });
  }
}
