const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
const root=path.resolve(__dirname,'..');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 try{
  const first=await browser.newPage({viewport:{width:390,height:844}});
  await first.goto(pathToFileURL(path.join(root,'index.html')).href);
  await first.locator('#languageChoice [data-language="en"]').click();
  assert.equal(await first.locator('html').getAttribute('lang'),'en');
  await first.reload();assert.equal(await first.locator('#languageChoice').count(),0);await first.close();
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'});
  const p=await context.newPage(),errors=[],findings=[];
  p.on('pageerror',e=>errors.push(e.message));
  await p.addInitScript(()=>{localStorage.setItem('idle-spiker-language-v1','en');let seed=0x51a7;Math.random=()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296;};});
  await p.goto(pathToFileURL(path.join(root,'index.html')).href);
  await p.waitForFunction(()=>window.TeamAppearance&&window.RoomSystem&&window.CampSystem);
  await p.evaluate(()=>localStorage.setItem('idle-spiker-profile-v1',JSON.stringify({version:1,name:'Deniz',country:'TR',appearance:TeamAppearance.generate(),music:[]})));
  await p.reload();await p.locator('#bootScreen').waitFor({state:'detached'});
  await p.evaluate(()=>{GuidedTutorial.stop();window.testStartGuide=GuidedTutorial.start;GuidedTutorial.start=()=>false;document.querySelectorAll('dialog[open]').forEach(d=>d.close());});
  // Test actual inserted inputs: the old observer skipped their attributes entirely.
  const players=await p.evaluate(()=>JSON.stringify(TeamRules.players));
  await p.evaluate(()=>{const input=document.createElement('input');input.id='englishInput';input.placeholder='Ad veya soyad';input.setAttribute('aria-label','Oyuncu ara');document.body.append(input);const image=document.createElement('img');image.id='englishImage';image.alt='Sarı voleybol topu';document.body.append(image);});
  await p.waitForFunction(()=>document.querySelector('#englishInput').placeholder==='First or last name');
  assert.equal(await p.locator('#englishInput').getAttribute('aria-label'),'Search players');
  assert.equal(await p.locator('#englishImage').getAttribute('alt'),'Yellow volleyball');
  assert.equal(await p.evaluate(()=>NumberUI.exact(1234.5)),'1,234.5');
  const phrases=await p.evaluate(()=>[
   GameLanguage.text('Kritik AP şansı: %5 → %15. Kritik talimat 3 kat AP verir.'),
   GameLanguage.text('Her 5 ücretli kart yükseltmesinde +1200 bütçe.'),
   GameLanguage.text('Üçüncü hat ana hattın 3/5 kapasitesinde düzenli çalışır.'),
   GameLanguage.text('Melis Arıgöl, Fang Song için pası kaldırıyor.'),
   GameLanguage.text('Teknik Ekip bölümündeki Gözlemci bloğunu geliştirerek açabilirsin.'),
   GameLanguage.text('Deniz kartını yükseltmek için 830 AP daha biriktir. Rakibin servislerine karşı manşetimizi güçlendirir.')
  ]);
  assert.equal(phrases[0],'Critical AP chance: 5% → 15%. Critical instructions earn 3× AP.');
  assert.equal(phrases[1],'Every 5 paid card upgrades earn 1200 budget.');
  assert.equal(phrases[2],'The third line runs at 3/5 of the main line’s capacity.');
  assert.equal(phrases[3],'Melis Arıgöl sets for Fang Song.');
  assert(!/[çğıöşüİ]/.test(phrases[4]),phrases[4]);
  assert(phrases[5].includes('Deniz needs 830 more AP'),phrases[5]);
  for(let i=0;i<3;i++){
   await p.evaluate(()=>document.getElementById('settingsDialog').showModal());
   await p.locator('#languageSelect').selectOption('tr');
   assert.equal(await p.locator('#englishInput').getAttribute('placeholder'),'Ad veya soyad');
   assert.equal(await p.evaluate(()=>NumberUI.exact(1234.5)),'1.234,5');
   await p.locator('#languageSelect').selectOption('en');
   assert.equal(await p.locator('#englishInput').getAttribute('placeholder'),'First or last name');
   await p.locator('#closeSettings').click();
  }
  assert.equal(await p.evaluate(()=>JSON.stringify(TeamRules.players)),players);
  await p.evaluate(()=>document.querySelectorAll('#englishInput,#englishImage').forEach(e=>e.remove()));
  const coverage=await p.evaluate(()=>{
   const values=new Set();
   for(const division of [1,2,3,4]){
    const state=division===1?RoomRules.defaults():BalRules.enter(RoomRules.defaults(),1);state.division=division;
    for(const room of RoomRules.catalog){values.add(room.name);if(room.bonus)values.add(room.bonus[2]);
     for(let level=1;level<=room.values.length;level++){
      values.add(room.bal?BalRules.describePrimary(state,room,level):division===1?room.describe(room.values[level-1]):FoundationBlocks.describe(room,level,state));
      if(room.bonus&&level>=6)values.add(BalRules.describeBonus(state,room,level));
     }
    }
   }
   for(const skill of PlayerSkills.catalog){values.add(skill.name);values.add(skill.description);}
   return {count:values.size,missing:[...values].filter(s=>/[çğıöşüİ]/.test(GameLanguage.text(s)))};
  });
  assert.deepEqual(coverage.missing,[]);
  async function scan(label){
   await p.evaluate(()=>GameLanguage.refresh());
   const texts=await p.evaluate(()=>{
    const names=new Set(TeamRules.players.flatMap(x=>[x.name,x.surname,x.name+' '+x.surname]).concat(LeagueRules.teams,['Türkiye'],RoomSystem.scoutView().scouting.catalog.map(c=>c.player.name+' '+c.player.surname),[...document.querySelectorAll('.social-post header strong,.match-advice-photo figcaption strong')].map(e=>e.textContent.trim())));
    const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),out=[];let n;
    while(n=w.nextNode()){const el=n.parentElement,t=n.data.trim();if(!t||!el.checkVisibility()||el.closest('script,style,svg,[data-no-translate],.card-name,.lineup-preview-player strong,#playerName,#firstName,#lastName')||names.has(t))continue;let copy=t;for(const name of [...names].sort((a,b)=>b.length-a.length))copy=copy.replaceAll(name,'');if(/[çğıöşüÇĞİÖŞÜ]|\b(Senin|yetenekler|talimat|oyuncu|seviye|kazan|kart|devam)\b/i.test(copy))out.push(t);}
    return [...new Set(out)];
   });findings.push({label,remaining:texts});
  }
  for(const division of [1,2,3,4]){
   await p.evaluate(division=>{
    document.querySelectorAll('dialog[open]').forEach(d=>d.close());
    const s=division===1?RoomRules.defaults():BalRules.enter(RoomRules.defaults(),1);s.division=division;s.divisionCalendar=division>=3?2:1;s.ap=s.budget=1e8;s.openDepartments=[2,4];s.mediaDepartmentOpen=division>=3;
    for(const room of RoomRules.catalog){const stage=room.division||(room.bal?2:1);if(stage<=division){const level=Math.min(6,room.values.length);s.floors[room.floor].push(...Array(level).fill(room.id));}}
    RoomSystem.loadStage(s);RoomSystem.setAutoClick(()=>{});
    LeagueSeason.loadStage({mode:division===1?undefined:'bal',division,divisionCalendar:s.divisionCalendar,startDay:1,results:{}});
    MenuUI.loadStage({day:1,clicksToday:0});
    document.body.classList.toggle('bal-stage',division>1);
    if(division>=3){DivisionThree.loadSocial({mediaBlockVersion:3,levels:[5,6,5,0],posts:[],seen:[],likes:[],earnedFollowers:500,sequence:0});DivisionThree.decorate();}
    TeamView.refresh();
   },division);
   for(const tab of ['club','teamTab','calendarTab',...(division>=3?['socialTab']:[])]){
    await p.evaluate(tab=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());(tab==='club'?document.querySelector('.mobile-nav a[href="#clubPanel"]'):document.getElementById(tab)).click();},tab);
    await p.waitForTimeout(180);await scan('stage-'+division+'-'+tab);
    if(division===3&&tab==='teamTab')await p.screenshot({path:path.join(root,'audits/english-team-mobile.png')});
   }
   await p.evaluate(()=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());document.querySelector('.mobile-nav a[href="#clubPanel"]').click();});
   if(division===3){
    assert((await p.locator('[data-id="pro_coordinator"] .block-effect-value').first().innerText()).includes('16.8'));
    for(const width of [320,390,480,1280]){await p.setViewportSize({width,height:844});const overflow=await p.locator('.purchased-room .block-main-effect,.purchased-room .block-bonus-panel').evaluateAll(nodes=>nodes.filter(e=>e.checkVisibility()&&(e.scrollWidth>e.clientWidth+1||e.scrollHeight>e.clientHeight+1)).map(e=>e.textContent));assert.deepEqual(overflow,[],width+'px English card overflow');}
    await p.setViewportSize({width:390,height:844});await p.locator('[data-id="pro_coordinator"]').screenshot({path:path.join(root,'audits/english-block-mobile.png')});
   }
  }
  await p.evaluate(()=>{const s=RoomSystem.snapshot();s.camp.announcedDay=1;RoomSystem.loadStage(s);for(const player of TeamRules.players.slice(0,3))player.cardLevel=TeamRules.cardLimit(player);CampSystem.open(true);});await scan('camp');
  assert(await p.locator('#campDialog').evaluate(e=>e.open));
  assert(await p.locator('#campPanel').isVisible());
  await p.locator('#campDialog').screenshot({path:path.join(root,'audits/english-camp-mobile.png')});
  await p.evaluate(()=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());RoomSystem.scoutReport();Scouting.open();});await scan('transfer-home');
  await p.locator('#homeNewCatalog').click();await p.locator('#packNext').click();await scan('transfer-card');
  await p.locator('#packSkip').click();await scan('transfer-catalog');
  await p.locator('#scoutCatalog .scout-compare').first().click();await scan('transfer-comparison');
  await p.locator('#transferCompareScreen').screenshot({path:path.join(root,'audits/english-comparison-mobile.png')});
  await p.evaluate(()=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());PlayerProfile.open();});await scan('profile');
  await p.evaluate(()=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());document.getElementById('settingsButton').click();});await scan('settings');
  await p.evaluate(()=>document.getElementById('cheatDrawer').open=true);await scan('cheats');
  await p.setViewportSize({width:320,height:740});
  assert(await p.locator('#settingsDialog').evaluate(e=>e.scrollWidth<=e.clientWidth+1));
  await p.evaluate(()=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());document.querySelector('.mobile-nav a[href="#clubPanel"]').click();testStartGuide([{id:'english-test-step',target:()=>document.getElementById('energyButton'),text:'[[Talimat ver]] düğmesine dokun. Talimatın Gelir Merkezi’ne gidişini izleyelim.',allowNext:true}],null,'english-test',{review:true});});
  await p.waitForFunction(()=>document.querySelector('#learningHint').textContent.includes('Tap Send instruction'));
  assert.equal(await p.locator('#learningHint .tutorial-button-name').innerText(),'Send instruction');
  await p.evaluate(()=>GameLanguage.set('tr'));
  assert((await p.locator('#learningHint').innerText()).includes('düğmesine dokun'));
  await p.evaluate(()=>{GameLanguage.set('en');GuidedTutorial.stop();});
  const frame=await p.context().newPage();await frame.goto(pathToFileURL(path.join(root,'mac.html')).href);
  await frame.waitForFunction(()=>window.GameLanguage?.current==='en');
  assert.equal(await frame.locator('html').getAttribute('lang'),'en');await frame.close();
  fs.writeFileSync(path.join(root,'audits/english-screen-coverage.json'),JSON.stringify({coverage,phrases,findings,errors},null,2));
  assert.deepEqual(findings.filter(f=>f.remaining.length),[],'Untranslated visible UI');
  assert.deepEqual(errors,[]);
  console.log('PASS '+coverage.count+' catalog/skill strings; dynamic input attributes, reversible language changes, numeric parameters, names and '+findings.length+' live screen scans. See audits/english-screen-coverage.json.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1});
