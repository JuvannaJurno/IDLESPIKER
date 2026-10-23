(function(){
'use strict';
for(const id of ['skipStage','skipThirdStage'])document.getElementById(id)?.closest('.settings-row')?.setAttribute('hidden','');
const row=document.createElement('div');row.className='settings-row stage-test-row';
row.innerHTML='<label for="stageTestSelect">Aşamaya geç<select id="stageTestSelect"><option value="1">1 · Mahalle Spor Kulübü – Yerel Altyapı</option><option value="2">2 · Bölgesel Voleybol Ligi</option><option value="3">3 · Ulusal Voleybol 2. Ligi</option></select><small>Geçerken başlangıç veya tamamlanmış blokları seç. Takımın korunur.</small></label><button id="stageTestGo" class="team-action" type="button">Geç</button><span id="stageTestError" role="alert"></span>';
document.getElementById('settingsDialog').append(row);
const select=document.getElementById('stageTestSelect'),button=document.getElementById('stageTestGo');
select.value=String(LeagueRules.config.division===3?3:LeagueRules.config.bal?2:1);
const choice=document.createElement('dialog');choice.id='stageTestPosition';choice.innerHTML='<button type="button" class="close-dialog" aria-label="Kapat">×</button><h2>Aşamanın neresine geçelim?</h2><p>Önceki aşamaların blokları tamamlanmış gelir.</p><button type="button" class="team-action" data-position="start">Başından başla · Bloklar boş</button><button type="button" class="team-secondary" data-position="end">Sonuna geç · Bloklar tam</button><small>Sezon ilk günden açılır; bu seçim blok seviyelerini belirler.</small>';document.body.append(choice);choice.querySelector('.close-dialog').onclick=()=>choice.close();button.onclick=()=>choice.showModal();for(const option of choice.querySelectorAll('[data-position]'))option.onclick=()=>{const end=option.dataset.position==='end';choice.close();go(end);};
async function go(end){
 document.getElementById('stageTestError').textContent='';button.disabled=true;let exitAnimations=[],restoreExit=null;
 try{
  const target=Number(select.value);let prologueMarkup=null;if(target===1){const response=await fetch('index.html');if(!response.ok)throw Error('Başlangıç görselleri yüklenemedi');prologueMarkup=new DOMParser().parseFromString(await response.text(),'text/html');}if(![1,2,3].includes(target))throw Error('Geçersiz aşama');
  const profile=target>1?ClubJourney.ensureRandom():ClubJourney.profile();
  let current=RoomSystem.snapshot();const currentStage=LeagueRules.config.division===3?3:LeagueRules.config.bal?2:1;
  if(target>currentStage){if(currentStage===1){await BalTransition.start(true);while(BalTransition.active)await new Promise(requestAnimationFrame);if(!LeagueRules.config.bal)throw Error('BAL geçişi tamamlanamadı');}if(target===3){await DivisionThree.start(true);if(!DivisionThree.active())throw Error('2. Lig geçişi tamamlanamadı');}current=RoomSystem.snapshot();}
  if(target<=currentStage){restoreExit=BalVisual.capture(document.getElementById('workflow'));exitAnimations=await CardMotion.testExit();}let room;
  room=target===1?RoomRules.defaults():BalRules.enter(RoomRules.defaults(),1);
  if(current.dailyShift)room.dailyShift=JSON.parse(JSON.stringify(current.dailyShift));
  if(target===3){room.division=3;room.divisionCalendar=2;room.openDepartments=[2,4];room.mediaDepartmentOpen=end;}
  for(const card of RoomRules.catalog){const stage=card.division===3?3:card.bal?2:1;if(stage<target||end&&stage===target)room.floors[card.floor].push(...Array(RoomRules.maxLevel(room,card)).fill(card.id));}
  room.lastSeen=Date.now();
  const players=(TeamRules.players.length?TeamRules.players:TeamRules.generate().map(p=>({...p,appearance:TeamAppearance.generate()}))).map(p=>({...p,art:typeof p.art==='string'&&p.art.startsWith('team-assets/')?p.art:'team-assets/woman-0.svg'}));
  const entrants=target===3?LeagueRules.divisionEntrants().map(t=>({...t,name:t.id===0?profile?.name||LeagueRules.teams[0]:t.name})):LeagueRules.teams.map((name,id)=>({id,name:id===0?profile?.name||name:name}));
  const league={version:3,results:{},...(target>1?{mode:'bal',division:target===3?3:2,startDay:1,run:Date.now(),...(target===3?{entrants,scheduleVersion:2}:{})}:{})};
  const entries={'idle-spiker-rooms-v2':JSON.stringify(room),'idle-spiker-women-v1':JSON.stringify(players),'idle-spiker-main-menu-v1':JSON.stringify({day:1,clicksToday:0}),'idle-spiker-league-v1':JSON.stringify(league),'idle-spiker-match-results':JSON.stringify({version:3})};
  entries['idle-spiker-social-v1']=JSON.stringify({mediaBlockVersion:2,levels:target===3&&end?[5,10,5]:[0,0,0],posts:[],seen:[],likes:[],sequence:0,hype:0,earnedFollowers:0,cooldowns:{},viralUntil:0});
  if(target>1&&current.stage!=='bal')entries['idle-spiker-prologue-archive-v1']=JSON.stringify({rooms:current,players,league:JSON.parse(localStorage.getItem('idle-spiker-league-v1')||'null')});
  MenuUI.stopMotion();window.gameResetting=true;
  localStorage.setItem('idle-spiker-bal-transition-v1',JSON.stringify({version:1,entries}));
  for(const [key,value]of Object.entries(entries))localStorage.setItem(key,value);
  await CardMotion.handoff(()=>{exitAnimations.forEach(a=>a.cancel());restoreExit?.();for(const d of document.querySelectorAll('dialog[open]'))d.close();window.GuidedTutorial?.stop();LeagueSeason.loadStage(league);window.DivisionThree?.loadSocial(JSON.parse(entries['idle-spiker-social-v1']));document.body.classList.toggle('bal-stage',target>1);if(prologueMarkup){for(const tier of document.querySelectorAll('#workflow>.tier')){const original=prologueMarkup.querySelector('.tier[data-floor="'+tier.dataset.floor+'"] .base-room');tier.querySelector('.base-room').innerHTML=original.innerHTML;}}RoomSystem.loadStage(room);MenuUI.loadStage({day:1,clicksToday:0});TeamView.refresh();window.CampSystem?.refresh();if(target===3)DivisionThree.decorate();else{document.querySelector('#clubPanel .section-top .eyebrow').textContent='BİZİM KULÜP · AŞAMA '+target;document.querySelector('.stage-heading strong').textContent=target===2?'BÖLGESEL VOLEYBOL LİGİ':'Mahalle Spor Kulübü – Yerel Altyapı';}localStorage.removeItem('idle-spiker-bal-transition-v1');});window.gameResetting=false;button.disabled=false;select.value=String(target);window.dispatchEvent(new Event('spiker-stage-changed'));
 }catch(error){exitAnimations.forEach(a=>a.cancel());restoreExit?.();document.getElementById('stageTestError').textContent='Aşama değiştirilemedi. Kayıt alanını kontrol edip tekrar dene.';window.gameResetting=false;button.disabled=false;console.error(error);}
}
})();
