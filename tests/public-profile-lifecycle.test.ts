import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import test from "node:test";

test("independent profile drafts keep unique URLs and require the matching token throughout publication", () => {
  const child = spawnSync(process.execPath, ["--conditions=react-server", "--import", "tsx", "--input-type=module", "-e", `
    import assert from 'node:assert/strict';
    const load = async path => { const m = await import(path); return m.default || m; };
    globalThis.fetch = async () => { throw new Error('Unexpected network'); };
    const store = await load('./lib/storage.ts');
    const { buildDirectPublicProfileDraft } = await load('./lib/public-profile.ts');
    const draft = buildDirectPublicProfileDraft({brandName:'Lifecycle test'});
    const first = await store.createPublicProfilePreview(draft, {sourceScanId:'test-scan'});
    const second = await store.createPublicProfilePreview(draft, {sourceScanId:'test-scan'});
    assert.notEqual(first.slug, second.slug);
    assert.equal(await store.getActivePublicProfileBySlug(first.slug), null);
    assert.equal(await store.publishPublicProfile(first.id, second.token), null);
    assert.equal((await store.publishPublicProfile(first.id, first.token)).status, 'published');
    assert.equal((await store.getPublishedProfileForScan('test-scan')).slug, first.slug);
    assert.equal((await store.getPublicProfile(first.id)).token, first.token);
    assert.equal(await store.revokePublicProfile(first.id, second.token), null);
    await store.revokePublicProfile(first.id, first.token);
    assert.equal(await store.getActivePublicProfileBySlug(first.slug), null);
    assert.equal(await store.getPublishedProfileForScan('test-scan'), null);
    assert.equal((await store.getPublicProfile(second.id)).status, 'draft');
  `], { encoding: "utf8", timeout: 20000, env: { ...process.env, NODE_ENV: "test", SUPABASE_URL: "", SUPABASE_SERVICE_ROLE_KEY: "" } });
  assert.equal(child.status, 0, child.stderr || String(child.error));
});
