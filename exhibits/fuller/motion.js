export function sphereNodes(form,progress,scale,center){
 const r=form.radius+(1-Math.max(0,Math.min(1,progress)))*.5;
 return form.nodes.map((p,i)=>p.map((v,k)=>center[k]+scale*(v+form.barMidpoints[Math.floor(i/2)][k]*(r-form.radius))));
}
export const durationSeconds=5;
export function advance(progress,direction,dt){return Math.max(0,Math.min(1,progress+direction*Math.max(0,dt)/durationSeconds));}
