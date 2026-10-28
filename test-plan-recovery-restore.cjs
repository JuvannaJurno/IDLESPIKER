const assert=require('assert/strict'),R=require('./room-rules'),B=require('./bal-rules');
assert(R.catalog.some(r=>r.id==='bal_recovery'));
assert.equal(B.catalog.find(r=>r.id==='bal_plan').bonus[1],'bal_hands');
let checks=0;
for(const division of [2,3,4])for(let n=0;n<=10;n++)for(let hands=0;hands<=5;hands++)for(let evening=0;evening<=5;evening++){
 const raw=B.enter(R.defaults(),1);raw.division=division;delete raw.recoveryRestoreVersion;raw.recoveryMergeVersion=1;raw.legacyBlockBenefits={manualAP:[0,20,40,60,80,100][hands],dayAP:[0,1000,2500,5500,11000,20000][evening]};raw.floors[1]=Array(n).fill('bal_plan');raw.ap=123456;raw.budget=98765;
 const s=R.normalize(raw),again=R.normalize(JSON.parse(JSON.stringify(s)));
 assert.equal(R.count(s,'bal_plan'),Math.max(Math.min(n,5),hands?5+hands:0));
 assert.equal(R.count(s,'bal_recovery'),Math.max(0,n-5,evening?5+evening:0));
 assert.equal(B.value(s,'bal_hands'),[0,20,40,60,80,100][hands]);assert.equal(B.value(s,'bal_evening'),[0,1000,2500,5500,11000,20000][evening]);
 assert.equal(s.ap,raw.ap);assert.equal(s.budget,raw.budget);assert.deepEqual(again,s);checks++;
}
const original=B.enter(R.defaults(),1);original.floors[0]=Array(4).fill('bal_recovery');original.floors[1]=Array(3).fill('bal_plan');const saved=R.normalize(original);assert.equal(R.count(saved,'bal_recovery'),4);assert.equal(R.count(saved,'bal_plan'),3);
console.log('PASS '+checks+' merged portfolios restore separate cards and paid bonuses exactly once; unmerged cards and AP/budget survive.');
