const fs=require('fs');let s=fs.readFileSync('match-template.html','utf8');
s=s.replace("const duration=kind==='serve'?1.8:kind==='attack'?1.1:touch===2?1.4:1.5;","const duration=kind==='serve'?1.8:kind==='attack'?1.1:touch===3?1.65:1.4;");
s=s.replace("$('touch').textContent=(kind===", "if(touch===3&&!miss){ball.runStart={x:target.x,y:target.y};ball.runDuration=1.15;target.phase=0;}\n $('touch').textContent=(kind===");
s=s.replace("if(ball.target===p){if(!ball.miss){x=ball.targetX;y=ball.targetY}","if(ball.target===p){if(!ball.miss){x=ball.targetX;y=ball.targetY;if(ball.touch===3&&ball.runStart&&!ball.spikePrepared){const u=clamp(ball.t/ball.runDuration,0,1),progress=u*u*(3-2*u);x=ball.runStart.x+(x-ball.runStart.x)*progress;y=ball.runStart.y+(y-ball.runStart.y)*progress;}} ");
s=s.replace('x=p.team?665:335;y=p.homeY','x=p.team?705:295;y=p.homeY');
s=s.replace('p.angle=Math.atan2(lookY-p.y,lookX-p.x);','p.angle=approachingSpike(p)?(p.team?Math.PI:0):Math.atan2(lookY-p.y,lookX-p.x);');
s=s.replace('ball.t>=ball.duration-.3','ball.t>=ball.duration-.3&&Math.hypot(ball.target.x-ball.targetX,ball.target.y-ball.targetY)<5');
s=s.replace('ctx.rotate(p.angle);ctx.scale(1.35,1.35);','if(approachingSpike(p)&&p.moving)ctx.translate(0,-Math.abs(Math.sin(p.phase))*2.5);ctx.rotate(p.angle);ctx.scale(1.35,1.35);');
fs.writeFileSync('match-template.html',s);
