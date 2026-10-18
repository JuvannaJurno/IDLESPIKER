(function(root){
'use strict';
const display=v=>Number(v.toFixed(1)).toLocaleString('tr-TR');
const departments=['Performans Merkezi','Kulüp Yönetimi','Gelir Merkezi','Teknik Ekip','Oyuncu Keşfi'];
const definitions=[
 ['bal_coach',1,'Yardımcı Antrenör','♟',[.6,1.2,2,3,4],v=>'Saniyede +'+display(v)+' otomatik talimat.',220],
 ['bal_shift',1,'Vardiya Koordinasyonu','◷',[.03,.06,.09,.12,.15],v=>'Çevrimdışı verim +'+display(v*100)+' puan. Vardiya gerekir.',300],
 ['bal_plan',1,'Çalışma Planı','↻',[40,90,160,250,360],v=>'Her 10. otomatik talimata +'+display(v)+' AP.',260],
 ['bal_position',0,'Pozisyon Antrenmanı','↗',[12,25,42,65,95],v=>'Ulaşan her talimata +'+display(v)+' AP.',220],
 ['bal_video',0,'Video Destekli Çalışma','▤',[70,160,300,500,800],v=>'Her 5. talimata +'+display(v)+' AP.',300],
 ['bal_recovery',0,'Toparlanma Ünitesi','✚',[.08,.16,.25,.35,.5],v=>'Çevrimdışı AP +%'+display(v*100)+'.',260],
 ['bal_sponsor',2,'Yerel Sponsor','▣',[2,4,7,12,20],v=>'Her 10 talimatta ek +'+display(v)+' bütçe.',400],
 ['bal_shop',2,'Kulüp Mağazası','▤',[.1,.2,.35,.55,.8],v=>'Gelir Merkezi kazancını %'+display(v*100)+' artırır.',350],
 ['bal_fans',2,'Taraftar Organizasyonu','◎',[150,350,650,1100,1800],v=>'Oynanan her maç için +'+display(v)+' bütçe.',260],
 ['bal_scout',3,'Gözlemci','▤',[1,2,3,4,5],v=>'Rakip raporu +'+display(v)+' gün erken.',250],
 ['bal_personal',3,'Bireysel Gelişim Planı','+',[.01,.02,.03,.04,.05],v=>'Ücretsiz kart yükseltme ihtimali +'+display(v*100)+' puan.',400],
 ['bal_archive',3,'Analiz Arşivi','▥',[.02,.04,.06,.08,.1],v=>'Kart yükseltmelerinde %'+display(v*100)+' AP indirimi.',360],
 ['bal_search',4,'Keşif Ağı','◎',[5,4,3,2,1],v=>'Her '+display(v)+' oyun gününde yeni katalog.',300],
 ['bal_contacts',4,'Yerel Bağlantılar','♧',[4,5,6,7,8],v=>'Katalogda '+display(v)+' oyuncu adayı.',350],
 ['bal_talent',4,'Yetenek Tarama','↗',[.15,.23,.32,.42,.55],v=>'Yüksek overall oyuncu bulma şansı %'+display(v*100)+'.',400]
];
const extendedIds=new Set(['bal_coach','bal_shift','bal_plan','bal_position','bal_video','bal_recovery','bal_sponsor','bal_shop','bal_fans']);
for(const d of definitions)if(d[0]==='bal_sponsor'||d[0]==='bal_fans')d[4]=d[4].map(v=>v*10);
const successors=[
 ['bal_coach','bal_double','Çift Talimat',[.2,.4,.6,.8,1],v=>'%'+Math.round(v*100)+' ihtimalle mavi talimat: 2 talimat gücü.'],
 ['bal_shift','bal_longshift','Uzun Vardiya',[.1,.2,.3,.4,.5],v=>'Günlük çevrimdışı çalışma hakkına +'+Math.round(v*60)+' dk.'],
 ['bal_plan','bal_hands','Birebir Çalışma',[20,40,60,80,100],v=>'Elle verilen her talimata +'+v+' AP.'],
 ['bal_position','bal_warmstart','Maç Öncesi Isınma',[250,650,1400,2700,5000],v=>'Günün ilk 20 talimatına +'+v+' AP.'],
 ['bal_video','bal_precision','Hedefli Tekrar',[.02,.04,.06,.08,.1],v=>'Kritik AP kazanma şansına +'+Math.round(v*100)+' puan.'],
 ['bal_recovery','bal_evening','Gün Sonu Toparlanma',[1000,2500,5500,11000,20000],v=>'Gün sonunda +'+v+' AP.'],
 ['bal_sponsor','bal_matchsponsor','Maç Günü Sponsorluğu',[2000,6000,16000,36000,80000],v=>'Oynanan her maç için ek +'+v+' bütçe.'],
 ['bal_shop','bal_members','Kulüp Üyeliği',[1000,3000,7000,15000,30000],v=>'Her gün +'+v+' bütçe.'],
 ['bal_fans','bal_orders','Taraftar Siparişleri',[10,30,70,150,310],v=>'Her 10 talimatta ek +'+v+' bütçe.'],
 ['bal_scout','bal_review','Maç Sonu İnceleme',[5000,12000,25000,45000,75000],v=>'Transfer önerileri açılır. Galibiyete +'+display(v)+' AP.'],
 ['bal_personal','bal_mentor','Gelişim Mentoru',[.01,.02,.03,.04,.05],v=>'Tüm kart yükseltmelerinde ek %'+Math.round(v*100)+' AP indirimi.'],
 ['bal_archive','bal_remote','Uzaktan Antrenman',[.03,.06,.09,.12,.15],v=>'Çevrimdışı AP verimine +%'+Math.round(v*100)+'.'],
 ['bal_search','bal_negotiator','Transfer Görüşmeleri',[.03,.06,.09,.12,.15],v=>'Yeni katalog transfer fiyatları %'+Math.round(v*100)+' daha uygun.'],
 ['bal_contacts','bal_network','Bölgesel Bağlantılar',[.02,.04,.06,.08,.1],v=>'Yüksek OVR bulma şansına +'+Math.round(v*100)+' puan.'],
 ['bal_talent','bal_academy','Akademi İşbirliği',[1,2,3,4,5],v=>'Yeni adaylar +'+v+' kart seviyesi gelişmiş gelir.']
];
const catalog=definitions.map(([id,floor,name,icon,core,describe,price])=>({id,floor,name,icon,values:[...core,...Array(5).fill(core[4])],describe,price,bal:true,bonus:successors.find(row=>row[0]===id)}));
function bonusLevel(s,id){const bonus=successors.find(row=>row[1]===id);return bonus?Math.max(0,Math.min(5,level(s,bonus[0])-5)):0;}
function describeBlock(s,r,n=level(s,r.id)){const primary=r.describe(r.values[Math.max(0,n-1)]);if(!r.bonus)return primary;return primary+(n>5?' '+r.bonus[2]+': '+r.bonus[4](r.bonus[3][n-6]):'');}
const departmentPrices={2:0,4:0};
function departmentOpen(s,f){return s.stage==='bal'&&(!Object.hasOwn(departmentPrices,f)||!Array.isArray(s.openDepartments)||s.openDepartments.includes(f));}
function openDepartment(s,f){if(s.stage!=='bal'||!Object.hasOwn(departmentPrices,f)||departmentOpen(s,f))return false;s.openDepartments.push(f);if(f===2)s.incomeProgress=0;if(f===4)s.scouting.startedDay=(s.balStartDay||1)+Math.floor(s.instructions/500);return true;}
const gates=[];
function remainingDays(){return 0}
function upgraded(s,id){if(s.balReadyDay)delete s.balReadyDay[id]}
function level(s,id){return s.floors.flat().filter(x=>x===id).length}
function value(s,id){const bonus=successors.find(row=>row[1]===id);if(bonus){const r=catalog.find(x=>x.id===bonus[0]);return departmentOpen(s,r.floor)?bonus[3][bonusLevel(s,id)-1]||0:0;}const r=catalog.find(x=>x.id===id);return r&&departmentOpen(s,r.floor)?r.values[level(s,id)-1]||0:0}
function enter(raw,day){if(raw.stage==='bal')return JSON.parse(JSON.stringify(raw));const R=root.RoomRules||(typeof require==='function'?require('./room-rules.js'):null),s=R.defaults();s.stage='bal';if(raw.dailyShift)s.dailyShift=JSON.parse(JSON.stringify(raw.dailyShift));s.floors=s.floors.map((_,f)=>(raw.floors?.[f]||[]).filter(id=>R.catalog.some(r=>r.id===id&&!r.bal&&r.floor===f)));s.budget*=10;s.budgetScale=10;s.balVersion=1;s.balStart=0;s.balStartDay=1;return s}
function requirement(s,r){if(r.bal&&s.stage!=='bal')return 'BAL aşamasında açılır';if(s.stage!=='bal')return null;if(r.bal&&!departmentOpen(s,r.floor))return 'Önce '+departments[r.floor]+' aç';if(r.id==='bal_shift'&&!level(s,'offline_time'))return 'Önce Vardiya Planı aç';return null}
// Early investments offer several routes; later levels remain long-term goals.
// Cumulative investment follows season income; no calendar or match gates.
const investmentPrices={bal_sponsor:[400,900,2000,4000,7500,13000,22000,36000,65000,120000],bal_coach:[500,1000,2400,5000,9500,16500,28000,44000,80000,140000]};
const priceSteps=[400,900,2000,4000,7500,13000,22000,36000,65000,120000];
function price(s,r){const n=level(s,r.id);if(n>=r.values.length)return Infinity;if(!r.bal)return 10*([10,6,9,10,15][n]??Infinity);const base=investmentPrices[r.id]?.[n]??r.price/300*priceSteps[n],lateDiscount=n===9?.9:n===8?.95:1;return Math.round(base*(n>=5?1.4:1)*lateDiscount*(s.division===3?1:n>=5?.85:.9)/10)*10;}
function effects(s,e){if(s.stage!=='bal')return e;return {...e,doubleChance:value(s,'bal_double'),manualBonusAP:value(s,'bal_hands'),offlineHours:e.offlineHours?e.offlineHours+value(s,'bal_longshift'):0,critChance:Math.min(1,e.critChance+value(s,'bal_precision')),critMult:Math.max(e.critMult,value(s,'bal_precision')?2:1),clickAP:e.clickAP*2.5+value(s,'bal_position')+value(s,'bal_hands'),autoAP:e.autoAP*2.5+value(s,'bal_position'),baseAP:e.baseAP*2.5+value(s,'bal_position'),autoRate:(e.autoRate*1.4+value(s,'bal_coach')*e.workflowRate)*(s.division===3?1:1.4),baseAutoRate:(e.baseAutoRate*1.4+value(s,'bal_coach'))*(s.division===3?1:1.4),repeatAP:e.repeatAP*1.25+value(s,'bal_video'),morningAP:e.morningAP*1.25+value(s,'bal_warmstart'),dayAP:e.dayAP*1.25+value(s,'bal_evening'),offlineBonus:e.offlineBonus*1.25+value(s,'bal_recovery')+value(s,'bal_remote'),offlineEfficiency:e.offlineEfficiency+value(s,'bal_shift')};}
function cash(s){if(!departmentOpen(s,2))return 0;return (20+value(s,'bal_sponsor'))*(1+value(s,'bal_shop'))+value(s,'bal_orders')}
// Merge old separate bonuses into levels 6–10, without charging again.
function migrateLevels(s,raw){
 s.balReadyDay={};if(s.stage!=='bal'||raw?.balBlockVersion===4)return;
 const map=[0,1,2,2,3,3,4,4,5,5,5];
 for(const r of catalog){const old=(raw?.floors?.[r.floor]||[]),n=old.filter(id=>id===r.id).length,extra=old.filter(id=>id===r.bonus[1]).length;const base=raw?.balBlockVersion===2&&extendedIds.has(r.id)?map[Math.min(10,n)]:Math.min(5,n),target=extra?5+Math.min(5,extra):base;s.floors[r.floor]=s.floors[r.floor].filter(id=>id!==r.id);s.floors[r.floor].push(...Array(target).fill(r.id));}
 s.balBlockVersion=4;
}
const api={bonusLevel,describeBlock,migrateLevels,departmentPrices,departmentOpen,openDepartment,departments,catalog,gates,remainingDays,upgraded,enter,requirement,price,effects,value,cash};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.BalRules=api;
})(globalThis);
