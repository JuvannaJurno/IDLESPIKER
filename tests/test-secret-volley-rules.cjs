const assert=require('node:assert/strict'),fs=require('node:fs');
const {create}=require('../scripts/experiments/secret-volley-model.js');
const step=m=>m.tick(1/120),advance=(m,seconds)=>{for(let i=0;i<Math.ceil(seconds*120);i++)step(m);};
function fixture({team=0,touches=0,z=1.2,kind='receive'}={}){
 const m=create({seed:42,mode:'local',assist:false});m.state.phase='rally';m.state.lastTeam=team;m.state.lastPlayer=team*6+5;m.state.touches=touches;
 const p=m.state.players[team*6];p.x=4.5;p.y=team?5:13;m.select(team,p.id,10);
 Object.assign(m.state.ball,{x:p.x+.1,y:p.y,z,vx:0,vy:0,vz:-.3,kind,age:.3,flightTeam:team,reaction:0,readX:0,readY:0});return {m,p};
}
{
 const m=create({seed:3,mode:'local'}),server=m.server();assert(!m.serve(1));assert.equal(m.state.phase,'serve');assert(m.serve(0));assert.equal(m.state.phase,'rally');assert.equal(m.state.stats.serves,1);assert(!m.serve(0));
 assert.equal(m.state.ball.x,server.x);assert.equal(m.state.ball.y,server.y);
}
// Remote buttons arm a physical contact window; they never teleport a ball to a player.
{
 const {m,p}=fixture();m.state.ball.x=8;m.state.ball.y=16;const before={...m.state.ball};assert(m.action(0));assert.equal(m.state.contacts,0);assert.equal(m.state.ball.x,before.x);assert.equal(m.state.ball.y,before.y);advance(m,.04);assert.equal(m.state.contacts,0);
}
// Real local contacts preserve the ball's actual position and height at impact.
for(const team of [0,1]){
 const {m,p}=fixture({team});const before={...m.state.ball};m.action(team);assert.equal(m.state.stats.receives,1);assert.equal(m.state.touches,1);assert.equal(m.state.lastPlayer,p.id);assert.equal(m.state.ball.x,before.x);assert.equal(m.state.ball.y,before.y);assert.equal(m.state.ball.z,before.z);assert.equal(m.state.pending.player,m.state.receiver);
}
{
 const {m,p}=fixture();m.state.lastPlayer=p.id;m.action(0);assert.equal(m.state.notice,'Çift dokunuş');assert.deepEqual(m.state.score,[0,1]);
}
{
 const {m}=fixture({touches:3});m.action(0);assert.equal(m.state.notice,'Dördüncü dokunuş');assert.deepEqual(m.state.score,[0,1]);
}
// Standing returns and well-timed jumping spikes are distinct, without skills.
{
 const {m}=fixture({touches:2,z:1.5,kind:'set'});m.action(0);assert.equal(m.state.ball.kind,'free');assert.equal(m.state.stats.attacks,1);
 const jumping=fixture({touches:2,z:2.7,kind:'set'});jumping.m.action(0);advance(jumping.m,.18);assert.equal(jumping.m.state.ball.kind,'attack');assert.equal(jumping.m.state.stats.attacks,1);assert(jumping.p.jump>.25);
}
// The net collision uses the crossing height. A jumping block can reflect the same flight.
{
 const {m}=fixture();Object.assign(m.state.ball,{x:4.5,y:9.04,z:1.8,vx:0,vy:-12,vz:0,flightTeam:1,kind:'attack'});m.state.lastTeam=0;step(m);assert.equal(m.state.notice,'File');assert.deepEqual(m.state.score,[0,1]);
 const f=fixture();const blocker=f.m.state.players[10];blocker.x=4.5;blocker.y=8.6;blocker.jump=.5;blocker.jumpV=0;
 Object.assign(f.m.state.ball,{x:4.5,y:9.04,z:2.7,vx:0,vy:-12,vz:0,flightTeam:1,kind:'attack'});f.m.state.lastTeam=0;step(f.m);assert.equal(f.m.state.stats.blocks,1);assert.equal(f.m.state.ball.kind,'block');assert.equal(f.m.state.ball.flightTeam,0);assert.equal(f.m.state.touches,0);
}
// No hand can contact a ball across the net, even if planar distance is small.
{
 const {m,p}=fixture();p.y=9.3;Object.assign(m.state.ball,{x:p.x,y:8.9,z:1.2,flightTeam:0});assert(!m.reachable(p));m.action(0);assert.equal(m.state.contacts,0);
}
{
 const {m}=fixture();Object.assign(m.state.ball,{x:9.5,y:12,z:.001,vz:-1});step(m);assert.equal(m.state.notice,'Dışarıda');assert.deepEqual(m.state.score,[0,1]);
 const f=fixture();Object.assign(f.m.state.ball,{x:2,y:14,z:.001,vz:-1});step(f.m);assert.equal(f.m.state.notice,'Top yerde');assert.deepEqual(f.m.state.score,[0,1]);
}
// Two simultaneous analogs move independently at the same bounded player speed.
{
 const {m}=fixture();const a=m.state.players[0],b=m.state.players[1],ax=a.x,bx=b.x;
 m.move(0,0,1,1);m.move(0,1,-1,0);advance(m,.1);
 assert(a.x>ax&&b.x<bx);assert(Math.hypot(a.vx,a.vy)<=m.constants.speed+.00001);assert.equal(m.state.active[0],1);
 const selected=m.state.active[0];advance(m,1.4);assert.equal(m.state.active[0],selected,'a held analog cannot be retargeted automatically');
 m.release();assert(m.state.players.every(p=>!p.controlled&&p.inputX===0&&p.inputY===0));
}
// Frame rate does not affect deterministic ball physics or scoring.
{
 const a=create({seed:71}),b=create({seed:71});a.state.bot=[true,true];b.state.bot=[true,true];
 for(let i=0;i<2400;i++)a.tick(1/120);for(let i=0;i<1200;i++)b.tick(1/60);
 assert.deepEqual(a.state.score,b.state.score);assert.equal(a.state.contacts,b.state.contacts);assert(Math.abs(a.state.ball.x-b.state.ball.x)<1e-8);
}
// Extended matches check that rallies resolve through real floor/net contacts, never a timed score.
const rows=[];
for(let seed=1;seed<=32;seed++){
 let lastContact=null;const m=create({seed,onEvent(e){if(e.type==='contact')lastContact=e;}});m.state.bot=[true,true];let maxRally=0;
 for(let i=0;i<120*1200&&!m.state.finished;i++){
  const before=m.state.players.map(p=>({x:p.x,y:p.y})),phase=m.state.phase;step(m);
  if(m.state.phase==='rally')maxRally=Math.max(maxRally,m.state.phaseTime);
  assert(Number.isFinite(m.state.ball.x+m.state.ball.y+m.state.ball.z));
  if(phase==='rally'&&m.state.phase==='rally')for(const p of m.state.players){assert(p.x>=.3&&p.x<=8.7);assert(p.team?p.y>=-.4&&p.y<=8.7:p.y>=9.3&&p.y<=18.4);assert(Math.hypot(p.x-before[p.id].x,p.y-before[p.id].y)<=m.constants.speed/120+.0001);}
 }
 assert(m.state.finished,'seed '+seed+' completes');assert(lastContact);assert(m.state.stats.serves>0&&m.state.stats.receives>0&&m.state.stats.sets>0&&m.state.stats.attacks>0);
 assert(m.state.events.filter(e=>e.type==='point').every(e=>['Top yerde','File','Dışarıda','Anten dışı','Dördüncü dokunuş','Çift dokunuş'].includes(e.reason)));
 const winner=m.state.winner,loser=1-winner;assert(m.state.score[winner]>=11);assert(m.state.score[winner]-m.state.score[loser]>=2||m.state.score[winner]===21);
 rows.push({seed,finished:m.state.finished,seconds:+m.state.time.toFixed(2),score:m.state.score,stats:m.state.stats,maxRally:+maxRally.toFixed(2)});
}
// An input-only pilot exercises the same select/move/aim/action API used by both controller layouts.
// It gets no velocity bonus, direct contact call, score mutation or privileged bot contacts.
const controlled=[];
for(const mode of ['bot','local'])for(let seed=1;seed<=8;seed++){
 const m=create({seed,mode}),next=[0,0],lastAim=[0,0],contacts=[0,0];
 for(let i=0;i<120*1200&&!m.state.finished;i++){
  const s=m.state,b=s.ball;
  for(const team of mode==='local'?[0,1]:[0]){
   if(s.phase==='serve'&&s.serving===team&&s.phaseTime>.45)m.action(team);
   if(s.phase!=='rally'||b.flightTeam!==team)continue;
   // Two perfect interceptors can sustain a rally indefinitely. Periodic hesitation
   // exercises missed human inputs; the ball itself must still decide the point.
   if((s.time+seed+team*3)%13>11.2){for(const q of s.players.filter(q=>q.team===team))m.move(team,q.id,0,0);continue;}
   const goal=s.pending?.target||m.predict(),own=s.players.filter(p=>p.team===team&&p.id!==s.lastPlayer);
   own.sort((a,b)=>Math.hypot(a.x-goal.x,a.y-goal.y)-Math.hypot(b.x-goal.x,b.y-goal.y));
   const p=s.receiver!==null?s.players[s.receiver]:own[0];m.select(team,p.id,.5);
   for(const q of s.players.filter(q=>q.team===team))m.move(team,q.id,0,0);
   const dx=goal.x-p.x,dy=goal.y-p.y,d=Math.hypot(dx,dy);if(d>.1)m.move(team,p.id,dx/Math.max(.5,d),dy/Math.max(.5,d));
   if(s.touches===2&&s.time-lastAim[team]>.7){m.aim(team,p.x>4.5?1.1:7.9,team?16.9-s.rallies%3:1.1+s.rallies%3);lastAim[team]=s.time;}
   if(s.time>next[team]&&m.predict().time<.48){m.action(team);next[team]=s.time+.2;}
  }
  step(m);for(const e of s.events.splice(0))if(e.type==='contact')contacts[e.team]++;
 }
 assert(m.state.finished,mode+' input pilot seed '+seed+' completes');assert(contacts.every(n=>n>5));
 controlled.push({mode,seed,score:m.state.score,seconds:+m.state.time.toFixed(2),contacts,stats:m.state.stats});
}
fs.writeFileSync('audits/secret-volley-simulation.json',JSON.stringify({botMatches:rows,inputMatches:controlled},null,2));
console.log('PASS physical serve/receive/set/spike/block, no remote/through-net contacts, faults, fair movement, simultaneous analogs, deterministic frame rates, 32 bot + 16 input-controlled completed matches');
