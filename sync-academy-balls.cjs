// Keep the original atlas untouched; embed it for untainted file:// canvas previews.
const fs=require('node:fs');
const cells=[
 ['atlas-1','Sarı–lacivert',80,0,407,384],
 ['atlas-2','Pembe–beyaz',488,0,384,384],
 ['atlas-3','Mavi–beyaz',875,0,400,384],
 ['atlas-4','Yeşil–kırmızı',80,384,407,384],
 ['atlas-5','Gri–beyaz',488,384,384,384],
 ['atlas-6','Kırmızı–mavi',875,384,400,384]
];
const source=fs.readFileSync('balls.png');
fs.writeFileSync('academy-ball-atlas-data.js','window.AcademyBallAtlasData='+JSON.stringify({source:'balls.png',classicSrc:'data:image/png;base64,'+fs.readFileSync('ball_volley1.png').toString('base64'),src:'data:image/png;base64,'+source.toString('base64'),cells})+';\n');
