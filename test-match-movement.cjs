const fs=require('fs'),vm=require('vm'),assert=require('assert');
const nodes={},c={console,assert,Math,document:{getElementById:id=>nodes[id]??={value:id==='mistakes'?'12':'1',getContext:()=>({})}}};vm.createContext(c);vm.runInContext(fs.readFileSync('deneme-modu.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1].replace(/init\(\);\s*$/,''),c);

vm.runInContext(`
function roster(){for(const p of players)p.stats={role:['middle','outside','setter','middle','outside','opposite'][p.index%6],spike:35,block:35,set:35,receive:35,serve:35,stamina:40};}
reset();ready=true;paused=false;roster();
// A back-row setter and opposite must not share a waiting destination after service.
ball={state:'drop',target:players[6]};const a=players[0],b=players[5];a.stats.role='setter';b.stats.role='opposite';const ga=tacticalGoal(a),gb=tacticalGoal(b);assert(Math.hypot(ga.x-gb.x,ga.y-gb.y)>=60);
// Meeting players must go around one another; never teleport across court.
a.x=200;a.y=300;b.x=250;b.y=300;for(const p of players.filter(p=>p!==a&&p!==b))p.y=500;
let closest=Infinity;for(let i=0;i<100;i++){const old={x:a.x,y:a.y};moveCourtPlayer(a,{x:330,y:300},1/60);moveCourtPlayer(b,{x:140,y:300},1/60);assert(Math.hypot(a.x-old.x,a.y-old.y)<=movementSpeed(a)/60+.001);closest=Math.min(closest,Math.hypot(a.x-b.x,a.y-b.y));}assert(closest>28,'players keep body clearance');assert(a.x>b.x,'players pass instead of deadlocking');
// A numerical success cannot suspend the ball while its receiver is too far away.
reset();roster();const from=players[0],to=players[6];matchRandom=()=>.5;launch(from,to,1,'serve');ball.t=ball.duration;to.x=940;to.y=520;ball.targetX=600;ball.targetY=140;tick(1/60);assert.equal(ball.state,'drop');assert(history.some(e=>e.type==='position-error'));
for(let seed=0;seed<12;seed++){reset();roster();ready=true;paused=false;matchRandom=MatchRules.seeded('movement-'+seed);let n=0;while(!sets.some(Boolean)&&n++<60000)tick(1/60);assert(sets.some(Boolean),'seed '+seed+' completes');for(const p of players)assert(p.team?p.x>=500:p.x<=500);}
console.log('PASS: distinct role lanes, bounded movement, body clearance, missed contact falls, 12 full matches');
`,c);
const rules=require('./match-rules');const stat={serve:30,receive:30,set:30,spike:30};function errors(stage){const rng=rules.seeded('stage-errors');let count=0;for(let i=0;i<20000;i++){const type=i%3;const o=rules.resolve({stage,kind:type===0?'serve':'pass',touch:type===0?1:type===1?2:3,actor:stat,receiver:stat,quality:.6},rng);if(['serve-error','receive-error','set-error'].includes(o.event))count++;}return count}const prologue=errors('prologue'),bal=errors('bal');assert(bal<prologue*.8);console.log('PASS: equal-stat BAL basic errors lower',{prologue,bal});
