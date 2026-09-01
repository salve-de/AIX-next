import assert from "node:assert/strict";
import test from "node:test";
import { calculateMetrics } from "../lib/metrics";
import type { BuyerPrompt, CompanyDiscovery, Observation } from "../lib/types";

const discovery: CompanyDiscovery = { legalName:"Acme株式会社", brandName:"Acme", domain:"acme.example", summary:"", market:"B2B SaaS", targetCustomers:[], useCases:[], aliases:["Acme"], competitors:[{name:"Beta",reason:"alternative",confidence:.9}], confidence:.9 };
const prompts: BuyerPrompt[] = [{ id:"p1", text:"おすすめは？", cluster:"category", importance:5, version:1 }];
function row(id:string,status:Observation["status"],ownRecommended:boolean,ownPosition:number|null,first="Beta"):Observation{return{id,promptId:"p1",prompt:"おすすめは？",provider:"openai",model:"test",repetition:Number(id.slice(-1))||1,status,rawText:"",rankedBrands:status==="success"?(ownRecommended?[first,"Acme"]:[first]):[],ownRecommended,ownPosition,citations:[],latencyMs:1,createdAt:new Date().toISOString()}}

test("failed and skipped observations do not become negative recommendations",()=>{
  const observations=[row("r1","success",true,2),row("r2","failed",false,null),row("r3","skipped",false,null)];
  const {metrics}=calculateMetrics({discovery,prompts,observations,repetitions:3});
  assert.equal(metrics.successfulObservations,1);
  assert.equal(metrics.shortlistCoverage,100);
  assert.equal(metrics.measurementCompleteness,33);
});

test("repeat stability uses the majority result signature",()=>{
  const observations=[row("r1","success",true,2),row("r2","success",true,2),row("r3","success",false,null)];
  const {metrics}=calculateMetrics({discovery,prompts,observations,repetitions:3});
  assert.equal(metrics.stability,67);
});

test("owned subdomains count as citation coverage",()=>{
  const observation=row("r1","success",true,1,"Acme");
  observation.citations=[{title:"Docs",url:"https://docs.acme.example/proof",domain:"docs.acme.example"}];
  const {metrics}=calculateMetrics({discovery,prompts,observations:[observation],repetitions:1});
  assert.equal(metrics.citationCoverage,100);
});
