(function () {
 'use strict';
 const variants={};
 // The sentence stays fixed. Only the emphasized qualifier progresses.
 function phrase(ids,tr,en,wordsTr,wordsEn){
  const rows=wordsTr.map((word,i)=>[tr.replace('{q}','**'+word+'**'),en.replace('{q}','**'+wordsEn[i]+'**')]);
  for(const id of ids.split(' '))variants[id]=rows;
 }
 const more=['ek','daha fazla','çok daha fazla','bayağı fazla','fena fazla'];
 const moreEn=['extra','more','much more','a lot more','seriously more'];
 const amount=['biraz','daha fazla','çok daha fazla','bayağı fazla','fena fazla'];
 const amountEn=['a little','more','much more','a lot more','seriously more'];
 const strength=['biraz','daha çok','çok daha fazla','bayağı','fena'];
 const strengthEn=['a little','more','much more','considerably','seriously'];
 const discount=['küçük bir','daha büyük bir','çok daha büyük bir','bayağı büyük bir','fena büyük bir'];
 const discountEn=['a small','a larger','a much larger','a considerably larger','a seriously larger'];
 const speed=['hızlı','daha hızlı','çok hızlı','bayağı hızlı','fena hızlı'];
 const speedEn=['quickly','more quickly','very quickly','seriously fast','ridiculously fast'];
 const capacity=['düşük hızda','daha hızlı','çok daha hızlı','bayağı hızlı','tam hızda'];
 const capacityEn=['at low speed','faster','much faster','considerably faster','at full speed'];
 const duration=['bir süre','daha uzun','çok daha uzun','bayağı uzun','epey uzun'];
 const durationEn=['for a while','for longer','for much longer','for considerably longer','for a good deal longer'];
 phrase('warmup bal_position pro_coach','Her talimat {q} AP getirir.','Each instruction earns {q} AP.',more,moreEn);
 const automatic=[
  ['Sen **tıklamadan** da talimat üretir.','Produces instructions even **without your clicks**.'],
  ['Sen tıklamadan da **hızlı** talimat üretir.','Produces instructions **quickly**, even without your clicks.'],
  ['Sen tıklamadan da **çok hızlı** talimat üretir.','Produces instructions **very quickly**, even without your clicks.'],
  ['Sen tıklamadan da **bayağı hızlı** talimat üretir.','Produces instructions **seriously fast**, even without your clicks.'],
  ['Sen tıklamadan da **fena hızlı** talimat üretir.','Produces instructions **ridiculously fast**, even without your clicks.']
 ];
 for(const id of ['assistant','bal_coach','pro_coordinator'])variants[id]=automatic;
 phrase('crit_smash bal_precision pro_focus','Kritik AP kazanma şansını {q} artırır.','Increases the chance of critical AP {q}.',strength,strengthEn);
 phrase('fast_internet','İkinci hattı açar, {q} çalıştırır.','Opens the second lane and runs it {q}.',capacity,capacityEn);
 phrase('bal_double','Üçüncü hattı açar, {q} çalıştırır.','Opens the third lane and runs it {q}.',capacity,capacityEn);
 phrase('pro_tempo','Ek hatlar açar, {q} çalıştırır.','Opens extra lanes and runs them {q}.',capacity,capacityEn);
 phrase('echo bal_video','Her beş talimatta {q} ek AP kazan.','Every five instructions earn {q} extra AP.',amount,amountEn);
 phrase('steady bal_plan','Her on otomatik talimatta {q} ek AP kazan.','Every ten automatic instructions earn {q} extra AP.',amount,amountEn);
 phrase('meal bal_evening pro_trainingcash','Gün sonunda {q} ek AP kazan.','Earn {q} extra AP at the end of the day.',amount,amountEn);
 phrase('energy_drink bal_warmstart','Günün ilk talimatları {q} AP getirir.','The first instructions of the day earn {q} AP.',more,moreEn);
 phrase('offline_time bal_shift','Vardiya, sen yokken de {q} çalışır.','Your shift runs {q} while you are away.',duration,durationEn);
 phrase('sugar_boost bal_recovery bal_efficiency bal_remote','Sen yokken {q} ek AP kazan.','Earn {q} extra AP while you are away.',amount,amountEn);
 phrase('collect bal_scout','Rakip raporunu {q} erkene alır.','Brings the rival report forward {q}.',strength,strengthEn);
 phrase('coordinate bal_personal','Ücretsiz yükseltme şansını {q} artırır.','Increases the chance of a free upgrade {q}.',strength,strengthEn);
 phrase('rhythm','Dayanıklılık yükseltmelerine {q} AP indirimi sağlar.','Gives {q} AP discount on stamina upgrades.',discount,discountEn);
 phrase('bal_hands','Elle verdiğin talimatlar {q} AP getirir.','Manual instructions earn {q} AP.',more,moreEn);
 phrase('bal_sponsor bal_orders','Her on talimatta {q} ek bütçe kazan.','Every ten instructions earn {q} extra budget.',amount,amountEn);
 phrase('bal_fans bal_matchsponsor','Her maçtan {q} ek bütçe kazan.','Earn {q} extra budget from every match.',amount,amountEn);
 phrase('bal_shop','Kulübün bütçe gelirini {q} artırır.','Increases the club budget income {q}.',strength,strengthEn);
 phrase('bal_members','Her gün {q} ek bütçe kazan.','Earn {q} extra budget every day.',amount,amountEn);
 phrase('bal_review pro_contract','Galibiyetlerden {q} ek AP kazan.','Earn {q} extra AP from wins.',amount,amountEn);
 phrase('bal_archive bal_mentor','Kart yükseltmelerine {q} AP indirimi sağlar.','Gives {q} AP discount on card upgrades.',discount,discountEn);
 phrase('bal_search','Yeni kataloglar {q} gelir.','New catalogs arrive {q}.',speed,speedEn);
 phrase('bal_contacts','Katalogda {q} aday görürsün.','See {q} candidates in each catalog.',more,moreEn);
 phrase('bal_talent bal_network pro_scout','Güçlü aday bulma şansını {q} artırır.','Increases the chance of a strong candidate {q}.',strength,strengthEn);
 phrase('bal_academy','Yeni adaylar {q} seviyede gelir.','New candidates arrive {q}.',['gelişmiş','daha gelişmiş','çok daha gelişmiş','bayağı gelişmiş','epey gelişmiş'],['developed','more developed','much more developed','considerably more developed','a great deal more developed']);
 phrase('bal_negotiator pro_negotiator pro_adapt','Transfer bedellerine {q} indirim sağlar.','Gives {q} discount on transfer fees.',discount,discountEn);
 phrase('pro_repeat','Her beş ücretli yükseltmede {q} AP geri gelir.','Every five paid upgrades refund {q} AP.',amount,amountEn);
 phrase('pro_analysis','Yeni transferin ilk yükseltmelerine {q} AP indirimi sağlar.','Gives {q} AP discount on a new transfer’s first upgrades.',discount,discountEn);
 phrase('pro_camp','Kamp süresini {q} kısaltır.','Shortens camp duration {q}.',strength,strengthEn);
 phrase('pro_travel','Vardiya maç sırasında da {q} çalışır.','The shift also runs {q} during matches.',duration,durationEn);
 phrase('pro_sponsor','Her üç tamamlanan maçta {q} ek bütçe kazan.','Every three completed matches earn {q} extra budget.',amount,amountEn);
 phrase('pro_shop','Takipçi başına her gün {q} bütçe kazan.','Earn {q} budget per follower each day.',more,moreEn);
 phrase('pro_tickets','Her ücretli kart yükseltmesi {q} bütçe getirir.','Each paid card upgrade earns {q} budget.',more,moreEn);
 phrase('pro_refund','Her beş ücretli kart yükseltmesi {q} bütçe getirir.','Every five paid card upgrades earn {q} budget.',more,moreEn);
 phrase('pro_search','En zayıf role {q} aday önceliği verir.','Gives {q} candidate priority to the weakest role.',more,moreEn);
 phrase('pro_campcash','Kamp bütçe maliyetine {q} indirim sağlar.','Gives {q} discount on camp budget costs.',discount,discountEn);
 phrase('pro_campap','Mesaide {q} ek AP kazan.','Earn {q} extra AP during overtime.',amount,amountEn);
 phrase('pro_merch','Sponsor paylaşımları {q} bütçe getirir.','Sponsored posts earn {q} budget.',more,moreEn);
 phrase('pro_elite','Milletler Kupası’nda elit aday şansını {q} artırır.','Increases elite candidate chances in the Nations Cup {q}.',strength,strengthEn);
 phrase('first_academy','Akademide {q} genç yetiştir.','Train {q} academy youngsters.',more,moreEn);
 phrase('first_campus','Akademi eğitim süresini {q} kısaltır.','Shortens academy training duration {q}.',strength,strengthEn);
 phrase('first_mentor','Mezuniyette seçilen özellik {q} gelişir.','The chosen stat develops {q} at graduation.',strength,strengthEn);
 phrase('first_router','Yeni bir hat açar, {q} çalıştırır.','Opens a new lane and runs it {q}.',capacity,capacityEn);
 phrase('first_payload','Otomatik talimatlar {q} AP getirir.','Automatic instructions earn {q} AP.',more,moreEn);
 phrase('first_flywheel','Otomatik talimat üretimini {q} hızlandırır.','Speeds up automatic instruction production {q}.',strength,strengthEn);
 phrase('media-0','Paylaşımlar {q} hazırlanır.','Posts are prepared {q}.',speed,speedEn);
 phrase('media-1','Her paylaşım {q} takipçi getirir.','Each post earns {q} followers.',
  ['ek','biraz daha fazla','daha fazla','çok daha fazla','bayağı fazla','epey fazla','iyice fazla','fena fazla','çok fena fazla','acayip fazla'],
  ['extra','a few more','more','much more','a lot more','plenty more','even more','seriously more','way more','ridiculously more']);
 phrase('media-2','Takipçi başına sponsor bütçesini {q} artırır.','Increases sponsor budget per follower {q}.',strength,strengthEn);
 phrase('media-3 media-wave','Paylaşımlar {q} talimat dalgası gönderir.','Posts send {q} wave of instructions.',
  ['küçük bir','daha büyük bir','çok daha büyük bir','bayağı büyük bir','fena büyük bir'],
  ['a small','a larger','a much larger','a considerably larger','a seriously larger']);
 phrase('media-queue','Sırada {q} video bekleyebilir.','The queue can hold {q} videos.',more,moreEn);
 function renderCopy(copy) {
  const rows=variants[copy.dataset.blockCopyId];
  if(!rows)return;
  const level=Math.min(rows.length,Math.max(1,Number(copy.dataset.blockCopyLevel)||1));
  const marked=rows[level-1][window.GameLanguage?.current==='en'?1:0];
  const parts=marked.split('**');
  const strong=document.createElement('strong');strong.className='block-copy-emphasis';strong.textContent=parts[1];
  copy.replaceChildren(document.createTextNode(parts[0]),strong,document.createTextNode(parts[2]||''));
 }
 window.addEventListener('spiker-language-changed',()=>document.querySelectorAll('[data-block-copy-id]').forEach(renderCopy));
 function apply(container,id,detail,level=1) {
  if(!container||!variants[id])return;
  const copy=container.querySelector('.block-main-copy, .block-bonus-title');
  if(!copy)return;
  copy.dataset.blockCopyId=id;copy.dataset.blockCopyLevel=String(level);
  copy.setAttribute('data-no-translate','');renderCopy(copy);
  let value=container.querySelector('.block-effect-value');
  if(!value){value=document.createElement('span');value.className='block-effect-value';copy.after(value);}
  value.textContent=detail.replace(/([\d.,]+) talimat\/sn\. otomatik\./,'$1 talimat / sn').replace(/Her talimata ([+\d.,]+) AP\./,'$1 AP / talimat').replace(/Üçüncü hat ana hattın (\d\/5) kapasitesinde düzenli çalışır\./,'Ana hattın $1 hızı').replace(/Saniyede ([+\d.,]+) otomatik talimat\./,'$1 talimat / sn')
   .replace(/Her 10 talimatta ek ([+\d.,]+) bütçe\./,'$1 bütçe / 10 talimat')
   .replace(/Oynanan her maç için ek ([+\d.,]+) bütçe\./,'$1 bütçe / maç');
  const old=container.querySelector('.block-bonus-copy');if(old)old.hidden=true;
 }
 function stack(card,level){card.querySelector(':scope > .block-stack-sheets')?.remove();card.classList.remove('has-block-stack');card.dataset.stackTier=level>=6?'2':level>=3?'1':'0';}
 window.BlockCopy={apply,stack};
})();
