const assert=require('node:assert/strict'),path=require('node:path');
const {pathToFileURL}=require('node:url');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(pathToFileURL(path.join(__dirname,'index.html')).href+'?academyPreview=1');await page.waitForSelector('#academyRecruit');await page.click('#academyRecruit');await page.click('#academyEnroll');await page.click('#academyCrowd');await page.evaluate(()=>scrollTo(0,0));
 const frame=page.frames().find(f=>f.url().includes('academyTraining'));await frame.waitForFunction(()=>!!window.AcademyTrainingSandbox);await frame.evaluate(()=>AcademyTrainingSandbox.stage(0));await frame.waitForFunction(()=>document.querySelector('#academyTraining canvas').dataset.athletes==='10');
 const initial=await frame.evaluate(()=>AcademyTrainingSandbox.snapshot()[0]);
 await frame.waitForFunction(()=>Number(document.querySelector('#academyTraining canvas').dataset.queueTurns)>=2,{},{timeout:35000});
 const attack=await frame.evaluate(()=>({snapshot:AcademyTrainingSandbox.snapshot()[0],data:{...document.querySelector('#academyTraining canvas').dataset}}));assert(attack.data.returns>=2);assert.equal(attack.data.ballIds,'1');assert.notEqual(attack.snapshot.active,initial.active);assert.equal(attack.data.avatarCount,'12');assert(attack.snapshot.maxStep<30,'queue must walk instead of resetting positions');assert.equal(new Set(attack.snapshot.queue.concat(attack.snapshot.active||[])).size,10);
 await page.screenshot({path:'audits/academy-attack-queue-mobile.png'});
 await frame.evaluate(()=>AcademyTrainingSandbox.stage(5));await frame.waitForFunction(()=>Number(document.querySelector('#academyTraining canvas').dataset.serves)>=2,{},{timeout:35000});
 const serving=await frame.evaluate(()=>({...document.querySelector('#academyTraining canvas').dataset}));assert(Number(serving.floorBalls)>=2);assert.equal(serving.avatarCount,'12');await page.screenshot({path:'audits/academy-serve-queue-mobile.png'});
 assert.deepEqual(errors,[]);console.log('PASS persistent practice: ten-person queue, rotating hitters, coach return with same ball, sequential native serves and multiple grounded balls.');
}finally{await browser.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
