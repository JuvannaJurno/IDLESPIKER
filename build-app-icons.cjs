const fs=require('node:fs'),path=require('node:path');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage(),src='data:image/png;base64,'+fs.readFileSync(path.join(__dirname,'5.png')).toString('base64');
 fs.mkdirSync(path.join(__dirname,'assets/app'),{recursive:true});
 for(const [size,name]of [[192,'icon-192.png'],[512,'icon-512.png'],[180,'apple-touch-icon.png']]){
  const data=await page.evaluate(async({size,src})=>{const im=new Image();im.src=src;await im.decode();const canvas=document.createElement('canvas');canvas.width=canvas.height=size;const ctx=canvas.getContext('2d');ctx.fillStyle='#fff3d7';ctx.fillRect(0,0,size,size);const edge=size*.74;ctx.drawImage(im,(size-edge)/2,(size-edge)/2,edge,edge);return canvas.toDataURL('image/png').split(',')[1];},{size,src});
  fs.writeFileSync(path.join(__dirname,'assets/app',name),Buffer.from(data,'base64'));
 }
 console.log('App icons built from the existing owl.');
}finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
