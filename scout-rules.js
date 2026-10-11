(function(root){
'use strict';
const stats=['spike','block','serve','receive','set','stamina','mental'],roles=['setter','outside','opposite','middle','libero'];
function available(s){return s.stage==='bal'&&(!Array.isArray(s.openDepartments)||s.openDepartments.includes(4));}
const clone=x=>JSON.parse(JSON.stringify(x));
function validPlayer(p){return p&&roles.includes(p.role)&&typeof p.name==='string'&&p.name.length<=24&&typeof p.surname==='string'&&p.surname.length<=24&&/^team-assets\/woman-(?:[0-9]|[12][0-9]|3[0-5])\.svg$/.test(p.art)&&p.gender==='female'&&Number.isInteger(p.height)&&p.height>=150&&p.height<=210&&stats.every(k=>Number.isInteger(p[k])&&p[k]>=0&&p[k]<=100);}
function normalize(raw){return {tutorialSeen:!!raw?.tutorialSeen,round:Number.isSafeInteger(raw?.round)&&raw.round>=0?raw.round:0,startedDay:Number.isSafeInteger(raw?.startedDay)&&raw.startedDay>=1?raw.startedDay:1,catalog:(Array.isArray(raw?.catalog)?raw.catalog:[]).filter(c=>/^scout-\d+-\d+$/.test(c?.id)&&validPlayer(c.player)&&Number.isSafeInteger(c.price)&&c.price>0).slice(0,8).map(c=>({id:c.id,player:clone(c.player),price:c.price,hired:!!c.hired})),recruits:(Array.isArray(raw?.recruits)?raw.recruits:[]).filter(p=>/^player-(?:1[2-9]|2[0-9])$/.test(p?.id)&&validPlayer(p)).slice(0,18).map(clone)};}
function count(s,id){return s.floors.flat().filter(x=>x===id).length;}
function config(s){const search=count(s,'bal_search'),contacts=count(s,'bal_contacts'),talent=count(s,'bal_talent');return {days:6-search,size:3+contacts,highChance:[.08,.15,.23,.32,.42,.55][Math.min(5,talent)]};}
function day(s){return (s.balStartDay||1)+Math.floor(s.instructions/500);}
function remaining(s){return Math.max(0,s.scouting.startedDay+config(s).days-day(s));}
function report(s,factory,random=Math.random){if(!available(s)||remaining(s)>0)return false;const cfg=config(s),pool=factory(),round=s.scouting.round+1;for(let i=pool.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[pool[i],pool[j]]=[pool[j],pool[i]];}
const catalog=pool.slice(0,cfg.size).map((p,i)=>{const high=random()<cfg.highChance,bonus=high?18+Math.floor(random()*9):4+Math.floor(random()*7);for(const k of stats)p[k]=Math.min(50,p[k]+bonus);p.baseStats=Object.fromEntries(stats.map(k=>[k,p[k]]));p.training={};p.cardLevel=1;p.cardVersion=1;const mean=stats.reduce((n,k)=>n+p[k],0)/stats.length;return {id:'scout-'+round+'-'+i,player:p,price:Math.round((400+mean*18+(high?350:0))/10)*100,hired:false};});s.scouting={...s.scouting,round,startedDay:day(s),catalog};return true;}
function hire(s,id,roster,validate){const c=s.scouting.catalog.find(c=>c.id===id);if(!available(s)||!c||c.hired||roster.length>=30||s.budget<c.price)return false;const p={...clone(c.player),id:'player-'+roster.length,number:roster.length+1};if(!validate([...roster.map(p=>({...p,art:p.art.startsWith('team-assets/')?p.art:'team-assets/woman-0.svg'})),p]))return false;s.budget-=c.price;c.hired=true;s.scouting.recruits.push(p);return true;}
const api={available,normalize,config,day,remaining,report,hire};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ScoutRules=api;
})(globalThis);
