const assert=require('assert'),fs=require('fs'),path=require('path'),http=require('http'),N=require('./number-ui');
assert.equal(N.compact(1250000),'1,2m');assert.equal(N.compact(999999),'999,9k');assert.equal(N.compact(1000000),'1m');assert.equal(N.compact(1200),'1,2k');assert.equal(N.compact(Infinity),'—');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
const server=http.createServer((req,res)=>{const f=path.join(__dirname,decodeURIComponent(new URL(req.url,'http://localhost').pathname));fs.readFile(f,(e,b)=>{if(e)return res.writeHead(404).end();res.setHeader('Content-Type',f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'text/html');res.end(b)})});

(async()=>{let browser;try{await new Promise(r=>server.listen(0,r));browser=await chromium.launch({channel:'msedge',headless:true});const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://localhost:'+server.address().port+'/index.html');
const png=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.fillStyle='black';x.fillRect(24,24,208,208);return c.toDataURL().split(',')[1]});
await page.route('**/assets/crest-symbols/*.png',r=>r.abort());
await page.route('**/assets/crest-symbols/leaf.png',r=>r.fulfill({status:200,contentType:'image/png',body:Buffer.from(png,'base64')}));
await page.reload();await page.waitForFunction(()=>document.querySelector('#clubSymbols [data-value="leaf"] image'));
await page.evaluate(()=>{document.querySelector('#clubSymbols [data-value="leaf"]').click();const p=document.getElementById('accentPicker');p.value='#ff0000';p.dispatchEvent(new Event('input',{bubbles:true}))});
const result=await page.evaluate(async()=>{const img=new Image();img.src=document.querySelector('#clubBadge image').getAttribute('href');await img.decode();const c=document.createElement('canvas');c.width=c.height=256;const x=c.getContext('2d');x.drawImage(img,0,0);return {center:[...x.getImageData(128,128,1,1).data],corner:[...x.getImageData(0,0,1,1).data],fallback:!!document.querySelector('#clubSymbols [data-value="bolt"] path')}});
assert.equal(await page.locator('#clubSymbols image').count(),11,'all authored symbols survive network failure using bundled assets');assert.deepEqual(result.center,[255,0,0,255]);assert.equal(result.corner[3],0);assert(result.fallback);assert.deepEqual(errors,[]);console.log('PASS: optional PNG recoloring, transparent background and missing-symbol vector fallback');
}finally{await browser?.close();server.close()}})().catch(e=>{console.error(e);process.exitCode=1});
