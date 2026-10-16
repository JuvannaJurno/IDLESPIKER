const fs=require('fs');
// Keep bundled match pages on the same probabilities as league simulation.
const rules=fs.readFileSync('match-rules.js','utf8').trim();
for(const file of ['deneme-modu.html','mac.html']){
 const source=fs.readFileSync(file,'utf8');
 const pattern=/(<script>\s*)\(function\(root\)\{[\s\S]*?\}\)\(globalThis\);/;
 if(!pattern.test(source))throw Error('Maç kuralları bulunamadı: '+file);
 const updated=source.replace(pattern,(_,prefix)=>prefix+rules);
 if(updated!==source)fs.writeFileSync(file,updated);
}
console.log('Bundled match rules synchronized.');
