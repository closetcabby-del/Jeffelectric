import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import test from 'node:test';
import vm from 'node:vm';
const root=new URL('../',import.meta.url);
const read=file=>readFileSync(new URL(file,root),'utf8');
const urls=[...read('sitemap.xml').matchAll(/<loc>(.*?)<\/loc>/g)].map(x=>new URL(x[1]));
test('every sitemap page has one canonical, parseable linked schema, one H1 and working local links',()=>{
 for(const url of urls){
  const file=url.pathname==='/'?'index.html':url.pathname.slice(1), html=read(file);
  assert.equal((html.match(/rel="canonical"/g)||[]).length,1,file);
  assert.ok(html.includes(`rel="canonical" href="${url.href}"`),file);
  assert.equal((html.match(/<h1[ >]/g)||[]).length,1,file);
  const schema=JSON.parse(html.match(/<script type="application\/ld\+json">(.*?)<\/script>/s)[1]);
  const graph=schema['@graph']||[schema];
  for(const entity of graph){
   for(const key of ['provider','about']) if(entity[key]?.['@id']) assert.ok(graph.some(x=>x['@id']===entity[key]['@id']),file);
   assert.equal(entity.address,undefined,'No invented public address');
  }
  for(const [,href] of html.matchAll(/href="([^"]+)"/g)){
   if(/^(https?:|tel:|mailto:)/.test(href)) continue;
   const target=new URL(href,url);
   const path=target.pathname==='/'?'index.html':target.pathname.slice(1);
   assert.ok(existsSync(new URL(path,root)),`${file}: ${href}`);
  }
 }
});
const code=read('lead-tracking.js');
function run({stored='{}',search='',storageBlocked=false,analyticsThrows=false}={}){
 const events=[],inputs=[];let click,saved;
 const context={window:{gtag(...args){if(analyticsThrows)throw Error('blocked');events.push(args)}},location:{pathname:'/ev-charger-installation.html',search},URLSearchParams,
 sessionStorage:{getItem(){if(storageBlocked)throw Error('blocked');return stored},setItem(k,v){saved=v}},
 document:{addEventListener(type,cb){click=cb},querySelector(){return{append(input){inputs.push(input)}}},createElement(){return{}}}};
 vm.runInNewContext(code,context);return {context,events,inputs,get saved(){return saved},click};
}
test('tracking distinguishes clicks from leads, excludes form data and tolerates blocked analytics',()=>{
 const result=run();result.click({target:{closest:()=>({})}});result.context.window.jeffTrackLead();
 assert.deepEqual(result.events.map(x=>x[1]),['phone_click','generate_lead']);
 assert.equal(JSON.stringify(result.events).includes('email'),false);
 assert.doesNotThrow(()=>run({analyticsThrows:true}).context.window.jeffTrackLead());
});
test('campaign fields survive a page transition without copying unrelated URL data',()=>{
 const first=run({search:'?utm_source=google&utm_campaign=panels&email=private@example.com'});
 const next=run({stored:first.saved});
 assert.ok(next.inputs.some(x=>x.name==='fi-text-utm_campaign'&&x.value==='panels'));
 assert.ok(!JSON.stringify(next.inputs).includes('private@example.com'));
 assert.doesNotThrow(()=>run({storageBlocked:true}));
 assert.doesNotThrow(()=>run({stored:'invalid JSON'}));
});
