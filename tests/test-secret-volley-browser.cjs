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
  const rows=[];
  for(const viewport of [{width:280,height:568},{width:320,height:568},{width:390,height:844},{width:430,height:932},{width:1280,height:900},{width:844,height:390}]){
   await page.setViewportSize(viewport);
   for(const mode of ['bot','local'])for(const control of ['smart','six']){
    await page.evaluate(({mode,control})=>{SecretVolley.setMode(mode,control);SecretVolley.start();},{mode,control});await page.waitForTimeout(90);
    const row=await page.evaluate(()=>({views:SecretVolley.views.length,canvases:document.querySelectorAll('.arena canvas').length,joysticks:document.querySelectorAll('.joystick').length,overflow:document.documentElement.scrollWidth>innerWidth,
     controls:[...document.querySelectorAll('.joystick,.action,.center-pause')].map(e=>{const r=e.getBoundingClientRect();return {left:r.left,top:r.top,right:r.right,bottom:r.bottom};}),
     nativeFallbacks:SecretVolley.metrics.fallbacks,geometry:SecretVolley.views.filter(v=>v.arena).map(v=>{const g=v.geometry,b=SecretVolley.model.state.ball;const ground=g.top+b.y*g.sy;return {width:g.w,height:g.h,courtBottom:g.top+g.ch,heldBallY:ground-b.z*Math.min(g.sy*.75,12)};}),height:innerHeight,width:innerWidth}));
    assert.equal(row.views,mode==='local'?2:1);assert.equal(row.canvases,1,'both users look at one shared court');assert.equal(row.joysticks,(mode==='local'?2:1)*(control==='six'?6:1));assert(!row.overflow);
    assert(row.controls.every(r=>r.left>=-.5&&r.top>=-.5&&r.right<=viewport.width+.5&&r.bottom<=viewport.height+.5),JSON.stringify({viewport,mode,control,row}));
    assert(row.geometry.every(g=>g.width>0&&g.height>60&&g.courtBottom<g.height&&g.heldBallY>=0&&g.heldBallY<=g.height),'service ball fits the common court');assert.equal(row.nativeFallbacks,0);
    rows.push({viewport,mode,control,...row});
    if(viewport.width===390){await page.screenshot({path:path.join(root,'audits/secret-volley-'+mode+'-'+control+'.png')});}
   }
  }
  // Real multi-touch goes through pointer capture, including the rotated upper controller.
  await page.setViewportSize({width:390,height:844});await page.evaluate(()=>{SecretVolley.setMode('local','six');SecretVolley.start();SecretVolley.model.serve(0);});
  const cdp=await context.newCDPSession(page);
  const centers=await page.evaluate(()=>[document.querySelector('[data-team="0"] .joystick'),document.querySelector('[data-team="1"] .joystick')].map(e=>{const r=e.getBoundingClientRect();return {x:r.x+r.width/2,y:r.y+r.height/2};}));
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:centers.map((p,id)=>({...p,id:id+1}))});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:centers.map((p,id)=>({x:p.x+12,y:p.y-10,id:id+1}))});await page.waitForTimeout(100);
  const input=await page.evaluate(()=>[SecretVolley.model.state.players[0],SecretVolley.model.state.players[6]].map(p=>({controlled:p.controlled,x:p.inputX,y:p.inputY})));
  assert(input.every(p=>p.controlled&&p.x>0&&p.y<0),'both rotated and lower sticks follow the same physical finger direction');
  await cdp.send('Input.dispatchTouchEvent',{type:'touchCancel',touchPoints:[]});await page.waitForTimeout(20);assert(await page.evaluate(()=>SecretVolley.model.state.players.every(p=>!p.controlled)));
  // A large drag remains captured and bounded; a cancelled touch never leaves a held input.
  await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[{...centers[0],id:7}]});
  await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[{x:centers[0].x+120,y:centers[0].y-140,id:7}]});
  assert(await page.evaluate(()=>{const p=SecretVolley.model.state.players[0];return Math.hypot(p.inputX,p.inputY)<=1.001&&p.controlled;}));
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});
  // Both people select their own athletes and aim on the same central canvas.
  await page.evaluate(()=>SecretVolley.model.reset({mode:'local'}));
  for(const team of [0,1]){
   const positions=await page.evaluate(team=>{const view=SecretVolley.views.find(v=>v.arena),g=view.geometry,r=view.canvas.getBoundingClientRect(),p=SecretVolley.model.state.players[team*6+4];function screen(x,y){return {x:r.left+g.left+x*g.sx,y:r.top+g.top+y*g.sy};}return {own:screen(p.x,p.y),enemy:screen(.8,team?16.8:1.2),id:p.id};},team);
   await page.touchscreen.tap(positions.own.x,positions.own.y);assert.equal(await page.evaluate(team=>SecretVolley.model.state.active[team],team),positions.id);
   await page.touchscreen.tap(positions.enemy.x,positions.enemy.y);const aim=await page.evaluate(team=>SecretVolley.model.state.aim[team],team);assert(Math.abs(aim.x-.8)<.15);assert(Math.abs(aim.y-(team?16.8:1.2))<.15);
  }
  await page.evaluate(()=>SecretVolley.pause());const stopped=await page.evaluate(()=>({clock:SecretVolley.model.state.time,frames:SecretVolley.metrics.frames}));await page.waitForTimeout(180);
  assert.deepEqual(await page.evaluate(()=>({clock:SecretVolley.model.state.time,frames:SecretVolley.metrics.frames})),stopped);
  await page.click('#resumeGame');await page.waitForTimeout(80);assert(await page.evaluate(t=>SecretVolley.model.state.time>t,stopped.clock));
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
  fs.writeFileSync(path.join(root,'audits/secret-volley-browser.json'),JSON.stringify({layouts:rows,multiTouch:input,realtime,steady,storageWrites:[...new Set(writes)],errors,missing},null,2));
  console.log('PASS 24 responsive layouts with one shared court, native vectors, real multi-touch + cancellation, both teams selecting/aiming, pause/resume, live rally, isolated storage, dormant Cheats launcher and runtime disposal');
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
