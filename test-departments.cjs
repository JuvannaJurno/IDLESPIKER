const assert=require('assert'),R=require('./room-rules.js');
function buy(s,id){const r=R.catalog.find(r=>r.id===id);if(R.count(s,id)){assert(R.upgrade(s,id));return}assert(R.unlock(s,r.floor));assert(R.choose(s,r.floor,s.floors[r.floor].length-1,id))}
let s=R.defaults();s.budget=1e6;assert.equal(R.effects(s).clickAP,1);
for(const r of R.catalog){for(let n=0;n<3;n++){buy(s,r.id);assert.equal(R.value(s,r.id),r.values[n])}assert.equal(R.count(s,r.id),3)}
assert.equal(R.effects(s).clickAP,4*1.35*1.15*1.15*1.1);assert.equal(R.effects(s).autoRate,.3*1.3);assert.equal(R.effects(s).slots,3);assert.equal(R.effects(s).transition,175);assert.equal(R.effects(s).rest,280);assert.equal(R.effects(s).travel,2400/1.15);assert(!R.unlock(s,0));
const before=s.ap,e=R.effects(s);R.income(s,false,()=>0);assert.equal(s.ap-before,e.clickAP*5);const budget=s.budget;const result=R.income(s,true,()=>.99);assert.equal(result.ap,e.clickAP+e.dayAP);assert.equal(s.budget,budget+20);
s.lastSeen=0;let gain=R.offline(s,24*3600*1000);assert.equal(gain,0);assert.equal(R.offline(s,24*3600*1000),0);
s=R.defaults();s.lastSeen=0;assert.equal(R.offline(s,1e9),0);s.budget=40;assert(R.unlock(s,0));assert(!R.choose(s,0,0,'assistant'));assert(R.choose(s,0,0,'basic'));assert(!R.unlock(s,1));assert.equal(s.budget,0);
s=R.defaults();s.budget=1e6;for(let i=0;i<3;i++)buy(s,'basic');assert(R.unlock(s,0));assert(!R.choose(s,0,3,'basic'));assert(R.choose(s,0,3,'tempo'));assert.equal(R.effects(s).clickAP,4*1.1);
assert.deepEqual(R.normalize({floors:[{},['basic','assistant','assistant','assistant','assistant']]}).floors[1],['assistant','assistant','assistant']);assert.equal(R.migrate({budget:20,floors:[['old','old'],[],[],[],[]]}).budget,120);
console.log('PASS: all 14 blocks and 42 levels, multiplier composition, critical AP, day rewards, department restrictions, copy limits, budget, offline cap and single claim, migration refund.');
const fs=require('fs'),vm=require('vm');
class Element{constructor(){this.children=[];this.events={};this.dataset={};this.isConnected=true}append(...v){this.children.push(...v)}replaceChildren(...v){this.children=v}addEventListener(k,f){this.events[k]=f}close(){this.open=false;this.events.close?.()}showModal(){this.open=true}focus(){} }
let now=100000,tick;const nodes={},events={},data={},initial=R.defaults();initial.lastSeen=now;initial.floors[1]=['assistant','offline'];data['idle-spiker-rooms-v2']=JSON.stringify(initial);
const doc={hidden:false,getElementById:id=>nodes[id]??=new Element(),querySelectorAll:()=>[],createElement:()=>new Element(),addEventListener:(k,f)=>events[k]=f};
const ctx={RoomRules:R,document:doc,window:{addEventListener(){}},localStorage:{getItem:k=>data[k]||null,setItem:(k,v)=>data[k]=v},Date:{now:()=>now},setInterval:f=>tick=f,console};vm.createContext(ctx);vm.runInContext(fs.readFileSync('rooms.js','utf8'),ctx);let clicks=0;ctx.window.RoomSystem.setAutoClick(()=>{clicks++;ctx.window.RoomSystem.onClick(false)});for(let i=0;i<20;i++){now+=250;tick()}assert.equal(clicks,1);assert.equal(JSON.parse(data['idle-spiker-rooms-v2']).ap,1);
doc.hidden=true;events.visibilitychange();now+=3600000;tick();assert.equal(clicks,1);doc.hidden=false;events.visibilitychange();assert.equal(JSON.parse(data['idle-spiker-rooms-v2']).ap,1);events.visibilitychange();assert.equal(JSON.parse(data['idle-spiker-rooms-v2']).ap,1);assert.equal(nodes.boostSlots.children.length,0);
console.log('PASS: real room runtime auto-click cadence, hidden-tab offline production, no duplicate offline award, saved AP.');

// Opening and cancelling construction must not spend budget or reserve a slot.
ctx.window.RoomSystem.onClick(true);ctx.window.RoomSystem.onClick(true);
const savedBeforePicker=data['idle-spiker-rooms-v2'];
nodes.roomSlots0.children[0].onclick();
assert.equal(data['idle-spiker-rooms-v2'],savedBeforePicker);
nodes.roomDialog.close();
assert.equal(data['idle-spiker-rooms-v2'],savedBeforePicker);
nodes.roomSlots0.children[0].onclick();nodes.roomChoices.children[0].onclick();
let purchased=JSON.parse(data['idle-spiker-rooms-v2']);
assert.equal(purchased.budget,0);assert.deepEqual(purchased.floors[0],['basic']);
const unchanged=JSON.stringify(purchased);
assert(!R.purchase(purchased,0,'tempo'));assert.equal(JSON.stringify(purchased),unchanged);
assert(!R.upgrade(purchased,'basic'));assert.equal(JSON.stringify(purchased),unchanged);
purchased.budget=100;
const funded=JSON.stringify(purchased);
assert(!R.purchase(purchased,0,'basic'));assert(!R.purchase(purchased,0,'assistant'));assert.equal(JSON.stringify(purchased),funded);
assert(R.upgrade(purchased,'basic'));assert.equal(purchased.budget,40);assert.equal(R.count(purchased,'basic'),2);
console.log('PASS: picker cancellation preserves budget, construction charges once, failed purchases and upgrades preserve state.');


for(let level=1;level<=3;level++){
 let state=R.defaults();state.floors[1]=['assistant',...Array(level).fill('steady')];
 for(let i=0;i<9;i++)assert.equal(R.income(state,false,()=>1,'auto').bonus,0);
 const progress=state.steadyProgress;assert.equal(R.income(state,false,()=>1,'manual').bonus,0);assert.equal(state.steadyProgress,progress);
 state=R.normalize(JSON.parse(JSON.stringify(state)));assert.equal(state.steadyProgress,9);
 const result=R.income(state,true,()=>1,'auto');assert.equal(result.bonus,[5,10,20][level-1]);assert.equal(result.ap,1+result.bonus);assert.equal(state.budget,20);assert.equal(state.steadyProgress,0);
 assert.equal(R.income(state,false,()=>1,'auto').bonus,0);
}
assert.deepEqual(R.normalize({floors:[[],['assistant','offline','reach']]}).floors[1],['assistant','steady','steady']);
let all=R.defaults();all.floors=[['basic','tempo'],['assistant'],['meal'],[],['balls']];assert.equal(R.income(all,false,()=>1,'auto').ap,R.effects(all).clickAP);
assert.equal(R.income(all,false,()=>1,'auto').bonus,0);
console.log('PASS: every tenth automatic instruction, three bonus levels, manual isolation, reload persistence, migration and unrestricted automatic AP.');
