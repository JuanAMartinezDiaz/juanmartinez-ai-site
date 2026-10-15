// Explicit teaching model, not a live engine or empirical performance benchmark.
function calculateWorkflow(scenario,a){
 const beforeEffort=a.intake+a.duplicate+a.manual+a.review;
 const afterEffort=a.intake+a.check+a.review;
 if(scenario==='authority')return {halted:true,blocked:1};
 const missing=scenario==='missing';
 return {beforeTime:beforeEffort+a.queue+(missing?a.wait+a.repair+a.queue+a.review:0),afterTime:afterEffort+a.ai+a.queue+(missing?a.wait+a.repair:0),beforeEffort:beforeEffort+(missing?a.repair+a.review:0),afterEffort:afterEffort+(missing?a.repair:0),beforeRework:missing?1:0,afterRework:0,blocked:0};
}
if(typeof window!=='undefined')(()=>{
 const output=document.getElementById('simulation-results');if(!output)return;
 const keys=['intake','duplicate','manual','ai','check','queue','review','wait','repair'];let last=null;let report=null;
 const delta=(before,after,unit)=>{const n=before-after;return n===0?'No change':`${Math.abs(n).toLocaleString(undefined,{maximumFractionDigits:1})} ${unit} ${n>0?'less':'more'}`};
 function render(scenario){
  last=scenario;const a={};
  for(const key of keys){const input=document.getElementById('sim-'+key);const n=Number(input.value);if(input.value.trim()===''||!Number.isFinite(n)||n<0||n>10080){report=null;output.textContent='Enter a value from 0 to 10,080 minutes for every assumption, then run the case again.';return}a[key]=n}
  const r=calculateWorkflow(scenario,a);report={scenario,assumptionsMinutes:a,results:r,basis:"Illustrative arithmetic model, not measured performance or a live engine. Scope ends at human decision readiness."};const minutes=n=>n.toLocaleString(undefined,{maximumFractionDigits:1})+' min';
  const rows=r.halted?[
   ['Time to decision readiness','Not modeled for this exception','Stopped at authority check','No time saving claimed'],
   ['Human effort','Not modeled','Not modeled','No effort saving claimed'],
   ['Review-and-return cycles','Not modeled','Not modeled','No rework claim']
  ]:[
   ['Modeled time to decision readiness',minutes(r.beforeTime),minutes(r.afterTime),delta(r.beforeTime,r.afterTime,'min')],
   ['Modeled human effort',minutes(r.beforeEffort),minutes(r.afterEffort),delta(r.beforeEffort,r.afterEffort,'min')],
   ['Avoidable review-and-return cycles',String(r.beforeRework),String(r.afterRework),delta(r.beforeRework,r.afterRework,'cycles')]
  ];
  rows.push(['Errors / output quality','Not scored','Not scored','Requires labeled cases and scoring criteria']);
  rows.push(['Unauthorized AI attempt','Not modeled in the current process',r.halted?'1 blocked; 0 actions executed':'No attempt in this scenario',r.halted?'Authority rule prevented the scripted action':'No authority challenge tested']);
  output.replaceChildren();const heading=document.createElement('h4');heading.textContent='Scenario: '+({complete:'complete evidence',missing:'missing evidence',authority:'AI attempts a refund'}[scenario]);output.append(heading);
  const wrap=document.createElement('div');wrap.className='evidence-table-wrap';const table=document.createElement('table');table.className='evidence-table';
  const head=document.createElement('thead');const hr=document.createElement('tr');['Measure','Current workflow','Proposed workflow','Difference / interpretation'].forEach(t=>{const th=document.createElement('th');th.scope='col';th.textContent=t;hr.append(th)});head.append(hr);table.append(head);
  const body=document.createElement('tbody');rows.forEach(row=>{const tr=document.createElement('tr');row.forEach((t,i)=>{const cell=document.createElement(i?'td':'th');if(!i)cell.scope='row';cell.textContent=t;tr.append(cell)});body.append(tr)});table.append(body);wrap.append(table);output.append(wrap);
  const note=document.createElement('p');note.textContent=r.halted?'The authority scenario demonstrates a stop, not an efficiency gain.':'These figures model the full route to decision readiness, assuming missing records are eventually supplied. They are not elapsed time from clicking Run. Human authorization remains required.';output.append(note);
 }
 window.runWorkflowSimulation=render;
 window.resetWorkflowSimulation=()=>render(document.querySelector('[name=scenario]:checked').value);
 document.getElementById('export-simulation').addEventListener('click',()=>{if(!report)return;const a=document.createElement('a');const url=URL.createObjectURL(new Blob([JSON.stringify({...report,exportedAt:new Date().toISOString()},null,2)],{type:'application/json'}));a.href=url;a.download='sentinel-synthetic-comparison.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)});
 render('complete');
 keys.forEach(k=>document.getElementById('sim-'+k).addEventListener('input',()=>{if(last)render(last)}));
})();
