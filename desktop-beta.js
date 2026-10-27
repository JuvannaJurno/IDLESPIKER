(function(){
'use strict';
const club=document.getElementById('clubPanel'),calendar=document.getElementById('calendarPanel');
const sidebar=document.createElement('aside');sidebar.className='beta-sidebar';sidebar.setAttribute('aria-label','Kulüp özeti');
const workspace=document.createElement('section');workspace.className='beta-workspace';workspace.setAttribute('aria-label','Departmanlar ve talimat hattı');
club.prepend(sidebar);if(calendar)sidebar.append(calendar);
for(const selector of ['.league-match-group','#campAlert','.shift-summary','.club-wallet','.club-rates']){const item=club.querySelector(selector);if(item)sidebar.append(item);}
for(const selector of ['.building-header','.building-scroll','.building-footer','.boost-panel']){const item=club.querySelector(selector);if(item)workspace.append(item);}
club.append(workspace);
const wordmark=document.querySelector('.wordmark small');if(wordmark)wordmark.textContent='VOLEYBOL KULÜBÜ · MASAÜSTÜ BETA';
const original=document.createElement('a');original.className='beta-original';original.href='index.html';original.textContent='Mobil sürüme dön ↗';document.querySelector('.topbar').append(original);
const nav=document.querySelector('.mobile-nav');nav?.setAttribute('aria-label','Masaüstü gezinme');
// Existing landing actions remain available when the user clicks Club; start the beta at its overview.
const boot=new MutationObserver(()=>{if(document.getElementById('bootScreen'))return;boot.disconnect();setTimeout(()=>{if(!document.querySelector('dialog[open]'))scrollTo({top:0,behavior:'instant'});},100);});boot.observe(document.body,{childList:true});
})();
