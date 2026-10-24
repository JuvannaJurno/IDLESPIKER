(function(root){'use strict';
const B=root.BalRules||(typeof require==='function'?require('./bal-rules.js'):null);
const validId=id=>typeof id==='string'&&/^bal3_r(?:[1-9]|1[0-9]|2[0-8])-(?:0-[1-7]|[1-7]-0)$/.test(id);
const number=(v,max=Number.MAX_SAFE_INTEGER)=>Number.isFinite(v)?Math.max(0,Math.min(max,v)):0;
const Shift=root.ShiftRules||(typeof require==='function'?require('./shift-rules.js'):null);
function normalize(raw){if(!validId(raw?.fixtureId))return null;return {fixtureId:raw.fixtureId,used:number(raw.used),lastAt:number(raw.lastAt),carry:number(raw.carry,.999999),steady:Math.floor(number(raw.steady))%10,repeat:Math.floor(number(raw.repeat))%5,income:Math.floor(number(raw.income))%10};}
function matchLimit(s){return B.value(s,'pro_travel')>0?(5+Math.round(B.value(s,'pro_travel')*5)*5)*60:0;}
function status(s,id,e,now=Date.now()){
 const capacity=e.offlineHours*3600,limit=matchLimit(s),unlocked=s.division===3&&B.value(s,'pro_travel')>0;
 const shift=Shift.status(s,capacity,now),old=s.matchOvertime;
 const allowed=!old||old.fixtureId===id||s.attendanceRewards?.includes(old.fixtureId);
 return {unlocked,capacity,matchCapacity:limit,remaining:unlocked&&validId(id)&&allowed?Math.max(0,Math.min(shift.remaining,limit-(old?.fixtureId===id?old.used:0))):0};
}
function settle(s,id,from,now,e){
 const result={ap:0,cash:0,seconds:0,cycles:0};
 if(!Number.isFinite(from)||!Number.isFinite(now)||now<=from||!status(s,id,e,now).unlocked||!validId(id))return result;
 const capacity=e.offlineHours*3600,limit=matchLimit(s),rate=e.autoRate*(1+(e.doubleChance||0));if(capacity<=0||rate<=0)return result;
 let work=normalize(s.matchOvertime);if(work&&work.fixtureId!==id&&!s.attendanceRewards?.includes(work.fixtureId))return result;
 if(!work||work.fixtureId!==id)work={fixtureId:id,used:0,lastAt:from,carry:0,steady:(s.steadyProgress||0)%10,repeat:(s.trainingProgress||0)%5,income:(s.incomeProgress||0)%10};
 let cursor=Math.max(from,work.lastAt);const efficiency=1;
 const charged=Shift.consume(s,capacity,cursor,now,Math.max(0,limit-work.used)),seconds=charged.seconds;
 if(seconds){
   const units=work.carry+seconds*rate,n=Math.floor(units+1e-9);work.carry=Math.max(0,units-n);
   const rules=root.RoomRules||(typeof require==='function'?require('./room-rules.js'):null),steadyValue=(rules?.value(s,'steady')||0)*1.25;
   const bonus=Math.floor((work.steady+n)/10)*(steadyValue+B.value(s,'bal_plan'));
   const repeats=Math.floor((work.repeat+n)/5)*e.repeatAP;
   work.steady=(work.steady+n)%10;work.repeat=(work.repeat+n)%5;
   const production=rules.automaticProduction(s,e);
   const ap=(n*(production.base+production.calendar)+bonus+repeats)*(1+B.value(s,'pro_campap'));
   const cash=B.departmentOpen(s,2)?Math.floor((work.income+n)/10)*B.cash(s)*efficiency:0;
   work.income=(work.income+n)%10;work.used+=seconds;
   s.ap+=ap;s.budget+=cash;result.ap+=ap;result.cash+=cash;result.seconds+=seconds;result.cycles+=n;
 }
 work.lastAt=Math.max(work.lastAt,now);s.matchOvertime=work;return result;
}
const api={validId,normalize,matchLimit,status,settle};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.OvertimeRules=api;
})(globalThis);
