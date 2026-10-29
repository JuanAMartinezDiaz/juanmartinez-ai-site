const vm = require('node:vm'); const fs = require('node:fs'); const assert = require('node:assert/strict');
const code = fs.readFileSync('public/site-measurement.js','utf8');
function run({stored=null,signal=false,standalone=true,existing=false}={}) {
 const elements = new Map(), children=[], clicks={}; let saved=stored, reloads=0;
 function element(tag) { const e={tag,hidden:false,disabled:false,dataset:{},append(...x){children.push(...x);for(const y of x)if(y?.id)elements.set(y.id,y)},focus(){},querySelector(s){if(!elements.has(s))elements.set(s,element(s));return elements.get(s)}}; return e; }
 const document={currentScript:{dataset:{vercel:String(standalone)}},referrer:'https://www.linkedin.com/feed?private=secret',cookie:'_ga=abc; _ga_BBSDXENED8=xyz',head:element('head'),body:element('body'),getElementById(id){return elements.get(id)},querySelector(){return existing?{}:null},createElement:element,addEventListener(n,fn){clicks[n]=fn}};
 const location={hostname:'www.juanmartinez.ai',origin:'https://www.juanmartinez.ai',pathname:'/bai/',search:'?utm_source=linkedin&utm_medium=paid_social&utm_campaign=launch&email=secret@example.com',reload(){reloads++}};
 const window={}; const context={window,document,location,navigator:{globalPrivacyControl:signal},localStorage:{getItem(){return saved},setItem(k,v){saved=v}},Date,URL,URLSearchParams};vm.runInNewContext(code,context);
 return {window,elements,children,document,clicks,location,reloads:()=>reloads,again:()=>vm.runInNewContext(code,context)};
}
const first=run();assert(!first.elements.has('bai-google-tag'));assert.equal(first.children.filter(x=>x.src?.includes('insights')).length,1);
first.elements.get('[data-choice="yes"]').onclick();assert(first.elements.has('bai-google-tag'));
const entries=first.window.dataLayer.map(x=>Array.from(x));assert.equal(entries.filter(x=>x[0]==='event'&&x[1]==='page_view').length,1);
const page=entries.find(x=>x[1]==='page_view')[2];assert(!page.page_location.includes('email'));assert(page.page_location.includes('utm_campaign=launch'));assert.equal(page.page_referrer,'https://www.linkedin.com');
first.again();assert.equal(first.window.dataLayer.filter(x=>x[1]==='page_view').length,1);
first.elements.get('[data-choice="no"]').onclick();assert.equal(first.window['ga-disable-G-BBSDXENED8'],true);assert.equal(first.reloads(),1);
const rejected=run({stored:JSON.stringify({accepted:false,expires:Date.now()+100000})});assert(!rejected.elements.has('bai-google-tag'));
const accepted=run({stored:JSON.stringify({accepted:true,expires:Date.now()+100000})});assert(accepted.elements.has('bai-google-tag'));
const expired=run({stored:JSON.stringify({accepted:true,expires:1})});assert(!expired.elements.has('bai-google-tag'));
const gpc=run({stored:JSON.stringify({accepted:true,expires:Date.now()+100000}),signal:true});assert(!gpc.elements.has('bai-google-tag'));assert(gpc.elements.get('[data-choice="yes"]').disabled);
const react=run({standalone:false});assert.equal(react.children.filter(x=>x.src?.includes('insights')).length,0);
const direct=run({existing:true});assert.equal(direct.children.filter(x=>x.src?.includes('insights')).length,0);
console.log('PASS: consent default/reject/accept/expiry/withdrawal, GPC, URL minimization, one Google pageview, and no duplicate Vercel injection');
