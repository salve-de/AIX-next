import { buildValueProof } from './value-proof';
import { sampleWatch } from './sample-data';
import { getSampleProfile } from './sample-profiles';
import { matchingConsultations } from './prompt-evidence';
import type { PublicProfileRecord } from './types';
/** Explicit UI fixture only. Never persisted, mixed into real Watch data, or sent to a provider. */
export function sampleValueWatch() {
  const watch=structuredClone(sampleWatch());
  const profile=getSampleProfile('aoba-souzoku')!;
  const facts=profile.facts.map(f=>({...f,provenance:'source_excerpt' as const}));
  const added=facts.find(f=>f.label==='対応地域')!;
  watch.autoActions=[{id:'sample-publication',triggerEventIds:[],actionType:'profile_fact_updated',factLabel:added.label,factValue:added.value,sourceUrl:added.sourceUrl,
    affectedPromptIds:matchingConsultations(added,watch.baseline.prompts||[]),beforeScanId:watch.baseline.scanId,
    summary:'遠方の相続人がオンライン同席できる条件を公開情報へ追加（実行履歴の見本）',status:'applied',executedAt:'2026-09-02T09:00:00.000Z',addedFacts:[added],removedFacts:[]}];
  watch.paid=true; watch.status="active";
  return watch;
}
export function sampleValueProof() {
  const watch=sampleValueWatch();
  const profile=getSampleProfile("aoba-souzoku")!;
  const facts=profile.facts.map(f=>({...f,provenance:"source_excerpt" as const}));
  const record:PublicProfileRecord={...profile,facts,expiresAt:'2099-09-01T09:00:00.000Z',token:'sample-only',sourceScanId:watch.baseline.scanId,
    automation:{enabled:true,watchId:watch.id,grantedAt:'2026-09-02T09:00:00.000Z'}};
  const proof=buildValueProof(watch,record);
  proof.profilePath='/ai/company/aoba-souzoku?sample=1';
  return proof;
}
