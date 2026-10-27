(function(root){
'use strict';
// One narrow paint surface for every packet; no per-lane quota or compositor layer.
let canvas,context,width=0,height=0,ratio=1,visibleTop=0,visibleBottom=0,drawn=0,peak=0;
let viewDirty=true,viewTop=0;
addEventListener('scroll',()=>{viewDirty=true;},{passive:true,capture:true});addEventListener('resize',()=>{viewDirty=true;},{passive:true});
const manualPass=[];const sprites=new Map();let drawnPackets=[],capture=false,currentStyle='ribbon';
function sprite(p){
 const manual=p.source==='manual',social=p.source==='social',critical=p.critical;
 const style=currentStyle,key=[style,manual,social,critical,!!p.manualBonus,p.strength>1].join(':');
 if(sprites.has(key))return sprites.get(key);
 const w=manual?10:critical?9:style==='beads'?7:8,h=manual?20:critical?16:style==='beads'?7:15;
 const image=document.createElement('canvas');image.width=(w+8)*2;image.height=(h+8)*2;
 const g=image.getContext('2d');g.scale(2,2);g.translate(4,4);
 const fill=g.createLinearGradient(0,0,manual?w:0,manual?0:h);
 fill.addColorStop(0,social?'#dcecf0':manual?(p.manualBonus?'#ead6f3':'#e6b359'):critical?'#fff0bc':'#e4bf72');
 fill.addColorStop(1,social?'#8ebcc9':manual?(p.manualBonus?'#a583bf':'#ffe0a0'):critical?'#dfb35e':'#e4bf72');
 g.fillStyle=fill;g.strokeStyle=manual?(p.manualBonus?'#d7b5ec':'#c78c35'):social?'#f3faf5':critical?'#ffefbb':'#fff7dc';g.lineWidth=manual?1.5:1;
 g.beginPath();if(g.roundRect)g.roundRect(.75,.75,w-1.5,h-1.5,style==='beads'&&!manual?4:manual?4:3);else g.rect(.75,.75,w-1.5,h-1.5);g.fill();g.stroke();
 if(manual){g.fillStyle='#fff9dc';g.globalAlpha=.8;g.fillRect(3,5,4,10);}
 if(sprites.size>=32)sprites.delete(sprites.keys().next().value);
 const out={image,width:w+8,height:h+8,alpha:p.source==='auto'?.9:1};sprites.set(key,out);return out;
}
function begin(geometry){
 if(!canvas){const host=document.getElementById('pulseLayer');if(!host)return;canvas=document.createElement('canvas');canvas.className='flow-packet-canvas';canvas.setAttribute('aria-hidden','true');Object.assign(canvas.style,{position:'absolute',left:'0',top:'0',pointerEvents:'none',maxWidth:'none'});host.append(canvas);context=canvas.getContext('2d',{alpha:true});}
 if(viewDirty){viewTop=document.getElementById('pulseLayer').getBoundingClientRect().top;viewDirty=false;}
 const lanes=root.FlowLanes?.count?.()||1;let maxX=0;for(let lane=0;lane<lanes;lane++)maxX=Math.max(maxX,root.FlowLanes?.position(lane)||22);const w=Math.ceil(maxX+18),h=Math.ceil(geometry.height+30),dpr=Math.min(devicePixelRatio||1,1.5);
 if(width!==w||height!==h||ratio!==dpr){width=w;height=h;ratio=dpr;viewDirty=true;canvas.width=Math.ceil(w*dpr);canvas.height=Math.ceil(h*dpr);canvas.style.width=w+'px';canvas.style.height=h+'px';}
 currentStyle=document.documentElement.dataset.flowStyle||'ribbon';if(canvas.hidden)canvas.hidden=false;context.setTransform(ratio,0,0,ratio,0,0);context.clearRect(0,0,width,height);drawn=0;drawnPackets.length=0;manualPass.length=0;
 const top=viewTop;visibleTop=Math.max(0,-top-32);visibleBottom=Math.min(height,innerHeight-top+32);
}
function draw(p,y){if(p.source==='manual'){manualPass.push(p,y);return;}paint(p,y);}
function end(){for(let i=0;i<manualPass.length;i+=2)paint(manualPass[i],manualPass[i+1]);manualPass.length=0;}
function paint(p,y){if(!context||y<visibleTop||y>visibleBottom)return;const image=p.renderSprite&&p.renderStyle===currentStyle&&p.renderCritical===p.critical&&p.renderStrength===p.strength?p.renderSprite:(p.renderStyle=currentStyle,p.renderCritical=p.critical,p.renderStrength=p.strength,p.renderSprite=sprite(p)),x=root.FlowLanes?.position(p.lane)||22;context.globalAlpha=image.alpha;context.drawImage(image.image,x-image.width/2,y-4,image.width,image.height);if(capture)drawnPackets.push({source:p.source,lane:p.lane,start:p.start,x,y,width:image.width-8,height:image.height-8});drawn++;peak=Math.max(peak,drawn);}
function clear(){manualPass.length=0;if(context){context.clearRect(0,0,width,height);if(!canvas.hidden)canvas.hidden=true;}drawn=0;drawnPackets=[];}
root.FlowPacketCanvas={begin,draw,end,clear,invalidate(){viewDirty=true;},debugCapture(value){capture=!!value;},snapshot:()=>drawnPackets.map(p=>({...p})),metrics:()=>({renderer:'canvas',rendered:drawn,peak,nodes:canvas?.isConnected?1:0,sprites:sprites.size,width,height,pixels:canvas?canvas.width*canvas.height:0})};
})(window);
