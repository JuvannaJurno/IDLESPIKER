(function(){
'use strict';
let installPrompt=null,installed=false,busy=false;
const standalone=matchMedia('(display-mode: standalone)'),fullscreen=matchMedia('(display-mode: fullscreen)');
const appMode=()=>installed||standalone.matches||(fullscreen.matches&&!fullElement())||navigator.standalone===true;
const fullElement=()=>document.fullscreenElement||document.webkitFullscreenElement;
const supported=()=>!!((document.fullscreenEnabled&&document.documentElement.requestFullscreen)||(document.webkitFullscreenEnabled&&document.documentElement.webkitRequestFullscreen));
let toggle,install,status,matchButton,help;
let viewportFrame=0;
function fitViewport(){
 const root=document.documentElement,v=window.visualViewport,unzoomed=v&&Math.abs(v.scale-1)<.01;
 const width=unzoomed?Math.min(innerWidth,v.width):innerWidth,height=unzoomed?Math.min(innerHeight,v.height):innerHeight;
 const top=unzoomed?v.offsetTop:0,left=unzoomed?v.offsetLeft:0;
 const values={'--app-view-height':height,'--app-view-width':width,'--app-view-top':top,'--app-view-left':left,'--app-view-bottom':Math.max(0,innerHeight-height-top),'--app-view-right':Math.max(0,innerWidth-width-left)};
 // Read the complete layout before changing any CSS variables/classes.
 const nav=document.querySelector('.mobile-nav'),energy=document.querySelector('.energy-button'),group=document.querySelector('.league-match-group'),calendar=document.querySelector('.calendar-card'),camp=document.getElementById('campAlert');
 const navRect=nav?.getBoundingClientRect(),energyRect=energy?.getBoundingClientRect(),groupRect=group?.getBoundingClientRect(),calendarRect=calendar?.getBoundingClientRect(),campRect=camp?.getBoundingClientRect();
 const shown=r=>!!(r&&(r.width||r.height));
 values['--app-nav-height']=Math.ceil(navRect?.height||0);values['--app-energy-height']=Math.ceil(energyRect?.height||0);
 const dock=shown(energyRect)?energyRect:navRect;if(dock)values['--app-dock-clearance']=Math.ceil(innerHeight-dock.top+16);
 const fit=!!(shown(groupRect)&&shown(calendarRect)&&!shown(campRect)&&height>=568&&shown(energyRect));
 if(fit)values['--app-overview-height']=Math.max(160,Math.floor(energyRect.top-(groupRect.top+scrollY)-8));
 const frame=document.getElementById('gameMatchFrame'),bar=document.querySelector('.match-shellbar');let controlsWidth=null;
 if(frame?.contentWindow&&bar){const rects=[...bar.querySelectorAll('button')].map(b=>b.getBoundingClientRect()).filter(shown);controlsWidth=Math.max(112,Math.ceil(rects.reduce((sum,r)=>sum+r.width,0)+Math.max(0,rects.length-1)*8+16));}
 for(const [key,value]of Object.entries(values)){const px=Math.round(value*100)/100+'px';if(root.style.getPropertyValue(key)!==px)root.style.setProperty(key,px);}
 const changed=root.classList.contains('club-overview-fit')!==fit;root.classList.toggle('club-overview-fit',fit);if(changed)scheduleViewport();
 if(controlsWidth!==null)frame.contentWindow.postMessage({type:'spiker-host-layout',controlsWidth},'*');
}

function scheduleViewport(){if(viewportFrame)return;viewportFrame=requestAnimationFrame(()=>{viewportFrame=0;fitViewport();});}
addEventListener('resize',scheduleViewport);addEventListener('orientationchange',scheduleViewport);
window.visualViewport?.addEventListener('resize',scheduleViewport);window.visualViewport?.addEventListener('scroll',scheduleViewport);
function update(){
 if(!toggle)return;
 const active=!!fullElement();
 document.documentElement.classList.toggle('app-fullscreen',active||fullscreen.matches);
 document.documentElement.classList.toggle('app-expanded',active||standalone.matches||fullscreen.matches||navigator.standalone===true);fitViewport();
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
 const resize=new ResizeObserver(scheduleViewport);
 for(const selector of ['.mobile-nav','.energy-button','.topbar','.calendar-card','#clubPanel']){const el=document.querySelector(selector);if(el)resize.observe(el);}
 new MutationObserver(scheduleViewport).observe(document.body,{attributes:true,attributeFilter:['class','data-league-division']});
 const campObserver=new MutationObserver(scheduleViewport);const camp=document.getElementById('campAlert');if(camp)campObserver.observe(camp,{attributes:true,attributeFilter:['hidden','class','style']});
 addEventListener('spiker-stage-changed',scheduleViewport);
 document.getElementById('gameMatchFrame')?.addEventListener('load',scheduleViewport);
 const settings=document.getElementById('settingsDialog');if(!settings)return;
 const group=document.createElement('section');group.className='settings-group';group.id='appDisplaySettings';
 group.innerHTML='<h3>Ekran ve uygulama</h3><div class="settings-row"><span>Tam ekran</span><button type="button" id="fullscreenToggle" class="team-action" aria-pressed="false">Tam ekran</button></div><div class="settings-row"><span>Ana ekrana ekle</span><button type="button" id="installApp" class="team-action">Nasıl eklenir?</button></div><p id="appDisplayStatus" class="app-display-status" role="status" aria-live="polite"></p>';
 const settingsScroll=settings.querySelector('.settings-scroll');if(settingsScroll)settingsScroll.prepend(group);else settings.querySelector('h2').after(group);toggle=group.querySelector('#fullscreenToggle');install=group.querySelector('#installApp');status=group.querySelector('#appDisplayStatus');
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
