(function(root){
'use strict';const key='idle-spiker-rival-intro-v1';let enabled=false;try{enabled=localStorage.getItem(key)==='on';}catch{}
function update(){const b=document.getElementById('rivalIntroToggle');if(b){b.textContent=enabled?'Açık':'Kapalı';b.setAttribute('aria-checked',String(enabled));}root.dispatchEvent(new Event('spiker-rival-intro-setting'));root.MatchFrames?.invalidate();for(const frame of document.querySelectorAll('iframe'))frame.contentWindow?.postMessage({type:'spiker-rival-intro',value:enabled},'*');}
root.RivalIntroSettings={get enabled(){return enabled},set(value){enabled=!!value;try{localStorage.setItem(key,enabled?'on':'off');}catch{}update();}};
addEventListener('storage',e=>{if(e.key===key){enabled=e.newValue==='on';update();}});
addEventListener('message',e=>{if(e.source===parent&&e.data?.type==='spiker-rival-intro'&&typeof e.data.value==='boolean'){enabled=e.data.value;update();}});
document.addEventListener('DOMContentLoaded',()=>{const host=document.querySelector('#cheatDrawer .cheat-drawer-content');if(!host)return;const row=document.createElement('div');row.className='settings-row';row.innerHTML='<span>Oyuncu tanıtımları<small>Özel rakipleri sahada tanıt</small></span><button id="rivalIntroToggle" type="button" class="team-action" role="switch" aria-label="Sahada oyuncu tanıtımları"></button>';host.append(row);row.querySelector('button').onclick=()=>root.RivalIntroSettings.set(!enabled);update();});
})(window);
