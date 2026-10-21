// Read-only balance experiment. Does not import or change any user's save.
const fs=require('fs'),R=require('./room-rules'),B=require('./bal-rules'),C=require('./camp-rules'),L=require('./league-rules'),M=require('./match-rules'),S=require('./social-studio-rules');
let state=R.defaults();global.RoomSystem={developmentState:()=>state,trainingDiscount:k=>R.trainingDiscount(state,k)};const T=require('./team-rules');
const profiles={active:{check:30,manual:.3},idle:{check:300,manual:0},offline:{check:900,manual:0,offline:true}};
function fastIncome(s,e,random,source){
 if(s.instructions<3500){const g=R.income(s,s.dayProgress===R.dayInstructions(s)-1,random,source);R.applyGain(s,g);s.budget+=g.cash;return;}
 const completed=s.dayProgress===R.dayInstructions(s)-1,auto=source==='auto';let bonus=0;
 if(auto&&e._steady){s.steadyProgress=((s.steadyProgress||0)+1)%10;if(!s.steadyProgress)bonus=e._steady;}
 s.trainingProgress=((s.trainingProgress||0)+1)%5;const critical=random()<e.critChance;
 s.ap+=(auto?e.autoAP:e.clickAP)*(critical?e.critMult:1)+bonus+(!s.trainingProgress?e.repeatAP:0)+(s.dayProgress<R.morningInstructions(s)?e.morningAP:0)+(completed?e.dayAP:0);
 s.instructions++;s.dayProgress=completed?0:s.dayProgress+1;
 if(s.stage==='bal'&&B.departmentOpen(s,2)){s.incomeProgress=((s.incomeProgress||0)+1)%10;if(!s.incomeProgress)s.budget+=e._cash;}
 if(completed)s.budget+=R.dailyBudget(s);
}
function run(profile,seed=41,variant='current'){
 const policy=profiles[profile],rng=M.seeded('idle-audit-'+seed),old=Math.random;Math.random=rng;const players=T.generate();Math.random=old;const line=T.defaults(),team=['o1','s1','p','o2','s2','pc','l'].map(k=>players.find(p=>p.id===line[k]));state=R.defaults();let wall=0;const stages=[];
 for(let division=1;division<=3;division++){
  if(division===2){state=B.enter(state,1);B.openDepartment(state,2);B.openDepartment(state,4);}
  if(division===3){state.division=3;if(variant==='weekly14')state.divisionCalendar=2;state.mediaDepartmentOpen=false;state.instructions=state.dayProgress=state.trainingProgress=state.incomeProgress=0;state.camp.lastDay=1;state.camp.announcedDay=state.camp.opensDay=null;state.camp.entries=state.camp.entries.map(e=>e.status==='complete'?e:{...e,startDay:1,endDay:4});}
  const league=L.normalize(division===1?null:{mode:'bal',division,startDay:1,entryRating:T.seasonEntryRating(team),results:{},scheduleVersion:2,...(division===3&&variant!=='weekly14'?{seasonRounds:28}:{})});let fixtures=L.schedule().filter(f=>f.ours).map(f=>({...f}));
  if(division===3&&variant==='14-rounds')fixtures=fixtures.slice(0,14);
  if(division===3&&variant==='14-spread'){const days=fixtures.map(f=>f.day);fixtures=fixtures.slice(0,14).map((f,i)=>({...f,day:days[Math.round(i*27/13)]}));}
  if(division===3&&variant==='28-compressed')fixtures=fixtures.map((f,i)=>({...f,day:1+Math.round((f.day-1)*.72)}));
  const limit=R.dayInstructions(state),trigger=L.config.matchTrigger,start=wall,events=[],matches=[],samples=[],checks=[],campStarts=[];let next=0,carry=0,lastCheck=-policy.check,firstTwoStar=null,maxSim=0,social={levels:[0,0,0],earnedFollowers:0},job=null,offer=0;
  function mark(kind,detail){events.push({at:wall-start,day:1+Math.floor(state.instructions/limit),kind,...detail});}
  function remaining(){return next>=fixtures.length?0:Math.max(0,(fixtures[next].day-1)*limit+trigger-state.instructions);}
  function decisions(){const day=1+Math.floor(state.instructions/limit);C.update(state,team,day);if(!firstTwoStar&&team.some(p=>C.progress(state,p).count>=4))firstTwoStar=wall-start;
   for(let n=0;n<10;n++){const options=R.catalog.filter(r=>R.count(state,r.id)<R.maxLevel(state,r)&&!R.requirement(state,r.id)&&R.cost(state,r.floor,r.id)<=state.budget*.7).map(r=>({r,cost:R.cost(state,r.floor,r.id)})).sort((a,b)=>a.cost-b.cost);if(!options.length)break;const {r}=!R.count(state,'assistant')?(options.find(x=>x.r.id==='assistant')||options[0]):policy.offline&&!R.count(state,'offline_time')?(options.find(x=>x.r.id==='offline_time')||options[0]):options[0];if(R.count(state,r.id)?R.upgrade(state,r.id):R.purchase(state,r.floor,r.id))mark('investment',{id:r.id});}
   C.update(state,team,day);for(const p of team.filter(p=>C.eligible(state,p)))if(C.enroll(state,p,day)){campStarts.push({at:wall-start,id:p.id,target:C.progress(state,p).count+1});mark('camp',{id:p.id});}
   for(let n=0;n<40;n++){const choices=team.filter(p=>!C.active(state,p)).map(p=>({p,q:T.cardQuote(p)})).filter(x=>!x.q.blocked&&x.q.cost<=state.ap).sort((a,b)=>a.q.cost-b.q.cost);if(!choices.length)break;const {p,q}=choices[0];if(!R.trainingPayment(state,q.cost,()=>1,true).ok)break;for(const [k,v]of Object.entries(q.gains))p[k]+=v;p.cardLevel++;mark('card',{id:p.id,level:p.cardLevel});}
   if(division===3){if(!state.mediaDepartmentOpen&&state.budget>=500){state.budget-=500;state.mediaDepartmentOpen=true;mark('media-open');}
    if(state.mediaDepartmentOpen){for(let n=0;n<3;n++){const choices=social.levels.map((level,i)=>({i,level,cost:S.blockPrice(i,level)})).filter(x=>x.level<(x.i===1?10:5)&&x.cost<=state.budget*.3).sort((a,b)=>a.cost-b.cost);if(!choices.length)break;const {i,cost}=choices[0];state.budget-=cost;social.levels[i]++;mark('social-block',{index:i});}
     if(job&&wall>=job.end){const reward=S.reward(social,job.type,false);social.earnedFollowers+=reward.followers;state.budget+=reward.cash;mark('post',{type:job.type,followers:S.followers(social)});job=null;offer=(offer+1)%3;}
     if(!job){const type=['moment','story','sponsor'][offer],seconds=[60,90,75][offer]/(1+social.levels[0]*.14);job={type,end:wall+seconds};}
    }
   }
   checks.push({at:wall-start,actions:events.filter(e=>e.at===wall-start).length,ap:state.ap,budget:state.budget});
  }
  decisions();
  while(next<fixtures.length&&wall-start<14*86400&&maxSim++<14*86400){
   if(policy.offline&&wall-start>=300){const now=Date.UTC(2026,9,21)+wall*1000;state.lastSeen=now;wall+=policy.check;R.offline(state,now+policy.check*1000,remaining(),fixtures[next]?.id);}
   else {wall++;if(remaining()===0)R.overtime(state,fixtures[next]?.id,Date.UTC(2026,9,21)+(wall-1)*1000,Date.UTC(2026,9,21)+wall*1000);const e=R.effects(state);e._steady=R.value(state,'steady')*(state.stage==='bal'?1.25:1)+B.value(state,'bal_plan');e._cash=B.cash(state);carry+=e.autoRate*(1+(e.doubleChance||0))+policy.manual;let clicks=Math.min(Math.floor(carry),remaining());carry-=Math.floor(carry);while(clicks-->0){fastIncome(state,e,rng,rng()<policy.manual/(e.autoRate*(1+(e.doubleChance||0))+policy.manual)?'manual':'auto');}}
   if(wall-start-lastCheck>=(policy.offline&&wall-start<300?30:policy.check)||(policy.offline&&wall-start>=300)){lastCheck=wall-start;decisions();if(remaining()===0){const f=fixtures[next++];const won=rng()<.5;R.matchAttendance(state,f.id);if(won)R.matchReward(state,f.id,f.round);matches.push({round:f.round,at:wall-start,day:f.day,won});mark('match',{round:f.round});if(job&&job.end<wall)job.end=wall;}
    samples.push({at:wall-start,day:1+Math.floor(state.instructions/limit),round:next,ovr:team.slice(0,6).reduce((s,p)=>s+T.overall(p),0)/6,levels:team.map(p=>p.cardLevel),camps:team.map(p=>C.progress(state,p).count),autoRate:R.effects(state).autoRate,offlineEfficiency:R.effects(state).offlineEfficiency,offlineSeconds:R.effects(state).offlineHours*3600,followers:division===3?S.followers(social):0,remainingBlocks:R.catalog.filter(r=>!R.requirement(state,r.id)&&R.count(state,r.id)<R.maxLevel(state,r)).length});
   }
  }
  const duration=wall-start,core=events.filter(e=>['card','camp','investment','social-block'].includes(e.kind)),gaps=core.map((e,i)=>e.at-(core[i-1]?.at||0)),matchGaps=matches.map((m,i)=>m.at-(matches[i-1]?.at||0));gaps.push(duration-(core.at(-1)?.at||0));
  const result={division,profile,seed,variant,completed:next===fixtures.length,durationSeconds:duration,rounds:next,firstTwoStarSeconds:firstTwoStar,cards:events.filter(e=>e.kind==='card').length,investments:events.filter(e=>e.kind==='investment').length,campStarts:campStarts.length,coreActionsByQuarter:[0,1,2,3].map(i=>core.filter(e=>e.at>=duration*i/4&&e.at<duration*(i+1)/4).length),emptyReturns:checks.filter(c=>!c.actions).length,returns:checks.length,longestCoreGapSeconds:Math.max(...gaps),lastCoreActionSeconds:core.at(-1)?.at,matchGapSeconds:{min:Math.min(...matchGaps),median:[...matchGaps].sort((a,b)=>a-b)[Math.floor(matchGaps.length/2)],max:Math.max(...matchGaps)},final:samples.at(-1),samples,events,matches};stages.push(result);if(!result.completed){console.log(JSON.stringify({...result,samples:undefined,events:undefined,matches:undefined}));break;}console.log(JSON.stringify({...result,samples:undefined,events:undefined,matches:undefined}));
 }
 return {profile,seed,variant,stages};
}
if(require.main===module){const variant=process.env.PACING_VARIANT||'current',runs=[];for(const profile of (process.env.PACING_PROFILE||'active,idle,offline').split(','))for(const seed of (process.env.PACING_SEEDS||'41').split(',').map(Number))runs.push(run(profile,seed,variant));fs.mkdirSync('audits',{recursive:true});fs.writeFileSync('audits/idle-pacing-'+variant+'.json',JSON.stringify({method:'Economy from defaults; real room/card/camp/offline rules. Online decision cadence 30s / 5m; offline returns 15m after 5m online bootstrap per stage. Match results 50% fixed RNG, instant resolution; promotion assumed for economy audit. No transfers, manual stats or paid gains. Social uses production durations and explicit publication at returns; match-time publication delays approximated.',runs},null,2));}
module.exports={run,fastIncome};
