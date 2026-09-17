export const palette=['#07111f','#0c1828','#111f31','#17283b','#f5f7fa','#aeb9c8','#ff9900','#ffb84d'] as const;
const rgb=(h:string)=>[1,3,5].map(i=>parseInt(h.slice(i,i+2),16));
export function nearestPalette(color:string){if(!/^#[0-9a-f]{6}$/i.test(color))return palette[0];const c=rgb(color);return palette.reduce((best,p)=>{const a=rgb(best),b=rgb(p);const d=(x:number[])=>x.reduce((s,v,i)=>s+(v-c[i])**2,0);return d(b)<d(a)?p:best},palette[0])}
export function contrastRatio(fg:string,bg:string){const lum=(h:string)=>rgb(h).map(v=>v/255).map(v=>v<=.03928?v/12.92:((v+.055)/1.055)**2.4).reduce((s,v,i)=>s+v*[.2126,.7152,.0722][i],0);const [a,b]=[lum(fg),lum(bg)].sort((x,y)=>y-x);return(a+.05)/(b+.05)}
