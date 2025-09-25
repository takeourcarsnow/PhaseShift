export const clamp = (v:number,a:number,b:number)=>Math.max(a,Math.min(b,v));
export const lerp = (a:number,b:number,t:number)=>a+(b-a)*t;
export const TAU = Math.PI*2;
export const DEG = Math.PI/180;
export const byId = <T extends HTMLElement = HTMLElement>(id:string):T|null=>document.getElementById(id) as T|null;
export const hsl = (h:number,s:number,l:number)=>`hsl(${Math.round(h)}, ${Math.round(s)}%, ${Math.round(l)}%)`;
export const frac = (x:number)=>x - Math.floor(x);
