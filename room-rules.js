(function(root){
'use strict';
const departments=['Antrenman Sahası','Gönüllü Kulüp Asistanı','Beslenme ve Kantin','Saha Organizasyonu','Malzeme ve Ekipman Birimi'];
const catalog=[
 ['basic',0,'Temel Antrenman','↗',[1,2,3],v=>'Her talimatta '+v+' ek antrenman puanı.'],
 ['tempo',0,'Yoğun Tempo','ϟ',[1.1,1.2,1.35],v=>'Kazanılan antrenman puanını '+v+' katına çıkarır.'],
 ['focus',0,'Kritik Odak','◎',[.10,.18,.25],v=>'Her talimatta %'+Math.round(v*100)+' şansla 5 kat antrenman puanı.'],
 ['assistant',1,'Asistanı İşe Al','♟',[.2,.25,.3],v=>v<1?'Senin yerine '+(1/v).toLocaleString('tr-TR')+' saniyede bir talimat verir.':'Senin yerine saniyede '+v.toLocaleString('tr-TR')+' talimat verir.'],
 ['shift',1,'Vardiya Sistemi','◷',[1.1,1.2,1.3],v=>'Asistanın talimat hızını '+v.toLocaleString('tr-TR')+' katına çıkarır.'],
 ['steady',1,'Düzenli Çalışma','✦',[5,10,20],v=>'Asistanın her 10. talimatı '+v+' ek antrenman puanı verir.'],
 ['meal',2,'Dengeli Öğün','◒',[.05,.1,.15],v=>'Kazanılan antrenman puanını %'+Math.round(v*100)+' artırır.'],
 ['drink',2,'Sporcu İçecekleri','▤',[5,10,15],v=>'Her oyun günü sonunda '+v+' ek antrenman puanı.'],
 ['diet',2,'Özel Diyetisyen','✚',[.05,.1,.15],v=>'Kazanılan antrenman puanını %'+Math.round(v*100)+' artırır.'],
 ['collect',3,'Top Toplayıcı Gençler','●',[.05,.1,.15],v=>'Talimatlar odalar arasında %'+Math.round(v*100)+' daha hızlı ilerler.'],
 ['coordinate',3,'Hızlı Koordinasyon','⇣',[.1,.2,.3],v=>v===1?'Talimatlar odalarda beklemeden ilerler.':'Talimatların odalarda bekleme süresini %'+Math.round(v*100)+' azaltır.'],
 ['rhythm',3,'Kesintisiz Ritim','↻',[.1,.2,.3],v=>v===1?'Talimat turu beklemeden tamamlanır.':'Talimat turunun sonundaki beklemeyi %'+Math.round(v*100)+' azaltır.'],
 ['slots',4,'Temel Malzemeler','▣',[1,2,3],v=>'Güçlendirmeler için '+v+' yer açar.'],
 ['balls',4,'Kaliteli Toplar','●',[.03,.06,.1],v=>'Kazanılan antrenman puanını %'+Math.round(v*100)+' artırır.']
].map(([id,floor,name,icon,values,describe])=>({id,floor,name,icon,values,describe}));
const defaults=()=>({version:2,budget:0,ap:0,floors:Array.from({length:5},()=>[]),lastSeen:Date.now(),autoCarry:0,steadyProgress:0});
function normalize(raw){const s=defaults();for(const k of ['budget','ap','lastSeen'])if(Number.isFinite(raw?.[k])&&raw[k]>=0)s[k]=raw[k];if(Number.isFinite(raw?.autoCarry))s.autoCarry=Math.max(0,Math.min(.999999,raw.autoCarry));if(Number.isInteger(raw?.steadyProgress)&&raw.steadyProgress>=0)s.steadyProgress=raw.steadyProgress%10;if(Array.isArray(raw?.floors))s.floors=s.floors.map((_,f)=>{const counts={};return (Array.isArray(raw.floors[f])?raw.floors[f]:[]).map(id=>(id==='offline'||id==='reach')?'steady':id).filter(id=>{if(id===null)return true;const r=catalog.find(r=>r.id===id&&r.floor===f);return r&&(counts[id]=(counts[id]||0)+1)<=3}).slice(0,f===4?6:9)});return s}
function count(s,id){return s.floors.flat().filter(v=>v===id).length}
function value(s,id,fallback=0){const r=catalog.find(r=>r.id===id),n=count(s,id);return n?r.values[n-1]:fallback}
function effects(s){const multiplier=value(s,'tempo',1)*(1+value(s,'meal'))*(1+value(s,'diet'))*(1+value(s,'balls'));return {clickAP:(1+value(s,'basic'))*multiplier,crit:value(s,'focus'),autoRate:value(s,'assistant')*value(s,'shift',1),offlineHours:0,dayAP:value(s,'drink')*multiplier,slots:value(s,'slots'),travel:2400/(1+value(s,'collect')),transition:250*(1-value(s,'coordinate')),rest:400*(1-value(s,'rhythm'))}}
function cost(s,f){return 40+s.floors[f].length*20}
function unlock(s,f){if(!Number.isInteger(f)||f<0||f>4)return false;const row=s.floors[f],max=f===4?6:9;if(row.includes(null)||catalog.filter(r=>r.floor===f).every(r=>count(s,r.id)>0)||row.length>=max||s.budget<cost(s,f))return false;s.budget-=cost(s,f);row.push(null);return true}
function choose(s,f,i,id){const r=catalog.find(r=>r.id===id);if(!r||r.floor!==f||s.floors[f]?.[i]!==null||count(s,id)>0)return false;s.floors[f][i]=id;return true}
function purchase(s,f,id){const r=catalog.find(r=>r.id===id);if(!r||r.floor!==f||count(s,id)>0)return false;const row=s.floors[f],max=f===4?6:9;if(row.includes(null)||row.length>=max||s.budget<cost(s,f))return false;const price=cost(s,f);row.push(id);s.budget-=price;return true}
function upgrade(s,id){const r=catalog.find(r=>r.id===id),n=count(s,id);if(!r||n<1||n>=3||s.budget<cost(s,r.floor))return false;s.budget-=cost(s,r.floor);s.floors[r.floor].push(id);return true}
function income(s,completed,random=Math.random,source='manual'){const e=effects(s),critical=random()<e.crit;let bonus=0;if(source==='auto'&&count(s,'steady')>0){s.steadyProgress=((s.steadyProgress||0)+1)%10;if(s.steadyProgress===0)bonus=value(s,'steady')}const ap=e.clickAP*(critical?5:1)+(completed?e.dayAP:0)+bonus;s.ap+=ap;if(completed)s.budget+=20;return {ap,critical,bonus}}
function offline(s,now=Date.now()){const e=effects(s),seconds=Math.min(Math.max(0,now-s.lastSeen)/1000,e.offlineHours*3600);const ap=seconds*e.autoRate*e.clickAP*(1+4*e.crit);s.ap+=ap;s.lastSeen=now;return ap}
function migrate(old){const s=defaults();if(!old)return s;s.budget=Number.isFinite(old.budget)?old.budget:0;for(const row of old.floors||[])if(Array.isArray(row))for(let i=0;i<row.length;i++)s.budget+=40+i*20;return s}
const api={departments,catalog,defaults,normalize,count,value,effects,cost,unlock,choose,purchase,upgrade,income,offline,migrate};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.RoomRules=api;
})(globalThis);
