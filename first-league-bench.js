(function(){
'use strict';
const key='idle-spiker-bench-introductions-v1';let earned=new Set(),shown=new Set(),timer=null,signature='';
try{const saved=JSON.parse(localStorage.getItem(key)||'[]');if(Array.isArray(saved))shown=new Set(saved.filter(id=>TeamRules.reserveSlots.some(s=>s.id===id)))}catch{}
try{const ids=JSON.parse(localStorage.getItem('idle-spiker-bench-unlocks-v1')||'[]');if(Array.isArray(ids))earned=new Set(ids.filter(id=>TeamRules.reserveSlots.some(s=>s.id===id)))}catch{}
function plan(){return TeamRules.reservePlan(undefined,undefined,TeamView.reserveSnapshot(),[...earned])}
function refresh(){
 if(LeagueRules.config.division!==4){document.querySelector('#lineupDialog.reserve-opening[open]')?.close();document.getElementById('firstBenchSummary')?.remove();clearTimeout(timer);timer=null;return;}
 const before=earned.size;for(const s of plan())if(s.unlocked)earned.add(s.id);if(earned.size!==before)try{localStorage.setItem('idle-spiker-bench-unlocks-v1',JSON.stringify([...earned]))}catch{}
 const slots=plan(),open=slots.filter(s=>s.unlocked),next=slots.find(s=>!s.unlocked),team=document.getElementById('teamPanel');
 let summary=document.getElementById('firstBenchSummary');if(!summary){signature='';summary=document.createElement('div');summary.id='firstBenchSummary';document.getElementById('reserveTeam').before(summary)}
 summary.hidden=team.dataset.rosterView!=='reserves';const k=slots.map(s=>s.unlocked+':'+s.remaining).join('|');if(k!==signature){signature=k;summary.innerHTML='<div><small>1. LİG · KADRO DERİNLİĞİ</small><strong>Yedek kulüben kuruluyor</strong><span>'+open.length+' / 5 yer açık</span></div><p>'+(next?next.name+' yeri '+next.at+'. maçtan sonra açılacak.':'Beş pozisyon da hazır. Genç mezunlarına yer aç.')+'</p><progress max="5" value="'+open.length+'" aria-label="Açılan yedek yerleri"></progress>';}
 const host=document.querySelector('#firstLeagueWorkshop[open] #firstCampus');if(host){let preview=document.getElementById('firstBenchPreview');if(!preview){preview=document.createElement('section');preview.id='firstBenchPreview';host.after(preview)}const roster={reserves:TeamView.reserveSnapshot()},stamp=slots.map(s=>s.unlocked+':'+roster.reserves[s.id]).join('|');if(preview.dataset.stamp!==stamp){preview.dataset.stamp=stamp;preview.innerHTML='<header><strong>Kulübene beş yeni yer</strong><span>'+open.length+' / 5 açık</span></header><div></div>';for(const slot of slots){const b=document.createElement('button');b.type='button';b.disabled=!slot.unlocked;const p=TeamRules.players.find(p=>p.id===roster.reserves[slot.id]);b.innerHTML=(p?'<img alt="">':'<b aria-hidden="true">'+(slot.unlocked?'+':SpikerIcons.markup('clock'))+'</b>')+'<strong>'+slot.name+'</strong><small>'+(p?p.name:slot.unlocked?'Oyuncu seç':slot.at+'. maç')+'</small>';if(p)b.querySelector('img').src=TeamAppearance.playerPortrait(p);b.onclick=()=>{shown.add(slot.id);try{localStorage.setItem(key,JSON.stringify([...shown]))}catch{}FirstLeagueWorkshop.close();TeamView.openReserve(slot.id)};preview.querySelector('div').append(b)}}}
 clearTimeout(timer);timer=document.hidden?null:setTimeout(check,900);
}
function check(){
 timer=null;if(LeagueRules.config.division!==4)return;
 const unsafe=document.hidden||window.gameResetting||window.GuidedTutorial?.active||window.MatchGateway?.active?.()||window.BalTransition?.active||document.body.classList.contains('match-open')||document.querySelector('dialog[open],.guided-tutorial')||(document.getElementById('teamPanel').hidden&&document.getElementById('clubPanel').hidden);
 if(!unsafe){const reserves=TeamView.snapshot().reserves,slot=plan().find(s=>s.unlocked&&!reserves[s.id]&&!shown.has(s.id));if(slot&&TeamView.openReserve(slot.id)){
  const dialog=document.getElementById('lineupDialog');dialog.classList.add('reserve-opening');dialog.querySelector('.eyebrow').textContent='YENİ YEDEK YERİ';dialog.querySelector('h2').textContent='Yedek '+slot.name.toLocaleLowerCase('tr-TR')+' kim olsun?';dialog.querySelector('.lineup-help').textContent='Kulübende yeni bir yer açıldı. Bu pozisyon için alternatif oyuncularından birini seç.';
  const pair=dialog.querySelector('.lineup-current-pair');pair.hidden=true;dialog.querySelectorAll('.lineup-option').forEach(b=>b.addEventListener('click',()=>{pair.hidden=false},{once:true}));
  const later=document.createElement('button');later.type='button';later.className='team-secondary';later.textContent='Sonra seçerim';later.onclick=()=>dialog.close();dialog.querySelector('footer').append(later);
  shown.add(slot.id);try{localStorage.setItem(key,JSON.stringify([...shown]))}catch{}
  dialog.addEventListener('close',()=>{dialog.classList.remove('reserve-opening');refresh()},{once:true});
 }}
 refresh();
}
function init(){const panel=document.getElementById('teamPanel');new MutationObserver(()=>{if(LeagueRules.config.division===4)refresh()}).observe(panel,{attributes:true,attributeFilter:['hidden','data-roster-view']});document.getElementById('rosterViewSwitch').addEventListener('click',refresh);for(const event of ['spiker-stage-changed','spiker-league-result'])addEventListener(event,()=>{if(LeagueRules.config.division===4)TeamView.refresh();refresh()});refresh();}
addEventListener('visibilitychange',refresh);
window.FirstLeagueBench={refresh,check,plan,earned:()=>[...earned]};if(document.readyState==='loading')addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
