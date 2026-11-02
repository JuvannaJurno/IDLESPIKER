(function(root){
'use strict';
function create(){
 const entries=new Map();let point=0;
 const key=(actor,id,team)=>id==='team-heart'&&team!==undefined?'team:'+team+'|'+id:actor+'|'+id;
 return {
  ready(actor,id,clock=0,team){const e=entries.get(key(actor,id,team));return !e||!e.reserved&&(id==='pancake'?clock>=e.until:!e.pending&&e.remaining===0);},
  reserve(actor,id,team,clock=0){if(!this.ready(actor,id,clock,team))return false;entries.set(key(actor,id,team),{actor,id,team,reserved:true,pending:false,remaining:0,until:0,usedAt:point});return true;},
  cancel(actor,id,team){const k=key(actor,id,team);if(entries.get(k)?.reserved)entries.delete(k);},
  commit(actor,id,team,clock=0){this.cancel(actor,id,team);return this.use(actor,id,team,clock);},
  use(actor,id,team,clock=0){if(!this.ready(actor,id,clock,team))return false;entries.set(key(actor,id,team),{actor,id,team,pending:id!=='pancake',remaining:id==='team-heart'?2:0,...(id==='team-heart'?{lossStreak:0}:{}),until:id==='pancake'?clock+12:0,usedAt:point});return true;},
  settle(winner){point++;for(const [k,e] of entries){
   if(e.reserved){entries.delete(k);continue;}
   if(e.id==='pancake')continue;
   if(e.id==='team-heart'){
    // Once charged, keep it ready until the next actual use.
    if(!e.pending&&e.remaining===0)continue;
    e.pending=false;e.lossStreak=e.team===winner?0:e.lossStreak+1;e.remaining=Math.max(0,2-e.lossStreak);continue;
   }
   if(e.pending){e.remaining=e.team===winner?0:3;e.pending=false;}else e.remaining=Math.max(0,e.remaining-1);
  }},
  reset(){entries.clear();point=0;},
  snapshot(clock=0){return [...entries.values()].map(e=>({...e,seconds:e.id==='pancake'?Math.max(0,e.until-clock):0}));}
 };
}
const api={create};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.LegendaryCooldownRules=api;
})(globalThis);
