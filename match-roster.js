(function(){
let squad=null,identitySprites={},applied=false,liberoSlot=null,lastReplacementRally=-1,replacement=null;const oldDraw=draw,oldReset=reset,oldTick=tick;
if(parent!==window)paused=true;
let refereeCursor=0,refereeHold=0,refereeWinner=0;
function refereeEvents(){if(refereeCursor>history.length)refereeCursor=0;for(;refereeCursor<history.length;refereeCursor++){const event=history[refereeCursor];if(event.type==='point'){refereeWinner=event.team;refereeHold=1.3}}}
function refereeTick(dt){refereeEvents();if(paused||!ready)return;refereeHold=Math.max(0,refereeHold-dt)}
const normalPlayerLayout=playerLayout;
playerLayout=function(p){if(p.index!==13||!p.refereeGesture)return normalPlayerLayout(p);const side=p.refereeGesture==='whistle'?'right':refereeWinner===0?'right':'left',pose=p.refereeGesture==='whistle'?RECEIVE_LAYOUT:TOSS_LAYOUT;
 // Use the approved pose parts verbatim; the other arm stays at rest.
 return LAYOUT.filter(part=>!part.id.startsWith('arm-')&&part.id!=='sleeve-'+side).concat(pose.filter(part=>part.id==='arm-'+side||(p.refereeGesture==='whistle'&&part.id==='sleeve-'+side)));
};

function baseIdentity(p){const key=['o1','s1','p','o2','s2','pc'][p.index];return squad?.players.find(q=>q.id===squad.lineup[key])}
function visibleIdentity(p){if(!squad||p.team!==0)return null;return p.index===liberoSlot?squad.players.find(q=>q.id===squad.lineup.l):baseIdentity(p)}
function updateReplacement(dt){
 if(!applied||ball.state!=='wait'||rotationMotion||ball.serviceAuthorized)return false;
 if(!replacement){
 const current=players.find(p=>p.index===liberoSlot),eligible=p=>p.team===0&&baseIdentity(p)?.role==='middle'&&[1,5,6].includes(p.zone)&&!(servingTeam===0&&p.zone===1);
 const target=current&&eligible(current)?current:players.find(eligible);
 // A removal and entry for the other middle cannot share a dead ball.
 if(current&&!eligible(current))replacement={p:current,enter:false};
 else if(!current&&target&&rally>lastReplacementRally)replacement={p:target,enter:true};
 if(!replacement)return false;
 const p=replacement.p,bench={x:285,y:573},gate={x:350,y:545},end=playerGoal(p);
 const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
 Object.assign(replacement,{time:0,start:{x:p.x,y:p.y},end,bench,gate,outgoing:visibleIdentity(p),incoming:replacement.enter?squad.players.find(q=>q.id===squad.lineup.l):baseIdentity(p),duration:Math.max(1.4,(distance(p,gate)+distance(gate,bench))/220,(distance(bench,gate)+distance(gate,end))/220+.3)});
 history.push({type:'libero-change-start',player:p.index,enter:replacement.enter,rally});
 }
 const r=replacement,p=r.p;r.time+=dt;
 function walk(from,via,to,t){const d1=Math.hypot(via.x-from.x,via.y-from.y),d2=Math.hypot(to.x-via.x,to.y-via.y),d=Math.min(1,Math.max(0,t))*(d1+d2),a=d<d1?from:via,b=d<d1?via:to,u=d<d1?d/Math.max(1,d1):(d-d1)/Math.max(1,d2);return {x:a.x+(b.x-a.x)*u,y:a.y+(b.y-a.y)*u,angle:Math.atan2(b.y-a.y,b.x-a.x)}}
 const t=Math.min(1,r.time/r.duration),out=walk(r.start,r.gate,r.bench,t),incoming=walk(r.bench,{x:r.gate.x+20,y:r.gate.y},r.end,Math.max(0,(r.time-.3)/(r.duration-.3)));
 Object.assign(p,out,{moving:t<1,hit:0,jump:0,block:0});p.phase+=dt*10;r.incomingPose=incoming;
 if(t===1){liberoSlot=r.enter?p.index:null;lastReplacementRally=rally;Object.assign(p,r.end,{moving:false});history.push({type:'libero-change',player:p.index,enter:r.enter,rally});replacement=null;sync();}
 return true;
}
function drawGuest(identity,pose,index=12){const parts=identitySprites[identity?.id];if(!parts)return;const previous=sprites[index],text=ctx.fillText;try{sprites[index]=parts;ctx.fillText=()=>{};drawPlayer({team:0,index,zone:6,x:pose.x,y:pose.y,phase:replacement?.time*10||0,angle:pose.angle??-Math.PI/2,moving:!!pose.moving,hit:0,jump:0,block:0,spike:0,toss:0,receive:0,...pose})}finally{sprites[index]=previous;ctx.fillText=text}}
function drawSubstitutes(){if(!squad)return;if(replacement){drawGuest(replacement.incoming,{...(replacement.incomingPose||replacement.bench),moving:replacement.time>.3});return}const identity=liberoSlot===null?squad.players.find(p=>p.id===squad.lineup.l):baseIdentity(players.find(p=>p.index===liberoSlot));drawGuest(identity,{x:285,y:573,angle:-Math.PI/2})}
function drawReferee(){if(!ready)return;ctx.save();ctx.strokeStyle='#617e7d';ctx.lineWidth=4;ctx.strokeRect(483,33,34,38);ctx.fillStyle='#e6d6ac';ctx.fillRect(480,67,40,6);ctx.beginPath();ctx.moveTo(483,71);ctx.lineTo(480,82);ctx.moveTo(517,71);ctx.lineTo(520,82);ctx.stroke();ctx.restore();refereeEvents();const gesture=ball.state==='wait'&&ball.serviceAuthorized?'whistle':refereeHold>0?'point':null;drawGuest({id:'match-referee'},{x:500,y:51,angle:Math.PI/2,refereeGesture:gesture,toss:gesture==='point'?.7:0,receive:gesture==='whistle'?.4:0},13)}

function sync(){if(!applied)return;for(const p of players){const identity=p.team===1?squad.opponents?.[p.index%6]:visibleIdentity(p);if(!identity)continue;if(p.team===1){p.displayName=identity.name?identity.name+' '+identity.surname:null;p.jerseyNumber=identity.number;if(identitySprites[identity.id])sprites[p.index]=identitySprites[identity.id];const fatigue=1-Math.min(.22,Math.max(0,elapsed-120)/1800*Math.max(0,1-identity.stamina/100)),pressure=1-Math.min(.12,Math.max(0,scores[0]-scores[1])*.012*Math.max(0,1-identity.mental/100));p.stats={...identity};for(const k of ['spike','block','serve','receive','set'])p.stats[k]=identity[k]*fatigue*pressure;continue;}p.roster=identity;p.displayName=identity.name+' '+identity.surname;p.jerseyNumber=identity.number;const fatigue=1-Math.min(.22,Math.max(0,elapsed-120)/1800*Math.max(0,1-identity.stamina/100)),pressure=1-Math.min(.12,Math.max(0,scores[1]-scores[0])*.012*Math.max(0,1-identity.mental/100));p.stats={...identity};for(const k of ['spike','block','serve','receive','set'])p.stats[k]=identity[k]*fatigue*pressure;if(identitySprites[identity.id])sprites[p.index]=identitySprites[identity.id]}}
draw=function(){sync();oldDraw();drawSubstitutes();drawReferee()};tick=function(dt){refereeTick(dt);if(!paused&&ready&&updateReplacement(dt)){sync();return}sync();oldTick(dt)};reset=function(){refereeCursor=0;refereeHold=0;refereeWinner=0;liberoSlot=null;lastReplacementRally=-1;replacement=null;oldReset();sync()};
async function apply(data){if(!data?.players||!data?.lineup)return;const keys=['p','s1','s2','pc','o1','o2','l'];if(keys.some(k=>!data.players.some(p=>p.id===data.lineup[k])))return;squad=data;refereeCursor=0;refereeHold=0;refereeWinner=0;liberoSlot=null;lastReplacementRally=-1;replacement=null;matchRandom=MatchRules.seeded(data.matchInfo?.fixtureId||data.matchInfo?.round||1);frameCarry=0;paused=true;while(!ready)await new Promise(r=>setTimeout(r,30));for(const identity of [...new Set(Object.values(data.lineup))].map(id=>data.players.find(p=>p.id===id)).concat(data.opponents||[],[{id:'match-referee',role:'referee',appearance:data.players[0].appearance?{palette:{...data.players[0].appearance.palette,shirt:'#f5f0dc',pants:'#384e65',skin:'#c69371',hair:'#514b43'}}:null}])){const id=identity.id,palette=identity.appearance?.palette;if(!palette)continue;const result={};for(const part of LAYOUT){const c=document.createElement('canvas');c.width=part.width;c.height=part.height;const x=c.getContext('2d');x.drawImage(await load(ASSETS[part.path]),0,0);x.globalCompositeOperation='source-in';x.fillStyle=shade(identity.role==='libero'&&part.colorSource==='shirt'&&!identity.appearance?.clubKit?'#edc457':palette[part.colorSource],part.shade??1);x.fillRect(0,0,c.width,c.height);if(part.colorSource==='shirt'&&identity.appearance?.clubKit){x.globalCompositeOperation='source-atop';x.fillStyle=shade(identity.appearance.clubKit.accent,part.shade??1);x.fillRect(0,c.height*.18,c.width,Math.max(2,c.height*.08));}result[part.id]=c}identitySprites[id]=result}applied=true;sync();paused=false;parent.postMessage({type:'spiker-match',action:'squad-ready'},'*')}
window.addEventListener('message',e=>{if(e.source===parent&&e.data?.type==='spiker-match'&&e.data.action==='squad')apply(e.data.squad).catch(()=>{announce('Kadro yüklenemedi. Sayfayı yenileyip tekrar dene.')})});
})();
