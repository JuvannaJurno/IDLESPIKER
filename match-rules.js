(function(root){
'use strict';
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
function seeded(seed){let n=2166136261;for(const c of String(seed))n=Math.imul(n^c.charCodeAt(0),16777619);return ()=>{n+=0x6D2B79F5;let t=n;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296}}
// Skill bonuses are already included in roster stats. Events are the future animation hook.
function resolve({kind,touch,actor,receiver,blockers=[],quality=.65,stage='prologue'},rng){
 const stat=(p,k)=>Math.max(1,Number(p?.[k])||15),a=actor,d=receiver;
 const result=(event,winner=null,q=.65)=>({event,winner,quality:clamp(q,.15,1),animation:event});
 const execution=stage==='bal'?.7:1;const noise=()=> (rng()-.5)*(stage==='bal'?.25:.35);
 if(kind==='serve'){
  if(rng()<execution*clamp(.11-stat(a,'serve')*.0015,.025,.1))return result('serve-error','defender');
  if(rng()<clamp(.08+(stat(a,'serve')-stat(d,'receive'))*.006,.02,.35))return result('ace','actor');
  return result('receive',null,.65+(stat(d,'receive')-stat(a,'serve'))*.008+noise());
 }
 if(kind==='attack'){
  const power=stat(a,'spike')*(.65+.55*quality);
  if(rng()<execution*clamp(.11-stat(a,'spike')*.001+(1-quality)*.09,.025,.19))return result('attack-error','defender');
  const b=blockers.map(p=>stat(p,'block')).sort((a,b)=>b-a),block=(b[0]||0)+(b[1]||0)*.3;
  if(b.length&&rng()<clamp(.08+(block-power)*.005,.015,.4))return result('block','defender');
  if(b.length&&rng()<.14)return result('block-touch',null,.72+noise());
  if(rng()<clamp(.35+(power-stat(d,'receive'))*.009,.08,.8))return result('kill','actor');
  return result('dig',null,.6+(stat(d,'receive')-power)*.007+noise());
 }
 if(touch===3){
  if(rng()<execution*clamp(.065-stat(a,'set')*.001+(1-quality)*.045,.01,.1))return result('set-error','defender');
  return result('set',null,.25+.5*quality+stat(a,'set')*.006+noise());
 }
 if(touch===2&&rng()<execution*clamp(.085-stat(a,'receive')*.001,.012,.075))return result('receive-error','defender');
 return result('pass',null,quality);
}
function simulateSet(rosters,seed,stage='prologue'){const rng=seeded(seed),score=[0,0];let server=0;while(Math.max(...score)<5||Math.abs(score[0]-score[1])<2){let side=server,actor=rosters[side][Math.floor(rng()*6)],kind='serve',quality=.65,winner=null;while(winner===null){const other=1-side,receiver=rosters[other][[0,4,5][Math.floor(rng()*3)]],out=resolve({stage,kind,touch:1,actor,receiver,quality,blockers:kind==='attack'?rosters[other].slice(1,3):[]},rng);if(out.winner){winner=out.winner==='actor'?side:other;break}side=other;const setter=rosters[side].find(p=>p.role==='setter')||rosters[side][2],hitter=rosters[side][[1,3,5][Math.floor(rng()*3)]],set=resolve({stage,kind:'pass',touch:3,actor:setter,receiver:hitter,quality:out.quality},rng);if(set.winner){winner=1-side;break}actor=hitter;quality=set.quality;kind='attack'}score[winner]++;server=winner}return score}
// Off-screen national fixtures keep all six rotation slots and the libero.
function simulateRotationSet(rosters,seed,stage='bal',onContact){
 const rng=seeded(seed),score=[0,0],zones=rosters.map(()=>[1,2,3,4,5,6]);let server=0;
 for(let team=0;team<2;team++){const hero=rosters[team].findIndex(p=>p.specialCharacter==='d2-derin-ates'||p.specialCharacter==='d2-idil-taner');if(hero>=0){const serve=rosters[team][hero].specialCharacter==='d2-derin-ates',shift=(serve?1:3)-zones[team][hero];zones[team]=zones[team].map(z=>(z-1+shift+6)%6+1);if(serve)server=team;}}
 const choose=pool=>pool[Math.floor(rng()*pool.length)];
 function lineup(team){const libero=rosters[team].find(p=>p.role==='libero');let replaced=false;return rosters[team].slice(0,6).map((p,i)=>{const zone=zones[team][i],use=libero&&!replaced&&p.role==='middle'&&[1,5,6].includes(zone)&&!(team===server&&zone===1);if(use)replaced=true;return {p:use?libero:p,zone};});}
 function contact(team,kind,touch,actor,receiver,quality,blockers=[]){onContact?.({team,kind,touch,actor,receiver,blockers});return resolve({stage,kind,touch,actor,receiver,quality,blockers},rng);}
 while(Math.max(...score)<5||Math.abs(score[0]-score[1])<2){let side=server,winner=null,kind='serve',quality=.65,own=lineup(side),actor=own.find(q=>q.zone===1).p;
 while(winner===null){const other=1-side,opponents=lineup(other),back=opponents.filter(q=>[1,5,6].includes(q.zone)),receiver=choose(back.length?back:opponents).p,front=opponents.filter(q=>[2,3,4].includes(q.zone)&&q.p.role!=='libero'),blockers=kind==='attack'?front.sort((a,b)=>(b.p.role==='middle')-(a.p.role==='middle')).slice(0,2).map(q=>q.p):[],out=contact(side,kind,1,actor,receiver,quality,blockers);
 if(out.winner){winner=out.winner==='actor'?side:other;break;}
 side=other;own=lineup(side);const setter=own.find(q=>q.p.role==='setter'&&q.p!==receiver)?.p||own.find(q=>q.p!==receiver).p,pass=contact(side,'pass',2,receiver,setter,out.quality);
 if(pass.winner){winner=1-side;break;}
 const frontHitters=own.filter(q=>[2,3,4].includes(q.zone)&&!['setter','libero'].includes(q.p.role)&&q.p!==setter),hitter=choose(frontHitters.length?frontHitters:own.filter(q=>q.p!==setter&&q.p.role!=='libero')).p,set=contact(side,'pass',3,setter,hitter,pass.quality);
 if(set.winner){winner=1-side;break;}actor=hitter;quality=set.quality;kind='attack';
 }
 score[winner]++;if(winner!==server)zones[winner]=zones[winner].map(z=>z===1?6:z-1);server=winner;
 }
 return score;
}
const api={seeded,resolve,simulateSet,simulateRotationSet};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MatchRules=api;
})(globalThis);
