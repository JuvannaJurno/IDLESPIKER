(function(){
'use strict';
const blue='brightness(0) saturate(100%) invert(64%) sepia(72%) saturate(1900%) hue-rotate(167deg)';
function ghost(ctx,pose,alpha,draw){ctx.save();ctx.globalAlpha*=alpha;ctx.filter=blue;draw(pose);ctx.restore();}
let crop=null;
function vision(ctx,actor,aim,drawActor,drawBall,age=.25){
 if(!crop){crop=document.createElement('canvas');crop.width=160;crop.height=130;}
 const g=crop.getContext('2d'),x=aim.x,y=aim.y;
 g.clearRect(0,0,160,130);g.drawImage(ctx.canvas,x-80,y-65,160,130,0,0,160,130);
 g.globalCompositeOperation='destination-in';const mask=g.createRadialGradient(80,65,18,80,65,77);mask.addColorStop(0,'#fff');mask.addColorStop(1,'#fff0');g.fillStyle=mask;g.fillRect(0,0,160,130);g.globalCompositeOperation='source-over';
 ctx.save();ctx.fillStyle='rgba(7,15,25,.86)';ctx.fillRect(0,0,1000,620);ctx.drawImage(crop,x-80,y-65);drawActor(actor);drawBall();ctx.restore();
}
window.MatchSkillVisuals={ghost,vision};
})();
