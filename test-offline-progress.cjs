const assert=require('assert'),fs=require('fs'),path=require('path'),http=require('http');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
const server=http.createServer((req,res)=>{const f=path.join(__dirname,decodeURIComponent(new URL(req.url,'http://localhost').pathname));fs.readFile(f,(e,b)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(b)})});
(async()=>{let browser;try{
await new Promise(r=>server.listen(0,r));browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://localhost:'+server.address().port+'/index.html');
async function seed(bal,shift){
 await page.evaluate(({bal,shift})=>{window.gameResetting=true;localStorage.clear();const s=bal?BalRules.enter(RoomRules.defaults(),1):RoomRules.defaults();s.floors[1]=shift?['assistant','offline_time']:['assistant'];s.lastSeen=Date.now()-3600000;if(bal)s.openDepartments=[2,4];localStorage.setItem('idle-spiker-rooms-v2',JSON.stringify(s));localStorage.setItem('idle-spiker-main-menu-v1',JSON.stringify({day:1,clicksToday:0}));localStorage.setItem('idle-spiker-league-v1',JSON.stringify(bal?{mode:'bal',startDay:1,results:{}}:{results:{}}));localStorage.setItem('idle-spiker-onboarding-v1',JSON.stringify(['tap','arrival','blocks-basics','assistant','train','match','quick-upgrade']));},{bal,shift});
 await page.reload();await page.locator('#bootScreen').waitFor({state:'detached'});
}
await seed(false,false);assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('idle-spiker-main-menu-v1')).day),1);
await seed(false,true);await page.locator('#matchArrival').waitFor({state:'visible'});await page.screenshot({path:'match-arrival-mobile.png'});await page.locator('#arrivalLater').click();assert(await page.locator('#matchArrival').isHidden());assert.equal(await page.locator('#energyButton strong').textContent(),'Maça geç');
let snap=await page.evaluate(()=>({room:RoomSystem.snapshot(),menu:JSON.parse(localStorage.getItem('idle-spiker-main-menu-v1'))}));
assert.deepEqual(snap.menu,{day:4,clicksToday:50});assert.equal(snap.room.instructions,350);assert.equal(snap.room.budget,80);assert(snap.room.ap>0);
const earned=snap.room.ap;await page.reload();await page.locator('#bootScreen').waitFor({state:'detached'});assert.equal(await page.evaluate(()=>RoomSystem.balance()),earned);
assert(await page.locator('#matchArrival').isHidden());await page.locator('#energyButton').click();assert(await page.locator('#gameMatchDialog').isVisible());assert.equal(await page.evaluate(()=>RoomSystem.snapshot().instructions),350);
await page.evaluate(()=>{LeagueSeason.recordOwn(4,[5,3]);document.getElementById('gameMatchDialog').close();document.getElementById('energyButton').click()});assert((await page.evaluate(()=>RoomSystem.snapshot().instructions))>350);assert.equal(await page.locator('#energyButton strong').textContent(),'Talimat ver');
await seed(true,true);snap=await page.evaluate(()=>({room:RoomSystem.snapshot(),menu:JSON.parse(localStorage.getItem('idle-spiker-main-menu-v1'))}));
assert.deepEqual(snap.menu,{day:5,clicksToday:300});assert.equal(snap.room.instructions,2300);assert.equal(snap.room.budget,10*(20+35+50+65+65+460));
await page.evaluate(()=>{const s=RoomRules.defaults();RoomSystem.loadStage(s);window.gameResetting=true;});
await page.waitForTimeout(750);
const samples=await page.evaluate(async()=>{const values=[];RoomSystem.applyGain({ap:6});for(let i=0;i<18;i++){values.push(document.getElementById('roomAP').textContent);await new Promise(r=>setTimeout(r,20));}return values});
assert(samples.includes('6'));assert(samples.some(v=>Number(v)>0&&Number(v)<6));assert.deepEqual(errors,[]);
console.log('PASS: no shift/no offline days, prolog and BAL match stops, daily and department budget, reload idempotency, mandatory match before continuing, intermediate counter values, mobile browser.');
}finally{await browser?.close();server.close()}})().catch(e=>{console.error(e);process.exitCode=1});
