(function(){
'use strict';
// Contextual player-owned skills. Uses a separate RNG from match resolution.
const definitions=[
 ['commit-block','Erken Blok','Common'],
 ['cross','Çapraz Smaç','Common'],['tempo-third','Üçüncü Tempo Hücum','Common'],
 ['pipe-attack','Pipe Attack','Uncommon'],['setter-dump','Pasör Plasesi','Rare'],['kick-save','Ayakla Kurtarış','Rare'],['slide-attack','Tek Ayak Hücumu','Uncommon'],['power-hit','Güçlü Vuruş','Uncommon'],['rebound','Bloktan Sektirme','Uncommon'],
 ['read','Okuma Bloğu','Uncommon'],['float','Yüzen Servis','Uncommon'],['line','Paralel Smaç','Common'],['back','Geri Pas','Uncommon'],['cover','Dublaj','Uncommon'],['tempo-second','İkinci Tempo Hücum','Uncommon'],
 ['wipe','Blok Aut','Uncommon'],['roof','Aktif Blok','Rare'],['close','İkili Blok','Uncommon'],['triple-block','Üçlü Blok','Uncommon'],['fake-set','Pasör Aldatmacası','Rare'],['sky-serve','Gökyüzü Servisi','Rare'],['jump','Smaç Servis','Rare'],['dive','Plonjon','Rare'],['deceive','Pas Aldatması','Rare'],['sync-attack','Kombine Hücum','Legendary'],
 ['tempo-first','Birinci Tempo Hücum','Epic'],['tempo-minus','Eksi Tempo Hücum','Legendary'],['absolute-read','Kusursuz Hücum Okuma','Legendary'],['jump-legendary','Yıldırım Smaç Servis','Legendary'],['jump-float-legendary','Jump Float','Legendary'],['perfect-second-touch','Zor Topa Pas','Legendary'],['one-hand-rescue','Tek Elle Pas','Legendary'],['pancake','Pancake','Legendary'],['ghost-tip','Hayalet Plase','Legendary']
].map(([id,name,rarity])=>({id,name,rarity}));
const catalog=new Map(definitions.map(s=>[s.id,s])),weights={Common:5,Uncommon:4,Rare:3,Epic:1.8,Legendary:1.1};
let enabled=true,suppressed=false,clock=0,carry=0,cooldown=0,legendaryUntil=0,lastSkill='',focus=null,servePlan=null,seed='',random=MatchRules.seeded('skill-effects'),lastBall=null,approachPlan=null,rallyStart=0,legendaryUsed=false,pendingSet=null,pendingAttack=null,pendingBlock=null,pendingSync=null,pendingDive=null,visualRate=1,serveLabelUntil=0,currentServe=null;const counterUntil=[0,0],overheadUntil=new Map();let impactHold=null,pancakeHold=null,currentNotice=null,noticeTimer=null;const completedNotices=[];const attempts=[];let rallyLegendaryCount=0,secondLegendaryAllowed=false;
const reactionIcons=new Map();
const knockbacks=new Map();
const active=[],events=[],focusEvents=[],incoming=new WeakMap(),planned=new WeakSet(),motion=new Map(),trace=[],reactions=new Map(),reacted=new WeakSet(),counterAttempts=new WeakSet();
const originalLaunch=launch,originalNet=resolveNetContact,originalTick=tick,originalDraw=draw,originalPlayer=drawPlayer,originalLayout=playerLayout,originalGoal=playerGoal,originalReset=reset,originalAward=awardPoint,originalAnnounce=announce;
const nativeCourt=court,courtCache=document.createElement('canvas');courtCache.width=1000;courtCache.height=620;let courtCached=false;court=function(){if(!courtCached){nativeCourt();courtCache.getContext('2d').drawImage(canvas,0,0);courtCached=true;}else ctx.drawImage(courtCache,0,0);};
const label=document.createElement('div');label.id='matchSkillNotice';label.hidden=true;label.setAttribute('role','status');label.setAttribute('aria-live','polite');label.innerHTML='<span></span><strong></strong><small></small>';document.querySelector('.court-space').append(label);
const limit=(v,a=0,b=1)=>Math.max(a,Math.min(b,v)),role=p=>p?.stats?.role||p?.roster?.role,number=p=>p?.index;
const sound=action=>{if(parent!==window)parent.postMessage({type:'spiker-audio',action},'*');else if(action==='skill-slow')window.GameAudio?.skillSlow?.();else if(action==='heartbeat')window.GameAudio?.heartbeat?.();else if(action==='heartbeat-stop')window.GameAudio?.stopHeartbeat?.();else window.GameAudio?.stopSkillSlow?.();};
function leagueEnabled(){return !!window.matchInfo?.epicTeam||[2,3].includes(Number(window.matchInfo?.division));}
function canShow(){return enabled&&leagueEnabled()&&!suppressed&&!document.hidden&&!scenario&&!formationPreview&&!serviceGame;}
function finishFocus(reason='cancelled'){if(focus){const f=focus.flight,progress=f?limit(f.t/Math.max(.001,f.duration)):null;focusEvents.push({id:focus.skill.id,reason,progress,age:focus.age});if(focusEvents.length>40)focusEvents.shift();}focus=null;sound('skill-slow-stop');if(!pendingDive?.heartbeatStarted)sound('heartbeat-stop');}
function resetEffects(preserveNotices=false){if(active.some(e=>e.ballGhosts))matchSound('hit',{kind:'whoosh-stop'});rallyLegendaryCount=0;secondLegendaryAllowed=false;knockbacks.clear();reactionIcons.clear();if(!preserveNotices){currentNotice=null;completedNotices.length=0;clearTimeout(noticeTimer);noticeTimer=null;}attempts.length=0;pancakeHold=null;document.body.classList.remove('skill-blackout');if(impactHold)impactHold.flight.impactFlash=0;impactHold=null;overheadUntil.clear();sound('heartbeat-stop');window.MatchMotion?.reset();window.MatchFrames?.invalidate();active.length=0;trace.length=0;motion.clear();servePlan=null;approachPlan=null;pendingSet=null;pendingAttack=null;pendingBlock=null;pendingSync=null;pendingDive=null;serveLabelUntil=0;currentServe=null;reactions.clear();finishFocus('reset');carry=0;lastBall=null;if(!preserveNotices)label.hidden=true;}
function owns(actor,id){if(!actor||!window.PlayerSkills)return false;if(actor.team===1&&catalog.get(id)?.rarity==='Legendary'){const unlocked=window.matchInfo?.opponentLegendaryUnlocked??PlayerSkills.teamHasLegendary(players.filter(p=>p.team===0).map(p=>p.roster||{...p.stats,skillCamps:0}),{division:window.matchInfo?.division});if(!unlocked)return false;}const p=actor.roster||{...actor.stats,id:'match-'+actor.team+'-'+actor.index,skillCamps:0};return PlayerSkills.allows(p,id,{division:window.matchInfo?.division});}
function canRallyLegendary(){return labShowcase()||rallyLegendaryCount===0||(rallyLegendaryCount===1&&secondLegendaryAllowed);}
function eligible(ids,actor){return ids.map(id=>catalog.get(id)).filter(s=>s&&owns(typeof actor==='function'?actor(s.id):actor,s.id)&&s.id!==lastSkill&&(s.rarity!=='Legendary'||(clock>=legendaryUntil&&canRallyLegendary())));}
function labShowcase(){return window.matchInfo?.animationLab===true&&new URLSearchParams(location.search).get('animationLab')==='legendary';}
function skillWeight(skill){return weights[skill.rarity]*(labShowcase()?(skill.rarity==='Legendary'?16:.5):1);}
function pickSkill(ids,actor){const nextSeed=window.matchInfo?.fixtureId||String(window.matchInfo?.round||1);if(seed!==nextSeed){seed=nextSeed;random=MatchRules.seeded('skills-'+seed);}if(!canShow()||!ids.length)return null;const choices=eligible(ids,actor);if(clock<cooldown||random()>(labShowcase()?.96:.60)||!choices.length)return null;let n=random()*choices.reduce((sum,s)=>sum+skillWeight(s),0);for(const s of choices){n-=skillWeight(s);if(n<=0)return s;}return choices.at(-1);}
function startFocus(effect){if(!effect||focus||effect.skill.rarity!=='Legendary'||!canShow()||paused)return;focus={actor:effect.actor,skill:effect.skill,effect,age:0,flight:null,route:null};if(effect.flight)bindFlight(effect,effect.flight);if(effect.skill.id!=='pancake')sound('skill-slow');else if(!effect.heartbeatStarted){effect.heartbeatStarted=true;sound('heartbeat');}}
function routeKey(f){return [f.kind,f.from?.x,f.from?.y,f.targetX,f.targetY].join('|');}
function bindFlight(effect,flight){if(effect.skill.id==='pancake'){sound('heartbeat-stop');pancakeHold={flight,actor:effect.actor,age:0};}creditFlight(effect,flight);effect.flight=flight;effect.contact=clock;effect.prepared=false;if(focus?.effect===effect){focus.flight=flight;focus.route=routeKey(flight);}}
function updateFocus(){if(!focus)return;const f=focus.flight;if(f){if(f!==ball){finishFocus('flight-replaced');return;}const route=routeKey(f);if(route!==focus.route)focus.route=route;if(f.state==='flight'&&f.t/Math.max(.001,f.duration)>=.5){finishFocus('halfway');return;}}else if(focus.effect.incoming&&(ball!==focus.effect.incoming||ball.state==='drop'))finishFocus('action-cancelled');}
function planAim(effect,actor){
 const options=players.filter(p=>p.team!==actor.team&&[1,5,6].includes(p.zone));if(!options.length)return;
 if(['ghost-tip','power-hit'].includes(effect.skill.id)){
  const x=effect.skill.id==='power-hit'?(actor.team?405:595):(actor.team?410:590),lanes=[actor.y-70,actor.y+70,actor.y].map(y=>limit(y,140,480));
  const y=lanes.sort((a,b)=>Math.min(...options.map(p=>Math.hypot(p.x-x,p.y-b)))-Math.min(...options.map(p=>Math.hypot(p.x-x,p.y-a))))[0];
  const target=[...options].sort((a,b)=>Math.hypot(a.x-x,a.y-y)-Math.hypot(b.x-x,b.y-y))[0];effect.aimTarget=target.index;effect.aim={x,y};
 }else{const target=options[Math.floor(random()*options.length)],goal=tacticalGoal(target);effect.aimTarget=target.index;effect.aim={x:limit(goal.x,90,910),y:limit(goal.y,90,530)};}
}
function renderNotice(effects,winner){clearTimeout(noticeTimer);currentNotice=effects[0];label.replaceChildren();for(const team of [0,1]){const stack=document.createElement('div');stack.className='match-skill-stack';stack.dataset.team=String(team);stack.dataset.result=team===winner?'won':'lost';for(const effect of effects.filter(e=>e.team===team)){const item=document.createElement('div');item.className='match-skill-item';item.dataset.rarity=effect.skill.rarity.toLowerCase();const title=document.createElement('strong'),actor=document.createElement('small');title.textContent=effect.skill.name;actor.textContent=effect.actorName;item.append(title,actor);stack.append(item);}if(stack.children.length)label.append(stack);}label.hidden=false;noticeTimer=setTimeout(()=>{label.hidden=true;currentNotice=null;noticeTimer=null;},2500);}
function completeNotice(effect){if(!effect||effect.noticeQueued||effect.prepared||clock<effect.contact)return;effect.noticeQueued=true;completedNotices.push(effect);}
function pumpNotices(afterPoint=false,winner=null){if(!afterPoint||!canShow()||!completedNotices.length)return;const batch=completedNotices.splice(0);renderNotice(batch,winner);}
function anticipate(effect){}
function failNotice(effect){if(effect)effect.failed=true;}
function resolveAttempt(flight){for(const e of attempts)if(!e.failed&&e.flight===flight&&['attack','serve','block'].includes(e.kind))failNotice(e);}
function creditFlight(effect,flight){if(flight&&effect.skill.rarity==='Legendary')flight.skillCredit={id:effect.skill.id,actor:effect.actor,team:effect.team};}
function trigger(skill,actor,kind,flight=ball,extra={}){
 if(!skill||!actor||!canShow()||!owns(actor,skill.id)||(skill.rarity==='Legendary'&&!canRallyLegendary()))return null;
 const effect={skill,actorName:commentaryName(actor),actor:number(actor),team:actor.team,kind,start:clock,contact:clock,until:clock+1.5,flight,...extra};active.push(effect);if(active.length>5)active.shift();lastSkill=skill.id;cooldown=clock+(labShowcase()?.65:1.7);
 if(skill.rarity==='Legendary'){rallyLegendaryCount++;if(rallyLegendaryCount===1&&!labShowcase())secondLegendaryAllowed=random()<.08;legendaryUntil=clock+(labShowcase()?2.2:14);legendaryUsed=true;}
 events.push({id:skill.id,actor:actor.index,role:role(actor),kind,at:clock,team:actor.team});if(events.length>80)events.shift();
 attempts.push(effect);anticipate(effect);
 if(!extra.prepared){creditFlight(effect,flight);startFocus(effect);}return effect;
}
announce=function(text){if(canShow()&&ball.kind==='attack'&&active.some(e=>e.skill.id==='ghost-tip'&&e.flight===ball)&&text===commentaryName(ball.attacker)+' smaç vuruyor!')text=commentaryName(ball.attacker)+' bloğun arkasına plase bırakıyor.';return originalAnnounce(text);};
function servePool(p){return role(p)==='libero'?['float']:['float','sky-serve','jump','jump-legendary','jump-float-legendary'];}
const serveTypes=[['short','Kısa Servis'],['deep','Derin Servis'],['seam','İki Oyuncunun Arasına Servis'],['zone','Belirli Bölgeye Servis'],['body','Vücuda Servis']];
function planServe(actor){
 const opponents=players.filter(p=>p.team!==actor.team),back=opponents.filter(p=>[1,5,6].includes(p.zone)),[id,name]=serveTypes[Math.floor(random()*serveTypes.length)];let goal,zone=null;
 if(id==='short')goal={x:actor.team?390:610,y:140+random()*340};
 if(id==='deep')goal={x:actor.team?140:860,y:140+random()*340};
 if(id==='seam'){const sorted=[...back].sort((a,b)=>a.y-b.y),i=Math.floor(random()*Math.max(1,sorted.length-1)),a=sorted[i]||opponents[0],b=sorted[i+1]||opponents[1];goal={x:(a.x+b.x)/2,y:(a.y+b.y)/2};}
 if(id==='zone'){zone=1+Math.floor(random()*6);const p=formation(1-actor.team,zone);goal={x:p.x,y:p.y};}
 if(id==='body'){const p=back[Math.floor(random()*back.length)]||opponents[0];goal={x:p.x,y:p.y};}
 goal={x:limit(goal.x,actor.team?110:550,actor.team?450:890),y:limit(goal.y,120,500)};const target=[...opponents].sort((a,b)=>Math.hypot(a.x-goal.x,a.y-goal.y)-Math.hypot(b.x-goal.x,b.y-goal.y))[0];return {id,name,zone,goal,target:target.index};
}
function showServe(effect,actor,placement){}
function prepareServe(){
 if(!canShow()||ball.state!=='wait'||!ball.serviceAuthorized||ball.timer>.9||ball.timer<=0||servePlan?.waiting===ball)return;
 const p=serverPlayer(),skill=pickSkill(servePool(p),p),placement=planServe(p),effect=skill?trigger(skill,p,'serve',null,{prepared:true,contact:clock+ball.timer,until:clock+ball.timer+2.5}):null;
 if(effect?.skill.id==='jump-legendary'){effect.readyStart=clock;effect.readyDuration=1.1;effect.start+=effect.readyDuration;effect.contact+=effect.readyDuration;effect.until+=effect.readyDuration;ball.timer+=effect.readyDuration;}
 if(effect&&['float','sky-serve','jump','jump-legendary','jump-float-legendary'].includes(skill.id))effect.runStart={x:p.x,y:p.y};servePlan={waiting:ball,effect,placement};
 if(effect?.skill.rarity==='Legendary'){effect.aim={...placement.goal};}showServe(effect,p,placement);startFocus(effect);
}
function safeDuration(flight,wanted,margin=.42){const target=flight.target,distance=Math.hypot(target.x-flight.targetX,target.y-flight.targetY),minimum=distance/Math.max(1,movementSpeed(target))+margin;return Math.max(wanted,minimum);}
playerGoal=function(p){
 if(canShow()){
  if(['pancake','kick-save'].includes(pendingDive?.skill.id)&&pendingDive.incoming===ball&&pendingDive.actor===p.index)return pendingDive.rescueGoal;
  const serving=servePlan?.effect;if(serving?.runStart&&serving.actor===p.index&&servePlan.waiting===ball){const u=limit((clock-serving.start-.18)/.44),ease=u*u*(3-2*u);return {x:serving.runStart.x+(p.team?-1:1)*30*ease,y:serving.runStart.y};}
  const reaction=reactions.get(p.index);
  if(reaction&&reaction.reason!=='lightning-score'){const age=clock-reaction.start;if(age>=0&&age<(reaction.reason==='deceive'?.48:.42)){const amount=reaction.reason==='deceive'?80:reaction.reason==='float'?Math.sin(age*15*reaction.pace)*reaction.reach*(1-limit(age/.65)):Math.sin(age*7*reaction.pace+reaction.phase)*reaction.reach;const lateral=reaction.reason==='float'?reaction.side*amount:amount;return {x:limit(reaction.x+reaction.dx*(reaction.reason==='float'?age*9:amount)-reaction.dy*lateral,p.team?550:80,p.team?920:450),y:limit(reaction.y+reaction.dy*(reaction.reason==='float'?age*9:amount)+reaction.dx*lateral,105,515)};}}
  if(pendingSync?.setFlight===ball&&pendingSync.members.includes(p.index)&&!ball.miss){const goal=pendingSync.lanes?.[p.index]||attackPoint(p),timing=pendingSync.timings[p.index],origin=pendingSync.origins[p.index],u=limit((clock-pendingSync.start-timing.approach)/(.68/timing.pace)),ease=u*u*(3-2*u);return {x:origin.x+((frontRow(p)?goal.x:p.team?720:280)-origin.x)*ease,y:origin.y+(goal.y-origin.y)*ease};}
  if(pendingAttack?.skill.id==='slide-attack'&&pendingAttack.actor===p.index&&pendingAttack.incoming===ball){const u=limit(ball.t/Math.max(.01,ball.duration-.25)),start=pendingAttack.slideStart;return {x:start.x+(ball.targetX-start.x)*u,y:start.y+(ball.targetY-start.y)*u};}
  if(approachPlan?.flight===ball&&approachPlan.actor===p.index&&ball.state==='flight'&&ball.touch===2&&!ball.miss)return attackPoint(p);
 }
 return originalGoal(p);
};

function powerBounceHeight(t){if(t<.28)return 0;if(t<.74)return Math.sin(limit((t-.28)/.46)*Math.PI/2)*190;if(t<.84)return (1-((t-.74)/.10)**2)*190;if(t<1.10)return Math.sin(limit((t-.84)/.26)*Math.PI)*24;return 0;}
function skillHeight(f,t=f.t){if(f.state==='drop'&&f.floorBounce)return groundBounceHeight(f,t);
 const u=limit(t/Math.max(.001,f.duration)),arc=f.skillArc;
 if(!arc)return Number.isFinite(f.z)?f.z:18;
 if(f.state==='drop')return arc.bounce&&f.outcome?.event==='kill'?powerBounceHeight(t):Math.max(0,arc.end-t*50);
 if(f.state!=='flight')return f.z||0;
 const lift=arc.style==='tip'?38*(1-u*.3):arc.style==='power'?6:arc.lift??45;
 return arc.start*(1-u)+arc.end*u+Math.sin(u*Math.PI)*lift;
}
function syncSkillHeight(f){if(!f.skillArc)return;f.z=skillHeight(f);f.visualScale=f.state==='drop'&&f.skillArc.bounce&&f.outcome?.event==='kill'?1+(f.t<.98?Math.sin(limit((f.t-.28)/.70)*Math.PI)*(f.skillArc.camera?2.6:.65):0):1;}
function refreshNet(f){if(f.kind!=='attack'||!f.attackPending)return;f.netTime=f.duration*limit((500-f.from.x)/(f.targetX-f.from.x),.02,.95);f.netY=f.from.y+(f.targetY-f.from.y)*(f.netTime/f.duration);f.blockPlan=blockPlan(f.target.team,f.netY);for(const p of players)if(p.team===f.target.team&&p.block>0){p.block=0;p.jump=0;}for(const goal of f.blockPlan){const p=players.find(p=>p.index===goal.index);if(p&&Math.hypot(p.x-goal.x,p.y-goal.y)<=180*f.netTime+42){p.jump=.5;p.block=Math.max(.5,f.netTime+.25);}}}

function pipeOption(setter){if(role(setter)!=='setter')return null;const middle=players.some(p=>p.team===setter.team&&frontRow(p)&&role(p)==='middle'&&Math.abs(p.y-310)<100),committed=players.filter(p=>p.team!==setter.team&&frontRow(p)&&Math.abs(p.x-500)<110&&Math.abs(p.y-310)<145).length;if(!middle||committed<2)return null;const actor=players.filter(p=>p.team===setter.team&&!frontRow(p)&&role(p)==='outside'&&owns(p,'pipe-attack')).sort((a,b)=>Math.hypot(a.x-(a.team?660:340),a.y-310)-Math.hypot(b.x-(b.team?660:340),b.y-310))[0];if(!actor)return null;const skill=pickSkill(['pipe-attack'],actor);return skill?{actor,skill}:null;}
function dumpOption(setter){if(role(setter)!=='setter'||!frontRow(setter)||pendingSet)return null;const candidates=[155,310,465].map(y=>({x:setter.team?430:570,y})),rivals=players.filter(p=>p.team!==setter.team);candidates.sort((a,b)=>Math.min(...rivals.map(p=>Math.hypot(p.x-b.x,p.y-b.y)))-Math.min(...rivals.map(p=>Math.hypot(p.x-a.x,p.y-a.y))));const goal=candidates[0];if(!goal||Math.min(...rivals.map(p=>Math.hypot(p.x-goal.x,p.y-goal.y)))<85)return null;const skill=pickSkill(['setter-dump'],setter);return skill?{skill,goal,target:rivals.sort((a,b)=>Math.hypot(a.x-goal.x,a.y-goal.y)-Math.hypot(b.x-goal.x,b.y-goal.y))[0]}:null;}
launch=function(from,target,touch,kind='pass'){
 if(!enabled||!leagueEnabled()||suppressed)return originalLaunch(from,target,touch,kind);
 const dump=canShow()&&touch===3&&kind==='pass'?dumpOption(from):null,pipe=!dump&&canShow()&&touch===3&&kind==='pass'&&!pendingSet?pipeOption(from):null;if(dump){kind='attack';touch=1;target=dump.target;}if(pipe)target=pipe.actor;
 let release=canShow()&&ball.state==='flight'?{x:ball.x,y:ball.y,z:pendingDive?.incoming===ball&&['pancake','kick-save'].includes(pendingDive.skill.id)?2:skillHeight(ball)}:null;
 if(pendingDive?.skill.id==='kick-save'&&pendingDive.actor===from.index&&window.MatchHair?.kickContact)release=MatchHair.kickContact(from);
 const previous=ball,info=incoming.get(previous),sync=kind==='attack'&&pendingSync?.setFlight===previous&&pendingSync.hitter===from.index?pendingSync:null;
 if(sync)release=strikeContact(from);
 if(kind==='serve'&&['float','jump','jump-legendary','jump-float-legendary'].includes(servePlan?.effect?.skill.id)){const oldJump=from.jump,oldSpike=from.spike,oldSwing=from.serveSwing;from.jump=servePlan?.effect?.skill.id==='float'?0:.25;from.spike=.35;from.serveSwing=0;release=strikeContact(from);from.jump=oldJump;from.spike=oldSpike;from.serveSwing=oldSwing;}
 const prepared=canShow()?(kind==='serve'?servePlan?.effect:kind==='attack'?pendingAttack?.incoming===previous&&pendingAttack.actor===from.index?pendingAttack:null:null):null;
 if(prepared?.aimTarget!==undefined){const intended=players.find(p=>p.index===prepared.aimTarget&&p.team!==from.team&&[1,5,6].includes(p.zone));if(intended)target=intended;}
 const placement=canShow()&&kind==='serve'?servePlan?.placement:null;if(placement)target=players.find(p=>p.index===placement.target)||target;
 const audio=matchSound,delayedSounds=[];
 try{matchSound=(action,detail)=>{const data=action==='hit'&&prepared?.skill.id==='ghost-tip'?{...detail,kind:'soft'}:detail;if(action==='hit')delayedSounds.push(()=>audio(action,data));else audio(action,data);};originalLaunch(from,target,touch,kind);}
 finally{matchSound=audio;}
 if(release&&(kind!=='serve'||['float','jump','jump-legendary','jump-float-legendary'].includes(servePlan?.effect?.skill.id))){ball.from={x:release.x,y:release.y};ball.x=release.x;ball.y=release.y;ball.z=release.z;ball.startZ=release.z;ball.skillArc={style:'normal',start:release.z,end:18,lift:kind==='attack'?45:touch===3?105:75};}
 if(placement&&ball.outcome?.event!=='serve-error'){ball.targetX=placement.goal.x;ball.targetY=placement.goal.y;ball.duration=safeDuration(ball,ball.duration,.25);}
 if(prepared&&['ghost-tip','power-hit'].includes(prepared.skill.id)){
  ball.targetX=prepared.aim.x;ball.targetY=prepared.aim.y;ball.duration=prepared.skill.id==='power-hit'?.34:safeDuration(ball,1.35,.22);
  ball.netTime=ball.duration*limit((500-from.x)/(ball.targetX-from.x),.02,.95);ball.netY=from.y+(ball.targetY-from.y)*(ball.netTime/ball.duration);
  ball.blockPlan=blockPlan(target.team,ball.netY);prepared.tipFrom={...ball.from};
 }
 if(pipe){ball.targetX=target.team?660:340;ball.targetY=310;ball.duration=safeDuration(ball,1.45,.3);ball.runDuration=Math.max(.1,ball.duration-.3);ball.blockPlan=blockPlan(1-target.team,310);}
 if(dump){ball.targetX=dump.goal.x;ball.targetY=dump.goal.y;ball.duration=safeDuration(ball,.9,.2);ball.netTime=ball.duration*limit((500-ball.from.x)/(ball.targetX-ball.from.x),.02,.95);ball.netY=ball.from.y+(ball.targetY-ball.from.y)*(ball.netTime/ball.duration);ball.blockPlan=blockPlan(target.team,ball.netY);ball.skillArc={style:'tip',start:release?.z??18,end:18,lift:20};announce(commentaryName(from)+' ikinci dokunuşta plase bırakıyor.');}
 incoming.set(ball,{origin:{x:target.x,y:target.y},distance:Math.hypot(target.x-ball.targetX,target.y-ball.targetY),previousKind:kind,quality:from.contactQuality});
 if(!canShow()){delayedSounds.forEach(play=>play());return;}resolveAttempt(previous);
 if(sync){pendingSync=null;sync.outgoing=ball;bindFlight(sync,ball);sync.attackAt=clock;sync.until=clock+ball.duration+1;}
 if(touch===2&&!ball.miss&&role(target)==='setter'){const choices=players.filter(p=>p.team===target.team&&p!==target&&frontRow(p)&&!['setter','libero'].includes(role(p)));approachPlan=choices.length&&random()<.6?{flight:ball,actor:choices[Math.floor(random()*choices.length)].index}:null;}else approachPlan=null;
 const currentSeed=window.matchInfo?.fixtureId||String(window.matchInfo?.round||1);if(seed!==currentSeed){seed=currentSeed;random=MatchRules.seeded('skills-'+seed);}
 let skill=null,effect=null;
 if(kind==='serve'){
  rallyStart=clock;effect=servePlan?.effect;servePlan=null;
  if(effect)bindFlight(effect,ball);else skill=pickSkill(servePool(from).filter(id=>id==='float'),from);
  if(skill)effect=trigger(skill,from,'serve',ball);
  if(effect?.skill.id==='jump-float-legendary'){if(ball.outcome?.winner==='actor'){if(random()<.4){const side=from.team?[108,185]:[815,892],edges=[105,515],corner={x:side[Math.floor(random()*side.length)],y:edges[Math.floor(random()*edges.length)]};ball.targetX=corner.x;ball.targetY=corner.y;if(placement)placement.goal={...corner};}effect.ballGhosts=[];effect.nextBallGhost=clock;matchSound('hit',{kind:'whoosh'});}ball.duration=safeDuration(ball,1.85,.3);effect.until=clock+ball.duration+.9;}
  if(effect?.skill.rarity==='Legendary'&&placement)effect.aim={...placement.goal};
  if(effect?.skill.id==='sky-serve'){ball.duration=safeDuration(ball,2.5,.5);ball.skillArc={style:'normal',start:18,end:18,lift:190};effect.until=clock+ball.duration+.9;}
  if(effect?.skill.id==='float')effect.until=clock+ball.duration+.9;
  if(effect?.skill.id==='jump-legendary'){impactHold={flight:ball,age:0};ball.impactFlash=1;if(!effect.aim)effect.aim={x:limit(ball.targetX,90,910),y:limit(ball.targetY,90,530)};ball.duration=safeDuration(ball,.58,.16);effect.until=clock+ball.duration+.4;}
  currentServe=placement?{...placement,goal:{...placement.goal},actor:from.index}:null;showServe(effect,from,placement);
 }else if(touch===2){
  if(active.some(e=>e.flight===previous&&e.skill.id==='jump-legendary')){const dx=from.x-previous.from.x,dy=from.y-previous.from.y,length=Math.max(1,Math.hypot(dx,dy));knockbacks.set(from.index,{x:dx/length,y:dy/length,start:clock});}
  if(active.some(e=>e.flight===previous&&['float','jump-float-legendary'].includes(e.skill.id))&&pendingDive?.skill.id!=='pancake')overheadUntil.set(from.index,clock+.48);
  const pool=[];if((overheadUntil.get(from.index)||0)<=clock&&role(from)==='libero'&&(info?.distance||0)>32)pool.push('dive');if(previous.kind==='block'||previous.startZ)pool.push('cover');skill=pickSkill(pool,from);effect=pendingDive?.incoming===previous&&pendingDive.actor===from.index?pendingDive:null;pendingDive=null;if(effect){skill=effect.skill;if(effect.impact){ball.from={...effect.impact};ball.x=effect.impact.x;ball.y=effect.impact.y;ball.startZ=2;}bindFlight(effect,ball);effect.until=clock+.85;}else if(skill)trigger(skill,from,'receive',ball,{incomingKind:previous.kind});
 }else if(touch===3){
  const distance=Math.hypot(target.x-ball.targetX,target.y-ball.targetY),pool=['tempo-third','tempo-second'];
  if(Math.abs(ball.targetY-from.y)>70)pool.push('back','deceive');if(distance<170)pool.push('tempo-first');if(role(target)!=='libero'&&frontRow(target))pool.push('slide-attack');if(distance<24&&role(target)!=='libero')pool.push('tempo-minus');
  const members=players.filter(p=>p.team===from.team&&p!==from&&p!==target&&!['setter','libero'].includes(role(p))).map(number);if(members.length)pool.push('sync-attack');
  effect=pendingSet?.incoming===previous&&pendingSet.actor===from.index?pendingSet:null;pendingSet=null;
  if(pipe){skill=pipe.skill;effect=trigger(skill,target,'attack',null,{prepared:true,incoming:ball,contact:clock+ball.duration,until:clock+ball.duration+1});pendingAttack=effect;}else if(effect){skill=effect.skill;bindFlight(effect,ball);}else{skill=pickSkill(pool,id=>['tempo-minus','slide-attack'].includes(id)?target:from);if(skill)effect=trigger(skill,['tempo-minus','slide-attack'].includes(skill.id)?target:from,'set',['tempo-minus','slide-attack'].includes(skill.id)?null:ball,{hitter:target.index,members});}
  if(skill?.id==='slide-attack'){ball.targetY=limit(target.y+(target.y>310?-1:1)*85,130,490);ball.duration=safeDuration(ball,1.25,.35);ball.blockPlan=blockPlan(1-target.team,ball.targetY);effect.prepared=true;effect.contact=clock+ball.duration;effect.incoming=ball;effect.slideStart={x:target.x,y:target.y};pendingAttack=effect;}
  if(skill?.id==='sync-attack'){effect.setFlight=ball;effect.incoming=ball;effect.flight=null;if(focus?.effect===effect){focus.flight=null;focus.route=null;}effect.timings={};effect.origins={};effect.lanes={};for(const index of members){const ally=players.find(p=>p.index===index);const lane=spreadRoleGoal(ally,attackPoint(ally)),distance=Math.hypot(lane.x-ally.x,lane.y-ally.y);effect.lanes[index]={x:lane.x,y:limit(lane.y,130,490)};effect.timings[index]={delay:random()*.09+Math.min(.07,distance/3000),pace:limit(1.08-distance/1100+random()*.12,.82,1.12),approach:.03+random()*.11};effect.origins[index]={x:ally.x,y:ally.y};}pendingSync=effect;}
  if(skill?.id==='fake-set'){effect.fakeJump=true;ball.duration=Math.max(ball.duration,1.05);planDeception(effect,from,ball);}
  if(skill?.id==='deceive')planDeception(effect,from,ball);
  if(skill?.id==='back')effect.faceAngle=Math.atan2(ball.targetY-from.y,ball.targetX-from.x)+Math.PI;
  if(skill){if(skill.id==='tempo-third')ball.duration=Math.max(ball.duration,1.9);if(skill.id==='tempo-second')ball.duration=safeDuration(ball,1.4);if(skill.id==='tempo-first')ball.duration=safeDuration(ball,.9);if(skill.id==='tempo-minus'){ball.duration=.50;effect.prepared=true;effect.contact=clock+ball.duration;ball.spikePrepared=true;target.spike=.65;target.jump=.5;pendingAttack=effect;effect.incoming=ball;}if(ball.runStart)ball.runDuration=Math.max(.05,ball.duration-.38);effect.until=clock+ball.duration+1.4;}
 }else if(kind==='attack'){
  effect=prepared;pendingAttack=null;if(dump){skill=dump.skill;effect=trigger(skill,from,'attack',ball);}else if(effect){skill=effect.skill;bindFlight(effect,ball);}else{const pool=['cross','line'];skill=pickSkill(pool,from);if(skill)effect=trigger(skill,from,'attack',ball);}
  if(effect){if(skill.id==='tempo-minus'){effect.powerBounce=random()<.3;if(!effect.powerBounce){ball.duration=safeDuration(ball,.32,.12);ball.netTime=ball.duration*limit((500-from.x)/(ball.targetX-from.x),.02,.95);ball.netY=from.y+(ball.targetY-from.y)*(ball.netTime/ball.duration);ball.blockPlan=blockPlan(target.team,ball.netY);}}if(skill.id==='power-hit'||effect.powerBounce)effect.cameraBounce=random()<.22;if(effect.powerBounce){ball.targetX=from.team?405:595;ball.duration=safeDuration(ball,ball.duration,.22);ball.netTime=ball.duration*limit((500-from.x)/(ball.targetX-from.x),.02,.95);ball.netY=from.y+(ball.targetY-from.y)*(ball.netTime/ball.duration);ball.blockPlan=blockPlan(target.team,ball.netY);}if(skill.id==='ghost-tip'){ball.duration=Math.max(ball.duration,1.35);if(!effect.aim)effect.aim={x:limit(ball.targetX,90,910),y:limit(ball.targetY,90,530)};}effect.until=clock+ball.duration+(skill.id==='power-hit'||effect.powerBounce?1.1:.4);}
 }
 if(kind==='attack'&&effect&&['ghost-tip','power-hit','tempo-minus'].includes(effect.skill.id)){
  const power=effect.skill.id==='power-hit'||effect.powerBounce;
  ball.dropDuration=power?1.42:.85;ball.skillArc={style:power?'power':effect.skill.id==='ghost-tip'?'tip':'normal',start:release?.z??18,end:power?0:18,bounce:!!power,camera:!!effect.cameraBounce};syncSkillHeight(ball);
 }
 if(lightningAce(ball))matchSound('hit',{kind:'veryhardball'});else delayedSounds.forEach(play=>play());
 refreshNet(ball);
};
resolveNetContact=function(){
 if(!enabled||!leagueEnabled()||suppressed)return originalNet();
 const before=ball,attacker=ball.attacker,prepared=pendingBlock?.incoming===ball?pendingBlock:null;
 const netT=ball.netTime,netU=limit(netT/ball.duration),contact={x:ball.from.x+(ball.targetX-ball.from.x)*netU,y:ball.netY,z:ball.skillArc?skillHeight(ball,netT):18+((ball.startZ||18)-18)*(1-netU)+Math.sin(Math.PI*netU)*45},oldDuration=ball.duration,arc=ball.skillArc;
 originalNet();
 if(['block','block-touch'].includes(ball.outcome?.event)){
  ball.from={x:contact.x,y:contact.y};ball.x=contact.x;ball.y=contact.y;ball.z=contact.z;ball.startZ=contact.z;
  ball.dropDuration=.85;ball.skillArc={style:'deflection',start:contact.z,end:18,lift:38,bounce:false,camera:false};
 }else if(ball.outcome?.event==='attack-error'){
  ball.from={x:contact.x,y:contact.y};ball.x=contact.x;ball.y=contact.y;ball.t=0;ball.duration=Math.max(.2,oldDuration-netT);ball.startZ=contact.z;
  ball.skillArc={style:'deflection',start:contact.z,end:0,lift:14,bounce:false,camera:false};
 }else if(arc)ball.skillArc=arc;
 if(canShow()&&ball.kind==='block'&&ball.outcome?.event==='block'){const skill=pickSkill(['rebound'],attacker);if(skill){const defenders=players.filter(p=>p.team===attacker.team&&p!==attacker),receiver=defenders.sort((a,b)=>Math.hypot(a.x-ball.targetX,a.y-ball.targetY)-Math.hypot(b.x-ball.targetX,b.y-ball.targetY))[0]||attacker;ball.target=receiver;ball.targetX=receiver.x;ball.targetY=receiver.y;ball.duration=safeDuration(ball,.95,.28);ball.miss=false;delete ball.pointWinner;ball.outcome={...ball.outcome,winner:null,event:'rebound',quality:.4};receiver.contactQuality=.4;const resolution=[...history].reverse().find(e=>e.type==='resolution');if(resolution){resolution.counteredEvent=resolution.event;resolution.event='rebound';resolution.winner=null;}trigger(skill,attacker,'receive',ball);announce(commentaryName(attacker)+' bloktan sektiriyor, top bizde kalıyor!');}}
 if(prepared){pendingBlock=null;bindFlight(prepared,ball);prepared.until=clock+ball.duration+.4;return;}
 if(!canShow()||!['block','block-touch'].includes(ball.outcome?.event))return;
 const entry=history.at(-1);if(entry?.type!=='block-contact')return;const blockers=(entry.players||[]).map(index=>players.find(p=>p.index===index)).filter(Boolean);if(!blockers.length)return;
 const main=blockers.find(p=>role(p)==='middle')||blockers[0],pool=['roof','read'];if(blockers.length>1)pool.push('close');
 
 const skill=pickSkill(pool,main);if(skill)trigger(skill,main,'block',ball,{members:blockers.map(number)});
 if(ball.outcome.event==='block-touch'&&attacker&&random()<.3){const wipe=pickSkill(['wipe'],attacker);if(wipe)trigger(wipe,attacker,'attack',before);}
};
function distantRescue(p,flight,info,minGap=24){return (info?.distance||0)>=105&&Math.hypot(p.x-flight.targetX,p.y-flight.targetY)>=minGap;}
function pancakeChoice(p){if(!canRallyLegendary()||clock<counterUntil[p.team]||!owns(p,'pancake'))return null;return random()<limit(.24+(p.stats?.receive||30)*.0025,.25,.65)?catalog.get('pancake'):null;}
function planMovement(){
 if(!canShow()||ball.state!=='flight')return;const target=ball.target,remaining=Math.max(0,ball.duration-ball.t),info=incoming.get(ball);
 const legendary=active.find(e=>e.flight===ball&&e.team!==target.team&&e.skill.rarity==='Legendary'&&['serve','attack','set'].includes(e.kind));
 if(legendary&&ball.touch===1&&['serve','attack'].includes(ball.kind)&&!ball.attackPending&&!counterAttempts.has(ball)&&remaining<=.75&&remaining>0&&distantRescue(target,ball,info,55)&&ball.outcome?.winner==='actor'&&['kill','ace','receive-error'].includes(ball.outcome.event)&&Math.hypot(target.x-ball.targetX,target.y-ball.targetY)<=movementSpeed(target)*remaining+18){
  const skill=pancakeChoice(target);counterAttempts.add(ball);if(!skill)return;const dx=ball.targetX-target.x,dy=ball.targetY-target.y,d=Math.max(1,Math.hypot(dx,dy)),rescueGoal={x:ball.targetX-dx/d*26,y:ball.targetY-dy/d*26};if(Math.hypot(target.x-rescueGoal.x,target.y-rescueGoal.y)>movementSpeed(target)*remaining+2)return;const old=ball.outcome;ball.outcome={...old,winner:null,event:'pancake-save',quality:.42};ball.miss=false;delete ball.pointWinner;target.contactQuality=.42;counterUntil[target.team]=clock+12;
  const resolution=[...history].reverse().find(e=>e.type==='resolution'&&e.player===ball.attacker.index&&e.winner==='actor');if(resolution){resolution.counteredBy='pancake';resolution.counteredEvent=resolution.event;resolution.winner=null;}
  for(const [index,reaction]of reactions)if(players.find(p=>p.index===index)?.team===target.team&&['float','sync-attack'].includes(reaction.reason))reactions.delete(index);
  history.push({type:'skill-counter',skill:'pancake',player:target.index,team:target.team,against:old.event,againstSkill:legendary.skill.id});pendingDive=trigger(skill,target,'receive',null,{prepared:true,incoming:ball,contact:clock+remaining,until:clock+remaining+.85,diveStart:clock+Math.max(0,remaining-(.10+random()*.05)),slideReach:30+random()*8,diveX:dx/d,diveY:dy/d,rescueGoal,impact:{x:ball.targetX,y:ball.targetY}});if(pendingDive){pendingDive.heartbeatStarted=true;sound('heartbeat');}startFocus(pendingDive);return;
 }
 if(ball.touch===1&&ball.kind==='attack'&&!ball.attackPending&&!counterAttempts.has(ball)&&remaining>0&&remaining<=.25){const dx=ball.targetX-target.x,dy=ball.targetY-target.y,gap=Math.hypot(dx,dy),wrong=dx*(target.courtVX||0)+dy*(target.courtVY||0)<0;if(gap>18&&gap<58&&(wrong||gap>movementSpeed(target)*remaining)&&ball.z<40&&ball.outcome?.winner==='actor'&&owns(target,'kick-save')){counterAttempts.add(ball);const skill=pickSkill(['kick-save'],target),distance=Math.max(1,gap),goal={x:ball.targetX-dx/distance*22,y:ball.targetY-dy/distance*22};if(skill&&Math.hypot(target.x-goal.x,target.y-goal.y)<=movementSpeed(target)*remaining+8){const old=ball.outcome;ball.outcome={...old,winner:null,event:'kick-save',quality:.28};ball.miss=false;delete ball.pointWinner;target.contactQuality=.28;const resolution=[...history].reverse().find(e=>e.type==='resolution'&&e.winner==='actor');if(resolution){resolution.counteredBy='kick-save';resolution.winner=null;}pendingDive=trigger(skill,target,'receive',null,{prepared:true,incoming:ball,contact:clock+remaining,until:clock+remaining+.65,diveStart:clock,kickX:dx/distance,kickY:dy/distance,rescueGoal:goal,impact:{x:ball.targetX,y:ball.targetY}});planned.add(ball);history.push({type:'skill-counter',skill:'kick-save',team:target.team,player:target.index,against:old.event});return;}}}
 if(ball.miss||planned.has(ball))return;
 if(ball.touch===1&&!active.some(e=>e.flight===ball&&['float','jump-float-legendary'].includes(e.skill.id))&&role(target)==='libero'&&remaining<=.34&&(info?.distance||0)>32){
  planned.add(ball);const skill=pickSkill(['dive'],target);if(!skill)return;const dx=ball.targetX-target.x,dy=ball.targetY-target.y,length=Math.hypot(dx,dy),fallback=Math.max(1,Math.hypot(ball.from.x-target.x,ball.from.y-target.y));pendingDive=trigger(skill,target,'receive',null,{prepared:true,incoming:ball,contact:clock+remaining,until:clock+remaining+.85,diveStart:clock,diveX:length>4?dx/length:(ball.from.x-target.x)/fallback,diveY:length>4?dy/length:(ball.from.y-target.y)/fallback});
 }else if(ball.touch===2&&role(target)==='setter'&&remaining<=.85){
  const gap=Math.hypot(target.x-ball.targetX,target.y-ball.targetY),broken=distantRescue(target,ball,info);if(!broken&&remaining>.3)return;if(gap>movementSpeed(target)*remaining+12)return;planned.add(ball);const skill=pickSkill(broken?['perfect-second-touch','one-hand-rescue']:['fake-set'],target);if(!skill)return;pendingSet=trigger(skill,target,'set',null,{prepared:true,incoming:ball,contact:clock+remaining,until:clock+remaining+2.5});startFocus(pendingSet);
 }else if(ball.touch===3&&target?.spike>0&&!pendingAttack){
  planned.add(ball);const skill=pickSkill(['ghost-tip','power-hit'],target);if(!skill)return;pendingAttack=trigger(skill,target,'attack',null,{prepared:true,incoming:ball,contact:clock+remaining,until:clock+remaining+2.5});planAim(pendingAttack,target);startFocus(pendingAttack);
 }else if(ball.kind==='attack'&&ball.attackPending&&!pendingBlock){
  const blockers=(ball.blockPlan||[]).map(g=>players.find(p=>p.index===g.index)).filter(p=>p&&p.block>0&&p.jump>0&&role(p)!=='libero');if(!blockers.length)return;
  const actor=blockers.find(p=>role(p)==='middle')||blockers[0],netRemaining=Math.max(0,ball.netTime-ball.t),trio=players.filter(p=>p.team===target.team&&mayBlock(p)).sort((a,b)=>Math.abs(a.y-ball.netY)-Math.abs(b.y-ball.netY)).slice(0,3),tripleReady=trio.length===3&&trio.every((p,i)=>Math.hypot(p.x-(p.team?535:465),p.y-(ball.netY+(i-1)*20))<=movementSpeed(p)*netRemaining+20),skill=pickSkill(['absolute-read','commit-block',...(tripleReady?['triple-block']:[])],actor);if(!skill)return;planned.add(ball);pendingBlock=trigger(skill,actor,'block',null,{prepared:true,incoming:ball,contact:clock+Math.max(0,ball.netTime-ball.t),until:clock+remaining+1,stepStart:{x:actor.x,y:actor.y}});if(pendingBlock?.skill.id==='triple-block'){pendingBlock.members=trio.map(number);ball.tripleBlock=true;ball.blockPlan=trio.map((p,i)=>({index:p.index,x:p.team?535:465,y:ball.netY+(i-1)*20}));for(const p of trio){p.jump=.5;p.block=Math.max(.5,netRemaining+.25);}}if(pendingBlock?.skill.id==='absolute-read'&&random()<.6){const goal=playerGoal(actor),dx=goal.x-actor.x,dy=goal.y-actor.y,d=Math.hypot(dx,dy);pendingBlock.runningBlock={dx:d>2?dx/d:0,dy:d>2?dy/d:(ball.netY>=actor.y?1:-1)};}startFocus(pendingBlock);
 }
}
function planDeception(effect,setter,flight){
 const blockers=players.filter(p=>p.team!==setter.team&&mayBlock(p)).sort((a,b)=>Math.abs(a.y-flight.targetY)-Math.abs(b.y-flight.targetY)).slice(0,2);effect.fooled=[];
 for(const p of blockers){const chance=limit(.58+(setter.stats?.set||30)*.002-(p.stats?.mental||30)*.003,.18,.78);if(random()>chance)continue;
  effect.fooled.push(p.index);reactions.set(p.index,{actor:p.index,reason:'deceive',x:p.x,y:p.y,dx:0,dy:flight.targetY>=p.y?-1:1,start:clock+.06,until:clock+.85,phase:p.index*.4});
 }
 effect.decoy={x:flight.targetX,y:limit(620-flight.targetY,130,490)};
}
function reactionDelay(p,goal,rank=0){return .035+Math.min(.16,Math.hypot(p.x-goal.x,p.y-goal.y)/2200)+rank*.045;}
function confuse(flight,reason,members){
 if(reacted.has(flight))return;reacted.add(flight);
 members=[...members].sort((a,b)=>Math.hypot(a.x-flight.targetX,a.y-flight.targetY)-Math.hypot(b.x-flight.targetX,b.y-flight.targetY));members.forEach((p,i)=>{
  const dx=p.x-flight.targetX,dy=p.y-flight.targetY,length=Math.max(1,Math.hypot(dx,dy));
  reactions.set(p.index,{actor:p.index,reason,x:p.x,y:p.y,dx:Math.abs(dx)+Math.abs(dy)<1?(p.team?1:-1):dx/length,dy:dy/length,start:clock+reactionDelay(p,{x:flight.targetX,y:flight.targetY},i),until:clock+reactionDelay(p,{x:flight.targetX,y:flight.targetY},i)+1.15,phase:random()*Math.PI*2,pace:.8+random()*.7,side:random()<.5?-1:1,reach:5+random()*7});
 });
}
function iconGroup(kind,members,chance=.6){if(!window.MatchReactionArt||random()>=chance)return;for(const p of members){const start=reactions.get(p.index)?.start??clock;reactionIcons.set(p.index,{kind,start,until:start+MatchReactionArt.duration(kind)});}}
function updateReactions(){
 for(const [index,icon]of reactionIcons)if(clock>=icon.until)reactionIcons.delete(index);

 if(ball.state==='drop'&&ball.skillCredit?.id==='jump-legendary'&&ball.outcome?.winner==='actor'&&!ball.legendarySurprise){ball.legendarySurprise=true;const goal={x:ball.targetX,y:ball.targetY};const surprised=players.filter(p=>p.team!==ball.skillCredit.team).sort((a,b)=>Math.hypot(a.x-goal.x,a.y-goal.y)-Math.hypot(b.x-goal.x,b.y-goal.y)).slice(0,3);for(const [rank,p]of surprised.entries()){const start=clock+reactionDelay(p,goal,rank);reactions.set(p.index,{actor:p.index,reason:'lightning-score',startAngle:p.angle,start,until:start+1.1,goal});}iconGroup('exclamation',surprised,.65);}

 for(const [index,reaction]of reactions)if(clock>reaction.until)reactions.delete(index);
 for(const group of active)if(group.skill.id==='sync-attack'&&group.setFlight===ball&&!Number.isFinite(group.leapStart)){
  const hitter=players.find(p=>p.index===group.hitter);if(hitter?.jump>0&&ball.spikePrepared)group.leapStart=clock;
 }
 if(ball.state!=='flight'||!ball.outcome||ball.outcome.winner!=='actor'||reacted.has(ball))return;
 const effect=active.find(e=>e.flight===ball);if(!effect)return;
 if(['float','jump-float-legendary'].includes(effect.skill.id)&&ball.kind==='serve'&&ball.t/ball.duration>=.66){
  const helpers=players.filter(p=>p.team===ball.target.team&&p!==ball.target&&[1,5,6].includes(p.zone)).sort((a,b)=>Math.hypot(a.x-ball.target.x,a.y-ball.target.y)-Math.hypot(b.x-ball.target.x,b.y-ball.target.y));
  const members=[ball.target,...helpers.slice(0,1)];confuse(ball,'float',members);iconGroup('anger',members);
 }else if(effect.skill.id==='sync-attack'&&effect.outgoing===ball&&ball.kind==='attack'&&!ball.attackPending){
  // The native resolver has already awarded the attack: a visual reaction never
  // turns a successful defense into a point or changes the match RNG.
  const rivals=players.filter(p=>p.team!==effect.team);confuse(ball,'sync-attack',rivals);const offset=Math.floor(random()*rivals.length);iconGroup('droplet',[0,1,2].map(i=>rivals[(offset+i)%rivals.length]));
 }
}
let lightningRoll=null;
function lightningAce(flight){return flight?.skillCredit?.id==='jump-legendary'&&flight.outcome?.winner==='actor';}
function drawLightningRoll(){if(!lightningRoll)return;const age=Math.max(0,clock-lightningRoll.start),u=1-Math.exp(-Math.min(age,3.2)*2.2),image=ballSprites[$('ballStyle').value]||ballSprites['ball_volley1.png'];if(ball.state==='flight'&&ball!==lightningRoll.flight){lightningRoll=null;return;}if(!image)return;ctx.save();ctx.translate(lightningRoll.x+lightningRoll.dx*72*u,lightningRoll.y+lightningRoll.dy*72*u);ctx.rotate(lightningRoll.angle+u*15);ctx.filter='invert(1)';ctx.drawImage(image,-9,-9,18,18);ctx.restore();}
function advance(dt){
 prepareServe();
 for(const effect of active)if(effect.ballGhosts){effect.ballGhosts=effect.ballGhosts.filter(g=>clock-g.at<.36);if(effect.flight===ball&&ball.state==='flight'&&clock>=effect.nextBallGhost){const u=limit(ball.t/ball.duration),rise=limit(u/.34),drop=limit((u-.78)/.22),smooth=drop*drop*(3-2*drop),z=(18+42*rise*rise*(3-2*rise))*(1-smooth)+2*smooth;effect.ballGhosts.push({x:ball.x,y:ball.y+floatSway(u,true)-z,at:clock,angle:elapsed*3});effect.nextBallGhost=clock+.075;if(effect.ballGhosts.length>5)effect.ballGhosts.shift();}else if(effect.flight!==ball||ball.state!=='flight'){if(!effect.whooshStopped){matchSound('hit',{kind:'whoosh-stop'});effect.whooshStopped=true;}}}
 if(ball.state==='drop'&&ball.skillArc?.bounce&&ball.outcome?.event==='kill'&&ball.t<.98&&ball.t+dt>=.98)matchSound('hit',{kind:'soft'});
 const groundKind={'jump-float-legendary':'floorslam_2','power-hit':'floorslam_hard','tempo-minus':'hardfloorslam'}[ball.skillCredit?.id],groundAt=ball.skillCredit?.id==='jump-float-legendary'?.08:.28;if(groundKind&&ball.state==='drop'&&ball.t<groundAt&&ball.t+dt>=groundAt)matchSound('hit',{kind:groundKind});
 const floor=ball.state==='drop'&&lightningAce(ball)&&ball.t<.28&&ball.t+dt>=.28;if(floor){const dx=ball.targetX-ball.from.x,dy=ball.targetY-ball.from.y,length=Math.max(1,Math.hypot(dx,dy));lightningRoll={flight:ball,start:clock+dt,x:ball.x,y:ball.y,dx:dx/length,dy:dy/length,angle:clock*3};matchSound('hit',{kind:'hardfloorslam'});}const audio=matchSound;try{if(floor||(groundKind&&ball.state==='drop'))matchSound=(action,data={})=>{if((action==='hit'&&data.kind==='floorslam')||(action==='cue'&&data.kind==='bounce'))return;audio(action,data);};window.MatchMotion?.beforeStep();originalTick(dt);}finally{matchSound=audio;}syncSkillHeight(ball);clock+=dt;
 planMovement();for(const e of active)if(e.skill.id==='perfect-second-touch'&&e.prepared){const p=players.find(p=>p.index===e.actor);if(p&&(!e.afterTrail?.length||clock-e.afterTrail.at(-1).at>.055)){(e.afterTrail??=[]).push({x:p.x,y:p.y,at:clock});if(e.afterTrail.length>3)e.afterTrail.shift();}}updateReactions();updateFocus();if(!focus&&pendingDive?.skill.id==='pancake'&&pendingDive.incoming===ball)startFocus(pendingDive);
 for(let i=active.length-1;i>=0;i--)if(active[i].until<clock){completeNotice(active[i]);active.splice(i,1);}
 pumpNotices();
 for(const p of players){const entry=motion.get(p.index);if(!entry||clock-entry.at>.8)motion.set(p.index,{x:p.x,y:p.y,at:clock});}
}
tick=function(dt){
 if(!enabled||!leagueEnabled()||suppressed){window.MatchMotion?.beforeStep();originalTick(dt);visualRate=1;return;}
 if(paused||!ready||document.hidden){if(focus){sound('skill-slow-stop');sound('heartbeat-stop');}originalTick(dt);return;}
 if(pancakeHold){if(pancakeHold.flight!==ball){pancakeHold=null;document.body.classList.remove('skill-blackout');}else{pancakeHold.age+=dt/(Number($('speed').value)||1);if(pancakeHold.age<.5){document.body.classList.add('skill-blackout');carry=0;visualRate=0;window.MatchMotion?.reset();return;}pancakeHold=null;document.body.classList.remove('skill-blackout');}}
 if(impactHold){if(impactHold.flight!==ball)impactHold=null;else{impactHold.age+=dt/(Number($('speed').value)||1);if(impactHold.age<.5){carry=0;visualRate=0;window.MatchMotion?.reset();return;}ball.impactFlash=0;impactHold=null;}}
 let factor=1;if(focus){const speed=Number($('speed').value)||1;focus.age+=dt/speed;const progress=focus.flight?limit(focus.flight.t/Math.max(.001,focus.flight.duration)):0,enter=limit(focus.age/.12),leave=limit((progress-.4)/.1);factor=1-.62*enter*(1-leave);}
 visualRate=factor;carry+=dt*factor;let safety=0;while(carry+1e-10>=1/60&&safety++<20){advance(1/60);carry-=1/60;if(impactHold||pancakeHold){carry=0;break;}}
};
function overheadReception(p){return (overheadUntil.get(p.index)||0)>clock||(ball.state==='flight'&&ball.target===p&&ball.touch===1&&!ball.miss&&ball.duration-ball.t<=.24&&pendingDive?.skill.id!=='pancake'&&active.some(e=>e.flight===ball&&['float','jump-float-legendary'].includes(e.skill.id)));}

const rarityGlowSprites=new Map();
function drawRarityGlow(context,player,rarity,progress){
 if(progress<=0||progress>=1)return;
 const colors={Common:'#bed7cf',Uncommon:'#a5d4a7',Rare:'#9bcbea',Epic:'#c4a7df',Legendary:'#efd397'},color=colors[rarity]||colors.Common;
 let sprite=rarityGlowSprites.get(color);if(!sprite){sprite=document.createElement('canvas');sprite.width=sprite.height=96;const c=sprite.getContext('2d'),g=c.createRadialGradient(48,48,5,48,48,47);g.addColorStop(0,color);g.addColorStop(.4,color+'b0');g.addColorStop(1,color+'00');c.fillStyle=g;c.fillRect(0,0,96,96);rarityGlowSprites.set(color,sprite);}
 context.save();context.globalAlpha*=Math.sin(progress*Math.PI)*({Common:.14,Uncommon:.2,Rare:.27,Epic:.33,Legendary:.4}[rarity]||.14);context.drawImage(sprite,player.x-43,player.y-43,86,86);context.restore();
}

function effectFor(p){for(let i=active.length-1;i>=0;i--)if(active[i].actor===p.index)return active[i];return null;}
playerLayout=function(p){if(p.kickPose>0)return APPROACH_LAYOUT;if(!enabled||!leagueEnabled()||suppressed)return originalLayout(p);const e=canShow()?effectFor(p):null,age=e?clock-e.contact:99;if(e?.skill.id==='sky-serve'&&age<.4){const body=LAYOUT.filter(q=>!/^(arm|sleeve|hand)-/.test(q.id));const hand=strikeSide(p),side=e.prepared?(hand==='right'?'left':'right'):hand,pose=e.prepared?TOSS_LAYOUT:BLOCK_LAYOUT;return body.concat(pose.filter(q=>q.id==='arm-'+side));}if(e?.skill.id==='commit-block'&&e.prepared&&age<-.07)return APPROACH_LAYOUT;if(overheadReception(p))return TOSS_LAYOUT.filter(part=>!part.id.startsWith('sleeve-'));if(e?.runStart&&e.prepared&&p.approach)return e.skill.id==='jump-float-legendary'&&window.MatchPoseData?MatchPoseData.jumpFloatApproach:APPROACH_LAYOUT;if(e?.skill.id==='pancake'&&age>=-.25&&age<.7)return LAYOUT.filter(part=>! /^(arm|sleeve)-/.test(part.id)).concat(RECEIVE_LAYOUT.filter(part=>part.id==='arm-right'||part.id==='sleeve-right'));if(e?.runStart&&clock-e.start>=0&&clock-e.start<.23&&e.prepared)return LAYOUT.filter(part=>! /^(arm|sleeve)-/.test(part.id)).concat(TOSS_LAYOUT.filter(part=>part.id==='arm-'+(strikeSide(p)==='right'?'left':'right')));if(e&&age>=(e.skill.id==='ghost-tip'?-.06:-.3)&&age<.48&&['one-hand-rescue','ghost-tip'].includes(e.skill.id)){const side=e.side||'right';return LAYOUT.filter(part=>! /^(arm|sleeve)-/.test(part.id)).concat(TOSS_LAYOUT.filter(part=>part.id==='arm-'+side));}return originalLayout(p);};
drawPlayer=function(p){
 if(!enabled||!leagueEnabled()||suppressed||p.index>=12){originalPlayer(p);return;}const saved={jump:p.jump,spike:p.spike,approach:p.approach,toss:p.toss,receive:p.receive,x:p.x,y:p.y,angle:p.angle,moving:p.moving,phase:p.phase,block:p.block,shadowScale:p.shadowScale,hidePoseSleeves:p.hidePoseSleeves,kickPose:p.kickPose,serveSwing:p.serveSwing,serveReady:p.serveReady},e=effectFor(p);
 let diving=false,diveBlend=0,pancaking=false;try{
  if(overheadReception(p)){p.toss=.3;p.receive=0;p.spike=0;p.block=0;p.approach=false;}
  if(e){const age=clock-e.contact;if(e.skill.id==='setter-dump'&&age>=0&&age<.4){p.toss=.3;p.spike=0;p.approach=false;}if(e.skill.id==='kick-save'&&age>=-.25&&age<.5){p.kickPose=age<0?limit((age+.25)/.25):1-limit(age/.5);const turn=limit((age+.25)/.09),back=limit((age-.16)/.34),aim=Math.atan2(e.kickY,e.kickX),delta=Math.atan2(Math.sin(aim-p.angle),Math.cos(aim-p.angle));p.angle+=limit(delta,-.55,.55)*turn*(1-back);p.receive=0;p.toss=0;p.spike=0;p.jump=0;p.moving=false;p.approach=false;}if(e.skill.id==='sky-serve'){p.moving=false;p.approach=false;p.jump=0;p.spike=0;p.toss=e.prepared?.24:0;p.block=!e.prepared&&age<.3?1:0;}if(e.skill.id==='fake-set'&&age>=-.35&&age<.55){p.jump=.5*(1-limit((age+.3)/.85));p.spike=age<-.04?.35:0;p.toss=age>=-.04?.25:0;p.block=0;p.approach=false;p.moving=false;}
   p.hidePoseSleeves=(['one-hand-rescue','ghost-tip'].includes(e.skill.id)&&age>=(e.skill.id==='ghost-tip'?-.06:-.3)&&age<.48)||(!!e.runStart&&e.prepared&&clock-e.start>=0&&clock-e.start<.23);

   if(e.skill.id==='commit-block'&&age>=-.35&&age<.4){const u=limit((clock-e.start)/Math.max(.01,e.contact-e.start-.07));if(e.prepared&&age<-.07){p.x=e.stepStart.x+(p.x-e.stepStart.x)*u;p.y=e.stepStart.y+(p.y-e.stepStart.y)*u;p.jump=0;p.block=0;p.moving=true;p.phase=clock*24;}else{p.jump=.5*(1-limit((age+.07)/.47));p.block=1;p.moving=false;}p.spike=0;p.toss=0;p.approach=e.prepared&&age<-.07;}

   if(e.skill.id==='tempo-minus'&&age>=-.3&&age<.28){p.spike=age<0?.35+Math.min(.3,-age):Math.max(.01,.35-age);p.moving=false;p.jump=.5*(1-limit((age+.3)/.56));p.toss=0;p.block=0;p.approach=false;p.moving=false;}
   if(e.skill.id==='back'&&age>=0&&age<.7){const turn=Math.atan2(Math.sin(e.faceAngle-p.angle),Math.cos(e.faceAngle-p.angle)),u=limit(age/.12),settle=1-limit((age-.5)/.2);p.angle+=turn*u*u*(3-2*u)*settle;p.toss=Math.max(p.toss,.2);p.spike=0;}
   if(e.skill.id==='perfect-second-touch'&&age>=-.3&&age<.48){p.toss=Math.max(p.toss,.2);p.spike=0;}

   if(e.skill.id==='slide-attack'&&!e.prepared&&age>=-.3&&age<.45){p.angle+=(p.team?-1:1)*.12;if(age>=0){p.jump=Math.max(0,.5-age);p.spike=Math.max(0,.65-age);p.approach=false;}}
   if(e.runningBlock&&age>=-.22&&age<.36){const u=limit((age+.22)/.58),drift=12*(1-limit((age+.22)/.22));p.x-=e.runningBlock.dx*drift;p.y-=e.runningBlock.dy*drift;p.jump=.5*(1-u);p.block=age>-.10?1:0;p.approach=false;p.moving=false;p.angle=Math.atan2(e.runningBlock.dy,e.runningBlock.dx)*(1-limit((age+.12)/.12));}

   if(['one-hand-rescue','ghost-tip'].includes(e.skill.id)&&age>=(e.skill.id==='ghost-tip'?-.06:-.3)&&age<.48){p.toss=Math.max(p.toss,.1);p.spike=0;}
   if(['dive','pancake'].includes(e.skill.id)&&clock>=(e.diveStart??e.contact)&&age>=-.34&&age<.7){const u=limit((clock-(e.diveStart??e.contact))/.45),settle=limit((age-.4)/.3),slide=Math.sin((e.skill.id==='pancake'?limit((clock-e.diveStart)/.45):u)*Math.PI/2)*(e.skill.id==='pancake'?(e.slideReach??36):30)*(1-settle);p.x+=(e.diveX??Math.cos(p.angle))*slide;p.y+=(e.diveY??Math.sin(p.angle))*slide;p.receive=.3;p.jump=.5-Math.asin(Math.sin(u*Math.PI)*.28)*.5/Math.PI;p.spike=0;p.block=0;p.toss=0;p.approach=false;p.moving=false;diving=clock>=(e.diveStart??e.contact);pancaking=e.skill.id==='pancake';if(pancaking)p.angle=Math.atan2(e.diveY,e.diveX);diveBlend=Math.min(limit((clock-(e.diveStart??e.contact))/(pancaking?.06:.12)),limit((.7-age)/.18));}
   if(e.skill.id==='float'&&age>=-.8&&age<.32){p.jump=0;p.spike=.35;p.serveSwing=serveSwing(age,true);p.toss=0;p.block=0;p.approach=false;p.moving=false;}
   if(['jump','jump-legendary','jump-float-legendary'].includes(e.skill.id)){
    const start=e.contact-.30,u=limit((clock-start)/.60);
    if(u>0&&u<1){p.jump=.5*(1-u);const age=clock-e.contact;p.spike=.35;p.serveSwing=serveSwing(age,e.skill.id==='jump-float-legendary');p.toss=0;p.approach=false;}
    else if(clock<start){p.jump=0;p.spike=0;p.toss=clock-e.start<.23?.18:0;p.approach=p.moving;}else{p.jump=0;p.spike=0;p.toss=0;p.approach=false;}
   }
  }
  for(const group of active)if(group.skill.id==='sync-attack'&&group.members?.includes(p.index)){
   const timing=group.timings?.[p.index]||{delay:0,pace:1},age=(clock-group.leapStart-timing.delay)*timing.pace;if(Number.isFinite(group.leapStart)&&age>=0&&age<.65){p.jump=Math.max(0,.5-age);p.spike=Math.max(0,.65-age);p.toss=0;p.block=0;p.approach=false;}else if(group.setFlight===ball&&p.moving)p.approach=true;
  }
  const reaction=reactions.get(p.index);if(reaction){const age=clock-reaction.start,fade=limit((reaction.until-clock)/.25);if(age>=0){if(reaction.reason==='lightning-score'){const target=Math.atan2(reaction.goal.y-p.y,reaction.goal.x-p.x),delta=Math.atan2(Math.sin(target-reaction.startAngle),Math.cos(target-reaction.startAngle)),u=limit(age/.28);const native=p.angle;p.angle=reaction.startAngle+delta*u*u*(3-2*u);const settle=limit((age-.85)/.25),back=Math.atan2(Math.sin(native-p.angle),Math.cos(native-p.angle));p.angle+=back*settle*settle*(3-2*settle);p.moving=false;}else p.angle+=Math.sin(age*(reaction.reason==='float'?12:6)*(reaction.pace||1)+reaction.phase)*(reaction.reason==='float'?.16:.28)*fade;if(reaction.reason!=='lightning-score')p.moving=age<.55/(reaction.pace||1);p.phase+=Math.sin(age*17)*.45;if(p.jump<=0){p.approach=false;p.spike=0;p.toss=0;p.receive=age>.42?.18:0;}}}
  if(overheadReception(p)){p.toss=.3;p.receive=0;p.spike=0;p.block=0;p.approach=false;}
  if(diving)p.shadowScale=1-.3*diveBlend;if(pancaking)alignPancake(p,e.impact,clock-e.contact,Math.sin(p.jump/.5*Math.PI)*12);
  const knock=knockbacks.get(p.index);if(knock){const age=clock-knock.start;if(age>=.38)knockbacks.delete(p.index);else if(age>=0){const u=limit(age/.38),push=u<.24?Math.sin(u/.24*Math.PI/2):Math.pow(1-(u-.24)/.76,2);p.x+=knock.x*11*push;p.y+=knock.y*11*push;p.receive=Math.max(p.receive,.16*(1-u));p.moving=false;p.approach=false;}}
  if(e&&canShow())drawRarityGlow(ctx,p,e.skill.rarity,limit((clock-e.start)/Math.max(.25,e.until-e.start),.02,.98));
  if(e?.readyStart!==undefined&&clock<e.start){p.serveReady=true;p.jump=p.spike=p.toss=p.block=0;p.receive=.2;p.moving=false;p.approach=false;p.hidePoseSleeves=false;}
  originalPlayer(p);const icon=reactionIcons.get(p.index);if(icon&&clock>=icon.start)window.MatchReactionArt?.draw(ctx,icon.kind,clock-icon.start,p.x+34,p.y,32,Math.PI/2);
 }finally{Object.assign(p,saved);}
};
function ring(x,y,t,color,r=23){if(t<=0||t>=1)return;ctx.save();ctx.globalAlpha=(1-t)*.58;ctx.lineWidth=1.6;ctx.strokeStyle=color;ctx.beginPath();ctx.ellipse(x,y,8+t*r,5+t*r*.7,0,0,TAU);ctx.stroke();ctx.restore();}
function line(points,color,alpha=.5,dash=[]){ctx.save();ctx.globalAlpha=alpha;ctx.strokeStyle=color;ctx.lineWidth=1.6;ctx.lineCap='round';ctx.setLineDash(dash);ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.stroke();ctx.restore();}
function particles(x,y,t,color){if(t<=0||t>=1)return;ctx.save();ctx.globalAlpha=(1-t)*.7;for(let i=0;i<4;i++){const a=i*TAU/4+.3,r=7+t*16;line([{x:x+Math.cos(a)*r,y:y+Math.sin(a)*r},{x:x+Math.cos(a)*(r+4),y:y+Math.sin(a)*(r+4)}],color,(1-t)*.65);}ctx.restore();}
function pancakePalm(angle,lift){const part=RECEIVE_LAYOUT.find(q=>q.id==='arm-right'),r=part.rotation*Math.PI/180,dx=(part.width*.94-part.width*part.pivotX)*part.scale,dy=(part.height*.5-part.height*part.pivotY)*part.scale,x=(part.x+part.width*part.scale*part.pivotX+Math.cos(r)*dx-Math.sin(r)*dy-16)*1.35,y=(part.y+part.height*part.scale*part.pivotY+Math.sin(r)*dx+Math.cos(r)*dy-43)*1.35;return {x:Math.cos(angle)*x-Math.sin(angle)*y,y:Math.sin(angle)*x+Math.cos(angle)*y-lift};}
function alignPancake(p,impact,age,lift){const reach=limit((age+.09)/.09),release=1-limit((age-.12)/.28),u=reach*reach*(3-2*reach)*release;if(!impact||u<=0)return;const palm=pancakePalm(p.angle,lift);p.x+=(impact.x-palm.x-p.x)*u;p.y+=(impact.y+7-palm.y-p.y)*u;}
function reticle(x,y,alpha=1){ctx.save();ctx.globalAlpha=.78*alpha;ctx.strokeStyle='#f7e6b2';ctx.lineWidth=1.6;ctx.beginPath();ctx.arc(x,y,18,0,TAU);ctx.stroke();ctx.strokeStyle='#5b7161';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,22,0,TAU);ctx.stroke();for(let i=0;i<4;i++){const a=i*TAU/4;ctx.beginPath();ctx.moveTo(x+Math.cos(a)*12,y+Math.sin(a)*12);ctx.lineTo(x+Math.cos(a)*27,y+Math.sin(a)*27);ctx.strokeStyle='#f7e6b2';ctx.lineWidth=1.8;ctx.stroke();}ctx.fillStyle='#f7e6b2';ctx.beginPath();ctx.arc(x,y,2,0,TAU);ctx.fill();ctx.restore();}
function mergeAim(x,y,age,fade=1){const u=limit(age/.32),ease=1-(1-u)**3;if(u<1){const offset=74*(1-ease);reticle(x-offset,y,.38*(1-u)*fade);reticle(x+offset,y,.38*(1-u)*fade);}reticle(x,y,limit((u-.55)/.45)*fade);}
function surpriseMark(p,alpha=1){ctx.save();ctx.globalAlpha=alpha;ctx.translate(p.x,p.y-44);ctx.font='bold 24px sans-serif';ctx.textAlign='center';ctx.lineWidth=3;ctx.strokeStyle='#263f46';ctx.strokeText('!',0,0);ctx.fillStyle='#ffe3a1';ctx.fillText('!',0,0);ctx.restore();}
function floatSway(u,jump=false){const fade=Math.sin(u*Math.PI),drop=limit((u-.78)/.22);return (Math.sin(u*24)*20+Math.sin(u*11)*8)*fade+(jump?Math.sin(u*39)*9*fade*(1-drop):0);}
function aimMarker(effect){if(!effect.aim||effect.skill.rarity!=='Legendary')return;const sway=effect.skill.id==='jump-float-legendary'&&effect.flight===ball&&ball.state==='flight'?floatSway(limit(ball.t/ball.duration),true):0;mergeAim(effect.aim.x,effect.aim.y+sway,clock-effect.start,limit((effect.until-clock)/.3));}
function isolatedSave(actor){ctx.save();ctx.globalAlpha=1;ctx.fillStyle='#000';ctx.fillRect(0,0,1000,620);const p=players.find(p=>p.index===actor);if(p)drawPlayer(p);const sprite=ballSprites[$('ballStyle').value]||ballSprites['ball_volley1.png'];if(sprite&&Number.isFinite(ball.x)){ctx.translate(ball.x,ball.y-(ball.z||0));ctx.drawImage(sprite,-9,-9,18,18);}ctx.restore();}
function drawServeToss(){
 const e=servePlan?.effect;if(!e?.runStart||servePlan.waiting!==ball)return;const p=players.find(p=>p.index===e.actor);if(!p)return;
 if(e.readyStart!==undefined&&clock<e.start){const held=serveReadyContact(p),ready=serveReadyPose((clock-e.readyStart)/e.readyDuration),image=ballSprites[$('ballStyle').value]||ballSprites['ball_volley1.png'];if(image){ctx.save();ctx.translate(held.x,held.y-held.z);ctx.rotate(ready.rotation);ctx.drawImage(image,-9,-9,18,18);ctx.restore();}return;}
 const u=limit((clock-e.start-.06)/Math.max(.01,e.contact-e.start-.06)),jumping=['jump','jump-legendary','jump-float-legendary'].includes(e.skill.id),contact=e.skill.id!=='sky-serve'?strikeContact({...p,jump:jumping?.25:0,spike:.35,serveSwing:0}):null,origin=e.skill.id==='jump-legendary'?serveReadyContact({...p,x:e.runStart.x,y:e.runStart.y}):e.runStart,x=contact?origin.x+(contact.x-origin.x)*u:origin.x,y=contact?origin.y+(contact.y-origin.y)*u:origin.y,z=18+Math.sin(u*Math.PI)*62+(jumping?12*u:0),image=ballSprites[$('ballStyle').value]||ballSprites['ball_volley1.png'];
 if(!image)return;ctx.save();ctx.fillStyle='#0003';ctx.beginPath();ctx.ellipse(x,y,7,3,0,0,TAU);ctx.fill();ctx.translate(x,y-z);ctx.rotate(e.skill.id==='jump-float-legendary'?u*.2:u*2);ctx.drawImage(image,-9,-9,18,18);ctx.restore();
}

// Short, tapered marks follow motion; no decorative symbols around players.
function inkStroke(points,alpha=.3,width=1.5){if(points.length<2)return;ctx.save();ctx.lineCap='round';ctx.lineJoin='round';ctx.setLineDash([]);for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],fade=i/(points.length-1);ctx.globalAlpha=alpha*fade;ctx.lineWidth=width*(.25+.75*fade)+1;ctx.strokeStyle='#294c5038';ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();ctx.lineWidth=width*(.25+.75*fade);ctx.strokeStyle='#f4eed7';ctx.stroke();}ctx.restore();}
function inkTrail(points,length=42,alpha=.35){if(points.length<2)return;const out=[points.at(-1)];let distance=0;for(let i=points.length-2;i>=0;i--){const a=points[i],b=out[0],d=Math.hypot(b.x-a.x,b.y-a.y);if(d<1)continue;if(distance+d>length){const u=(length-distance)/d;out.unshift({x:b.x+(a.x-b.x)*u,y:b.y+(a.y-b.y)*u});break;}out.unshift(a);distance+=d;}inkStroke(out,alpha,1.7);}
function inkContact(origin,direction,age){if(age<=0||age>=.16)return;const dx=direction.x-origin.x,dy=direction.y-origin.y,d=Math.hypot(dx,dy);if(d<3)return;const x=dx/d,y=dy/d,u=age/.16;for(const side of [-1,1]){const offset=side*(8+u*3);inkStroke([{x:origin.x-x*5-y*offset,y:origin.y-y*5+x*offset},{x:origin.x+x*5-y*offset,y:origin.y+y*5+x*offset}],(1-u)*.32,1.2);}}
function inkSlide(x,y,dx,dy,progress){if(progress<=0||progress>=1)return;const fade=Math.sin(progress*Math.PI)*.24;for(const side of [-1,1]){const offset=side*7,end=10+progress*16;inkStroke([{x:x-dx*end-dy*offset,y:y-dy*end+dx*offset},{x:x-dx*5-dy*offset,y:y-dy*5+dx*offset}],fade,1);}}

function spotlightChoice(f){if(f.skill.id!=='sync-attack')return f.actor;const e=f.effect,progress=ball===e.setFlight?ball.t/Math.max(.001,ball.duration):0;if(e.outgoing||progress>=.55){f.spotLocked=true;return e.hitter;}if(f.spotLocked)return e.hitter;if(!f.spotCandidates)f.spotCandidates=players.filter(p=>p.team===e.team&&role(p)!=='setter').sort((a,b)=>Math.hypot(a.x-ball.x,a.y-ball.y)-Math.hypot(b.x-ball.x,b.y-ball.y)||a.index-b.index).slice(0,3).map(p=>p.index);return f.spotCandidates[Math.floor(f.age/.32)%Math.max(1,f.spotCandidates.length)]??e.hitter;}


function spotlightActor(f){const actor=spotlightChoice(f);if(f.skill.id==='sync-attack'&&!paused){if(f.spotLocked&&!f.slotFinalPlayed){matchSound('hit',{kind:'slot-blong'});f.slotFinalPlayed=true;}else if(!f.spotLocked&&f.slotActor!==actor){f.slotIndex=(f.slotIndex??-1)+1;matchSound('hit',{kind:'slot-bling-'+f.slotIndex%3});}f.slotActor=actor;}return actor;}
function softSpot(state,player){const now=performance.now()/1000;if(state.actor!==player.index){state.previous=state.actor;state.fromX=state.x??player.x;state.fromY=state.y??player.y;state.actor=player.index;state.changed=now;}const u=limit((now-(state.changed??now))/.16),ease=u*u*(3-2*u);state.x=(state.fromX??player.x)+(player.x-(state.fromX??player.x))*ease;state.y=(state.fromY??player.y)+(player.y-(state.fromY??player.y))*ease;return {x:state.x,y:state.y,mix:ease,previous:players.find(p=>p.index===state.previous)};}
function paintEffects(){if(pancakeHold){document.body.classList.add('skill-blackout');isolatedSave(pancakeHold.actor);return;}
 if(focus){const p=players.find(p=>p.index===spotlightActor(focus));if(p){const spot=softSpot(focus.spotState??={},p),progress=focus.flight?limit(focus.flight.t/Math.max(.001,focus.flight.duration)):0,strength=Math.min(1,focus.age/.16,1-limit((progress-.4)/.1));ctx.save();ctx.fillStyle='rgba(12,25,32,'+(.56*strength)+')';ctx.fillRect(0,0,1000,620);const glow=ctx.createRadialGradient(spot.x,spot.y-14,3,spot.x,spot.y-14,43);glow.addColorStop(0,'rgba(244,219,153,'+(.23*strength)+')');glow.addColorStop(1,'rgba(244,219,153,0)');ctx.fillStyle=glow;ctx.fillRect(spot.x-45,spot.y-60,90,100);ctx.save();if(spot.previous&&spot.mix<1){ctx.globalAlpha=1-spot.mix;drawPlayer(spot.previous);}ctx.globalAlpha=spot.mix;drawPlayer(p);ctx.restore();if(Number.isFinite(ball.x)){const image=ballSprites[$('ballStyle').value]||ballSprites['ball_volley1.png'];if(image){ctx.save();ctx.translate(ball.x,ball.y-(ball.z||0));ctx.rotate(elapsed*3);ctx.filter='invert('+(ball.impactFlash||0)+')';ctx.drawImage(image,-9,-9,18,18);ctx.restore();}}ctx.restore();}}
 for(const e of active)if(e.skill.id==='perfect-second-touch'&&clock-e.contact<.14){const p=players.find(p=>p.index===e.actor);if(p)for(const trail of e.afterTrail||[]){const age=clock-trail.at;if(age>.025&&age<.22&&Math.hypot(p.x-trail.x,p.y-trail.y)>3){ctx.save();ctx.globalAlpha=.07*(1-age/.22);originalPlayer({...p,x:trail.x,y:trail.y,blockFlash:0});ctx.restore();}}}
 drawServeToss();for(const effect of active)for(const ghost of effect.ballGhosts||[]){const age=clock-ghost.at;if(age<.025||age>.36)continue;const image=ballSprites[$('ballStyle').value]||ballSprites['ball_volley1.png'];if(!image)continue;ctx.save();ctx.globalAlpha=.48*(1-age/.36);ctx.translate(ghost.x,ghost.y);ctx.rotate(ghost.angle);ctx.drawImage(image,-9,-9,18,18);ctx.restore();}
 for(const e of active){const p=players.find(p=>p.index===e.actor);if(!p)continue;aimMarker(e);
  if(e.flight===ball&&ball.state==='flight'){
   const hard=ball.kind==='attack'||ball.kind==='serve';inkTrail(trace,hard?46:25,hard?.38:.22);
   if(!e.prepared)inkContact({x:ball.from.x,y:ball.from.y-18},{x:ball.x,y:ball.y-(ball.z||0)},clock-e.contact);
  }
  if(['dive','pancake'].includes(e.skill.id)){const progress=limit((clock-(e.diveStart??e.contact))/.7);inkSlide(p.x,p.y,e.diveX??Math.cos(p.angle),e.diveY??Math.sin(p.angle),progress);}
 }

}
function drawEffects(){
 if(!enabled||!leagueEnabled()||suppressed){originalDraw();return;}const flight=ball,saved={x:flight.x,y:flight.y,z:flight.z,visualScale:flight.visualScale,impactFlash:flight.impactFlash};const e=active.find(e=>e.flight===flight),u=flight.state==='flight'?limit(flight.t/flight.duration):0;
 try{
  syncSkillHeight(flight);flight.impactFlash=impactHold?.flight===flight?Math.max(0,1-impactHold.age/.32):0;
  if(e&&['float','jump-float-legendary'].includes(e.skill.id)&&flight.state==='flight'){const fade=Math.sin(u*Math.PI);flight.y+=floatSway(u,e.skill.id==='jump-float-legendary');flight.z+=Math.sin(u*17)*5*fade;if(e.skill.id==='jump-float-legendary'){const rise=limit(u/.34),drop=limit((u-.78)/.22),smooth=drop*drop*(3-2*drop),height=18+42*rise*rise*(3-2*rise);flight.z=height*(1-smooth)+(flight.miss?2:18)*smooth;}}
  if(e?.skill.id==='sky-serve'&&flight.state==='flight')flight.visualScale=1+Math.sin(u*Math.PI)*.85;
  if(e?.skill.id==='jump-float-legendary'&&flight.state==='drop')flight.z=Math.max(0,2-flight.t*25);
  if(pendingDive?.skill.id==='pancake'&&pendingDive.incoming===flight&&flight.state==='flight'){const descent=limit((clock-pendingDive.diveStart)/.09);flight.z=flight.z*(1-descent)+2*descent;}
  if(lastBall!==flight){trace.length=0;lastBall=flight;}if(flight.state==='flight'&&Number.isFinite(flight.x)){const sample={x:flight.x,y:flight.y-(flight.z||0),at:clock},last=trace.at(-1);if(!last||Math.hypot(sample.x-last.x,sample.y-last.y)>1)trace.push(sample);while(trace.length>1&&(clock-trace[0].at>.13||trace.length>24))trace.shift();}else trace.length=0;
  if(flight.state==='flight'&&flight.touch===3&&!flight.miss&&active.some(group=>group.skill.id==='sync-attack'&&group.setFlight===flight)){const hitter=flight.target,hand=strikeContact(hitter),blend=limit((u-.78)/.22);flight.x+=(hand.x-flight.targetX)*blend;flight.y+=(hand.y-flight.targetY)*blend;flight.z+=(hand.z-18)*blend;}
  if(lightningRoll?.flight===flight)flight.x=NaN;originalDraw();if(ready){paintEffects();drawLightningRoll();}
 }finally{Object.assign(flight,saved);}
};
draw=function(){
 const time=clock,alpha=paused||impactHold||pancakeHold?1:limit((carry+Math.max(0,frameCarry)*visualRate)/(1/60));
 try{if(window.MatchMotion&&!paused)clock-=((1-alpha)/60);return window.MatchMotion?MatchMotion.render(alpha,drawEffects):drawEffects();}
 finally{clock=time;}
};
awardPoint=function(winner){const credit=canShow()&&ball.skillCredit?.team===winner?ball.skillCredit:null;const savedIcons=[...reactionIcons];const surprise=[...reactions].filter(([,r])=>r.reason==='lightning-score'&&r.until>clock);for(const e of active)completeNotice(e);resetEffects(true);for(const [index,r]of surprise)reactions.set(index,r);for(const [index,icon]of savedIcons)if(icon.until>clock)reactionIcons.set(index,icon);const result=originalAward(winner);pumpNotices(true,winner);if(credit){if(parent!==window)parent.postMessage({type:'spiker-audio',action:'legendary-point'},'*');else window.GameAudio?.legendaryPoint?.();}return result;};
reset=function(){lightningRoll=null;resetEffects();clock=0;cooldown=0;legendaryUntil=0;counterUntil.fill(0);legendaryUsed=false;focusEvents.length=0;lastSkill='';events.length=0;return originalReset();};
window.addEventListener('message',e=>{if(e.source===parent&&e.data?.type==='spiker-match'&&e.data.action==='skip'){suppressed=true;resetEffects();}});
window.addEventListener('blur',()=>{sound('skill-slow-stop');sound('heartbeat-stop');});document.addEventListener('visibilitychange',()=>{if(document.hidden)sound('skill-slow-stop');sound('heartbeat-stop');});
window.MatchSkills={catalog:definitions,get lightningRoll(){return lightningRoll?{x:lightningRoll.x,y:lightningRoll.y,age:clock-lightningRoll.start}:null;},get serveGait(){const e=servePlan?.effect;return e?.runStart?{actor:e.actor,skill:e.skill.id,phase:clock<e.start+.18?'toss':clock<e.contact-.30?'approach':'jump',remaining:Math.max(0,e.contact-clock)}:null;},setEnabled(value){enabled=!!value;resetEffects();},get focusEvents(){return focusEvents.map(e=>({...e}));},get events(){return events.map(e=>({...e}));},get state(){return {enabled:enabled&&leagueEnabled(),suppressed,legendaryUsed,rallyLegendaryCount,secondLegendaryAllowed,active:active.map(e=>({id:e.skill.id,actor:e.actor,kind:e.kind})),servePlacement:currentServe?{id:currentServe.id,name:currentServe.name,zone:currentServe.zone,goal:{...currentServe.goal},actor:currentServe.actor}:null,servePreparation:servePlan?.effect?.runStart?{actor:servePlan.effect.actor,phase:clock<servePlan.effect.start+.18?'toss':clock<servePlan.effect.contact-.30?'approach':'jump',remaining:Math.max(0,servePlan.effect.contact-clock)}:null,reactions:[...reactions.values()].map(r=>({actor:r.actor,reason:r.reason})),synchronized:active.filter(e=>e.skill.id==='sync-attack').map(e=>({hitter:e.hitter,members:[...e.members],timings:structuredClone(e.timings||{}),leaping:Number.isFinite(e.leapStart)&&clock-e.leapStart<.5})),aims:active.filter(e=>e.aim).map(e=>({id:e.skill.id,...e.aim})),slow:!!focus,focusSkill:focus?.skill.id,focusActor:focus?.actor,focusPhase:focus?.flight?'outbound':focus?'preparation':null,focusProgress:focus?.flight?focus.flight.t/Math.max(.001,focus.flight.duration):null,reactionIcons:[...reactionIcons].map(([actor,icon])=>({actor,...icon})),notice:currentNotice?{id:currentNotice.skill.id,rarity:currentNotice.skill.rarity,failed:!!currentNotice.failed,lead:null}:null,blackout:pancakeHold?{actor:pancakeHold.actor,age:pancakeHold.age,duration:.5}:null,impact:impactHold?{age:impactHold.age,duration:.5}:null,clock};}};
})();
