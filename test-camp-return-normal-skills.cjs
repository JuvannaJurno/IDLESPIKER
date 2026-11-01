const assert=require('assert/strict'),fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
const Room=require('./room-rules'),Bal=require('./bal-rules'),Team=require('./team-rules'),Skills=require('./player-skills');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
const url=pathToFileURL(path.resolve('index.html')).href,setup=await browser.newPage();await setup.goto(url);await setup.waitForFunction(()=>window.TeamAppearance);
const profile=await setup.evaluate(()=>({version:1,name:'Deniz',country:'TR',appearance:TeamAppearance.generate(),music:[]}));await setup.close();
for(const after of [1,2,8]){
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const roster=Team.generate();for(const p of roster){p.legendaryTalent=true;Skills.ensure(p);}const room=Bal.enter(Room.defaults(),1);room.division=3;room.divisionCalendar=2;room.ap=room.budget=1e9;
 room.camp.announcedDay=1;room.camp.opensDay=1;room.camp.lastDay=1;room.camp.boosts[roster[0].id]=(after-1)*30;
 const unlocked=roster.flatMap(p=>Skills.view(p,{division:3,state:room}).filter(s=>s.unlockCamp>0&&s.unlocked).map(s=>p.id+'|'+s.id));
 const target=Skills.view(roster[0],{division:3,state:{...room,camp:{...room.camp,boosts:{[roster[0].id]:after*30}}}}).find(s=>s.unlockCamp===after&&s.rarity!=='Legendary');assert(target);
 room.camp.entries.push({playerId:roster[0].id,startDay:1,endDay:4,targetBoost:after*30,status:'running'});
 await page.addInitScript(({profile,roster,room,unlocked})=>{if(sessionStorage.getItem('normal-camp-seeded'))return;sessionStorage.setItem('normal-camp-seeded','1');localStorage.setItem('idle-spiker-language-v1','tr');localStorage.setItem('idle-spiker-profile-v1',JSON.stringify(profile));localStorage.setItem('idle-spiker-women-v1',JSON.stringify(roster));localStorage.setItem('idle-spiker-rooms-v2',JSON.stringify(room));localStorage.setItem('idle-spiker-main-menu-v1',JSON.stringify({day:1,clicksToday:0}));localStorage.setItem('idle-spiker-league-v1',JSON.stringify({mode:'bal',division:3,divisionCalendar:2,startDay:1,results:{}}));localStorage.setItem('idle-spiker-camp-returns-v1',JSON.stringify({version:2,seen:[],unlocked,pending:[]}));localStorage.setItem('idle-spiker-camp-tour-v1','done');},{profile,roster,room,unlocked});
 await page.goto(url);await page.locator('#bootScreen').waitFor({state:'detached'});
 await page.evaluate(()=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());GuidedTutorial.stop();GuidedTutorial.start=()=>false;RoomSystem.setAutoClick(()=>{});CampSystem.advance(4);});
 await page.locator('#campReturnDialog[open]').waitFor();
 assert((await page.locator('#campReturnDialog .return-skill-ready').allTextContents()).some(s=>s.includes(target.name)),target.name+' shown on star return');
 assert.equal(await page.locator('#campReturnDialog .return-skill-reveal').count(),0,'normal skills do not require a Legendary reveal');
 assert(await page.locator('#campReturnDialog .return-continue').isEnabled());
 if(after===2)await page.locator('#campReturnDialog').screenshot({path:'audits/camp-normal-skill-return.png'});
 await page.locator('#campReturnDialog .return-continue').click();await page.reload();await page.locator('#bootScreen').waitFor({state:'detached'});await page.waitForTimeout(600);
 assert.equal(await page.locator('#campReturnDialog[open]').count(),0,'acknowledged return does not repeat');assert.deepEqual(errors,[]);
 console.log('PASS camp '+after+' '+target.rarity+' skill shown once: '+target.name);await context.close();
}
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
