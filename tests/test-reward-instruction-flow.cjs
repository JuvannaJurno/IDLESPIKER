const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{pathToFileURL}=require('node:url');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
const L=require('../scripts/game/league-rules.js');
for(const raw of [null,{mode:'replay',run:2,startDay:1},{mode:'bal',startDay:1},{mode:'bal',division:3,startDay:1,divisionCalendar:2},{mode:'bal',division:4,startDay:1,divisionCalendar:2},{mode:'bal',division:3,startDay:1,seasonRounds:28,results:{old:[5,3]}}]){L.configure(raw);assert.equal(L.config.matchTrigger/L.config.dayInstructions,.5);}
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{
 const p=await b.newPage({viewport:{width:390,height:844}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>localStorage.setItem('idle-spiker-language-v1','tr'));
 const url=pathToFileURL(path.resolve('index.html')).href;
 await p.goto(url);await p.waitForFunction(()=>window.TeamAppearance&&window.RoomSystem);
 await p.evaluate(()=>localStorage.setItem('idle-spiker-profile-v1',JSON.stringify({version:1,name:'Deniz',country:'TR',appearance:TeamAppearance.generate(),music:[]})));
 await p.reload();await p.locator('#bootScreen').waitFor({state:'detached'});
 await p.evaluate(()=>{GuidedTutorial.stop();GuidedTutorial.start=()=>false;document.querySelectorAll('dialog[open]').forEach(d=>d.close());});
 await p.waitForFunction(()=>document.getElementById('tutorialChoice').open);await p.locator('[data-tutorial="no"]').click();
 await p.evaluate(()=>{RoomSystem.loadStage(RoomRules.defaults());RoomSystem.setAutoClick(()=>{});LeagueSeason.loadStage(null);MenuUI.loadStage({day:1,clicksToday:0});});
 const skip=p.locator('#calendarSkipMatch'),ad=p.locator('#calendarRewardAd'),claim=ad.locator('.reward-claim');
 await skip.click();assert(await claim.isDisabled());await ad.locator('.reward-close').click();assert.equal(await p.evaluate(()=>localStorage.getItem('idle-spiker-calendar-reward-v1')),null,'Closing early must not start a cooldown');
 await skip.click();await claim.waitFor();await p.waitForFunction(()=>!document.querySelector('#calendarRewardAd .reward-claim').disabled,{},{timeout:9000});
 const instant=await p.evaluate(()=>{const before=MenuUI.snapshot();document.querySelector('#calendarRewardAd .reward-claim').click();return {before,after:MenuUI.snapshot(),reward:JSON.parse(localStorage.getItem('idle-spiker-calendar-reward-v1'))};});
 assert.deepEqual(instant.after,instant.before,'Reward must not jump straight to the match');assert(instant.reward.until>Date.now()+290000);assert(instant.reward.fixture);
 await p.waitForFunction(()=>MenuUI.snapshot().clicksToday>=25);
 assert(await skip.isDisabled());assert((await skip.innerText()).includes('100×'));assert((await p.evaluate(()=>MenuUI.flowMetrics().logical))>0,'Real visible instruction packets must flow');
 await p.locator('#calendarPanel').screenshot({path:'audits/reward-instruction-flow.png'});
 // A modal temporarily pauses the reward; it resumes without a catch-up burst.
 const paused=await p.evaluate(()=>{const d=document.createElement('dialog');d.id='rewardTestPause';document.body.append(d);d.showModal();return MenuUI.snapshot();});
 await p.waitForTimeout(300);assert.deepEqual(await p.evaluate(()=>MenuUI.snapshot()),paused);
 for(const width of [280,320,390]){await p.setViewportSize({width,height:844});for(const lang of ['tr','en']){await p.evaluate(lang=>GameLanguage.set(lang),lang);assert(await skip.evaluate(e=>e.getBoundingClientRect().right<=document.getElementById('calendarPanel').getBoundingClientRect().right+1));}}
 await p.evaluate(()=>GameLanguage.set('tr'));
 await p.evaluate(()=>document.getElementById('rewardTestPause').remove());
 const hidden=await p.evaluate(()=>{Object.defineProperty(document,'hidden',{configurable:true,get:()=>true});return MenuUI.snapshot();});
 await p.waitForTimeout(250);assert.deepEqual(await p.evaluate(()=>MenuUI.snapshot()),hidden,'Hidden tabs must not burn through the reward');
 await p.evaluate(()=>delete document.hidden);
 // Persisted active reward survives reload and retains its original cooldown deadline.
 await p.waitForTimeout(250);await p.reload();await p.locator('#bootScreen').waitFor({state:'detached'});await p.evaluate(()=>{GuidedTutorial.stop();GuidedTutorial.start=()=>false;document.querySelectorAll('dialog[open]').forEach(d=>d.close());});
 assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('idle-spiker-calendar-reward-v1')).until),instant.reward.until);
 try{await p.waitForFunction(()=>!!LeagueSeason.dueFixture(MenuUI.snapshot()),{},{timeout:12000});}catch(e){console.log(await p.evaluate(()=>({menu:MenuUI.snapshot(),reward:localStorage.getItem('idle-spiker-calendar-reward-v1'),dialogs:[...document.querySelectorAll('dialog[open]')].map(d=>d.id),hint:document.getElementById('learningHint')?.outerHTML.slice(0,220),paused:RoomSystem.productionPaused()})));throw e;}
 const result=await p.evaluate(()=>({menu:MenuUI.snapshot(),room:RoomSystem.snapshot(),reward:JSON.parse(localStorage.getItem('idle-spiker-calendar-reward-v1')),active:MatchGateway.active(),markers:[...document.querySelectorAll('.calendar-match-threshold')].map(e=>e.style.bottom)}));
 assert.equal(result.menu.day,4);assert.equal(result.menu.clicksToday,50);assert.equal(result.room.instructions,350);assert.equal(result.reward.fixture,null);assert(!result.active,'Only normal match arrival should open; do not force team preparation');assert(result.markers.every(v=>v==='50%'));
 const stopped=result.room.instructions;await p.waitForTimeout(250);assert.equal(await p.evaluate(()=>RoomSystem.snapshot().instructions),stopped,'Reward stops at the first pending fixture');
 // The next fixture cannot consume a new ad while the cooldown is active.
 await p.evaluate(()=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());LeagueSeason.loadStage({mode:'replay',run:2,startDay:10,results:{}});MenuUI.loadStage({day:10,clicksToday:0});});
 assert(await skip.isDisabled());assert((await skip.innerText()).includes('Tekrar kullan'));
 assert.equal(await p.evaluate(()=>MenuUI.skipTrainingToMatch()),false);
 await p.evaluate(()=>GameLanguage.set('en'));assert((await skip.innerText()).includes('Use again'));await p.evaluate(()=>GameLanguage.set('tr'));
 await p.evaluate(()=>{const now=Date.now;Date.now=()=>now()+300001;MenuUI.refresh();});assert(await skip.isEnabled());
 await p.evaluate(()=>GameLanguage.set('en'));assert.equal(await skip.locator('span').nth(1).innerText(),'Speed up to the next match');
 // Three instruction lanes must stop in the middle of a dispatch at the exact threshold.
 await p.evaluate(()=>{GameLanguage.set('tr');document.querySelectorAll('dialog[open]').forEach(d=>d.close());const s=BalRules.enter(RoomRules.defaults(),1);s.division=2;s.floors[1]=[...Array(5).fill('fast_internet'),...Array(10).fill('bal_coach')];RoomSystem.loadStage(s);RoomSystem.setAutoClick(()=>{});LeagueSeason.loadStage({mode:'bal',startDay:1,results:{}});MenuUI.loadStage({day:LeagueSeason.progress().next.day,clicksToday:248});});
 const beforeLanes=await p.evaluate(()=>RoomSystem.snapshot().instructions);assert.equal(await p.evaluate(()=>MenuUI.skipTrainingToMatch()),true);
 await p.waitForFunction(()=>!!LeagueSeason.dueFixture(MenuUI.snapshot()));assert.equal(await p.evaluate(()=>MenuUI.snapshot().clicksToday),250);assert.equal(await p.evaluate(()=>RoomSystem.snapshot().instructions),beforeLanes+2);
 assert.deepEqual(errors,[]);fs.writeFileSync('audits/reward-instruction-flow.json',JSON.stringify({instant,result:{...result,room:{instructions:result.room.instructions,ap:result.room.ap,budget:result.room.budget,pendingGains:result.room.pendingGains.length}},errors},null,2));
 console.log('PASS cancelled ad, five-second eligibility, visible gradual flow, modal pause, reload resume, exact midpoint stop, persistent cooldown, expiry, English and six season formats.');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1});
