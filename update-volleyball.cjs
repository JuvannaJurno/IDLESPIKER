const fs=require('fs');const file='match-template.html';let s=fs.readFileSync(file,'utf8');const start=s.indexOf('function launch('),end=s.indexOf('function court()',start);s=s.slice(0,start)+fs.readFileSync('volleyball-engine.js','utf8')+'\n'+s.slice(end);
s=s.replace('for(const part of LAYOUT){ctx.save();','for(const part of LAYOUT){if(part.id.startsWith(\'arm-\')&&!p.moving)continue;ctx.save();');
s=s.replace('ctx.rotate(p.angle-Math.PI);','ctx.translate(0,-Math.sin(p.jump/.5*Math.PI)*12);ctx.rotate(p.angle-Math.PI);');
s=s.replace("String(p.index%6+1)","String(p.index%6+1)+' · P'+p.zone");
s=s.replace('Otomatik 6’ya 6 oyun:', 'Servis hakkını kazanan takım saat yönünde döner; aynı takım sayı aldığında aynı oyuncu servis atar. Set: 25 sayı ve en az 2 fark. Otomatik 6’ya 6 oyun:');
fs.writeFileSync(file,s);
