const assert=require('node:assert/strict'),R=require('./point-music-rules');
assert.deepEqual([1,2,3,4].map(n=>R.next(['a'],n)),['','a','','a']);
assert.deepEqual([1,2,3,4,5].map(n=>R.next(['a','b','c'],n)),['a','b','c','a','b']);
assert.equal(R.next([],1),'');assert.deepEqual(R.rival(1),['carmen-overture']);assert.deepEqual(R.rival(2),['taiko']);assert(R.pause('a')-R.pause('')<1);
console.log('PASS music cadence, cycling, rival assignments and short extra pause');
