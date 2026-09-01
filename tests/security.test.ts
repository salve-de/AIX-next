import assert from "node:assert/strict";
import test from "node:test";
import { normalizePublicUrl, signValue, verifySignedValue } from "../lib/security";

test("bare domain becomes https",()=>{assert.equal(normalizePublicUrl("example.com"),"https://example.com/")});
test("non-http, credentials and non-standard ports are rejected",()=>{assert.throws(()=>normalizePublicUrl("file:///etc/passwd"));assert.throws(()=>normalizePublicUrl("https://user:pass@example.com"));assert.throws(()=>normalizePublicUrl("https://example.com:8443"))});
test("signed values reject tampering",()=>{const signed=signValue("watch-id");assert.equal(verifySignedValue(signed),"watch-id");assert.equal(verifySignedValue(`${signed}x`),null)});
