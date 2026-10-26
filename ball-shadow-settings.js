(function(root){
'use strict';const key='idle-spiker-ball-shadow-color-v1';let color='black';try{if(localStorage.getItem(key)==='red')color='red';}catch{}
function update(){const b=document.getElementById('ballShadowToggle');if(b){b.textContent=color==='red'?'Kırmızı':'Siyah';b.setAttribute('aria-checked',String(color==='red'));}root.MatchFrames?.invalidate();for(const frame of document.querySelectorAll('iframe'))frame.contentWindow?.postMessage({type:'spiker-shadow-color',value:color},'*');}
root.BallShadowSettings={get color(){return color},get ink(){return color==='red'?'#d9333e':'#000000'},set(value){if(!['black','red'].includes(value))return false;color=value;try{localStorage.setItem(key,color);}catch{}update();return true;}};
addEventListener('storage',e=>{if(e.key===key){color=e.newValue==='red'?'red':'black';update();}});
addEventListener('message',e=>{if(e.source===parent&&e.data?.type==='spiker-shadow-color'&&['black','red'].includes(e.data.value)){color=e.data.value;update();}});
document.addEventListener('DOMContentLoaded',()=>{const host=document.querySelector('#cheatDrawer .cheat-drawer-content');if(!host)return;const row=document.createElement('div');row.className='settings-row';row.innerHTML='<span>Top gölgesi<small>Deneme rengi · Siyah / Kırmızı</small></span><button id="ballShadowToggle" type="button" class="team-action" role="switch" aria-label="Kırmızı top gölgesi"></button>';host.append(row);row.querySelector('button').onclick=()=>root.BallShadowSettings.set(color==='red'?'black':'red');update();});
})(window);
