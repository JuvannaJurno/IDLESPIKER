const assert=require('node:assert/strict');
const {create}=require('../scripts/experiments/secret-volley-model.js');
for(const team of [0,1]){
 const m=create({seed:51,mode:'local',control:'smart',assist:false}),s=m.state,old=team*6,next=team*6+2;
 s.phase='rally';s.lastTeam=1-team;s.lastPlayer=(1-team)*6;s.receiver=next;
 Object.assign(s.ball,{x:4.5,y:team?6:12,z:3,vx:0,vy:0,vz:0,age:0,reaction:.4,kind:'serve',flightTeam:team});
 m.select(team,old,10);m.move(team,old,.4,-.7);m.tick(1/120);
 assert.equal(s.active[team],next,'the incoming receiver wins even while the analog is held');
 assert.equal(s.players[old].controlled,false);assert.equal(s.players[old].inputX,0);
 assert(s.players[next].controlled);assert.equal(s.players[next].inputX,.4);assert.equal(s.players[next].inputY,-.7);
 m.move(team,old,-.2,.8);assert.equal(s.players[next].inputX,-.2,'an existing captured pointer follows the new active player');
 m.move(team,old,0,0);assert(!s.players[next].controlled,'releasing that original pointer releases the new receiver');
 // Reach a real first touch, then automatically take the setter and the hitter.
 const p=s.players[next];Object.assign(s.ball,{x:p.x,y:p.y,z:1.3,vx:0,vy:0,vz:-.3,age:.4});p.cooldown=0;
 assert(m.action(team));assert.equal(s.touches,1);const setter=s.receiver;m.tick(1/120);assert.equal(s.active[team],setter);
 const q=s.players[setter];Object.assign(s.ball,{x:q.x,y:q.y,z:1.3,vx:0,vy:0,vz:-.3,age:.4});q.cooldown=0;
 assert(m.action(team));assert.equal(s.touches,2);const hitter=s.receiver;m.tick(1/120);assert.equal(s.active[team],hitter);assert.notEqual(hitter,setter);
}
// An opponent's visible set selects a front-row blocker, not the previous server.
for(const team of [0,1]){
 const m=create({mode:'local',control:'smart',seed:9}),s=m.state;s.phase='rally';s.lastTeam=1-team;s.lastPlayer=(1-team)*6;
 s.receiver=(1-team)*6+3;Object.assign(s.ball,{x:2.2,y:team?10.2:7.8,z:3,vx:0,vy:0,vz:0,age:.3,flightTeam:1-team,kind:'set'});
 m.tick(1/120);assert(Math.abs(s.players[s.active[team]].y-9)<3,'smart control selects the relevant blocker');
}
// Six-stick assignments stay explicit; held players are not reassigned.
{
 const m=create({mode:'local',control:'six'}),s=m.state;s.phase='rally';s.receiver=2;Object.assign(s.ball,{flightTeam:0,kind:'receive',age:.4,z:3});
 m.move(0,0,1,0);m.tick(1/120);assert.equal(s.active[0],0);assert(s.players[0].controlled&&!s.players[2].controlled);
}
console.log('PASS smart receive → setter → hitter, automatic blocker, held-input handoff/release for both teams, and independent six-stick control');
