(function(root){
'use strict';
const departments=['Antrenman Sahası','Gönüllü Kulüp Asistanı','Beslenme ve Kantin','Saha Organizasyonu','Malzeme ve Ekipman Birimi'];
const catalog=[
 ['basic',0,'Temel Antrenman','↗',[1,3,6],v=>'Tıklama başına +'+v+' AP'],
 ['tempo',0,'Yoğun Tempo','ϟ',[2,4,8],v=>'Kazanılan AP ×'+v],
 ['focus',0,'Kritik Odak','◎',[.10,.18,.25],v=>'%'+Math.round(v*100)+' ihtimalle ×5 AP'],
 ['assistant',1,'Asistanı İşe Al','♟',[.5,1.2,2.5],v=>v+' tıklama / saniye'],
 ['shift',1,'Vardiya Sistemi','◷',[2,3.5,5],v=>'Asistan hızı ×'+v],
 ['offline',1,'Mesai Dışı Çalışma','☾',[4,8,12],v=>v+' saat çevrimdışı birikim'],
 ['meal',2,'Dengeli Öğün','◒',[.15,.35,.60],v=>'Toplam AP +%'+Math.round(v*100)],
 ['drink',2,'Sporcu İçecekleri','▤',[50,130,250],v=>'Tamamlanan gün başına +'+v+' AP'],
 ['diet',2,'Özel Diyetisyen','✚',[.5,1.1,1.8],v=>'Genel AP +%'+Math.round(v*100)],
 ['collect',3,'Top Toplayıcı Gençler','●',[.2,.35,.45],v=>'İş akış hızı +%'+Math.round(v*100)],
 ['coordinate',3,'Hızlı Koordinasyon','⇣',[.5,.8,1],v=>v===1?'Departman geçişleri anında':'Geçiş süresi −%'+Math.round(v*100)],
 ['rhythm',3,'Kesintisiz Ritim','↻',[.5,.8,1],v=>v===1?'Başa dönme beklemesi yok':'Başa dönme beklemesi −%'+Math.round(v*100)],
 ['slots',4,'Temel Malzemeler','▣',[1,2,3],v=>v+' boost slotu'],
 ['balls',4,'Kaliteli Toplar','●',[.2,.45,.75],v=>'AP +%'+Math.round(v*100)]
].map(([id,floor,name,icon,values,describe])=>({id,floor,name,icon,values,describe}));
const defaults=()=>({version:2,budget:0,ap:0,floors:Array.from({length:5},()=>[]),lastSeen:Date.now(),autoCarry:0});
function normalize(raw){const s=defaults();for(const k of ['budget','ap','lastSeen'])if(Number.isFinite(raw?.[k])&&raw[k]>=0)s[k]=raw[k];if(Number.isFinite(raw?.autoCarry))s.autoCarry=Math.max(0,Math.min(.999999,raw.autoCarry));if(Array.isArray(raw?.floors))s.floors=s.floors.map((_,f)=>{const counts={};return (Array.isArray(raw.floors[f])?raw.floors[f]:[]).filter(id=>{if(id===null)return true;const r=catalog.find(r=>r.id===id&&r.floor===f);return r&&(counts[id]=(counts[id]||0)+1)<=3}).slice(0,f===4?6:9)});return s}
function count(s,id){return s.floors.flat().filter(v=>v===id).length}
function value(s,id,fallback=0){const r=catalog.find(r=>r.id===id),n=count(s,id);return n?r.values[n-1]:fallback}
function effects(s){const multiplier=value(s,'tempo',1)*(1+value(s,'meal'))*(1+value(s,'diet'))*(1+value(s,'balls'));return {clickAP:(1+value(s,'basic'))*multiplier,crit:value(s,'focus'),autoRate:value(s,'assistant')*value(s,'shift',1),offlineHours:value(s,'offline'),dayAP:value(s,'drink')*multiplier,slots:value(s,'slots'),travel:1000/(1+value(s,'collect')),transition:100*(1-value(s,'coordinate')),rest:200*(1-value(s,'rhythm'))}}
function cost(s,f){return 40+s.floors[f].length*20}
function unlock(s,f){if(!Number.isInteger(f)||f<0||f>4)return false;const row=s.floors[f],max=f===4?6:9;if(row.includes(null)||catalog.filter(r=>r.floor===f).every(r=>count(s,r.id)>0)||row.length>=max||s.budget<cost(s,f))return false;s.budget-=cost(s,f);row.push(null);return true}
function choose(s,f,i,id){const r=catalog.find(r=>r.id===id);if(!r||r.floor!==f||s.floors[f]?.[i]!==null||count(s,id)>0)return false;s.floors[f][i]=id;return true}
function upgrade(s,id){const r=catalog.find(r=>r.id===id),n=count(s,id);if(!r||n<1||n>=3||s.budget<cost(s,r.floor))return false;s.budget-=cost(s,r.floor);s.floors[r.floor].push(id);return true}
function income(s,completed,random=Math.random){const e=effects(s),critical=random()<e.crit;const ap=e.clickAP*(critical?5:1)+(completed?e.dayAP:0);s.ap+=ap;if(completed)s.budget+=20;return {ap,critical}}
function offline(s,now=Date.now()){const e=effects(s),seconds=Math.min(Math.max(0,now-s.lastSeen)/1000,e.offlineHours*3600);const ap=seconds*e.autoRate*e.clickAP*(1+4*e.crit);s.ap+=ap;s.lastSeen=now;return ap}
function migrate(old){const s=defaults();if(!old)return s;s.budget=Number.isFinite(old.budget)?old.budget:0;for(const row of old.floors||[])if(Array.isArray(row))for(let i=0;i<row.length;i++)s.budget+=40+i*20;return s}
const api={departments,catalog,defaults,normalize,count,value,effects,cost,unlock,choose,upgrade,income,offline,migrate};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.RoomRules=api;
})(globalThis);
