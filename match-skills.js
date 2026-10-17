(function(){
'use strict';
// Temporary contextual skill activation. Uses a separate RNG from match resolution.
const definitions=[
 ['cross','Çapraz Hücum','Common'],['platform','Sağlam Manşet','Common'],['quick','Hızlı Pas','Common'],['breath','Ralli Dayanıklılığı','Common'],['calm','Sakin Karşılama','Common'],['tempo-third','Third Tempo','Common'],
 ['read','Hücum Okuma','Uncommon'],['float','Yüzen Servis','Uncommon'],['line','Çizgi Smaçı','Uncommon'],['back','Geriye Pas','Uncommon'],['cover','Hücum Sigortası','Uncommon'],['tempo-second','Second Tempo','Uncommon'],
 ['wipe','Bloktan Sektirme','Rare'],['roof','Duvar Blok','Rare'],['close','Fileyi Kapat','Rare'],['jump','Sıçrayarak Servis','Rare'],['dive','Plonjon','Rare'],['deceive','Aldatıcı Pas','Rare'],['sync-attack','Senkronize Atak','Rare'],
 ['tempo-first','First Tempo · Quick','Epic'],['tempo-minus','Minus Tempo','Legendary'],['absolute-read','Kusursuz Hücum Okuma','Legendary'],['jump-legendary','Yıldırım Smaç Servis','Legendary'],['perfect-second-touch','Kusursuz İkinci Dokunuş','Legendary'],['one-hand-rescue','Tek El Mucizesi','Legendary'],['ghost-tip','Hayalet Plase','Legendary']
].map(([id,name,rarity])=>({id,name,rarity}));
const catalog=new Map(definitions.map(s=>[s.id,s])),weights={Common:5,Uncommon:4,Rare:3,Epic:1.8,Legendary:1.1};
let enabled=true,suppressed=false,clock=0,carry=0,cooldown=0,legendaryUntil=0,lastSkill='',focus=null,servePlan=null,seed='',random=MatchRules.seeded('skill-effects'),lastBall=null,approachPlan=null,rallyStart=0;
const active=[],events=[],incoming=new WeakMap(),motion=new Map(),trace=[];
const originalLaunch=launch,originalNet=resolveNetContact,originalTick=tick,originalDraw=draw,originalPlayer=drawPlayer,originalLayout=playerLayout,originalGoal=playerGoal,originalReset=reset,originalAward=awardPoint;
const nativeCourt=court,courtCache=document.createElement('canvas');courtCache.width=1000;courtCache.height=620;let courtCached=false;court=function(){if(!courtCached){nativeCourt();courtCache.getContext('2d').drawImage(canvas,0,0);courtCached=true;}else ctx.drawImage(courtCache,0,0);};
const label=document.createElement('div');label.id='matchSkillNotice';label.hidden=true;label.setAttribute('role','status');label.setAttribute('aria-live','polite');label.innerHTML='<span></span><strong></strong><small></small>';document.querySelector('.court-space').append(label);
const limit=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),role=p=>p?.stats?.role||p?.roster?.role,number=p=>p?.index;
const sound=action=>{if(parent!==window)parent.postMessage({type:'spiker-audio',action},'*');else if(action==='skill-slow')window.GameAudio?.skillSlow?.();else window.GameAudio?.stopSkillSlow?.();};
function canShow(){return enabled&&!suppressed&&!document.hidden&&!scenario&&!formationPreview&&!serviceGame;}
function resetEffects(){active.length=0;trace.length=0;motion.clear();servePlan=null;approachPlan=null;focus=null;carry=0;lastBall=null;label.hidden=true;sound('skill-slow-stop');}
function eligible(ids){return ids.map(id=>catalog.get(id)).filter(s=>s&&s.id!==lastSkill&&(s.rarity!=='Legendary'||clock>=legendaryUntil));}
function pickSkill(ids){const nextSeed=window.matchInfo?.fixtureId||String(window.matchInfo?.round||1);if(seed!==nextSeed){seed=nextSeed;random=MatchRules.seeded('skills-'+seed);}if(!canShow()||clock<cooldown||random()>.60)return null;const choices=eligible(ids);if(!choices.length)return null;let n=random()*choices.reduce((sum,s)=>sum+weights[s.rarity],0);for(const s of choices){n-=weights[s.rarity];if(n<=0)return s;}return choices.at(-1);}
function startFocus(effect){if(focus||effect.skill.rarity!=='Legendary'||!canShow()||paused)return;focus={actor:effect.actor,skill:effect.skill,age:0,duration:1.2};sound('skill-slow');}
function trigger(skill,actor,kind,flight=ball,extra={}){
 if(!skill||!actor||!canShow())return null;
 const effect={skill,actor:number(actor),team:actor.team,kind,start:clock,contact:clock,until:clock+1.5,flight,...extra};active.push(effect);if(active.length>5)active.shift();lastSkill=skill.id;cooldown=clock+1.7;
 if(skill.rarity==='Legendary')legendaryUntil=clock+14;
 events.push({id:skill.id,actor:actor.index,role:role(actor),kind,at:clock,team:actor.team});if(events.length>80)events.shift();
 label.dataset.rarity=skill.rarity.toLowerCase();label.children[0].textContent=skill.rarity;label.children[1].textContent=skill.name;label.children[2].textContent=commentaryName(actor);label.hidden=false;
 if(!extra.prepared)startFocus(effect);return effect;
}
function servePool(p){return role(p)==='libero'?['float']:['float','jump','jump-legendary'];}
function prepareServe(){if(!canShow()||ball.state!=='wait'||!ball.serviceAuthorized||ball.timer>.58||ball.timer<=0||servePlan?.waiting===ball)return;const p=serverPlayer(),skill=pickSkill(servePool(p));if(!skill){servePlan={waiting:ball,effect:null};return;}const effect=trigger(skill,p,'serve',null,{prepared:true,contact:clock+ball.timer,until:clock+ball.timer+2.5});servePlan={waiting:ball,effect};}
function safeDuration(flight,wanted,margin=.42){const target=flight.target,distance=Math.hypot(target.x-flight.targetX,target.y-flight.targetY),minimum=distance/Math.max(1,movementSpeed(target))+margin;return Math.max(wanted,minimum);}
playerGoal=function(p){if(enabled&&!suppressed&&approachPlan?.flight===ball&&approachPlan.actor===p.index&&ball.state==='flight'&&ball.touch===2&&!ball.miss)return attackPoint(p);return originalGoal(p);};
launch=function(from,target,touch,kind='pass'){
 const previous=ball,info=incoming.get(previous),previousOutcome=previous?.outcome;
 originalLaunch(from,target,touch,kind);
 incoming.set(ball,{distance:Math.hypot(target.x-ball.targetX,target.y-ball.targetY),previousKind:kind});
 if(!canShow())return;
 if(touch===2&&!ball.miss&&role(target)==='setter'){const choices=players.filter(p=>p.team===target.team&&p!==target&&frontRow(p)&&!['setter','libero'].includes(role(p)));approachPlan=choices.length&&random()<.6?{flight:ball,actor:choices[Math.floor(random()*choices.length)].index}:null;}else approachPlan=null;
 const currentSeed=window.matchInfo?.fixtureId||String(window.matchInfo?.round||1);if(seed!==currentSeed){seed=currentSeed;random=MatchRules.seeded('skills-'+seed);}
 let skill=null,effect=null;
 if(kind==='serve'){
  rallyStart=clock;effect=servePlan?.effect;servePlan=null;
  if(effect){effect.flight=ball;effect.contact=clock;}else skill=pickSkill(servePool(from));
  if(skill)effect=trigger(skill,from,'serve',ball);
  if(effect?.skill.id==='jump-legendary'){ball.duration=safeDuration(ball,1.05,.28);effect.until=clock+ball.duration+.3;}
 }else if(touch===2){
  const pool=['calm'];if(!role(from)||['libero','outside'].includes(role(from)))pool.push('platform');if(role(from)==='libero'&&(info?.distance||0)>32)pool.push('dive');if(previous.kind==='block'||previous.startZ)pool.push('cover');if(clock-rallyStart>8)pool.push('breath');skill=pickSkill(pool);if(skill)trigger(skill,from,'receive',ball,{incomingKind:previous.kind});
 }else if(touch===3){
  const distance=Math.hypot(target.x-ball.targetX,target.y-ball.targetY),pool=['quick','tempo-third','tempo-second'];
  if(Math.abs(ball.targetY-from.y)>70)pool.push('back','deceive');if(distance<170)pool.push('tempo-first');if(distance<24&&role(target)!=='libero')pool.push('tempo-minus');
  if((info?.distance||0)>25||(Number.isFinite(from.contactQuality)&&from.contactQuality<.65))pool.push('perfect-second-touch','one-hand-rescue');const members=players.filter(p=>p.team===from.team&&frontRow(p)&&p!==from&&p!==target&&role(p)!=='libero'&&Math.hypot(p.x-attackPoint(p).x,p.y-attackPoint(p).y)<190).slice(0,2).map(number);if(members.length)pool.push('sync-attack');
  skill=pickSkill(pool);if(skill){effect=trigger(skill,from,'set',ball,{hitter:target.index,members});if(skill.id==='tempo-third')ball.duration=Math.max(ball.duration,1.9);if(skill.id==='tempo-second')ball.duration=safeDuration(ball,1.4);if(skill.id==='tempo-first')ball.duration=safeDuration(ball,.9);if(skill.id==='tempo-minus'){ball.duration=.50;ball.spikePrepared=true;target.spike=.65;target.jump=.5;}if(ball.runStart)ball.runDuration=Math.max(.05,ball.duration-.38);effect.until=clock+ball.duration+.45;}
 }else if(kind==='attack'){
  const pool=['cross','line'];if(Math.hypot(ball.targetX-from.x,ball.targetY-from.y)<410&&!previousOutcome?.winner)pool.push('ghost-tip');skill=pickSkill(pool);if(skill){effect=trigger(skill,from,'attack',ball);if(skill.id==='ghost-tip')ball.duration=Math.max(ball.duration,1.3);effect.until=clock+ball.duration+.15;}
 }
};
resolveNetContact=function(){
 const before=ball,attacker=ball.attacker;originalNet();if(!canShow()||!['block','block-touch'].includes(ball.outcome?.event))return;
 const entry=history.at(-1);if(entry?.type!=='block-contact')return;const blockers=(entry.players||[]).map(index=>players.find(p=>p.index===index)).filter(Boolean);if(!blockers.length)return;
 const main=blockers.find(p=>role(p)==='middle')||blockers[0],pool=['roof','read'];if(blockers.length>1)pool.push('close');
 const path=motion.get(main.index),changed=path&&Math.abs(main.y-path.y)>24,other=players.some(p=>p.team===main.team&&frontRow(p)&&p!==main&&Math.abs(p.y-ball.y)>65);if(other&&(changed||blockers.length===1)&&ball.outcome.event==='block')pool.push('absolute-read');
 const skill=pickSkill(pool);if(skill)trigger(skill,main,'block',ball,{members:blockers.map(number)});
 if(ball.outcome.event==='block-touch'&&attacker&&random()<.3){const wipe=pickSkill(['wipe']);if(wipe)trigger(wipe,attacker,'attack',before);}
};
function advance(dt){
 prepareServe();if(servePlan?.effect?.prepared&&!focus&&clock>=servePlan.effect.contact-.12){servePlan.effect.prepared=false;startFocus(servePlan.effect);}
 originalTick(dt);clock+=dt;
 for(let i=active.length-1;i>=0;i--)if(active[i].until<clock)active.splice(i,1);
 if(!active.length&&!focus)label.hidden=true;
 for(const p of players){const entry=motion.get(p.index);if(!entry||clock-entry.at>.8)motion.set(p.index,{x:p.x,y:p.y,at:clock});}
}
tick=function(dt){
 if(!enabled||suppressed){originalTick(dt);return;}
 if(paused||!ready||document.hidden){if(focus)sound('skill-slow-stop');originalTick(dt);return;}
 let factor=1;if(focus){const speed=Number($('speed').value)||1;focus.age+=dt/speed;const u=limit(focus.age/focus.duration),edge=Math.min(u/.12,(1-u)/.16,1);factor=1-.68*limit(edge);if(focus.age>=focus.duration){focus=null;sound('skill-slow-stop');}}
 carry+=dt*factor;let safety=0;while(carry+1e-10>=1/60&&safety++<20){advance(1/60);carry-=1/60;}
};
function effectFor(p){for(let i=active.length-1;i>=0;i--)if(active[i].actor===p.index)return active[i];return null;}
playerLayout=function(p){const e=effectFor(p),age=e?clock-e.contact:99;if(e&&age>=-.1&&age<.48&&['one-hand-rescue','ghost-tip'].includes(e.skill.id)){const side=e.side||'right';return LAYOUT.filter(part=>!part.id.startsWith('arm-')&&part.id!=='sleeve-'+side).concat(TOSS_LAYOUT.filter(part=>part.id==='arm-'+side||part.id==='sleeve-'+side));}return originalLayout(p);};
drawPlayer=function(p){
 if(!enabled||suppressed||p.index>=12){originalPlayer(p);return;}const saved={jump:p.jump,spike:p.spike,approach:p.approach,toss:p.toss,receive:p.receive},e=effectFor(p);
 try{
  if(e){const age=clock-e.contact;
   if(['one-hand-rescue','ghost-tip'].includes(e.skill.id)&&age>=-.1&&age<.48){p.toss=Math.max(p.toss,.1);p.spike=0;}
   if(e.skill.id==='dive'&&age<.4)p.receive=Math.max(p.receive,.1);
   if(['jump','jump-legendary'].includes(e.skill.id)){const start=e.contact-.42,u=limit((clock-start)/.65);if(u>0&&u<1){p.jump=.5*(1-u);p.spike=.65*(1-u);}}
  }
  for(const group of active)if(group.skill.id==='sync-attack'&&group.members?.includes(p.index)&&group.flight===ball&&Math.hypot(p.x-attackPoint(p).x,p.y-attackPoint(p).y)<100){if(p.moving)p.approach=true;if(ball.target?.jump>0){p.jump=ball.target.jump;p.spike=Math.min(.5,ball.target.spike||0);}}
  originalPlayer(p);
 }finally{Object.assign(p,saved);}
};
function ring(x,y,t,color,r=23){if(t<=0||t>=1)return;ctx.save();ctx.globalAlpha=(1-t)*.58;ctx.lineWidth=1.6;ctx.strokeStyle=color;ctx.beginPath();ctx.ellipse(x,y,8+t*r,5+t*r*.7,0,0,TAU);ctx.stroke();ctx.restore();}
function line(points,color,alpha=.5,dash=[]){ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=1.6;ctx.lineCap='round';ctx.setLineDash(dash);ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();ctx.restore();}
function particles(x,y,t,color){if(t<=0||t>=1)return;ctx.save();ctx.globalAlpha=(1-t)*.7;for(let i=0;i<4;i++){const a=i*TAU/4+.3,r=7+t*16;line([{x:x+Math.cos(a)*r,y:y+Math.sin(a)*r},{x:x+Math.cos(a)*(r+4),y:y+Math.sin(a)*(r+4)}],color,(1-t)*.65);}ctx.restore();}
function paintEffects(){
 if(focus){const p=players.find(p=>p.index===focus.actor);if(p){const t=limit(focus.age/focus.duration),strength=Math.min(1,t/.15,(1-t)/.18);ctx.save();ctx.fillStyle='rgba(12,25,32,'+(.56*strength)+')';ctx.fillRect(0,0,1000,620);const glow=ctx.createRadialGradient(p.x,p.y-14,3,p.x,p.y-14,43);glow.addColorStop(0,'rgba(244,219,153,'+(.23*strength)+')');glow.addColorStop(1,'rgba(244,219,153,0)');ctx.fillStyle=glow;ctx.fillRect(p.x-45,p.y-60,90,100);drawPlayer(p);if(Number.isFinite(ball.x)){const image=ballSprites[$('ballStyle').value]||ballSprites['ball_volley1.png'];if(image){ctx.save();ctx.translate(ball.x,ball.y-(ball.z||0));ctx.rotate(elapsed*3);ctx.drawImage(image,-9,-9,18,18);ctx.restore();}}ctx.restore();}}
 for(const e of active){const p=players.find(p=>p.index===e.actor);if(!p)continue;const t=limit((clock-e.contact)/.65),gold=e.skill.rarity==='Legendary',color=gold?'#efda9b':e.skill.rarity==='Epic'?'#d9bfe5':p.team?'#edd5b7':'#d7e6c1';
  ring(p.x,p.y+2,t,color,e.kind==='block'?25:17);
  if(['wipe','jump-legendary','ghost-tip'].includes(e.skill.id))particles(p.x,p.y-18,t,color);
  if(e.skill.id==='breath')ring(p.x,p.y+2,limit((clock-e.contact-.2)/.8),'#c7dfb6',29);
  if(e.kind==='block'&&t>0&&t<1){const y=ball.netY??p.y;line([{x:p.x+12*(p.team?-1:1),y:y-13},{x:p.x+12*(p.team?-1:1),y:y+13}],color,(1-t)*.65);}
  if(e.skill.id==='cover'&&t>0&&t<1){line([{x:p.x-8,y:p.y-19},{x:p.x,y:p.y-24},{x:p.x+8,y:p.y-19},{x:p.x+5,y:p.y-7},{x:p.x,y:p.y-3},{x:p.x-5,y:p.y-7},{x:p.x-8,y:p.y-19}],color,(1-t)*.6);}
  if(['read','absolute-read'].includes(e.skill.id)&&t<1){ctx.save();ctx.globalAlpha=(1-t)*.65;ctx.strokeStyle=color;ctx.lineWidth=1.4;ctx.beginPath();ctx.ellipse(p.x,p.y-28,8,4,0,0,TAU);ctx.stroke();ctx.beginPath();ctx.arc(p.x,p.y-28,2,0,TAU);ctx.stroke();ctx.restore();}
  if(e.skill.id==='sync-attack')for(const index of e.members||[]){const ally=players.find(p=>p.index===index);if(ally)ring(ally.x,ally.y+3,t,'#cbdde0',13);}
  if(e.flight===ball&&trace.length>1&&['serve','attack','set'].includes(e.kind))line(trace,color,e.skill.id==='float'?.35:.28,e.skill.id==='float'?[3,5]:[]);
 }
}
draw=function(){
 if(!enabled||suppressed){originalDraw();return;}const flight=ball,saved={x:flight.x,y:flight.y,z:flight.z};const e=active.find(e=>e.flight===flight),u=flight.state==='flight'?limit(flight.t/flight.duration):0;
 try{
  if(e?.skill.id==='float'&&flight.state==='flight'){const fade=Math.sin(u*Math.PI);flight.y+=(Math.sin(u*24)*20+Math.sin(u*11)*8)*fade;flight.z+=Math.sin(u*17)*5*fade;}
  if(e?.skill.id==='ghost-tip'&&flight.state==='flight')flight.z+=Math.sin(u*Math.PI)*22;
  if(lastBall!==flight){trace.length=0;lastBall=flight;}if(flight.state==='flight'&&Number.isFinite(flight.x)){trace.push({x:flight.x,y:flight.y-(flight.z||0)});if(trace.length>5)trace.shift();}else trace.length=0;
  originalDraw();if(ready)paintEffects();
 }finally{Object.assign(flight,saved);}
};
awardPoint=function(winner){resetEffects();return originalAward(winner);};
reset=function(){resetEffects();clock=0;cooldown=0;legendaryUntil=0;lastSkill='';events.length=0;return originalReset();};
window.addEventListener('message',e=>{if(e.source===parent&&e.data?.type==='spiker-match'&&e.data.action==='skip'){suppressed=true;resetEffects();}});
window.addEventListener('blur',()=>sound('skill-slow-stop'));document.addEventListener('visibilitychange',()=>{if(document.hidden)sound('skill-slow-stop');});
window.MatchSkills={catalog:definitions,setEnabled(value){enabled=!!value;resetEffects();},get events(){return events.map(e=>({...e}));},get state(){return {enabled,suppressed,active:active.map(e=>({id:e.skill.id,actor:e.actor,kind:e.kind})),slow:!!focus,clock};}};
})();
