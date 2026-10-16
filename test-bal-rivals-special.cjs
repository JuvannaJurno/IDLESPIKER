const assert=require('assert'),T=require('./team-rules'),R=require('./room-rules'),B=require('./bal-rules'),L=require('./league-rules'),M=require('./match-rules'),S=require('./scout-rules'),C=require('./camp-rules');
const s=B.enter(R.defaults(),1);s.openDepartments=[2,4];s.budget=1e9;s.instructions=3000;
global.RoomSystem={developmentState:()=>s,trainingDiscount:()=>0};
// Strong clubs keep their identities in both halves of the season.
const strength=id=>Array.from({length:6},(_,i)=>T.overall(T.opponentStats(1,i,'bal',id))).reduce((a,b)=>a+b)/6;
assert(strength(7)>strength(5)&&strength(5)>strength(2)&&strength(2)>strength(1)&&strength(1)>strength(3));
L.configure({mode:'bal',startDay:1});
const legacy=L.normalize({version:3,mode:'bal',startDay:1,results:{'bal1_r1-0-7':[5,3]}});assert.equal(L.progress(legacy).played,1,'played legacy fixtures survive the new season layout');assert.equal(legacy.scheduleVersion,1);const fresh=L.normalize({mode:'bal',startDay:1});assert.equal(fresh.scheduleVersion,2);assert.equal(L.fixtures(5).find(f=>f.ours).away,6);assert.equal(L.fixtures(L.config.matchDays[6]).find(f=>f.ours).away,7);
const winRate=(ourId,theirId)=>{let wins=0;for(let seed=0;seed<300;seed++){const a=Array.from({length:6},(_,i)=>T.opponentStats(1,i,'bal',ourId)),b=Array.from({length:6},(_,i)=>T.opponentStats(1,i,'bal',theirId)),score=M.simulateSet([a,b],'rival-'+seed,'bal');if(score[0]>score[1])wins++;}return wins/300;};
assert(winRate(7,6)>.75,'league favorite consistently threatens weak sides');
// Pity is per catalogue, persists, and an optional held card does not eat the new special.
for(let round=0;round<6;round++){s.instructions+=3000;assert(S.report(s,T.generate,()=>.99));assert(!s.scouting.catalog.some(c=>c.player.transferProfile));}
s.instructions+=3000;assert(S.report(s,T.generate,()=>.99));assert(s.scouting.catalog.some(c=>c.player.transferProfile==='potential'));
const special=s.scouting.catalog.find(c=>c.player.transferProfile),original=JSON.parse(JSON.stringify(special));assert.equal(C.cap(s,special.player),110);assert(S.hold(s,special.id));
const saved=R.normalize(s);assert.equal(saved.scouting.specialMisses,0);assert.equal(saved.scouting.heldId,special.id);
saved.instructions+=3000;assert(S.report(saved,T.generate,()=>.99));assert.deepEqual(saved.scouting.catalog.find(c=>c.id===special.id),original);
const roster=T.generate();assert(S.hire(saved,special.id,roster,T.valid));assert.equal(saved.scouting.recruits[0].transferProfile,'potential');assert.equal(C.cap(saved,saved.scouting.recruits[0]),110);
const late=B.enter(R.defaults(),1);late.openDepartments=[4];late.instructions=80000;late.budget=1e9;late.floors[4]=Array(10).fill('bal_talent');assert(S.report(late,T.generate,()=>0));assert(late.scouting.catalog.some(c=>c.player.transferProfile==='specialist'));assert.equal(S.normalize(late.scouting).catalog.length,late.scouting.catalog.length,'late academy specialists survive normalization');assert(S.hire(late,late.scouting.catalog.find(c=>c.player.transferProfile).id,T.generate(),T.valid));
const max=B.enter(R.defaults(),1);max.openDepartments=[4];max.floors[4]=[...Array(5).fill('bal_contacts')];max.instructions=3000;max.scouting=S.normalize({catalog:[original],heldId:original.id,specialMisses:6});assert(S.report(max,T.generate,()=>.99));assert.equal(max.scouting.catalog.length,8);assert(max.scouting.catalog.some(c=>c.id!==original.id&&c.player.transferProfile),'a held offer cannot remove the guaranteed new special');
// Equal power has equal AP cost regardless of how low the transfer's level is.
const p=T.generate()[0];for(const k of T.trainable)p[k]=45;p.cardLevel=2;const cost=T.cardQuote(p).cost;assert.equal(T.cardQuote({...p,cardLevel:20}).cost,cost);
assert(T.cardQuote({...p,set:60,serve:60,receive:60,spike:60,block:60,stamina:60,mental:60}).cost>cost*4);
console.log('PASS: differentiated rivals, favorite win rate, seventh-catalogue guarantee, held special persistence, recruit cap and power-based AP costs.',{favoriteWinRate:winRate(7,6),strengths:Object.keys(T.balTeams).map(id=>[id,Math.round(strength(Number(id)))])});
