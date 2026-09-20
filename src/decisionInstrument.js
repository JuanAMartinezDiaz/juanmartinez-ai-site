import * as T from 'three';
import { addInstrumentDetails } from './instrumentDetails.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

// A modeled cutaway, not a textured sphere. All assets are generated locally.
export function createDecisionInstrument(host, notify) {
  const scene = new T.Scene();
  const camera = new T.PerspectiveCamera(33, 1, .1, 100);
  const renderer = new T.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'low-power' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.6));
  renderer.outputColorSpace = T.SRGBColorSpace;
  renderer.toneMapping = T.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.05;
  renderer.setClearColor(0x030a11, 0); renderer.domElement.setAttribute('aria-hidden', 'true');
  host.appendChild(renderer.domElement);
  const pmrem = new T.PMREMGenerator(renderer), room = new RoomEnvironment();
  const environment = pmrem.fromScene(room, .04); scene.environment = environment.texture; scene.environmentIntensity = .72;
  room.dispose(); pmrem.dispose();
  scene.add(new T.HemisphereLight(0xd7e9fa, 0x182632, .65));
  const light = (color, intensity, x, y, z) => { const l = new T.DirectionalLight(color, intensity); l.position.set(x,y,z); scene.add(l); };
  light(0xffedd6, 2.2, -4, 6, 5); light(0x9ddcf5, .9, 5, 2, 3); light(0xc1dbf7, 1.8, -3, 3, -5);
  const root = new T.Group(); root.rotation.y = -.12; scene.add(root);
  const scanUniform = { value: -.7 }, cutUniform = { value: 1 };
  const metal = (color, roughness=.32, metalness=.75) => new T.MeshStandardMaterial({color, roughness, metalness});
  const graphite = metal(0x24303a,.3,.85), dark = metal(0x12232d, .48, .5), silver = metal(0x71838c, .26, .88), bronze = metal(0x9f7541, .31, .8);
  const cyan = new T.MeshBasicMaterial({color:0x61dce9, toneMapped:false});
  const amber = new T.MeshBasicMaterial({color:0xffc16b, toneMapped:false});
  const faint = new T.MeshBasicMaterial({color:0x4aacc0, transparent:true, opacity:.25, depthWrite:false});
  const mesh = (geo, mat, parent=root) => { const m=new T.Mesh(geo,mat); parent.add(m); return m; };
  const spherePoint = (r, lat, lon) => new T.Vector3(r*Math.cos(lat)*Math.sin(lon),r*Math.sin(lat),r*Math.cos(lat)*Math.cos(lon));
  const tube = (points, radius, mat, parent=root) => mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),Math.max(12,points.length*4),radius,5,false),mat,parent);
  // Shell panels have a permanent forward aperture; no camera angle can fill it with a black sphere.
  const panels=[];
  const panelMaterials=[0x1e2a33,0x27343d,0x182731].map(c=>{
    const m=metal(c,.3,.86); m.side=T.DoubleSide;
    m.onBeforeCompile=s=>{ s.uniforms.uScan=scanUniform; s.uniforms.uCut=cutUniform;
      s.vertexShader='varying vec3 vDx;\n'+s.vertexShader.replace('#include <begin_vertex>','#include <begin_vertex>\nvDx=position;');
      s.fragmentShader='varying vec3 vDx; uniform float uScan; uniform float uCut;\n'+s.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\nfloat band=1.0-smoothstep(0.015,0.10,abs(vDx.x-uScan));\ndiffuseColor.rgb=mix(diffuseColor.rgb,vec3(0.18,0.8,0.88),band*uCut*.8);\nif(uCut>.5 && abs(vDx.x-uScan)<.026 && vDx.z>-.6) discard;');
    }; m.customProgramCacheKey=()=> 'dx-cutaway-v3'; return m;
  });
  function panel(a,b,c,d){
    const p=[],idx=[],uv=[],rows=8,cols=6;
    for(let i=0;i<=rows;i++) for(let j=0;j<=cols;j++){ const v=spherePoint(2.23,c+(d-c)*i/rows,a+(b-a)*j/cols);p.push(v.x,v.y,v.z);uv.push(j/cols,i/rows); }
    for(let i=0;i<rows;i++)for(let j=0;j<cols;j++){ const k=i*(cols+1)+j; idx.push(k,k+1,k+cols+1,k+1,k+cols+2,k+cols+1); }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;
  }
  const bolts=new T.InstancedMesh(new T.SphereGeometry(.025,7,5),silver,154);root.add(bolts);let boltIndex=0;
  const dummy=new T.Object3D();
  for(let row=0;row<7;row++)for(let col=0;col<11;col++){
    const a=1.08+col*4.8/11+.012,b=1.08+(col+1)*4.8/11-.012,c=-1.39+row*2.78/7+.014,d=-1.39+(row+1)*2.78/7-.014;
    const m=mesh(panel(a,b,c,d),panelMaterials[(row+col)%3]);m.userData.vector=spherePoint(1,(c+d)/2,(a+b)/2);panels.push(m);
    for(const lat of [c+.04,d-.04]){dummy.position.copy(spherePoint(2.25,lat,(a+b)/2));dummy.updateMatrix();bolts.setMatrixAt(boltIndex++,dummy.matrix);}
  }
  for(const lon of [1.08,5.88]){const pts=Array.from({length:50},(_,i)=>spherePoint(2.235,-1.4+i*2.8/49,lon));tube(pts,.034,silver);}
  for(const lat of [-.98,0,.98]){const pts=Array.from({length:70},(_,i)=>spherePoint(2.245,lat,1.08+i*4.8/69));tube(pts,.017,bronze);}
  function ring(r,w,depth,z,mat,parent=root,start=0,span=Math.PI*2){
    const s=new T.Shape();s.absarc(0,0,r,start,start+span,false);
    if(span>=Math.PI*2-.001){const h=new T.Path();h.absarc(0,0,r-w,0,Math.PI*2,true);s.holes.push(h);}else{s.absarc(0,0,r-w,start+span,start,true);s.closePath();}
    const g=new T.ExtrudeGeometry(s,{depth,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:.014,bevelThickness:.01,curveSegments:64});const m=mesh(g,mat,parent);m.position.z=z;return m;
  }
  // Machined internal assemblies: evidence carrier, control frame, authority iris.
  const assemblies=[];
  const assemblySpecs=[[1.98,.15,.15,-.38,silver],[1.76,.16,.16,-.02,graphite],[1.47,.12,.15,.28,silver],[1.12,.11,.11,.52,bronze]];
  assemblySpecs.forEach(([r,w,d,z,mat],k)=>{
    const group=new T.Group();root.add(group);group.userData.baseZ=z;group.position.z=z;assemblies.push(group);
    ring(r,w,d,0,mat,group);ring(r-.025,.011,.016,d+.022,k===3?amber:faint,group);
    for(let n=0;n<24;n++){
      const a=n*Math.PI/12,rad=r-w*.5;
      const inset=mesh(new T.BoxGeometry(.035,.09,.035),n%4===0?bronze:dark,group);inset.position.set(Math.cos(a)*rad,Math.sin(a)*rad,d+.012);inset.rotation.z=a-Math.PI/2;
      if(n%3===0){const b=mesh(new T.CylinderGeometry(.027,.027,.025,8),silver,group);b.rotation.x=Math.PI/2;b.position.set(Math.cos(a)*(r-.045),Math.sin(a)*(r-.045),d+.04);}
    }
    for(let n=0;n<6;n++){const a=n*Math.PI/3+.12*k;ring(r-w-.045,.016,.008,d+.01,k===3?amber:cyan,group,a,.40);}
  });
  const teeth=new T.InstancedMesh(new T.BoxGeometry(.04,.1,.095),bronze,64);root.add(teeth);
  for(let i=0;i<64;i++){const a=i*Math.PI/32;dummy.position.set(Math.cos(a)*1.57,Math.sin(a)*1.57,.25);dummy.rotation.set(0,0,a-Math.PI/2);dummy.updateMatrix();teeth.setMatrixAt(i,dummy.matrix);}
  const modules=new T.Group();root.add(modules);
  for(let i=0;i<12;i++){
    const a=i*Math.PI/6+.12,rad=1.84,g=new T.Group();g.position.set(Math.cos(a)*rad,Math.sin(a)*rad,-.22);g.rotation.z=a;modules.add(g);
    mesh(new T.BoxGeometry(.18,.24,.24),graphite,g);
    const face=mesh(new T.BoxGeometry(.12,.18,.025),dark,g);face.position.z=.133;
    const signal=mesh(new T.BoxGeometry(.075,.018,.018),i%3===0?amber:cyan,g);signal.position.set(0,.05,.152);
    for(let pin=0;pin<3;pin++){const p=mesh(new T.BoxGeometry(.08,.012,.022),silver,g);p.position.set(.12,(pin-1)*.062,.04);}
  }
  const internalDetail=addInstrumentDetails(root,{dark,graphite,silver,bronze,cyan});
  const coreGroup=new T.Group();coreGroup.position.z=.67;root.add(coreGroup);
  const core=mesh(new T.IcosahedronGeometry(.45,0),new T.MeshStandardMaterial({color:0xc98420,metalness:.46,roughness:.22,emissive:0xc47619,emissiveIntensity:.58}),coreGroup);
  const cage=new T.LineSegments(new T.EdgesGeometry(new T.IcosahedronGeometry(.62,0)),new T.LineBasicMaterial({color:0xffc874}));coreGroup.add(cage);
  const badgeCanvas=document.createElement('canvas');badgeCanvas.width=512;badgeCanvas.height=256;
  const ctx=badgeCanvas.getContext('2d');ctx.fillStyle='#171915';ctx.fillRect(0,0,512,256);ctx.strokeStyle='#e9b764';ctx.lineWidth=5;ctx.strokeRect(5,5,502,246);
  ctx.fillStyle='#ffe5ae';ctx.font='500 126px Arial';ctx.textAlign='center';ctx.fillText('D07',256,146);ctx.fillStyle='#bfae8c';ctx.font='22px Arial';ctx.fillText('HUMAN AUTHORITY',256,207);
  const badgeTexture=new T.CanvasTexture(badgeCanvas);badgeTexture.colorSpace=T.SRGBColorSpace;const badge=mesh(new T.PlaneGeometry(.84,.42),new T.MeshBasicMaterial({map:badgeTexture}),coreGroup);badge.position.z=.66;
  const vector=(x,y,z)=>new T.Vector3(x,y,z);
  const inputPoints=[vector(-1.7,-.7,.28),vector(-1.1,-.66,.7),vector(-.8,-.18,.9),vector(0,0,1.03)];
  const routeIn=new T.CatmullRomCurve3(inputPoints);tube(inputPoints,.012,cyan);
  const outputPoints=[vector(.33,-.05,1.04),vector(.7,-.34,.94),vector(1.02,-.55,.65),vector(1.6,-.62,.3)];
  const routeOut=new T.CatmullRomCurve3(outputPoints);tube(outputPoints,.012,cyan);
  const redundantMat=new T.MeshBasicMaterial({color:0xa9844c,transparent:true,opacity:.4});
  const redundant=tube([vector(-1.7,-.7,.28),vector(-1,-1,.54),vector(.38,-.86,.81),vector(.33,-.05,1.04)],.01,redundantMat);
  const pulseIn=mesh(new T.SphereGeometry(.045,10,8),cyan),pulseOut=mesh(new T.SphereGeometry(.045,10,8),amber);
  const gate=new T.Group();gate.position.copy(routeOut.getPoint(.58));gate.rotation.z=-.28;root.add(gate);
  const gateBar=mesh(new T.BoxGeometry(.055,.37,.055),bronze,gate);
  const gateLight=mesh(new T.BoxGeometry(.019,.29,.066),amber,gate);gateLight.position.z=.006;
  for(const y of [-.22,.22]){const p=mesh(new T.BoxGeometry(.16,.045,.11),silver,gate);p.position.y=y;}
  const scanMat=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,uniforms:{},
    vertexShader:'varying vec2 vUv; void main(){vUv=uv; gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',
    fragmentShader:'varying vec2 vUv; void main(){ float edge=pow(abs(vUv.x-.5)*2.,22.)+pow(abs(vUv.y-.5)*2.,22.); float grid=step(.985,fract(vUv.x*20.))*.045+step(.985,fract(vUv.y*20.))*.045; gl_FragColor=vec4(.26,.81,.89,.026+edge*.32+grid);}' });
  const plane=mesh(new T.PlaneGeometry(4.5,4.7),scanMat);plane.rotation.y=Math.PI/2;plane.position.x=-.7;
  // The base provides a scale reference and a lit silhouette without a busy backdrop.
  const baseGroup=new T.Group();baseGroup.position.y=-2.45;scene.add(baseGroup);
  const profile=[new T.Vector2(0,0),new T.Vector2(1.77,0),new T.Vector2(1.92,.07),new T.Vector2(1.92,.20),new T.Vector2(1.78,.28),new T.Vector2(0,.28)];
  mesh(new T.LatheGeometry(profile,80),graphite,baseGroup);
  for(const [rad,y,mat] of [[1.9,.10,silver],[1.91,.15,bronze],[1.78,.28,silver],[1.72,.29,faint]]){const h=mesh(new T.TorusGeometry(rad,.015,7,96),mat,baseGroup);h.rotation.x=Math.PI/2;h.position.y=y;}
  const shadowCanvas=document.createElement('canvas');shadowCanvas.width=128;shadowCanvas.height=128;const sc=shadowCanvas.getContext('2d');
  const gradient=sc.createRadialGradient(64,64,3,64,64,63);gradient.addColorStop(0,'rgba(0,0,0,.65)');gradient.addColorStop(1,'rgba(0,0,0,0)');sc.fillStyle=gradient;sc.fillRect(0,0,128,128);
  const shadowTex=new T.CanvasTexture(shadowCanvas);const shadow=mesh(new T.PlaneGeometry(6.8,5.5),new T.MeshBasicMaterial({map:shadowTex,transparent:true,depthWrite:false}),scene);shadow.rotation.x=-Math.PI/2;shadow.position.y=-2.47;
  let mode='scan',paused=window.matchMedia('(prefers-reduced-motion: reduce)').matches,approved=false,alive=true,visible=true;
  let frame=0,time=2.8,last=performance.now(),yaw=0,pitch=0,targetYaw=0,targetPitch=0,drag=null,explode=0,scanAge=2.8;
  root.position.y=.08;
  const lost=e=>{e.preventDefault();paused=true;notify('lost');}; renderer.domElement.addEventListener('webglcontextlost',lost);
  function resize(){
    const {width:w,height:h}=host.getBoundingClientRect();if(w<1||h<1)return;
    renderer.setSize(w,h,false);camera.aspect=w/h;
    const distance=Math.max(5.8/(2*Math.tan(T.MathUtils.degToRad(16.5))),5.7/(2*Math.tan(T.MathUtils.degToRad(16.5))*camera.aspect))*1.10;
    camera.position.copy(vector(.22,.10,1).normalize().multiplyScalar(distance));camera.lookAt(0,-.15,0);camera.updateProjectionMatrix();
    root.position.x=baseGroup.position.x=w>800?-.6:0;host.dataset.aspect=(w/h).toFixed(3);
  }
  const ro=new ResizeObserver(resize);ro.observe(host);resize();
  const io=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=performance.now();});io.observe(host);
  const down=e=>{if(e.button!==0)return;drag={x:e.clientX,y:e.clientY};host.setPointerCapture(e.pointerId);};
  const move=e=>{if(!drag)return;targetYaw=T.MathUtils.clamp(targetYaw+(e.clientX-drag.x)*.004,-.5,.35);targetPitch=T.MathUtils.clamp(targetPitch+(e.clientY-drag.y)*.003,-.12,.18);drag={x:e.clientX,y:e.clientY};};
  const up=()=>{drag=null;};host.addEventListener('pointerdown',down);host.addEventListener('pointermove',move);host.addEventListener('pointerup',up);host.addEventListener('pointercancel',up);
  let renderCount=0,dirty=45;
  function draw(now){
    if(!alive)return;frame=requestAnimationFrame(draw);const dt=Math.min((now-last)/1000,.05);last=now;
    if(!visible||document.hidden)return;
    if(!paused){time+=dt;scanAge+=dt;}
    yaw+=(targetYaw-yaw)*.09;pitch+=(targetPitch-pitch)*.09;
    root.rotation.y=-.12+yaw+(paused?0:Math.sin(time*.16)*.07);root.rotation.x=pitch;
    const expansion=mode==='explode'?.42:mode==='sentinel'?.10:0;explode+=(expansion-explode)*.045;
    internalDetail.position.z=explode*.7;
    panels.forEach(p=>p.position.copy(p.userData.vector).multiplyScalar(explode));bolts.visible=explode<.06;
    assemblies.forEach((a,i)=>{a.position.z=a.userData.baseZ+explode*(i+1)*.48;});
    if(!paused){core.rotation.y=time*.19;core.rotation.z=Math.sin(time*.32)*.13;cage.rotation.y=-time*.06;}
    const scanX=-2.3+((scanAge%12)/12)*4.6;plane.position.x=scanUniform.value=scanX;plane.visible=mode==='scan';cutUniform.value=mode==='scan'?1:0;
    redundant.visible=mode!=='sentinel';gateBar.visible=gateLight.visible=!approved;gate.visible=mode!=='explode';
    pulseIn.position.copy(routeIn.getPoint((time*.18)%1));pulseOut.position.copy(routeOut.getPoint(approved?(time*.16)%1:Math.min((time*.16)%1,.54)));
    if(paused&&!drag&&dirty<=0&&Math.abs(targetYaw-yaw)<.001&&Math.abs(targetPitch-pitch)<.001)return;
    renderer.render(scene,camera);dirty--;renderCount++;
    if(renderCount%15===0){host.dataset.frames=String(renderCount);host.dataset.scan=scanX.toFixed(2);host.dataset.approved=String(approved);}
  }
  draw(performance.now());host.dataset.ready='true';notify('ready');
  return {
    setMode(value){mode=value;approved=false;scanAge=0;dirty=100;host.dataset.mode=value;},
    setPaused(value){paused=value;dirty=45;},
    approve(){if(mode==='sentinel'){approved=true;dirty=50;}},
    reset(){targetYaw=0;targetPitch=0;dirty=80;},
    rescan(){scanAge=0;mode='scan';approved=false;dirty=80;},
    inspect(direction){targetYaw=T.MathUtils.clamp(targetYaw+direction*.1,-.5,.35);dirty=60;},
    snapshot(){return {mode,approved,paused,frames:renderCount,calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,canvas:{width:host.clientWidth,height:host.clientHeight}};},
    dispose(){
      alive=false;cancelAnimationFrame(frame);ro.disconnect();io.disconnect();
      host.removeEventListener('pointerdown',down);host.removeEventListener('pointermove',move);host.removeEventListener('pointerup',up);host.removeEventListener('pointercancel',up);
      renderer.domElement.removeEventListener('webglcontextlost',lost);
      const geometries=new Set(),materials=new Set(),textures=new Set([badgeTexture,shadowTex]);
      scene.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)(Array.isArray(o.material)?o.material:[o.material]).forEach(m=>materials.add(m));});
      geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());textures.forEach(t=>t.dispose());
      environment.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove();delete host.dataset.ready;
    }
  };
}
