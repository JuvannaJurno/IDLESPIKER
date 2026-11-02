(function(root){
'use strict';
const league=root.LeagueRules||(typeof require==='function'?require('./league-rules.js'):null);
const matchDays=league.config.matchDays;
const DAYS=['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar'];
const dayLimit=()=>league.config.dayInstructions||100;
function normalize(raw){const day=Number.isSafeInteger(raw?.day)&&raw.day>=1?raw.day:1;const clicksToday=Number.isInteger(raw?.clicksToday)&&raw.clicksToday>=0&&raw.clicksToday<dayLimit()?raw.clicksToday:0;return{day,clicksToday}}
function advance(raw){const state=normalize(raw),completed=state.clicksToday===dayLimit()-1;return{state:{day:state.day+(completed?1:0),clicksToday:completed?0:state.clicksToday+1},completed,completedDay:completed?state.day:null,matchDay:completed&&matchDays.includes(state.day+1)}}
const api={dayLimit,normalize,advance,isMatchDay:day=>matchDays.includes(day),dayName:day=>DAYS[(day-1)%7],week:day=>Math.floor((day-1)/7)+1};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MenuState=api;
})(typeof globalThis!=='undefined'?globalThis:this);
