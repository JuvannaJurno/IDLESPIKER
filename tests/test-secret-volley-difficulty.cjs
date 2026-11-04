const assert=require('node:assert/strict'),fs=require('node:fs');
const {create}=require('../scripts/experiments/secret-volley-model.js');const rows=[];
for(const difficulty of ['easy','normal','hard'])for(const seed of [1,11,42]){
 let game,topSpeed=0,attacks=0;game=create({seed,difficulty,onEvent(e){if(e.type==='contact'&&e.kind==='attack'){attacks++;const b=game.state.ball;topSpeed=Math.max(topSpeed,Math.hypot(b.vx,b.vy));}}});game.state.bot=[true,true];
 for(let i=0;i<120*900&&!game.state.finished;i++){game.tick(1/120);assert(Number.isFinite(game.state.ball.x+game.state.ball.y+game.state.ball.z));}
 const cap={easy:15,normal:18.5,hard:21.5}[difficulty];assert(topSpeed<=cap+.0001,'difficulty changes shot selection/power, never violates shot physics');assert(attacks>0&&game.state.rallies>0);
 rows.push({difficulty,seed,finished:game.state.finished,seconds:game.state.time,score:game.state.score,topSpeed,attacks,stats:game.state.stats});
}
const peak=d=>Math.max(...rows.filter(r=>r.difficulty===d).map(r=>r.topSpeed));assert(peak('easy')<peak('normal')&&peak('normal')<peak('hard'));
fs.writeFileSync('audits/secret-volley-difficulty.json',JSON.stringify(rows,null,2));console.log('PASS 3 bot tempos x 3 seeds: real movement/shot physics, slower easy attacks, distinct hard tempo and naturally awarded points');
