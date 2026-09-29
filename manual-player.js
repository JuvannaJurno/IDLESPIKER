let manualControl=false;const heldKeys=new Set();const controlledIndex=2;
function controlledPlayer(p){return manualControl&&!scenario&&!formationPreview&&p.index===controlledIndex}
function inputDirection(p){let x=Number(heldKeys.has('KeyD'))-Number(heldKeys.has('KeyA')),y=Number(heldKeys.has('KeyS'))-Number(heldKeys.has('KeyW'));const n=Math.hypot(x,y);return n?{x:x/n,y:y/n}:p.lastDirection||{x:1,y:0}}
function canAct(p){return !serviceGame&&controlledPlayer(p)&&ready&&!paused&&!rotationMotion&&!(p.manualSpike>0)&&!(p.manualToss>0)}
function startManual(){if(!ready)return;endScenario();rotationMotion=null;formationPreview=null;$('formationMode').value='auto';manualControl=!manualControl;heldKeys.clear();const p=players.find(p=>p.index===controlledIndex);if(p){p.approach=false;p.manualSpike=0;p.manualToss=0;p.spike=0;p.toss=0;p.jump=0;}$('controlPlayer').textContent=manualControl?'Kontrolü bırak':'Oyuncuyu kontrol et · WASD';announce(manualControl?'WASD: yürü · Shift: adımla · Space: smaç · E: WASD yönüne toss. Yön basılı değilse son yön kullanılır.':'Oyuncu otomatik oyuna döndü.');}
function requestSpike(){const p=players.find(p=>p.index===controlledIndex);if(!p||!canAct(p))return;p.manualSpike=.65;p.spike=.65;p.jump=.5;p.manualContact=false;p.approach=false;p.actionDirection=inputDirection(p);p.angle=Math.atan2(p.actionDirection.y,p.actionDirection.x);if(p.manualSpike>0)captureSpikeBall(p);}
function requestToss(){const p=players.find(p=>p.index===controlledIndex);if(!p||!canAct(p))return;p.manualToss=.5;p.toss=.5;p.manualContact=false;p.approach=false;p.actionDirection=inputDirection(p);p.angle=Math.atan2(p.actionDirection.y,p.actionDirection.x);}
function captureSpikeBall(p){if(ball.state!=='flight'||p.manualContact||ball.strikeOwner!==undefined)return;const ground=Math.hypot(ball.x-p.x,ball.y-p.y),screen=Math.hypot(ball.x-p.x,ball.y-(ball.z||0)-p.y);if(Math.min(ground,screen)<72&&(ball.z||0)<=135){ball.strikeOwner=p.index;ball.strikeAge=0;}}
function tryManualContact(p,kind){if(p.manualContact||ball.state!=='flight'||!Number.isFinite(ball.x)||(ball.strikeOwner!==p.index&&(Math.hypot(ball.x-p.x,ball.y-p.y)>72||(ball.z||0)>135)))return false;
 const d=p.actionDirection||{x:1,y:0};let tx,ty,candidates;
 if(kind==='attack'){tx=clamp(p.x+d.x*500,550,880);ty=clamp(p.y+d.y*260,120,500);candidates=players.filter(q=>q.team!==p.team)}
 else{tx=clamp(p.x+d.x*170,110,890);ty=clamp(p.y+d.y*170,110,510);candidates=players.filter(q=>q!==p&&q.team===(tx<500?0:1))}
 const target=candidates.reduce((a,b)=>Math.hypot(a.x-tx,a.y-ty)<Math.hypot(b.x-tx,b.y-ty)?a:b);
 launch(p,target,kind==='attack'||target.team!==p.team?1:2,kind);ball.targetX=tx;ball.targetY=ty;ball.miss=false;ball.duration=kind==='attack'?1.1:1.5;p.manualContact=true;announce(kind==='attack'?'Smaç!':'Toss: seçtiğin yöne yüksek pas.');return true;
}
function updateManual(p,dt){const direction=inputDirection(p),directionHeld=['KeyW','KeyA','KeyS','KeyD'].some(k=>heldKeys.has(k)),shift=heldKeys.has('ShiftLeft')||heldKeys.has('ShiftRight');const acting=p.manualSpike>0||p.manualToss>0;
 p.approach=shift&&!acting;p.moving=(directionHeld||shift)&&!acting;
 if(p.moving){const speed=p.approach?270:210;p.x=clamp(p.x+direction.x*speed*dt,110,470);p.y=clamp(p.y+direction.y*speed*dt,110,510);p.lastDirection=direction;p.angle=Math.atan2(direction.y,direction.x);p.phase+=dt*(p.approach?14:10)}
 for(const name of ['hit','jump','block','spike','toss'])p[name]=Math.max(0,(p[name]||0)-dt);
 for(const [field,kind,duration,open,close]of [['manualSpike','attack',.65,.39,.6],['manualToss','pass',.5,.08,.36]])if(p[field]>0){if(kind==='attack')captureSpikeBall(p);const previousAge=duration-p[field];p[field]=Math.max(0,p[field]-dt);const age=duration-p[field];p.angle=Math.atan2(p.actionDirection.y,p.actionDirection.x);if(age>=open&&previousAge<=close)tryManualContact(p,kind);if(!p[field]&&!p.manualContact)announce('Topa temas etmedi. Pas iste ile tekrar dene.');}
}
$('controlPlayer').onclick=startManual;
$('feedBall').onclick=()=>{if(!ready)return;if(!manualControl)startManual();endScenario();rotationMotion=null;formationPreview=null;paused=false;$('pause').textContent='Duraklat';const p=players.find(p=>p.index===controlledIndex),setter=players.find(q=>q.team===0&&q!==p);launch(setter,p,1,'pass');ball.targetX=p.x;ball.targetY=p.y;ball.miss=false;ball.duration=2;ball.manualFeed=true;announce('Pas geliyor. Space: smaç · E: yönlü toss.');};
if(typeof window!=='undefined'){
 window.addEventListener('keydown',e=>{if(/INPUT|SELECT|TEXTAREA/.test(e.target.tagName)||!manualControl)return;if(['KeyW','KeyA','KeyS','KeyD','ShiftLeft','ShiftRight','Space','KeyE'].includes(e.code)){e.preventDefault();heldKeys.add(e.code);if(!e.repeat){if(e.code==='Space'){if(serviceGame)advanceServiceGame();else requestSpike();}if(e.code==='KeyE')requestToss();}}});
 window.addEventListener('keyup',e=>heldKeys.delete(e.code));window.addEventListener('blur',()=>heldKeys.clear());document.addEventListener('visibilitychange',()=>{if(document.hidden)heldKeys.clear()});
}
