const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
const server=http.createServer((req,res)=>{const file=path.join(__dirname,decodeURIComponent(new URL(req.url,'http://localhost').pathname));fs.readFile(file,(error,data)=>{if(error)return res.writeHead(404).end();res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(data)})});
(async()=>{await new Promise(resolve=>server.listen(0,resolve));const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage({viewport:{width:390,height:844},isMobile:true,deviceScaleFactor:3}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 // Drive display frames deterministically, separately from fixed physics steps.
 await page.addInitScript(()=>window.requestAnimationFrame=()=>1);
 await page.route('**/match-skills.js*',async route=>{const response=await route.fetch();await route.fulfill({response,body:(await response.text()).replace('random()>.60','random()>1')});});
 const url='http://localhost:'+server.address().port+'/mac.html',results=[];
 for(const hz of [60,120])for(const smoothing of [false,true]){
  await page.goto(url);await page.waitForFunction(()=>ready&&window.MatchMotion&&window.MatchFrames);
  results.push(await page.evaluate(({hz,smoothing})=>{
   paused=true;reset();window.matchInfo={division:3,fixtureId:'motion-performance'};matchRandom=MatchRules.seeded('motion-performance');
   for(const p of players){p.roster={id:'motion-'+p.index,name:'Motion',surname:String(p.index),role:'outside',skillCamps:3,matchSkillsVersion:1,matchSkills:['cross','power-hit','jump-float-legendary']};p.stats={role:['middle','outside','setter','middle','outside','opposite'][p.index%6],spike:40,block:40,serve:40,receive:40,set:40,stamina:40,mental:40};}
   if(!smoothing)window.MatchMotion=null;paused=false;last=0;frameCarry=0;
   let flight=null,previous=null,frames=0,stale=0,slowFrames=0,slowStale=0,cost=[];
   for(let i=0;i<hz*7;i++){
    const start=performance.now();loop(1000+i*1000/hz);cost.push(performance.now()-start);
    if(ball.state==='flight'&&!MatchSkills.state.notice?.lead&&!MatchSkills.state.impact&&!MatchSkills.state.blackout){
     const position=smoothing?MatchMotion.state.ballX+','+MatchMotion.state.ballY:ball.x+','+ball.y;
     if(ball===flight){frames++;const slow=MatchSkills.state.slow;if(slow)slowFrames++;if(position===previous){stale++;if(slow)slowStale++;}}
     previous=position;flight=ball;
    }else {flight=null;previous=null;}
   }
   paused=true;cost.sort((a,b)=>a-b);
   return {hz,smoothing,frames,stale,slowFrames,slowStale,p95FrameWorkMs:cost[Math.floor(cost.length*.95)],simulation:JSON.stringify({scores,elapsed,history,positions:players.map(p=>[p.x,p.y,p.jump,p.angle])})};
  },{hz,smoothing}));
 }
 for(const hz of [60,120]){const baseline=results.find(r=>r.hz===hz&&!r.smoothing),smooth=results.find(r=>r.hz===hz&&r.smoothing);assert.equal(smooth.simulation,baseline.simulation,'rendering must not change match results or physics');assert(baseline.slowStale>5,'exercise slow motion');assert(smooth.slowStale<=baseline.slowStale*.15,'slow motion should have continuous display frames');if(hz===120)assert(smooth.stale<=baseline.stale*.15,'high refresh motion is smooth');}
 const idle=await page.evaluate(()=>{paused=true;let count=0;const original=draw;draw=function(){count++;original()};MatchFrames.invalidate();for(let i=0;i<120;i++)loop(20000+i*1000/60);draw=original;return count});assert.equal(idle,1,'paused matches stop repainting');
 const caughtUp=await page.evaluate(()=>{reset();window.matchInfo={division:1};paused=false;last=1000;frameCarry=0;const before=elapsed;loop(1050);paused=true;return elapsed-before});assert(Math.abs(caughtUp-.05)<.00001,'50 ms frame stalls keep game time');
 assert.deepEqual(errors,[]);console.log('PASS continuous 60/120 Hz slow motion, identical simulations, paused rendering and frame catch-up.',results.map(({simulation,...r})=>r));
 }finally{await browser.close();server.close()}})().catch(error=>{console.error(error);process.exitCode=1});
