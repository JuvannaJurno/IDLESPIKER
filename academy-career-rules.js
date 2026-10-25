(function(root){
'use strict';
// Production academy state lives in the room transaction, alongside scouting and budget.
const copy=o=>JSON.parse(JSON.stringify(o));
const Potential=root.ProspectPotentialRules||(typeof require==='function'?require('./prospect-potential-rules.js'):null);
const stats=['spike','block','serve','receive','set','stamina','mental'];
const paths={
 setter:[['playmaker','Oyun kurucu','set','mental','deceive','sync-attack'],['support','Güvenli pas','receive','set','fake-set','perfect-second-touch']],
 outside:[['finisher','Güçlü bitirici','spike','serve','jump','jump-legendary'],['technical','Teknik hücumcu','spike','mental','court-vision','ghost-tip']],
 opposite:[['finisher','Güçlü bitirici','spike','serve','jump','jump-legendary'],['technical','Teknik hücumcu','spike','mental','court-vision','ghost-tip']],
 middle:[['wall','File savunması','block','mental','roof','absolute-read'],['quick','Hızlı hücum','spike','block','court-vision','tempo-minus']],
 libero:[['defender','Güvenli karşılama','receive','mental','dive','pancake'],['rescue','Top kurtarma','receive','stamina','kick-save','pancake']]
};
const defaults=()=>({version:1,sequence:0,graduates:0,entries:[]});
const plans=p=>(paths[p.role]||[]).map(([id,name,primary,secondary,skill,legendary])=>({id,name,primary,secondary,skill,legendary}));
const unlocked=s=>s?.stage==='bal'&&s.division===4&&(s.floors?.flat().includes('first_academy')||false);
const capacity=s=>unlocked(s)?2+Math.max(0,(s.floors.flat().filter(x=>x==='first_academy').length||1)-1):0;
function normalize(raw){
 const s=defaults();if(raw?.version!==1)return s;
 for(const k of ['sequence','graduates'])if(Number.isSafeInteger(raw[k])&&raw[k]>=0)s[k]=raw[k];
 const seen=new Set();s.entries=(Array.isArray(raw.entries)?raw.entries:[]).filter(e=>e&&/^academy-\d+$/.test(e.id)&&!seen.has(e.id)&&seen.add(e.id)&&e.player&&paths[e.player.role]&&typeof e.player.name==='string'&&/^team-assets\/woman-\d+\.svg$/.test(e.player.art)&&stats.every(k=>Number.isSafeInteger(e.player[k])&&e.player[k]>=0)&&Number.isFinite(e.start)&&Number.isFinite(e.end)&&e.end>e.start&&Number.isFinite(e.roll)&&e.roll>=0&&e.roll<1&&plans(e.player).some(p=>p.id===e.path)).slice(0,6).map(e=>({...copy(e),chance:Potential.rating(e.player).chance,skillChoice:e.skillChoice==='alternate'?'alternate':'recommended'}));
 s.sequence=Math.max(s.sequence,...s.entries.map(e=>Number(e.id.split('-')[1])),0);return s;
}
const progress=(e,now=Date.now())=>Math.max(0,Math.min(1,(now-e.start)/(e.end-e.start)));
function phase(e,now=Date.now()){const p=progress(e,now);return p>=1?'ready':p>=.6?'skill':p>=.25?'direction':'adaptation';}
const eligible=p=>!!p?.academyProspect&&Number.isInteger(p.age)&&p.age>=16&&p.age<=18&&!p.specialCharacter&&!p.academyOrigin;
function enroll(room,candidate,price,now=Date.now(),random=Math.random){
 if(!unlocked(room)||!candidate||candidate.hired||!eligible(candidate.player)||room.academy.entries.length>=capacity(room)||!Number.isSafeInteger(price)||price<0||room.budget<price||!Number.isFinite(now))return false;
 const s=room.academy,p=copy(candidate.player),id='academy-'+(++s.sequence),duration=s.sequence===1?20*60000:2*3600000;
 const roll=random();if(!Number.isFinite(roll)||roll<0||roll>=1){s.sequence--;return false;}
 p.art=p.art.startsWith('team-assets/')?p.art:'team-assets/woman-0.svg';
 s.entries.push({id,player:p,start:now,end:now+duration,path:plans(p)[0].id,skillChoice:'recommended',directionChosen:false,skillChosen:false,chance:Potential.rating(p).chance,roll,paid:price});
 const free=!room.scouting.firstTransferUsed&&!room.scouting.recruits.length;
 room.budget-=price;candidate.hired=true;candidate.academyId=id;room.scouting.firstTransferUsed=true;
 const Journey=root.SocialJourneyRules||(typeof require==='function'?require('./social-journey-rules.js'):null);if(!free&&Journey?.available(room,'transfer'))room.socialJourney.transferUsed=true;
 return id;
}
function choose(s,id,kind,value,now=Date.now()){
 const e=s.entries.find(x=>x.id===id);if(!e)return false;const p=progress(e,now);
 if(kind==='direction'&&p>=.25&&p<.6&&plans(e.player).some(x=>x.id===value)){e.path=value;e.directionChosen=true;return true;}
 if(kind==='skill'&&p>=.6&&p<1&&['recommended','alternate'].includes(value)){e.skillChoice=value;e.skillChosen=true;return true;}return false;
}
function skills(e){
 const p=plans(e.player).find(p=>p.id===e.path),other=plans(e.player).find(q=>q.id!==p.id);
 return [{id:'recommended',skill:p.skill,legendary:p.legendary},{id:'alternate',skill:other.skill,legendary:other.legendary}];
}
function result(e){
 const p=copy(e.player),path=plans(p).find(x=>x.id===e.path),choice=skills(e).find(x=>x.id===e.skillChoice),elite=e.roll<e.chance;
 stats.forEach(k=>p[k]+=k===path.primary?12:k===path.secondary?5:2);if(elite)p[path.primary]+=6;
 p.baseStats=Object.fromEntries(stats.map(k=>[k,p[k]-(p.training?.[k]||0)]));
 const S=root.PlayerSkills||(typeof require==='function'?require('./player-skills.js'):null);S.ensure(p);
 p.matchSkills[3]=choice.skill;if(elite)p.matchSkills[2]=choice.legendary;
 p.academySkillGrants=[choice.skill];p.academyOrigin=e.id;p.academySpecialty=path.id;p.academyElite=elite;p.legendaryTalent=elite;
 delete p.academyProspect;return p;
}
function graduate(room,id,roster,validate,now=Date.now()){
 const e=room.academy.entries.find(x=>x.id===id);if(!unlocked(room)||!e||progress(e,now)<1||roster.length>=30||roster.some(p=>p.academyOrigin===id))return false;
 const p=result(e);p.id='player-'+roster.length;p.number=roster.length+1;p.transferDivision=4;p.transferArrival='academy|'+id;p.transferArrivedAt=now;p.transferArrivalOrder=1+Math.max(0,...room.scouting.recruits.map(p=>p.transferArrivalOrder||0));
 const draft=roster.map(p=>({...p,art:p.art.startsWith('team-assets/')?p.art:'team-assets/woman-0.svg'}));draft.push(p);if(!validate(draft))return false;
 room.scouting.recruits.push(p);room.academy.entries=room.academy.entries.filter(x=>x.id!==id);room.academy.graduates++;return p;
}
const api={defaults,normalize,plans,skills,unlocked,capacity,progress,phase,eligible,enroll,choose,result,graduate};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.AcademyCareerRules=api;
})(globalThis);
