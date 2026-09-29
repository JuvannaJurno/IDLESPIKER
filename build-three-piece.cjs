const fs=require('fs');
let template=fs.readFileSync('editor-template.html.template','utf8');
const source=fs.readFileSync('karakter-uretici.html','utf8');
const referenceAssets=JSON.parse(source.match(/const assets=(.*?);const cache=new Map\(\);/s)[1]);
const base=JSON.parse(fs.readFileSync('onaylanan-yerlesim.json','utf8')).parts;
const assets={},layout=[];
for(const [id,label,path,x,y,colorSource]of [['shirt','Forma','jersey_1.png',24,27,'shirt'],['head','Ten','skin_1.png',28,24,'head'],['hair','Saç','hair_1.png',23,13,'hair']]){
 const b=fs.readFileSync(path);assets[path]='data:image/png;base64,'+b.toString('base64');layout.push({id,label,path,x,y,colorSource,rotation:0,scale:1,flip:false,pivotX:.5,pivotY:.5,width:b.readUInt32BE(16),height:b.readUInt32BE(20)});
}
const approved=JSON.parse(fs.readFileSync('onaylanan-uc-parca-yerlesimi.json','utf8'));
if(approved.format!=='kenney-three-piece-layout'||![3,7].includes(approved.parts.length))throw Error('Invalid layout');
layout.splice(0,layout.length,...approved.parts);
for(const side of ['left','right'])for(const [kind,path,colorSource]of [['arm','arm.png','head'],['sleeve','arm_jersey.png','shirt']]){
 const b=fs.readFileSync(path);assets[path]='data:image/png;base64,'+b.toString('base64');
 if(!layout.some(p=>p.id===kind+'-'+side))layout.push({id:kind+'-'+side,label:(side==='left'?'Üst':'Alt')+' '+(kind==='arm'?'kol / ten':'forma kolu'),path,x:12,y:side==='left'?23:52,colorSource,shade:kind==='sleeve'?.78:1,rotation:0,scale:1,flip:false,pivotX:.15,pivotY:.5,width:b.readUInt32BE(16),height:b.readUInt32BE(20)});
}
template=template.replace('__ASSETS__',JSON.stringify(assets)).replace('__LAYOUT__',JSON.stringify(layout));
template=template.replaceAll('Karakter Yerleşim Editörü','Üç Parça Birleştirme Modu').replace('href="karakter-uretici.html">Karakter üreticisine dön ↗','href="yerlesim-editoru.html">Karakter editörüne dön ↗');
template=template.replace(/<div class="tools"><button id="leftArm">[\s\S]*?<\/div>/,'');
template=template.replace(/<h2>Karakter seçenekleri<\/h2>[\s\S]*?<h2 id="selectionTitle">/,'<h2>Saç · Forma · Ten</h2><p class="muted">Üç parçayı hizala. JSON indirip sohbete gönder.</p><button id="matchColors" class="primary full">Karakter renklerini uygula</button><button id="originalColors" class="full">Orijinal renkler</button><p class="muted">Renkler ana editörde en son kaydedilen karakterden alınır.</p><h2 id="selectionTitle">');
template=template.replace('viewBox="0 0 600 720"','viewBox="0 0 64 80"').replace('width="20" height="20"','width="4" height="4"').replace('M 20 0 L 0 0 0 20','M 4 0 L 0 0 0 4').replace('width="600" height="720"','width="64" height="80"').replace('M300 0V720 M0 650H600','M32 0V80 M0 68H64');
template=template.replace('touch-action:none','touch-action:none;image-rendering:pixelated').replace("'stroke-width':1.5/p.scale","'stroke-width':.15/p.scale").replace("'stroke-dasharray':'4 3'","'stroke-dasharray':'.5 .3'").replace("r:5,fill:","r:.5,fill:");
template=template.replace('max="400"','max="400"').replaceAll('step="1"','step="0.05"');
template=template.replaceAll('kenney-layout-editor-approved-v4-colors','kenney-three-piece-layout-v1').replaceAll('kenney-character-layout','kenney-three-piece-layout').replaceAll('karakter-yerlesimi.json','uc-parca-yerlesimi.json').replaceAll('karakter-yerlesimi.svg','uc-parca-gorunum.svg');
template=template.replace('canvas:{width:600,height:720}','canvas:{width:64,height:80},colorSources:{hair:"hair",shirt:"shirt",head:"head"}').replace("viewBox:'0 0 600 720',width:600,height:720","viewBox:'0 0 64 80',width:64,height:80");
template=template.replace(/for\(const side of \['left','right'\]\)[^\n]+\n/,'');
const start=template.indexOf('const hairPalette='),end=template.indexOf('fresh();try{const saved=',start);
template=template.slice(0,start)+`const referenceAssets=${JSON.stringify(referenceAssets)};const referenceLayout=${JSON.stringify(base)};\n`+fs.readFileSync('three-piece-colors.js','utf8')+'\n'+template.slice(end);
template=template.replace(/fresh\(\);try\{const saved=[\s\S]*?<\/script>/,`fresh();try{const saved=localStorage.getItem('kenney-three-piece-layout-v1');if(saved)parts=validate(JSON.parse(saved))}catch{}selected=['hair'];render();$('status').textContent='Üç parça hazır. Sürükleyerek hizala, sonra JSON indir.';\n</script>`);
template=template.replaceAll('Gönderdiğim yerleşime dön','Onaylanan yerleşime dön');
template=template.replaceAll('kenney-three-piece-layout-v1','kenney-three-piece-layout-arms-approved-v5');
template=template.replaceAll('Üç Parça Birleştirme Modu','Üstten Görünüş · Kol ve Yürüme').replace('<h2>Saç · Forma · Ten</h2>','<h2>Gövde ve kollar</h2>').replace('Üç parçayı hizala.','Kolları ve forma kollarını hizala.');
template=template.replace('<button id="matchColors"', '<button id="walk" class="primary full">▶ Yürüme denemesi</button><label for="walkSpeed">Yürüme hızı</label><input id="walkSpeed" type="range" min="0.4" max="2.4" value="1.2" step="0.1"><label for="walkAmount">Kol salınımı</label><input id="walkAmount" type="range" min="0" max="10" value="5" step="0.25"><select id="walkAxis" hidden><option value="x">Sola bakan karakter</option></select><div class="tools"><button id="selectTopArm">Üst kol grubu</button><button id="selectBottomArm">Alt kol grubu</button></div><p class="muted">Omuz noktası sabittir; kol ve forma kolu birlikte öne ve arkaya aynalanır. Düzenlemek için parçayı seçtiğinde animasyon durur. JSON durağan yerleşimi kaydeder.</p><button id="matchColors"');
template=template.replace("fresh();try{const saved=",fs.readFileSync('walk-preview.js','utf8')+'\nfresh();try{const saved=');
template=template.replace("$('status').textContent='Üç parça hazır. Sürükleyerek hizala, sonra JSON indir.';", "$('status').textContent='Gönderdiğin yerleşim hazır.';if(typeof Image!=='undefined')$('matchColors').onclick();");
template=template.replace(/<details><summary>Kullanım<\/summary>[\s\S]*?<\/details>/,'<details><summary>Kullanım</summary><p class="muted">Parçaları sürükle, döndür veya boyutlandır. Shift + tıklama ile birlikte seç. Ok tuşları 1 piksel, Shift + ok 10 piksel taşır; daha ince ayar için X/Y alanlarına ondalık değer yaz.</p><p class="muted">Yerleşimi JSON olarak indir ve sohbete ekle. Saç, forma ve ten eşleştirmeleri dosyada kayıtlıdır. SVG görünümünü de indirebilirsin.</p></details>');
const vm=require('vm'),assert=require('assert'),nodes={};
class Element{constructor(tag='div'){this.tag=tag;this.attrs={};this.children=[];this.style={};this.classList={toggle(){}}}setAttribute(k,v){this.attrs[k]=v}append(...a){this.children.push(...a)}replaceChildren(...a){this.children=a}addEventListener(){}}
const context={atob,console,localStorage:{getItem(){return null},setItem(){}},document:{getElementById:id=>nodes[id]??=new Element(),createElementNS:(_,tag)=>new Element(tag),createElement:tag=>new Element(tag),querySelectorAll:()=>[],addEventListener(){}},assert};vm.createContext(context);vm.runInContext(template.match(/<script>([\s\S]*?)<\/script>/)[1],context);
context.requestAnimationFrame=()=>1;context.cancelAnimationFrame=()=>{};
nodes.pieces.querySelector=selector=>nodes.pieces.children.find(n=>selector.includes('"'+n.attrs['data-id']+'"'));
context.document.getElementById('walkSpeed').value='1.2';context.document.getElementById('walkAmount').value='3';context.document.getElementById('walkAxis').value='x';
vm.runInContext(`const stationary=JSON.stringify(parts);$('walk').onclick();animateWalking(1000);animateWalking(1200);assert.equal(JSON.stringify(parts),stationary);assert(walking);stopWalking();assert(!walking);assert.equal(JSON.stringify(parts),stationary);`,context);
vm.runInContext(`validate(parts);assert.equal(parts.length,7);assert.equal(parts.find(p=>p.id==='hair').width,17);const before=JSON.stringify(parts);record();parts[0].x+=2;render();$('undo').onclick();assert.equal(JSON.stringify(parts),before);parts.forEach(p=>p.tint='#55aacc');render();assert.equal($('hairFilters').children.length,7);validate(parts);assert.equal(shadeColor('#eeeeee',.78),'#bababa');const a=walkMotion(.2,1.2,3,'x',1),b=walkMotion(.2,1.2,3,'x',-1);assert.equal(a.dx,-b.dx);assert.equal(a.angle,-b.angle);assert.equal(JSON.stringify(parts),JSON.stringify(parts));fresh();render();`,context);
const escape=x=>String(x).replaceAll('&','&amp;').replaceAll('"','&quot;');
const serialize=n=>`<${n.tag} ${Object.entries(n.attrs).map(([k,v])=>`${k}="${escape(v)}"`).join(' ')}>${n.children.map(serialize).join('')}</${n.tag}>`;
template=template.replace('<g id="pieces"></g>','<g id="pieces">'+nodes.pieces.children.map(serialize).join('')+'</g>').replace('<defs id="hairFilters"></defs>','<defs id="hairFilters">'+nodes.hairFilters.children.map(serialize).join('')+'</defs>');
fs.writeFileSync('uc-parca-editoru.html',template);
console.log('Three-piece editor built.');
