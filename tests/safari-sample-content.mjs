import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
const [session, output] = process.argv.slice(2);
if (!/^[A-F0-9-]+$/i.test(session || "") || !output?.startsWith("/private/tmp/rovan-sample-safari.")) throw new Error("Explicit local Safari session/output required");
const endpoint = `http://127.0.0.1:5551/session/${session}`;
async function command(path, method = "GET", body) {
  const response = await fetch(endpoint + path, { method, headers: { "Content-Type": "application/json" }, body: body === undefined ? undefined : JSON.stringify(body) });
  const payload = await response.json();
  if (!response.ok || payload.value?.error) throw new Error(`${path}: ${payload.value?.message || response.status}`);
  return payload.value;
}
const execute = script => command("/execute/sync", "POST", { script, args: [] });
const pages = [
  ["/result?sample=1", "月澄相続パートナーズ"],
  ["/watch?sample=1", "遠方の家族と、仕事帰りに相談できる条件をまとめる"],
  ["/ai-info?sample=1", "88,000"],
  ["/ai/company/aoba-souzoku?sample=1", "88,000"],
  ["/ai/company/aoba-cafe?sample=1", "24席"],
  ["/ai/company/yamada-bankin?sample=1", "1〜50個"],
  ["/ai/company/azumino-sunshine?sample=1", "2,800"],
  ["/ai/company/nexora-cloud?sample=1", "15,300"],
];
const results = [];
for (const width of [1440, 430]) {
  await command("/window/rect", "POST", { width, height: 1000 });
  for (const [path, expected] of pages) {
    await command("/url", "POST", { url: `http://127.0.0.1:3001${path}` });
    await new Promise(resolve => setTimeout(resolve, 750));
    let text = "";
    for (let attempt = 0; attempt < 100; attempt++) {
      await execute("document.querySelectorAll('details').forEach(el => { if (!el.closest('header') && !el.open) el.querySelector('summary')?.click(); }); return true");
      text = await execute("return document.body.innerText");
      if (text.includes(expected)) break;
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    assert.ok(text.includes(expected), `${path}: missing ${expected}`);
    assert.ok(!/サンプル候補[A-Z]|候補文字列/.test(text), `${path}: placeholder remains`);
    assert.match(text, /架空|見本/);
    const viewport = await execute("return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth}");
    assert.ok(viewport.scrollWidth <= viewport.width + 1, `${path}: horizontal overflow at ${width}`);
    await new Promise(resolve => setTimeout(resolve, 250));
    const name = `${width}-${path.split('?')[0].replaceAll('/', '-')}`;
    await writeFile(`${output}/${name}.png`, Buffer.from(await command("/screenshot"), "base64"));
    results.push({path, width, viewport, expected, passed:true});
    console.log(`PASS ${width} ${path}`);
  }
}
await writeFile(`${output}/results.json`, JSON.stringify(results, null, 2));
