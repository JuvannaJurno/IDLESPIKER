(function(root){
'use strict';
// Keep native scrolling/inertia. This layer only handles touch overscroll at an edge.
const coefficient=.55,omega=19,states=new Set();let gesture=null,raf=0,lastFrame=0;
const reduced=matchMedia('(prefers-reduced-motion: reduce)'),apple=/iP(ad|hone|od)/.test(navigator.userAgent)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);
function rubber(distance,dimension){const d=Math.max(1,dimension);return Math.sign(distance)*(1-1/(coefficient*Math.abs(distance)/d+1))*d;}
function spring(x,v,dt){const e=Math.exp(-omega*dt),b=v+omega*x;return {x:(x+b*dt)*e,v:(v-omega*b*dt)*e};}
function nodes(scroller){const list=scroller===document.scrollingElement?[...document.querySelectorAll('.dashboard > section:not([hidden])')].flatMap(p=>[...p.children]):[...scroller.children];return list.filter(el=>el instanceof HTMLElement&&!['fixed','sticky'].includes(getComputedStyle(el).position));}
function paint(state){for(const el of state.nodes){if(!el.isConnected)continue;el.style.translate='0 '+state.x.toFixed(3)+'px';}}
function clear(state){for(const [el,value]of state.original)if(el.isConnected)el.style.translate=value;states.delete(state);}
function reset(){gesture=null;cancelAnimationFrame(raf);raf=0;lastFrame=0;for(const s of [...states])clear(s);}
function animate(now){const dt=lastFrame?Math.min(.04,(now-lastFrame)/1000):1/60;lastFrame=now;for(const s of [...states]){if(s.dragging)continue;const next=spring(s.x,s.v,dt);s.x=next.x;s.v=next.v;if(Math.abs(s.x)<.15&&Math.abs(s.v)<1){clear(s);continue;}paint(s);}if([...states].some(s=>!s.dragging))raf=requestAnimationFrame(animate);else{raf=0;lastFrame=0;}}
function release(){if(!gesture)return;const s=gesture.state;gesture=null;if(!s)return;s.dragging=false;if(reduced.matches){clear(s);return;}if(!raf)raf=requestAnimationFrame(animate);}
function scrollerAt(target,axis){const modal=[...document.querySelectorAll('dialog[open]')].at(-1);for(let el=target;el&&el!==document.body;el=el.parentElement){const css=getComputedStyle(el),overflow=axis==='y'?css.overflowY:css.overflowX,size=axis==='y'?el.scrollHeight-el.clientHeight:el.scrollWidth-el.clientWidth;if(/auto|scroll/.test(overflow)&&size>2)return el;if(el===modal)break;}if(modal||getComputedStyle(document.body).overflowY==='hidden')return null;return document.scrollingElement;}
document.addEventListener('touchstart',e=>{if(apple||reduced.matches||e.touches.length!==1)return;release();const t=e.touches[0];gesture={target:e.target,x:t.clientX,y:t.clientY,lastY:t.clientY,lastTime:e.timeStamp,axis:null,state:null,raw:0};},{passive:true});
document.addEventListener('touchmove',e=>{
 if(!gesture||e.touches.length!==1){release();return;}const t=e.touches[0],g=gesture,dx=t.clientX-g.x,dy=t.clientY-g.y;
 if(!g.axis){if(Math.max(Math.abs(dx),Math.abs(dy))<7)return;g.axis=Math.abs(dx)>Math.abs(dy)?'x':'y';g.scroller=scrollerAt(g.target,g.axis);}
 if(g.axis!=='y'||!g.scroller||g.target.closest('input,textarea,select,[contenteditable=true],iframe,canvas'))return;
 const el=g.scroller,delta=t.clientY-g.lastY,dt=Math.max(.008,Math.min(.08,(e.timeStamp-g.lastTime)/1000)),max=Math.max(0,el.scrollHeight-el.clientHeight),atTop=el.scrollTop<=.5,atBottom=el.scrollTop>=max-.5;
 g.lastY=t.clientY;g.lastTime=e.timeStamp;
 if(!g.state&&!((atTop&&delta>0)||(atBottom&&delta<0)))return;if(!e.cancelable)return;e.preventDefault();
 if(!g.state){const list=nodes(el);if(!list.length)return;const old=[...states].find(s=>s.scroller===el);g.state=old||{scroller:el,nodes:list,original:new Map(list.map(n=>[n,n.style.translate])),x:0,v:0,dragging:true};g.state.dragging=true;states.add(g.state);const dimension=Math.max(1,Math.min(el.clientHeight||innerHeight,innerHeight)),distance=Math.min(dimension-.01,Math.abs(g.state.x));g.raw=Math.sign(g.state.x)*distance*dimension/(coefficient*(dimension-distance));}
 const s=g.state;let raw=g.raw+delta;
 if((atTop&&raw>=0)||(atBottom&&raw<=0)){const x=rubber(raw,Math.min(el.clientHeight||innerHeight,innerHeight));s.v=s.v*.25+((x-s.x)/dt)*.75;s.x=x;g.raw=raw;}
 else{el.scrollTop=Math.max(0,Math.min(max,el.scrollTop-raw));g.raw=0;s.x=0;s.v=0;}
 paint(s);
},{passive:false});
document.addEventListener('touchend',release,{passive:true});document.addEventListener('touchcancel',release,{passive:true});
document.addEventListener('click',e=>{if(states.size){if([...states].some(s=>s.dragging||Math.abs(s.x)>8)){e.preventDefault();e.stopPropagation();}reset();}},true);
document.addEventListener('close',reset,true);document.addEventListener('visibilitychange',()=>{if(document.hidden)reset();});addEventListener('blur',reset);addEventListener('resize',reset);reduced.addEventListener('change',reset);
document.querySelector('.mobile-nav')?.addEventListener('click',reset,true);
root.ScrollSpring={rubber,spring,reset,get active(){return states.size},nativeApple:apple};
})(window);
