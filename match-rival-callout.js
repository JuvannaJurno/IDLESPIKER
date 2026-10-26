(function(){
'use strict';if(typeof draw!=='function'||new URLSearchParams(location.search).has('academyTraining'))return;
const ui=RivalCalloutUI.create(),box=ui.box;
const previousDraw=draw,previousTick=tick;let fixture=null,shown=false,current=null;
function stop(){current=null;box.hidden=true;window.MatchFrames?.invalidate();}
box.querySelector('button').onclick=stop;
draw=function(){previousDraw();const key=window.matchInfo?.fixtureId||window.matchInfo?.round||'preview';if(key!==fixture){fixture=key;shown=false;stop();}if(!shown&&!paused&&ready){const actor=players.filter(p=>p.team===1&&p.roster?.specialCharacter).sort((a,b)=>(b.roster.spike+b.roster.set)-(a.roster.spike+a.roster.set))[0];if(actor){shown=true;current={actor,start:performance.now()};box.querySelector('strong').textContent=[actor.roster.name,actor.roster.surname].filter(Boolean).join(' ');const skill=window.PlayerSkills?.view(actor.roster,{division:window.matchInfo?.division||3}).find(s=>s.rarity==='Legendary');box.querySelector('span').textContent=skill?.name||'Rakibin kadrosunda';box.hidden=false;}}
if(!current)return;if(performance.now()-current.start>=3400){stop();return;}ctx.save();ctx.fillStyle='#0b1c254d';ctx.fillRect(0,0,1000,620);drawPlayer(current.actor);ctx.restore();ui.place(current.actor,canvas);
};
tick=function(dt){if(current){window.MatchFrames?.invalidate();return;}return previousTick(dt);};
window.MatchRivalCallout={stop,get active(){return !!current}};
})();
