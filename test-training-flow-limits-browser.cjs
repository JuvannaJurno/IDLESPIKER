const assert=require('assert/strict'),path=require('path'),{chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{const p=await b.newPage({viewport:{width:390,height:844}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(()=>localStorage.setItem('idle-spiker-language-v1','tr'));const url='file:///'+process.cwd().replace(/\\/g,'/')+'/index.html';await p.addInitScript(ids=>localStorage.setItem('idle-spiker-onboarding-v1',JSON.stringify(ids)),[...require('fs').readFileSync('onboarding.js','utf8').matchAll(/(?:show|finish)\('([^']+)'/g)].map(m=>m[1]).filter(id=>!['train','player-stats','quick-upgrade'].includes(id)));await p.goto(url);await p.waitForFunction(()=>window.TeamAppearance&&window.CampSystem);await p.evaluate(()=>localStorage.setItem('idle-spiker-profile-v1',JSON.stringify({version:1,name:'Deniz',country:'TR',appearance:TeamAppearance.generate(),music:[]})));await p.reload();await p.locator('#bootScreen').waitFor({state:'detached'});await p.evaluate(()=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());GuidedTutorial.stop();});



await p.evaluate(()=>{const s=RoomRules.defaults();s.instructions=4;s.ap=1e7;s.budget=1e6;s.floors[1]=['assistant'];RoomSystem.loadStage(s);MenuUI.loadStage({day:1,clicksToday:4});LeagueSeason.loadStage({mode:'prologue',results:{}});});
await p.locator('#learningHint[data-step="guided-training-team"]:visible').waitFor();await p.locator('#teamTab').click();
await p.locator('#learningHint[data-step="guided-training-player"]:visible').waitFor();
const name=await p.locator('#learningHint').evaluate(e=>e.textContent);assert(name.includes('Adına dokun'));
await p.locator('.learning-focus.card-inspect').click();
await p.locator('#learningHint[data-step="guided-training-upgrade"]:visible').waitFor();
assert(await p.locator('#trainingStats .card-upgrade-button').isEnabled());
for(const width of [320,390]){await p.setViewportSize({width,height:844});await p.waitForTimeout(250);const hint=await p.locator('#learningHint').boundingBox(),button=await p.locator('#trainingStats .card-upgrade-button').boundingBox();assert(hint.x>=0&&hint.x+hint.width<=width);assert(hint.y+hint.height<=button.y||hint.y>=button.y+button.height,'hint leaves the upgrade button accessible');}
await p.locator('#playerDialog').screenshot({path:'audits/training-tutorial-action.png'});
const before=await p.evaluate(()=>TeamRules.cardLevel(TeamRules.players.find(p=>p.id===TeamView.snapshot().lineup.p)));
await p.locator('#trainingStats .card-upgrade-button').click();
await p.waitForFunction(()=>GuidedTutorial.completed('training'));
assert.equal(await p.evaluate(()=>TeamRules.cardLevel(TeamRules.players.find(p=>p.id===TeamView.snapshot().lineup.p))),before+1);
await p.evaluate(()=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());GuidedTutorial.stop();});
assert.equal(await p.locator('.room-player').count(),0,'neighbourhood departments contain no character');
await p.evaluate(()=>{const player=TeamRules.players[0];player.cardLevel=10;player.trainingLimitBase=10;TeamView.refresh();});
const card=p.locator('.player-card[data-player="player-0"]');assert(!(await card.textContent()).includes('Kamp gerekli'));assert((await card.textContent()).includes('Seviye sınırında'));assert.equal(await card.locator('.card-cap-meter').getAttribute('aria-valuenow'),'10');assert.equal(await card.locator('.card-cap-meter').getAttribute('aria-valuemax'),'10');assert.equal(await card.locator('.card-cap-meter i').evaluate(e=>e.style.width),'100%');await card.locator('.card-cap').evaluate(e=>e.scrollIntoView({block:'center'}));await card.locator('.card-cap').screenshot({path:'audits/card-level-ten-full.png'});
await p.evaluate(()=>{const s=BalRules.enter(RoomSystem.snapshot(),1);s.division=2;RoomSystem.loadStage(s);TeamView.refresh();});
assert.equal(await p.evaluate(()=>TeamRules.cardLimit(TeamRules.players[0])),10);assert((await card.textContent()).includes('Kamp gerekli'));assert.equal(await card.locator('.card-cap-meter i').evaluate(e=>e.style.width),'100%');await card.locator('.card-cap').evaluate(e=>e.scrollIntoView({block:'center'}));await card.locator('.card-cap').screenshot({path:'audits/card-camp-limit-full.png'});
await p.evaluate(()=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());document.getElementById('clubTab')?.click();FlowPacketCanvas.debugCapture(true);FlowPacketCanvas.begin({height:1000});FlowPacketCanvas.draw({source:'manual',lane:0,start:1},100);FlowPacketCanvas.draw({source:'auto',lane:0,start:2},100);FlowPacketCanvas.draw({source:'auto',lane:0,start:3},100);FlowPacketCanvas.end();});
assert.deepEqual(await p.evaluate(()=>FlowPacketCanvas.snapshot().map(x=>x.source)),['auto','auto','manual']);
assert.deepEqual(errors,[]);console.log('PASS actionable three-step training, real upgrade, no profile avatar in departments, no camp wording in neighbourhood, fixed promotion limit and manual packets painted last.');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
