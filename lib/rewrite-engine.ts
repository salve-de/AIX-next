import "server-only";
import { env } from "@/lib/env";
import type { ChangePack } from "@/lib/types";

function responseText(data: any) {
  if (typeof data.output_text === "string") return data.output_text;
  return (Array.isArray(data.output) ? data.output : []).flatMap((item: any) => item.content || []).map((part: any) => part.text || "").filter(Boolean).join("\n");
}
function stripFence(value: string) { return value.trim().replace(/^```[^\n]*\n/, "").replace(/\n```\s*$/, ""); }
function evidence(pack: ChangePack) { return pack.allowedEvidence.length ? pack.allowedEvidence.map((item) => `- ${item.label}: ${item.value} [${item.status}]`).join("\n") : "- No additional company-provided facts are approved."; }

async function rewrite(prompt: string) {
  if (!env.openAiKey) throw new Error("OPENAI_API_KEY is required for safe file rewriting.");
  const response = await fetch("https://api.openai.com/v1/responses", { method: "POST", headers: { authorization: `Bearer ${env.openAiKey}`, "content-type": "application/json" }, body: JSON.stringify({ model: env.openAiDiscoveryModel, input: prompt }) });
  const data = await response.json() as any;
  if (!response.ok) throw new Error(data.error?.message || `OpenAI rewrite ${response.status}`);
  const output = stripFence(responseText(data));
  if (!output) throw new Error("Rewrite model returned empty content.");
  return output;
}

export async function rewriteSourceFile(input: { path: string; currentContent: string; pack: ChangePack }) {
  if (input.currentContent.length > 180_000) throw new Error("Target source file is too large for safe rewriting.");
  const output = await rewrite(`You are the implementation engine inside AIX. Make the smallest safe edit to the source file below to implement the approved Change Pack.\n\nNON-NEGOTIABLE RULES:\n- Return ONLY the complete replacement file. No markdown fences, explanation, diff, or commentary.\n- Preserve framework syntax, imports, formatting conventions, unrelated copy, components, analytics, accessibility, SEO metadata, and behavior unless the Change Pack explicitly requires a change.\n- Never invent customer counts, ROI, certifications, pricing, implementation times, reviews, rankings, awards, or performance claims.\n- Company-provided facts marked company_asserted may be used as company claims but must not be upgraded to independently verified language.\n- Missing facts remain omitted or clearly non-factual placeholders; do not publish [要確認] placeholders to public-facing copy.\n- Do not add cloaking, hidden text, fake reviews, doorway pages, or content aimed only at bots.\n- Do not add scripts, remote code, credentials, tracking, or dependencies.\n- The file must remain syntactically valid.\n\nTARGET PATH: ${input.path}\nCHANGE PACK TITLE: ${input.pack.title}\nTARGET: ${input.pack.target}\nRATIONALE: ${input.pack.rationale}\nRECOMMENDED HEADINGS: ${input.pack.recommendedHeadings.join(" | ")}\nFAQ DRAFTS: ${input.pack.faqs.map((item) => `${item.question} => ${item.answer}`).join(" | ")}\nSTRUCTURED DATA NOTES: ${input.pack.structuredDataNotes.join(" | ")}\nVALIDATION CHECKLIST: ${input.pack.validationChecklist.join(" | ")}\nAPPROVED EVIDENCE:\n${evidence(input.pack)}\n\nCURRENT FILE:\n---BEGIN FILE---\n${input.currentContent}\n---END FILE---`);
  const ratio = output.length / Math.max(1, input.currentContent.length);
  if (ratio < .35 || ratio > 2.5) throw new Error("Generated edit changed too much of the target file; manual review is required instead.");
  return output;
}

export async function rewriteWordPressHtml(input: { title: string; currentHtml: string; pack: ChangePack }) {
  if (input.currentHtml.length > 180_000) throw new Error("WordPress page is too large for safe rewriting.");
  return rewrite(`You are the WordPress draft engine inside AIX. Produce a complete revised HTML body for a NEW DRAFT COPY of the existing page.\n\nRULES:\n- Return ONLY the complete HTML body. No markdown fences or explanation.\n- Preserve useful existing content and structure. Make the smallest change needed for the approved Change Pack.\n- Use only facts already present in the existing page or listed under APPROVED EVIDENCE.\n- company_asserted facts may be presented as company-provided claims, never as independently verified claims.\n- Never invent ROI, customer counts, certifications, prices, reviews, rankings, awards, or implementation times.\n- Do not add hidden text, fake FAQ answers, fake reviews, tracking scripts, iframes, or remote code.\n- Keep links and accessible semantics where possible.\n- This output will be saved as status=draft, never auto-published.\n\nPAGE TITLE: ${input.title}\nCHANGE PACK: ${input.pack.title}\nRATIONALE: ${input.pack.rationale}\nRECOMMENDED HEADINGS: ${input.pack.recommendedHeadings.join(" | ")}\nAPPROVED EVIDENCE:\n${evidence(input.pack)}\n\nCURRENT HTML:\n---BEGIN HTML---\n${input.currentHtml}\n---END HTML---`);
}
