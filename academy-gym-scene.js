(function(){
'use strict';if(new URLSearchParams(location.search).get('academyTraining')!=='1')return;
const ballSpots=[];const floor=document.createElement('canvas');floor.width=1000;floor.height=620;const g=floor.getContext('2d');
function rect(x,y,w,h,color){g.fillStyle=color;g.fillRect(x,y,w,h);}
function ellipse(x,y,rx,ry,color){g.fillStyle=color;g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fill();}
function line(x,y,x2,y2,color,width=2){g.strokeStyle=color;g.lineWidth=width;g.beginPath();g.moveTo(x,y);g.lineTo(x2,y2);g.stroke();}
function ball(x,y){ballSpots.push({x,y});}
function cart(x,y){rect(x+5,y+5,45,54,'#51695224');rect(x,y,45,54,'#8b9e87');rect(x+4,y+4,37,46,'#c8d0b3');for(const [dx,dy]of [[13,14],[31,16],[16,34],[32,36]])ball(x+dx,y+dy);g.strokeStyle='#6c8274';g.lineWidth=3;g.strokeRect(x,y,45,54);ellipse(x+7,y+58,4,4,'#5a6d62');ellipse(x+38,y+58,4,4,'#5a6d62');}
function cone(x,y){ellipse(x+2,y+4,8,6,'#936d3b26');g.fillStyle='#d89b67';g.beginPath();g.moveTo(x-7,y+4);g.lineTo(x+7,y+4);g.lineTo(x,y-11);g.closePath();g.fill();line(x-4,y,x+4,y,'#f5d2a3',2);}
function bench(x,y){rect(x+4,y+5,105,24,'#536a5929');rect(x,y,105,22,'#9b805e');for(const py of [4,11,18])line(x+3,y+py,x+102,y+py,'#cdb486',3);rect(x+10,y+20,5,10,'#687c6c');rect(x+91,y+20,5,10,'#687c6c');}
function bottle(x,y,color){rect(x,y,7,14,color);rect(x+1,y-3,5,4,'#f2e7cc');line(x+2,y+3,x+2,y+10,'#ffffff66',1);}
// World coordinates and camera match the game; this is a practice facility, not a match court.
rect(0,0,1000,620,'#b5c9b5');rect(130,36,740,548,'#6d897a33');rect(122,28,748,548,'#e8e6cf');rect(140,48,710,508,'#d7ba8a');
for(let y=48;y<556;y+=23){line(140,y,850,y,'#c3a778',1);for(let x=140+(y%46===2?42:106);x<850;x+=128)line(x,y,x,Math.min(556,y+23),'#c6ab7d',1);}
// Two windows, storage wall, and a small tactics board on the entrance side.
for(const y of [103,431]){rect(124,y,13,72,'#f7f2da');rect(126,y+3,7,66,'#aac8be');line(129,y+4,129,y+67,'#edf1d8',2);line(125,y+36,134,y+36,'#edf1d8',2);}
rect(155,55,92,43,'#78988a');rect(160,60,82,33,'#f5f0da');line(177,67,228,67,'#9caf9b');line(177,75,218,75,'#9caf9b');line(177,83,226,83,'#9caf9b');
bench(167,506);rect(190,508,25,16,'#eee8d3');bottle(234,509,'#76948b');bottle(246,509,'#b2946c');
cart(284,73);cart(723,471);
// A short training net, with open circulation around the stations.
g.strokeStyle='#f3e8c9';g.lineWidth=3;g.strokeRect(286,144,425,332);line(500,148,500,472,'#f5eccc',3);
line(500,149,500,473,'#4c6d65',5);for(let y=156;y<470;y+=10)line(496,y,504,y,'#c1ccc0',1);rect(490,139,20,8,'#6d8d81');rect(490,474,20,8,'#6d8d81');
// Strength / mobility corner: mats, rollers and small weights.
rect(655,71,143,73,'#a7b69a');rect(662,77,129,61,'#9daa90');line(676,81,676,135,'#bec9aa',2);line(782,81,782,135,'#bec9aa',2);
for(const x of [687,734]){line(x,102,x+22,102,'#526f65',4);for(const dx of [0,22]){rect(x+dx-3,94,6,16,'#688276');rect(x+dx-5,97,10,10,'#688276');}}
rect(808,80,16,46,'#75988b');line(812,84,812,122,'#a8bba1',2);
// Agility station: ladder, cones, and landing targets.
line(621,508,706,508,'#c2935a',3);line(621,546,706,546,'#c2935a',3);for(let x=622;x<708;x+=17)line(x,508,x,546,'#f4dd9e',3);
for(const [x,y]of [[351,90],[408,90],[467,90],[580,530],[822,186]])cone(x,y);
for(const [x,y]of [[780,267],[780,339],[780,411]]){g.strokeStyle='#a4b39a';g.lineWidth=3;g.beginPath();g.arc(x,y,17,0,Math.PI*2);g.stroke();g.beginPath();g.arc(x,y,6,0,Math.PI*2);g.stroke();}
// Equipment rack, towels and a basket of spare balls.
rect(810,449,28,76,'#718c7c');for(const y of [455,476,497]){rect(814,y,20,15,'#c6cdb5');line(818,y+4,829,y+4,'#e9e5ce',2);}ball(586,93);ball(603,96);
window.AcademyGymScene={draw(ctx,image=ballSprites['ball_volley1.png']){ctx.drawImage(floor,0,0);if(image?.complete&&image.naturalWidth)for(const p of ballSpots)ctx.drawImage(image,p.x-8,p.y-8,16,16);},cartAt(ctx,image,x=65,y=535){ctx.fillStyle='#8b9e87';ctx.fillRect(x,y,38,45);ctx.fillStyle='#c8d0b3';ctx.fillRect(x+3,y+3,32,38);if(image?.complete)for(const [dx,dy]of [[11,12],[27,13],[12,29],[27,30]])ctx.drawImage(image,x+dx-7,y+dy-7,14,14);ctx.strokeStyle='#6c8274';ctx.lineWidth=2;ctx.strokeRect(x,y,38,45);},ballSpots,ballAsset:'ball_volley1.png',foreground(ctx){ctx.fillStyle='#987e5a';ctx.fillRect(167,524,105,5);},equipment:['training-net','ball-carts','bench','water','tactics-board','mats','weights','agility-ladder','cones','landing-targets','storage']};
})();
