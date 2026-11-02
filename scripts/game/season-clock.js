(function(root){'use strict';
const weekly=Object.freeze({version:2,rounds:14,dayInstructions:2500,matchTrigger:1500,preparationDays:20,gapDays:7});
const isWeekly=s=>s?.division>=3&&s?.divisionCalendar===weekly.version;
const dayInstructions=s=>isWeekly(s)?weekly.dayInstructions:s?.stage==='bal'?500:100;
const economyScale=s=>isWeekly(s)?weekly.dayInstructions/500:1;
const morningInstructions=s=>Math.round(20*economyScale(s));
const api={weekly,isWeekly,dayInstructions,economyScale,morningInstructions};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SeasonClock=api;
})(globalThis);
