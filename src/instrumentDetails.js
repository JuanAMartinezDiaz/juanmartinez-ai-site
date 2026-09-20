import * as T from 'three';

export function addInstrumentDetails(root, {dark,graphite,silver,bronze,cyan}){
  const group=new T.Group();root.add(group);
  const add=(g,m,parent=group)=>{const o=new T.Mesh(g,m);parent.add(o);return o;};
  // Radial bridges, bearing collars and gear trains form a legible mechanical interior.
  for(let i=0;i<10;i++){
    const angle=i*Math.PI/5+.12,g=new T.Group();g.position.set(Math.cos(angle)*1.05,Math.sin(angle)*1.05,.44);g.rotation.z=angle;group.add(g);
    const arm=add(new T.BoxGeometry(.58,.11,.12),graphite,g);arm.position.z=.025;
    for(const y of [-.04,.04]){const rail=add(new T.BoxGeometry(.46,.016,.034),silver,g);rail.position.set(0,y,.104);}
    for(const x of [-.22,.22]){const pin=add(new T.CylinderGeometry(.05,.05,.054,8),bronze,g);pin.rotation.x=Math.PI/2;pin.position.set(x,0,.115);}
    const slot=add(new T.BoxGeometry(.19,.021,.021),dark,g);slot.position.z=.119;
  }
  for(const [x,y,r] of [[-.86,.48,.18],[.66,.72,.22],[.1,-.88,.2],[-.77,-.49,.16]]){
    const g=new T.Group();g.position.set(x,y,.57);group.add(g);
    const body=add(new T.CylinderGeometry(r,r,.075,48),graphite,g);body.rotation.x=Math.PI/2;
    const rim=add(new T.TorusGeometry(r-.025,.013,6,48),bronze,g);rim.position.z=.05;
    const pin=add(new T.CylinderGeometry(.035,.035,.085,10),silver,g);pin.rotation.x=Math.PI/2;
    for(let n=0;n<24;n++){const a=n*Math.PI/12,tooth=add(new T.BoxGeometry(.034,.025,.06),silver,g);tooth.position.set(Math.cos(a)*r,Math.sin(a)*r,0);tooth.rotation.z=a;}
    for(let n=0;n<4;n++){const a=n*Math.PI/2,spoke=add(new T.BoxGeometry(r*.64,.02,.023),bronze,g);spoke.position.set(Math.cos(a)*r*.5,Math.sin(a)*r*.5,.058);spoke.rotation.z=a;}
  }
  for(let i=0;i<16;i++){
    const a=i*Math.PI/8+.09,g=new T.Group();g.position.set(Math.cos(a)*1.63,Math.sin(a)*1.63,.21);g.rotation.z=a;group.add(g);
    add(new T.BoxGeometry(.16,.10,.18),dark,g);
    for(let n=0;n<4;n++){const fin=add(new T.BoxGeometry(.12,.011,.20),n===0?silver:graphite,g);fin.position.y=(n-1.5)*.024;}
    if(i%4===0){const led=add(new T.BoxGeometry(.022,.038,.009),cyan,g);led.position.z=.115;}
  }
  return group;
}
