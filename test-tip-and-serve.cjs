const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
const skills=fs.readFileSync(path.join(__dirname,'match-skills.js'),'utf8').replace('function pickSkill(ids){','function pickSkill(ids){if(window.__wanted)return canShow()&&ids.includes(window.__wanted)?catalog.get(window.__wanted):null;}\nfunction unusedPick(ids){');
const server=http.createServer((req,res)=>{const file=path.join(__dirname,decodeURIComponent(new URL(req.url,'http://localhost').pathname));fs.readFile(file,(error,data)=>{if(error)return res.writeHead(404).end();res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(path.basename(file)==='match-skills.js'?skills:data)})});
(async()=>{await new Promise(resolve=>server.listen(0,resolve));const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const id of ['ghost-tip','jump','jump-legendary','jump-float-legendary']){
  await page.goto('http://localhost:'+server.address().port+'/mac.html');await page.waitForFunction(()=>ready&&window.MatchSkills);
  const result=await page.evaluate(id=>{
   paused=true;reset();window.__wanted=id;window.matchInfo={division:2,fixtureId:'tip-and-serve-'+id};matchRandom=MatchRules.seeded('tip-and-serve-'+id);
   for(const p of players)p.stats={role:['middle','outside','setter','middle','outside','opposite'][p.index%6],spike:70,block:35,serve:50,receive:65,set:80,stamina:65,mental:60};
   paused=false;let phases=[],start=null,approachDistance=0,shot=null,posesSafe=true;
   for(let i=0;i<30000&&document.getElementById('matchResult').hidden;i++){
    tick(1/60);const state=MatchSkills.state,prep=state.servePreparation;
    if(prep){const p=players.find(p=>p.index===prep.actor);if(!start)start={x:p.x,y:p.y};approachDistance=Math.max(approachDistance,Math.hypot(p.x-start.x,p.y-start.y));if(phases.at(-1)!==prep.phase)phases.push(prep.phase);}
    if(i%10===0){const before=JSON.stringify(players.map(p=>[p.x,p.y,p.jump,p.spike,p.toss])),b=JSON.stringify([ball.x,ball.y,ball.z]);draw();posesSafe&&=before===JSON.stringify(players.map(p=>[p.x,p.y,p.jump,p.spike,p.toss]))&&b===JSON.stringify([ball.x,ball.y,ball.z]);}
    if(ball.state==='flight'&&ball.kind===(id==='ghost-tip'?'attack':'serve')&&state.active.some(e=>e.id===id)){
     shot={x:ball.targetX,y:ball.targetY,duration:ball.duration,netTime:ball.netTime,contact:ball.from.x,attacker:ball.attacker.team,reach:Math.hypot(ball.target.x-ball.targetX,ball.target.y-ball.targetY)/movementSpeed(ball.target),aim:state.aims.find(a=>a.id===id)};break;
    }
   }
   paused=true;return {phases,approachDistance,shot,posesSafe};
  },id);
  assert(result.shot,id+' makes contact');assert(result.posesSafe,'drawing is reversible');
  if(id==='ghost-tip'){assert.equal(Math.abs(result.shot.x-500),90,'tip lands just behind the net');assert.equal(result.shot.x,result.shot.aim.x,'aim matches short landing point');assert(result.shot.duration>=1.35);assert(result.shot.netTime>0&&result.shot.netTime<result.shot.duration);assert(result.shot.reach<result.shot.duration,'defender can reach successful tips');}
  else{assert.deepEqual(result.phases,['toss','approach','jump'],'toss before approach before jump');assert(result.approachDistance>20,'visible service approach');assert(result.shot.attacker===0?result.shot.contact<90:result.shot.contact>910,'service contact stays behind baseline');}
  console.log('PASS',id,id==='ghost-tip'?{landing:result.shot.x,duration:result.shot.duration}:{phases:result.phases,approach:result.approachDistance});
 }
 assert.deepEqual(errors,[]);
 }finally{await browser.close();server.close()}})().catch(error=>{console.error(error);process.exitCode=1});
