(function(){
'use strict';
const drawerOpen=new Map();
window.addEventListener('spiker-stage-changed',()=>drawerOpen.clear());
function update(state){
 if(state.stage!=='bal'||window.BalTransition?.active)return;
 for(const tier of document.querySelectorAll('.bal-tier')){
  const floor=tier.dataset.floor,base=tier.querySelector('.base-room'),groups=[...tier.querySelectorAll('.inherited-block-group')];
  for(const group of groups)if(!group.parentElement.classList.contains('foundation-drawer')){const shell=document.createElement('div');shell.className='foundation-drawer';shell.id='foundation-drawer-'+group.dataset.foundation;shell.style.setProperty('--stored-count',group.children.length);group.before(shell);shell.append(group);}
  const drawers=[...tier.querySelectorAll('.foundation-drawer')];let toggle=base.querySelector('.foundation-toggle');if(!drawers.length){toggle?.remove();continue;}
  if(!toggle){toggle=document.createElement('button');toggle.type='button';toggle.className='foundation-toggle';toggle.innerHTML='<span>Önceki aşama</span><b aria-hidden="true">›</b>';base.append(toggle);}
  toggle.setAttribute('aria-controls',drawers.map(d=>d.id).join(' '));
  function show(open){toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label','Önceki aşama bloklarını '+(open?'gizle':'göster'));for(const shell of drawers){if(!open&&shell.contains(document.activeElement))toggle.focus({preventScroll:true});shell.inert=!open;shell.setAttribute('aria-hidden',String(!open));shell.dataset.open=String(open);}}
  toggle.onclick=()=>{const open=!drawerOpen.get(floor);drawerOpen.set(floor,open);show(open);window.GameAudio?.uiClick?.();};show(!!drawerOpen.get(floor));
 }
}
function create(floor,perform){
 const rooms=RoomRules.catalog.filter(r=>r.floor===floor&&!r.bal);if(!rooms.length)return null;
 const group=document.createElement('section');group.className='foundation-block inherited-block-group';group.dataset.foundation=floor;group.style.setProperty('--stored-count',rooms.length);group.setAttribute('aria-label','Önceki aşamadan gelen bloklar');
 for(const r of rooms){const card=document.createElement('button');card.type='button';card.className='room-tile purchased-room upgrade-room room-'+r.id;card.dataset.id=r.id;const icon=document.createElement('span'),title=document.createElement('strong'),description=document.createElement('small'),badge=document.createElement('span');icon.className='slot-icon';icon.textContent=r.icon;title.textContent=r.name;badge.className='room-active';card.append(icon,title,description,badge);card.onclick=()=>{if(perform(r))window.GameAudio?.uiClick?.();};group.append(card);}
 return group;
}
function describe(r,n){const v=r.values[Math.max(0,n-1)],fmt=x=>NumberUI.compact(x);if(r.id==='assistant')return fmt(v*2)+' otomatik talimat/sn.';if(r.id==='warmup')return 'Her talimata +'+fmt(v*2.5)+' AP.';if(r.id==='steady')return 'Her 10 otomatik talimata +'+fmt(v*1.25)+' AP.';if(r.id==='echo')return 'Her 5 talimata +'+fmt(v*1.25)+' AP.';if(r.id==='meal')return 'Gün sonunda +'+fmt(v*1.25)+' AP.';if(r.id==='energy_drink')return 'İlk 20 talimata +'+fmt(v*1.25)+' AP.';if(r.id==='sugar_boost')return 'Çevrimdışı AP +%'+fmt(v*125)+'.';return r.describe(v);}
window.FoundationBlocks={create,update,describe};
})();
