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

await page.locator('#teamTab').click();
const original=await page.evaluate(()=>TeamView.snapshot().lineup);
await page.locator('#activeTeam .card-lineup-action').first().click();
assert(await page.locator('#lineupDialog').isVisible());
await page.locator('.lineup-option').first().click();
const chosen=await page.locator('.lineup-option[aria-pressed=true]').getAttribute('data-candidate');
assert(await page.locator('.lineup-comparison').isVisible());
await page.locator('.lineup-confirm').click();
assert.equal(await page.evaluate(()=>TeamView.snapshot().lineup.p),chosen);
assert.equal(await page.locator('#benchCards [data-player="'+original.p+'"]').count(),1);
await page.locator('#benchCards [data-player="'+original.p+'"] .card-lineup-action').click();
await page.locator('.lineup-option').first().click();await page.locator('.lineup-confirm').click();
assert.equal(await page.evaluate(()=>TeamView.snapshot().lineup.p),original.p);
// Two same-role starters swap without leaving a hole.
await page.locator('#activeTeam [data-player="'+original.s1+'"] .card-lineup-action').click();
await page.locator('.lineup-option[data-candidate="'+original.s2+'"]').click();
for(const width of [320,390,480]){await page.setViewportSize({width,height:844});assert(await page.locator('#lineupDialog').evaluate(el=>el.scrollWidth<=el.clientWidth));}
await page.setViewportSize({width:390,height:844});await page.screenshot({path:'lineup-picker-mobile.png'});await page.locator('.lineup-confirm').click();
const swapped=await page.evaluate(()=>TeamView.snapshot().lineup);assert.equal(swapped.s1,original.s2);assert.equal(swapped.s2,original.s1);assert.equal(new Set(Object.values(swapped)).size,7);
await page.reload();await page.locator('#bootScreen').waitFor({state:'detached'});assert.deepEqual(await page.evaluate(()=>TeamView.snapshot().lineup),swapped);
assert.deepEqual(errors,[]);console.log('PASS: starter replacement, bench assignment, two-position swap, seven unique starters, saved reload and 320/390/480 dialog widths.');
}finally{await browser?.close();server.close()}})().catch(e=>{console.error(e);process.exitCode=1});
