const assert=require('assert/strict'),path=require('path'),{chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{const p=await b.newPage({viewport:{width:390,height:844}}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(()=>localStorage.setItem('idle-spiker-language-v1','tr'));const url='file:///'+process.cwd().replace(/\\/g,'/')+'/index.html';await p.addInitScript(ids=>localStorage.setItem('idle-spiker-onboarding-v1',JSON.stringify(ids)),[...require('fs').readFileSync('onboarding.js','utf8').matchAll(/(?:show|finish)\('([^']+)'/g)].map(m=>m[1]));await p.goto(url);await p.waitForFunction(()=>window.TeamAppearance&&window.CampSystem);await p.evaluate(()=>localStorage.setItem('idle-spiker-profile-v1',JSON.stringify({version:1,name:'Deniz',country:'TR',appearance:TeamAppearance.generate(),music:[]})));await p.reload();await p.locator('#bootScreen').waitFor({state:'detached'});await p.evaluate(()=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());GuidedTutorial.stop();GuidedTutorial.start=()=>false;});


await p.addStyleTag({content:'.achievement-notice{visibility:hidden!important}'});
await p.evaluate(()=>{const r=BalRules.enter(RoomRules.defaults(),1);r.division=3;r.divisionCalendar=2;r.openDepartments=[2,4];r.mediaDepartmentOpen=true;r.ap=r.budget=1e9;r.floors[1]=['assistant','bal_shift'];RoomSystem.loadStage(r);RoomSystem.setAutoClick(()=>{});LeagueSeason.loadStage({mode:'bal',division:3,divisionCalendar:2,startDay:1,results:{}});MenuUI.loadStage({day:1,clicksToday:0});DivisionThree.loadSocial({mediaBlockVersion:3,levels:[0,0,0,0],posts:[],seen:[],likes:[],earnedFollowers:0,sequence:0});DivisionThree.decorate();});
const style=async selector=>p.locator(selector).first().evaluate(e=>{const s=getComputedStyle(e);return Object.fromEntries(['backgroundColor','borderColor','borderWidth','borderRadius','padding','fontSize','fontFamily'].map(k=>[k,s[k]]));});
for(const [i,width] of [320,390,1280,390].entries()){await p.evaluate(d=>document.documentElement.dataset.theme=d,i===3?'dark':'light');
 await p.setViewportSize({width,height:844});
 await p.locator('#roomSlots1 .unlock-room').click();
 await p.mouse.move(0,0);const native=await style('#roomDialog .room-choice'),header=await style('#roomDialog h2');
 await p.locator('#roomDialog .close-dialog').click();
 await p.locator('#mediaUnlockButton').click();
 await p.mouse.move(0,0);assert.deepEqual(await style('#mediaBlockPicker .room-choice'),native);assert.deepEqual(await style('#mediaBlockPicker h2'),header);
 assert.equal(await p.locator('#mediaBlockPicker .room-choice').count(),3);
 assert.equal(await p.locator('#mediaBlockPicker .room-choice .slot-icon svg').count(),3);
 assert(await p.locator('#mediaBlockPicker').evaluate(e=>e.scrollWidth<=e.clientWidth));
 if(i===1)await p.locator('#mediaBlockPicker').screenshot({path:'audits/media-picker-standard.png'});
 await p.locator('#mediaBlockPicker .close-dialog').click();
 assert.equal(await p.evaluate(()=>document.activeElement.id),'mediaUnlockButton');
}
await p.evaluate(()=>document.documentElement.dataset.theme='light');await p.evaluate(()=>{const s=RoomSystem.snapshot();s.budget=1500;RoomSystem.loadStage(s);DivisionThree.decorate();});
await p.locator('#mediaUnlockButton').click();assert.equal(await p.locator('#mediaBlockPicker .room-choice:enabled').count(),1);await p.locator('#mediaBlockPicker .room-choice:enabled').click();assert.deepEqual(await p.evaluate(()=>DivisionThree.socialLevels()),[0,1,0,0]);
await p.evaluate(()=>{const s=RoomSystem.snapshot();s.budget=1e9;for(const [id,n]of [['bal_talent',1],['bal_coach',1],['pro_coordinator',1],['bal_shift',6]]){const r=RoomRules.catalog.find(r=>r.id===id);s.floors[r.floor]=s.floors[r.floor].filter(x=>x!==id).concat(Array(n).fill(id));}RoomSystem.loadStage(s);});
await p.locator('[data-id="pro_coordinator"]').screenshot({path:'audits/block-description-rates.png'});for(const width of [320,390,480]){await p.setViewportSize({width,height:844});for(const id of ['bal_talent','bal_coach','pro_coordinator']){const el=p.locator('[data-id="'+id+'"] .block-main-effect');assert(await el.evaluate(e=>!e.checkVisibility({checkVisibilityCSS:true})||e.scrollHeight<=e.clientHeight+1),id+' at '+width+': '+await el.textContent());}}
await p.setViewportSize({width:390,height:844});await p.evaluate(()=>{const s=RoomSystem.snapshot();s.division=2;RoomSystem.loadStage(s);});await p.locator('[data-id="bal_talent"]').screenshot({path:'audits/block-exact-chances.png'});
for(const division of [2,3]){await p.evaluate(division=>{const s=RoomSystem.snapshot();s.division=division;for(const [id,n]of [['bal_personal',1],['bal_contacts',6],['bal_shift',6],['bal_video',6],['pro_search',1],['pro_scout',1],['pro_coach',6]]){const r=RoomRules.catalog.find(r=>r.id===id);s.floors[r.floor]=s.floors[r.floor].filter(x=>x!==id).concat(Array(n).fill(id));}RoomSystem.loadStage(s);},division);for(const width of [320,390]){await p.setViewportSize({width,height:844});for(const id of division===2?['bal_personal','bal_contacts','bal_shift','bal_video']:['pro_search','pro_scout','pro_coach']){const el=p.locator('[data-id="'+id+'"]');for(const selector of ['.block-main-effect','.block-bonus-panel']){const part=el.locator(selector);if(await part.count())assert(await part.evaluate(e=>e.scrollHeight<=e.clientHeight+1),id+' '+selector+' '+width);}}}}
assert.deepEqual(errors,[]);console.log('PASS picker style and SVG parity, three widths, focus, price gating and purchase; exact chance/rate cards fit on mobile.');
}finally{await b.close()}})().catch(e=>{console.error(e);process.exitCode=1});
