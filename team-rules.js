(function(root){
const Camps=root.CampRules||(typeof require==='function'?require('./camp-rules.js'):null);
function developmentState(){if(root.RoomSystem?.developmentState)return root.RoomSystem.developmentState();try{const raw=JSON.parse(root.localStorage?.getItem('idle-spiker-rooms-v2')||'null');return {stage:raw?.stage==='bal'?'bal':'prologue',camp:Camps.normalize(raw?.camp)}}catch{return {stage:'prologue',camp:Camps.defaults()}}}
function cap(p){return Camps.cap(developmentState(),p)}
function stageLabel(){return developmentState().stage==='bal'?'BÖLGESEL AMATÖR LİG':'PROLOG'}
const roles={setter:'Pasör',outside:'Smaçör',opposite:'Pasör çaprazı',middle:'Orta oyuncu',libero:'Libero'};
const slots=[['p','Pasör','setter'],['s1','Smaçör I','outside'],['s2','Smaçör II','outside'],['pc','Pasör çaprazı','opposite'],['o1','Orta I','middle'],['o2','Orta II','middle'],['l','Libero','libero']].map(([id,name,role])=>({id,name,role}));
const roleOrder=['setter','outside','outside','opposite','middle','middle','libero','setter','outside','opposite','middle','libero'];
const names=['Defne','Eylül','Ada','Duru','Elif','İpek','Selin','Zeynep','Ece','Aslı','Ceren','Yağmur','Sude','Nehir','Aylin','İdil','Derin','Mina','Beren','Lara','Melis','Naz'];
function random(){if(root.crypto?.getRandomValues){const n=new Uint32Array(1);root.crypto.getRandomValues(n);return n[0]/4294967296}return Math.random()}
const integer=(lo,hi)=>lo+Math.floor(random()*(hi-lo+1));
function shuffle(list){const out=[...list];for(let i=out.length-1;i>0;i--){const j=integer(0,i);[out[i],out[j]]=[out[j],out[i]]}return out}
const trainable=['spike','block','serve','receive','set','stamina','mental'];
const skillCatalog=[
 ['line','Çizgi Smaçı','spike',5,['outside','opposite'],60],['cross','Çapraz Hücum','spike',4,['outside','opposite'],45],['wipe','Bloktan Sektirme','spike',6,['outside','opposite'],85],
 ['roof','Duvar Blok','block',5,['middle'],60],['read','Hücum Okuma','block',4,['middle','outside'],45],['close','Fileyi Kapat','block',6,['middle','opposite'],85],
 ['float','Yüzen Servis','serve',4,['setter','outside','opposite','middle'],45],['jump','Sıçrayarak Servis','serve',6,['outside','opposite'],85],
 ['platform','Sağlam Manşet','receive',4,['libero','outside'],45],['dive','Plonjon','receive',5,['libero'],60],['cover','Hücum Sigortası','receive',4,['libero','setter'],45],
 ['quick','Hızlı Pas','set',4,['setter'],45],['back','Geriye Pas','set',5,['setter'],60],['deceive','Aldatıcı Pas','set',6,['setter'],85],
 ['breath','Ralli Dayanıklılığı','stamina',5,Object.keys(roles),50],['calm','Sakin Karşılama','mental',5,Object.keys(roles),50]
].map(([id,name,stat,bonus,roles,cost])=>({id,name,stat,bonus,roles,cost}));
const limits={stat:Camps.config.prologueCap,skills:1};
const strengths={setter:['set'],outside:['spike','receive'],opposite:['spike','serve'],middle:['block'],libero:['receive']};
const basicSkills=['cross','read','float','platform','quick','breath','calm'];
for(const skill of skillCatalog){skill.basic=basicSkills.includes(skill.id);if(skill.basic){skill.bonus=2;skill.cost=60}}
function growth(p){return trainable.reduce((n,k)=>n+Math.max(0,p[k]-p.baseStats[k]),0)}
function trainingBlock(p,k,amount=1){if(!trainable.includes(k)||!Number.isInteger(amount)||amount<1)return 'Bu özellik çalıştırılamaz.';if(p[k]+amount>cap(p))return 'Stat sınırı: '+cap(p)+'.';return ''}
function novice(p){for(const k of trainable)p[k]=integer(12,16);for(const k of strengths[p.role])p[k]=integer(17,19);p.stamina=integer(14,17);p.mental=integer(14,17);p.developmentVersion=3;p.training={};p.baseStats=Object.fromEntries(trainable.map(k=>[k,p[k]]));const choices=skillCatalog.filter(s=>s.roles.includes(p.role));const technical=shuffle(choices.filter(s=>s.basic&&!['stamina','mental'].includes(s.stat)))[0];const support=shuffle(choices.filter(s=>s.basic&&['stamina','mental'].includes(s.stat)))[0];const advanced=shuffle(choices.filter(s=>!s.basic))[0];p.skills=[technical,support,advanced].filter(Boolean).map(s=>({id:s.id,unlocked:false}));return p}
function statCost(p,k){
 const n=Math.max(0,p[k]-p.baseStats[k]);
 const stageCap=developmentState().stage==='bal'?Camps.config.balCap:Camps.config.prologueCap;
 const otherGrowth=trainable.reduce((sum,stat)=>sum+(stat===k?0:Math.max(0,p[stat]-p.baseStats[stat])),0);
 const specialization=1+(Math.max(0,otherGrowth-24)/36)**2;
 return Math.ceil((12+4*n+2*n*n+6*Math.max(0,p[k]-stageCap*.7)**3)*specialization*(1-Math.max(0,Math.min(.25,root.RoomSystem?.trainingDiscount?.(k)||0))));
}
function skillCost(p,id){const skill=skillCatalog.find(s=>s.id===id);if(!skill)return Infinity;let cost=skill.cost;for(let i=0;i<skill.bonus;i++)cost+=statCost({...p,[skill.stat]:p[skill.stat]+i},skill.stat);return cost}
function train(p,k,pay){if(trainingBlock(p,k))return false;const cost=statCost(p,k);if(!pay(cost))return false;p[k]++;p.training[k]=(p.training[k]||0)+1;savePlayers();root.CampSystem?.refresh();return true}
function skillBlock(p,id){const owned=p.skills.find(s=>s.id===id),skill=skillCatalog.find(s=>s.id===id);if(!owned||!skill)return 'Yetenek bulunamadı.';if(owned.unlocked)return 'Açıldı';if(!skill.basic)return 'Bu bölümde kapalı';if(p.skills.some(s=>s.unlocked))return '1 temel yetenek seçildi';if(p[skill.stat]<20)return 'İlgili özellik en az 20 olmalı';return trainingBlock(p,skill.stat,skill.bonus)}
function unlockSkill(p,id,pay){if(skillBlock(p,id))return false;const owned=p.skills.find(s=>s.id===id),skill=skillCatalog.find(s=>s.id===id);if(!pay(skillCost(p,id)))return false;owned.unlocked=true;p[skill.stat]+=skill.bonus;savePlayers();root.CampSystem?.refresh();return true}
function migrateDevelopment(p){
 const old={...p},base=old.baseStats||{},training=old.training||{};
 if(p.developmentVersion!==3){for(const k of trainable){const original=Number.isFinite(old[k])?old[k]:15;p[k]=Math.max(0,Math.min(cap(p),Math.floor(original)));const initial=Number.isFinite(base[k])?base[k]:original-(Number.isFinite(training[k])?training[k]:0);base[k]=Math.max(0,Math.min(p[k],Math.floor(initial)))}p.baseStats=base;p.training=Object.fromEntries(trainable.map(k=>[k,Math.max(0,p[k]-base[k])]))}
 else{for(const k of trainable){p[k]=Math.max(0,Math.min(cap(p),p[k]));base[k]=Math.max(0,Math.min(p[k],Number.isFinite(base[k])?base[k]:p[k]))}p.baseStats=base}
 if(!Array.isArray(p.skills))p.skills=[];let unlocked=false;p.skills=p.skills.filter(o=>skillCatalog.some(s=>s.id===o.id)).map(o=>{const skill=skillCatalog.find(s=>s.id===o.id),keep=!!o.unlocked&&skill.basic&&!unlocked;if(keep)unlocked=true;return {id:o.id,unlocked:keep}});p.training=Object.fromEntries(trainable.map(k=>[k,Math.max(0,p[k]-p.baseStats[k])]));p.developmentVersion=3;
}
function opponentStats(round,index){const level=17+Math.floor((Math.max(1,Math.min(14,round))-1)*4/13),role=['middle','outside','setter','middle','outside','opposite'][index%6],stats={stamina:level+2,mental:level+2};for(const k of ['spike','block','serve','receive','set'])stats[k]=level-2+(strengths[role].includes(k)?4:0);return stats}

function generate(){const pool=shuffle(names),arts=shuffle(Array.from({length:36},(_,i)=>i));return roleOrder.map((role,i)=>{const p={id:'player-'+i,name:pool[i],surname:shuffle(['Yılmaz','Kaya','Demir','Aydın','Arslan','Çelik','Yıldız','Koç','Şahin','Aksoy','Öztürk','Güneş'])[0],role,gender:'female',number:i+1,art:'team-assets/woman-'+arts[i]+'.svg'};for(const k of ['spike','block','serve','receive','set'])p[k]=integer(43,76);const strengths={setter:['set'],outside:['spike','receive'],opposite:['spike','serve'],middle:['block'],libero:['receive']};for(const k of strengths[role])p[k]=integer(78,94);p.height=role==='middle'?integer(184,199):role==='libero'?integer(162,178):integer(174,191);p.stamina=integer(65,95);p.mental=integer(62,94);return novice(p)})}
function valid(list){return Array.isArray(list)&&list.length===12&&list.every((p,i)=>p.id==='player-'+i&&p.role===roleOrder[i]&&p.gender==='female'&&typeof p.name==='string'&&p.name.trim().length>0&&p.name.length<=24&&/^team-assets\/woman-(?:[0-9]|[12][0-9]|3[0-5])\.svg$/.test(p.art)&&['spike','block','serve','receive','set','stamina','mental'].every(k=>Number.isInteger(p[k])&&p[k]>=0&&p[k]<=Camps.config.balMaxCap)&&Number.isInteger(p.height)&&p.height>=150&&p.height<=210)}
let players;try{const stored=JSON.parse(root.localStorage?.getItem('idle-spiker-women-v1')||'null');if(valid(stored))players=stored}catch{}if(!players){players=generate();try{root.localStorage?.setItem('idle-spiker-women-v1',JSON.stringify(players))}catch{}}
function savePlayers(){try{root.localStorage?.setItem('idle-spiker-women-v1',JSON.stringify(players.map(p=>({...p,art:p.art.startsWith('team-assets/')?p.art:'team-assets/woman-0.svg'}))))}catch{}}
if(players.some(p=>p.developmentVersion!==3)){try{if(!root.localStorage?.getItem('idle-spiker-pre-cap50-balance'))root.localStorage?.setItem('idle-spiker-pre-cap50-balance',JSON.stringify(players))}catch{}}
for(const p of players)migrateDevelopment(p);
for(const p of players)if(!p.surname)p.surname=shuffle(['Yılmaz','Kaya','Demir','Aydın','Arslan','Çelik','Yıldız','Koç','Şahin','Aksoy','Öztürk','Güneş'])[0];savePlayers();
function rename(id,name,surname){const p=players.find(p=>p.id===id);name=name.trim();surname=surname.trim();if(!p||!name||!surname||name.length>24||surname.length>24)return false;p.name=name;p.surname=surname;savePlayers();root.CampSystem?.refresh();return true}
const defaults=()=>Object.fromEntries(slots.map((s,i)=>[s.id,players[i].id]));
function normalize(raw){if(!raw||typeof raw!=='object')return defaults();const used=new Set();return Object.fromEntries(slots.map(s=>{const p=players.find(p=>p.id===raw[s.id]&&p.role===s.role&&!used.has(p.id));if(p)used.add(p.id);return[s.id,p?.id||null]}))}
function equip(lineup,slot,id){const s=slots.find(s=>s.id===slot),p=players.find(p=>p.id===id);if(!s||!p||p.role!==s.role)return false;for(const k in lineup)if(lineup[k]===id)lineup[k]=null;lineup[slot]=id;return true}
const api={roles,slots,players,generate,valid,skillCatalog,trainable,limits,growth,cap,stageLabel,skillCost,trainingBlock,skillBlock,opponentStats,statCost,train,unlockSkill,rename,savePlayers,defaults,normalize,equip};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TeamRules=api;
})(globalThis);
