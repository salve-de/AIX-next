import "server-only";
import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { env } from "@/lib/env";

const privateV4 = [
  /^0\./, /^10\./, /^127\./, /^169\.254\./, /^192\.168\./,
  /^172\.(1[6-9]|2\d|3[01])\./, /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./,
];

function isPrivate(address: string) {
  const value = address.toLowerCase();
  if (value === "::1" || value === "::" || value.startsWith("fe80:") || value.startsWith("fc") || value.startsWith("fd")) return true;
  const mapped = value.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/)?.[1];
  return privateV4.some((pattern) => pattern.test(mapped || value));
}

export function normalizePublicUrl(input: string) {
  const raw = input.trim();
  if (!raw) throw new Error("会社サイトのURLを入力してください。");
  if (/^[a-z][a-z0-9+.-]*:/i.test(raw) && !/^https?:/i.test(raw)) throw new Error("httpまたはhttpsのURLだけ利用できます。");
  const parsed = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  if (!["http:", "https:"].includes(parsed.protocol)) throw new Error("httpまたはhttpsのURLだけ利用できます。");
  if (parsed.username || parsed.password) throw new Error("認証情報を含むURLは利用できません。");
  if (parsed.port && !["80", "443"].includes(parsed.port)) throw new Error("標準ポート以外は利用できません。");
  if (!parsed.hostname || parsed.hostname.length > 253) throw new Error("有効な公開ドメインを入力してください。");
  parsed.hash = "";
  return parsed.toString();
}

async function assertPublicHost(hostname: string) {
  const host = hostname.toLowerCase().replace(/\.$/, "");
  if (host === "localhost" || host.endsWith(".localhost") || host.endsWith(".local")) throw new Error("ローカルURLは利用できません。");
  if (isIP(host) && isPrivate(host)) throw new Error("プライベートIPは利用できません。");
  const records = await lookup(host, { all: true, verbatim: true });
  if (!records.length || records.some((record) => isPrivate(record.address))) throw new Error("安全でない接続先です。");
}

export async function safeFetch(input: string, init: RequestInit = {}, maxBytes = 1_500_000) {
  let current = new URL(normalizePublicUrl(input));
  for (let redirects = 0; redirects <= 5; redirects += 1) {
    await assertPublicHost(current.hostname);
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 15_000);
    let response: Response;
    try {
      response = await fetch(current, {
        ...init,
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "user-agent": `AIXSignalBot/1.0 (+${env.siteUrl}/bot)`,
          accept: "text/html,application/xhtml+xml,application/xml,text/plain;q=0.8,*/*;q=0.3",
          ...(init.headers || {}),
        },
      });
    } finally {
      clearTimeout(timer);
    }
    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location) throw new Error("不正なリダイレクトです。");
      current = new URL(location, current);
      continue;
    }
    const declared = Number(response.headers.get("content-length") || 0);
    if (declared > maxBytes) throw new Error("ページサイズが上限を超えました。");
    return response;
  }
  throw new Error("リダイレクトが多すぎます。");
}

export async function safeFetchText(input: string, maxBytes = 1_500_000) {
  const response = await safeFetch(input, {}, maxBytes);
  if (!response.ok) throw new Error(`ページを取得できませんでした (${response.status})`);
  const type = response.headers.get("content-type") || "";
  if (!/(html|xml|text|json)/i.test(type)) throw new Error("対応していないページ形式です。");
  const bytes = await response.arrayBuffer();
  if (bytes.byteLength > maxBytes) throw new Error("ページサイズが上限を超えました。");
  return { text: new TextDecoder().decode(bytes), response };
}

export function randomToken(bytes = 24) {
  return randomBytes(bytes).toString("base64url");
}

export function signValue(value: string) {
  const signature = createHmac("sha256", env.appSecret).update(value).digest("base64url");
  return `${value}.${signature}`;
}

export function verifySignedValue(input: string) {
  const point = input.lastIndexOf(".");
  if (point < 1) return null;
  const value = input.slice(0, point);
  const actual = Buffer.from(input.slice(point + 1));
  const expected = Buffer.from(createHmac("sha256", env.appSecret).update(value).digest("base64url"));
  return actual.length === expected.length && timingSafeEqual(actual, expected) ? value : null;
}
