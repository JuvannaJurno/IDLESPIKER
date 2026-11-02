// Legacy character IDs stay PNG/... in saves. Their original PNG source files live here.
// Build tools use this adapter; browser rendering continues to use embedded SVG parts.
const fs=require('node:fs'),path=require('node:path');
const root=path.resolve(__dirname,'../..');
function sourcePath(file){
 if(typeof file!=='string')return file;
 const relative=path.isAbsolute(file)?path.relative(root,file):file;
 const normalized=relative.replaceAll('\\','/');
 return normalized==='PNG'||normalized.startsWith('PNG/')?path.join(root,'assets/sources/legacy-png',normalized.slice(3)):file;
}
const api={...fs,sourcePath};
for(const method of ['readFileSync','writeFileSync','appendFileSync','existsSync','statSync','readdirSync','mkdirSync'])api[method]=(file,...args)=>fs[method](sourcePath(file),...args);
module.exports=api;
