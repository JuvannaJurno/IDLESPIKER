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
  "name": "Zor Topa Pas",
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
catalog.push({id:'sky-serve',name:'Gökyüzü Servisi',rarity:'Rare',description:'Top yüksek bir yay çizerek rakip sahaya iner.'});byId.set('sky-serve',catalog.at(-1));
catalog.push({id:'fake-set',name:'Pasör Aldatmacası',rarity:'Rare',description:'Hücum için yükselip havada takım arkadaşına parmak pas çıkarır.'});byId.set('fake-set',catalog.at(-1));
for(const skill of [{id:'court-vision',name:'Kort Görüşü',rarity:'Rare',description:'Havada savunmanın açığını fark ederek topu boş alana yönlendirir.'},{id:'team-heart',name:'Takımın Kalbi',rarity:'Legendary',description:'Sayı arasında toplanan takım arkadaşlarının temel özelliklerini her oyuncunun ilk top temasına kadar %12 güçlendirir.'},{id:'pipe-attack',name:'Pipe Attack',rarity:'Uncommon',description:'Üç metre çizgisinin gerisinden arka orta hücumu.'},{id:'setter-dump',name:'Pasör Plasesi',rarity:'Rare',description:'Ön hattaki pasör ikinci dokunuşu boş ön alana bırakır.'},{id:'kick-save',name:'Ayakla Kurtarış',rarity:'Rare',description:'Elleri yetişmeyen alçak topa ayağıyla dokunup ralliyi sürdürür.'}]){catalog.push(skill);byId.set(skill.id,skill);}
const pools={
 setter:{Common:['tempo-third'],Uncommon:['back','float','tempo-second'],Legendary:['team-heart','sync-attack','perfect-second-touch','one-hand-rescue','jump-float-legendary']},
 outside:{Rare:['court-vision'],Common:['cross','commit-block','line'],Uncommon:['power-hit','wipe','rebound','float','pipe-attack'],Legendary:['ghost-tip','jump-legendary','jump-float-legendary','tempo-minus']},
 opposite:{Rare:['court-vision'],Common:['cross','commit-block','line'],Uncommon:['power-hit','wipe','close','rebound'],Legendary:['jump-legendary','ghost-tip','tempo-minus']},
 middle:{Common:['commit-block'],Uncommon:['read','close','triple-block','slide-attack'],Legendary:['absolute-read','tempo-minus']},
 libero:{Common:['court-read'],Uncommon:['cover'],Legendary:['pancake']}
};
function hash(text){let n=2166136261;for(const c of String(text)){n^=c.charCodeAt(0);n=Math.imul(n,16777619)}return n>>>0}
function ensure(p){if(!p)return [];if(p.epicTeam){p.matchSkills=catalog.map(s=>s.id);p.matchSkillsVersion=1;return p.matchSkills;}const pool=pools[p.role]||pools.outside,tiers=p.legendaryTalent===false&&!p.specialCharacter?['Common','Uncommon']:['Common','Uncommon','Legendary'];if(pool.Rare&&hash([p.id,p.name,p.surname,p.role,'rare'].join('|'))%100<25)tiers.push('Rare');if(p.matchSkillsVersion===1&&p.matchSkills?.[1]==='line'&&pool.Common.includes('line')){const key=[p.id,p.name,p.surname,p.role].join('|');p.matchSkills=[...p.matchSkills];p.matchSkills[0]='line';p.matchSkills[1]=pool.Uncommon[hash(key+'|Uncommon')%pool.Uncommon.length];}if(p.matchSkillsVersion!==1||!Array.isArray(p.matchSkills)||p.matchSkills.length!==tiers.length||p.matchSkills.some((id,i)=>!pool[tiers[i]].includes(id))){const key=[p.id,p.name,p.surname,p.role].join('|');p.matchSkills=tiers.map(t=>pool[t][hash(key+'|'+t)%pool[t].length]);p.matchSkillsVersion=1;}return p.matchSkills;}
function campCount(p,state){if(p?.epicTeam)return 4;const C=root.CampRules||(typeof require==='function'?require('./camp-rules.js'):null);if(state?.camp&&C)return C.progress(state,p).count;return Number.isFinite(p?.skillCamps)?Math.max(0,Math.floor(p.skillCamps)):(C?.progress({},p).count||0);}
function view(p,{division=1,state}={}){return ensure(p).map(id=>{const s=byId.get(id),legendary=s.rarity==='Legendary',count=campCount(p,state),unlocked=!!p.epicTeam||(Number(division)>=2&&(!legendary||(Number(division)>=2&&count>=3)));return {...s,unlocked,hidden:legendary&&!unlocked,camps:count,reason:p.epicTeam?'':Number(division)<2?'BAL’da açılır':legendary&&count<3?'1,5 yıldız · 3. kamp tamamlanınca açılır':''};});}
function allows(p,id,{division=1,state}={}){if(p?.epicTeam)return byId.has(id);if(Number(division)<2)return false;if(id==='setter-dump')return p.role==='setter'&&(ensure(p).includes('back')||ensure(p).includes('tempo-third'));if(id==='kick-save')return ensure(p).includes('cover')||ensure(p).includes('rebound');if(id==='fake-set')return ensure(p).includes('back')||ensure(p).includes('tempo-third');if(id==='sky-serve')return ensure(p).includes('float');if(!ensure(p).includes(id))return false;return byId.get(id)?.rarity!=='Legendary'||(Number(division)>=2&&campCount(p,state)>=3);}
function teamHasLegendary(players,options={}){return (players||[]).some(p=>view(p,options).some(skill=>skill.rarity==='Legendary'&&skill.unlocked));}
const api={catalog,ensure,view,allows,campCount,teamHasLegendary};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.PlayerSkills=api;
})(globalThis);
