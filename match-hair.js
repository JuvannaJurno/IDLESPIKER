(function(){
'use strict';
const original=drawOrder,cache=new Map(),palettes=new WeakMap();
function styleFor(identity,index){
 const hair=identity?.appearance?.parts?.find(p=>p.id==='hair');
 const model=hair?.path?.match(/Woman([1-6])\.png$/)?.[1];
 const n=model?Number(model):(identity?.epicTeam||window.MatchHairPreview)?index%6+1:0;
 return [1,3].includes(n)?'long':[2,4,5,6].includes(n)?'tied':null;
}
function paletteFor(p){
 const appearance=p.roster?.appearance,own=appearance?.palette;
 if(own)return {hair:own.hair,shirt:p.roster.role==='libero'&&!appearance.clubKit?'#edc457':own.shirt};
 const set=sprites[p.index];if(!set?.hair||!set.shirt)return null;
 if(!palettes.has(set))palettes.set(set,{hair:dominant(set.hair),shirt:dominant(set.shirt)});
 return palettes.get(set);
}
function imageFor(style,palette){
 const key=[style,palette.hair,palette.shirt].join('|');if(cache.has(key))return cache.get(key);
 const {part:p,source}=MatchHairData[style],color=style==='tie'?shade(palette.shirt,.78):shade(palette.hair,style==='front'?1:.94),tie=shade(palette.shirt,.78);
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="'+p.width+'" height="'+p.height+'" viewBox="0 0 '+p.width+' '+p.height+'"><defs><filter id="hair" color-interpolation-filters="sRGB"><feFlood flood-color="'+color+'"/><feComposite in2="SourceAlpha" operator="in"/><feComponentTransfer><feFuncA type="discrete" tableValues="0 0 0 0 1"/></feComponentTransfer></filter></defs><image width="'+p.width+'" height="'+p.height+'" href="'+source+'" filter="url(#hair)"/><rect x="'+(p.width*p.pivotX-.65)+'" y="'+((p.height-Math.min(4,p.height*.6))/2)+'" width="1.3" height="'+Math.min(4,p.height*.6)+'" fill="'+tie+'"/></svg>';
 const finalSvg=['front','bun','tip','tie'].includes(style)?svg.replace(new RegExp('<rect[^>]*>'),''):svg;const im=new Image();im.src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(finalSvg);cache.set(key,im);return im;
}
const motions=new WeakMap(),nativeTick=tick;
tick=function(dt){const before=elapsed,result=nativeTick(dt),step=Math.min(.05,Math.max(0,elapsed-before));if(!step)return result;for(const p of players){let m=motions.get(p);if(!m){m={x:p.x,y:p.y,angle:p.angle,bun:0,tip:0};motions.set(p,m);}const vx=(p.x-m.x)/step,vy=(p.y-m.y)/step,side=-Math.sin(p.angle)*vx+Math.cos(p.angle)*vy,turn=Math.atan2(Math.sin(p.angle-m.angle),Math.cos(p.angle-m.angle))/step;const target=Math.max(-13,Math.min(13,-side*.055-turn*1.4)),blend=1-Math.exp(-step*11);m.tip+=(target-m.tip)*blend;m.bun+=(target*.13-m.bun)*(1-Math.exp(-step*15));m.x=p.x;m.y=p.y;m.angle=p.angle;}return result;};
function rotateAround(part,anchor,degrees){const a=degrees*Math.PI/180,c=Math.cos(a),s=Math.sin(a),x=part.x+part.width*part.scale*part.pivotX,y=part.y+part.height*part.scale*part.pivotY;part.x=anchor.x+c*(x-anchor.x)-s*(y-anchor.y)-part.width*part.scale*part.pivotX;part.y=anchor.y+s*(x-anchor.x)+c*(y-anchor.y)-part.height*part.scale*part.pivotY;part.rotation+=degrees;return part;}
function rigParts(p){const tie=MatchHairData.tie.part,anchor={x:tie.x+tie.width*tie.scale*tie.pivotX,y:tie.y+tie.height*tie.scale*tie.pivotY},m=motions.get(p),wave=Math.sin((p.phase||0)+p.index*.73-.6)*(p.moving?1:0),bunAngle=(m?.bun||0)+wave*.45,tipAngle=(m?.tip||0)+wave*2;const bun=rotateAround({...MatchHairData.bun.part},anchor,bunAngle),tip=rotateAround({...MatchHairData.tip.part},anchor,bunAngle);tip.rotation+=tipAngle;return {bun,tip,tie:{...tie}};}
drawOrder=function(p){
 const order=original(p);if(p.index>=12)return order;
 const palette=paletteFor(p);if(!palette?.hair||!palette.shirt)return order;
 const result=[...order],style=styleFor(p.roster,p.index);
 const rig=style==='tied'?rigParts(p):null;
 for(const type of [...(rig?MatchHairData.tiedLayerOrder:[style]),'front'].filter(Boolean)){
  const image=imageFor(type,palette);if(!image.complete||!image.naturalWidth)continue;
  const part=rig?.[type]||{...MatchHairData[type].part};
  const airborne=Math.sin(Math.max(0,p.jump||0)/.5*Math.PI),activity=p.moving?1:airborne*.5;
  const phase=(p.phase||elapsed*9)+p.index*.73-.6;
  if(!['bun','tip','tie'].includes(type))part.rotation+=(type==='front'?.65:type==='ponytail'?3.5:1.8)*Math.sin(phase)*activity;
  sprites[p.index][part.id]=image;
  const hairIndex=result.findIndex(p=>p.id==='hair');
  const index=['bun','tip','tie'].includes(type)?result.length:type==='long'?0:type==='front'?(hairIndex<0?result.length:hairIndex+1):Math.max(0,hairIndex);
  result.splice(index,0,part);
 }
 return result;
};
window.MatchHair={styleFor,parts:MatchHairData,cache,rigParts};
})();
