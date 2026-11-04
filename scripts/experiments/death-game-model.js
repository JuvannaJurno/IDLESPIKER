/* SON IŞIK: isolated, deterministic 120 Hz simulation. No DOM, storage or main-game state. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.DeathGameModel=api;})(typeof globalThis==='object'?globalThis:this,function(){
'use strict';
const W=12,H=16,SPEED=3.7,STEP=1/120,TAU=Math.PI*2;
const GAMES=[
 {id:'silence',name:'Sessiz Koridor',hint:'Işık yeşilken kapıya ilerle. Kırmızıda hareket etme.',detail:'Sarı ışık durman için zaman verir. Kapıya ulaşınca güvendesin.',duration:24,color:'#bf7967'},
 {id:'tiles',name:'Son Renk',hint:'Gösterilen rengin üstüne geç. Diğer zeminler kaybolacak.',detail:'Her uyarıda güvenli renk değişir. Beş çöküşü atlat.',duration:22,color:'#8b8cba'},
 {id:'clock',name:'Saat Kulesi',hint:'Dönen kolun üzerinden sıçra. Merkezden uzak dur.',detail:'Kol yaklaşırken sıçra; yeniden sıçramadan önce kısa süre bekle.',duration:21,color:'#ca9d58'},
 {id:'vault',name:'Açgözlü Kasa',hint:'5 jeton topla, yukarıdaki kapıdan çık.',detail:'Baskı kollarını aş. Arkandan yükselen mürekkebe yakalanma.',duration:25,color:'#72978c'},
 {id:'tide',name:'Son Dalga',hint:'Yayılan halkaların üzerinden sıçra.',detail:'Merkezdeki ışık yaklaşan dalgayı haber verir. Dalgalar hızlanacak.',duration:22,color:'#729aab'}
];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function rng(seed){let s=seed>>>0||1;return ()=>{s+=0x6D2B79F5;let t=s;t=Math.imul(t^t>>>15,t|1);t^=t+Math.imul(t^t>>>7,t|61);return ((t^t>>>14)>>>0)/4294967296;};}
const dist=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
function segmentDistance(x,y,ax,ay,bx,by){const dx=bx-ax,dy=by-ay,t=clamp(((x-ax)*dx+(y-ay)*dy)/(dx*dx+dy*dy||1),0,1);return Math.hypot(x-ax-t*dx,y-ay-t*dy);}
function tileAt(x,y){return {c:clamp(Math.floor((x-.5)/2.75),0,3),r:clamp(Math.floor((y-2)/3),0,3)};}
function tileColor(c,r,cycle){return (c+2*r+cycle*3)%4;}
function create(options={}){
 let random,acc=0,input={x:0,y:0};const events=[];
 const state={};
 function emit(type,data={}){events.push({type,time:state.elapsed,...data});if(events.length>80)events.shift();}
 function reset(seed=Date.now()){
  random=rng(seed);acc=0;input={x:0,y:0};events.length=0;
  const deck=GAMES.map(g=>g.id);for(let i=deck.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[deck[i],deck[j]]=[deck[j],deck[i]];}
  Object.assign(state,{seed:seed>>>0,deck,round:0,phase:'briefing',elapsed:0,runTime:0,cleared:0,cause:'',history:[],players:[],jumpUses:0});
  state.players=Array.from({length:10},(_,i)=>({id:i,x:0,y:0,vx:0,vy:0,alive:true,finished:false,coins:0,collected:0,jump:0,cooldown:0,deathAt:-1,thought:random()*.4,skill:.62+random()*.33,target:null}));
  setup();return state;
 }
 function setup(){
  state.game=GAMES.find(g=>g.id===state.deck[state.round]);state.elapsed=0;state.cause='';state.phase='briefing';input={x:0,y:0};acc=0;
  state.players.forEach(p=>{p.outBeforeRound=!p.alive;p.finished=false;p.coins=0;p.collected=0;p.jump=0;p.cooldown=0;p.vx=p.vy=0;p.target=null;
   if(['silence','vault'].includes(state.game.id)){p.x=1.2+(p.id%5)*2.35;p.y=14.1+Math.floor(p.id/5)*.65;}
   else {const a=p.id/10*TAU;p.x=6+Math.cos(a)*3.9;p.y=8+Math.sin(a)*4.5;}
  });emit('briefing',{game:state.game.id});
 }
 function begin(){if(state.phase!=='briefing')return false;input={x:0,y:0};state.phase='running';emit('begin',{game:state.game.id});return true;}
 function next(){if(state.phase!=='cleared')return false;state.round++;setup();return true;}
 function setInput(x,y){const l=Math.hypot(x,y)||1;input={x:Number.isFinite(x)?x/Math.max(1,l):0,y:Number.isFinite(y)?y/Math.max(1,l):0};}
 function leap(p){if(!p.alive||p.finished||p.cooldown>0||p.jump>0)return false;p.jump=.62;p.cooldown=1.65;if(!p.id)state.jumpUses++;emit('jump',{player:p.id});return true;}
 function jump(){return state.phase==='running'&&leap(state.players[0]);}
 function jumpHeight(p){return p.jump>0?Math.sin(p.jump/.62*Math.PI)*.9:0;}
 function info(at=state.elapsed){
  const id=state.game.id;
  if(id==='silence'){
   // Every stop has an explicit amber warning. The opening is always green.
   let t=at,n=0;for(;n<12;n++){const green=2.3+((state.seed+n*17)%13)/10,red=1.35+((state.seed+n*7)%7)/10,span=green+.85+red;if(t<span)return {light:t<green?'green':t<green+.85?'amber':'red',left:t<green?green-t:t<green+.85?green+.85-t:span-t,cycle:n};t-=span;}
   return {light:'green',left:1,cycle:n};
  }
  if(id==='tiles'){const t=Math.max(0,at-2),cycle=Math.min(4,Math.floor(t/4)),phase=t%4;return {cycle,safe:(state.seed+cycle*2)%4,collapse:at>=2&&phase>=2.9,left:phase<2.9?2.9-phase:4-phase};}
  if(id==='clock')return {angle:-Math.PI/2+Math.max(0,at-2)*(.79+state.round*.045),live:at>=2,warning:at<2};
  if(id==='vault')return {ink:Math.max(3.2,16-Math.max(0,at-6)*.55),presses:[{x:6+Math.sin(at*.92)*4.1,y:6},{x:6+Math.sin(at*.83+2)*4.1,y:10}],tokens:Array.from({length:16},(_,i)=>({x:2+(i%4)*2.67,y:3.2+Math.floor(i/4)*3})),need:5};
  const waves=[];for(let i=0;i<9;i++){const start=2+i*2.65,age=at-start;if(age>-.9&&age<6)waves.push({id:i,age,radius:age*2.8,warning:age<0});}return {waves};
 }
 function kill(p,cause){if(!p.alive||p.finished)return;p.alive=false;p.deathAt=state.elapsed;p.vx=p.vy=0;emit('eliminated',{player:p.id,cause});if(!p.id){state.phase='dead';state.cause=cause;state.history.push({game:state.game.id,success:false,time:state.elapsed,cause});input={x:0,y:0};}}
 function finish(p){if(p.finished||!p.alive)return;p.finished=true;p.vx=p.vy=0;emit('escaped',{player:p.id});}
 function pass(){if(state.phase!=='running')return;const me=state.players[0];if(!me.alive)return;state.cleared++;state.history.push({game:state.game.id,success:true,time:state.elapsed});state.phase=state.cleared===5?'victory':'cleared';input={x:0,y:0};emit(state.phase,{game:state.game.id});}
 function ai(p,h,dt){
  let target={x:p.x,y:p.y},wantsJump=false;const id=state.game.id;
  if(id==='silence'){
   if(h.light==='green')target={x:p.x,y:1.15};
   // A delayed reaction is movement under the same red-light rule, never a random elimination.
   else if(h.light==='amber'&&h.left>.3+p.skill*.35)target={x:p.x,y:1.15};
  }else if(id==='tiles'){
   const candidates=[];for(let r=0;r<4;r++)for(let c=0;c<4;c++)if(tileColor(c,r,h.cycle)===h.safe)candidates.push({x:.5+(c+.5)*2.75,y:2+(r+.5)*3});
   target=candidates.sort((a,b)=>dist(a,p)-dist(b,p))[0];target.x+=((p.id%3)-1)*.48;target.y+=((Math.floor(p.id/3)%3)-1)*.48;
  }else if(id==='clock'){
   const a=Math.atan2(p.y-8,p.x-6)+.09;target={x:6+Math.cos(a)*4.3,y:8+Math.sin(a)*4.3};
   const future=info(state.elapsed+.25+p.skill*.08),d=segmentDistance(p.x,p.y,6-Math.cos(future.angle)*11,8-Math.sin(future.angle)*11,6+Math.cos(future.angle)*11,8+Math.sin(future.angle)*11);
   wantsJump=h.live&&d<.75;
  }else if(id==='vault'){
   target=p.coins>=h.need?{x:6,y:1.1}:h.tokens.map((t,i)=>({...t,i})).filter(t=>!(p.collected&(1<<t.i))).sort((a,b)=>dist(a,p)-dist(b,p))[0];
   wantsJump=h.presses.some(b=>Math.abs(b.y-p.y)<1.1&&Math.abs(b.x-p.x)<2.1);
  }else {
   const a=p.id/10*TAU;target={x:6+Math.cos(a)*4.2,y:8+Math.sin(a)*4.2};
   const radius=Math.hypot(p.x-6,p.y-8);wantsJump=h.waves.some(w=>!w.warning&&w.radius<radius&&radius-w.radius<.9+p.skill*.1);
  }
  if(wantsJump)leap(p);
  const dx=target.x-p.x,dy=target.y-p.y,len=Math.hypot(dx,dy);return len>.09?{x:dx/len,y:dy/len}:{x:0,y:0};
 }
 function step(dt){
  if(state.phase!=='running')return;state.elapsed+=dt;state.runTime+=dt;const h=info(),id=state.game.id;
  for(const p of state.players){
   if(!p.alive||p.finished)continue;p.jump=Math.max(0,p.jump-dt);p.cooldown=Math.max(0,p.cooldown-dt);
   let move=p.id?ai(p,h,dt):input;
   const oldX=p.x,oldY=p.y;const boost=p.jump>.41?1.42:1;p.x=clamp(p.x+move.x*SPEED*boost*dt,id==='tiles'?.74:.48,id==='tiles'?11.26:11.52);p.y=clamp(p.y+move.y*SPEED*boost*dt,id==='tiles'?2.3:1.0,id==='tiles'?13.7:15.25);
   p.vx=(p.x-oldX)/dt;p.vy=(p.y-oldY)/dt;
   const airborne=jumpHeight(p)>.28;
   if(id==='silence'){
    if(p.y<1.8)finish(p);
    else if(h.light==='red'&&(Math.hypot(p.vx,p.vy)>.05||p.jump>0))kill(p,'Kırmızı ışıkta hareket ettin.');
   }else if(id==='tiles'){
    const tile=tileAt(p.x,p.y);if(h.collapse&&tileColor(tile.c,tile.r,h.cycle)!==h.safe)kill(p,'Güvenli renge yetişemedin.');
   }else if(id==='clock'){
    const radius=Math.hypot(p.x-6,p.y-8);if(radius<1.05){p.x=oldX;p.y=oldY;}
    const d=segmentDistance(p.x,p.y,6-Math.cos(h.angle)*11,8-Math.sin(h.angle)*11,6+Math.cos(h.angle)*11,8+Math.sin(h.angle)*11);
    if(h.live&&d<.22&&!airborne)kill(p,'Saatin koluna yakalandın.');
   }else if(id==='vault'){
    h.tokens.forEach((t,i)=>{if(!(p.collected&(1<<i))&&dist(t,p)<.64){p.collected|=1<<i;p.coins++;emit('coin',{player:p.id,x:t.x,y:t.y});}});
    if(p.coins>=h.need&&p.y<1.8)finish(p);
    else if(p.y>h.ink)kill(p,'Mürekkep sana yetişti.');
    else if(h.presses.some(b=>Math.abs(p.x-b.x)<1.12&&Math.abs(p.y-b.y)<.36)&&!airborne)kill(p,'Kasanın baskı koluna yakalandın.');
   }else if(h.waves.some(w=>!w.warning&&Math.abs(Math.hypot(p.x-6,p.y-8)-w.radius)<.25)&&!airborne)kill(p,'Dalgayı atlayamadın.');
   if(!p.id&&state.phase==='dead')break;
  }
  if(state.phase!=='running')return;
  if(state.elapsed>=state.game.duration){
   if(['silence','vault'].includes(id)){state.players.filter(p=>p.alive&&!p.finished).forEach(p=>kill(p,id==='vault'?'Jetonlarla kapıya zamanında ulaşamadın.':'Kapıya zamanında ulaşamadın.'));}
   if(state.phase==='running')pass();
  }else if(['silence','vault'].includes(id)&&state.players.filter(p=>p.alive).every(p=>p.finished))pass();
 }
 function tick(dt){if(state.phase!=='running'){acc=0;return;}acc+=clamp(Number.isFinite(dt)?dt:0,0,.1);while(acc>=STEP){acc-=STEP;step(STEP);if(state.phase!=='running'){acc=0;break;}}}
 reset(options.seed);return {state,events,reset,begin,next,setInput,jump,jumpHeight,info,tick};
}
return {create,GAMES,W,H,SPEED,STEP,tileAt,tileColor,segmentDistance};
});
