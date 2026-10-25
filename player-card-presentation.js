(function(root){
'use strict';
const isProspect=p=>!!(p?.academyProspect||p?.transferProfile==='potential');
function icon(){const data=root.SpikerIconData?.diamond;if(!data)return '';return '<svg class="spiker-icon" viewBox="'+data.viewBox+'" aria-hidden="true"><path fill="currentColor" d="'+data.d+'"/></svg>';}
function conceal(face){
 face.classList.add('potential-player');face.classList.remove('elite-player');face.dataset.prospect='unknown';
 for(const key of ['cardTier','camps','campTier'])delete face.dataset[key];
 face.querySelectorAll('.camp-evolved').forEach(n=>n.classList.remove('camp-evolved'));
 face.setAttribute('aria-label','Potansiyelli oyuncu · özellikleri henüz bilinmiyor');
 face.querySelectorAll('.card-top b,.player-overall b,.card-stats b,.card-physical>span').forEach(n=>{n.textContent='??';n.removeAttribute('title');});
 const overall=face.querySelector('.player-overall');if(overall){overall.title='Genel güç henüz bilinmiyor';overall.setAttribute('aria-label','Genel güç bilinmiyor');}
 const cap=face.querySelector('.card-cap');if(cap)cap.innerHTML='<span class="card-cap-heading">Seviye ?? / ??</span><small>Özellik sınırı ??</small>';
 face.querySelectorAll('.card-stats i').forEach(n=>n.remove());
 const skills=face.querySelector('.player-skill-strip');if(skills){const hidden=document.createElement('div');hidden.className='player-skill-strip';hidden.textContent='Yetenekler · ?? · ?? · ??';skills.replaceWith(hidden);}
 face.querySelectorAll('.camp-stars').forEach(n=>{n.replaceChildren(document.createTextNode('??'));n.title='Yıldızlar henüz bilinmiyor';n.setAttribute('aria-label',n.title);});
 face.querySelectorAll('.card-grade,.special-player-tag,.card-potential,.transfer-upgrade-marker').forEach(n=>n.remove());
 const fit=face.querySelector('.transfer-fit');if(fit){fit.dataset.fit='potential';fit.textContent='İyi oyuncu olma potansiyeli';}
 const marker=document.createElement('span');marker.className='transfer-upgrade-marker potential-marker';marker.dataset.direction='potential';marker.title='İyi oyuncu olma potansiyeli';marker.setAttribute('aria-label',marker.title);marker.innerHTML=icon();face.querySelector('.card-art')?.append(marker);
 return face;
}
root.PlayerCardPresentation={isProspect,conceal,icon};
})(globalThis);
