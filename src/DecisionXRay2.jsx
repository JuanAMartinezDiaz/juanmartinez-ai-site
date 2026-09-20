import { useEffect, useRef, useState } from 'react';

const layers = ['Operations','Decisions','Authority','Controls','Evidence'];
const copy = {
  Operations:'What happens across the workflow',
  Decisions:'Where judgment changes the path',
  Authority:'Who is permitted to act',
  Controls:'What constrains consequential action',
  Evidence:'What proves what happened'
};

export default function DecisionXRay2(){
  const mount=useRef(null), sceneRef=useRef(null);
  const [depth,setDepth]=useState('Authority');
  const [selected,setSelected]=useState('D07');
  const [ready,setReady]=useState(false);
  const [scan,setScan]=useState(false);

  useEffect(()=>{
    let alive=true, renderer, frame, cleanup=()=>{};
    (async()=>{
      try{
        const THREE=await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');
        if(!alive||!mount.current)return;
        const el=mount.current, scene=new THREE.Scene();
        const camera=new THREE.PerspectiveCamera(34,1,.1,100); camera.position.set(0,2.6,8.8);
        renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
        renderer.setPixelRatio(Math.min(devicePixelRatio,2)); renderer.setClearColor(0x000000,0);
        el.appendChild(renderer.domElement);
        const root=new THREE.Group(); root.rotation.x=-.12; scene.add(root); sceneRef.current={root,THREE};
        scene.add(new THREE.AmbientLight(0x7aa7ff,1.15));
        const key=new THREE.PointLight(0x38d8ff,35,18); key.position.set(4,4,5); scene.add(key);
        const warm=new THREE.PointLight(0xffc45c,22,12); warm.position.set(-3,1,3); scene.add(warm);
        const mats=[
          new THREE.MeshPhysicalMaterial({color:0x153a67,metalness:.65,roughness:.22,transparent:true,opacity:.52,emissive:0x0b284c,emissiveIntensity:.7}),
          new THREE.MeshPhysicalMaterial({color:0x15547b,metalness:.6,roughness:.2,transparent:true,opacity:.48,emissive:0x0d4d6c,emissiveIntensity:.65})
        ];
        for(let i=0;i<5;i++){
          const ring=new THREE.Mesh(new THREE.TorusGeometry(2.55-i*.06,.035,12,120),mats[i%2]);
          ring.position.y=(2-i)*.92; ring.rotation.x=Math.PI/2; root.add(ring);
          const disc=new THREE.Mesh(new THREE.CylinderGeometry(2.3,2.3,.035,72),mats[(i+1)%2]);
          disc.position.y=ring.position.y; disc.material=disc.material.clone(); disc.material.opacity=.08; root.add(disc);
          for(let n=0;n<5;n++){
            const a=n/5*Math.PI*2+i*.35;
            const node=new THREE.Mesh(new THREE.IcosahedronGeometry(.11,1),new THREE.MeshStandardMaterial({color:0x71ddff,emissive:0x2abfff,emissiveIntensity:2}));
            node.position.set(Math.cos(a)*1.72,ring.position.y+.12,Math.sin(a)*1.72); root.add(node);
          }
        }
        const coreMat=new THREE.MeshPhysicalMaterial({color:0xffc75c,metalness:.75,roughness:.16,emissive:0xffa928,emissiveIntensity:1.7});
        const core=new THREE.Mesh(new THREE.OctahedronGeometry(.45,0),coreMat); core.position.y=.46; root.add(core);
        const beam=new THREE.Mesh(new THREE.CylinderGeometry(.018,.018,4.1,12),new THREE.MeshBasicMaterial({color:0xffc75c,transparent:true,opacity:.65}));
        beam.position.y=.2; root.add(beam);
        const grid=new THREE.GridHelper(7,18,0x16466d,0x0b2138); grid.position.y=-2.15; scene.add(grid);
        let drag=false,lastX=0;
        const down=e=>{drag=true;lastX=e.clientX;}; const up=()=>drag=false;
        const move=e=>{if(drag){root.rotation.y+=(e.clientX-lastX)*.008;lastX=e.clientX;}};
        el.addEventListener('pointerdown',down); window.addEventListener('pointerup',up); window.addEventListener('pointermove',move);
        const resize=()=>{const w=el.clientWidth,h=Math.max(330,Math.min(480,w*.72)); renderer.setSize(w,h,false); camera.aspect=w/h;camera.updateProjectionMatrix();};
        resize(); const ro=new ResizeObserver(resize);ro.observe(el);
        const clock=new THREE.Clock();
        const animate=()=>{if(!alive)return; const t=clock.getElapsedTime(); if(!drag)root.rotation.y+=.0018; core.rotation.y=t*.7; core.rotation.x=t*.35; core.scale.setScalar(1+Math.sin(t*2.2)*.06); renderer.render(scene,camera);frame=requestAnimationFrame(animate);};animate();
        setReady(true); cleanup=()=>{ro.disconnect();el.removeEventListener('pointerdown',down);window.removeEventListener('pointerup',up);window.removeEventListener('pointermove',move);renderer.dispose();renderer.domElement.remove();};
      }catch(e){setReady(false);}
    })();
    return()=>{alive=false;cancelAnimationFrame(frame);cleanup();};
  },[]);

  const run=()=>{setScan(true);setTimeout(()=>setScan(false),1600);};
  return <div className="overflow-hidden rounded-[1.6rem] border border-cyan-300/25 bg-[#030a16]">
    <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-3">
      <div><p className="text-[10px] font-semibold tracking-[.28em] text-cyan-300">DECISION X-RAY 2.0</p><p className="mt-1 text-[11px] text-slate-400">A living model of decision architecture.</p></div>
      <button onClick={run} className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-[10px] font-semibold text-cyan-100">{scan?'SCANNING…':'RUN X-RAY'}</button>
    </div>
    <div className="relative">
      <div ref={mount} className="min-h-[330px] w-full cursor-grab bg-[radial-gradient(circle_at_50%_45%,rgba(28,120,190,.13),transparent_48%)] active:cursor-grabbing" aria-label="Interactive rotating 3D decision architecture"/>
      {!ready&&<div className="absolute inset-0 grid place-items-center text-xs text-slate-500">Loading 3D architecture…</div>}
      {scan&&<div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 animate-[pulse_1s_ease-in-out_infinite] bg-gradient-to-b from-cyan-300/0 via-cyan-300/15 to-cyan-300/0"/>}
      <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-end justify-between gap-3">
        <div className="rounded-xl border border-white/10 bg-[#030a16]/80 p-2 backdrop-blur">
          <p className="text-[9px] tracking-[.16em] text-slate-500">SELECTED DECISION</p><p className="text-sm font-semibold text-amber-100">{selected} · AUTHORIZE</p>
          <p className="mt-1 text-[9px] text-slate-300">Human reserved · runtime gate enforced · evidence retained</p>
        </div>
        <p className="text-[9px] text-slate-500">Drag to inspect • auto-rotates</p>
      </div>
    </div>
    <div className="grid grid-cols-5 border-t border-white/10">
      {layers.map(x=><button key={x} onClick={()=>setDepth(x)} className={`min-w-0 border-r border-white/10 px-1 py-3 text-[9px] last:border-r-0 ${depth===x?'bg-cyan-300/10 text-cyan-200':'text-slate-500'}`}>{x}</button>)}
    </div>
    <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3 text-[10px]"><span className="text-slate-400">{copy[depth]}</span><button onClick={()=>setSelected(selected==='D07'?'D09':'D07')} className="text-cyan-200">Trace next decision →</button></div>
  </div>;
}
