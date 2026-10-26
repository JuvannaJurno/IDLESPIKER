(function(){
'use strict';
const blue='brightness(0) saturate(100%) invert(64%) sepia(72%) saturate(1900%) hue-rotate(167deg)';
function ghost(ctx,pose,alpha,draw){ctx.save();ctx.globalAlpha*=alpha;ctx.filter=blue;draw(pose);ctx.restore();}
const assets={vision:'window_h_blur.png',player:'window_g_blur.png',ball:'window_h.png',light:'window_h_noise.png'},images={},tints=new Map(),heads=new Map();
for(const [id,src]of Object.entries(assets)){const image=new Image();image.onload=()=>window.MatchFrames?.invalidate();image.src=window.MatchLightMaskData?.[id]||src;images[id]=image;}
function mask(id,color){const image=images[id];if(!image?.naturalWidth)return null;const key=id+color;if(tints.has(key))return tints.get(key);const out=document.createElement('canvas');out.width=out.height=128;const g=out.getContext('2d');g.drawImage(image,0,0,128,128);g.globalCompositeOperation='source-in';g.fillStyle=color;g.fillRect(0,0,128,128);if(id==='light'){g.globalCompositeOperation='destination-in';const fade=g.createRadialGradient(64,64,10,64,64,62);fade.addColorStop(0,'#fff');fade.addColorStop(1,'#fff0');g.fillStyle=fade;g.fillRect(0,0,128,128);}if(tints.size>=20)tints.delete(tints.keys().next().value);tints.set(key,out);return out;}
function captureHead(c,p,parts){if(p.vectorOnlyHand)return;const q=parts.find(q=>q.id==='head'||q.svgPart==='head');if(!q)return;const a=(q.rotation||0)*Math.PI/180,k=q.scale||1,dx=q.width*(.5-q.pivotX)*k,dy=q.height*(.5-q.pivotY)*k,point=c.getTransform().transformPoint({x:q.x+q.width*k*q.pivotX+Math.cos(a)*dx-Math.sin(a)*dy-17,y:q.y+q.height*k*q.pivotY+Math.sin(a)*dx+Math.cos(a)*dy});heads.set(p.index,{x:point.x,y:point.y,actorX:p.x,actorY:p.y,angle:p.angle||0});}
function head(p){const h=heads.get(p.index);if(!h)return {x:p.x,y:p.y};const a=(p.angle||0)-h.angle,dx=h.x-h.actorX,dy=h.y-h.actorY;return {x:p.x+Math.cos(a)*dx-Math.sin(a)*dy,y:p.y+Math.sin(a)*dx+Math.cos(a)*dy};}
function light(c,p,color,opacity,size){const image=mask('light',color);if(!image)return;const center=head(p);c.save();c.globalCompositeOperation='lighter';c.globalAlpha*=Math.max(0,Math.min(1,opacity));c.drawImage(image,center.x-size/2,center.y-size/2,size,size);c.restore();}
function ballShadow(c,b){const color=window.BallShadowSettings?.ink||'#000000',image=mask('ball',color),height=Math.min(180,Math.max(0,b.z||0)),size=24+height*.025;c.save();c.globalAlpha=.34-height*.0007;if(image)c.drawImage(image,b.x-size/2,b.y-size/2,size,size);else{c.fillStyle=color;c.beginPath();c.arc(b.x,b.y,7,0,Math.PI*2);c.fill();}c.restore();}
function playerShadow(c,p){if(window.LabPlayerShadow)return window.LabPlayerShadow(c,p);const image=mask('player','#203238'),scale=p.shadowScale??1;if(!image||!scale)return;c.save();c.globalAlpha=.35;c.drawImage(image,-28*scale,4-23*scale,56*scale,46*scale);c.restore();}
let crop=null;
function vision(ctx,actor,aim,drawActor,drawBall,age=.25){
 if(!crop){crop=document.createElement('canvas');crop.width=crop.height=180;}
 const g=crop.getContext('2d'),x=aim.x,y=aim.y;
 g.clearRect(0,0,180,180);g.drawImage(ctx.canvas,x-90,y-90,180,180,0,0,180,180);
 g.globalCompositeOperation='destination-in';if(images.vision.naturalWidth)g.drawImage(images.vision,0,0,180,180);else{const fade=g.createRadialGradient(90,90,18,90,90,90);fade.addColorStop(0,'#fff');fade.addColorStop(1,'#fff0');g.fillStyle=fade;g.fillRect(0,0,180,180);}g.globalCompositeOperation='source-over';
 ctx.save();ctx.fillStyle='rgba(7,15,25,.86)';ctx.fillRect(0,0,1000,620);ctx.drawImage(crop,x-90,y-90);drawActor(actor);drawBall();ctx.restore();
}
window.MatchSkillVisuals={ghost,vision,assets,images,mask,captureHead,head,light,ballShadow,playerShadow};
})();
