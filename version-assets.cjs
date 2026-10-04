const fs=require('fs'),crypto=require('crypto');
// Run before publishing to refresh changed scripts and styles in browser caches.
for(const name of ['index.html','mac.html']){
 const html=fs.readFileSync(name,'utf8').replace(/((?:src|href)=")([^"?:]+\.(?:js|css))(?:\?v=[^"\s]+)?"/g,(match,prefix,file)=>{
  if(!fs.existsSync(file))return match;
  const version=crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0,12);
  return prefix+file+'?v='+version+'"';
 });
 fs.writeFileSync(name,html);
}
console.log('Script and stylesheet versions updated.');
