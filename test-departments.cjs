const assert=require('assert'),R=require('./room-rules.js');
function buy(s,id){const r=R.catalog.find(r=>r.id===id);if(R.count(s,id)){assert(R.upgrade(s,id));return}assert(R.unlock(s,r.floor));assert(R.choose(s,r.floor,s.floors[r.floor].length-1,id))}
let s=R.defaults();s.budget=1e6;assert.equal(R.effects(s).clickAP,1);
for(const r of R.catalog){for(let n=0;n<3;n++){buy(s,r.id);assert.equal(R.value(s,r.id),r.values[n])}assert.equal(R.count(s,r.id),3)}
assert.equal(R.effects(s).clickAP,7*8*1.6*2.8*1.75);assert.equal(R.effects(s).autoRate,12.5);assert.equal(R.effects(s).slots,3);assert.equal(R.effects(s).transition,0);assert.equal(R.effects(s).rest,0);assert.equal(R.effects(s).travel,1000/1.45);assert(!R.unlock(s,0));
const before=s.ap,e=R.effects(s);R.income(s,false,()=>0);assert.equal(s.ap-before,e.clickAP*5);const budget=s.budget;const result=R.income(s,true,()=>.99);assert.equal(result.ap,e.clickAP+e.dayAP);assert.equal(s.budget,budget+20);
s.lastSeen=0;let gain=R.offline(s,24*3600*1000);assert.equal(gain,12*3600*e.autoRate*e.clickAP*(1+4*e.crit));assert.equal(R.offline(s,24*3600*1000),0);
s=R.defaults();s.lastSeen=0;assert.equal(R.offline(s,1e9),0);s.budget=40;assert(R.unlock(s,0));assert(!R.choose(s,0,0,'assistant'));assert(R.choose(s,0,0,'basic'));assert(!R.unlock(s,1));assert.equal(s.budget,0);
s=R.defaults();s.budget=1e6;for(let i=0;i<3;i++)buy(s,'basic');assert(R.unlock(s,0));assert(!R.choose(s,0,3,'basic'));assert(R.choose(s,0,3,'tempo'));assert.equal(R.effects(s).clickAP,14);
assert.deepEqual(R.normalize({floors:[{},['basic','assistant','assistant','assistant','assistant']]}).floors[1],['assistant','assistant','assistant']);assert.equal(R.migrate({budget:20,floors:[['old','old'],[],[],[],[]]}).budget,120);
console.log('PASS: all 14 blocks and 42 levels, multiplier composition, critical AP, day rewards, department restrictions, copy limits, budget, offline cap and single claim, migration refund.');
const fs=require('fs'),vm=require('vm');
class Element{constructor(){this.children=[];this.events={};this.dataset={};this.isConnected=true}append(...v){this.children.push(...v)}replaceChildren(...v){this.children=v}addEventListener(k,f){this.events[k]=f}close(){this.open=false;this.events.close?.()}showModal(){this.open=true}focus(){} }
let now=100000,tick;const nodes={},events={},data={},initial=R.defaults();initial.lastSeen=now;initial.floors[1]=['assistant','offline'];data['idle-spiker-rooms-v2']=JSON.stringify(initial);
const doc={hidden:false,getElementById:id=>nodes[id]??=new Element(),querySelectorAll:()=>[],createElement:()=>new Element(),addEventListener:(k,f)=>events[k]=f};
const ctx={RoomRules:R,document:doc,window:{addEventListener(){}},localStorage:{getItem:k=>data[k]||null,setItem:(k,v)=>data[k]=v},Date:{now:()=>now},setInterval:f=>tick=f,console};vm.createContext(ctx);vm.runInContext(fs.readFileSync('rooms.js','utf8'),ctx);let clicks=0;ctx.window.RoomSystem.setAutoClick(()=>{clicks++;ctx.window.RoomSystem.onClick(false)});for(let i=0;i<8;i++){now+=250;tick()}assert.equal(clicks,1);assert.equal(JSON.parse(data['idle-spiker-rooms-v2']).ap,1);
doc.hidden=true;events.visibilitychange();now+=3600000;tick();assert.equal(clicks,1);doc.hidden=false;events.visibilitychange();assert.equal(JSON.parse(data['idle-spiker-rooms-v2']).ap,1801);events.visibilitychange();assert.equal(JSON.parse(data['idle-spiker-rooms-v2']).ap,1801);assert.equal(nodes.boostSlots.children.length,0);
console.log('PASS: real room runtime auto-click cadence, hidden-tab offline production, no duplicate offline award, saved AP.');
