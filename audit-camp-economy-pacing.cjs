// Isolated, reproducible economy runs. Never reads localStorage or a user's save.
const fs=require('fs'),path=require('path'),Module=require('module'),assert=require('assert/strict');
const T=require('./team-rules'),R=require('./room-rules'),C=require('./camp-rules');
const source=fs.readFileSync(path.join(__dirname,'audit-progression-balance.cjs'),'utf8');
function replace(code,from,to){assert(code.includes(from),'audit source anchor changed: '+from.slice(0,70));return code.replace(from,to);}
function runtime({social=true,free=false,focus=false,matchResults=false}={}){
 let code=source.replaceAll('console.log(', '(()=>{})(');
 // Mahalle has no offline shift. Stay online until the actual unlock exists;
 // otherwise the legacy offline profile stalls forever before its first season.
 code=code.replaceAll('policy.offline&&wall-start>=300','policy.offline&&wall-start>=300&&R.effects(state).offlineHours>0');
 code=replace(code,'const players=T.generate();Math.random=old;',`const descriptor=Object.getOwnPropertyDescriptor(globalThis,'crypto');
 Object.defineProperty(globalThis,'crypto',{configurable:true,value:{getRandomValues(a){for(let i=0;i<a.length;i++)a[i]=Math.floor(rng()*4294967296);return a;}}});
 let players;try{players=T.generate();}finally{if(descriptor)Object.defineProperty(globalThis,'crypto',descriptor);else delete globalThis.crypto;Math.random=old;}`);
 // The old audit had obsolete video durations and only five preparation levels.
 if(social){
  code=replace(code,"x.level<(x.i===1?10:5)","x.level<[10,10,5][x.i]");
  code=code.replaceAll("[60,90,75][offer]/(1+social.levels[0]*.14)","S.duration(social,['moment','story','sponsor'][offer])/1000");
  code=replace(code,"social.earnedFollowers+=reward.followers;",`social.earnedFollowers+=reward.followers;const effects=R.effects(state),wave=S.waveCount(social,state);state.ap+=Math.round(wave*effects.autoAP*(1+effects.critChance*(effects.critMult-1)));`);
 }else code=replace(code,'if(division===3){if(!state.mediaDepartmentOpen','if(false){if(!state.mediaDepartmentOpen');
 // Optional real free-upgrade RNG. The default paid-only run is conservative.
 if(free)code=replace(code,'R.trainingPayment(state,q.cost,()=>1,true)','R.trainingPayment(state,q.cost,rng,true)');
 if(focus)code=replace(code,'.sort((a,b)=>a.q.cost-b.q.cost);if(!choices.length)', '.sort((a,b)=>team.indexOf(a.p)-team.indexOf(b.p));if(!choices.length)');
 if(matchResults)code=replace(code,'const won=rng()<.5;',`const courtStage=division>=3?'division2':state.stage,rivalId=f.home===0?f.away:f.home,rival=Array.from({length:6},(_,i)=>T.opponentStats(f.round,i,courtStage,rivalId)),own=team.slice(0,6).map(p=>({...p,skillCamps:C.progress(state,p).count})),rosters=f.home===0?[own,rival]:[rival,own],score=M.simulateRotationSet(rosters,'camp-paced-'+seed+'-'+f.id,state.stage);const won=(score[0]>score[1])===(f.home===0);`);
 code=replace(code,'final:samples.at(-1),samples,events,matches','final:{...samples.at(-1),production:R.effects(state),dailyBudget:R.dailyBudget(state),running:state.camp.entries.filter(e=>e.status===\'running\').map(e=>e.playerId),holdings:Object.fromEntries(R.catalog.map(r=>[r.id,R.count(state,r.id)]).filter(([id,n])=>n))},samples,events,matches');
 const mod=new Module(path.join(__dirname,'camp-economy-runtime.cjs'),module);mod.filename=path.join(__dirname,'camp-economy-runtime.cjs');mod.paths=module.paths;mod._compile(code,mod.filename);return mod.exports;
}
function summarize(result){return result.stages.map(s=>{
 const counts=[...s.final.camps].sort((a,b)=>a-b),camps=s.events.filter(e=>e.kind==='camp');
 const repeatGaps=[];for(const id of new Set(camps.map(e=>e.id))){const starts=camps.filter(e=>e.id===id);for(let i=1;i<starts.length;i++)repeatGaps.push(starts[i].at-starts[i-1].at);}
 return {division:s.division,complete:s.completed,minutes:+(s.durationSeconds/60).toFixed(1),camps:s.final.camps,median:counts[3],levels:s.final.levels,ovr:s.final.ovr,ap:Math.round(s.final.ap),production:s.final.production,dailyBudget:s.final.dailyBudget,running:s.final.running,holdings:s.final.holdings,wins:s.matches.filter(m=>m.won).length,matches:s.matches.length,coreActionsByQuarter:s.coreActionsByQuarter,longestCoreGapSeconds:s.longestCoreGapSeconds,firstTwoStarSeconds:s.firstTwoStarSeconds,shortestCampStartGapSeconds:repeatGaps.length?Math.min(...repeatGaps):null,matchGapSeconds:s.matchGapSeconds};
 });}
function runSuite(){
 const before=T.cardQuote,rows=[],seeds=(process.env.CAMP_SEEDS||'41,42,43,44,45').split(',').map(Number);
 for(const free of [false,true])for(const profile of ['active','idle','offline'])for(const seed of seeds){
  const stages=summarize(runtime({free}).run(profile,seed));
  assert(stages.length===3&&stages.every(s=>s.complete),'season cannot finish: '+profile+' / '+seed+' / '+JSON.stringify(stages));assert(stages[0].camps.every(n=>n===0));
  if(profile!=='offline'){assert(stages[1].median>=2&&stages[1].median<=4,'regional target');assert(stages[2].median>=6&&stages[2].median<=9,'second league target with free-upgrade margin');assert(stages[1].longestCoreGapSeconds<=(profile==='active'?180:601),'regional idle gap regressed');}
  rows.push({profile,seed,free,social:true,focus:false,stages});
 }
 // Compare concentrating resources on one player and foregoing all social income.
 for(const options of [{focus:true},{social:false},{matchResults:true}])for(const profile of ['active','idle']){
  rows.push({profile,seed:41,free:false,social:true,focus:false,...options,stages:summarize(runtime(options).run(profile,41))});
 }
 assert.equal(T.cardQuote,before,'experiments must not replace production quotes');
 fs.writeFileSync('audits/camp-economy-pacing.json',JSON.stringify({policy:T.trainingEconomy,method:'Fresh deterministic rosters, 0 AP/20 budget; actual rules for earned income, purchases, discounts, refunds, paid camps, caps, real social block limits/durations/wave AP. Assumes promotion and 50% seeded match outcomes. Active decisions 30s with .3 manual instructions/s; idle 5m; offline 15m after bootstrap. Offline video timing and match-time queue settlement remain approximations. No transfers/academy/paid gains. Runtime composes the existing economy runner with checked source anchors; never mutates production rules.',rows},null,2));
 for(const profile of ['active','idle','offline']){
  const subset=rows.filter(r=>r.profile===profile&&!r.free&&!r.focus&&r.social);
  console.log(profile,JSON.stringify([1,2,3].map(d=>({division:d,medianCamps:subset.map(r=>r.stages[d-1].median),minutes:subset.map(r=>r.stages[d-1].minutes),longestGap:Math.max(...subset.map(r=>r.stages[d-1].longestCoreGapSeconds))}))));
 }
 console.log('PASS '+rows.length+' complete fresh-save routes / '+rows.length*3+' seasons; wrote audits/camp-economy-pacing.json');
 return rows;
}
function compareBaseline(){
 const cp=require('child_process'),original=T.cardQuote;
 // Pin the last audit commit, not HEAD: remains repeatable after this change is pushed.
 const baseline=new Module(path.join(__dirname,'camp-baseline-runtime.cjs'),module);
 baseline.filename=path.join(__dirname,'camp-baseline-runtime.cjs');baseline.paths=module.paths;
 baseline._compile(cp.execFileSync('git',['show','f5916f8:team-rules.js'],{cwd:__dirname,encoding:'utf8'}),baseline.filename);
 const rows=[];
 try{for(const profile of ['active','idle','offline']){
  T.cardQuote=baseline.exports.cardQuote;const before=summarize(runtime().run(profile,41));
  T.cardQuote=original;const after=summarize(runtime().run(profile,41));
  assert.deepEqual(after.map(s=>s.minutes),before.map(s=>s.minutes),'calendar tempo regressed');
  rows.push({profile,before,after});
 }}finally{T.cardQuote=original;}
 fs.writeFileSync('audits/camp-economy-before-after.json',JSON.stringify(rows,null,2));
 console.log('PASS matched baseline/new calendar durations across three profiles; historical baseline f5916f8.');
}
if(require.main===module){if(process.argv.includes('--compare'))compareBaseline();else runSuite();}
module.exports={runtime,summarize,runSuite,compareBaseline};
