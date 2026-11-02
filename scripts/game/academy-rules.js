(function(root){
'use strict';
const stats=['spike','block','serve','receive','set','stamina'];
const profiles={setter:['set','serve'],outside:['spike','receive'],opposite:['spike','serve'],middle:['block','spike'],libero:['receive','set']};
const copy=o=>JSON.parse(JSON.stringify(o));
const defaults=()=>({version:1,budget:250000,sequence:0,graduates:0,slots:1,candidates:null,entries:[],roster:[]});
function normalize(raw){
 const s=defaults();if(raw?.version!==1)return s;
 for(const key of ['budget','sequence','graduates'])if(Number.isSafeInteger(raw[key])&&raw[key]>=0)s[key]=raw[key];
 s.slots=raw.slots===2?2:1;
 const valid=p=>p&&Object.hasOwn(profiles,p.role)&&typeof p.name==='string'&&typeof p.surname==='string'&&stats.every(k=>Number.isSafeInteger(p[k])&&p[k]>=0)&&/^team-assets\/woman-\d+\.svg$/.test(p.art);
 const good=e=>e&&typeof e.id==='string'&&valid(e.player)&&Number.isFinite(e.start)&&Number.isFinite(e.end)&&e.end>e.start&&['primary','secondary'].includes(e.program)&&stats.every(k=>Number.isSafeInteger(e.base?.[k])&&Number.isSafeInteger(e.gains?.[k])&&e.gains[k]>=0);
 const ids=new Set();s.entries=(Array.isArray(raw.entries)?raw.entries:[]).filter(good).filter(e=>{if(ids.has(e.id))return false;ids.add(e.id);return true;}).slice(0,s.slots).map(copy);
 s.roster=(Array.isArray(raw.roster)?raw.roster:[]).filter(valid).slice(0,18).map(copy);
 if(raw.candidates&&Object.hasOwn(profiles,raw.candidates.role)&&raw.candidates.players?.length===3&&raw.candidates.players.every(valid))s.candidates=copy(raw.candidates);
 return s;
}
function progress(e,now=Date.now()){return Math.max(0,Math.min(1,(now-e.start)/(e.end-e.start)));}
function quote(s){return {cash:s.sequence===0?0:25000,duration:s.sequence===0?20*60e3:2*60*60e3};}
function prepare(s,role,pool,reference){
 if(!Object.hasOwn(profiles,role)||s.entries.length>=s.slots)return false;
 const eligible=pool.filter(p=>p.role===role&&!p.specialCharacter);if(!eligible.length)return false;
 const peers=reference.filter(p=>p.role===role&&!p.specialCharacter&&!p.epicTeam).map(p=>root.TeamRules.overall(p)).sort((a,b)=>a-b);
 const center=peers.length?peers[Math.floor((peers.length-1)/2)]:35;
 const target=Math.max(30,Math.min(150,center));
 const players=Array.from({length:3},(_,i)=>{
  const p=copy(eligible[i%eligible.length]);p.id='academy-candidate-'+i;p.cardLevel=1;p.cardVersion=1;p.transferCamps=0;p.training={};delete p.transferProfile;delete p.specialCharacter;
  const weights={spike:.7,block:.7,serve:.7,receive:.7,set:.7,stamina:.9};weights[profiles[role][0]]=1.15;weights[profiles[role][1]]=1.05;
  stats.forEach(k=>p[k]=Math.max(1,Math.round(target*weights[k])));
  const weighted=root.TeamRules.overall(p)||1;stats.forEach(k=>p[k]=Math.max(1,Math.round(p[k]*target/weighted)));
  const pair=profiles[role];p[pair[i===1?1:0]]+=i===2?0:3;p[pair[i===1?0:1]]=Math.max(1,p[pair[i===1?0:1]]-(i===2?0:3));
  p.baseStats=Object.fromEntries(stats.map(k=>[k,p[k]]));return p;
 });
 s.candidates={role,players};return true;
}
function gains(role,program){const out=Object.fromEntries(stats.map(k=>[k,2]));out[profiles[role][program==='primary'?0:1]]=12;out[profiles[role][program==='primary'?1:0]]=5;return out;}
function enroll(s,index,program,now=Date.now()){
 const q=quote(s),p=s.candidates?.players[index];if(!p||!['primary','secondary'].includes(program)||s.entries.length>=s.slots||s.budget<q.cash||!Number.isFinite(now))return false;
 const id='academy-'+(++s.sequence),entry={id,player:copy(p),program,start:now,end:now+q.duration,paid:q.cash,base:Object.fromEntries(stats.map(k=>[k,p[k]])),gains:gains(p.role,program),reportSeen:false,redirected:false};
 s.budget-=q.cash;s.entries.push(entry);s.candidates=null;return id;
}
function playerAt(e,ratio=1){const p=copy(e.player),from=e.gainFrom||0,portion=Math.max(0,Math.min(1,(ratio-from)/(1-from)));stats.forEach(k=>p[k]=e.base[k]+Math.floor(e.gains[k]*portion));p.baseStats=Object.fromEntries(stats.map(k=>[k,p[k]]));return p;}
function redirect(s,id,now=Date.now()){
 const e=s.entries.find(e=>e.id===id);if(!e||e.redirected||progress(e,now)<.5||progress(e,now)>=1)return false;
 const ratio=progress(e,now),current=playerAt(e,ratio);e.program=e.program==='primary'?'secondary':'primary';const future=gains(e.player.role,e.program);
 // Preserve earned stats and redirect only the remaining share of training.
 stats.forEach(k=>{const remaining=Math.floor(future[k]*(1-ratio));e.base[k]=current[k];e.gains[k]=remaining;});
 e.gainFrom=ratio;e.redirected=true;e.reportSeen=true;return true;
}
function graduate(s,id,reference,now=Date.now()){
 const e=s.entries.find(e=>e.id===id);if(!e||progress(e,now)<1||reference.length+s.roster.length>=30)return false;
 const p=playerAt(e);p.id='player-'+(reference.length+s.roster.length);p.number=reference.length+s.roster.length+1;p.academyGraduate=id;p.academyOrigin=true;
 s.roster.push(p);s.entries=s.entries.filter(item=>item.id!==id);s.graduates++;return p.id;
}
function unlock(s){if(s.slots!==1||s.graduates<1||s.budget<50000)return false;s.budget-=50000;s.slots=2;return true;}
const api={defaults,normalize,profiles,stats,progress,quote,prepare,enroll,playerAt,redirect,graduate,unlock};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.AcademyRules=api;
})(globalThis);
