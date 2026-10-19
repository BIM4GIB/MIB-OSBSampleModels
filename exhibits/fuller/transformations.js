// Deterministic rigid-member motions. Metres, right handed, Z up.
export const clamp=t=>Math.max(0,Math.min(1,t));
export const add=(a,b)=>a.map((v,i)=>v+b[i]),sub=(a,b)=>a.map((v,i)=>v-b[i]),mul=(a,t)=>a.map(v=>v*t),dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0),cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]],unit=a=>mul(a,1/Math.hypot(...a));
export const identity=()=>[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1];
export function product(a,b){return Array.from({length:16},(_,k)=>{let s=0;for(let j=0;j<4;j++)s+=a[Math.floor(k/4)*4+j]*b[j*4+k%4];return s;});}
export const point=(m,p)=>[0,1,2].map(i=>m[i*4]*p[0]+m[i*4+1]*p[1]+m[i*4+2]*p[2]+m[i*4+3]);
export function rotateLine(a,b,theta){const [x,y,z]=unit(sub(b,a)),c=Math.cos(theta),s=Math.sin(theta),q=1-c;const m=[c+x*x*q,x*y*q-z*s,x*z*q+y*s,0,y*x*q+z*s,c+y*y*q,y*z*q-x*s,0,z*x*q-y*s,z*y*q+x*s,c+z*z*q,0,0,0,0,1];const r=point(m,a);for(let i=0;i<3;i++)m[i*4+3]=a[i]-r[i];return m;}
// Eight cyclic sign triangles share twelve hinges. Each edge is sqrt(2)*scale.
export function jitterFaces(t,scale=1.5,center=[0,0,0]){const b=1-clamp(t),a=1/Math.sqrt(1+b*b-b),faces=[];for(const x of [-1,1])for(const y of [-1,1])for(const z of [-1,1]){let f=[[x*a,y*a*b,0],[0,y*a,z*a*b],[x*a*b,0,z*a]];if(dot(cross(sub(f[1],f[0]),sub(f[2],f[0])),f[0])<0)f.reverse();faces.push(f.map(p=>add(mul(p,scale),center)));}return faces;}
export const icosaProgress=1-(Math.sqrt(5)-1)/2;
export function mapMatrices(data,t){t=clamp(t);const out=[],visit=i=>{if(out[i])return out[i];const f=data.faces[i];out[i]=f.parent<0?data.rootMatrix:product(visit(f.parent),rotateLine(f.hinge[0],f.hinge[1],f.angle*t));return out[i];};data.faces.forEach((_,i)=>visit(i));return out;}
export function mapPose(data,t){const matrices=mapMatrices(data,t),raw=data.faces.map((f,i)=>f.vertices.map(p=>point(matrices[i],p))),all=raw.flat(),center=[0,1].map(k=>all.reduce((s,p)=>s+p[k],0)/all.length),floor=Math.min(...all.map(p=>p[2]));const offset=[data.center[0]-center[0]*data.scale,data.center[1]-center[1]*data.scale,.6+.5*clamp(t)-floor*data.scale];return {matrices,offset,faces:raw.map(f=>f.map(p=>add(mul(p,data.scale),offset))),transform:(p,i)=>add(mul(point(matrices[i],p),data.scale),offset)};}
