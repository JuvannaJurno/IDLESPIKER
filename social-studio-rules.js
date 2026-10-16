(function(root){
'use strict';
const contents=[
 {id:'moment',title:'Kulüpten bir an',seconds:45,followers:24,label:'Kısa klip · Düzenli büyüme'},
 {id:'story',title:'Oyuncu hikâyesi',seconds:100,followers:78,label:'Röportaj · Daha fazla takipçi'},
 {id:'sponsor',title:'Sponsor paylaşımı',seconds:120,followers:0,label:'Reklam · Doğrudan bütçe'}
];
const sponsors=[{at:100,name:'Mahalle Esnafı'},{at:1000,name:'File Spor'},{at:5000,name:'Tribün Market'},{at:15000,name:'Rota Spor'},{at:40000,name:'Arena'}];
function followers(s){return 100+Math.max(0,Math.floor(s.earnedFollowers||0));}
function income(s){const f=followers(s),tier=sponsors.filter(x=>f>=x.at).length-1;return Math.round(80*(f/100)**.65*(1+tier*.18)*(1+(s.levels[2]||0)*.12));}
function normalize(s,now,day){const old=s.studio||{};s.studio={completedDraft:old.completedDraft&&typeof old.completedDraft.text==='string'?old.completedDraft:null,simpleVersion:old.simpleVersion===1?1:0,offer:Math.max(0,Math.floor(old.offer||0))%3,readyAt:Number(old.readyAt)||0,jobs:Array.isArray(old.jobs)?old.jobs.filter(j=>contents.some(c=>c.id===j.type)&&Number.isFinite(j.end)&&Number.isFinite(j.start)&&typeof j.id==='string').slice(0,2):[],queue:Array.isArray(old.queue)?old.queue.filter(t=>contents.some(c=>c.id===t)).slice(0,8):[],pattern:Array.isArray(old.pattern)?old.pattern.filter(t=>contents.some(c=>c.id===t)).slice(0,8):[],auto:!!old.auto,serial:Math.max(0,Math.floor(old.serial||0)),lastDay:Math.max(1,Math.floor(old.lastDay||day)),nextAmbient:Number.isFinite(old.nextAmbient)?old.nextAmbient:now+60000,ambient:Math.max(0,Math.floor(old.ambient||0)),opportunities:Array.isArray(old.opportunities)?old.opportunities.filter(x=>typeof x==='string').slice(-5):[]};return s.studio;}
function slots(s){return (s.levels[0]||0)>=6?2:1;}
function capacity(s){return 3+Math.max(0,(s.levels[1]||0)-5);}
function reward(s,type,special=false){const c=contents.find(c=>c.id===type);return {followers:Math.round(c.followers*(1+(s.levels[1]||0)*.18)*(special?1.6:1)),cash:type==='sponsor'?Math.round(income(s)*.8):0};}
function duration(s,type,lane=0){const c=contents.find(c=>c.id===type);const speed=1+Math.min(5,s.levels[0]||0)*.12+(lane?Math.max(0,(s.levels[0]||0)-6)*.15:0);return Math.round(c.seconds*1000/speed);}
function price(level){return [1500,3500,7000,12000,20000,32000,48000,68000,95000,130000][level];}
const api={contents,sponsors,followers,income,normalize,slots,capacity,reward,duration,price};root.SocialStudioRules=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
