/* Persistent practice stations. Native contacts/poses, no clock-seek animation resets. */
(function(){
'use strict';if(new URLSearchParams(location.search).get('academyTraining')!=='1')return;
const bounds={minX:45,maxX:955,minY:20,maxY:600};
const idle=p=>{p.hit=p.jump=p.block=p.spike=p.toss=p.receive=0;p.moving=false;p.approach=false;p.courtVX=p.courtVY=0;};
function create({kind,entries,coaches,template,walk,character,drawBall}){
 const run={kind:kind==='serve'?'serve':'spike',stationKind:kind,players:[],ball:{state:'held'},time:0,elapsed:0,phase:'assembling',phaseAge:0,turns:0,returns:0,serves:0,ballSequence:1,floorBalls:[],line:[],active:null,busy:false};
 function actor(person,index,team,zone,role){const p={...template[index%template.length],index,team,zone,roster:{...person,role},stats:undefined,homeX:team?790:250,homeY:310,phase:0};idle(p);p.person=person;run.players.push(p);return p;}
 const youth=entries.map((entry,index)=>{const p=actor(entry.player,index,0,6,'libero');p.entryId=entry.id;return p;});
 const setter=actor(coaches[0],10,0,3,'setter'),collector=actor(coaches[1]||coaches[0],11,1,6,'libero');
 setter.x=435;setter.y=310;setter.angle=0;collector.x=790;collector.y=340;collector.angle=Math.PI;
 const collectorBody={...collector,x:800,y:500};run.line=[...youth];
 const attackSlots=[{x:275,y:240},{x:225,y:250},{x:175,y:275},{x:175,y:330},{x:175,y:385},{x:220,y:420},{x:275,y:420},{x:310,y:365},{x:310,y:310},{x:310,y:255}];
 function slot(index){return kind==='serve'?{x:150+index*65,y:596}:attackSlots[index%attackSlots.length];}
 youth.forEach((p,index)=>Object.assign(p,slot(index)));
 function service(action){const old={paused,scenario,launch,servingTeam,serve};try{paused=false;scenario=null;servingTeam=0;launch=AcademyNativeSimulation.launch;serve=AcademyNativeSimulation.serve;action();}finally{paused=old.paused;scenario=old.scenario;launch=old.launch;servingTeam=old.servingTeam;serve=old.serve;}}
 function launchNative(from,to,touch,type='pass'){service(()=>AcademyNativeSimulation.launch(from,to,touch,type));ball.miss=false;delete ball.outcome;ball.academyBallId=run.ballSequence;}
 function tickNative(dt,list){const all=players;try{players=list;service(()=>AcademyNativeSimulation.tick(dt));ball.academyBallId=run.ballSequence;}finally{players=all;}}
 function role(p,value,zone){p.roster={...p.person,role:value};p.zone=zone;}
 function pickNext(){if(run.active||!run.line.length)return;const next=run.line[0];if(next.returnPath)return;run.line.shift();run.active=next;role(next,'outside',kind==='serve'?1:2);run.phase='ready';run.phaseAge=0;next.entryAt=0;}
 function retire(){const p=run.active;if(!p)return;role(p,'libero',6);p.returnPath=kind==='serve'?[{x:230,y:510},{x:230,y:550}]:[{x:370,y:110},{x:150,y:110},{x:150,y:440}];p.returnAt=0;run.line.push(p);run.active=null;run.turns++;}
 function walkQueues(dt){
  run.line.forEach((p,index)=>{const path=p.returnPath,goal=path?.[p.returnAt]||slot(index);walk(p,goal,dt,bounds);if(path&&Math.hypot(p.x-goal.x,p.y-goal.y)<10){p.returnAt++;if(p.returnAt>=path.length)delete p.returnPath;}});
 }
 function readySpot(){if(kind==='serve')return {x:55,y:450};const point=attackPoint(run.active);return {x:point.x-95,y:point.y+20};}
 function holdBall(p){const point=MatchVectorCharacters.serveContact(p,'right','set',false)||{x:p.x,y:p.y,z:18};ball={state:'held',kind:'held',x:point.x,y:point.y,z:point.z||18,academyBallId:run.ballSequence};}
 function catchAndReturn(){collector.toss=.7;collector.receive=.25;collector.hit=.3;launchNative(collector,setter,2);run.returns++;run.phase='return';}
 function startAttack(){setter.toss=.7;launchNative(setter,run.active,3);run.phase='set';}
 function floorBall(source){const b={...source,state:'drop',t:0,z:18,academyBallId:run.ballSequence++};delete b.floorBounce;initFloorBounce(b);run.floorBalls.push(b);}
 function floors(dt){for(const b of run.floorBalls){b.t+=dt;b.z=groundBounceHeight(b);if(!b.academyResting&&b.t>=(b.dropDuration||1.5)){b.academyResting=true;b.z=0;b.restRotation=elapsed*3;}}if(run.collecting){const target=run.collecting==='pickup'?run.floorBalls[0]:{x:800,y:500};if(target){walk(collectorBody,target,dt,bounds);if(Math.hypot(collectorBody.x-target.x,collectorBody.y-target.y)<20){if(run.collecting==='pickup'){run.floorBalls.shift();run.collecting='return';}else run.collecting=null;}}}}
 function attackStep(dt){
  pickNext();const active=run.active;
  if(active&&run.phase==='ready'){const point=readySpot();walk(active,point,dt,bounds);if(Math.hypot(active.x-point.x,active.y-point.y)<10){idle(active);if(!run.started){run.started=true;catchAndReturn();}else if(ball.state==='held')startAttack();}}
  if(ball.state==='flight'){
   const before=ball.kind;
   if(ball.kind==='attack'&&ball.t+dt>=ball.duration){catchAndReturn();}
   else if(ball.kind==='pass'&&ball.touch===2&&ball.t+dt>=ball.duration){setter.hit=.3;setter.toss=.7;holdBall(setter);run.phase='ready';}
   else{const involved=[setter,collector];if(active&&((ball.target===active)||active.spike>0))involved.push(active);tickNative(dt,involved);}
   if(before!=='attack'&&ball.kind==='attack'){run.phase='attack';run.hits=(run.hits||0)+1;}
  }else elapsed+=dt;
  if(run.phase==='attack'&&active&&active.spike<=.02)retire();
  if(ball.state==='held'){holdBall(setter);setter.toss=Math.max(setter.toss,.18);}
  run.busy=ball.state==='flight';
 }
 function serveStep(dt){
  if(!run.collecting&&run.floorBalls.length>8&&run.phase==='ready'&&ball.state!=='flight')run.collecting='pickup';
  pickNext();const active=run.active;
  if(active&&run.phase==='ready'){const goal=active.entryAt===0?{x:115,y:450}:readySpot();walk(active,goal,dt,bounds);if(Math.hypot(active.x-goal.x,active.y-goal.y)<10)active.entryAt=1;if(Math.hypot(active.x-55,active.y-450)<10){idle(active);updateFacing(active,0,dt,true);}if(Math.hypot(active.x-55,active.y-450)<10&&Math.cos(active.angle)>.97&&!run.collecting){ball={state:'wait',timer:.8,serviceAuthorized:true,x:active.x,y:active.y,z:18,academyBallId:run.ballSequence};run.phase='serve';}}
  if(run.phase==='serve'&&active){
   if(ball.state==='flight'&&ball.t+dt>=ball.duration){floorBall(ball);run.serves++;run.phase='follow';run.phaseAge=0;ball={state:'held'};}
   else{if(ball.state==='flight'){idle(active);tickNative(dt,[collector]);}else tickNative(dt,[active,collector]);}
  }else elapsed+=dt;
  if(run.phase==='follow'&&run.phaseAge>.4){retire();run.phase='ready';}
  if(ball.state==='wait'&&ball.serviceAuthorized){const u=Math.max(0,Math.min(1,(.8-ball.timer)/.8)),a=MatchVectorCharacters.serveContact(active,'left','aim')||active,b=MatchVectorCharacters.serveContact(active,'right','strike')||active;ball.x=a.x+(b.x-a.x)*u;ball.y=a.y+(b.y-a.y)*u;ball.z=18+Math.sin(u*Math.PI)*45;}run.busy=run.phase==='serve'||run.phase==='follow';
 }
 run.step=function(dt){const previous=new Map(youth.map(p=>[p.entryId,{x:p.x,y:p.y}]));run.time+=dt;if(scenario)scenario.time=run.time;run.phaseAge+=dt;const before=elapsed;walkQueues(dt);if(kind==='serve')serveStep(dt);else attackStep(dt);if(elapsed===before)elapsed+=dt;floors(dt);
  for(const p of youth){const old=previous.get(p.entryId);run.maxStep=Math.max(run.maxStep||0,Math.hypot(p.x-old.x,p.y-old.y));}
  for(const p of youth)character(p,{...p.person,academyEntry:p.entryId,academyQuiet:p!==run.active});
  character(setter,coaches[0],0,true);character(kind==='serve'?collectorBody:collector,coaches[1]||coaches[0],0,true);
  if(ball.state==='flight'||ball.state==='wait'||(kind==='attack'&&ball.state==='held'))drawBall();
  for(const b of run.floorBalls){const current=ball;try{ball=b;drawBall();}finally{ball=current;}}
 };
 return run;
}
window.AcademyStations={create};
})();
