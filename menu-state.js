(function(root){
'use strict';
const DAYS=['Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi','Pazar'];
function normalize(raw){const day=Number.isSafeInteger(raw?.day)&&raw.day>=1?raw.day:1;const clicksToday=Number.isInteger(raw?.clicksToday)&&raw.clicksToday>=0&&raw.clicksToday<100?raw.clicksToday:0;return{day,clicksToday}}
function advance(raw){const state=normalize(raw),completed=state.clicksToday===99;return{state:{day:state.day+(completed?1:0),clicksToday:completed?0:state.clicksToday+1},completed,completedDay:completed?state.day:null,matchDay:completed&&state.day+1<=98&&(state.day+1)%7===0}}
const api={normalize,advance,isMatchDay:day=>day>=7&&day<=98&&day%7===0,dayName:day=>DAYS[(day-1)%7],week:day=>Math.floor((day-1)/7)+1};
if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.MenuState=api;
})(typeof globalThis!=='undefined'?globalThis:this);
