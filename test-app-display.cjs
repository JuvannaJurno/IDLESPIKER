const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
const server=http.createServer((req,res)=>{const file=path.join(__dirname,decodeURIComponent(new URL(req.url,'http://localhost').pathname));fs.readFile(file,(error,data)=>{res.writeHead(error?404:200,{'Content-Type':file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':file.endsWith('.png')?'image/png':file.endsWith('.webmanifest')?'application/manifest+json':'text/html'});res.end(data);});});
(async()=>{let browser;try{
 await new Promise(r=>server.listen(0,r));browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>localStorage.setItem('idle-spiker-language-v1','tr'));
 const url='http://localhost:'+server.address().port+'/index.html';await page.goto(url);await page.locator('#bootScreen').waitFor({state:'detached'});
 await page.evaluate(()=>{GuidedTutorial.stop();document.querySelectorAll('dialog[open]').forEach(d=>d.close());document.getElementById('settingsDialog').showModal();});
 assert.equal(await page.evaluate(()=>!!document.fullscreenElement),false,'fullscreen never starts automatically');
 assert(await page.locator('#fullscreenToggle').isEnabled());await page.locator('#fullscreenToggle').click();await page.waitForFunction(()=>!!document.fullscreenElement);
 assert.equal(await page.locator('#fullscreenToggle').textContent(),'Tam ekrandan çık');assert(await page.locator('#installApp').isEnabled(),'browser fullscreen is not an installed app');await page.locator('#fullscreenToggle').click();await page.waitForFunction(()=>!document.fullscreenElement);
 const cdp=await page.context().newCDPSession(page),manifest=await cdp.send('Page.getAppManifest');assert.equal(manifest.errors.length,0);const data=JSON.parse(manifest.data);assert.equal(data.display,'standalone');assert.deepEqual(data.icons.map(i=>i.sizes),['192x192','512x512']);
 for(const icon of data.icons){const response=await page.request.get(new URL(icon.src,url).href);assert.equal(response.status(),200);}
 await page.screenshot({path:'audits/app-display-settings.png'});
 await page.locator('#installApp').click();assert(await page.locator('#installAppHelp').isVisible());assert.equal(await page.locator('#installAppSteps li').count(),3);await page.screenshot({path:'audits/app-install-help.png'});await page.locator('#installAppHelp .selection-close').click();assert.equal(await page.evaluate(()=>document.activeElement.id),'installApp');
 await page.evaluate(()=>{window.promptCount=0;const event=new Event('beforeinstallprompt',{cancelable:true});event.prompt=async()=>{window.promptCount++;};event.userChoice=Promise.resolve({outcome:'dismissed'});dispatchEvent(event);});
 assert.equal(await page.locator('#installApp').textContent(),'Yükle');await page.locator('#installApp').click();assert.equal(await page.evaluate(()=>window.promptCount),1);assert.equal(await page.locator('#installApp').textContent(),'Nasıl eklenir?');
 await page.evaluate(()=>dispatchEvent(new Event('appinstalled')));assert(await page.locator('#installApp').isDisabled());assert.equal(await page.locator('#installApp').textContent(),'Ana ekrana eklendi');assert.deepEqual(errors,[]);
 const ios=await browser.newPage({viewport:{width:390,height:844},userAgent:'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 Version/18.0 Mobile/15E148 Safari/604.1'});
 await ios.addInitScript(()=>{localStorage.setItem('idle-spiker-language-v1','tr');Object.defineProperty(document,'fullscreenEnabled',{value:false});Object.defineProperty(document,'webkitFullscreenEnabled',{value:false});});
 await ios.goto(url);await ios.locator('#bootScreen').waitFor({state:'detached'});await ios.evaluate(()=>{GuidedTutorial.stop();document.querySelectorAll('dialog[open]').forEach(d=>d.close());document.getElementById('settingsDialog').showModal();});assert(await ios.locator('#fullscreenToggle').isDisabled());await ios.locator('#installApp').click();assert((await ios.locator('#installAppSteps').textContent()).includes('Safari'));assert(await ios.locator('#installAppHelp').evaluate(e=>e.scrollWidth<=e.clientWidth+1));
 console.log('PASS native fullscreen enter/exit, valid install manifest and icons, manual install help, one-shot prompt, installed state and iPhone unsupported-fullscreen fallback.');
}finally{await browser?.close();server.close();}})().catch(error=>{console.error(error);process.exitCode=1;});
