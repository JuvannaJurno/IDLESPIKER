(function(root){
'use strict';
const labels={receive:'Manşet',serve:'Servis',spike:'Smaç',block:'Blok',set:'Oyun Kurma ve Pas',mental:'Mental',stamina:'Dayanıklılık'};
const matchups=[{key:'receive',against:'serve',roles:['libero','outside'],opRoles:null},{key:'block',against:'spike',roles:['middle','opposite'],opRoles:['outside','opposite']},{key:'spike',against:'block',roles:['outside','opposite'],opRoles:['middle']},{key:'serve',against:'receive',roles:['outside','opposite','setter'],opRoles:['outside','libero']}];
const mean=(ps,k)=>ps.length?ps.reduce((a,p)=>a+p[k],0)/ps.length:0;
function analyze(squad,opponents,R){
 const activeSlots=R.activeSlots?.()||R.slots,validSlots=activeSlots.filter(slot=>squad.players.some(p=>p.id===squad.lineup[slot.id]&&p.role===slot.role)),used=new Set(validSlots.map(slot=>squad.lineup[slot.id])),active=squad.players.filter(p=>used.has(p.id));
 const needs=matchups.map(m=>{const players=active.filter(p=>m.roles.includes(p.role)),rivals=opponents.filter(p=>!m.opRoles||m.opRoles.includes(p.role));return {...m,players,own:mean(players,m.key),rival:mean(rivals,m.against)}}).sort((a,b)=>(b.rival-b.own)-(a.rival-a.own));
 const need=needs[0],weak=[...need.players].sort((a,b)=>a[need.key]-b[need.key])[0];
 const upgrade=need.rival>need.own?need.players.filter(p=>{const q=R.cardQuote(p);return !q.blocked&&q.gains[need.key]>0}).sort((a,b)=>a[need.key]-b[need.key])[0]:null;
 const swaps=need.players.flatMap(out=>squad.players.filter(p=>!used.has(p.id)&&p.role===out.role&&p[need.key]>out[need.key]).map(incoming=>({out,incoming,delta:incoming[need.key]-out[need.key],slot:Object.keys(squad.lineup).find(k=>squad.lineup[k]===out.id)}))).sort((a,b)=>b.delta-a.delta);
 return {need,weak,upgrade,swap:need.rival>need.own?swaps[0]:null,missing:activeSlots.filter(slot=>!validSlots.includes(slot))};
}
// Project real card upgrades on copies: no AP is spent and no player is changed.
function project(player,target,R){const p={...player};let cost=0,steps=0;while(R.overall(p)<target&&steps<100){const q=R.cardQuote(p);if(q.blocked||!Object.values(q.gains).some(v=>v>0))break;for(const [k,v]of Object.entries(q.gains))p[k]+=v;p.cardLevel=q.level+1;cost+=q.cost;steps++;}return {cost,steps,overall:R.overall(p),reached:R.overall(p)>=target};}
function transfers(squad,catalog,R){const active=squad.players.filter(p=>Object.values(squad.lineup).includes(p.id));return catalog.filter(c=>!c.hired).map(c=>{const p={...c.player,id:c.id},own=active.filter(a=>a.role===p.role).sort((a,b)=>R.overall(a)-R.overall(b))[0],ovr=R.overall(p);if(!own)return {c,p,ovr,kind:'vacant',score:100};const current=R.overall(own),target=current+3,candidate=project(p,target,R),incumbent=project(own,target,R);const temporarilyAway=/kampta/i.test(R.cardQuote(own).blocked||'');const kind=ovr>current?'stronger':'pass';return {c,p,own,ovr,current,target,candidate,incumbent,kind,score:kind==='stronger'?80+ovr-current:kind==='potential'?60:0};}).sort((a,b)=>b.score-a.score||a.c.price-b.c.price);}
function transferBrief(o){
 if(o.kind==='vacant')return 'Bu pozisyonda seçili oyuncun yok. Kadrodaki boşluğu doldurabilir.';
 const own=o.own.name+' '+o.own.surname;
 if(o.kind==='stronger')return own+' ile aynı pozisyonda oynuyor ve şu an daha güçlü.';
 return own+' ile karşılaştırıldığında şu an ek OVR sağlamıyor.';
}
if(typeof module!=='undefined'&&module.exports){module.exports={analyze,project,transfers,transferBrief};return}
const advicePanel=document.querySelector('.team-blackboard');advicePanel.hidden=true;document.querySelector('#teamPanel .lineup-banner').before(advicePanel);
let previous='',detailsOpen=false,transferCacheKey='',transferCache=[];const fmt=n=>Math.round(n).toLocaleString('tr-TR'),name=p=>p.name+' '+p.surname;
function showLegacy(rows,actions=[],transferRows=null){advicePanel.hidden=!rows.length&&!actions.length;const signature=JSON.stringify([rows,actions.map(a=>[a.label,a.id]),transferRows]);if(signature===previous)return;previous=signature;const el=document.getElementById('blackboardAdvice'),list=document.createElement('dl'),extra=document.createElement('dl');const detailLabels=new Set(['Karşılaştırma','Ölçüm','Aranan profil','Transfer bedeli','Gelişim alanı']);for(const [label,text,player]of rows){const row=document.createElement('div'),dt=document.createElement('dt'),dd=document.createElement('dd');dt.textContent=label;if(player){const link=document.createElement('button');link.type='button';link.className='advice-player-link';link.dataset.player=player.id;link.textContent=player.name;link.setAttribute('aria-label',player.name+' oyuncu kartına git');link.onclick=()=>TeamView.reveal(player.id);dd.append(link,document.createTextNode(text.slice(player.name.length)))}else dd.textContent=text;row.append(dt,dd);(detailLabels.has(label)?extra:list).append(row)}el.replaceChildren(list);if(actions.length){const footer=document.createElement('div');footer.className='advice-actions';for(const a of actions){const b=document.createElement('button');b.type='button';b.textContent=a.label;b.onclick=a.run;footer.append(b)}el.append(footer)}if(extra.childElementCount){const details=document.createElement('details'),summary=document.createElement('summary');details.className='advice-details';details.open=detailsOpen;summary.textContent='Sayıları ve ayrıntıları gör';details.append(summary,extra);details.addEventListener('toggle',()=>{if(details.isConnected)detailsOpen=details.open});el.append(details)}if(transferRows?.length){const section=document.createElement('section');section.className='transfer-opportunities';const title=document.createElement('h3');title.textContent='Transfer olanakları';section.append(title);for(const [label,text,offer]of transferRows){const item=document.createElement('div'),heading=document.createElement('strong'),copy=document.createElement('p');heading.textContent=label;for(const [i,part] of text.split(/<strong>(.*?)<\/strong>/g).entries()){if(i%2){const emphasis=document.createElement('strong');emphasis.textContent=part;copy.append(emphasis)}else copy.append(document.createTextNode(part))}item.append(heading,copy);if(offer){item.className='transfer-tip';if(offer.candidateId){item.tabIndex=0;item.setAttribute('role','button');item.setAttribute('aria-label',label+' oyuncusunu göster');item.onclick=()=>window.Scouting?.reveal(offer.candidateId);item.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();item.click()}}}const price=document.createElement('span');price.className='transfer-tip-price';price.textContent='Transfer: '+NumberUI.compact(offer.price)+' bütçe';item.append(price);if(offer.missing>0){const missing=document.createElement('small');missing.className='transfer-tip-missing';missing.textContent=NumberUI.compact(offer.missing)+' bütçe eksik';item.append(missing)}}item.classList.add('has-advice-title');section.append(item)}document.getElementById('scoutAdvice')?.replaceChildren(section)}}

function show(rows,actions,transferRows,context){showLegacy(rows,actions,transferRows);window.BoardPresentation?.render(document.getElementById('blackboardAdvice'),context);}
function refresh(){
 if(document.hidden||(document.getElementById('teamPanel').hidden&&!document.getElementById('scoutDialog')?.open))return;
 const bal=LeagueRules.config.bal;document.getElementById('blackboardTitle').textContent=LeagueRules.config.division>=3?'Sportif Direktörlük':bal?'Teknik Ekip':'Kara Tahta';
 const department=LeagueRules.config.division>=3?'Sportif Direktörlük':bal?'Teknik Ekip':'Kara Tahta',lead=RoomSystem.blackboard().leadDays,next=LeagueSeason.progress().next,rows=[],actions=[];
 const squad=TeamView.snapshot(),opponents=next?MatchIntro.opponents(next):[],report=analyze(squad,opponents,TeamRules),{need,weak,upgrade,swap}=report;
 if(next){let day=1;try{day=JSON.parse(localStorage.getItem('idle-spiker-main-menu-v1')).day}catch{}const remaining=next.day-day,rival=LeagueRules.teams[next.home===0?next.away:next.home];rows.push(['Sıradaki rakip',rival+' · '+(remaining>0?remaining+' gün sonra':'Maç günü')]);
 if(!lead)rows.push(['Rakip raporu',department+' bölümündeki '+(bal?'Gözlemci':'Rakip Analizi')+' bloğunu geliştirerek açabilirsin.']);
 else if(remaining>lead)rows.push(['Rakip raporu',(next.day-lead-day)+' gün sonra hazır. O zamana kadar oyuncularını geliştirebilirsin.']);
 else if(report.missing.length){rows.push(['Eksik kadro',report.missing.map(s=>s.name).join(', ')]);actions.push({label:'Kadroyu tamamla',id:'missing',run:()=>TeamView.compare(report.missing[0].id)});}
 else{rows.push(['Karşılaştırma','Rakip '+labels[need.against]+': '+fmt(need.rival)+' · Bizim '+labels[need.key]+': '+fmt(need.own)],['Ölçüm','Sayılar, bu görevi yapan oyuncuların ortalamasıdır.']);
 if(need.own>=need.rival)rows.push(['Öneri','Rakibe göre belirgin bir eksiğimiz görünmüyor. AP’yi sonraki maç için saklayabilirsin.']);
 else{
 if(upgrade){const q=TeamRules.cardQuote(upgrade),missing=Math.max(0,q.cost-RoomSystem.balance()),reason={receive:'Rakibin servislerine karşı manşetimizi güçlendirir.',block:'Rakibin smaçlarına karşı bloğumuzu güçlendirir.',spike:'Rakibin bloğuna karşı hücumumuzu güçlendirir.',serve:'Servisimizi güçlendirip rakibin top karşılamasını zorlaştırır.'}[need.key];rows.push(['Öneri',name(upgrade)+(missing?' kartını yükseltmek için '+fmt(missing)+' AP daha biriktir. ':' kartını yükselt. ')+reason,{id:upgrade.id,name:name(upgrade)}],['Yükseltme',labels[need.key]+' '+upgrade[need.key]+' → '+(upgrade[need.key]+q.gains[need.key])],['Gereken AP',fmt(q.cost)]);}else rows.push(['Öneri',labels[need.key]+' için '+[...new Set(need.players.map(p=>TeamRules.roles[p.role].toLocaleLowerCase('tr-TR')))].join(' veya ')+' seçeneklerine bak.']);
 }
 }
 }else rows.push(['Sezon','Sezon tamamlandı.']);

 const state=RoomSystem.scoutView(),level=bal?RoomRules.count(state,'bal_scout'):0;
 const transferRows=[];
 if(bal&&document.getElementById('scoutDialog')?.open){
 if(level<6)transferRows.push(['Kilitli',department+' bölümündeki Gözlemci bloğunu 6. seviyeye getir. Burada transfer adaylarını kadronla karşılaştırabilirsin.']);
 else if(!ScoutRules.available(state))transferRows.push(['Katalog kapalı',(LeagueRules.config.division>=3?'Sportif Direktörlük bölümünden oyuncu keşfini aç.':'Oyuncu Keşfi departmanını aç.')]);
 else{
 const cacheKey=JSON.stringify([squad.lineup,squad.players.map(p=>[p.id,p.role,p.cardLevel,...TeamRules.trainable.map(k=>p[k])]),state.scouting?.catalog,state.floors,RoomSystem.developmentState().camp]);if(cacheKey!==transferCacheKey){transferCacheKey=cacheKey;transferCache=transfers(squad,state.scouting?.catalog||[],TeamRules)}const options=transferCache,useful=options.filter(o=>o.kind!=='pass');
 if(!options.length)transferRows.push(['Henüz aday yok','Oyuncu Merkezi’nde yeni kataloğu açtığında öneriler burada görünecek.']);
 else if(!useful.length)transferRows.push(['Öneri','Bu katalogda kadrona belirgin katkı sağlayacak bir fırsat görünmüyor. Bütçeni saklayabilirsin.']);
 for(const o of useful.slice(0,2)){
 const brief=transferBrief(o);
 transferRows.push([name(o.p)+' · '+TeamRules.roles[o.p.role],brief,{candidateId:o.c.id,price:o.c.price,missing:Math.max(0,o.c.price-state.budget)}]);
 }

 }
 }
 let currentDay=1;try{currentDay=JSON.parse(localStorage.getItem('idle-spiker-main-menu-v1')||'{}').day||1;}catch{}show(rows,actions,bal?transferRows:null,{rows,report,squad,next,opponents,lead,department,bal,division:LeagueRules.config.division||1,teamId:next?(next.home===0?next.away:next.home):0,remaining:next?next.day-currentDay:0,labels});

}
function audienceComment(){
 const next=LeagueSeason.progress().next,lead=RoomSystem.blackboard().leadDays;if(!next||!lead)return null;
 let day=1;try{day=JSON.parse(localStorage.getItem('idle-spiker-main-menu-v1')).day||1}catch{}
 if(next.day-day>lead)return null;
 const bal=LeagueRules.config.bal,rival=LeagueRules.teams[next.home===0?next.away:next.home];
 const opponents=MatchIntro.opponents(next);
 const report=analyze(TeamView.snapshot(),opponents,TeamRules),{need,upgrade}=report;
 if(report.missing.length)return 'Maç yaklaşıyor, '+report.missing[0].name.toLocaleLowerCase('tr-TR')+' pozisyonunu da doldursak iyi olacak.';
 if(need.own>=need.rival)return rival+' karşısında kadromuz iyi görünüyor. Bence AP’yi şimdilik biriktirelim.';
 const reasons={receive:rival+' servisleriyle zorlayabilir. ',block:rival+' hücumda güçlü. ',spike:rival+' bloğunu aşmak kolay olmayacak. ',serve:rival+' manşette iyi. '};
 if(upgrade)return reasons[need.key]+name(upgrade)+' '+{receive:'manşette',block:'blokta',spike:'smaçta',serve:'serviste'}[need.key]+' biraz gelişirse işimiz kolaylaşır.';
 return reasons[need.key]+'Şu an uygun bir kart yükseltmesi yok. Yedeklerden ya da transferden destek lazım gibi.';
}
window.BoardAdvice={refresh,audienceComment};refresh();setInterval(refresh,1000);
})(globalThis);
