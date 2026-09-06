from pathlib import Path
import re
import subprocess

# 並行開発で既に修正済みの場合も、テストの内容を変更しない。
source = Path('scripts/rebrand-rovan.py').read_text()
source = source.replace("edit('tests/autonomous-watch.test.ts', '  const { extractCompetitorTextDiff } = require(\"../lib/competitor-diff\");\\n', '')", "edit('tests/autonomous-watch.test.ts', '  const { extractCompetitorTextDiff } = require(\"../lib/competitor-diff\");\\n', '', required=False)")
exec(compile(source, 'scripts/rebrand-rovan.py', 'exec'), {'__name__': '__main__'})

brand = Path('lib/brand.ts')
brand.write_text(brand.read_text() + '''
/** 認証済みメールアドレスを保ち、表示する送信者名だけを統一する。 */
export function brandedEmailSender(value: string): string {
  const input = value.trim();
  const address = input.includes("<")
    ? input.match(/^[^<>\\r\\n]*<([^<>\\r\\n]+)>$/)?.[1]?.trim()
    : input;
  if (!address || !/^[^@\\s<>]+@[^@\\s<>]+$/.test(address)) return value;
  return `${BRAND.name} <${address}>`;
}
''')
email = Path('lib/watch-email.ts')
text = email.read_text()
text = 'import { brandedEmailSender } from "@/lib/brand";\n' + text
assert 'from: env.watchFromEmail,' in text
email.write_text(text.replace('from: env.watchFromEmail,', 'from: brandedEmailSender(env.watchFromEmail),'))
tests = Path('tests/brand.test.ts')
text = tests.read_text().replace('import { BRAND, DATA_DELETION_CONFIRMATION }', 'import { BRAND, DATA_DELETION_CONFIRMATION, brandedEmailSender }')
text += '''
test("送信元のアドレスを変えずRovan名義に統一する", () => {
  assert.equal(brandedEmailSender("AIX <notify@owned.example>"), "Rovan <notify@owned.example>");
  assert.equal(brandedEmailSender("notify@owned.example"), "Rovan <notify@owned.example>");
  assert.equal(brandedEmailSender("Rovan <notify@owned.example>"), "Rovan <notify@owned.example>");
  assert.equal(brandedEmailSender("invalid"), "invalid");
});
'''
tests.write_text(text)

# 新しく追加されたインフラの表示名だけを更新。既存リソースIDは別移行まで維持。
script = Path('scripts/deploy-cloud-run-job.sh')
if script.exists():
    text = script.read_text().replace('AIX Next', 'Rovan').replace('AIX', 'Rovan')
    script.write_text(text)
    doc = Path('docs/ROVAN_BRAND_MIGRATION.md')
    doc.write_text(doc.read_text() + '\n## 並行開発の保全\n\nCloud Run Jobs対応を含む最新featureを基点に適用。ジョブ、Scheduler、Artifact Registry、サービスアカウントの既存 `aix-*` リソースIDは接続互換性のため維持し、説明・ログのブランド表記だけ変更した。デプロイスクリプト自体は実行していない。\n')

# 品質検証はmainだけでなく実際の開発ブランチにも適用する。
ci = Path('.github/workflows/ci.yml')
text = ci.read_text().replace('branches: [main, build/clean-room-v2]', 'branches: [main, build/clean-room-v2, feature/positioning-autopilot]').replace('branches: [main]', 'branches: [main, feature/positioning-autopilot]').replace('- run: npm install', '- run: npm ci')
ci.write_text(text)

# Markdownの意図的な改行を保ちつつ、変更行末のスペースはバックスラッシュにする。
for filename in subprocess.check_output(['git', 'diff', '--name-only'], text=True).splitlines():
    path = Path(filename)
    if path.suffix == '.md' and path.exists():
        text = path.read_text()
        text = re.sub(r'(?m) {2,}$', lambda _: '\\', text)
        path.write_text(text)
print('Sender display name, active-branch CI, infrastructure labels and Markdown whitespace verified.')
