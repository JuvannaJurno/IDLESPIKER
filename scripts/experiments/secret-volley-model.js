/* Isolated, deterministic court simulation. No DOM, game state or storage access. */
(function(root){
'use strict';
const G=9.8, NET=2.43, DT=1/120, SPEED=4.7;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
const side=y=>y>=9?0:1;
const homes=[[2,15.8],[4.5,15.3],[7,15.8],[2,11.4],[4.5,11.1],[7,11.4]];
function trajectory(start,target,seconds,endZ=0){return {x:start.x,y:start.y,z:start.z,vx:(target.x-start.x)/seconds,vy:(target.y-start.y)/seconds,vz:(endZ-start.z+.5*G*seconds*seconds)/seconds};}
function flightAt(ball,t){return {x:ball.x+ball.vx*t,y:ball.y+ball.vy*t,z:ball.z+ball.vz*t-.5*G*t*t};}
function floorTime(ball){return Math.max(0,(ball.vz+Math.sqrt(Math.max(0,ball.vz*ball.vz+2*G*Math.max(0,ball.z))))/G);}
function shot(start,target,kind,power=.65){
 power=clamp(Number(power)||.65,.25,1);const d=distance(start,target);
 let duration=kind==='serve'?Math.max(1.35,d/(6+power*4)):kind==='attack'?Math.max(.36,d/(12+power*10)):Math.max(1.25,d/9);
 const f=(9-start.y)/(target.y-start.y);
 if(f>0&&f<1){const needed=(NET+.16-start.z*(1-f))/(.5*G*f*(1-f));if(needed>0)duration=Math.max(duration,Math.sqrt(needed));}
 return {...trajectory(start,target,duration),duration,target:{...target},power};
}
function create(options={}){
 let seed=(options.seed||Date.now())>>>0, accumulator=0;
 const random=()=>{seed=(1664525*seed+1013904223)>>>0;return seed/4294967296;};
 const state={time:0,phase:'serve',score:[0,0],serving:0,touches:0,lastTeam:-1,lastPlayer:-1,
  phaseTime:0,notice:'Servis sende',winner:null,rallies:0,contacts:0,events:[],rotations:[0,0],
  active:[0,6],manualUntil:[0,0],control:'six',arms:[null,null],aim:[{x:6.8,y:3.6},{x:2.2,y:14.4}],
  bot:[false,true],assist:true,finished:false,players:[],ball:{x:0,y:0,z:0,vx:0,vy:0,vz:0},
  pointTarget:11,difficulty:'normal',power:[.65,.65],teamStats:[{},{}],rallyHits:0,longestRally:0,
  stats:{serves:0,receives:0,sets:0,attacks:0,blocks:0,net:0,out:0,misses:0,frames:0}};
 function event(type,data={}){const e={type,time:state.time,...data};state.events.push(e);if(state.events.length>100)state.events.shift();options.onEvent?.(e);}
 function home(p){const i=(p.slot+state.rotations[p.team])%6,h=homes[i];return {x:p.team?9-h[0]:h[0],y:p.team?18-h[1]:h[1]};}
 for(let team=0;team<2;team++)for(let slot=0;slot<6;slot++){
  const p={id:team*6+slot,team,slot,x:0,y:0,vx:0,vy:0,inputX:0,inputY:0,controlled:false,
   jump:0,jumpV:0,pose:'idle',poseTime:0,poseAge:0,cooldown:0,phase:0,angle:team?Math.PI/2:-Math.PI/2};
  Object.assign(p,home(p));state.players.push(p);
 }
 function server(){return state.players.find(p=>p.team===state.serving&&(p.slot+state.rotations[p.team])%6===2);}
 function readyServe(){
  state.phase='serve';state.phaseTime=0;state.touches=0;state.lastTeam=-1;state.lastPlayer=-1;
  state.arms=[null,null];state.pending=null;state.receiver=null;state.rallyHits=0;
  for(const p of state.players){Object.assign(p,home(p));p.controlled=false;p.inputX=p.inputY=0;p.jump=p.jumpV=0;p.pose='idle';p.poseTime=0;p.cooldown=0;p.vx=p.vy=0;}
  const p=server();p.y=p.team?-.35:18.35;p.x=7.2;state.active[p.team]=p.id;
  state.ball={x:p.x,y:p.y,z:1.8,vx:0,vy:0,vz:0};
  state.notice=state.serving===0?'Servis sende':'Karşı taraf servis atıyor';
  event('ready',{team:state.serving,player:p.id});
 }
 function point(team,reason){
  if(state.phase!=='rally')return false;
  state.score[team]++;state.rallies++;state.phase='point';state.phaseTime=0;state.pending=null;state.arms=[null,null];
  if(state.serving!==team)state.rotations[team]=(state.rotations[team]+1)%6;
  state.serving=team;state.notice=reason;state.winner=team;
  for(const p of state.players){p.controlled=false;p.inputX=p.inputY=0;}
  const s=state.score;
  if((s[team]>=state.pointTarget&&s[team]-s[1-team]>=2)||s[team]>=21){state.phase='finished';state.finished=true;}
  event('point',{team,reason,score:[...s],finished:state.finished,landing:{x:state.ball.x,y:state.ball.y}});
  if(reason==='File'||reason==='Anten dışı'){state.ball.vy*=-.2;state.ball.vx*=.3;}
  return true;
 }
 // Every shot follows a ballistic arc. Targets never move the receiving actor or the ball.
 function fly(p,target,time,kind,endZ=0,startZ=null){
  const b=state.ball;if(kind==='serve'){b.x=p.x;b.y=p.y;}b.z=startZ??b.z;
  Object.assign(b,trajectory(b,target,time,endZ));
  const level={easy:{reaction:.38,error:3.1,block:.95},normal:{reaction:.24,error:2.6,block:.6},hard:{reaction:.16,error:1.7,block:.55}}[state.difficulty];
  b.kind=kind;b.age=0;b.target={...target};b.flightTeam=side(target.y);b.blocked=false;b.reaction=level.reaction+random()*.12;
  b.readX=(random()-.5)*level.error;b.readY=(random()-.5)*level.error;b.blockAt=level.block+random()*.8;
  state.receiver=target.player??null;state.contacts++;p.cooldown=.22;
  p.pose=kind==='set'?'set':kind==='receive'?'receive':'strike';p.poseTime=.42;p.poseAge=p.pose==='strike'?.29:0;
  state.lastTeam=p.team;state.lastPlayer=p.id;
  state.rallyHits++;state.longestRally=Math.max(state.longestRally,state.rallyHits);
  state.teamStats[p.team][kind]=(state.teamStats[p.team][kind]||0)+1;
  event('contact',{team:p.team,player:p.id,kind,x:p.x,y:p.y,z:b.z,touches:state.touches});
 }
 function openTarget(team,attacker=null){
  // Prefer a gap, but vary the target so rallies do not repeat a fixed script.
  const enemy=state.players.filter(p=>p.team!==team);let best,score=-Infinity;
  for(const x of [1.1,2.8,4.5,6.2,7.9])for(const depth of [1.1,3.2,5.2]){
   const t={x,y:team?18-depth:depth};let gap;
   if(attacker){
    const z=state.ball.z,T=.46,vz=(0-z+.5*G*T*T)/T;
    const cross=(9-attacker.y)/(t.y-attacker.y),netZ=z+vz*T*cross-.5*G*T*T*cross*cross;
    if(netZ<NET+.08)continue;
    // Read the reachable part of the trajectory, not just the empty landing square.
    const time=(vz+Math.sqrt(vz*vz+2*G*(z-1.85)))/G,ratio=clamp(time/T,0,1);
    const intercept={x:attacker.x+(t.x-attacker.x)*ratio,y:attacker.y+(t.y-attacker.y)*ratio};
    gap=Math.min(...enemy.map(p=>distance(p,intercept)-SPEED*Math.max(0,time-.22)))+random()*.32;
   }else gap=Math.min(...enemy.map(p=>distance(p,t)))+random()*.85;
   if(gap>score){score=gap;best=t;}
  }
  return best||{x:team?2:7,y:team?16.5:1.5};
 }
 function preview(team,power=state.power[team]){
  const p=state.phase==='serve'?server():state.players[state.active[team]],start=state.phase==='serve'?{x:p.x,y:p.y,z:2.2}:{...state.ball};
  return shot(start,state.aim[team],state.phase==='serve'?'serve':'attack',power);
 }
 function serve(team,power=.65){
  if(state.phase!=='serve'||team!==state.serving)return false;
  const p=server(),target=state.bot[team]?openTarget(team):state.aim[team];
  state.phase='rally';state.phaseTime=0;state.touches=0;state.stats.serves++;
  const arc=shot({x:p.x,y:p.y,z:2.2},target,'serve',power);
  fly(p,target,arc.duration,'serve',0,2.2);state.notice='Servis';event('serve',{team,player:p.id});return true;
 }
 function predict(height=1.35){
  const b=state.ball,root=(b.vz+Math.sqrt(Math.max(0,b.vz*b.vz+2*G*(b.z-height))))/G;
  const t=clamp(root,0,3);return {x:b.x+b.vx*t,y:b.y+b.vy*t,time:t};
 }
 function reach(p){return (p.jump>.1?2.4:1.85)+p.jump;}
 function reachable(p){
  const b=state.ball;
  return state.phase==='rally'&&b.age>.14&&p.cooldown<=0&&side(b.y)===p.team&&b.z>=.25&&b.z<=reach(p)+.12&&distance(p,b)<=(b.kind==='attack'?.55:.85);
 }
 function teamForBall(){return state.ball.flightTeam;}
 function targetActor(team,exclude,front=false){
  const own=state.players.filter(p=>p.team===team&&p.id!==exclude);
  const y=team?7.65:10.35;
  if(front){own.sort((a,b)=>Math.abs(a.y-y)-Math.abs(b.y-y)||a.id-b.id);return own[Math.floor(random()*Math.min(2,own.length))];}
  return own.sort((a,b)=>Math.abs(a.x-4.5)+Math.abs(a.y-y)-Math.abs(b.x-4.5)-Math.abs(b.y-y))[0];
 }
 function contact(p,manual=false){
  if(!reachable(p)||teamForBall()!==p.team)return false;
  const b=state.ball;
  if(state.lastTeam===p.team&&state.touches===2&&b.z>1.7&&p.jumpV>0&&p.jump<.28)return false;
  if(state.lastTeam===p.team&&state.lastPlayer===p.id){
   if(manual)point(1-p.team,'Çift dokunuş');return false;
  }
  if(state.lastTeam!==p.team)state.touches=0;
  state.touches++;
  if(state.touches>3){point(1-p.team,'Dördüncü dokunuş');return false;}
  if(state.touches===1){
   const mate=targetActor(p.team,p.id),target={x:4.5,y:p.team?6.7:11.3,player:mate.id};
   state.pending={player:mate.id,target};state.stats.receives++;
   fly(p,target,1.22,'receive',1.7);state.notice='Manşet';
  }else if(state.touches===2){
   const mate=targetActor(p.team,p.id,true),x=mate.x<4.5?2.2:6.8;
   const target={x,y:p.team?7.9:10.1,player:mate.id};
   state.pending={player:mate.id,target};state.stats.sets++;
   fly(p,target,1.2,'set',2.25);state.notice='Pas · Hücum zamanı';
  }else{
   const target=state.bot[p.team]?openTarget(p.team,p):state.aim[p.team];
   // Grounded, early contacts are safe free balls; a well-timed jump makes a spike.
   const attack=p.jump>.25&&b.z>1.7;state.pending=null;state.stats.attacks++;
   const power=state.bot[p.team]?(state.difficulty==='easy'?.3:state.difficulty==='hard'?.95:.65):state.power[p.team];
   const arc=shot(b,target,attack?'attack':'free',power);
   fly(p,target,arc.duration,attack?'attack':'free',0,b.z);
   state.notice=attack?'Smaç!':'Karşıya gönderildi';
  }
  state.arms[p.team]=null;if(state.receiver!==null)focus(p.team,state.players[state.receiver]);return true;
 }
 function select(team,id,hold=1.2){
  const p=state.players[id];if(!p||p.team!==team)return false;
  if(state.control==='smart'&&state.active[team]!==id){
   const previous=state.players[state.active[team]];
   p.inputX=previous.inputX;p.inputY=previous.inputY;p.controlled=previous.controlled;
   previous.inputX=previous.inputY=0;previous.controlled=false;
  }
  state.active[team]=id;state.manualUntil[team]=state.time+hold;return true;
 }
 function move(team,id,x,y){
  const p=state.players[state.control==='smart'?state.active[team]:id];if(!p||p.team!==team||state.bot[team])return;
  const n=Math.max(1,Math.hypot(x,y));p.inputX=clamp(x/n,-1,1);p.inputY=clamp(y/n,-1,1);
  p.controlled=Math.hypot(x,y)>.04;if(p.controlled)select(team,p.id,1.2);
 }
 function jump(p){if(p.jump===0){p.jumpV=3.7;event('jump',{team:p.team,player:p.id});}}
 function action(team,options={}){
  state.power[team]=clamp(Number(options.power)||.65,.25,1);
  if(state.phase==='serve')return serve(team,state.power[team]);
  if(state.phase!=='rally'||state.bot[team])return false;
  const p=state.players[state.active[team]],enemy=state.ball.flightTeam!==team;
  if((state.lastTeam===team&&state.touches>=2)||Math.abs(p.y-9)<1.7||enemy)jump(p);
  state.arms[team]={id:p.id,until:state.time+.7};
  if(contact(p,true))return true;
  event('armed',{team,player:p.id});return true;
 }
 function aim(team,x,y){
  if(!Number.isFinite(x)||!Number.isFinite(y))return;
  state.aim[team]={x:clamp(x,.6,8.4),y:team?clamp(y,10,17):clamp(y,1,8)};
 }
 function nearest(team,target){
  let best=null,score=Infinity;
  for(const p of state.players)if(p.team===team&&p.id!==state.lastPlayer){const d=distance(p,target);if(d<score){best=p;score=d;}}
  return best;
 }
 function focus(team,p){
  if(!p||state.bot[team])return;
  if(state.control!=='smart'){
   if(state.time>state.manualUntil[team]&&!state.arms[team]&&!state.players.some(q=>q.team===team&&q.controlled))state.active[team]=p.id;
   return;
  }
  const arm=state.arms[team];if(arm&&arm.until>=state.time)return;
  const current=state.players[state.active[team]];
  // Explicit pass targets win immediately. On one incoming flight, avoid flickering
  // between equally good receivers as the controlled player starts moving.
  if(state.focusFlight?.[team]===state.contacts&&state.receiver===null&&current.id!==state.lastPlayer){
   const target=predict();if(distance(current,target)<=distance(p,target)+.65)return;
  }
  select(team,p.id,0);state.focusFlight[team]=state.contacts;
 }
 function goals(){
  const result=state.players.map(home);
  if(state.phase==='point'){const p=server();result[p.id]={x:7.2,y:p.team?-.35:18.35};return result;}
  if(state.phase!=='rally')return result;
  const team=teamForBall(),prediction=predict();
  const receiver=state.receiver!==null?state.players[state.receiver]:nearest(team,prediction);
  if(receiver&&receiver.team===team&&!(state.lastTeam!==team&&state.ball.age<state.ball.reaction&&(state.bot[team]||state.control!=='smart'))){
   const target=state.pending?.player===receiver.id?state.pending.target:prediction;
   const error=state.bot[team]&&state.lastTeam!==team;
   const tx=target.x+(error?state.ball.readX:0),ty=target.y+(error?state.ball.readY:0);
   result[receiver.id]={x:clamp(tx,.4,8.6),y:team?clamp(ty,.4,8.65):clamp(ty,9.35,17.6)};
   // Make room for the incoming receiver/setter instead of parking another
   // teammate on the same contact point. Movement still uses normal speed limits.
   for(const p of state.players)if(p.team===team&&p!==receiver&&distance(result[p.id],result[receiver.id])<.9){result[p.id]={...result[p.id],x:clamp(result[p.id].x+(p.x<4.5?-1.15:1.15),.4,8.6)};}
   focus(team,receiver);
  }
  if(state.ball.kind==='set'){
   const other=1-team,blocker=nearest(other,{x:prediction.x,y:9});
   if(blocker){result[blocker.id]={x:clamp(prediction.x,.5,8.5),y:other?8.55:9.45};focus(other,blocker);}
  }
  return result;
 }
 function blockBetween(old){
  const b=state.ball;
  if((old.y-9)*(b.y-9)>0||Math.abs(old.y-b.y)<.00001)return false;
  const t=(9-old.y)/(b.y-old.y),x=old.x+(b.x-old.x)*t,z=old.z+(b.z-old.z)*t;
  if(x<0||x>9||z<NET){state.stats.net++;point(1-state.lastTeam,x<0||x>9?'Anten dışı':'File');return true;}
  const defenders=state.players.filter(p=>p.team!==state.lastTeam&&Math.abs(p.y-9)<1.05&&Math.abs(p.x-x)<.8&&p.jump>.2&&z<=reach(p)+.65);
  if(!b.blocked&&defenders.length){
   const p=defenders[0];p.pose='block';p.poseTime=.35;p.poseAge=0;p.cooldown=.22;
   state.stats.blocks++;state.lastTeam=p.team;state.lastPlayer=p.id;state.touches=0;state.pending=null;state.receiver=null;
   state.teamStats[p.team].block++;state.rallyHits++;state.longestRally=Math.max(state.longestRally,state.rallyHits);
   b.y=p.team?9.12:8.88;b.x=x;b.z=z;b.vy=-b.vy*.65;b.vx*=.5;b.vz=-.8;
   b.flightTeam=1-p.team;b.kind='block';b.age=0;b.blocked=true;state.notice='Blok!';
   event('contact',{team:p.team,player:p.id,kind:'block',x,y:9,z,touches:0});
  }
  return false;
 }
 function step(dt){
  state.time+=dt;state.phaseTime+=dt;state.stats.frames++;
  const targets=goals();
  for(const p of state.players){
   p.cooldown=Math.max(0,p.cooldown-dt);p.poseTime=Math.max(0,p.poseTime-dt);p.poseAge+=dt;
   if(p.poseTime===0)p.pose='idle';
   if(p.jump>0||p.jumpV>0){p.jump+=p.jumpV*dt;p.jumpV-=G*dt;if(p.jump<=0){p.jump=0;p.jumpV=0;}}
   let dx=0,dy=0;
   if(state.phase==='point'||(state.phase==='rally'&&(p.controlled||state.bot[p.team]||p.id!==state.active[p.team]))){
    if(p.controlled&&state.phase==='rally'){dx=p.inputX;dy=p.inputY;}else{const target=targets[p.id],d=distance(p,target);if(d>.12){dx=(target.x-p.x)/d;dy=(target.y-p.y)/d;}}
   }
   p.vx=dx*SPEED;p.vy=dy*SPEED;p.phase+=Math.hypot(p.vx,p.vy)*dt*3.2;
   p.x=clamp(p.x+p.vx*dt,.3,8.7);
   if(state.phase==='rally'||state.phase==='point')p.y=p.team?clamp(p.y+p.vy*dt,-.4,8.7):clamp(p.y+p.vy*dt,9.3,18.4);
   if(Math.hypot(dx,dy)>.05)p.angle=Math.atan2(dy,dx);
   else if(state.phase==='rally')p.angle=Math.atan2(state.ball.y-p.y,state.ball.x-p.x);
  }
  if(state.phase==='serve'){
   const p=server();state.ball.x=p.x;state.ball.y=p.y;
   if(state.bot[state.serving]&&state.phaseTime>.85)serve(state.serving);return;
  }
  if(state.phase==='point'){
   const b=state.ball;if(b.z>0||Math.abs(b.vz)>.2){const next=flightAt(b,dt);b.x=next.x;b.y=next.y;b.z=next.z;b.vz-=G*dt;if(b.z<0){b.z=0;b.vz=Math.abs(b.vz)>.8?Math.min(2,Math.abs(b.vz)*.25):0;}}
   else{b.z=0;b.vz=0;b.x+=b.vx*dt;b.y+=b.vy*dt;}b.vx*=Math.exp(-5*dt);b.vy*=Math.exp(-5*dt);
   if((state.phaseTime>1.3&&state.players.every(p=>distance(p,targets[p.id])<.2))||state.phaseTime>3)readyServe();return;
  }
  if(state.phase!=='rally')return;
  const b=state.ball,old={x:b.x,y:b.y,z:b.z},ground=floorTime(b),flightStep=Math.min(dt,ground),next=flightAt(b,flightStep),landed=ground<=dt;
  b.age+=flightStep;b.x=next.x;b.y=next.y;b.z=landed?0:next.z;b.vz-=G*flightStep;
  if(blockBetween(old)||state.phase!=='rally')return;
  const prediction=predict(),team=teamForBall();
  // All controlled and AI contacts use the same reach gate, speed and jump physics.
  for(const p of state.players){
   const auto=state.bot[p.team]||(state.assist&&p.team===team&&(state.control==='smart'||p.id!==state.active[p.team])&&(state.lastTeam!==team||state.touches<2));
   const blockBot=state.bot[p.team]&&p.team!==team&&b.kind==='set'&&b.age>b.blockAt;
   if(blockBot&&Math.abs(p.y-9)<1.05&&Math.abs(p.x-b.x)<1.2&&Math.abs(b.y-9)<3)jump(p);
   if(auto&&p.team===team&&p.id!==state.lastPlayer){
    if(state.lastTeam===p.team&&state.touches===2&&prediction.time<.52&&distance(p,prediction)<1.3)jump(p);
    if(b.vz<0&&contact(p))break;
   }
  }
  for(let team=0;team<2;team++){
   const a=state.arms[team];if(!a)continue;
   if(a.until<state.time){state.arms[team]=null;continue;}
   if(b.vz<1.5)contact(state.players[a.id],true);
  }
  if(state.phase!=='rally')return;
  if(b.z<=0){
   b.z=0;const out=b.x<0||b.x>9||b.y<0||b.y>18;
   if(out){state.stats.out++;point(1-state.lastTeam,'Dışarıda');}
   else{state.stats.misses++;point(1-side(b.y),'Top yerde');}
  }
 }
 function tick(seconds){
  if(!Number.isFinite(seconds)||seconds<=0)return;
  accumulator+=Math.min(seconds,.1);let n=0;
  while(accumulator>=DT&&n++<13){step(DT);accumulator-=DT;}
 }
 function reset(opts={}){
  state.time=0;state.phaseTime=0;state.score=[0,0];state.rotations=[0,0];state.serving=0;state.finished=false;state.winner=null;state.rallies=0;state.contacts=0;state.events=[];
  state.active=[0,6];state.manualUntil=[0,0];state.focusFlight=[-1,-1];state.control=opts.control==='smart'?'smart':'six';accumulator=0;
  state.power=[.65,.65];state.teamStats=[{serve:0,receive:0,set:0,attack:0,free:0,block:0},{serve:0,receive:0,set:0,attack:0,free:0,block:0}];state.longestRally=0;
  state.difficulty=['easy','normal','hard'].includes(opts.difficulty)?opts.difficulty:'normal';
  for(const k of Object.keys(state.stats))state.stats[k]=0;
  state.bot=opts.mode==='local'?[false,false]:[false,true];state.assist=opts.assist!==false;
  state.pointTarget=clamp(Number(opts.target)||11,3,21);readyServe();
 }
 reset(options);
 return {state,tick,reset,serve,action,select,move,aim,reachable,predict,preview,server,home,release(){for(const p of state.players){p.inputX=p.inputY=0;p.controlled=false;}state.arms=[null,null];},
  // Deterministic rules tests can construct boundary positions without modifying the main game.
  constants:{gravity:G,net:NET,speed:SPEED,step:DT}};
}
const api={create,trajectory,flightAt,floorTime,shot};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SecretVolleyModel=api;
})(globalThis);
