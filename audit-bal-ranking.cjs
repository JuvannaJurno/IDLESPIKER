const assert=require('assert'),R=require('./room-rules'),B=require('./bal-rules'),T=require('./team-rules'),L=require('./league-rules'),M=require('./match-rules'),C=require('./camp-rules'),S=require('./scout-rules');
// Exercise the actual purchase, income, card, camp and league rules together.
function simulate(strategy='balanced',carry=5){
 const rng=M.seeded('bal-balance-'+strategy),prolog=R.defaults();
 for(const r of R.catalog.filter(r=>!r.bal&&r.floor<4))prolog.floors[r.floor].push(...Array(Math.min(carry,r.values.length)).fill(r.id));
 const s=B.enter(prolog,1),roster=T.generate(),players=roster.slice(0,7);s.openDepartments=[2,4];
 global.RoomSystem={developmentState:()=>s,trainingDiscount:k=>R.trainingDiscount(s,k)};
 for(const p of players)for(let n=1;n<10;n++){for(const [k,v]of Object.entries(T.cardGains(p,n,50)))p[k]+=v;p.cardLevel=n+1;}
 const league=L.normalize({mode:'bal',startDay:1}),initial=players.map(T.overall),purchases=[],rounds=[];
 const weights={bal_sponsor:3,bal_shop:2,bal_coach:strategy==='automation'?6:2,bal_position:2,bal_video:2,bal_plan:1.5};
 const snapshots=[];let nextSnapshot=0,lastAction=0,maxWait=0,upgrades=0;let seconds=0,earnedAP=0,earnedCash=0,spentAP=0,spentTransfers=0,physical=0,transferGoal=null;
 const end=(L.config.lastDay-1)*500+L.config.matchTrigger;
 function invest(){for(let n=0;n<200;n++){
  const choices=B.catalog.filter(r=>!R.requirement(s,r.id)&&R.count(s,r.id)<10).map(r=>({r,price:R.cost(s,r.floor,r.id)}));
  choices.sort((a,b)=>a.price/(weights[a.r.id]||1)-b.price/(weights[b.r.id]||1));
  const choice=choices[0],reserve=transferGoal?.price||0;if(!choice||s.budget-reserve<choice.price)break;
  const ok=R.count(s,choice.r.id)?R.upgrade(s,choice.r.id):R.purchase(s,choice.r.floor,choice.r.id);assert(ok);
  maxWait=Math.max(maxWait,seconds-lastAction);lastAction=seconds;purchases.push({id:choice.r.id,level:R.count(s,choice.r.id),instructions:s.instructions,minute:seconds/60});
 }}
 while(s.instructions<end){
  invest();const e=R.effects(s),rate=e.autoRate*(1+e.doubleChance),batch=Math.min(25,end-s.instructions);assert(rate>0);
  seconds+=batch/rate;physical+=batch/(1+e.doubleChance);
  for(let j=0;j<batch;j++){const gain=R.income(s,(s.instructions+1)%500===0,rng,'auto');s.ap+=gain.ap;s.budget+=gain.cash+gain.dayBudget;earnedAP+=gain.ap;earnedCash+=gain.cash+gain.dayBudget;}
  const day=1+Math.floor(s.instructions/500);C.update(s,players,day);
  for(const p of players)if(C.eligible(s,p)&&s.camp.entries.filter(e=>e.status==='running').length<6){const before=s.ap;if(C.enroll(s,p,day)){spentAP+=before-s.ap;maxWait=Math.max(maxWait,seconds-lastAction);lastAction=seconds;}}
  for(let n=0;n<100;n++){
   const options=players.map(p=>({p,q:T.cardQuote(p)})).filter(o=>!o.q.blocked).sort((a,b)=>a.q.cost-b.q.cost),o=options[0];
   if(!o||s.ap<o.q.cost)break;maxWait=Math.max(maxWait,seconds-lastAction);lastAction=seconds;upgrades++;s.ap-=o.q.cost;spentAP+=o.q.cost;for(const [k,v]of Object.entries(o.q.gains))o.p[k]+=v;o.p.cardLevel++;
  }
  if(transferGoal&&s.budget>=transferGoal.price){const offer=s.scouting.catalog.find(c=>c.id===transferGoal.id&&!c.hired),own=players.filter(p=>offer&&p.role===offer.player.role).sort((a,b)=>T.overall(a)-T.overall(b))[0];if(offer&&own&&T.overall(offer.player)>T.overall(own)+3&&S.hire(s,offer.id,roster,T.valid)){const recruit=s.scouting.recruits.at(-1);roster.push(recruit);spentTransfers+=offer.price;players[players.indexOf(own)]=recruit;}transferGoal=null;}
  if(S.remaining(s)===0){S.report(s,()=>T.generate(),rng);if(strategy==='transfers'){
   const offers=s.scouting.catalog.map(c=>({c,own:players.filter(p=>p.role===c.player.role).sort((a,b)=>T.overall(a)-T.overall(b))[0]})).filter(o=>o.own&&T.overall(o.c.player)>T.overall(o.own)+3).sort((a,b)=>b.c.player.cardLevel-a.c.player.cardLevel);
   const o=offers[0];if(o){transferGoal={id:o.c.id,price:o.c.price};S.hold(s,o.c.id);}
  }}
  if(seconds>=nextSnapshot){const choices=B.catalog.filter(r=>!R.requirement(s,r.id)&&R.count(s,r.id)<10).map(r=>R.cost(s,r.floor,r.id));snapshots.push({minute:Math.round(seconds/60),rate:+rate.toFixed(2),apPerInstruction:+e.autoAP.toFixed(1),earnedAP:Math.round(earnedAP),earnedCash:Math.round(earnedCash),budget:Math.round(s.budget),AP:Math.round(s.ap),upgrades,blockUpgrades:purchases.length,affordableBlocks:choices.filter(p=>p<=s.budget).length,camps:s.camp.entries.length,returns:s.camp.entries.filter(e=>e.status==='complete').length,blocked:players.filter(p=>T.cardQuote(p).blocked).length,meanOVR:Math.round(players.reduce((n,p)=>n+T.overall(p),0)/7)});nextSnapshot+=600;}
 let next=L.progress(league).next;
  while(next&&(next.day-1)*500+L.config.matchTrigger<=s.instructions){
   const rival=next.home===0?next.away:next.home,ours=[4,1,0,5,2,3].map(i=>players[i]),away=Array.from({length:6},(_,i)=>T.opponentStats(next.round,i,'bal',rival)),score=M.simulateSet([ours,away],'balance-'+strategy+'-'+next.id,'bal');
   L.record(league,next.id,next.home===0?score:[...score].reverse());L.settleRounds(league);
   if(score[0]>score[1])R.matchReward(s,next.id,next.round);
   s.budget+=B.value(s,'bal_fans')+B.value(s,'bal_matchsponsor');
   rounds.push({round:next.round,minute:Math.round(seconds/60),ovr:players.map(T.overall),roster:JSON.parse(JSON.stringify(players)),rank:L.progress(league).rank,levels:Object.fromEntries(B.catalog.map(r=>[r.id,R.count(s,r.id)]))});next=L.progress(league).next;
  }
 }
 return {strategy,carry,snapshots,maxWaitSeconds:Math.round(maxWait),camps:s.camp.entries.length,returns:s.camp.entries.filter(e=>e.status==='complete').length,minutes:Math.round(seconds/60),initial,final:players.map(T.overall),rank:L.progress(league).rank,earnedAP:Math.round(earnedAP),spentAP:Math.round(spentAP),earnedCash:Math.round(earnedCash),spentTransfers,budget:Math.round(s.budget),purchases,rounds};
}

const fs=require('fs'),out=[];for(const strategy of ['balanced','transfers']){const original=Math.random;Math.random=M.seeded('tempo-audit-'+strategy+'-5');let r;try{r=simulate(strategy,5)}finally{Math.random=original}const ranks={};for(let run=0;run<40;run++){const league=L.normalize({mode:'bal',startDay:1});for(const snap of r.rounds){const fixture=L.schedule().find(f=>f.ours&&f.round===snap.round),rival=fixture.home===0?fixture.away:fixture.home,theirs=Array.from({length:6},(_,i)=>T.opponentStats(snap.round,i,'bal',rival)),score=M.simulateSet([[4,1,0,5,2,3].map(i=>snap.roster[i]),theirs],'rank-audit-'+run+'-'+fixture.id,'bal');L.record(league,fixture.id,fixture.home===0?score:[...score].reverse());L.settleRounds(league);}const rank=L.progress(league).rank;ranks[rank]=(ranks[rank]||0)+1;}out.push({strategy,seasons:40,ranks});console.log(JSON.stringify(out.at(-1)));}fs.writeFileSync('bal-ranking-audit.json',JSON.stringify(out,null,2));
