(function(){
'use strict';
const key='idle-spiker-theme-v1',root=document.documentElement;
let theme='light';try{if(localStorage.getItem(key)==='dark')theme='dark'}catch{}
function apply(){root.dataset.theme=theme;root.style.colorScheme=theme;document.querySelector('meta[name="theme-color"]')?.setAttribute('content',theme==='dark'?'#192d31':'#72c8e5');}
apply();
document.addEventListener('DOMContentLoaded',()=>{
 const row=document.createElement('div');row.className='settings-row';
 const label=document.createElement('span');label.textContent='Koyu tema';label.id='themeLabel';
 const toggle=document.createElement('button');toggle.type='button';toggle.id='themeToggle';toggle.className='theme-switch';toggle.setAttribute('role','switch');toggle.setAttribute('aria-labelledby','themeLabel');
 const knob=document.createElement('span');knob.setAttribute('aria-hidden','true');toggle.append(knob);
 function sync(){toggle.setAttribute('aria-checked',String(theme==='dark'));toggle.title=theme==='dark'?'Açık temaya geç':'Koyu temaya geç';}
 toggle.onclick=()=>{theme=theme==='dark'?'light':'dark';try{localStorage.setItem(key,theme)}catch{}apply();sync();};
 row.append(label,toggle);document.querySelector('#settingsDialog h2')?.after(row);sync();
 window.addEventListener('storage',e=>{if(e.key===key){theme=e.newValue==='dark'?'dark':'light';apply();sync();}});
});
})();
