let walking=false,walkFrame=0,walkStart=0;
function walkMotion(seconds,speed,amount,axis,side){const wave=-Math.cos(seconds*Math.PI*2*speed)*side;return{dx:0,dy:0,angle:0,stretch:amount===0?1:wave*Math.min(amount/5,1.5)}}
function stopWalking(){if(!walking)return;walking=false;cancelAnimationFrame(walkFrame);$('walk').textContent='▶ Yürüme denemesi';render()}
function animateWalking(time){if(!walking)return;if(!walkStart)walkStart=time;const speed=Number($('walkSpeed').value),amount=Number($('walkAmount').value),axis=$('walkAxis').value;
 for(const [side,sign]of [['left',1],['right',-1]]){const shoulder=parts.find(p=>p.id==='sleeve-'+side);if(!shoulder)continue;const c=pivot(shoulder),m=walkMotion((time-walkStart)/1000,speed,amount,axis,sign);for(const p of parts.filter(p=>p.id==='arm-'+side||p.id==='sleeve-'+side)){const node=$('pieces').querySelector('[data-id="'+p.id+'"]');if(node)node.setAttribute('transform',`translate(${c.x} ${c.y}) scale(${m.stretch} 1) translate(${-c.x} ${-c.y}) ${transform(p)}`)}}
 walkFrame=requestAnimationFrame(animateWalking);
}
$('walk').onclick=()=>{if(walking){stopWalking();return}selected=[];render();walking=true;walkStart=0;$('walk').textContent='■ Yürümeyi durdur';walkFrame=requestAnimationFrame(animateWalking)};
stage.addEventListener('pointerdown',stopWalking,true);
if(typeof window!=='undefined')document.addEventListener('visibilitychange',()=>{if(document.hidden)stopWalking()});
for(const [id,side]of [['selectTopArm','left'],['selectBottomArm','right']])$(id).onclick=()=>{stopWalking();selected=['sleeve-'+side,'arm-'+side];render()};
for(const id of ['export','snapshot','reset','undo','redo','import','originalColors','matchColors']){const handler=$(id).onclick;$(id).onclick=function(...args){stopWalking();return handler?.apply(this,args)}}
