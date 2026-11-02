const fs=require('fs'),path=require('path'),assert=require('assert/strict'),{pathToFileURL}=require('url');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
const label=process.env.AUDIT_LABEL||'after',seeds=Number(process.env.MATCH_SEEDS||6);
const suites=['balanced','quick-attack','rescue','all-ready'];
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage({viewport:{width:480,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>window.requestAnimationFrame=()=>1);
 // Pin both sources for the entire batch, so work on the repo cannot contaminate a running measurement.
 for(const file of ['scripts/game/match-skills.js','scripts/game/legendary-cooldown-rules.js']){const body=label==='before'?require("../tools/maintenance/git-source.cjs").read('HEAD:'+file):fs.readFileSync(file,'utf8');await page.route('**/'+file+'*',route=>route.fulfill({contentType:'text/javascript',body}));}
 const rows=[];
 for(const suite of suites)for(let seed=1;seed<=seeds;seed++){
  await page.goto(pathToFileURL(path.resolve('mac.html')).href+'?audit='+label+'-'+suite+'-'+seed);
  await page.waitForFunction(()=>ready&&window.MatchSkills);
  const row=await page.evaluate(({suite,seed,capture})=>{
   paused=true;reset();window.matchInfo={...window.matchInfo,division:3,fixtureId:'conditions-'+suite+'-'+seed,opponentLegendaryUnlocked:true};matchRandom=MatchRules.seeded('conditions-'+suite+'-'+seed);
   const roleAt={1:'opposite',2:'outside',3:'setter',4:'outside',5:'middle',6:'middle'};
   const ids={setter:['tempo-third','back','sync-attack','fake-set','perfect-second-touch','one-hand-rescue'],outside:['cross','wipe','ghost-tip','court-vision','float','jump-float-legendary'],middle:['commit-block','close','absolute-read','roof','float','team-heart'],opposite:['cross','wipe','jump-legendary','court-vision','float','sky-ball-serve']};
   for(const p of players){const r=roleAt[p.zone],n=p.index%3;p.stats={role:r,spike:52+n*4,block:38+n*4,serve:44,receive:48,set:r==='setter'?65:38,stamina:60};let skills=[...ids[r]];
    if(suite==='quick-attack')skills=r==='setter'?['tempo-third','back','tempo-minus','fake-set','float','sync-attack']:['cross','wipe','tempo-minus','court-vision','float','ghost-tip'];
    if(suite==='rescue')skills=r==='setter'?['tempo-third','back','perfect-second-touch','fake-set','float','one-hand-rescue']:['cross','wipe','pancake','court-vision','float',r==='middle'?'absolute-read':'ghost-tip'];
    p.roster={...p.stats,id:'conditions-'+p.index,name:'Deneme',surname:String(p.index),legendaryTalent:true,skillCamps:14,matchSkillsVersion:3,matchSkills:skills,...(suite==='all-ready'?{epicTeam:true}:{})};
   }
   const all=new Map(),costs=[],drawCosts=[],invalid=[],contacts={},awards=[],baseAward=awardPoint;window.auditSkillShots={};
   const observe=()=>{for(const e of MatchSkills.events)all.set([e.id,e.actor,e.at].join('|'),{...e});};
   const used=e=>{if(e.detail.rarity==='Legendary')contacts[e.detail.id]=(contacts[e.detail.id]||0)+1;};window.addEventListener('spiker-skill-used',used);
   awardPoint=function(team){observe();awards.push({team,credit:ball.skillCredit?.id||null});return baseAward(team);};
   let steps=0,draws=0;paused=false;const start=performance.now();
   try{while(steps<180000&&document.getElementById('matchResult').hidden){const t=performance.now();for(let j=0;j<120&&document.getElementById('matchResult').hidden;j++){tick(1/60);steps++;if(ball.state==='flight'&&(!Number.isFinite(ball.x)||!Number.isFinite(ball.y)||!Number.isFinite(ball.z)))invalid.push(steps);if(capture&&steps%6===0){const s=MatchSkills.state;for(const e of s.active)if(MatchSkills.catalog.find(q=>q.id===e.id)?.rarity==='Legendary'&&!window.auditSkillShots[e.id]){draw();window.auditSkillShots[e.id]=canvas.toDataURL();}}if(steps%360===0&&draws<160){const d=performance.now();draw();drawCosts.push(performance.now()-d);draws++;}}costs.push(performance.now()-t);observe();}
    const events=[...all.values()],counts={};
    // The catalog is an array of objects in some hosts; use the known IDs as the stable audit vocabulary.
    const legendary=['team-heart','sky-ball-serve','sync-attack','tempo-minus','absolute-read','jump-legendary','jump-float-legendary','perfect-second-touch','one-hand-rescue','pancake','ghost-tip'];for(const id of legendary)counts[id]=events.filter(e=>e.id===id).length;
    const q=(a,n)=>[...a].sort((x,y)=>x-y)[Math.min(a.length-1,Math.floor(a.length*n))]||0;
    return {suite,seed,finished:!document.getElementById('matchResult').hidden,points:awards.length,steps,simulationSeconds:MatchSkills.state.clock,elapsedMs:performance.now()-start,counts,contacts,cancelled:events.filter(e=>e.cancelled).map(e=>({id:e.id,actor:e.actor})),invalid:invalid.length,tickBatchP95:q(costs,.95),drawP50:q(drawCosts,.5),drawP95:q(drawCosts,.95),events,awards};
   }finally{paused=true;awardPoint=baseAward;window.removeEventListener('spiker-skill-used',used);}
  },{suite,seed,capture:process.env.CAPTURE_SKILLS==='1'});rows.push(row);if(process.env.CAPTURE_SKILLS==='1'){for(const [id,url]of await page.evaluate(()=>Object.entries(window.auditSkillShots)))if(!fs.existsSync('audits/condition-live-'+id+'.png'))fs.writeFileSync('audits/condition-live-'+id+'.png',Buffer.from(url.split(',')[1],'base64'));}assert(row.finished&&row.points>=5,`${suite}/${seed} finishes`);assert.equal(row.invalid,0,'finite ball coordinates');console.log(JSON.stringify({suite,seed,points:row.points,counts:row.counts,drawP95:row.drawP95}));
 }
 assert.deepEqual(errors,[]);fs.writeFileSync('audits/legendary-conditions-'+label+'.json',JSON.stringify({label,rows,errors},null,2));
 console.log('PASS '+rows.length+' complete matches, finite ball positions, no page errors');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});

