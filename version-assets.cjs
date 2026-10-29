const fs=require('fs'),crypto=require('crypto');
require('./sync-match-rules.cjs');
require('./sync-academy-balls.cjs');
require('./sync-match-light-masks.cjs');
require('./sync-lab-core.cjs').sync();
require('./sync-lab-assets.cjs');
// Embed optional crest PNGs so file:// play can safely recolor/export them.
const crestSymbols={};for(const id of ['ball','bolt','peak','star','sun','moon','wave','wing','crown','leaf','flame','net','cat','deer','eagle','owl','wolf']){const file='assets/crest-symbols/'+id+'.png';if(fs.existsSync(file))crestSymbols[id]='data:image/png;base64,'+fs.readFileSync(file).toString('base64');}
fs.writeFileSync('crest-symbols-data.js','window.CrestSymbolData='+JSON.stringify(crestSymbols)+';\n');
// Run before publishing to refresh changed scripts and styles in browser caches.
for(const name of ['index.html','index-beta.html','playtest-report.html','mac.html','deneme-modu.html','skill-animation-lab.html','legendary-preview.html','card-design-preview.html','player-card-design-lab-v3.html','card-editor.html','portrait-outline-preview.html','portrait-background-preview.html']){
 let source=fs.readFileSync(name,'utf8');if(!source.includes('src="player-arm-gear.js')&&/src="(?:team-appearance|match-vector-characters)\.js/.test(source))source=source.replace(/<script src="(?:team-appearance|match-vector-characters)\.js/,match=>'<script src="player-arm-gear.js"></script>'+match);if(!source.includes('src="character-colors.js')&&/src="(?:team-appearance|match-vector-characters)\.js/.test(source))source=source.replace(/<script src="(?:team-appearance|match-vector-characters)\.js/,match=>'<script src="character-colors.js"></script>'+match);let html=source.replace(/((?:src|href)=")([^"?:]+\.(?:js|css))(?:\?v=[^"\s]+)?"/g,(match,prefix,file)=>{
  if(!fs.existsSync(file))return match;
  const version=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0,12);
  return prefix+file+'?v='+version+'"';
 });
 html=html.replace(/((?:src|poster)=")(assets\/preview-media\/[^"?]+\.(?:mp4|png))(?:\?v=[^"\s]+)?"/g,(match,prefix,file)=>{if(!fs.existsSync(file))return match;return prefix+file+'?v='+crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0,12)+'"';});
 fs.writeFileSync(name,html);
}
console.log('Script and stylesheet versions updated.');
