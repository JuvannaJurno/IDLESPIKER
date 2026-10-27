const fs=require('fs'),crypto=require('crypto');
// Writes the beta entry point only. Shared mechanics and index.html stay untouched.
let html=fs.readFileSync('index.html','utf8').replace('<html lang="tr">','<html lang="tr" class="desktop-beta">');
html=html.replace('<head>','<head><script src="desktop-beta-storage.js"></script>').replace('</head>','<link rel="stylesheet" href="desktop-beta.css"></head>').replace('</body>','<script src="desktop-beta.js"></script></body>').replace(/href="index.html"/g,'href="index-beta.html"').replace(/<title>[^<]*<\/title>/,'<title>Idle Spiker · Masaüstü Beta</title>');
html=html.replace(/((?:src|href)=")([^"?:]+\.(?:js|css))(?:\?v=[^"\s]+)?"/g,(match,prefix,file)=>fs.existsSync(file)?prefix+file+'?v='+crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex').slice(0,12)+'"':match);
fs.writeFileSync('index-beta.html',html);
console.log('Desktop beta entry point refreshed; production files untouched.');
