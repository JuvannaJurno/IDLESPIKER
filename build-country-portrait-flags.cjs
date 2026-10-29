const fs=require('fs');
const countries=require('./country-rules.js').countries;
const sources=Object.fromEntries(countries.map(c=>[c.code,'data:image/svg+xml;charset=utf-8,'+encodeURIComponent(fs.readFileSync(c.flag,'utf8').replace(/>\s+</g,'><').trim())]));
const p='country-rules.js';let s=fs.readFileSync(p,'utf8');
const begin=s.indexOf('// BEGIN PORTRAIT FLAGS'),end=s.indexOf('// END PORTRAIT FLAGS');
if(begin>=0&&end>=begin)s=s.slice(0,begin)+s.slice(end+'// END PORTRAIT FLAGS'.length).replace(/^\r?\n/,'');
s=s.replace(/('use strict';)[\r\n]+/,"$1\n");
s=s.replace("'use strict';","'use strict';\n// BEGIN PORTRAIT FLAGS\nconst portraitFlagSources="+JSON.stringify(sources)+";\n// END PORTRAIT FLAGS\n");
fs.writeFileSync(p,s);console.log('Embedded',countries.length,'country flags.');
