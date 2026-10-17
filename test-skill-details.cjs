const fs=require('fs'),path=require('path'),http=require('http'),assert=require('assert');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
const source=fs.readFileSync(path.join(__dirname,'match-skills.js'),'utf8').replace('function pickSkill(ids){','function pickSkill(ids){if(window.__wanted)return canShow()&&ids.includes(window.__wanted)?catalog.get(window.__wanted):null;}function unusedPick(ids){');
const server=http.createServer((req,res)=>{const file=path.join(__dirname,decodeURIComponent(new URL(req.url,'http://localhost').pathname));fs.readFile(file,(error,data)=>{if(error)return res.writeHead(404).end();res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');res.end(path.basename(file)==='match-skills.js'?source:data)})});
(async()=>{await new Promise(resolve=>server.listen(0,resolve));const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 for(const id of ['deceive','sync-attack','dive']){
  await page.goto('http://localhost:'+server.address().port+'/mac.html');await page.waitForFunction(()=>ready&&MatchSkills);
  const result=await page.evaluate(id=>{
   paused=true;reset();window.__wanted=id;window.matchInfo={division:2,fixtureId:'detail-'+id};matchRandom=MatchRules.seeded('detail-'+id);
   for(const p of players)p.stats={role:['middle','outside','setter','middle','outside','libero'][p.index%6],spike:65,block:20,serve:35,receive:75,set:80,stamina:70,mental:20};
   paused=false;let wrong=false,varied=false,diveBefore=false,flat=false,restored=true,origins=new Map();const scale=ctx.scale;ctx.scale=function(x,y){if(x===1.18&&y===.66)flat=true;return scale.call(this,x,y)};
   const snapshot=()=>JSON.stringify({players:players.map(p=>[p.x,p.y,p.angle,p.jump,p.spike,p.receive]),ball:[ball.x,ball.y,ball.z]});
   for(let i=0;i<50000&&document.getElementById('matchResult').hidden;i++){
    tick(1/60);const s=MatchSkills.state;
    for(const reaction of s.reactions.filter(r=>r.reason==='deceive')){const p=players[reaction.actor];if(!origins.has(p.index))origins.set(p.index,{y:p.y,target:ball.targetY});const old=origins.get(p.index);if((p.y-old.y)*(old.target-old.y)<-15)wrong=true;}
    const group=s.synchronized.find(g=>g.leaping);if(group){const values=Object.values(group.timings);varied=new Set(values.map(t=>t.pace)).size>1&&new Set(values.map(t=>t.delay)).size>1;}
    if(s.active.some(e=>e.id==='dive')&&ball.touch===1)diveBefore=true;
    if(s.active.some(e=>e.id===id)){const before=snapshot();draw();restored&&=before===snapshot();}
    if(id==='deceive'?wrong:id==='sync-attack'?varied:diveBefore&&flat)break;
   }
   ctx.scale=scale;paused=true;return {wrong,varied,diveBefore,flat,restored};
  },id);
  assert(result.restored,'render never mutates match state');if(id==='deceive')assert(result.wrong,'fooled blockers move away from the real set');if(id==='sync-attack')assert(result.varied,'different approach and jump rhythms');if(id==='dive')assert(result.diveBefore&&result.flat,'dive starts before contact and uses a low extended pose');console.log('PASS',id,result);
 }
 assert.deepEqual(errors,[]);
 }finally{await browser.close();server.close()}})().catch(error=>{console.error(error);process.exitCode=1});
