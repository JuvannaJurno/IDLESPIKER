let scenario=null,matchSnapshot=null;
function beginScenario(kind){if(!ready){announce('Karakterler hazırlanıyor.');return}if(!matchSnapshot)matchSnapshot={players,ball,paused,elapsed};players=matchSnapshot.players.map(p=>({...p,x:p.homeX,y:p.homeY,moving:false,hit:0,jump:0,block:0}));paused=false;$('pause').textContent='Duraklat';scenario={kind,time:0};tickScenario(0);announce(({block:'Blok: filede sıçrama ve onaylanan blok pozu.',toss:'Toss: pasörün hücumcuya yüksek pası.',serve:'Servis: arka çizgiden karşı sahaya servis.',spike:'Spike: sıçrayarak karşı sahaya smaç.'})[kind]+' Test tekrar eder; Maça dön ile çık.');}
function endScenario(){if(!matchSnapshot)return;({players,ball,paused,elapsed}=matchSnapshot);matchSnapshot=null;scenario=null;$('pause').textContent=paused?'Devam et':'Duraklat';announce('Maça kaldığı yerden devam ediliyor.');}
function previewArc(from,to,t,height){const u=clamp(t,0,1);ball={state:'preview',x:from.x+(to.x-from.x)*u,y:from.y+(to.y-from.y)*u,z:18+Math.sin(u*Math.PI)*height};}
function tickScenario(dt){scenario.time+=dt;elapsed+=dt;const t=scenario.time%3.4;for(const p of players){p.moving=false;p.hit=0;p.jump=0;p.block=0;p.angle=p.team?Math.PI:0;}
 const setter=players.find(p=>p.team===0&&p.zone===3),hitter=players.find(p=>p.team===0&&p.zone===2),blocker=players.find(p=>p.team===1&&p.zone===3),receiver=players.find(p=>p.team===1&&p.zone===6),server=players.find(p=>p.team===0&&p.zone===1);
 if(scenario.kind==='block'){hitter.x=450;hitter.y=310;blocker.x=535;blocker.y=310;const u=clamp((t-.6)/1.1,0,1);if(t>=.6&&t<1.7){blocker.block=1;blocker.jump=.5*(1-u);hitter.jump=.5*(1-u);}previewArc(hitter,receiver,(t-.65)/1.5,45);}
 if(scenario.kind==='toss'){setter.x=440;setter.y=310;hitter.x=425;hitter.y=440;setter.hit=t<.65?.3:0;previewArc(setter,hitter,(t-.45)/1.6,105);}
 if(scenario.kind==='serve'){server.x=55;server.y=450;server.hit=t<.7?.3:0;previewArc(server,receiver,(t-.55)/1.8,75);}
 if(scenario.kind==='spike'){hitter.x=435;hitter.y=260;receiver.x=790;receiver.y=340;const u=clamp((t-.35)/.9,0,1);if(t>=.35&&t<1.25){hitter.jump=.5*(1-u);hitter.hit=.3;}previewArc(hitter,receiver,(t-.7)/1.1,45);}
 $('touch').textContent='Senaryo · '+scenario.kind.toUpperCase();
}
for(const kind of ['block','toss','serve','spike'])$('test-'+kind).onclick=()=>beginScenario(kind);
$('returnMatch').onclick=endScenario;
const originalRestart=$('restart').onclick;$('restart').onclick=()=>{endScenario();originalRestart()};
