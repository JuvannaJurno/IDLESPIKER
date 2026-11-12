const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
const {pathToFileURL}=require('node:url');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
const root=path.resolve(__dirname,'..');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const p=await browser.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'}),errors=[],metrics=[];
 p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>localStorage.setItem('idle-spiker-language-v1','en'));
 const url=pathToFileURL(path.join(root,'index.html')).href;await p.goto(url);
 await p.waitForFunction(()=>window.TeamAppearance&&window.MatchIntro);
 await p.evaluate(()=>localStorage.setItem('idle-spiker-profile-v1',JSON.stringify({version:1,name:'Deniz',country:'TR',appearance:TeamAppearance.generate(),music:[]})));
 await p.reload();await p.locator('#bootScreen').waitFor({state:'detached'});
 await p.evaluate(()=>{GuidedTutorial.stop();GuidedTutorial.start=()=>false;document.querySelectorAll('dialog[open]').forEach(d=>d.close());RoomSystem.setAutoClick(()=>{});});
 await p.addStyleTag({content:'.achievement-notice{visibility:hidden!important}'});
 assert.equal(await p.evaluate(()=>GameLanguage.text('Deniz Spor')),'Deniz Spor');
 for(const [width,height] of [[320,568],[360,720],[390,844],[412,915],[480,1000],[1280,720]]){
  await p.setViewportSize({width,height});
  await p.evaluate(()=>{MatchIntro.cancel();const fixture=LeagueSeason.progress().next,squad=TeamView.snapshot();squad.opponents=MatchIntro.opponents(fixture);const dialog=document.getElementById('gameMatchDialog');if(!dialog.open)dialog.showModal();MatchIntro.show(squad,fixture,()=>window.introFinished=(window.introFinished||0)+1);});
  await p.waitForFunction(()=>[...document.querySelectorAll('#matchIntro img')].every(i=>i.complete&&i.naturalWidth));
  const m=await p.locator('#matchIntro').evaluate(e=>{const box=n=>{const r=n.getBoundingClientRect();return {top:r.top,bottom:r.bottom,height:r.height}};return {height:e.clientHeight,scroll:e.scrollHeight,team:box(e.querySelector('.intro-team')),cards:box(e.querySelector('.intro-cards')),footer:box(e.querySelector('footer')),bottom:e.getBoundingClientRect().bottom};});
  metrics.push({width,height,...m});assert(m.scroll<=m.height+1,'Intro must not scroll: '+JSON.stringify(m));
  assert(m.cards.top-m.team.bottom<=15,'Empty space before cards');assert(m.footer.top-m.cards.bottom<=20,'Empty space before actions');
  assert(m.footer.bottom<=m.bottom+1,'Actions clipped');
  assert((await p.locator('#matchIntro .intro-versus').innerText()).includes('Our Club'));
  await p.locator('#introNext').click();assert.equal(await p.locator('#introSkip').isVisible(),false);
  if(width===390){await p.waitForTimeout(1100);await p.locator('#matchIntro').screenshot({path:path.join(root,'audits/intro-compact-english.png')});}
  await p.locator('#introNext').click();assert.equal(await p.locator('#matchIntro').isVisible(),false);
 }
 for(const [width,height]of [[320,568],[390,844]]){
  await p.setViewportSize({width,height});
  await p.evaluate(()=>document.querySelectorAll('dialog[open]').forEach(d=>d.close()));await p.waitForTimeout(30);
  await p.evaluate(()=>{RoomSystem.loadStage(BalRules.enter(RoomRules.defaults(),1));LeagueSeason.loadStage({mode:'bal',division:2,startDay:1,results:{}});TeamView.refresh();const f=LeagueSeason.progress().next,s=TeamView.snapshot();const libero=s.players.find(p=>p.role==='libero');if(libero)s.lineup.l=libero.id;s.opponents=MatchIntro.opponents(f);document.getElementById('gameMatchDialog').showModal();MatchIntro.show(s,f,()=>{});});
  assert.equal(await p.locator('#matchIntro .libero-card').count(),1);
  assert(await p.locator('#matchIntro').evaluate(e=>e.scrollHeight<=e.clientHeight+1));
  await p.locator('#introSkip').click();assert.equal(await p.locator('#matchIntro').isVisible(),false);
 }
 await p.evaluate(()=>{document.querySelectorAll('dialog[open]').forEach(d=>d.close());ClubJourney.beginNext();});
 await p.locator('#clubNameInput').fill('Mavi Spor');await p.locator('#clubShortInput').fill('MVS');
 for(const name of ['Spor','Güneş Spor','Antrenman Kampı','Mavi Spor']){await p.locator('#clubNameInput').fill(name);await p.waitForFunction(name=>document.getElementById('clubNamePreview').textContent===name,name);}
 await p.waitForFunction(()=>document.getElementById('clubNamePreview').textContent==='Mavi Spor');
 assert.equal(await p.locator('#clubBadge svg text').textContent(),'MVS');
 await p.evaluate(()=>GameLanguage.set('tr'));assert.equal(await p.locator('#clubNamePreview').innerText(),'Mavi Spor');
 await p.evaluate(()=>GameLanguage.set('en'));assert.equal(await p.locator('#clubNamePreview').innerText(),'Mavi Spor');
 const creatorText=await p.locator('#clubCreator').innerText();
 assert(!/[çğıöşüÇĞİÖŞÜ]/.test(creatorText),'Turkish creator UI remains: '+creatorText);
 for(const label of ['Your colors','Save and enter the league','Show abbreviation on crest'])assert(creatorText.includes(label),label);
 const colorCases=[['#ffffff','#ffffff'],['#202b35','#202b35'],['#ffd05a','#fff4d4'],['#14613f','#ffd05a'],['#787878','#888888']];
 for(const mode of ['soft','contrast'])for(const [primary,accent]of colorCases){
  await p.evaluate(({mode,primary,accent})=>{for(const [id,value]of [['primaryHex',primary],['accentHex',accent]]){const input=document.getElementById(id);input.value=value;input.dispatchEvent(new Event('input',{bubbles:true}));}document.querySelector('[data-choice="patternMode"][data-value="'+mode+'"]').click();},{mode,primary,accent});
  const colors=await p.locator('#clubBadge svg').evaluate(e=>({ink:e.dataset.crestInk,pattern:e.dataset.crestPattern}));
  const lum=c=>{const a=c.slice(1).match(/../g).map(x=>parseInt(x,16)/255).map(n=>n<=.04045?n/12.92:((n+.055)/1.055)**2.4);return a[0]*.2126+a[1]*.7152+a[2]*.0722;};
  const contrast=(a,b)=>(Math.max(lum(a),lum(b))+.05)/(Math.min(lum(a),lum(b))+.05);
  assert(contrast(colors.ink,primary)>=2.5);assert(contrast(colors.ink,colors.pattern)>=2.5);
  assert.equal(await p.locator('#primaryHex').inputValue(),primary,'Do not change chosen colors');
 }
 await p.evaluate(()=>{for(const [id,value]of [['primaryHex','#14613f'],['accentHex','#ffd05a']]){const input=document.getElementById(id);input.value=value;input.dispatchEvent(new Event('input',{bubbles:true}));}document.querySelector('[data-choice="patternMode"][data-value="soft"]').click();});
 await p.locator('#clubShowShort').uncheck();assert.equal(await p.locator('#clubBadge svg text').count(),0);
 assert(await p.locator('#clubShortInput').isDisabled());
 await p.evaluate(()=>{const dialog=document.getElementById('clubJourney');dialog.scrollTop=0;});
 await p.locator('#clubJourney').screenshot({path:path.join(root,'audits/club-creator-english.png')});
 await p.evaluate(()=>{BalTransition.start=async()=>true;document.getElementById('clubCreator').requestSubmit();});
 assert.equal(await p.evaluate(()=>ClubJourney.profile().showShort),false);
 assert.equal(await p.evaluate(()=>ClubJourney.profile().name),'Mavi Spor');
 assert(!(await p.evaluate(()=>decodeURIComponent(ClubJourney.matchBadge(0)))).includes('<text'));
 await p.reload();await p.waitForFunction(()=>window.ClubJourney);assert.equal(await p.evaluate(()=>ClubJourney.profile().showShort),false);
 assert.equal(await p.evaluate(()=>LeagueRules.teams[0]),'Mavi Spor');
 const old=await p.evaluate(()=>{const s=JSON.parse(localStorage.getItem('idle-spiker-club-profile-v1'));delete s.showShort;localStorage.setItem('idle-spiker-club-profile-v1',JSON.stringify(s));return s;});
 await p.reload();await p.waitForFunction(()=>window.ClubJourney);assert.equal(await p.evaluate(()=>ClubJourney.profile().showShort),true,'Legacy crest text stays visible');
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(root,'audits/club-intro-polish.json'),JSON.stringify({metrics,colorCases:colorCases.length*2,legacyName:old.name,errors},null,2));
 console.log('PASS non-scrolling intro at six sizes, compact actions, literal club names, ten crest contrast cases, hidden abbreviation persistence and legacy saves.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
