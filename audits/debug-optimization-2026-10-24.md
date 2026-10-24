# Talimat akışı ve sosyal medya: debug / optimizasyon

Tarih: 24 Ekim 2026

## Düzeltilenler

- `MenuUI.stopMotion()` animasyonu kaldırmadan önce bekleyen AP ve bütçe alacaklarını tamamlıyor. Aynı işlem ikinci kez çağrıldığında yeniden ödeme yapılmıyor.
- Aşama / kayıt yüklerken eski animasyonlar eski durum üzerinde kapatılıyor; yüklenen kayıttaki alınmamış alacaklar da bir kez tamamlanıyor. AP'si veya bütçesi önceden alınmış alacaklar tekrar ödenmiyor.
- Tüp konumları küçük bir akış modeli üzerinden okunuyor. Her paket / konum sorgusunda kulübün kamp ve kat bilgilerini derin kopyalama kaldırıldı.
- Tüp sayısı, kapasitesi veya aşama değişmediğinde raylar, bağlantılar ve kapasite yazısı yeniden yazılmıyor.
- Güçlendirici parlamasında zorunlu yerleşim ölçümü kaldırıldı; aynı başlık için üst üste efekt başlatılmıyor.
- Hat sayısı değişirken mevcut medya parçaları medya hattında kalıyor; mavi başlık yanlışlıkla normal kapasite başlığı olarak tanımlanmıyor.
- Çevrimdışı toplu yayınlar beslemeyi her gönderide yeniden çizmek yerine tur sonunda güncelliyor.
- Sosyal medya hazır göstergesi aynı durum için sürekli yeniden kurulmadan güncelleniyor.
- Eski / eksik sosyal kayıtta iş sıra numarası geçmişten toparlanıyor. Geçersiz işler ayıklanıyor ve sıfır süreli işlerde ilerleme hesabının bozulması engelleniyor.
- Elit alternatifleri önizlemesi gerçek transfer ekranının arka plandaki kontrollerini kaldırmıyor. Böylece gecikmeli oyun yenilemesi olmayan bir düğmeye erişmiyor.

## Doğrulama

Başarılı kontroller:

- `test-flow-rules-debug.cjs`: kısmen alınmış alacaklar, iki kez kapatma, bozuk iş verisi, sıra numarası toparlama.
- `test-flow-settlement.cjs`: animasyonu durdurma, anında kayıt yükleme, değişmeyen akışı 100 kez eşitleme.
- `test-pulse-performance.cjs`: 100 basış / 300 gerçek talimat, doğru AP ve bütçe, görsellerin sınırlı tutulması.
- `test-manual-flow.cjs`: gerçek tuş basışı, belirgin paket, hareket ve kazancın ulaşması.
- `test-flow-capacity.cjs`, `test-fast-internet.cjs`: ikinci / üçüncü hat kapasitesi, kart satın alma ve seviye kaydı.
- `test-media-flow-card.cjs`: kartla medya hattının açılması, solda kalması, yalnız mavi paketlerin geçmesi, yayın sonrası dolu sıra ve tek seferlik ödül.
- `test-social-match-offline.cjs`: maç sırasında sıra, yeniden açılışta çevrimdışı sıra ve sıra bitince otomatik yayının durması.
- `test-social-video-queue.cjs`: tekli +, kapasite, yükseltme ve kayıt.
- `test-flow-design.cjs`: canlı tasarım dosyası, 1 / 2 / 3 / 4 / 6 hat ve mobil taşma.
- `test-daily-shift.cjs`, `test-overtime-rules.cjs`: bir saat dinlenme, mesai, tekrar ödeme koruması ve çevrimiçi / çevrimdışı hesap eşitliği.
- `test-announcement-portraits.cjs`, `test-announcement-layout.cjs`: dört ekran ölçüsü, portre ölçüsü, takım hatası, görselsiz durum ve sabit saha.
- `test-transfer-pointer.cjs`: gerçek transfer ekranında sekiz adayın açılması.
- `test-elite-design-lab.cjs`: orijinal kart + dört alternatif, seçim ve gecikmeli yenilemede hata olmaması.

Bu çalıştırmada 300 talimat 6 animasyon düğümüyle gösterildi; AP ve bütçe toplamı birebir eşleşti. Değişmeyen akışın 100 eşitlemesinde ray / kapasite yazısı üzerinde sıfır değişiklik ve sıfır derin kulüp durumu kopyası ölçüldü. Bunlar belirtilen senaryonun sonuçlarıdır; genel FPS iddiası değildir.

Eski `test-server-portrait.cjs`, güncel olmayan maç öncesi ekran seçicilerini (`.formation-half`) bekliyor; bu dosyanın tamamının geçtiği iddia edilmiyor. Güncel anons / portre davranışı iki ayrı hedefli testle kontrol edildi.

JavaScript sözdizimi ve `git diff --check` kontrol edildi. Asset sürümleri `version-assets.cjs` ile yenilendi.
