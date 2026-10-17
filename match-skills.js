(function(){
'use strict';
// Temporary contextual skill activation. Uses a separate RNG from match resolution.
const definitions=[
 ['cross','Çapraz Hücum','Common'],['platform','Sağlam Manşet','Common'],['quick','Hızlı Pas','Common'],['breath','Ralli Dayanıklılığı','Common'],['calm','Sakin Karşılama','Common'],['tempo-third','Third Tempo','Common'],
 ['read','Hücum Okuma','Uncommon'],['float','Yüzen Servis','Uncommon'],['line','Çizgi Smaçı','Uncommon'],['back','Geriye Pas','Uncommon'],['cover','Hücum Sigortası','Uncommon'],['tempo-second','Second Tempo','Uncommon'],
 ['wipe','Bloktan Sektirme','Rare'],['roof','Duvar Blok','Rare'],['close','Fileyi Kapat','Rare'],['jump','Sıçrayarak Servis','Rare'],['dive','Plonjon','Rare'],['deceive','Aldatıcı Pas','Rare'],['sync-attack','Senkronize Atak','Rare'],
 ['tempo-first','First Tempo · Quick','Epic'],['tempo-minus','Minus Tempo','Legendary'],['absolute-read','Kusursuz Hücum Okuma','Legendary'],['jump-legendary','Yıldırım Smaç Servis','Legendary'],['jump-float-legendary','Jump Float','Legendary'],['perfect-second-touch','Kusursuz İkinci Dokunuş','Legendary'],['one-hand-rescue','Tek El Mucizesi','Legendary'],['ghost-tip','Hayalet Plase','Legendary']
].map(([id,name,rarity])=>({id,name,rarity}));
const catalog=new Map(definitions.map(s=>[s.id,s])),weights={Common:5,Uncommon:4,Rare:3,Epic:1.8,Legendary:1.1};
let enabled=true,suppressed=false,clock=0,carry=0,cooldown=0,legendaryUntil=0,lastSkill='',focus=null,servePlan=null,seed='',random=MatchRules.seeded('skill-effects'),lastBall=null,approachPlan=null,rallyStart=0,legendaryUsed=false,pendingSet=null,pendingAttack=null,pendingBlock=null,pendingSync=null,visualRate=1;
const active=[],events=[],focusEvents=[],incoming=new WeakMap(),planned=new WeakSet(),motion=new Map(),trace=[],reactions=new Map(),reacted=new WeakSet();
const originalLaunch=launch,originalNet=resolveNetContact,originalTick=tick,originalDraw=draw,originalPlayer=drawPlayer,originalLayout=playerLayout,originalGoal=playerGoal,originalReset=reset,originalAward=awardPoint;
const nativeCourt=court,courtCache=document.createElement('canvas');courtCache.width=1000;courtCache.height=620;let courtCached=false;court=function(){if(!courtCached){nativeCourt();courtCache.getContext('2d').drawImage(canvas,0,0);courtCached=true;}else ctx.drawImage(courtCache,0,0);};
const label=document.createElement('div');label.id='matchSkillNotice';label.hidden=true;label.setAttribute('role','status');label.setAttribute('aria-live','polite');label.innerHTML='<span></span><strong></strong><small></small>';document.querySelector('.court-space').append(label);
const limit=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),role=p=>p?.stats?.role||p?.roster?.role,number=p=>p?.index;
const sound=action=>{if(parent!==window)parent.postMessage({type:'spiker-audio',action},'*');else if(action==='skill-slow')window.GameAudio?.skillSlow?.();else window.GameAudio?.stopSkillSlow?.();};
function leagueEnabled(){return [2,3].includes(Number(window.matchInfo?.division));}
function canShow(){return enabled&&leagueEnabled()&&!suppressed&&!document.hidden&&!scenario&&!formationPreview&&!serviceGame;}
function finishFocus(reason='cancelled'){if(focus){const f=focus.flight,progress=f?limit(f.t/Math.max(.001,f.duration)):null;focusEvents.push({id:focus.skill.id,reason,progress,age:focus.age});if(focusEvents.length>40)focusEvents.shift();}focus=null;sound('skill-slow-stop');}
function resetEffects(){window.MatchMotion?.reset();window.MatchFrames?.invalidate();active.length=0;trace.length=0;motion.clear();servePlan=null;approachPlan=null;pendingSet=null;pendingAttack=null;pendingBlock=null;pendingSync=null;reactions.clear();finishFocus('reset');carry=0;lastBall=null;label.hidden=true;}
function eligible(ids){return ids.map(id=>catalog.get(id)).filter(s=>s&&s.id!==lastSkill&&(s.rarity!=='Legendary'||clock>=legendaryUntil));}
function pickSkill(ids){const nextSeed=window.matchInfo?.fixtureId||String(window.matchInfo?.round||1);if(seed!==nextSeed){seed=nextSeed;random=MatchRules.seeded('skills-'+seed);}if(!canShow())return null;const choices=eligible(ids),guaranteed=!legendaryUsed?choices.filter(s=>s.rarity==='Legendary'):[];if(guaranteed.length)return guaranteed[Math.floor(random()*guaranteed.length)];if(clock<cooldown||random()>.60||!choices.length)return null;let n=random()*choices.reduce((sum,s)=>sum+weights[s.rarity],0);for(const s of choices){n-=weights[s.rarity];if(n<=0)return s;}return choices.at(-1);}
function startFocus(effect){if(!effect||focus||effect.skill.rarity!=='Legendary'||!canShow()||paused)return;focus={actor:effect.actor,skill:effect.skill,effect,age:0,flight:null,route:null};if(effect.flight)bindFlight(effect,effect.flight);sound('skill-slow');}
function routeKey(f){return [f.kind,f.from?.x,f.from?.y,f.targetX,f.targetY].join('|');}
function bindFlight(effect,flight){effect.flight=flight;effect.contact=clock;effect.prepared=false;if(focus?.effect===effect){focus.flight=flight;focus.route=routeKey(flight);}}
function updateFocus(){if(!focus)return;const f=focus.flight;if(f){if(f!==ball){finishFocus('flight-replaced');return;}const route=routeKey(f);if(route!==focus.route)focus.route=route;if(f.state==='flight'&&f.t/Math.max(.001,f.duration)>=.5){finishFocus('halfway');return;}}else if(focus.effect.incoming&&(ball!==focus.effect.incoming||ball.state==='drop'))finishFocus('action-cancelled');}
function planAim(effect,actor){const options=players.filter(p=>p.team!==actor.team&&[1,5,6].includes(p.zone));if(!options.length)return;const target=options[Math.floor(random()*options.length)],goal=tacticalGoal(target);effect.aimTarget=target.index;effect.aim={x:limit(goal.x,90,910),y:limit(goal.y,90,530)};}
function trigger(skill,actor,kind,flight=ball,extra={}){
 if(!skill||!actor||!canShow())return null;
 const effect={skill,actor:number(actor),team:actor.team,kind,start:clock,contact:clock,until:clock+1.5,flight,...extra};active.push(effect);if(active.length>5)active.shift();lastSkill=skill.id;cooldown=clock+1.7;
 if(skill.rarity==='Legendary'){legendaryUntil=clock+14;legendaryUsed=true;}
 events.push({id:skill.id,actor:actor.index,role:role(actor),kind,at:clock,team:actor.team});if(events.length>80)events.shift();
 label.dataset.rarity=skill.rarity.toLowerCase();label.children[0].textContent=skill.rarity;label.children[1].textContent=skill.name;label.children[2].textContent=commentaryName(actor);label.hidden=false;
 if(!extra.prepared)startFocus(effect);return effect;
}
function servePool(p){return role(p)==='libero'?['float']:['float','jump','jump-legendary','jump-float-legendary'];}
function prepareServe(){if(!canShow()||ball.state!=='wait'||!ball.serviceAuthorized||ball.timer>.42||ball.timer<=0||servePlan?.waiting===ball)return;const p=serverPlayer(),skill=pickSkill(servePool(p));if(!skill){servePlan={waiting:ball,effect:null};return;}const effect=trigger(skill,p,'serve',null,{prepared:true,contact:clock+ball.timer,until:clock+ball.timer+2.5});servePlan={waiting:ball,effect};if(effect?.skill.id==='jump-legendary')planAim(effect,p);startFocus(effect);}
function safeDuration(flight,wanted,margin=.42){const target=flight.target,distance=Math.hypot(target.x-flight.targetX,target.y-flight.targetY),minimum=distance/Math.max(1,movementSpeed(target))+margin;return Math.max(wanted,minimum);}
playerGoal=function(p){
 if(canShow()){
  const reaction=reactions.get(p.index);
  if(reaction){const age=clock-reaction.start;if(age>=0&&age<.42){const amount=age<.22?16:7;return {x:limit(reaction.x+reaction.dx*amount,p.team?550:80,p.team?920:450),y:limit(reaction.y+reaction.dy*amount,105,515)};}}
  if(pendingSync?.setFlight===ball&&pendingSync.members.includes(p.index)&&!ball.miss){const goal=attackPoint(p);return frontRow(p)?goal:{x:p.team?720:280,y:goal.y};}
  if(approachPlan?.flight===ball&&approachPlan.actor===p.index&&ball.state==='flight'&&ball.touch===2&&!ball.miss)return attackPoint(p);
 }
 return originalGoal(p);
};
launch=function(from,target,touch,kind='pass'){
 const previous=ball,info=incoming.get(previous),sync=kind==='attack'&&pendingSync?.setFlight===previous&&pendingSync.hitter===from.index?pendingSync:null;
 const prepared=canShow()?(kind==='serve'?servePlan?.effect:kind==='attack'?pendingAttack?.incoming===previous&&pendingAttack.actor===from.index?pendingAttack:null:null):null;
 if(prepared?.aimTarget!==undefined){const intended=players.find(p=>p.index===prepared.aimTarget&&p.team!==from.team&&[1,5,6].includes(p.zone));if(intended)target=intended;}
 originalLaunch(from,target,touch,kind);
 incoming.set(ball,{distance:Math.hypot(target.x-ball.targetX,target.y-ball.targetY),previousKind:kind});
 if(!canShow())return;
 if(sync){pendingSync=null;sync.outgoing=ball;sync.flight=ball;sync.attackAt=clock;sync.until=clock+ball.duration+1;}
 if(touch===2&&!ball.miss&&role(target)==='setter'){const choices=players.filter(p=>p.team===target.team&&p!==target&&frontRow(p)&&!['setter','libero'].includes(role(p)));approachPlan=choices.length&&random()<.6?{flight:ball,actor:choices[Math.floor(random()*choices.length)].index}:null;}else approachPlan=null;
 const currentSeed=window.matchInfo?.fixtureId||String(window.matchInfo?.round||1);if(seed!==currentSeed){seed=currentSeed;random=MatchRules.seeded('skills-'+seed);}
 let skill=null,effect=null;
 if(kind==='serve'){
  rallyStart=clock;effect=servePlan?.effect;servePlan=null;
  if(effect)bindFlight(effect,ball);else skill=pickSkill(servePool(from).filter(id=>catalog.get(id).rarity!=='Legendary'));
  if(skill)effect=trigger(skill,from,'serve',ball);
  if(effect?.skill.id==='jump-float-legendary'){ball.duration=safeDuration(ball,1.85,.3);effect.until=clock+ball.duration+.9;}
  if(effect?.skill.id==='float')effect.until=clock+ball.duration+.9;
  if(effect?.skill.id==='jump-legendary'){if(!effect.aim)effect.aim={x:limit(ball.targetX,90,910),y:limit(ball.targetY,90,530)};ball.duration=safeDuration(ball,1.05,.28);effect.until=clock+ball.duration+.4;}
 }else if(touch===2){
  const pool=['calm'];if(!role(from)||['libero','outside'].includes(role(from)))pool.push('platform');if(role(from)==='libero'&&(info?.distance||0)>32)pool.push('dive');if(previous.kind==='block'||previous.startZ)pool.push('cover');if(clock-rallyStart>8)pool.push('breath');skill=pickSkill(pool);if(skill)trigger(skill,from,'receive',ball,{incomingKind:previous.kind});
 }else if(touch===3){
  const distance=Math.hypot(target.x-ball.targetX,target.y-ball.targetY),pool=['quick','tempo-third','tempo-second'];
  if(Math.abs(ball.targetY-from.y)>70)pool.push('back','deceive');if(distance<170)pool.push('tempo-first');if(distance<24&&role(target)!=='libero')pool.push('tempo-minus');
  const members=players.filter(p=>p.team===from.team&&p!==from&&p!==target&&!['setter','libero'].includes(role(p))).map(number);if(members.length)pool.push('sync-attack');
  effect=pendingSet?.incoming===previous&&pendingSet.actor===from.index?pendingSet:null;pendingSet=null;
  if(effect){skill=effect.skill;bindFlight(effect,ball);}else{skill=pickSkill(pool);if(skill)effect=trigger(skill,skill.id==='tempo-minus'?target:from,'set',skill.id==='tempo-minus'?null:ball,{hitter:target.index,members});}
  if(skill?.id==='sync-attack'){effect.setFlight=ball;pendingSync=effect;}
  if(skill){if(skill.id==='tempo-third')ball.duration=Math.max(ball.duration,1.9);if(skill.id==='tempo-second')ball.duration=safeDuration(ball,1.4);if(skill.id==='tempo-first')ball.duration=safeDuration(ball,.9);if(skill.id==='tempo-minus'){ball.duration=.50;ball.spikePrepared=true;target.spike=.65;target.jump=.5;pendingAttack=effect;effect.incoming=ball;}if(ball.runStart)ball.runDuration=Math.max(.05,ball.duration-.38);effect.until=clock+ball.duration+1.4;}
 }else if(kind==='attack'){
  effect=prepared;pendingAttack=null;if(effect){skill=effect.skill;bindFlight(effect,ball);}else{const pool=['cross','line'];skill=pickSkill(pool);if(skill)effect=trigger(skill,from,'attack',ball);}
  if(effect){if(skill.id==='ghost-tip'){ball.duration=Math.max(ball.duration,1.3);if(!effect.aim)effect.aim={x:limit(ball.targetX,90,910),y:limit(ball.targetY,90,530)};}effect.until=clock+ball.duration+.4;}
 }
};
resolveNetContact=function(){
 const before=ball,attacker=ball.attacker,prepared=pendingBlock?.incoming===ball?pendingBlock:null;originalNet();
 if(prepared){pendingBlock=null;bindFlight(prepared,ball);prepared.until=clock+ball.duration+.4;return;}
 if(!canShow()||!['block','block-touch'].includes(ball.outcome?.event))return;
 const entry=history.at(-1);if(entry?.type!=='block-contact')return;const blockers=(entry.players||[]).map(index=>players.find(p=>p.index===index)).filter(Boolean);if(!blockers.length)return;
 const main=blockers.find(p=>role(p)==='middle')||blockers[0],pool=['roof','read'];if(blockers.length>1)pool.push('close');
 
 const skill=pickSkill(pool);if(skill)trigger(skill,main,'block',ball,{members:blockers.map(number)});
 if(ball.outcome.event==='block-touch'&&attacker&&random()<.3){const wipe=pickSkill(['wipe']);if(wipe)trigger(wipe,attacker,'attack',before);}
};
function planMovement(){
 if(!canShow()||ball.state!=='flight'||ball.miss||planned.has(ball))return;const target=ball.target,remaining=Math.max(0,ball.duration-ball.t),info=incoming.get(ball);
 if(ball.touch===2&&role(target)==='setter'&&remaining<=.3){
  planned.add(ball);if(Math.hypot(target.x-ball.targetX,target.y-ball.targetY)>movementSpeed(target)*remaining+18)return;if((info?.distance||0)<=25&&!(Number.isFinite(target.contactQuality)&&target.contactQuality<.65))return;
  const skill=pickSkill(['perfect-second-touch','one-hand-rescue']);if(!skill)return;pendingSet=trigger(skill,target,'set',null,{prepared:true,incoming:ball,contact:clock+remaining,until:clock+remaining+2.5});startFocus(pendingSet);
 }else if(ball.touch===3&&target?.spike>0&&!pendingAttack){
  planned.add(ball);const skill=pickSkill(['ghost-tip']);if(!skill)return;pendingAttack=trigger(skill,target,'attack',null,{prepared:true,incoming:ball,contact:clock+remaining,until:clock+remaining+2.5});planAim(pendingAttack,target);startFocus(pendingAttack);
 }else if(ball.kind==='attack'&&ball.attackPending&&!pendingBlock){
  const blockers=(ball.blockPlan||[]).map(g=>players.find(p=>p.index===g.index)).filter(p=>p&&p.block>0&&p.jump>0&&role(p)!=='libero');if(!blockers.length)return;planned.add(ball);
  const actor=blockers.find(p=>role(p)==='middle')||blockers[0],skill=pickSkill(['absolute-read']);if(!skill)return;pendingBlock=trigger(skill,actor,'block',null,{prepared:true,incoming:ball,contact:clock+Math.max(0,ball.netTime-ball.t),until:clock+remaining+1});startFocus(pendingBlock);
 }
}
function confuse(flight,reason,members){
 if(reacted.has(flight))return;reacted.add(flight);
 members.forEach((p,i)=>{
  const dx=p.x-flight.targetX,dy=p.y-flight.targetY,length=Math.max(1,Math.hypot(dx,dy));
  reactions.set(p.index,{actor:p.index,reason,x:p.x,y:p.y,dx:Math.abs(dx)+Math.abs(dy)<1?(p.team?1:-1):dx/length,dy:dy/length,start:clock+i*.035,until:clock+1.15,phase:(p.index%3-1)*.5});
 });
}
function updateReactions(){
 for(const [index,reaction]of reactions)if(clock>reaction.until)reactions.delete(index);
 for(const group of active)if(group.skill.id==='sync-attack'&&group.setFlight===ball&&!Number.isFinite(group.leapStart)){
  const hitter=players.find(p=>p.index===group.hitter);if(hitter?.jump>0&&ball.spikePrepared)group.leapStart=clock;
 }
 if(ball.state!=='flight'||!ball.outcome||ball.outcome.winner!=='actor'||reacted.has(ball))return;
 const effect=active.find(e=>e.flight===ball);if(!effect)return;
 if(['float','jump-float-legendary'].includes(effect.skill.id)&&ball.kind==='serve'&&ball.t/ball.duration>=.66){
  const helpers=players.filter(p=>p.team===ball.target.team&&p!==ball.target&&[1,5,6].includes(p.zone)).sort((a,b)=>Math.hypot(a.x-ball.target.x,a.y-ball.target.y)-Math.hypot(b.x-ball.target.x,b.y-ball.target.y));
  confuse(ball,'float',[ball.target,...helpers.slice(0,1)]);
 }else if(effect.skill.id==='sync-attack'&&effect.outgoing===ball&&ball.kind==='attack'&&!ball.attackPending){
  // The native resolver has already awarded the attack: a visual reaction never
  // turns a successful defense into a point or changes the match RNG.
  confuse(ball,'sync-attack',players.filter(p=>p.team!==effect.team));
 }
}
function advance(dt){
 prepareServe();
 window.MatchMotion?.beforeStep();originalTick(dt);clock+=dt;
 planMovement();updateReactions();updateFocus();
 for(let i=active.length-1;i>=0;i--)if(active[i].until<clock)active.splice(i,1);
 if(!active.length&&!focus)label.hidden=true;
 for(const p of players){const entry=motion.get(p.index);if(!entry||clock-entry.at>.8)motion.set(p.index,{x:p.x,y:p.y,at:clock});}
}
tick=function(dt){
 if(!enabled||!leagueEnabled()||suppressed){window.MatchMotion?.beforeStep();originalTick(dt);visualRate=1;return;}
 if(paused||!ready||document.hidden){if(focus)sound('skill-slow-stop');originalTick(dt);return;}
 let factor=1;if(focus){const speed=Number($('speed').value)||1;focus.age+=dt/speed;const progress=focus.flight?limit(focus.flight.t/Math.max(.001,focus.flight.duration)):0,enter=limit(focus.age/.12),leave=limit((progress-.4)/.1);factor=1-.62*enter*(1-leave);}
 visualRate=factor;carry+=dt*factor;let safety=0;while(carry+1e-10>=1/60&&safety++<20){advance(1/60);carry-=1/60;}
};
function effectFor(p){for(let i=active.length-1;i>=0;i--)if(active[i].actor===p.index)return active[i];return null;}
playerLayout=function(p){const e=canShow()?effectFor(p):null,age=e?clock-e.contact:99;if(e&&age>=-.3&&age<.48&&['one-hand-rescue','ghost-tip'].includes(e.skill.id)){const side=e.side||'right';return LAYOUT.filter(part=>!part.id.startsWith('arm-')&&part.id!=='sleeve-'+side).concat(TOSS_LAYOUT.filter(part=>part.id==='arm-'+side||part.id==='sleeve-'+side));}return originalLayout(p);};
drawPlayer=function(p){
 if(!enabled||!leagueEnabled()||suppressed||p.index>=12){originalPlayer(p);return;}const saved={jump:p.jump,spike:p.spike,approach:p.approach,toss:p.toss,receive:p.receive,angle:p.angle,moving:p.moving,phase:p.phase,block:p.block},e=effectFor(p);
 try{
  if(e){const age=clock-e.contact;
   if(['one-hand-rescue','ghost-tip'].includes(e.skill.id)&&age>=-.3&&age<.48){p.toss=Math.max(p.toss,.1);p.spike=0;}
   if(e.skill.id==='dive'&&age<.4)p.receive=Math.max(p.receive,.1);
   if(['jump','jump-legendary','jump-float-legendary'].includes(e.skill.id)){const start=e.contact-.42,u=limit((clock-start)/.65);if(u>0&&u<1){p.jump=.5*(1-u);p.spike=.65*(1-u);}}
  }
  for(const group of active)if(group.skill.id==='sync-attack'&&group.members?.includes(p.index)){
   const age=clock-group.leapStart;if(Number.isFinite(group.leapStart)&&age>=0&&age<.65){p.jump=Math.max(0,.5-age);p.spike=Math.max(0,.65-age);p.toss=0;p.block=0;p.approach=false;}else if(group.setFlight===ball&&p.moving)p.approach=true;
  }
  const reaction=reactions.get(p.index);if(reaction){const age=clock-reaction.start,fade=limit((reaction.until-clock)/.25);if(age>=0){p.angle+=Math.sin(age*13+reaction.phase)*.48*fade;p.moving=age<.2||age>.42;p.phase+=Math.sin(age*17)*.45;if(p.jump<=0){p.approach=false;p.spike=0;p.toss=0;p.receive=age>.42?.18:0;}}}
  originalPlayer(p);
 }finally{Object.assign(p,saved);}
};
function ring(x,y,t,color,r=23){if(t<=0||t>=1)return;ctx.save();ctx.globalAlpha=(1-t)*.58;ctx.lineWidth=1.6;ctx.strokeStyle=color;ctx.beginPath();ctx.ellipse(x,y,8+t*r,5+t*r*.7,0,0,TAU);ctx.stroke();ctx.restore();}
function line(points,color,alpha=.5,dash=[]){ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=1.6;ctx.lineCap='round';ctx.setLineDash(dash);ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();ctx.restore();}
function particles(x,y,t,color){if(t<=0||t>=1)return;ctx.save();ctx.globalAlpha=(1-t)*.7;for(let i=0;i<4;i++){const a=i*TAU/4+.3,r=7+t*16;line([{x:x+Math.cos(a)*r,y:y+Math.sin(a)*r},{x:x+Math.cos(a)*(r+4),y:y+Math.sin(a)*(r+4)}],color,(1-t)*.65);}ctx.restore();}
function aimMarker(effect){if(!effect.aim)return;const {x,y}=effect.aim;ctx.save();const fade=limit((effect.until-clock)/.3);ctx.globalAlpha=.78*fade;ctx.strokeStyle='#f7e6b2';ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(x,y,18,0,TAU);ctx.stroke();ctx.strokeStyle='#5b7161';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,22,0,TAU);ctx.stroke();for(let i=0;i<4;i++){const a=i*TAU/4;ctx.beginPath();ctx.moveTo(x+Math.cos(a)*12,y+Math.sin(a)*12);ctx.lineTo(x+Math.cos(a)*27,y+Math.sin(a)*27);ctx.strokeStyle='#f7e6b2';ctx.lineWidth=1.8;ctx.stroke();}ctx.fillStyle='#f7e6b2';ctx.beginPath();ctx.arc(x,y,2,0,TAU);ctx.fill();ctx.restore();}
function paintEffects(){
 if(focus){const p=players.find(p=>p.index===focus.actor);if(p){const progress=focus.flight?limit(focus.flight.t/Math.max(.001,focus.flight.duration)):0,strength=Math.min(1,focus.age/.16,1-limit((progress-.4)/.1));ctx.save();ctx.fillStyle='rgba(12,25,32,'+(.56*strength)+')';ctx.fillRect(0,0,1000,620);const glow=ctx.createRadialGradient(p.x,p.y-14,3,p.x,p.y-14,43);glow.addColorStop(0,'rgba(244,219,153,'+(.23*strength)+')');glow.addColorStop(1,'rgba(244,219,153,0)');ctx.fillStyle=glow;ctx.fillRect(p.x-45,p.y-60,90,100);drawPlayer(p);if(Number.isFinite(ball.x)){const image=ballSprites[$('ballStyle').value]||ballSprites['ball_volley1.png'];if(image){ctx.save();ctx.translate(ball.x,ball.y-(ball.z||0));ctx.rotate(elapsed*3);ctx.drawImage(image,-9,-9,18,18);ctx.restore();}}ctx.restore();}}
 for(const e of active){const p=players.find(p=>p.index===e.actor);if(!p)continue;const t=limit((clock-e.contact)/.65),gold=e.skill.rarity==='Legendary',color=gold?'#efda9b':e.skill.rarity==='Epic'?'#d9bfe5':p.team?'#edd5b7':'#d7e6c1';
  aimMarker(e);
  ring(p.x,p.y+2,t,color,e.kind==='block'?25:17);
  if(['wipe','jump-legendary','ghost-tip'].includes(e.skill.id))particles(p.x,p.y-18,t,color);
  if(e.skill.id==='breath')ring(p.x,p.y+2,limit((clock-e.contact-.2)/.8),'#c7dfb6',29);
  if(e.kind==='block'&&t>0&&t<1){const y=ball.netY??p.y;line([{x:p.x+12*(p.team?-1:1),y:y-13},{x:p.x+12*(p.team?-1:1),y:y+13}],color,(1-t)*.65);}
  if(e.skill.id==='cover'&&t>0&&t<1){line([{x:p.x-8,y:p.y-19},{x:p.x,y:p.y-24},{x:p.x+8,y:p.y-19},{x:p.x+5,y:p.y-7},{x:p.x,y:p.y-3},{x:p.x-5,y:p.y-7},{x:p.x-8,y:p.y-19}],color,(1-t)*.6);}
  if(['read','absolute-read'].includes(e.skill.id)&&t<1){ctx.save();ctx.globalAlpha=(1-t)*.65;ctx.strokeStyle=color;ctx.lineWidth=1.4;ctx.beginPath();ctx.ellipse(p.x,p.y-28,8,4,0,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(p.x,p.y-28,2,0,TAU);ctx.stroke();ctx.restore();}
  if(e.skill.id==='sync-attack')for(const index of e.members||[]){const ally=players.find(p=>p.index===index);if(ally)ring(ally.x,ally.y+3,limit((clock-(e.leapStart??clock))/.65),'#cbdde0',13);}
  if(e.flight===ball&&trace.length>1&&['serve','attack','set'].includes(e.kind))line(trace,color,['float','jump-float-legendary'].includes(e.skill.id)?.35:.28,['float','jump-float-legendary'].includes(e.skill.id)?[3,5]:[]);
 }
}
function drawEffects(){
 if(!enabled||!leagueEnabled()||suppressed){originalDraw();return;}const flight=ball,saved={x:flight.x,y:flight.y,z:flight.z};const e=active.find(e=>e.flight===flight),u=flight.state==='flight'?limit(flight.t/flight.duration):0;
 try{
  if(e&&['float','jump-float-legendary'].includes(e.skill.id)&&flight.state==='flight'){const fade=Math.sin(u*Math.PI);flight.y+=(Math.sin(u*24)*20+Math.sin(u*11)*8)*fade;flight.z+=Math.sin(u*17)*5*fade;if(e.skill.id==='jump-float-legendary'){const rise=limit(u/.34),drop=limit((u-.78)/.22),smooth=drop*drop*(3-2*drop),height=18+42*rise*rise*(3-2*rise);flight.z=height*(1-smooth)+(flight.miss?2:18)*smooth;flight.y+=Math.sin(u*39)*9*fade*(1-drop);}}
  if(e?.skill.id==='jump-float-legendary'&&flight.state==='drop')flight.z=Math.max(0,2-flight.t*25);
  if(e?.skill.id==='ghost-tip'&&flight.state==='flight')flight.z+=Math.sin(u*Math.PI)*22;
  if(lastBall!==flight){trace.length=0;lastBall=flight;}if(flight.state==='flight'&&Number.isFinite(flight.x)){trace.push({x:flight.x,y:flight.y-(flight.z||0)});if(trace.length>5)trace.shift();}else trace.length=0;
  originalDraw();if(ready)paintEffects();
 }finally{Object.assign(flight,saved);}
};
draw=function(){
 const time=clock,alpha=paused?1:limit((carry+Math.max(0,frameCarry)*visualRate)/(1/60));
 try{if(window.MatchMotion&&!paused)clock-=((1-alpha)/60);return window.MatchMotion?MatchMotion.render(alpha,drawEffects):drawEffects();}
 finally{clock=time;}
};
awardPoint=function(winner){resetEffects();return originalAward(winner);};
reset=function(){resetEffects();clock=0;cooldown=0;legendaryUntil=0;legendaryUsed=false;focusEvents.length=0;lastSkill='';events.length=0;return originalReset();};
window.addEventListener('message',e=>{if(e.source===parent&&e.data?.type==='spiker-match'&&e.data.action==='skip'){suppressed=true;resetEffects();}});
window.addEventListener('blur',()=>sound('skill-slow-stop'));document.addEventListener('visibilitychange',()=>{if(document.hidden)sound('skill-slow-stop');});
window.MatchSkills={catalog:definitions,setEnabled(value){enabled=!!value;resetEffects();},get focusEvents(){return focusEvents.map(e=>({...e}));},get events(){return events.map(e=>({...e}));},get state(){return {enabled:enabled&&leagueEnabled(),suppressed,legendaryUsed,active:active.map(e=>({id:e.skill.id,actor:e.actor,kind:e.kind})),reactions:[...reactions.values()].map(r=>({actor:r.actor,reason:r.reason})),synchronized:active.filter(e=>e.skill.id==='sync-attack').map(e=>({hitter:e.hitter,members:[...e.members],leaping:Number.isFinite(e.leapStart)&&clock-e.leapStart<.5})),aims:active.filter(e=>e.aim).map(e=>({id:e.skill.id,...e.aim})),slow:!!focus,focusSkill:focus?.skill.id,focusActor:focus?.actor,focusPhase:focus?.flight?'outbound':focus?'preparation':null,focusProgress:focus?.flight?focus.flight.t/Math.max(.001,focus.flight.duration):null,clock};}};
})();
