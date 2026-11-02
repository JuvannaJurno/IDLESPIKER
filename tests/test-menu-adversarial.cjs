const assert=require('assert/strict'),fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'}),errors=[],results=[];
page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>{localStorage.setItem('idle-spiker-language-v1','tr');localStorage.setItem('idle-spiker-onboarding-v1',JSON.stringify(['tap','arrival','blocks-basics','assistant','train','player-stats','match','quick-upgrade']));});
const url=pathToFileURL(path.resolve('index.html')).href;
await page.goto(url);await page.waitForFunction(()=>window.TeamAppearance&&window.Scouting);
await page.evaluate(()=>{window.gameResetting=true;localStorage.setItem('idle-spiker-profile-v1',JSON.stringify({version:1,name:'Deniz',country:'TR',appearance:TeamAppearance.generate(),music:[]}));});
await page.reload();await page.locator('#bootScreen').waitFor({state:'detached'});
await page.evaluate(()=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());GuidedTutorial.stop();window.auditStartGuide=GuidedTutorial.start;GuidedTutorial.start=()=>false;RoomSystem.setAutoClick(()=>{});window.auditArrival=MatchArrival.show;});
async function seed(division){await page.evaluate(division=>{
 document.querySelectorAll('dialog[open]').forEach(d=>d.close());const s=BalRules.enter(RoomRules.defaults(),1);s.division=division;s.divisionCalendar=2;s.openDepartments=[2,4];s.ap=s.budget=1e10;s.mediaDepartmentOpen=division>=3;
 s.floors[2]=['bal_sponsor','bal_sponsor','bal_shop'];
 const player={...TeamRules.players[0],id:'scout-1-0',age:24,academyProspect:false,transferCamps:6};
 s.scouting.catalog=[{id:player.id,player,price:100,hired:false}];
 RoomSystem.loadStage(s);LeagueSeason.loadStage(LeagueRules.normalize({mode:'bal',division,divisionCalendar:2,startDay:1,results:{}}));MenuUI.loadStage({day:1,clicksToday:0});DivisionThree.decorate();
},division);await page.waitForTimeout(100);}
function record(name,data,ok){results.push({name,ok,data});if(!process.env.SCAN_ONLY)assert(ok,name+' '+JSON.stringify(data));}
await seed(3);
// A closed card-opening dialog must never take space in the club page.
await page.evaluate(()=>{Scouting.open();});await page.locator('#homeNewCatalog').click();await page.locator('#packNext').click();
await page.locator('#packCard button.scout-compare').click();await page.locator('#closeTransferCompare').click();await page.locator('#closeScout').click();
await page.locator('.mobile-nav a[href="#clubPanel"]').click();
let data=await page.evaluate(()=>{const d=document.getElementById('scoutDialog');return {open:d.open,display:getComputedStyle(d).display,height:d.getBoundingClientRect().height,bodyWidth:document.documentElement.scrollWidth};});
record('closed pack stays hidden after comparison and club navigation',data,!data.open&&data.display==='none'&&data.height===0);
await page.screenshot({path:'audits/adversarial-closed-pack.png'});
// The same choice family, icon dimensions and no duplicate/closed leaked UI.
await page.evaluate(()=>DivisionThree.loadSocial({mediaBlockVersion:3,levels:[0,0,0,0],posts:[],seen:[],likes:[],sequence:0,earnedFollowers:0}));
await page.locator('#mediaUnlockButton').click();
data=await page.evaluate(()=>{const d=document.getElementById('mediaBlockPicker'),b=d.querySelector('.room-choice'),icon=b.querySelector('.slot-icon'),css=getComputedStyle(icon);return {open:d.open,count:d.querySelectorAll('.room-choice').length,overflow:d.scrollWidth>d.clientWidth+1,icon:{width:icon.getBoundingClientRect().width,height:icon.getBoundingClientRect().height,flexShrink:css.flexShrink},align:getComputedStyle(b).alignItems};});
record('media picker shares square standard icons',data,data.open&&data.count===3&&!data.overflow&&data.icon.width===30&&data.icon.height===30&&data.align==='flex-start');
await page.screenshot({path:'audits/adversarial-media-picker.png'});
await page.locator('#mediaBlockPicker .room-choice').first().click();
record('media purchase closes picker and creates one block',await page.locator('#roomSlots4 .social-block').count(),await page.locator('#roomSlots4 .social-block').count()===1);
await page.locator('#mediaUnlockButton').click();await page.locator('#mediaBlockPicker .room-choice').first().click();
await page.locator('#mediaUnlockButton').click();await page.locator('#mediaBlockPicker .room-choice').first().click();
record('last media purchase removes empty-slot button',await page.locator('#mediaUnlockButton').count(),await page.locator('#mediaUnlockButton').count()===0);
// Income retains actual purchased previous-stage blocks.
await seed(3);
const income=page.locator('.tier[data-floor="2"] .foundation-toggle');
data=await page.evaluate(()=>{const tier=document.querySelector('.tier[data-floor="2"]');return {title:tier.querySelector('h3').textContent,toggle:!!tier.querySelector('.foundation-toggle'),legacy:[...tier.querySelectorAll('.inherited-block-group [data-id]')].map(e=>e.dataset.id)};});
record('income previous-stage drawer exists',data,data.toggle&&data.legacy.includes('bal_sponsor')&&data.legacy.includes('bal_shop'));
if(await income.count()){await income.click();record('income drawer opens',await income.getAttribute('aria-expanded'),await income.getAttribute('aria-expanded')==='true');data=await page.locator('.tier[data-floor="2"] .foundation-drawer').evaluate(d=>({hidden:d.hidden,inert:d.inert,open:d.dataset.open,width:d.getBoundingClientRect().width,cards:[...d.querySelectorAll('[data-id]')].map(e=>({id:e.dataset.id,width:e.getBoundingClientRect().width,x:e.getBoundingClientRect().x}))}));record('income previous-stage cards expand to readable widths',data,!data.hidden&&!data.inert&&data.open==='true'&&data.width>300);await page.evaluate(()=>window.scrollBy({top:document.querySelector('.tier[data-floor="2"]').getBoundingClientRect().top-140,behavior:'instant'}));await page.screenshot({path:'audits/adversarial-income-history.png'});}
// Repeated mobile navigation, back/close, scrolling and theme changes.
for(const theme of ['light','dark'])for(const width of [320,390,480]){
 await page.setViewportSize({width,height:844});await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);
 await page.locator('#teamTab').click();await page.evaluate(()=>Scouting.open());await page.locator('#homeNewCatalog').click();await page.locator('#packNext').click();
 await page.locator('#packCard button.scout-compare').click();await page.evaluate(()=>document.getElementById('transferCompareScreen').scrollTop=400);
 await page.locator('#closeTransferCompare').click();await page.locator('#closeScout').click();await page.locator('.mobile-nav a[href="#clubPanel"]').click();
 await page.evaluate(()=>window.scrollTo(0,document.body.scrollHeight));
 await page.locator('#settingsButton').click();await page.evaluate(()=>document.getElementById('settingsDialog').scrollTop=500);await page.locator('#closeSettings').click();
 await page.locator('#socialTab').click();await page.locator('#teamTab').click();await page.locator('.mobile-nav a[href="#leaguePanel"]').click();await page.locator('.mobile-nav a[href="#clubPanel"]').click();
 await page.evaluate(()=>{DivisionThree.loadSocial({mediaBlockVersion:3,levels:[0,0,0,0],posts:[],seen:[],likes:[],sequence:0,earnedFollowers:0});DivisionThree.decorate();});
 await page.locator('#mediaUnlockButton').click();
 const media=await page.locator('#mediaBlockPicker').evaluate(d=>({overflow:d.scrollWidth>d.clientWidth+1,icons:[...d.querySelectorAll('.room-choice>.slot-icon')].map(e=>[e.offsetWidth,e.offsetHeight])}));
 record('media choice layout '+theme+' '+width,media,!media.overflow&&media.icons.every(([w,h])=>w===30&&h===30));
 if(width===390)await page.screenshot({path:'audits/adversarial-media-picker-'+theme+'.png'});
 await page.locator('#mediaBlockPicker .close-dialog').click();
 data=await page.evaluate(()=>({leaked:[...document.querySelectorAll('dialog:not([open])')].filter(d=>d.getClientRects().length).map(d=>d.id),overflow:document.documentElement.scrollWidth>innerWidth+1,open:[...document.querySelectorAll('dialog[open]')].map(d=>d.id),club:!document.querySelector('.dashboard').hidden}));
 record('navigation stress '+theme+' '+width,data,!data.leaked.length&&!data.overflow&&!data.open.length&&data.club);
}
await page.setViewportSize({width:390,height:844});await page.evaluate(()=>document.documentElement.dataset.theme='light');
// A pending match must wait for an active tutorial, including simple opening hints.
await seed(2);
await page.evaluate(()=>{GuidedTutorial.start=auditStartGuide;window.auditGuideDone=false;GuidedTutorial.start([{id:'audit-wait',target:()=>document.getElementById('energyButton'),text:'Devam ederek sürdür.',allowNext:true}],()=>window.auditGuideDone=true,'audit-tutorial',{review:true});});
await page.locator('#learningHint:visible').waitFor();
data=await page.evaluate(()=>{const fixture=LeagueRules.schedule().find(f=>f.ours);localStorage.setItem('idle-spiker-main-menu-v1',JSON.stringify({day:fixture.day,clicksToday:MenuState.dayLimit()}));localStorage.removeItem('idle-spiker-match-arrival-seen-v1');const realShow=auditArrival;return {active:GuidedTutorial.active,blocked:realShow(),arrival:document.getElementById('matchArrival').open};});
record('match arrival waits for guided tutorial',data,data.active&&!data.arrival);
await page.evaluate(()=>{window.auditBlockedClicks=0;const button=document.createElement('button');button.id='auditDarkButton';button.style.cssText='position:fixed;left:0;top:0;width:12px;height:12px';button.onclick=()=>auditBlockedClicks++;document.body.append(button);button.click();button.remove();});
record('tutorial still blocks unrelated controls',await page.evaluate(()=>auditBlockedClicks),await page.evaluate(()=>auditBlockedClicks)===0);
await page.locator('#learningHint .learning-dismiss').click();
await page.evaluate(()=>{GuidedTutorial.stop();GuidedTutorial.start=()=>false;});
record('tutorial remains dismissible',await page.evaluate(()=>auditGuideDone),await page.evaluate(()=>auditGuideDone));
data=await page.evaluate(()=>{const hint=document.getElementById('learningHint');hint.hidden=false;return {guided:GuidedTutorial.active,shown:auditArrival(),arrival:document.getElementById('matchArrival').open};});
record('match arrival also waits for simple non-guided hint',data,!data.guided&&!data.arrival&&!data.shown);
// Simulate a dialog opening in the same event turn as a spotlight, before polling can clear it.
await page.evaluate(()=>{document.getElementById('learningHint').hidden=false;document.getElementById('learningSpotlight').removeAttribute('hidden');localStorage.setItem('idle-spiker-match-arrival-seen-v1',LeagueSeason.dueFixture(JSON.parse(localStorage.getItem('idle-spiker-main-menu-v1'))).id);document.getElementById('matchArrival').showModal();});
await page.locator('#arrivalLater').click();
data=await page.locator('#matchArrival').evaluate(d=>d.open);record('unexpected modal cannot deadlock behind old spotlight',data,!data);
record('no runtime errors',errors,errors.length===0);
fs.writeFileSync('audits/adversarial-menu-results.json',JSON.stringify(results,null,2));console.log(JSON.stringify(results,null,2));
}finally{await browser.close()}})().catch(e=>{console.error(e);process.exitCode=1});
