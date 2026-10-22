(function(root){'use strict';
const milestones=[
{at:250,title:'İlk topluluğumuz',reward:'Başarım + bütçe desteği',kind:'cash',factor:1,icon:'✦'},
{at:500,title:'İlk izimiz',reward:'Bronz profil çerçevesi + Tribün ritmi müziği',kind:'bronze',icon:'◈'},
{at:1000,title:'Birlikte büyüyoruz',reward:'Sponsor anlaşması + bütçe desteği',kind:'cash',factor:3,icon:'▣'},
{at:2500,title:'Yeni bir forma',reward:'Bir transferde %10 indirim',kind:'transfer',icon:'↗'},
{at:5000,title:'Tribündeki sesimiz',reward:'Gümüş çerçeve + Işıklar arka planı + Işıklar altında müziği',kind:'silver',icon:'◈'},
{at:10000,title:'Daha güçlü dön',reward:'Bir kampın başlangıç bütçesinde %25 indirim',kind:'camp',icon:'⚑'},
{at:15000,title:'Büyük destek',reward:'Sponsor anlaşması + büyük bütçe desteği',kind:'cash',factor:8,icon:'▣'},
{at:25000,title:'Aynı renklerin peşinde',reward:'Altın çerçeve + özel taraftar paylaşımı + Zafer sesi müziği',kind:'gold',icon:'★'},
{at:40000,title:'Sesimiz arenada',reward:'Arena sponsoru kutlaması + Arena teması',kind:'arena',icon:'✧'}];
function normalize(raw){const ids=milestones.map(m=>m.at),valid=xs=>Array.isArray(xs)?[...new Set(xs.filter(x=>ids.includes(x)))]:[];return {claimed:valid(raw?.claimed),reached:Object.fromEntries(Object.entries(raw?.reached||{}).filter(([id,v])=>ids.includes(Number(id))&&Number.isSafeInteger(v)&&v>=0)),transferUsed:!!raw?.transferUsed,campUsed:!!raw?.campUsed};}
function state(s){if(!s.socialJourney||!Array.isArray(s.socialJourney.claimed)||!s.socialJourney.reached)s.socialJourney=normalize(s.socialJourney);return s.socialJourney;}
function available(s,kind){const j=state(s);return kind==='transfer'?j.claimed.includes(2500)&&!j.transferUsed:kind==='camp'?j.claimed.includes(10000)&&!j.campUsed:false;}
function transferPrice(s,c){return Math.max(0,Math.ceil(c.price*(available(s,'transfer')?.9:1)));}
function observe(s,followers,unit){if(!Number.isFinite(followers)||!Number.isFinite(unit)||unit<0)return false;const j=state(s);let changed=false;for(const m of milestones)if(followers>=m.at&&j.reached[m.at]===undefined){j.reached[m.at]=m.kind==='cash'?Math.max(0,Math.round(unit*m.factor)):0;changed=true;}return changed;}
function claim(s,at,followers,unit){const m=milestones.find(m=>m.at===at);if(!m||(followers<at&&state(s).reached[at]===undefined)||!Number.isFinite(unit)||unit<0)return false;observe(s,followers,unit);const j=state(s);if(j.claimed.includes(at))return false;const cash=j.reached[at];if(!Number.isSafeInteger(cash)||!Number.isFinite(s.budget+cash))return false;s.budget+=cash;j.claimed.push(at);return true;}
function frame(s){const c=state(s).claimed;return c.includes(25000)?'gold':c.includes(5000)?'silver':c.includes(500)?'bronze':'none';}
const api={milestones,normalize,state,available,transferPrice,observe,claim,frame};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SocialJourneyRules=api;
})(globalThis);