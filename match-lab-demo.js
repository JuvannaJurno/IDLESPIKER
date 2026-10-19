(function(){
'use strict';
if(new URLSearchParams(location.search).get('animationLab')!=='legendary')return;
let run=0;
function start(){
 if(run>0){location.reload();return;}
 if(!ready){setTimeout(start,40);return;}
 paused=true;reset();run++;const speedSelect=document.getElementById('speed');for(const value of ['0.5','2'])if(![...speedSelect.options].some(o=>o.value===value))speedSelect.add(new Option(value+'×',value));
 window.matchInfo={names:['Yıldızlar','Efsaneler'],league:'Legendary · Atölye Maçı',round:run,stage:'bal',division:3,epicTeam:true,animationLab:true,opponentLegendaryUnlocked:true,fixtureId:'lab-match-'+Date.now()+'-'+run};
 matchRandom=MatchRules.seeded(matchInfo.fixtureId);
 for(const p of players){const role=['middle','outside','setter','middle','outside','opposite'][p.index%6],identity={id:'lab-'+p.index,name:(p.team?'Efsane ':'Yıldız ')+(p.index%6+1),surname:'',role,spike:66,block:58,serve:54,receive:86,set:88,stamina:95,mental:90,skillCamps:6,epicTeam:true};p.stats={...identity};p.roster=identity;p.displayName=identity.name;p.jerseyNumber=p.index%6+1;PlayerSkills.ensure(identity);}
 document.getElementById('matchResult').hidden=true;document.getElementById('matchLeague').textContent=matchInfo.league;document.getElementById('matchRound').textContent='DENEME '+run;
 document.querySelectorAll('[data-team-name]').forEach(n=>n.textContent=matchInfo.names[Number(n.dataset.teamName)]);
 document.querySelectorAll('.team-mark').forEach((n,i)=>n.textContent=i?'E':'Y');
 document.getElementById('resultContinue').textContent='Yeni atölye maçı';document.getElementById('resultContinue').onclick=start;
 updateScore();paused=false;announce('İki takımın da bütün yetenekleri açık.');send();
}
function send(){parent.postMessage({type:'lab-match-state',paused,finished:!document.getElementById('matchResult').hidden,legendary:MatchSkills.events.filter(e=>MatchSkills.catalog.find(s=>s.id===e.id)?.rarity==='Legendary').length,score:[...scores],run},'*');}
window.addEventListener('message',e=>{if(e.source!==parent||e.data?.type!=='lab-match-control')return;const d=e.data;if(d.action==='restart')start();if(d.action==='pause')paused=!!d.value;if(d.action==='speed'){const v=Number(d.value);if([.5,1,1.5,2].includes(v))document.getElementById('speed').value=String(v);}send();});
setInterval(send,500);window.LabMatch={start};start();
})();
