(function(){
'use strict';
const drawerOpen=new Map();
const storing=new WeakSet();
window.addEventListener('spiker-stage-changed',()=>drawerOpen.clear());
function update(state){
 if(state.stage!=='bal'||window.BalTransition?.active)return;
 for(const tier of document.querySelectorAll('.bal-tier')){
  const floor=tier.dataset.floor,base=tier.querySelector('.base-room'),groups=[...tier.querySelectorAll('.inherited-block-group')];
  for(const group of groups){
   if(!group.parentElement.classList.contains('foundation-drawer')){const shell=document.createElement('div');shell.className='foundation-drawer';shell.id='foundation-drawer-'+group.dataset.foundation;group.before(shell);shell.append(group);}
   const shell=group.parentElement;shell.classList.add('has-inherited-blocks');shell.classList.toggle('has-stored-blocks',group.classList.contains('stored-blocks'));shell.classList.toggle('has-stored-bal-blocks',group.classList.contains('stored-bal-blocks'));let pending=shell.parentElement.querySelector('.foundation-pending[data-foundation="'+group.dataset.foundation+'"]');
   if(!pending){pending=document.createElement('section');pending.className='foundation-pending';pending.dataset.foundation=group.dataset.foundation;pending.setAttribute('aria-label','Geliştirilmeyi bekleyen önceki aşama blokları');shell.before(pending);}
   for(const card of [...group.children]){const room=RoomRules.catalog.find(r=>r.id===card.dataset.id);if(room&&RoomRules.count(state,room.id)<RoomRules.maxLevel(state,room)&&!(state.division>=3&&room.bal))pending.append(card);}
   for(const card of [...pending.children]){const room=RoomRules.catalog.find(r=>r.id===card.dataset.id);if(!room||RoomRules.count(state,room.id)<RoomRules.maxLevel(state,room)&&!(state.division>=3&&room.bal)||storing.has(card))continue;storing.add(card);
    const depth={position:card.style.position,zIndex:card.style.zIndex};card.style.position='relative';card.style.zIndex='15';base.style.position='relative';base.style.zIndex='20';
    const animation=card.animate(CardMotion.frames(card,base),CardMotion.options());
    animation.finished.catch(()=>{}).then(()=>{storing.delete(card);if(!card.isConnected)return;group.append(card);animation.cancel();card.style.position=depth.position;card.style.zIndex=depth.zIndex;pending.hidden=!pending.children.length;update(state);});
   }
   pending.hidden=!pending.children.length;shell.hidden=!group.children.length;const count=group.children.length;group.style.setProperty('--stored-count',count);shell.style.setProperty('--stored-count',count);
  }
  const drawers=[...tier.querySelectorAll('.foundation-drawer')].filter(d=>!d.hidden);let toggle=base.querySelector('.foundation-toggle');if(!drawers.length){toggle?.remove();base.classList.remove('has-foundation-toggle');continue;}
  if(!toggle){toggle=document.createElement('button');toggle.type='button';toggle.className='foundation-toggle';toggle.innerHTML='<span>Önceki aşama</span><b aria-hidden="true">›</b>';base.append(toggle);}
  base.classList.add('has-foundation-toggle');toggle.setAttribute('aria-controls',drawers.map(d=>d.id).join(' '));
  function show(open){toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label','Önceki aşama bloklarını '+(open?'gizle':'göster'));for(const shell of drawers){if(!open&&shell.contains(document.activeElement))toggle.focus({preventScroll:true});shell.inert=!open;shell.setAttribute('aria-hidden',String(!open));shell.dataset.open=String(open);}}
  toggle.onclick=()=>{const open=!drawerOpen.get(floor);drawerOpen.set(floor,open);show(open);window.GameAudio?.uiClick?.();};show(!!drawerOpen.get(floor));
 }
}
function create(floor,perform,state){
 const rooms=RoomRules.catalog.filter(r=>r.floor===floor&&r.id!=='offline_time'&&(!r.bal||state?.division>=3&&!r.division));if(!rooms.length)return null;
 const group=document.createElement('section');group.className='foundation-block inherited-block-group';group.dataset.foundation=floor;group.style.setProperty('--stored-count',rooms.length);group.setAttribute('aria-label','Önceki aşamadan gelen bloklar');
 for(const r of rooms){const card=document.createElement('button');card.type='button';card.className='room-tile purchased-room upgrade-room room-'+r.id;card.dataset.id=r.id;const icon=document.createElement('span'),title=document.createElement('strong'),description=document.createElement('small'),badge=document.createElement('span');icon.className='slot-icon';icon.textContent=r.icon;title.textContent=r.name;badge.className='room-active';card.append(icon,title,description,badge);card.onclick=()=>{if(perform(r)){window.GameAudio?.uiClick?.();update(RoomSystem.snapshot());}};group.append(card);}
 return group;
}
function describe(r,n,state=RoomSystem.snapshot()){const v=r.values[Math.max(0,n-1)],fmt=x=>NumberUI.exact(x);if(r.id==='assistant'){const a=BalRules.previewLevel(state,r,0),b=BalRules.previewLevel(state,r,n);return fmt(RoomRules.effects(b).autoRate-RoomRules.effects(a).autoRate)+' talimat/sn. otomatik.';}if(r.id==='coordinate'){const a=BalRules.previewLevel(state,r,0),b=BalRules.previewLevel(state,r,n);return 'Ücretsiz yükseltme şansı: %'+fmt(RoomRules.freeTrainingChance(a)*100)+' → %'+fmt(RoomRules.freeTrainingChance(b)*100)+'.';}if(r.id==='warmup')return 'Her talimata +'+fmt(v*2.5)+' AP.';if(r.id==='steady')return 'Her 10 otomatik talimata +'+fmt(v*1.25)+' AP.';if(r.id==='echo')return 'Her 5 talimata +'+fmt(v*1.25)+' AP.';if(r.id==='meal')return 'Gün sonunda +'+fmt(v*1.25*SeasonClock.economyScale(state))+' AP.';if(r.id==='energy_drink')return 'İlk '+SeasonClock.morningInstructions(state)+' talimata +'+fmt(v*1.25)+' AP.';if(r.id==='sugar_boost'){const share=n=>{const e=RoomRules.effects(BalRules.previewLevel(state,r,n));return fmt(e.offlineEfficiency*(1+e.offlineBonus)*100)};return 'Vardiyada çevrimdışı AP payı: %'+share(0)+' → %'+share(n)+'.';}if(r.id==='crit_smash'){const a=RoomRules.effects(BalRules.previewLevel(state,r,0)),b=RoomRules.effects(BalRules.previewLevel(state,r,n));return 'Kritik AP şansı: %'+fmt(a.critChance*100)+' → %'+fmt(b.critChance*100)+'. Kritik talimat '+fmt(b.critMult)+' kat AP verir.';}return r.describe(v);}
window.FoundationBlocks={create,update,describe};
})();
