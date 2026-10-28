// Replay earned before/after teams through the actual browser match simulation.
const fs=require('fs'),http=require('http'),path=require('path'),assert=require('assert/strict');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
const server=http.createServer((q,r)=>{const file=path.join(__dirname,decodeURIComponent(new URL(q.url,'http://localhost').pathname));fs.readFile(file,(err,data)=>{if(err)return r.writeHead(404).end();r.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.svg')?'image/svg+xml':file.endsWith('.png')?'image/png':'text/html');r.end(data);});});
(async()=>{await new Promise(r=>server.listen(0,r));const b=await chromium.launch({channel:'msedge',headless:true});try{
 const p=await b.newPage({viewport:{width:390,height:844}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.goto('http://localhost:'+server.address().port+'/mac.html');await p.waitForFunction(()=>ready&&window.MatchSkills);
 const samples=JSON.parse(fs.readFileSync('audits/tempo-native-samples.json','utf8')),rows=[];
 for(const sample of samples)for(const seed of [91,92]){if(rows.length){await p.reload();await p.waitForFunction(()=>ready&&window.MatchSkills);}
  const result=await p.evaluate(async({sample,seed})=>{
   paused=true;reset();window.matchInfo={...window.matchInfo,fixtureId:sample.fixture,stage:sample.stage,division:sample.division,epicTeam:false,opponentLegendaryUnlocked:sample.opponentLegendaryUnlocked,round:sample.round,names:["Bizim Kulüp","Rakip takım"]};matchRandom=MatchRules.seeded('native-tempo-'+sample.fixture+'-'+seed);
   const own=structuredClone(sample.rosters[sample.home===0?0:1]),rival=structuredClone(sample.rosters[sample.home===0?1:0]);
   if(sample.division===2&&sample.round===1){const hero=rival.find(p=>p.role==='outside');hero.specialCharacter='bal-opening-server';hero.legendaryTalent=true;hero.skillCamps=3;PlayerSkills.ensure(hero);hero.matchSkills[2]='jump-legendary';}
   const keys=['o1','s1','p','o2','s2','pc','l'],lineup=Object.fromEntries(own.map((p,i)=>[keys[i],p.id]));
   await new Promise((resolve,reject)=>{const timeout=setTimeout(()=>reject(new Error('squad setup timed out')),15000);function listener(e){if(e.data?.type==='spiker-match'&&e.data.action==='squad-ready'){clearTimeout(timeout);removeEventListener('message',listener);resolve();}}addEventListener('message',listener);postMessage({type:'spiker-match',action:'squad',deferStart:true,squad:{players:own,lineup,opponents:rival,matchInfo:window.matchInfo}},'*');});
   matchRandom=MatchRules.seeded('native-tempo-'+sample.fixture+'-'+seed);
   paused=false;let steps=0;for(;steps<100000&&document.getElementById('matchResult').hidden;steps++)tick(1/60);paused=true;
   return {finished:!document.getElementById('matchResult').hidden,score:[...scores],won:scores[0]>scores[1],steps};
  },{sample,seed});assert(result.finished&&result.steps>0&&Math.max(...result.score)>=5,'match did not finish: '+JSON.stringify({version:sample.version,division:sample.division,round:sample.round,seed}));rows.push({scenario:sample.scenario,version:sample.version,division:sample.division,round:sample.round,seed,...result});
 }
 assert.deepEqual(errors,[]);fs.writeFileSync('audits/tempo-native-court-results.json',JSON.stringify({method:'Earned teams from deterministic economy/market runs, actual mac.html tick/MatchSkills engine with the actual squad message/setup, six starters plus libero, skills, fatigue and native rotations. Two fixed match seeds per snapshot. First regional opponent has its actual opening legendary. Fast-forwarded simulation; no render performance or complete league ranking claim.',rows},null,2));
 for(const scenario of ['active-market','return-market'])for(const version of ['before','after'])console.log(scenario+' '+version,JSON.stringify([1,2,3].map(division=>{const x=rows.filter(r=>r.scenario===scenario&&r.version===version&&r.division===division);return {division,wins:x.filter(r=>r.won).length,matches:x.length,scores:x.map(r=>r.score)};})));
 console.log('PASS '+rows.length+' completed native matches, no browser errors.');
}finally{await b.close();server.close();}})().catch(e=>{console.error(e);server.close();process.exitCode=1;});
