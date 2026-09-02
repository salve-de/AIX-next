import "server-only";
import { createSign, randomBytes } from "node:crypto";
import { env } from "@/lib/env";
import { signIntegrationState, verifyIntegrationState } from "@/lib/crypto-secrets";

const API = "https://api.github.com";
function b64(value: object) { return Buffer.from(JSON.stringify(value)).toString("base64url"); }
function headers(token: string) { return { authorization: `Bearer ${token}`, accept: "application/vnd.github+json", "x-github-api-version": "2022-11-28", "content-type": "application/json" }; }

export function githubAppReady() { return Boolean(env.githubAppId && env.githubAppSlug && env.githubAppPrivateKey && env.integrationSigningSecret); }

function appJwt() {
  if (!githubAppReady()) throw new Error("GitHub App is not configured.");
  const now = Math.floor(Date.now() / 1000); const encoded = `${b64({ alg: "RS256", typ: "JWT" })}.${b64({ iat: now - 60, exp: now + 540, iss: env.githubAppId })}`;
  const signer = createSign("RSA-SHA256"); signer.update(encoded); signer.end(); return `${encoded}.${signer.sign(env.githubAppPrivateKey).toString("base64url")}`;
}

async function request<T>(url: string, token: string, init: RequestInit = {}) {
  const response = await fetch(url, { ...init, headers: { ...headers(token), ...(init.headers || {}) } });
  const text = await response.text(); const data = text ? JSON.parse(text) : null;
  if (!response.ok) throw new Error(`GitHub ${response.status}: ${String(data?.message || text).slice(0, 300)}`);
  return data as T;
}

export function createGitHubInstallUrl(watchId: string) {
  if (!githubAppReady()) throw new Error("GitHub App is not configured.");
  const state = signIntegrationState({ watchId, exp: Math.floor(Date.now() / 1000) + 600, nonce: randomBytes(12).toString("base64url") });
  return `https://github.com/apps/${encodeURIComponent(env.githubAppSlug)}/installations/new?state=${encodeURIComponent(state)}`;
}

export function parseGitHubInstallState(state: string) { return verifyIntegrationState<{ watchId: string; exp: number; nonce: string }>(state); }

export async function installationAccessToken(installationId: number) {
  const data = await request<{ token: string; expires_at: string }>(`${API}/app/installations/${installationId}/access_tokens`, appJwt(), { method: "POST", body: JSON.stringify({}) });
  return data.token;
}

export async function githubInstallationInfo(installationId: number) {
  const data = await request<{ account?: { login?: string }; repository_selection?: string }>(`${API}/app/installations/${installationId}`, appJwt());
  return { accountLogin: data.account?.login || "", repositorySelection: data.repository_selection || "selected" };
}

export async function listInstallationRepositories(installationId: number) {
  const token = await installationAccessToken(installationId);
  const data = await request<{ repositories: Array<{ full_name: string; default_branch: string; private: boolean; permissions?: Record<string, boolean> }> }>(`${API}/installation/repositories?per_page=100`, token);
  return data.repositories.map((repo) => ({ fullName: repo.full_name, defaultBranch: repo.default_branch, private: repo.private, permissions: repo.permissions || {} }));
}

export function assertSafeRepositoryPath(path: string) {
  const clean = path.trim().replace(/^\/+/, "");
  if (!clean || clean.length > 300 || clean.includes("..") || clean.includes("\\")) throw new Error("Invalid repository path.");
  const lower = clean.toLowerCase();
  if (lower.startsWith(".github/workflows/") || lower.includes("/.github/workflows/") || /(^|\/)(\.env|\.npmrc|\.pypirc|credentials|secrets?)(\.|$|\/)/i.test(lower)) throw new Error("AIX will not modify workflow or secret-bearing files.");
  if (!/\.(?:md|mdx|html?|tsx?|jsx?|vue|svelte|astro|php|json|ya?ml|css)$/i.test(clean)) throw new Error("Target must be a supported text source file.");
  return clean;
}

export async function fetchRepositoryFile(installationId: number, repoFullName: string, path: string) {
  const safePath = assertSafeRepositoryPath(path); const token = await installationAccessToken(installationId);
  const repo = await request<{ default_branch: string }>(`${API}/repos/${repoFullName}`, token);
  const file = await request<{ sha: string; encoding: string; content: string; size: number }>(`${API}/repos/${repoFullName}/contents/${safePath.split("/").map(encodeURIComponent).join("/")}?ref=${encodeURIComponent(repo.default_branch)}`, token);
  if (file.size > 600_000) throw new Error("Target file is too large for safe automated rewriting.");
  if (file.encoding !== "base64") throw new Error("Target file encoding is not supported.");
  return { token, defaultBranch: repo.default_branch, sha: file.sha, path: safePath, content: Buffer.from(file.content.replace(/\n/g, ""), "base64").toString("utf8") };
}

export async function createContentPullRequest(input: { installationId: number; repoFullName: string; path: string; packId: string; title: string; body: string; newContent: string }) {
  const file = await fetchRepositoryFile(input.installationId, input.repoFullName, input.path); const token = file.token;
  const ref = await request<{ object: { sha: string } }>(`${API}/repos/${input.repoFullName}/git/ref/heads/${encodeURIComponent(file.defaultBranch)}`, token);
  const suffix = randomBytes(5).toString("hex"); const branch = `aix/${input.packId.replace(/[^a-z0-9-]+/gi, "-").slice(0, 35)}-${suffix}`;
  await request(`${API}/repos/${input.repoFullName}/git/refs`, token, { method: "POST", body: JSON.stringify({ ref: `refs/heads/${branch}`, sha: ref.object.sha }) });
  await request(`${API}/repos/${input.repoFullName}/contents/${file.path.split("/").map(encodeURIComponent).join("/")}`, token, { method: "PUT", body: JSON.stringify({ message: `AIX: ${input.title}`.slice(0, 120), content: Buffer.from(input.newContent, "utf8").toString("base64"), sha: file.sha, branch }) });
  const pr = await request<{ html_url: string; number: number }>(`${API}/repos/${input.repoFullName}/pulls`, token, { method: "POST", body: JSON.stringify({ title: input.title.slice(0, 240), body: input.body.slice(0, 20_000), head: branch, base: file.defaultBranch, draft: true }) });
  return { url: pr.html_url, number: pr.number, branch, base: file.defaultBranch, path: file.path };
}
