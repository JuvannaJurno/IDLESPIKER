# BAL → 2. Lig test raporu
18 Ekim 2026 — mevcut yerel oyun sürümü

## Sonuç
En büyük sorun AP üretiminin yetersizliği değil: BAL'da mevcut son oyuncu gelişim sınırına ulaşılıyor. 2. Lig'de AP hızla artarken yükseltilecek alan ve işe yarayan transfer azalıyor. Kulüp ekranının üretim sırasında mobil performansı da hâlâ sorunlu. Bu incelemede oyun kodunu değiştirmedim; test araçları, kayıtlar ve rapor oluşturdum.

## Nasıl test edildi?
- Üç ayrı yeni BAL kaydı: otomasyon, dengeli gelişim ve transfer öncelikli kararlar; farklı deterministik tohumlar.
- Her biri BAL başlangıcından 2. Lig son maçına kadar ilerledi: toplam 84 lig maçı kural simülasyonu. Üçünde de BAL yükselme şartı sağlandı.
- Başlangıç: önceki aşamanın blokları tamamlanmış, 12 başlangıç oyuncusu Mahalle Ligi kart seviyesi 10'a yükseltilmiş, BAL blokları boş. BAL'ın standart başlangıç bütçesi/AP'si kullanıldı. Eski bir güçlü kayıt veya Epic Team kullanılmadı.
- Üretim, blok fiyatları ve etkileri, kart yükseltme fiyatı, ücretsiz yükseltme/AP iadesi, transfer, kamp ve lig kuralları doğrudan oyunun JavaScript modüllerinden çalıştırıldı. Kaynak ekleme, bedava transfer veya zorla galibiyet yapılmadı.
- Otomasyon tercihi her 5 sn, dengeli tercih 15 sn, transfer tercihi 30 sn arayla harcama değerlendirdi. Gerekli AP/bütçe olmadan işlem yapılmadı. Serbest elle tıklama, çevrimdışı kazanç ve saat atlatma yok.
- Üretim saati, otomatik hız ve çift talimatın beklenen değeri üzerinden hızlandırıldı. AP kazancında gerçek kritik/ücretsiz yükseltme rastgeleliği kullanıldı. Talimatın sahaya görsel ulaşma gecikmesi ve Ortak Tempo'nun çarpışmayla verdiği ek AP bu modelde yok. Bu yüzden özellikle AP miktarları birebir canlı kayıt vaadi değildir; takvim ve gelişim tavanı bulguları bundan bağımsızdır.
- 18 başlangıç/orta/son kayıt tarayıcıda açıldı. Her biri 320 ve 390 px genişlikte kontrol edildi: 36 yerleşim kontrolü. Kaydedilen oyuncu/katalog adetleri geri yüklendi. Simülasyonda portre üretilmediği için görsel incelemede eksik aday görünümleri mevcut TeamAppearance aracıyla tamamlandı; güçleri değiştirilmedi.
- Normal ve azaltılmış hareket ayarlarında aşama geçişleri de test edildi; iki geçiş testi geçti.
- Ayrıca gerçek maç motorunda 6 tam maç, skill kapıları, animasyon/simülasyon ayrımı ve ışınlanma kontrolü çalıştırıldı. Bunlar sezon koşularındaki 84 maçın birebir görsel oynatımı değildir.

**Sınır:** Bu, üç kez saatler boyunca elle oynanmış bir kullanıcı çalışması değildir. Üç yeni kayıtla hızlandırılmış kural koşusu ve gerçek tarayıcı kontrolleridir. Sezon sıralamaları temel maç çözümleyicisinin sonuçlarıdır; görsel motordaki tüm Legendary müdahalelerini birebir modellemez. Farklı tohum ve strateji birlikte değiştiği için üç koşu, tek bir tercihin nedensel karşılaştırması veya istatistiksel dağılım sayılmaz.

## Süreler
| Koşu | BAL: yalnız üretim | 2. Lig: yalnız üretim | BAL: maç izleme + menü tahmini | 2. Lig: maç izleme + menü tahmini |
|---|---:|---:|---:|---:|
| Otomasyon öncelikli | 46.21 dk (0.77 sa) | 41.49 dk (0.692 sa) | 1.35–1.52 sa | 1.25–1.42 sa |
| Dengeli | 50.74 dk (0.846 sa) | 42.03 dk (0.701 sa) | 1.43–1.59 sa | 1.26–1.43 sa |
| Transfer öncelikli | 53.98 dk (0.9 sa) | 42.8 dk (0.713 sa) | 1.48–1.65 sa | 1.27–1.44 sa |

Üretim süreleri model çıktısıdır. Son iki sütun **tahmindir**: altı gerçek maç motoru testinin aşama başına üç maçlık ortalaması, 14 maça uygulanıp üzerine 5–15 dakika menü süresi eklendi. Örnek maçlar BAL'da 86–186 sn, 2. Lig'de 79–180 sn sürdü; bunlar ideal 60 Hz simülasyon süreleridir. Gerçek cihaz takılması, uzun maç, kararsız kalma ve oyundan çıkma bu süreyi artırır. Menüde geçirilen gerçek kullanıcı zamanı ölçülmedi.

İki aşama birlikte yaklaşık **2,6–3,1 saat** tahmini izlemeli oturum eder. Maçları atlayan ve kararları hızlı veren oyuncu için yalnız üretim toplamı **87,7–96,8 dakika**. Bir saat hedefi değerlendirilirken üretim mi yoksa maçları izleyen toplam oturum mu kastedildiği net olmalı.

## İlerleme ve tıkanmalar
| Koşu | BAL kart yükseltmesi | 2. Lig kart yükseltmesi | 2. Lig transferi | 2. Lig sonu eldeki AP | 2. Lig en uzun yükseltmesiz aralık |
|---|---:|---:|---:|---:|---:|
| Otomasyon öncelikli | 249 | 17 | 0 | 54.0 milyon | 7.2 dk |
| Dengeli | 204 | 19 | 0 | 58.6 milyon | 5.5 dk |
| Transfer öncelikli | 196 | 23 | 1 | 12.5 milyon | 3.5 dk |

### P0 — BAL oyuncu gelişimini çok erken tüketiyor
İki aşamada da mevcut nihai stat sınırı 160, kart tavanı 48. Otomasyon koşusunda üç başlangıç oyuncusu BAL sonunda 48/48; 2. Lig sonunda yedi oyuncunun tamamı 48/48. Örnek smaçör 158 smaç/160 sınırında. Buradaki problem OVR'nin 160 olmaması değil: oyuncunun önemli gelişimi önceki ligde tamamlanıyor ve yeni lig bunu yeniden açmıyor.

Dengeli koşuda da 2. Lig sonunda dört aktif oyuncu 48/48. AP üretimini artırmak tek başına çözüm değil; zaten 58,6 milyon AP elde kalıyor. **Öneri:** BAL ve 2. Lig için ayrı gelişim alanı tanımlamak; 2. Lig'de kadronun tekrar düzenli yükseltilebilmesini sağlamak. Stat/kart sınırlarını ve kamp kazançlarını birlikte dengelemek gerekir.

### P0 — İleri lig transferleri kadroya yetişmiyor
Aday gücü hedefi scout-rules.js içinde 92 OVR ile sınırlanıyor. Sezon sonu kataloglarında en yüksek adaylar 92 OVR iken ortalama aktif kadro yaklaşık 95–100 OVR. Yüksek OVR şansı ve İhtiyaç Analizi bir aday çıkarıyor ama gerekli gücü üretmeye yetmiyor.

Dengeli koşuda 168 katalog yenilenmesine rağmen 2. Lig'de transfer yapılmadı. Transfer odaklı koşuda 92 katalogda yalnız bir iyileştirme satın alındı. Bu, bütün adayların değersiz olduğu anlamına gelmez; farklı rollerde hâlâ işe yarayan aday olabilir. Ancak güçlenmiş ilk kadro için ana hedef çok düşük kalıyor.

**Öneri:** İleri lig aday hedefini aynı pozisyondaki güncel kadro gücüne bağlamak; çoğunluğu benzer/zayıf, küçük bir bölümü açıkça daha iyi üretmek. Yıldız ve Legendary niteliği, düşük mevcut gücü saklayan fiyat primi olmamalı.

### P1 — Transfer ağırlıklı oyun kadro kapasitesine çarpıyor
Transfer koşusunda BAL sonu 29, 2. Lig sonu 30 oyuncu var. Son kayıtta transfer tuşu kapasite yüzünden devre dışı. 30 kişilik sınıra karşı kullanılabilir bir oyuncuyla yolları ayırma/değişim akışı bu kontrolde bulunamadı; yedeğe almak kapasiteyi azaltmıyor.

**Öneri:** Takas/ayrılma ya da satın alırken bir yedekle değiştirme akışı. Oyuncuyu daha ilk etapta kapasiteye yaklaşırken bilgilendirmek.

### P1 — Sezon bitiyor, blok hedefleri çok uzakta kalıyor
BAL'ın 15 bloğu üç koşuda da tamamlandı. 2. Lig'in 12 ana bloğundan yalnız 3–4'ü tamamlandı. Kalan ana bloklar için gereken toplam ek bütçe **44,4–48,3 milyon**; eldeki bütçe yaklaşık **0,35–1 milyon**. Bu tek başına her bloğun sezon sonunda bitmesi gerektiğini göstermez; mevcut hedeflerin önemli kısmının sezon dışına taştığını gösterir.

**Öneri:** Özellikle 6–10. seviyelerin maliyetlerini sezondaki gerçek gelirle eşleştirmek; birkaç seçili bloğun tamamlanması ile tümünü bitirme hedefini açıkça ayırmak.

### P1 — Sponsor açıklaması ile ödül koşulu farklı
Lig Sponsorluğu “Her 3 tamamlanan maçta” diyor. Sayacı artıran RoomRules.matchReward yalnız galibiyetlerde LeagueSeason.syncRewards tarafından çağrılıyor. Sonuç: ödeme üç oynanan maç yerine üç galibiyette bir geliyor.

Bu kural simülasyonunda da canlı çağrı sırası izlenerek ödül sadece galibiyete verildi. **Öneri:** Sponsor sayacını maç katılımı/sonucu kaydına taşımak; AP galibiyet ödülünden ayırmak. Açıklamayı sadece “galibiyet” yapmak, önceki tasarım niyetini değiştirir.

## Sıkıcı veya zayıf kalan bölümler
- **BAL başı ile sonu arasında büyük tempo farkı var.** İlk 10 dakikada 108–118 kart yükseltmesi, 30–40. dakika aralığında 8–28 yükseltme yapıldı. Son bölümde büyüme hissi belirgin biçimde azalıyor.
- **2. Lig'de yükseltme ödülü veren blokların tetiklenmesi çok azalıyor.** Gelişim Takibi beş yükseltme isterken tüm sezonda 17–23 yükseltme var. Uyum Antrenmanı, işe yarayan transfer çıkmadığında neredeyse kullanılmıyor. Bu blokları güçlendirmeden önce gelişim/transfer tavanı çözülmeli.
- **Katalog yenileme çok sık, anlamlı seçim çok az.** 2. Lig'de koşuya göre 92–234 katalog açıldı. Bu, hızlı stratejide 10–11 saniyede bir rapora karşılık geliyor. Oyuncunun bunu kaçırması oyunu bozmaz; ama her rapora bakmaya çalışan oyuncu için gacha zamanla düşük değerli tekrara dönüşüyor.
- **Sosyal medya 43–46 paylaşım eylemi ekledi.** Aynı sezonun 17–23 oyuncu yükseltmesine karşı paylaşım ve katalog kontrolü daha baskın hâle gelebiliyor. Anlamlı kadro kararları geri plana düşüyor.
- **Maç bekleyişi üretimi durdurduğu için ekranda kalma baskısı var.** Buradaki saatler kesintisiz online üretim varsayıyor. Maçı açmadan beklemek gerçek oturumu uzatır; bu kullanıcı davranışı simülasyon sürelerine dahil değil.

## Mobil performans
İlk ölçümlerde maç bekleyen kayıtlarda yaklaşık 60 FPS görüldü; talimat sayısının değişmediği fark edilince bu ölçümler aktif üretim kanıtı olarak kullanılmadı.

Aşağıdaki testte **takvimdeki maç durması test içinde geçici olarak kaldırıldı**, normal otomasyon tekrar bağlandı ve talimat sayısının arttığı doğrulandı. Oyun dosyaları değiştirilmedi. 390×844, headless Edge, her koşulda yaklaşık 3 sn ölçüm. Bu gerçek telefon ölçümü değildir; kısa, tekrarlanması gereken masaüstü stres örneğidir.

| Aşama | CPU yavaşlatma | Yaklaşık FPS | >50 ms kareler | En uzun kare | Stil hesaplama süresi |
|---|---:|---:|---:|---:|---:|
| BAL | 1× | 28.0 | 15 / 84 | 317 ms | 1.57 sn |
| BAL | 4× | 5.7 | 15 / 18 | 283 ms | 2.64 sn |
| 2. Lig | 1× | 21.6 | 15 / 65 | 250 ms | 2.05 sn |
| 2. Lig | 4× | 4.2 | 9 / 13 | 550 ms | 2.37 sn |

**P0:** Aktif üretim sırasında mobil akıcılık yeterli değil. 4× yavaşlatmada 4–6 FPS görüldü. Zamanın önemli kısmı JavaScript hesaplamasından ziyade stil yeniden hesaplamasında geçiyor. Normal CPU'da da 22–28 FPS aralığı iyi değil.

Öncelikli inceleme alanları: rooms.js içindeki sık kaynak/blok güncellemeleri, menu.js ile menu-feedback.js talimat/ödül DOM değişimleri, geniş alt ağaçlara uygulanan energized ve :has seçicileri. Bunlar kaynak incelemesine dayanan adaylar; her seçicinin katkısı ayrı A/B testiyle kanıtlanmış değil. **Öneri:** Üretim görüntüsünü daha küçük ve izole bir katmana almak, DOM metin/özellik yazmalarını azaltmak ve görünmeyen blokların stil işini sınırlandırmak. Yeni neon/parlama efektlerini artırmadan bunu çözmek gerekiyor.

## Tasarım ve kullanım kolaylığı
- **Geçen kontrol:** 18 kayıt, 320/390 px genişlikte iki sütunu korudu; sayfa ve karşılaştırma ekranında yatay taşma saptanmadı. Konsola düşen JavaScript hatası yok.
- **Geçen kontrol:** Karşılaştırmanın altındaki transfer tuşu mevcut. Ayrı transfer/kadroya alma testinde satın alma, yedekte bırakma ve seçili pozisyona alma çalıştı. Dolu kadroda tuş kapandı.
- **Sorun:** Teknik Ekip / Sportif Direktörlük alanı bazı kayıtlarda başlık ve boş çerçeve olarak kalıyor. Mobilde yaklaşık 120 px dikey alan tüketip kadroyu aşağı itiyor. İçerik yoksa bu alan kapanmalı.
- **Sorun:** Bazı 320 px kayıtlarda ilk oyuncu kartları ekranın 720–808 px aşağısında başlıyor. Transfer çağrısı ve tavsiye panelleri birlikte kadroyu ilk görünümün dışına taşıyor. Yatay taşma olmaması ekranın rahat kullanıldığı anlamına gelmiyor.
- **Sorun:** Kamp yıldızı, kart seviyesi ve stat sınırının rolleri arayüzde hâlâ kolay karışabiliyor. Özellikle 48/48, üç kamp ve birikmiş AP birlikte görünürken “neden ilerleyemiyorum?” sorusu oluşuyor. Uzun açıklama yerine tek net sınır durumu ve sonraki gerçek eylem gösterilmeli.
- **Sorun:** Transferde “kadroya katıldı” ile ilk yediye girmek aynı anlama gelebiliyor. Yeni sorulu akış bunu azaltıyor; başarı mesajları da “yedekte” ve “ilk kadroda” diye tutarlı kalmalı.

## Yapılmasını önerdiğim sıra
1. Aktif kulüp üretiminde stil/DOM yükünü düşür; 30–60 sn kesintisiz yükte tekrar ölç.
2. BAL ile 2. Lig'in oyuncu gelişim alanlarını ayır; ardından yükseltme sıklığını yeniden ölç.
3. 2. Lig transfer hedeflerini güncel kadroya göre düzelt; 30 kişilik sınır için çıkış yolu ekle.
4. Sponsorun maç/galibiyet sayacı tutarsızlığını düzelt.
5. Blok maliyetleri ve katalog sıklığını yeni ilerleme eğrisine göre ayarla.
6. Boş tavsiye alanını kaldır, ilk kadroyu mobilde daha yukarı getir; üç koşuyu tekrar çalıştır.

## Kanıtlar
- runs.json: tohumlar, her aşamanın olayları, maç sonuçları, harcamalar ve 18 tam kontrol kaydı.
- browser.json: kayıt yükleme, yerleşim, konsol hatası ve aktif üretim stres ölçümleri.
- matches.json: altı gerçek maç motoru testi; süre, skor ve skill olayları.
- run-audit.cjs, browser-audit.cjs, match-audit.cjs: yeniden çalıştırma araçları.
- stage-2-middle-team.png / stage-3-middle-team.png: boş tavsiye alanının ekran görüntüleri.

Yeniden çalıştırma: proje kökünde node audit-2026-10-18/run-audit.cjs; ardından browser.json dosyasını ayrı bir kopyaya alarak browser-audit.cjs çalıştırılmalı (tarayıcı aracı tamamlanan kayıtları atlayarak devam eder). Son olarak match-audit.cjs ve write-report.cjs çalıştırılabilir. Bu dosyalar test içindir; normal oyuna bağlanmadı.
