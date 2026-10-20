(function(){
'use strict';
// Interpolate presentation only. Match contacts and RNG keep their fixed timestep.
const fields=['x','y','angle','phase','jump','block','spike','toss','receive','hit'],timers=new Set(['jump','block','spike','toss','receive','hit']);
const previous=[],saved=[];let previousBall=null,ballBefore=null,valid=false;
const state={alpha:1,interpolated:false,ballX:null,ballY:null};
function copy(target,p){target.p=p;for(const field of fields)target[field]=p[field];return target;}
function beforeStep(){
 for(let i=0;i<players.length;i++)copy(previous[i]||(previous[i]={}),players[i]);previous.length=players.length;
 previousBall=ball;ballBefore={x:ball.x,y:ball.y,z:ball.z,t:ball.t,state:ball.state,kind:ball.kind,fromX:ball.from?.x,fromY:ball.from?.y};valid=true;
}
function render(alpha,paint){
 alpha=Math.max(0,Math.min(1,alpha));state.alpha=alpha;state.interpolated=valid&&!paused;
 if(!state.interpolated){state.ballX=ball.x;state.ballY=ball.y;return paint()}
 const currentBall=ball,restoreBall={x:ball.x,y:ball.y,z:ball.z,t:ball.t};
 try{
  for(let i=0;i<players.length;i++){
   const p=players[i],old=previous[i];copy(saved[i]||(saved[i]={}),p);if(old?.p!==p)continue;
   // A new ball flight starts at this exact contact pose; blending the striker back detaches the hand from the ball.
   if(currentBall!==previousBall&&currentBall.state==='flight'&&currentBall.attacker===p)continue;
   for(const field of fields){const a=old[field],b=p[field];if(!Number.isFinite(a)||!Number.isFinite(b))continue;
    if(field==='angle')p[field]=a+Math.atan2(Math.sin(b-a),Math.cos(b-a))*alpha;
    else if(!timers.has(field)||b<=a)p[field]=a+(b-a)*alpha;
   }
  }
  // A launch or block deflection is a new trajectory, never blend across it.
  if(previousBall===ball&&ballBefore.state===ball.state&&ballBefore.kind===ball.kind&&ballBefore.fromX===ball.from?.x&&ballBefore.fromY===ball.from?.y&&ball.t>=ballBefore.t){
   for(const field of ['x','y','z','t'])if(Number.isFinite(ballBefore[field])&&Number.isFinite(ball[field]))ball[field]=ballBefore[field]+(ball[field]-ballBefore[field])*alpha;
  }
  state.ballX=ball.x;state.ballY=ball.y;return paint();
 }finally{
  for(let i=0;i<players.length;i++){const entry=saved[i];if(entry?.p===players[i])for(const field of fields)players[i][field]=entry[field];}
  Object.assign(currentBall,restoreBall);
 }
}
window.MatchMotion={beforeStep,render,reset(){valid=false;previousBall=null;previous.length=0;},get state(){return {...state}}};
})();
