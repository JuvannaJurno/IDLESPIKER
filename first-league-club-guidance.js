(function(){
'use strict';
let panel=null,timer=null,signature='';const dialog=document.getElementById('scoutDialog');
function refresh(){clearTimeout(timer);timer=null;if(document.hidden||!window.FirstLeagueBench||LeagueRules.config.division!==4||!dialog.open||!dialog.classList.contains('is-home')){if(panel)panel.hidden=true;return;}
 const reserves=TeamView.reserveSnapshot(),lineup=TeamView.lineupSnapshot(),players=TeamRules.players.slice().sort((a,b)=>TeamRules.overall(b)-TeamRules.overall(a)),need=FirstLeagueClubTheme.need(4,players,lineup,reserves,FirstLeagueBench.plan());
 if(!need){if(panel)panel.hidden=true;return;}
 if(!panel){panel=document.createElement('section');panel.id='firstLeagueReserveNeed';document.getElementById('transferHome').prepend(panel)}panel.hidden=false;
 const current=document.getElementById('homeCurrentCatalog'),next=document.getElementById('homeNewCatalog'),available=need.candidate||!current.disabled||!next.disabled,key=[need.slot.id,need.candidate?.id,available,current.disabled,next.disabled].join('|');
 if(key!==signature){signature=key;panel.replaceChildren();const title=document.createElement('strong'),copy=document.createElement('p'),button=document.createElement('button');title.textContent=need.slot.name+' yedeğin boş';copy.textContent=need.candidate?need.candidate.name+' '+need.candidate.surname+' bu pozisyonda alternatifin. Önce kendi oyuncularına bakabilirsin.':'Bu pozisyonda alternatif oyuncun yok. Katalogda uygun rolü inceleyebilirsin.';button.type='button';button.className=available?'team-action':'team-secondary';button.disabled=!available;button.textContent=need.candidate?'Yedek oyuncunu seç':available?'Adaylara bak':'Yeni katalog hazırlanıyor';button.onclick=()=>{if(need.candidate){dialog.close();if(TeamView.openReserve(need.slot.id)){const option=[...document.querySelectorAll('#lineupDialog .lineup-option')].find(b=>b.dataset.candidate===need.candidate.id);option?.click()}}else if(!current.disabled){current.click();const select=document.getElementById('transferRole');select.value=need.slot.role;select.dispatchEvent(new Event('change'));}else if(!next.disabled)next.click();};panel.append(title,copy,button);}
 timer=setTimeout(refresh,1500);
}
new MutationObserver(refresh).observe(dialog,{attributes:true,attributeFilter:['open','class']});for(const event of ['spiker-stage-changed','visibilitychange'])addEventListener(event,refresh);
addEventListener('DOMContentLoaded',refresh,{once:true});window.FirstLeagueClubGuidance={refresh};
})();
