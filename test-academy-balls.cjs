const assert=require('node:assert/strict'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const url=pathToFileURL(path.join(__dirname,'index.html')).href+'?academyPreview=1';await page.goto(url);await page.waitForSelector('[data-ball-choice="atlas-6"]');
 assert.equal(await page.locator('[data-ball-choice]').count(),7);
 const sources=await page.locator('[data-ball-choice]:not([data-ball-choice="classic"]) img').evaluateAll(images=>images.map(img=>img.src));assert.equal(new Set(sources).size,6);
 const transparent=await page.evaluate(async src=>{const image=new Image();image.src=src;await image.decode();const tile=document.createElement('canvas');tile.width=tile.height=128;const g=tile.getContext('2d');g.drawImage(image,0,0);return {corner:g.getImageData(0,0,1,1).data[3],center:g.getImageData(64,64,1,1).data[3]};},sources[0]);assert.equal(transparent.corner,0);assert(transparent.center>200);
 await page.click('#academyRecruit');await page.click('#academyEnroll');
 const frame=page.frames().find(f=>f.url().includes('academyTraining'));await frame.waitForFunction(()=>!!window.AcademyTrainingSandbox);
 const before=await page.evaluate(()=>JSON.stringify(AcademyPreviewAPI.snapshot()));
 for(let i=1;i<=6;i++){await page.click('[data-ball-choice="atlas-'+i+'"]');await frame.waitForFunction(id=>document.querySelector('#academyTraining canvas').dataset.ballAsset===id,'atlas-'+i);}
 assert.equal(await page.evaluate(()=>JSON.stringify(AcademyPreviewAPI.snapshot())),before);
 // Rapid selection must not allow a late-loading older image to replace the last choice.
 await page.evaluate(()=>{document.querySelector('[data-ball-choice="atlas-1"]').click();document.querySelector('[data-ball-choice="atlas-3"]').click();document.querySelector('[data-ball-choice="classic"]').click();});await frame.waitForFunction(()=>document.querySelector('#academyTraining canvas').dataset.ballAsset==='ball_volley1.png');await page.waitForTimeout(200);assert.equal(await frame.evaluate(()=>document.querySelector('#academyTraining canvas').dataset.ballAsset),'ball_volley1.png');
 await page.click('[data-ball-choice="atlas-2"]');await frame.waitForFunction(()=>document.querySelector('#academyTraining canvas').dataset.ballAsset==='atlas-2');await page.screenshot({path:'audits/academy-ball-picker-mobile.png'});
 await page.reload();await page.waitForSelector('[data-ball-choice="atlas-6"]');await page.waitForFunction(()=>document.querySelector('[data-ball-choice="atlas-2"]').getAttribute('aria-pressed')==='true');
 for(const width of [320,1440]){await page.setViewportSize({width,height:844});assert.equal(await page.locator('.academy-ball-options').evaluate(el=>el.scrollWidth>el.clientWidth),false);}
 assert.deepEqual(errors,[]);console.log('PASS academy balls: six transparent atlas crops, seven choices, live renderer, rapid switching, saved choice, unchanged academy economy and responsive picker.');
}finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
