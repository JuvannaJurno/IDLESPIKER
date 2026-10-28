(function(){
'use strict';
document.addEventListener('DOMContentLoaded',()=>{
 const dialog=document.getElementById('settingsDialog');
 function section(title,ids){
  const group=document.createElement('section');group.className='settings-group';
  const heading=document.createElement('h3');heading.textContent=title;group.append(heading);
  for(const id of ids){const control=document.getElementById(id),row=control?.closest('.settings-row');if(row)group.append(row);}
  if(group.children.length>1)dialog.append(group);
 }
 section('Görünüm ve kontrol',['languageSelect','themeToggle','vibrationToggle']);
 section('Ses',['soundToggle','volume-music','volume-crowd','volume-effects']);
 const fast=document.querySelector('#testAutoclicker')?.closest('.settings-row')?.querySelector('span');if(fast)fast.textContent='Hızlı test · 100× talimat';
 const cheats=document.createElement('details');cheats.id='cheatDrawer';cheats.className='settings-group cheat-drawer';
 cheats.innerHTML='<summary><span>Hileler<small>Denemeler ve oyun kaydı</small></span><b aria-hidden="true">›</b></summary><div class="cheat-drawer-content"><p class="cheat-warning" role="note"><strong>İlerleme araçları</strong> Hızlı test ve aşama değiştirmek oyun dengesini değiştirir. Oyun testi kaydı ilerlemene dokunmaz.</p></div>';
 for(const id of ['testAutoclicker','stageTestGo']){const row=document.getElementById(id)?.closest('.settings-row');if(row)cheats.querySelector('.cheat-drawer-content').append(row);}
 const tutorial=document.getElementById('reviewTutorials')?.closest('.tutorial-review-row');if(tutorial){const note=tutorial.nextElementSibling?.matches('.tutorial-review-note')?tutorial.nextElementSibling:null;cheats.querySelector('.cheat-drawer-content').append(tutorial);if(note)cheats.querySelector('.cheat-drawer-content').append(note);}
 dialog.append(cheats);
 const reset=dialog.querySelector('.reset-section');if(reset)dialog.append(reset);
 const header=document.createElement('header');header.className='settings-header';
 header.append(dialog.querySelector('h2'),document.getElementById('closeSettings'));
 const scroll=document.createElement('div');scroll.className='settings-scroll';
 scroll.append(...dialog.children);dialog.append(header,scroll);
});
})();
