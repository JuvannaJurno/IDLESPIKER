const fs=require('fs'),vm=require('vm'),assert=require('assert');
const nodes={},c={console,assert,Math,document:{getElementById:id=>nodes[id]??={value:id==='mistakes'?'12':'1',getContext:()=>({})}}};vm.createContext(c);vm.runInContext(fs.readFileSync('deneme-modu.html','utf8').match(/<script>([\s\S]*?)<\/script>/)[1].replace(/init\(\);\s*$/,''),c);
vm.runInContext(`
function roster(){for(const p of players)p.stats={role:['middle','outside','setter','middle','outside','opposite'][p.index%6],spike:25,block:35,set:25,receive:25,serve:25};}
reset();ready=true;roster();
for(let rotation=0;rotation<6;rotation++){
 ball={state:'wait',timer:1};
 for(let team=0;team<2;team++){
  const points=Object.fromEntries(players.filter(p=>p.team===team).map(p=>{const g=tacticalGoal(p);return[p.zone,{x:team?1000-g.x:g.x,y:team?620-g.y:g.y}]}));
  for(const [f,b]of [[2,1],[3,6],[4,5]])assert(points[f].x>points[b].x);
  for(const row of [[4,3,2],[5,6,1]])assert(points[row[0]].y<points[row[1]].y&&points[row[1]].y<points[row[2]].y);
 }
 const zones=players.map(p=>p.zone);ball={state:'drop',kind:'attack',target:players[6]};
 for(const p of players){const role=playerRole(p),z=roleZone(p);assert.equal(z,frontRow(p)?role==='middle'?3:role==='outside'?4:2:role==='middle'?6:role==='outside'?5:1);if(!frontRow(p))assert(!mayBlock(p));}
 assert.deepEqual(players.map(p=>p.zone),zones);rotateTeam(0);rotateTeam(1);rotationMotion=null;
}
const libero=players.find(p=>frontRow(p));libero.stats.role='libero';assert(!mayBlock(libero));
// Net contact must happen after flight, using only reachable front-row players.
function attack(rng){reset();roster();ready=true;paused=false;const hitter=players.find(p=>p.team===0&&p.zone===2),defender=players.find(p=>p.team===1&&p.zone===6);hitter.x=425;hitter.y=310;defender.x=800;defender.y=310;for(const p of players.filter(p=>p.team===1)){p.x=frontRow(p)?535:780;p.y=frontRow(p)?310:450;}matchRandom=()=>.5;launch(hitter,defender,1,'attack');matchRandom=rng;return {hitter,defender};}
let draws=[.5,.01];attack(()=>draws.length?draws.shift():.5);assert(ball.attackPending);assert.equal(ball.x,425);assert(!history.some(e=>e.type==='block-contact'));while(ball.attackPending)tick(1/60);assert.equal(ball.kind,'block');assert.equal(ball.x,500);assert.equal(ball.targetX,430);assert.equal(ball.pointWinner,1);assert(history.some(e=>e.type==='block-contact'&&e.point));assert(players.some(p=>p.blockFlash>0&&mayBlock(p)));while(!history.some(e=>e.type==='point'))tick(1/60);assert.equal(history.find(e=>e.type==='point').team,1);
// A soft block is not one of the receiving team's three contacts.
draws=[.5,.9,.01];attack(()=>draws.length?draws.shift():.5);while(ball.attackPending)tick(1/60);assert.equal(ball.outcome.event,'block-touch');assert.equal(ball.touch,1);assert.equal(ball.miss,false);
// A rear-row player next to the net still cannot block.
attack(()=>.5);for(const p of players.filter(p=>p.team===1)){p.x=frontRow(p)?800:535;p.y=310;p.block=1;}ball.blockPlan=[];while(ball.attackPending)tick(1/60);assert.equal(history.find(e=>e.type==='resolution').blockers.length,0);
reset();roster();ready=true;paused=false;matchRandom=MatchRules.seeded('tactics');let frames=0;while(!sets.some(Boolean)&&frames++<240000)tick(1/60);assert(sets.some(Boolean),'full match finishes');const contacts=history.filter(e=>e.type==='block-contact');assert(contacts.length>0);assert(history.some(e=>e.type==='resolution'&&e.event==='block'));console.log('PASS: all rotations legal before service, roles after service, front-row eligibility, visible net collision, block score, soft block and full match.',{blocks:contacts.length,frames});
`,c);
