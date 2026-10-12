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
const catalog=definitions.map(([id,floor,name,icon,values,describe,price])=>({id,floor,name,icon,values,describe,price,bal:true}));
const departmentPrices={2:0,4:0};
function departmentOpen(s,f){return s.stage==='bal'&&(!Object.hasOwn(departmentPrices,f)||!Array.isArray(s.openDepartments)||s.openDepartments.includes(f));}
function openDepartment(s,f){if(s.stage!=='bal'||!Object.hasOwn(departmentPrices,f)||departmentOpen(s,f))return false;s.openDepartments.push(f);if(f===2)s.incomeProgress=0;if(f===4)s.scouting.startedDay=(s.balStartDay||1)+Math.floor(s.instructions/500);return true;}
const gates=[0,0,0,2,3],productionGates=[0,0,0,.5,1];
const gate=(id,n)=>(extendedIds.has(id)?productionGates:gates)[n]||0;
function remainingDays(s,id){return Math.max(0,Math.ceil((s.balReadyDay?.[id]||0)-s.instructions/500));}
function upgraded(s,id){if(s.stage!=='bal'||!catalog.some(r=>r.id===id))return;s.balReadyDay||={};const days=gate(id,level(s,id));if(days)s.balReadyDay[id]=s.instructions/500+days;else delete s.balReadyDay[id];}
function level(s,id){return s.floors.flat().filter(x=>x===id).length}
function value(s,id){const r=catalog.find(x=>x.id===id);return r&&departmentOpen(s,r.floor)?r.values[level(s,id)-1]||0:0}
function enter(raw,day){if(raw.stage==='bal')return JSON.parse(JSON.stringify(raw));const R=root.RoomRules||(typeof require==='function'?require('./room-rules.js'):null),s=R.defaults();s.stage='bal';s.budget*=10;s.budgetScale=10;s.balVersion=1;s.balStart=0;s.balStartDay=1;return s}
function requirement(s,r){if(r.bal&&s.stage!=='bal')return 'BAL aşamasında açılır';if(s.stage!=='bal')return null;if(r.bal&&!departmentOpen(s,r.floor))return 'Önce '+departments[r.floor]+' aç';const next=level(s,r.id);if(r.bal&&next<r.values.length&&gate(r.id,next)&&remainingDays(s,r.id))return display(Math.max(.1,Math.ceil(((s.balReadyDay?.[r.id]||0)-s.instructions/500)*10)/10))+' oyun günü sonra';if(r.id==='bal_shift'&&!level(s,'offline_time'))return 'Önce Vardiya Planını tamamla';return null}
// Early investments offer several routes; later levels remain long-term goals.
const investmentPrices={bal_sponsor:[40,100,220,440,800],bal_coach:[60,130,260,490,850]};
const priceSteps=[.5,.95,1.65,2.7,4.2];
function price(s,r){const n=level(s,r.id);return n>=r.values.length?Infinity:10*(r.bal?(investmentPrices[r.id]?.[n]??Math.round(r.price*priceSteps[n])):([10,15,25][n]??Infinity))}
function effects(s,e){if(s.stage!=='bal')return e;return {...e,clickAP:e.clickAP*2.5+value(s,'bal_position'),autoAP:e.autoAP*2.5+value(s,'bal_position'),baseAP:e.baseAP*2.5+value(s,'bal_position'),autoRate:e.autoRate*2+value(s,'bal_coach')*e.workflowRate,baseAutoRate:e.baseAutoRate*2+value(s,'bal_coach'),repeatAP:e.repeatAP*1.25+value(s,'bal_video'),morningAP:e.morningAP*1.25,dayAP:e.dayAP*1.25,offlineBonus:e.offlineBonus*1.25+value(s,'bal_recovery'),offlineEfficiency:e.offlineEfficiency+value(s,'bal_shift')};}
function cash(s){if(!departmentOpen(s,2))return 0;return (20+value(s,'bal_sponsor'))*(1+value(s,'bal_shop'))}
// Round intermediate ten-level saves up so no purchased effect is lost.
function migrateLevels(s,raw){
 if(s.stage!=='bal'||raw?.balBlockVersion!==2)return;
 const map=[0,1,2,2,3,3,4,4,5,5,5];
 s.floors=s.floors.map((row,f)=>{const done=new Set();return row.flatMap(id=>{
  if(!extendedIds.has(id))return [id];if(done.has(id))return [];done.add(id);
  const n=Math.min(10,(raw.floors?.[f]||[]).filter(x=>x===id).length);
  return Array(map[n]).fill(id);
 });});s.balBlockVersion=3;
}
const api={migrateLevels,departmentPrices,departmentOpen,openDepartment,departments,catalog,gates,remainingDays,upgraded,enter,requirement,price,effects,value,cash};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.BalRules=api;
})(globalThis);
