(function(){'use strict';
const court=document.querySelector('.court-space'),notice=document.createElement('p');notice.className='rival-style-toast';notice.hidden=true;notice.setAttribute('role','status');court.append(notice);
let cursor=0,fixture='',until=0,lastCue=-20,shown=new Set(),rallyDefenses=0,defenseRally=-1;const cues=[];
const baseTick=tick,baseReset=reset,baseBlockPlan=blockPlan;
function rematch(){return window.matchInfo?.rivalRematchText||RivalStyles.rematchText(players.filter(p=>p.team===1).map(p=>p.roster||p.stats));}
function show(text,key,force=false){if(shown.has(key)||(!force&&elapsed-lastCue<8))return;shown.add(key);lastCue=elapsed;until=elapsed+3;notice.textContent=text;notice.hidden=false;cues.push({key,text,at:elapsed});if(cues.length>30)cues.shift();}
blockPlan=function(team,y){const plan=baseBlockPlan(team,y);if(players.some(p=>p.team===team&&RivalStyles.of(p)==='block'))for(const goal of plan)goal.x=team?525:475;return plan;};
function clear(){cursor=0;fixture='';until=0;lastCue=-20;shown.clear();cues.length=0;notice.hidden=true;rallyDefenses=0;defenseRally=-1;}
reset=function(){clear();return baseReset();};
tick=function(dt){const advancing=ready&&!paused;baseTick(dt);if(!advancing)return;const rival=players.find(p=>p.team===1&&p.stats?.rivalStyleKind);if(!rival){notice.hidden=true;return;}const id=window.matchInfo?.fixtureId||'match';if(id!==fixture){clear();fixture=id;const style=RivalStyles.profile(rival.stats.rivalStyleTeam);show('Rakibin güçlü yanı: '+style.label,'intro',true);}
 if(cursor>history.length)cursor=0;
 for(;cursor<history.length;cursor++){const e=history[cursor],actor=players.find(p=>p.index===e.player);if(e.type==='serve'&&RivalStyles.of(actor)==='serve'){show(teamName(actor.team)+' · '+(RivalStyles.profile(actor.stats.rivalStyleTeam)?.placement?'Boşluklara servis':'Servis baskısı'),'serve-'+actor.team);if(actor.stats.rivalImproved)show(rematch()||RivalStyles.profile(actor.stats.rivalStyleTeam).rematch,'rematch',true);}
 if(e.type==='block-contact'&&e.players?.length>=2&&players.some(p=>p.team===e.team&&RivalStyles.of(p)==='block'))show(teamName(e.team)+' · İkili blok!','block-'+e.team);
 if(e.type==='resolution'&&e.event==='dig'){const defending=1-e.team;if(players.some(p=>p.team===defending&&RivalStyles.of(p)==='defense')){if(defenseRally!==rally){defenseRally=rally;rallyDefenses=0;}rallyDefenses++;show(teamName(defending)+(rallyDefenses>=2?' topu yine çıkardı!':' · Savunma topu oyunda tuttu'),'defense-'+Math.min(2,rallyDefenses));}}
 }
 const style=RivalStyles.profile(rival.stats.rivalStyleTeam);if(rival.stats.rivalRematch&&!shown.has('rematch')&&elapsed>until+1)show(rematch()||style.rematch,'rematch',true);
 if(elapsed>=until)notice.hidden=true;
};
window.MatchRivalStyles={cues,notice,clear};
})();
