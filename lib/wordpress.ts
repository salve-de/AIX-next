import "server-only";
import { openSecret, sealSecret } from "@/lib/crypto-secrets";
import { getIntegration, saveIntegration } from "@/lib/integration-store";
import { safeFetch } from "@/lib/url-security";

function normalizeBase(input: string) {
  const url = new URL(input.trim());
  if (url.protocol !== "https:") throw new Error("WordPress integration requires HTTPS.");
  url.hash = ""; url.search = ""; url.pathname = url.pathname.replace(/\/+$/, "").replace(/\/wp-json\/?$/i, "");
  return url.toString().replace(/\/$/, "");
}
export function hostnameAllowedForClaim(baseUrl: string, claimedDomain: string) {
  const host = new URL(baseUrl).hostname.toLowerCase().replace(/^www\./, ""); const claim = claimedDomain.toLowerCase().replace(/^www\./, "");
  return host === claim || host.endsWith(`.${claim}`);
}
function auth(username: string, password: string) { return `Basic ${Buffer.from(`${username}:${password}`, "utf8").toString("base64")}`; }
async function wp<T>(baseUrl: string, username: string, password: string, path: string, init: RequestInit = {}) {
  const response = await safeFetch(`${baseUrl}${path}`, { ...init, headers: { authorization: auth(username, password), "content-type": "application/json", accept: "application/json", ...(init.headers || {}) }, timeoutMs: 15_000 });
  const text = await response.text(); let data: any = null; try { data = text ? JSON.parse(text) : null; } catch { /* non-json error */ }
  if (!response.ok) throw new Error(`WordPress ${response.status}: ${String(data?.message || text).slice(0, 260)}`);
  return data as T;
}

export async function connectWordPress(input: { watchId: string; claimedDomain: string; baseUrl: string; username: string; applicationPassword: string }) {
  const baseUrl = normalizeBase(input.baseUrl); if (!hostnameAllowedForClaim(baseUrl, input.claimedDomain)) throw new Error("WordPress host must match the verified company domain or its subdomain.");
  const username = input.username.trim(); const password = input.applicationPassword.trim(); if (!username || password.length < 12) throw new Error("Valid WordPress username and Application Password are required.");
  const me = await wp<{ id: number; name?: string; username?: string }>(baseUrl, username, password, "/wp-json/wp/v2/users/me?context=edit&_fields=id,name,username");
  await saveIntegration(input.watchId, "wordpress", { baseUrl, username, displayName: me.name || me.username || username, connectedAt: new Date().toISOString() }, sealSecret(password));
  return { baseUrl, username, displayName: me.name || me.username || username };
}

async function credentials(watchId: string) {
  const integration = await getIntegration(watchId, "wordpress"); if (!integration?.secretCiphertext) throw new Error("WordPress is not connected.");
  return { baseUrl: String(integration.publicConfig.baseUrl || ""), username: String(integration.publicConfig.username || ""), password: openSecret(integration.secretCiphertext) };
}

export async function listWordPressPages(watchId: string) {
  const c = await credentials(watchId);
  const pages = await wp<Array<{ id: number; link: string; slug: string; status: string; modified: string; title: { rendered?: string; raw?: string } }>>(c.baseUrl, c.username, c.password, "/wp-json/wp/v2/pages?context=edit&per_page=100&orderby=modified&order=desc&_fields=id,link,slug,status,modified,title");
  return pages.map((page) => ({ id: page.id, title: page.title.raw || page.title.rendered || page.slug, slug: page.slug, status: page.status, modified: page.modified, link: page.link }));
}

export async function fetchWordPressPage(watchId: string, pageId: number) {
  const c = await credentials(watchId);
  const page = await wp<{ id: number; link: string; slug: string; title: { raw?: string; rendered?: string }; content: { raw?: string; rendered?: string } }>(c.baseUrl, c.username, c.password, `/wp-json/wp/v2/pages/${pageId}?context=edit&_fields=id,link,slug,title,content`);
  return { ...c, id: page.id, link: page.link, slug: page.slug, title: page.title.raw || page.title.rendered || page.slug, html: page.content.raw || page.content.rendered || "" };
}

export async function createWordPressDraftCopy(watchId: string, input: { originalPageId: number; title: string; content: string }) {
  const c = await credentials(watchId);
  const draft = await wp<{ id: number; link: string; status: string }>(c.baseUrl, c.username, c.password, "/wp-json/wp/v2/pages", { method: "POST", body: JSON.stringify({ status: "draft", title: `[AIX Draft] ${input.title}`.slice(0, 200), content: input.content, meta: {} }) });
  return { id: draft.id, status: draft.status, link: draft.link, editUrl: `${c.baseUrl}/wp-admin/post.php?post=${draft.id}&action=edit`, originalPageId: input.originalPageId };
}
