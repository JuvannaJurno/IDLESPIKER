/* Standalone presentation/input for SON IŞIK. It never imports the idle simulation. */
(function(){
'use strict';
const $=id=>document.getElementById(id),API=window.DeathGameModel,KEY='idle-spiker-death-game-v1';
const model=API.create(),canvas=$('scene'),ctx=canvas.getContext('2d',{alpha:false}),back=document.createElement('canvas'),bg=back.getContext('2d');
const COLORS=['#d5ae60','#849b99','#ac8b94','#99a17f','#8996ad','#b6927b','#739b91','#a38fbc','#98a9b4','#b4a78c'];
const TILE=['#b97570','#699c91','#bd9b59','#8e88b1'],NAMES=['MERCAN','YEŞİM','BAL','LEYLAK'],SYMBOL=['△','○','□','◇'];
let geometry={x:0,y:0,s:1,w:0,h:0},raf=0,last=0,paused=false,shown='',recorded=false,audio=null,lastRule='',particles=[],stickPointer=null,jumpPointer=null,stickVector={x:0,y:0},keys=new Set(),continued=null;
const metrics={frames:0,maxDraw:0,steps:0},voices=new Set();let record={attempts:0,best:0,wins:0};
try{const r=JSON.parse(localStorage.getItem(KEY)||'null');if(r&&r.version===1)for(const k of Object.keys(record))if(Number.isSafeInteger(r[k])&&r[k]>=0)record[k]=r[k];}catch{}
function save(){try{localStorage.setItem(KEY,JSON.stringify({version:1,...record}));}catch{}}
function best(){ $('best').textContent=record.attempts?`En iyi: ${record.best} / 5 kapı · ${record.wins} tamamlanan kaçış`:'';}
function sound(kind){
 try{if(localStorage.getItem('idle-spiker-sound')==='off')return;const mix=JSON.parse(localStorage.getItem('idle-spiker-mix')||'{}'),volume=Math.max(0,Math.min(.15,(mix.effects??.48)*.14));if(!volume)return;
  audio??=new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();
  const now=audio.currentTime,notes=kind==='clear'?[392,494,587]:kind==='dead'?[180,110]:kind==='coin'?[740,988]:kind==='red'?[165]:kind==='jump'?[320,470]:[460];
  notes.forEach((f,i)=>{const o=audio.createOscillator(),g=audio.createGain();voices.add(o);o.onended=()=>{voices.delete(o);o.disconnect();g.disconnect();};o.type=kind==='dead'?'triangle':'sine';o.frequency.value=f;g.gain.setValueAtTime(0,now+i*.065);g.gain.linearRampToValueAtTime(volume,now+i*.065+.012);g.gain.exponentialRampToValueAtTime(.0001,now+i*.065+.13);o.connect(g);g.connect(audio.destination);o.start(now+i*.065);o.stop(now+i*.065+.15);});
 }catch{}
}
function rr(c,x,y,w,h,r,fill,stroke){c.beginPath();c.roundRect(x,y,w,h,r);if(fill){c.fillStyle=fill;c.fill();}if(stroke){c.strokeStyle=stroke;c.stroke();}}
function pos(x,y){const g=geometry;return {x:g.x+x*g.s,y:g.y+y*g.s};}
function circle(c,x,y,r,color){if(r<=0)return;c.beginPath();c.arc(x,y,r,0,Math.PI*2);c.fillStyle=color;c.fill();}
function text(c,value,x,y,size,color,align='center'){c.font=`bold ${size}px 'Trebuchet MS',sans-serif`;c.textAlign=align;c.textBaseline='middle';c.fillStyle=color;c.fillText(value,x,y);}
function worldLine(c,ax,ay,bx,by,color,width){const a=pos(ax,ay),b=pos(bx,by);c.strokeStyle=color;c.lineWidth=width*geometry.s;c.beginPath();c.moveTo(a.x,a.y);c.lineTo(b.x,b.y);c.stroke();}
function floor(){
 const g=geometry,s=g.s;bg.fillStyle='#243d47';bg.fillRect(0,0,g.w,g.h);
 rr(bg,g.x-.19*s,g.y-.2*s,12.38*s,16.4*s,.45*s,'#6f9089');
 rr(bg,g.x,g.y,12*s,16*s,.28*s,'#344e55');
 bg.save();bg.beginPath();bg.rect(g.x,g.y,12*s,16*s);bg.clip();
 for(let y=0;y<16;y++)for(let x=0;x<12;x++){bg.fillStyle=(x+y)%2?'#385359':'#3c575c';bg.fillRect(g.x+x*s,g.y+y*s,s,s);}
 bg.strokeStyle='#72928a35';bg.lineWidth=1;
 for(let x=1;x<12;x++){bg.beginPath();bg.moveTo(g.x+x*s,g.y);bg.lineTo(g.x+x*s,g.y+16*s);bg.stroke();}
 for(let y=1;y<16;y++){bg.beginPath();bg.moveTo(g.x,g.y+y*s);bg.lineTo(g.x+12*s,g.y+y*s);bg.stroke();}
 bg.restore();
 for(let x=1;x<=11;x+=2){const p=pos(x,.35);rr(bg,p.x-.22*s,p.y-.06*s,.44*s,.12*s,.03*s,'#cfb97d');}
 const p=pos(6,.55);rr(bg,p.x-1.2*s,p.y-.27*s,2.4*s,.66*s,.18*s,'#203943','#92a296');text(bg,'SON IŞIK',p.x,p.y+.06*s,.22*s,'#c1ceba');
}
function resize(){const r=$('arena').getBoundingClientRect(),dpr=Math.min(2,devicePixelRatio||1);canvas.width=Math.max(1,Math.round(r.width*dpr));canvas.height=Math.max(1,Math.round(r.height*dpr));back.width=canvas.width;back.height=canvas.height;
 ctx.setTransform(dpr,0,0,dpr,0,0);bg.setTransform(dpr,0,0,dpr,0,0);const s=Math.min((r.width-22)/12,(r.height-16)/16);geometry={x:(r.width-12*s)/2,y:(r.height-16*s)/2,s:Math.max(.1,s),w:r.width,h:r.height};floor();render();}
function drawDoor(open){const g=geometry,s=g.s,p=pos(6,1.15);rr(ctx,p.x-1.5*s,p.y-.43*s,3*s,.86*s,.18*s,open?'#d2bb74':'#607b76','#b3c6ac');text(ctx,open?'ÇIKIŞ ↑':'05 JETON',p.x,p.y,.22*s,open?'#3c554e':'#d5dfca');}
function hazards(h){
 const s=geometry.s,id=model.state.game.id,t=model.state.elapsed;
 ctx.save();ctx.beginPath();const o=pos(0,0);ctx.rect(o.x,o.y,12*s,16*s);ctx.clip();
 if(id==='silence'){
  drawDoor(true);const color=h.light==='red'?'#d47a6b':h.light==='amber'?'#e5bf6c':'#90b695';
  [2.8,6,9.2].forEach((x,i)=>{const p=pos(x,2.25);circle(ctx,p.x,p.y,.22*s,i===({green:0,amber:1,red:2}[h.light])?color:'#263e47');});
  worldLine(ctx,.5,2.9,11.5,2.9,color,.035);
  if(h.light==='red'){ctx.fillStyle='#c2786920';ctx.fillRect(o.x,o.y+2.9*s,12*s,13.1*s);for(let y=3.1;y<16;y+=.65)worldLine(ctx,.5,y,11.5,y,'#ba7f6d30',.025);}
  const p=pos(6,15.55);text(ctx,'07 · SEN',p.x,p.y,.22*s,'#a4b6a7');
 }else if(id==='tiles'){
  for(let r=0;r<4;r++)for(let c=0;c<4;c++){const color=API.tileColor(c,r,h.cycle),p=pos(.5+c*2.75,2+r*3),safe=color===h.safe;
   rr(ctx,p.x+.05*s,p.y+.05*s,2.65*s,2.9*s,.1*s,h.collapse&&!safe?'#192f3c':TILE[color]);
   if(!h.collapse||safe){text(ctx,SYMBOL[color],p.x+1.375*s,p.y+1.5*s,.48*s,safe?'#fff2cb':'#efe7ce88');if(safe){ctx.strokeStyle='#ffe9af';ctx.lineWidth=.04*s;ctx.strokeRect(p.x+.13*s,p.y+.13*s,2.49*s,2.74*s);}}
   else {worldLine(ctx,.5+c*2.75+.3,2+r*3+.3,.5+c*2.75+2.4,2+r*3+2.65,'#72918a30',.025);}
  }
 }else if(id==='clock'){
  const p=pos(6,8);for(let r=2;r<=6;r+=2){ctx.beginPath();ctx.arc(p.x,p.y,r*s,0,Math.PI*2);ctx.strokeStyle='#8eab9a25';ctx.lineWidth=.03*s;ctx.stroke();}
  for(let i=0;i<12;i++){const a=i/12*Math.PI*2;worldLine(ctx,6+Math.cos(a)*5.35,8+Math.sin(a)*5.35,6+Math.cos(a)*5.7,8+Math.sin(a)*5.7,'#b7ad7d',.05);}
  const a=h.angle,ax=6-Math.cos(a)*11,ay=8-Math.sin(a)*11,bx=6+Math.cos(a)*11,by=8+Math.sin(a)*11;
  worldLine(ctx,ax,ay,bx,by,h.live?'#c99b5b66':'#c7aa6a40',.55);worldLine(ctx,ax,ay,bx,by,h.live?'#eac47a':'#9da58c',.19);worldLine(ctx,ax,ay,bx,by,'#fff0b3',.045);
  circle(ctx,p.x,p.y,1.04*s,'#233b45');circle(ctx,p.x,p.y,.72*s,'#88967c');circle(ctx,p.x,p.y,.38*s,'#c9ad6a');text(ctx,'✦',p.x,p.y,.35*s,'#3a5558');
 }else if(id==='vault'){
  drawDoor(model.state.players[0].coins>=5);
  const p=pos(0,h.ink);ctx.fillStyle='#1b293ee8';ctx.fillRect(p.x,p.y,12*s,(16-h.ink)*s);worldLine(ctx,0,h.ink,12,h.ink,'#8c83af',.06);
  for(let x=.5;x<12;x+=.65){const p=pos(x,h.ink+.1+Math.sin(t*3+x)*.08);circle(ctx,p.x,p.y,.1*s,'#867fa055');}
  h.tokens.forEach((coin,i)=>{if(model.state.players[0].collected&(1<<i))return;const p=pos(coin.x,coin.y);circle(ctx,p.x,p.y+.12*s,.24*s,'#182e3840');circle(ctx,p.x,p.y,.21*s,'#e8c66f');circle(ctx,p.x,p.y,.13*s,'#9d7e47');text(ctx,'·',p.x,p.y,.3*s,'#ffe9ae');});
  h.presses.forEach(b=>{worldLine(ctx,.4,b.y,11.6,b.y,'#a7816555',.045);const p=pos(b.x,b.y);rr(ctx,p.x-1.12*s,p.y-.36*s,2.24*s,.72*s,.09*s,'#bf8170','#edc59a');for(let x=-.8;x<1;x+=.38)worldLine(ctx,b.x+x,b.y-.25,b.x+x+.18,b.y+.25,'#633f4660',.07);});
 }else{
  h.waves.forEach(w=>{const p=pos(6,8);if(w.warning){circle(ctx,p.x,p.y,(.4+(.9+w.age)*.7)*s,'#d3bb7b77');return;}ctx.beginPath();ctx.arc(p.x,p.y,Math.max(0,w.radius)*s,0,Math.PI*2);ctx.strokeStyle='#96c0bd33';ctx.lineWidth=.62*s;ctx.stroke();ctx.strokeStyle='#b8d3c0';ctx.lineWidth=.16*s;ctx.stroke();ctx.strokeStyle='#fbefbc';ctx.lineWidth=.035*s;ctx.stroke();});
  const p=pos(6,8);circle(ctx,p.x,p.y,.47*s,'#729895');circle(ctx,p.x,p.y,.2*s,'#e6d6a0');
 }
 ctx.restore();
}
function actorShadow(p){const pt=pos(p.x,p.y);ctx.save();if(!p.alive)ctx.globalAlpha=.17;circle(ctx,pt.x,pt.y+.05*geometry.s,.32*geometry.s,'#122c3b70');ctx.restore();}
function actor(p){
 const s=geometry.s,point=pos(p.x,p.y),height=model.jumpHeight(p)*s*.7,walk=Math.hypot(p.vx,p.vy)>.1?Math.sin(model.state.elapsed*18+p.id)*.09*s:0;
 ctx.save();if(!p.alive)ctx.globalAlpha=.17;
 if(!p.id){ctx.beginPath();ctx.ellipse(point.x,point.y,.48*s,.25*s,0,0,Math.PI*2);ctx.strokeStyle='#f9d788';ctx.lineWidth=.05*s;ctx.stroke();}
 const y=point.y-height,col=COLORS[p.id];
 rr(ctx,point.x-.2*s,y-.2*s+walk,.15*s,.26*s,.06*s,'#22383e');rr(ctx,point.x+.05*s,y-.2*s-walk,.15*s,.26*s,.06*s,'#22383e');
 ctx.lineWidth=.04*s;rr(ctx,point.x-.25*s,y-.65*s,.5*s,.56*s,.14*s,col,'#1f3843');
 rr(ctx,point.x-.38*s,y-.53*s-walk,.14*s,.35*s,.06*s,col,'#1f3843');rr(ctx,point.x+.24*s,y-.53*s+walk,.14*s,.35*s,.06*s,col,'#1f3843');
 circle(ctx,point.x,y-.83*s,.29*s,'#1e3440');circle(ctx,point.x,y-.85*s,.255*s,col);rr(ctx,point.x-.18*s,y-.91*s,.36*s,.13*s,.06*s,'#233f49');
 circle(ctx,point.x-.07*s,y-.85*s,.022*s,'#f1e2ba');circle(ctx,point.x+.07*s,y-.85*s,.022*s,'#f1e2ba');
 text(ctx,p.id?String(p.id+10):'07',point.x,y-.35*s,.16*s,'#fef5d7');
 if(!p.id){const yy=y-1.3*s;ctx.fillStyle='#ffe2a0';ctx.beginPath();ctx.moveTo(point.x,yy+.13*s);ctx.lineTo(point.x-.12*s,yy-.04*s);ctx.lineTo(point.x+.12*s,yy-.04*s);ctx.fill();}
 if(p.finished){text(ctx,'✓',point.x+.4*s,y-.8*s,.3*s,'#e6d386');}
 ctx.restore();
}
function hud(h){
 const st=model.state,p=st.players[0];$('stageLabel').textContent=`${st.round+1} / 5 · ${st.game.name}`;$('timer').textContent=String(Math.ceil(Math.max(0,st.game.duration-st.elapsed))).padStart(2,'0');$('timer').style.color=st.game.duration-st.elapsed<5?'#a95f54':'';$('survivors').textContent=st.players.filter(p=>p.alive).length+' kişi';
 let label=st.game.hint,mode='',icon='◇',time='';
 if(st.game.id==='silence'){label={green:'YÜRÜ · Kapıya ilerle',amber:'HAZIRLAN · Durmak üzere',red:'DUR · Hareket etme'}[h.light];mode={green:'safe',amber:'warning',red:'danger'}[h.light];icon=h.light==='red'?'■':'●';time=h.left.toFixed(1);}
 if(st.game.id==='tiles'){label=`${NAMES[h.safe]} · ${h.collapse?'Zemin açık!':'Bu renge geç'}`;mode=h.collapse?'danger':'warning';time=(h.cycle+1)+'/5';icon=SYMBOL[h.safe];}
 if(st.game.id==='clock'){label=h.live?'Dönen kolu aş · SIÇRA':'Kol birazdan dönecek';mode=h.live?'':'warning';icon='↻';}
 if(st.game.id==='vault'){label=p.coins>=5?'Yeterli jeton · KAPIYA KOŞ':`${p.coins} / 5 jeton · Topla ve kaç`;mode=p.coins>=5?'safe':'';icon='◆';}
 if(st.game.id==='tide'){label=h.waves.some(w=>w.warning)?'Yeni dalga geliyor':'Halka yaklaşınca SIÇRA';mode=h.waves.some(w=>w.warning)?'warning':'';icon='◎';}
 if(p.finished){label='Kapıdasın · Diğer yarışmacılar bekleniyor';mode='safe';icon='✓';}
 $('rule').className='rule '+mode;$('ruleText').textContent=label;$('ruleIcon').textContent=icon;$('ruleTime').textContent=time;
 if(st.game.id==='silence'&&h.light==='red'&&lastRule!=='red')sound('red');lastRule=st.game.id==='silence'?h.light:'';
 $('jump').classList.toggle('cooldown',p.cooldown>0);$('jump').setAttribute('aria-disabled',String(p.cooldown>0||p.finished));$('jump').querySelector('span').textContent=p.cooldown>.04?p.cooldown.toFixed(1):'Sıçra';$('jumpRing').style.strokeDashoffset=270*(1-Math.min(1,p.cooldown/1.65));
 $('controlStatus').textContent=p.finished?'Güvendesin':'Sen · 07';
}
function render(){const start=performance.now();ctx.drawImage(back,0,0,canvas.width,canvas.height,0,0,geometry.w,geometry.h);hazards(model.info());const visible=model.state.players.filter(p=>!p.outBeforeRound);visible.forEach(actorShadow);visible.sort((a,b)=>a.y-b.y).forEach(actor);
 for(const p of particles){const age=model.state.runTime-p.time;if(age<0||age>.55)continue;const q=pos(p.x,p.y);ctx.globalAlpha=1-age/.55;ctx.beginPath();ctx.arc(q.x,q.y,(.2+age*1.2)*geometry.s,0,Math.PI*2);ctx.lineWidth=.045*geometry.s;ctx.strokeStyle=p.color;ctx.stroke();ctx.globalAlpha=1;}
 metrics.frames++;metrics.maxDraw=Math.max(metrics.maxDraw,performance.now()-start);}
function clearInput(){const oldStick=stickPointer,oldJump=jumpPointer;stickPointer=jumpPointer=null;for(const [id,pointer] of [['stick',oldStick],['jump',oldJump]])if(pointer!==null&&$(id).hasPointerCapture(pointer))$(id).releasePointerCapture(pointer);stickVector={x:0,y:0};keys.clear();model.setInput(0,0);$('nub').style.transform='';$('stick').classList.remove('held');$('jump').classList.remove('held');}
function stop(silence=true){cancelAnimationFrame(raf);raf=0;last=0;clearInput();if(silence){voices.forEach(o=>{try{o.stop();}catch{}});audio?.suspend().catch(()=>{});}}
function showOverlay(kind){
 stop(kind==='paused');const st=model.state,remaining=st.players.filter(p=>p.alive).length;$('closeOverlay').hidden=false;$('results').replaceChildren();$('toMenu').hidden=false;
 if(kind==='briefing'){
  $('overlayEyebrow').textContent='SIRADAKİ KAPI';$('roundMark').textContent=String(st.round+1).padStart(2,'0');$('overlayTitle').textContent=st.game.name;$('overlayCopy').textContent=st.game.hint;$('overlayDetail').textContent=st.game.detail;$('continue').textContent='İçeri gir →';continued=()=>{model.begin();shown='';paused=false;lastRule='';$('overlay').close();startLoop();};
 }else if(kind==='paused'){
  $('overlayEyebrow').textContent='MOLA';$('roundMark').textContent='Ⅱ';$('overlayTitle').textContent='Işık seni bekler.';$('overlayCopy').textContent='Zaman da tehlikeler de durdu.';$('overlayDetail').textContent=st.game.hint;$('continue').textContent='Devam et →';continued=()=>{paused=false;shown='';$('overlay').close();startLoop();};
 }else{
  const win=kind==='victory',dead=kind==='dead';$('overlayEyebrow').textContent=dead?'ELENDİN':win?'ÇIKIŞ AÇILDI':'KAPI GEÇİLDİ';$('roundMark').textContent=dead?'×':win?'✦':'✓';$('overlayTitle').textContent=dead?'Işık söndü.':win?'Sistemden çıktın.':'Bir kapı daha geride.';$('overlayCopy').textContent=dead?st.cause:win?'Beş kural değişti. Sen kaldın.':`${st.game.name} tamamlandı.`;$('overlayDetail').textContent=dead?'Yeni denemede odaların sırası değişecek.':win?'Bu kez kapının diğer tarafındasın.':`${remaining} yarışmacı sıradaki odaya geçiyor.`;
  for(const [value,label] of [[st.cleared+'/5','geçilen kapı'],[Math.round(st.runTime)+' sn','hayatta kalma']]){const div=document.createElement('div'),b=document.createElement('b'),small=document.createElement('small');b.textContent=value;small.textContent=label;div.append(b,small);$('results').append(div);}
  if(kind==='cleared'){record.best=Math.max(record.best,st.cleared);save();best();}
  if((win||dead)&&!recorded){recorded=true;record.best=Math.max(record.best,st.cleared);if(win)record.wins++;save();best();}
  $('continue').textContent=dead||win?'Yeni deneme →':'Sıradaki kapı →';continued=()=>{if(dead||win)newRun();else{model.next();shown='briefing';showOverlay('briefing');render();}};
 }
 if(!$('overlay').open)$('overlay').showModal();$('continue').focus({preventScroll:true});
}
function consumeEvents(){
 // Events are bounded, so consume by object identity rather than a growing log index.
 const fresh=model.events.filter(e=>!seen.has(e));for(const e of fresh){seen.add(e);if(e.type==='coin'&&!e.player){sound('coin');particles.push({x:e.x,y:e.y,time:model.state.runTime,color:'#f4d889'});}if(e.type==='jump'&&!e.player)sound('jump');if(e.type==='eliminated'){const p=model.state.players[e.player];particles.push({x:p.x,y:p.y,time:model.state.runTime,color:'#ca9184'});if(!e.player)sound('dead');}if(e.type==='cleared'||e.type==='victory')sound('clear');}
 if(seen.size>160){seen.clear();model.events.forEach(e=>seen.add(e));}particles=particles.filter(p=>model.state.runTime-p.time<.6).slice(-30);
}
let seen=new Set();
function frame(time){raf=0;if(paused)return;if(model.state.phase!=='running'){if(['cleared','dead','victory'].includes(model.state.phase)&&shown!==model.state.phase){consumeEvents();hud(model.info());render();shown=model.state.phase;showOverlay(shown);}return;}const dt=last?Math.min(.06,(time-last)/1000):0;last=time;model.tick(dt);metrics.steps++;consumeEvents();hud(model.info());render();
 if(model.state.phase!=='running'){shown=model.state.phase;showOverlay(shown);return;}raf=requestAnimationFrame(frame);
}
function startLoop(){last=0;audio?.resume().catch(()=>{});render();if(!raf)raf=requestAnimationFrame(frame);}
function newRun(seed){stop();model.reset(seed??((Date.now()^Math.floor(Math.random()*0xffffffff))>>>0));record.attempts++;save();recorded=false;seen=new Set(model.events);particles=[];$('controls').inert=false;$('menu').hidden=true;$('pause').hidden=false;document.body.classList.add('playing');if($('overlay').open)$('overlay').close();hud(model.info());render();shown='briefing';showOverlay('briefing');}
function menu(){stop();paused=false;shown='';$('overlay').close();$('controls').inert=true;$('menu').hidden=false;$('pause').hidden=true;document.body.classList.remove('playing');best();$('play').focus({preventScroll:true});}
function pause(){if(model.state.phase==='running'&&!paused){paused=true;shown='paused';showOverlay('paused');}}
function leave(){stop();audio?.close().catch(()=>{});audio=null;if(window.parent!==window)parent.postMessage({type:'spiker-death-game',action:'close'},location.origin==='null'?'*':location.origin);else menu();}
function updateInput(){let x=stickVector.x,y=stickVector.y;if(keys.size){x=(keys.has('ArrowRight')||keys.has('d')?1:0)-(keys.has('ArrowLeft')||keys.has('a')?1:0);y=(keys.has('ArrowDown')||keys.has('s')?1:0)-(keys.has('ArrowUp')||keys.has('w')?1:0);}model.setInput(x,y);}
const stick=$('stick');
function drag(e){if(e.pointerId!==stickPointer)return;const r=stick.getBoundingClientRect(),limit=r.width*.34,dx=e.clientX-r.x-r.width/2,dy=e.clientY-r.y-r.height/2,len=Math.hypot(dx,dy),scale=Math.min(1,limit/(len||1));stickVector={x:dx*scale/limit,y:dy*scale/limit};$('nub').style.transform=`translate(${dx*scale*.7}px,${dy*scale*.7}px)`;updateInput();}
stick.addEventListener('pointerdown',e=>{if(stickPointer!==null||paused||model.state.phase!=='running')return;e.preventDefault();stickPointer=e.pointerId;stick.setPointerCapture(e.pointerId);stick.classList.add('held');drag(e);});stick.addEventListener('pointermove',drag);
function releaseStick(e){if(e.pointerId!==stickPointer)return;stickPointer=null;stickVector={x:0,y:0};$('nub').style.transform='';stick.classList.remove('held');updateInput();}
for(const name of ['pointerup','pointercancel','lostpointercapture'])stick.addEventListener(name,releaseStick);
$('jump').addEventListener('pointerdown',e=>{if(jumpPointer!==null||paused||model.state.phase!=='running')return;e.preventDefault();jumpPointer=e.pointerId;$('jump').setPointerCapture(e.pointerId);$('jump').classList.add('held');model.jump();});
for(const name of ['pointerup','pointercancel','lostpointercapture'])$('jump').addEventListener(name,e=>{if(e.pointerId!==jumpPointer)return;jumpPointer=null;$('jump').classList.remove('held');});
addEventListener('keydown',e=>{const key=e.key.length===1?e.key.toLowerCase():e.key;if(key==='Escape'){if(model.state.phase==='running'&&!paused)pause();return;}if(paused||model.state.phase!=='running')return;if(['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','a','d','w','s',' '].includes(key)){e.preventDefault();if(key===' '){if(!e.repeat)model.jump();}else{keys.add(key);updateInput();}}});
addEventListener('keyup',e=>{keys.delete(e.key.length===1?e.key.toLowerCase():e.key);updateInput();});
$('play').onclick=()=>{sound('click');newRun();};$('continue').onclick=()=>{sound('click');continued?.();};$('toMenu').onclick=menu;$('pause').onclick=pause;$('exit').onclick=leave;
$('closeOverlay').onclick=()=>{if(paused)continued?.();else menu();};$('overlay').addEventListener('cancel',e=>{e.preventDefault();if(paused)continued?.();else menu();});
addEventListener('blur',pause);document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();});addEventListener('pagehide',()=>{stop();audio?.close().catch(()=>{});});
$('controls').inert=true;new ResizeObserver(resize).observe($('arena'));best();resize();
window.DeathGame={model,metrics,get running(){return !!raf;},get paused(){return paused;},get geometry(){return {...geometry};},get record(){return {...record};},newRun,pause,menu,render};
})();
