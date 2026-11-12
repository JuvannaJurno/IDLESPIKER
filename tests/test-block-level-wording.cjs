const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const {pathToFileURL}=require('node:url');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const p=await browser.newPage({viewport:{width:390,height:844}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>localStorage.setItem('idle-spiker-language-v1','tr'));
 await p.goto(pathToFileURL(path.resolve('index.html')).href);await p.waitForFunction(()=>window.TeamAppearance&&window.RoomSystem);
 await p.evaluate(()=>localStorage.setItem('idle-spiker-profile-v1',JSON.stringify({version:1,name:'Deniz',country:'TR',appearance:TeamAppearance.generate(),music:[]})));
 await p.reload();await p.locator('#bootScreen').waitFor({state:'detached'});
 await p.evaluate(()=>{GuidedTutorial.stop();GuidedTutorial.start=()=>false;document.querySelectorAll('dialog[open]').forEach(d=>d.close());});
 await p.waitForFunction(()=>document.getElementById('tutorialChoice').open);await p.locator('[data-tutorial="no"]').click();
 const words=['tıklamadan','hızlı','çok hızlı','bayağı hızlı','fena hızlı'],cards=[];
 for(const id of ['assistant','bal_coach','pro_coordinator']){
  await p.evaluate(id=>{const s=id==='assistant'?RoomRules.defaults():BalRules.enter(RoomRules.defaults(),1);s.division=id==='pro_coordinator'?3:id==='bal_coach'?2:1;s.budget=s.ap=1e9;s.openDepartments=[0,1,2,3,4];const r=RoomRules.catalog.find(r=>r.id===id);s.floors[r.floor]=[id];RoomSystem.loadStage(s);RoomSystem.setAutoClick(()=>{});},id);
  const card=p.locator('.upgrade-room[data-id="'+id+'"]');await card.waitFor();
  for(let level=1;level<=5;level++){
   if(level>1)await card.click({force:true});
   await p.waitForFunction(({id,level})=>RoomRules.count(RoomSystem.snapshot(),id)===level,{id,level});
   assert.equal(await card.locator('.block-main-copy .block-copy-emphasis').innerText(),words[level-1]);
   const text=await card.locator('.block-main-copy').innerText();assert(text.startsWith('Sen tıklamadan da'));
   await p.evaluate(()=>GameLanguage.set('en'));
   assert(!/tıklamadan|talimat|hızlı/.test(await card.locator('.block-main-copy').innerText()));
   assert.equal(await card.locator('.block-main-copy .block-copy-emphasis').count(),1);
   await p.evaluate(()=>GameLanguage.set('tr'));assert.equal(await card.locator('.block-main-copy .block-copy-emphasis').innerText(),words[level-1]);
   cards.push({id,level,text});
  }
  for(const width of [320,390]){await p.setViewportSize({width,height:844});for(const lang of ['tr','en']){await p.evaluate(lang=>GameLanguage.set(lang),lang);assert(await card.locator('.block-main-effect').evaluate(e=>e.scrollHeight<=e.clientHeight+1));}}
  await p.evaluate(()=>GameLanguage.set('tr'));
  if(id==='assistant'){await card.scrollIntoViewIfNeeded();await card.screenshot({path:'audits/block-level-wording.png'});}
  else{await card.click({force:true});assert.equal(await card.locator('.block-main-copy .block-copy-emphasis').innerText(),'fena hızlı','Bonus level must not falsely claim a faster primary rate');}
 }
 assert.deepEqual(errors,[]);fs.writeFileSync('audits/block-level-wording.json',JSON.stringify({cards,errors},null,2));
 console.log('PASS 15 real block levels, upgrade clicks, emphasis, TR/EN switching, mobile fit and unchanged primary wording during bonus levels.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
