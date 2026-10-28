const assert=require('assert/strict'),R=require('./room-rules'),B=require('./bal-rules');
for(let level=1;level<=5;level++){
 let s=R.defaults();s.floors[1]=Array(level).fill('fast_internet');const batches=[];
 for(let n=1;n<=100;n++){
  const lanes=R.nextInstructionLanes(s);assert.equal(lanes[0],0);batches.push(lanes.includes(1));
  if(n%5===0)assert.equal(batches.slice(-5).filter(Boolean).length,level,'exact capacity each five instructions');
  if(n===37)s=R.normalize(JSON.parse(JSON.stringify(s)));
 }
 assert.equal(batches.filter(Boolean).length,20*level,'reload preserves fractional production');
}
let s=R.defaults();s.floors[1]=['fast_internet'];for(let n=0;n<4;n++)assert.deepEqual(R.nextInstructionLanes(s),[0]);assert.deepEqual(R.nextInstructionLanes(s),[0,1]);
s=R.normalize({...s,laneCarry:[0,NaN,-3,Infinity,9]});assert(s.laneCarry.every(n=>Number.isFinite(n)&&n>=0&&n<1));
s=B.enter(R.defaults(),1);s.floors[1]=[...Array(2).fill('fast_internet'),...Array(8).fill('bal_coach')];const total=[0,0,0];for(let n=0;n<25;n++)for(const lane of R.nextInstructionLanes(s))total[lane]++;assert.deepEqual(total,[25,10,15]);
assert(!/ihtimal|şans/.test(R.catalog.find(r=>r.id==='fast_internet').describe(.2)));
assert.equal(R.catalog.find(r=>r.id==='offline_time').division,2);
assert(R.requirement(R.defaults(),'bal_shift'));assert.equal(R.requirement(B.enter(R.defaults(),1),'bal_shift'),'');assert.equal(B.catalog.find(r=>r.id==='bal_shift').name,'Vardiya Planı');
console.log('PASS exact 1/5–5/5 production, regular fifth-instruction delivery, saved partial capacity, independent second/third lanes, no chance copy and stage-two Vardiya Planı.');
