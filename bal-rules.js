(function(root){
'use strict';
const Clock=root.SeasonClock||(typeof require==='function'?require('./season-clock.js'):null);
const display=v=>Number(v.toFixed(2)).toLocaleString('tr-TR');
const departments=['Performans Merkezi','Kulüp Yönetimi','Gelir Merkezi','Teknik Ekip','Oyuncu Keşfi'];
const definitions=[
 ['bal_coach',1,'Yardımcı Antrenör','♟',[.6,1.2,2,3,4],v=>'Saniyede +'+display(v)+' otomatik talimat.',220],
 ['bal_shift',1,'Vardiya Planı','◷',[10,15,20,25,30].map(v=>v/60),v=>'Vardiyayı açar: '+Math.round(v*60)+' dk çevrimdışı çalışma. Bitince 1 saat dinlenir.',300],
 ['bal_plan',1,'Çalışma Planı','↻',[40,90,160,250,360],v=>'Her 10. otomatik talimata +'+display(v)+' AP.',260],
 ['bal_position',0,'Pozisyon Antrenmanı','↗',[12,25,42,65,95],v=>'Ulaşan her talimata +'+display(v)+' AP.',220],
 ['bal_video',0,'Video Destekli Çalışma','▤',[70,160,300,500,800],v=>'Her 5. talimata +'+display(v)+' AP.',300],
 ['bal_recovery',0,'Toparlanma Ünitesi','✚',[.08,.16,.25,.35,.5],v=>'Çevrimdışı AP +%'+display(v*100)+'.',260],
 ['bal_sponsor',2,'Yerel Sponsor','▣',[2,4,7,12,20],v=>'Her 10 talimatta ek +'+display(v)+' bütçe.',400],
 ['bal_shop',2,'Kulüp Mağazası','▤',[.1,.2,.35,.55,.8],v=>'Temel gelir ve Yerel Sponsor ödemeleri +%'+display(v*100)+' bütçe.',350],
 ['bal_fans',2,'Taraftar Organizasyonu','◎',[150,350,650,1100,1800],v=>'Oynanan her maç için +'+display(v)+' bütçe.',260],
 ['bal_scout',3,'Gözlemci','▤',[1,2,3,4,5],v=>'Rakip raporu +'+display(v)+' gün erken.',250],
 ['bal_personal',3,'Bireysel Gelişim Planı','+',[.01,.02,.03,.04,.05],v=>'Kart yükseltmelerinin ücretsiz olma şansını artırır.',400],
 ['bal_archive',3,'Analiz Arşivi','▥',[.02,.04,.06,.08,.1],v=>'Kart yükseltmelerinde %'+display(v*100)+' AP indirimi.',360],
 ['bal_search',4,'Keşif Ağı','◎',[9,8,7,6,5],v=>'Her '+display(v)+' oyun gününde yeni katalog.',300],
 ['bal_contacts',4,'Yerel Bağlantılar','♧',[4,5,6,7,8],v=>'Yeni kataloglarda '+display(v)+' aday.',350],
 ['bal_talent',4,'Yetenek Tarama','↗',[.025,.05,.075,.1,.125],v=>'Katalogda daha güçlü adaylar bulma şansını artırır.',400]
];
const extendedIds=new Set(['bal_coach','bal_shift','bal_plan','bal_position','bal_video','bal_recovery','bal_sponsor','bal_shop','bal_fans']);
for(const d of definitions)if(d[0]==='bal_sponsor'||d[0]==='bal_fans')d[4]=d[4].map(v=>v*10);
const successors=[
 ['bal_coach','bal_double','Üçüncü Hat',[.2,.4,.6,.8,1],v=>'Üçüncü hat ana hattın '+Math.round(v*5)+'/5 kapasitesinde düzenli çalışır.'],
 ['bal_shift','bal_efficiency','Vardiya Verimi',[.03,.06,.09,.12,.15],v=>'Vardiyada kazanılan çevrimdışı AP payını artırır.'],
 ['bal_plan','bal_hands','Birebir Çalışma',[20,40,60,80,100],v=>'Elle verilen her talimata +'+v+' AP.'],
 ['bal_position','bal_warmstart','Maç Öncesi Isınma',[250,650,1400,2700,5000],v=>'Günün ilk 20 talimatına +'+v+' AP.'],
 ['bal_video','bal_precision','Hedefli Tekrar',[.02,.04,.06,.08,.1],v=>'Talimatların kritik AP kazandırma şansını artırır.'],
 ['bal_recovery','bal_evening','Gün Sonu Toparlanma',[1000,2500,5500,11000,20000],v=>'Gün sonunda +'+v+' AP.'],
 ['bal_sponsor','bal_matchsponsor','Maç Günü Sponsorluğu',[2000,6000,16000,36000,80000],v=>'Oynanan her maç için ek +'+v+' bütçe.'],
 ['bal_shop','bal_members','Kulüp Üyeliği',[1000,3000,7000,15000,30000],v=>'Her gün +'+v+' bütçe.'],
 ['bal_fans','bal_orders','Taraftar Siparişleri',[10,30,70,150,310],v=>'Her 10 talimatta ek +'+v+' bütçe.'],
 ['bal_scout','bal_review','Maç Sonu İnceleme',[5000,12000,25000,45000,75000],v=>'Galibiyete +'+display(v)+' AP.'],
 ['bal_personal','bal_mentor','Gelişim Mentoru',[.01,.02,.03,.04,.05],v=>'Tüm kart yükseltmelerinde ek %'+Math.round(v*100)+' AP indirimi.'],
 ['bal_archive','bal_remote','Uzaktan Antrenman',[.03,.06,.09,.12,.15],v=>'Çevrimdışı AP verimine +%'+Math.round(v*100)+'.'],
 ['bal_search','bal_negotiator','Transfer Görüşmeleri',[.03,.06,.09,.12,.15],v=>'Yeni katalog transfer fiyatları %'+Math.round(v*100)+' daha uygun.'],
 ['bal_contacts','bal_network','Bölgesel Bağlantılar',[.085,.095,.105,.115,.125],v=>'Katalogda güçlü ve çok güçlü aday bulma şansını artırır.'],
 ['bal_talent','bal_academy','Akademi İşbirliği',[1,2,3,4,5],v=>'Yeni adaylar +'+v+' kart seviyesi gelişmiş gelir.']
];
const catalog=definitions.map(([id,floor,name,icon,core,describe,price])=>({id,floor,name,icon,values:[...core,...Array(5).fill(core[4])],describe,price,bal:true,bonus:successors.find(row=>row[0]===id)}));

// Storage keeps ten legacy levels; purchasing uses the stage-specific limit.
const longBal=new Set(['bal_shift','bal_coach','bal_position','bal_video','bal_sponsor','bal_shop','bal_scout','bal_contacts']);
const professional=[
 ['pro_coach',0,'Profesyonel Antrenör','♟',150,v=>'Her talimata +'+display(v)+' AP.'],
 ['pro_repeat',0,'Gelişim Takibi','↻',.02,v=>'Her 5 ücretli kart yükseltmesinde harcanan AP’nin %'+display(v*100)+' kadarı geri gelir.'],
 ['pro_analysis',0,'Uyum Antrenmanı','▤',.03,v=>'Yeni transferin ilk 3 kart yükseltmesinde %'+display(v*100)+' AP indirimi.'],
 ['pro_coordinator',1,'Antrenman Koordinatörü','◷',1.2,v=>'Saniyede +'+display(v)+' otomatik talimat.'],
 ['pro_camp',1,'Kamp Organizasyonu','✚',.2,v=>'Yeni kamplar '+display(v)+' gün daha kısa sürer.'],
 ['pro_travel',1,'Fazladan Mesai','◷',.2,v=>'Maç beklerken ve maç sırasında vardiya, maç başına en fazla '+(5+Math.round(v*5)*5)+' dakika devam eder. Süre vardiyandan düşer.'],
 ['pro_sponsor',2,'Lig Sponsorluğu','▣',30000,v=>'Her 3 tamamlanan maçta +'+display(v)+' bütçe.'],
 ['pro_shop',2,'Lisanslı Ürünler','▤',2,v=>'Her gün takipçi başına +'+display(v)+' bütçe.'],
 ['pro_tickets',2,'Antrenman Sponsorluğu','◎',1000,v=>'Her ücretli kart yükseltmesinde +'+display(v)+' bütçe.'],
 ['pro_search',3,'İhtiyaç Analizi','↗',.08,v=>'Güçlü aday seçiminde kadronun en zayıf rolüne öncelik verir.'],
 ['pro_negotiator',3,'Transfer Görüşmeleri','♧',.04,v=>'Yeni katalog transferleri %'+display(v*100)+' daha uygun.'],
 ['pro_scout',3,'Ulusal Gözlem Ağı','◎',.01,v=>'Katalogda güçlü ve çok güçlü aday bulma şansını artırır.']
];
// Stable bonus IDs preserve saved levels; their outcomes are independent of the primary effect.
const professionalBonuses=[
 ['pro_coach','pro_focus','Hedefli Antrenman',[.01,.02,.03,.04,.05],v=>'Talimatların kritik AP kazandırma şansını artırır.'],
 ['pro_repeat','pro_refund','Eğitim Bursu',[1000,2000,3000,4000,5000],v=>'Her 5 ücretli kart yükseltmesinde +'+display(v)+' bütçe.'],
 ['pro_analysis','pro_adapt','Transfer Desteği',[.01,.02,.03,.04,.05],v=>'Yeni katalogdaki transfer bedelleri %'+display(v*100)+' azalır.'],
 ['pro_coordinator','pro_tempo','Ortak Tempo',[.2,.4,.6,.8,1],v=>'Ek standart hatlar açar. Yeni hatların her biri %'+display(v*100)+' kapasiteyle çalışır; her yükseltmede 1/5 artar. Medya hattını etkilemez.'],
 ['pro_camp','pro_campcash','Kamp Anlaşmaları',[.04,.08,.12,.16,.2],v=>'Kamp bütçe maliyeti %'+display(v*100)+' azalır.'],
 ['pro_travel','pro_campap','Mesai Verimi',[.04,.08,.12,.16,.2],v=>'Fazladan mesaide kazanılan AP +%'+display(v*100)+'.'],
 ['pro_sponsor','pro_contract','Galibiyet Primi',[2000,4000,6000,8000,10000],v=>'Her galibiyette +'+display(v)+' AP.'],
 ['pro_shop','pro_merch','Tanıtım Anlaşmaları',[.1,.2,.3,.4,.5],v=>'Sponsor paylaşımlarının bütçe kazancı +%'+display(v*100)+'.'],
 ['pro_tickets','pro_trainingcash','Günlük Antrenman Desteği',[200,400,600,800,1000],v=>'Gün sonunda +'+display(v)+' AP.'],
 ['pro_scout','pro_elite','Elit Oyuncu Bağlantıları',[.001,.002,.003,.004,.005],v=>'Milletler Kupası’ndan itibaren elit aday bulma şansını artırır.']
];
for(const [id,floor,name,icon,step,describe] of professional){const bonus=professionalBonuses.find(b=>b[0]===id),r={id,floor,name,icon,values:Array.from({length:5},(_,i)=>step*(i+1)*(id==='pro_coach'||id==='pro_coordinator'?2:1)),compressed:!!bonus,describe,price:300,bal:true,division:3};if(bonus){successors.push(bonus);r.bonus=bonus;r.values.push(...Array(5).fill(r.values[4]));}catalog.push(r);}

catalog.push({id:'first_academy',floor:0,name:'Altyapı Akademisi',icon:'♟',values:[2,3,4],describe:v=>v+' genç için eğitim alanı. Transferden genç al, yönünü ve yeteneğini seç.',price:300,bal:true,division:4});
function maxLevel(s,r){if(r.id==='pro_scout'&&(s.division||2)<6)return Math.max(5,level(s,r.id));return r.division?r.values.length:!r.bal?r.values.length:Math.max(longBal.has(r.id)?10:5,level(s,r.id));}

function bonusLevel(s,id){const bonus=successors.find(row=>row[1]===id);return bonus?Math.max(0,Math.min(5,level(s,bonus[0])-5)):0;}
// Project a card level without mutating the saved game or running migrations.
function previewLevel(s,r,n){const floors=s.floors.slice();floors[r.floor]=floors[r.floor].filter(id=>id!==r.id).concat(Array(Math.max(0,n)).fill(r.id));return {...s,floors};}
const percent=v=>'%'+display(v*100);
const range=(a,b)=>percent(a)+' → '+percent(b);
function contextualDescription(s,r,n,bonus=false){
 const R=root.RoomRules||(typeof require==='function'?require('./room-rules.js'):null),S=root.ScoutRules||(typeof require==='function'?require('./scout-rules.js'):null);
 if(!R)return null;const a=previewLevel(s,r,bonus?5:0),b=previewLevel(s,r,n),id=bonus?r.bonus?.[1]:r.id;
 if(['bal_coach','pro_coordinator'].includes(id))return display(R.effects(b).autoRate-R.effects(a).autoRate)+' talimat/sn. otomatik.';
 if(id==='bal_personal')return 'Ücretsiz yükseltme şansı: '+range(R.freeTrainingChance(a),R.freeTrainingChance(b))+'.';
 if(['bal_precision','pro_focus'].includes(id))return 'Kritik AP şansı: '+range(R.effects(a).critChance,R.effects(b).critChance)+'.';
 if(['bal_efficiency','bal_remote','bal_recovery'].includes(id)){const share=x=>{const e=R.effects(x);return e.offlineEfficiency*(1+e.offlineBonus)};return 'Vardiyada çevrimdışı AP payı: '+range(share(a),share(b))+'.';}
 if(S&&['bal_talent','pro_scout','bal_network'].includes(id)){const x=S.config(a),y=S.config(b);return 'Güçlü adaylı katalog: '+range(x.opportunityChance,y.opportunityChance)+'. Çok güçlü veya iki güçlü aday: '+range(x.greatChance,y.greatChance)+'.';}
 if(S&&id==='pro_search')return 'En zayıf rolünden bir aday gelir. Güçlü aday seçiminde '+percent(S.config(b).needRolePriority)+' şansla bu role öncelik verilir.';
 if(S&&id==='pro_elite'){if((s.division||2)<6)return 'Milletler Kupası’nda açılır. Elit aday şansı: '+range(S.eliteChance({...a,division:6}),S.eliteChance({...b,division:6}))+'.';return 'Elit aday şansı: '+range(S.eliteChance(a),S.eliteChance(b))+'.';}
 return null;
}
function describePrimary(s,r,n=level(s,r.id)){const contextual=contextualDescription(s,r,n);if(contextual)return contextual;let v=r.values[Math.max(0,n-1)];if(r.id==='bal_shift'&&s.division>=3)v*=3;if(Clock.isWeekly(s)){if(r.id==='pro_shop')v*=Clock.economyScale(s);if(r.id==='bal_fans')v*=2;if(r.id==='pro_sponsor')return '3 maçta toplam +'+display(v*2)+' bütçe.';}return r.describe(v);}
function describeBonus(s,r,n){const contextual=contextualDescription(s,r,n,true);if(contextual)return contextual;if(r.bonus?.[1]==='pro_elite'&&(s.division||2)<6)return 'Milletler Kupası’nda etkinleşir. '+r.bonus[4](r.bonus[3][n-6]);let v=r.bonus[3][n-6],text;if(Clock.isWeekly(s)){if(['bal_evening','bal_members','pro_trainingcash'].includes(r.bonus[1]))v*=Clock.economyScale(s);if(['bal_matchsponsor','bal_review'].includes(r.bonus[1]))v*=2;}text=r.bonus[4](v);if(Clock.isWeekly(s)&&r.bonus[1]==='bal_warmstart')text=text.replace('ilk 20','ilk '+Clock.morningInstructions(s));return text;}
function describeBlock(s,r,n=level(s,r.id)){const primary=describePrimary(s,r,n);if(!r.bonus)return primary;return primary+(n>5?' '+r.bonus[2]+': '+describeBonus(s,r,n):'');}
const departmentPrices={2:0,4:0};
function departmentOpen(s,f){return s.stage==='bal'&&(!Object.hasOwn(departmentPrices,f)||!Array.isArray(s.openDepartments)||s.openDepartments.includes(f));}
function openDepartment(s,f){if(s.stage!=='bal'||!Object.hasOwn(departmentPrices,f)||departmentOpen(s,f))return false;s.openDepartments.push(f);if(f===2)s.incomeProgress=0;if(f===4)s.scouting.startedDay=(s.balStartDay||1)+Math.floor(s.instructions/Clock.dayInstructions(s));return true;}
const gates=[];
function remainingDays(){return 0}
function upgraded(s,id){if(s.balReadyDay)delete s.balReadyDay[id]}
function level(s,id){return (s.floors||[]).flat().filter(x=>x===id).length}
function value(s,id){if(id==='pro_elite'&&(s.division||2)<6)return 0;const bonus=successors.find(row=>row[1]===id);if(bonus){const r=catalog.find(x=>x.id===bonus[0]);return (!r.division||s.division>=r.division)&&departmentOpen(s,r.floor)?bonus[3][bonusLevel(s,id)-1]||0:0;}const r=catalog.find(x=>x.id===id);return r&&(!r.division||s.division>=r.division)&&departmentOpen(s,r.floor)?r.values[level(s,id)-1]||0:0}
function enter(raw,day){if(raw.stage==='bal')return JSON.parse(JSON.stringify(raw));const R=root.RoomRules||(typeof require==='function'?require('./room-rules.js'):null),s=R.defaults();s.stage='bal';if(raw.dailyShift)s.dailyShift=JSON.parse(JSON.stringify(raw.dailyShift));s.floors=s.floors.map((_,f)=>(raw.floors?.[f]||[]).filter(id=>R.catalog.some(r=>r.id===id&&!r.bal&&r.floor===f)));s.budget*=10;s.budgetScale=10;s.balVersion=1;s.balStart=0;s.balStartDay=1;return s}
function requirement(s,r){if(r.division&&(s.division||2)<r.division)return r.division===4?'1. Lig aşamasında açılır':'2. Lig aşamasında açılır';if(r.bal&&s.stage!=='bal')return 'BAL aşamasında açılır';if(s.stage!=='bal')return null;if(r.bal&&!departmentOpen(s,r.floor))return 'Önce '+departments[r.floor]+' aç';return null}
// Early investments offer several routes; later levels remain long-term goals.
// Cumulative investment follows season income; no calendar or match gates.
const investmentPrices={bal_sponsor:[400,900,2000,4000,7500,13000,22000,36000,65000,120000],bal_coach:[500,1000,2400,5000,9500,16500,28000,44000,80000,140000]};
const balLatePriceScale={bal_shop:.95,bal_coach:1.45,bal_sponsor:1.45};
const priceSteps=[400,900,2000,4000,7500,13000,22000,36000,65000,120000];
// Professional bonuses alternate saving goals and affordable upgrades across departments.
// Compressed block levels 1–5 retain their original entry prices; existing upgrades are preserved.
const weeklyProfessionalEntryPrices=Object.freeze([30000,50000,80000,110000,150000]);
const weeklyProfessionalBonusPrices=Object.freeze({
 pro_coach:[720000,840000,1000000,1240000,1680000],
 pro_repeat:[520000,625000,760000,960000,1280000],
 pro_analysis:[320000,400000,520000,680000,960000],
 pro_coordinator:[800000,960000,1160000,1440000,2000000],
 pro_camp:[360000,465000,600000,800000,1120000],
 pro_travel:[240000,360000,480000,640000,880000],
 pro_sponsor:[600000,760000,960000,1240000,1760000],
 pro_shop:[1280000,1520000,1840000,2240000,2880000],
 pro_tickets:[560000,705000,880000,1120000,1600000],
 pro_scout:[960000,1200000,1480000,1840000,2560000]
});
const professionalSinglePrices={pro_search:[12000,40000,160000,400000,1120000],pro_negotiator:[12000,50000,200000,520000,1280000]};
// Regional bonus goals mature at different rates; basic investments stay accessible.
const regionalCorePrices=Object.freeze({bal_video:[540,1500,4500,13500,38000],bal_contacts:[630,1750,4900,14000,35000]});
const regionalBonusPriceScale=Object.freeze({bal_shift:[.8,.85,.9,.95,1],bal_coach:[1,1,1.05,1.08,1.12],bal_position:[.9,.95,1,1.1,1.15],bal_video:[3.5,2.4,1.8,1.5,1.3],bal_sponsor:[1.15,1.15,1.1,1.1,1.15],bal_scout:[.9,1,1.2,1.4,1.5],bal_contacts:[3,2.2,1.8,1.6,1.5]});
function price(s,r){const n=level(s,r.id);if(n>=maxLevel(s,r))return Infinity;if(r.compressed)return [...weeklyProfessionalEntryPrices,...weeklyProfessionalBonusPrices[r.id]][n];if(r.division&&professionalSinglePrices[r.id])return professionalSinglePrices[r.id][n];if(r.division)return [12000,18000,27000,40000,58000,82000,114000,156000,210000,280000][n];if(!r.bal)return 10*([10,6,9,10,15][n]??Infinity);if((s.division||1)<3&&n<5&&regionalCorePrices[r.id])return regionalCorePrices[r.id][n];const base=investmentPrices[r.id]?.[n]??r.price/300*priceSteps[n],lateDiscount=n===9?.9:n===8?.95:1;return Math.round(base*(n>=5?1.4:1)*lateDiscount*((s.division||1)<3&&n>=5?(balLatePriceScale[r.id]??1.7):1)*((s.division||1)<3&&r.id==='bal_video'&&n===9?1.7:1)*(s.division>=3?1:n>=5?.85:.9)*((s.division||1)<3&&n>=5?(regionalBonusPriceScale[r.id]?.[n-5]??1):1)/10)*10;}
function effects(s,e){if(s.stage!=='bal')return e;const lanes=[1,e.instructionLanes?.[1]||0,value(s,'bal_double')].filter(capacity=>capacity>0);const instructionLanes=value(s,'pro_tempo')?lanes.concat(lanes.map(()=>value(s,'pro_tempo'))):lanes;return {...e,instructionLanes,doubleChance:instructionLanes.reduce((n,v)=>n+v,0)-1,manualBonusAP:value(s,'bal_hands'),offlineHours:value(s,'bal_shift')*(s.division>=3?3:1),critChance:Math.min(1,e.critChance+value(s,'pro_focus')+value(s,'bal_precision')),critMult:Math.max(e.critMult,value(s,'bal_precision')?2:1),clickAP:e.clickAP*2.5+value(s,'pro_coach')+value(s,'bal_position')+value(s,'bal_hands'),autoAP:e.autoAP*2.5+value(s,'pro_coach')+value(s,'bal_position'),baseAP:e.baseAP*2.5+value(s,'pro_coach')+value(s,'bal_position'),autoRate:(e.autoRate*1.4+(value(s,'bal_coach')+value(s,'pro_coordinator'))*e.workflowRate)*1.4,baseAutoRate:(e.baseAutoRate*1.4+value(s,'bal_coach')+value(s,'pro_coordinator'))*1.4,repeatAP:e.repeatAP*1.25+value(s,'bal_video'),morningAP:e.morningAP*1.25+value(s,'bal_warmstart'),dayAP:e.dayAP*1.25+value(s,'bal_evening')+value(s,'pro_trainingcash'),offlineBonus:e.offlineBonus*1.25+value(s,'bal_recovery')+value(s,'bal_remote'),offlineEfficiency:e.offlineEfficiency+value(s,'bal_efficiency')};}
function cash(s){if(!departmentOpen(s,2))return 0;return ((20+value(s,'bal_sponsor'))*(1+value(s,'bal_shop'))+value(s,'bal_orders'))}
// Merge old separate bonuses into levels 6–10, without charging again.
function migrateLevels(s,raw){
 s.balReadyDay={};if(s.stage!=='bal'||raw?.balBlockVersion===4)return;
 const map=[0,1,2,2,3,3,4,4,5,5,5];
 for(const r of catalog.filter(r=>r.bonus)){const old=(raw?.floors?.[r.floor]||[]),n=old.filter(id=>id===r.id).length,extra=old.filter(id=>id===r.bonus[1]).length;const base=raw?.balBlockVersion===2&&extendedIds.has(r.id)?map[Math.min(10,n)]:Math.min(5,n),target=extra?5+Math.min(5,extra):base;s.floors[r.floor]=s.floors[r.floor].filter(id=>id!==r.id);s.floors[r.floor].push(...Array(target).fill(r.id));}
 s.balBlockVersion=4;
}
const api={previewLevel,describePrimary,describeBonus,maxLevel,bonusLevel,describeBlock,migrateLevels,departmentPrices,departmentOpen,openDepartment,departments,catalog,gates,remainingDays,upgraded,enter,requirement,price,effects,value,cash};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.BalRules=api;
})(globalThis);
