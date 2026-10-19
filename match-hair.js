(function(){
'use strict';
const original=drawOrder,cache=new Map(),palettes=new WeakMap();
function styleFor(identity,index){
 if(window.HairColors?.style(identity?.appearance))return 'tied';const hair=identity?.appearance?.parts?.find(p=>p.id==='hair');
 const model=hair?.path?.match(/Woman([1-6])\.png$/)?.[1];
 const n=model?Number(model):(identity?.epicTeam||window.MatchHairPreview)?index%6+1:0;
 return [1,3].includes(n)?'long':[2,4,5,6].includes(n)?'tied':null;
}
function paletteFor(p){
 const appearance=p.roster?.appearance,own=appearance?.palette;
 if(own)return {hair:window.HairColors?.base(appearance)||own.hair,hairEnd:window.HairColors?.style(appearance)?.end||null,shirt:p.roster.role==='libero'&&!appearance.clubKit?'#edc457':own.shirt};
 const set=sprites[p.index];if(!set?.hair||!set.shirt)return null;
 if(!palettes.has(set))palettes.set(set,{hair:dominant(set.hair),shirt:dominant(set.shirt)});
 return palettes.get(set);
}
function imageFor(style,palette){
 const key=[style,palette.hair,palette.hairEnd,palette.shirt].join('|');if(cache.has(key))return cache.get(key);
 const {part:p,source}=MatchHairData[style],color=style==='tie'?shade(palette.shirt,.78):(['bun','tip'].includes(style)&&palette.hairEnd?palette.hairEnd:palette.hair),tie=shade(palette.shirt,.78);
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+p.width+'" height="'+p.height+'" viewBox="0 0 '+p.width+' '+p.height+'"><defs><filter id="hair" color-interpolation-filters="sRGB"><feFlood flood-color="'+color+'"/><feComposite in2="SourceAlpha" operator="in"/><feComponentTransfer><feFuncA type="discrete" tableValues="0 0 0 0 1"/></feComponentTransfer></filter></defs><image width="'+p.width+'" height="'+p.height+'" href="'+source+'" filter="url(#hair)"/><rect x="'+(p.width*p.pivotX-.65)+'" y="'+((p.height-Math.min(4,p.height*.6))/2)+'" width="1.3" height="'+Math.min(4,p.height*.6)+'" fill="'+tie+'"/></svg>';
 const finalSvg=['front','bun','tip','tie'].includes(style)?svg.replace(new RegExp('<rect[^>]*>'),''):svg;let output=finalSvg;if(style.startsWith('foot-')){const rgb=[1,3,5].map(i=>parseInt(palette.shirt.slice(i,i+2),16)/255);output='<svg xmlns="http://www.w3.org/2000/svg" width="7" height="9"><defs><filter id="accent" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="0 0 0 0 '+rgb[0]+' 0 0 0 0 '+rgb[1]+' 0 0 0 0 '+rgb[2]+' 3 -3 0 0 0" result="color"/><feComposite in="color" in2="SourceAlpha" operator="in" result="clipped"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="clipped"/></feMerge></filter></defs><image width="7" height="9" href="'+source+'" filter="url(#accent)"/></svg>';}const im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(output);cache.set(key,im);return im;
}
const motions=new WeakMap(),nativeTick=tick;
const gaitRig={legStart:{x:15,y:37.33},legEnd:{x:33,y:37.33},armStart:{x:13.58,y:32.91},armEnd:{x:25,y:32.91}};
function gaitSample(speed,distance,approach=false,remaining=null,phaseOverride=null){const reach=Math.hypot(gaitRig.legEnd.x-gaitRig.legStart.x,gaitRig.legEnd.y-gaitRig.legStart.y)*1.35;const pace=Math.max(0,speed),amplitude=Math.min(1,pace/180),stride=reach*2*(.42+.58*amplitude)*(approach?1.12:1),phase=phaseOverride??distance/stride*Math.PI*2;let stretch=Math.cos(phase)*amplitude;if(remaining!==null){const time=Math.max(0,remaining-.30);const progress=Math.max(0,Math.min(1,1-time/.66));const contacts=[0,.42,.76,1];let segment=0;while(segment<2&&progress>contacts[segment+1])segment++;const u=(progress-contacts[segment])/(contacts[segment+1]-contacts[segment]);stretch=Math.cos((segment+u)*Math.PI)*amplitude;stretch*=Math.min(1,time/.09);}return {stretch,phase,stride,amplitude};}
window.MatchGait={rig:gaitRig,sample:gaitSample};
tick=function(dt){const before=elapsed,result=nativeTick(dt),step=Math.min(.05,Math.max(0,elapsed-before));if(!step)return result;for(const p of players){let m=motions.get(p);if(!m){m={x:p.x,y:p.y,angle:p.angle,bun:0,tip:0,speed:0,distance:0,gaitSpeed:0,gaitPhase:0};motions.set(p,m);}const travel=Math.hypot(p.x-m.x,p.y-m.y),validTravel=travel<25;const measured=p.moving&&validTravel?travel/step:0;m.gaitSpeed+=(measured-m.gaitSpeed)*(1-Math.exp(-step*18));if(p.moving&&validTravel&&!(p.jump>0)&&!p.kickPose){m.distance+=travel;const gait=gaitSample(m.gaitSpeed,m.distance,!!p.approach);m.gaitPhase+=travel/gait.stride*Math.PI*2;if(measured>2)p.phase=m.gaitPhase;}const vx=(p.x-m.x)/step,vy=(p.y-m.y)/step,side=-Math.sin(p.angle)*vx+Math.cos(p.angle)*vy,turn=Math.atan2(Math.sin(p.angle-m.angle),Math.cos(p.angle-m.angle))/step;const target=Math.max(-13,Math.min(13,-side*.055-turn*1.4)),blend=1-Math.exp(-step*11);m.speed+=(Math.hypot(vx,vy)-m.speed)*blend;m.tip+=(target-m.tip)*blend;m.bun+=(target*.13-m.bun)*(1-Math.exp(-step*15));m.x=p.x;m.y=p.y;m.angle=p.angle;}return result;};
function rotateAround(part,anchor,degrees){const a=degrees*Math.PI/180,c=Math.cos(a),s=Math.sin(a),x=part.x+part.width*part.scale*part.pivotX,y=part.y+part.height*part.scale*part.pivotY;part.x=anchor.x+c*(x-anchor.x)-s*(y-anchor.y)-part.width*part.scale*part.pivotX;part.y=anchor.y+s*(x-anchor.x)+c*(y-anchor.y)-part.height*part.scale*part.pivotY;part.rotation+=degrees;return part;}
function rigParts(p){const tie=MatchHairData.tie.part,anchor={x:tie.x+tie.width*tie.scale*tie.pivotX,y:tie.y+tie.height*tie.scale*tie.pivotY},m=motions.get(p),wave=Math.sin((p.phase||0)+p.index*.73-.6)*(p.moving?1:0),bunAngle=(m?.bun||0)+wave*.45,tipAngle=(m?.tip||0)+wave*2;const bun=rotateAround({...MatchHairData.bun.part},anchor,bunAngle),tip=rotateAround({...MatchHairData.tip.part},anchor,bunAngle);const stretch=Math.min(1,Math.max(0,(m?.speed??(p.moving?180:0))/200));tip.x+=(MatchHairData.runTip.x-MatchHairData.tip.part.x)*stretch;tip.y+=(MatchHairData.runTip.y-MatchHairData.tip.part.y)*stretch;tip.rotation+=tipAngle;return {bun,tip,tie:{...tie}};}
function legImage(entry,p,palette){const skin=p.roster?.appearance?.palette?.head||(sprites[p.index]?.head?dominant(sprites[p.index].head):'#d9b987');const kitAccent=p.roster?.appearance?.clubKit?.accent;let accent=kitAccent||shade(palette.shirt,1.25);try{const profile=JSON.parse(localStorage.getItem('idle-spiker-club-profile-v1'));if(!kitAccent&&profile&&palette.shirt.toLowerCase()===profile.primary?.toLowerCase())accent=profile.accent||accent;}catch{}const color=entry.part.uniformPart?accent:skin,key='legs|'+entry.part.id+'|'+color;if(cache.has(key))return cache.get(key);const mask=entry.part.skinOnly;const filter=mask?'<feColorMatrix type="matrix" values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 8 0 -8 0 0" result="mask"/><feComposite in="mask" in2="SourceAlpha" operator="in" result="skinMask"/><feFlood flood-color="'+color+'"/><feComposite in2="skinMask" operator="in" result="tinted"/><feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="tinted"/></feMerge>':'<feFlood flood-color="'+color+'"/><feComposite in2="SourceAlpha" operator="in"/>';const im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="'+entry.part.width+'" height="'+entry.part.height+'"><defs><filter id="t" color-interpolation-filters="sRGB">'+filter+'</filter></defs><image width="'+entry.part.width+'" height="'+entry.part.height+'" href="'+entry.source+'" filter="url(#t)"/></svg>');cache.set(key,im);return im;}
function legParts(p,palette){if(!p.moving||p.kickPose>0||p.jump>0||p.block>0)return [];const refs=MatchHairData.legs,roots=refs.filter(e=>e.part.uniformPart).map(e=>e.part),hip=roots.reduce((sum,q)=>sum+q.x+q.width*q.scale*q.pivotX,0)/roots.length,motion=motions.get(p),preparation=window.MatchSkills?.serveGait,remaining=preparation?.actor===p.index&&preparation.phase==='approach'?preparation.remaining:null,stretch=gaitSample(motion?.gaitSpeed||0,motion?.distance||0,!!p.approach,remaining,motion?.gaitPhase||0).stretch*(remaining!==null&&strikeSide(p)==='left'?-1:1);return refs.map(entry=>{const image=legImage(entry,p,palette);if(!image.complete||!image.naturalWidth)return null;const part={...entry.part,legStretch:stretch,legHip:hip};sprites[p.index][part.id]=image;return part;}).filter(Boolean);}
drawOrder=function(p){
 const order=original(p);if(p.index>=12)return order;
 const palette=paletteFor(p);if(!palette?.hair||!palette.shirt)return order;
 const result=[...legParts(p,palette),...order],style=styleFor(p.roster,p.index);
 for(const side of (p.kickPose>0?['left','right']:[])){const type='foot-'+side,image=imageFor(type,palette);if(!image.complete||!image.naturalWidth)continue;let part={...MatchHairData[type].part};const kick=Math.max(0,Math.min(1,p.kickPose||0));let target={...MatchHairData['kick-'+side].part};if(strikeSide(p)==='left'){const other=side==='left'?'right':'left';target={...MatchHairData['kick-'+other].part};const cy=target.y+target.height*target.scale*target.pivotY;target.y=86.336-cy-target.height*target.scale*target.pivotY;target.rotation=180-target.rotation;target.flip=!target.flip;}part={...target,id:part.id};sprites[p.index][part.id]=image;result.unshift(part);}

 const rig=style==='tied'?rigParts(p):null;
 for(const type of [...(rig?MatchHairData.tiedLayerOrder:[style]),'front'].filter(Boolean)){
  const image=imageFor(type,palette);if(!image.complete||!image.naturalWidth)continue;
  const part=rig?.[type]||{...MatchHairData[type].part};
  const airborne=Math.sin(Math.max(0,p.jump||0)/.5*Math.PI),activity=p.moving?1:airborne*.5;
  const phase=(p.phase||elapsed*9)+p.index*.73-.6;
  if(!['front','bun','tip','tie'].includes(type))part.rotation+=(type==='front'?.65:type==='ponytail'?3.5:1.8)*Math.sin(phase)*activity;
  sprites[p.index][part.id]=image;
  const hairIndex=result.findIndex(p=>p.id==='hair');
  const index=['bun','tip','tie'].includes(type)?result.length:type==='long'?0:type==='front'?(hairIndex<0?result.length:hairIndex+1):Math.max(0,hairIndex);
  result.splice(index,0,part);
 }
 return result;
};
const whiteFlag=new Image();whiteFlag.src=MatchHairData.whiteFlag.source;
const nativeCourt=court,nativePoint=awardPoint;let flagRaisedUntil=-1;const judgeSprites=new Map();
function judgeSprite(type){if(judgeSprites.has(type))return judgeSprites.get(type);const source=sprites[0]?.[type];if(!source||(source.complete===false)||!(source.naturalWidth||source.width))return null;const canvas=document.createElement('canvas');canvas.width=source.naturalWidth||source.width;canvas.height=source.naturalHeight||source.height;const c=canvas.getContext('2d');c.drawImage(source,0,0);if(type==='shirt'){c.globalCompositeOperation='source-in';c.fillStyle='#e9eee6';c.fillRect(0,0,canvas.width,canvas.height);}judgeSprites.set(type,canvas);return canvas;}
function drawLineJudge(x,y,angle){if(!whiteFlag.complete||!whiteFlag.naturalWidth)return;ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.imageSmoothingEnabled=false;ctx.fillStyle='#0002';ctx.beginPath();ctx.ellipse(0,3,12,8,0,0,Math.PI*2);ctx.fill();const shirt=judgeSprite('shirt'),head=judgeSprite('head'),hair=judgeSprite('hair');if(shirt)ctx.drawImage(shirt,-7.5,-14.5);if(head)ctx.drawImage(head,3,-7.5);if(hair)ctx.drawImage(hair,-10,-8.5);const raised=elapsed<flagRaisedUntil;ctx.translate(1,raised?-13:11);ctx.rotate(raised?-1.35:.35);const scale=.65;ctx.drawImage(whiteFlag,0,-5,MatchHairData.whiteFlag.width*scale,MatchHairData.whiteFlag.height*scale);ctx.restore();}
court=function(){nativeCourt();if(ready){drawLineJudge(65,67,Math.PI/2);drawLineJudge(935,553,-Math.PI/2);}};
awardPoint=function(winner){const out=ball?.outcome?.event==='attack-error'||ball?.outcome?.event==='serve-error';if(out)flagRaisedUntil=elapsed+1.25;return nativePoint(winner);};
window.MatchHair={styleFor,parts:MatchHairData,cache,rigParts};
})();
