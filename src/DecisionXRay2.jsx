import { useEffect, useRef, useState } from 'react';

export default function DecisionXRay2(){
  const mount=useRef(null);
  const [mode,setMode]=useState('scan');
  const [scan,setScan]=useState(false);
  const [ready,setReady]=useState(false);

  useEffect(()=>{
    let alive=true,renderer,frame,cleanup=()=>{};
    (async()=>{
      try{
        const THREE=await import('https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js');
        if(!alive||!mount.current)return;
        const el=mount.current, scene=new THREE.Scene();
        const camera=new THREE.PerspectiveCamera(31,1,.1,100);camera.position.set(0,.25,8.8);
        renderer=new THREE.WebGLRenderer({antialias:true,alpha:true});
        renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.setClearColor(0x000000,0);el.appendChild(renderer.domElement);
        scene.add(new THREE.AmbientLight(0x8eb9ff,1.35));
        const blue=new THREE.PointLight(0x45dfff,45,16);blue.position.set(3,4,5);scene.add(blue);
        const amber=new THREE.PointLight(0xffad38,38,13);amber.position.set(-2,1,4);scene.add(amber);
        const root=new THREE.Group();scene.add(root);
        const shellMat=new THREE.MeshPhysicalMaterial({color:0x172231,metalness:.9,roughness:.2,clearcoat:1,clearcoatRoughness:.12});
        const glassMat=new THREE.MeshPhysicalMaterial({color:0x36cfff,metalness:.25,roughness:.08,transparent:true,opacity:.2,emissive:0x0b79a8,emissiveIntensity:.75,side:THREE.DoubleSide});
        const shellGeo=new THREE.SphereGeometry(2.35,64,32,0,Math.PI*.88);
        const left=new THREE.Mesh(shellGeo,shellMat);left.rotation.y=Math.PI*.56;root.add(left);
        const right=new THREE.Mesh(shellGeo,shellMat);right.rotation.y=-Math.PI*.56;right.scale.x=-1;root.add(right);
        const inner=new THREE.Mesh(new THREE.SphereGeometry(1.72,48,24),glassMat);root.add(inner);
        for(let i=0;i<4;i++){
          const ring=new THREE.Mesh(new THREE.TorusGeometry(1.05+i*.27,.025,10,100),new THREE.MeshBasicMaterial({color:i===2?0xffb43c:0x46d9ff,transparent:true,opacity:.48}));
          ring.rotation.set(Math.PI/2,i*.42,i*.25);root.add(ring);
        }
        const coreMat=new THREE.MeshPhysicalMaterial({color:0xffb02e,metalness:.65,roughness:.12,emissive:0xff8a00,emissiveIntensity:2.2,clearcoat:1});
        const core=new THREE.Mesh(new THREE.OctahedronGeometry(.48,1),coreMat);root.add(core);
        const scanPlane=new THREE.Mesh(new THREE.CircleGeometry(2.48,64),new THREE.MeshBasicMaterial({color:0x46dfff,transparent:true,opacity:.14,side:THREE.DoubleSide}));
        scanPlane.rotation.y=Math.PI/2;scanPlane.position.x=0;root.add(scanPlane);
        const pedestal=new THREE.Mesh(new THREE.CylinderGeometry(2.05,2.35,.3,64),shellMat);pedestal.position.y=-2.55;scene.add(pedestal);
        const halo=new THREE.Mesh(new THREE.TorusGeometry(2.15,.025,8,100),new THREE.MeshBasicMaterial({color:0x45dfff,transparent:true,opacity:.35}));halo.rotation.x=Math.PI/2;halo.position.y=-2.38;scene.add(halo);
        let drag=false,last=0;
        const down=e=>{drag=true;last=e.clientX},up=()=>drag=false,move=e=>{if(drag){root.rotation.y+=(e.clientX-last)*.006;last=e.clientX}};
        el.addEventListener('pointerdown',down);window.addEventListener('pointerup',up);window.addEventListener('pointermove',move);
        const resize=()=>{const w=el.clientWidth,h=Math.max(360,Math.min(520,w*.76));renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()};resize();const ro=new ResizeObserver(resize);ro.observe(el);
        const clock=new THREE.Clock();
        const animate=()=>{if(!alive)return;const t=clock.getElapsedTime();if(!drag)root.rotation.y+=.0014;core.rotation.y=t*.45;core.rotation.x=t*.23;core.scale.setScalar(1+Math.sin(t*2)*.045);scanPlane.position.x=Math.sin(t*.7)*1.9;
          const explode=mode==='explode'?1:mode==='sentinel'?.35:0;left.position.x+=( -explode-left.position.x)*.035;right.position.x+=(explode-right.position.x)*.035;
          renderer.render(scene,camera);frame=requestAnimationFrame(animate)};animate();setReady(true);
        cleanup=()=>{ro.disconnect();el.removeEventListener('pointerdown',down);window.removeEventListener('pointerup',up);window.removeEventListener('pointermove',move);renderer.dispose();renderer.domElement.remove()};
      }catch(e){setReady(false)}
    })();return()=>{alive=false;cancelAnimationFrame(frame);cleanup()};
  },[mode]);

  const run=()=>{setScan(true);setTimeout(()=>setScan(false),1800)};
  return <div className="overflow-hidden rounded-[1.6rem] border border-cyan-300/25 bg-[#020812]">
    <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
      <div><p className="text-[10px] font-semibold tracking-[.3em] text-cyan-300">DECISION X-RAY 2.0</p><p className="mt-1 text-[11px] text-slate-400">See the decision before you commit.</p></div>
      <button onClick={run} className="rounded-full border border-cyan-300/40 bg-cyan-300/10 px-4 py-2 text-[10px] font-semibold text-cyan-100">{scan?'SCANNING…':'RUN X-RAY'}</button>
    </div>
    <div className="relative">
      <div ref={mount} className="min-h-[360px] w-full cursor-grab bg-[radial-gradient(circle_at_50%_48%,rgba(25,108,166,.16),transparent_52%)] active:cursor-grabbing"/>
      {!ready&&<div className="absolute inset-0 grid place-items-center text-xs text-slate-500">Loading decision artifact…</div>}
      <div className="pointer-events-none absolute left-4 top-4 rounded-xl border border-white/10 bg-[#020812]/75 px-3 py-2 backdrop-blur">
        <p className="text-[9px] tracking-[.16em] text-slate-500">SELECTED DECISION</p><p className="mt-1 text-base font-semibold text-amber-100">D07</p><p className="text-[9px] text-slate-300">Human authority required</p>
      </div>
      <div className="pointer-events-none absolute bottom-4 right-4 text-right text-[9px] text-slate-500">Drag to rotate<br/>X-ray plane scans continuously</div>
      {scan&&<div className="pointer-events-none absolute inset-y-0 left-1/2 w-px bg-cyan-200 shadow-[0_0_28px_10px_rgba(66,220,255,.35)]"/>}
    </div>
    <div className="grid grid-cols-3 border-t border-white/10">
      {['scan','explode','sentinel'].map(x=><button key={x} onClick={()=>setMode(x)} className={`px-2 py-3 text-[9px] uppercase tracking-[.1em] ${mode===x?'bg-cyan-300/10 text-cyan-200':'text-slate-500'}`}>{x==='sentinel'?'Sentinel redesign':x}</button>)}
    </div>
    <div className="flex items-center justify-between gap-3 border-t border-white/10 px-4 py-3">
      <p className="text-[9px] text-slate-400">Cyan reveals structure. Amber marks consequential authority.</p>
      <p className="text-[9px] font-medium text-amber-100">D07 · AUTHORITY REQUIRED</p>
    </div>
  </div>
}
