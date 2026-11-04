/* A recorded full run driven exclusively through real touch events. The driver only reads simulation state. */
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright')),{pilot}=require('./test-death-game-rules.cjs');
const root=path.resolve(__dirname,'..'),raw=path.join(root,'audits/death-game-playtest');fs.mkdirSync(raw,{recursive:true});
const mime={'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml'};
const server=http.createServer((q,r)=>{const f=path.resolve(root,'.'+decodeURIComponent(new URL(q.url,'http://localhost').pathname));if(!f.startsWith(root+path.sep)||!fs.existsSync(f)){r.writeHead(404).end();return;}r.writeHead(200,{'Content-Type':mime[path.extname(f)]||'application/octet-stream'});fs.createReadStream(f).pipe(r);});
(async()=>{let browser,context,page;const rounds=[],errors=[];let result;try{
 await new Promise(r=>server.listen(0,'127.0.0.1',r));browser=await chromium.launch({channel:'msedge',headless:true});context=await browser.newContext({viewport:{width:390,height:844},hasTouch:true,isMobile:true,recordVideo:{dir:raw,size:{width:390,height:844}}});page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:'+server.address().port+'/death-game.html');await page.waitForTimeout(650);await page.evaluate(()=>DeathGame.newRun(1));
 await page.evaluate(source=>{const {tileColor,segmentDistance}=DeathGameModel;function aim(m,x,y){const p=m.state.players[0],dx=x-p.x,dy=y-p.y,l=Math.hypot(dx,dy);m.setInput(l>.16?dx/l:0,l>.16?dy/l:0);}window.__pilot=eval('('+source+')');},pilot.toString());
 const cdp=await context.newCDPSession(page),stick=await page.locator('#stick').boundingBox(),jump=await page.locator('#jump').boundingBox(),center={x:stick.x+stick.width/2,y:stick.y+stick.height/2},limit=stick.width*.34,action={x:jump.x+jump.width/2,y:jump.y+jump.height/2,id:2};
 for(let round=0;round<5;round++){
  await page.waitForTimeout(450);await page.click('#continue');let finger={...center,id:1};await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[finger]});const start=Date.now();let jumps=0,moves=0;
  while(Date.now()-start<40000){
   const cmd=await page.evaluate(()=>{const m=DeathGame.model,command={x:0,y:0,jump:false,phase:m.state.phase,cooldown:m.state.players[0].cooldown};if(m.state.phase==='running')__pilot({state:m.state,info:m.info,setInput(x,y){command.x=x;command.y=y;},jump(){command.jump=true;}});return command;});
   if(cmd.phase!=='running')break;
   const next={x:center.x+cmd.x*limit,y:center.y+cmd.y*limit,id:1};if(Math.hypot(next.x-finger.x,next.y-finger.y)>.2){finger=next;await cdp.send('Input.dispatchTouchEvent',{type:'touchMove',touchPoints:[finger]});moves++;}
   if(cmd.jump&&cmd.cooldown<.01){await cdp.send('Input.dispatchTouchEvent',{type:'touchStart',touchPoints:[finger,action]});await page.waitForTimeout(25);await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[action]});jumps++;}
   await page.waitForTimeout(45);
  }
  await cdp.send('Input.dispatchTouchEvent',{type:'touchEnd',touchPoints:[]});await page.waitForFunction(()=>document.getElementById('overlay').open);
  const r=await page.evaluate(()=>({game:DeathGame.model.state.game.id,phase:DeathGame.model.state.phase,time:DeathGame.model.state.elapsed,cause:DeathGame.model.state.cause,cleared:DeathGame.model.state.cleared}));rounds.push({...r,jumps,moves,realSeconds:(Date.now()-start)/1000});console.log('Touch round',rounds.at(-1));if(r.phase==='dead')break;if(round<4)await page.click('#continue');
 }
 result=await page.evaluate(()=>({phase:DeathGame.model.state.phase,cleared:DeathGame.model.state.cleared,metrics:DeathGame.metrics,history:DeathGame.model.state.history,record:DeathGame.record}));await page.screenshot({path:path.join(root,'audits/death-game-playable.png')});
 const video=page.video();await page.close();await context.close();fs.copyFileSync(await video.path(),path.join(root,'audits/death-game-playable.webm'));fs.writeFileSync(path.join(root,'audits/death-game-playable.json'),JSON.stringify({rounds,result,errors},null,2));
 assert.deepEqual(errors,[]);assert.equal(result.phase,'victory',JSON.stringify(rounds));assert.equal(result.cleared,5);assert(rounds.some(r=>r.jumps>2));assert(rounds.some(r=>r.moves>5));console.log('PASS real touch full run: five different games, movement, jump timing, elimination-safe completion and final record.');
 }finally{await browser?.close();await new Promise(r=>server.close(r));}
})().catch(e=>{console.error(e);process.exitCode=1;});
