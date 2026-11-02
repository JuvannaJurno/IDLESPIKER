const assert=require('assert/strict'),fs=require('fs'),path=require('path'),{pathToFileURL}=require('url');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const page=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{localStorage.setItem('idle-spiker-language-v1','tr');localStorage.setItem('idle-spiker-bench-introductions-v1',JSON.stringify(['reserve:setter','reserve:outside','reserve:opposite','reserve:middle','reserve:libero']));});
  await page.goto(pathToFileURL(path.resolve('index.html')).href);await page.waitForFunction(()=>window.TeamAppearance&&window.Scouting);
  await page.evaluate(()=>localStorage.setItem('idle-spiker-profile-v1',JSON.stringify({version:1,name:'Deniz',country:'TR',appearance:TeamAppearance.generate(),music:[]})));
  await page.reload();await page.locator('#bootScreen').waitFor({state:'detached'});
  async function pause(){await page.evaluate(()=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());GuidedTutorial.stop();GuidedTutorial.start=()=>false;RoomSystem.setAutoClick(()=>{});});}
  await pause();
  async function seed(division,levels=[0,0,0,0],order){await page.evaluate(({division,levels,order})=>{
   const s=BalRules.enter(RoomRules.defaults(),1);s.division=division;s.divisionCalendar=2;s.openDepartments=[2,4];s.mediaDepartmentOpen=true;s.budget=1e8;s.scouting.tutorialSeen=true;
   RoomSystem.loadStage(s);const league=LeagueRules.normalize({mode:'bal',division,divisionCalendar:2,startDay:1,results:{}});LeagueSeason.loadStage(league);localStorage.setItem('idle-spiker-league-v1',JSON.stringify(league));MenuUI.loadStage({day:1,clicksToday:0});
   DivisionThree.loadSocial({mediaBlockVersion:3,levels,mediaBlockOrder:order,posts:[],seen:[],likes:[],sequence:0,earnedFollowers:0});DivisionThree.decorate();document.querySelector('.mobile-nav a[href="#clubPanel"]').click();
  },{division,levels,order});}
  async function state(){return page.locator('#roomSlots4').evaluate(host=>({order:[...host.children].map(e=>e.dataset.id||e.id),blocks:[...host.querySelectorAll('.social-block')].map(e=>({id:e.dataset.id,x:e.getBoundingClientRect().x,width:e.getBoundingClientRect().width})),plus:host.querySelector('.media-unlock')?.getBoundingClientRect().x}));}
  async function check(expected){const s=await state();assert.deepEqual(s.order,expected);if(s.plus!==undefined)assert(s.blocks.every(b=>b.x+b.width<=s.plus),'new-slot button must follow every purchased block');}
  async function buy(id){await page.locator('#mediaUnlockButton').click();const before=await page.evaluate(()=>RoomSystem.cashBalance()),cost=await page.evaluate(id=>SocialStudioRules.blockPrice(id,0),id);await page.locator('#mediaBlockPicker [data-block="media-'+id+'"]').click();assert.equal(await page.evaluate(()=>RoomSystem.cashBalance()),before-cost);assert.equal(await page.locator('#mediaBlockPicker').evaluate(d=>d.open),false);}
  for(const division of [3,4]){
   await seed(division);await check(['mediaUnlockButton']);await buy(2);
   await check(['media-2','mediaUnlockButton']);
   await buy(0);await check(['media-2','media-0','mediaUnlockButton']);
   await page.evaluate(()=>{RoomSystem.loadStage(RoomSystem.snapshot());DivisionThree.decorate();});await check(['media-2','media-0','mediaUnlockButton']);
   for(const width of [320,390,1280]){await page.setViewportSize({width,height:844});await check(['media-2','media-0','mediaUnlockButton']);}
   await page.evaluate(()=>{localStorage.setItem('idle-spiker-rooms-v2',JSON.stringify(RoomSystem.snapshot()));});await page.reload();await page.locator('#bootScreen').waitFor({state:'detached'});await pause();await page.locator('#roomSlots4 .social-block').first().waitFor();await check(['media-2','media-0','mediaUnlockButton']);
   await page.setViewportSize({width:390,height:844});await page.locator('#roomSlots4 [data-id="media-2"]').scrollIntoViewIfNeeded();await page.evaluate(()=>document.querySelector('.building-scroll').scrollLeft=0);
   const png=await page.screenshot();fs.writeFileSync('audits/media-placement-stage-'+division+'.png',png);
   await buy(1);await check(['media-2','media-0','media-1']);await page.waitForTimeout(2700);await check(['media-2','media-0','media-1']);
  }
  await seed(3,[2,3,1,0],[2,2,-1,'0',99]);await check(['media-2','media-0','media-1']);
  await seed(3,[1,1,0,0]);await check(['media-0','media-1','mediaUnlockButton']);
  assert.deepEqual(errors,[]);console.log('PASS media purchases fill the next slot, plus stays last and disappears when full; purchase order survives rerender/reload; stages 3/4 and 320/390/1280; legacy/invalid order recovery; exact prices');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
