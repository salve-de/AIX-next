#!/usr/bin/env python3
"""Rovanへの一度限りの改名。既存DB・実在URL・Git履歴は変更しない。"""
from pathlib import Path
import hashlib
import json
import re

ROOT = Path.cwd()
MARKER = ROOT / 'docs/ROVAN_BRAND_MIGRATION.md'
if MARKER.exists():
    print('Rovan migration already applied; no changes.')
    raise SystemExit(0)

def read(path):
    return (ROOT / path).read_text(encoding='utf-8')

def write(path, text):
    p = ROOT / path
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(text, encoding='utf-8')

def edit(path, old, new, required=True):
    text = read(path)
    if old not in text:
        if required:
            raise RuntimeError(f'Expected source not found in {path}: {old[:90]}')
        return
    write(path, text.replace(old, new))

def add_import(path, statement):
    text = read(path)
    if statement in text:
        return
    if text.startswith('"use client";'):
        text = text.replace('"use client";', '"use client";\n\n' + statement, 1)
    else:
        text = statement + '\n' + text
    write(path, text)

paths = [p for p in ROOT.rglob('*') if p.is_file() and not any(x in p.parts for x in ('.git','node_modules','.next'))]
original_sql = {str(p.relative_to(ROOT)): hashlib.sha256(p.read_bytes()).hexdigest() for p in ROOT.glob('supabase/migrations/*.sql')}
original_lock = json.loads(read('package-lock.json'))
changed = []

# 既存の実在する参照先・保存契約は、表面的な改名のために壊さない。
protected = re.compile(r'https?://[^\s<>\[\]`"\')]+|(?:file://)?/Users/[^\s<>`"\')]+|/home/runner/[^\s<>`"\')]+|salve-de/AIX(?:-next)?|codex/aix-next-v2|outputs/reference-research/AIX_REFERENCE_RESEARCH_2026-09-02\.md|aix_next_[A-Za-z_]+|aixNext[A-Za-z]+')
for path in paths:
    rel = path.relative_to(ROOT).as_posix()
    if rel.startswith(('supabase/migrations/','scripts/')) or rel in ('package-lock.json','docs/CI_FAILURE.md','.github/workflows/rovan-rebrand.yml'):
        continue
    try:
        text = path.read_text(encoding='utf-8')
    except UnicodeError:
        continue
    old = text
    spans = []
    def protect(match):
        spans.append(match.group())
        return f'@@PRESERVE{len(spans)-1}@@'
    text = protected.sub(protect, text)
    text = text.replace('AIXNextBot', 'RovanBot').replace('aixnextbot', 'rovanbot').replace('AIXBot', 'RovanBot')
    text = text.replace('AIX-next', 'Rovan').replace('AIX Next', 'Rovan').replace('AIX NEXT', 'Rovan')
    text = text.replace('AIX', 'Rovan').replace('aix-next', 'rovan').replace('aix-', 'rovan-').replace('buyer-journey-aix', 'buyer-journey-rovan')
    if rel.endswith('.md'):
        text = re.sub(r'\]\((#[^)]+)\)', lambda m: '](' + m[1].replace('aix', 'rovan') + ')', text)
    text = text.replace('エーアイエックス', 'ロヴァン').replace('エーアイ・エックス', 'ロヴァン')
    text = re.sub(r'@@PRESERVE(\d+)@@', lambda m: spans[int(m[1])], text)
    if text != old:
        path.write_text(text, encoding='utf-8')
        changed.append(rel)

# lockfileはルート名だけを変更し、依存パッケージのOS名aixや完全性を保持する。
lock_text = read('package-lock.json').replace('"name": "aix-next"', '"name": "rovan"')
write('package-lock.json', lock_text)

write('lib/brand.ts', '''/** 正式名称の唯一の定義。機能名・法人名・契約IDとは区別する。 */
export const BRAND = {
  name: "Rovan",
  nameJa: "ロヴァン",
  slug: "rovan",
  crawler: "RovanBot",
} as const;
export const DATA_DELETION_CONFIRMATION = "DELETE ROVAN DATA";
''')

write('lib/brand-compatibility.ts', '''import { BRAND, DATA_DELETION_CONFIRMATION } from "./brand";

/** 旧バージョンの画面と既存のクロール拒否設定に対する互換性。 */
export const LEGACY_CRAWLER_AGENTS = ["aixnextbot", "aixbot"] as const;
export function isDataDeletionConfirmation(value: unknown): boolean {
  return value === DATA_DELETION_CONFIRMATION || value === "DELETE AIX DATA";
}

/** 企業名や本文中の文字を置換せず、サービスが付けた接尾辞だけを更新する。 */
export function currentProfileTitle(title: string, subject: string): string {
  return title === `${subject} | AIX公開情報` || title === `${subject} | AIX Next公開情報`
    ? `${subject} | ${BRAND.name}公開情報`
    : title;
}

/** 保存済み原本には書き戻さず、配信用JSONの発行元だけを更新する。 */
export function currentProfileJson(source: string): string {
  try {
    const value = JSON.parse(source);
    if (!value || typeof value !== "object" || Array.isArray(value)) return source;
    if (value.publisher !== "AIX" && value.publisher !== "AIX Next") return source;
    value.publisher = BRAND.name;
    return `${JSON.stringify(value, null, 2)}\\n`;
  } catch {
    return source;
  }
}

export function currentProfileMarkdown(source: string, previousTitle: string, title: string): string {
  const prefix = `# ${previousTitle}\\n`;
  return previousTitle !== title && source.startsWith(prefix)
    ? `# ${title}\\n${source.slice(prefix.length)}`
    : source;
}
''')

# 画面、メタ情報、機械可読情報に読みを明示する。
add_import('components/brand.tsx', 'import { BRAND } from "@/lib/brand";')
edit('components/brand.tsx', 'aria-label="Rovan ホーム"', 'aria-label={`${BRAND.name}（${BRAND.nameJa}）ホーム`}')
edit('components/brand.tsx', '<strong>Rovan</strong>', '<strong>{BRAND.name}</strong>')
add_import('app/layout.tsx', 'import { BRAND } from "@/lib/brand";')
edit('app/layout.tsx', 'applicationName: "Rovan"', 'applicationName: BRAND.name')
edit('app/layout.tsx', 'default: "Rovan —', 'default: "Rovan（ロヴァン）—')
edit('app/layout.tsx', 'openGraph: { type: "website",', 'openGraph: { siteName: BRAND.name, type: "website",')
add_import('components/structured-data.tsx', 'import { BRAND } from "@/lib/brand";')
edit('components/structured-data.tsx', 'name: "Rovan",', 'name: BRAND.name,\n      alternateName: BRAND.nameJa,')
index = json.loads(read('public/ai-index.json'))
index['name'] = 'Rovan'
index['alternateName'] = 'ロヴァン'
write('public/ai-index.json', json.dumps(index, ensure_ascii=False, indent=2) + '\n')
edit('public/llms.txt', '# Rovan\n', '# Rovan（ロヴァン）\n')

# UIから送る確認文字列とサーバー判定を同じ定義にする。認証要件は維持。
add_import('app/api/privacy/delete/route.ts', 'import { isDataDeletionConfirmation } from "@/lib/brand-compatibility";')
edit('app/api/privacy/delete/route.ts', 'body.confirmation !== "DELETE Rovan DATA"', '!isDataDeletionConfirmation(body.confirmation)')
edit('app/api/privacy/delete/route.ts', 'DELETE Rovan DATA', 'DELETE ROVAN DATA')
add_import('components/data-rights-client.tsx', 'import { DATA_DELETION_CONFIRMATION } from "@/lib/brand";')
edit('components/data-rights-client.tsx', 'placeholder="DELETE Rovan DATA"', 'placeholder={DATA_DELETION_CONFIRMATION}')

# 改名で、旧クローラー宛ての明示的な拒否をすり抜けない。
add_import('lib/robots.ts', 'import { LEGACY_CRAWLER_AGENTS } from "./brand-compatibility";')
edit('lib/robots.ts', '  const groups = parseRobots(source);', '''  const groups = parseRobots(source);
  if (agent.toLowerCase().includes("rovanbot")) {
    for (const legacy of LEGACY_CRAWLER_AGENTS) {
      const hasLegacyPolicy = groups.some((group) => group.agents.some((item) => item !== "*" && legacy.includes(item)));
      if (hasLegacyPolicy && !isAllowedByRobots(source, pathname, legacy)) return false;
    }
  }''')

# 過去に生成した公開プロフィールも、配信時だけ発行元ラベルを更新。
add_import('lib/public-profile.ts', 'import { currentProfileJson, currentProfileMarkdown, currentProfileTitle } from "./brand-compatibility";')
edit('lib/public-profile.ts', 'export function toPublicProfile(record: PublicProfileRecord): PublicProfile {\n  return {', 'export function toPublicProfile(record: PublicProfileRecord): PublicProfile {\n  const title = currentProfileTitle(record.title, record.brandName);\n  return {')
edit('lib/public-profile.ts', '    title: record.title,', '    title,')
edit('lib/public-profile.ts', '    markdown: record.markdown,', '    markdown: currentProfileMarkdown(record.markdown, record.title, title),')
edit('lib/public-profile.ts', '    json: record.json,', '    json: currentProfileJson(record.json),')

# 所有確認していないドメインやメールを新たに捏造しない。
for rel in ['components/executive-referral-card.tsx','components/public-profile-actions.tsx','components/result-client.tsx','components/watch-client.tsx']:
    text = read(rel)
    if 'https://aix' not in text:
        continue
    add_import(rel, 'import { siteUrl } from "@/lib/site";')
    if rel.endswith('executive-referral-card.tsx'):
        edit(rel, 'https://aix-next.com/', '${typeof window !== "undefined" ? window.location.origin : siteUrl}/')
        edit(rel, '`Rovan-${tokenSuffix', '`ROVAN-${tokenSuffix')
    elif rel.endswith('public-profile-actions.tsx'):
        edit(rel, '<code>https://aix.jp/ai/company/...</code>', '<code>{`${siteUrl}/ai/company/...`}</code>')
    else:
        edit(rel, ': "https://aix.jp"', ': siteUrl')

public_page = 'app/ai/company/[slug]/page.tsx'
if 'info@aix.jp' in read(public_page):
    add_import(public_page, 'import { seller } from "@/lib/legal";')
    edit(public_page, 'href={`mailto:info@aix.jp?subject=${encodeURIComponent(`【掲載照会・非公開申請】${profile.brandName}の公開情報参照ページについて`)}`}', 'href={seller.email ? `mailto:${seller.email}?subject=${encodeURIComponent(`【掲載照会・非公開申請】${profile.brandName}の公開情報参照ページについて`)}` : "/support"}')
    edit(public_page, '公式窓口（info@aix.jp）', 'お問い合わせ窓口{seller.email ? `（${seller.email}）` : ""}')

# 既存のlint失敗を、検証内容を弱めずES importで解消する。
if (ROOT / 'tests/autonomous-watch.test.ts').exists():
    add_import('tests/autonomous-watch.test.ts', 'import { extractCompetitorTextDiff } from "../lib/competitor-diff";')
    edit('tests/autonomous-watch.test.ts', '  const { extractCompetitorTextDiff } = require("../lib/competitor-diff");\n', '')

# 同じ配色を保ったRモノグラム。フォントや外部画像に依存しない。
write('public/favicon.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" role="img" aria-label="Rovan"><title>Rovan</title><rect width="64" height="64" rx="14" fill="#09131e"/><path d="M18 16h16c9 0 14 5 14 13 0 6-3 10-8 12l9 9H38L27 38v12h-9V16Zm9 8v7h7c4 0 5-1 5-4s-2-3-5-3h-7Z" fill="#39e6ac"/></svg>\n')

# 動くclone URLを維持しつつ、新しいローカル作業名を示す。
edit('README.md', '# Rovan\n', '# Rovan（ロヴァン）\n\n正式サービス名は **Rovan**、日本語の読みは **ロヴァン**。名称と移行時の互換性は [改名記録](docs/ROVAN_BRAND_MIGRATION.md) を参照してください。\n')
edit('README.md', 'git clone https://github.com/salve-de/AIX-next.git\ncd Rovan', 'git clone https://github.com/salve-de/AIX-next.git rovan\ncd rovan', required=False)
write('.env.example', read('.env.example').rstrip() + '\n\n# Rovan: 実際に管理する公開URL・認証済み送信元を設定する。ドメインは自動購入しない。\n# WATCH_FROM_EMAIL は Rovan <認証済みメールアドレス> の形式。\n# 掲載照会・非公開申請窓口。未設定時は /support を案内する。\nSELLER_EMAIL=\nSELLER_LEGAL_NAME=\nSELLER_REPRESENTATIVE=\nSELLER_ADDRESS=\nSELLER_PHONE=\nSELLER_SUPPORT_HOURS=\n')

# ドキュメント中の例示用旧ドメインは予約されたexampleへ。実在GitHub参照は保持。
for path in (ROOT / 'docs').glob('*.md'):
    if path.name == 'CI_FAILURE.md':
        continue
    text = path.read_text()
    text = text.replace('https://aix-next.com/', 'https://rovan.example/').replace('aix-next.com/ai/company/', 'rovan.example/ai/company/').replace('https://aix.jp/', 'https://rovan.example/').replace('https://aix.example/', 'https://rovan.example/').replace('info@aix.jp', 'SELLER_EMAILで設定した連絡先')
    path.write_text(text)

notes = '''\n\n## 2026-09-06 — 正式サービス名 Rovan（ロヴァン）への統一\n\n- オーナー指定: 「サービス名を Rovan にして ロヴァン」「よし じゃあやれ 全部やれ」。\n- 正式表記は Rovan、日本語の読みはロヴァン。Rovan Next という別名にはしない。\n- 画面、文書、メール、配布ファイル名、クローラー名、メタ情報、構造化データを統一。機能・料金・完全放置の事業方針は変えない。\n- 保存済み顧客データ、DB/RPCの識別子、決済ID、過去Git履歴、実在するリポジトリURLは互換性のため維持する。\n- 新しいドメインやメールの所有は仮定しない。NEXT_PUBLIC_SITE_URL・SELLER_EMAIL・WATCH_FROM_EMAILを正本とする。\n- 作業内容・残る外部設定と検証方法は [改名記録](ROVAN_BRAND_MIGRATION.md) に集約する。\n'''
for doc in ['docs/OWNER_VISION_AND_PHILOSOPHY.md','docs/PROJECT_MASTER_HISTORY_AND_STRATEGY.md']:
    write(doc, read(doc).rstrip() + notes)
master = read('docs/PROJECT_MASTER_HISTORY_AND_STRATEGY.md')
write('docs/PROJECT_MASTER_HISTORY_AND_STRATEGY.md', master.replace('\n', '\n\n[正式サービス名 Rovan（ロヴァン）への移行記録](ROVAN_BRAND_MIGRATION.md)\n', 1))

write('tests/brand.test.ts', '''import assert from "node:assert/strict";
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import test from "node:test";
import { BRAND, DATA_DELETION_CONFIRMATION } from "../lib/brand";
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
      if (path === "lib/brand-compatibility.ts" || !/\\.(tsx?|css|json|txt|svg)$/.test(path)) continue;
      const content = read(path).replace(/aix_next_[a-z_]+/g, "").replace(/aixNext[A-Za-z]+/g, "");
      assert.doesNotMatch(content, /AIX|aixnextbot|aix\\.jp|aix-next\\.com|aix-/i, path);
    }
  }
  ["app", "components", "lib", "public"].forEach(inspect);
});

test("改名後も既存DBスキーマの参照を維持する", () => {
  assert.match(read("supabase/migrations/001_core.sql"), /public\\.aix_next_scans/);
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
  assert.match(read("app/api/privacy/delete/route.ts"), /!body\\.token \\|\\| !body\\.email/);
});

test("RovanBotと旧クローラーの明示的拒否を両方尊重する", () => {
  assert.equal(isAllowedByRobots("User-agent: RovanBot\\nDisallow: /private", "/private/x"), false);
  for (const agent of ["AIXNextBot", "AIXBot"]) {
    const rules = `User-agent: RovanBot\\nAllow: /\\nUser-agent: ${agent}\\nDisallow: /private`;
    assert.equal(isAllowedByRobots(rules, "/private/x"), false);
    assert.equal(isAllowedByRobots(rules, "/public"), true);
  }
  assert.equal(isAllowedByRobots("User-agent: *\\nDisallow: /\\nUser-agent: RovanBot\\nAllow: /", "/public"), true);
  assert.equal(isAllowedByRobots("User-agent: *\\nDisallow: /", "/public"), false);
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
  assert.equal(title, "AIX株式会社 | Rovan公開情報");
  assert.equal(currentProfileTitle("AIX株式会社の公式サイト", "AIX株式会社"), "AIX株式会社の公式サイト");
  assert.equal(currentProfileMarkdown(`# ${oldTitle}\\n\\nAIX対応`, oldTitle, title), `# ${title}\\n\\nAIX対応`);
  assert.equal(currentProfileJson("invalid JSON"), "invalid JSON");
});
''')

# 変更前後でデータ契約と依存解決を比較し、違いがあれば停止する。
for path, digest in original_sql.items():
    assert hashlib.sha256((ROOT / path).read_bytes()).hexdigest() == digest, path
new_lock = json.loads(read('package-lock.json'))
original_lock['name'] = 'rovan'
original_lock['packages']['']['name'] = 'rovan'
assert new_lock == original_lock, 'Dependency lock changed beyond root branding'

write('docs/ROVAN_BRAND_MIGRATION.md', '''# Rovan（ロヴァン）改名記録\n\n決定日: 2026-09-06。正式サービス名は **Rovan**、日本語の読みは **ロヴァン**。\n\n## 変更範囲\n\n画面・ヘッダー・フッター・favicon・メール・診断レポート・データ書き出し名・削除確認表示・紹介文・robotsクローラー名・ページタイトル・OGP・構造化データ・llms.txt・ai-index.json・package名・現行ドキュメントを統一した。ブランドの定義は `lib/brand.ts`。\n\n機能、料金、測定条件、秘密値、決済ID、顧客の原データは変更していない。既存のlintエラー1件は、テストのrequireをES importへ置き換えて修正した。\n\n## 意図して保持する互換性\n\n- Supabaseの `aix_next_*` テーブル・RPCと既存SQL migration。単なる改名でデータへの接続を切らないため。\n- プロセス内の `aixNext*` 保存キー。既存状態を引き継ぐため。\n- npm依存の `@esbuild/aix-ppc64` とOS指定 `aix`。第三者パッケージの正式名であり本サービスとは無関係。\n- 旧クローラー `AIXNextBot` / `AIXBot` の明示的拒否。RovanBotへの改名で既存拒否を回避しない。\n- 旧画面の `DELETE AIX DATA` をサーバー側だけ互換受付。新画面は `DELETE ROVAN DATA`。token・メールによる照合は維持。\n- 過去のGit履歴、実在GitHub URL、過去ブランチ名、ローカルパス、CI失敗原本。過去の証拠を書き換えない。\n- 保存済み企業名・本文・AI回答は原本を維持。公開プロフィールの発行者とシステムが付けた見出しだけを、配信時にRovanへ読み替える。\n\n## 外部設定の境界\n\nリポジトリの実体名は `salve-de/AIX-next`。リポジトリ自体のrenameは管理API権限を要する別操作であり、このコード変更はrename済みと偽らない。clone URLは動作する実在URLを保持する。\n\n公開URLは `NEXT_PUBLIC_SITE_URL`、問い合わせは `SELLER_EMAIL`、送信元は `WATCH_FROM_EMAIL`。未所有のrovanドメイン・メールを作ったことにはしない。資料中の `rovan.example` は例示専用であり稼働URLではない。SELLER_EMAIL未設定時は既存の `/support` に案内する。Stripe管理画面の商品表示・送信ドメイン認証・DNS・外部ホスト設定・本番デプロイはコード変更だけでは完了しない。\n\n## 検証\n\n`npm ci` → `npm run lint` → `npm test` → `npm run typecheck` → `npm run build`。`tests/brand.test.ts` が旧表示の再混入、日英表記、DB互換性、削除確認、新旧robots拒否、保存済み顧客名の保全を検査する。\n\n改名前の基準実行: GitHub Actions run `34007314517`。既存45テスト・型・ビルドは成功し、lintは上記require 1件で失敗。改名後の実行結果はGitHub Actionsの対応コミットを正本とする。成功前に検証済みとは扱わない。\n\nこの移行は商標登録・名称の権利調査を含まない。\n''')
print(json.dumps({'changed_initial_files': len(changed), 'protected_sql_files': len(original_sql), 'brand': 'Rovan', 'nameJa': 'ロヴァン'}, ensure_ascii=False))
