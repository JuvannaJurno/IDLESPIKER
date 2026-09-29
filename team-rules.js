(function(root){
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
function novice(p){for(const k of trainable)p[k]=integer(5,13);const strengths={setter:['set'],outside:['spike','receive'],opposite:['spike','serve'],middle:['block'],libero:['receive']};for(const k of strengths[p.role])p[k]=integer(14,20);p.stamina=integer(10,18);p.mental=integer(8,16);p.developmentVersion=1;p.training={};const choices=skillCatalog.filter(s=>s.roles.includes(p.role)),special=shuffle(choices.filter(s=>!['stamina','mental'].includes(s.stat))).slice(0,2);p.skills=[...special,...shuffle(choices.filter(s=>!special.includes(s))).slice(0,1)].map(s=>({id:s.id,unlocked:false}));return p}
function statCost(p,k){return 12+6*(p.training?.[k]||0)}
function train(p,k,pay){if(!trainable.includes(k)||p[k]>=100)return false;const cost=statCost(p,k);if(!pay(cost))return false;p[k]++;p.training[k]=(p.training[k]||0)+1;savePlayers();return true}
function unlockSkill(p,id,pay){const owned=p.skills.find(s=>s.id===id),skill=skillCatalog.find(s=>s.id===id);if(!owned||owned.unlocked||!skill||p[skill.stat]>=100||!pay(skill.cost))return false;owned.unlocked=true;p[skill.stat]=Math.min(100,p[skill.stat]+skill.bonus);savePlayers();return true}

function generate(){const pool=shuffle(names),arts=shuffle(Array.from({length:36},(_,i)=>i));return roleOrder.map((role,i)=>{const p={id:'player-'+i,name:pool[i],surname:shuffle(['Yılmaz','Kaya','Demir','Aydın','Arslan','Çelik','Yıldız','Koç','Şahin','Aksoy','Öztürk','Güneş'])[0],role,gender:'female',number:i+1,art:'team-assets/woman-'+arts[i]+'.svg'};for(const k of ['spike','block','serve','receive','set'])p[k]=integer(43,76);const strengths={setter:['set'],outside:['spike','receive'],opposite:['spike','serve'],middle:['block'],libero:['receive']};for(const k of strengths[role])p[k]=integer(78,94);p.height=role==='middle'?integer(184,199):role==='libero'?integer(162,178):integer(174,191);p.stamina=integer(65,95);p.mental=integer(62,94);return novice(p)})}
function valid(list){return Array.isArray(list)&&list.length===12&&list.every((p,i)=>p.id==='player-'+i&&p.role===roleOrder[i]&&p.gender==='female'&&typeof p.name==='string'&&p.name.trim().length>0&&p.name.length<=24&&/^team-assets\/woman-(?:[0-9]|[12][0-9]|3[0-5])\.svg$/.test(p.art)&&['spike','block','serve','receive','set','stamina','mental'].every(k=>Number.isInteger(p[k])&&p[k]>=0&&p[k]<=100)&&Number.isInteger(p.height)&&p.height>=150&&p.height<=210)}
let players;try{const stored=JSON.parse(root.localStorage?.getItem('idle-spiker-women-v1')||'null');if(valid(stored))players=stored}catch{}if(!players){players=generate();try{root.localStorage?.setItem('idle-spiker-women-v1',JSON.stringify(players))}catch{}}
function savePlayers(){try{root.localStorage?.setItem('idle-spiker-women-v1',JSON.stringify(players.map(p=>({...p,art:p.art.startsWith('team-assets/')?p.art:'team-assets/woman-0.svg'}))))}catch{}}
for(const p of players)if(p.developmentVersion!==1)novice(p);
for(const p of players)if(!p.surname)p.surname=shuffle(['Yılmaz','Kaya','Demir','Aydın','Arslan','Çelik','Yıldız','Koç','Şahin','Aksoy','Öztürk','Güneş'])[0];savePlayers();
function rename(id,name,surname){const p=players.find(p=>p.id===id);name=name.trim();surname=surname.trim();if(!p||!name||!surname||name.length>24||surname.length>24)return false;p.name=name;p.surname=surname;savePlayers();return true}
const defaults=()=>Object.fromEntries(slots.map((s,i)=>[s.id,players[i].id]));
function normalize(raw){if(!raw||typeof raw!=='object')return defaults();const used=new Set();return Object.fromEntries(slots.map(s=>{const p=players.find(p=>p.id===raw[s.id]&&p.role===s.role&&!used.has(p.id));if(p)used.add(p.id);return[s.id,p?.id||null]}))}
function equip(lineup,slot,id){const s=slots.find(s=>s.id===slot),p=players.find(p=>p.id===id);if(!s||!p||p.role!==s.role)return false;for(const k in lineup)if(lineup[k]===id)lineup[k]=null;lineup[slot]=id;return true}
const api={roles,slots,players,generate,valid,skillCatalog,trainable,statCost,train,unlockSkill,rename,savePlayers,defaults,normalize,equip};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.TeamRules=api;
})(globalThis);
