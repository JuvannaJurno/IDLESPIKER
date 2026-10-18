(function(){
'use strict';
const ease='cubic-bezier(.22,1,.36,1)',storeEase='cubic-bezier(.45,0,.2,1)';
const reduced=()=>matchMedia('(prefers-reduced-motion: reduce)').matches;
function frames(card,target){const a=card.getBoundingClientRect(),b=target.getBoundingClientRect(),x=b.left-a.left,y=b.top-a.top;return [{transform:'translate(0,0)',opacity:1},{transform:'translate('+x*.94+'px,'+y*.94+'px)',opacity:1,offset:.88},{transform:'translate('+x+'px,'+y+'px)',opacity:0}];}
function options(index=0){return {duration:reduced()?1:900,delay:reduced()?0:index*110,easing:storeEase,fill:'forwards'};}
function slide(el,keyframes,duration=760){return el.animate(keyframes,{duration:reduced()?1:duration,easing:ease,fill:'forwards'});}
async function gather(tier,target){target.style.position='relative';target.style.zIndex='20';const cards=[...tier.querySelectorAll('.upgrade-room')].filter(c=>!c.closest('.foundation-drawer')&&c.getBoundingClientRect().width>0);const animations=cards.map((card,i)=>{card.style.position='relative';card.style.zIndex=String(15-i);return card.animate(frames(card,target),options(i));});await Promise.all(animations.map(a=>a.finished.catch(()=>{})));return animations;}
async function reveal(card,change){const old=document.createElement('div'),next=document.createElement('div');old.className='bal-card-face bal-face-old';next.className='bal-card-face bal-face-new';while(card.firstChild)old.append(card.firstChild);next.append(...[...old.children].map(n=>n.cloneNode(true)));change(next);card.classList.add('bal-card-changing');card.append(old,next);const animations=[slide(old,[{transform:'translateY(0)',opacity:1},{transform:'translateY(-102%)',opacity:.3}]),slide(next,[{transform:'translateY(102%)'},{transform:'translateY(0)'}])];await Promise.all(animations.map(a=>a.finished.catch(()=>{})));card.replaceChildren(...next.childNodes);animations.forEach(a=>a.cancel());card.classList.remove('bal-card-changing');}
async function testExit(){for(const d of document.querySelectorAll('dialog[open]'))d.close();document.querySelector('.mobile-nav a[href="#clubPanel"]').click();const animations=[];for(const tier of document.querySelectorAll('#workflow .tier:not([hidden])')){const base=tier.querySelector('.base-room');if(!base)continue;base.scrollIntoView({block:'center',behavior:reduced()?'instant':'smooth'});animations.push(...await gather(tier,base));}return animations;}
async function focus(el){
 const box=el.closest('.building-scroll'),start=scrollY,left=box?.scrollLeft||0,end=Math.max(0,start+el.getBoundingClientRect().top-Math.max(110,(innerHeight-el.offsetHeight)/2));
 if(reduced()){window.scrollTo({top:end,behavior:'instant'});if(box)box.scrollLeft=0;return;}
 const began=performance.now();await new Promise(resolve=>{function frame(now){const t=Math.min(1,(now-began)/420),k=t*t*(3-2*t);window.scrollTo({top:start+(end-start)*k,behavior:'instant'});if(box)box.scrollLeft=left*(1-k);if(t<1)requestAnimationFrame(frame);else resolve();}requestAnimationFrame(frame)});
}
async function handoff(change){if(!reduced()&&document.startViewTransition){const transition=document.startViewTransition(change);await transition.finished.catch(()=>{});}else change();}
window.CardMotion={focus,handoff,ease,storeEase,frames,options,slide,gather,reveal,testExit,reduced};
})();
