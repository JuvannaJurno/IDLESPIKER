const assert=require('assert'),fs=require('fs'),path=require('path'),http=require('http'),R=require('./room-rules'),B=require('./bal-rules');
const s=B.enter(R.defaults(),1);B.openDepartment(s,2);B.openDepartment(s,4);assert(R.purchase(s,1,'assistant'));assert(R.purchase(s,0,'warmup'));
const goals=['assistant','bal_sponsor','assistant','bal_coach','bal_sponsor','bal_position','bal_video','bal_search','bal_shop','bal_coach','bal_sponsor','bal_contacts','bal_talent'],purchases=[];
let carry=0,last=0;
for(let second=1;second<=600&&purchases.length<goals.length;second++){
 carry+=R.effects(s).autoRate;
 while(carry>=1){carry--;const g=R.income(s,s.dayProgress===499,()=>1,'auto');R.applyGain(s,g);s.budget+=g.cash;}
 const id=goals[purchases.length],room=R.catalog.find(r=>r.id===id);
 if(R.count(s,id)?R.upgrade(s,id):R.purchase(s,room.floor,id)){assert(second-last<=90,'opening route stalled at '+id);purchases.push({second,id});last=second;}
}
assert.equal(purchases.length,13);assert(last<=480);assert.equal(R.count(s,'bal_sponsor'),3);
const gated=R.normalize(s);gated.budget=1e6;B.upgraded(gated,'bal_sponsor');assert(!R.upgrade(gated,'bal_sponsor'),'new upgrade starts its own wait');

const prolog=R.defaults();assert.equal(R.cost(prolog,1,'assistant'),10);assert.equal(R.dailyBudget(prolog),20);assert.equal(B.cash(prolog),0);
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
const server=http.createServer((req,res)=>{const f=path.join(__dirname,decodeURIComponent(new URL(req.url,'http://localhost').pathname));fs.readFile(f,(e,b)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(b)})});
(async()=>{let browser;try{
await new Promise(r=>server.listen(0,r));browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://localhost:'+server.address().port+'/index.html');await page.evaluate(()=>{window.gameResetting=true;const s=BalRules.enter(RoomRules.defaults(),1);localStorage.setItem('idle-spiker-rooms-v2',JSON.stringify(s));localStorage.setItem('idle-spiker-league-v1',JSON.stringify({mode:'bal',startDay:1,results:{}}));localStorage.setItem('idle-spiker-main-menu-v1',JSON.stringify({day:1,clicksToday:0}));localStorage.setItem('idle-spiker-onboarding-v1',JSON.stringify(['tap','arrival','blocks-basics','assistant','train','match','quick-upgrade']));});
await page.reload();await page.locator('#bootScreen').waitFor({state:'detached'});


await page.evaluate(()=>{const s=RoomSystem.snapshot();s.budget=100000;s.floors[1]=Array(4).fill('bal_coach');RoomSystem.loadStage(s);RoomSystem.setAutoClick(()=>{});});
await page.locator('.upgrade-room[data-id=bal_coach]').click();await page.locator('.stored-bal-blocks [data-id=bal_coach]').waitFor({state:'attached'});assert.equal(await page.locator('.upgrade-room[data-id=bal_coach]').count(),1);assert.equal(await page.locator('.successor-block,.completed-blocks-open,#completedBlocks,.stored-block-flight').count(),0);assert.equal(await page.evaluate(()=>RoomSystem.effects().autoRate),4);
await page.locator('.tier[data-floor="1"] .foundation-toggle').click();await page.waitForTimeout(750);assert(await page.locator('.stored-bal-blocks').evaluate(el=>!el.parentElement.inert&&el.parentElement.getBoundingClientRect().width>100));await page.screenshot({path:'unified-block-drawer-mobile.png'});await page.locator('.tier[data-floor="1"] .foundation-toggle').click();
await page.locator('.unlock-room[data-floor="1"]').click();await page.locator('[data-block=bal_double]').click();assert.equal(await page.evaluate(()=>RoomRules.count(RoomSystem.snapshot(),'bal_double')),1);await page.locator('.tier[data-floor="1"] .foundation-toggle').click();await page.waitForTimeout(750);assert(await page.locator('.stored-bal-blocks').evaluate(el=>!el.parentElement.inert));await page.locator('.tier[data-floor="1"] .foundation-toggle').click();
await page.evaluate(()=>{const s=RoomSystem.snapshot();s.floors[1].push(...Array(4).fill('bal_double'));RoomSystem.loadStage(s);RoomSystem.setAutoClick(()=>{});});
const before=await page.evaluate(()=>({n:RoomSystem.snapshot().instructions,ap:RoomSystem.balance()}));await page.locator('#energyButton').click();assert.equal(await page.evaluate(()=>RoomSystem.snapshot().instructions),before.n+2);assert(await page.locator('.double-pulse').count()>0);assert.equal(await page.evaluate(()=>RoomSystem.balance()),before.ap);await page.waitForTimeout(5000);assert(await page.evaluate(()=>RoomSystem.balance())>before.ap);assert.equal(await page.evaluate(()=>RoomSystem.pendingGains().length),0);
const fastBefore=await page.evaluate(()=>RoomSystem.snapshot().instructions);await page.evaluate(()=>document.getElementById('testAutoclicker').click());await page.waitForTimeout(250);await page.evaluate(()=>document.getElementById('testAutoclicker').click());assert((await page.evaluate(()=>RoomSystem.snapshot().instructions))-fastBefore>=10,'fast test batches instructions');
await page.evaluate(()=>{MenuUI.loadStage({day:5,clicksToday:299});const s=RoomSystem.snapshot();s.dayProgress=299;RoomSystem.loadStage(s);RoomSystem.setAutoClick(()=>{});});const n=await page.evaluate(()=>RoomSystem.snapshot().instructions);await page.locator('#energyButton').click();assert.equal(await page.evaluate(()=>RoomSystem.snapshot().instructions),n+1);assert(await page.locator('#matchArrival').isVisible());
assert.deepEqual(errors,[]);console.log('PASS: completed block storage, successor purchase, blue double pulse, AP paid at arrival, pending receipts settled and stop exactly at match.');
}finally{await browser?.close();server.close()}})().catch(e=>{console.error(e);process.exitCode=1});
