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


await page.locator('#teamTab').click();await page.evaluate(()=>{window.realDue=LeagueSeason.dueFixture;LeagueSeason.dueFixture=()=>({id:'notice-test-1',home:0,away:1});MatchArrival.show();});assert(await page.locator('#matchArrival').isHidden());
await page.locator('.mobile-nav a[href="#clubPanel"]').click();await page.locator('#matchArrival').waitFor({state:'visible'});await page.locator('#arrivalLater').click();await page.evaluate(()=>MatchArrival.show(true));assert(await page.locator('#matchArrival').isHidden());
await page.locator('#teamTab').click();await page.locator('.mobile-nav a[href="#clubPanel"]').click();assert(await page.locator('#matchArrival').isHidden());
assert.equal(await page.evaluate(()=>localStorage.getItem('idle-spiker-match-arrival-seen-v1')),'notice-test-1');await page.evaluate(()=>LeagueSeason.dueFixture=realDue);
assert.deepEqual(errors,[]);console.log('PASS: match notice suppressed on team, shown on club once, dismissal remembered across navigation.');
}finally{await browser?.close();server.close()}})().catch(e=>{console.error(e);process.exitCode=1});
