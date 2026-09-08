import assert from 'node:assert/strict';
import test from 'node:test';
import { buildValueProof, proofCsv, evidenceUrl } from '../lib/value-proof';
import { sampleWatch } from '../lib/sample-data';
import { parseOpenAiWebSearchResponse, parsePerplexitySonarResponse } from '../lib/providers/parsers';
import { buildAutomatedFacts } from '../lib/profile-automation';
import { buildPublicProfileDraft } from '../lib/public-profile';
import type { PublicProfileRecord } from '../lib/types';

test('a repeated baseline is never a before/after success; strict conditions protect comparisons',()=>{
 const w=sampleWatch(); const p=buildValueProof(w); assert.ok(p.rows.some(r=>r.comparable));
 w.latest=w.baseline;assert.ok(buildValueProof(w).rows.every(r=>r.state==='baseline'));
 const c=sampleWatch();c.latest=structuredClone(c.latest);Object.assign(c.latest.panel,{country:'US'});assert.ok(buildValueProof(c).rows.every(r=>!r.comparable));
 const m=sampleWatch();m.latest=structuredClone(m.latest);m.latest.observations[0].model='changed';assert.equal(buildValueProof(m).rows[0].comparable,false);
});
test('failed or missing repetitions never become a loss and exports neutralize spreadsheet formulae',()=>{
 const w=structuredClone(sampleWatch());w.latest.observations[0].status='failed'; const p=buildValueProof(w);assert.equal(p.rows[0].after,null);assert.equal(p.rows[0].state,'unavailable');
 p.company='=HYPERLINK("evil")';const csv=proofCsv(p);assert.ok(csv.includes("'=HYPERLINK"));assert.ok(!csv.includes('watchToken'));assert.equal(evidenceUrl('javascript:alert(1)'),null);
});
test('retrieval is not citation and cannot overwrite an actual answer annotation',()=>{
 const result=parseOpenAiWebSearchResponse({output:[{type:'message',content:[{text:'answer',annotations:[{url:'https://a.example/',title:'answer'}]}]},{type:'web_search_call',action:{sources:[{url:'https://a.example/'},{url:'https://b.example/'}]}}]});
 assert.equal(result.citations.find(c=>c.domain==='a.example')?.kind,'answer');assert.equal(result.citations.find(c=>c.domain==='b.example')?.kind,'search');
 const sonar=parsePerplexitySonarResponse({search_results:[{url:'https://b.example'}],citations:['https://a.example']});assert.equal(sonar.citations.find(c=>c.domain==='a.example')?.kind,'answer');
});
test('post-publication comparisons wait and require persisted baseline; private accounting never included',()=>{
 const w=sampleWatch(); const p=w.latest.prompts![0];w.autoActions=[{id:'a',triggerEventIds:[],actionType:'profile_fact_updated',factLabel:'test',factValue:'test',sourceUrl:w.latest.targetUrl,affectedPromptIds:[p.id],summary:'updated',status:'applied',executedAt:'2099-01-01T00:00:00Z',beforeScanId:w.baseline.scanId}];
 const proof=buildValueProof(w);assert.equal(proof.changes[0].stage,'waiting');assert.equal(proof.changes[0].comparisons.length,0);
 w.autoActions[0].executedAt=w.baseline.measuredAt;assert.equal(buildValueProof(w).changes[0].stage,'measured');
 const json=JSON.stringify(proof);for(const key of ['stripeCustomerId','totalCostUsd','email','watchToken'])assert.ok(!json.includes('"'+key+'"'));
});
test('automation prioritizes source facts related to excluded consultations, preserving source text',()=>{
 const scan=structuredClone(sampleWatch().latest); scan.prompts=[{...scan.prompts![0],id:'special',text:'相続登記の専門家を探しています'}];scan.observations=[{...scan.observations[0],promptId:'special',prompt:scan.prompts[0].text,ownRecommended:false,status:'success'}];
 const record={...buildPublicProfileDraft(scan),id:'p',slug:'p',token:'t',sourceScanId:'s',status:'published',createdAt:scan.measuredAt,updatedAt:scan.measuredAt,expiresAt:'2099-01-01',facts:[]} as PublicProfileRecord;
 const page={url:scan.targetUrl,title:'test',description:'',headings:[],text:'営業時間は午前九時から午後五時です。相続登記を専門に対応しています。'};
 const facts=buildAutomatedFacts(record,[page],scan)!;assert.equal(facts[0].value,'相続登記を専門に対応しています。');assert.ok(facts.every(f=>page.text.includes(f.value)));
});

test('public citation requires the configured origin and excludes sample or token queries',async()=>{
 const {isPublishedCitation}=await import('../lib/value-proof'); const c={kind:'answer' as const,url:'https://rovan.example/ai/company/one',domain:'rovan.example',title:'p'};
 assert.equal(isPublishedCitation(c,c.url),true);assert.equal(isPublishedCitation({...c,url:c.url+'?sample=1'},c.url),false);assert.equal(isPublishedCitation({...c,url:c.url.replace('rovan.example','other.example')},c.url),false);assert.equal(isPublishedCitation({...c,kind:'search'},c.url),false);assert.equal(isPublishedCitation({...c,url:c.url+'/json'},c.url),true);
});
test('standalone report escapes source text, contains all rows, and has no scripts',async()=>{
 const {valueReport}=await import('../lib/value-report');const p=buildValueProof(sampleWatch());p.company='<script>alert(1)</script>';const html=valueReport(p,true);assert.ok(!html.includes('<script>'));assert.ok(html.includes('&lt;script&gt;'));assert.ok(html.includes('見本'));assert.equal((html.match(/<tr>/gu)||[]).length,p.rows.length+1);
});

test('the explicit demo shows a complete update journey without changing shared fixtures',async()=>{
 const {sampleValueProof}=await import('../lib/sample-value-proof');const p=sampleValueProof();assert.equal(p.changes.length,1);assert.equal(p.changes[0].stage,'measured');assert.ok(p.profilePath?.includes('sample=1'));assert.equal(sampleWatch().autoActions,undefined);assert.ok(p.opportunities.some(o=>o.facts.length));
});
