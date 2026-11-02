const assert=require('assert/strict'),R=require('../scripts/game/legendary-cooldown-rules.js');
for(const team of [0,1]){
 const s=R.create(),ready=actor=>s.ready(actor,'team-heart',0,team);
 assert(ready('a')&&ready('b'));assert(s.use('a','team-heart',team));assert(!ready('a')&&!ready('b'));assert(!s.use('b','team-heart',team));s.settle(team);assert(!ready('a'),'a won rally does not recharge Heart');s.settle(1-team);assert.equal(s.snapshot()[0].remaining,1);s.settle(team);assert.equal(s.snapshot()[0].remaining,2,'a win breaks the loss streak');s.settle(1-team);assert(!ready('b'));s.settle(1-team);assert(ready('b'));s.settle(team);assert(ready('b'),'charged state persists until used');assert(s.use('b','team-heart',team));assert(!ready('a'));assert.equal(s.snapshot().length,1,'only one shared entry per team');assert(s.ready('other','team-heart',0,1-team));s.reset();assert(ready('a'));
}
for(let bits=0;bits<256;bits++){const s=R.create();s.use('a','team-heart',0);let streak=0,charged=false;for(let i=0;i<8;i++){const winner=(bits>>i)&1;streak=winner?streak+1:0;charged||=streak>=2;s.settle(winner);assert.equal(s.ready('b','team-heart',0,0),charged);}}
console.log('PASS Heart shared team cooldown, consecutive losses, interrupted streak, persistent charge, independent teams, reset and 256 point sequences');
