// Presentation-only poses. Geometry and native authoring history are immutable.
export const clamp=t=>Math.max(0,Math.min(1,t));
export function pose(item,progress,selected){
 if(item.joint!==selected)return [0,0,0];
 const t=clamp(progress),frames=item.keyframes;
 if(!frames)return item.motion.map(d=>d*(1-t));
 if(t<=frames[0].t)return [...frames[0].offset];
 for(let i=1;i<frames.length;i++)if(t<=frames[i].t){
  const a=frames[i-1],b=frames[i],u=(t-a.t)/(b.t-a.t);
  return a.offset.map((x,k)=>x+(b.offset[k]-x)*u);
 }
 return [...frames.at(-1).offset];
}
export function stageAt(joint,t,reverse=false){if(t>=1)return 'All members seated';const s=joint.stages?.find(s=>t<s.end-1e-9);return reverse?(s?.reverseLabel||'Withdraw along the assembly path'):(s?.label||joint.sequence);}
export function phase(t){return t<=0?'Separated':t>=1?'Fully seated':'Sliding into place';}
export function advance(progress,direction,seconds){return clamp(progress+direction*Math.max(0,seconds)/6);}
export function assemblyDirection(progress){return progress>=1?-1:1;}
// Exact cyclic permutations, used by both the renderer and the collision audit.
// Configuration changes occur fully separated; assembly itself remains translational.
export function orientedPoint(point,pivot,configuration=0){
 const d=point.map((v,k)=>v-pivot[k]);
 const p=configuration===1?[d[2],d[0],d[1]]:configuration===2?[d[1],d[2],d[0]]:d;
 return p.map((v,k)=>v+pivot[k]);
}
