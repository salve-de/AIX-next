import "server-only";
import { createCipheriv, createDecipheriv, createHmac, createHash, randomBytes, timingSafeEqual } from "node:crypto";
import { env } from "@/lib/env";

function keyBytes(secret: string) {
  if (secret.length < 24) throw new Error("Integration encryption key must be at least 24 characters.");
  return createHash("sha256").update(secret).digest();
}

export function sealWithKey(value: string, secret: string) {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", keyBytes(secret), iv);
  const ciphertext = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv, tag, ciphertext].map((part) => part.toString("base64url")).join(".");
}

export function openWithKey(sealed: string, secret: string) {
  const [ivRaw, tagRaw, ciphertextRaw] = sealed.split(".");
  if (!ivRaw || !tagRaw || !ciphertextRaw) throw new Error("Invalid encrypted credential.");
  const decipher = createDecipheriv("aes-256-gcm", keyBytes(secret), Buffer.from(ivRaw, "base64url"));
  decipher.setAuthTag(Buffer.from(tagRaw, "base64url"));
  return Buffer.concat([decipher.update(Buffer.from(ciphertextRaw, "base64url")), decipher.final()]).toString("utf8");
}

export function sealSecret(value: string) {
  if (!env.integrationEncryptionKey) throw new Error("INTEGRATION_ENCRYPTION_KEY is not configured.");
  return sealWithKey(value, env.integrationEncryptionKey);
}
export function openSecret(value: string) {
  if (!env.integrationEncryptionKey) throw new Error("INTEGRATION_ENCRYPTION_KEY is not configured.");
  return openWithKey(value, env.integrationEncryptionKey);
}

export function signStatePayload(payload: Record<string, unknown>, secret: string) {
  if (secret.length < 24) throw new Error("Integration signing secret must be at least 24 characters.");
  const encoded = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  const signature = createHmac("sha256", secret).update(encoded).digest("base64url");
  return `${encoded}.${signature}`;
}

export function verifyStatePayload<T extends Record<string, unknown>>(state: string, secret: string): T {
  const [encoded, signature] = state.split(".");
  if (!encoded || !signature) throw new Error("Invalid integration state.");
  const expected = createHmac("sha256", secret).update(encoded).digest();
  const received = Buffer.from(signature, "base64url");
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) throw new Error("Invalid integration state signature.");
  const payload = JSON.parse(Buffer.from(encoded, "base64url").toString("utf8")) as T;
  const exp = Number(payload.exp || 0);
  if (!Number.isFinite(exp) || exp < Math.floor(Date.now() / 1000)) throw new Error("Integration state expired.");
  return payload;
}

export function signIntegrationState(payload: Record<string, unknown>) {
  if (!env.integrationSigningSecret) throw new Error("INTEGRATION_SIGNING_SECRET is not configured.");
  return signStatePayload(payload, env.integrationSigningSecret);
}
export function verifyIntegrationState<T extends Record<string, unknown>>(state: string) {
  if (!env.integrationSigningSecret) throw new Error("INTEGRATION_SIGNING_SECRET is not configured.");
  return verifyStatePayload<T>(state, env.integrationSigningSecret);
}
