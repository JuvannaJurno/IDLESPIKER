(function(root){
'use strict';
const departments=['Performans Merkezi','Kulüp Yönetimi','Gelir Merkezi','Teknik Ekip','Ekipman Atölyesi'];
const definitions=[
 ['bal_coach',1,'Yardımcı Antrenör','♟',[.6,1.2,2,3,4],v=>'Saniyede +'+v+' otomatik talimat.',220],
 ['bal_shift',1,'Vardiya Koordinasyonu','◷',[.03,.06,.09,.12,.15],v=>'Çevrimdışı verim +'+Math.round(v*100)+' puan. Vardiya gerekir.',300],
 ['bal_plan',1,'Çalışma Planı','↻',[40,90,160,250,360],v=>'Her 10. otomatik talimata +'+v+' AP.',260],
 ['bal_position',0,'Pozisyon Antrenmanı','↗',[12,25,42,65,95],v=>'Ulaşan her talimata +'+v+' AP.',220],
 ['bal_video',0,'Video Destekli Çalışma','▤',[70,160,300,500,800],v=>'Her 5. talimata +'+v+' AP.',300],
 ['bal_recovery',0,'Toparlanma Ünitesi','✚',[.08,.16,.25,.35,.5],v=>'Çevrimdışı AP +%'+Math.round(v*100)+'.',260],
 ['bal_sponsor',2,'Yerel Sponsor','▣',[2,3,4,5,6],v=>'Ulaşan her 10. talimatta '+v+' bütçe.',400],
 ['bal_shop',2,'Kulüp Mağazası','▤',[.1,.2,.35,.55,.8],v=>'Sponsor gelirini %'+Math.round(v*100)+' artırır.',350],
 ['bal_fans',2,'Taraftar Organizasyonu','◎',[150,350,650,1100,1800],v=>'Oynanan her maç için +'+v+' bütçe.',260],
 ['bal_scout',3,'Gözlemci','▤',[1,2,3,4,5],v=>'Rakip raporu +'+v+' gün erken.',250],
 ['bal_personal',3,'Bireysel Gelişim Planı','+',[.01,.02,.03,.04,.05],v=>'Ücretsiz kart yükseltme ihtimali +'+Math.round(v*100)+' puan.',400],
 ['bal_archive',3,'Analiz Arşivi','▥',[.02,.04,.06,.08,.1],v=>'Kart yükseltmelerinde %'+Math.round(v*100)+' AP indirimi.',360],
 ['bal_serve',4,'Servis Makinesi','●',[.03,.06,.09,.12,.15],v=>'Servis gelişiminde %'+Math.round(v*100)+' AP indirimi.',300],
 ['bal_block',4,'Blok İstasyonu','▣',[.03,.06,.09,.12,.15],v=>'Manşet ve blok gelişiminde %'+Math.round(v*100)+' AP indirimi.',300],
 ['bal_pass',4,'Pas Duvarı','↗',[.03,.06,.09,.12,.15],v=>'Pas ve smaç gelişiminde %'+Math.round(v*100)+' AP indirimi.',300]
];
const catalog=definitions.map(([id,floor,name,icon,values,describe,price])=>({id,floor,name,icon,values,describe,price,bal:true}));
const gates=[0,0,0,32000,52000];
function level(s,id){return s.floors.flat().filter(x=>x===id).length}
function value(s,id){const r=catalog.find(x=>x.id===id);return r?.values[level(s,id)-1]||0}
function enter(raw,day){if(raw.stage==='bal')return JSON.parse(JSON.stringify(raw));const R=root.RoomRules||(typeof require==='function'?require('./room-rules.js'):null),s=R.defaults();s.stage='bal';s.balVersion=1;s.balStart=0;s.balStartDay=1;return s}
function requirement(s,r){if(r.bal&&s.stage!=='bal')return 'BAL aşamasında açılır';if(s.stage!=='bal')return null;const next=level(s,r.id);if(r.bal&&next<5&&(s.instructions-s.balStart)<gates[next])return Math.max(0,gates[next]-(s.instructions-s.balStart)).toLocaleString('tr-TR')+' BAL talimatı sonra';if(r.id==='bal_shift'&&!level(s,'offline_time'))return 'Önce Vardiya Planını tamamla';return null}
function price(s,r){const n=level(s,r.id);return n>=r.values.length?Infinity:r.bal?Math.round((n===0&&r.id==='bal_coach'?60:n===0&&r.id==='bal_sponsor'?40:r.price*2.15**n)):([10,15,25][n]??Infinity)}
function effects(s,e){if(s.stage!=='bal')return e;return {...e,clickAP:e.clickAP*2.5+value(s,'bal_position'),autoAP:e.autoAP*2.5+value(s,'bal_position'),baseAP:e.baseAP*2.5+value(s,'bal_position'),autoRate:e.autoRate*2+value(s,'bal_coach')*e.workflowRate,baseAutoRate:e.baseAutoRate*2+value(s,'bal_coach'),repeatAP:e.repeatAP*1.25+value(s,'bal_video'),morningAP:e.morningAP*1.25,dayAP:e.dayAP*1.25,offlineBonus:e.offlineBonus*1.25+value(s,'bal_recovery'),offlineEfficiency:e.offlineEfficiency+value(s,'bal_shift')};}
function cash(s){return (2+value(s,'bal_sponsor'))*(1+value(s,'bal_shop'))}
const api={departments,catalog,gates,enter,requirement,price,effects,value,cash};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.BalRules=api;
})(globalThis);
