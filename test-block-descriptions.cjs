const assert=require('assert/strict'),R=require('./room-rules'),B=require('./bal-rules'),S=require('./scout-rules');
const fresh=(division=3)=>{const s=B.enter(R.defaults(),1);s.division=division;s.divisionCalendar=2;s.openDepartments=[2,4];return s;};
const put=(s,id,n)=>{const r=R.catalog.find(x=>x.id===id);s.floors[r.floor]=s.floors[r.floor].filter(x=>x!==id).concat(Array(n).fill(id));return r;};
const pct=v=>'%'+Number((v*100).toFixed(2)).toLocaleString('tr-TR');
for(const division of [2,3,6,7])for(const r of B.catalog)for(let n=1;n<=r.values.length;n++){
 const s=fresh(division);put(s,'crit_smash',3);put(s,'coordinate',3);put(s,'bal_personal',5);put(s,'bal_video',10);put(s,'bal_shift',10);put(s,'bal_plan',10);put(s,r.id,n);const before=JSON.stringify(s),text=B.describePrimary(s,r,n);assert.equal(typeof text,'string');assert(!/NaN|undefined|puan|Katkılı|Büyük fırsat/.test(text),r.id+': '+text);assert.equal(JSON.stringify(s),before);
 if(['bal_talent','pro_scout'].includes(r.id))assert(text.includes(pct(S.config(s).opportunityChance)));
 if(r.id==='bal_personal')assert(text.includes(pct(R.freeTrainingChance(s))));
 if(r.bonus&&n>5){const t=B.describeBonus(s,r,n);assert(!/NaN|undefined|puan|Katkılı|Büyük fırsat/.test(t),r.id+': '+t);if(['pro_focus','bal_precision'].includes(r.bonus[1]))assert(t.includes(pct(R.effects(s).critChance)));assert.equal(JSON.stringify(s),before);}
}
const s=fresh();let r=put(s,'bal_coach',1);assert(B.describePrimary(s,r,1).includes('0,84'));r=put(s,'pro_coordinator',1);assert(B.describePrimary(s,r,1).includes('3,36'));r=put(s,'bal_talent',1);assert(B.describePrimary(s,r,1).includes('%57,5'));assert.equal(B.value(s,'bal_talent'),.025);r=put(s,'pro_search',1);assert.equal(S.config(s).needRolePriority,.33);assert(B.describePrimary(s,r,1).includes('%33'));
console.log('PASS all card levels in four stages: precise effects, chance caps, contextual text, unchanged state and automation multipliers.');
