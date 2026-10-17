(function(){
'use strict';
for(const id of ['skipStage','skipThirdStage'])document.getElementById(id)?.closest('.settings-row')?.setAttribute('hidden','');
const row=document.createElement('div');row.className='settings-row stage-test-row';
row.innerHTML='<label for="stageTestSelect">Aşamaya geç<select id="stageTestSelect"><option value="1">1 · Mahalle (Prolog)</option><option value="2">2 · BAL</option><option value="3">3 · Türkiye Voleybol 2. Ligi</option></select><small>Önceki aşamaların kartları tamamlanır, seçilen aşamanın kartları sıfırlanır. Takımın korunur; yoksa rastgele oluşturulur.</small></label><button id="stageTestGo" class="team-action" type="button">Geç</button><span id="stageTestError" role="alert"></span>';
document.getElementById('settingsDialog').append(row);
const select=document.getElementById('stageTestSelect'),button=document.getElementById('stageTestGo');
select.value=String(LeagueRules.config.division===3?3:LeagueRules.config.bal?2:1);
button.onclick=async()=>{
 button.disabled=true;let exitAnimations=[],restoreExit=null;
 try{
  const target=Number(select.value);if(![1,2,3].includes(target))throw Error('Geçersiz aşama');
  const profile=target>1?ClubJourney.ensureRandom():ClubJourney.profile();
  let current=RoomSystem.snapshot();const currentStage=LeagueRules.config.division===3?3:LeagueRules.config.bal?2:1;
  if(target>currentStage){if(currentStage===1){await BalTransition.start(true);if(!LeagueRules.config.bal)throw Error('BAL geçişi tamamlanamadı');}if(target===3){await DivisionThree.start(true);if(!DivisionThree.active())throw Error('2. Lig geçişi tamamlanamadı');}current=RoomSystem.snapshot();}
  if(target<=currentStage){restoreExit=BalVisual.capture(document.getElementById('workflow'));exitAnimations=await CardMotion.testExit();}let room;
  if(target===1){const archive=JSON.parse(localStorage.getItem('idle-spiker-prologue-archive-v1')||'null');room=RoomRules.normalize(archive?.rooms||RoomRules.defaults());}
  else room=current.stage==='bal'?RoomRules.normalize(current):BalRules.enter(current,1);
  if(target===3)room.division=3;else delete room.division;
  room.floors=Array.from({length:5},()=>[]);
  for(const card of RoomRules.catalog)if(target===3||target===2&&!card.bal)room.floors[card.floor].push(...Array(card.values.length).fill(card.id));
  room.instructions=0;room.dayProgress=0;room.trainingProgress=0;room.incomeProgress=0;room.pendingGains=[];room.lastSeen=Date.now();room.matchRewards=[];room.attendanceRewards=[];room.socialReceipts=[];
  delete room.offlineMatchId;delete room.offlineCalendar;
  room.balStart=0;room.balStartDay=1;
  room.camp.lastDay=1;room.camp.announcedDay=null;room.camp.opensDay=null;
  room.camp.entries=room.camp.entries.map(e=>e.status==='complete'?e:{...e,startDay:1,endDay:4});
  room.scouting.startedDay=1;
  if(target===3)room.openDepartments=[2,4];
  const players=TeamRules.players.length?TeamRules.players:TeamRules.generate().map(p=>({...p,appearance:TeamAppearance.generate()}));
  const entrants=(target===3?['','Ankara File','İzmir Gençlik','Bursa Akademi','İstanbul Voleybol','Antalya Yıldızları','Bursa Spor','Karadeniz Gücü']:LeagueRules.teams).map((name,id)=>({id,name:id===0?profile?.name||name:name}));
  const league={version:3,results:{},...(target>1?{mode:'bal',division:target===3?3:2,startDay:1,run:Date.now(),...(target===3?{entrants,scheduleVersion:2}:{})}:{})};
  const entries={'idle-spiker-rooms-v2':JSON.stringify(room),'idle-spiker-women-v1':JSON.stringify(players),'idle-spiker-main-menu-v1':JSON.stringify({day:1,clicksToday:0}),'idle-spiker-league-v1':JSON.stringify(league),'idle-spiker-match-results':JSON.stringify({version:3})};
  if(target===3){const social=JSON.parse(localStorage.getItem('idle-spiker-social-v1')||'null');if(social){social.levels=[0,0,0];if(social.studio){social.studio.lastDay=1;social.studio.nextAmbient=Date.now()+10000;}entries['idle-spiker-social-v1']=JSON.stringify(social);}}
  if(target>1&&current.stage!=='bal')entries['idle-spiker-prologue-archive-v1']=JSON.stringify({rooms:current,players,league:JSON.parse(localStorage.getItem('idle-spiker-league-v1')||'null')});
  MenuUI.stopMotion();window.gameResetting=true;
  localStorage.setItem('idle-spiker-bal-transition-v1',JSON.stringify({version:1,entries}));
  for(const [key,value]of Object.entries(entries))localStorage.setItem(key,value);
  localStorage.removeItem('idle-spiker-bal-transition-v1');location.reload();
 }catch(error){exitAnimations.forEach(a=>a.cancel());restoreExit?.();document.getElementById('stageTestError').textContent='Aşama değiştirilemedi. Kayıt alanını kontrol edip tekrar dene.';window.gameResetting=false;button.disabled=false;console.error(error);}
};
})();
