import type { Citation } from "@/lib/types";

function addCitation(result: Map<string, Citation>, url: unknown, title?: unknown, kind: Citation["kind"] = "search") {
  if (typeof url !== "string" || !url) return;
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol) || parsed.username || parsed.password) return;
    const previous = result.get(parsed.toString());
    result.set(parsed.toString(), {
      kind: previous?.kind === "answer" ? "answer" : kind,
      title: typeof title === "string" && title ? title : parsed.hostname,
      url: parsed.toString(),
      domain: parsed.hostname.replace(/^www\./, ""),
    });
  } catch { /* ignore malformed URLs from provider payloads */ }
}

export function parseOpenAiWebSearchResponse(data: any) {
  const messages = (Array.isArray(data?.output) ? data.output : []).filter((item: any) => item?.type === "message");
  const rawText = typeof data?.output_text === "string"
    ? data.output_text
    : messages.flatMap((item: any) => Array.isArray(item.content) ? item.content : []).map((part: any) => typeof part?.text === "string" ? part.text : "").filter(Boolean).join("\n");
  const citations = new Map<string, Citation>();
  for (const message of messages) {
    for (const part of Array.isArray(message.content) ? message.content : []) {
      for (const annotation of Array.isArray(part?.annotations) ? part.annotations : []) {
        addCitation(citations, annotation?.url || annotation?.url_citation?.url, annotation?.title || annotation?.url_citation?.title, "answer");
      }
    }
  }
  const searchCalls = (Array.isArray(data?.output) ? data.output : []).filter((item: any) => item?.type === "web_search_call");
  for (const call of searchCalls) {
    for (const source of Array.isArray(call?.action?.sources) ? call.action.sources : []) addCitation(citations, source?.url, source?.title);
  }
  // Sonar's citation array is separate from search_results. Preserve both kinds.
  for (const url of Array.isArray(data?.citations) ? data.citations : []) addCitation(citations, url, undefined, "answer");
  return {
    rawText,
    citations: [...citations.values()].slice(0, 20),
    model: typeof data?.model === "string" ? data.model : undefined,
    inputTokens: Number.isFinite(data?.usage?.input_tokens) ? data.usage.input_tokens as number : undefined,
    outputTokens: Number.isFinite(data?.usage?.output_tokens) ? data.usage.output_tokens as number : undefined,
    searchRequests: searchCalls.length,
  };
}

function geminiTextBlocks(data: any) {
  return (Array.isArray(data?.steps) ? data.steps : [])
    .filter((step: any) => step?.type === "model_output")
    .flatMap((step: any) => Array.isArray(step?.content) ? step.content : [])
    .filter((block: any) => block?.type === "text");
}

export function parseGeminiInteractionResponse(data: any) {
  const blocks = geminiTextBlocks(data);
  const citations = new Map<string, Citation>();
  for (const block of blocks) {
    for (const annotation of Array.isArray(block?.annotations) ? block.annotations : []) {
      if (annotation?.type === "url_citation") addCitation(citations, annotation?.url, annotation?.title, "answer");
    }
  }
  const groundingCount = (Array.isArray(data?.usage?.grounding_tool_count) ? data.usage.grounding_tool_count : [])
    .filter((item: any) => item?.type === "google_search")
    .reduce((sum: number, item: any) => sum + (Number(item?.count) || 0), 0);
  const stepCount = (Array.isArray(data?.steps) ? data.steps : []).filter((step: any) => step?.type === "google_search_call").length;
  return {
    rawText: blocks.map((block: any) => typeof block?.text === "string" ? block.text : "").filter(Boolean).join("\n"),
    citations: [...citations.values()].slice(0, 20),
    model: typeof data?.model === "string" ? data.model : undefined,
    inputTokens: Number.isFinite(data?.usage?.total_input_tokens) ? data.usage.total_input_tokens as number : undefined,
    outputTokens: Number.isFinite(data?.usage?.total_output_tokens) ? data.usage.total_output_tokens as number : undefined,
    searchRequests: groundingCount || stepCount,
    status: typeof data?.status === "string" ? data.status : undefined,
  };
}

export function parsePerplexitySonarResponse(data: any) {
  const rawText = typeof data?.choices?.[0]?.message?.content === "string" ? data.choices[0].message.content : "";
  const citations = new Map<string, Citation>();
  const sources = Array.isArray(data?.search_results) && data.search_results.length ? data.search_results : Array.isArray(data?.citations) ? data.citations : [];
  for (const source of sources) {
    if (typeof source === "string") addCitation(citations, source);
    else addCitation(citations, source?.url, source?.title);
  }
  // Sonar's citation array is separate from search_results. Preserve both kinds.
  for (const url of Array.isArray(data?.citations) ? data.citations : []) addCitation(citations, url, undefined, "answer");
  return {
    rawText,
    citations: [...citations.values()].slice(0, 20),
    model: typeof data?.model === "string" ? data.model : undefined,
    inputTokens: Number.isFinite(data?.usage?.prompt_tokens) ? data.usage.prompt_tokens as number : undefined,
    outputTokens: Number.isFinite(data?.usage?.completion_tokens) ? data.usage.completion_tokens as number : undefined,
    searchRequests: Number.isFinite(data?.usage?.num_search_queries) ? data.usage.num_search_queries as number : undefined,
    costUsd: Number.isFinite(data?.usage?.cost?.total_cost) ? data.usage.cost.total_cost as number : undefined,
  };
}
