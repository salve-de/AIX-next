import { LEGACY_CRAWLER_AGENTS } from "./brand-compatibility";
export type RobotsRule = { type: "allow" | "disallow"; path: string };
export type RobotsGroup = { agents: string[]; rules: RobotsRule[] };

export function parseRobots(source: string): RobotsGroup[] {
  const groups: RobotsGroup[] = [];
  let current: RobotsGroup | null = null;
  let seenRule = false;
  for (const rawLine of source.split(/\r?\n/)) {
    const line = rawLine.replace(/#.*$/, "").trim();
    if (!line || !line.includes(":")) continue;
    const [rawKey, ...rest] = line.split(":");
    const key = rawKey.trim().toLowerCase();
    const value = rest.join(":").trim();
    if (key === "user-agent") {
      if (!current || seenRule) {
        current = { agents: [], rules: [] };
        groups.push(current);
        seenRule = false;
      }
      current.agents.push(value.toLowerCase());
    } else if ((key === "allow" || key === "disallow") && current) {
      seenRule = true;
      if (value) current.rules.push({ type: key, path: value });
    }
  }
  return groups;
}

function matchesRule(pathname: string, rule: string) {
  const escaped = rule.replace(/[.+?^${}()|[\]\\]/g, "\\$&").replaceAll("*", ".*").replace(/\$$/, "$");
  try { return new RegExp(`^${escaped}`).test(pathname); }
  catch { return pathname.startsWith(rule); }
}

export function isAllowedByRobots(source: string, pathname: string, agent = "rovanbot") {
  const groups = parseRobots(source);
  if (agent.toLowerCase().includes("rovanbot")) {
    for (const legacy of LEGACY_CRAWLER_AGENTS) {
      const hasLegacyPolicy = groups.some((group) => group.agents.some((item) => item !== "*" && legacy.includes(item)));
      if (hasLegacyPolicy && !isAllowedByRobots(source, pathname, legacy)) return false;
    }
  }
  const exact = groups.filter((group) => group.agents.some((item) => agent.toLowerCase().includes(item) || item === agent.toLowerCase()));
  const selected = exact.length ? exact : groups.filter((group) => group.agents.includes("*"));
  const rules = selected.flatMap((group) => group.rules).filter((rule) => matchesRule(pathname, rule.path));
  if (!rules.length) return true;
  rules.sort((a, b) => b.path.length - a.path.length || (a.type === "allow" ? -1 : 1));
  return rules[0].type === "allow";
}
