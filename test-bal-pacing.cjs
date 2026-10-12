const assert=require('assert'),R=require('./room-rules'),B=require('./bal-rules');
const ids=['bal_coach','bal_shift','bal_plan','bal_position','bal_video','bal_recovery','bal_sponsor','bal_shop','bal_fans'];
const map=[0,1,2,2,3,3,4,4,5,5,5];
for(let n=1;n<=10;n++){
 const raw=B.enter(R.defaults(),1);B.openDepartment(raw,2);raw.balBlockVersion=2;raw.budget=4321;raw.ap=7654;raw.balReadyDay={bal_coach:12};
 for(const id of ids){const r=B.catalog.find(r=>r.id===id);raw.floors[r.floor].push(...Array(n).fill(id));}
 const saved=R.normalize(raw);
 for(const id of ids)assert.equal(R.count(saved,id),map[n]);
 assert.equal(saved.budget,4321);assert.equal(saved.ap,7654);assert.deepEqual(saved.balReadyDay,{});assert.deepEqual(R.normalize(saved),saved);
 const previousCoach=[.6,.9,1.2,1.6,2,2.5,3,3.333,3.667,4][n-1];assert(B.value(saved,'bal_coach')>=previousCoach);
}
for(let n=1;n<=5;n++){
 const raw=B.enter(R.defaults(),1);delete raw.balBlockVersion;raw.floors[1]=Array(n).fill('bal_coach');assert.equal(R.count(R.normalize(raw),'bal_coach'),n);
}
for(const r of B.catalog){assert.equal(r.values.length,10);const s=B.enter(R.defaults(),1);let previous=0;for(let n=0;n<10;n++){const cost=B.price(s,r);if(n>0)assert(cost/previous<=2.5,'price cliff: '+r.id);previous=cost;s.floors[r.floor].push(r.id);}}
const s=B.enter(R.defaults(),1);B.openDepartment(s,2);B.openDepartment(s,4);R.purchase(s,1,'assistant');R.purchase(s,0,'warmup');
let carry=0,last=0,maxGap=0;const buckets=[0,0,0];
// Economy-only clock: match play time/rewards excluded; no manual input or offline gains.
for(let t=1;t<=1800;t++){
 carry+=R.effects(s).autoRate;
 while(carry>=1){carry--;const g=R.income(s,s.dayProgress===499,()=>1,'auto');R.applyGain(s,g);s.budget+=g.cash;}
 const choices=R.catalog.filter(r=>(r.bal||['assistant','warmup'].includes(r.id))&&R.count(s,r.id)<r.values.length&&!R.requirement(s,r.id)).sort((a,b)=>R.cost(s,a.floor,a.id)-R.cost(s,b.floor,b.id));
 const r=choices[0];if(r&&(R.count(s,r.id)?R.upgrade(s,r.id):R.purchase(s,r.floor,r.id))){buckets[Math.floor((t-1)/600)]++;maxGap=Math.max(maxGap,t-last);last=t;}
}
assert(buckets.every(n=>n>=12),'each ten-minute window must offer investments');assert(maxGap<=90,'available cheapest route must not stall');assert(B.catalog.some(r=>R.count(s,r.id)<10),'later goals must remain');
console.log('PASS: legacy power-preserving level migration, reload idempotence, budgets/timers preserved; 30-minute economy', {buckets,maxGap});
