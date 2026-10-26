(function(){
'use strict';
if(window.AcademyPreview)return;
const $=id=>document.getElementById(id);let busy=false,decoratedDivision=null;
const active=()=>LeagueRules.config.division===4;
const promotion=GameUI.selection({id:'firstLeaguePromotion',title:'Ulusal Voleybol 1. Ligi',eyebrow:'YENİ SEZON',content:'<p>1. Lig’de kulübünün altyapısını kur. Transferden gençleri akademiye al, gelişim yönlerini seç ve kendi oyuncularını yetiştir.</p><button id="enterFirstLeague" class="team-action" type="button">Kulübü 1. Lig’e taşı</button><p id="firstLeagueError" role="alert"></p>'});
promotion.dialog.querySelector('footer span').textContent='Oyuncuların, kaynakların ve yatırımların korunur.';
const button=document.createElement('button');button.type='button';button.className='team-action';button.id='firstLeaguePromotionEntry';button.hidden=true;$('prologueComplete').append(button);
button.onclick=()=>showPromotion();$('enterFirstLeague').onclick=()=>start();
function showPromotion(){if(LeagueRules.config.division!==3||!LeagueSeason.progress().prologueComplete||LeagueSeason.progress().rank>3)return false;promotion.open();return true;}
function refresh(){
 const p=LeagueSeason.progress();button.hidden=LeagueRules.config.division!==3||!p.prologueComplete;
 if(!button.hidden){button.textContent=p.rank<=3?'Ulusal Voleybol 1. Ligi’ne yüksel →':'1. Lig için sezonu ilk üçte tamamla';button.disabled=p.rank>3;}
 if(!active())return;
 document.body.classList.add('first-league');document.querySelector('#clubPanel .section-top .eyebrow').textContent='BİZİM KULÜP · AŞAMA 4';
 const select=$('stageTestSelect');if(select&&decoratedDivision!==LeagueRules.config.division){select.value='4';decoratedDivision=LeagueRules.config.division;}
}
function buildState(){
 const room=RoomSystem.snapshot();RoomRules.settlePendingGains(room);const first=room.division!==4;
 room.division=4;room.divisionCalendar=2;room.instructions=0;room.dayProgress=0;room.trainingProgress=0;room.incomeProgress=0;room.lastSeen=Date.now();room.matchRewards=[];room.attendanceRewards=[];
 room.balStartDay=1;room.balStart=0;room.openDepartments=[2,4];delete room.offlineCalendar;delete room.offlineMatchId;delete room.matchOvertime;
 room.camp.lastDay=1;room.camp.announcedDay=null;room.camp.opensDay=null;room.camp.entries=room.camp.entries.map(e=>e.status==='running'?{...e,startDay:1,endDay:4}:e);
 room.scouting.startedDay=1;room.scouting.startedInstructions=0;
 const prospect=room.scouting.catalog.find(c=>!c.hired&&!c.player.specialCharacter);if(first&&prospect){prospect.player.academyProspect=true;prospect.player.age=17;}
 // Keep unfinished offers; otherwise the first national catalog is ready on arrival.
 if(!room.scouting.catalog.some(c=>!c.hired)){room.scouting.catalog=[];room.scouting.heldId=null;}
 room.academy=AcademyCareerRules.normalize(room.academy);
 const ids=new Set(Object.values(TeamView.snapshot().lineup)),peers=TeamRules.players.filter(p=>ids.has(p.id)&&!p.epicTeam&&!p.specialCharacter),rating=peers.length?Math.round(peers.reduce((n,p)=>n+TeamRules.overall(p),0)/peers.length):100;
 const league={version:3,mode:'bal',division:4,divisionCalendar:2,seasonRounds:14,startDay:1,run:4,divisionEntryRating:Math.max(95,Math.min(240,rating+8)),entrants:LeagueRules.divisionEntrants().map(t=>({...t,name:t.id===0?LeagueRules.teams[0]:t.name})),results:{},scheduleVersion:2};
 return {room,league,first};
}
async function start(test=false){
 if(busy||active()&&!test||!test&&(LeagueRules.config.division!==3||!LeagueSeason.progress().prologueComplete||LeagueSeason.progress().rank>3))return false;
 busy=true;let ui=null,committing=false;const previous=LeagueRules.config.division;
 try{
  if(test&&previous<3){if(previous===1){await BalTransition.start(true);while(BalTransition.active)await new Promise(requestAnimationFrame);}await DivisionThree.start(true);if(LeagueRules.config.division!==3)throw Error('Önce 2. Lig geçişi tamamlanmalı');}
  const {room,league}=buildState();
  if(test){room.budget=Math.max(room.budget,1000000);room.ap=Math.max(room.ap,10000000);for(const r of RoomRules.catalog.filter(r=>(r.division||(r.bal?2:1))<4))while(RoomRules.count(room,r.id)<RoomRules.maxLevel(room,r))room.floors[r.floor].push(r.id);}
  const entries={'idle-spiker-rooms-v2':JSON.stringify(room),'idle-spiker-league-v1':JSON.stringify(league),'idle-spiker-main-menu-v1':JSON.stringify({day:1,clicksToday:0}),'idle-spiker-match-results':JSON.stringify({version:3})};
  for(const d of document.querySelectorAll('dialog[open]'))d.close();GuidedTutorial.stop();document.querySelector('.mobile-nav a[href="#clubPanel"]').click();MenuUI.stopMotion();
  window.BalTransition.active=true;window.gameResetting=true;
  ui=GameUI.stage({host:$('clubPanel'),kind:'division',title:'Kulübün 1. Lig’e hazırlanıyor',note:'Altyapı Akademisi bu sezon kurulabilir.',onSkip(){}});
  await CardMotion.handoff(()=>{
   localStorage.setItem('idle-spiker-division-transition-v1',JSON.stringify({version:1,entries}));committing=true;
   for(const [key,value]of Object.entries(entries))localStorage.setItem(key,value);
   LeagueSeason.loadStage(league);RoomSystem.loadStage(room);MenuUI.loadStage({day:1,clicksToday:0});$('apFeedback').textContent='+'+NumberUI.compact(RoomSystem.effects().clickAP)+' AP';DivisionThree.decorate();CampSystem.refresh();TeamView.refresh();localStorage.removeItem('idle-spiker-division-transition-v1');
  });
  window.dispatchEvent(new Event('spiker-stage-changed'));refresh();return true;
 }catch(error){console.error(error);$('firstLeagueError').textContent=committing?'Geçiş kaydı korunuyor. Oyunu yeniden açarak tamamlayabilirsin.':'1. Lig’e geçilemedi. Kayıt alanını kontrol edip tekrar dene.';promotion.open();return false;}
 finally{ui?.remove();window.gameResetting=false;window.BalTransition.active=false;busy=false;}
}
window.FirstLeague={active,start,showPromotion,refresh};
addEventListener('spiker-stage-changed',()=>{decoratedDivision=null;document.body.classList.toggle('first-league',active());refresh();});
setInterval(()=>{if(!document.hidden&&!window.gameResetting)refresh();},2000);refresh();
})();
