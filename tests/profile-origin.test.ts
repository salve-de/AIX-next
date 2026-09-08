import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

function isolated(code: string, mode: "development" | "production" | "test" = "development", configuredOrigin = "") {
  const child = spawnSync(process.execPath, ["--conditions=react-server", "--import", "tsx", "--input-type=module", "-e", `
    import assert from 'node:assert/strict';
    const load = async path => { const m = await import(path); return m.default || m; };
    globalThis.fetch = async () => { throw new Error('Unexpected network'); };
    ${code}
  `], { encoding: "utf8", timeout: 20_000, env: { ...process.env, NODE_ENV: mode, NEXT_PUBLIC_SITE_URL: configuredOrigin, SUPABASE_URL: "", SUPABASE_SERVICE_ROLE_KEY: "" } });
  assert.equal(child.status, 0, child.stderr || child.stdout || String(child.error));
}

test("unconfigured development direct profile and subsequent diagnostic target use the actual local origin", () => isolated(`
  const api = await load('./app/api/ai-profile/route.ts');
  const request = new Request('http://localhost:3001/api/ai-profile', {
    method:'POST', headers:{'content-type':'application/json','origin':'http://127.0.0.1:3001','x-forwarded-host':'localhost:3000'},
    body:JSON.stringify({action:'create_direct',brandName:'開発環境の直接登録',requestUrl:'http://localhost:3000/api/ai-profile'})
  });
  const response = await api.POST(request);
  assert.equal(response.status,201);
  const created = await response.json();
  const target = 'http://127.0.0.1:3001/ai/company/'+encodeURIComponent(created.profile.slug);
  assert.equal(created.profile.targetUrl,target);
  assert.ok(created.profile.facts.every(f => f.sourceUrl===target));
  assert.doesNotMatch(JSON.stringify(created.profile),/localhost:3000/);
  const query = Object.fromEntries(new URL(created.managementUrl,'http://127.0.0.1:3001').searchParams);
  const recovered = await api.POST(new Request('http://127.0.0.1:3001/api/ai-profile',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({action:'manage',...query})}));
  assert.equal(recovered.status,200);
  const managed = (await recovered.json()).profiles[0].profile;
  const diagnostic = new URL('/scan?url='+encodeURIComponent(managed.targetUrl),'http://127.0.0.1:3001');
  assert.equal(diagnostic.searchParams.get('url'),target);
`));

test("development origin validation rejects remote hosts, credentials and unsupported schemes", () => isolated(`
  const { directProfileOrigin } = await load('./lib/profile-origin.ts');
  assert.equal(directProfileOrigin('http://localhost:3001/api/ai-profile'),'http://localhost:3001');
  assert.equal(directProfileOrigin('http://[::1]:3001/api/ai-profile'),'http://[::1]:3001');
  assert.equal(directProfileOrigin('http://localhost:3001/api/ai-profile','http://127.0.0.1:3001'),'http://127.0.0.1:3001');
  for (const origin of ['https://attacker.example','http://127.0.0.1:3000','http://user:secret@127.0.0.1:3001','http://127.0.0.1:3001/path','null']) assert.throws(()=>directProfileOrigin('http://localhost:3001/api/ai-profile',origin));
  for (const input of ['https://attacker.example/api/ai-profile','http://user:secret@localhost:3001/api/ai-profile','file:///api/ai-profile','http://localhost.attacker.example:3001/']) assert.throws(()=>directProfileOrigin(input));
`));

for (const mode of ["development", "production"] as const) {
  test(`${mode} preserves the configured canonical origin over the local request origin`, () => isolated(`
    const { directProfileOrigin } = await load('./lib/profile-origin.ts');
    assert.equal(directProfileOrigin('http://127.0.0.1:3001/api/ai-profile'),'https://canonical.example');
    assert.equal(directProfileOrigin('https://attacker.example/api/ai-profile'),'https://canonical.example');
    assert.equal(directProfileOrigin('http://localhost:3001/api/ai-profile','https://attacker.example'),'https://canonical.example');
  `, mode, "https://canonical.example"));
}
