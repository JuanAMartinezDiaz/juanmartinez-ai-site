import { useEffect, useRef, useState } from 'react';
import './DecisionXRay2.css';

const descriptions={
  scan:{title:'Look inside the decision.',text:'The cutaway exposes the evidence carrier, control assembly and amber D07 authority core. The moving cyan section scans the physical shell; it does not authorize an action.'},
  explode:{title:'See how the parts connect.',text:'The shell panels separate and the nested assemblies move forward. Evidence supports the decision; controls constrain the route; consequential authority remains with a person.'},
  sentinel:{title:'Make the boundary explicit.',text:'In this illustrative redesign, the redundant route disappears and the evidence path becomes continuous. The amber action stops at the authority gate until you simulate approval.'}
};
export default function DecisionXRay2(){
  const mount=useRef(null),api=useRef(null);
  const [mode,setMode]=useState('scan'),[status,setStatus]=useState('loading'),[approved,setApproved]=useState(false);
  const [paused,setPaused]=useState(()=>typeof window!=='undefined'&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  useEffect(()=>{
    let cancelled=false,instance;
    import('./decisionInstrument.js').then(({createDecisionInstrument})=>{
      if(cancelled||!mount.current)return;
      instance=createDecisionInstrument(mount.current,s=>{if(!cancelled)setStatus(s);});api.current=instance;
    }).catch(error=>{console.error('Decision X-Ray could not start:',error);if(!cancelled)setStatus('error');});
    return()=>{cancelled=true;instance?.dispose();api.current=null;};
  },[]);
  useEffect(()=>{api.current?.setPaused(paused);},[paused,status]);
  const changeMode=value=>{setMode(value);setApproved(false);api.current?.setMode(value);};
  const rescan=()=>{changeMode('scan');setPaused(false);api.current?.rescan();};
  const approve=()=>{if(mode!=='sentinel')return;api.current?.approve();setApproved(true);};
  return <section className="dx-shell" aria-label="Decision X-Ray interactive study">
    <header className="dx-brand"><a href="/">JUAN MARTINEZ<span>DECISION X-RAY</span></a><span className="dx-edition">INTERACTIVE STUDY / 01</span></header>
    <div className="dx-heading"><div><p className="dx-eyebrow">DECISION TOMOGRAPHY</p><h2>The decision, revealed.</h2></div><p>A precision cutaway of the evidence, controls<br className="dx-desktop"/> and human authority inside one decision.</p></div>
    <div className="dx-stage-wrap">
      <div className="dx-stage" ref={mount} role="img" aria-label="Moving three-dimensional mechanical cutaway with a visible amber D07 authority core" tabIndex="0" onKeyDown={e=>{if(e.key==='ArrowLeft'||e.key==='ArrowRight'){e.preventDefault();api.current?.inspect(e.key==='ArrowLeft'?-1:1);}}}/>
      {status!=='ready'&&<div className="dx-fallback" role="status">{status==='loading'?'Preparing the 3D instrument…':'The 3D renderer is unavailable in this browser. Please reload with hardware acceleration enabled.'}</div>}
      <div className="dx-stage-caption"><span className="dx-dot"/> {mode==='scan'?'SECTION SCAN':mode==='explode'?'ASSEMBLY INSPECTION':'GOVERNED REDESIGN'}<span className="dx-material">GRAPHITE / CYAN / AMBER</span></div>
      <div className="dx-annotations" aria-hidden="true"><div><i/>01 <strong>Evidence carrier</strong><small>What supports the decision</small></div><div><i/>02 <strong>Control assembly</strong><small>What constrains the action</small></div><div className="dx-gold"><i/>03 <strong>D07 · Human authority</strong><small>{approved?'Approval simulated':'Reserved for a person'}</small></div></div>
      <div className="dx-viewhint">Drag to inspect · Arrow keys also work</div>
      <div className="dx-state"><span className="dx-dot dx-amber"/>{approved?'Authorization simulated':'D07 · Human approval required'}</div>
    </div>
    <div className="dx-controls"><div className="dx-modes" role="group" aria-label="Inspection mode">
      <button aria-pressed={mode==='scan'} onClick={()=>changeMode('scan')}>01 <span>Cutaway scan</span></button>
      <button aria-pressed={mode==='explode'} onClick={()=>changeMode('explode')}>02 <span>Exploded view</span></button>
      <button aria-pressed={mode==='sentinel'} onClick={()=>changeMode('sentinel')}>03 <span>Sentinel redesign</span></button>
    </div><div className="dx-motion"><button onClick={()=>setPaused(p=>!p)} aria-pressed={paused}>{paused?'Play motion':'Pause motion'}</button><button onClick={()=>api.current?.reset()}>Reset view</button></div></div>
    <div className="dx-story" aria-live="polite"><div><p className="dx-eyebrow">{mode==='sentinel'?'ILLUSTRATIVE TRANSFORMATION':'INSIDE THE INSTRUMENT'}</p><h3>{approved?'Approval changes the permitted path.':descriptions[mode].title}</h3></div><p>{approved?'The amber signal can now pass the gate in this synthetic demonstration. No real decision is approved, no client system is connected, and no business action is executed.':descriptions[mode].text}</p><div className="dx-action">{mode==='sentinel'?<button disabled={approved||status!=='ready'} onClick={approve}>{approved?'Approval simulated':'Simulate human approval'}<span aria-hidden="true"> →</span></button>:<button disabled={status!=='ready'} onClick={rescan}>Restart scan<span aria-hidden="true"> ↗</span></button>}</div></div>
    <footer className="dx-foot"><p>Visual prototype · Synthetic example: authorizing a strategic partnership.</p><p>No live risk rating or runtime-enforcement claim.</p></footer>
  </section>;
}
