(function(){
'use strict';
let panel=null,timer=null,signature='';const dialog=document.getElementById('scoutDialog');
function refresh(){clearTimeout(timer);timer=null;if(document.hidden||!window.FirstLeagueBench||LeagueRules.config.division!==4||!dialog.open||!dialog.classList.contains('is-home')){if(panel)panel.hidden=true;return;}
 const reserves=TeamView.reserveSnapshot(),lineup=TeamView.lineupSnapshot(),players=TeamRules.players.slice().sort((a,b)=>TeamRules.overall(b)-TeamRules.overall(a)),need=FirstLeagueClubTheme.need(4,players,lineup,reserves,FirstLeagueBench.plan());
 if(!need){if(panel)panel.hidden=true;return;}
 if(!panel){panel=document.createElement('section');panel.id='firstLeagueReserveNeed';document.getElementById('transferHome').prepend(panel)}panel.hidden=false;
 const current=document.getElementById('homeCurrentCatalog'),next=document.getElementById('homeNewCatalog'),candidate=need.candidate,available=!!candidate||!current.disabled||!next.disabled,key=[need.slot.id,candidate?.id,candidate?.name,candidate?.surname,candidate?TeamRules.overall(candidate):'',available,current.disabled,next.disabled].join('|');
 if(key!==signature){
  signature=key;panel.replaceChildren();const title=document.createElement('strong'),copy=document.createElement('p'),button=document.createElement('button');title.textContent=need.slot.name+' yedeğin boş';
  copy.textContent=candidate?'Bu pozisyonda bir alternatifin var.':'Bu pozisyonda alternatif oyuncun yok. Katalogda uygun rolü inceleyebilirsin.';
  panel.append(title,copy);
  if(candidate){
   const row=document.createElement('div'),portrait=document.createElement('img'),name=document.createElement('strong'),rating=document.createElement('span');row.className='first-reserve-candidate';portrait.alt='';portrait.src=TeamAppearance.valid(candidate.appearance)?TeamAppearance.playerPortrait(candidate):candidate.art;name.textContent=candidate.name+' '+candidate.surname;rating.textContent=TeamRules.overall(candidate)+' OVR';row.append(portrait,name,rating);panel.append(row);
  }
  button.type='button';button.className=available?'team-action':'team-secondary';button.disabled=!available;button.textContent=candidate?'Yedek oyuncunu seç':available?'Adaylara bak':'Yeni katalog hazırlanıyor';
  button.onclick=()=>{if(candidate){dialog.close();if(TeamView.openReserve(need.slot.id)){const option=[...document.querySelectorAll('#lineupDialog .lineup-option')].find(b=>b.dataset.candidate===candidate.id);option?.click()}}else if(!current.disabled){current.click();const select=document.getElementById('transferRole');select.value=need.slot.role;select.dispatchEvent(new Event('change'));}else if(!next.disabled)next.click();};panel.append(button);
 }
 timer=setTimeout(refresh,1500);
}
new MutationObserver(refresh).observe(dialog,{attributes:true,attributeFilter:['open','class']});for(const event of ['spiker-stage-changed','visibilitychange'])addEventListener(event,refresh);
addEventListener('DOMContentLoaded',refresh,{once:true});window.FirstLeagueClubGuidance={refresh};
})();
