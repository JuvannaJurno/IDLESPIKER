(function(){'use strict';
const notice=document.createElement('p');notice.className='rival-style-toast';notice.hidden=true;
const cues=[],baseReset=reset,baseBlockPlan=blockPlan;
blockPlan=function(team,y){const plan=baseBlockPlan(team,y);if(players.some(p=>p.team===team&&RivalStyles.of(p)==='block'))for(const goal of plan)goal.x=team?525:475;return plan;};
function clear(){cues.length=0;notice.hidden=true;notice.textContent='';}
reset=function(){clear();return baseReset();};
window.MatchRivalStyles={cues,notice,clear};
})();
