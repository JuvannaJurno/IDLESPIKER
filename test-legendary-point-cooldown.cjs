const assert=require('assert/strict'),R=require('./legendary-cooldown-rules'),s=R.create();assert(s.use('a','tempo-minus',0));assert(!s.ready('a','tempo-minus'));s.settle(0);assert(s.ready('a','tempo-minus'));s.use('a','tempo-minus',0);s.settle(1);assert.equal(s.snapshot()[0].remaining,3);for(let n=0;n<2;n++){s.settle(1);assert(!s.ready('a','tempo-minus'));}s.settle(0);assert(s.ready('a','tempo-minus'));assert(s.ready('b','tempo-minus'));s.use('a','pancake',0,10);for(let i=0;i<7;i++)s.settle(0);assert(!s.ready('a','pancake',21));assert(s.ready('a','pancake',22));s.reset();assert(s.ready('a','pancake',0));console.log('PASS per-player skill ledger, success resets, failed attempt blocks 3 later points, Pancake uses time not points');
for(const id of ['tempo-minus','absolute-read','pancake']){
 const ledger=R.create();assert(ledger.reserve('a',id,0,1));assert(!ledger.ready('a',id,1,0),'preparation prevents a duplicate');assert(!ledger.reserve('a',id,0,1));
 ledger.cancel('a',id,0);assert(ledger.ready('a',id,1,0),'cancelled preparation costs no CD');
 ledger.reserve('a',id,0,1);ledger.settle(1);assert(ledger.ready('a',id,1,0),'uncontacted action is released at rally end');
 ledger.reserve('a',id,0,1);assert(ledger.commit('a',id,0,2));assert(!ledger.ready('a',id,2,0));ledger.cancel('a',id,0);assert(!ledger.ready('a',id,2,0),'cancellation cannot erase a consumed cooldown');
 if(id==='pancake'){assert(!ledger.ready('a',id,13,0));assert(ledger.ready('a',id,14,0));}else{ledger.settle(1);assert.equal(ledger.snapshot()[0].remaining,3);}
}
console.log('PASS preparation reservations, contact commits, cancelled-action refunds and timed Pancake contact CD');
