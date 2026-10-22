const fs=require('fs'),vm=require('vm'),assert=require('assert');
const source=fs.readFileSync('match-vector-characters.js','utf8');
const helper=source.slice(source.indexOf('const armTurnStates='),source.indexOf('function draw(c,p,time)'));
const context={sprites:[{}]};vm.createContext(context);vm.runInContext(helper,context);
const run=context.armTurnLag,roster={},p={index:0,roster,angle:0};
assert.equal(run(p,0,true),0);
let lag=0;for(let i=1;i<=12;i++){p.angle=i*.08;lag=run({...p},i/60,true);assert(Math.abs(lag)<=.14);assert.equal(run({...p},i/60,true),lag,'overlay must not advance inertia twice')}
assert(lag<-.08,'turn creates a small delayed arm swing');
for(let i=13;i<=42;i++)lag=run({...p},i/60,true);
assert(Math.abs(lag)<.001,'steady heading settles quickly');
p.angle+=.1;assert(run(p,43/60,true)<0);
assert.equal(run(p,44/60,false),0,'authored contact poses suppress swing');
assert.equal(run(p,0,true),0,'replayed timeline resets');
p.angle=-Math.PI+.01;run(p,.01,false);p.angle=Math.PI-.01;lag=run(p,.02,true);assert(lag>0,'wraparound uses shortest turn');
assert.equal(run(p,2,true),0,'long pause resets');
console.log('PASS arm inertia: turning, settling, overlay clones, contact exclusion, clock resets, angle wrap');
