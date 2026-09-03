import assert from "node:assert/strict";
import test from "node:test";
import { classifyScanInput, isUrlInput } from "../lib/input-kind";

test("recognizes URL and bare domain input", () => {
  assert.equal(isUrlInput("https://example.com/product"), true);
  assert.equal(isUrlInput("example.jp"), true);
  assert.equal(classifyScanInput("https://example.com"), "url");
});

test("keeps company, service, and product names as searchable input", () => {
  assert.equal(isUrlInput("株式会社サンプル"), false);
  assert.equal(classifyScanInput("Notion"), "name");
  assert.equal(classifyScanInput("業務管理クラウド"), "name");
  assert.equal(classifyScanInput("Acme: Pro"), "name");
});

test("treats explicit schemes as URLs so server validation can reject unsafe ones", () => {
  assert.equal(isUrlInput("file:///tmp/example"), true);
});
