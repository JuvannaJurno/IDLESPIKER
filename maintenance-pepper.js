(function(){
'use strict';
function pepper(gate){
 if(!window.TeamAppearance)return()=>{};
 const canvas=document.createElement('canvas');canvas.width=840;canvas.height=500;canvas.setAttribute('aria-label','İki oyuncu karşılıklı pepper antrenmanı yapıyor');canvas.setAttribute('role','img');canvas.style.cssText='display:block;width:min(340px,85vw);height:auto;margin:18px auto 0;pointer-events:none';gate.querySelector('.maintenance-copy').append(canvas);const ctx=canvas.getContext('2d'),sets=[];
 for(let side=0;side<2;side++){const appearance=TeamAppearance.generate(),poses=[];for(let pose=0;pose<3;pose++){const a=JSON.parse(JSON.stringify(appearance));for(const part of a.parts){if(/^(arm|sleeve)-/.test(part.id)){const left=part.id.endsWith('left');part.rotation+=pose===1?(left?-35:35):pose===2?(left?65:-65):0;}if(part.id.startsWith('hand-')){part.x+=pose===2?(part.id.endsWith('left')?65:-65):0;part.y-=pose===2?145:pose===1?35:0;}}const img=new Image();img.src=TeamAppearance.portrait(a).replace(encodeURIComponent('viewBox="150 65 300 355"'),encodeURIComponent('viewBox="40 80 520 620"'));poses.push(img);}sets.push(poses);}
 let raf=0,last=0,time=Math.random()*2,stopped=false;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
 function draw(now){if(stopped)return;if(!document.hidden){const dt=last?Math.min(.05,(now-last)/1000):0;time+=dt;ctx.clearRect(0,0,840,500);ctx.save();ctx.scale(2,2);ctx.strokeStyle='#9ab7a366';ctx.lineWidth=1;ctx.beginPath();ctx.ellipse(210,220,175,21,0,0,Math.PI*2);ctx.stroke();const phase=time%4.8,segment=Math.floor(phase/1.2),u=phase/1.2-segment,receiving=segment===0?1:segment===2?0:-1,setting=segment===1?1:segment===3?0:-1;
 for(let i=0;i<2;i++){const x=i?288:52,bob=reduced?0:Math.sin(time*3+i)*1.3,pose=setting===i?2:receiving===i&&u>.73?1:0;ctx.fillStyle='#527b6c25';ctx.beginPath();ctx.ellipse(x+40,215,28,6,0,0,Math.PI*2);ctx.fill();const image=sets[i][pose];if(image.complete&&image.naturalWidth){ctx.save();ctx.translate(x+40,0);if(i)ctx.scale(-1,1);ctx.drawImage(image,-52,84+bob,104,130);ctx.restore();}}
 let x,y;if(segment===0||segment===2){x=segment===0?96+232*u:328-232*u;y=150-75*Math.sin(Math.PI*u);}else{x=segment===1?328:96;y=150-80*Math.sin(Math.PI*u);}
 ctx.save();ctx.translate(x,y);ctx.rotate(time*2);ctx.fillStyle='#f7e5af';ctx.strokeStyle='#8b936f';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(0,0,7,0,Math.PI*2);ctx.fill();ctx.stroke();ctx.beginPath();ctx.arc(-3,0,5,-1.5,1.5);ctx.stroke();ctx.beginPath();ctx.moveTo(-6,-3);ctx.lineTo(6,3);ctx.stroke();ctx.restore();ctx.restore();}last=now;raf=requestAnimationFrame(draw);}
 raf=requestAnimationFrame(draw);return()=>{stopped=true;cancelAnimationFrame(raf);canvas.remove();};
}
window.MaintenancePepper=pepper;
})();
