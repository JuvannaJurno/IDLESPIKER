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
fs.writeFileSync('academy-ball-atlas-data.js','window.AcademyBallAtlasData='+JSON.stringify({source:'balls.png',src:'data:image/png;base64,'+source.toString('base64'),cells})+';\n');

const replacement='data:image/png;base64,'+fs.readFileSync('assets/balls/atlas-1.png').toString('base64');
for(const file of ['mac.html','deneme-modu.html','legendary-preview.html']){if(!fs.existsSync(file))continue;const html=fs.readFileSync(file,'utf8');fs.writeFileSync(file,html.replace(/"ball_volley1\.png":"data:image\/[^" ]+"/g,()=>JSON.stringify('ball_volley1.png')+':'+JSON.stringify(replacement)));}

const labels=['Sarı–lacivert','Pembe–beyaz','Mavi–beyaz','Yeşil–kırmızı','Gri–beyaz','Kırmızı–mavi'];fs.writeFileSync('volleyball-balls.js','window.VolleyballBalls='+JSON.stringify(labels.map((name,i)=>({id:'atlas-'+(i+1),name,src:'assets/balls/atlas-'+(i+1)+'.png',data:'data:image/png;base64,'+fs.readFileSync('assets/balls/atlas-'+(i+1)+'.png').toString('base64')})))+';\n');
