# Latest clean-room CI failure

Failed command: `npm test`

```text
\n## npm run lint

> aix-next@0.1.0 lint
> eslint .


/home/runner/work/AIX-next/AIX-next/components/watch-client.tsx
  6:21  warning  'EvidenceIcon' is defined but never used  @typescript-eslint/no-unused-vars

/home/runner/work/AIX-next/AIX-next/lib/storage.ts
  4:43  warning  'ScanResult' is defined but never used  @typescript-eslint/no-unused-vars

✖ 2 problems (0 errors, 2 warnings)

\n## npm test

> aix-next@0.1.0 test
> tsx --test tests/**/*.test.ts

TAP version 13
# Subtest: failed and skipped observations are excluded from recommendation denominator
ok 1 - failed and skipped observations are excluded from recommendation denominator
  ---
  duration_ms: 1.499516
  type: 'test'
  ...
# Subtest: citation coverage includes owned subdomains
ok 2 - citation coverage includes owned subdomains
  ---
  duration_ms: 0.371021
  type: 'test'
  ...
# Subtest: repeat agreement uses the modal outcome signature
ok 3 - repeat agreement uses the modal outcome signature
  ---
  duration_ms: 0.31694
  type: 'test'
  ...
# Subtest: specific AIX group overrides wildcard group
ok 4 - specific AIX group overrides wildcard group
  ---
  duration_ms: 1.477525
  type: 'test'
  ...
# Subtest: longest matching allow rule wins
ok 5 - longest matching allow rule wins
  ---
  duration_ms: 0.209801
  type: 'test'
  ...
# Subtest: wildcard group applies to other agents
ok 6 - wildcard group applies to other agents
  ---
  duration_ms: 0.365011
  type: 'test'
  ...
# node:internal/modules/cjs/loader:1430
#   const err = new Error(message);
#               ^
# Error: Cannot find module 'server-only'
# Require stack:
# - /home/runner/work/AIX-next/AIX-next/lib/url-security.ts
# - /home/runner/work/AIX-next/AIX-next/tests/url-security.test.ts
#     at node:internal/modules/cjs/loader:1430:15
#     at nextResolveSimple (/home/runner/work/AIX-next/AIX-next/node_modules/tsx/dist/register-OY9cqBEN.cjs:10:1006)
#     at /home/runner/work/AIX-next/AIX-next/node_modules/tsx/dist/register-OY9cqBEN.cjs:9:4959
#     at /home/runner/work/AIX-next/AIX-next/node_modules/tsx/dist/register-OY9cqBEN.cjs:9:4261
#     at resolveTsPaths (/home/runner/work/AIX-next/AIX-next/node_modules/tsx/dist/register-OY9cqBEN.cjs:10:759)
#     at /home/runner/work/AIX-next/AIX-next/node_modules/tsx/dist/register-OY9cqBEN.cjs:10:1199
#     at j._resolveFilename (file:///home/runner/work/AIX-next/AIX-next/node_modules/tsx/dist/register-SoqaU4rg.mjs:2:17957)
#     at defaultResolveImpl (node:internal/modules/cjs/loader:1040:19)
#     at defaultResolve (node:internal/modules/cjs/loader:1075:31)
#     at nextStep (node:internal/modules/customization_hooks:189:26) {
#   code: 'MODULE_NOT_FOUND',
#   requireStack: [
#     '/home/runner/work/AIX-next/AIX-next/lib/url-security.ts',
#     '/home/runner/work/AIX-next/AIX-next/tests/url-security.test.ts'
#   ]
# }
# Node.js v22.23.2
# Subtest: tests/url-security.test.ts
not ok 3 - tests/url-security.test.ts
  ---
  duration_ms: 199.10361
  type: 'test'
  location: '/home/runner/work/AIX-next/AIX-next/tests/url-security.test.ts:1:1'
  failureType: 'testCodeFailure'
  exitCode: 1
  signal: ~
  error: 'test failed'
  code: 'ERR_TEST_FAILURE'
  ...
1..7
# tests 7
# suites 0
# pass 6
# fail 1
# cancelled 0
# skipped 0
# todo 0
# duration_ms 744.849776
```
