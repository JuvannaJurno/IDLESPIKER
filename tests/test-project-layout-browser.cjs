const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
const root=path.resolve(__dirname,'..');
const mime={'.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.html':'text/html','.json':'application/json','.mp3':'audio/mpeg','.wav':'audio/wav','.webmanifest':'application/manifest+json'};
const server=http.createServer((q,r)=>{const file=path.resolve(root,'.'+decodeURIComponent(new URL(q.url,'http://localhost').pathname));if(!file.startsWith(root+path.sep)){r.writeHead(403).end();return;}fs.readFile(file,(e,data)=>{r.writeHead(e?404:200,{'Content-Type':mime[path.extname(file)]||'application/octet-stream'});r.end(data)});});
(async()=>{let browser;try{
 await new Promise(r=>server.listen(0,r));browser=await chromium.launch({channel:'msedge',headless:true});const rows=[];
 for(const file of ['index.html','index-beta.html','mac.html','deneme-modu.html','player-card-design-lab-v3.html','card-editor.html','portrait-outline-editor.html','skill-animation-lab.html','legendary-preview.html','calendar-design-lab.html','forma-design-lab.html','loading-screen-preview.html','playtest-report.html','card-design-preview.html','portrait-outline-preview.html','portrait-background-preview.html','maintenance-court.html','talimat-button-lab.html','karakter-uretici.html','yerlesim-editoru.html','uc-parca-editoru.html']){
  const p=await browser.newPage({viewport:{width:390,height:844}}),errors=[],missing=[];
  p.on('pageerror',e=>errors.push(e.message));p.on('response',r=>{if(r.status()===404)missing.push(decodeURIComponent(new URL(r.url()).pathname))});
  await p.goto('http://localhost:'+server.address().port+'/'+file,{waitUntil:'load'});await p.waitForTimeout(file.startsWith('index')?800:400);
  rows.push({file,errors:[...new Set(errors)],missing:[...new Set(missing)]});
  if(file==='index.html')await p.screenshot({path:path.join(root,'audits/project-layout-main.png')});
  await p.close();
 }
 fs.writeFileSync(path.join(root,'audits/project-layout-browser.json'),JSON.stringify(rows,null,2));console.log(JSON.stringify(rows.filter(r=>r.errors.length||r.missing.length),null,2));assert(rows.every(r=>!r.errors.length&&!r.missing.length),'entry points must load without missing files or script exceptions');console.log('PASS 21 game, editor and laboratory entry points');
}finally{await browser?.close();server.close();}})().catch(e=>{console.error(e);process.exitCode=1});
