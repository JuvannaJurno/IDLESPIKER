const assert=require('assert'),R=require('./room-rules'),B=require('./bal-rules'),T=require('./team-rules'),L=require('./league-rules'),M=require('./match-rules'),C=require('./camp-rules'),S=require('./scout-rules');
// Exercise the actual purchase, income, card, camp and league rules together.
function simulate(strategy='balanced'){
 const rng=M.seeded('bal-balance-'+strategy),prolog=R.defaults();
 for(const r of R.catalog.filter(r=>!r.bal&&r.floor<4))prolog.floors[r.floor].push(...Array(r.values.length).fill(r.id));
 const s=B.enter(prolog,1),roster=T.generate(),players=roster.slice(0,7);s.openDepartments=[2,4];
 global.RoomSystem={developmentState:()=>s,trainingDiscount:k=>R.trainingDiscount(s,k)};global.TeamView={snapshot:()=>({lineup:Object.fromEntries(players.map((p,i)=>['slot'+i,p.id]))})};
 for(const p of players)for(let n=1;n<10;n++){for(const [k,v]of Object.entries(T.cardGains(p,n,50)))p[k]+=v;p.cardLevel=n+1;}
 const league=L.normalize({mode:'bal',startDay:1}),initial=players.map(T.overall),purchases=[],rounds=[];
 const weights={bal_sponsor:3,bal_shop:2,bal_coach:strategy==='automation'?6:2,bal_position:2,bal_video:2,bal_plan:1.5};
 let seconds=0,earnedAP=0,earnedCash=0,spentAP=0,spentTransfers=0,physical=0,transferGoal=null;
 const end=(L.config.lastDay-1)*500+L.config.matchTrigger;
 function invest(){for(let n=0;n<200;n++){
  const choices=B.catalog.filter(r=>!R.requirement(s,r.id)&&R.count(s,r.id)<10).map(r=>({r,price:R.cost(s,r.floor,r.id)}));
  choices.sort((a,b)=>a.price/(weights[a.r.id]||1)-b.price/(weights[b.r.id]||1));
  const choice=choices[0],reserve=transferGoal?.price||0;if(!choice||s.budget-reserve<choice.price)break;
  const ok=R.count(s,choice.r.id)?R.upgrade(s,choice.r.id):R.purchase(s,choice.r.floor,choice.r.id);assert(ok);
  purchases.push({id:choice.r.id,level:R.count(s,choice.r.id),instructions:s.instructions,minute:seconds/60});
 }}
 while(s.instructions<end){
  invest();const e=R.effects(s),rate=e.autoRate*(1+e.doubleChance),batch=Math.min(25,end-s.instructions);assert(rate>0);
  seconds+=batch/rate;physical+=batch/(1+e.doubleChance);
  for(let j=0;j<batch;j++){const gain=R.income(s,(s.instructions+1)%500===0,rng,'auto');s.ap+=gain.ap;s.budget+=gain.cash+gain.dayBudget;earnedAP+=gain.ap;earnedCash+=gain.cash+gain.dayBudget;}
  const day=1+Math.floor(s.instructions/500);C.update(s,players,day);
  for(const p of players)if(C.eligible(s,p)&&s.camp.entries.filter(e=>e.status==='running').length<6){const before=s.ap;if(C.enroll(s,p,day))spentAP+=before-s.ap;}
  for(let n=0;n<100;n++){
   const options=players.map(p=>({p,q:T.cardQuote(p)})).filter(o=>!o.q.blocked).sort((a,b)=>a.q.cost-b.q.cost),o=options[0];
   if(!o||s.ap<o.q.cost)break;s.ap-=o.q.cost;spentAP+=o.q.cost;for(const [k,v]of Object.entries(o.q.gains))o.p[k]+=v;o.p.cardLevel++;
  }
  if(transferGoal&&s.budget>=transferGoal.price){const offer=s.scouting.catalog.find(c=>c.id===transferGoal.id&&!c.hired),own=players.filter(p=>offer&&p.role===offer.player.role).sort((a,b)=>T.overall(a)-T.overall(b))[0];if(offer&&own&&T.overall(offer.player)>T.overall(own)+3&&S.hire(s,offer.id,roster,T.valid)){const recruit=s.scouting.recruits.at(-1);roster.push(recruit);spentTransfers+=offer.price;players[players.indexOf(own)]=recruit;}transferGoal=null;}
  if(S.remaining(s)===0){S.report(s,()=>T.generate(),rng,roster);if(strategy==='transfers'){
   const offers=s.scouting.catalog.map(c=>({c,own:players.filter(p=>p.role===c.player.role).sort((a,b)=>T.overall(a)-T.overall(b))[0]})).filter(o=>o.own&&T.overall(o.c.player)>T.overall(o.own)+3).sort((a,b)=>b.c.player.cardLevel-a.c.player.cardLevel);
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
 return {finalRoster:structuredClone(roster),strategy,minutes:Math.round(seconds/60),initial,final:players.map(T.overall),rank:L.progress(league).rank,earnedAP:Math.round(earnedAP),spentAP:Math.round(spentAP),earnedCash:Math.round(earnedCash),spentTransfers,budget:Math.round(s.budget),purchases,rounds};
}
if(require.main===module){for(const strategy of ['balanced','automation','transfers']){const r=simulate(strategy);assert(r.minutes>=55&&r.minutes<=130,'production duration stays within season bounds');assert(r.final.every((ovr,i)=>ovr>=r.initial[i]));assert(r.rounds[3]&&Object.values(r.rounds[3].levels).every(n=>n<10),'no finished department blocks early in the season');if(strategy==='balanced'){assert(Object.values(r.rounds[9].levels).every(n=>n<10),'balanced level tens arrive in the last four fixtures');assert(Object.values(r.rounds.at(-1).levels).filter(n=>n===10).length>=2,'chosen investments can finish before the season ends');}console.log(JSON.stringify({...r,purchases:r.purchases.filter(p=>p.level===10),rounds:r.rounds.map(p=>({round:p.round,minute:p.minute,rank:p.rank,meanOVR:Math.round(p.ovr.reduce((a,b)=>a+b)/7),coach:p.levels.bal_coach,sponsor:p.levels.bal_sponsor,complete:Object.values(p.levels).filter(n=>n===10).length}))}));}}
module.exports={simulate};
