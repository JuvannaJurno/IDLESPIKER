const fs=require('fs'),http=require('http'),path=require('path'),assert=require('assert');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
const server=http.createServer((q,r)=>{const file=path.join(__dirname,decodeURIComponent(new URL(q.url,'http://localhost').pathname));fs.readFile(file,(e,b)=>{if(e)return r.writeHead(404).end();r.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html');r.end(b);});});
(async()=>{let browser;try{
 await new Promise(r=>server.listen(0,r));browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>localStorage.setItem('idle-spiker-language-v1','tr'));
 await page.goto('http://localhost:'+server.address().port+'/index.html');await page.locator('#bootScreen').waitFor({state:'detached'});
 const result=await page.evaluate(()=>{
  const room=BalRules.enter(RoomRules.defaults(),1);room.division=3;RoomSystem.loadStage(room);
  const league=LeagueRules.normalize({mode:'bal',division:3,startDay:1,seasonRounds:28,results:{},scheduleVersion:2});
  for(const m of LeagueRules.schedule().filter(m=>m.ours&&m.round<28))LeagueRules.record(league,m.id,m.home===0?[5,3]:[3,5]);
  LeagueRules.settleRounds(league);LeagueSeason.loadStage(league);MenuUI.loadStage({day:534,clicksToday:300});
  const last=LeagueRules.schedule().find(m=>m.ours&&m.round===28);if(!LeagueSeason.recordOwn(last.day,[5,3]))throw Error('Final round was not recorded');
  const first=RoomSystem.snapshot();LeagueSeason.syncRewards();const second=RoomSystem.snapshot();
  return {played:LeagueSeason.progress().played,label:document.getElementById('seasonPlayed').textContent,rounds:LeagueRules.config.rounds,receipts:second.matchRewards.length,attendance:second.attendanceRewards.length,ap:first.ap,repeatAP:second.ap};
 });
 assert.equal(result.played,28);assert.equal(result.rounds,28);assert.equal(result.label,'28 / 28 maç');assert.equal(result.receipts,28);assert.equal(result.attendance,28);assert.equal(result.ap,result.repeatAP);
 await page.reload();await page.locator('#bootScreen').waitFor({state:'detached'});
 assert.equal(await page.evaluate(()=>LeagueSeason.progress().played),28);assert.equal(await page.evaluate(()=>LeagueRules.config.rounds),28);
 assert.equal(await page.evaluate(()=>RoomSystem.snapshot().matchRewards.length),28);assert.deepEqual(errors,[]);
 console.log('PASS browser: round 28 result, 28/28 UI, all win/attendance rewards, idempotent claims and persisted reload without page errors.');
}finally{await browser?.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
