(function(){
'use strict';
const area=document.querySelector('.building-scroll');if(!area)return;
let drag=null,suppressUntil=0,momentum=0;
area.style.touchAction='pinch-zoom';
function verticalScroller(){for(let el=area.parentElement;el;el=el.parentElement){if(/auto|scroll/.test(getComputedStyle(el).overflowY)&&el.scrollHeight>el.clientHeight)return el;}return document.scrollingElement;}
area.addEventListener('pointerdown',e=>{
 if(!e.isPrimary||e.button!==0||document.body.classList.contains('bal-transforming'))return;
 cancelAnimationFrame(momentum);suppressUntil=0;
 drag={id:e.pointerId,x:e.clientX,y:e.clientY,left:area.scrollLeft,vertical:verticalScroller(),moved:false,time:performance.now(),lastX:e.clientX,lastY:e.clientY,vx:0,vy:0};drag.top=drag.vertical.scrollTop;
});
area.addEventListener('pointermove',e=>{
 if(!drag||drag.id!==e.pointerId)return;
 const dx=e.clientX-drag.x,dy=e.clientY-drag.y;
 if(!drag.moved&&Math.hypot(dx,dy)<5)return;
 if(!drag.moved){drag.moved=true;area.setPointerCapture(e.pointerId);area.classList.add('is-panning');}
 e.preventDefault();const now=performance.now(),dt=Math.max(8,now-drag.time);drag.vx=(drag.lastX-e.clientX)/dt;drag.vy=(drag.lastY-e.clientY)/dt;drag.lastX=e.clientX;drag.lastY=e.clientY;drag.time=now;area.scrollTo({left:drag.left-dx,behavior:'instant'});drag.vertical.scrollTo({top:drag.top-dy,behavior:'instant'});
},{passive:false});
function finish(e){if(!drag||drag.id!==e.pointerId)return;if(drag.moved){suppressUntil=performance.now()+500;const d=drag;if(e.type==='pointerup'&&e.pointerType!=='mouse'&&performance.now()-d.time<90&&!matchMedia('(prefers-reduced-motion: reduce)').matches){let vx=Math.max(-2.5,Math.min(2.5,d.vx)),vy=Math.max(-2.5,Math.min(2.5,d.vy)),last=performance.now();function coast(now){const dt=Math.min(32,now-last);last=now;const x=area.scrollLeft,y=d.vertical.scrollTop;area.scrollTo({left:x+vx*dt,behavior:'instant'});d.vertical.scrollTo({top:y+vy*dt,behavior:'instant'});vx*=Math.exp(-dt/160);vy*=Math.exp(-dt/160);if(area.scrollLeft===x)vx=0;if(d.vertical.scrollTop===y)vy=0;if(Math.abs(vx)+Math.abs(vy)>.03)momentum=requestAnimationFrame(coast);}momentum=requestAnimationFrame(coast);}}drag=null;area.classList.remove('is-panning');if(area.hasPointerCapture(e.pointerId))area.releasePointerCapture(e.pointerId);}
window.addEventListener('pointerup',finish);window.addEventListener('pointercancel',finish);area.addEventListener('lostpointercapture',e=>{if(e.target===area)finish(e)});
area.addEventListener('click',e=>{if(performance.now()<suppressUntil){e.preventDefault();e.stopImmediatePropagation();suppressUntil=0;}},true);
window.addEventListener('pointerdown',()=>cancelAnimationFrame(momentum),true);window.addEventListener('wheel',()=>cancelAnimationFrame(momentum),{passive:true});
area.addEventListener('dragstart',e=>e.preventDefault());
})();
