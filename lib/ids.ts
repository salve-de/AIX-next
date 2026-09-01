import { createHash, randomUUID } from "node:crypto";

export function id(prefix = "id") {
  return `${prefix}_${randomUUID().replaceAll("-", "")}`;
}

export function shortHash(value: string, length = 12) {
  return createHash("sha256").update(value).digest("hex").slice(0, length);
}
