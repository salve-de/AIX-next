"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowIcon, SearchIcon } from "@/components/icons";
import { sampleWatch } from "@/lib/sample-data";
import type { BuyerPrompt, PromptCluster, ScanResult, WatchRecord } from "@/lib/types";

const clusterOptions: Array<{ value: PromptCluster; label: string }> = [
  { value: "comparison", label: "直接比較" }, { value: "category", label: "カテゴリ" }, { value: "segment", label: "企業条件" },
  { value: "use_case", label: "用途" }, { value: "feature", label: "機能" }, { value: "alternative", label: "乗換・代替" },
  { value: "value", label: "価格・価値" }, { value: "implementation", label: "導入" }, { value: "trust", label: "信頼・安全" }, { value: "support", label: "支援" },
];

function samplePrompt(text: string, cluster: PromptCluster): BuyerPrompt {
  return { id: `custom_sample_${Math.random().toString(36).slice(2, 10)}`, text, cluster, importance: 5, panel: "custom", version: 1, whyTracked: "ユーザーが明示的に追跡指定したCustom Promptです。Coreトレンドには混ぜません。" };
}

export function CustomPromptLab() {
  const params = useSearchParams();
  const sample = params.get("sample") === "1";
  const token = params.get("token") || "";
  const [open, setOpen] = useState(false);
  const [watch, setWatch] = useState<WatchRecord | null>(sample ? sampleWatch() : null);
  const [text, setText] = useState("");
  const [cluster, setCluster] = useState<PromptCluster>("comparison");
  const [busy, setBusy] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open || sample || !token) return;
    fetch(`/api/watch?token=${encodeURIComponent(token)}`, { cache: "no-store" })
      .then(async (response) => { const data = await response.json(); if (!response.ok) throw new Error(data.error || "Prompt Labを取得できませんでした。"); setWatch(data); })
      .catch((caught) => setError(caught instanceof Error ? caught.message : "Prompt Labを取得できませんでした。"));
  }, [open, sample, token]);

  async function add(event: FormEvent) {
    event.preventDefault(); const clean = text.trim(); if (clean.length < 8) { setError("8文字以上の購買質問を入力してください。"); return; }
    if (sample) { setWatch((current) => current ? { ...current, customPrompts: [...(current.customPrompts || []), samplePrompt(clean, cluster)] } : current); setText(""); setError(""); return; }
    setBusy("add"); setError("");
    try { const response = await fetch("/api/custom-prompts", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, text: clean, cluster, importance: 5 }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "追加できませんでした。"); setWatch(data.watch); setText(""); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "追加できませんでした。"); } finally { setBusy(""); }
  }

  async function remove(promptId: string) {
    if (sample) { setWatch((current) => current ? { ...current, customPrompts: (current.customPrompts || []).filter((item) => item.id !== promptId) } : current); return; }
    setBusy(`delete:${promptId}`); setError("");
    try { const response = await fetch("/api/custom-prompts", { method: "DELETE", headers: { "content-type": "application/json" }, body: JSON.stringify({ token, promptId }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "削除できませんでした。"); setWatch(data.watch); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "削除できませんでした。"); } finally { setBusy(""); }
  }

  async function run() {
    if (!(watch?.customPrompts || []).length) { setError("Custom Promptを1件以上追加してください。"); return; }
    if (sample) {
      const base = watch!.latest;
      const result: ScanResult = { ...base, scanId: "custom_sample_run", panel: { ...base.panel, kind: "custom", promptCount: watch!.customPrompts!.length }, prompts: watch!.customPrompts!, measuredAt: "2026-09-02T00:00:00.000Z", warnings: ["架空のCustom Prompt Labサンプルです。Coreトレンドには含まれません。"] };
      setWatch((current) => current ? { ...current, customLatest: result, customHistory: [...(current.customHistory || []), result] } : current); return;
    }
    setBusy("run"); setError("");
    try { const response = await fetch("/api/custom-prompts/run", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ token }) }); const data = await response.json(); if (!response.ok) throw new Error(data.error || "測定できませんでした。"); setWatch(data.watch); }
    catch (caught) { setError(caught instanceof Error ? caught.message : "測定できませんでした。"); } finally { setBusy(""); }
  }

  const prompts = watch?.customPrompts || [];
  const limit = watch?.paid ? 25 : 5;
  return <><button className="custom-lab-trigger" type="button" onClick={() => setOpen(true)}><SearchIcon />Custom Prompt Lab<span>{prompts.length}/{limit}</span></button>{open ? <div className="custom-lab-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}><section className="custom-lab"><header><div><small>OPTIONAL · DOES NOT MUTATE CORE</small><h2>Custom Prompt Lab</h2><p>AIXの自動Buyer Panelに加え、自社固有の質問だけ追加できます。追加してもCoreの過去推移は変わりません。</p></div><button type="button" onClick={() => setOpen(false)}>×</button></header><form onSubmit={add}><label>自社で追いたい購買質問<textarea value={text} onChange={(event) => setText(event.target.value)} placeholder="例：従業員300名で、海外子会社も含めて使いやすい取引先リスク管理SaaSは？" /></label><div><select value={cluster} onChange={(event) => setCluster(event.target.value as PromptCluster)}>{clusterOptions.map((item) => <option key={item.value} value={item.value}>{item.label}</option>)}</select><button type="submit" disabled={busy === "add" || prompts.length >= limit}>{busy === "add" ? "追加中…" : "Custom Promptを追加"}</button></div></form><div className="custom-lab-list">{prompts.length ? prompts.map((prompt, index) => <article key={prompt.id}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{prompt.text}</strong><small>{clusterOptions.find((item) => item.value === prompt.cluster)?.label} · Core非算入</small></div><button type="button" onClick={() => remove(prompt.id)} disabled={busy === `delete:${prompt.id}`}>削除</button></article>) : <div className="custom-lab-empty"><SearchIcon /><strong>Custom Promptはまだありません。</strong><p>通常はAIXの自動Panelだけで開始できます。必要な質問がある場合だけ追加してください。</p></div>}</div><footer><div><strong>{watch?.customLatest ? `${watch.customLatest.recommendationCoverage}%` : "—"}</strong><span>最新Custom Recommendation Coverage</span></div><button type="button" onClick={run} disabled={busy === "run" || !prompts.length}>{busy === "run" ? "3 AIで測定中…" : "Custom Promptを3 AIで測定"}<ArrowIcon /></button></footer>{error ? <p className="custom-lab-error">{error}</p> : null}</section></div> : null}</>;
}
