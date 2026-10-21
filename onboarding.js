(function(){
'use strict';
const key='idle-spiker-onboarding-v1',done=new Set();
try{const saved=JSON.parse(localStorage.getItem(key));if(Array.isArray(saved))saved.forEach(x=>done.add(x))}catch{}
const initial=RoomSystem.tutorialState();
function finish(id){if(done.has(id))return;done.add(id);try{localStorage.setItem(key,JSON.stringify([...done]))}catch{}}
// Returning players do not need the first-click explanation.
if(initial.instructions>0){finish('tap');finish('arrival')}
const hint=document.createElement('div');hint.id='learningHint';hint.hidden=true;hint.setAttribute('role','note');
const copy=document.createElement('span'),close=document.createElement('button');close.type='button';close.className='learning-dismiss';close.textContent='×';close.setAttribute('aria-label','İpucunu kapat');hint.append(copy,close);for(const type of ['click','pointerdown','pointerup'])hint.addEventListener(type,event=>event.stopPropagation());const reviewStop=document.createElement('button');reviewStop.type='button';reviewStop.className='learning-review-stop';reviewStop.textContent='×';reviewStop.setAttribute('aria-label','Tutorial gösterimini bitir');reviewStop.hidden=true;hint.append(reviewStop);reviewStop.onclick=()=>endGuide(false);document.body.append(hint);
const svgNS='http://www.w3.org/2000/svg',spotlight=document.createElementNS(svgNS,'svg'),shade=document.createElementNS(svgNS,'path'),defs=document.createElementNS(svgNS,'defs'),mask=document.createElementNS(svgNS,'mask');mask.id='learningCutout';mask.setAttribute('maskUnits','userSpaceOnUse');mask.setAttribute('x','0');mask.setAttribute('y','0');const backdrop=document.createElementNS(svgNS,'rect');backdrop.setAttribute('fill','#fff');mask.append(backdrop);defs.append(mask);shade.setAttribute('mask','url(#learningCutout)');spotlight.append(defs,shade);spotlight.id='learningSpotlight';spotlight.setAttribute('hidden','');spotlight.setAttribute('aria-hidden','true');document.body.append(spotlight);
let active=null,target=null,cooldown=0,arrival=null,following=false,guided=null;
const guideKey='idle-spiker-guides-v2',pausedGuides=new Set();let guideProgress={};try{guideProgress=JSON.parse(localStorage.getItem(guideKey)||'{}')}catch{}
if(!guideProgress||typeof guideProgress!=='object'||Array.isArray(guideProgress))guideProgress={};
function saveGuide(){try{localStorage.setItem(guideKey,JSON.stringify(guideProgress))}catch{}}
function endGuide(complete=false){const tour=guided;guided=null;clear();if(complete&&!tour.review){guideProgress[tour.id]='done';saveGuide();tour?.finish?.();}if(tour?.review)tour.finish?.();if(tour&&!complete&&!tour.review)pausedGuides.add(tour.id);if(tour&&!complete&&!tour.review)window.dispatchEvent(new CustomEvent('spiker-guide-paused',{detail:{id:tour.id}}));cooldown=Date.now()+500;}
function nextGuide(){if(!guided)return;const tour=guided;tour.index++;if(!tour.review){guideProgress[tour.id]=tour.steps[tour.index]?.id||'done';saveGuide();}clear();if(tour.index>=tour.steps.length){endGuide(true);return}tour.steps[tour.index].enter?.();update();}
window.GuidedTutorial={start(steps,finish,id=steps[0].id,{review=false,restart=false}={}){if(guided||(!review&&pausedGuides.has(id)))return false;if(!review&&!restart&&guideProgress[id]==='done'){finish?.();return false;}clear();const saved=review||restart?-1:steps.findIndex(s=>s.id===guideProgress[id]);guided={steps,index:Math.max(0,saved),finish,id,review};steps[guided.index].enter?.();update();return true;},stop:()=>endGuide(false),get active(){return !!guided},paused:id=>pausedGuides.has(id),resume:id=>pausedGuides.delete(id),completed:id=>guideProgress[id]==='done'};
document.addEventListener('click',e=>{const tour=guided,index=tour?.index;if(!tour)return;const step=tour.steps[index],matches=!!step.click&&!!e.target.closest?.(step.click);setTimeout(()=>{if(guided!==tour||guided.index!==index)return;if(matches&&(!step.done||step.done()))nextGuide();else update();},0)},true);
document.addEventListener('pointerup',()=>{if(guided)setTimeout(update,0)},true);
window.addEventListener('spiker-stage-changed',()=>{done.clear();try{JSON.parse(localStorage.getItem(key)||'[]').forEach(id=>done.add(id))}catch{}following=false;arrival=null;cooldown=0;clear();update()});
function clear(){reviewStop.hidden=true;close.hidden=false;document.body.classList.remove('instruction-path-guide');target?.classList.remove('learning-focus');target=null;hint.hidden=true;spotlight.setAttribute('hidden','');active=null}
close.onclick=()=>{if(guided){const step=guided.steps[guided.index];if(step.allowNext||(!step.click&&!step.done))nextGuide();else endGuide(false);return}const tour=active?.startsWith('blocks-')||active==='player-stats'||active==='quick-upgrade';if(active)finish(active);clear();cooldown=Date.now()+(tour?250:6000)};
window.addEventListener('spiker-ap-arrived',e=>{if(!done.has('arrival')&&!arrival){arrival={ap:e.detail.ap,showAt:Date.now()+1200,until:Date.now()+8500};cooldown=0;update()}});
document.getElementById('energyButton').addEventListener('click',()=>{if(!done.has('arrival')&&!following){following=true;finish('tap');clear();cooldown=0;setTimeout(update,0)}});
document.addEventListener('click',e=>{if(active==='quick-upgrade'&&e.target.closest('.card-open-upgrade')){const levels=TeamRules.players.map(p=>TeamRules.cardLevel(p));setTimeout(()=>{if(TeamRules.players.some((p,i)=>TeamRules.cardLevel(p)>levels[i])){finish('quick-upgrade');clear();cooldown=Date.now()+250;update();}},0)}},true);
const visible=el=>el&&el.getClientRects().length>0;
function setCopy(text){copy.replaceChildren();for(const part of text.split(/(\[\[.*?\]\])/g)){if(part.startsWith('[[')&&part.endsWith(']]')){const name=document.createElement('strong');name.className='tutorial-button-name';name.textContent=part.slice(2,-2);copy.append(name)}else copy.append(document.createTextNode(part))}}
function intersect(a,b){return Math.max(0,Math.min(a.right,b.right)-Math.max(a.left,b.left))*Math.max(0,Math.min(a.bottom,b.bottom)-Math.max(a.top,b.top));}
function viewportRect(el){let r=el.getBoundingClientRect(),left=Math.max(0,r.left),top=Math.max(0,r.top),right=Math.min(innerWidth,r.right),bottom=Math.min(innerHeight,r.bottom);for(let p=el.parentElement;p&&p!==document.body;p=p.parentElement){const css=getComputedStyle(p);if(/auto|scroll|hidden|clip/.test(css.overflow+css.overflowY+css.overflowX)){const box=p.getBoundingClientRect();left=Math.max(left,box.left);right=Math.min(right,box.right);top=Math.max(top,box.top);bottom=Math.min(bottom,box.bottom);}}return {left,top,right,bottom,width:Math.max(0,right-left),height:Math.max(0,bottom-top)};}
function placeHint(r,holes,dialog){
 const pad=10,gap=14,nav=document.querySelector('.mobile-nav'),navBox=visible(nav)?nav.getBoundingClientRect():null,bottom=navBox&&navBox.top>innerHeight/2?Math.min(innerHeight-pad,navBox.top-pad):innerHeight-pad;
 const surface=(dialog||target?.closest('.shell')||document.querySelector('.shell'))?.getBoundingClientRect();const minX=Math.max(pad,(surface?.left??0)+pad),right=Math.min(innerWidth-pad,(surface?.right??innerWidth)-pad);hint.style.maxWidth=Math.max(1,right-minX)+'px';
 const width=hint.offsetWidth,height=hint.offsetHeight,maxX=Math.max(minX,right-width),maxY=Math.max(pad,bottom-height),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const xs=[clamp(r.left,minX,maxX),minX,maxX],candidates=[];for(const x of xs){candidates.push({x,y:r.top-height-gap},{x,y:r.bottom+gap});}candidates.push({x:r.right+gap,y:r.top},{x:r.left-width-gap,y:r.top});
 const obstacles=[...holes];const tap=document.getElementById('energyButton');if(!dialog&&visible(tap)&&tap!==target)obstacles.push(tap.getBoundingClientRect());
 for(const o of obstacles)for(const x of xs)candidates.push({x,y:o.top-height-gap},{x,y:o.bottom+gap});for(const x of xs)candidates.push({x,y:pad},{x,y:maxY});
 const scored=candidates.map(c=>{const x=clamp(c.x,minX,maxX),y=clamp(c.y,pad,maxY),rect={left:x,top:y,right:x+width,bottom:y+height};const overlap=obstacles.reduce((n,o)=>n+intersect(rect,{left:o.left-8,top:o.top-8,right:o.right+8,bottom:o.bottom+8}),0),distance=Math.min(Math.abs(rect.bottom-r.top),Math.abs(rect.top-r.bottom));return {x,y,score:overlap*10000+distance+Math.abs(x-r.left)*.1};}).sort((a,b)=>a.score-b.score);
 hint.style.left=scored[0].x+'px';hint.style.top=scored[0].y+'px';
}
function show(id,text,el){
 if(!visible(el)){clear();return;}
 reviewStop.hidden=!guided?.review;const step=guided?.steps[guided.index],manual=step?step.allowNext||(!step.click&&!step.done):id.startsWith('blocks-')||id==='player-stats'||id==='quick-upgrade';
 close.classList.remove('dialog-nav-control');close.style.removeProperty('translate');close.style.removeProperty('z-index');close.hidden=false;close.textContent=step?(manual?(guided.index===guided.steps.length-1?'Anladım':'Devam →'):'Daha sonra'):(manual?'Devam →':'×');close.setAttribute('aria-label',step&&!manual?'Rehberi daha sonra sürdür':manual?'Sonraki adım':'İpucunu kapat');hint.dataset.action=manual?'next':step?'pause':'close';
 const dialog=el.closest('dialog[open]'),parent=dialog||document.body;if(hint.parentElement!==parent)parent.append(hint);if(spotlight.parentElement!==parent)parent.append(spotlight);
 if(active!==id||target!==el){target?.classList.remove('learning-focus');active=id;target=el;el.classList.add('learning-focus');hint.dataset.step=id;setCopy(guided?.review?(guided.index+1)+' / '+guided.steps.length+' · '+text:text);const bounds=viewportRect(el),raw=el.getBoundingClientRect();if(bounds.height<Math.min(raw.height,innerHeight-200)||raw.top<110||raw.bottom>innerHeight-145)el.scrollIntoView({behavior:'instant',block:raw.height>innerHeight-220?'start':'center',inline:'nearest'});}else setCopy(guided?.review?(guided.index+1)+' / '+guided.steps.length+' · '+text:text);
 const r=viewportRect(el);if(!r.width||!r.height){hint.hidden=true;spotlight.setAttribute('hidden','');return;}
 const holes=[r];if(id==='guided-social-publish'){const draft=document.getElementById('socialDraft');if(visible(draft))holes.push(viewportRect(draft));}if(id==='train'&&el.classList.contains('development-panel')){holes.length=0;for(const selector of ['#trainingStats .card-upgrade-button','#trainingBalance']){const part=document.querySelector(selector);if(visible(part))holes.push(viewportRect(part));}}
 if(id==='train'&&el.classList.contains('player-card')){const quick=el.querySelector('.card-open-upgrade');if(visible(quick)){const bottom=quick.getBoundingClientRect().top-7;holes[0]={...r,bottom,height:Math.max(0,bottom-r.top)};}}
 if(id==='instruction-path'){const track=document.querySelector('.energy-track');if(visible(track))holes.push(viewportRect(track));}
 if(id==='arrival'||id==='instruction-path'){const tap=document.getElementById('energyButton');if(visible(tap))holes.push(viewportRect(tap));}
 if(id==='guided-income-send'||id==='guided-income-conversion'){const center=document.querySelector('.tier[data-floor="2"] .base-room');if(visible(center))holes.push(viewportRect(center));}
 spotlight.removeAttribute('hidden');spotlight.setAttribute('viewBox','0 0 '+innerWidth+' '+innerHeight);spotlight.style.width=innerWidth+'px';spotlight.style.height=innerHeight+'px';mask.setAttribute('width',innerWidth);mask.setAttribute('height',innerHeight);backdrop.setAttribute('width',innerWidth);backdrop.setAttribute('height',innerHeight);while(mask.children.length>1)mask.lastChild.remove();for(const rect of holes){if(rect.width<=0||rect.height<=0)continue;const cut=document.createElementNS(svgNS,'rect');cut.setAttribute('x',rect.left-6);cut.setAttribute('y',rect.top-6);cut.setAttribute('width',rect.width+12);cut.setAttribute('height',rect.height+12);cut.setAttribute('rx','12');cut.setAttribute('fill','#000');mask.append(cut);}shade.setAttribute('d','M0 0H'+innerWidth+'V'+innerHeight+'H0Z');
 hint.hidden=false;document.body.classList.toggle('instruction-path-guide',id==='instruction-path');placeHint(r,holes,dialog);
}
function block(id,floor){return document.querySelector('#roomDialog[open] [data-block="'+id+'"]')||document.querySelector('#roomSlots'+floor+' .unlock-room')}
const choice=document.createElement('dialog');choice.id='tutorialChoice';choice.setAttribute('aria-labelledby','tutorialChoiceTitle');
choice.innerHTML='<span class="eyebrow">YENİ BAŞLANGIÇ</span><h2 id="tutorialChoiceTitle">Kısa bir hatırlatma ister misin?</h2><p>Talimatları, blokları ve oyuncu geliştirmeyi birlikte gözden geçirelim.</p><button type="button" class="team-action" data-tutorial="yes">Evet, göster</button><button type="button" class="team-secondary" data-tutorial="no">Doğrudan oyna</button>';document.body.append(choice);
function chooseTutorial(enabled){const next=enabled?[]:['tap','arrival','blocks-basics','assistant','train','player-stats','match','quick-upgrade'];try{localStorage.setItem(key,JSON.stringify(next))}catch{}done.clear();next.forEach(id=>done.add(id));following=false;arrival=null;cooldown=0;choice.close();update();}
choice.querySelector('[data-tutorial=yes]').onclick=()=>chooseTutorial(true);choice.querySelector('[data-tutorial=no]').onclick=()=>chooseTutorial(false);choice.addEventListener('cancel',e=>{e.preventDefault();chooseTutorial(false)});
let incomeArrival=guideProgress.incomeAmount??null,incomeReceipts=0;
window.addEventListener('spiker-income-arrived',e=>{incomeArrival=e.detail.cash;incomeReceipts++;guideProgress.incomeAmount=incomeArrival;saveGuide();setTimeout(update,0);});
function incomeFlowTarget(){const workflow=document.getElementById('workflow'),tier=workflow?.querySelector('.tier[data-floor="2"]'),track=workflow?.querySelector('.energy-track');if(!tier||!track)return null;let region=document.getElementById('incomeTutorialFlow');if(!region){region=document.createElement('span');region.id='incomeTutorialFlow';region.setAttribute('aria-hidden','true');workflow.append(region);}const w=workflow.getBoundingClientRect(),t=tier.getBoundingClientRect(),f=track.getBoundingClientRect();Object.assign(region.style,{position:'absolute',pointerEvents:'none',left:(f.left-w.left-8)+'px',top:(t.top-w.top)+'px',width:(f.width+16)+'px',height:t.height+'px'});return region;}
window.addEventListener('spiker-media-opened',()=>{if(guided)endGuide(false);delete guideProgress.social;pausedGuides.delete('social');saveGuide();cooldown=0;GuidedTutorial.start([{id:'social-open',target:()=>document.getElementById('socialTab'),click:'#socialTab',done:()=>!document.getElementById('socialPanel').hidden,text:'Kulübünün paylaşımları için [[Sosyal]] düğmesine dokun.'}],()=>{cooldown=0;update();},'social-entry',{restart:true});update();});
function socialFollowerCount(){try{return Number(JSON.parse(localStorage.getItem('idle-spiker-social-v1')||'{}').earnedFollowers)||0;}catch{return 0;}}
function contextualGuide(){
const q=s=>document.querySelector(s),state=RoomSystem.tutorialState(),campSent=()=>RoomSystem.developmentState().camp.entries.some(e=>e.status==='running');
if(q('#campDialog[open]')&&visible(q('#campPanel'))&&!GuidedTutorial.completed('camp')&&!GuidedTutorial.paused('camp')){q('.camp-first-help')?.remove();q('#campDialog').classList.remove('camp-guiding');GuidedTutorial.start([
{id:'camp-players',allowNext:true,done:()=>!!q('#campSlots [data-state="selected"]')||campSent(),target:()=>visible(q('#campCandidates'))?q('#campCandidates'):q('.camp-overview'),text:'Gelişim sınırına yaklaşan oyuncularını kampa seç.'},
{id:'camp-cost',allowNext:true,done:campSent,target:()=>q('#campEntryCost'),text:'Kampın süresi ve gereken kaynaklar burada görünür.'},
{id:'camp-send',allowNext:true,done:campSent,target:()=>visible(q('#campEnroll'))?q('#campEnroll'):q('.camp-overview'),text:'Seçtiğin oyuncuları buradan gönder. Kamptayken yükseltilemezler.'},
{id:'camp-stars',target:()=>visible(q('#campSlots'))?q('#campSlots'):q('.camp-overview'),text:'Tamamlanan kamplar yıldızları doldurur ve gelişim sınırını artırır.'}
],null,'camp');return true;}
if(q('#playerDialog[open]')&&!GuidedTutorial.completed('skills')&&!GuidedTutorial.paused('skills')&&state.stage==='bal'){GuidedTutorial.start([
{id:'skill-unlocks',target:()=>q('#playerSkills'),text:'Yeteneklerin açılma koşulları burada yazar. Gizli yeteneğin kaç kamp sonra açılacağını kartından takip et.'}
],null,'skills');return true;}
const club=()=>!q('.dashboard').hidden&&!q('dialog[open]');if(state.stage==='bal'&&state.division!==3&&!state.openDepartments.includes(2)&&guideProgress.income==='done'){delete guideProgress.income;delete guideProgress.incomeAmount;incomeArrival=null;saveGuide();}
if(state.stage==='bal'&&state.division!==3&&club()&&!GuidedTutorial.completed('income')&&!GuidedTutorial.paused('income')){
const incomeInstructions=state.instructions;let incomeReceiptsBefore=incomeReceipts;
GuidedTutorial.start([
{id:'income-center',skip:()=>RoomSystem.tutorialState().openDepartments.includes(2),target:()=>q('.tier[data-floor="2"] .base-room'),click:'.department-buy[data-floor="2"]',done:()=>RoomSystem.tutorialState().openDepartments.includes(2),text:'[[Ücretsiz aç]] ile Gelir Merkezi’ni aç. Talimatlarla bütçe kazandırır.'},
{id:'income-open',skip:()=>RoomSystem.tutorialState().openDepartments.includes(2),target:()=>q('.department-buy[data-floor="2"]'),click:'.department-buy[data-floor="2"]',done:()=>RoomSystem.tutorialState().openDepartments.includes(2),text:'[[Ücretsiz aç]] ile Gelir Merkezi’ni etkinleştir.'},
{id:'income-send',target:()=>q('#energyButton'),click:'#energyButton',done:()=>RoomSystem.tutorialState().instructions>incomeInstructions,text:'[[Talimat ver]] düğmesine dokun. Talimatın Gelir Merkezi’ne gidişini izleyelim.'},
{id:'income-conversion',allowNext:true,enter:()=>{incomeReceiptsBefore=incomeReceipts;},done:()=>incomeReceipts>incomeReceiptsBefore,target:incomeFlowTarget,text:'Talimatlar buraya geldiğinde üretim ilerler. Şimdilik her 10 talimatta bütçe kazanıyorsun.'},
],null,'income');return true;}
if(!q('#socialPanel')?.hidden&&state.division===3&&!GuidedTutorial.completed('social')&&!GuidedTutorial.paused('social')){
const followersBefore=socialFollowerCount(),published=()=>socialFollowerCount()>followersBefore;
GuidedTutorial.start([
{id:'social-draft',allowNext:true,done:published,target:()=>q('#socialDraft'),text:'Kulübünün gönderileri burada hazırlanır.'},
{id:'social-publish',allowNext:true,target:()=>q('#socialPublish'),done:published,text:()=>q('#socialPublish')?.disabled?'Gönderiler arka planda hazırlanır. Hazır olduğunda buradan paylaşabilirsin.':'Gönderin hazır. [[Paylaş]] ile yayınlayabilirsin.'},
],null,'social');return true;}
let socialGrowth=false;try{const social=JSON.parse(localStorage.getItem('idle-spiker-social-v1')||'{}');socialGrowth=!!social.studio?.completedDraft&&social.earnedFollowers>0;}catch{}
if(!q('#socialPanel')?.hidden&&state.division===3&&socialGrowth&&!GuidedTutorial.completed('social-growth')&&!GuidedTutorial.paused('social-growth')){GuidedTutorial.start([
{id:'social-followers',target:()=>q('#socialTopFollowers'),text:'Takipçilerin burada görünür. Paylaşımlarla topluluğunu büyüt.'},
{id:'social-rewards',target:()=>q('#socialJourneyEntry'),done:()=>!q('#socialJourneyScreen')?.hidden,click:'#socialJourneyEntry',text:'Takipçi hedeflerini ve ödüllerini görmek için buraya dokun.'},
],null,'social-growth');return true;}
return false;
}
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&guided?.review){e.preventDefault();e.stopImmediatePropagation();endGuide(false);}},true);
function update(){
 if(document.getElementById('settingsDialog')?.open&&!guided?.review){clear();return;}
 for(const id of [...pausedGuides]){const away=id==='income'?document.querySelector('.dashboard').hidden:(id==='social'||id==='social-growth')?document.getElementById('socialPanel')?.hidden&&document.getElementById('socialJourneyScreen')?.hidden:id==='camp'?!document.getElementById('campDialog')?.open:id==='skills'?!document.getElementById('playerDialog')?.open:false;if(away)pausedGuides.delete(id);}

 if(document.getElementById('bootScreen')||document.hidden||window.BalTransition?.active||window.gameResetting||window.MatchGateway?.active()){clear();return}
 if(guided?.id==='income'&&RoomSystem.tutorialState().division===3)endGuide(false);
 if(guided&&((guided.id==='transfer'&&guided.index>0&&document.getElementById('teamPanel').hidden&&!document.querySelector('#scoutDialog[open],#transferCompareScreen[open],#transferReplaceScreen[open],#transferLineupPrompt[open]'))||(guided.id==='camp'&&!document.getElementById('campDialog')?.open)||(guided.id==='skills'&&!document.getElementById('playerDialog')?.open)||(guided.id==='income'&&document.querySelector('.dashboard').hidden)||((guided.id==='social'||guided.id==='social-growth')&&document.getElementById('socialPanel')?.hidden&&document.getElementById('socialJourneyScreen')?.hidden)))endGuide(false);
 if(guided){const step=guided.steps[guided.index];if(step.skip?.()||step.done?.()){nextGuide();return}if(step.wait||(step.ready&&!step.ready())){clear();return}const el=step.target();show('guided-'+step.id,typeof step.text==='function'?step.text():step.text,el);return}
 if(done.has('ask')&&RoomSystem.tutorialState().stage==='bal'){chooseTutorial(false);return;}
 if(done.has('ask')){clear();if(!choice.open&&!document.querySelector('dialog[open]'))choice.showModal();return}
 if(contextualGuide())return;
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
 show('instruction-path',arrival?(LeagueRules.config.bal?'Talimat Performans Merkezi’ne ulaştı. AP burada üretilir.':'Talimat Antrenman Sahası’na ulaştı. AP burada üretilir.'):'Talimatlar bu hat üzerinden departmanlara ulaşır.',document.querySelector('.tier[data-floor="0"] .base-room'));return
 }
 if(arrival&&!done.has('arrival')){if(Date.now()>arrival.until){finish('arrival');clear();cooldown=Date.now()+2500;return}if(club&&!modal){show('arrival','Talimat sahaya ulaştı: +'+arrival.ap.toLocaleString('tr-TR')+' Antrenman Puanı (AP). Talimatlarla departmanlardan kaynak ve avantaj kazan.',document.getElementById('roomAP'));return}}
 if(s.instructions<3&&!has('assistant')){clear();return}
 if(LeagueRules.config.bal&&club&&!modal&&!done.has('blocks-basics')){show('blocks-basics','Temeller kartındaki sekmelerden blok seç. [[Aç]] ve [[Yükselt]] ile bütçeni kullan.',document.querySelector('#roomSlots1 .foundation-block'));return}
 if(LeagueRules.config.bal&&!done.has('assistant')&&club&&!modal&&s.budget>=(LeagueRules.config.bal?100:10)){const tab=document.getElementById('foundation-tab-assistant');if(tab?.getAttribute('aria-selected')!=='true')tab?.click();show('assistant','[[Aç]] ile Otomatik Asistanı kur. Senin yerine talimat göndersin.',document.querySelector('.foundation-floor[data-id=assistant] .foundation-buy'));return}
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
 if(!modal){const button=active==='quick-upgrade'&&visible(target)&&viewportRect(target).height>0?target:[...document.querySelectorAll('.card-open-upgrade')].find(el=>{const r=el.getBoundingClientRect();return r.top>=0&&r.top<innerHeight&&r.width>0});if(button){show('quick-upgrade','[[Hızlı Yükselt]], AP harcayarak kartı doğrudan yükseltir.',button);return}}

 }
 const day=Number(document.getElementById('mobileDay').textContent.match(/\d+/)?.[0]||1);
 if(!done.has('match')&&progress.next&&progress.next.day-day<=1&&!modal){if(!document.getElementById('leaguePanel').hidden){if(document.getElementById('standingsPane').hidden)document.getElementById('standingsTab').click();show('match',LeagueRules.config.bal?'Takımının sıralamasını ve maç sonuçlarını buradan takip edebilirsin.':'Takımın son sırada. Kalan '+(progress.total-progress.played)+' maçta ilk 4’e yüksel.',document.querySelector('#standingsPane .standings-scroll'));return}show('match','Lig durumunu buradan görebilirsin.',document.getElementById('calendarTab'));return}
 clear();
}
setInterval(update,400);window.addEventListener('resize',update);window.addEventListener('scroll',update,{passive:true,capture:true});update();
})();
