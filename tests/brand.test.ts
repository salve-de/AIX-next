import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { BRAND, DATA_DELETION_CONFIRMATION, brandedEmailSender } from "../lib/brand";
import { currentProfileJson, currentProfileMarkdown, currentProfileTitle, isDataDeletionConfirmation } from "../lib/brand-compatibility";
import { isAllowedByRobots } from "../lib/robots";

const read = (path: string) => readFileSync(path, "utf8");

test("正式名称と日本語の読みが公開情報・packageで一致する", () => {
  assert.equal(BRAND.name, "Rovan");
  assert.equal(BRAND.nameJa, "ロヴァン");
  const index = JSON.parse(read("public/ai-index.json"));
  assert.equal(index.name, BRAND.name);
  assert.equal(index.alternateName, BRAND.nameJa);
  assert.ok(read("public/llms.txt").startsWith("# Rovan（ロヴァン）"));
  assert.equal(JSON.parse(read("package.json")).name, BRAND.slug);
  const lock = JSON.parse(read("package-lock.json"));
  assert.equal(lock.name, BRAND.slug);
  assert.equal(lock.packages[""].name, BRAND.slug);
  assert.ok(lock.packages["node_modules/@esbuild/aix-ppc64"]);
});

test("顧客向けコードに旧サービス表示・未確認ドメインが残らない", () => {
  function inspect(dir: string) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) { inspect(path); continue; }
      if (path === "lib/brand-compatibility.ts" || !/\.(tsx?|css|json|txt|svg)$/.test(path)) continue;
      const content = read(path).replace(/aix_next_[a-z_]+/g, "").replace(/aixNext[A-Za-z]+/g, "");
      assert.doesNotMatch(content, /AIX|aixnextbot|aix\.jp|aix-next\.com|aix-/i, path);
    }
  }
  ["app", "components", "lib", "public"].forEach(inspect);
});

test("改名後も既存DBスキーマの参照を維持する", () => {
  assert.match(read("supabase/migrations/001_core.sql"), /public\.aix_next_scans/);
  assert.match(read("lib/storage.ts"), /aix_next_scans/);
  assert.match(read("lib/watch-runs.ts"), /aix_next_watch_runs/);
  assert.match(read("lib/rate-limit.ts"), /aix_next_consume_rate_limit/);
});

test("削除確認は新旧の完全一致だけを許可し認証条件を維持する", () => {
  assert.equal(DATA_DELETION_CONFIRMATION, "DELETE ROVAN DATA");
  assert.equal(isDataDeletionConfirmation(DATA_DELETION_CONFIRMATION), true);
  assert.equal(isDataDeletionConfirmation("DELETE AIX DATA"), true);
  for (const value of ["DELETE", "", undefined, null, 123, "delete rovan data", "DELETE ROVAN DATA "]) {
    assert.equal(isDataDeletionConfirmation(value), false);
  }
  assert.match(read("app/api/privacy/delete/route.ts"), /!validToken\(body\?\.token\)/);
  assert.match(read("app/api/privacy/delete/route.ts"), /typeof body\?\.email !== "string"/);
});

test("RovanBotと旧クローラーの明示的拒否を両方尊重する", () => {
  assert.equal(isAllowedByRobots("User-agent: RovanBot\nDisallow: /private", "/private/x"), false);
  for (const agent of ["AIXNextBot", "AIXBot"]) {
    const rules = `User-agent: RovanBot\nAllow: /\nUser-agent: ${agent}\nDisallow: /private`;
    assert.equal(isAllowedByRobots(rules, "/private/x"), false);
    assert.equal(isAllowedByRobots(rules, "/public"), true);
  }
  assert.equal(isAllowedByRobots("User-agent: *\nDisallow: /\nUser-agent: RovanBot\nAllow: /", "/public"), true);
  assert.equal(isAllowedByRobots("User-agent: *\nDisallow: /", "/public"), false);
});

test("保存済みプロフィールは発行者だけ改名し企業名・事実・原本を変えない", () => {
  const source = JSON.stringify({ publisher: "AIX", subject: { name: "AIX株式会社" }, facts: [{ value: "AIX対応" }] });
  const result = JSON.parse(currentProfileJson(source));
  assert.equal(result.publisher, "Rovan");
  assert.equal(result.subject.name, "AIX株式会社");
  assert.equal(result.facts[0].value, "AIX対応");
  assert.equal(JSON.parse(source).publisher, "AIX");
  const oldTitle = "AIX株式会社 | AIX公開情報";
  const title = currentProfileTitle(oldTitle, "AIX株式会社");
  assert.equal(title, "AIX株式会社 | Rovan公開情報参照ページ");
  assert.equal(currentProfileTitle("AIX株式会社の公式サイト", "AIX株式会社"), "AIX株式会社の公式サイト");
  assert.equal(currentProfileMarkdown(`# ${oldTitle}\n\nAIX対応`, oldTitle, title), `# ${title}\n\nAIX対応`);
  assert.equal(currentProfileJson("invalid JSON"), "invalid JSON");
});

test("送信元のアドレスを変えずRovan名義に統一する", () => {
  assert.equal(brandedEmailSender("AIX <notify@owned.example>"), "Rovan <notify@owned.example>");
  assert.equal(brandedEmailSender("notify@owned.example"), "Rovan <notify@owned.example>");
  assert.equal(brandedEmailSender("Rovan <notify@owned.example>"), "Rovan <notify@owned.example>");
  assert.equal(brandedEmailSender("invalid"), "invalid");
});
