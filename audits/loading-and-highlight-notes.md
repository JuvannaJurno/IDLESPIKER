# Loading ve tutorial kontrolü — 28 Ekim

- İki pepper MP4, 360 native kare ve 30 FPS sabit zaman damgasıyla FFmpeg üzerinden yeniden üretildi. Decode edilen bütün kareler test edildi. 520×424, 12 saniye, yaklaşık 140KB/dosya; eski dosyalar yaklaşık 650KB idi.
- Tek erken src, başlangıç tarafı değişimi, reduced-motion posteri, hazır olduğunda normal kapanış geçti. Minimum yükleme süresi artmadı.
- Edge 4x CPU, 320/390 örneğinde 500ms ana iş yükünde medya zamanı ilerledi ve ek dropped frame oluşmadı. Açılışta 320px örneğinde 7, 390px örneğinde 3 dropped frame vardı. Bu fiziksel telefonlarda sıfır takılma garantisi değildir.
- Gerçek yeni profilde Deniz adı repliğe eklendi; üst vücut ve ses kontrolleri on tema/ölçüde geçti.
- 320/390 touch, mouse ve keyboard: ilk Talimat ver, instruction-path içindeki ek aydınlık Talimat ver alanı çalışıyor; karanlık navigasyon çalışmıyor. Engellenmiş tıklama rehberi ilerletmiyor.
- test-legendary-unlock-preview.cjs: 11 mevcut Legendary videosu decode/cleanup/reduced-motion kontrolü geçti; skill dosyaları yeniden üretilmedi.
- test-club-responsive-dock.cjs geçti.

Eski test-tutorial-action-completion.cjs yeni profil olmadan kamp rehberini bekliyor ve sosyal taslak aşamasında manuel paylaşım varsayıyor; güncel akışta otomatik gönderiler bu rehberi zaten tamamlayabiliyor. Bu eski senaryo geçmedi. test-tutorial-scroll.cjs eski scout-department adımını bekliyor; bu senaryo da geçmedi. Bu iki eski test PASS listesine dahil değildir. Mevcut görevde gerçek yeni profil ve görünür hedefler ayrı odaklı testle doğrulandı.
