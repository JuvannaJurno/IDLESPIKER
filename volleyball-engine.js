let servingTeam=0,sets=[0,0],rotationCount=[0,0];
const teamName=t=>t?'B':'A';
function formation(team,zone){const cells={1:[180,450],2:[415,450],3:[415,310],4:[415,170],5:[180,170],6:[180,310]},[x,y]=cells[zone];return{x:team?1000-x:x,y:team?620-y:y}}
function assignHomes(){for(const p of players){const h=formation(p.team,p.zone);p.homeX=h.x;p.homeY=h.y}}
function rotateTeam(team){for(const p of players.filter(p=>p.team===team))p.zone=p.zone===1?6:p.zone-1;rotationCount[team]++;assignHomes();history.push({type:'rotation',team});}
function serverPlayer(){return players.find(p=>p.team===servingTeam&&p.zone===1)}
function reset(){players=[];for(let team=0;team<2;team++)for(let i=0;i<6;i++){const h=formation(team,i+1);players.push({team,index:team*6+i,zone:i+1,x:h.x,y:h.y,homeX:h.x,homeY:h.y,phase:i,angle:team?Math.PI:0,moving:false,hit:0,jump:0,block:0})}scores=[0,0];sets=[0,0];rotationCount=[0,0];servingTeam=0;rally=0;history=[];elapsed=0;ball={state:'wait',timer:2};updateScore()}
function updateScore(){$('score').textContent=scores[0]+' : '+scores[1]+' · Set '+sets[0]+'–'+sets[1]}
function awardPoint(winner){const sideout=winner!==servingTeam;scores[winner]++;history.push({type:'point',team:winner,previousServer:servingTeam});if(sideout){rotateTeam(winner);servingTeam=winner}announce(teamName(winner)+' sayı! '+(sideout?'Servis el değiştirdi — saat yönünde rotasyon.':'Aynı oyuncu servise devam ediyor.'));if(scores[winner]>=25&&scores[winner]-scores[1-winner]>=2){sets[winner]++;scores=[0,0];announce(teamName(winner)+' seti kazandı! Yeni set hazırlanıyor.')}updateScore();ball={state:'wait',timer:2.5};}
function launch(from,target,touch,kind='pass'){
 if(kind==='attack'){const blockers=players.filter(p=>p.team!==from.team&&[2,3,4].includes(p.zone)&&Math.abs(p.y-from.y)<85&&Math.abs(p.x-500)<80).sort((a,b)=>Math.abs(a.y-from.y)-Math.abs(b.y-from.y)).slice(0,2);for(const p of blockers){p.jump=.5;p.block=.5;}} 
 const miss=history.filter(e=>e.type==='touch').length>=3&&Math.random()<Number($('mistakes').value)/100;
 let tx=target.homeX,ty=target.homeY;
 if(touch===2){tx=target.team?560:440;ty=310}
 if(touch===3){tx=target.team?575:425;ty=target.zone===2?(target.team?180:440):(target.team?440:180)}
 if(touch===1){tx=clamp(tx+(Math.random()-.5)*80,target.team?610:125,target.team?875:390);ty=clamp(ty+(Math.random()-.5)*80,125,495)}
 if(miss){tx=clamp(tx+(target.team?45:-45),110,890);ty=clamp(ty+40,110,510)}
 const duration=kind==='serve'?1.8:kind==='attack'?1.1:touch===2?1.4:1.5;
 ball={state:'flight',from:{x:from.x,y:from.y},x:from.x,y:from.y,z:18,target,targetX:tx,targetY:ty,touch,t:0,duration,miss,kind,attacker:from};
 $('touch').textContent=(kind==='serve'?'Servis · ':'')+teamName(target.team)+' · '+touch+'/3';
}
function serve(){rally++;const server=serverPlayer(),receivers=players.filter(p=>p.team!==servingTeam&&[1,5,6].includes(p.zone));server.hit=.4;history.push({type:'serve',team:servingTeam,player:server.index,zone:server.zone});launch(server,pick(receivers),1,'serve');announce(teamName(servingTeam)+' · #'+(server.index%6+1)+' servis atıyor.');}
function playerGoal(p){let x=p.homeX,y=p.homeY;
 if(ball.state==='wait'&&p===serverPlayer()){x=p.team?945:55}
 if(ball.state==='flight'){
   if(ball.target===p){if(!ball.miss){x=ball.targetX;y=ball.targetY}else{x=p.homeX+(ball.targetX-p.homeX)*.35;y=p.homeY+(ball.targetY-p.homeY)*.35}}
   else if(p.team===ball.target.team&&ball.touch===1&&p.zone===3){x=p.team?560:440;y=310}
   else if(p.team!==ball.target.team&&ball.touch===3&&[2,3,4].includes(p.zone)){x=p.team?535:465;y=clamp(ball.targetY+(p.zone-3)*38,130,490)}
   else if(p.team!==ball.target.team&&ball.touch===3){x=p.team?780:220;y=clamp(p.homeY*.7+ball.targetY*.3,130,490)}
 }
 return{x,y};
}
function tick(dt){if(paused||!ready)return;elapsed+=dt;
 for(const p of players){const goal=playerGoal(p),dx=goal.x-p.x,dy=goal.y-p.y,d=Math.hypot(dx,dy),step=Math.min(d,180*dt);p.moving=d>1;if(d>1){p.x+=dx/d*step;p.y+=dy/d*step}p.phase+=p.moving?dt*10:0;const lookX=Number.isFinite(ball.x)?ball.x:(p.team?0:1000),lookY=Number.isFinite(ball.y)?ball.y:p.y;p.angle=Math.atan2(lookY-p.y,lookX-p.x);p.hit=Math.max(0,p.hit-dt);p.jump=Math.max(0,p.jump-dt);p.block=Math.max(0,(p.block||0)-dt);}
 if(ball.state==='wait'){ball.timer-=dt;if(ball.timer<=0&&players.every(p=>{const g=playerGoal(p);return Math.hypot(g.x-p.x,g.y-p.y)<3}))serve();return}
 if(ball.state==='drop'){ball.t+=dt;ball.z=Math.max(0,14-50*ball.t);if(ball.t>.85){history.push({type:'drop'});awardPoint(1-ball.target.team)}return}
 ball.t+=dt;const t=Math.min(1,ball.t/ball.duration);ball.x=ball.from.x+(ball.targetX-ball.from.x)*t;ball.y=ball.from.y+(ball.targetY-ball.from.y)*t;ball.z=18+Math.sin(Math.PI*t)*(ball.kind==='attack'?45:ball.touch===3?105:75);
 if(t===1){if(ball.miss||Math.hypot(ball.target.x-ball.targetX,ball.target.y-ball.targetY)>32){ball.state='drop';ball.t=0;announce('Karşılama kaçtı — top yerde!');return}
 const receiver=ball.target,touch=ball.touch;receiver.hit=.4;history.push({type:'touch',team:receiver.team,touch,player:receiver.index});
 if(touch===1){let setter=players.find(p=>p.team===receiver.team&&p.zone===3&&p!==receiver)||players.find(p=>p.team===receiver.team&&p.zone===2&&p!==receiver);announce(teamName(receiver.team)+' · Manşet, pasöre!');launch(receiver,setter,2)}
 else if(touch===2){const hitter=pick(players.filter(p=>p.team===receiver.team&&[2,4].includes(p.zone)&&p!==receiver));announce(teamName(receiver.team)+' · Pasör hücum pasını kaldırdı.');launch(receiver,hitter,3)}
 else{receiver.jump=.5;const defenders=players.filter(p=>p.team!==receiver.team&&[1,5,6].includes(p.zone));announce(teamName(receiver.team)+' · Smaç! Rakip savunmaya geçiyor.');launch(receiver,pick(defenders),1,'attack')}
 }
}
