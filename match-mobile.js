(function(){
const space=document.querySelector('.court-space'),courtBox=document.querySelector('.court-viewport');function fitCourt(){const w=Math.max(0,Math.min(space.clientWidth,space.clientHeight*620/1000));courtBox.style.width=w+'px';courtBox.style.height=(w*1000/620)+'px'}new ResizeObserver(fitCourt).observe(space);fitCourt();
const baseAward=awardPoint,baseSound=matchSound;let finished=false,skipping=false,fast=false;
const notify=(action,data={})=>parent.postMessage({type:'spiker-match',action,...data},'*');
matchSound=function(...args){if(!skipping)baseSound(...args)};
awardPoint=function(winner){if(finished)return;const finalScore=[...scores];finalScore[winner]++;baseAward(winner);if(sets[0]+sets[1]>0){finished=true;skipping=false;paused=true;baseSound('finish');document.getElementById('resultTitle').textContent=sets[0]>0?'Kazandık!':'Bu kez rakip kazandı';document.getElementById('resultScore').textContent=teamName(0)+' '+finalScore[0]+' – '+finalScore[1]+' '+teamName(1);document.getElementById('matchResult').hidden=false;document.getElementById('mobilePause').disabled=true;document.getElementById('mobileSpeed').disabled=true;notify('finished',{score:finalScore})}};
function skipChunk(){if(finished)return;if(!ready){setTimeout(skipChunk,100);return}paused=false;for(let i=0;i<1800&&!finished;i++)tick(1/30);paused=true;if(!finished)setTimeout(skipChunk,0)}
window.addEventListener('message',e=>{if(e.source!==parent||e.data?.type!=='spiker-match'||e.data.action!=='skip'||skipping||finished)return;skipping=true;paused=true;document.getElementById('event').textContent='Maçın kalan kısmı oynanıyor…';document.getElementById('mobilePause').disabled=true;document.getElementById('mobileSpeed').disabled=true;skipChunk()});
document.getElementById('resultContinue').onclick=()=>notify('return');
document.getElementById('mobilePause').onclick=()=>{if(finished||skipping)return;document.getElementById('pause').click();document.getElementById('mobilePause').textContent=paused?'▶ Devam et':'Ⅱ Duraklat'};
document.getElementById('mobileSpeed').onclick=()=>{fast=!fast;document.getElementById('speed').value=fast?'1.5':'1';document.getElementById('mobileSpeed').textContent=fast?'Hız · 1.5×':'Hız · 1×'};
document.addEventListener('visibilitychange',()=>{if(document.hidden&&!paused&&!skipping)document.getElementById('mobilePause').click()});notify('ready');
})();
