const assert=require('assert/strict'),R=require('./room-rules'),B=require('./bal-rules');
assert(!R.catalog.some(r=>r.id==='bal_recovery'),'retired card absent from purchasing catalog');
const plan=B.catalog.find(r=>r.id==='bal_plan');
for(let n=0;n<=10;n++){const s=B.enter(R.defaults(),1);s.floors[1]=Array(n).fill('bal_plan');assert.equal(R.maxLevel(s,plan),10);assert.equal(B.value(s,'bal_recovery'),[0,.08,.16,.25,.35,.5][Math.max(0,n-5)]);assert.equal(B.value(s,'bal_hands'),0);if(n>5)assert(B.describeBonus(s,plan,n).includes('çevrimdışı AP'));}
let checks=0;
for(const division of [2,3,4])for(let p=0;p<=10;p++)for(let r=0;r<=10;r++){
 const raw=B.enter(R.defaults(),1);raw.division=division;delete raw.recoveryMergeVersion;delete raw.legacyBlockBenefits;raw.floors[0]=Array(r).fill('bal_recovery');raw.floors[1]=Array(p).fill('bal_plan');raw.ap=123456;raw.budget=98765;
 const s=R.normalize(raw),again=R.normalize(JSON.parse(JSON.stringify(s)));
 assert(!s.floors.flat().includes('bal_recovery'));assert.equal(R.count(s,'bal_plan'),Math.max(p,r?5+Math.min(r,5):0));
 assert.equal(B.value(s,'bal_hands'),[0,20,40,60,80,100][Math.max(0,p-5)]);assert.equal(B.value(s,'bal_evening'),[0,1000,2500,5500,11000,20000][Math.max(0,r-5)]);
 assert.equal(s.ap,raw.ap);assert.equal(s.budget,raw.budget);assert.deepEqual(again,s,'migration must run only once');checks++;
}
console.log('PASS '+checks+' legacy portfolios retain paid benefits/AP/budget exactly once; plan has five primary and five recovery levels; removed card cannot be bought.');
