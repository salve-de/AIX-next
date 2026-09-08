import type { BuyerPrompt, PublicProfileFact, ScanResult } from './types';
const generic = new Set(['おすすめ','会社','企業','業者','サービス','比較','選ぶ','選び','できる','したい','です','ます','対応','相談','日本','どこ','ください','教え','探し','探す','条件','候補','場合','依頼','紹介']);
export function consultationTerms(prompt: string) {
  return [...new Set([...new Intl.Segmenter('ja',{granularity:'word'}).segment(prompt)].filter(w=>w.isWordLike && w.segment.length>=2 && !generic.has(w.segment)).map(w=>w.segment.toLowerCase()))];
}
/** Lexical relevance selects source excerpts; it does not certify suitability or invent facts. */
export function matchingConsultations(fact: PublicProfileFact, prompts: BuyerPrompt[]) {
  const text = `${fact.label} ${fact.value}`.toLowerCase();
  return prompts.filter(p=>consultationTerms(p.text).some(term=>text.includes(term))).map(p=>p.id);
}
export function excludedConsultations(scan: ScanResult) {
  return (scan.prompts || []).filter(p=>scan.observations.some(o=>o.promptId===p.id && o.status==='success' && !o.ownRecommended));
}
