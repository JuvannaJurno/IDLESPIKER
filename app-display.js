(function(){
'use strict';
let installPrompt=null,installed=false,busy=false;
const standalone=matchMedia('(display-mode: standalone)'),fullscreen=matchMedia('(display-mode: fullscreen)');
const appMode=()=>installed||standalone.matches||(fullscreen.matches&&!fullElement())||navigator.standalone===true;
const fullElement=()=>document.fullscreenElement||document.webkitFullscreenElement;
const supported=()=>!!((document.fullscreenEnabled&&document.documentElement.requestFullscreen)||(document.webkitFullscreenEnabled&&document.documentElement.webkitRequestFullscreen));
let toggle,install,status,matchButton,help;
function update(){
 if(!toggle)return;
 const active=!!fullElement();
 toggle.disabled=busy||!supported();toggle.textContent=active?'Tam ekrandan çık':'Tam ekran';toggle.setAttribute('aria-pressed',String(active));
 matchButton.hidden=!supported();matchButton.disabled=busy;const label=active?'Tam ekrandan çık':'Tam ekran';matchButton.title=label;matchButton.setAttribute('aria-label',label);matchButton.innerHTML='<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="'+(active?'M4 9h5V4m11 5h-5V4M4 15h5v5m11-5h-5v5':'M9 4H4v5m11-5h5v5M4 15v5h5m11-5v5h-5')+'"/></svg>';matchButton.setAttribute('aria-pressed',String(active));
 install.disabled=appMode()||busy;install.textContent=appMode()?(installed?'Ana ekrana eklendi':'Uygulama olarak açık'):installPrompt?'Yükle':'Nasıl eklenir?';
}
function notice(text){status.textContent=text;}
async function toggleFullscreen(){
 if(busy)return;busy=true;update();
 try{
  // Call within the user's click; deferring the request loses browser activation.
  if(fullElement()){const exit=document.exitFullscreen||document.webkitExitFullscreen;await exit.call(document);}
  else if(supported()){const request=document.documentElement.requestFullscreen||document.documentElement.webkitRequestFullscreen;await request.call(document.documentElement,{navigationUI:'hide'});}
  else notice('Bu tarayıcıda ana ekrana ekleyerek adres çubuğu olmadan oynayabilirsin.');
 }catch{notice('Tam ekran açılamadı. Yeniden deneyebilir veya ana ekrana ekleyebilirsin.');}
 finally{busy=false;update();}
}
addEventListener('beforeinstallprompt',event=>{event.preventDefault();installPrompt=event;update();});
addEventListener('appinstalled',()=>{installPrompt=null;installed=true;update();if(status)notice('Idle Spiker ana ekranına eklendi.');});
document.addEventListener('fullscreenchange',update);document.addEventListener('webkitfullscreenchange',update);
standalone.addEventListener('change',update);fullscreen.addEventListener('change',update);
document.addEventListener('DOMContentLoaded',()=>{
 const settings=document.getElementById('settingsDialog');if(!settings)return;
 const group=document.createElement('section');group.className='settings-group';group.id='appDisplaySettings';
 group.innerHTML='<h3>Ekran ve uygulama</h3><div class="settings-row"><span>Tam ekran</span><button type="button" id="fullscreenToggle" class="team-action" aria-pressed="false">Tam ekran</button></div><div class="settings-row"><span>Ana ekrana ekle</span><button type="button" id="installApp" class="team-action">Nasıl eklenir?</button></div><p id="appDisplayStatus" class="app-display-status" role="status" aria-live="polite"></p>';
 settings.querySelector('h2').after(group);toggle=group.querySelector('#fullscreenToggle');install=group.querySelector('#installApp');status=group.querySelector('#appDisplayStatus');
 toggle.onclick=toggleFullscreen;
 matchButton=document.createElement('button');matchButton.type='button';matchButton.id='matchFullscreen';matchButton.className='match-fullscreen';matchButton.onclick=toggleFullscreen;
 document.querySelector('.match-shellbar').append(matchButton);
 install.onclick=async()=>{
  if(busy||appMode())return;
  if(installPrompt){const prompt=installPrompt;installPrompt=null;busy=true;update();try{await prompt.prompt();const choice=await prompt.userChoice;notice(choice.outcome==='accepted'?'Kurulumu tarayıcından tamamlayabilirsin.':'İstersen daha sonra yeniden ekleyebilirsin.');}catch{showHelp();}finally{busy=false;update();}}
  else showHelp();
 };
 function showHelp(){
  if(!help){
   help=GameUI.selection({id:'installAppHelp',title:'Ana ekrana ekle',eyebrow:'IDLE SPIKER',content:'<p>Ana ekranındaki simgeden açtığında tarayıcının adres çubuğu görünmez.</p><ol id="installAppSteps"></ol>',returnFocus:'installApp'});
   help.dialog.classList.add('app-install-help');help.dialog.querySelector('footer span').hidden=true;
  }
  const steps=help.dialog.querySelector('#installAppSteps');steps.replaceChildren();
  const ios=/iPad|iPhone|iPod/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
  const items=location.protocol==='file:'?['Oyunu web adresinden tarayıcında aç.','Tarayıcının menüsünden Ana ekrana ekle seçeneğini kullan.']:ios?['Oyunu Safari’de aç; menüden Paylaş’a dokun.','Ana Ekrana Ekle’yi seç. Varsa Web Uygulaması Olarak Aç seçeneğini açık bırak.','Ekle’ye dokun; oyunu ana ekranındaki simgeden aç.']:['Tarayıcının menüsünü aç.','Uygulamayı yükle veya Ana ekrana ekle seçeneğine dokun.','Oyunu eklenen Idle Spiker simgesinden aç.'];
  for(const text of items){const li=document.createElement('li');li.textContent=text;steps.append(li);}help.open();
 }
 update();if(!supported()&&!appMode())notice('Adres çubuğunu gizlemek için ana ekrana ekleyebilirsin.');
});
})();
