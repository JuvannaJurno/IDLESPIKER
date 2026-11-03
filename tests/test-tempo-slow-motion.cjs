const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{pathToFileURL}=require('node:url');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage({viewport:{width:390,height:844}}),source=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await source.goto(pathToFileURL(path.resolve('index.html')).href);await source.waitForFunction(()=>window.TeamView&&window.MatchIntro&&window.ClubJourney);
 const squad=await source.evaluate(()=>{const room=BalRules.enter(RoomRules.defaults(),1);room.division=3;RoomSystem.loadStage(room);LeagueSeason.loadStage(LeagueRules.normalize({mode:'bal',division:3,startDay:1,results:{}}));const s=TeamView.snapshot(),fixture=LeagueRules.schedule().find(f=>f.ours);s.opponents=MatchIntro.opponents(fixture);s.matchInfo={division:3,fixtureId:'tempo-slow-current-assets',opponentLegendaryUnlocked:true,colors:[ClubJourney.matchColors(0),ClubJourney.matchColors(fixture.home===0?fixture.away:fixture.home)],names:['Bizim Kulüp','Rakip']};return s;});
 await page.addInitScript(()=>window.requestAnimationFrame=()=>1);await page.goto(pathToFileURL(path.resolve('mac.html')).href);await page.waitForFunction(()=>ready&&window.MatchSkills);
 await page.evaluate(squad=>new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error('Current squad did not load')),20000);const listener=e=>{if(e.data?.action==='squad-ready'){clearTimeout(timer);removeEventListener('message',listener);resolve();}};addEventListener('message',listener);postMessage({type:'spiker-match',action:'squad',squad,deferStart:true},'*');}),squad);await source.close();
 const rows=await page.evaluate(()=>{
  function setup(team,owner,speed=1,held=false){
   paused=true;reset();window.matchInfo={...window.matchInfo,division:3,fixtureId:'tempo-slow-'+team+'-'+owner+'-'+speed,opponentLegendaryUnlocked:true};matchRandom=()=>.9;document.getElementById('speed').value=String(speed);
   const own=players.filter(p=>p.team===team),setter=own[2],hitter=own[1];
   for(const p of players){p.stats={role:p===setter?'setter':'outside',spike:60,block:35,serve:40,receive:55,set:60,stamina:60};const has=p===setter?['setter','both'].includes(owner):p===hitter?['hitter','both'].includes(owner):false;p.roster={...p.roster,...p.stats,id:p.roster?.id||'tempo-slow-'+p.index,name:p.roster?.name||'Test',surname:p.roster?.surname||String(p.index),legendaryTalent:true,skillCamps:3,matchSkillsVersion:3,matchSkills:[p===setter?'tempo-third':'cross',p===setter?'back':'float',has?'tempo-minus':p===setter?'team-heart':'jump-legendary',p===setter?'sky-serve':'court-vision','float','sky-ball-serve']};}
   hitter.zone=2;const goal=attackPoint(hitter);hitter.x=goal.x;hitter.y=goal.y;setter.x=goal.x+(team?35:-35);setter.y=goal.y;setter.contactQuality=.85;paused=held;launch(setter,hitter,3,'pass');return {setter,hitter,set:ball};
  }
  function highlightedActors(){
   const seen=new Set(),fill=ctx.fillRect,player=drawPlayer,vector=MatchVectorCharacters.draw;let overlay=false,fallbacks=0;
   MatchVectorCharacters.draw=function(...args){const ok=vector(...args);if(!ok&&players.some(p=>p.index===args[1]?.index))fallbacks++;return ok;};
   ctx.fillRect=function(x,y,w,h){if(w===1000&&h===620&&String(this.fillStyle).replaceAll(' ','').startsWith('rgba(12,25,32,'))overlay=true;return fill.call(this,x,y,w,h);};
   drawPlayer=function(p,...args){if(overlay)seen.add(p.index);return player(p,...args);};
   try{draw();return {actors:[...seen],fallbacks}}finally{ctx.fillRect=fill;drawPlayer=player;MatchVectorCharacters.draw=vector;}
  }
  const rows=[];
  for(const team of [0,1])for(const owner of ['hitter','setter','both'])for(const speed of [1,1.5,2]){
   const {setter,hitter,set}=setup(team,owner,speed),initial=MatchSkills.state,step=speed/60;
   const row={team,owner,speed,triggered:initial.tempoPairs.length===1,immediate:initial.slow&&initial.focusSkill==='tempo-minus',setDuration:set.duration,setFrames:0,slowSetFrames:0};
   const early=initial.cooldowns.filter(e=>e.id==='tempo-minus');row.reserved=early.every(e=>e.reserved&&!e.pending);row.cooldownActors=early.length;
   let n=0;while(ball===set&&n++<500){const s=MatchSkills.state;row.setFrames++;if(s.slow&&s.focusSkill==='tempo-minus')row.slowSetFrames++;tick(step);if(n===10){row.highlighted=highlightedActors();row.expectedActors=[setter.index,hitter.index];if(team===0&&owner==='both'&&speed===1)window.tempoSlowPreview=canvas.toDataURL();}}
   row.attackLaunched=ball!==set&&ball.kind==='attack';row.contactSlow=MatchSkills.state.slow&&MatchSkills.state.focusSkill==='tempo-minus';row.phase=MatchSkills.state.focusPhase;row.ledger=MatchSkills.state.cooldowns.filter(e=>e.id==='tempo-minus');row.committed=row.ledger.every(e=>!e.reserved&&e.pending);
   const attack=ball;let outbound=0;while(ball===attack&&MatchSkills.state.focusSkill==='tempo-minus'&&outbound++<500)tick(step);
   row.outboundFrames=outbound;row.finished=!MatchSkills.state.slow;row.reasons=MatchSkills.focusEvents.filter(e=>e.id==='tempo-minus').map(e=>e.reason);rows.push(row);paused=true;
  }
  for(const team of [0,1]){
   setup(team,'both',1,true);paused=false;tick(1/60);rows.push({name:'resume-prepared',team,slow:MatchSkills.state.slow,skill:MatchSkills.state.focusSkill});
   setup(team,'both');const time=MatchSkills.state.clock;paused=true;for(let i=0;i<10;i++)tick(1/60);const still=MatchSkills.state.clock;paused=false;for(let i=0;i<10;i++)tick(1/60);rows.push({name:'pause-resume',team,stationary:time===still,slow:MatchSkills.state.slow,advanced:MatchSkills.state.clock>still});
   setup(team,'both');awardPoint(1-team);rows.push({name:'cancelled',team,slow:MatchSkills.state.slow,cooldowns:MatchSkills.state.cooldowns.filter(e=>e.id==='tempo-minus').length});
  }
  setup(0,'none');rows.push({name:'no-tempo',slow:MatchSkills.state.slow,triggered:MatchSkills.state.tempoPairs.length>0});paused=true;return rows;
 });
 for(const r of rows.filter(r=>!r.name)){
  assert(r.triggered&&r.immediate,JSON.stringify(r));assert.equal(r.setDuration,.5);assert(r.reserved&&r.committed,JSON.stringify(r));assert.equal(r.cooldownActors,r.owner==='both'?2:1);
  assert.equal(r.slowSetFrames,r.setFrames,'slow motion must survive the entire preparation');assert(r.setFrames>30/r.speed+8,'actual simulation time must slow down');assert(r.attackLaunched&&r.contactSlow);assert.equal(r.phase,'outbound');assert(r.outboundFrames>0&&r.finished);assert(r.expectedActors.every(i=>r.highlighted.actors.includes(i)),'both players remain visible above the Legendary dimming');assert.equal(r.highlighted.fallbacks,0,'the real current squad uses canonical vector assets');
 }
 for(const r of rows.filter(r=>r.name==='resume-prepared'))assert(r.slow&&r.skill==='tempo-minus');
 for(const r of rows.filter(r=>r.name==='pause-resume'))assert(r.stationary&&r.slow&&r.advanced);
 for(const r of rows.filter(r=>r.name==='cancelled')){assert(!r.slow);assert.equal(r.cooldowns,0);}
 const normal=rows.find(r=>r.name==='no-tempo');assert(!normal.slow&&!normal.triggered);assert.deepEqual(errors,[]);
 fs.writeFileSync('audits/tempo-slow-motion.json',JSON.stringify(rows,null,2));const preview=await page.evaluate(()=>window.tempoSlowPreview);fs.writeFileSync('audits/tempo-slow-motion.png',Buffer.from(preview.split(',')[1],'base64'));
 console.log('PASS 18 owner/team/speed cases: immediate preparation slow motion, real time dilation, spike handoff, cooldown reservation, both visible players, normal-speed exit; pause/resume, cancellation and normal play');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1});
