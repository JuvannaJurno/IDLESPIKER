(function(root){
'use strict';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function seeded(seed){let n=2166136261;for(const c of String(seed))n=Math.imul(n^c.charCodeAt(0),16777619);return ()=>{n+=0x6D2B79F5;let t=n;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296}}
// Skill bonuses are already included in roster stats. Events are the future animation hook.
function resolve({kind,touch,actor,receiver,blockers=[],quality=.65},rng){
 const stat=(p,k)=>Math.max(1,Number(p?.[k])||15),a=actor,d=receiver;
 const result=(event,winner=null,q=.65)=>({event,winner,quality:clamp(q,.15,1),animation:event});
 const noise=()=> (rng()-.5)*.35;
 if(kind==='serve'){
  if(rng()<clamp(.11-stat(a,'serve')*.0015,.025,.1))return result('serve-error','defender');
  if(rng()<clamp(.08+(stat(a,'serve')-stat(d,'receive'))*.006,.02,.35))return result('ace','actor');
  return result('receive',null,.65+(stat(d,'receive')-stat(a,'serve'))*.008+noise());
 }
 if(kind==='attack'){
  const power=stat(a,'spike')*(.65+.55*quality);
  if(rng()<clamp(.11-stat(a,'spike')*.001+(1-quality)*.09,.025,.19))return result('attack-error','defender');
  const b=blockers.map(p=>stat(p,'block')).sort((a,b)=>b-a),block=(b[0]||0)+(b[1]||0)*.3;
  if(b.length&&rng()<clamp(.08+(block-power)*.005,.015,.4))return result('block','defender');
  if(b.length&&rng()<.14)return result('block-touch',null,.72+noise());
  if(rng()<clamp(.35+(power-stat(d,'receive'))*.009,.08,.8))return result('kill','actor');
  return result('dig',null,.6+(stat(d,'receive')-power)*.007+noise());
 }
 if(touch===3){
  if(rng()<clamp(.065-stat(a,'set')*.001+(1-quality)*.045,.01,.1))return result('set-error','defender');
  return result('set',null,.25+.5*quality+stat(a,'set')*.006+noise());
 }
 return result('pass',null,quality);
}
function simulateSet(rosters,seed){const rng=seeded(seed),score=[0,0];let server=0;while(Math.max(...score)<25||Math.abs(score[0]-score[1])<2){let side=server,actor=rosters[side][Math.floor(rng()*6)],kind='serve',quality=.65,winner=null;while(winner===null){const other=1-side,receiver=rosters[other][[0,4,5][Math.floor(rng()*3)]],out=resolve({kind,touch:1,actor,receiver,quality,blockers:kind==='attack'?rosters[other].slice(1,3):[]},rng);if(out.winner){winner=out.winner==='actor'?side:other;break}side=other;const setter=rosters[side].find(p=>p.role==='setter')||rosters[side][2],hitter=rosters[side][[1,3,5][Math.floor(rng()*3)]],set=resolve({kind:'pass',touch:3,actor:setter,receiver:hitter,quality:out.quality},rng);if(set.winner){winner=1-side;break}actor=hitter;quality=set.quality;kind='attack'}score[winner]++;server=winner}return score}
const api={seeded,resolve,simulateSet};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MatchRules=api;
})(globalThis);
