(function(){
'use strict';
const KEY='idle-spiker-achievements-v1';let saved={};try{const raw=JSON.parse(localStorage.getItem(KEY));if(raw&&typeof raw==='object'&&!Array.isArray(raw))saved=raw;}catch{}
const definitions=[
 ['followers-250','İlk topluluğumuz','Kulüp hesabında 250 takipçiye ulaş.',250,()=>{try{return 100+(Number(JSON.parse(localStorage.getItem('idle-spiker-social-v1'))?.earnedFollowers)||0)}catch{return 0}}],
 ['instructions-1','İlk talimat','Bir aşamada 1 talimat ver.',1,m=>m.instructions],
 ['instructions-25','Kulüp canlanıyor','Bir aşamada 25 talimata ulaş.',25,m=>m.instructions],
 ['instructions-100','Hareket başladı','Bir aşamada 100 talimata ulaş.',100,m=>m.instructions],
 ['instructions-250','Ritim yakalandı','Bir aşamada 250 talimata ulaş.',250,m=>m.instructions],
 ['instructions-500','Düzenli çalışma','Bir aşamada 500 talimata ulaş.',500,m=>m.instructions],
 ['instructions-1000','İşleyen kulüp','Bir aşamada 1.000 talimata ulaş.',1000,m=>m.instructions],
 ['instructions-10000','Durmak yok','Bir aşamada 10.000 talimata ulaş.',10000,m=>m.instructions],
 ['assistant','Yardım eli','İlk asistan bloğunu kur.',1,m=>m.assistant],
 ['upgrade','İlk gelişim','Bir oyuncunun kartını yükselt.',2,m=>m.level],
 ['level-3','İlk fark','Bir oyuncuyu 3. kart seviyesine getir.',3,m=>m.level],
 ['level-5','Gelişim gözle görülüyor','Bir oyuncuyu 5. kart seviyesine getir.',5,m=>m.level],
 ['level-10','Emek karşılığını buldu','Bir oyuncuyu 10. kart seviyesine getir.',10,m=>m.level],
 ['match','Sahne bizim','Bir lig maçını tamamla.',1,m=>m.played],
 ['matches-3','Sahaya alıştık','Üç lig maçını tamamla.',3,m=>m.played],
 ['win','İlk zafer','Bir lig maçı kazan.',1,m=>m.wins],
 ['wins-3','Takım oluyoruz','Üç lig maçı kazan.',3,m=>m.wins],
 ['prolog','Yeni bir sayfa','Prologu tamamla.',1,m=>m.prolog],
 ['bal','Daha büyük hedefler','BAL aşamasına geç.',1,m=>m.bal],
 ['transfer','Yeni yüz','Bir oyuncu transfer et.',1,m=>m.transfers],
 ['camp','Kampa hazır','Bir oyuncuyu antrenman kampına gönder.',1,m=>m.camps],
 ['camp-return','Daha ileri','Bir oyuncunun kampını tamamla.',1,m=>m.returns]
];
const regionalDefinitions=[
 ['bal-instructions-25000','Bölgesel ritim','Bölgesel Lig’de 25.000 talimata ulaş.',25000,m=>m.regional.instructions],
 ['bal-instructions-50000','Sezon boyu emek','Bölgesel Lig’de 50.000 talimata ulaş.',50000,m=>m.regional.instructions],
 ['bal-blocks-8','Kulübün dalları','8 farklı Bölgesel Lig bloğu kur.',8,m=>m.regional.blocks],
 ['bal-primary-5','Sağlam temeller','5 Bölgesel Lig bloğunun ana özelliğini tamamla.',5,m=>m.regional.primary],
 ['bal-bonus-1','İkinci bir güç','Bir Bölgesel Lig bloğunun ek özelliğini aç.',1,m=>m.regional.bonuses],
 ['bal-bonus-4','Birbirini tamamlayan işler','4 farklı Bölgesel Lig bloğunun ek özelliğini aç.',4,m=>m.regional.bonuses],
 ['bal-masters-3','İnce işçilik','3 Bölgesel Lig bloğunu 10. seviyeye getir.',3,m=>m.regional.masters],
 ['bal-shift-5','Tam vardiya','Vardiya Koordinasyonu’nun ana özelliğini tamamlayıp 30 dakikalık vardiyaya ulaş.',5,m=>m.regional.shift],
 ['bal-transfers-3','Yeni bir kadro','Bölgesel Lig’de 3 transfer oyuncusunu kadrona kat.',3,m=>m.regional.transfers],
 ['bal-camps-6','Kamp kafilesi','Bölgesel Lig’de toplam 6 oyuncu kampı başlat.',6,m=>m.regional.camps],
 ['bal-returns-3','Güçlenerek döndük','Bölgesel Lig’de 3 oyuncu kampını tamamla.',3,m=>m.regional.returns],
 ['bal-return-players-6','Herkese bir fırsat','Bölgesel Lig’de 6 farklı oyuncunun kampını tamamla.',6,m=>m.regional.returnPlayers],
 ['bal-repeat-camp','Gelişimin devamı','Bölgesel Lig’de aynı oyuncunun 2 kampını tamamla.',2,m=>m.regional.repeatCamp],
 ['bal-half-season','Sezonun yarısı','Bölgesel Lig’de 7 maç tamamla.',7,m=>m.regional.played],
 ['bal-wins-7','Ligde söz sahibiyiz','Bölgesel Lig’de 7 maç kazan.',7,m=>m.regional.wins],
 ['bal-clean-win','Eksiksiz maç','Bölgesel Lig’de rakibe sayı vermeden bir maç kazan.',1,m=>m.regional.cleanWins]
];
definitions.push(...regionalDefinitions);const regionalIds=new Set(regionalDefinitions.map(d=>d[0]));let achievementFilter='all',archiveRaw=null,archiveMetrics=null;
function regionalMetrics(s,own){if(s.stage==='bal'&&(s.division||1)<3)return AchievementStageMetrics.collect(s,Object.fromEntries(own.map(f=>[f.id,LeagueSeason.score(f)])));if(s.stage==='bal'&&s.division>=3){try{const raw=localStorage.getItem('idle-spiker-bal-archive-v1');if(raw!==archiveRaw){archiveRaw=raw;archiveMetrics=null;const a=JSON.parse(raw);archiveMetrics=AchievementStageMetrics.collect(a?.rooms,a?.league?.results);}return archiveMetrics||AchievementStageMetrics.collect(null);}catch{}}return AchievementStageMetrics.collect(null);}
const trophy='<svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="M7 3h10v6a5 5 0 0 1-10 0V3Z" stroke="currentColor" stroke-width="1.8"/><path d="M7 5H3v3c0 3 2 5 5 5m9-8h4v3c0 3-2 5-5 5M12 14v5m-4 2h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';
const settings=document.getElementById('settingsButton'),actions=document.createElement('div');actions.className='topbar-actions';settings.before(actions);actions.append(settings);const profile=document.getElementById('profileButton');if(profile)actions.append(profile);
const button=document.createElement('button');button.type='button';button.id='achievementsButton';button.className='achievements-button';button.setAttribute('aria-label','Başarımları aç');button.title='Başarımlar';button.innerHTML=trophy;actions.prepend(button);
const dialog=document.createElement('dialog');dialog.id='achievementsDialog';dialog.setAttribute('aria-labelledby','achievementsTitle');dialog.innerHTML='<header class="achievements-header"><button class="close-dialog" type="button" aria-label="Başarımları kapat">×</button><span class="eyebrow">KULÜBÜN HİKÂYESİ</span><h2 id="achievementsTitle">Başarımlar</h2></header><div class="achievements-scroll"><p class="achievements-summary"></p><div class="achievements-list"></div></div>';document.body.append(dialog);
const filters=document.createElement('nav');filters.className='achievement-filters';filters.setAttribute('aria-label','Başarım grubu');for(const [value,label]of [['all','Tümü'],['general','Genel'],['regional','Bölgesel Lig']]){const tab=document.createElement('button');tab.type='button';tab.dataset.achievementFilter=value;tab.textContent=label;tab.onclick=()=>{achievementFilter=value;selectedId=null;render();};filters.append(tab);}dialog.querySelector('.achievements-list').before(filters);
dialog.querySelector('button').onclick=()=>dialog.close();dialog.addEventListener('close',()=>button.focus({preventScroll:true}));
const notice=document.createElement('div');notice.className='achievement-notice';notice.setAttribute('role','status');notice.setAttribute('aria-live','polite');notice.setAttribute('popover','manual');notice.innerHTML='<button type="button" class="achievement-notice-open"><span class="achievement-notice-icon">'+trophy+'</span><span><small>BAŞARIM TAMAMLANDI</small><strong></strong></span></button>';document.body.append(notice);const noticeQueue=[];let showingNotice=false,currentNotice=null,noticeTimer=null,hideTimer=null,selectedId=null;
function showNextNotice(){if(showingNotice||dialog.open||!noticeQueue.length||document.hidden)return;showingNotice=true;currentNotice=noticeQueue.shift();notice.querySelector('strong').textContent=currentNotice.title;notice.querySelector('button').setAttribute('aria-label',currentNotice.title+' başarımını göster');if(notice.showPopover)notice.showPopover();notice.classList.remove('visible');void notice.offsetWidth;notice.classList.add('visible');window.GameAudio?.achievement?.();noticeTimer=setTimeout(()=>{notice.classList.remove('visible');hideTimer=setTimeout(()=>{if(notice.hidePopover)notice.hidePopover();showingNotice=false;currentNotice=null;showNextNotice();},350);},3200);}
let dragNotice=null,suppressNoticeClick=false;
function dismissNotice(direction=0){clearTimeout(noticeTimer);clearTimeout(hideTimer);notice.classList.remove('visible');if(direction){notice.style.translate=direction*(notice.offsetWidth+40)+'px 0';notice.style.opacity='0';}hideTimer=setTimeout(()=>{if(notice.hidePopover)notice.hidePopover();notice.style.removeProperty('translate');notice.style.removeProperty('opacity');showingNotice=false;currentNotice=null;showNextNotice();},matchMedia('(prefers-reduced-motion: reduce)').matches?0:220);}
notice.addEventListener('pointerdown',e=>{if(!showingNotice||!e.isPrimary||e.button!==0)return;dragNotice={id:e.pointerId,x:e.clientX,y:e.clientY,dx:0,active:false};suppressNoticeClick=false;});
notice.addEventListener('pointermove',e=>{const d=dragNotice;if(!d||d.id!==e.pointerId)return;d.dx=e.clientX-d.x;if(!d.active){if(Math.abs(d.dx)<8)return;if(Math.abs(e.clientY-d.y)>Math.abs(d.dx)){dragNotice=null;return;}d.active=true;notice.setPointerCapture(e.pointerId);clearTimeout(noticeTimer);notice.classList.add('is-dragging');}notice.style.translate=d.dx+'px 0';notice.style.opacity=String(Math.max(.25,1-Math.abs(d.dx)/notice.offsetWidth));});
function finishNoticeDrag(e){const d=dragNotice;if(!d||d.id!==e.pointerId)return;dragNotice=null;notice.classList.remove('is-dragging');if(!d.active)return;suppressNoticeClick=true;if(notice.hasPointerCapture(e.pointerId))notice.releasePointerCapture(e.pointerId);if(e.type!=='pointercancel'&&Math.abs(d.dx)>=Math.min(80,notice.offsetWidth*.25))dismissNotice(Math.sign(d.dx));else{notice.style.removeProperty('translate');notice.style.removeProperty('opacity');noticeTimer=setTimeout(()=>dismissNotice(),3200);}setTimeout(()=>{suppressNoticeClick=false},0);}
notice.addEventListener('pointerup',finishNoticeDrag);notice.addEventListener('pointercancel',finishNoticeDrag);
notice.addEventListener('click',e=>{if(suppressNoticeClick){e.preventDefault();e.stopImmediatePropagation();}},true);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)showNextNotice()});
function metrics(){const s=RoomSystem.snapshot(),progress=LeagueSeason.progress();const own=LeagueRules.schedule().filter(m=>m.ours);return {
 regional:regionalMetrics(s,own),instructions:s.instructions||0,assistant:Number((s.floors||[]).some(row=>row.includes('assistant')||row.includes('bal_coach'))),level:Math.max(1,...TeamRules.players.map(p=>TeamRules.cardLevel(p))),
 played:progress.played,wins:own.filter(m=>{const score=LeagueSeason.score(m);return score&&(m.home===0?score[0]>score[1]:score[1]>score[0]);}).length,
 prolog:Number(s.stage==='bal'||!LeagueRules.config.bal&&progress.prologueComplete),bal:Number(s.stage==='bal'),transfers:s.scouting?.recruits?.length||0,camps:s.camp?.entries?.length||0,returns:s.camp?.entries?.filter(e=>e.status==='complete').length||0
};}
function render(){const count=definitions.filter(([id])=>saved[id]?.unlocked).length;dialog.querySelector('.achievements-summary').textContent=count+' / '+definitions.length+' başarım tamamlandı';
 filters.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.achievementFilter===achievementFilter)));
 dialog.querySelector('.achievements-list').replaceChildren(...definitions.filter(([id])=>achievementFilter==='all'||(achievementFilter==='regional'?regionalIds.has(id):!regionalIds.has(id))).map(([id,title,description,target])=>{const data=saved[id]||{},card=document.createElement('article');card.className='achievement-card';card.dataset.achievement=id;card.dataset.group=regionalIds.has(id)?'regional':'general';card.tabIndex=-1;card.classList.toggle('achievement-target',id===selectedId);card.dataset.unlocked=String(!!data.unlocked);const icon=document.createElement('span');icon.className='achievement-icon';icon.innerHTML=trophy;const copy=document.createElement('div'),heading=document.createElement('h3'),text=document.createElement('p'),status=document.createElement('small');heading.textContent=title;text.textContent=description;status.textContent=data.unlocked?'✓ Tamamlandı':Math.min(target,data.value||0).toLocaleString('tr-TR')+' / '+target.toLocaleString('tr-TR');copy.append(heading,text,status);if(!data.unlocked){const bar=document.createElement('progress');bar.max=target;bar.value=Math.min(target,data.value||0);bar.setAttribute('aria-label',title);copy.append(bar);}card.append(icon,copy);return card;}));}
function check(silent=false){if(window.gameResetting||document.hidden)return;const m=metrics(),newItems=[];let changed=false;
 for(const [id,title,,target,get]of definitions){const old=saved[id]||{},value=Math.min(target,Math.max(Number(old.value)||0,get(m)));const unlocked=!!old.unlocked||value>=target;if(old.value!==value||!!old.unlocked!==unlocked){saved[id]={value,unlocked};changed=true;if(unlocked&&!old.unlocked)newItems.push({id,title});}}
 if(changed){try{localStorage.setItem(KEY,JSON.stringify(saved));}catch{}if(dialog.open)render();}
 if(newItems.length&&!silent){noticeQueue.push(...newItems);showNextNotice();}
}
function openAchievement(id=null){const scroll=dialog.querySelector('.achievements-scroll');if(id)achievementFilter=regionalIds.has(id)?'regional':'general';selectedId=id;check(true);render();if(!dialog.open)dialog.showModal();if(!id){scroll.scrollTop=0;return;}requestAnimationFrame(()=>{const card=[...dialog.querySelectorAll('.achievement-card')].find(c=>c.dataset.achievement===id);if(!card)return;card.focus({preventScroll:true});scroll.scrollTo({top:Math.max(0,scroll.scrollTop+card.getBoundingClientRect().top-scroll.getBoundingClientRect().top-scroll.clientHeight/2+card.clientHeight/2),behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});});}
button.onclick=()=>openAchievement();
notice.querySelector('button').onclick=()=>{if(!currentNotice)return;const id=currentNotice.id;clearTimeout(noticeTimer);clearTimeout(hideTimer);notice.classList.remove('visible');if(notice.hidePopover)notice.hidePopover();showingNotice=false;currentNotice=null;openAchievement(id);};
dialog.addEventListener('close',()=>{selectedId=null;showNextNotice();});
check(true);setInterval(()=>check(),2000);window.addEventListener('spiker-stage-changed',()=>check());
})();
