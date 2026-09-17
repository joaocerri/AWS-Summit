export interface NavigationState{currentIndex:number;total:number}
export type NavigationAction={type:'NEXT'|'PREV'|'FIRST'|'LAST'}|{type:'GOTO';index:number};
const clamp=(n:number,total:number)=>Math.max(0,Math.min(total-1,n));
export function navigationReducer(state:NavigationState,action:NavigationAction):NavigationState{switch(action.type){case'NEXT':return{...state,currentIndex:clamp(state.currentIndex+1,state.total)};case'PREV':return{...state,currentIndex:clamp(state.currentIndex-1,state.total)};case'FIRST':return{...state,currentIndex:0};case'LAST':return{...state,currentIndex:state.total-1};case'GOTO':return{...state,currentIndex:clamp(action.index,state.total)}}}
