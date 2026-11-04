// Play a real touch-controlled rally. Read-only state guides a virtual thumb;
// all movement, aiming, serving and hitting go through actual pointer events.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{pathToFileURL}=require('node:url');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});let context;try{
 const root=path.resolve(__dirname,'..');context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:1,isMobile:true,hasTouch:true,recordVideo:{dir:path.join(root,'audits/secret-volley-playtest'),size:{width:390,height:844}}});
 const page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(pathToFileURL(path.join(root,'secret-volley.html')).href);await page.waitForFunction(()=>SecretVolley.loaded);
 await page.evaluate(()=>{SecretVolley.setMode('bot','smart');SecretVolley.start();});
 await page.evaluate(()=>{window.__touchLog=[];for(const type of ['pointerdown','pointerup','pointercancel','lostpointercapture'])document.addEventListener(type,e=>{if(e.target.closest?.('.action'))window.__touchLog.push({type,phase:SecretVolley.model.state.phase,clock:SecretVolley.model.state.time,player:SecretVolley.model.state.active[0],touches:SecretVolley.model.state.touches});},true);});
 const cdp=await context.newCDPSession(page);let held=false,lastHit=-1e6,lastAim=-1,rounds=0;
 async function touches(type,points){await cdp.send('Input.dispatchTouchEvent',{type,touchPoints:points});}
 async function tap(point,withStick){const rest=withStick?[{x:withStick.x,y:withStick.y,id:1}]:[],finger={x:point.x,y:point.y,id:2};await touches('touchStart',[...rest,finger]);await page.waitForTimeout(24);await touches('touchEnd',withStick?[finger]:[]);}
 const started=Date.now(),attempts=[];
 while(Date.now()-started<42000){
  const s=await page.evaluate(()=>{const m=SecretVolley.model,s=m.state,v=SecretVolley.views.find(v=>v.arena),g=v.geometry,r=v.canvas.getBoundingClientRect(),p=s.players[s.active[0]],target=s.pending?.target||m.predict(),stick=document.querySelector('[data-team="0"] .joystick').getBoundingClientRect(),action=document.querySelector('[data-team="0"] .action').getBoundingClientRect();return {phase:s.phase,serving:s.serving,team:s.ball.flightTeam,last:s.lastTeam,touches:s.touches,clock:s.time,contacts:s.contacts,rallies:s.rallies,ownShots:s.teamStats[0].attack+s.teamStats[0].free,stats:{...s.stats},p:{x:p.x,y:p.y},target,prediction:m.predict(),g:{sx:g.sx,sy:g.sy,left:r.left+g.left,top:r.top+g.top},stick:{x:stick.x+stick.width/2,y:stick.y+stick.height/2,r:stick.width*.3},action:{x:action.x+action.width/2,y:action.y+action.height/2}};});
  if(s.phase==='point'||s.phase==='finished'){
   if(held){await touches('touchEnd',[]);held=false;}rounds=s.rallies;
   if(rounds>=1&&s.ownShots>=2)break;
   await page.waitForTimeout(60);continue;
  }
  if(s.phase==='serve'){
   if(held){await touches('touchEnd',[]);held=false;}
   if(s.serving===0){await tap({x:s.g.left+1.2*s.g.sx,y:s.g.top+2.2*s.g.sy});await tap(s.action);}
   await page.waitForTimeout(60);continue;
  }
  if(s.team===0){
   const dx=(s.target.x-s.p.x)*s.g.sx,dy=(s.target.y-s.p.y)*s.g.sy,d=Math.hypot(dx,dy),amount=d<3?0:Math.min(1,d/18);
   const point={x:s.stick.x+(d?dx/d:0)*s.stick.r*amount,y:s.stick.y+(d?dy/d:0)*s.stick.r*amount,id:1};
   if(!held){await touches('touchStart',[{x:s.stick.x,y:s.stick.y,id:1}]);held=true;}await touches('touchMove',[point]);
   if(s.touches===2&&s.last===0){
    if(lastAim!==s.contacts){const tx=s.p.x>4.5?1.1:7.9;await tap({x:s.g.left+tx*s.g.sx,y:s.g.top+2*s.g.sy},point);lastAim=s.contacts;}
    // After proving two real third contacts, allow a normal missed input so the
    // rally finishes naturally instead of keeping two perfect pilots playing.
    if(s.ownShots<2&&s.prediction.time<.45&&s.clock-lastHit>.4){attempts.push({time:s.clock,remaining:s.prediction.time,action:s.action});await tap(s.action,point);lastHit=s.clock;}
   }
  }else if(held){await touches('touchEnd',[]);held=false;}
  await page.waitForTimeout(40);
 }
 if(held)await touches('touchEnd',[]);
 const result=await page.evaluate(()=>({score:SecretVolley.model.state.score,stats:SecretVolley.model.state.stats,teams:SecretVolley.model.state.teamStats,rallies:SecretVolley.model.state.rallies,metrics:SecretVolley.metrics,events:SecretVolley.model.state.events.slice(-35),phase:SecretVolley.model.state.phase,paused:SecretVolley.paused,touchLog:window.__touchLog}));result.attempts=attempts;
 fs.writeFileSync(path.join(root,'audits/secret-volley-playable.json'),JSON.stringify({result,errors,seconds:(Date.now()-started)/1000},null,2));
 await page.screenshot({path:path.join(root,'audits/secret-volley-playable.png')});
 assert(result.teams[0].serve>0);assert(result.teams[0].receive>0&&result.teams[0].set>0,'actual thumb movements produce manşet and pas');assert(result.teams[0].attack>0||result.teams[0].free>0,'actual Oyna taps produce a third-contact shot');assert(result.rallies>=1);assert.deepEqual(errors,[]);
 const video=page.video();await page.close();await context.close();context=null;const file=await video.path();fs.copyFileSync(file,path.join(root,'audits/secret-volley-playable.webm'));fs.writeFileSync(path.join(root,'audits/secret-volley-playable.json'),JSON.stringify({result,errors,seconds:(Date.now()-started)/1000},null,2));
 console.log('PASS real touch play: serve, automatic first/second contacts, held-thumb auto-switch, directed third contact and completed rallies',JSON.stringify(result));
}finally{await context?.close();await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
