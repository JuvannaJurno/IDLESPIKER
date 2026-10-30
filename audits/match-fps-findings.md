# Maç FPS incelemesi — 30 Ekim 2026

Üretim kodu değiştirilmedi. Ölçüm: headless Edge, 390×844, CPU 4× yavaşlatılmış, BAL gerçek squad mesajı/MatchIntro rakipleri, her varyantta 180 tick+draw. Gerçek telefon FPS iddiası değildir; ardışık varyantlarda maç anı ve asset ısınması farklı olduğundan yüzdeler yaklaşık karşılaştırmadır. Canvas komut gönderme süresi GPU kompozisyonunun tamamını kapsamaz.

## Bulgular
- Gerçek kadro ölçümünde baseline çizim 20.58 ms ortalama, p95 49 ms; tick yaklaşık 1.54 ms/adım. Oyuncu çizimi toplam çizim yükünün büyük çoğunluğunu oluşturuyor. Oyuncu çizimini deneysel devreden çıkarınca .93 ms çizim kaldı. Bu bir optimizasyon önerisi değildir; yükün yerini ayırır.
- CPU örneklemesinde getImageData en büyük maliyet: 2255 örnek. match-vector-characters palette fonksiyonu cached kontrolünden ÖNCE dominant(set.head) çağırıyor; appearance taşımayan misafir/hakem/varsayılan karakterlerde her kare renk piksel okuması tekrarlanabiliyor. match-hair legImage da fallback dominant yoluna sahip.
- mac.html strikeSide: handedness açık verilmemişse görünümün tamamını JSON.stringify edip her çağrıda tekrar FNV hash hesaplıyor. Hücum/kol/animasyon çizimleri sıkça çağırıyor. Karakter kimliği/görünümü sabitken bu sonuç tekrar hesaplanmamalı; değişiklikte invalidasyon gerekir.
- İsim etiketleri ve gölgeler ek yük ama ana neden değiller; kaldırılmaları önerilmiyor. Ardışık testte isimli/ismsiz ortalamalar ısınma ve sahne değişiminden etkileniyor, kesin yüzde çıkarılamaz.
- Gerçek kadro aktarılmayan bağımsız mac.html ölçümü yanıltıcı derecede pahalı (32ms); ayrıca opponentLegendaryUnlocked verilmediğinde teamHasLegendary→view→milestone yerel metin formatlama maliyeti beliriyor. Asıl gateway bu bayrağı veriyor; bunu ana oyun nedeni diye sunmamak gerekir.
- Pasif test kaydedici maç aktifken periyodik capture işini atlıyor (750ms/5sn); kare başına kayıt döngüsü yok. Bu incelemede ana darboğaz olarak bulunmadı; ebeveyn menü/telefon GPU yükü ayrıca ölçülebilir.

## Sadece test ortamındaki çözüm denemesi
probe-match-fps-cache: dominant görsel kaynağına WeakMap, strikeSide oyuncu kimliğine WeakMap; gerçek dosyalara uygulanmadı. Baseline21.54ms/p95 81.6ms → cache denemesi9.11ms/p95 21.3ms. Tek koşudaki yaklaşık %58 çizim süresi azalması; cihaz FPS garantisi değil. Gerçek uygulamada aynı asset değişirse invalidasyon, gerçek kol tercihi değişirse cache güncelleme ve görsel regresyon şart.

Sonraki uygulama önceliği: değişmeyen piksel okumalarını çizim dışına almak; kol seçimini kadro yüklemesinde hesaplamak; sonra oyuncu parça transform/array tahsislerini ölçmek. İsim, gölge veya animasyonları kısmadan başlanabilir.

Tekrar üretim: node investigate-match-fps-game.cjs; node profile-match-fps-game.cjs; node probe-match-fps-cache.cjs. JSON çıktıları aynı klasörde match-fps-*game.json ve match-fps-cache-probe.json.
