// Read historical sources across the directory reorganization without weakening comparisons.
const fs=require('node:fs'),path=require('node:path'),cp=require('node:child_process');
const root=path.resolve(__dirname,'../..');
const moves=JSON.parse(fs.readFileSync(path.join(root,'docs/maintenance/file-moves.json'),'utf8')).map;
const inverse=Object.fromEntries(Object.entries(moves).map(([before,after])=>[after,before]));
function read(reference){
 const colon=reference.indexOf(':'),ref=reference.slice(0,colon),file=reference.slice(colon+1);
 const candidates=[file,inverse[file],moves[file]].filter(Boolean);let body,found;
 for(const candidate of [...new Set(candidates)])try{body=cp.execFileSync('git',['show',ref+':'+candidate],{cwd:root,encoding:'utf8',stdio:['ignore','pipe','pipe'],maxBuffer:32*1024*1024});found=candidate;break}catch{}
 if(body===undefined)throw Error('Historical source not found: '+reference);
 return body.replace(/require\(\s*(['"])(\.[^'"]+)\1\s*\)/g,(all,q,spec)=>{
  const old=path.posix.normalize(path.posix.join(path.posix.dirname(found),spec));
  const target=[old,old+'.js',old+'.cjs'].map(p=>moves[p]||p).find(p=>fs.existsSync(path.join(root,p)));
  return target?'require('+JSON.stringify(path.join(root,target))+')':all;
 });
}
module.exports={read};
