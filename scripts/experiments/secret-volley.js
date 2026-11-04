(function(){
'use strict';
const $=id=>document.getElementById(id),KEY='idle-spiker-secret-volley-v1';
const art=SecretVolleyArt,actors=art.makeActors(),views=[],pointers=new Map();
const preferences={mode:'bot',control:'smart',assist:true};
const record={played:0,wins:[0,0],lastScore:null};
try{const saved=JSON.parse(localStorage.getItem(KEY)||'null');if(saved){if(['bot','local'].includes(saved.mode))preferences.mode=saved.mode;if(['smart','six'].includes(saved.control))preferences.control=saved.control;preferences.assist=saved.assist!==false;if(Number.isSafeInteger(saved.record?.played)&&saved.record.played>=0)record.played=saved.record.played;if(saved.record?.wins?.length===2&&saved.record.wins.every(n=>Number.isSafeInteger(n)&&n>=0))record.wins=saved.record.wins;}}catch{}
let running=false,paused=false,loaded=false,destroyed=false,raf=0,last=0,accumulator=0;
let audioContext=null,resizePending=true,keyboardId=null,finishTimer=0,impact=null;
const metrics={frames:0,physicsSteps:0,drawMs:0,maxDrawMs:0,fallbacks:0,lastFrameMs:0,longFrames:0,nativeBodyDraws:0,sceneBodyDraws:0};
const image=src=>{const im=new Image();im.src=src;return im;};
const volley=image('assets/balls/atlas-1.png');
const model=SecretVolleyModel.create({onEvent:onEvent});
function save(){try{localStorage.setItem(KEY,JSON.stringify({version:1,...preferences,record}));}catch{}}
function feedback(kind='tap'){
 try{
  if(localStorage.getItem('idle-spiker-sound')==='off')return;
  const volume=JSON.parse(localStorage.getItem('idle-spiker-mix')||'{}').effects??.48;if(!(volume>0))return;
  audioContext??=new (window.AudioContext||window.webkitAudioContext)();
  if(audioContext.state==='suspended')audioContext.resume().catch(()=>{});
  const now=audioContext.currentTime,gain=audioContext.createGain(),tone=audioContext.createOscillator();
  tone.type=kind==='point'?'sine':'triangle';tone.frequency.setValueAtTime(kind==='point'?660:kind==='contact'?230:440,now);
  tone.frequency.exponentialRampToValueAtTime(kind==='point'?440:kind==='contact'?110:330,now+.07);
  gain.gain.setValueAtTime(0,now);gain.gain.linearRampToValueAtTime((kind==='contact'?.06:.035)*clamp(volume,0,1),now+.004);gain.gain.exponentialRampToValueAtTime(.001,now+.1);
  tone.connect(gain);gain.connect(audioContext.destination);tone.start(now);tone.stop(now+.11);
 }catch{}
}
function onEvent(e){
 if(e.type==='contact'&&running){feedback('contact');impact={x:e.x,y:e.y,time:e.time};}
 if(e.type==='point'){
  if(running)feedback('point');
  if(e.finished&&running){record.played++;record.wins[e.team]++;record.lastScore=e.score;save();clearTimeout(finishTimer);finishTimer=setTimeout(()=>{if(model.state.finished&&running)pause(true);},350);}
 }
}
function chooseButtons(){
 for(const el of document.querySelectorAll('[data-mode]'))el.setAttribute('aria-pressed',String(el.dataset.mode===preferences.mode));
 for(const el of document.querySelectorAll('[data-control]'))el.setAttribute('aria-pressed',String(el.dataset.control===preferences.control));
 $('assist').checked=preferences.assist;
 $('startHelp').textContent=preferences.control==='six'
  ?'Numaralı analoglar kendi oyuncusunu taşır. Son dokunduğun oyuncu Oyna tuşunu kullanır. Rakip yarıya dokunarak hedef seç.'
  :'Analogla hareket et. Oyna tuşuyla servis at, topa dokun veya bloğa çık. Oyuncuya dokunarak seç; rakip yarıya dokunarak hedef belirle.';
}
document.querySelectorAll('[data-mode]').forEach(el=>el.onclick=()=>{preferences.mode=el.dataset.mode;chooseButtons();feedback();});
document.querySelectorAll('[data-control]').forEach(el=>el.onclick=()=>{preferences.control=el.dataset.control;chooseButtons();feedback();});
$('assist').onchange=()=>{preferences.assist=$('assist').checked;};chooseButtons();
function releaseAll(){
 model.release();pointers.clear();keyboardId=null;keys.clear();
 for(const view of views){view.action.classList.remove('held');for(const stick of view.sticks)resetStick(stick);}
}
function resetStick(stick){stick.root.classList.remove('engaged');stick.nub.style.transform='';stick.number.style.transform='';}
function makeStick(view,slot){
 const root=document.createElement('button');root.type='button';root.className='joystick';root.setAttribute('aria-label',slot===null?'Aktif oyuncuyu hareket ettir':'Oyuncu '+(slot+1)+' hareket');
 root.innerHTML='<img class="pad" draggable="false" src="assets/secret-volley/controls/pad.svg" alt=""><img class="nub" draggable="false" src="assets/secret-volley/controls/nub.svg" alt=""><span class="stick-number"></span>';
 const stick={root,nub:root.querySelector('.nub'),number:root.querySelector('.stick-number'),slot};
 root.addEventListener('pointerdown',e=>{
  if(paused||!running)return;e.preventDefault();if([...pointers.values()].some(p=>p.stick===stick))return;
  const id=slot===null?model.state.active[view.team]:view.team*6+slot;
  model.select(view.team,id,2);pointers.set(e.pointerId,{kind:'stick',view,stick,id});
  root.setPointerCapture(e.pointerId);root.classList.add('engaged');updateStick(e);
 });
 root.addEventListener('pointermove',updateStick);
 for(const type of ['pointerup','pointercancel','lostpointercapture'])root.addEventListener(type,e=>{
  const pointer=pointers.get(e.pointerId);if(!pointer||pointer.stick!==stick)return;
  model.move(view.team,pointer.id,0,0);pointers.delete(e.pointerId);resetStick(stick);
 });
 function updateStick(e){
  const pointer=pointers.get(e.pointerId);if(!pointer||pointer.stick!==stick)return;e.preventDefault();
  const rect=root.getBoundingClientRect(),direction=view.team===1&&preferences.mode==='local'?-1:1;
  let x=(e.clientX-rect.left-rect.width/2)*direction,y=(e.clientY-rect.top-rect.height/2)*direction;
  const radius=rect.width*.3,length=Math.hypot(x,y),factor=length>radius?radius/length:1;x*=factor;y*=factor;
  stick.nub.style.transform=`translate(${x}px,${y}px)`;stick.number.style.transform=`translate(${x}px,${y}px)`;
  const nx=length<radius*.12?0:x/radius,ny=length<radius*.12?0:y/radius;
  // The local view is already reversed; map finger motion into the single shared world.
  model.move(view.team,pointer.id,view.team?-nx:nx,view.team?-ny:ny);
 }
 return stick;
}
function makeView(team){
 const root=document.createElement('section');root.className='view '+preferences.control+(team===1?' control-end upper':' shared-view');root.dataset.team=team;
 root.innerHTML='<header class="view-header"><span class="team-chip">'+(team===0?'Ada takımı':'Kiremit takımı')+'</span><strong class="score">0 : 0</strong><span class="touch-count">0 / 3</span></header><div class="arena"><canvas aria-label="Voleybol sahası"></canvas><div class="view-notice" role="status"></div></div><div class="dock"><div class="sticks"></div><div class="dock-middle"><span class="selected-name"></span><button class="switch-player" type="button">Değiştir ↻</button><span class="control-caption">Hareket · Hedef · Oyna</span></div><button class="action" type="button"><img draggable="false" src="assets/secret-volley/controls/action.svg" alt=""><span>Servis</span></button></div>';
 const view={root,team,arena:root.querySelector('.arena'),canvas:root.querySelector('canvas'),score:root.querySelector('.score'),touch:root.querySelector('.touch-count'),notice:root.querySelector('.view-notice'),name:root.querySelector('.selected-name'),action:root.querySelector('.action'),sticks:[],geometry:null};
 if(team===1){view.arena.remove();view.arena=null;view.canvas=null;}
 else{
  root.querySelector('.view-header').innerHTML='<span class="team-chip">Ada <em class="own-touch">0/3</em></span><strong class="score">0 : 0</strong><span class="team-chip rival-chip">Kiremit <em class="rival-touch">0/3</em></span>';
  view.score=root.querySelector('.score');view.touch=root.querySelector('.own-touch');view.rivalTouch=root.querySelector('.rival-touch');
 }
 view.ctx=view.canvas?.getContext('2d',{alpha:false});
 for(let i=0;i<(preferences.control==='six'?6:1);i++){const stick=makeStick(view,preferences.control==='six'?i:null);view.sticks.push(stick);root.querySelector('.sticks').append(stick.root);}
 root.querySelector('.switch-player').onclick=()=>{if(paused)return;const own=model.state.players.filter(p=>p.team===team),i=own.findIndex(p=>p.id===model.state.active[team]);model.select(team,own[(i+1)%6].id,2);feedback();};
 view.action.addEventListener('pointerdown',e=>{if(paused||!running)return;e.preventDefault();view.action.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{kind:'action',view});view.action.classList.add('held');model.action(team);feedback();});
 for(const type of ['pointerup','pointercancel','lostpointercapture'])view.action.addEventListener(type,e=>{if(pointers.get(e.pointerId)?.view===view)pointers.delete(e.pointerId);view.action.classList.remove('held');});
 view.arena?.addEventListener('pointerdown',e=>{
  if(paused||!running)return;e.preventDefault();view.arena.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{kind:'court',view,team:null});
  courtInput(e,true);
 });
 view.arena?.addEventListener('pointermove',e=>{if(pointers.get(e.pointerId)?.kind==='court')courtInput(e,false);});
 for(const type of ['pointerup','pointercancel','lostpointercapture'])view.arena?.addEventListener(type,e=>{if(pointers.get(e.pointerId)?.kind==='court')pointers.delete(e.pointerId);});
 function courtInput(e,select){
  const pointer=pointers.get(e.pointerId),g=view.geometry;if(!g||!pointer)return;const r=view.canvas.getBoundingClientRect();
  const x=(e.clientX-r.left-g.left)/g.sx,y=(e.clientY-r.top-g.top)/g.sy,half=y>=9?0:1;
  if(!select){if(pointer.team!==null&&!pointer.selection)model.aim(pointer.team,x,y);return;}
  const local=preferences.mode==='local',armed=[...pointers.values()].find(p=>p.kind==='action');
  if(armed&&half!==armed.view.team){pointer.team=armed.view.team;model.aim(pointer.team,x,y);return;}
  if(local||half===0){let closest=null,dist=Infinity;for(const p of model.state.players)if(p.team===half){const d=Math.hypot((p.x-x)*g.sx,(p.y-y)*g.sy);if(d<dist){dist=d;closest=p;}}if(closest&&dist<18){model.select(half,closest.id,2);pointer.selection=true;pointer.team=half;feedback();return;}}
  if(local||half===1){pointer.team=local?1-half:0;model.aim(pointer.team,x,y);}
 }
 $('courts').append(root);views.push(view);
}
function start(){
 if(!loaded)return;clearTimeout(finishTimer);impact=null;releaseAll();$('pauseMenu').close();$('front').hidden=true;$('courts').hidden=false;$('pauseGame').hidden=false;
 views.length=0;$('courts').replaceChildren();$('courts').classList.toggle('solo',preferences.mode==='bot');$('courts').classList.toggle('local',preferences.mode==='local');$('pauseGame').classList.add('solo');
 if(preferences.mode==='local')makeView(1);makeView(0);
 model.reset(preferences);running=true;paused=false;save();resizePending=true;last=0;accumulator=0;feedback();schedule();
}
$('startGame').onclick=start;
function schedule(){if(!raf&&running&&!paused&&!destroyed&&!document.hidden)raf=requestAnimationFrame(frame);}
function frame(now){
 raf=0;if(!running||paused||destroyed||document.hidden)return;
 const dt=last?Math.min(.05,(now-last)/1000):0;metrics.lastFrameMs=last?now-last:0;if(metrics.lastFrameMs>35)metrics.longFrames++;last=now;
 model.tick(dt);metrics.physicsSteps=model.state.stats.frames;
 const before=performance.now();render();metrics.drawMs=performance.now()-before;metrics.maxDrawMs=Math.max(metrics.maxDrawMs,metrics.drawMs);metrics.frames++;schedule();
}
function pause(finished=false){
 if(!running)return;paused=true;cancelAnimationFrame(raf);raf=0;releaseAll();last=0;
 $('pauseTitle').textContent=finished?(model.state.winner===0?'Ada takımı kazandı!':'Kiremit takımı kazandı!'):'Bir nefes';
 $('pauseCopy').textContent=finished?model.state.score.join(' : ')+' · Güzel maçtı. Bir daha?':'Maçın burada bekliyor.';
 $('resumeGame').hidden=finished;$('resumeClose').hidden=finished;
 if(!$('pauseMenu').open)$('pauseMenu').showModal();
}
function resume(){if(!running||model.state.finished)return;$('pauseMenu').close();paused=false;last=0;schedule();}
$('pauseGame').onclick=()=>pause();$('resumeGame').onclick=resume;$('resumeClose').onclick=resume;
$('pauseMenu').addEventListener('cancel',e=>{e.preventDefault();resume();});
$('newGame').onclick=()=>{clearTimeout(finishTimer);releaseAll();running=false;paused=false;cancelAnimationFrame(raf);raf=0;$('pauseMenu').close();$('courts').hidden=true;$('pauseGame').hidden=true;$('front').hidden=false;chooseButtons();};
function exit(){
 running=false;destroyed=true;clearTimeout(finishTimer);cancelAnimationFrame(raf);raf=0;releaseAll();audioContext?.close().catch(()=>{});
 if(window.parent!==window)window.parent.postMessage({type:'spiker-secret-volley',action:'close'},'*');
 else{location.href='index.html';}
}
$('exitGame').onclick=exit;$('leaveGame').onclick=exit;
addEventListener('resize',()=>{resizePending=true;releaseAll();});
addEventListener('blur',()=>{if(running&&!paused)pause();else releaseAll();});
document.addEventListener('visibilitychange',()=>{if(document.hidden&&running&&!paused)pause();});
addEventListener('pagehide',()=>{destroyed=true;clearTimeout(finishTimer);cancelAnimationFrame(raf);releaseAll();audioContext?.close().catch(()=>{});});
const keys=new Set();
addEventListener('keydown',e=>{
 if(!running||paused||/INPUT|SELECT|TEXTAREA/.test(e.target.tagName))return;
 if(e.code==='Escape'){e.preventDefault();pause();return;}
 if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space','KeyW','KeyA','KeyS','KeyD','KeyE','KeyQ'].includes(e.code))e.preventDefault();
 keys.add(e.code);if(e.code==='Space'&&!e.repeat){model.action(0);feedback();}if(e.code==='KeyQ'&&!e.repeat)views.find(v=>v.team===0)?.root.querySelector('.switch-player').click();
 if(e.code==='KeyE'&&!e.repeat&&preferences.mode==='local')model.action(1);updateKeys();
});
addEventListener('keyup',e=>{keys.delete(e.code);updateKeys();});
function updateKeys(){
 if(!running||paused)return;const id=model.state.active[0];if(keyboardId!==null&&keyboardId!==id)model.move(0,keyboardId,0,0);keyboardId=id;
 model.move(0,id,Number(keys.has('ArrowRight'))-Number(keys.has('ArrowLeft')),Number(keys.has('ArrowDown'))-Number(keys.has('ArrowUp')));
 if(preferences.mode==='local'){const p=model.state.active[1];model.move(1,p,Number(keys.has('KeyA'))-Number(keys.has('KeyD')),Number(keys.has('KeyW'))-Number(keys.has('KeyS')));}
}
function resize(view){
 if(!view.arena)return;
 const w=view.arena.clientWidth,h=view.arena.clientHeight,dpr=Math.min(2,devicePixelRatio||1);
 if(w<1||h<1)return;
 view.canvas.width=Math.round(w*dpr);view.canvas.height=Math.round(h*dpr);
 const top=Math.min(48,Math.max(16,h*.125)),ch=Math.max(16,h-top-Math.min(40,h*.18)),cw=Math.min(w-42,ch*.69),left=(w-cw)/2;
 view.geometry={w,h,dpr,left,top,sx:cw/9,sy:ch/18,cw,ch};
 view.floor=document.createElement('canvas');view.floor.width=view.canvas.width;view.floor.height=view.canvas.height;
 const c=view.floor.getContext('2d');c.scale(dpr,dpr);drawFloor(c,view);
}
function project(view,x,y){const g=view.geometry;return {x:g.left+x*g.sx,y:g.top+y*g.sy};}
function drawFloor(c,view){
 const g=view.geometry;c.fillStyle='#bddcdb';c.fillRect(0,0,g.w,g.h);
 c.fillStyle='#82aaa5';c.beginPath();c.roundRect(g.left-12,g.top-3,g.cw+24,g.ch+8,10);c.fill();
 c.fillStyle='#d2a16b';c.fillRect(g.left,g.top,g.cw,g.ch);
 // A small cached parquet pattern, not hundreds of per-frame primitives.
 for(let i=0;i<12;i++){c.fillStyle=i%2?'#d5a66f':'#cea06c';c.fillRect(g.left+i*g.cw/12,g.top,g.cw/12,g.ch);}
 c.strokeStyle='#fff8de';c.lineWidth=1.5;c.strokeRect(g.left,g.top,g.cw,g.ch);
 for(const y of [6,12]){const p=project(view,0,y);c.beginPath();c.moveTo(g.left,p.y);c.lineTo(g.left+g.cw,p.y);c.stroke();}
 c.globalAlpha=.18;c.strokeStyle='#fff5db';c.lineWidth=2;
 for(const y of [3,15]){const p=project(view,4.5,y);c.beginPath();c.arc(p.x,p.y,Math.min(g.cw*.16,19),0,Math.PI*2);c.stroke();}
 c.globalAlpha=1;
}
function drawNet(c,view){
 const g=view.geometry,y=project(view,0,9).y-3;
 c.strokeStyle='#445a64';c.lineWidth=4;c.beginPath();c.moveTo(g.left-7,y);c.lineTo(g.left+g.cw+7,y);c.stroke();
 c.strokeStyle='#f7edce';c.lineWidth=1;c.beginPath();c.moveTo(g.left-7,y-2);c.lineTo(g.left+g.cw+7,y-2);c.stroke();
 c.strokeStyle='#95b1af';c.lineWidth=.8;for(let x=g.left;x<g.left+g.cw;x+=5){c.beginPath();c.moveTo(x,y);c.lineTo(x,y+4);c.stroke();}
 c.fillStyle='#f4e9c8';for(const x of [g.left-7,g.left+g.cw+7]){c.beginPath();c.arc(x,y,3,0,Math.PI*2);c.fill();}
}
const displayActors=actors.map(a=>({...a}));
// Keep still native bodies between frames; update actual moving/action poses at 2× resolution.
const bodyFrames=actors.map(()=>{const canvas=document.createElement('canvas');canvas.width=canvas.height=192;return {canvas,ctx:canvas.getContext('2d'),ready:false,key:''};});
function prepareBodies(){
 for(const p of model.state.players){
  const a=displayActors[p.id],body=bodyFrames[p.id],c=body.ctx,moving=Math.hypot(p.vx,p.vy)>.1;
  const key=p.pose+'|'+p.jump.toFixed(4)+'|'+(p.pose==='idle'&&!moving?'still':[p.phase,p.poseTime,p.poseAge,p.angle].map(n=>n.toFixed(4)).join('|'));
  if(body.ready&&body.key===key)continue;
  Object.assign(a,{angle:p.angle,phase:p.phase,moving,courtVX:p.vx*30,courtVY:p.vy*30,
   jump:p.jump>0?.25:0,previewLift:p.jump*16,block:p.pose==='block'?p.poseTime:0,spike:p.pose==='strike'?Math.max(.01,.65-p.poseAge):0,
   toss:p.pose==='set'?p.poseTime:0,receive:p.pose==='receive'?p.poseTime:0,vectorPose:p.pose==='block'?'block':p.pose==='set'?'set':p.pose==='receive'?'receive':undefined});
  c.setTransform(1,0,0,1,0,0);c.clearRect(0,0,192,192);c.save();c.translate(96,96);c.scale(2,2);c.translate(-16,-43);
  body.ready=MatchVectorCharacters.draw(c,a,model.state.time);body.key=key;metrics.nativeBodyDraws++;if(!body.ready)metrics.fallbacks++;c.restore();
 }
}
function drawActor(c,view,p){
 const g=view.geometry,pos=project(view,p.x,p.y),body=bodyFrames[p.id],local=preferences.mode==='local',active=p.id===model.state.active[p.team];
 const size=Math.max(.14,Math.min(.72,g.sx*.035));
 c.fillStyle='#35575a33';c.beginPath();c.ellipse(pos.x,pos.y+2,9*size,6*size,0,0,Math.PI*2);c.fill();
 if(active&&(local||p.team===0)){c.strokeStyle='#fff5c4';c.lineWidth=1.6;c.beginPath();c.ellipse(pos.x,pos.y+2,13*size,9*size,0,0,Math.PI*2);c.stroke();}
 c.save();c.translate(pos.x,pos.y-p.jump*g.sy*.65);c.rotate(p.angle);c.scale(size,size);
 if(body.ready){c.drawImage(body.canvas,-48,-48,96,96);metrics.sceneBodyDraws++;}
 c.restore();
 // Controller numbers live on the court, not on the character's kit.
 if((local||p.team===0)&&g.ch>100){c.save();c.translate(pos.x,pos.y+(local&&p.team===1?-1:1)*Math.max(8,14*size));if(local&&p.team===1)c.rotate(Math.PI);c.fillStyle=active?'#fff7db':'#eef5df';c.font=`bold ${Math.max(8,9*size/.5)}px 'Trebuchet MS'`;c.textAlign='center';c.fillText(String(p.slot+1),0,0);c.restore();}
}
function renderView(view){
 if(!view.arena){updateHUD(view);return;}const g=view.geometry;if(!g)return;const c=view.ctx,s=model.state;
 c.setTransform(1,0,0,1,0,0);c.drawImage(view.floor,0,0);c.setTransform(g.dpr,0,0,g.dpr,0,0);
 for(const team of preferences.mode==='local'?[0,1]:[0]){const target=project(view,s.aim[team].x,s.aim[team].y);c.strokeStyle=team?'#ffe0bcaa':'#fff3bd99';c.lineWidth=1.3;c.beginPath();c.arc(target.x,target.y,6,0,Math.PI*2);c.moveTo(target.x-9,target.y);c.lineTo(target.x+9,target.y);c.moveTo(target.x,target.y-9);c.lineTo(target.x,target.y+9);c.stroke();}
 if(s.phase==='rally'&&(preferences.mode==='local'||s.ball.flightTeam===0)){const incoming=model.predict(),p=project(view,incoming.x,incoming.y);c.save();c.strokeStyle='#fff6daaa';c.lineWidth=1.2;c.setLineDash([3,3]);c.beginPath();c.arc(p.x,p.y,8,0,Math.PI*2);c.stroke();c.restore();}
 if(impact&&s.time-impact.time<.22){const p=project(view,impact.x,impact.y),t=(s.time-impact.time)/.22;c.save();c.globalAlpha=1-t;c.strokeStyle='#fff3bc';c.lineWidth=1.3;c.beginPath();c.arc(p.x,p.y,3+t*11,0,Math.PI*2);c.stroke();c.restore();}
 const sorted=s.players.slice().sort((a,b)=>project(view,a.x,a.y).y-project(view,b.x,b.y).y);
 for(const p of sorted)if(project(view,p.x,p.y).y<g.top+g.ch/2)drawActor(c,view,p);
 drawNet(c,view);
 for(const p of sorted)if(project(view,p.x,p.y).y>=g.top+g.ch/2)drawActor(c,view,p);
 const b=s.ball,bp=project(view,b.x,b.y),height=b.z*Math.min(g.sy*.75,12),r=clamp(g.sx*.16,3,5.3);
 c.fillStyle='#283c4760';c.beginPath();c.arc(bp.x,bp.y,r*.7,0,Math.PI*2);c.fill();
 const by=bp.y-height;c.save();c.translate(bp.x,by);c.rotate(s.time*(b.vx+b.vy)*.22);
 if(volley.complete&&volley.naturalWidth)c.drawImage(volley,-r,-r,r*2,r*2);
 else{c.fillStyle='#f8d555';c.beginPath();c.arc(0,0,r,0,Math.PI*2);c.fill();}
 c.strokeStyle='#47636b';c.lineWidth=.6;c.beginPath();c.arc(0,0,r,0,Math.PI*2);c.stroke();c.restore();
 if(s.phase==='rally'&&b.z<2.43&&bp.y<g.top+g.ch/2&&Math.abs(bp.y-(g.top+g.ch/2))<4)drawNet(c,view);
 updateHUD(view);
}
function updateHUD(view){
 const s=model.state;
 const score=s.score[view.team]+' : '+s.score[1-view.team];if(view.score.textContent!==score)view.score.textContent=score;
 const touches=s.lastTeam===view.team?s.touches:0;view.touch.textContent=touches+'/3';if(view.rivalTouch)view.rivalTouch.textContent=(s.lastTeam===1?s.touches:0)+'/3';
 const p=s.players[s.active[view.team]],name=(p.slot+1)+' · '+actors[p.id].roster.name;if(view.name.textContent!==name)view.name.textContent=name;
 const action=s.phase==='serve'?(s.serving===view.team?'Servis':'Bekle'):s.lastTeam===view.team?(s.touches===2?'Smaç':'Pas'):'Oyna';
 if(view.action.lastElementChild.textContent!==action)view.action.lastElementChild.textContent=action;
 view.action.classList.toggle('armed',!!s.arms[view.team]);
 for(const stick of view.sticks){const number=stick.slot===null?p.slot+1:stick.slot+1;stick.number.textContent=number;stick.root.classList.toggle('selected',number===p.slot+1);}
 const notice=s.phase==='point'?(s.winner===view.team?'Sayı sende! · ':'Sayı rakipte · ')+s.notice:s.phase==='serve'?(s.serving===view.team?'Servis için tuşa bas':'Servis karşı tarafta'):s.notice;
 const displayNotice=preferences.mode==='local'?(s.phase==='point'?(s.winner===0?'Ada +1 · ':'Kiremit +1 · ')+s.notice:s.phase==='serve'?(s.serving===0?'Ada · Servis':'Kiremit · Servis'):s.notice):notice;
 if(view.arena&&view.notice.textContent!==displayNotice){view.notice.textContent=displayNotice;view.notice.classList.remove('flash');void view.notice.offsetWidth;view.notice.classList.add('flash');}
}
function render(){if(resizePending){for(const view of views)resize(view);$('pauseGame').style.top=((views.find(v=>v.arena)?.root.offsetTop||0)+3)+'px';resizePending=false;}prepareBodies();for(const view of views)renderView(view);}
function clamp(n,a,b){return Math.max(a,Math.min(b,n));}
Promise.all([MatchVectorCharacters.prewarm(actors),volley.decode().catch(()=>{})]).then(()=>{
 // Warm the moving-body batches as well as the static poses before the first rally.
 const warm=document.createElement('canvas');warm.width=warm.height=160;const c=warm.getContext('2d');
 for(const a of actors){c.save();c.translate(50,50);MatchVectorCharacters.draw(c,{...a,moving:true,courtVX:60,courtVY:0,angle:0,phase:0},0);c.restore();}
 loaded=true;$('startGame').disabled=false;$('startGame').textContent='Sahaya çık';
}).catch(e=>{$('loadError').hidden=false;$('loadError').textContent='Salon hazırlanamadı. Mini oyunu kapatıp yeniden açabilirsin.';console.error(e);});
// Explicit inspection surface for isolated browser tests; never a main-game cheat or reward API.
window.SecretVolley={model,metrics,get preferences(){return {...preferences};},get running(){return running;},get paused(){return paused;},start,pause,resume,render,
 inspectBodyEdges(){return bodyFrames.map((body,id)=>{const data=body.ctx.getImageData(0,0,192,192).data;let touching=0;for(let i=0;i<192;i++)for(const [x,y]of [[i,0],[i,191],[0,i],[191,i]])if(data[(y*192+x)*4+3])touching++;return {id,touching};});},
 get views(){return views;},setMode(mode,control='smart'){if(!['local','bot'].includes(mode)||!['smart','six'].includes(control))return;preferences.mode=mode;preferences.control=control;chooseButtons();},
 get loaded(){return loaded;}};
})();
