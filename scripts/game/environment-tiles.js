(function(root){
'use strict';
const images={},patterns=new Map();
const ready=Promise.all(Object.entries(root.EnvironmentTileData||{}).map(([id,src])=>new Promise(resolve=>{const image=new Image();images[id]=image;image.onload=image.onerror=resolve;image.src=src;})));
function sprite(ctx,id,x,y,w,h=w,angle=0){const image=images[id];if(!image?.complete||!image.naturalWidth)return false;ctx.save();ctx.translate(x+w/2,y+h/2);ctx.rotate(angle);ctx.drawImage(image,-w/2,-h/2,w,h);ctx.restore();return true;}
function paintFloor(ctx,x,y,w,h,style='light'){
 const ids=style==='warm'?['woodWarm','woodWarmAlternate']:['woodLight','woodLightAlternate'];
 if(ids.some(id=>!images[id]?.naturalWidth))return false;
 let tile=patterns.get(style);if(!tile){tile=document.createElement('canvas');tile.width=tile.height=128;const g=tile.getContext('2d');for(let row=0;row<2;row++)for(let col=0;col<2;col++)g.drawImage(images[ids[(row+col)%2]],col*64,row*64,64,64);patterns.set(style,tile);}
 ctx.save();ctx.translate(x,y);ctx.fillStyle=ctx.createPattern(tile,'repeat');ctx.fillRect(0,0,w,h);ctx.restore();return true;
}
root.EnvironmentTiles={ready,sprite,paintFloor};
ready.then(()=>{if(root.MatchCourtSurface)root.MatchCourtSurface.revision++;root.MatchFrames?.invalidate();});
})(window);
