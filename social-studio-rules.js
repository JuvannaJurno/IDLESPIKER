(function(root){
'use strict';
const contents=[
 {id:'moment',title:'Kulüpten bir an',seconds:45,followers:24,label:'Kısa klip · Düzenli büyüme'},
 {id:'story',title:'Oyuncu hikâyesi',seconds:100,followers:78,label:'Röportaj · Daha fazla takipçi'},
 {id:'sponsor',title:'Sponsor paylaşımı',seconds:120,followers:0,label:'Reklam · Doğrudan bütçe'}
];
const sponsors=[{at:100,name:'Mahalle Esnafı'},{at:1000,name:'File Spor'},{at:5000,name:'Tribün Market'},{at:15000,name:'Rota Spor'},{at:40000,name:'Arena'}];
const trainingCaptions=[
 'Koç “Bugün sıçrama çalışacağız” dediğinde sivil havacılıktan kalkış izni istiyoruz. Çünkü bizim smaçörler havaya kalktığında oralarda oksijen seviyesi biraz düşüyor.',
 'Smaç sırasında 10 dakika bekle, sıra tam sana gelsin, pasör hayatının en kötü pasını atsın, sen de mecburen topu fileye gömüp bütün salonun sana acıyarak bakmasını izle.',
 'Koç “Bugün yoğun defans ve plonjon çalışacağız” dediğinde, takımın yarısının aniden eski kronik diz ve bel sakatlıklarının nüksetmesi.',
 'Antrenman sonu top toplama anı geldiğinde, herkesin bir anda tuvalete gitmesi veya çok acil telefon görüşmelerinin ortaya çıkması... Sahanın ortasında üç kişi 50 tane topla çaresizce bakışıyoruz.',
 'Kendi aramızda yaptığımız 6’ya 6 antrenman maçları, ligdeki resmi maçlardan çok daha zor geçiyor. Çünkü bu dünyada bizi yenebilecek tek takım yine biziz.',
 'Servis antrenmanında bantlara hedef almak yerine, bilerek salonun tavanındaki o sarkan garip kabloya nişan almak. Bence gerçek isabet yeteneği budur.'
];
const sponsorCaptions=[
 'Şifa Fizik Tedavi Merkezi: Plonjon atarken beli kilitlenen liberoların ve kronik diz ağrısı çeken orta oyuncuların resmi sponsoru.',
 'Net Görüş Optik: Topun içeride mi dışarıda mı olduğunu bir türlü göremeyen hakemlerimizin ve “pas çok kötüydü” diye ağlayan smaçörlerimizin resmi destekçisi.',
 'Kulüp Başkanının Kayınçosunun Şirketi: Sadece formalarda adımız yazsın diye mahalle liginde para verdik, voleybolun kurallarını hala tam bilmiyoruz ve 2. Ligi beklemiyorduk. Başarılar kızlar.',
 'Titan Ortopedi: Karşı takımın bizim smaçları defans yapmaya çalışırken yaşadığı bilek burkulmalarının 1 numaralı adresi.',
 'Zirve Havayolları: Smaçörlerimiz havaya sıçradığında o kadar uzun süre asılı kalıyorlar ki, hosteslerimiz kendilerine çay ve kek servisi yapıyor.',
 'Kraliyet Enerji İçecekleri: Rakip takım molalarda çaresizce taktik konuşur, bizimkiler ise birer yudum alıp sıradaki kurbanlarının kim olacağına karar verir.'
].map(text=>text+' #işbirliği');
const playerQuotes=[
 ['uncertain','libero','Libero formamın farklı renkte olması çok havalı duruyor olabilir ama asıl sebebi takımın geri kalanının top için yere atlamaya tenezzül bile etmemesi.'],
 ['uncertain','outside','Top kesinlikle içerideydi. Çizgi hakemi miyop, pasör kısa attı, salonun ışığı gözümü aldı, ayakkabımın bağcığı gevşemişti ve zaten Merkür retrosu var. Yoksa ben o smacı kesin sayı yapmıştım.'],
 ['uncertain','middle','Maç boyunca rakip bloğu şaşırtmak için 45 kere boşuna sıçradım. 46. sıçrayışımda pas nihayet bana geldi ve topu ıskaladım. Hepinize iyi akşamlar.'],
 ['uncertain','middle','Orta oyuncu olarak takımdaki en büyük başarım, pasörümüzün bana verecekmiş gibi yaptığı ama aslında köşeye attığı o paslarda harika bir oyunculuk sergilemem. Kesinlikle topun bana geleceğini düşündüğümden değil.'],
 ['uncertain',null,'Antrenör maçtan önce “Bugün herkes sahada savaşacak” dedi. İlk sette yere düşen bir top yüzünden libero ve pasör çaprazı az daha birbirini yiyordu. Kiminle savaşmamız gerektiğini de söylemeliydi.'],
 ['uncertain',null,'Isınmalarda omuzlarımı ısıtmak için yaptığım o havalı kol çevirme hareketleri, maç boyunca yapacağım en estetik hareket olarak kalacak.'],
 ['confident','middle','Rakip smaçör havaya sıçradığında file üstünde göz göze geldik. O an oradan geçemeyeceğini o da anladı ama fizik kuralları gereği inemiyordu. Sırf ayıp olmasın diye blokladım.'],
 ['confident','outside','Servis kullanmak için topu elime aldığımda, karşı tarafın defansında yaşanan o sessiz panik ve birbirlerine “sen al” bakışları... İşte benim günlük motivasyon kaynağım tam olarak bu.'],
 ['confident',null,'Bazen sırf karşı takım “biz de voleybol oynuyoruz” diyebilsin diye bilerek blok-out yaptırıyorum ya da zor plonjon atıyormuş gibi yapıyorum. Sosyal sorumluluk projesi gibi bir şey.'],
 ['confident','outside','O kadar sert smaç vurdum ki, top parkeye değdikten sonra sekip rakip antrenörün elindeki taktik tahtasını sildi. Rica ederim hocam, zaten işe yaramıyordu.'],
 ['confident',null,'Ben sahada olduğum sürece en güçlü benim takımım!'],
 ['confident',null,'Yeteneklerinin çiçek açacağı gün bugündür. Ya da belki yarın, öbür gün, ya da seneye... Ama eğer o günün hiç gelmeyeceğini düşünürsen, o gün hiçbir zaman gelmeyecektir.'],
 ['confident',null,'Voleybolu hala sadece “bir iş” olarak görüyorsun. Ama o “an” geldiğinde... İşte o zaman voleybola aşık olacaksın.'],
 ['confident',null,'Kaybetmek sizin zayıf olduğunuzu mu kanıtlar? Hayır. Kaybetmek, ayağa kalkıp tekrar savaşmanız için bir fırsattır. Düşüp de tekrar ayağa kalkmazsanız, asıl zayıflık budur.'],
 ['confident',null,'Bizim tarafımızdaki top yere değmediği sürece hiçbir şey bitmiş değil!'],
 ['confident',null,'Gereksiz gurur ve kendine acıma... İkisi de sadece ayağına dolanır.'],
 ['confident',null,'Eğer takım arkadaşın zor durumdaysa, ona bağırıp çağırarak yardım edemezsin. Yapman gereken tek şey, o topu onun için kurtarmaktır!'],
 ['confident',null,'Kişisel bir kinim yok ama bütün o “dahi”leri ezmek her zaman çok eğlenceli olmuştur.'],
 ['confident','setter','Benim paslarım yeteneğe değil, takım arkadaşlarıma olan güvenime dayanıyor.'],
 ['confident','outside','Bloklanmaktan korktuğum için topa vurmaktan kaçarsam, asıl o zaman tamamen yenilmiş olurum.'],
 ['confident',null,'Kaybetmek sizin zayıf olduğunuzu göstermez. Sadece şu anda yeterince güçlü olmadığınızı gösterir.'],
 ['confident','middle','Tahmin etmek mi? Hayır, bu tahmin değil. Nereye vuracaklarını sezebiliyorum.']
].map(([tone,role,text])=>({tone,role,text}));
function quoteDraft(players,index){const available=playerQuotes.filter(q=>!q.role||players.some(p=>p.role===q.role)),q=available[index%available.length],cast=q.role?players.filter(p=>p.role===q.role):players,p=cast[Math.floor(index/available.length)%cast.length];return {player:p,text:q.text,tone:q.tone,speaker:p.name+' '+p.surname};}
function caption(node,value,speaker){const prefix=speaker?speaker+': ':'';if(node.textContent===value&&!!node.querySelector('strong')===!!(prefix&&value.startsWith(prefix)))return;node.replaceChildren();if(prefix&&value.startsWith(prefix)){const name=node.ownerDocument.createElement('strong');name.textContent=speaker+':';node.append(name,node.ownerDocument.createTextNode(value.slice(prefix.length-1)));}else node.append(node.ownerDocument.createTextNode(value));}
function followers(s){return 100+Math.max(0,Math.floor(s.earnedFollowers||0));}
function income(s){const f=followers(s),tier=sponsors.filter(x=>f>=x.at).length-1;return Math.round(80*(f/100)**.65*(1+tier*.18)*(1+(s.levels[2]||0)*.24));}
function normalize(s,now,day){const old=s.studio||{};s.studio={notifiedJobId:typeof old.notifiedJobId==='string'?old.notifiedJobId:null,nextResultAt:Number.isFinite(old.nextResultAt)?Math.max(0,old.nextResultAt):0,completedDraft:old.completedDraft&&typeof old.completedDraft.text==='string'?old.completedDraft:null,simpleVersion:old.simpleVersion===1?1:0,offer:Math.max(0,Math.floor(old.offer||0))%3,readyAt:Number(old.readyAt)||0,jobs:Array.isArray(old.jobs)?old.jobs.filter(j=>contents.some(c=>c.id===j.type)&&Number.isFinite(j.end)&&Number.isFinite(j.start)&&typeof j.id==='string').slice(0,2):[],queue:Array.isArray(old.queue)?old.queue.filter(t=>contents.some(c=>c.id===t)).slice(0,8):[],pattern:Array.isArray(old.pattern)?old.pattern.filter(t=>contents.some(c=>c.id===t)).slice(0,8):[],auto:!!old.auto,serial:Math.max(0,Math.floor(old.serial||0)),lastDay:Math.max(1,Math.floor(old.lastDay||day)),nextAmbient:Number.isFinite(old.nextAmbient)?old.nextAmbient:now+60000,ambient:Math.max(0,Math.floor(old.ambient||0)),opportunities:Array.isArray(old.opportunities)?old.opportunities.filter(x=>typeof x==='string').slice(-5):[]};return s.studio;}
function extraQueue(s){return Math.max(0,Math.min(5,Math.floor(Number(s.levels?.[0])||0)));}
function enqueue(s){const st=s.studio;if(!st?.jobs?.length)return 0;const count=Math.max(0,extraQueue(s)-st.queue.length),types=['moment','story','sponsor'];for(let i=0;i<count;i++)st.queue.push(types[((st.offer||0)+1+st.queue.length)%3]);return count;}
function slots(){return 1;}
function capacity(s){return 3+Math.max(0,(s.levels[1]||0)-5);}
function reward(s,type,special=false){const c=contents.find(c=>c.id===type);return {followers:Math.round(c.followers*(1+(s.levels[1]||0)*.18)*(special?1.6:1)),cash:type==='sponsor'?Math.round(income(s)*.8):0};}
function duration(s,type,lane=0){const c=contents.find(c=>c.id===type);const speed=1+(s.levels[0]||0)*.14;return Math.round(c.seconds*1000/speed);}
function price(level){return [1500,3500,7000,12000,20000,32000,48000,68000,95000,130000][level];}
const blockPriceSteps=[[5000,20000,65000,200000,600000],[1500,3500,12000,42000,90000,160000,280000,550000,950000,1600000],[5000,24000,80000,280000,800000]];
function blockPrice(index,level){return blockPriceSteps[index]?.[level];}
const api={extraQueue,enqueue,blockPrice,contents,sponsors,followers,income,normalize,slots,capacity,reward,duration,price,playerQuotes,quoteDraft,caption,trainingCaptions,sponsorCaptions};root.SocialStudioRules=api;if(typeof module!=='undefined')module.exports=api;
})(typeof window!=='undefined'?window:globalThis);
