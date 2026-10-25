(function(){
'use strict';if(window.AcademyPreview)return;
const R=AcademyCareerRules,$=id=>document.getElementById(id),escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const state=()=>RoomSystem.snapshot(),portrait=p=>TeamAppearance.valid(p.appearance)?TeamAppearance.portrait(p.appearance):p.art;
const names={spike:'Smaç',block:'Blok',serve:'Servis',receive:'Manşet',set:'Pas',stamina:'Dayanıklılık',mental:'Mental'};
const duration=ms=>{const s=Math.max(0,Math.ceil(ms/1000));return s>=3600?Math.floor(s/3600)+' sa '+Math.floor(s%3600/60)+' dk':Math.floor(s/60)+':'+String(s%60).padStart(2,'0');};
const skillName=id=>PlayerSkills.catalog.find(s=>s.id===id)?.name||id;
let selected=null,signature='',decision=null,lastEntryFocus=null,sceneVisible=false,autoConversation=false,conversationContext=null,replyTimer=null;
const conversationSeenKey='idle-spiker-academy-conversations-v1',seenConversations=new Set();
try{const saved=JSON.parse(localStorage.getItem(conversationSeenKey)||'[]');if(Array.isArray(saved))saved.filter(k=>/^academy-\d+:(direction|skill)$/.test(k)).slice(-512).forEach(k=>seenConversations.add(k));}catch{}
const entry=document.createElement('button');entry.id='academyEntry';entry.type='button';entry.className='scout-alert academy-entry';entry.hidden=true;entry.innerHTML='<span class="academy-entry-portraits" aria-hidden="true"></span><span class="transfer-entry-copy"><span class="transfer-entry-kicker">KENDİ OYUNCUNU YETİŞTİR</span><strong>Altyapı Akademisi</strong><small></small></span><span class="transfer-entry-arrow" aria-hidden="true">›</span>';$('scoutAlert').after(entry);
const facility=document.createElement('section');facility.id='academyFacility';facility.className='academy-facility';facility.hidden=true;facility.innerHTML='<div><span class="eyebrow">1. LİG · ALTYAPI</span><h3>Altyapı Akademisi</h3><p></p></div><button class="team-action" id="academyFacilityAction" type="button"></button><small id="academyFacilityNotice" role="status"></small>';
document.getElementById('workflow').closest('.building-scroll').before(facility);
const screen=GameUI.selection({id:'academyCareer',title:'Altyapı Akademisi',eyebrow:'GENÇLERİN SAHASI',returnFocus:'academyEntry',statusId:'academyCareerStatus',content:'<section class="academy-stage"><iframe id="academyCareerFrame" title="Gençlerin canlı antrenman salonu"></iframe><div id="academyCareerPlayers" class="academy-career-players"></div></section><div id="academyCareerStudent"></div>'});
screen.dialog.querySelector('footer span').textContent='Eğitim çevrimdışı da devam eder.';
const transfer=GameUI.selection({id:'academyTransferChoice',title:'Bu oyuncunun geleceği',eyebrow:'TRANSFER KARARI',returnFocus:'scoutAlert',statusId:'academyTransferNotice',content:'<div id="academyTransferPlayer"></div><div id="academyTransferSummary"></div><div class="academy-transfer-actions"><button id="academyImmediate" class="team-action" type="button">A takıma transfer et</button><button id="academyEnrollLive" class="team-secondary" type="button">Akademiye transfer et</button></div>'});
transfer.dialog.querySelector('footer span').textContent='İki seçenekte de aynı transfer bedeli ödenir.';
const transferFooter=transfer.dialog.querySelector('footer');transferFooter.querySelector('.team-action').remove();transferFooter.prepend($('academyImmediate'),$('academyEnrollLive'));transfer.dialog.querySelector('.academy-transfer-actions').remove();
$('academyTransferPlayer').before($('academyTransferSummary'));
const detail=GameUI.selection({id:'academyCareerPlayer',title:'Oyuncu dosyası',eyebrow:'ALTYAPI AKADEMİSİ',content:'<div id="academyCareerCard"></div><div id="academyCareerOutcome"></div><button id="academyGraduateLive" class="team-action" type="button">A takıma al</button>',returnFocus:'academyInspectLive',statusId:'academyGraduateNotice'});
detail.dialog.querySelector('footer span').textContent='';let reviewing=null;
const conversation=GameUI.selection({id:'academyConversation',title:'Birlikte çalışalım',eyebrow:'ANTRENMAN ARASI',returnFocus:'academyTalk',statusId:'academyConversationStatus',content:'<div class="academy-conversation-speaker"><img id="academyConversationPortrait" alt=""><div><strong id="academyConversationName"></strong><small id="academyConversationRole"></small></div></div><p id="academyConversationQuestion"></p><div id="academyConversationOptions"></div><p id="academyConversationNote"></p>'});
conversation.dialog.setAttribute('aria-describedby','academyConversationQuestion');
const later=conversation.dialog.querySelector('footer button');later.className='team-secondary';later.textContent='Sonra konuşalım';$('academyConversationStatus').textContent='';
function needsDecision(e){const phase=R.phase(e);return phase==='direction'&&!e.directionChosen||phase==='skill'&&!e.skillChosen;}
function rememberConversation(key){seenConversations.add(key);try{localStorage.setItem(conversationSeenKey,JSON.stringify([...seenConversations].slice(-512)));}catch{}}
function talk(id){
 const e=state().academy.entries.find(e=>e.id===id);if(!screen.dialog.open||!e||!['direction','skill'].includes(R.phase(e)))return false;
 if(detail.dialog.open||transfer.dialog.open||GuidedTutorial.active)return false;
 const phase=R.phase(e),path=R.plans(e.player).find(p=>p.id===e.path);autoConversation=false;selected=id;render();clearTimeout(replyTimer);conversationContext={id,phase};conversation.dialog.style.removeProperty('min-height');
 $('academyConversationPortrait').src=portrait(e.player);$('academyConversationName').textContent=e.player.name+' '+e.player.surname;$('academyConversationRole').textContent=TeamRules.roles[e.player.role];
 $('academyConversationQuestion').textContent=phase==='direction'?'Hocam, hangi yönümü geliştireyim?':'Hocam, bugün hangi yeteneği çalışayım?';
 $('academyConversationNote').textContent=phase==='direction'?'Seçmezsen '+path.name.toLocaleLowerCase('tr')+' yönünde devam eder.':'Seçtiğin yeteneği mezuniyette kazanır. Elit potansiyeli kamp koşuluyla açılır.';
 $('academyConversationStatus').textContent='';conversation.dialog.dataset.state='question';const options=$('academyConversationOptions');options.replaceChildren();
 const choices=phase==='direction'?R.plans(e.player).map(p=>({id:p.id,name:p.name,copy:names[p.primary]+' +12 · '+names[p.secondary]+' +5',active:e.path===p.id})):R.skills(e).map(s=>({id:s.id,name:skillName(s.skill),copy:'Elit olursa: '+skillName(s.legendary)+' potansiyeli',active:e.skillChoice===s.id}));
 for(const choice of choices){const b=document.createElement('button');b.type='button';b.className='team-secondary';b.dataset.academyAnswer=choice.id;b.setAttribute('aria-pressed',String(choice.active));const name=document.createElement('strong'),copy=document.createElement('small');name.textContent=choice.name;copy.textContent=choice.copy;b.append(name,copy);b.onclick=()=>answer(choice.id);options.append(b);}
 rememberConversation(id+':'+phase);conversation.open();syncScene();if(!CardMotion.reduced())conversation.dialog.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:220,easing:CardMotion.ease});return true;
}
function answer(value){
 const context=conversationContext;if(!context||conversation.dialog.dataset.state==='reply')return;
 if(!RoomSystem.academyChoose(context.id,context.phase,value)){$('academyConversationStatus').textContent='Seçim kaydedilemedi veya bu çalışma aşaması tamamlandı.';return;}
 GameAudio?.uiClick?.();const beforeHeight=conversation.dialog.getBoundingClientRect().height;conversation.dialog.dataset.state='reply';$('academyConversationQuestion').setAttribute('aria-live','polite');$('academyConversationQuestion').textContent='Tamam hocam, buna çalışacağım!';$('academyConversationOptions').replaceChildren();$('academyConversationNote').textContent='';
 if(!CardMotion.reduced()){const afterHeight=conversation.dialog.getBoundingClientRect().height;conversation.dialog.animate([{height:beforeHeight+'px'},{height:afterHeight+'px'}],{duration:220,easing:CardMotion.ease});}
 replyTimer=setTimeout(async()=>{if(!conversation.dialog.open||conversationContext!==context)return;if(!CardMotion.reduced())await conversation.dialog.animate([{opacity:1,transform:'none'},{opacity:0,transform:'translateY(5px)'}],{duration:160,easing:CardMotion.ease}).finished.catch(()=>{});if(conversation.dialog.open&&conversationContext===context)conversation.close();},1100);
}
function maybeTalk(){
 if(!autoConversation||!screen.dialog.open||document.hidden||GuidedTutorial.active||detail.dialog.open||transfer.dialog.open||conversation.dialog.open)return;
 const entries=state().academy.entries,e=entries.find(e=>needsDecision(e)&&!seenConversations.has(e.id+':'+R.phase(e)));
 autoConversation=false;if(e)talk(e.id);
}
conversation.dialog.addEventListener('close',()=>{clearTimeout(replyTimer);conversationContext=null;syncScene();});
const coaches=[.28,.72].map((seed,i)=>{const appearance=TeamAppearance.generate(()=>seed,{country:CountryRules.current()});appearance.palette.shirt=i?'#7b8f89':'#476c66';return {id:'academy-coach-'+i,name:i?'Yardımcı antrenör':'Antrenör',surname:'',role:'setter',appearance};});
function card(p){const node=TeamView.transferCard({...p,art:portrait(p)});node.querySelectorAll('button').forEach(b=>b.remove());node.classList.add('academy-real-card');return node;}
function refreshEntry(){
 const s=state(),visible=s.division===4;entry.hidden=facility.hidden=!visible;if(!visible)return;
 const anchor=document.querySelector('#clubPanel .building-header')||$('workflow').closest('.building-scroll');if(anchor&&anchor.previousElementSibling!==facility)anchor.before(facility);
 const open=R.unlocked(s),entries=s.academy.entries,ready=entries.filter(e=>R.phase(e)==='ready'),choice=entries.find(e=>R.phase(e)==='direction'&&!e.directionChosen||R.phase(e)==='skill'&&!e.skillChosen);
 const text=!open?'Kulüpten akademiyi kur':ready.length?ready.length+' mezun A takıma hazır':choice?'Gelişim seçimi hazır':entries.length?entries.length+' genç yetişiyor':'Transferden ilk gencini seç';
 const small=entry.querySelector('small');if(small.textContent!==text)small.textContent=text;
 entry.dataset.ready=String(!!ready.length||!!choice);const portraits=entry.querySelector('.academy-entry-portraits'),key=entries.slice(0,2).map(e=>e.id).join('|');if(portraits.dataset.entries!==key){portraits.dataset.entries=key;portraits.replaceChildren(...entries.slice(0,2).map(e=>{const img=new Image();img.src=portrait(e.player);img.alt='';return img;}));}if(!entries.length&&!portraits.childElementCount)portraits.textContent='+';
 const ftext=facility.querySelector('p'),copy=open?entries.length+' / '+R.capacity(s)+' genç yetişiyor':'Gençleri yetiştir, gelişimlerini yönlendir.';if(ftext.textContent!==copy)ftext.textContent=copy;
 const action=$('academyFacilityAction'),label=open?'Akademiyi aç':'Akademiyi kur · '+NumberUI.compact(RoomRules.cost(s,0,'first_academy'))+' bütçe';if(action.textContent!==label)action.textContent=label;action.disabled=!open&&s.budget<RoomRules.cost(s,0,'first_academy');
}
function syncScene(){
 const s=state(),frame=$('academyCareerFrame');if(!frame?.contentWindow||!frame.getAttribute('src'))return;
 const entries=s.academy.entries.map(e=>({id:e.id,player:e.player,program:R.plans(e.player).find(p=>p.id===e.path).primary==='receive'?'secondary':'primary'})),court={...PlayerProfile.courtOptions(),badge:ClubJourney.matchBadge(0),colors:ClubJourney.matchColors(0),name:ClubJourney.profile()?.name||LeagueRules.teams[0]},ball=PlayerProfile.ballOptions();
 frame.contentWindow.postMessage({type:'academy-training',entries:entries.slice(0,2),crowd:entries.slice(2),coaches,court,ballChoice:{id:ball.id,src:ball.data||ball.src},selected,active:screen.dialog.open&&sceneVisible&&!detail.dialog.open&&!conversation.dialog.open&&!document.hidden,dark:document.documentElement.dataset.theme==='dark'},'*');
}
function render(force=false){
 refreshEntry();if(!screen.dialog.open)return;const s=state(),entries=s.academy.entries;
 if(!entries.some(e=>e.id===selected))selected=entries[0]?.id||null;
 const key=JSON.stringify([selected,entries.map(e=>[e.id,e.path,e.directionChosen,e.skillChoice,e.skillChosen,R.phase(e)])]);
 if(!force&&signature===key){tick();return;}signature=key;
 const strip=$('academyCareerPlayers');strip.replaceChildren(...entries.map(e=>{const b=document.createElement('button');b.type='button';b.dataset.student=e.id;b.setAttribute('aria-pressed',String(e.id===selected));const img=new Image();img.src=portrait(e.player);img.alt='';const word=document.createElement('span');word.textContent=e.player.name;b.append(img,word);if(needsDecision(e)){const badge=document.createElement('span');badge.className='academy-conversation-badge';badge.textContent='…';badge.setAttribute('aria-hidden','true');b.append(badge);b.setAttribute('aria-label',e.player.name+' · Sana bir sorusu var');}b.onclick=()=>{selected=e.id;render();if(needsDecision(e))talk(e.id);};return b;}));
 if(entries.length<R.capacity(s)){const add=document.createElement('button');add.type='button';add.className='academy-add-young';add.textContent='+ Genç bul';add.onclick=findYouth;strip.append(add);}
 const host=$('academyCareerStudent');host.replaceChildren();const e=entries.find(x=>x.id===selected);
 if(!e){host.innerHTML='<div class="academy-career-empty"><strong>İlk genç oyuncunu keşfet.</strong><p>Transferde genç bir adayı akademiye al. Burada yönünü ve çalışacağı yeteneği seçebilirsin.</p><button class="team-action" id="academyFindYouth" type="button">Transfer Merkezi’ne git</button></div>';$('academyFindYouth').onclick=findYouth;syncScene();return;}
 const phase=R.phase(e),path=R.plans(e.player).find(p=>p.id===e.path),skills=R.skills(e),choice=skills.find(x=>x.id===e.skillChoice);
 host.innerHTML='<article class="academy-student"><div class="academy-student-head"><img src="'+portrait(e.player)+'" alt=""><div><small>'+escape(TeamRules.roles[e.player.role])+'</small><h3>'+escape(e.player.name+' '+e.player.surname)+'</h3><p>'+escape(phase==='adaptation'?'Takıma alışıyor':path.name)+'</p></div><button id="academyInspectLive" class="academy-icon" type="button" aria-label="Oyuncu kartını incele">↗</button></div><div class="academy-student-state"><strong id="academyCareerPhase"></strong><time id="academyCareerTime"></time></div><progress id="academyCareerProgress" max="1"></progress><div id="academyCareerDecision" class="academy-career-decision"></div></article>';
 $('academyInspectLive').onclick=()=>inspect(e.id);
 const box=$('academyCareerDecision');
 if(phase==='direction'||phase==='skill'){
  const note=document.createElement('p');note.textContent=phase==='direction'?path.name+' yönünde çalışıyor.':skillName(choice.skill)+' çalışıyor.';
  const b=document.createElement('button');b.type='button';b.id='academyTalk';b.className='team-secondary';b.textContent=needsDecision(e)?e.player.name+' ile konuş':'Çalışmayı değiştir';b.onclick=()=>talk(e.id);box.append(note,b);
 }else if(phase==='ready'){
  const b=document.createElement('button');b.type='button';b.className='team-action';b.textContent='Mezuniyeti incele';b.onclick=()=>inspect(e.id);box.append(b);
 }else{const note=document.createElement('p');note.textContent='İlk çalışmaların ardından gelişim yönünü seçebilirsin. Eğitim sen yokken de ilerler.';box.append(note);}
 tick();syncScene();
}
function tick(){const e=state().academy.entries.find(e=>e.id===selected);if(!e||!$('academyCareerProgress'))return;const phase=R.phase(e);$('academyCareerProgress').value=R.progress(e);$('academyCareerTime').textContent=phase==='ready'?'Tamamlandı':duration(e.end-Date.now());$('academyCareerPhase').textContent={adaptation:'Adaptasyon',direction:'Gelişim yönü',skill:'Yetenek çalışması',ready:'A takıma hazır'}[phase];}
function findYouth(){screen.close();document.getElementById('scoutAlert').click();}
function open(){const s=state();if(!R.unlocked(s))return false;lastEntryFocus=document.activeElement;signature='';autoConversation=true;screen.open();const frame=$('academyCareerFrame');if(!frame.getAttribute('src'))frame.src='mac.html?academyTraining=1';render(true);if(!GuidedTutorial.completed('academy-unlock'))setTimeout(()=>{if(screen.dialog.open)GuidedTutorial.start([{id:'academy-opened',target:()=>$('academyCareerPlayers'),text:'Akademiyi açtın! Transferden gençler al, gelişim yönlerini ve yeteneklerini seç. Eğitim sen yokken de ilerler; elit olmayan gençler de gelişerek mezun olur.'}],null,'academy-unlock');},350);setTimeout(maybeTalk,450);return true;}
entry.onclick=()=>{if(!open()){document.querySelector('.mobile-nav a[href="#clubPanel"]').click();facility.scrollIntoView({block:'center',behavior:CardMotion.reduced()?'instant':'smooth'});$('academyFacilityAction').focus({preventScroll:true});}};
$('academyFacilityAction').onclick=()=>{if(R.unlocked(state()))open();else if(RoomSystem.academyBuild()){refreshEntry();open();}else $('academyFacilityNotice').textContent='Akademi kurulamadı. Bütçeni ve kayıt alanını kontrol et.';};
function offer(c,immediate){
 const s=state();if(s.division!==4||!R.eligible(c.player)||c.hired)return false;
 decision={id:c.id,immediate};$('academyTransferPlayer').replaceChildren(card(c.player));const free=s.academy.entries.length<R.capacity(s),first=s.academy.sequence===0,open=R.unlocked(s);
 $('academyTransferSummary').innerHTML='<div class="academy-offer-summary"><strong>'+NumberUI.compact(ScoutRules.price(s,c))+' bütçe</strong><span>'+escape(TeamRules.roles[c.player.role])+' · '+c.player.age+' yaş</span></div><p>Akademide '+(first?'20 dakika':'2 saat')+' eğitim · %25 elit ihtimali</p><p>Garanti: özellik gelişimi ve seçeceğin bir yetenek. Elit olursa mor kart ve legendary potansiyeli kazanır.</p>';
 $('academyEnrollLive').disabled=!open||!free||s.budget<ScoutRules.price(s,c);$('academyEnrollLive').textContent=!open?'Önce kulüpten akademiyi kur':!free?'Akademi kontenjanı dolu':'Akademiye transfer et';$('academyTransferNotice').textContent='';transfer.open();return true;
}
$('academyImmediate').onclick=()=>{const action=decision?.immediate;transfer.close();decision=null;action?.();};
$('academyEnrollLive').onclick=()=>{if(!decision)return;const id=RoomSystem.academyEnroll(decision.id);if(!id){$('academyTransferNotice').textContent='Transfer tamamlanamadı. Bütçeni ve akademi kontenjanını kontrol et.';return;}selected=id;decision=null;document.querySelectorAll('dialog[open]').forEach(d=>d.close());open();};
function inspect(id){const s=state(),e=s.academy.entries.find(x=>x.id===id);if(!e)return;reviewing=id;const ready=R.phase(e)==='ready',p=ready?R.result(e):e.player;
 $('academyCareerCard').replaceChildren(card(p));const path=R.plans(p).find(x=>x.id===e.path),choice=R.skills(e).find(x=>x.id===e.skillChoice);
 $('academyCareerOutcome').innerHTML=ready?'<strong>'+(p.academyElite?'Kendi elitini yetiştirdin!':'A takıma hazır.')+'</strong><p>'+escape(path.name)+' · '+escape(skillName(choice.skill))+'</p>'+(p.academyElite?'<p>'+escape(skillName(choice.legendary))+' potansiyeli · Kamp koşuluyla açılır.</p>':'<p>Gelişimini AP ve kamplarla sürdürebilirsin.</p>'):'<p>Şu an '+TeamRules.overall(p)+' OVR. Eğitimde özellik gelişimi ve seçilen yetenek kazanılacak.</p>';
 const b=$('academyGraduateLive');b.hidden=!ready;b.disabled=s.scouting.recruits.some(p=>p.academyOrigin===id)||TeamRules.players.length>=30;b.textContent=TeamRules.players.length>=30?'Kadro dolu · Mezunun burada bekliyor':'A takıma al';$('academyGraduateNotice').textContent='';detail.open();syncScene();
 if(ready&&!CardMotion.reduced()){$('academyCareerCard').animate([{opacity:.3,transform:'translateY(10px)'},{opacity:1,transform:'none'}],{duration:550,easing:CardMotion.ease});}
}
$('academyGraduateLive').onclick=()=>{const id=RoomSystem.academyGraduate(reviewing);if(!id){$('academyGraduateNotice').textContent='Mezun alınamadı. Kadro alanını ve kaydı kontrol et.';return;}detail.close();screen.close();TeamView.reveal(id);};
screen.dialog.addEventListener('close',()=>{autoConversation=false;conversation.close();syncScene();lastEntryFocus?.isConnected&&lastEntryFocus.focus({preventScroll:true});});
detail.dialog.addEventListener('close',syncScene);
new IntersectionObserver(entries=>{sceneVisible=entries[0].isIntersecting;syncScene();},{threshold:.01}).observe($('academyCareerFrame'));
addEventListener('message',event=>{if(event.source!==$('academyCareerFrame').contentWindow)return;if(event.data?.type==='academy-training-mounted')syncScene();if(event.data?.type==='academy-training-ready')$('academyCareerFrame').dataset.ready='true';if(event.data?.type==='academy-training-select'&&state().academy.entries.some(e=>e.id===event.data.id)){selected=event.data.id;render();}});
addEventListener('spiker-academy-changed',()=>render(true));addEventListener('spiker-stage-changed',()=>{if(state().division!==4){screen.close();detail.close();transfer.close();}refreshEntry();});addEventListener('visibilitychange',()=>{render();syncScene();});
new MutationObserver(()=>{refreshEntry();}).observe($('roomSlots0'),{childList:true});
new MutationObserver(syncScene).observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
setInterval(()=>{if(!document.hidden&&!window.gameResetting){refreshEntry();if(screen.dialog.open){render();maybeTalk();}}},1000);
window.AcademyCareer={open,offer,refresh:refreshEntry,snapshot:()=>state().academy};refreshEntry();
})();
