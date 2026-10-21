(function(){'use strict';
// Unplayed seasons can change calendars without removing any match result.
const keys=['idle-spiker-league-v1','idle-spiker-rooms-v2','idle-spiker-main-menu-v1'];let previous;
try{
 previous=keys.map(k=>localStorage.getItem(k));const [league,room,menu]=previous.map(x=>JSON.parse(x||'null'));
 if(!league||!room||!menu||league.division!==3||room.division!==3||league.divisionCalendar===2||league.completionSeen||league.completedDay||Object.keys(league.results||{}).length||room.camp?.entries?.some(e=>e.status==='running'))return;
 const first=league.startDay||1,oldLimit=SeasonClock.dayInstructions(room),newLimit=SeasonClock.weekly.dayInstructions;
 const convert=s=>{const total=Math.max(0,((s.day||first)-first)*oldLimit+(s.clicksToday||0));return {day:first+Math.floor(total/newLimit),clicksToday:total%newLimit};};
 const next=convert(room.offlineCalendar||menu);room.divisionCalendar=2;room.dayProgress=next.clicksToday;
 if(room.offlineCalendar)room.offlineCalendar={...next};
 if(room.camp){const mapDay=d=>Math.max(1,first+Math.floor((d-first)*oldLimit/newLimit));room.camp.lastDay=mapDay(room.camp.lastDay||first);for(const key of ['announcedDay','opensDay'])if(Number.isSafeInteger(room.camp[key]))room.camp[key]=mapDay(room.camp[key]);}
 if(room.scouting)room.scouting.startedDay=Math.max(1,first+Math.floor(((room.scouting.startedDay||first)-first)*oldLimit/newLimit));
 league.divisionCalendar=2;league.seasonRounds=14;
 const values=[league,room,next].map(x=>JSON.stringify(x));for(let i=0;i<keys.length;i++)localStorage.setItem(keys[i],values[i]);
}catch{if(previous)for(let i=0;i<keys.length;i++)try{previous[i]===null?localStorage.removeItem(keys[i]):localStorage.setItem(keys[i],previous[i]);}catch{}}
})();
