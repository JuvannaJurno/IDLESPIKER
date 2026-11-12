const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
const root=path.resolve(__dirname,'..');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),errors=[],samples=[];
 await context.addInitScript(()=>localStorage.setItem('idle-spiker-language-v1','en'));
 const p=await context.newPage();p.on('pageerror',e=>errors.push(e.message));
 await p.goto(pathToFileURL(path.join(root,'index.html')).href);await p.waitForFunction(()=>window.TeamAppearance&&window.TeamView);
 await p.evaluate(()=>localStorage.setItem('idle-spiker-profile-v1',JSON.stringify({version:1,name:'Deniz',country:'TR',appearance:TeamAppearance.generate(),music:[]})));
 await p.reload();await p.locator('#bootScreen').waitFor({state:'detached'});
 await p.evaluate(()=>{GuidedTutorial.stop();GuidedTutorial.start=()=>false;document.querySelectorAll('dialog[open]').forEach(d=>d.close());});
 await p.waitForFunction(()=>document.getElementById('tutorialChoice').open);await p.locator('[data-tutorial="no"]').click();
 await p.locator('#energyButton').click({clickCount:4,delay:35});
 await p.waitForFunction(()=>document.getElementById('tapRhythm').textContent.includes('NICE RHYTHM!'));
 assert.equal(await p.locator('#tapRhythm').innerText(),'NICE RHYTHM! · 4 INSTRUCTIONS');
 await p.evaluate(()=>GameLanguage.set('tr'));assert.equal(await p.locator('#tapRhythm').innerText(),'GÜZEL TEMPO! · 4 TALİMAT');
 await p.evaluate(()=>GameLanguage.set('en'));
 const squad=await p.evaluate(()=>{
  const f=LeagueSeason.progress().next,s=TeamView.snapshot();s.opponents=MatchIntro.opponents(f);
  for(const person of [...s.players,...s.opponents])person.servePortrait=TeamAppearance.playerPortrait(person);
  s.matchInfo={names:['Güneş Spor','Mavi Spor'],badges:[ClubJourney.matchBadge(0),ClubJourney.matchBadge(f.home===0?f.away:f.home)],league:LeagueRules.config.name,division:1,stage:'prologue',round:1,colors:[{primary:'#527d70',accent:'#f6d58b'},{primary:'#698faa',accent:'#ead7a3'}]};return s;
 });
 const m=await context.newPage();m.on('pageerror',e=>errors.push(e.message));await m.goto(pathToFileURL(path.join(root,'mac.html')).href);
 await m.waitForFunction(()=>ready&&window.MatchServer);
 await m.evaluate(squad=>{window.testSquadReady=false;window.addEventListener('message',e=>{if(e.data?.type==='spiker-match'&&e.data.action==='squad-ready')window.testSquadReady=true;});window.dispatchEvent(new MessageEvent('message',{source:parent,data:{type:'spiker-match',action:'squad',squad,deferStart:true}}));},squad);
 await m.waitForFunction(()=>window.testSquadReady&&players.every(p=>p.roster?.servePortrait));
 await m.waitForFunction(()=>paused===true);
 const expectedSkills=Object.fromEntries(`commit-block|Early Block
cross|Cross-court Spike
tempo-third|Third-tempo Attack
slide-attack|Slide Attack
power-hit|Power Hit
rebound|Block Rebound
read|Read Block
float|Float Serve
line|Line Spike
back|Back Set
cover|Attack Coverage
tempo-second|Second-tempo Attack
wipe|Tooling the Block
roof|Penetration Block
close|Double Block
triple-block|Triple Block
jump|Jump Serve
dive|Dive
deceive|Set Feint
sync-attack|Combination Attack
tempo-first|First-tempo Attack
tempo-minus|Minus Tempo
absolute-read|Perfect Attack Read
jump-legendary|Lightning Jump Serve
jump-float-legendary|Jump Float
perfect-second-touch|Difficult Ball Set
one-hand-rescue|One-handed Set
pancake|Pancake
ghost-tip|Ghost Tip
court-read|Court Reading
sky-serve|Underhand Serve
fake-set|Setter Deception
court-vision|Court Vision
team-heart|Heart of the Team
pipe-attack|Pipe Attack
setter-dump|Setter Dump
kick-save|Foot Save
sky-ball-serve|Sky Ball Serve`.split('\n').map(line=>line.split('|')));
 const skillNames=await m.evaluate(()=>PlayerSkills.catalog.map(s=>({id:s.id,name:GameLanguage.text(s.name)})));
 for(const skill of skillNames)assert.equal(skill.name,expectedSkills[skill.id],skill.id);
 const states=[['wait',null,null,'SERVING'],['flight','serve',1,'SERVING'],['flight','block',1,'BLOCKING'],['flight','attack',1,'SPIKING'],['flight','pass',2,'RECEIVING'],['flight','pass',3,'SETTING'],['flight','pass',1,'PLAYING THE BALL']];
 for(const [state,kind,touch,expected]of states){
  await m.evaluate(({state,kind,touch})=>{reset();paused=true;ball={state,kind,touch,attacker:players[0],timer:100};MatchServer.refresh();},{state,kind,touch});
  await m.waitForFunction(expected=>document.querySelector('#serveTeam .server-label')?.textContent===expected,expected);
  samples.push({state,kind,touch,label:await m.locator('#serveTeam .server-label').innerText()});
 }
 await m.evaluate(()=>{GameLanguage.set('tr');});assert.equal(await m.locator('#serveTeam .server-label').innerText(),'TOPU OYNUYOR');
 await m.evaluate(()=>GameLanguage.set('en'));assert.equal(await m.locator('#serveTeam .server-label').innerText(),'PLAYING THE BALL');
 for(const [kind,expected]of [['serve','SERVING'],['attack','SPIKING'],['block','BLOCKING'],['set','SETTING'],['receive','RECEIVING'],['defense','RECEIVING'],['support','SUPPORTING THE TEAM']]){
  await m.evaluate(kind=>{reset();paused=true;window.dispatchEvent(new CustomEvent('spiker-skill-used',{detail:{actor:players[0].index,kind,name:MatchSkills.catalog.find(s=>s.id==='tempo-minus').name,rarity:'Legendary'}}));},kind);
  await m.waitForFunction(expected=>document.querySelector('#serveTeam .server-label')?.textContent===expected,expected);
  assert.equal(await m.locator('#serveTeam .server-skill strong').innerText(),'Minus Tempo');
 }
 for(const id of await m.evaluate(()=>MatchSkills.catalog.map(s=>s.id))){
  await m.evaluate(id=>{reset();paused=true;const skill=MatchSkills.catalog.find(s=>s.id===id);window.dispatchEvent(new CustomEvent('spiker-skill-used',{detail:{actor:players[0].index,kind:'attack',name:skill.name,rarity:skill.rarity}}));},id);
  await m.waitForFunction(name=>document.querySelector('#serveTeam .server-skill strong')?.textContent===name,expectedSkills[id]);
 }
 for(const [event,winner,expected]of [['kill',0,'POINT! · SPIKE POINT'],['ace',0,'POINT! · ACE'],['serve-error',1,'POINT! · TEAM ERROR'],['attack-error',1,'POINT! · TEAM ERROR'],['receive-error',0,'POINT! · OPPONENT ERROR']]){
  await m.evaluate(({event,winner})=>{reset();paused=true;ball={state:'drop',attacker:players[0],target:players[6],outcome:{event},targetX:500,targetY:310};awardPoint(winner);},{event,winner});
  await m.waitForFunction(expected=>document.querySelector('#serveTeam .server-label')?.textContent===expected,expected);
  assert(!/[çğıöşüÇĞİÖŞÜ]/.test(await m.locator('#serveTeam .server-skill').innerText()));
  samples.push({event,label:await m.locator('#serveTeam .server-label').innerText(),detail:await m.locator('#serveTeam .server-club').innerText()});
 }
 const commentary=[
  ['Müge Gün servis atıyor.','Müge Gün is serving.'],['Müge Gün manşetle karşılıyor.','Müge Gün receives with a forearm pass.'],
  ['Müge Gün, Fang Song için pası kaldırıyor.','Müge Gün sets for Fang Song.'],['Müge Gün smaç vuruyor!','Müge Gün spikes!'],
  ['Müge Gün doğrudan servis sayısı aldı! Güneş Spor sayı! Fang Song servise geçiyor.','Müge Gün scores an ace! Point for Güneş Spor! Fang Song serves next.'],
  ['Müge Gün servis hatası yaptı. Mavi Spor sayı! Fang Song servise geçiyor.','Müge Gün commits a service error. Point for Mavi Spor! Fang Song serves next.']
 ];
 for(const [source,target]of commentary){await m.evaluate(source=>announce(source),source);await m.waitForFunction(target=>document.getElementById('event').textContent===target,target);}
 // A fresh match keeps the natural result independent of the point-reason fixtures.
 await m.reload();await m.waitForFunction(()=>ready&&window.MatchServer);
 await m.evaluate(squad=>{window.testSquadReady=false;window.addEventListener('message',e=>{if(e.data?.type==='spiker-match'&&e.data.action==='squad-ready')window.testSquadReady=true;});window.dispatchEvent(new MessageEvent('message',{source:parent,data:{type:'spiker-match',action:'squad',squad,deferStart:true}}));},squad);
 await m.waitForFunction(()=>window.testSquadReady&&players.every(p=>p.roster?.servePortrait)&&paused);
 await m.evaluate(()=>MatchServer.refresh());await m.waitForFunction(()=>document.querySelector('#serveTeam .server-label')?.textContent==='SERVING');
 await m.screenshot({path:path.join(root,'audits/live-match-english.png')});
 let finished=false;
 for(let chunk=0;chunk<200&&!finished;chunk++){
  const sample=await m.evaluate(()=>{paused=false;for(let i=0;i<180&&document.getElementById('matchResult').hidden;i++)tick(1/60);paused=true;GameLanguage.refresh();return {finished:!document.getElementById('matchResult').hidden,label:document.querySelector('#serveTeam .server-label').textContent,event:document.getElementById('event').textContent};});
  assert(!/atıyor|vuruyor|karşılıyor|veriyor|SAYI|HATASI|TAMAMLANDI/.test(sample.label),sample.label);samples.push(sample);finished=sample.finished;
  assert(!/(?:^|\s)(atıyor|vuruyor|sayı|kazandı|servise|manşetle|blokla|yetişemedi|ve)(?=\s|[!.,]|$)/u.test(sample.event),sample.event);
 }
 assert(finished,'Natural match must finish');
 await m.locator('#matchResult').screenshot({path:path.join(root,'audits/live-match-english-result.png')});
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(root,'audits/live-match-language.json'),JSON.stringify({samples,skillNames,commentary,errors},null,2));
 console.log('PASS rhythm feedback, seven live/skill actions, all 38 skill names and active skill notices, five point reasons, TR/EN reversal, named commentary and a natural match.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
