'use strict';
const $=id=>document.getElementById(id),STORE='idle-spiker-main-menu-v1';
let state=MenuState.normalize(null),storageAvailable=true;
try{state=MenuState.normalize(JSON.parse(localStorage.getItem(STORE)))}catch{storageAvailable=false}
const tiers=[...document.querySelectorAll('.tier:not([hidden])')],pulses=[],litUntil=new Array(tiers.length).fill(0);
let frame=0,toastTimer=0,completionTimer=0,calendarKey=null,activeCalendar=null;
const reducedMotion=window.matchMedia('(prefers-reduced-motion: reduce)');
function persist(){try{localStorage.setItem(STORE,JSON.stringify(state));storageAvailable=true}catch{storageAvailable=false}$('saveStatus').textContent=storageAvailable?'İlerleme kaydedildi.':'Kayıt izni yok. İlerlemen yalnızca bu oturumda saklanır.'}
function render(){window.LeagueSeason?.refresh?.(state);window.CampSystem?.advance(state.day);window.LeagueCalendar?.refresh(state);const limit=MenuState.dayLimit(),trigger=LeagueRules.config.matchTrigger||50;const day=state.day,clicks=state.clicksToday,week=MenuState.week(day),start=(week-1)*7+1;
 $('mobileCount').textContent=clicks;if($('mobileCount').nextSibling?.nodeType===3)$('mobileCount').nextSibling.textContent=' / '+limit+' · ';$('mobileDay').textContent=day+'. gün';$('calendarSummary').textContent=MenuState.dayName(day)+' · '+(MenuState.isMatchDay(day)?'Maç günü':'Hazırlık günü');$('weekLabel').textContent='HAFTA '+String(week).padStart(2,'0');
 const nextCalendarKey=day+':'+Array.from({length:7},(_,i)=>Number(MenuState.isMatchDay(start+i))).join('');
 if(calendarKey!==nextCalendarKey){calendarKey=nextCalendarKey;
 $('calendar').replaceChildren(...Array.from({length:7},(_,i)=>{const n=start+i,cell=document.createElement('div');cell.className='calendar-day'+(n<day?' past':'')+(n===day?' today':'')+(MenuState.isMatchDay(n)?' match':'');cell.setAttribute('aria-label',n+'. gün, '+MenuState.dayName(n)+(n===day?', bugün':'')+(MenuState.isMatchDay(n)?', maç günü':''));if(n===day)cell.setAttribute('aria-current','date');const name=document.createElement('small');name.textContent=['PZT','SAL','ÇAR','PER','CUM','CMT','PAZ'][i];const number=document.createElement('strong');number.textContent=String(n).padStart(2,'0');const fill=document.createElement('span');fill.className='calendar-fill';fill.style.height=(n<day?100:n===day?clicks/limit*100:0)+'%';cell.append(fill,name,number);if(n===day){cell.setAttribute('role','progressbar');cell.setAttribute('aria-valuemin','0');cell.setAttribute('aria-valuemax',limit);cell.setAttribute('aria-valuenow',clicks);cell.setAttribute('aria-valuetext',clicks+' / '+limit+' talimat');const amount=document.createElement('span');amount.className='calendar-cell-count';amount.textContent=clicks+'/'+limit;cell.append(amount);activeCalendar={cell,fill,amount}}return cell}));
 }
 if(activeCalendar){activeCalendar.fill.style.height=clicks/limit*100+'%';activeCalendar.cell.setAttribute('aria-valuenow',clicks);activeCalendar.cell.setAttribute('aria-valuetext',clicks+' / '+limit+' talimat');activeCalendar.amount.textContent=clicks+'/'+limit}
 const next=window.LeagueSeason?.progress?.().next;
 $('matchCountdown').textContent=window.LeagueSeason?(next?(next.day<day||next.day===day&&clicks>=trigger?'Maç hazır':next.day===day?(trigger-clicks)+' talimat sonra':(next.day-day)+' gün sonra'):'Sezon tamamlandı'):MenuState.isMatchDay(day)?(state.clicksToday<50?'Bugün · '+(50-state.clicksToday)+' talimat sonra':'Bugün · Maç zamanı'):(7-day%7)+' gün sonra';
}
function energize(index,now){const tier=tiers[index];litUntil[index]=Math.max(litUntil[index],now+450);tier.classList.add('energized');window.MenuFeedback?.floor(tier);tier.querySelector('.energy-status').lastChild.textContent=' Enerji alındı';}
function animate(now){const workflowBounds=$('workflow').getBoundingClientRect(),height=workflowBounds.height-20,top=workflowBounds.top;const crossings=tiers.map(t=>{const r=t.querySelector('.connector').getBoundingClientRect();return r.top-top+r.height/2});
 for(let i=0;i<pulses.length;i++){const pulse=pulses[i];const progress=Math.min(1,(now-pulse.start)/pulse.duration),y=pulse.timing&&!reducedMotion.matches?pulseY(pulse,now,height,crossings):progress*height;const entry=Math.min(1,(now-pulse.start)/(pulse.lead||1)),drawY=entry<1?pulse.originY:Math.max(pulse.originY||0,y),drawX=(pulse.originX-21)*(1-entry);pulse.node.style.transform='translate('+drawX+'px,'+drawY+'px)';for(let j=0;j<crossings.length;j++)if(!pulse.crossed.has(j)&&crossings[j]>=(pulse.originY||0)&&drawY>=crossings[j]){pulse.crossed.add(j);energize(j,now);if(tiers[j].dataset.floor==='2'&&pulse.cashGain){RoomSystem.applyBudget(pulse.cashGain);window.MenuFeedback?.applyCashFeedback?.(pulse.cashGain,tiers[j]);pulse.cashGain=null;}if(tiers[j].dataset.floor==='0'&&pulse.gain){RoomSystem.applyGain(pulse.gain);window.MenuFeedback?.applyGainFeedback(pulse.gain,tiers[j],pulse.completed);pulse.gain=null;}}if(now-pulse.start>=pulse.duration){if(pulse.gain){const training=tiers.find(t=>t.dataset.floor==='0');if(training){RoomSystem.applyGain(pulse.gain);window.MenuFeedback?.applyGainFeedback(pulse.gain,training,pulse.completed);pulse.gain=null}}if(pulse.cashGain){RoomSystem.applyBudget(pulse.cashGain);pulse.cashGain=null}pulse.node.remove();pulses.splice(i,1);i--}}
 let glowing=false;tiers.forEach((tier,i)=>{if(litUntil[i]>now)glowing=true;else if(litUntil[i]){tier.classList.remove('energized');tier.querySelector('.energy-status').lastChild.textContent=' Enerji bekliyor';litUntil[i]=0}});
 frame=pulses.length||glowing?requestAnimationFrame(animate):0;
}
function pulseY(pulse,now,height,crossings){const e=pulse.timing;let elapsed=now-pulse.start-(pulse.lead||0),previous=pulse.originY||0;const points=[...crossings.filter(y=>y>previous),height];pulse.duration=(pulse.lead||0)+e.travel+crossings.length*e.transition+e.rest;for(let i=0;i<points.length;i++){const next=points[i],duration=Math.max(0,(next-previous)/height*e.travel);if(elapsed<duration)return previous+(next-previous)*elapsed/duration;elapsed-=duration;if(i<crossings.length){if(elapsed<e.transition)return next;elapsed-=e.transition}previous=next}return height}
function addPulse(source='manual',gain=null,completed=false){const node=document.createElement('span');node.className='energy-pulse'+(source==='auto'?' auto-pulse':'');$('pulseLayer').append(node);pulses.push({node,originY:0,originX:21,lead:0,start:performance.now(),duration:reducedMotion.matches?450:1600,timing:RoomSystem.effects?.(),crossed:new Set(),gain:gain?.apReceived?null:gain,cashGain:gain?.cash&&!gain.cashReceived?gain:null,completed});if(!frame)frame=requestAnimationFrame(animate)}
function showToast(message){clearTimeout(toastTimer);$('toast').textContent=message;$('toast').classList.add('show');toastTimer=setTimeout(()=>$('toast').classList.remove('show'),2800)}
function dayComplete(result){const card=document.querySelector('.calendar-card');card.classList.remove('day-complete');void card.offsetWidth;card.classList.add('day-complete');clearTimeout(completionTimer);completionTimer=setTimeout(()=>card.classList.remove('day-complete'),850);showToast(result.completedDay===1?'İlk gün tamamlandı · +'+RoomSystem.dailyBudget()+' bütçe! Bloklarını geliştirebilirsin.':result.completedDay+'. gün tamamlandı. Yeni gün, yeni enerji!');if(result.matchDay){$('matchMessage').textContent=state.day+'. gün: Maç '+(LeagueRules.config.matchTrigger||50)+'. talimatta başlayacak.';if(!$('matchDialog').open)$('matchDialog').showModal()}}
function giveInstruction(source='manual'){if(window.BalTransition?.active||window.MatchGateway?.active())return;const result=MenuState.advance(state);state=result.state;const gain=RoomSystem.onClick(result.completed,source);persist();render();addPulse(source,gain,result.completed);window.MenuFeedback?.instruction(result.completed,state.clicksToday/MenuState.dayLimit()*100,source);if(result.completed)dayComplete(result);window.MatchGateway?.check(state)}
$('energyButton').addEventListener('click',()=>giveInstruction('manual'));
RoomSystem.setAutoClick?.(()=>giveInstruction('auto'));
for(const id of ['closeMatch','laterMatch'])$(id).addEventListener('click',()=>$('matchDialog').close());
$('matchDialog').addEventListener('close',()=>$('energyButton').focus());
window.addEventListener('storage',event=>{if(event.key===STORE){try{state=MenuState.normalize(JSON.parse(event.newValue));render()}catch{}}});
function stopMotion(){cancelAnimationFrame(frame);frame=0;for(const pulse of pulses)pulse.node.remove();pulses.length=0;for(const tier of tiers)tier.classList.remove('energized');litUntil.fill(0);clearTimeout(toastTimer);clearTimeout(completionTimer);$('toast').classList.remove('show');document.querySelector('.calendar-card').classList.remove('day-complete');}
window.MenuUI={refresh:render,stopMotion,loadStage(raw){stopMotion();clearInterval(testClicker);testClicker=null;if(btn)btn.textContent='Başlat';state=MenuState.normalize(raw);tiers.splice(0,tiers.length,...document.querySelectorAll('.tier:not([hidden])'));litUntil.splice(0,litUntil.length,...tiers.map(()=>0));calendarKey=null;activeCalendar=null;window.LeagueCalendar?.reset(state);render();}};render();for(const gain of RoomSystem.pendingGains?.()||[])addPulse(gain.source,gain,gain.completed);if(!storageAvailable)$('saveStatus').textContent='İlerleme bu oturumda tutulur.';

let testClicker = null;
const btn = document.getElementById('testAutoclicker');
if (btn) {
    btn.addEventListener('click', function() {
        if (testClicker) {
            clearInterval(testClicker);
            testClicker = null;
            this.textContent = 'Başlat';
        } else {
            testClicker = setInterval(() => document.getElementById('energyButton').click(), 50);
            this.textContent = 'Durdur';
        }
    });
}
