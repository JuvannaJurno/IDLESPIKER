(function(){
'use strict';
const $=id=>document.getElementById(id),q=s=>document.querySelector(s),visible=el=>!!el&&el.getClientRects().length>0&&el.getBoundingClientRect().width>0&&el.getBoundingClientRect().height>0;const pick=(...selectors)=>selectors.flatMap(s=>[...document.querySelectorAll(s)]).find(visible);
const row=document.createElement('div');row.className='settings-row tutorial-review-row';const label=document.createElement('span');label.textContent='Tutoriallar';const button=document.createElement('button');button.id='reviewTutorials';button.type='button';button.className='team-action';button.textContent='Sırayla göster';row.append(label,button);$('settingsDialog').querySelector('.reset-section').before(row);
const note=document.createElement('p');note.className='tutorial-review-note';note.textContent='Açık mekanikleri Devam ile gez. İşlem yapman veya üretimi beklemen gerekmez.';row.after(note);
function start(){
 if(window.MatchGateway?.active()||window.BalTransition?.active)return;
 const previous=q('.mobile-nav a[aria-current="page"]'),scroll=window.scrollY;window.GuidedTutorial.stop();$('settingsDialog').close();
 const closeDialogs=()=>{window.Scouting?.closePreview?.();document.querySelectorAll('dialog[open]').forEach(d=>d.close());},club=()=>{closeDialogs();q('.mobile-nav a[href="#clubPanel"]')?.click();},team=()=>{closeDialogs();$('teamTab').click();};
 const state=RoomSystem.tutorialState(),steps=[],add=(id,target,text,enter)=>steps.push({id:'review-'+id,target,text,enter,skip:()=>!visible(target())});
 add('instructions',()=>$('energyButton'),'Talimat ver ile departmanlarına talimat gönder.',club);
 add('ap',()=>$('roomAP'),'Antrenman Puanı (AP), oyuncularını geliştirmek için kullanılır.');
 add('training-center',()=>q('.tier[data-floor="0"] .base-room'),'Talimat sahaya ulaştığında AP üretilir.');
 add('blocks',()=>pick('#roomSlots1 .foundation-buy','#roomSlots1 .unlock-room','#roomSlots1 .upgrade-room'),'Blokları bütçeyle açar ve yükseltirsin.');
 add('team',()=>$('teamTab'),'Oyuncularını Takım menüsünden yönet.',team);
 const id=TeamView.snapshot().lineup.p||TeamRules.players[0]?.id;
 add('player',()=>q('[data-player="'+id+'"] .card-stats')||q('[data-player="'+id+'"]'),'Karttan oyuncunun özelliklerini ve gelişimini incele.');
 add('stats',()=>$('playerStats'),'Her özellik maçta farklı bir beceriyi etkiler.',()=>{TeamView.inspect(id);$('playerAttributes').open=true;});
 add('upgrade',()=>q('#trainingStats .card-upgrade-button'),'Kartı yükselt, AP harcayarak oyuncunun özelliklerini artırır. Bu gösterimde yükseltme yapmana gerek yok.');
 add('league',()=>q('#standingsPane .standings-scroll')||$('leaguePanel'),'Lig sıralamasını ve maç sonuçlarını buradan takip et.',()=>{closeDialogs();LeagueSeason.open();$('standingsTab')?.click();});
 if(state.openDepartments.includes(2)){
 add('income',()=>q('.tier[data-floor="2"] .base-room'),'Gelir Merkezi, talimatlarla bütçe kazandırır.',club);
 add('budget',()=>$('roomBudget'),'Kazandığın bütçe bu sayaca eklenir.');
 }
 if(ScoutRules.available(RoomSystem.scoutView())){
 add('transfer',()=>$('scoutAlert'),'Oyuncu Merkezi, kadronu güçlendirebilecek adayları gösterir.',team);
 add('catalog',()=>$('transferHome'),'Buradan mevcut kataloğunu inceleyebilir veya zamanı gelince yeni kataloğu açabilirsin.',()=>Scouting.open({preview:true}));
 if(!Scouting.hasUnopenedCatalog()&&RoomSystem.scoutView().scouting.catalog.some(c=>!c.hired)){
 add('candidate',()=>q('#scoutCatalog .valuable-candidate')||q('#scoutCatalog .scout-player'),'Yukarı ok, aynı pozisyondaki oyuncundan daha yüksek OVR anlamına gelir.',()=>$('homeCurrentCatalog').click());
 add('comparison',()=>q('#transferCompareContent .scout-versus'),'Adayı kendi oyuncunla yan yana karşılaştır.',()=>q('#scoutCatalog .scout-compare')?.click());
 }
 }
 if(CampRules.available(RoomSystem.developmentState())&&RoomSystem.developmentState().camp.announcedDay!==null){
 add('camp',()=>q('.camp-overview'),'Kamp süresi ve katılım bilgilerini burada incele.',()=>{closeDialogs();CampSystem.open(true);});
 add('camp-players',()=>$('campCandidates'),'Kampa göndermek istediğin en fazla 6 oyuncuyu seç.');
 }
 if(Number(LeagueRules.config.division)===3&&RoomSystem.mediaDepartmentOpen()){
 add('social',()=>$('socialDraft'),'Kulübünün gönderileri burada hazırlanır.',()=>{closeDialogs();$('socialTab').click();});
 add('publish',()=>$('socialPublish'),'Gönderiler arka planda hazırlanır. Video sırası açıldıysa eklediğin videolar sırayla otomatik paylaşılır; bu rehberde beklemene gerek yok.');
 add('followers',()=>$('socialTopFollowers'),'Takipçilerin burada görünür. Paylaşımlarla topluluğunu büyüt.');
 add('rewards',()=>$('socialJourneyEntry'),'Takipçi hedeflerine ulaşarak topluluk ödüllerini aç.');
 }
 GuidedTutorial.start(steps,()=>{closeDialogs();previous?.click();window.scrollTo({top:scroll,behavior:'instant'});$('settingsDialog').showModal();button.focus({preventScroll:true});},'settings-review',{review:true});
}
button.onclick=start;
window.TutorialReview={start};
})();
