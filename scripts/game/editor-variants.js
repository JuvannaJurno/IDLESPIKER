const paths=Object.keys(assets),pick=a=>a[Math.floor(Math.random()*a.length)],jitter=n=>(Math.random()*2-1)*n;
const colors={Blue:'Mavi',Green:'Yeşil',Grey:'Gri',Navy:'Lacivert',Pine:'Koyu yeşil',Red:'Kırmızı',White:'Beyaz',Yellow:'Sarı',Brown:'Kahverengi',Tan:'Bej',Black:'Siyah','Brown 1':'Kahverengi 1','Brown 2':'Kahverengi 2','Blue 1':'Mavi 1','Blue 2':'Mavi 2','Light Blue':'Açık mavi'};
const categoryGroups=c=>[...new Set(paths.filter(p=>p.startsWith('PNG/'+c+'/')).map(p=>p.split('/')[2]))];
const byId=id=>parts.find(p=>p.id===id);
const controls=[['shirtColor','Shirts','shirt'],['pantsColor','Pants','waist'],['shoeColor','Shoes','shoe-left']];
function syncColors(){for(const [control,category,role]of controls){const p=byId(role);if(p)$(control).value=p.path.split('/')[2]}}
// Keep the world pivot stable when replacing files with different natural dimensions.
function replaceAsset(p,path){if(!path||!dimensions[path])throw Error('Parça bulunamadı');const q=pivot(p);p.path=path;Object.assign(p,dimensions[path]);p.x=q.x-p.width*p.scale*p.pivotX;p.y=q.y-p.height*p.scale*p.pivotY}
function recolor(category,color){const candidates=paths.filter(p=>p.startsWith('PNG/'+category+'/'+color+'/'));for(const p of parts.filter(p=>p.path.startsWith('PNG/'+category+'/'))){const name=p.path.split('/').pop();const length=name.match(/_(long|short|shorter)\.png$/)?.[1];let target;if(length)target=candidates.find(p=>p.endsWith('_'+length+'.png'));else{const style=name.match(/(\d)\.png$/)?.[1];target=candidates.find(p=>!p.split('/').pop().includes('_')&&p.endsWith(style+'.png'))}replaceAsset(p,target)}}
for(const [control,category]of controls){$(control).replaceChildren(...categoryGroups(category).map(c=>{const option=document.createElement('option');option.value=c;option.textContent=colors[c]||c;return option}));$(control).onchange=()=>{record();recolor(category,$(control).value);render();$('status').textContent='Renk değişti; yerleşim korundu.'}}
function varyClothes(){for(const [,category]of controls)recolor(category,pick(categoryGroups(category)))}
function varyFace(){
 const amount=Number($('faceAmount').value)/100,head=byId('head'),originalHead=approvedLayout.find(p=>p.id==='head');
 const skin=head.path.split('/')[2],hairPrefix=byId('hair').path.split('/').pop().replace(/(?:Man|Woman)\d+\.png$/,'');
 const eyebrow=pick(paths.filter(p=>p.startsWith('PNG/Face/Eyebrows/'+hairPrefix+'Brow'))),eye=pick(paths.filter(p=>p.startsWith('PNG/Face/Eyes/'))),nose=pick(paths.filter(p=>p.startsWith('PNG/Face/Nose/'+skin+'/'))),mouth=pick(paths.filter(p=>p.startsWith('PNG/Face/Mouth/')));
 const eyeSpread=jitter(5)*amount,eyeHeight=jitter(3)*amount,browHeight=jitter(5)*amount,browAngle=jitter(12)*amount,noseX=jitter(3)*amount,noseY=jitter(3)*amount;
 const eyeScale=1+jitter(.13)*amount,noseScale=1+jitter(.15)*amount;
 for(const p of parts.filter(p=>/^(eye-|brow-|nose$|mouth$)/.test(p.id))){
   const base=approvedLayout.find(b=>b.id===p.id),ref=pivot(base),hc=pivot(head),originalCenter=pivot(originalHead),ratio=head.scale/originalHead.scale,a=(head.rotation-originalHead.rotation)*Math.PI/180;
   const dx=(ref.x-originalCenter.x)*ratio,dy=(ref.y-originalCenter.y)*ratio;
   const path=p.id.startsWith('eye-')?eye:p.id.startsWith('brow-')?eyebrow:p.id==='nose'?nose:mouth;
   p.rotation=base.rotation+head.rotation-originalHead.rotation;p.scale=base.scale*ratio*(p.id.startsWith('eye-')?eyeScale:p.id==='nose'?noseScale:1);p.flip=base.flip;
   p.path=path;Object.assign(p,dimensions[path]);let localX=0,localY=0;
   if(p.id.startsWith('eye-')){localX=p.id.endsWith('left')?-eyeSpread:eyeSpread;localY=eyeHeight}
   if(p.id.startsWith('brow-')){localX=p.id.endsWith('left')?-eyeSpread:eyeSpread;localY=eyeHeight+browHeight;p.rotation+=p.id.endsWith('left')?browAngle:-browAngle}
   if(p.id==='nose'){localX=noseX;localY=noseY}
   const xx=dx+localX*ratio,yy=dy+localY*ratio;
   p.x=hc.x+xx*Math.cos(a)-yy*Math.sin(a)-p.width*p.scale*p.pivotX;p.y=hc.y+xx*Math.sin(a)+yy*Math.cos(a)-p.height*p.scale*p.pivotY;
 }
}
function varyIdentity(){const tint=pick(categoryGroups('Skin'));for(const p of parts.filter(p=>p.path.startsWith('PNG/Skin/'))){const role=p.path.match(/_(\w+)\.png$/)[1];replaceAsset(p,paths.find(path=>path.startsWith('PNG/Skin/'+tint+'/')&&path.endsWith('_'+role+'.png')))}
 const p=byId('hair'),path=pick(paths.filter(path=>path.startsWith('PNG/Hair/'))),base=approvedLayout.find(p=>p.id==='hair'),head=byId('head'),headBase=approvedLayout.find(p=>p.id==='head');
 // Hair lengths differ dramatically: align the top edge rather than the image center.
 p.path=path;Object.assign(p,dimensions[path]);p.scale=base.scale*head.scale/headBase.scale;p.x=head.x+(base.x+base.width/2-headBase.x)*head.scale/headBase.scale-p.width*p.scale/2;p.y=head.y+(base.y-headBase.y)*head.scale/headBase.scale;
}
$('randomFace').onclick=()=>{record();varyFace();render();$('status').textContent='Kaş, göz ve burun konumları ölçülü olarak çeşitlendirildi.'};
$('randomClothes').onclick=()=>{record();varyClothes();render();$('status').textContent='Kıyafet renkleri değiştirildi; poz aynı kaldı.'};
$('newCharacter').onclick=()=>{record();varyIdentity();varyFace();varyClothes();render();$('status').textContent='Aynı pozda yeni karakter hazır.'};
