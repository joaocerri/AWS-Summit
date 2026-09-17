import { useCallback,useEffect,useReducer,useRef,useState } from 'react';
import { screens,sections,ScreenContent } from './data/content';
import { navigationReducer } from './hooks/navigationReducer';
import { Screen } from './components/Screen';
import { Diagram } from './components/Diagram';
import { DetailPanel } from './components/DetailPanel';

function ScreenBody({screen,onDetail}:{screen:ScreenContent;onDetail:(s:ScreenContent,e:HTMLButtonElement)=>void}){
 return <>{screen.points&&<div className="chips">{screen.points.map(p=><span className="chip" key={p}>{p}</span>)}</div>}{screen.metrics&&<div className="metrics">{screen.metrics.map(m=><div className="metric" key={m.label}><strong>{m.from?<><small>{m.from} → </small>{m.to}</>:m.to}</strong><span>{m.label}</span></div>)}</div>}{screen.diagram&&<Diagram nodes={screen.diagram} label={`Diagrama: ${screen.title}`}/>} {screen.detail&&<button className="detail-trigger" onClick={e=>onDetail(screen,e.currentTarget)}>Ver detalhes</button>}</>
}

export default function App(){
 const [state,dispatch]=useReducer(navigationReducer,{currentIndex:0,total:screens.length});
 const [detail,setDetail]=useState<ScreenContent|null>(null);const [menu,setMenu]=useState(false);const deck=useRef<HTMLElement>(null);const trigger=useRef<HTMLButtonElement|null>(null);const wheel=useRef({delta:0,locked:false});
 const goTo=useCallback((index:number)=>{const target=Math.max(0,Math.min(screens.length-1,index));dispatch({type:'GOTO',index:target});document.getElementById(screens[target].id)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})},[]);
 const closeDetail=useCallback(()=>{setDetail(null);setTimeout(()=>trigger.current?.focus(),0)},[]);
 const openDetail=useCallback((s:ScreenContent,e:HTMLButtonElement)=>{trigger.current=e;setDetail(s)},[]);
 useEffect(()=>{const key=(e:KeyboardEvent)=>{if(detail)return;const map:Record<string,number>={ArrowRight:state.currentIndex+1,ArrowLeft:state.currentIndex-1,Home:0,End:screens.length-1};if(e.key in map){e.preventDefault();goTo(map[e.key])}};addEventListener('keydown',key);return()=>removeEventListener('keydown',key)},[detail,goTo,state.currentIndex]);
 useEffect(()=>{const root=deck.current;if(!root)return;const obs=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting&&e.intersectionRatio>=.55)dispatch({type:'GOTO',index:Number((e.target as HTMLElement).dataset.index)})}),{root,threshold:.55});root.querySelectorAll('.screen').forEach(s=>obs.observe(s));return()=>obs.disconnect()},[]);
 const onWheel=(e:React.WheelEvent)=>{if(detail||wheel.current.locked)return;wheel.current.delta+=e.deltaY;if(Math.abs(wheel.current.delta)>=50){const dir=wheel.current.delta>0?1:-1;wheel.current={delta:0,locked:true};goTo(state.currentIndex+dir);setTimeout(()=>{wheel.current.locked=false},500)}};
 return <div className="app"><div className="brand"><b>AWS</b> SUMMIT · 2026</div><div className="progress" aria-live="polite">{state.currentIndex+1} / {screens.length}</div><main className="deck" ref={deck} onWheel={onWheel}>{screens.map((s,i)=><Screen key={s.id} id={s.id} index={i} title={s.title} eyebrow={s.eyebrow} summary={s.summary}>{i===0?<div className="hero__meta"><span>{s.summary}</span><span>{s.points?.[0]}</span></div>:<ScreenBody screen={s} onDetail={openDetail}/>}</Screen>)}</main><nav className="nav" aria-label="Navegação da apresentação"><button onClick={()=>setMenu(v=>!v)} aria-label="Abrir menu de seções">☰</button><button onClick={()=>goTo(state.currentIndex-1)} disabled={state.currentIndex===0} aria-label="Anterior">←</button><button onClick={()=>goTo(state.currentIndex+1)} disabled={state.currentIndex===screens.length-1} aria-label="Próximo">→</button></nav>{menu&&<div className="menu" role="menu">{sections.map(s=><button role="menuitem" key={s.id} onClick={()=>{goTo(s.firstScreenIndex);setMenu(false)}}>{s.label}</button>)}</div>}{detail&&<DetailPanel title={detail.title} content={detail.detail||''} onClose={closeDetail}/>}</div>
}
