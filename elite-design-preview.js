(function(){
'use strict';if(!new URLSearchParams(location.search).has('eliteDesignPreview'))return;
addEventListener('load',()=>setTimeout(()=>{
 for(const d of document.querySelectorAll('dialog[open]'))d.close();RoomSystem.setAutoClick(()=>{});
 const s=BalRules.enter(RoomRules.defaults(),1);s.division=4;s.divisionCalendar=2;s.openDepartments=[2,4];s.budget=1000000;s.instructions=15000;s.floors[0]=['first_academy'];s.scouting.firstTransferUsed=true;
 ScoutRules.report(s,()=>TeamRules.generate().map(p=>({...p,appearance:TeamAppearance.generate(Math.random,{country:p.nationality||CountryRules.current()})})),()=>.1,TeamRules.players);
 const candidate=s.scouting.catalog.find(c=>AcademyCareerRules.eligible(c.player));if(!candidate)return;
 LeagueSeason.loadStage({mode:'bal',division:4,divisionCalendar:2,startDay:1,run:4,results:{}});RoomSystem.loadStage(s);
 localStorage.setItem('idle-spiker-scout-opened-v1',s.scouting.catalog.map(c=>c.id).join('|'));Scouting.open();document.getElementById('homeCurrentCatalog').click();
 const original=document.querySelector('.scout-player[data-candidate-id="'+candidate.id+'"]');if(!original)return;
 const dialog=document.getElementById('scoutDialog'),host=document.createElement('main');host.id='eliteOptions';host.dataset.purpose='academy-potential';
 const families=[['O','Elit referansı','Mevcut mor elit yüzey. Yalnız karşılaştırma.'],['A','Leylak','Açık leylak yüzey, sakin mor başlık.'],['B','Ametist','Daha belirgin mor; elit aileden bir adım önce.'],['C','İnci','Beyaza yakın portre zemini, ince leylak kenar.'],['D','Adaçayı','Sıcak adaçayı yüzey, mor gelişim vurgusu.']];
 for(const [id,name,copy]of families){
  const article=document.createElement('article');article.className='option-'+id;const heading=document.createElement('h2');heading.textContent=id+' · '+name;const note=document.createElement('p');note.textContent=copy;
  const card=original.cloneNode(true);card.classList.remove('elite-player','valuable-candidate');card.classList.add(id==='O'?'elite-player':'potential-player');card.dataset.designVariant=id;card.removeAttribute('data-growth-band');card.removeAttribute('data-candidate-id');card.querySelector('.card-grade')?.remove();card.querySelectorAll('button').forEach(b=>{b.disabled=true;b.tabIndex=-1;});
  const pick=document.createElement('button');pick.type='button';pick.className='elite-pick';pick.textContent=id==='O'?'Elit referansı':'Bu tasarımı seç';pick.disabled=id==='O';pick.setAttribute('aria-pressed','false');pick.onclick=()=>{host.querySelectorAll('.elite-pick:not(:disabled)').forEach(b=>{b.setAttribute('aria-pressed',String(b===pick));b.textContent=b===pick?'Seçildi':'Bu tasarımı seç';});parent.postMessage({type:'elite-design-choice',name:id+' · '+name,kind:'academy-potential'},'*');};article.append(heading,note,card,pick);host.append(article);
 }
 const originalUI=document.createElement('div');originalUI.hidden=true;originalUI.append(...dialog.childNodes);dialog.append(originalUI,host);document.documentElement.classList.add('elite-preview-page');const style=document.createElement('link');style.rel='stylesheet';style.href='elite-design-preview.css';document.head.append(style);
},650));
})();
