const assert=require('assert/strict'),R=require('./room-rules'),B=require('./bal-rules'),C=require('./camp-rules'),T=require('./team-rules'),S=require('./player-skills');
let state=B.enter(R.defaults(),1);global.RoomSystem={developmentState:()=>state,trainingDiscount:k=>R.trainingDiscount(state,k)};
const p={...T.generate()[0],cardLevel:10,trainingLimitBase:10,transferCamps:1};
for(const k of T.trainable)p[k]=10;
const initial=T.cardQuote(p).cost;
// Promotions, AP saved, and card material cannot make this same training cheaper.
for(const division of [2,3,4,5,6,7,8])for(const ap of [0,1e5,1e12]){
 state.division=division;state.ap=ap;assert.equal(T.cardQuote(p).cost,initial);
 assert.equal(T.cardLimit(p),20);assert.equal(C.preparationLevel(state,p),18);
}
state.division=2;
for(const id of ['rhythm','slots','balls','bal_archive','bal_mentor']){
 const r=R.catalog.find(r=>r.id===id);if(r)state.floors[r.floor].push(...Array(r.values.length).fill(id));
}
assert(T.cardQuote(p).cost<initial,'training discounts must reduce the level curve too');
const discounted=T.cardQuote(p).cost,copy=structuredClone(p);
for(let level=10;level<18;level++){
 copy.cardLevel=level;const q=T.cardQuote(copy);assert(q.cost>0);assert(!q.blocked);
 const oldAP=q.cost-1;state.ap=oldAP;assert(!R.trainingPayment(state,q.cost,()=>1,true).ok);assert.equal(state.ap,oldAP);
 state.ap=q.cost;assert(R.trainingPayment(state,q.cost,()=>1,true).ok);assert.equal(state.ap,0);
}
state.ap=discounted;const before={ap:state.ap,level:p.cardLevel};assert(T.upgradeCard(p,cost=>R.trainingPayment(state,cost,()=>1,true).ok));assert.equal(p.cardLevel,before.level+1);assert.equal(state.ap,0);
// Initial onboarding remains cheap; no hidden reset or extra cooldown is introduced.
state=R.defaults();const starter={...p,cardLevel:1,transferCamps:0};assert.equal(T.cardQuote(starter).cost,140);assert.equal(T.cardLimit(starter),10);assert(!C.available(state));assert.deepEqual(S.stageTarget(1),[0,0]);
console.log('PASS fixed price across leagues/material/bank balance, effective building discounts, exact affordability boundary, real paid upgrade, unchanged initial training and persistent limits.');
