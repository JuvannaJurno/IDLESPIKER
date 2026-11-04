/* A dormant Cheats entry. No simulation, art loading or timers until explicitly opened. */
(function(){
'use strict';
let dialog=null,frame=null,returnFocus=null;
function close(){
 if(!dialog)return;
 const current=dialog;dialog=null;
 if(frame){frame.removeAttribute('src');frame.remove();frame=null;}
 if(current.open)current.close();current.remove();returnFocus?.focus({preventScroll:true});
}
function open(button){
 if(dialog)return;returnFocus=button;
 if(!document.getElementById('secretVolleyLauncherStyle')){
  const style=document.createElement('style');style.id='secretVolleyLauncherStyle';
  style.textContent='#secretVolleyDialog{position:fixed;inset:0;margin:0 auto;padding:0;width:100%;max-width:none;height:100dvh;max-height:none;border:0;border-radius:0;background:#83b5bd;overflow:hidden;box-shadow:none}#secretVolleyDialog::backdrop{background:#294e54}#secretVolleyDialog iframe{display:block;width:100%;height:100%;border:0;background:#83b5bd}';document.head.append(style);
 }
 dialog=document.createElement('dialog');dialog.id='secretVolleyDialog';dialog.setAttribute('aria-label','Gizli voleybol mini oyunu');
 frame=document.createElement('iframe');frame.title='Karşılıklı saha';frame.setAttribute('allow','fullscreen');frame.src='secret-volley.html?v=playable-2';
 dialog.append(frame);document.body.append(dialog);dialog.addEventListener('cancel',e=>{e.preventDefault();close();});dialog.addEventListener('close',close,{once:true});dialog.showModal();
}
addEventListener('message',e=>{if(frame&&e.source===frame.contentWindow&&e.data?.type==='spiker-secret-volley'&&e.data.action==='close')close();});
document.addEventListener('DOMContentLoaded',()=>{
 const host=document.querySelector('#cheatDrawer .cheat-drawer-content');if(!host)return;
 const row=document.createElement('div');row.className='settings-row';
 const label=document.createElement('span');label.textContent='Gizli salon · Karşılıklı saha';
 const button=document.createElement('button');button.type='button';button.id='openSecretVolley';button.className='team-secondary';button.style.cssText='width:auto;min-width:72px;margin:0';button.textContent='Oyna';button.onclick=()=>open(button);row.append(label,button);host.append(row);
});
})();
