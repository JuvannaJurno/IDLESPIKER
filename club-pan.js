(function(){
'use strict';
const area=document.querySelector('.building-scroll');if(!area)return;
let drag=null,suppressUntil=0;
area.style.touchAction='pinch-zoom';
function verticalScroller(){for(let el=area.parentElement;el;el=el.parentElement){if(/auto|scroll/.test(getComputedStyle(el).overflowY)&&el.scrollHeight>el.clientHeight)return el;}return document.scrollingElement;}
area.addEventListener('pointerdown',e=>{
 if(!e.isPrimary||e.button!==0||document.body.classList.contains('bal-transforming'))return;
 suppressUntil=0;
 drag={id:e.pointerId,x:e.clientX,y:e.clientY,left:area.scrollLeft,vertical:verticalScroller(),moved:false};drag.top=drag.vertical.scrollTop;
});
area.addEventListener('pointermove',e=>{
 if(!drag||drag.id!==e.pointerId)return;
 const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
 if(!drag.moved&&Math.hypot(dx,dy)<8)return;
 if(!drag.moved){drag.moved=true;area.setPointerCapture(e.pointerId);area.classList.add('is-panning');}
 e.preventDefault();area.scrollLeft=drag.left-dx;drag.vertical.scrollTop=drag.top-dy;
},{passive:false});
function finish(e){if(!drag||drag.id!==e.pointerId)return;if(drag.moved)suppressUntil=performance.now()+500;drag=null;area.classList.remove('is-panning');if(area.hasPointerCapture(e.pointerId))area.releasePointerCapture(e.pointerId);}
window.addEventListener('pointerup',finish);window.addEventListener('pointercancel',finish);area.addEventListener('lostpointercapture',e=>{if(e.target===area)finish(e)});
area.addEventListener('click',e=>{if(performance.now()<suppressUntil){e.preventDefault();e.stopImmediatePropagation();suppressUntil=0;}},true);
area.addEventListener('dragstart',e=>e.preventDefault());
})();
