# Latest clean-room CI failure

Failed command: `npm run lint`

```text
\n## npm run lint

> aix-next@0.1.0 lint
> eslint .


/home/runner/work/AIX-next/AIX-next/components/watch-client.tsx
  6:21  warning  'EvidenceIcon' is defined but never used  @typescript-eslint/no-unused-vars

/home/runner/work/AIX-next/AIX-next/eslint.config.js
  1:41  error  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  2:22  error  A `require()` style import is forbidden  @typescript-eslint/no-require-imports
  3:26  error  A `require()` style import is forbidden  @typescript-eslint/no-require-imports

/home/runner/work/AIX-next/AIX-next/lib/storage.ts
  4:43  warning  'ScanResult' is defined but never used  @typescript-eslint/no-unused-vars

✖ 5 problems (3 errors, 2 warnings)

```
