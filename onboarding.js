(function(){
'use strict';
const key='idle-spiker-onboarding-v1',done=new Set();
try{const saved=JSON.parse(localStorage.getItem(key));if(Array.isArray(saved))saved.forEach(x=>done.add(x))}catch{}
const initial=RoomSystem.tutorialState();
function finish(id){if(done.has(id))return;done.add(id);try{localStorage.setItem(key,JSON.stringify([...done]))}catch{}}
// Returning players do not need the first-click explanation.
if(initial.instructions>0){finish('tap');finish('arrival')}
const hint=document.createElement('div');hint.id='learningHint';hint.hidden=true;hint.setAttribute('role','note');
const copy=document.createElement('span'),close=document.createElement('button');close.type='button';close.className='learning-dismiss';close.textContent='×';close.setAttribute('aria-label','İpucunu kapat');hint.append(copy,close);document.body.append(hint);
const spotlight=document.createElementNS('http://www.w3.org/2000/svg','svg');const shade=document.createElementNS('http://www.w3.org/2000/svg','path');shade.setAttribute('fill-rule','evenodd');spotlight.append(shade);spotlight.id='learningSpotlight';spotlight.setAttribute('hidden','');spotlight.setAttribute('aria-hidden','true');document.body.append(spotlight);
let active=null,target=null,cooldown=0,arrival=null,following=false;
function clear(){target?.classList.remove('learning-focus');target=null;hint.hidden=true;spotlight.setAttribute('hidden','');active=null}
close.onclick=()=>{const tour=active?.startsWith('blocks-')||active==='player-stats'||active==='quick-upgrade';if(active)finish(active);clear();cooldown=Date.now()+(tour?250:6000)};
window.addEventListener('spiker-ap-arrived',e=>{if(!done.has('arrival')&&!arrival){arrival={ap:e.detail.ap,showAt:Date.now()+1200,until:Date.now()+8500};cooldown=0;update()}});
document.getElementById('energyButton').addEventListener('click',()=>{if(!done.has('arrival')&&!following){following=true;finish('tap');clear();cooldown=0;setTimeout(update,0)}});
document.addEventListener('click',e=>{if(active==='quick-upgrade'&&e.target.closest('.card-open-upgrade')){finish('quick-upgrade');clear();cooldown=Date.now()+250}},true);
const visible=el=>el&&el.getClientRects().length>0;
function setCopy(text){copy.replaceChildren();for(const part of text.split(/(\[\[.*?\]\])/g)){if(part.startsWith('[[')&&part.endsWith(']]')){const name=document.createElement('strong');name.className='tutorial-button-name';name.textContent=part.slice(2,-2);copy.append(name)}else copy.append(document.createTextNode(part))}}
function show(id,text,el){if(!visible(el)){clear();return}if(active!==id||target!==el){clear();active=id;target=el;el.classList.add('learning-focus');setCopy(text);hint.dataset.step=id;close.textContent=(id.startsWith('blocks-')||id==='player-stats'||id==='quick-upgrade')?'Devam →':'×';close.setAttribute('aria-label',(id.startsWith('blocks-')||id==='player-stats'||id==='quick-upgrade')?'Sonraki adım':'İpucunu kapat');const bounds=el.getBoundingClientRect();const container=el.closest('dialog[open],.building-scroll');const frame=container?.getBoundingClientRect();const top=Math.max(100,frame?frame.top+80:100),bottom=Math.min(innerHeight-110,frame?frame.bottom-20:innerHeight-110);if(bounds.top<top||bounds.bottom>bottom||bounds.left<12||bounds.right>innerWidth-12)el.scrollIntoView({behavior:id==='instruction-path'||matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center',inline:'center'})}const dialog=el.closest('dialog[open]');const parent=dialog||document.body;if(hint.parentElement!==parent)parent.append(hint);if(spotlight.parentElement!==parent)parent.append(spotlight);const r=el.getBoundingClientRect();if(r.bottom<=0||r.top>=innerHeight||r.right<=0||r.left>=innerWidth){hint.hidden=true;spotlight.setAttribute('hidden','');return}spotlight.removeAttribute('hidden');spotlight.setAttribute('viewBox','0 0 '+innerWidth+' '+innerHeight);spotlight.style.width=innerWidth+'px';spotlight.style.height=innerHeight+'px';const holes=[r];if(id==='train'&&el.classList.contains('development-panel')){holes.length=0;for(const selector of ['#trainingStats .card-upgrade-button','#trainingBalance']){const part=document.querySelector(selector);if(visible(part))holes.push(part.getBoundingClientRect())}}if(id==='train'&&el.classList.contains('player-card')){const quick=el.querySelector('.card-open-upgrade');if(visible(quick)){const bottom=quick.getBoundingClientRect().top-7;holes[0]={left:r.left,top:r.top,width:r.width,height:bottom-r.top}}}if(id==='instruction-path'){const track=document.querySelector('.energy-track');if(visible(track))holes.push(track.getBoundingClientRect())}if(id==='arrival'||id==='instruction-path'){const tap=document.getElementById('energyButton');if(visible(tap))holes.push(tap.getBoundingClientRect())}shade.setAttribute('d','M0 0H'+innerWidth+'V'+innerHeight+'H0Z'+holes.map(rect=>{const x=rect.left-6,y=rect.top-6,w=rect.width+12,h=rect.height+12,q=Math.min(12,w/2,h/2);return 'M'+(x+q)+' '+y+'H'+(x+w-q)+'Q'+(x+w)+' '+y+' '+(x+w)+' '+(y+q)+'V'+(y+h-q)+'Q'+(x+w)+' '+(y+h)+' '+(x+w-q)+' '+(y+h)+'H'+(x+q)+'Q'+x+' '+(y+h)+' '+x+' '+(y+h-q)+'V'+(y+q)+'Q'+x+' '+y+' '+(x+q)+' '+y+'Z'}).join(''));hint.hidden=false;hint.style.left=Math.max(10,Math.min(innerWidth-290,r.left))+'px';let hintTop=Math.max(10,Math.min(innerHeight-hint.offsetHeight-10,r.top-hint.offsetHeight-10));const tap=document.getElementById('energyButton');if(!dialog&&visible(tap)){const tapRect=tap.getBoundingClientRect();if(hintTop+hint.offsetHeight>tapRect.top-12&&hintTop<tapRect.bottom+12)hintTop=Math.max(10,tapRect.top-hint.offsetHeight-14)}hint.style.top=hintTop+'px'}
function block(id,floor){return document.querySelector('#roomDialog[open] [data-block="'+id+'"]')||document.querySelector('#roomSlots'+floor+' .unlock-room')}
function update(){
 if(document.getElementById('bootScreen')||document.hidden||window.gameResetting||window.MatchGateway?.active()){clear();return}
 const s=RoomSystem.tutorialState(),has=id=>s.floors.some(row=>row.includes(id));
 if(s.instructions>0)finish('tap');if(has('assistant')){finish('assistant');finish('blocks-basics')}if(has('warmup'))finish('warmup');if(has('offline_time'))finish('offline');
 if(TeamRules.players.some(p=>Object.values(p.training||{}).some(n=>n>0)))finish('train');
 const progress=LeagueSeason.progress();if(progress.played>0)finish('match');
 if(active&&done.has(active)){clear();cooldown=Date.now()+2200}
 if(Date.now()<cooldown)return;
 const modal=document.querySelector('dialog[open]');if(modal&&!['roomDialog','playerDialog'].includes(modal.id)){clear();return}
 const club=!document.querySelector('.dashboard').hidden;
 if(!done.has('tap')&&club&&!modal){show('tap','[[Talimat ver]] ile ilk talimatını gönder.',document.getElementById('energyButton'));return}
 if(following&&!done.has('arrival')&&(!arrival||Date.now()<arrival.showAt)&&club&&!modal){
 show('instruction-path',arrival?'Talimat Antrenman Sahası’na ulaştı. AP burada üretilir.':'Talimatlar bu hat üzerinden departmanlara ulaşır.',document.querySelector('.tier[data-floor="0"] .base-room'));return
 }
 if(arrival&&!done.has('arrival')){if(Date.now()>arrival.until){finish('arrival');clear();cooldown=Date.now()+2500;return}if(club&&!modal){show('arrival','Talimat sahaya ulaştı: +'+arrival.ap.toLocaleString('tr-TR')+' Antrenman Puanı (AP). Talimatlarla departmanlardan kaynak ve avantaj kazan.',document.getElementById('roomAP'));return}}
 if(s.instructions<3&&!has('assistant')){clear();return}
 if(club&&!modal&&!done.has('blocks-basics')){show('blocks-basics','[[Yeni alan aç]] ile blok seçebilirsin. Blokları bütçeyle alır, üzerlerine dokunarak yükseltirsin.',document.querySelector('#roomSlots1 .unlock-room')||document.querySelector('#roomSlots1 .upgrade-room'));return}
 if(!done.has('assistant')&&club&&s.budget>=10){show('assistant',document.querySelector('#roomDialog[open]')?'[[Otomatik Asistan]] seç. Senin yerine talimat göndersin.':'İlk bloğunu kuralım. [[Yeni alan aç]] düğmesine dokun.',block('assistant',1));return}
 if(!done.has('train')){
 const lineup=TeamView.snapshot().lineup,p=TeamRules.players.find(p=>p.id===lineup.p),stat='set';
 if(p&&!TeamRules.cardQuote(p).blocked&&s.ap>=TeamRules.cardQuote(p).cost){
 if(club&&!modal){show('train','AP birikti. [[Takım]] menüsüne geçip bir oyuncunu geliştir.',document.getElementById('teamTab'));return}
 if(document.body.classList.contains('team-open')){
 const card=document.querySelector('[data-player="'+p.id+'"]');
 if(modal?.id==='playerDialog'){if(document.getElementById('playerName').textContent===p.name+' '+p.surname){if(!done.has('player-stats')){document.getElementById('playerAttributes').open=true;show('player-stats','Bunlar oyuncunun özellikleri. Her biri maçta farklı bir beceriyi etkiler.',document.getElementById('playerStats'));return}show('train','[[Kartı yükselt]]: Oyuncunun özellikleri pozisyonuna göre artar.',document.querySelector('#playerDialog .development-panel'));return}}
 else{show('train','Oyuncu kartına dokun. Özelliklerini ve yükseltmesini görelim.',card);return}
 }
 }
 }
 if(done.has('train')&&!done.has('quick-upgrade')&&document.body.classList.contains('team-open')){
 if(modal?.id==='playerDialog'){clear();return}
 if(!modal){const button=[...document.querySelectorAll('.card-open-upgrade')].find(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.bottom<=innerHeight-85&&r.width>0});if(button){show('quick-upgrade','[[Hızlı Yükselt]], AP harcayarak kartı doğrudan yükseltir.',button);return}}

 }
 const day=Number(document.getElementById('mobileDay').textContent.match(/\d+/)?.[0]||1);
 if(!done.has('match')&&progress.next&&progress.next.day-day<=1&&!modal){if(!document.getElementById('leaguePanel').hidden){if(document.getElementById('standingsPane').hidden)document.getElementById('standingsTab').click();show('match','Takımın son sırada. Kalan '+(progress.total-progress.played)+' maçta ilk 4’e yüksel.',document.querySelector('#standingsPane .standings-scroll'));return}show('match','Lig durumunu buradan görebilirsin.',document.getElementById('calendarTab'));return}
 clear();
}
setInterval(update,400);window.addEventListener('resize',update);window.addEventListener('scroll',update,{passive:true,capture:true});update();
})();
