(function(){
'use strict';
window.matchInfo={names:['Bizim Kulüp','Rakip takım'],league:'Mahalle Kadınlar Ligi',round:1};
const heading=document.querySelector('.match-heading');heading.innerHTML='<span class="match-live">● MAÇ GÜNÜ</span><h2 id="matchLeague"></h2><span id="matchRound"></span>';
const board=document.createElement('section');board.className='match-board';board.setAttribute('aria-label','Maç skoru');board.innerHTML='<div class="score-team home"><span class="team-mark">B</span><strong data-team-name="0"></strong><small> BİZİM TAKIM</small></div><div class="score-center"><div class="score-numbers"><b id="homePoints">0</b><span>:</span><b id="awayPoints">0</b></div><small id="matchSet">1. SET</small></div><div class="score-team away"><span class="team-mark">R</span><strong data-team-name="1"></strong><small>RAKİP</small></div><div class="serve-strip" id="serveTeam"></div>';
heading.after(board);
const consolePanel=document.createElement('section');consolePanel.className='match-console';consolePanel.setAttribute('aria-label','Maç kontrolleri');const controls=document.querySelector('.match-controls'),event=document.getElementById('event');controls.before(consolePanel);consolePanel.append(event,controls);
function names(){const info=window.matchInfo;for(const el of document.querySelectorAll('[data-team-name]'))el.textContent=info.names[Number(el.dataset.teamName)];document.getElementById('matchLeague').textContent=info.league;document.getElementById('matchRound').textContent=info.round+'. MAÇ';for(const [i,el] of [...document.querySelectorAll('.team-mark')].entries())el.textContent=info.names[i].slice(0,1).toLocaleUpperCase('tr');render()}
function render(){document.getElementById('homePoints').textContent=scores[0];document.getElementById('awayPoints').textContent=scores[1];document.getElementById('matchSet').textContent=(sets[0]+sets[1]+1)+'. SET';document.getElementById('serveTeam').textContent='SERVİS  ·  '+teamName(servingTeam)}
const original=updateScore;updateScore=function(){original();render()};
window.addEventListener('message',e=>{if(e.source!==parent||e.data?.type!=='spiker-match'||e.data.action!=='squad')return;const info=e.data.squad?.matchInfo;if(info?.names?.length===2){window.matchInfo=info;names()}});names();
})();
