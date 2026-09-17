import { memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
export const Diagram=memo(({nodes,label}:{nodes:string[];label:string})=>{const reduced=useReducedMotion();return <div className="diagram" role="img" aria-label={label}>{nodes.map((node,i)=><motion.div className="diagram__node" key={node} initial={reduced?false:{opacity:0,y:18}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.2}} transition={{duration:reduced?0:.35,delay:reduced?0:i*.06}}><span>{node}</span></motion.div>)}</div>});
