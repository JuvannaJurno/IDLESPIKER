const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),{pathToFileURL}=require('node:url');
const {chromium}=require(path.resolve(path.dirname(process.execPath),'../node_modules/playwright'));
(async()=>{const b=await chromium.launch({channel:'msedge',headless:true});try{
 const p=await b.newPage({viewport:{width:390,height:844},reducedMotion:'reduce'}),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(()=>localStorage.setItem('idle-spiker-language-v1','tr'));
 await p.goto(pathToFileURL(path.resolve('index.html')).href);await p.waitForFunction(()=>window.TeamAppearance&&window.RoomSystem);
 await p.evaluate(()=>localStorage.setItem('idle-spiker-profile-v1',JSON.stringify({version:1,name:'Deniz',country:'TR',appearance:TeamAppearance.generate(),music:[]})));
 await p.reload();await p.locator('#bootScreen').waitFor({state:'detached'});await p.evaluate(()=>{GuidedTutorial.stop();GuidedTutorial.start=()=>false;document.querySelectorAll('dialog[open]').forEach(d=>d.close());});await p.waitForFunction(()=>document.getElementById('tutorialChoice').open);await p.locator('[data-tutorial="no"]').click();
 await p.evaluate(()=>{const s=RoomRules.defaults();s.floors[1]=['assistant'];RoomSystem.loadStage(s);RoomSystem.setAutoClick(()=>{});});
 const report=await p.evaluate(()=>{
  const template=document.querySelector('[data-id="assistant"]').cloneNode(true),host=document.createElement('div');template.classList.add('social-block');host.id='allCopyAudit';host.style.cssText='width:158px';document.getElementById('workflow').append(host);
  const jobs=RoomRules.catalog.flatMap(r=>[{id:r.id,room:r},...(r.bonus?[{id:r.bonus[1],room:r,bonus:true}]:[])]).concat(['media-0','media-1','media-2','media-3','media-wave','media-queue'].map(id=>({id})));
  const failures=[],rows=[];const check=(condition,message)=>{if(!condition)failures.push(message);};
  for(const job of jobs){
   const card=template.cloneNode(true);host.replaceChildren(card);const part=card.querySelector('.block-main-effect');if(job.bonus){part.className='block-bonus-panel';part.querySelector('.block-main-copy').className='block-bonus-title';}
   const tr=[],en=[],stemsTr=[],stemsEn=[];const limit=job.id==='media-1'?10:5;
   for(let n=1;n<=limit;n++){
    const s=BalRules.enter(RoomRules.defaults(),1);s.division=4;s.divisionCalendar=2;
    const detail=job.room?(job.bonus?BalRules.describeBonus(s,job.room,n+5):job.room.bal?BalRules.describePrimary(s,job.room,n):job.room.describe(job.room.values[n-1])):'37 AP / talimat';
    GameLanguage.set('tr');BlockCopy.apply(part,job.id,detail,n);
    const copy=part.querySelector('.block-main-copy,.block-bonus-title'),value=part.querySelector('.block-effect-value');
    check(copy.dataset.blockCopyId===job.id,'Missing '+job.id);check(copy.querySelectorAll('.block-copy-emphasis').length===1,'Emphasis '+job.id);check(!copy.innerText.includes('**'),'Visible markup '+job.id);check(value?.textContent.length>0,'Missing value '+job.id);
    const actualValue=value?.textContent;tr.push(copy.textContent);stemsTr.push(copy.textContent.replace(copy.querySelector('.block-copy-emphasis').textContent,'{q}'));
    GameLanguage.set('en');en.push(copy.textContent);stemsEn.push(copy.textContent.replace(copy.querySelector('.block-copy-emphasis').textContent,'{q}'));check(en.at(-1)!==tr.at(-1),'Untranslated '+job.id);check(copy.querySelector('.block-copy-emphasis')?.textContent.length>0,'English emphasis '+job.id);
    check(!/[çğıİöşü]/.test(copy.textContent),'Turkish in English '+job.id);
    GameLanguage.set('tr');check(copy.textContent===tr.at(-1),'Switch back '+job.id);check(value?.textContent===actualValue,'Value changed '+job.id);
    rows.push({id:job.id,level:n,tr:tr.at(-1),en:en.at(-1)});
   }
   check(new Set(tr).size===limit,'Levels repeat '+job.id);check(new Set(en).size===limit,'English levels repeat '+job.id);if(!['assistant','bal_coach','pro_coordinator'].includes(job.id)){check(new Set(stemsTr).size===1,'Sentence must stay fixed '+job.id);check(new Set(stemsEn).size===1,'English sentence must stay fixed '+job.id);}
   if(limit===5){BlockCopy.apply(part,job.id,'37 AP / talimat',10);check(part.querySelector('.block-main-copy,.block-bonus-title').textContent===tr[4],'Primary should cap at five '+job.id);}
  }
  host.remove();return {rows,failures,ids:jobs.length};
 });
 assert.deepEqual(report.failures,[]);assert.equal(report.ids,77);
 // Real rendering must pass local 1–5 primary and 1–5 bonus levels to the shared copy.
 await p.evaluate(()=>{const s=BalRules.enter(RoomRules.defaults(),1);s.division=3;s.divisionCalendar=2;s.instructions=1e6;s.budget=s.ap=1e9;s.openDepartments=[0,1,2,3,4];for(const id of ['pro_repeat','pro_tickets','pro_coordinator']){const r=RoomRules.catalog.find(r=>r.id===id);s.floors[r.floor].push(...Array(6).fill(id));}LeagueSeason.loadStage({mode:'bal',division:3,divisionCalendar:2,startDay:1,results:{}});RoomSystem.loadStage(s);RoomSystem.setAutoClick(()=>{});MenuUI.loadStage({day:1,clicksToday:0});});
 for(const [id,bonus]of [['pro_repeat','pro_refund'],['pro_tickets','pro_trainingcash'],['pro_coordinator','pro_tempo']]){
  const card=p.locator('.upgrade-room[data-id="'+id+'"]');assert.equal(await card.locator('.block-main-copy').getAttribute('data-block-copy-level'),'6');assert.equal(await card.locator('.block-bonus-title').getAttribute('data-block-copy-level'),'1');assert(await card.isEnabled(),id+': '+await card.getAttribute('title'));await card.evaluate(el=>el.click());assert.equal(await card.locator('.block-bonus-title').getAttribute('data-block-copy-level'),'2',id+': '+await card.getAttribute('title'));assert.equal(await card.locator('.block-bonus-title').getAttribute('data-block-copy-id'),bonus);
 }
 await p.evaluate(()=>{DivisionThree.loadSocial({mediaBlockVersion:3,levels:[6,6,1,0],posts:[],seen:[],likes:[],earnedFollowers:0,sequence:0});const s=RoomSystem.snapshot();s.mediaDepartmentOpen=true;RoomSystem.loadStage(s);DivisionThree.decorate();});
 for(const id of ['media-0','media-1']){const card=p.locator('[data-id="'+id+'"]');assert.equal(await card.locator('.block-main-copy').getAttribute('data-block-copy-level'),'6');assert.equal(await card.locator('.block-bonus-title').getAttribute('data-block-copy-level'),'1');}
 // Use the actual card anatomy for a visual overview and narrow-screen fit checks.
 await p.evaluate(()=>{const template=document.querySelector('.upgrade-room[data-id="pro_repeat"]').cloneNode(true),host=document.createElement('section');template.classList.add('social-block');host.id='copyProof';host.style.cssText='display:grid;grid-template-columns:repeat(3,158px);gap:12px;padding:16px;width:max-content;background:#eaf0df';
  for(const [id,name,detail]of [['warmup','Temel Isınma','Her talimata +20 AP.'],['fast_internet','Hızlı İnternet','İkinci hat ana hattın 5/5 kapasitesinde düzenli çalışır.'],['coordinate','İlham Anı','Ücretsiz yükseltme şansı: %15.'],['bal_search','Keşif Ağı','Her 5 oyun gününde yeni katalog.'],['pro_repeat','Gelişim Takibi','Her 5 ücretli kart yükseltmesinde harcanan AP’nin %10 kadarı geri gelir.'],['media-0','Çekim Ekibi','Paylaşım hazırlama hızı +%70.']]){const c=template.cloneNode(true);c.dataset.id=id;c.querySelector(':scope > strong').textContent=name;c.querySelector('.slot-icon').textContent='';c.querySelectorAll('.block-bonus-panel,.block-bonus-locked').forEach(e=>e.remove());c.querySelector('.block-level-number').innerHTML='SEVİYE <b>5</b><small> / 5</small>';c.querySelector('.block-level-track i').style.width='100%';c.querySelectorAll('.block-level-milestone').forEach(e=>e.remove());c.querySelector('.block-upgrade-action').textContent='✓ Tamamlandı';BlockCopy.apply(c.querySelector('.block-main-effect'),id,detail,5);host.append(c);}document.body.append(host);window.copyProof=host;});
 for(const width of [280,320,390]){await p.setViewportSize({width,height:844});await p.evaluate(()=>copyProof.style.gridTemplateColumns='158px');for(const lang of ['tr','en']){await p.evaluate(lang=>GameLanguage.set(lang),lang);assert(await p.locator('#copyProof .block-main-effect').evaluateAll(es=>es.every(e=>e.scrollHeight<=e.clientHeight+1&&e.scrollWidth<=e.clientWidth+1)));}}
 await p.setViewportSize({width:1100,height:900});await p.evaluate(()=>{GameLanguage.set('tr');copyProof.style.gridTemplateColumns='repeat(3,158px)';for(const e of document.querySelectorAll('body *'))if(['fixed','sticky'].includes(getComputedStyle(e).position)&&!e.contains(copyProof)&&!copyProof.contains(e))e.style.visibility='hidden';});await p.locator('#copyProof').screenshot({path:'audits/all-block-level-copy.png'});
 assert.deepEqual(errors,[]);fs.writeFileSync('audits/all-block-level-copy.json',JSON.stringify({ids:report.ids,variants:report.rows.length,rows:report.rows,errors},null,2));console.log('PASS 77 main/bonus identities, 390 bilingual level variants, exact-value retention, real bonus/media level wiring, five-step caps and three mobile widths.');
}finally{await b.close();}})().catch(e=>{console.error(e);process.exitCode=1});
