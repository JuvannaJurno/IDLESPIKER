(function(root){
'use strict';
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));let poses=new WeakMap();
function pose(p,time,passing=false){
 if(!Number.isFinite(time))time=0;let s=poses.get(p);if(!s||time<s.time){s={time,jump:0,landAt:-10,air:false,vx:0,vy:0,passUntil:-1,effort:0};poses.set(p,s);}
 const dt=time-s.time,derived=dt>.001&&dt<.15&&Number.isFinite(s.x)&&p.moving,estimatedX=derived?clamp((p.x-s.x)/dt,-230,230):0,estimatedY=derived?clamp((p.y-s.y)/dt,-230,230):0;
 const jumping=p.jump>.005&&!(p.receive>0&&!(p.spike>0)&&!(p.block>0)),vx=p.courtVX||estimatedX,vy=p.courtVY||estimatedY;
 if(jumping&&!s.air){s.air=true;s.vx=vx||(time-(s.runAt??-10)<.18?s.runVX:0)||0;s.vy=vy||(time-(s.runAt??-10)<.18?s.runVY:0)||0;s.landAt=-10;}
 if(jumping&&Math.hypot(vx,vy)>Math.hypot(s.vx,s.vy)){s.vx=vx;s.vy=vy;}
 if(!jumping&&s.air){s.air=false;s.landAt=time;}
 if(passing){const speed=Math.hypot(vx,vy),quality=Number.isFinite(p.contactQuality)?p.contactQuality:.8;s.effort=clamp(speed/230+(1-quality)*.35);s.passUntil=time+.24;s.passX=vx;s.passY=vy;}
 const age=time-s.landAt,lateAir=jumping?clamp((.15-p.jump)/.15):0;
 // A short forward finish, knee absorption, then one settling step. No body scaling.
 const landing=age>=0&&age<.52,finish=jumping?lateAir:landing?Math.pow(1-age/.52,2):0;
 const magnitude=Math.hypot(s.vx,s.vy),reach=Math.min(13,magnitude*.055),nx=magnitude>1?s.vx/magnitude:0,ny=magnitude>1?s.vy/magnitude:0;
 const bend=landing?Math.sin(clamp(age/.22)*Math.PI)*clamp(magnitude/130,.35,1):0;
 const step=landing?Math.sin(clamp((age-.12)/.32)*Math.PI)*clamp(magnitude/150)*3:0;
 const pass=passing?1:clamp((s.passUntil-time)/.24),effort=s.effort*pass,passSpeed=Math.hypot(s.passX||0,s.passY||0),travelAngle=passSpeed>1?Math.atan2(s.passY,s.passX):p.angle,turn=effort*Math.atan2(Math.sin(travelAngle-p.angle),Math.cos(travelAngle-p.angle))*.12;
 if(!jumping&&Math.hypot(vx,vy)>20){s.runVX=vx;s.runVY=vy;s.runAt=time;}s.jump=p.jump;s.time=time;s.x=p.x;s.y=p.y;
 return {x:nx*(reach*finish+step),y:ny*(reach*finish+step)+bend*2,bend:Math.max(bend,effort*.3),step,turn,reach:effort,arm:effort*.16};
}
root.PlayerBodyMotion={pose,reset(){poses=new WeakMap();}};
})(globalThis);
