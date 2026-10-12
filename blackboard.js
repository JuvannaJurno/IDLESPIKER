(function(root){
'use strict';
const labels={receive:'Manşet',serve:'Servis',spike:'Smaç',block:'Blok',set:'Oyun Kurma ve Pas',mental:'Mental',stamina:'Dayanıklılık'};
const matchups=[{key:'receive',against:'serve',roles:['libero','outside'],opRoles:null},{key:'block',against:'spike',roles:['middle','opposite'],opRoles:['outside','opposite']},{key:'spike',against:'block',roles:['outside','opposite'],opRoles:['middle']},{key:'serve',against:'receive',roles:['outside','opposite','setter'],opRoles:['outside']}];
const mean=(ps,k)=>ps.length?ps.reduce((a,p)=>a+p[k],0)/ps.length:0;
function analyze(squad,opponents,R){
 const used=new Set(Object.values(squad.lineup)),active=squad.players.filter(p=>used.has(p.id));
 const needs=matchups.map(m=>{const players=active.filter(p=>m.roles.includes(p.role)),rivals=opponents.filter(p=>!m.opRoles||m.opRoles.includes(p.role));return {...m,players,own:mean(players,m.key),rival:mean(rivals,m.against)}}).sort((a,b)=>(b.rival-b.own)-(a.rival-a.own));
 const need=needs[0],weak=[...need.players].sort((a,b)=>a[need.key]-b[need.key])[0];
 const upgrade=need.rival>need.own?need.players.filter(p=>{const q=R.cardQuote(p);return !q.blocked&&q.gains[need.key]>0}).sort((a,b)=>a[need.key]-b[need.key])[0]:null;
 const swaps=need.players.flatMap(out=>squad.players.filter(p=>!used.has(p.id)&&p.role===out.role&&p[need.key]>out[need.key]).map(incoming=>({out,incoming,delta:incoming[need.key]-out[need.key],slot:Object.keys(squad.lineup).find(k=>squad.lineup[k]===out.id)}))).sort((a,b)=>b.delta-a.delta);
 return {need,weak,upgrade,swap:need.rival>need.own?swaps[0]:null,missing:R.slots.filter(s=>!squad.lineup[s.id])};
}
// Project real card upgrades on copies: no AP is spent and no player is changed.
function project(player,target,R){const p={...player};let cost=0,steps=0;while(R.overall(p)<target&&steps<100){const q=R.cardQuote(p);if(q.blocked||!Object.values(q.gains).some(v=>v>0))break;for(const [k,v]of Object.entries(q.gains))p[k]+=v;p.cardLevel=q.level+1;cost+=q.cost;steps++;}return {cost,steps,overall:R.overall(p),reached:R.overall(p)>=target};}
function transfers(squad,catalog,R){const active=squad.players.filter(p=>Object.values(squad.lineup).includes(p.id));return catalog.filter(c=>!c.hired).map(c=>{const p={...c.player,id:c.id},own=active.filter(a=>a.role===p.role).sort((a,b)=>R.overall(a)-R.overall(b))[0],ovr=R.overall(p);if(!own)return {c,p,ovr,kind:'vacant',score:100};const current=R.overall(own),target=current+3,candidate=project(p,target,R),incumbent=project(own,target,R);const kind=ovr>current?'stronger':candidate.reached&&(!incumbent.reached||candidate.cost<incumbent.cost)?'potential':'pass';return {c,p,own,ovr,current,target,candidate,incumbent,kind,score:kind==='stronger'?80+ovr-current:kind==='potential'?60:0};}).sort((a,b)=>b.score-a.score||a.c.price-b.c.price);}
if(typeof module!=='undefined'&&module.exports){module.exports={analyze,project,transfers};return}
let previous='',detailsOpen=false;const fmt=n=>Math.round(n).toLocaleString('tr-TR'),name=p=>p.name+' '+p.surname;
function show(rows,actions=[],transferRows=null){const signature=JSON.stringify([rows,actions.map(a=>[a.label,a.id]),transferRows]);if(signature===previous)return;previous=signature;const el=document.getElementById('blackboardAdvice'),list=document.createElement('dl'),extra=document.createElement('dl');const detailLabels=new Set(['Karşılaştırma','Ölçüm','Aranan profil','Transfer bedeli','Gelişim alanı']);for(const [label,text,player]of rows){const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;if(player){const link=document.createElement('button');link.type='button';link.className='advice-player-link';link.dataset.player=player.id;link.textContent=player.name;link.setAttribute('aria-label',player.name+' oyuncu kartına git');link.onclick=()=>TeamView.reveal(player.id);dd.append(link,document.createTextNode(text.slice(player.name.length)))}else dd.textContent=text;row.append(dt,dd);(detailLabels.has(label)?extra:list).append(row)}el.replaceChildren(list);if(actions.length){const footer=document.createElement('div');footer.className='advice-actions';for(const a of actions){const b=document.createElement('button');b.type='button';b.textContent=a.label;b.onclick=a.run;footer.append(b)}el.append(footer)}if(extra.childElementCount){const details=document.createElement('details'),summary=document.createElement('summary');details.className='advice-details';details.open=detailsOpen;summary.textContent='Sayıları ve ayrıntıları gör';details.append(summary,extra);details.addEventListener('toggle',()=>{if(details.isConnected)detailsOpen=details.open});el.append(details)}if(transferRows){const section=document.createElement('section');section.className='transfer-opportunities';const title=document.createElement('h3');title.textContent='Transfer olanakları';section.append(title);for(const [label,text]of transferRows){const item=document.createElement('div'),heading=document.createElement('strong'),copy=document.createElement('p');heading.textContent=label;copy.textContent=text;item.append(heading,copy);section.append(item)}el.append(section)}}

function refresh(){
 const bal=LeagueRules.config.bal;document.getElementById('blackboardTitle').textContent=bal?'Teknik Ekip':'Kara Tahta';
 const lead=RoomSystem.blackboard().leadDays,next=LeagueSeason.progress().next,rows=[],actions=[];
 const squad=TeamView.snapshot(),opponents=Array.from({length:6},(_,i)=>TeamRules.opponentStats(next?.round||1,i,bal?'bal':'prologue')),report=analyze(squad,opponents,TeamRules),{need,weak,upgrade,swap}=report;
 if(next){let day=1;try{day=JSON.parse(localStorage.getItem('idle-spiker-main-menu-v1')).day}catch{}const remaining=next.day-day,rival=LeagueRules.teams[next.home===0?next.away:next.home];rows.push(['Sıradaki rakip',rival+' · '+(remaining>0?remaining+' gün sonra':'Maç günü')]);
 if(!lead)rows.push(['Analiz kapalı',bal?'Teknik Ekip’ten Gözlemci veya Rakip Analizi aç.':'Kara Tahta’dan Rakip Analizi Bloğunu aç.']);
 else if(remaining>lead)rows.push(['Rapor tarihi',(next.day-lead)+'. gün']);
 else if(report.missing.length){rows.push(['Eksik kadro',report.missing.map(s=>s.name).join(', ')]);actions.push({label:'Kadroyu tamamla',id:'missing',run:()=>TeamView.compare(report.missing[0].id)});}
 else{rows.push(['Karşılaştırma','Rakip '+labels[need.against]+': '+fmt(need.rival)+' · Bizim '+labels[need.key]+': '+fmt(need.own)],['Ölçüm','Sayılar, bu görevi yapan oyuncuların ortalamasıdır.']);
 if(need.own>=need.rival)rows.push(['Öneri','Şimdilik yükseltme gerekmiyor. AP biriktirebilirsin.']);
 else{
 if(upgrade){const q=TeamRules.cardQuote(upgrade);rows.push(['Öneri',name(upgrade)+' kartını yükselt.',{id:upgrade.id,name:name(upgrade)}],['Neden?',{receive:'Rakibin servislerini karşılamakta zorlanabiliriz.',block:'Rakibin smaçlarını durdurmak için bloğumuzu güçlendirelim.',spike:'Rakibin bloğunu aşmak için hücumumuzu güçlendirelim.',serve:'Servisimizi güçlendirip rakibin karşılamasını zorlaştıralım.'}[need.key]],['Yükseltince',labels[need.key]+' '+upgrade[need.key]+' → '+(upgrade[need.key]+q.gains[need.key])],['Ücret',fmt(q.cost)+' AP'+(q.cost>RoomSystem.balance()?' · '+fmt(q.cost-RoomSystem.balance())+' AP eksik':'')]);}else rows.push(['Öneri','Şu an bu eksiği kart yükselterek kapatamıyoruz. Yedeklere veya transferlere bak.']);
 }
 }
 }else rows.push(['Sezon','Sezon tamamlandı.']);
 const state=RoomSystem.scoutView(),level=bal?RoomRules.count(state,'bal_scout'):0;
 const transferRows=[];
 if(bal){
 if(level<6)transferRows.push(['Kilitli','Gözlemci’yi 6. seviyeye yükselt. Katalogdaki oyuncuların takımına katkısını öğren.']);
 else if(!ScoutRules.available(state))transferRows.push(['Katalog kapalı','Oyuncu Keşfi departmanını aç.']);
 else{
 const options=transfers(squad,state.scouting?.catalog||[],TeamRules),useful=options.filter(o=>o.kind!=='pass');
 if(!options.length)transferRows.push(['Henüz aday yok','Transfer Merkezi’nde yeni kataloğu açtığında öneriler burada görünecek.']);
 else if(!useful.length)transferRows.push(['Öneri','Bu katalogda kadrona belirgin katkı sağlayacak bir fırsat görünmüyor. Bütçeni saklayabilirsin.']);
 for(const o of useful.slice(0,2)){let text='';
 if(o.kind==='vacant')text='Bu pozisyonun boş. '+o.ovr+' OVR ile kadronu tamamlayabilir.';
 if(o.kind==='stronger')text='Şu an daha güçlü: '+o.ovr+' OVR. Bu pozisyondaki '+name(o.own)+' '+o.current+' OVR.';
 if(o.kind==='potential')text='Şimdi '+o.ovr+' OVR; '+name(o.own)+' '+o.current+' OVR. Ama '+fmt(o.candidate.cost)+' AP ile '+o.target+' OVR’ye çıkabilir.'+(o.incumbent.reached?' Mevcut oyuncunu aynı güce çıkarmak '+fmt(o.incumbent.cost)+' AP tutuyor.':' Mevcut oyuncun kamp olmadan bu güce ulaşamıyor.');
 text+=' Transfer: '+fmt(o.c.price)+' bütçe.'+(o.c.price>state.budget?' '+fmt(o.c.price-state.budget)+' bütçe eksik.':'');
 transferRows.push([name(o.p)+(o.kind==='potential'?' · Geliştirmeye değer':''),text]);
 }
 if(useful.some(o=>o.kind==='potential'))transferRows.push(['Hesap notu','AP hesabı bugünkü indirimlerle yapılır; ücretsiz yükseltme şansı hesaba katılmaz.']);
 }
 }
 show(rows,actions,bal?transferRows:null);

}
refresh();setInterval(refresh,1000);
})(globalThis);
