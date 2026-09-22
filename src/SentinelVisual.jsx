import { useEffect, useRef, useState } from 'react';
import { Pause, Play } from '@phosphor-icons/react';
import { buildCoreGeometry, VERTEX_SHADER, FRAGMENT_SHADER } from './lib/core-geometry.js';

// The original Sentinel geometry, with a software 3D projection for non-WebGL browsers.
function createRenderer(canvas) {
  const geometry = buildCoreGeometry();
  const gl = canvas.getContext('webgl', {alpha:true, antialias:true, premultipliedAlpha:true, powerPreference:'low-power'});
  if (gl) {
    const shaders = [[gl.VERTEX_SHADER, VERTEX_SHADER], [gl.FRAGMENT_SHADER, FRAGMENT_SHADER]].map(([type, source]) => { const s=gl.createShader(type); gl.shaderSource(s,source); gl.compileShader(s); if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)) throw new Error('Shader unavailable'); return s; });
    const program=gl.createProgram(); shaders.forEach(s=>gl.attachShader(program,s)); gl.linkProgram(program); shaders.forEach(s=>gl.deleteShader(s));
    if(!gl.getProgramParameter(program,gl.LINK_STATUS)) throw new Error('Program unavailable');
    gl.useProgram(program); const buffer=gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER,buffer); gl.bufferData(gl.ARRAY_BUFFER,geometry.vertices,gl.STATIC_DRAW);
    for(const [name,size,offset] of [['aPosition',3,0],['aColor',3,3],['aSize',1,6],['aOrbit',1,7],['aPhase',1,8]]){ const a=gl.getAttribLocation(program,name); gl.enableVertexAttribArray(a); gl.vertexAttribPointer(a,size,gl.FLOAT,false,36,offset*4); }
    const uniforms=Object.fromEntries(['uTime','uPixels','uPoints','uOpacity'].map(n=>[n,gl.getUniformLocation(program,n)]));
    gl.disable(gl.DEPTH_TEST); gl.enable(gl.BLEND); gl.blendFunc(gl.ONE,gl.ONE); gl.clearColor(0,0,0,0);
    return {type:'webgl', draw(time){gl.viewport(0,0,canvas.width,canvas.height);gl.clear(gl.COLOR_BUFFER_BIT);gl.uniform1f(uniforms.uTime,time);gl.uniform1f(uniforms.uPixels,canvas.width/330);gl.uniform1f(uniforms.uPoints,0);gl.uniform1f(uniforms.uOpacity,.88); for(const path of geometry.paths)gl.drawArrays(gl.LINE_STRIP,path.first,path.count);gl.uniform1f(uniforms.uPoints,1);gl.uniform1f(uniforms.uOpacity,.7);gl.drawArrays(gl.POINTS,0,geometry.particleStart);gl.uniform1f(uniforms.uOpacity,.86);gl.drawArrays(gl.POINTS,geometry.particleStart,geometry.particleCount);}, dispose(){gl.deleteBuffer(buffer);gl.deleteProgram(program);} };
  }
  const ctx=canvas.getContext('2d'); if(!ctx) throw new Error('Rendering unavailable');
  const points=new Float32Array(geometry.vertices.length/3);
  return {type:'software-3d', draw(time){
    const size=canvas.width, scale=size/330, v=geometry.vertices;
    ctx.clearRect(0,0,size,size); ctx.globalCompositeOperation='lighter';
    for(let i=0,j=0;i<v.length;i+=9,j+=3){
      const orbit=v[i+7],phase=v[i+8],pulse=1+.017*Math.sin(time*.75+phase);
      let x=v[i]*pulse,y=v[i+1]*pulse,z=v[i+2]*pulse;
      const ay=time*(.15+orbit*.014)+orbit*.25, ax=.48+time*(.065+orbit*.003),az=.12*Math.sin(time*.17);
      [x,z]=[Math.cos(ay)*x+Math.sin(ay)*z,-Math.sin(ay)*x+Math.cos(ay)*z];
      [y,z]=[Math.cos(ax)*y-Math.sin(ax)*z,Math.sin(ax)*y+Math.cos(ax)*z];
      [x,y]=[Math.cos(az)*x-Math.sin(az)*y,Math.sin(az)*x+Math.cos(az)*y];
      y+=.022*Math.sin(time*.55);const perspective=3.8/(3.8-z);
      points[j]=size/2+x*.72*perspective*size/2;points[j+1]=size/2-y*.72*perspective*size/2;points[j+2]=z;
    }
    ctx.lineWidth=Math.max(.6,scale*.8);
    for(const path of geometry.paths){ctx.beginPath();for(let i=path.first;i<path.first+path.count;i++){const j=i*3;i===path.first?ctx.moveTo(points[j],points[j+1]):ctx.lineTo(points[j],points[j+1]);}ctx.shadowColor='#72d9ff';ctx.shadowBlur=3*scale;ctx.strokeStyle='rgba(157,229,255,.9)';ctx.stroke();}
    for(let i=geometry.particleStart;i<v.length/9-3;i++){const j=i*3,z=points[j+2],alpha=.28+.36*(z+1)/2;ctx.fillStyle=`rgba(150,228,255,${alpha})`;ctx.beginPath();ctx.arc(points[j],points[j+1],Math.max(.55,v[i*9+6]*scale*.3),0,Math.PI*2);ctx.fill();}
    ctx.shadowColor='#59ceff';ctx.shadowBlur=48*scale;ctx.fillStyle='rgba(104,210,255,.38)';ctx.beginPath();ctx.arc(size/2,size/2,27*scale,0,Math.PI*2);ctx.fill();ctx.fillStyle='#ddf8ff';ctx.beginPath();ctx.arc(size/2,size/2,7*scale,0,Math.PI*2);ctx.fill();ctx.shadowBlur=0;
  },dispose(){} };
}

export function SentinelVisual(){
  const imageRef=useRef(null), canvasRef=useRef(null), apiRef=useRef(null);
  const [ready,setReady]=useState(false),[paused,setPaused]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
  const pausedRef=useRef(paused);
  useEffect(()=>{pausedRef.current=paused;apiRef.current?.sync();},[paused]);
  useEffect(()=>{
    const image=imageRef.current, canvas=canvasRef.current;let renderer,active=true,raf=0,last=0,time=1.4,inView=true,loaded=false;
    const motion=matchMedia('(prefers-reduced-motion: reduce)');
    function render(){if(loaded&&active){renderer.draw(time);canvas.dataset.frame=String(Number(canvas.dataset.frame||0)+1);}}
    function frame(now){raf=0;if(!active||!loaded||pausedRef.current||!inView||document.hidden)return;if(!last)last=now;if(now-last>=1000/30){time+=Math.min((now-last)/1000,.08);last=now;render();}raf=requestAnimationFrame(frame);}
    function sync(){cancelAnimationFrame(raf);raf=0;last=0;if(active&&loaded&&!pausedRef.current&&inView&&!document.hidden)raf=requestAnimationFrame(frame);}
    function locate(){const b=image.getBoundingClientRect();if(!b.width||!b.height)return;const p=getComputedStyle(image).objectPosition.split(' ').map(parseFloat);const s=Math.max(b.width/1536,b.height/1024);const d=260*s;canvas.style.width=`${d}px`;canvas.style.height=`${d}px`;canvas.style.left=`${(b.width-1536*s)*(p[0]/100)+1174*s}px`;canvas.style.top=`${(b.height-1024*s)*(p[1]/100)+445*s}px`;const resolution=Math.round(d*Math.min(devicePixelRatio||1,2));if(canvas.width!==resolution){canvas.width=resolution;canvas.height=resolution;}render();}
    function lost(e){e.preventDefault();loaded=false;setReady(false);image.src='/assets/sentinel-hero.webp';sync();}
    const resize=new ResizeObserver(locate), visibility=new IntersectionObserver(([e])=>{inView=e.isIntersecting;sync();});
    apiRef.current={sync};
    try{renderer=createRenderer(canvas);canvas.dataset.renderer=renderer.type;const empty=new Image();empty.src='/assets/sentinel-containment.webp';empty.decode().then(()=>{if(!active)return;image.src=empty.src;loaded=true;locate();setReady(true);sync();}).catch(()=>{});}catch{/* Keep the static chamber image when rendering is unavailable. */}
    const onMotion=()=>setPaused(motion.matches);
    resize.observe(image);visibility.observe(image);document.addEventListener('visibilitychange',sync);motion.addEventListener('change',onMotion);canvas.addEventListener('webglcontextlost',lost);image.addEventListener('load',locate);
    return()=>{active=false;cancelAnimationFrame(raf);resize.disconnect();visibility.disconnect();document.removeEventListener('visibilitychange',sync);motion.removeEventListener('change',onMotion);canvas.removeEventListener('webglcontextlost',lost);image.removeEventListener('load',locate);renderer?.dispose();apiRef.current=null;};
  },[]);
  return <div className="sentinel-visual"><img ref={imageRef} id="containment-image" className="containment-image" src="/assets/sentinel-hero.webp" alt="A luminous intelligence core suspended inside a glass containment chamber" fetchPriority="high"/><canvas ref={canvasRef} id="intelligence-core" hidden={!ready} aria-hidden="true"/><div className="visual-caption"><span>Sentinel · Illustrative visualization</span>{ready&&<button id="core-motion" aria-pressed={paused} aria-label={paused?'Play intelligence animation':'Pause intelligence animation'} onClick={()=>setPaused(!paused)}>{paused?<Play size={16} weight="fill"/>:<Pause size={16} weight="fill"/>}{paused?'Play motion':'Pause motion'}</button>}</div></div>;
}
