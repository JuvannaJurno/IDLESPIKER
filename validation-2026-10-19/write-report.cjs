const fs=require('fs'),path=require('path'),R=require('../room-rules'),B=require('../bal-rules'),runs=require('./runs.json'),names={automation:'Otomasyon',balanced:'Dengeli',transfers:'Transfer öncelikli'};
const browser=fs.existsSync(__dirname+'/browser.json')?require('./browser.json'):[];
let report=`# BAL → 2. Lig test raporu
19 Ekim 2026 — yeni BAL fiyatları, kadro değişimi ve maç sponsorluğu sonrası

## Sonuç
Üç yeni koşu da BAL'dan yükselip 2. Lig'in 14. maçını tamamladı. 30 kişilik kadro artık transferi durdurmuyor: transfer sırasında ilk kadroda veya kampta olmayan bir yedekle değişim yapılabiliyor. Sponsor sayacı galibiyetten ayrıldı ve tamamlanan maçlarda ilerliyor. Boş tavsiye çerçeveleri gizleniyor; maç tavsiyeleri ilk kadronun altına taşındı. Düzelmiş eski sorun maddeleri aşağıdaki açık sorun listesinden kaldırıldı.

## Nasıl ölçüldü?
- Üç farklı deterministik tohum ve karar tarzı: otomasyon 5 sn, dengeli 15 sn, transfer odaklı 30 sn aralıklarla karar verir.
- Her koşu önceki aşama blokları tamamlanmış, başlangıç kartları seviye 10 ve standart BAL kaynaklarıyla başlar. Epic Team, eklenmiş AP/bütçe, bedava transfer ve zorla galibiyet yok.
- Oyun içindeki gerçek ekonomi, kart, kamp, transfer, sponsor ve lig kural modülleri kullanıldı. Yeni iki 10 seviyelik BAL bloğu ve son fiyatları dahil.
- Dolu kadroda yalnız yedek ve kampta olmayan oyuncular değiştirildi; en düşük OVR'li uygun yedek seçildi. Yeni transfer aktif pozisyona yerleştirilirken önceki aktif oyuncu yedeğe döner.
- Her iki ligde 14'er, toplam 84 maç temel kural çözümleyicisiyle hesaplandı. Tamamlanan her maç katılım/sponsor sayacına, yalnız kazanılan maç galibiyet AP ödülüne işlendi. Son maçtan sonra da son harcama kararı değerlendirildi.
- Üretim hızı ve çift talimatın beklenen değeriyle hızlandırılmış simülasyondur; saatlerce elle oynanmış kullanıcı oturumu değildir. Görsel Legendary müdahaleleri ve Ortak Tempo'nun görsel çarpışmayla verdiği ek AP, ekonomi modeline dahil değildir.

## Süre ve sezon sonucu

| Tarz | BAL üretim dk | 2. Lig üretim dk | Toplam üretim dk | BAL sırası | 2. Lig sırası |
|---|---:|---:|---:|---:|---:|
`;
for(const r of runs){const [a,b]=r.stages;report+=`| ${names[r.strategy]} | ${a.productionMinutes} | ${b.productionMinutes} | ${(a.productionMinutes+b.productionMinutes).toFixed(2)} | ${a.rank} | ${b.rank} |\n`;}
report+=`
Bu dakikalara maç izleme, menüde düşünme ve çevrimdışı bekleme dahil değil. Güncel toplam izlemeli oturum süresi ölçülmedi; önceki sürümün saat tahmini yeni sonuç gibi kullanılmadı. Üç tohum farklı stratejilerle birlikte değiştiği için tek bir tercihin nedensel etkisi veya geniş kullanıcı dağılımı olarak yorumlanmamalı.

## 2. Lig gelişimi ve transfer

| Tarz | Kart yükseltme | En uzun yükseltmesiz süre | Transfer | Dolu kadroda değişim | Son kadro | Elde AP |
|---|---:|---:|---:|---:|---:|---:|
`;
for(const r of runs){const b=r.stages[1],start=r.checkpoints.find(c=>c.name==='stage-3-start'),end=r.checkpoints.find(c=>c.name==='stage-3-end'),swaps=b.transfers-(end.players.length-start.players.length);report+=`| ${names[r.strategy]} | ${b.upgrades} | ${(b.maxUpgradeGap/60).toFixed(1)} dk | ${b.transfers} | ${swaps} | ${end.players.length}/30 | ${(b.ap/1e6).toFixed(2)} milyon |\n`;}
report+=`
Değişim sayısı, transfer adedinden kadro büyümesinin çıkarılmasıyla hesaplandı; bu koşuda başka oyuncu ekleme/çıkarma kaynağı yok. Transfer odaklı koşu 30 kişilik sınıra ulaştıktan sonra da devam etti. Maç kadrosu ve kamptaki oyuncular değişimden korunuyor. Ayrılan oyuncunun kamp artışları ve portresi yeni oyuncuya aktarılmıyor. Yeni oyuncunun kendi kamp geçmişi korunuyor.

## Gerçek tarayıcı doğrulaması
- Ayrı değişim ekranında iki kart yan yana; iptal bütçeyi ve kadroyu korur. Onay satın alır; ardından ilk kadroya alma sorulur.
- 320/390 px ekranlarda yatay taşma yok. İlk kadro ve kamp oyuncuları seçeneklerde yok; kural katmanı da aynı korumayı uygular.
- Zorlanmış kayıt yazma hatasında satın alma geri alınır. Başarılı değişim, doğru fiyat, aktif kadronun korunması, sonraki kart yükseltmesi, yıldızlar, yeni portre ve sayfa yenileme test edildi. Başlangıç kadrosundan bir yedeğin farklı rolde adayla değiştirilmesi de yeniden yüklemede korundu.
- Canlı lig akışında yenilgi / galibiyet / yenilgi kaydedildi: üçüncü maçta sponsor ödemesi geldi; AP yalnız galibiyetten geldi. Ödül eşitlemesi tekrarlandığında ikinci ödeme yapılmadı.
- Boş tavsiye alanı baştan gizli. Veri geldiğinde içerikle gösterilir; takım ekranında ilk kadronun ardından gelir. Kilitli transfer tavsiyesi mevcut tasarımda kalır.
`;
if(browser.length){const layouts=browser.flatMap(r=>r.layouts),bad=layouts.filter(x=>x.overflow),errors=browser.flatMap(r=>r.errors),comp=browser.filter(r=>r.comparison?.overflow),y=layouts.filter(x=>x.width===320).flatMap(x=>x.cards.slice(0,1).map(c=>c.y));report+=`- ${browser.length}/18 kontrol kaydı, ${layouts.length} adet 320/390 px yerleşim ölçümü: ${bad.length} sayfa taşması, ${comp.length} karşılaştırma taşması, ${errors.length} JavaScript hatası. 320 px ilk kartın ekran başlangıcına göre konumu ${Math.round(Math.min(...y))}–${Math.round(Math.max(...y))} px; önceki incelemede 720–808 px'e inebiliyordu.\n`;}
report+=`
Bu kontroller fiziksel telefon ölçümü değildir. Önceki performans düzeltmesinin 4× işlemci stresinde yaklaşık 54–57 FPS sonucu ayrı [performans raporunda](../performance-2026-10-19/sonuc.md) duruyor; gerçek cihaz kontrolü hâlâ gerekli.

## Açık kalanlar

### P1 — 2. Lig bloklarının son seviyeleri sezon gelirinin çok ötesinde
`;
for(const r of runs){const end=r.checkpoints.find(c=>c.name==='stage-3-end'),s=r.stages[1];let cost=0;for(const block of B.catalog.filter(b=>b.division===3)){const draft=structuredClone(end.room);while(R.count(draft,block.id)<R.maxLevel(draft,block)){cost+=B.price(draft,block);draft.floors[block.floor].push(block.id);}}report+=`- ${names[r.strategy]}: 12 ana bloktan ${s.blocksCompleted} tamamlandı. Kalan yatırım ${(cost/1e6).toFixed(1)} milyon; elde ${(s.budget/1e6).toFixed(2)} milyon bütçe.\n`;}
report+=`
Sonraki denge işi, 2. Lig'de hangi blokların sezon sonunda tamamlanmasının hedeflendiğini belirleyip özellikle 6–10. seviye maliyetlerini bu gelire yaklaştırmak. Bu çalışmada profesyonel blok fiyatları değiştirilmedi.

### P2 — Katalog ve paylaşım tekrarı
`;
for(const r of runs){const b=r.stages[1],posts=r.events.filter(e=>e.division===3&&e.type==='post').length;report+=`- ${names[r.strategy]}: ${b.catalogs} katalog, ${posts} paylaşım, ${b.transfers} transfer.\n`;}
report+=`
Transferler artık kadroya katkı sağlıyor; buna rağmen her raporu takip eden oyuncu için kontrol sayısı fazla olabilir. Anlamlı aday bildirimi ve katalog sıklığı ayrıca ele alınmalı.

### P2 — Maçı açmadan bekleme ve gerçek oturum süresi
Maç bekleyişi üretimi durduruyor. Kullanıcının bu ekranda beklemesi ve menüde karar süresi modele dahil değil. Hedef süreyi gerçek izleme/atlama alışkanlıklarıyla ayrıca test etmek gerekiyor.

### P2 — Son maçlar ve gerçek cihaz
Üç ekonomik sezonun tüm 84 maçı görsel motorla oynanmadı. Son zorluk ayarı, artık açılma koşulu değişen Legendary etkileri ve farklı kadro tercihleriyle daha geniş görsel örneklem; ayrıca gerçek telefon testi gerekli.

## Kanıtlar ve yeniden çalıştırma
- [Güncel ekonomik koşular](../validation-2026-10-19/runs.json): olaylar, harcamalar, 84 skor, 18 tam kayıt.
- [Tarayıcı kontrolleri](../validation-2026-10-19/browser.json): yerleşim, yükleme, konsol ve stres örnekleri.
- test-roster-replacement.cjs: kural korumaları, kamp bağımsızlığı, rol değişimi ve sponsor sayacı.
- test-transfer-replace-browser.cjs: gerçek UI, iptal/yazma hatası, değişim/yükseltme/yeniden açma ve kayıplı-kazanımlı maçlarda sponsor.
- test-transfer-lineup.cjs, test-transfer-reload.cjs, test-scout-consistency.cjs, test-professional-blocks.cjs: normal transfer ve blok kontrolleri.
- Önceki audit-2026-10-18, progression-2026-10-19 ve bal-finale-2026-10-19 ham sonuçları tarihsel karşılaştırma içindir.

Çalıştırma: node validation-2026-10-19/run-audit.cjs; ardından node validation-2026-10-19/browser-audit.cjs (tamamlanan kayıtları atlar); son olarak node validation-2026-10-19/write-report.cjs. Üç koşu test aracıdır; normal oyuna bağlanmadı.
`;
fs.writeFileSync(path.join(__dirname,'sonuc.md'),report);fs.writeFileSync(path.join(__dirname,'../audit-2026-10-18/rapor.md'),report);
