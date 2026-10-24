(function(root){'use strict';
const milestones=[
{at:250,title:'İlk topluluğumuz',reward:'Başarım + bütçe desteği',kind:'cash',factor:1,icon:'✦'},
{at:500,title:'İlk izimiz',reward:'Bronz profil çerçevesi',kind:'bronze',icon:'◈'},
{at:1000,title:'Birlikte büyüyoruz',reward:'İkinci medya hattı · Paylaşım dalgası +%25 · Sayı müziği + bütçe desteği',kind:'cash',factor:3,icon:'▣'},
{at:2500,title:'Yeni bir forma',reward:'Bir transferde %10 indirim',kind:'transfer',icon:'↗'},
{at:5000,title:'Tribündeki sesimiz',reward:"Beethoven's Symphony No. 5 in C minor, Op. 67 + Gümüş çerçeve + Işıklar arka planı",kind:'silver',icon:'◈'},
{at:10000,title:'Daha güçlü dön',reward:'Bir kampın başlangıç bütçesinde %25 indirim',kind:'camp',icon:'⚑'},
{at:15000,title:'Büyük destek',reward:'Sponsor anlaşması + büyük bütçe desteği',kind:'cash',factor:8,icon:'▣'},
{at:25000,title:'Aynı renklerin peşinde',reward:'Altın çerçeve + özel taraftar paylaşımı',kind:'gold',icon:'★'},
{at:40000,title:'Sesimiz arenada',reward:'Arena sponsoru kutlaması + Arena teması',kind:'arena',icon:'✧'}];
const courtPacks=[
{at:2500,name:'Doğal zeminler',courts:[{id:'maple',name:'Açık akçaağaç',floor:'#edd5aa',surround:'#658e90',pattern:'wood'},{id:'sage',name:'Adaçayı',floor:'#c6cfac',surround:'#6f8f83',pattern:'panels'}]},
{at:5000,name:'Serin arena',courts:[{id:'night',name:'Gece mavisi',floor:'#93b5c2',surround:'#354f70'},{id:'ice',name:'Buz beyazı',floor:'#e0e7e0',surround:'#688797'}]},
{at:10000,name:'Sıcak tribünler',courts:[{id:'clay',name:'Kil ve kiremit',floor:'#cb9b82',surround:'#795f63',pattern:'corners'},{id:'honey',name:'Bal rengi',floor:'#dfbf82',surround:'#647e7b',pattern:'wood'}]},
{at:25000,name:'Final ışıkları',courts:[{id:'lavender',name:'Lavanta',floor:'#c4b7cf',surround:'#716580',pattern:'panels'},{id:'community',name:'Topluluk halkaları',floor:'#ebd9b5',surround:'#8b9d96',pattern:'diagonal'}]}
];
const defaultCourts=[{id:'parquet',name:'Sade parke',floor:'#d6a16e',surround:'#789b9c',pattern:'wood'},{id:'orange',name:'Klasik turuncu',floor:'#d99160',surround:'#6eaaa5'}];
const leagueCourts=['parquet','sage','orange','maple','lavender','ice','honey','night'];
function courtPreset(id){return [...defaultCourts,...courtPacks.flatMap(p=>p.courts)].find(c=>c.id===id);}
function leagueCourt(division){return {...courtPreset(leagueCourts[Math.max(0,Math.min(7,(Number(division)||1)-1))])};}
function courtAvailable(s,id){return id==='classic'||courtPacks.some(p=>state(s).claimed.includes(p.at)&&p.courts.some(c=>c.id===id));}
for(const pack of courtPacks){const m=milestones.find(m=>m.at===pack.at);m.reward+=' + '+pack.name+' · 2 saha';}
function normalize(raw){const ids=milestones.map(m=>m.at),valid=xs=>Array.isArray(xs)?[...new Set(xs.filter(x=>ids.includes(x)))]:[];return {claimed:valid(raw?.claimed),reached:Object.fromEntries(Object.entries(raw?.reached||{}).filter(([id,v])=>ids.includes(Number(id))&&Number.isSafeInteger(v)&&v>=0)),transferUsed:!!raw?.transferUsed,campUsed:!!raw?.campUsed};}
function state(s){if(!s.socialJourney||!Array.isArray(s.socialJourney.claimed)||!s.socialJourney.reached)s.socialJourney=normalize(s.socialJourney);return s.socialJourney;}
function available(s,kind){const j=state(s);return kind==='transfer'?j.claimed.includes(2500)&&!j.transferUsed:kind==='camp'?j.claimed.includes(10000)&&!j.campUsed:false;}
function transferPrice(s,c){return Math.max(0,Math.ceil(c.price*(available(s,'transfer')?.9:1)));}
function observe(s,followers,unit){if(!Number.isFinite(followers)||!Number.isFinite(unit)||unit<0)return false;const j=state(s);let changed=false;for(const m of milestones)if(followers>=m.at&&j.reached[m.at]===undefined){j.reached[m.at]=m.kind==='cash'?Math.max(0,Math.round(unit*m.factor)):0;changed=true;}return changed;}
function claim(s,at,followers,unit){const m=milestones.find(m=>m.at===at);if(!m||(followers<at&&state(s).reached[at]===undefined)||!Number.isFinite(unit)||unit<0)return false;observe(s,followers,unit);const j=state(s);if(j.claimed.includes(at))return false;const cash=j.reached[at];if(!Number.isSafeInteger(cash)||!Number.isFinite(s.budget+cash))return false;s.budget+=cash;j.claimed.push(at);return true;}
function frame(s){const c=state(s).claimed;return c.includes(25000)?'gold':c.includes(5000)?'silver':c.includes(500)?'bronze':'none';}
function mediaLanes(s){return state(s).claimed.includes(1000)?2:1;}
function mediaMultiplier(s){return state(s).claimed.includes(1000)?1.25:1;}
const api={courtPacks,courtPreset,leagueCourt,courtAvailable,mediaLanes,mediaMultiplier,milestones,normalize,state,available,transferPrice,observe,claim,frame};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SocialJourneyRules=api;
})(globalThis);