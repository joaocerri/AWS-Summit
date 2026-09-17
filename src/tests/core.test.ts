import {describe,expect,it} from 'vitest';
import fc from 'fast-check';
import {screens,sections,resolveContent} from '../data/content';
import {navigationReducer} from '../hooks/navigationReducer';
import {nearestPalette,palette,contrastRatio} from '../styles/palette';
describe('AWS Summit presentation invariants',()=>{
 it('has the canonical 34-screen registry',()=>{expect(screens).toHaveLength(34);expect(new Set(screens.map(s=>s.id)).size).toBe(34);expect(screens[0].title).toBe('AWS Summit São Paulo 2026');expect(screens[33].title).toBe('Obrigado')});
 it('keeps navigation within bounds',()=>fc.assert(fc.property(fc.integer(),fc.integer({min:1,max:200}),(i,total)=>{const s=navigationReducer({currentIndex:0,total},{type:'GOTO',index:i});return s.currentIndex>=0&&s.currentIndex<total}),{numRuns:100}));
 it('resolves every screen',()=>screens.forEach(s=>expect(resolveContent(s.id).status).toBe('ok')));
 it('maps sections to valid first screens',()=>sections.forEach(s=>expect(screens[s.firstScreenIndex]).toBeDefined()));
 it('contains exact C6 metrics',()=>expect(screens.find(s=>s.id==='c6')?.metrics?.map(m=>[m.from,m.to])).toEqual([[undefined,'até 88%'],['3 meses','8 dias'],['2 meses','8 dias'],['10 sprints','1 sprint'],['8 sprints','1 sprint']]));
 it('maps arbitrary colors into palette',()=>fc.assert(fc.property(fc.integer({min:0,max:0xffffff}),value=>palette.includes(nearestPalette(`#${value.toString(16).padStart(6,'0')}`))),{numRuns:100}));
 it('meets core text contrast',()=>{expect(contrastRatio('#f5f7fa','#07111f')).toBeGreaterThan(4.5);expect(contrastRatio('#aeb9c8','#07111f')).toBeGreaterThan(4.5)});
});
