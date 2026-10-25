(function(){
'use strict';if(new URLSearchParams(location.search).get('academyTraining')!=='1')return;
window.AcademyScrimmage={create({entries,coaches,template,character,drawBall}){
 const watching=entries.length%2?(entries.length===5?1:3):0,count=entries.length-watching,perSide=count/2;
 const run={kind:'practice-match',players:[],ball:{state:'wait',timer:1},time:0,elapsed:0,busy:false,points:[0,0],rallies:0,watching,activeCount:count,server:0};
 const zones=[1,2,6,3,4],roles=['setter','outside','libero','middle','outside'];
 entries.forEach((entry,index)=>{const spectator=index>=count,team=index<perSide?0:1,slot=index%perSide,zone=zones[slot]||6,h=formation(team,zone);run.players.push({...template[index%template.length],index,team,zone,x:spectator?190+(index-count)*58:h.x,y:spectator?584:h.y,homeX:h.x,homeY:h.y,angle:spectator?-Math.PI/2:team?Math.PI:0,roster:{...entry.player,role:roles[slot]||'outside'},stats:undefined,entry,spectator,moving:false,hit:0,jump:0,block:0,spike:0,toss:0,receive:0,phase:0});});
 for(const p of run.players){p.practicePerson=p.entry.player;if(!p.spectator&&p.practicePerson.appearance){p.practicePerson={...p.practicePerson,appearance:JSON.parse(JSON.stringify(p.practicePerson.appearance))};p.practicePerson.appearance.palette.shirt=p.team?'#bd8866':'#547f73';p.practicePerson.appearance.clubKit={primary:p.practicePerson.appearance.palette.shirt,accent:'#f5e4b9'};}}
 run.step=function(dt){const all=players,old={paused,scenario,launch,serve,awardPoint,chooseHitter,servingTeam},onCourt=run.players.filter(p=>!p.spectator);try{
  players=onCourt;paused=false;scenario=null;servingTeam=run.server;launch=AcademyNativeSimulation.launch;serve=AcademyNativeSimulation.serve;
  chooseHitter=function(setter){const pool=players.filter(p=>p.team===setter.team&&p!==setter&&frontRow(p)&&!['setter','libero'].includes(playerRole(p)));const fallback=players.filter(p=>p.team===setter.team&&p!==setter&&[2,3,4].includes(p.zone));return pool.length||fallback.length?old.chooseHitter(setter):players.find(p=>p.team===setter.team&&p!==setter);};
  awardPoint=function(winner){run.points[winner]++;run.rallies++;run.server=winner;servingTeam=winner;ball={state:'wait',timer:1.4};};
  let carry=dt;while(carry>0){const step=Math.min(1/60,carry);AcademyNativeSimulation.tick(step);carry-=step;}run.busy=ball.state==='flight';
 }finally{players=all;paused=old.paused;scenario=old.scenario;launch=old.launch;serve=old.serve;awardPoint=old.awardPoint;chooseHitter=old.chooseHitter;servingTeam=old.servingTeam;}
 for(const p of run.players){if(p.spectator){p.angle=-Math.PI/2;p.moving=false;p.academySeated=true;}character(p,{...p.practicePerson,academyEntry:p.entry.id,academyQuiet:p.spectator});}
 coaches.forEach((person,index)=>{const p={...template[index?6:0],x:420+index*160,y:575,angle:-Math.PI/2,moving:false,hit:0,jump:0,block:0,spike:0,toss:0,receive:0};character(p,person,0,true);});
 if(Number.isFinite(ball.x))drawBall();
 };
 return run;
}};
})();
