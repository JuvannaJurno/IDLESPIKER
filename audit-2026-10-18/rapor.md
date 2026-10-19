# BAL → 2. Lig test raporu
19 Ekim 2026 — transfer keşfi, aday bildirimleri ve blok fiyatları sonrası

## Sonuç
Üç yeni koşu da BAL'dan yükselip 2. Lig'in 14. maçını tamamladı. 30 kişilik kadro artık transferi durdurmuyor: transfer sırasında ilk kadroda veya kampta olmayan bir yedekle değişim yapılabiliyor. Sponsor sayacı galibiyetten ayrıldı ve tamamlanan maçlarda ilerliyor. Boş tavsiye çerçeveleri gizleniyor; Sportif Direktörlük ilk kadronun üstünde tutuluyor. Düzelmiş eski sorun maddeleri aşağıdaki açık sorun listesinden kaldırıldı.

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
| Otomasyon | 47.44 | 41.49 | 88.93 | 1 | 5 |
| Dengeli | 51.46 | 41.88 | 93.34 | 1 | 3 |
| Transfer öncelikli | 56.35 | 42.69 | 99.04 | 1 | 1 |

Bu dakikalara maç izleme, menüde düşünme ve çevrimdışı bekleme dahil değil. Güncel toplam izlemeli oturum süresi ölçülmedi; önceki sürümün saat tahmini yeni sonuç gibi kullanılmadı. Üç tohum farklı stratejilerle birlikte değiştiği için tek bir tercihin nedensel etkisi veya geniş kullanıcı dağılımı olarak yorumlanmamalı.

## 2. Lig gelişimi ve transfer

| Tarz | Kart yükseltme | En uzun yükseltmesiz süre | Transfer | Dolu kadroda değişim | Son kadro | Elde AP |
|---|---:|---:|---:|---:|---:|---:|
| Otomasyon | 121 | 1.5 dk | 0 | 0 | 12/30 | 12.83 milyon |
| Dengeli | 162 | 1.0 dk | 6 | 0 | 23/30 | 3.82 milyon |
| Transfer öncelikli | 160 | 1.5 dk | 15 | 11 | 30/30 | 4.21 milyon |

Değişim sayısı, transfer adedinden kadro büyümesinin çıkarılmasıyla hesaplandı; bu koşuda başka oyuncu ekleme/çıkarma kaynağı yok. Transfer odaklı koşu 30 kişilik sınıra ulaştıktan sonra da devam etti. Maç kadrosu ve kamptaki oyuncular değişimden korunuyor. Ayrılan oyuncunun kamp artışları ve portresi yeni oyuncuya aktarılmıyor. Yeni oyuncunun kendi kamp geçmişi korunuyor.

## Gerçek tarayıcı doğrulaması
Bu bölüm önceki arayüz kontrol kayıtlarını içerir. Fiyat değişikliğinden sonra test-stage-block-browser.cjs ile 320/390 px blok görünümü, satın alma ve seviye sınırları yeniden doğrulandı.
- Ayrı değişim ekranında iki kart yan yana; iptal bütçeyi ve kadroyu korur. Onay satın alır; ardından ilk kadroya alma sorulur.
- 320/390 px ekranlarda yatay taşma yok. İlk kadro ve kamp oyuncuları seçeneklerde yok; kural katmanı da aynı korumayı uygular.
- Zorlanmış kayıt yazma hatasında satın alma geri alınır. Başarılı değişim, doğru fiyat, aktif kadronun korunması, sonraki kart yükseltmesi, yıldızlar, yeni portre ve sayfa yenileme test edildi. Başlangıç kadrosundan bir yedeğin farklı rolde adayla değiştirilmesi de yeniden yüklemede korundu.
- Canlı lig akışında yenilgi / galibiyet / yenilgi kaydedildi: üçüncü maçta sponsor ödemesi geldi; AP yalnız galibiyetten geldi. Ödül eşitlemesi tekrarlandığında ikinci ödeme yapılmadı.
- Boş tavsiye alanı baştan gizli. Veri geldiğinde içerikle gösterilir; takım ekranında ilk kadronun önünde gelir. Kilitli transfer tavsiyesi mevcut tasarımda kalır.
- 18/18 kontrol kaydı, 36 adet 320/390 px yerleşim ölçümü: 0 sayfa taşması, 0 karşılaştırma taşması, 0 JavaScript hatası. 320 px ilk kartın ekran başlangıcına göre konumu 353–353 px; önceki incelemede 720–808 px'e inebiliyordu.

Bu kontroller fiziksel telefon ölçümü değildir. Önceki performans düzeltmesinin 4× işlemci stresinde yaklaşık 54–57 FPS sonucu ayrı [performans raporunda](../performance-2026-10-19/sonuc.md) duruyor; gerçek cihaz kontrolü hâlâ gerekli.

## 2. Lig blok dengesi

10 seviyelik profesyonel blokların toplam fiyatı 6,797 milyondan 1,87 milyon bütçeye indirildi. İlk satın alma 30 bin olarak korundu; 6–10. seviyelerin toplamı 5,8 milyondan 1,45 milyona düştü. Ek özelliklerin seviyeye göre gelişimi korunuyor. Mevcut blok seviyeleri ve kayıtlar değişmiyor.

Güncel üç koşuda bütçeyi bloklara ayıran otomasyon ve dengeli stratejiler bütün profesyonel blokları tamamladı. Transfer öncelikli koşuda kadroya daha fazla kaynak ayrıldı; son durum aşağıda. İlk ucuz deneme ve pahalı ara deneme ayrı ham kayıtlarda korunuyor.

- Otomasyon: 12 bloktan 12 tamamlandı; kalan yatırım 0.00 milyon, elde 4.77 milyon bütçe.
- Dengeli: 12 bloktan 12 tamamlandı; kalan yatırım 0.00 milyon, elde 1.01 milyon bütçe.
- Transfer öncelikli: 12 bloktan 4 tamamlandı; kalan yatırım 3.12 milyon, elde 0.17 milyon bütçe.

## Transfer keşfi düzeltmesi

Sportif Direktörlük kullanıcı tercihine göre kadronun üstüne geri alındı. Transfer Merkezi ikonunda sonraki kataloğa kalan oyun gününü gösteren sayaç ve hazırlık ilerleme halkası var; katalog hazırken onay işaretine döner.

Katalog aralığı Keşif Ağı seviyesine göre 10 → 5 oyun günü. Önceki en kısa aralık 1 gündü. Temel güçlü aday ihtimali tarama seviyesine göre %14 → %72; ek bloklarla üst sınır %92. İsimli elitlerin %2,5 taban ihtimali ve en fazla %3 sınırı korunuyor. Hazır adayları otomatik yenileme yok; mevcut adaylar kullanıcı yenileyene kadar kalıyor.

Transfer Merkezi girişinde aynı pozisyondaki ilk kadroyu güçlendirebilecek aday sayısı küçük bir rozetle gösteriliyor. Güçlü adayların portresinde ↑ +OVR işareti var. İlk kadroda o pozisyon yoksa kadrodaki aynı pozisyon kullanılıyor. Alınmış oyuncular sayılmıyor; ilk kadro ve OVR değişince işaretler yenileniyor.

| Tarz | Önceki katalog | Yeni katalog | Önceki transfer | Yeni transfer |
|---|---:|---:|---:|---:|
| Otomasyon | 234 | 52 | 0 | 0 |
| Dengeli | 169 | 54 | 6 | 6 |
| Transfer öncelikli | 92 | 41 | 10 | 15 |

Her strateji önceki koşuyla aynı başlangıç tohumunu kullanır; değişen karar akışı sonraki rastgele seçimleri de değiştirir. Bunlar gerçek kullanıcı oturumu veya tek başına olasılık değişiminin nedensel ölçümü değildir. Üç koşu da BAL ve 2. Lig'i tamamladı. Katalog/bildirim sorunu açık listeden çıkarıldı. test-transfer-upgrade-markers.cjs, 320/390 px yerleşimi, zayıf adayın işaretlenmemesini, kadro gelişimi ve satın alma sonrası bildirimin temizlenmesini doğruladı. test-scout-cadence.cjs yeni bekleme süresini, kayıt sonrası sayacı ve elit ihtimalini doğruladı.

## Medya ve maç bekleyişi kararları

Paylaşım süreleri, sayısı ve ödül katsayıları korunuyor. Paylaşım hazır olduğunda Medya bölümünde küçük bir rozet ve Sosyal sekmesinde bir nokta gösteriliyor; paylaşım tamamlanınca temizleniyor. Sonuç tek satırda hem takipçi hem bütçe kazancını gösteriyor. test-social-ready-summary.cjs, diğer ekrandayken hazır bildirimi, birleşik ödül, tek ödeme, bildirimin temizlenmesi, mevcut sonraki içerik/süre ve 320/390 px yerleşimini doğruladı. Paylaşım adedi tek başına sıkıcılık kanıtı kabul edilmedi; sayı azaltılmayacak.

Maç beklerken üretimin durması bilinçli ilerleme sınırı: kullanıcı maç açmadan sınırsız AP biriktirmesin diye korunuyor. Hata listesinden çıkarıldı. Simülasyon sürelerine menüde düşünme ve maç izleme dahil olmadığı için gerçek oturum süresi hâlâ ayrıca ölçülmeli.

## Doğrulanan hareket düzeltmesi
File sınırının kaçış hareketini kesmesi düzeltildi. Aynı 12 ilerleme kaydı maçı ve 9 ek maçta 28 birim altı yakınlaşma sıfır; önceki en uzun olay 0,65 saniyeydi. Sağ/sol temas ve lab kontrolleri geçti. Sorun açık listeden çıkarıldı; [ayrıntılı rapor](../match-audit-2026-10-19/sonuc.md).

## Açık kalanlar

### P2 — Son maçlar ve gerçek cihaz
Normal olasılıkla 21 tam maç gerçek motorla ayrıca kontrol edildi; bunun 12 maçı ilerleme kayıtlarından, 8 maçı eşit kadrolarla açık/kapalı karşılaştırma, 1 maçı sol el kontrolü. Üç ekonomik sezonun 84 maçının tamamı görsel motorla oynanmadı. Dört karşılaştırma çifti kesin Legendary dengesi için yeterli değil. Kısa mobil tarayıcı ölçümü yaklaşık 58–60 FPS; fiziksel telefon ve uzun maç testi hâlâ gerekli.

## Kanıtlar ve yeniden çalıştırma
- block-balance-2026-10-19/trial-too-cheap.json ve trial-still-expensive.json: elenen iki fiyat denemesi.
- validation-2026-10-19/runs-before-block-prices.json: önceki fiyatlarla karşılaştırma.
- [Güncel ekonomik koşular](../transfer-quality-2026-10-19/runs.json): olaylar, harcamalar, 84 skor, 18 tam kayıt.
- [Tarayıcı kontrolleri](../validation-2026-10-19/browser.json): yerleşim, yükleme, konsol ve stres örnekleri.
- test-roster-replacement.cjs: kural korumaları, kamp bağımsızlığı, rol değişimi ve sponsor sayacı.
- test-transfer-replace-browser.cjs: gerçek UI, iptal/yazma hatası, değişim/yükseltme/yeniden açma ve kayıplı-kazanımlı maçlarda sponsor.
- test-transfer-lineup.cjs, test-transfer-reload.cjs, test-scout-consistency.cjs, test-professional-blocks.cjs: normal transfer ve blok kontrolleri.
- Önceki audit-2026-10-18, progression-2026-10-19 ve bal-finale-2026-10-19 ham sonuçları tarihsel karşılaştırma içindir.

Çalıştırma: node transfer-quality-2026-10-19/run-audit.cjs; ardından node validation-2026-10-19/browser-audit.cjs (tamamlanan kayıtları atlar); son olarak node validation-2026-10-19/write-report.cjs. Üç koşu test aracıdır; normal oyuna bağlanmadı.
