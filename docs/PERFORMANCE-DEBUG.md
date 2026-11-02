# Performans ve hata kontrolü — 17 Ekim 2026

Ölçüm: `node tools/audits/audit-runtime-performance.cjs baseline` / `node tools/audits/audit-runtime-performance.cjs optimized`.
Edge headless, 390×844, her senaryoda 5 saniye; üçüncü aşama ve 100× talimat testi.
Bu ölçüm gerçek telefon FPS ölçümü değildir. Zamanlayıcı ve işlemci yükü nedeniyle talimat adedi koşular arasında değişebilir.

| Ölçüm | Önce | Sonra |
|---|---:|---:|
| Boştaki sosyal önizleme DOM değişikliği | 200 | 0 |
| Boştaki sosyal ekran yerleşim hesabı | 21 | 4 |
| Hızlı talimat yerleşim hesabı | 513 | 277 |
| Hızlı talimat stil hesabı | 961 | 400 |
| Örnekleme sonundaki talimat görseli | 39 | 21 |
| Hızlı testte işlenen talimat | 435 | 430 |

Ham sonuçlar `audits/legacy/performance-baseline.json` ve `audits/legacy/performance-optimized.json` içinde.
CPU süreleri değişken olduğundan bu sayılardan genel bir FPS veya hızlanma yüzdesi çıkarılmadı.

## Değişiklikler

- Sosyal ekranda değişmeyen metinler ve simgeler yeniden oluşturulmuyor. Boştaki önizleme, aynı taslağı tekrar kopyalamıyor.
- Gizli sosyal ekranın akışı yeni gönderi geldikçe oluşturulmuyor; menü açılınca güncel veriler gösteriliyor. Kullanılmayan profil bileşenleri akış yenilemelerinde üretilmiyor.
- Sosyal görsellerde değişmeyen sahneler önbellekte tutuluyor. Medya bloklarının fiyatları yalnız görünür durumları değişince güncelleniyor.
- Keşif özetinin veri anahtarı değişmedikçe aynı düğmeler ve açıklamalar yeniden oluşturulmuyor.
- Kaynak sayaçları en fazla yaklaşık 30 kare/saniye güncelleniyor; kısaltılmış sayı aynıysa DOM metni değiştirilmiyor.
- Çok hızlı talimatlarda dekoratif tıklama efektleri seyreltiliyor, talimat görselleri birleştiriliyor. Talimat ve ödül kayıtları birleştirmede korunuyor.
- Kulüp gizliyken talimatlar için görünmez DOM parçacıkları ve Web Animations oluşturulmuyor. Teslimat hesabı son görünür rota üzerinde sürüyor; gizli öğelerin sıfır geometrisi artık anında AP/bütçe teslim etmiyor.
- Birkaç oyun günlük sosyal sponsor desteği tek işlemde kaydediliyor; makbuzlar tekrar ödeme yapılmasını engelliyor. Kesirli mevcut bütçeler destekleniyor.
- Üçüncü aşamadaki teknik ekip başlığının periyodik olarak eski ada dönmesi düzeltildi.
- Kamp sürüklemesinde ekranın kenarına yaklaşınca liste kayıyor; ekran dışındaki yuvalara erişilebiliyor. Sürükleme bitince kaydırma döngüsü iptal ediliyor.
- Eski kamp testinin 3 yuva, 7 gün, +20 sınır ve eski ücret varsayımları güncel 6 yuva, 3 gün, +30 sınıra taşındı. Ücret, kayıt hatası ve sürükleme kontrolleri korundu.

## Geçen kontroller

- `tests/test-social-studio.cjs`: paylaşım, metin sesleri, kayıt, görünür alan, okuma konumu ve temalar.
- `tests/test-runtime-optimization.cjs`: gizli kulüpte teslimat zamanı, AP/bütçenin eksiksiz ve tek sefer verilmesi, parçacıklar ve toplu sponsor ödemesi.
- `tests/test-offline-progress.cjs`: vardiya, oyun günü, maçta durma ve tekrar ödül verilmemesi.
- `tests/test-merged-picker.cjs`: birleşik blok seçimi ve ücretler.
- `tests/test-tutorial-scroll.cjs`: tutorialda tepeye sıçrama olmaması.
- `tests/test-achievements.cjs`: başarım bildiriminden doğru karta geçiş ve kayıt.
- `BAL_MATCH=1 node tests/test-match-integration.cjs`: gerçek kadro, maç, sonuç, ödül ve yeniden yükleme.
- `tests/test-stage-selector.cjs`: ileri/geri aşama seçimi, animasyon ve takımın korunması.
- `tests/test-camp-rebalance.cjs`: altı oyuncu, üç günlük kamp ve gelişim sınırı.
- `tests/test-camp-board.cjs`: fare/dokunmatik sürükleme, otomatik kenar kaydırması, mobil genişlikler, kayıt hatasında geri alma ve kamp ödemesi.
