(function(){
'use strict';
const names=['Performans Merkezi','Kulüp Yönetimi','Gelir Merkezi','Teknik Ekip','Oyuncu Keşfi'];
const descriptions=['Antrenman ve beslenme, aynı merkezde.','Kulübünün günlük çalışma merkezi.','Talimatlardan bütçeye.','Maça hazırlığın yeni merkezi.','Yeni yetenekler, yeni ihtimaller.'];
const scenes=[
'<path d="M18 112H302V173H18Z" fill="#dba972"/><path d="M30 119H215V164H30Z M122 119V164 M30 141H215" fill="none" stroke="#fff2cd" stroke-width="3"/><path d="M121 104V167M128 106V167M116 109H133" stroke="#587e73" stroke-width="3"/><path d="M223 123H300V139H223" fill="#698e7a"/><path d="M229 139V162M293 139V162" stroke="#466957" stroke-width="5"/><rect x="238" y="108" width="17" height="15" rx="4" fill="#f4d78a"/><circle cx="278" cy="116" r="8" fill="#e28e66"/><path d="M24 85V35H85V85Z" fill="#e4f1df"/><path d="M54 35V85M24 60H85" stroke="#fff5db" stroke-width="4"/><rect x="151" y="42" width="125" height="42" rx="6" fill="#608e7a"/><path d="M163 63H185L193 51L204 75L214 60H260" stroke="#f9dc99" fill="none" stroke-width="3"/>',
'<rect x="25" y="27" width="116" height="67" rx="5" fill="#edf0d7"/><path d="M39 44H125M39 57H107M39 70H119" stroke="#97b7a2" stroke-width="5"/><path d="M49 120H257V138H49Z" fill="#bf8d64"/><path d="M59 138V171M247 138V171" stroke="#7f6950" stroke-width="7"/><rect x="95" y="87" width="65" height="35" rx="4" fill="#4f7775"/><path d="M127 122V131" stroke="#e3c99a" stroke-width="5"/><rect x="181" y="109" width="40" height="13" rx="2" fill="#f9e5b1"/><rect x="181" y="105" width="40" height="5" rx="2" fill="#dc9f7d"/><circle cx="258" cy="49" r="21" fill="#fcf0c9"/><path d="M258 35V49L268 54" stroke="#648c80" fill="none" stroke-width="3"/>',
'<rect x="50" y="57" width="221" height="103" rx="6" fill="#efd7a5"/><path d="M41 48H280L270 77H51Z" fill="#648e7a"/><path d="M75 48L80 77M118 48L120 77M161 48V77M204 48L201 77M247 48L242 77" stroke="#f8e5b8" stroke-width="18"/><rect x="67" y="88" width="184" height="31" rx="3" fill="#4c776b"/><rect x="64" y="126" width="194" height="37" rx="4" fill="#c89364"/><rect x="207" y="108" width="30" height="22" rx="3" fill="#708a86"/><circle cx="99" cy="115" r="10" fill="#f6e6b4"/><path d="M130 104H165V124H130Z" fill="#f4bc75"/><rect x="113" y="17" width="95" height="22" rx="8" fill="#fff2ca"/>',
'<rect x="29" y="24" width="237" height="115" rx="7" fill="#9badab"/><rect x="36" y="31" width="223" height="99" rx="3" fill="#f6f8ef"/><path d="M61 47H164V114H61ZM112 47V114M61 80H164" fill="none" stroke="#86a49a" stroke-width="2"/><g fill="#ce9756"><circle cx="80" cy="64" r="5"/><circle cx="135" cy="99" r="5"/><circle cx="144" cy="64" r="5"/></g><path d="M84 64Q120 76 135 93M187 54H241M187 66H229M187 98H238" stroke="#557f75" fill="none" stroke-width="3"/><path d="M62 139L52 173M231 139L241 173" stroke="#7a928d" stroke-width="7"/><rect x="180" y="111" width="59" height="8" rx="3" fill="#c4d2ca"/>',
"<rect x=\"25\" y=\"22\" width=\"180\" height=\"128\" rx=\"7\" fill=\"#e7d2a7\"/><path d=\"M40 40H186V130H40Z\" fill=\"#c0d2b5\"/><path d=\"M52 55L170 111M57 115L162 51M104 40V130\" stroke=\"#eaf0d4\" stroke-width=\"7\"/><g fill=\"#c18c5c\"><circle cx=\"68\" cy=\"73\" r=\"6\"/><circle cx=\"146\" cy=\"62\" r=\"6\"/><circle cx=\"128\" cy=\"114\" r=\"6\"/></g><rect x=\"217\" y=\"39\" width=\"72\" height=\"92\" rx=\"5\" fill=\"#fff0cd\"/><circle cx=\"253\" cy=\"66\" r=\"12\" fill=\"#739385\"/><path d=\"M235 94Q253 70 271 94M232 106H274M240 118H266\" stroke=\"#739385\" fill=\"none\" stroke-width=\"5\"/><path d=\"M23 154H297V165H23Z\" fill=\"#ba8c64\"/><circle cx=\"192\" cy=\"119\" r=\"19\" fill=\"#e3edd9\" stroke=\"#597f70\" stroke-width=\"7\"/><path d=\"M207 133L227 152\" stroke=\"#597f70\" stroke-width=\"10\"/>"
];
function art(f){return '<svg class="bal-room-art" viewBox="0 0 320 180" aria-hidden="true"><rect width="320" height="180" fill="'+['#bfd9cd','#d6dfcf','#d5dfbd','#b7d0c4','#ded0b3'][f]+'"/><path d="M0 113H320V180H0Z" fill="#d4b68d"/><path d="M0 113H320" stroke="#faf0d0" stroke-width="5"/>'+scenes[f]+'</svg>'}
function decorate(card,f){const room=card.querySelector('.room');room.classList.add('bal-illustrated');room.innerHTML=art(f)+'<span class="room-label" hidden></span>';card.querySelector('h3').textContent=names[f];const purpose=card.querySelector('.department-purpose');if(purpose)purpose.textContent=descriptions[f];}
async function play({animate,stopped,text,note}){
 const workflow=document.getElementById('workflow'),tier=f=>workflow.querySelector('.tier[data-floor="'+f+'"]'),base=f=>tier(f).querySelector('.base-room'),ease=CardMotion.ease,scrollBox=workflow.closest('.building-scroll');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 const move=(el,frames,duration=700)=>animate(el,frames,{duration:duration*.8,easing:ease});
 const hold=(el,ms=350)=>move(el,[{opacity:1},{opacity:1}],ms);
 function step(n,title,detail){workflow.dataset.transitionStep=n;text.textContent=n+'/5 · '+title;note.textContent=detail;}
 async function focus(el){const startLeft=scrollBox.scrollLeft;const top=window.scrollY+el.getBoundingClientRect().top-Math.max(110,(innerHeight-180-el.offsetHeight)/2);if(reduced){scrollBox.scrollLeft=0;window.scrollTo({top,behavior:'instant'});return}const start=scrollY,end=Math.max(0,top),begin=performance.now();await new Promise(resolve=>{function frame(now){if(stopped())return resolve();const p=Math.min(1,(now-begin)/420);scrollBox.scrollLeft=startLeft*(1-p)**3;window.scrollTo({top:start+(end-start)*(1-(1-p)**3),behavior:'instant'});p<1?requestAnimationFrame(frame):resolve()}requestAnimationFrame(frame)});}

 async function gather(f,keepCamera=false){if(stopped())return;const el=tier(f),b=base(f),slot=document.getElementById('roomSlots'+f);el.classList.add('bal-active-tier');if(!keepCamera)await focus(b);if(stopped())return;
 const state=RoomSystem.snapshot(),cards=[...slot.querySelectorAll('.upgrade-room')].filter(card=>{const room=RoomRules.catalog.find(r=>r.id===card.dataset.id);return room&&RoomRules.count(state,room.id)>=room.values.length;});el.dataset.blockMerge='storing';
 // Keep the cards full-sized: they slide behind the department instead of shrinking away.
 b.style.position='relative';b.style.zIndex='20';
 const target=b.getBoundingClientRect();
 await Promise.all(cards.map((card,i)=>{
  const rect=card.getBoundingClientRect(),dx=target.left-rect.left,dy=target.top-rect.top;
  card.style.position='relative';card.style.zIndex=String(15-i);
  return animate(card,[
   {transform:'translate(0,0)',opacity:1},
   {transform:'translate('+(dx*.94)+'px,'+(dy*.94)+'px)',opacity:1,offset:.88},
   {transform:'translate('+dx+'px,'+dy+'px)',opacity:0}
  ],{duration:900,delay:reduced?0:i*110,easing:CardMotion.storeEase});
 }));if(stopped())return;
 el.dataset.blockMerge='complete';el.classList.remove('bal-active-tier');
 }

 async function reveal(card,f){if(stopped())return;const old=document.createElement('div'),next=document.createElement('div');old.className='bal-card-face bal-face-old';next.className='bal-card-face bal-face-new';while(card.firstChild)old.append(card.firstChild);next.append(...[...old.children].map(n=>n.cloneNode(true)));decorate(next,f);card.classList.add('bal-card-changing');card.append(old,next);await Promise.all([move(old,[{transform:'translateY(0)',opacity:1},{transform:'translateY(-102%)',opacity:.3}],950),move(next,[{transform:'translateY(102%)'},{transform:'translateY(0)'}],950),move(card,[{boxShadow:'0 4px 0 #8daa9c'},{boxShadow:'0 4px 0 #a6ac77,0 0 0 5px #e3ca8b66',offset:.5},{boxShadow:'0 4px 0 #8daa9c'}],1100)]);if(stopped())return;card.replaceChildren(...next.childNodes);card.classList.remove('bal-card-changing');card.classList.add('bal-card-renewed');}
 step(1,'Kulüp yönetimi yenileniyor','Gönüllü Kulüp Asistanı → Kulüp Yönetimi');await gather(1);if(stopped())return;await reveal(base(1),1);await hold(base(1));if(stopped())return;
 step(2,'İki departman birleşiyor','Antrenman Sahası + Kantin → Performans Merkezi');await gather(0);await gather(2,true);if(stopped())return;
 // Keep the real departments in their vertical lanes throughout the merge.
 const a=base(0),b=base(2);const top=tier(0),bottom=tier(2);await focus(top);if(stopped())return;workflow.dataset.mergePhase='joining';
 const ar=a.getBoundingClientRect(),br=b.getBoundingClientRect(),distance=br.top-ar.top;
 top.style.zIndex=4;bottom.style.zIndex=3;
 if(stopped())return;
 await Promise.all([move(bottom.querySelector('.room-lane'),[{transform:'translateY(0)'},{transform:'translateY(-'+distance+'px)'}],1700),move(b,[{opacity:1},{opacity:1,offset:.72},{opacity:0}],1700)]);if(stopped())return;
 workflow.dataset.mergePhase='revealing';await reveal(a,0);if(stopped())return;
 const food=bottom.querySelector('.foundation-block');if(food){const before=food.getBoundingClientRect();document.getElementById('roomSlots0').querySelector('.foundation-block').after(food);const after=food.getBoundingClientRect();await move(food,[{transform:'translate('+(before.left-after.left)+'px,'+(before.top-after.top)+'px)'},{transform:'translate(0,0)'}],1000);if(stopped())return;}
 const height=bottom.getBoundingClientRect().height;await move(bottom,[{height:height+'px',marginBottom:'16px',opacity:1},{height:'0px',marginBottom:'0px',opacity:0}],650);bottom.hidden=true;bottom.style.display='none';workflow.dataset.mergePhase='complete';
 step(3,'Maç hazırlığı yenileniyor','Kara Tahta → Teknik Ekip');await gather(3);if(stopped())return;await reveal(base(3),3);await hold(base(3));if(stopped())return;
 // New departments join the end only after all inherited departments have settled.
 async function appendDepartment(f,n){if(stopped())return;const el=tier(f),card=base(f);el.getAnimations().forEach(a=>a.cancel());el.querySelectorAll('*').forEach(node=>node.getAnimations().forEach(a=>a.cancel()));el.removeAttribute('style');card.removeAttribute('style');el.hidden=true;if(f===2)workflow.insertBefore(el,tier(3));else workflow.append(el);document.getElementById('roomSlots'+f).replaceChildren();decorate(card,f);
 step(n,'Yeni departman: '+names[f],'İlk dokunuşta ücretsiz açılır');
 const label=document.createElement('span');label.className='bal-new-department-label';label.textContent='Keşfet · Ücretsiz';card.append(label);
 el.hidden=false;el.style.opacity='0';await focus(card);if(stopped())return;
 await move(el,[{transform:'translateY(52px)',opacity:0},{transform:'translateY(0)',opacity:1}],1100);await hold(el,500);
 }
 await appendDepartment(2,4);if(stopped())return;await appendDepartment(4,5);if(stopped())return;
 text.textContent='Kulübün BAL’a hazır';note.textContent='Departmanların hazır · Dokun ve keşfet';await hold(tier(4),450);
}
function capture(workflow){const children=[...workflow.childNodes];const records=[...workflow.querySelectorAll('.tier')].map(t=>{const card=t.querySelector('.base-room');return {t,card,parent:card.parentElement,html:card.innerHTML,slot:t.querySelector('[id^="roomSlots"]'),children:[...t.querySelector('[id^="roomSlots"]').childNodes],childStyles:[...t.querySelector('[id^="roomSlots"]').childNodes].map(n=>n.getAttribute?.('style')),hidden:t.hidden,style:t.getAttribute('style')}});return ()=>{workflow.replaceChildren(...children);delete workflow.dataset.transitionStep;workflow.querySelectorAll('.bal-new-department-label').forEach(el=>el.remove());workflow.querySelectorAll('.bal-merge-dock').forEach(d=>d.remove());for(const r of records){r.slot.replaceChildren(...r.children);r.children.forEach((n,i)=>{n.getAnimations?.().forEach(a=>a.cancel());if(n.setAttribute){r.childStyles[i]===null?n.removeAttribute('style'):n.setAttribute('style',r.childStyles[i])}});delete r.t.dataset.blockMerge;r.parent.prepend(r.card);r.card.innerHTML=r.html;r.card.classList.remove('bal-join-card','bal-card-changing','bal-card-renewed');r.card.removeAttribute('style');r.t.hidden=r.hidden;r.style===null?r.t.removeAttribute('style'):r.t.setAttribute('style',r.style);r.t.classList.remove('bal-active-tier')}}}
window.BalVisual={decorate,play,capture};
})();
