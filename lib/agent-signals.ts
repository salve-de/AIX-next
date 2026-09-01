export type AgentSignalKind = "crawler" | "referral";
export type AgentSignal = { kind: AgentSignalKind; agent: string; referrerDomain?: string };

const crawlers: Array<[RegExp, string]> = [
  [/OAI-SearchBot/i, "OAI-SearchBot"], [/GPTBot/i, "GPTBot"], [/ChatGPT-User/i, "ChatGPT-User"],
  [/PerplexityBot/i, "PerplexityBot"], [/ClaudeBot/i, "ClaudeBot"], [/Claude-User/i, "Claude-User"], [/Googlebot/i, "Googlebot"],
];
const referrals: Array<[RegExp, string]> = [
  [/(^|\.)chatgpt\.com$/i, "ChatGPT"], [/(^|\.)perplexity\.ai$/i, "Perplexity"], [/(^|\.)gemini\.google\.com$/i, "Gemini"],
  [/(^|\.)claude\.ai$/i, "Claude"], [/(^|\.)copilot\.microsoft\.com$/i, "Microsoft Copilot"],
];

function domainOf(referrer: string) { try { return new URL(referrer).hostname.toLowerCase().replace(/^www\./, ""); } catch { return ""; } }

export function classifyAgentSignal(userAgent: string, referrer: string): AgentSignal | null {
  for (const [pattern, name] of crawlers) if (pattern.test(userAgent || "")) return { kind: "crawler", agent: name };
  const domain = domainOf(referrer || "");
  for (const [pattern, name] of referrals) if (pattern.test(domain)) return { kind: "referral", agent: name, referrerDomain: domain };
  return null;
}
