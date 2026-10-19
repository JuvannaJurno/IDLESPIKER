(function(){
'use strict';
const offsets=new WeakMap();
const selector='.close-dialog,#closeCamp,#transferBack,.screen-back,.back-button,.dialog-back,button[id^="close"],button[id$="Back"],button[aria-label*="kapat" i],button[aria-label*="geri" i]';
function transferRail(dialog){if(dialog.id!=='scoutDialog')return;const back=dialog.querySelector('#transferBack'),close=dialog.querySelector('.close-dialog');if(!back||!close)return;let rail=dialog.querySelector('.transfer-nav-rail');if(!rail){rail=document.createElement('div');rail.className='transfer-nav-rail';dialog.prepend(rail);}if(back.parentElement!==rail)rail.append(back);if(close.parentElement!==rail)rail.append(close);}
function pin(dialog){
 if(!(dialog instanceof HTMLDialogElement))return;
 transferRail(dialog);
 for(const button of dialog.querySelectorAll(selector)){
  if(button.textContent.trim().length>2&&!button.matches('.close-dialog,#transferBack,.screen-back,.back-button,.dialog-back'))continue;
  button.classList.add('dialog-nav-control');
  if(button.parentElement.classList.contains('transfer-nav-rail')){button.style.removeProperty('translate');offsets.delete(button);continue;}
  const previous=offsets.get(button)||0;
  if(!dialog.open||!button.getClientRects().length){button.style.removeProperty('translate');offsets.delete(button);continue;}
  const rect=button.getBoundingClientRect(),top=dialog.getBoundingClientRect().top+14;
  // Work in viewport coordinates so header buttons and direct children behave alike.
  const shift=getComputedStyle(button).position==='absolute'?top-(rect.top-previous):Math.max(0,top-(rect.top-previous));
  if(shift!==previous)button.style.translate=shift?'0 '+shift+'px':'';
  offsets.set(button,shift);button.style.zIndex='50';
 }
}
let scheduled=false;function refresh(){if(scheduled)return;scheduled=true;requestAnimationFrame(()=>{scheduled=false;document.querySelectorAll('dialog[open]').forEach(pin);});}
document.addEventListener('scroll',event=>{const d=event.target instanceof Element?event.target.closest('dialog'):null;if(d)pin(d);},true);
document.addEventListener('toggle',event=>pin(event.target),true);
document.addEventListener('close',event=>pin(event.target),true);
document.addEventListener('click',refresh);window.addEventListener('resize',refresh);
new MutationObserver(records=>{for(const record of records)if(record.target instanceof HTMLDialogElement)pin(record.target);}).observe(document.documentElement,{subtree:true,attributes:true,attributeFilter:['open']});
})();
