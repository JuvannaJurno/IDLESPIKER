const assert=require('assert/strict'),R=require('./room-rules'),B=require('./bal-rules'),C=require('./camp-rules'),T=require('./team-rules'),S=require('./scout-rules'),M=require('./match-rules');
let state=B.enter(R.defaults(),1);global.RoomSystem={developmentState:()=>state,trainingDiscount:()=>0};
const p=T.generate()[0];p.cardLevel=48;state.camp.boosts[p.id]=60;const original=structuredClone(p);
assert.equal(C.cap(state,p),160);assert.equal(T.cardLimit(p),48);state.division=3;assert.equal(C.cap(state,p),220);assert.equal(T.cardLimit(p),68);assert.deepEqual(p,original,'promotion preserves player data');
for(let n=0;n<20;n++)assert(T.upgradeCard(p,()=>true));assert.equal(p.cardLevel,68);assert(T.cardQuote(p).blocked);assert(C.cap(state,{...p,transferCamps:0,id:'new'})===160);
for(const camps of [0,1,2,3,4]){const candidate={...p,id:'scout-1-0',transferCamps:camps};assert.equal(C.cap(state,candidate),Math.min(220,160+camps*30));}
state.instructions=5000;state.openDepartments=[4];const roster=T.generate();for(const own of roster){for(const k of T.trainable)own[k]=110;own.cardLevel=48;}let better=0;
for(let n=0;n<30;n++){state.scouting.startedDay=1;state.scouting.startedInstructions=0;assert(S.report(state,T.generate,M.seeded('new-growth-'+n),roster));for(const c of state.scouting.catalog){assert(c.player.cardLevel<=T.cardLimit(c.player,state));if(T.overall(c.player)>110)better++;}const normalized=S.normalize(state.scouting);assert.deepEqual(normalized.catalog,state.scouting.catalog,'new high-stat candidates survive normalization');}
assert(better>0,'catalog can improve a roster above the former 92 OVR ceiling');console.log('PASS: BAL 48 -> Division 2 68, 20 actual upgrades, unchanged promotion stats, inherited camps, above-110 OVR catalogs and save normalization');

const Skills=require('./player-skills');const talent={...p,legendaryTalent:true,transferCamps:3};assert(Skills.view(talent,{division:2,state}).filter(x=>x.rarity==='Legendary').every(x=>!x.unlocked));assert(Skills.view(talent,{division:3,state}).some(x=>x.rarity==='Legendary'&&x.unlocked));
