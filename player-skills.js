(function(root){
'use strict';
const catalog=[
 {
  "id": "commit-block",
  "name": "Erken Blok",
  "rarity": "Common",
  "description": "Adımlayarak bloğa hazırlanır."
 },
 {
  "id": "cross",
  "name": "Çapraz Smaç",
  "rarity": "Common",
  "description": "Topu çapraz köşeye vurur."
 },
 {
  "id": "tempo-third",
  "name": "Üçüncü Tempo Hücum",
  "rarity": "Common",
  "description": "Yüksek pasla hücuma hazırlanır."
 },
 {
  "id": "slide-attack",
  "name": "Tek Ayak Hücumu",
  "rarity": "Uncommon",
  "description": "Yana ilerleyip tek ayakla hücuma çıkar."
 },
 {
  "id": "power-hit",
  "name": "Güçlü Vuruş",
  "rarity": "Uncommon",
  "description": "Topu dik ve güçlü vurur."
 },
 {
  "id": "rebound",
  "name": "Bloktan Sektirme",
  "rarity": "Uncommon",
  "description": "Bloktan seken topu yeniden oyuna kazandırır."
 },
 {
  "id": "read",
  "name": "Okuma Bloğu",
  "rarity": "Uncommon",
  "description": "Hücumun yönünü okuyarak blok kurar."
 },
 {
  "id": "float",
  "name": "Yüzen Servis",
  "rarity": "Uncommon",
  "description": "Yalpalayan servisle karşılamayı zorlaştırır."
 },
 {
  "id": "line",
  "name": "Paralel Smaç",
  "rarity": "Common",
  "description": "Çizgi boyunca smaç vurur."
 },
 {
  "id": "back",
  "name": "Geri Pas",
  "rarity": "Uncommon",
  "description": "Arkasındaki hücumcuya pas atar."
 },
 {
  "id": "cover",
  "name": "Dublaj",
  "rarity": "Uncommon",
  "description": "Bloktan dönen topa dublaj yapar."
 },
 {
  "id": "tempo-second",
  "name": "İkinci Tempo Hücum",
  "rarity": "Uncommon",
  "description": "Orta yükseklikte pasla hücumu hızlandırır."
 },
 {
  "id": "wipe",
  "name": "Blok Aut",
  "rarity": "Uncommon",
  "description": "Rakip bloğa çarptırarak sayı arar."
 },
 {
  "id": "roof",
  "name": "Aktif Blok",
  "rarity": "Rare",
  "description": "Uygun oyun durumunda devreye girer."
 },
 {
  "id": "close",
  "name": "İkili Blok",
  "rarity": "Uncommon",
  "description": "Takım arkadaşıyla ikili blok kurar."
 },
 {
  "id": "triple-block",
  "name": "Üçlü Blok",
  "rarity": "Uncommon",
  "description": "Üç oyuncuyla fileyi kapatır."
 },
 {
  "id": "jump",
  "name": "Smaç Servis",
  "rarity": "Rare",
  "description": "Uygun oyun durumunda devreye girer."
 },
 {
  "id": "dive",
  "name": "Plonjon",
  "rarity": "Rare",
  "description": "Uygun oyun durumunda devreye girer."
 },
 {
  "id": "deceive",
  "name": "Pas Aldatması",
  "rarity": "Rare",
  "description": "Uygun oyun durumunda devreye girer."
 },
 {
  "id": "sync-attack",
  "name": "Kombine Hücum",
  "rarity": "Legendary",
  "description": "Uygun oyun durumunda devreye girer."
 },
 {
  "id": "tempo-first",
  "name": "Birinci Tempo Hücum",
  "rarity": "Epic",
  "description": "Uygun oyun durumunda devreye girer."
 },
 {
  "id": "tempo-minus",
  "name": "Eksi Tempo Hücum",
  "rarity": "Legendary",
  "description": "Pasla birlikte yükselip çok hızlı hücum eder."
 },
 {
  "id": "absolute-read",
  "name": "Kusursuz Hücum Okuma",
  "rarity": "Legendary",
  "description": "Aldatmayı okuyup son anda doğru yere blok koyar."
 },
 {
  "id": "jump-legendary",
  "name": "Yıldırım Smaç Servis",
  "rarity": "Legendary",
  "description": "Çok hızlı ve güçlü sıçrayarak servis atar."
 },
 {
  "id": "jump-float-legendary",
  "name": "Jump Float",
  "rarity": "Legendary",
  "description": "Sıçrayarak attığı servis aniden düşer."
 },
 {
  "id": "perfect-second-touch",
  "name": "Zor Toplara Pas",
  "rarity": "Legendary",
  "description": "Bozuk topa yetişerek hücum pası çıkarır."
 },
 {
  "id": "one-hand-rescue",
  "name": "Tek Elle Pas",
  "rarity": "Legendary",
  "description": "Zor topu tek elle hücum pasına çevirir."
 },
 {
  "id": "pancake",
  "name": "Pancake",
  "rarity": "Legendary",
  "description": "Legendary hücumu yere değmeden son anda kurtarır."
 },
 {
  "id": "ghost-tip",
  "name": "Hayalet Plase",
  "rarity": "Legendary",
  "description": "Smaç gösterip topu bloğun arkasına bırakır."
 },
 {
  "id": "court-read",
  "name": "Saha Okuma",
  "rarity": "Common",
  "passive": true,
  "description": "Savunmada manşet gücü +3. Pasif yetenek."
 }
];
const byId=new Map(catalog.map(s=>[s.id,s]));
catalog.push({id:'sky-serve',name:'Alttan Servis',rarity:'Rare',description:'Sıçramadan, topa alttan vurarak servis atar.'});byId.set('sky-serve',catalog.at(-1));
catalog.push({id:'fake-set',name:'Pasör Aldatmacası',rarity:'Rare',description:'Hücum için yükselip havada takım arkadaşına parmak pas çıkarır.'});byId.set('fake-set',catalog.at(-1));
for(const skill of [{id:'court-vision',name:'Kort Görüşü',rarity:'Rare',description:'Havada savunmanın açığını fark ederek topu boş alana yönlendirir.'},{id:'team-heart',name:'Takımın Kalbi',rarity:'Legendary',description:'Sayı arasında toplanan takım arkadaşlarının temel özelliklerini her oyuncunun ilk top temasına kadar %12 güçlendirir.'},{id:'pipe-attack',name:'Pipe Attack',rarity:'Uncommon',description:'Üç metre çizgisinin gerisinden arka orta hücumu.'},{id:'setter-dump',name:'Pasör Plasesi',rarity:'Rare',description:'Ön hattaki pasör ikinci dokunuşu boş ön alana bırakır.'},{id:'kick-save',name:'Ayakla Kurtarış',rarity:'Rare',description:'Elleri yetişmeyen alçak topa ayağıyla dokunup ralliyi sürdürür.'}]){catalog.push(skill);byId.set(skill.id,skill);}
catalog.push({id:'sky-ball-serve',name:'Sky Ball Servisi',rarity:'Legendary',description:'Sol eliyle topu havalandırıp sağ eliyle vurur; top çok yüksek bir yayla kameraya yaklaşır ve rakip sahaya iner.'});byId.set('sky-ball-serve',catalog.at(-1));
const pools={
 setter:{Rare:['deceive','fake-set','setter-dump','sky-serve'],Common:['tempo-third'],Uncommon:['back','float','tempo-second'],Legendary:['sky-ball-serve','team-heart','sync-attack','perfect-second-touch','one-hand-rescue','jump-float-legendary']},
 outside:{Rare:['court-vision','jump','dive'],Common:['cross','commit-block','line'],Uncommon:['power-hit','wipe','rebound','float','pipe-attack'],Legendary:['sky-ball-serve','ghost-tip','jump-legendary','jump-float-legendary','tempo-minus']},
 opposite:{Rare:['court-vision','jump','roof'],Common:['cross','commit-block','line'],Uncommon:['power-hit','wipe','close','rebound'],Legendary:['sky-ball-serve','jump-legendary','ghost-tip','tempo-minus']},
 middle:{Rare:['roof','court-vision','kick-save'],Common:['commit-block'],Uncommon:['read','close','triple-block','slide-attack'],Legendary:['sky-ball-serve','absolute-read','tempo-minus']},
 libero:{Rare:['dive','kick-save'],Common:['court-read'],Uncommon:['cover'],Legendary:['pancake','perfect-second-touch']}
};
function hash(text){let n=2166136261;for(const c of String(text)){n^=c.charCodeAt(0);n=Math.imul(n,16777619)}return n>>>0}
// Draft progression: slot indices 0–3 remain compatible with existing saves.
const progression=Object.freeze({version:3,preparationBaseLevel:8,preparationLevelsPerCamp:10,requirements:[0,1,3,2,8,14],minimumDivision:[1,2,2,2,3,4],studyCamps:3,signatureDivision:6,stageTargets:{1:[0,0],2:[2,4],3:[6,8],4:[12,14],5:[18,18],6:[18,20],7:[20,22],8:[22,24]},availability:{'sky-ball-serve':1,'jump-legendary':1,'jump-float-legendary':.8,'ghost-tip':.7,pancake:.7,'perfect-second-touch':.55,'one-hand-rescue':.55,'absolute-read':.4,'tempo-minus':.35,'sync-attack':.3}});
const serveSkills=new Set(['sky-ball-serve','jump-legendary','jump-float-legendary']);
function weighted(ids,key){let roll=hash(key)/4294967296*ids.reduce((n,id)=>n+(progression.availability[id]||1),0);for(const id of ids){roll-=progression.availability[id]||1;if(roll<0)return id;}return ids.at(-1);}
function legendaryOptions(p,first=p?.matchSkills?.[2]){const all=(pools[p?.role]||pools.outside).Legendary.filter(id=>id!==first),complement=all.filter(id=>serveSkills.has(id)!==serveSkills.has(first));return [...complement,...all.filter(id=>!complement.includes(id))];}
function ensure(p){
 if(!p)return [];if(p.epicTeam){p.matchSkills=catalog.map(s=>s.id);p.matchSkillsVersion=3;return p.matchSkills;}
 const signature=(p.signatureSkills||[]).find(id=>['kick-save','dive'].includes(id)),base=pools[p.role]||pools.outside,pool=signature?{...base,Rare:[...new Set([...base.Rare,signature])]}:base,old=Array.isArray(p.matchSkills)?p.matchSkills:[],key=[p.id,p.name,p.surname,p.role].join('|');
 const first=['Common','Uncommon','Legendary','Rare'].map(tier=>tier==='Rare'&&signature?signature:old.find(id=>pool[tier].includes(id))||(tier==='Legendary'?(p.role==='libero'?'pancake':weighted(pool[tier],key+'|'+tier)):pool[tier][hash(key+'|'+tier)%pool[tier].length]));
 const normalPool=[...new Set([...pool.Rare,...pool.Uncommon,...pool.Common])].filter(id=>!first.includes(id)),fourth=normalPool.includes(old[4])?old[4]:normalPool[hash(key+'|fourth')%normalPool.length];
 const legendaryPool=legendaryOptions(p,first[2]),studyId=p.legendaryStudy?.id,second=legendaryPool.includes(studyId)?studyId:legendaryPool.includes(old[5])?old[5]:weighted(legendaryPool.filter(id=>serveSkills.has(id)!==serveSkills.has(first[2])).length?legendaryPool.filter(id=>serveSkills.has(id)!==serveSkills.has(first[2])):legendaryPool,key+'|second');
 p.matchSkills=[...first,fourth,second].filter(Boolean);p.matchSkillsVersion=3;p.signatureProgress??={version:1,id:null,unlocked:false};
 if(typeof p.legendaryTalent!=='boolean')p.legendaryTalent=!!p.specialCharacter||hash(key+'|talent')%100<25;
 return p.matchSkills;
}
function stageTarget(division){return progression.stageTargets[Math.max(1,Math.min(8,Number(division)||1))];}
function preparationLevel(count,baseLimit=10){return Math.max(progression.preparationBaseLevel,baseLimit-2)+Math.max(0,Math.floor(count))*progression.preparationLevelsPerCamp;}
function studyReady(p,count){const s=p.legendaryStudy;return !!s&&s.id===p.matchSkills?.[5]&&(s.prepared===true||Number.isFinite(s.startedAt)&&count>=s.startedAt+progression.studyCamps);}
function beginStudy(p,id,{division=1,state}={}){ensure(p);const count=campCount(p,state);if(division<4||count<8||!p.legendaryTalent&&!p.specialCharacter||!legendaryOptions(p).includes(id))return false;const old=p.legendaryStudy;if(old?.id===id)return true;if(studyReady(p,count)&&count>=14)return false;p.legendaryStudy={id,startedAt:count,prepared:false,source:'camp'};p.matchSkills[5]=id;return true;}
function signatureState(p,{division=1}={}){const eligible=!!(p.specialCharacter||p.academyOrigin);return {version:1,eligible,division:6,available:eligible&&division>=6,id:p.signatureProgress?.id||null,unlocked:false};}
function milestone(count){const tier=Math.min(3,Math.floor(count/6)),stars=(count-tier*6)/2;return ['Siyah','Gümüş','Altın','Mor'][tier]+' · '+stars.toLocaleString('tr-TR')+' yıldız';}
function campCount(p,state){if(p?.epicTeam)return 4;if(p?.specialCharacter&&p.id?.startsWith('opponent-')&&Number.isFinite(p.skillCamps))return Math.max(0,Math.floor(p.skillCamps));const C=root.CampRules||(typeof require==='function'?require('./camp-rules.js'):null);if(state?.camp&&C)return C.progress(state,p).count;return Number.isFinite(p?.skillCamps)?Math.max(0,Math.floor(p.skillCamps)):(C?.progress({},p).count||0);}
// Legacy primary slots only; additional slot gates are in progression.requirements.
const campRequirements={Common:0,Uncommon:1,Rare:2,Legendary:3};
function view(p,{division=1,state}={}){
 const ids=ensure(p),count=campCount(p,state);return ids.map((id,slot)=>({id,slot})).filter(({id})=>byId.get(id)?.rarity!=='Legendary'||p.epicTeam||p.specialCharacter||p.legendaryTalent).map(({id,slot})=>{
  const skill=byId.get(id),granted=p.academySkillGrants?.includes(id),required=granted?0:progression.requirements[slot]??3,minDivision=progression.minimumDivision[slot]||1,study=slot!==5||studyReady(p,count),unlocked=!!p.epicTeam||granted||division>=minDivision&&count>=required&&study;
  let reason=unlocked?'':(division<minDivision?({2:'Bölgesel Lig',3:'2. Lig',4:'1. Lig'}[minDivision]||minDivision+'. aşama')+' · ':'')+milestone(required);
  if(!unlocked&&slot===5)reason+=!p.legendaryStudy?' · Legendary çalışması seç':!study?' · '+Math.max(0,(p.legendaryStudy.startedAt||0)+progression.studyCamps-count)+' kamp çalışması kaldı':'';
  return {...skill,slot,unlocked,hidden:skill.rarity==='Legendary'&&!unlocked,camps:count,unlockCamp:required,minimumDivision:minDivision,reason,studyReady:study};
 }).sort((a,b)=>a.unlockCamp-b.unlockCamp);
}
function allows(p,id,{division=1,state}={}){if(!p||!byId.has(id))return false;if(p.epicTeam)return true;const ids=p.matchSkillsVersion===3&&p.matchSkills?.length===6?p.matchSkills:ensure(p),slot=ids.indexOf(id);if(slot<0||byId.get(id)?.rarity==='Legendary'&&!p.legendaryTalent&&!p.specialCharacter)return false;if(p.academySkillGrants?.includes(id))return true;const count=campCount(p,state);return division>=progression.minimumDivision[slot]&&count>=progression.requirements[slot]&&(slot!==5||studyReady(p,count));}
function nextGoal(p,options={}){const locked=view(p,options).filter(s=>!s.unlocked);if(!locked.length)return null;const next=locked[0];return {id:next.id,slot:next.slot,target:milestone(next.unlockCamp),name:next.slot===5?'İkinci Legendary':next.slot===4?'Dördüncü yetenek':next.hidden?'İlk Legendary':next.name,reason:next.reason,campsLeft:Math.max(0,next.unlockCamp-next.camps)};}
function teamHasLegendary(players,options={}){return (players||[]).some(p=>view(p,options).some(skill=>skill.rarity==='Legendary'&&skill.unlocked));}
const api={progression,stageTarget,preparationLevel,legendaryOptions,beginStudy,studyReady,signatureState,milestone,nextGoal,catalog,ensure,view,allows,campCount,campRequirements,teamHasLegendary};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PlayerSkills=api;
})(globalThis);
