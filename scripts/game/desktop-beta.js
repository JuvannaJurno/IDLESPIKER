(function(){
'use strict';
const club=document.getElementById('clubPanel'),calendar=document.getElementById('calendarPanel');
const toolbar=document.createElement('section');toolbar.className='beta-toolbar';toolbar.setAttribute('aria-label','Kulüp kaynakları ve talimat');
const title=document.createElement('h1');title.className='beta-page-title';title.textContent='Kulüp merkezi';toolbar.append(title);
const wallet=club.querySelector('.club-wallet');if(wallet)toolbar.append(wallet);
const command=document.querySelector('.energy-dock')||document.createElement('div');command.classList.add('beta-command');const energy=document.getElementById('energyButton');if(energy)command.append(energy);toolbar.append(command);
const overview=document.createElement('section');overview.className='beta-overview';overview.setAttribute('aria-label','Takvim ve sıradaki karşılaşma');if(calendar)overview.append(calendar);const league=club.querySelector('.league-match-group');if(league)overview.append(league);
const notices=document.createElement('section');notices.className='beta-notices';notices.setAttribute('aria-label','Kamp ve vardiya');for(const selector of ['#campAlert','.shift-summary']){const item=club.querySelector(selector);if(item)notices.append(item);}
const workspace=document.createElement('section');workspace.className='beta-workspace';workspace.setAttribute('aria-label','Departmanlar ve talimat hattı');
const buildingHeader=club.querySelector('.building-header'),rates=club.querySelector('.club-rates');if(buildingHeader&&rates)buildingHeader.insertBefore(rates,buildingHeader.lastElementChild);
for(const selector of ['.building-header','.building-scroll','.building-footer','.boost-panel']){const item=club.querySelector(selector);if(item)workspace.append(item);}
club.prepend(toolbar,overview,notices);club.append(workspace);
function noticeVisibility(){notices.hidden=![...notices.children].some(item=>!item.hidden&&getComputedStyle(item).display!=='none'&&(item.id==='campAlert'||[...item.children].some(child=>!child.hidden&&getComputedStyle(child).display!=='none')));}
const noticeObserver=new MutationObserver(noticeVisibility);for(const item of notices.children)noticeObserver.observe(item,{attributes:true,attributeFilter:['hidden'],subtree:true});noticeVisibility();
const topbar=document.querySelector('.topbar'),nav=document.querySelector('.mobile-nav'),actions=topbar.querySelector('.topbar-actions')||topbar.querySelector('#settingsButton');
const navSlot=document.createElement('div');navSlot.className='beta-navigation';if(nav)navSlot.append(nav);topbar.insertBefore(navSlot,actions);
const wordmark=topbar.querySelector('.wordmark small');if(wordmark)wordmark.textContent='VOLEYBOL KULÜBÜ · BETA';
const original=document.createElement('a');original.className='beta-original';original.href='index.html';original.textContent='Mobil görünüm ↗';topbar.append(original);
function selectTab(){const target=document.body.classList.contains('team-open')?'#teamTab':document.body.classList.contains('social-open')?'#socialTab':document.body.classList.contains('calendar-open')?'#calendarTab':'.mobile-nav a[href="#clubPanel"]';for(const link of nav?.querySelectorAll('a')||[])link.dataset.betaCurrent=String(link.matches(target));}
new MutationObserver(selectTab).observe(document.body,{attributes:true,attributeFilter:['class']});selectTab();
// Use the same working game elements; invalidate their cached screen coordinates once after placement.
dispatchEvent(new Event('resize'));
const boot=new MutationObserver(()=>{if(document.getElementById('bootScreen'))return;boot.disconnect();setTimeout(()=>{if(!document.querySelector('dialog[open]'))scrollTo({top:0,behavior:'instant'});},100);});boot.observe(document.body,{childList:true});
})();
