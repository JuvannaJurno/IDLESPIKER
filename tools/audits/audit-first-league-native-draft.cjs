const fs=require('fs'),http=require('http'),path=require('path'),assert=require('assert/strict');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
const server=http.createServer((q,r)=>{const f=path.join(require('node:path').resolve(__dirname,"../.."),decodeURIComponent(new URL(q.url,'http://localhost').pathname));fs.readFile(f,(e,b)=>{if(e)return r.writeHead(404).end();r.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':f.endsWith('.svg')?'image/svg+xml':f.endsWith('.png')?'image/png':'text/html');r.end(b)})});
(async()=>{await new Promise(r=>server.listen(0,r));const b=await chromium.launch({channel:'msedge',headless:true});try{
 const context=await b.newContext(),main=await context.newPage(),court=await context.newPage(),url='http://localhost:'+server.address().port,errors=[];
 main.on('pageerror',e=>errors.push('main: '+e.message));court.on('pageerror',e=>errors.push('court: '+e.message));
 await main.goto(url+'/index.html');await main.waitForFunction(()=>window.MatchIntro&&window.FirstLeague);await main.evaluate(()=>{GuidedTutorial.stop();GuidedTutorial.start=()=>false;document.querySelectorAll('dialog[open]').forEach(d=>d.close())});
 const samples=[],last=require('../../audits/division2-championship-current.json').routes.find(r=>r.profile==='active'&&r.seed===41).snapshots.at(-1),source=last.rosters[last.home===0?0:1];
 for(const growth of [0,36])for(const round of [1,7,14])for(let seed=1;seed<=2;seed++){
  const data=await main.evaluate(({growth,round,source})=>{
   const s=BalRules.enter(RoomRules.defaults(),1);s.division=4;s.divisionCalendar=2;s.balLegendaryCount=3;RoomSystem.loadStage(s);LeagueSeason.loadStage({mode:'bal',division:4,startDay:1,run:4,divisionCalendar:2,divisionEntryRating:128,results:{}});
   const roles=['middle','outside','setter','middle','outside','opposite','libero'],used=new Set(),pool=source,strong={setter:['set'],outside:['spike','receive'],opposite:['spike','serve'],middle:['block'],libero:['receive']},rating=120+growth*(round-1)/13;
   const own=roles.map(role=>{const p=structuredClone(pool.find(p=>p.role===role&&!used.has(p.id)));used.add(p.id);for(const k of TeamRules.trainable)p[k]=Math.round(rating+(strong[role].includes(k)?12:-8));const correction=Math.round(rating)-TeamRules.overall(p);for(const k of TeamRules.trainable)p[k]+=correction;p.appearance=TeamAppearance.generate();return p});
   for(const p of own)s.camp.boosts[p.id]=Math.max(0,p.skillCamps-(p.transferCamps||0))*30;RoomSystem.loadStage(s);const lineup=Object.fromEntries(['o1','s1','p','o2','s2','pc','l'].map((key,i)=>[key,own[i].id])),f=LeagueRules.schedule().find(f=>f.ours&&f.round===round),original=TeamRules.legendaryCount;
   const count=TeamRules.legendaryCount(own,s,lineup);let opponents;try{TeamRules.legendaryCount=()=>count;opponents=MatchIntro.opponents(f)}finally{TeamRules.legendaryCount=original}
   return{own,lineup,f,opponents,count,ownOVR:Math.round(own.slice(0,6).reduce((n,p)=>n+TeamRules.overall(p),0)/6),rivalOVR:Math.round(opponents.slice(0,6).reduce((n,p)=>n+TeamRules.overall(p),0)/6)};
  },{growth,round,source});
  await court.goto(url+'/mac.html');await court.waitForFunction(()=>ready&&window.MatchSkills);
  const fixtureId='first-draft-'+growth+'-'+round+'-'+seed;
  await court.evaluate(({data,fixtureId,seed})=>{paused=true;reset();let randomSeed=seed*7919;Math.random=()=>{randomSeed=(randomSeed*1664525+1013904223)>>>0;return randomSeed/4294967296};window.postMessage({type:'spiker-match',action:'squad',squad:{players:data.own,lineup:data.lineup,opponents:data.opponents,matchInfo:{stage:'bal',division:4,fixtureId,round:data.f.round,opponentLegendaryUnlocked:data.count>0,names:['Taslak kadro','1. Lig rakibi']}}},'*')},{data,fixtureId,seed});
  await court.waitForFunction(id=>window.matchInfo?.fixtureId===id&&!paused,fixtureId,{timeout:25000});
  const result=await court.evaluate(()=>{let steps=0;const start=performance.now();while(steps++<180000&&document.getElementById('matchResult').hidden)tick(1/60);paused=true;return{score:[...scores],finished:!document.getElementById('matchResult').hidden,skillEvents:MatchSkills.events.map(e=>({id:e.id,team:e.team})),steps,computeMs:Math.round(performance.now()-start)}});
  assert(result.finished&&result.score[0]!==result.score[1]);samples.push({growth,round,seed,ownOVR:data.ownOVR,ownLegendary:data.count,rivalOVR:data.rivalOVR,...result});console.log(JSON.stringify({growth,round,seed,score:result.score,events:result.skillEvents.length,ms:result.computeMs}));
 }
 assert.deepEqual(errors,[]);fs.writeFileSync('audits/first-league-native-draft.json',JSON.stringify({method:'12 native simulated matches, real MatchIntro rivals and current court/Legendary engine. Real earned player skill loadouts from the prior-stage economy audit, with artificially controlled stat routes; not a real full-economy first-league playthrough. computeMs measures stepping without drawing, not FPS.',samples,errors},null,2));
 console.log('PASS 12 native matches complete without page errors or stuck rallies');
}finally{await b.close();server.close()}})().catch(e=>{console.error(e.message);server.close();process.exitCode=1});
