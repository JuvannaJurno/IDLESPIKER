(function(){
'use strict';
const key='idle-spiker-onboarding-v1',done=new Set();
try{const saved=JSON.parse(localStorage.getItem(key));if(Array.isArray(saved))saved.forEach(x=>done.add(x))}catch{}
const initial=RoomSystem.tutorialState();
function finish(id){if(done.has(id))return;done.add(id);try{localStorage.setItem(key,JSON.stringify([...done]))}catch{}}
// Returning players do not need the first-click explanation.
if(initial.instructions>0){finish('tap');finish('arrival')}
const hint=document.createElement('button');hint.id='learningHint';hint.type='button';hint.hidden=true;hint.setAttribute('aria-label','İpucunu kapat');
const copy=document.createElement('span'),close=document.createElement('span');close.textContent='×';close.setAttribute('aria-hidden','true');hint.append(copy,close);document.body.append(hint);
const spotlight=document.createElementNS('http://www.w3.org/2000/svg','svg');const shade=document.createElementNS('http://www.w3.org/2000/svg','path');shade.setAttribute('fill-rule','evenodd');spotlight.append(shade);spotlight.id='learningSpotlight';spotlight.setAttribute('hidden','');spotlight.setAttribute('aria-hidden','true');document.body.append(spotlight);
let active=null,target=null,cooldown=0,arrival=null;
function clear(){target?.classList.remove('learning-focus');target=null;hint.hidden=true;spotlight.setAttribute('hidden','');active=null}
hint.onclick=()=>{const tour=active?.startsWith('blocks-')||active==='player-stats';if(active)finish(active);clear();cooldown=Date.now()+(tour?250:6000)};
window.addEventListener('spiker-ap-arrived',e=>{if(!done.has('arrival')&&!arrival)arrival={ap:e.detail.ap,until:Date.now()+6000}});
const visible=el=>el&&el.getClientRects().length>0;
function show(id,text,el){if(!visible(el)){clear();return}if(active!==id||target!==el){clear();active=id;target=el;el.classList.add('learning-focus');copy.textContent=text;hint.dataset.step=id;close.textContent=(id.startsWith('blocks-')||id==='player-stats')?'Devam →':'×';hint.setAttribute('aria-label',(id.startsWith('blocks-')||id==='player-stats')?'Sonraki adım':'İpucunu kapat');const bounds=el.getBoundingClientRect();const container=el.closest('dialog[open],.building-scroll');const frame=container?.getBoundingClientRect();const top=Math.max(100,frame?frame.top+80:100),bottom=Math.min(innerHeight-110,frame?frame.bottom-20:innerHeight-110);if(bounds.top<top||bounds.bottom>bottom||bounds.left<12||bounds.right>innerWidth-12)el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth',block:'center',inline:'center'})}const dialog=el.closest('dialog[open]');const parent=dialog||document.body;if(hint.parentElement!==parent)parent.append(hint);if(spotlight.parentElement!==parent)parent.append(spotlight);const r=el.getBoundingClientRect();if(r.bottom<=0||r.top>=innerHeight||r.right<=0||r.left>=innerWidth){hint.hidden=true;spotlight.setAttribute('hidden','');return}spotlight.removeAttribute('hidden');spotlight.setAttribute('viewBox','0 0 '+innerWidth+' '+innerHeight);const holes=[r];if(id==='arrival'){const tap=document.getElementById('energyButton');if(visible(tap))holes.push(tap.getBoundingClientRect())}shade.setAttribute('d','M0 0H'+innerWidth+'V'+innerHeight+'H0Z'+holes.map(rect=>{const x=rect.left-6,y=rect.top-6,w=rect.width+12,h=rect.height+12,q=Math.min(12,w/2,h/2);return 'M'+(x+q)+' '+y+'H'+(x+w-q)+'Q'+(x+w)+' '+y+' '+(x+w)+' '+(y+q)+'V'+(y+h-q)+'Q'+(x+w)+' '+(y+h)+' '+(x+w-q)+' '+(y+h)+'H'+(x+q)+'Q'+x+' '+(y+h)+' '+x+' '+(y+h-q)+'V'+(y+q)+'Q'+x+' '+y+' '+(x+q)+' '+y+'Z'}).join(''));hint.hidden=false;hint.style.left=Math.max(10,Math.min(innerWidth-290,r.left))+'px';hint.style.top=Math.max(10,Math.min(innerHeight-130,r.top-hint.offsetHeight-10))+'px'}
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
 if(!done.has('tap')&&club&&!modal){show('tap','İlk talimatını gönder.',document.getElementById('energyButton'));return}
 if(arrival&&!done.has('arrival')){if(Date.now()>arrival.until){finish('arrival');clear();cooldown=Date.now()+2500;return}if(club&&!modal){show('arrival','Talimat sahaya ulaştı: +'+arrival.ap.toLocaleString('tr-TR')+' Antrenman Puanı (AP). Talimat vererek AP kazan.',document.getElementById('roomAP'));return}}
 if(s.instructions<3&&!has('assistant')){clear();return}
 if(club&&!modal&&!done.has('blocks-basics')){show('blocks-basics','Yeni alan aç ile blok seçebilirsin. Blokları bütçeyle alır, üzerlerine dokunarak yükseltirsin.',document.querySelector('#roomSlots1 .unlock-room')||document.querySelector('#roomSlots1 .upgrade-room'));return}
 if(!done.has('assistant')&&club&&s.budget>=10){show('assistant',document.querySelector('#roomDialog[open]')?'Otomatik Asistanı seç. Senin yerine talimat göndersin.':'İlk bloğunu kuralım. Yeni alan aç düğmesine dokun.',block('assistant',1));return}
 if(!done.has('train')){
 const lineup=TeamView.snapshot().lineup,p=TeamRules.players.find(p=>p.id===lineup.p),stat='set';
 if(p&&!TeamRules.trainingBlock(p,stat)&&s.ap>=TeamRules.statCost(p,stat)){
 if(club&&!modal){show('train','AP birikti. Takımına geçip bir oyuncunu geliştir.',document.getElementById('teamTab'));return}
 if(document.body.classList.contains('team-open')){
 const card=document.querySelector('[data-player="'+p.id+'"]');
 if(modal?.id==='playerDialog'){if(document.getElementById('playerName').textContent===p.name+' '+p.surname){if(!done.has('player-stats')){show('player-stats','Bunlar oyuncunun özellikleri. Her biri maçta farklı bir beceriyi etkiler.',document.getElementById('playerStats'));return}show('train','Pasını +1 geliştir.',document.querySelector('[data-stat="set"] .train-button'));return}}
 else{show('train',p.name+' kartına dokun. Geliştirmeler burada.',card);return}
 }
 }
 }
 const day=Number(document.getElementById('mobileDay').textContent.match(/\d+/)?.[0]||1);
 if(!done.has('match')&&progress.next&&progress.next.day-day<=1&&!modal){if(!document.getElementById('leaguePanel').hidden){if(document.getElementById('standingsPane').hidden)document.getElementById('standingsTab').click();show('match','Takımın son sırada. Kalan 4 maçta ilk 4’e yüksel.',document.querySelector('#standingsPane .standings-scroll'));return}show('match','Lig durumunu buradan görebilirsin.',document.getElementById('calendarTab'));return}
 clear();
}
setInterval(update,400);window.addEventListener('resize',update);window.addEventListener('scroll',update,{passive:true,capture:true});update();
})();
