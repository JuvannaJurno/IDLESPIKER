const assert=require('assert/strict'),fs=require('fs'),R=require('./room-rules'),B=require('./bal-rules'),S=require('./scout-rules'),T=require('./team-rules'),C=require('./camp-rules'),M=require('./match-rules');
const rng=M.seeded('transfer-consistency-pool'),descriptor=Object.getOwnPropertyDescriptor(globalThis,'crypto');
Object.defineProperty(globalThis,'crypto',{configurable:true,value:{getRandomValues(a){for(let i=0;i<a.length;i++)a[i]=Math.floor(rng()*4294967296);return a;}}});
let pool;try{pool=T.generate();}finally{if(descriptor)Object.defineProperty(globalThis,'crypto',descriptor);else delete globalThis.crypto;}
const summary=[];let candidates=0,hires=0;
for(const [division,power]of [[2,25],[2,35],[2,55],[2,75],[3,75],[3,110],[3,145],[4,170],[4,210],[6,230]]){
 const rows=[];for(let seed=0;seed<80;seed++){
  const state=B.enter(R.defaults(),1);state.division=division;state.openDepartments=[2,4];state.budget=1e12;state.instructions=1000000;state.scouting.firstTransferUsed=true;
  if(seed%2){const def=B.catalog.find(r=>r.id==='bal_contacts');state.floors[def.floor].push(...Array(seed%4===1?5:10).fill('bal_contacts'));}const roster=structuredClone(pool);for(const p of roster)for(const k of T.trainable)p[k]=power;
  assert(S.report(state,()=>structuredClone(pool),M.seeded('market-'+division+'-'+power+'-'+seed),roster));
  for(const {player:p}of state.scouting.catalog){
   const limit=T.cardLimit(p,state);assert.equal(p.trainingLimitBase,10);assert(p.cardLevel<=limit);assert(p.cardLevel>limit-10,'camp history and level must represent the same training band');
   assert(T.trainable.every(k=>p[k]<=C.cap(state,p)&&p.baseStats[k]>=0&&p.baseStats[k]<=40));
   const rebuilt={...p,...p.baseStats};for(let level=1;level<p.cardLevel;level++)for(const[k,n]of Object.entries(T.cardGains(rebuilt,level,C.cap(state,p))))rebuilt[k]+=n;
   for(const k of T.trainable)assert.equal(p[k],rebuilt[k],'stats must be earned from the displayed level');
   const stars=C.cardProgress(state,p);assert.equal(stars.count,p.transferCamps);assert.equal(stars.cardTier,Math.min(3,Math.floor(p.transferCamps/6)));
   rows.push({ovr:T.overall(p),level:p.cardLevel,camps:p.transferCamps,cap:limit,role:p.role});candidates++;
  }
  const normalized=S.normalize(state.scouting);assert.deepEqual(normalized.catalog,state.scouting.catalog,'reload must not reroll levels, stars or price');assert.deepEqual(S.normalize(normalized),normalized);
  if(seed<5){const offer=state.scouting.catalog[0],before=structuredClone(offer.player);assert(S.hire(state,offer.id,roster,T.valid));const hired=state.scouting.recruits.at(-1);assert.equal(hired.cardLevel,before.cardLevel);assert.equal(hired.transferCamps,before.transferCamps);assert.equal(T.overall(hired),T.overall(before));hires++;}
 }
 summary.push({division,power,candidates:rows.length,minLevel:Math.min(...rows.map(r=>r.level)),maxLevel:Math.max(...rows.map(r=>r.level)),minCamps:Math.min(...rows.map(r=>r.camps)),maxCamps:Math.max(...rows.map(r=>r.camps)),examples:rows.slice(0,4)});
}
const state=B.enter(R.defaults(),1),owned={...structuredClone(pool.find(p=>p.role==='libero')),id:'player-12',cardLevel:58,trainingLimitBase:48,transferCamps:1,transferStartLevel:48};
const originalStats=Object.fromEntries(T.trainable.map(k=>[k,owned[k]]));assert(T.repairTransferProgression(owned,state));assert.equal(owned.cardLevel,58);assert.equal(owned.transferCamps,5);assert.equal(T.cardLimit(owned,state),60);assert.deepEqual(Object.fromEntries(T.trainable.map(k=>[k,owned[k]])),originalStats);assert.equal(T.repairTransferProgression(owned,state),false);
// A saved, unbought legacy offer is repaired once, not rerolled on each login.
const market=B.enter(R.defaults(),1);market.openDepartments=[2,4];market.budget=1e9;market.instructions=100000;market.scouting.firstTransferUsed=true;
assert(S.report(market,()=>structuredClone(pool),M.seeded('legacy-market'),pool));
const legacy=structuredClone(market.scouting),offer=legacy.catalog[0],beforeOffer=structuredClone(offer);delete offer.player.transferProgressionVersion;offer.player.cardLevel=4;offer.player.transferCamps=0;for(const k of T.trainable)offer.player.baseStats[k]=offer.player[k];legacy.heldId=offer.id;
const repaired=S.normalize(legacy),afterOffer=repaired.catalog[0];assert.equal(afterOffer.price,beforeOffer.price);assert.equal(T.overall(afterOffer.player),T.overall(beforeOffer.player));assert.equal(afterOffer.player.name,beforeOffer.player.name);assert.equal(afterOffer.player.art,beforeOffer.player.art);assert.equal(repaired.heldId,offer.id);assert.equal(afterOffer.player.transferProgressionVersion,2);assert(afterOffer.player.cardLevel<=T.cardLimit(afterOffer.player,market));assert.deepEqual(S.normalize(repaired),repaired);
fs.writeFileSync('audits/transfer-progression-consistency.json',JSON.stringify({candidates,hires,summary},null,2));
console.log('PASS '+candidates+' offers / '+hires+' hires across ten stage/strength combinations: natural base stats, exact trained gains, coherent level/star/cap, reload stability; old level-58 half-star player repaired without stat loss.');
