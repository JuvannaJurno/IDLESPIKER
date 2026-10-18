const assert=require('assert'),R=require('./room-rules'),B=require('./bal-rules'),T=require('./team-rules'),L=require('./league-rules'),M=require('./match-rules'),C=require('./camp-rules'),S=require('./scout-rules');
// Exercise the actual purchase, income, card, camp and league rules together.
function simulate(strategy='balanced',runSeed='run-1'){const originalRandom=Math.random,originalCrypto=global.crypto.getRandomValues;Math.random=M.seeded(runSeed);global.crypto.getRandomValues=function(array){for(let i=0;i<array.length;i++)array[i]=Math.floor(Math.random()*4294967296);return array;};global.TeamRules=T;
 const rng=M.seeded('bal-balance-'+strategy),prolog=R.defaults();
 for(const r of R.catalog.filter(r=>!r.bal&&r.floor<4))prolog.floors[r.floor].push(...Array(r.values.length).fill(r.id));
 const s=B.enter(prolog,1),roster=T.generate(),players=roster.slice(0,7);s.openDepartments=[2,4];
 global.RoomSystem={developmentState:()=>s,trainingDiscount:k=>R.trainingDiscount(s,k)};
 for(const p of players)for(let n=1;n<10;n++){for(const [k,v]of Object.entries(T.cardGains(p,n,50)))p[k]+=v;p.cardLevel=n+1;}
 T.players.splice(0,T.players.length,...roster);const league=L.normalize({mode:'bal',startDay:1}),initial=players.map(T.overall),purchases=[],rounds=[];
 const weights={bal_sponsor:3,bal_shop:2,bal_coach:strategy==='automation'?6:2,bal_position:2,bal_video:2,bal_plan:1.5};
 let seconds=0,earnedAP=0,earnedCash=0,spentAP=0,spentTransfers=0,physical=0,transferGoal=null;
 const upgradeEvents=[],activity=[],transferEvents=[];let lastUpgrade=0,maxUpgradeGap=0;const end=(L.config.lastDay-1)*500+L.config.matchTrigger;
 function invest(){for(let n=0;n<200;n++){
  const choices=B.catalog.filter(r=>!R.requirement(s,r.id)&&R.count(s,r.id)<10).map(r=>({r,price:R.cost(s,r.floor,r.id)}));
  choices.sort((a,b)=>a.price/(weights[a.r.id]||1)-b.price/(weights[b.r.id]||1));
  const choice=choices[0],reserve=transferGoal?.price||0;if(!choice||s.budget-reserve<choice.price)break;
  const ok=R.count(s,choice.r.id)?R.upgrade(s,choice.r.id):R.purchase(s,choice.r.floor,choice.r.id);assert(ok);
  activity.push(seconds);purchases.push({id:choice.r.id,level:R.count(s,choice.r.id),instructions:s.instructions,minute:seconds/60});
 }}
 while(s.instructions<end){
  invest();const e=R.effects(s),rate=e.autoRate*(1+e.doubleChance),batch=Math.min(25,end-s.instructions);assert(rate>0);
  seconds+=batch/rate;physical+=batch/(1+e.doubleChance);
  for(let j=0;j<batch;j++){const gain=R.income(s,(s.instructions+1)%500===0,rng,'auto');s.ap+=gain.ap;s.budget+=gain.cash+gain.dayBudget;earnedAP+=gain.ap;earnedCash+=gain.cash+gain.dayBudget;}
  const day=1+Math.floor(s.instructions/500);C.update(s,players,day);
  for(const p of players)if(C.eligible(s,p)&&s.camp.entries.filter(e=>e.status==='running').length<6){const before=s.ap;if(C.enroll(s,p,day))spentAP+=before-s.ap;}
  for(let n=0;n<100;n++){
   const options=players.map(p=>({p,q:T.cardQuote(p)})).filter(o=>!o.q.blocked).sort((a,b)=>a.q.cost-b.q.cost),o=options[0];
   if(!o||s.ap<o.q.cost)break;s.ap-=o.q.cost;spentAP+=o.q.cost;for(const [k,v]of Object.entries(o.q.gains))o.p[k]+=v;o.p.cardLevel++;maxUpgradeGap=Math.max(maxUpgradeGap,seconds-lastUpgrade);lastUpgrade=seconds;upgradeEvents.push({second:Math.round(seconds),ovr:T.overall(o.p)});activity.push(seconds);
  }
  if(transferGoal&&s.budget>=transferGoal.price){const offer=s.scouting.catalog.find(c=>c.id===transferGoal.id&&!c.hired),own=players.filter(p=>offer&&p.role===offer.player.role).sort((a,b)=>T.overall(a)-T.overall(b))[0];if(offer&&own&&T.overall(offer.player)>T.overall(own)+3&&S.hire(s,offer.id,roster,T.valid)){const recruit=s.scouting.recruits.at(-1);roster.push(recruit);spentTransfers+=offer.price;transferEvents.push({second:Math.round(seconds),price:offer.price,ovr:T.overall(recruit),previous:T.overall(own)});players[players.indexOf(own)]=recruit;}transferGoal=null;}
  if(S.remaining(s)===0){S.report(s,()=>T.generate(),rng,players);if(strategy==='transfers'&&transferEvents.length<4){
   const offers=s.scouting.catalog.map(c=>({c,own:players.filter(p=>p.role===c.player.role).sort((a,b)=>T.overall(a)-T.overall(b))[0]})).filter(o=>o.own&&T.overall(o.c.player)>T.overall(o.own)+3).sort((a,b)=>(T.overall(b.c.player)-T.overall(b.own))-(T.overall(a.c.player)-T.overall(a.own)));
   const o=offers[0];if(o){transferGoal={id:o.c.id,price:o.c.price};S.hold(s,o.c.id);}
  }}
  let next=L.progress(league).next;
  while(next&&(next.day-1)*500+L.config.matchTrigger<=s.instructions){
   const rival=next.home===0?next.away:next.home,ours=[4,1,0,5,2,3].map(i=>players[i]),away=Array.from({length:6},(_,i)=>T.opponentStats(next.round,i,'bal',rival)),score=M.simulateSet([ours,away],'balance-'+strategy+'-'+next.id,'bal');
   L.record(league,next.id,next.home===0?score:[...score].reverse());L.settleRounds(league);
   if(score[0]>score[1])R.matchReward(s,next.id,next.round);
   s.budget+=B.value(s,'bal_fans')+B.value(s,'bal_matchsponsor');
   rounds.push({round:next.round,minute:Math.round(seconds/60),ovr:players.map(T.overall),roster:JSON.parse(JSON.stringify(players)),rank:L.progress(league).rank,levels:Object.fromEntries(B.catalog.map(r=>[r.id,R.count(s,r.id)]))});next=L.progress(league).next;
  }
 }
 Math.random=originalRandom;global.crypto.getRandomValues=originalCrypto;return {runSeed,upgradeEvents,maxUpgradeGap:Math.round(maxUpgradeGap),activity,transferEvents,finalState:JSON.parse(JSON.stringify(s)),finalRoster:JSON.parse(JSON.stringify(roster)),finalLineup:Object.fromEntries(['p','s1','s2','pc','o1','o2','l'].map((slot,i)=>[slot,players[i].id])),league:JSON.parse(JSON.stringify(league)),strategy,minutes:Math.round(seconds/60),initial,final:players.map(T.overall),rank:L.progress(league).rank,earnedAP:Math.round(earnedAP),spentAP:Math.round(spentAP),earnedCash:Math.round(earnedCash),spentTransfers,budget:Math.round(s.budget),purchases,rounds};
}

module.exports={simulate};
if(require.main===module){const results=['balanced','automation','transfers'].map((strategy,i)=>{const r=simulate(strategy,'fresh-bal-'+i);const gaps=r.activity.slice(1).map((t,i)=>t-r.activity[i]);assert(r.minutes>=45&&r.minutes<=65);assert(Math.max(...gaps)<=90,'An investment must remain available within 90 seconds');assert(r.upgradeEvents.length>=180);assert(r.rounds.length===14);return {...r,totalMinutes:r.minutes+7,maxDecisionGap:Math.round(Math.max(...gaps)),purchases:r.purchases.length,rounds:r.rounds.map(p=>({round:p.round,minute:p.minute,rank:p.rank})),activity:undefined};});require('fs').writeFileSync('bal-three-runs.json',JSON.stringify(results,null,2));for(const r of results)console.log(JSON.stringify({strategy:r.strategy,productionMinutes:r.minutes,totalMinutes:r.totalMinutes,rank:r.rank,cardUpgrades:r.upgradeEvents.length,maxUpgradeGap:r.maxUpgradeGap,maxDecisionGap:r.maxDecisionGap,blocks:r.purchases,transfers:r.transferEvents,final:r.final}));}
