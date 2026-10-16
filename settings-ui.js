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
 section('Görünüm ve kontrol',['themeToggle','vibrationToggle']);
 section('Ses',['soundToggle','volume-music','volume-crowd','volume-effects']);
 const fast=document.querySelector('#testAutoclicker')?.closest('.settings-row')?.querySelector('span');if(fast)fast.textContent='Hızlı test · 100× talimat';
 section('Test seçenekleri',['testAutoclicker','skipStage','skipThirdStage']);
 const reset=dialog.querySelector('.reset-section');if(reset)dialog.append(reset);
});
})();
