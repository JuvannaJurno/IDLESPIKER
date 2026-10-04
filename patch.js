const fs = require('fs');
const file = 'room-rules.js';
let code = fs.readFileSync(file, 'utf8');

// Replace catalog
code = code.replace(/const catalog=\[\s+\[[\s\S]*?\]\n\]\.map\(\(\[id,floor,name,icon,values,describe\]\)=>(\{id,floor,name,icon,values,describe\}\)\);/m, `const catalog=[
 ['warmup',0,'Temel Isınma','↗',[5,15,40],v=>'Top bu departmana girdiğinde üretilen taban AP miktarını +'+v+' artırır.'],
 ['crit_smash',0,'Kritik Smaç','◎',[{c:.1,m:2},{c:.15,m:3},{c:.2,m:4}],v=>'Topun %'+Math.round(v.c*100)+' ihtimalle '+v.m+'x AP üretmesini sağlar.'],
 ['echo',0,'Çift Dokunuş (Yankı)','◗',[.05,.1,.15],v=>'Topun %'+Math.round(v*100)+' şansla içeride iki kez sekerek çift AP üretme ihtimalini belirler.'],
 ['assistant',1,'Otomatik Asistan','♟',[.2,.33,1],v=>'Saniyede '+v.toLocaleString('tr-TR',{maximumFractionDigits:2})+' talimat. Sen yokken de en az 2 saat AP biriktirir.'],
 ['offline_time',1,'Çevrimdışı Mesai','◷',[2,6,12],v=>'Asistanın çevrimdışı AP biriktirme süresini '+v+' saate çıkarır.'],
 ['steady',1,'Düzenli Çalışma','↻',[10,25,60],v=>'Asistanın her 10. talimatında +'+v+' AP kazandırır.'],
 ['meal',2,'Dengeli Öğün','◒',[50,150,400],v=>'100 talimatla tamamlanan her oyun gününde +'+v+' AP.'],
 ['energy_drink',2,'Enerji İçeceği','▤',[.1,.2,.3],v=>'Top geçerken %'+Math.round(v*100)+' şansla normalin 5 katı AP bırakır.'],
 ['sugar_boost',2,'Şeker Takviyesi','✚',[1.5,2,2.5],v=>'Diğer tüm departmanlardan alınacak AP miktarını '+v+' katına çıkarır.'],
 ['collect',3,'Top Toplayıcı Gençler','●',[.05,.1,.15],v=>'Talimatlar odalar arasında %'+Math.round(v*100)+' daha hızlı ilerler.'],
 ['coordinate',3,'Hızlı Koordinasyon','⇣',[.1,.2,.3],v=>'Talimatların odalarda bekleme süresini %'+Math.round(v*100)+' azaltır.'],
 ['rhythm',3,'Kesintisiz Ritim','↻',[.1,.2,.3],v=>'Talimat turunun sonundaki beklemeyi %'+Math.round(v*100)+' azaltır.'],
 ['slots',4,'Temel Malzemeler','▣',[1,2,3],v=>'Güçlendirmeler için '+v+' yer açar.'],
 ['balls',4,'Kaliteli Toplar','●',[.03,.06,.1],v=>'Genel AP kazancını %'+Math.round(v*100)+' artırır.']
].map(([id,floor,name,icon,values,describe])=>({id,floor,name,icon,values,describe}));`);

// Update normalize
code = code.replace(/return \(Array\.isArray\(raw\.floors\[f\]\)\?raw\.floors\[f\]:\[\]\)\.map\(id=>\(id==='offline'\|\|id==='reach'\)\?'steady':id\)/, `return (Array.isArray(raw.floors[f])?raw.floors[f]:[]).map(id=>{if(id==='offline'||id==='reach')return 'steady';if(id==='basic')return 'warmup';if(id==='tempo')return 'crit_smash';if(id==='focus')return 'echo';if(id==='shift')return 'offline_time';if(id==='drink')return 'energy_drink';if(id==='diet')return 'sugar_boost';return id;})`);

// Update effects
code = code.replace(/function effects\(s\)\{[\s\S]*?\}\n/, `function effects(s){const base=4+(progress(s).level-1)*.5,multiplier=(1+value(s,'balls'))*value(s,'sugar_boost',1),critSmash=value(s,'crit_smash',{c:0,m:1}),energyDrink=value(s,'energy_drink',0),baseAP=(base+value(s,'warmup'))*multiplier;return {clickAP:baseAP,autoAP:baseAP,baseAP,critChance:critSmash.c,critMult:critSmash.m,echoChance:value(s,'echo'),autoRate:value(s,'assistant'),offlineHours:count(s,'assistant')?value(s,'offline_time',2):0,dayAP:value(s,'meal'),energyDrinkChance:energyDrink,slots:value(s,'slots'),travel:2400/(1+value(s,'collect')),transition:250*(1-value(s,'coordinate')),rest:400*(1-value(s,'rhythm'))}}\n`);

// Update income
code = code.replace(/function income\(s,completed,random=Math\.random,source='manual'\)\{[\s\S]*?return \{ap,critical,bonus,dayBudget,levelAP,level,leveledUp:level>previous\};\n\}/, `function income(s,completed,random=Math.random,source='manual'){const e=effects(s);let bonus=0;if(source==='auto'&&count(s,'steady')>0){s.steadyProgress=((s.steadyProgress||0)+1)%10;if(s.steadyProgress===0)bonus=value(s,'steady');}let baseAP=e.baseAP,echoCount=1,critMult=1,energyMult=1,isCrit=false;if(random()<e.echoChance)echoCount=2;if(random()<e.critChance){critMult=e.critMult;isCrit=true;}if(random()<e.energyDrinkChance){energyMult=5;isCrit=true;}let ap=(baseAP*critMult*energyMult*echoCount)+(completed?e.dayAP:0)+bonus;const previous=progress(s).level;s.instructions=Math.min(Number.MAX_SAFE_INTEGER,(s.instructions||0)+1);const level=progress(s).level;s.ap+=ap;const dayBudget=completed?20:0;s.budget+=dayBudget;return {ap,critical:isCrit,bonus,dayBudget,level,leveledUp:level>previous};}`);

// Update offline
code = code.replace(/function offline\(s,now=Date\.now\(\)\)\{[\s\S]*?return ap;\n\}/, `function offline(s,now=Date.now()){if(!Number.isFinite(now)||now<=s.lastSeen)return 0;const e=effects(s),seconds=Math.min((now-s.lastSeen)/1000,e.offlineHours*3600);const total=seconds*e.autoRate+(s.autoCarry||0),clicks=Math.floor(total);s.autoCarry=total-clicks;let bonus=0;if(count(s,'steady')){const tally=(s.steadyProgress||0)+clicks;bonus=Math.floor(tally/10)*value(s,'steady');s.steadyProgress=tally%10;}const avgCritMult=1+e.critChance*(e.critMult-1),avgEnergyMult=1+e.energyDrinkChance*4,avgEchoMult=1+e.echoChance,avgClickAP=e.baseAP*avgCritMult*avgEnergyMult*avgEchoMult;const ap=clicks*avgClickAP+bonus;s.ap+=ap;s.lastSeen=now;return ap;}`);

fs.writeFileSync(file, code);
