(function(root){
'use strict';const key='idle-spiker-comfortaa-test-v1';let enabled=false;try{enabled=localStorage.getItem(key)==='on';}catch{}
function apply(value,broadcast=true){enabled=!!value;document.documentElement.classList.toggle('comfortaa-test',enabled);const button=document.getElementById('comfortaaToggle');if(button){button.textContent=enabled?'Açık':'Kapalı';button.setAttribute('aria-checked',String(enabled));}if(enabled)document.fonts?.load('14px Comfortaa').then(()=>root.MatchFrames?.invalidate()).catch(()=>{});root.MatchFrames?.invalidate();if(broadcast)for(const frame of document.querySelectorAll('iframe'))frame.contentWindow?.postMessage({type:'spiker-font-preview',value:enabled},'*');}
root.FontPreviewSettings={get enabled(){return enabled},set(value){try{localStorage.setItem(key,value?'on':'off');}catch{}apply(value);}};
apply(enabled,false);
addEventListener('message',event=>{if(event.source===parent&&parent!==root&&event.data?.type==='spiker-font-preview'&&typeof event.data.value==='boolean')apply(event.data.value);});
addEventListener('storage',event=>{if(event.key===key)apply(event.newValue==='on');});
document.addEventListener('load',event=>{if(event.target.tagName==='IFRAME')event.target.contentWindow?.postMessage({type:'spiker-font-preview',value:enabled},'*');},true);
function install(){const host=document.querySelector('#cheatDrawer .cheat-drawer-content');if(!host||document.getElementById('comfortaaToggle'))return;const row=document.createElement('div');row.className='settings-row';row.innerHTML='<span>Comfortaa fontu<small>Yeni yazı tipini dene</small></span><button id="comfortaaToggle" type="button" class="team-action" role="switch" aria-label="Comfortaa fontunu dene"></button>';host.append(row);row.querySelector('button').onclick=()=>root.FontPreviewSettings.set(!enabled);apply(enabled);}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',()=>setTimeout(install,0),{once:true});else setTimeout(install,0);
})(window);
