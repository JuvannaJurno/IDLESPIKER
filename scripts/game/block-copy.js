(function () {
 'use strict';
 const summaries = {};
 function group(ids, text) { for (const id of ids.split(' ')) summaries[id] = text; }
 group('warmup bal_position pro_coach', 'Her talimattan daha çok AP kazan.');
 group('assistant bal_coach pro_coordinator', 'Sen tıklamadan talimat üretir.');
 group('crit_smash bal_precision pro_focus', 'Talimatların daha sık kritik AP verir.');
 group('fast_internet', 'İkinci talimat hattını açar ve hızlandırır.');
 group('bal_double', 'Üçüncü talimat hattını çalıştırır.');
 group('pro_tempo', 'Ek talimat hatlarını hızlandırır.');
 group('echo bal_video', 'Her beş talimatta ek AP kazan.');
 group('steady bal_plan', 'Her on otomatik talimatta ek AP kazan.');
 group('meal bal_evening', 'Gün sonunda ek AP kazan.');
 group('energy_drink bal_warmstart', 'Günün ilk talimatları daha çok AP verir.');
 group('offline_time bal_shift', 'Sen yokken de kulüp çalışır.');
 group('sugar_boost bal_recovery bal_efficiency bal_remote', 'Sen yokken daha çok AP kazan.');
 group('collect bal_scout', 'Rakibini daha erken tanı.');
 group('coordinate bal_personal', 'Bazı kart yükseltmeleri ücretsiz olur.');
 group('rhythm', 'Dayanıklılığı daha az AP ile yükselt.');
 group('bal_hands', 'Elle verdiğin talimatlar daha çok AP verir.');
 group('bal_sponsor bal_orders', 'Talimatlardan bütçe kazandırır.');
 group('bal_fans bal_matchsponsor', 'Her maçtan ek bütçe kazandırır.');
 group('bal_shop', 'Kulübün bütçe gelirini artırır.');
 group('bal_members', 'Her gün ek bütçe kazan.');
 group('bal_review pro_contract', 'Galibiyetlerden daha çok AP kazan.');
 group('bal_archive bal_mentor', 'Kartları daha az AP ile yükselt.');
 group('bal_search', 'Yeni oyuncular daha sık gelir.');
 group('bal_contacts', 'Katalogda daha çok oyuncu gör.');
 group('bal_talent bal_network pro_scout', 'Daha güçlü oyuncular bulma şansın artar.');
 group('bal_academy', 'Yeni oyuncular daha gelişmiş gelir.');
 group('bal_negotiator pro_negotiator pro_adapt', 'Transferlere daha az bütçe harca.');
 group('pro_repeat', 'Yükseltmeye harcadığın AP’nin bir kısmı geri gelir.');
 group('pro_analysis', 'Yeni transferleri daha az AP ile yükselt.');
 group('pro_camp', 'Oyuncular kamptan daha erken döner.');
 group('pro_travel', 'Maç sırasında kulüp çalışmaya devam eder.');
 group('pro_sponsor', 'Maçları tamamladıkça bütçe kazan.');
 group('pro_shop', 'Takipçiler günlük bütçe kazandırır.');
 group('pro_tickets pro_trainingcash', 'Kart yükselttikçe bütçe kazan.');
 group('pro_search', 'Takımın eksik rolüne oyuncu bul.');
 group('pro_refund', 'Kart yükselttikçe ek bütçe kazan.');
 group('pro_campcash', 'Kamplara daha az bütçe harca.');
 group('pro_campap', 'Mesaide daha çok AP kazan.');
 group('pro_merch', 'Sponsor paylaşımları daha çok bütçe verir.');
 group('pro_elite', 'Milletler Kupası’nda elit aday şansını artırır.');
 group('first_academy', 'Akademide daha çok oyuncu yetiştir.');
 group('first_campus', 'Akademideki eğitimler daha erken biter.');
 group('first_mentor', 'Gençlerin seçilen özelliği mezuniyette daha çok artar.');
 group('first_router', 'Yeni bir talimat hattı açar.');
 group('first_payload', 'Otomatik talimatlar daha çok AP verir.');
 group('first_flywheel', 'Otomatik talimat üretimini hızlandırır.');
 group('media-0', 'Paylaşımlar daha hızlı hazırlanır.');
 group('media-1', 'Her paylaşımdan daha çok takipçi kazan.');
 group('media-2', 'Sponsorlar takipçilerine göre bütçe verir.');
 group('media-3 media-wave', 'Paylaşımlar toplu talimat gönderir.');
 group('media-queue', 'Bir video hazırlanırken diğerlerini sıraya al.');
 const automaticIds = new Set(['assistant', 'bal_coach', 'pro_coordinator']);
 const automaticCopy = [
  ['Sen tıklamadan da talimat üretir.', 'tıklamadan', 'without your clicks'],
  ['Sen tıklamadan da hızlı talimat üretir.', 'hızlı', 'quickly'],
  ['Sen tıklamadan da çok hızlı talimat üretir.', 'çok hızlı', 'very quickly'],
  ['Sen tıklamadan da bayağı hızlı talimat üretir.', 'bayağı hızlı', 'seriously fast'],
  ['Sen tıklamadan da fena hızlı talimat üretir.', 'fena hızlı', 'ridiculously fast']
 ];
 function renderAutomatic(copy) {
  const [source, tr, en] = automaticCopy[Number(copy.dataset.automaticCopy) || 0];
  const text = window.GameLanguage?.text(source) || source;
  const emphasis = text === source ? tr : en;
  const index = text.indexOf(emphasis);
  copy.replaceChildren();
  if (index < 0) { copy.textContent = text; return; }
  const strong = document.createElement('strong');
  strong.className = 'block-copy-emphasis';
  strong.textContent = emphasis;
  copy.append(document.createTextNode(text.slice(0, index)), strong, document.createTextNode(text.slice(index + emphasis.length)));
 }
 window.addEventListener('spiker-language-changed', () => {
  document.querySelectorAll('[data-automatic-copy]').forEach(renderAutomatic);
 });
 function apply(container, id, detail, level = 1) {
  if (!container || !summaries[id]) return;
  const copy = container.querySelector('.block-main-copy, .block-bonus-title');
  if (!copy) return;
  if (automaticIds.has(id)) {
   // Levels 6–10 improve the separate bonus; the primary rate stops at level 5.
   copy.dataset.automaticCopy = String(Math.min(5, Math.max(1, Math.floor(Number(level) || 1))) - 1);
   copy.setAttribute('data-no-translate', '');
   renderAutomatic(copy);
  } else {
   delete copy.dataset.automaticCopy;
   copy.removeAttribute('data-no-translate');
   copy.textContent = summaries[id];
  }
  let value = container.querySelector('.block-effect-value');
  if (!value) { value = document.createElement('span'); value.className = 'block-effect-value'; copy.after(value); }
  value.textContent = detail.replace(/([\d.,]+) talimat\/sn\. otomatik\./, '$1 talimat / sn').replace(/Her talimata ([+\d.,]+) AP\./, '$1 AP / talimat').replace(/Üçüncü hat ana hattın (\d\/5) kapasitesinde düzenli çalışır\./, 'Ana hattın $1 hızı').replace(/Saniyede ([+\d.,]+) otomatik talimat\./, '$1 talimat / sn')
   .replace(/Her 10 talimatta ek ([+\d.,]+) bütçe\./, '$1 bütçe / 10 talimat')
   .replace(/Oynanan her maç için ek ([+\d.,]+) bütçe\./, '$1 bütçe / maç');
  const old = container.querySelector('.block-bonus-copy');
  if (old) old.hidden = true;
 }
 function stack(card, level) {
  card.querySelector(':scope > .block-stack-sheets')?.remove();
  card.classList.remove('has-block-stack');
  card.dataset.stackTier = level >= 6 ? '2' : level >= 3 ? '1' : '0';
 }
 window.BlockCopy = { apply, stack };
})();
