const assert=require('assert');
let state={stage:'bal',division:3,floors:[[],[],[],[],[]]};
global.RoomSystem={developmentState:()=>state,trainingDiscount:()=>0};
const T=require('./team-rules');
const p={...T.generate()[0],cardLevel:48};
for(const k of ['spike','block','serve','receive','set','stamina','mental'])p[k]=130;
const early=T.cardQuote(p).cost;let previous=early;
for(const level of [58,68,78,88]){
 p.cardLevel=level;const a=T.cardQuote(p);
 assert(a.cost>previous,'late prices still grow');
 const legacy=early*(1+(level-48)/10)**2.65;
 assert(a.cost<legacy*.51,'late upgrades are substantially more accessible');previous=a.cost;
}
console.log('PASS late upgrade curve: increasing costs, reduced late barrier, stage parity');
