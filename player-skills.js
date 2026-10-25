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
 libero:{Rare:['dive','kick-save'],Common:['court-read'],Uncommon:['cover'],Legendary:['pancake']}
};
function hash(text){let n=2166136261;for(const c of String(text)){n^=c.charCodeAt(0);n=Math.imul(n,16777619)}return n>>>0}
function ensure(p){
 if(!p)return [];if(p.epicTeam){p.matchSkills=catalog.map(s=>s.id);p.matchSkillsVersion=2;return p.matchSkills;}
 const signature=(p.signatureSkills||[]).find(id=>['kick-save','dive'].includes(id)),base=pools[p.role]||pools.outside,pool=signature?{...base,Rare:[...new Set([...(base.Rare||[]),signature])]}:base,old=Array.isArray(p.matchSkills)?p.matchSkills:[],key=[p.id,p.name,p.surname,p.role].join('|');
 // Keep the Legendary slot stable for named rival and transfer identities.
 p.matchSkills=['Common','Uncommon','Legendary','Rare'].map(tier=>tier==='Rare'&&signature?signature:old.find(id=>pool[tier].includes(id))||pool[tier][hash(key+'|'+tier)%pool[tier].length]);p.matchSkillsVersion=2;if(typeof p.legendaryTalent!=='boolean')p.legendaryTalent=!!p.specialCharacter||hash(key+'|talent')%100<25;return p.matchSkills;
}
function campCount(p,state){if(p?.epicTeam)return 4;if(p?.specialCharacter&&p.id?.startsWith('opponent-')&&Number.isFinite(p.skillCamps))return Math.max(0,Math.floor(p.skillCamps));const C=root.CampRules||(typeof require==='function'?require('./camp-rules.js'):null);if(state?.camp&&C)return C.progress(state,p).count;return Number.isFinite(p?.skillCamps)?Math.max(0,Math.floor(p.skillCamps)):(C?.progress({},p).count||0);}
const campRequirements={Common:0,Uncommon:1,Rare:2,Legendary:3};
function view(p,{division=1,state}={}){return ensure(p).filter(id=>byId.get(id)?.rarity!=='Legendary'||p.epicTeam||p.specialCharacter||p.legendaryTalent).map(id=>{const s=byId.get(id),required=p.academySkillGrants?.includes(id)?0:campRequirements[s.rarity]??2,count=campCount(p,state),unlocked=!!p.epicTeam||(required===0||(Number(division)>=2&&count>=required)),reason=unlocked?'':(Number(division)<2?'BAL’da · ':'')+(required===3?'1,5 yıldız · 3. kamp tamamlanınca açılır':required+'. kamp tamamlanınca açılır');return {...s,unlocked,hidden:s.rarity==='Legendary'&&!unlocked,camps:count,unlockCamp:required,reason};}).sort((a,b)=>a.unlockCamp-b.unlockCamp);}
function allows(p,id,{division=1,state}={}){if(p?.epicTeam)return byId.has(id);if(!p||!ensure(p).includes(id)||byId.get(id)?.rarity==='Legendary'&&!p.legendaryTalent&&!p.specialCharacter)return false;const required=p.academySkillGrants?.includes(id)?0:campRequirements[byId.get(id)?.rarity]??2;return required===0||(Number(division)>=2&&campCount(p,state)>=required);}
function teamHasLegendary(players,options={}){return (players||[]).some(p=>view(p,options).some(skill=>skill.rarity==='Legendary'&&skill.unlocked));}
const api={catalog,ensure,view,allows,campCount,campRequirements,teamHasLegendary};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PlayerSkills=api;
})(globalThis);
