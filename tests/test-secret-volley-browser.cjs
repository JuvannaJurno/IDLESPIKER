const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
const root=path.resolve(__dirname,'..'),mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.mp3':'audio/mpeg','.wav':'audio/wav','.ogg':'audio/ogg','.webmanifest':'application/manifest+json'};
const server=http.createServer((q,r)=>{const name=path.resolve(root,'.'+decodeURIComponent(new URL(q.url,'http://localhost').pathname));if(!name.startsWith(root+path.sep)){r.writeHead(403).end();return;}fs.stat(name,(e,s)=>{if(e||!s.isFile()){r.writeHead(404).end();return;}const range=/^bytes=(\d+)-(\d*)$/.exec(q.headers.range||''),start=range?Number(range[1]):0,end=range&&range[2]?Math.min(Number(range[2]),s.size-1):s.size-1;if(start>end||start>=s.size){r.writeHead(416).end();return;}r.writeHead(range?206:200,{'Content-Type':mime[path.extname(name)]||'application/octet-stream','Content-Length':end-start+1,'Accept-Ranges':'bytes',...(range?{'Content-Range':`bytes ${start}-${end}/${s.size}`}:{})});const stream=fs.createReadStream(name,{start,end});stream.pipe(r);r.on('close',()=>stream.destroy());});});
(async()=>{
 let browser;try{
  await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
  browser=await chromium.launch({channel:'msedge',headless:true});
  const context=await browser.newContext({viewport:{width:390,height:844},deviceScaleFactor:2,isMobile:true,hasTouch:true});
  await context.addInitScript(()=>{const write=Storage.prototype.setItem;write.call(localStorage,'idle-spiker-language-v1','tr');window.__miniWrites=[];Storage.prototype.setItem=function(k,v){window.__miniWrites.push(k);return write.call(this,k,v);};});
  const page=await context.newPage(),errors=[],missing=[];page.on('pageerror',e=>errors.push(e.message));page.on('response',r=>{if(r.status()===404)missing.push(r.url());});
  await page.goto(base+'/secret-volley.html');await page.waitForFunction(()=>window.SecretVolley?.loaded);
  await page.screenshot({path:path.join(root,'audits/secret-volley-menu.png')});
  await page.setViewportSize({width:280,height:568});
  const fixedBefore=await page.locator('#exitGame').boundingBox(),playBefore=await page.locator('#startGame').boundingBox();await page.locator('.front-scroll').evaluate(e=>e.scrollTop=e.scrollHeight);
  assert.deepEqual(await page.locator('#exitGame').boundingBox(),fixedBefore);assert.deepEqual(await page.locator('#startGame').boundingBox(),playBefore,'start remains visible while options scroll');
  const rows=[];
  for(const viewport of [{width:280,height:568},{width:320,height:568},{width:390,height:844},{width:430,height:932},{width:1280,height:900},{width:844,height:390}]){
   await page.setViewportSize(viewport);
   for(const mode of ['bot','local'])for(const control of ['smart','six']){
    await page.evaluate(({mode,control})=>{SecretVolley.setMode(mode,control);SecretVolley.start();},{mode,control});await page.waitForFunction(()=>SecretVolley.views.filter(v=>v.arena).every(v=>v.geometry));
    const row=await page.evaluate(()=>({views:SecretVolley.views.length,canvases:document.querySelectorAll('.arena canvas').length,joysticks:document.querySelectorAll('.joystick').length,stickSizes:[...document.querySelectorAll('.joystick')].map(e=>e.getBoundingClientRect().width),overflow:document.documentElement.scrollWidth>innerWidth,
     controls:[...document.querySelectorAll('.joystick,.action,.center-pause')].map(e=>{const r=e.getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:r.bottom};}),
     nativeFallbacks:SecretVolley.metrics.fallbacks,geometry:SecretVolley.views.filter(v=>v.arena).map(v=>{const g=v.geometry,b=SecretVolley.model.state.ball;const ground=g.top+b.y*g.sy;return {width:g.w,height:g.h,courtBottom:g.top+g.ch,heldBallY:ground-b.z*Math.min(g.sy*.75,12)};}),height:innerHeight,width:innerWidth}));
    assert.equal(row.views,mode==='local'?2:1);assert.equal(row.canvases,1,'both users look at one shared court');assert.equal(row.joysticks,(mode==='local'?2:1)*(control==='six'?6:1));assert(!row.overflow);
    assert(row.stickSizes.every(w=>w>=(control==='six'?52:88)),'analog touch targets remain large');
    assert(row.controls.every(r=>r.left>=-.5&&r.top>=-.5&&r.right<=viewport.width+.5&&r.bottom<=viewport.height+.5),JSON.stringify({viewport,mode,control,row}));
    assert(row.geometry.every(g=>g.width>0&&g.height>60&&g.courtBottom<g.height&&g.heldBallY>=0&&g.heldBallY<=g.height),'service ball fits the common court');assert.equal(row.nativeFallbacks,0);
    rows.push({viewport,mode,control,...row});
    if(viewport.width===390){await page.screenshot({path:path.join(root,'audits/secret-volley-'+mode+'-'+control+'.png')});}
   }
  }
  // Real multi-touch goes through pointer capture, including the rotated upper controller.
  await page.setViewportSize({width:390,height:844});await page.evaluate(()=>{SecretVolley.setMode('local','six');SecretVolley.start();SecretVolley.model.serve(0);});
  for(let rotation=0;rotation<6;rotation++){
   const orders=await page.evaluate(rotation=>{const m=SecretVolley.model;m.state.rotations=[rotation,rotation];m.state.phase='point';m.state.phaseTime=3.1;m.tick(1/120);return [0,1].map(team=>[...document.querySelectorAll('[data-team="'+team+'"] .joystick')].map(e=>Number(e.dataset.playerId)));},rotation);
   for(const team of [0,1])assert.deepEqual(orders[team],[3,4,5,0,1,2].map(position=>team*6+(position-rotation+6)%6),'front/back pads match the formation in each player perspective');
  }
  await page.evaluate(()=>{SecretVolley.model.reset({mode:'local',control:'six'});SecretVolley.model.serve(0);});
  const cdp=await context.newCDPSession(page);
  const centers=await page.evaluate(()=>[document.querySelector('[data-team="0"] .joystick'),document.querySelector('[data-team="1"] .joystick')].map(e=>{const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,player:Number(e.dataset.playerId)};}));
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:centers.map((p,id)=>({x:p.x,y:p.y,id:id+1}))});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:centers.map((p,id)=>({x:p.x+12,y:p.y-10,id:id+1}))});await page.waitForTimeout(100);
  const input=await page.evaluate(ids=>ids.map(id=>{const p=SecretVolley.model.state.players[id],g=SecretVolley.views.find(v=>v.arena).geometry;return {controlled:p.controlled,x:p.inputX,y:p.inputY,screenSlope:p.inputY*g.sy/(p.inputX*g.sx)};}),centers.map(p=>p.player));
  assert(input.every(p=>p.controlled&&p.x>0&&p.y<0),'both rotated and lower sticks follow the same physical finger direction');
  assert(input.every(p=>Math.abs(p.screenSlope+10/12)<.001),'diagonals follow the finger in court perspective');
  await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});await page.waitForTimeout(20);assert(await page.evaluate(()=>SecretVolley.model.state.players.every(p=>!p.controlled)));
  // A large drag remains captured and bounded; a cancelled touch never leaves a held input.
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:centers[0].x,y:centers[0].y,id:7}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:centers[0].x+120,y:centers[0].y-140,id:7}]});
  assert(await page.evaluate(id=>{const p=SecretVolley.model.state.players[id];return Math.hypot(p.inputX,p.inputY)<=1.001&&p.controlled;},centers[0].player));
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  // Both people select their own athletes and aim on the same central canvas.
  await page.evaluate(()=>SecretVolley.model.reset({mode:'local'}));
  for(const team of [0,1]){
   const positions=await page.evaluate(team=>{const view=SecretVolley.views.find(v=>v.arena),g=view.geometry,r=view.canvas.getBoundingClientRect(),p=SecretVolley.model.state.players[team*6+4];function screen(x,y){return {x:r.left+g.left+x*g.sx,y:r.top+g.top+y*g.sy};}return {own:screen(p.x,p.y),enemy:screen(.8,team?16.8:1.2),id:p.id};},team);
   await page.touchscreen.tap(positions.own.x,positions.own.y);assert.equal(await page.evaluate(team=>SecretVolley.model.state.active[team],team),positions.id);
   await page.touchscreen.tap(positions.enemy.x,positions.enemy.y);const aim=await page.evaluate(team=>SecretVolley.model.state.aim[team],team);assert(Math.abs(aim.x-.8)<.15);assert(Math.abs(aim.y-(team?16.8:1.2))<.15);
  }
  // A single captured analog must hand its held vector to the new relevant player.
  await page.evaluate(()=>{SecretVolley.setMode('local','smart');SecretVolley.start();});
  const handoffs=[];
  for(const team of [0,1]){
   const press=await page.evaluate(team=>{SecretVolley.model.reset({mode:'local',control:'smart'});const root=document.querySelector('[data-team="'+team+'"] .joystick'),r=root.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2,old:SecretVolley.model.state.active[team],next:team*6+4};},team);
   await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:press.x,y:press.y,id:21}]});
   await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:press.x+10,y:press.y-12,id:21}]});
   await page.evaluate(({team,next})=>{const s=SecretVolley.model.state;s.phase='rally';s.lastTeam=1-team;s.lastPlayer=(1-team)*6;s.receiver=next;Object.assign(s.ball,{x:4.5,y:team?6:12,z:4,vx:0,vy:0,vz:0,age:0,kind:'serve',flightTeam:team,reaction:.5});}, {team,next:press.next});
   await page.waitForTimeout(65);
   const handoff=await page.evaluate(({team,old,next})=>{const s=SecretVolley.model.state;return {active:s.active[team],oldHeld:s.players[old].controlled,newHeld:s.players[next].controlled,x:s.players[next].inputX,y:s.players[next].inputY};},{team,...press});
   assert.equal(handoff.active,press.next);assert(!handoff.oldHeld&&handoff.newHeld&&handoff.x>0&&handoff.y<0);
   await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});assert(await page.evaluate(next=>!SecretVolley.model.state.players[next].controlled,press.next));handoffs.push(handoff);
  }
  // Hold / drag / release is a real directional, powered serve; cancellation does not fire.
  await page.evaluate(()=>{SecretVolley.setMode('bot','smart');SecretVolley.start();});
  const action=await page.locator('[data-team="0"] .action').boundingBox(),ax=action.x+action.width/2,ay=action.y+action.height/2;
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:ax,y:ay,id:51}]});await page.waitForTimeout(420);
  assert.equal(await page.evaluate(()=>SecretVolley.model.state.phase),'serve');assert(await page.locator('[data-team="0"] .action').evaluate(e=>e.classList.contains('charging')));
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:ax-25,y:ay-18,id:51}]});
  await page.screenshot({path:path.join(root,'audits/secret-volley-charge.png')});
  const aimed=await page.evaluate(()=>({...SecretVolley.model.state.aim[0]}));await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  const charged=await page.evaluate(()=>({phase:SecretVolley.model.state.phase,target:SecretVolley.model.state.ball.target,floor:SecretVolley.model.predict(0)}));
  assert.equal(charged.phase,'rally');assert.deepEqual(charged.target,aimed);assert(Math.hypot(charged.floor.x-aimed.x,charged.floor.y-aimed.y)<1e-6);
  await page.evaluate(()=>SecretVolley.model.reset({mode:'bot',control:'smart'}));await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{x:ax,y:ay,id:52}]});await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});assert.equal(await page.evaluate(()=>SecretVolley.model.state.phase),'serve');
  await page.evaluate(()=>SecretVolley.pause());const stopped=await page.evaluate(()=>({clock:SecretVolley.model.state.time,frames:SecretVolley.metrics.frames}));await page.waitForTimeout(180);
  assert.deepEqual(await page.evaluate(()=>({clock:SecretVolley.model.state.time,frames:SecretVolley.metrics.frames})),stopped);
  await page.click('#resumeGame');try{await page.waitForFunction(t=>SecretVolley.model.state.time>t,stopped.clock,{timeout:3000});}catch(e){console.log('RESUME',await page.evaluate(()=>({clock:SecretVolley.model.state.time,lifecycle:SecretVolley.lifecycle,open:document.getElementById('pauseMenu').open,focus:document.activeElement?.id,phase:SecretVolley.model.state.phase})),stopped,errors);throw e;}
  // Current native art, two views, real-time rally: one simulation, no legacy fallbacks.
  await page.evaluate(()=>{SecretVolley.model.reset({mode:'local'});SecretVolley.model.state.bot=[true,true];});
  await page.waitForFunction(()=>{const s=SecretVolley.model.state.stats;return s.receives>0&&s.sets>0&&s.attacks>0;},null,{timeout:30000});await page.waitForTimeout(2000);
  const steady=await page.evaluate(()=>new Promise(resolve=>{let count=0,last=performance.now();const draws=[],gaps=[],start=last,clock=SecretVolley.model.state.time,native=SecretVolley.metrics.nativeBodyDraws,cameras=SecretVolley.metrics.sceneBodyDraws;function sample(now){draws.push(SecretVolley.metrics.drawMs);gaps.push(now-last);last=now;if(++count<180){requestAnimationFrame(sample);return;}const percentile=(a,p)=>a.sort((x,y)=>x-y)[Math.floor((a.length-1)*p)];resolve({frames:count,seconds:(now-start)/1000,simulationSeconds:SecretVolley.model.state.time-clock,drawP95:percentile(draws,.95),frameGapP95:percentile(gaps,.95),nativeBodies:SecretVolley.metrics.nativeBodyDraws-native,sceneBodies:SecretVolley.metrics.sceneBodyDraws-cameras});}requestAnimationFrame(sample);}));
  assert(Math.abs(steady.simulationSeconds-steady.seconds)<.2,'the common court advances one real-time clock');
  assert(steady.sceneBodies>steady.nativeBodies&&steady.nativeBodies>0,'idle native bodies persist between frames');
  await page.screenshot({path:path.join(root,'audits/secret-volley-rally.png')});
  const realtime=await page.evaluate(()=>({metrics:{...SecretVolley.metrics},stats:{...SecretVolley.model.state.stats},phase:SecretVolley.model.state.phase}));
  assert(realtime.stats.receives>0&&realtime.stats.sets>0&&realtime.stats.attacks>0);assert.equal(realtime.metrics.fallbacks,0);
  const bodyClips=await page.evaluate(()=>{SecretVolley.pause();const copies=SecretVolley.model.state.players.map(p=>({...p})),bad=[];for(const pose of ['idle','receive','set','strike','block'])for(const angle of [0,Math.PI/2,Math.PI,Math.PI*1.5])for(const age of [0,.15,.29,.4]){for(const p of SecretVolley.model.state.players){p.pose=pose;p.poseTime=.4;p.poseAge=age;p.angle=angle;p.jump=pose==='strike'||pose==='block'?.5:0;}SecretVolley.render();for(const e of SecretVolley.inspectBodyEdges())if(e.touching)bad.push({pose,angle,age,...e});}for(let i=0;i<copies.length;i++)Object.assign(SecretVolley.model.state.players[i],copies[i]);return bad;});
  assert.deepEqual(bodyClips,[],'normal actions cannot be cropped by the shared body canvas');
  // A physical winning point produces a usable result and a clean, immediate rematch.
  await page.evaluate(()=>{SecretVolley.resume();const s=SecretVolley.model.state;s.score=[10,4];s.phase='rally';s.lastTeam=0;s.lastPlayer=0;Object.assign(s.ball,{x:4.5,y:2,z:.001,vx:0,vy:0,vz:-1,age:.5,flightTeam:1});SecretVolley.model.tick(1/120);});
  await page.waitForFunction(()=>document.getElementById('pauseMenu').open&&!document.getElementById('rematchGame').hidden);
  await page.screenshot({path:path.join(root,'audits/secret-volley-result.png')});
  const resultClose=await page.locator('#resumeClose').boundingBox();await page.locator('.pause-content').evaluate(e=>e.scrollTop=e.scrollHeight);assert.deepEqual(await page.locator('#resumeClose').boundingBox(),resultClose,'result close never scrolls with the content');
  assert.equal(await page.evaluate(()=>SecretVolley.model.state.finished),true);await page.click('#rematchGame');assert.deepEqual(await page.evaluate(()=>SecretVolley.model.state.score),[0,0]);assert.equal(await page.evaluate(()=>SecretVolley.model.state.phase),'serve');
  const writes=await page.evaluate(()=>window.__miniWrites);assert(writes.every(k=>k==='idle-spiker-secret-volley-v1'));
  assert.deepEqual(errors,[]);assert.deepEqual(missing,[]);
  await page.close();
  // The actual Cheats entry remains dormant until used; closing removes the entire runtime.
  const main=await context.newPage(),requests=[];main.on('pageerror',e=>errors.push(e.message));main.on('request',r=>{if(r.url().includes('secret-volley'))requests.push(r.url());});
  await main.goto(base+'/index.html',{waitUntil:'domcontentloaded'});await main.waitForFunction(()=>window.TeamAppearance&&window.Scouting);
  await main.evaluate(()=>localStorage.setItem('idle-spiker-profile-v1',JSON.stringify({version:1,name:'Deniz',country:'TR',appearance:TeamAppearance.generate(),music:[]})));
  await main.reload({waitUntil:'domcontentloaded'});await main.locator('#bootScreen').waitFor({state:'detached'});await main.locator('#openSecretVolley').waitFor({state:'attached'});
  assert(requests.every(u=>u.includes('secret-volley-launcher.js')),'no art, physics or iframe loads before opening');
  await main.evaluate(()=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());GuidedTutorial.stop();GuidedTutorial.start=()=>false;document.getElementById('settingsDialog').showModal();document.getElementById('cheatDrawer').open=true;});
  await main.click('#openSecretVolley');const embedded=main.frameLocator('#secretVolleyDialog iframe');await embedded.locator('#startGame').waitFor({state:'visible'});
  await main.waitForFunction(()=>document.querySelector('#secretVolleyDialog iframe')?.contentWindow?.SecretVolley?.loaded);
  await embedded.locator('#startGame').click();await main.waitForTimeout(100);assert(await main.locator('#secretVolleyDialog iframe').evaluate(e=>e.contentWindow.SecretVolley.running));
  await embedded.locator('#pauseGame').click();await embedded.locator('#leaveGame').click();await main.locator('#secretVolleyDialog').waitFor({state:'detached'});
  assert.equal(await main.locator('iframe[src*="secret-volley"]').count(),0);assert(await main.locator('#settingsDialog').evaluate(d=>d.open));
  await main.close();assert.deepEqual(errors,[]);
  fs.writeFileSync(path.join(root,'audits/secret-volley-browser.json'),JSON.stringify({layouts:rows,multiTouch:input,smartHandoffs:handoffs,realtime,steady,storageWrites:[...new Set(writes)],errors,missing},null,2));
  console.log('PASS 24 responsive layouts with one shared court, native vectors, real multi-touch + cancellation, both teams selecting/aiming, pause/resume, live rally, isolated storage, dormant Cheats launcher and runtime disposal');
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
