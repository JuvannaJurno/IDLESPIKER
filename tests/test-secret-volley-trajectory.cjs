const assert=require('node:assert/strict'),fs=require('node:fs');
const {create,shot,flightAt,floorTime}=require('../scripts/experiments/secret-volley-model.js');
const rows=[];
for(const team of [0,1])for(const x of [.6,2.2,4.5,6.8,8.4])for(const depth of [1,3.6,6.6,8])for(const power of [.3,.65,1]){
 let landing=null;const m=create({seed:11,mode:'local',assist:false,onEvent(e){if(e.type==='point')landing=e;}}),s=m.state;s.serving=team;
 const p=m.server();p.x=7.2;p.y=team?-.35:18.35;m.aim(team,x,team?18-depth:depth);
 const target={...s.aim[team]},preview=m.preview(team,power);assert(Math.hypot(flightAt(preview,preview.duration).x-target.x,flightAt(preview,preview.duration).y-target.y)<1e-8);
 m.action(team,{power});let predicted=0;
 for(let i=0;i<1500&&s.phase==='rally';i++){
  if(i===8){const future=m.predict(0);predicted=Math.hypot(future.x-target.x,future.y-target.y);assert(predicted<1e-7,'live ground marker predicts the exact eventual landing');}
  m.tick(1/60);
 }
 assert(landing,'a serve must finish');assert.equal(landing.reason,'Top yerde');assert.equal(landing.team,team);
 const error=Math.hypot(landing.landing.x-target.x,landing.landing.y-target.y);assert(error<1e-7,JSON.stringify({team,target,error}));
 rows.push({team,target,power,duration:preview.duration,error,predicted});
}
for(const kind of ['attack','free'])for(const x of [1,4.5,8])for(const y of [9.5,12,16])for(const z of [1.3,2.7,3.1])for(const power of [.3,.65,1]){
 const start={x,y,z},target={x:x<4.5?8:1,y:1.5},arc=shot(start,target,kind,power),t=floorTime(arc),end=flightAt(arc,t);
 assert(Math.abs(end.z)<1e-8);assert(Math.hypot(end.x-target.x,end.y-target.y)<1e-7);assert(Math.abs(t-arc.duration)<1e-8);
 const cross=(9-y)/arc.vy,net=flightAt(arc,cross);assert(net.z>=2.43+.15999,'planned valid shots clear the same physical net they preview');
}
fs.writeFileSync('audits/secret-volley-aim.json',JSON.stringify({serves:rows,maxLandingError:Math.max(...rows.map(r=>r.error)),maxMarkerError:Math.max(...rows.map(r=>r.predicted))},null,2));
console.log('PASS 120 live serves + 162 attack/free arcs: planned aim, airborne guide, exact ground collision, net clearance and landing agree at every power');
