(function(){
'use strict';
const speed=document.getElementById('speed');let dirty=true;
function invalidate(){dirty=true;}
// Keep the simulation at 60 Hz while drawing at the display's refresh rate.
// Brief frame stalls can catch up without the old 40 ms truncation.
loop=function(time){
 if(paused!==audioPaused){audioPaused=paused;matchSound('pause',{value:paused});dirty=true;}
 const dt=Math.min(.1,last?Math.max(0,time-last)/1000:0)*Number(speed.value);last=time;
 if(paused||document.hidden)frameCarry=0;
 else {frameCarry+=dt;let steps=0;while(frameCarry+1e-10>=1/60&&steps++<10){tick(1/60);frameCarry=Math.max(0,frameCarry-1/60);}}
 if(!document.hidden&&(!paused||dirty)){movementSounds();draw();dirty=false;}
 requestAnimationFrame(loop);
};
for(const name of ['click','input','change'])document.addEventListener(name,invalidate,{passive:true});
window.addEventListener('resize',invalidate,{passive:true});
document.addEventListener('visibilitychange',()=>{last=0;frameCarry=0;dirty=true;});
window.MatchFrames={invalidate};
})();
