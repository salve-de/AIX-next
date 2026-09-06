import assert from "node:assert/strict";
import test from "node:test";
import { publicProfileSlug } from "../lib/public-profile-path";

test("direct public profiles derive their slug from the Rovan path", () => {
  assert.equal(
    publicProfileSlug("http://localhost:3000/ai/company/%E7%94%B0%E4%B8%AD%E7%B2%BE%E5%AF%86%E5%8A%A0%E5%B7%A5%E6%89%80"),
    "田中精密加工所",
  );
});

test("external public profiles keep a host-based slug", () => {
  assert.equal(publicProfileSlug("https://www.example.jp/company/overview"), "example-jp");
});
