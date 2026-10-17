const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
// Force only skill selection in this test server. Contacts, results, movement,
// timing and rendering still run through the real match engine.
const skills=fs.readFileSync(path.join(__dirname,'match-skills.js'),'utf8')
 .replace('function pickSkill(ids){','function pickSkill(ids){if(window.__skillWanted)return canShow()&&ids.includes(window.__skillWanted)?catalog.get(window.__skillWanted):null;')
 .replaceAll('originalPlayer(p);','window.__skillPoses?.push({index:p.index,jump:p.jump,angle:p.angle,receive:p.receive});originalPlayer(p);')
 .replace('originalDraw();if(ready)paintEffects();','window.__skillBall={x:flight.x,y:flight.y,z:flight.z};originalDraw();if(ready)paintEffects();');
const server=http.createServer((req,res)=>{const file=path.join(__dirname,decodeURIComponent(new URL(req.url,'http://localhost').pathname));fs.readFile(file,(error,data)=>{if(error)return res.writeHead(404).end();res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(path.basename(file)==='match-skills.js'?skills:data)})});
(async()=>{await new Promise(resolve=>server.listen(0,resolve));const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage({viewport:{width:430,height:880}}),errors=[];page.on('pageerror',e=>errors.push(e.message));const url='http://localhost:'+server.address().port+'/mac.html';
 for(const id of ['jump-float-legendary','float','sync-attack']){
  await page.goto(url);await page.waitForFunction(()=>ready&&window.MatchSkills);
  const result=await page.evaluate(id=>{
   paused=true;reset();window.__skillWanted=id;window.matchInfo={division:2,stage:'bal',fixtureId:'reaction-'+id};matchRandom=MatchRules.seeded('reaction-'+id);
   for(const p of players)p.stats={role:['middle','outside','setter','middle','outside','opposite'][p.index%6],spike:90,block:12,serve:70,receive:25,set:80,stamina:70,mental:50};
   paused=false;let reacted=false,synced=false,drop=false,noFalseReaction=true,restored=true,turned=false,samples=[],maxMove=0,capture=null;
   const fields=p=>[p.x,p.y,p.angle,p.moving,p.phase,p.block,p.jump,p.spike,p.approach,p.toss,p.receive];
   for(let i=0;i<80000&&document.getElementById("matchResult").hidden;i++){
    const before=players.map(p=>({x:p.x,y:p.y}));tick(1/60);players.forEach((p,j)=>maxMove=Math.max(maxMove,Math.hypot(p.x-before[j].x,p.y-before[j].y)));
    const state=MatchSkills.state,hasReaction=state.reactions.some(r=>r.reason===(id==='sync-attack'?'sync-attack':'float'));
    if(hasReaction){reacted=true;if(ball.outcome?.winner!=='actor')noFalseReaction=false;}
    if(i%3===0){
     const saved=JSON.stringify(players.map(fields)),b=JSON.stringify([ball.x,ball.y,ball.z]);window.__skillPoses=[];draw();
     if(saved!==JSON.stringify(players.map(fields))||b!==JSON.stringify([ball.x,ball.y,ball.z]))restored=false;
     if(hasReaction&&!capture)capture=canvas.toDataURL("image/png");
     if(hasReaction&&window.__skillPoses.some(v=>state.reactions.some(r=>r.actor===v.index)&&Math.abs(v.angle-players[v.index].angle)>.04))turned=true;
     const group=state.synchronized.find(g=>g.leaping);
     if(group&&group.members.every(index=>window.__skillPoses.some(p=>p.index===index&&p.jump>0)))synced=true;
     if(id==='jump-float-legendary'&&ball.kind==='serve'&&ball.state==='flight'&&state.active.some(e=>e.id===id)){
      const u=ball.t/ball.duration;if(u>.68&&u<.77&&samples.length===0)samples.push(window.__skillBall.z);
      if(u>.96&&samples.length===1){samples.push(window.__skillBall.z);drop=samples[0]-samples[1]>35;}
     }
    }
    if(reacted&&turned&&(id==='sync-attack'?synced:id==='float'||drop))break;
   }
   paused=true;return {id,reacted,synced,drop,noFalseReaction,restored,turned,samples,maxMove,capture,events:MatchSkills.events};
  },id);
  if(result.capture)fs.writeFileSync(path.join(require('os').tmpdir(),'spiker-'+id+'-reaction.png'),Buffer.from(result.capture.split(',')[1],'base64'));
  assert(result.events.some(e=>e.id===id),id+' activated');assert(result.reacted,id+' has failed-defense reactions');assert(result.turned,id+' visible hesitation');assert(result.noFalseReaction,'no confusion on successful defenses');assert(result.restored,'drawing restores every animation field');assert(result.maxMove<12,'no movement teleports');
  if(id==='jump-float-legendary'){assert(result.drop,'late float drop is distinct');assert.equal(await page.evaluate(()=>MatchSkills.catalog.find(s=>s.id==='jump-float-legendary').rarity),'Legendary');}
  if(id==='sync-attack')assert(result.synced,'all eligible attackers jump together');console.log('PASS',id,{drop:result.samples,synchronized:result.synced});
 }
 assert.deepEqual(errors,[]);
 }finally{await browser.close();server.close()}})().catch(error=>{console.error(error);process.exitCode=1});
