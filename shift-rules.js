(function(root){'use strict';
const restMs=60*60*1000;
const nonnegative=v=>Number.isFinite(v)?Math.max(0,v):0;
function normalize(raw,capacity,reference=Date.now()){
 if(!raw||!Number.isFinite(raw.used)||raw.used<0)return null;
 let used=raw.used,cooldownUntil=nonnegative(raw.cooldownUntil);
 if(raw.version===2&&cooldownUntil)cooldownUntil=Math.max(1,cooldownUntil-3*60*60*1000);
 if(raw.version!==2&&raw.version!==3){const date=new Date(reference);date.setHours(0,0,0,0);if(raw.day!==date.getTime())used=0;cooldownUntil=0;}
 if(capacity>0&&used>=capacity&&!cooldownUntil)cooldownUntil=reference+restMs;
 return {version:3,used,cooldownUntil};
}
function at(raw,capacity,reference,now){const work=normalize(raw,capacity,reference)||{version:3,used:0,cooldownUntil:0};if(work.cooldownUntil&&now>=work.cooldownUntil){work.used=0;work.cooldownUntil=0;}return work;}
function status(s,capacity,now=Date.now()){
 const work=at(s.dailyShift,capacity,s.lastSeen||now,now),rest=Math.max(0,work.cooldownUntil-now);
 return {capacity,used:work.used,remaining:rest?0:Math.max(0,capacity-work.used),cooldownUntil:work.cooldownUntil,cooldownRemainingMs:rest};
}
function advance(s,capacity,now){if(s.dailyShift)s.dailyShift=at(s.dailyShift,capacity,s.lastSeen||now,now);}
// Charge productive seconds only. The returned time is the actual end of work,
// allowing an offline match stop and overtime to share the very same allowance.
function consume(s,capacity,from,to,maxSeconds=Infinity){
 const result={seconds:0,until:from};if(!Number.isFinite(from)||!Number.isFinite(to)||to<=from||capacity<=0||maxSeconds<=0)return result;
 const work=at(s.dailyShift,capacity,s.lastSeen||from,from);s.dailyShift=work;let cursor=from;
 while(cursor<to&&result.seconds<maxSeconds){
  if(work.cooldownUntil){cursor=Math.min(to,Math.max(cursor,work.cooldownUntil));if(cursor>=work.cooldownUntil){work.used=0;work.cooldownUntil=0;}else break;}
  if(cursor>=to)break;
  const cycleMs=capacity*1000+restMs;
  if(!work.used){const cycles=Math.min(Math.floor((to-cursor)/cycleMs),Math.max(0,Math.ceil((maxSeconds-result.seconds)/capacity)-1));if(cycles>0){result.seconds+=cycles*capacity;cursor+=cycles*cycleMs;continue;}}
  const seconds=Math.max(0,Math.min((to-cursor)/1000,capacity-work.used,maxSeconds-result.seconds));
  work.used+=seconds;result.seconds+=seconds;cursor+=seconds*1000;
  if(work.used>=capacity-1e-8){work.used=capacity;work.cooldownUntil=cursor+restMs;}
  if(!seconds&&!work.cooldownUntil)break;
 }
 result.until=cursor;return result;
}
const api={restMs,normalize,status,advance,consume};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.ShiftRules=api;
})(globalThis);
