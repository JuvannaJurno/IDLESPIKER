const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),cp=require('node:child_process'),{createRequire}=require('node:module');
const root=path.resolve(__dirname,'../..');process.chdir(root);
const walk=d=>fs.readdirSync(d,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(d+'/'+e.name):[d+'/'+e.name]);
const failures=[];let checked=0;
for(const file of [...walk('scripts'),...walk('tests'),...walk('tools/build'),...walk('tools/maintenance')].filter(f=>/\.(js|cjs)$/.test(f))){
 const source=fs.readFileSync(file,'utf8');checked++;
 try{new vm.Script(source,{filename:file})}catch(e){failures.push([file,e.message]);}
 for(const m of source.matchAll(/require(?:\.resolve)?\(\s*(['"])(\.[^'"\r\n]+)\1\s*\)/g))try{createRequire(path.resolve(file)).resolve(m[2]);}catch{failures.push([file,'Missing require: '+m[2]]);}
}
for(const file of fs.readdirSync('.').filter(f=>f.endsWith('.html')))for(const m of fs.readFileSync(file,'utf8').matchAll(/(?:src|href)="([^"?]+)(?:\?[^"\s]*)?"/g)){
 const url=m[1];if(!/^(?:data:|https?:|#|\/)/i.test(url)&&/\.(js|css)$/.test(url)&&!fs.existsSync(url))failures.push([file,'Missing link: '+url]);
}
for(const file of walk('styles').filter(f=>f.endsWith('.css')))for(const m of fs.readFileSync(file,'utf8').matchAll(/url\(\s*(['"]?)([^)'"\s]+)\1\s*\)/g)){
 const url=m[2];if(!/^(?:data:|https?:|#|\/)/i.test(url)&&!fs.existsSync(path.resolve(path.dirname(file),url.split(/[?#]/)[0])))failures.push([file,'Missing CSS resource: '+url]);
}
assert.equal(failures.length,0,JSON.stringify(failures,null,2));console.log('PASS '+checked+' scripts and all HTML script/style references');
if(process.argv.includes('--rules'))for(const test of ['test-first-league-prior-stage-isolation.cjs','test-first-league-club-theme.cjs','test-first-league-flow-rules.cjs','test-first-league-academy.cjs'])cp.execFileSync(process.execPath,['tests/'+test],{stdio:'inherit'});
