const fs = require('node:fs');
const path = require('node:path');
const {pathToFileURL} = require('node:url');
const {chromium} = require(path.resolve(path.dirname(process.execPath), '../node_modules/playwright'));
const root = path.resolve(__dirname, '../..');
const entryMarkup=['index.html','mac.html'].map(name=>fs.readFileSync(path.join(root,name),'utf8')).join('\n');
const files = [...new Set([...entryMarkup.matchAll(/src="scripts\/game\/([^"?]+)\.js/g)].map(m=>m[1]))].filter(name=>!/language|data|atlas|geometry|appearance|renderer|vector|portrait|country-rules|team-names|rival-roster/.test(name));
const literals = new Set();
const staticCopy=new Set();
const shortLabels=new Set(),properNames=new Set();
const teamSource=fs.readFileSync(path.join(root,'scripts/game/team-rules.js'),'utf8');
for(const m of teamSource.matchAll(/const (?:names|surnames)=(\[[^;]+\]);/g))try{JSON.parse(m[1]).forEach(n=>properNames.add(n));}catch{}
function addStatic(value){value=value.trim();if(value.length>=3&&value.length<500&&/[a-zA-ZçğıöşüÇĞİÖŞÜ]/.test(value)&&!/[<>=\\{}]/.test(value))staticCopy.add(value);}
function add(value){if(value.length>=3&&value.length<=700&&/[çğıöşüİ]/.test(value)&&!/[<>=\\{}]|\.js|\.png/.test(value))literals.add(value.trim());}
for (const name of files) {
 const source = fs.readFileSync(path.join(root, 'scripts/game', name + '.js'), 'utf8');
 for (const match of source.matchAll(/(['"])((?:\\.|(?!\1)[^\\\r\n])*)\1/g)) {
  const text = match[2];
  if(/^[A-ZÇĞİÖŞÜ][a-zçğıöşü]{2,25}$/.test(text)&&!properNames.has(text))shortLabels.add(text);
  add(text);
  if(text.includes('<'))for(const part of text.matchAll(/>([^<>]+)</g)){add(part[1]);addStatic(part[1]);}
 }
}
for(const part of entryMarkup.matchAll(/>([^<>]+)</g)){add(part[1]);addStatic(part[1]);}
(async () => {
 const browser = await chromium.launch({channel:'msedge', headless:true});
 try {
  const page = await browser.newPage({viewport:{width:390,height:844}});
  await page.addInitScript(() => localStorage.setItem('idle-spiker-language-v1','en'));
  await page.goto(pathToFileURL(path.join(root,'index.html')).href);
  await page.waitForFunction(() => window.GameLanguage && window.RoomSystem && window.FoundationBlocks);
  const report = await page.evaluate(({literals,staticCopy,shortLabels}) => {
   const blocks = new Set();
   for (const division of [1,2,3,4]) {
    const state = division === 1 ? RoomRules.defaults() : BalRules.enter(RoomRules.defaults(),1);
    state.division = division;
    for (const room of RoomRules.catalog) {
     blocks.add(room.name);
     if (room.bonus) blocks.add(room.bonus[2]);
     for(let level=1;level<=room.values.length;level++) {
      blocks.add(room.bal ? BalRules.describePrimary(state,room,level) : division===1 ? room.describe(room.values[level-1]) : FoundationBlocks.describe(room,level,state));
      if(room.bonus && level>=6) blocks.add(BalRules.describeBonus(state,room,level));
     }
    }
   }
   const untranslated = values => [...values].filter(x=>typeof x==='string').map(source=>({source,english:GameLanguage.text(source)})).filter(x=>/[çğıöşüİ]|\b(talimat|bütçe|oyuncu|seviye|kazan|kart|gün|açılır)\b/i.test(x.english));
   return {note:'Source candidates include names, internal keys and fragments of generated sentences. They are not confirmed visible UI leaks. The live-screen assertions are in tests/test-language.cjs.',blockStrings:blocks.size,missingBlocks:untranslated(blocks),sourceCandidates:untranslated(literals),unchangedStatic:staticCopy.filter(s=>GameLanguage.text(s)===s),unchangedShortLabels:shortLabels.filter(s=>GameLanguage.text(s)===s)};
  }, {literals:[...literals],staticCopy:[...staticCopy],shortLabels:[...shortLabels]});
  fs.writeFileSync(path.join(root,'audits/english-coverage.json'),JSON.stringify(report,null,2));
  console.log(JSON.stringify({files:files.length,blockStrings:report.blockStrings,missingBlocks:report.missingBlocks.length,sourceCandidates:report.sourceCandidates.length}));
 } finally { await browser.close(); }
})().catch(error=>{console.error(error);process.exitCode=1;});
