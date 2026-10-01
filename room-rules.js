(function(root){
'use strict';
const Camps=root.CampRules||(typeof require==='function'?require('./camp-rules.js'):null);
const departments=['Antrenman Sahası','Gönüllü Kulüp Asistanı','Beslenme ve Kantin','Saha Organizasyonu','Malzeme ve Ekipman Birimi'];
const catalog=[
 ['basic',0,'Temel Antrenman','↗',[2,5,10],v=>'Elle verdiğin her talimata +'+v+' AP.'],
 ['tempo',0,'Yoğun Tempo','ϟ',[1.5,2,3],v=>'Elle talimatın AP kazancını '+v.toLocaleString('tr-TR')+' katına çıkarır.'],
 ['focus',0,'Kritik Odak','◎',[.10,.18,.25],v=>'Elle talimatta %'+Math.round(v*100)+' şansla 5 kat AP.'],
 ['assistant',1,'Otomatik Asistan','♟',[.2,.4,.8],v=>'Saniyede '+v.toLocaleString('tr-TR')+' talimat. Sen yokken de en az 2 saat AP biriktirir.'],
 ['shift',1,'Vardiya Sistemi','◷',[1.25,1.5,2],v=>'Asistanın talimat hızını '+v.toLocaleString('tr-TR')+' katına çıkarır. Asistan gerektirir.'],
 ['steady',1,'Düzenli Çalışma','✦',[10,25,60],v=>'Asistanın her 10. talimatında +'+v+' AP; çevrimdışıyken de işler.'],
 ['meal',2,'Dengeli Öğün','◒',[20,50,100],v=>'100 talimatla tamamlanan her oyun gününde +'+v+' AP.'],
 ['drink',2,'Seviye İkramı','▤',[15,35,75],v=>'Her yeni kulüp seviyesine ulaştığında +'+v+' AP.'],
 ['diet',2,'Kumanya Hazırlığı','✚',[4,8,12],v=>'Asistanın çevrimdışı AP biriktirme süresini '+v+' saate çıkarır.'],
 ['collect',3,'Top Toplayıcı Gençler','●',[.05,.1,.15],v=>'Talimatlar odalar arasında %'+Math.round(v*100)+' daha hızlı ilerler.'],
 ['coordinate',3,'Hızlı Koordinasyon','⇣',[.1,.2,.3],v=>'Talimatların odalarda bekleme süresini %'+Math.round(v*100)+' azaltır.'],
 ['rhythm',3,'Kesintisiz Ritim','↻',[.1,.2,.3],v=>'Talimat turunun sonundaki beklemeyi %'+Math.round(v*100)+' azaltır.'],
 ['slots',4,'Temel Malzemeler','▣',[1,2,3],v=>'Güçlendirmeler için '+v+' yer açar.'],
 ['balls',4,'Kaliteli Toplar','●',[.03,.06,.1],v=>'Elle ve otomatik talimat AP kazancını %'+Math.round(v*100)+' artırır.']
].map(([id,floor,name,icon,values,describe])=>({id,floor,name,icon,values,describe}));
// Fast opening levels, then progressively longer goals over the first session.
const thresholds=[0,1,2,3,5,8,12,20,35,60,100,160,250,400,600,900,1300,1800,2500,3500];
const defaults=()=>({version:4,stage:'prologue',camp:Camps.defaults(),budget:0,ap:0,instructions:0,floors:Array.from({length:5},()=>[]),lastSeen:Date.now(),autoCarry:0,steadyProgress:0});
function normalize(raw){const s=defaults();s.stage=raw?.stage==='bal'?'bal':'prologue';s.camp=Camps.normalize(raw?.camp);for(const k of ['budget','ap','lastSeen'])if(Number.isFinite(raw?.[k])&&raw[k]>=0)s[k]=raw[k];if(Number.isSafeInteger(raw?.instructions)&&raw.instructions>=0)s.instructions=raw.instructions;if(Number.isFinite(raw?.autoCarry))s.autoCarry=Math.max(0,Math.min(.999999,raw.autoCarry));if(Number.isInteger(raw?.steadyProgress)&&raw.steadyProgress>=0)s.steadyProgress=raw.steadyProgress%10;if(Array.isArray(raw?.floors))s.floors=s.floors.map((_,f)=>{const counts={};return (Array.isArray(raw.floors[f])?raw.floors[f]:[]).map(id=>(id==='offline'||id==='reach')?'steady':id).filter(id=>{if(id===null)return true;const r=catalog.find(r=>r.id===id&&r.floor===f);return r&&(counts[id]=(counts[id]||0)+1)<=3}).slice(0,f===4?6:9)});return s}
function count(s,id){return s.floors.flat().filter(v=>v===id).length}
function value(s,id,fallback=0){const r=catalog.find(r=>r.id===id),n=count(s,id);return n?r.values[n-1]:fallback}
function progress(s){const n=s.instructions||0;let level=1;while(level<thresholds.length&&n>=thresholds[level])level++;return {level,current:n-thresholds[level-1],required:level<thresholds.length?thresholds[level]-thresholds[level-1]:0,remaining:level<thresholds.length?thresholds[level]-n:0}}
function effects(s){const base=4+(progress(s).level-1)*.5,multiplier=1+value(s,'balls');return {clickAP:(base+value(s,'basic'))*value(s,'tempo',1)*multiplier,autoAP:base*multiplier,crit:value(s,'focus'),autoRate:value(s,'assistant')*value(s,'shift',1),offlineHours:count(s,'assistant')?value(s,'diet',2):0,dayAP:value(s,'meal'),levelAP:value(s,'drink'),slots:value(s,'slots'),travel:2400/(1+value(s,'collect')),transition:250*(1-value(s,'coordinate')),rest:400*(1-value(s,'rhythm'))}}
function currency(){return 'budget'}
function cost(s,f){return 40+s.floors[f].length*20}
function unlock(s,f){if(!Number.isInteger(f)||f<0||f>4)return false;const row=s.floors[f],max=f===4?6:9;if(row.includes(null)||catalog.filter(r=>r.floor===f).every(r=>count(s,r.id)>0)||row.length>=max||s[currency(f)]<cost(s,f))return false;s[currency(f)]-=cost(s,f);row.push(null);return true}
function choose(s,f,i,id){const r=catalog.find(r=>r.id===id);if(!r||r.floor!==f||s.floors[f]?.[i]!==null||count(s,id)>0)return false;s.floors[f][i]=id;return true}
function purchase(s,f,id){const r=catalog.find(r=>r.id===id);if(!r||r.floor!==f||count(s,id)>0)return false;const row=s.floors[f],max=f===4?6:9;if(row.includes(null)||row.length>=max||s[currency(f)]<cost(s,f))return false;const price=cost(s,f);row.push(id);s[currency(f)]-=price;return true}
function upgrade(s,id){const r=catalog.find(r=>r.id===id),n=count(s,id);if(!r||n<1||n>=3||s[currency(r.floor)]<cost(s,r.floor))return false;s[currency(r.floor)]-=cost(s,r.floor);s.floors[r.floor].push(id);return true}
function income(s,completed,random=Math.random,source='manual'){
 const e=effects(s),manual=source!=='auto',critical=manual&&random()<e.crit;let bonus=0;
 if(!manual&&count(s,'steady')>0){s.steadyProgress=((s.steadyProgress||0)+1)%10;if(s.steadyProgress===0)bonus=value(s,'steady')}
 let ap=(manual?e.clickAP:e.autoAP)*(critical?5:1)+(completed?e.dayAP:0)+bonus;
 const previous=progress(s).level;s.instructions=Math.min(Number.MAX_SAFE_INTEGER,(s.instructions||0)+1);const level=progress(s).level;
 const levelAP=level>previous?e.levelAP:0;ap+=levelAP;s.ap+=ap;const dayBudget=completed?20:0;s.budget+=dayBudget;return {ap,critical,bonus,dayBudget,levelAP,level,leveledUp:level>previous};
}
function offline(s,now=Date.now()){
 if(!Number.isFinite(now)||now<=s.lastSeen)return 0;
 const e=effects(s),seconds=Math.min((now-s.lastSeen)/1000,e.offlineHours*3600);
 const total=seconds*e.autoRate+(s.autoCarry||0),clicks=Math.floor(total);s.autoCarry=total-clicks;
 let bonus=0;if(count(s,'steady')){const tally=(s.steadyProgress||0)+clicks;bonus=Math.floor(tally/10)*value(s,'steady');s.steadyProgress=tally%10}
 // Away production banks AP only; it cannot skip calendar matches or grant level rewards twice.
 const ap=clicks*e.autoAP+bonus;s.ap+=ap;s.lastSeen=now;return ap;
}
function migrate(old){const s=defaults();if(!old)return s;s.budget=Number.isFinite(old.budget)?old.budget:0;for(const row of old.floors||[])if(Array.isArray(row))for(let i=0;i<row.length;i++)s.budget+=40+i*20;return s}
const api={departments,catalog,thresholds,defaults,normalize,count,value,progress,effects,currency,cost,unlock,choose,purchase,upgrade,income,offline,migrate};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.RoomRules=api;
})(globalThis);
