const assert=require('assert'),fs=require('fs'),vm=require('vm');
const source=fs.readFileSync('match-skills.js','utf8'),fn=source.slice(source.indexOf('function drawRarityGlow('),source.indexOf('function effectFor('));
const stops=[],draws=[];const context={globalAlpha:1,save(){},restore(){},drawImage(...args){draws.push(args)}};
const sandbox={window:{},tossing:()=>false,document:{createElement(){return {getContext(){return {createRadialGradient(){return {addColorStop(at,color){stops.push(color)}}},fillRect(){}}}}}},Map,Math,Number};vm.createContext(sandbox);vm.runInContext(fn,sandbox);
const p={x:100,y:100,jump:0};sandbox.drawRarityGlow(context,p,'Common',.5);assert.equal(draws.length,0);
for(const [rarity,color] of [['Uncommon','#ffffff'],['Rare','#429dff'],['Legendary','#ffd43b']]){stops.length=0;draws.length=0;sandbox.drawRarityGlow(context,p,rarity,.5);assert.equal(draws.length,2);assert(stops.every(s=>s.startsWith(color)));assert(draws[0][3]>=80);}
for(const team of [0,1]){draws.length=0;sandbox.drawRarityGlow(context,{...p,team,x:200+team*500},'Rare',.5);assert.equal(draws[0][1]+draws[0][3]/2,200+team*500);assert.equal(draws[0][2]+draws[0][4]/2,100);}
draws.length=0;sandbox.drawRarityGlow(context,p,'Rare',1);assert.equal(draws.length,0);console.log('PASS common unlit; white/blue/yellow player-centered emission and bounded lifetime');
