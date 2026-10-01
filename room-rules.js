(function(root){
'use strict';
const Camps=root.CampRules||(typeof require==='function'?require('./camp-rules.js'):null);
const departments=['Antrenman Sahası','Gönüllü Kulüp Asistanı','Beslenme ve Kantin','Saha Organizasyonu','Malzeme ve Ekipman Birimi'];
const catalog=[
 ['warmup',0,'Temel Isınma','↗',[6,12,20],v=>'Sahaya ulaşan her talimata +'+v+' AP.'],
 ['crit_smash',0,'Kritik Smaç','◎',[{c:.15,m:2},{c:.2,m:2},{c:.25,m:2.5}],v=>'Elle veya asistanla gelen talimatlarda %'+Math.round(v.c*100)+' ihtimalle '+v.m+' kat AP.'],
 ['echo',0,'Tekrar Antrenmanı','◗',[15,35,65],v=>'Sahaya ulaşan her 5. talimatta garantili +'+v+' AP.'],
 ['assistant',1,'Otomatik Asistan','♟',[.25,.5,.8],v=>'Taban hız: '+v.toLocaleString('tr-TR')+' talimat/sn. Akış hızıyla güçlenir; çevrimdışı da AP üretir.'],
 ['offline_time',1,'Çevrimdışı Mesai','◷',[4,8,12],v=>'Asistanın çevrimdışı çalışma sınırını 2 saatten '+v+' saate çıkarır.'],
 ['steady',1,'Düzenli Çalışma','✦',[15,35,65],v=>'Asistanın her 10. talimatında garantili +'+v+' AP.'],
 ['meal',2,'Dengeli Öğün','◒',[120,280,500],v=>'Her oyun günü tamamlandığında +'+v+' AP. Günlük bütçe sabit 20.'],
 ['energy_drink',2,'Güne Hazırlık','▤',[3,6,10],v=>'Her oyun gününün ilk 20 talimatına +'+v+' AP.'],
 ['sugar_boost',2,'Dinlenme Programı','✚',[.1,.2,.3],v=>'Asistanın çevrimdışı AP kazancını %'+Math.round(v*100)+' artırır.'],
 ['collect',3,'Gönüllü Gençler','●',[.15,.3,.5],v=>'Enerjinin odalar arası hareket hızı +%'+Math.round(v*100)+'. Kısalan akış asistanı da hızlandırır.'],
 ['coordinate',3,'Hızlı Koordinasyon','⇣',[.15,.3,.45],v=>'Odalardaki bekleme süresi −%'+Math.round(v*100)+'. Kısalan akış asistanı da hızlandırır.'],
 ['rhythm',3,'Kesintisiz Ritim','↻',[.2,.4,.6],v=>'Turlar arası bekleme süresi −%'+Math.round(v*100)+'. Kısalan akış asistanı da hızlandırır.'],
 ['slots',4,'Savunma Ekipmanı','▣',[.1,.18,.25],v=>'Manşet ve blok stat antrenmanlarının AP maliyeti −%'+Math.round(v*100)+'.'],
 ['balls',4,'Hücum Ekipmanı','●',[.1,.18,.25],v=>'Smaç, servis ve pas stat antrenmanlarının AP maliyeti −%'+Math.round(v*100)+'.']
].map(([id,floor,name,icon,values,describe])=>({id,floor,name,icon,values,describe}));
// Fast opening levels, then progressively longer goals over the first session.
const thresholds=[0,1,2,3,4,5,8,12,20,35,60,100,160,250,400,600,900,1300,1800,2500,3500];
const defaults=()=>({version:5,stage:'prologue',camp:Camps.defaults(),budget:0,ap:0,instructions:0,floors:Array.from({length:5},()=>[]),lastSeen:Date.now(),autoCarry:0,steadyProgress:0,trainingProgress:0,dayProgress:0,pendingGains:[]});
function normalize(raw){const s=defaults();s.stage=raw?.stage==='bal'?'bal':'prologue';s.camp=Camps.normalize(raw?.camp);for(const k of ['budget','ap','lastSeen'])if(Number.isFinite(raw?.[k])&&raw[k]>=0)s[k]=raw[k];if(Number.isSafeInteger(raw?.instructions)&&raw.instructions>=0)s.instructions=raw.instructions;if(Number.isFinite(raw?.autoCarry))s.autoCarry=Math.max(0,Math.min(.999999,raw.autoCarry));if(Number.isInteger(raw?.steadyProgress)&&raw.steadyProgress>=0)s.steadyProgress=raw.steadyProgress%10;for(const [key,mod] of [['trainingProgress',5],['dayProgress',100]])if(Number.isSafeInteger(raw?.[key])&&raw[key]>=0)s[key]=raw[key]%mod;if(!Number.isSafeInteger(raw?.trainingProgress)&&Number.isSafeInteger(raw?.manualProgress))s.trainingProgress=Math.max(0,raw.manualProgress)%5;if(!Number.isSafeInteger(raw?.dayProgress))s.dayProgress=s.instructions%100;if(Array.isArray(raw?.floors))s.floors=s.floors.map((_,f)=>{const counts={};return (Array.isArray(raw.floors[f])?raw.floors[f]:[]).map(id=>{if(id==='offline'||id==='reach')return 'steady';if(id==='basic')return 'warmup';if(id==='tempo')return 'crit_smash';if(id==='focus')return 'echo';if(id==='shift')return 'offline_time';if(id==='drink')return 'energy_drink';if(id==='diet')return 'sugar_boost';return id;}).filter(id=>{if(id===null)return true;const r=catalog.find(r=>r.id===id&&r.floor===f);return r&&(counts[id]=(counts[id]||0)+1)<=3}).slice(0,f===4?6:9)});if(Array.isArray(raw?.pendingGains)){const seen=new Set();s.pendingGains=raw.pendingGains.filter(g=>g&&Number.isSafeInteger(g.receipt)&&g.receipt>0&&Number.isFinite(g.ap)&&g.ap>=0&&!seen.has(g.receipt)&&seen.add(g.receipt)).map(g=>({receipt:g.receipt,ap:g.ap,critical:!!g.critical,bonus:Number(g.bonus)||0,repeatBonus:Number(g.repeatBonus)||0,dayBudget:0,level:Number(g.level)||1,leveledUp:!!g.leveledUp,baseAP:Number(g.baseAP)||0,source:g.source==='auto'?'auto':'manual',completed:!!g.completed}))}if(raw?.version!==5)for(const row of s.floors)row.forEach((id,i)=>{if(id===null)s.budget+=40+i*20});return s}
function count(s,id){return s.floors.flat().filter(v=>v===id).length}
function value(s,id,fallback=0){const r=catalog.find(r=>r.id===id),n=count(s,id);return n?r.values[n-1]:fallback}
function progress(s){const n=s.instructions||0;let level=1;while(level<thresholds.length&&n>=thresholds[level])level++;return {level,current:n-thresholds[level-1],required:level<thresholds.length?thresholds[level]-thresholds[level-1]:0,remaining:level<thresholds.length?thresholds[level]-n:0}}
function effects(s){
 const level=progress(s).level,base=4+Math.min(5,level-1)*2+Math.max(0,level-6)*.65,crit=value(s,'crit_smash',{c:0,m:1});
 const travel=2400/(1+value(s,'collect')),transition=250*(1-value(s,'coordinate')),rest=400*(1-value(s,'rhythm'));
 const workflowRate=3800/(travel+4*transition+rest);
 return {clickAP:base+value(s,'warmup'),autoAP:base+value(s,'warmup'),baseAP:base+value(s,'warmup'),critChance:crit.c,critMult:crit.m,echoChance:0,energyDrinkChance:0,repeatAP:value(s,'echo'),autoRate:value(s,'assistant')*workflowRate,baseAutoRate:value(s,'assistant'),workflowRate,offlineHours:count(s,'assistant')?value(s,'offline_time',2):0,offlineBonus:value(s,'sugar_boost'),dayAP:value(s,'meal'),morningAP:value(s,'energy_drink'),slots:0,travel,transition,rest};
}
function trainingDiscount(s,stat){return ['receive','block'].includes(stat)?value(s,'slots'):['spike','serve','set'].includes(stat)?value(s,'balls'):0}
function currency(){return 'budget'}
function requirement(s,id){const r=catalog.find(r=>r.id===id);if(!r)return 'Blok bulunamadı';if(r.floor===4&&s.stage!=='bal')return 'BAL aşamasında açılır';if(['offline_time','steady','sugar_boost'].includes(id)&&!count(s,'assistant'))return 'Önce Otomatik Asistan kur';return ''}
function cost(s,f,id){if(id){const n=count(s,id);return (id==='assistant'?[20,60,120]:f===3?[20,40,60]:[40,60,100])[n]??Infinity}const options=catalog.filter(r=>r.floor===f&&!count(s,r.id)&&!requirement(s,r.id));return options.length?Math.min(...options.map(r=>cost(s,f,r.id))):Infinity}
function unlock(s,f){if(!Number.isInteger(f)||f<0||f>4||s.floors[f].includes(null)||!Number.isFinite(cost(s,f)))return false;s.floors[f].push(null);return true}
function choose(s,f,i,id){const r=catalog.find(r=>r.id===id);if(!r||r.floor!==f||s.floors[f]?.[i]!==null||count(s,id)>0||requirement(s,id)||s.budget<cost(s,f,id))return false;s.budget-=cost(s,f,id);s.floors[f][i]=id;return true}
function purchase(s,f,id){const r=catalog.find(r=>r.id===id);if(!r||r.floor!==f||count(s,id)>0||requirement(s,id))return false;const row=s.floors[f];if(row.includes(null)||s.budget<cost(s,f,id))return false;s.budget-=cost(s,f,id);row.push(id);return true}
function upgrade(s,id){const r=catalog.find(r=>r.id===id),n=count(s,id);if(!r||n<1||n>=3||requirement(s,id)||s.budget<cost(s,r.floor,id))return false;s.budget-=cost(s,r.floor,id);s.floors[r.floor].push(id);return true}
function income(s,completed,random=Math.random,source='manual'){
 const e=effects(s),manual=source!=='auto';let bonus=0,repeatBonus=0;
 if(!manual&&count(s,'steady')){s.steadyProgress=((s.steadyProgress||0)+1)%10;if(s.steadyProgress===0)bonus=value(s,'steady')}
 {s.trainingProgress=((s.trainingProgress||0)+1)%5;if(s.trainingProgress===0)repeatBonus=e.repeatAP}
 const baseAP=manual?e.clickAP:e.autoAP,critical=random()<e.critChance,morning=(s.dayProgress||0)<20?e.morningAP:0;
 const ap=baseAP*(critical?e.critMult:1)+bonus+repeatBonus+morning+(completed?e.dayAP:0);
 const previous=progress(s).level;s.instructions=Math.min(Number.MAX_SAFE_INTEGER,s.instructions+1);s.dayProgress=completed?0:((s.dayProgress||0)+1)%100;const level=progress(s).level;
 return {ap,critical,bonus,repeatBonus,dayBudget:completed?20:0,level,leveledUp:level>previous,baseAP};
}
function applyGain(s,gain){if(!gain)return;s.ap+=gain.ap||0;s.budget+=gain.dayBudget||0;}
function offline(s,now=Date.now()){
 if(!Number.isFinite(now)||now<=s.lastSeen)return 0;
 const e=effects(s),seconds=Math.min((now-s.lastSeen)/1000,e.offlineHours*3600);
 const total=seconds*e.autoRate+(s.autoCarry||0),clicks=Math.floor(total);s.autoCarry=total-clicks;
 let bonus=0;if(count(s,'steady')){const tally=(s.steadyProgress||0)+clicks;bonus=Math.floor(tally/10)*value(s,'steady');s.steadyProgress=tally%10}
 const tally=(s.trainingProgress||0)+clicks,repeatBonus=Math.floor(tally/5)*e.repeatAP;s.trainingProgress=tally%5;
 const ap=(clicks*e.autoAP*(1+e.critChance*(e.critMult-1))+bonus+repeatBonus)*(1+e.offlineBonus);
 s.ap+=ap;s.lastSeen=now;return ap;
}
function migrate(old){const s=defaults();if(!old)return s;s.budget=Number.isFinite(old.budget)?old.budget:0;for(const row of old.floors||[])if(Array.isArray(row))for(let i=0;i<row.length;i++)s.budget+=40+i*20;return s}
const api={departments,catalog,thresholds,defaults,normalize,count,value,progress,effects,trainingDiscount,requirement,currency,cost,unlock,choose,purchase,upgrade,income,applyGain,offline,migrate};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.RoomRules=api;
})(globalThis);
