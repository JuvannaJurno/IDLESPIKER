# Yerel oyun testi kaydı

## Kullanım

Kayıt bu sürüm açıldığı andan itibaren otomatik tutulur. Üçüncü aşamanın bütün kendi maçları tamamlanınca kod arka planda hazırlanır; oyunun ilerlemesi kodu beklemez.

1. Test eden kişi **Ayarlar → Oyun testi → Test kodunu al** bölümüne girer.
2. Kodu kopyalar veya **Kodu dosya olarak indir** ile `.txt` dosyasını paylaşır. Uzun kayıtlarda dosya, mesaj uygulamalarının metni kesmesini önler.
3. İnceleyen kişi **Kodu incele** bağlantısından `playtest-report.html` sayfasını açar; kodu yapıştırır veya dosyayı seçer.

Üçüncü aşama beklenmeden devam eden kaydın kodu da alınabilir. Yeni oyuna başlandıysa önceki test, ayarlardaki kayıt listesinden seçilebilir. Bir kodun açılması kayıt sahibinin cihazına veya bir sunucuya bağlanmaz.

## Kaydedilenler

- Milisaniyeli gerçek tarih/saat, oturum kimliği, açılış/ayrılış, sekme görünürlüğü ve çevrimdışı dönüş aralığı.
- Görünür süre ve son 60 saniyede oyuncu girdisi bulunan süre. Görünür sekmede beklemek ayrı tutulur; bu ölçüler kişinin dikkatini kesin olarak ölçmez.
- Lig/sezon geçişleri, oyun günü, talimat sayısı ve kaynakların zaman içindeki değişimi.
- Blokların önceki/sonraki seviyeleri ve adları.
- Oyuncu kimliği, rol, seviye/sınır, özellik sınırı, OVR, kart kademesi, yıldız, açılmış yetenekler ve altı özellik; değişimde önceki/sonraki değerler.
- As/yedek kadro atamaları, transfer katalogları/bedelleri/alınan oyuncular, kamp başlangıç ve dönüş durumları.
- Sosyal medya seviyeleri, takipçiler, hazırlanan işler ve sıra uzunluğu; paylaşım olayları.
- Kaydedilmiş maç sonuçları, maç ekranının açılma/hazırlanma/bitiş/çıkış olayları, maç atlama dahil anlamlı UI eylemleri.
- Tarayıcıda yakalanan hata mesajları, sürüm ve test cihazının tarayıcı/ekran bilgisi.

Otomatik talimatlar aralık toplamlarıyla kaydedilir. Her boncuk/kare için satır üretilmez; grafik yüküne yeni iş eklenmez. Metin kutularına yazılan her harf, parola, diğer sekmeler veya ekran videosu kaydedilmez. Profilin oyun içi adı raporun parçasıdır. Kayıt kurulmadan önceki eylemler geriye dönük çıkarılmaz; inceleyici kaydın hangi aşama/günde başladığını gösterir.

## Oyundan ayrılması

- `playtest-recorder.js` pasif olay dinleyicileri ve salt okunur durum özetleri kullanır. Oyun metotlarını, `Math.random` veya `Storage.prototype` metodunu değiştirmez. Yetenek görünümü oyuncunun kopyasında hesaplanır.
- `idle-spiker-playtest-v1` IndexedDB içinde `runs`, `events`, `reports`, `settings` bulunur. Günlük oyun kayıtlarının localStorage kotasını kullanmaz; oyun sıfırlama, eski test raporlarını silmez.
- Beş saniyelik gözlem ve kullanıcı eylemi sonrası gözlem vardır. Yazılar 250ms birleştirilir; kod hazırlanırken önce bekleyen yazıların bitmesi sağlanır. Kod oluşturmak senkron oyun işlemini veya maç sonucunu bekletmez.
- Başarılı lig sonucu `spiker-league-result` olayı yayınlar. Sonuç kaydı, ödül hesabı, RNG ve mevcut dönüş değeri korunur. Üçüncü aşama sonunda kayıt kapanır ve kod kalıcı saklanır.
- Depolama hatası kaydı durdurur ve ayarlarda belirtilir; oyuna hata fırlatılmaz. Normal kapanışta son grup yazılmaya çalışılır. Güç kesilmesi/tarayıcı sürecinin zorla kapatılması halinde son yazılmamış bölüm kaybolabilir.
- Kod `ISP1` (sıkıştırılmış) veya `ISJ1` (ham) sürümüyle veriyi ve bütünlük kontrolünü taşır. Kontrol bir imza/kimlik doğrulaması değildir. İnceleyici boyut sınırı uygular, metni HTML/eval olarak çalıştırmaz ve sunucuya göndermez.

## Doğrulama

- `test-playtest-recorder.cjs`: gerçek blok alımı, oyuncu yükseltme, transfer, kamp, 3. aşamanın tüm maçları; otomatik kod ve yeniden yükleme; yeni oyundan eski koda erişim; filtre/arama, bozuk kod ve HTML enjeksiyonu kontrolü.
- Aynı test, 50 gözlemde oyun verilerinin aynı kaldığını ve sıfır `Math.random` çağrısını doğrular. Kod penceresi 320/390/yatay, inceleyici 320/390/1440 genişlikte kontrol edilir.
- `test-playtest-failure-safety.cjs`: IndexedDB engellendiğinde AP/oyun çalışır; sıkıştırma desteği yoksa ham kod açılır.
- `test-flow-density-budget.cjs`: yoğun altı hatlı akışta kazançlar tam/tek kez ulaşır.

Görseller: `audits/playtest-code-mobile.png`, `audits/playtest-viewer-mobile.png`, `audits/playtest-viewer-desktop.png`. Bunlar hızlandırılmış sentetik test kaydıdır; gerçek bir oyuncunun davranışını temsil etmez.
