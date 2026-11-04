const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const API=require('../scripts/experiments/death-game-model.js');
const {create,tileAt,tileColor,segmentDistance}=API;
function seedFor(id){for(let seed=1;seed<1000;seed++)if(create({seed}).state.game.id===id)return seed;throw Error(id);}
function aim(m,x,y){const p=m.state.players[0],dx=x-p.x,dy=y-p.y,l=Math.hypot(dx,dy);m.setInput(l>.08?dx/l:0,l>.08?dy/l:0);}
function pilot(m){const h=m.info(),p=m.state.players[0],id=m.state.game.id;
 if(id==='silence'){m.setInput(0,h.light==='green'?-1:0);}
 if(id==='tiles'){const spots=[];for(let r=0;r<4;r++)for(let c=0;c<4;c++)if(tileColor(c,r,h.cycle)===h.safe)spots.push({x:.5+(c+.5)*2.75,y:2+(r+.5)*3});const t=spots.sort((a,b)=>Math.hypot(p.x-a.x,p.y-a.y)-Math.hypot(p.x-b.x,p.y-b.y))[0];aim(m,t.x,t.y);}
 if(id==='clock'){m.setInput(0,0);const a=m.info(m.state.elapsed+.27).angle;if(h.live&&segmentDistance(p.x,p.y,6-Math.cos(a)*11,8-Math.sin(a)*11,6+Math.cos(a)*11,8+Math.sin(a)*11)<.62)m.jump();}
 if(id==='vault'){const t=p.coins>=5?{x:6,y:1.2}:h.tokens.map((t,i)=>({...t,i})).filter(t=>!(p.collected&(1<<t.i))).sort((a,b)=>Math.hypot(p.x-a.x,p.y-a.y)-Math.hypot(p.x-b.x,p.y-b.y))[0];aim(m,t.x,t.y);if(h.presses.some(b=>Math.abs(b.y-p.y)<1.1&&Math.abs(b.x-p.x)<2.1))m.jump();}
 if(id==='tide'){m.setInput(0,0);const r=Math.hypot(p.x-6,p.y-8);if(h.waves.some(w=>!w.warning&&w.radius<r&&r-w.radius<.9))m.jump();}
}
function playRound(m){assert(m.begin());for(let i=0;i<120*30&&m.state.phase==='running';i++){pilot(m);m.tick(1/120);}return m.state.phase;}
function forceTime(m,t){while(m.state.elapsed<t&&m.state.phase==='running')m.tick(1/120);}
const report={games:[],runs:[],faults:[],determinism:null};
// A briefing and an ended trial cannot silently consume time or accept a jump.
{const m=create({seed:1});m.tick(10);assert.equal(m.state.elapsed,0);assert.equal(m.jump(),false);assert.equal(new Set(m.state.deck).size,5);}
assert(new Set(Array.from({length:12},(_,i)=>create({seed:i+1}).state.deck.join('/'))).size>6,'seeds change the random trial order');
// Reachable control-only solutions, with no position changes, immunity, or forced results.
for(const game of API.GAMES){const seeds=[];for(let seed=1;seeds.length<8;seed++)if(create({seed}).state.game.id===game.id)seeds.push(seed);let won=0;
 for(const seed of seeds){const m=create({seed}),phase=playRound(m);if(phase==='cleared')won++;report.games.push({game:game.id,seed,phase,time:m.state.elapsed,cause:m.state.cause,survivors:m.state.players.filter(p=>p.alive).length});assert(m.state.players.every(p=>Number.isFinite(p.x)&&Number.isFinite(p.y)&&p.x>=0&&p.x<=12&&p.y>=0&&p.y<=16));}
 assert(won>=6,`${game.id} should have consistently reachable solutions: ${won}/8`);
}
// Deterministic, natural full runs. Bots are never granted immunity to a hazard.
for(let seed=1;seed<=10;seed++){const m=create({seed});for(let r=0;r<5;r++){playRound(m);if(m.state.phase==='dead'||m.state.phase==='victory')break;assert.equal(m.state.phase,'cleared');assert(m.next());}
 report.runs.push({seed,phase:m.state.phase,cleared:m.state.cleared,time:m.state.runTime,history:m.state.history});}
assert(report.runs.filter(r=>r.phase==='victory').length>=6,'full five-room runs must be winnable');
// Red light catches actual movement, including jumping; the amber window is safe.
{const m=create({seed:seedFor('silence')});m.begin();while(m.info().light!=='amber')m.tick(1/120);m.setInput(1,0);m.tick(.1);assert.equal(m.state.phase,'running');m.setInput(0,0);while(m.info().light!=='red')m.tick(1/120);m.setInput(1,0);m.tick(1/120);assert.equal(m.state.phase,'dead');assert.match(m.state.cause,/Kırmızı/);report.faults.push('red movement');}
{const m=create({seed:seedFor('silence')});m.begin();while(m.info().light!=='red')m.tick(1/120);assert(m.jump());m.tick(1/120);assert.equal(m.state.phase,'dead');report.faults.push('red jump');}
// Physical floor collapse catches standing on the wrong cell, and changes safe cells each cycle.
{const m=create({seed:seedFor('tiles')});m.begin();for(let i=0;i<700&&m.state.phase==='running';i++){const p=m.state.players[0],h=m.info(),tile=tileAt(p.x,p.y);if(tileColor(tile.c,tile.r,h.cycle)===h.safe)m.setInput(1,0);else m.setInput(0,0);m.tick(1/120);}assert.equal(m.state.phase,'dead');report.faults.push('wrong floor');const cells=[];for(let cycle=0;cycle<5;cycle++){const h=m.info(2+cycle*4);cells.push(Array.from({length:16},(_,i)=>tileColor(i%4,Math.floor(i/4),h.cycle)===h.safe).join());}assert.equal(new Set(cells).size,4);}
// Missing the clock, wave and ink mechanics is lethal; no artificial random scoring.
for(const id of ['clock','tide','vault']){const m=create({seed:seedFor(id)});m.begin();forceTime(m,29);assert.equal(m.state.phase,'dead',id);report.faults.push(id+' stationary death');}
// Jump cannot be spammed, direction is bounded, and equal simulated time is frame-rate independent.
{const m=create({seed:seedFor('tide')});m.begin();assert(m.jump());assert.equal(m.jump(),false);m.tick(.1);assert(m.state.players[0].cooldown>1.4);m.setInput(Infinity,NaN);m.tick(.1);assert(Number.isFinite(m.state.players[0].x));}
{const seed=seedFor('silence'),a=create({seed}),b=create({seed});a.begin();b.begin();a.setInput(1,0);b.setInput(1,0);for(let i=0;i<120;i++)a.tick(1/120);for(let i=0;i<60;i++)b.tick(1/60);assert.deepEqual(a.state,b.state);report.determinism='60/120 Hz equal';}
fs.writeFileSync(path.join(__dirname,'../audits/death-game-rules.json'),JSON.stringify(report,null,2));
console.log('PASS Son Işık: five real trial solutions, ten full runs, real hazard failures, bounded inputs and deterministic physics.');
module.exports={pilot};
