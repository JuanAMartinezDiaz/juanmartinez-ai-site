// Read-only, fictional product walkthrough. No data leaves this page.
(() => {
  const motionButton = document.getElementById('core-motion');
  const motionHero = document.querySelector('.sentinel-art-hero');
  if (motionButton && motionHero) {
    const setPaused = (paused) => {
      motionHero.classList.toggle('motion-paused', paused);
      motionButton.setAttribute('aria-pressed', String(paused));
      motionButton.setAttribute('aria-label', paused ? 'Play workflow light animation' : 'Pause workflow light animation');
      motionButton.querySelector('.motion-symbol').textContent = paused ? '▶' : 'Ⅱ';
      motionButton.querySelector('.motion-label').textContent = paused ? 'Play motion' : 'Pause motion';
    };
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPaused(reducedMotion.matches);
    motionButton.addEventListener('click', () => setPaused(!motionHero.classList.contains('motion-paused')));
  }
})();
(() => {
  if (!document.getElementById('run-case')) return;
  const findings={
    duplicate:['Repeated entry adds work without adding evidence.','The fictional map shows the same customer, transaction, and dispute reason copied between intake and the case file. Sentinel’s proposed change is to reuse that record when AI prepares a source-linked summary. A person still checks the summary.','Compare transcription errors and preparation time; reject the proposal if accuracy deteriorates.'],
    evidence:['An early evidence check makes missing inputs visible.','In the existing example, an investigator discovers missing records after work has already reached the review queue. The proposal checks required inputs first and pauses incomplete cases for the coordinator. Presence alone does not prove that evidence is accurate.','Use incomplete and contradictory cases; measure missed gaps, false alarms, and rework.'],
    authority:['An approval needs a named owner and an enforced boundary.','The supplied example map leaves the approver unspecified. The proposal assigns the dispute manager and gives AI permission only to prepare material. A request by AI to approve a refund is blocked and escalated.','Attempt unauthorized actions and missing-approval paths; verify that nothing consequential proceeds.']
  };
  document.querySelectorAll('.finding').forEach(button=>button.addEventListener('click',()=>{
    document.querySelector('.finding-detail').hidden=false;
    const key=button.dataset.finding;const [title,body,proof]=findings[key];
    document.getElementById('finding-title').textContent=title;document.getElementById('finding-body').textContent=body;document.getElementById('finding-proof').textContent='Test before adoption: '+proof;
    document.querySelectorAll('.finding').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.finding===key)));
    document.querySelector('.finding-detail').scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'nearest'});
  }));
  let state='ready';const result=document.getElementById('case-result');const controls=document.getElementById('human-controls');
  function show(title,body,events=[],blocked=false){result.dataset.state=blocked?'blocked':'normal';result.replaceChildren();const h=document.createElement('h4');h.textContent=title;const p=document.createElement('p');p.textContent=body;result.append(h,p);if(events.length){const list=document.createElement('ol');events.forEach(e=>{const li=document.createElement('li');li.textContent=e;list.append(li)});result.append(list)}}
  function reset(){window.resetWorkflowSimulation?.();state='ready';controls.hidden=true;show('Ready to test','AI may prepare evidence. Only the dispute manager may authorize the outcome.')}
  document.querySelectorAll('[name=scenario]').forEach(r=>r.addEventListener('change',reset));document.getElementById('reset-case').addEventListener('click',reset);
  document.getElementById('run-case').addEventListener('click',()=>{
    controls.hidden=true;const scenario=document.querySelector('[name=scenario]:checked').value;
    window.runWorkflowSimulation?.(scenario);
    if(scenario==='missing'){state='blocked';show('PAUSED · Required evidence is missing','Benefit: avoid an unnecessary review-and-return cycle. The proposed workflow catches the missing record before manager review. Neither path can complete until the evidence arrives.',['BEFORE: Intake → manual preparation → review queue → reviewer discovers the missing transaction record → return to coordinator.','PROPOSED: Intake → evidence completeness check → pause immediately → coordinator supplies the record before manager review.','WHAT CHANGES: The missing-evidence case avoids entering the manager review queue prematurely.','WHAT STILL NEEDS PROOF: Measure total waiting time and rework; early detection does not guarantee faster resolution.','AUTHORITY RULE: No refund is authorized while required evidence is missing.'],true)}
    else if(scenario==='authority'){state='blocked';show('BLOCKED · AI attempted an unauthorized decision','Preparing a summary is permitted. Approving a refund is not. The attempt is recorded and escalated to the dispute manager.',['Evidence packet assembled.','AI attempts to approve a $240 refund.','Authority check denies the action; no refund occurs.','Dispute manager receives the exception for review.'],true)}
    else{state='awaiting';controls.hidden=false;show('WAITING · Human authorization required','Evidence is present and the AI-prepared summary is ready. Nothing proceeds until the dispute manager reviews and authorizes it.',['Original case details reused.','Required evidence present in the synthetic case.','AI prepares a summary; it makes no final decision.','Authority gate waits for a person.'])}
  });
  document.getElementById('approve-case').addEventListener('click',()=>{if(state!=='awaiting')return;state='approved';controls.hidden=true;show('AUTHORIZED · Simulated next step released','Your human decision releases the simulated case to operations. No real payment or customer message is sent.',['Dispute manager authorization recorded.','Decision and supporting evidence retained with D-104.','Operations may record the outcome and notify the customer.'])});
  document.getElementById('return-case').addEventListener('click',()=>{if(state!=='awaiting')return;state='returned';controls.hidden=true;show('RETURNED · More investigation required','The manager has withheld authorization. The case returns to investigation; no refund or notification proceeds.',['Human decision: return for investigation.','Investigator owns the next action.','Approval must be obtained after the case is reviewed again.'],true)});
})();
(() => {
  const next=document.getElementById('next-demo-stage');if(!next)return;
  const stages=['current','proposal','test'];let current=0;
  const compare=document.getElementById('compare-toggle');
  const buttons=[...document.querySelectorAll('[data-stage]')];
  function render(){
    const both=compare.checked;
    document.querySelector('.before').hidden=!both&&current!==0;
    document.querySelector('.after').hidden=!both&&current!==1;
    document.querySelector('.compare-grid').hidden=!both&&current===2;
    document.querySelector('.compare-grid').classList.toggle('single-workflow',!both);
    document.querySelector('.case-simulator').hidden=current!==2;
    document.querySelector('.demo-evidence').hidden=current!==2;
    document.querySelector('.finding-detail').hidden=true;
    buttons.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===current)));
    document.getElementById('stage-description').textContent=['Step 1 of 3 · Select a highlighted step to inspect the finding.','Step 2 of 3 · See what changes and where authority stays with a person.','Step 3 of 3 · Run a synthetic case and test the boundaries.'][current];
    next.textContent=['See Sentinel’s proposal →','Test the boundaries →','Back to current workflow ↺'][current];
  }
  buttons.forEach(b=>b.addEventListener('click',()=>{current=stages.indexOf(b.dataset.stage);compare.checked=false;render()}));
  next.addEventListener('click',()=>{current=(current+1)%3;compare.checked=false;render();document.querySelector('.demo-navigation').scrollIntoView({block:'start',behavior:'instant'})});
  compare.addEventListener('change',render);render();
})();
