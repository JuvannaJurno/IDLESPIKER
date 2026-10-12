const assert=require('assert'),R=require('./room-rules'),B=require('./bal-rules'),S=require('./scout-rules'),T=require('./team-rules');
let seed=17;const random=()=>((seed=(seed*1664525+1013904223)>>>0)/4294967296),levels=new Set();
for(let run=0;run<40;run++){
 const s=B.enter(R.defaults(),1);s.openDepartments=[4];s.instructions=3000;s.budget=1e7;s.floors[4]=Array(5).fill('bal_talent');assert(S.report(s,T.generate,random));
 for(const c of s.scouting.catalog){const p=c.player;levels.add(p.cardLevel);assert(p.cardLevel>=2&&p.cardLevel<=8);const expected={...p,...p.baseStats};for(let n=1;n<p.cardLevel;n++)for(const [k,v]of Object.entries(T.cardGains(expected,n,100)))expected[k]+=v;for(const k of T.trainable){assert.equal(p[k],expected[k]);assert.equal(p.training[k]||0,p[k]-p.baseStats[k]);assert(p[k]<=100);}assert(T.cardQuote(p).cost>0);}
 const saved=R.normalize(JSON.parse(JSON.stringify(s)));assert.deepEqual(saved.scouting.catalog,s.scouting.catalog);
 const c=s.scouting.catalog[0],roster=T.generate();assert(S.hire(s,c.id,roster,T.valid));assert.equal(s.scouting.recruits[0].cardLevel,c.player.cardLevel);assert.deepEqual(s.scouting.recruits[0].training,c.player.training);
}
assert(levels.size>=5);console.log('PASS: varied levels, shared upgrade gains, stat caps, catalog persistence and transfer level preservation', [...levels].sort());
