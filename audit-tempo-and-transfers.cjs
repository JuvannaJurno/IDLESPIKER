// Reproducible before/after routes. No browser saves, purchases or user data.
const fs=require('fs'),path=require('path'),Module=require('module'),cp=require('child_process'),assert=require('assert/strict');
const {runtime}=require('./audit-camp-economy-pacing.cjs');
const baseline='fe629e6',files=['camp-rules.js','team-rules.js','scout-rules.js'];
function withBaseline(run){
 const saved=files.map(f=>[require.resolve('./'+f),require.cache[require.resolve('./'+f)].exports]);
 try{for(const file of files){const full=require.resolve('./'+file),mod=new Module(full,module);mod.filename=full;mod.paths=module.paths;mod._compile(cp.execFileSync('git',['show',baseline+':'+file],{cwd:__dirname,encoding:'utf8'}),full);require.cache[full].exports=mod.exports;}return run();}
 finally{for(const [full,exports]of saved)require.cache[full].exports=exports;}
}
function stageSummary(s){
 const cards=s.events.filter(e=>e.kind==='card'),times=[...new Set(cards.map(e=>e.at))],gaps=times.map((t,i)=>t-(times[i-1]||0));gaps.push(s.durationSeconds-(times.at(-1)||0));
 const bursts=times.map(t=>cards.filter(e=>e.at===t).length).sort((a,b)=>a-b),counts=[...s.final.camps].sort((a,b)=>a-b);
 return {division:s.division,minutes:+(s.durationSeconds/60).toFixed(1),upgradeClicks:cards.length,upgradeVisits:times.length,medianBurst:bursts[Math.floor(bursts.length/2)]||0,maxUpgradeGap:Math.max(...gaps),firstUpgrade:times[0],camps:s.final.camps,medianCamps:counts[3],levels:s.final.levels,ovr:s.final.ovr,wins:s.matches.filter(m=>m.won).length,matches:s.matches.length,transfers:s.events.filter(e=>e.kind==='transfer')};
}
function verifyTempo(rows){
 for(const after of rows.filter(r=>r.version==='after')){
  const before=rows.find(r=>r.version==='before'&&r.scenario===after.scenario&&r.seed===after.seed);assert(before);
  assert.deepEqual(after.stages[0],before.stages[0],'initial league tempo must stay intact');
  if(after.scenario==='active'){assert(after.stages[1].maxUpgradeGap<=120,'early active card wait');assert(after.stages[1].upgradeClicks>=160,'meaningful upgrade budget');}
  assert(after.stages[1].upgradeClicks>before.stages[1].upgradeClicks,'regional investment opportunities');
 }
}
function suite(){
 const scenarios=[{id:'active',profile:'active',investments:10,transfers:false},{id:'active-market',profile:'active',investments:3,transfers:true},{id:'return-market',profile:'idle',investments:3,transfers:true},{id:'return-no-market',profile:'idle',investments:3,transfers:false}],rows=[],samples=[];
 for(const version of ['before','after'])for(const scenario of scenarios)for(const seed of [41,42,43,44,45]){
  const capture=sample=>{if(seed===41&&['active-market','return-market'].includes(scenario.id)&&((sample.division===1&&[1,3,5].includes(sample.round))||(sample.division>1&&[1,7,14].includes(sample.round))))samples.push({version,scenario:scenario.id,...sample});};
  globalThis.__tempoMatchSample=capture;
  const run=()=>runtime({matchResults:true,transfers:scenario.transfers,investments:scenario.investments}).run(scenario.profile,seed);
  let result;try{result=version==='before'?withBaseline(run):run();}finally{delete globalThis.__tempoMatchSample;}
  assert.equal(result.stages.length,3);assert(result.stages.every(s=>s.completed));rows.push({version,scenario:scenario.id,seed,stages:result.stages.map(stageSummary)});
 }
 verifyTempo(rows);
 fs.writeFileSync('audits/tempo-market-routes.json',JSON.stringify({baseline,method:'Fresh deterministic rosters and real economy/camp/transfer rules. Generated offers are bought only if at least +3 OVR and price <=35% current budget; one purchase per return, no unknown prospects, roster cap 30. Transfers replace the weakest matching starter. Active decisions every 30s; return profiles every 5m; 3 or 10 block purchases per visit. Rotational MatchRules outcomes feed win AP. Promotion is assumed; calendar is not a full league standings gate. No paid gains or academy. See native court replay for visual match engine evidence.',rows},null,2));
 fs.writeFileSync('audits/tempo-native-samples.json',JSON.stringify(samples,null,2));
 for(const scenario of scenarios){const view=rows.filter(r=>r.seed===41&&r.scenario===scenario.id).map(r=>({version:r.version,stages:r.stages.map(s=>({d:s.division,clicks:s.upgradeClicks,gap:s.maxUpgradeGap,ovr:+s.ovr.toFixed(1),wins:s.wins,camps:s.medianCamps,transfers:s.transfers.length}))}));console.log(scenario.id,JSON.stringify(view));}
 console.log('PASS 40 fresh routes / 120 seasons; captured '+samples.length+' earned native-court snapshots.');return rows;
}
if(require.main===module)suite();module.exports={withBaseline,stageSummary,verifyTempo,suite};
