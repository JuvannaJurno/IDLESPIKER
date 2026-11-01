# Maç izlenebilirliği — 1 Kasım 2026

Durum: üretim maç dosyalarında yerel düzeltmeler; push yapılmadı.

## Bulunan ve düzeltilen sorunlar

1. Kusursuz Hücum Okuma sonrasında çizim 0,3 saniye eski blok noktasında sabitleniyordu. Bu sırada normal konum ilerlediğinden animasyon bitiminde oyuncu geri sıçrıyordu. match-hair.js içindeki foresightRecovery ve match-skills.js içindeki çağrı, iniş pozunu canlı konuma bağlar. Başlangıçtaki blok teması, fileye ulaşma, sayı hesabı ve fizik değiştirilmez. Koşu fazı da dairesel olarak bağlanır.
2. Pancake karartması her çizimde kaldırılıp ekleniyordu. Aynı durum korunurken sınıfı değiştirmeyen toggle kullanıldı. 30 sabit karartma çiziminde DOM sınıfı değişikliği sıfır.
3. Legendary spot ışığında top etkisi sıfırken bile invert(0) filtresi uygulanıyordu. Etki yoksa none kullanılır; gerçek yıldırım darbesinin filtresi korunur.
4. Legendary karartması sertçe görünüyordu. Mevcut yavaş çekimin 0,12 saniyelik girişine eşlik eden kısa giriş eğrisi eklendi. Oyuncunun Legendary ışığı ilk anda görünmeye devam eder.
5. Güncel kadroyla ek kontrol: kulübe/libero drawGuest çağrısı oyuncu kimliğini aktarmadığı için güncel saç/kolluk/forma seçenekleri yerine varsayılan renklerden yeniden resim üretilebiliyordu. Kimlik aktarılır. Hakemin güncel SVG parçaları maç hazırlığında ısıtılır. Dört maçta oyuncular, liberolar ve hakem için eski çiziciye dönüş sıfır.

## Kare sürekliliği

6000 adet 60 Hz gösterim karesinde aynı başlangıçla A/B: en büyük çizim merkezi sıçraması 39.78 → 9.62 native piksel. 15 piksel üzeri sıçramalar 6 → 0. Kalan yaklaşık 9,6 piksel hareket, skille ait hızlı ileri koşu sırasında; bloktan geri dönme sıçraması değildir.

Bu teknik A/B bağımsız mac.html başlangıcıyla yalnız hareket ölçmek için yapıldı. Varsayılan karakterler üretim portre/forma örneği olarak değerlendirilmez. Güncel görsel doğrulama gerçek TeamView/MatchIntro kadrosu ve maça gönderilen forma renkleriyle ayrıca yapıldı. Kaynaklar: watchability-continuity-before/after.json; kareler: watchability-read-recovery-before/after.png.

## Gerçek zamanlı güncel kadro ölçümü

Gerçek requestAnimationFrame; gerçek kadro, forma, libero değişimleri ve hakem; 390×844 DPR2; her koşu 18 saniye. CPU yavaşlatma fiziksel telefon ölçümü değildir.

| CPU | Ortalama FPS | Kare aralığı P95 | Çizim P95 | 50 ms üzeri kare aralığı |
|---|---:|---:|---:|---:|
| 1× | 58.9 | 16.8 ms | 7.8 ms | 3 |
| 4× | 56.8 | 16.8 ms | 16.5 ms | 5 |

Tekil uzun kare aralıkları hâlâ var. Bu çalışma bütün tarayıcı/telefon takılmalarının bittiğini kanıtlamaz. Çözülmüş sorun, eski blok pozundan canlı konuma atlama ve kulübe çizimindeki asset uyuşmazlığıdır.

## Kontroller

- test-match-watchability.cjs: geçiş uçları, hareket eden hedefe bağlanma, fizik verisini değiştirmeme, karartmada sınıf değişimi olmaması ve tam maçtaki büyük sıçramaların giderilmesi.
- test-absolute-read-contact.cjs: iki tarafta topun blok eline teması ve yavaş çekimin temasa kadar sürmesi. Test, rastgele blok başarısızlığı yerine temas geometrisini kontrol edebilmek için kendi maç RNG'sinde sabit 0,25 kullanır; üretimin sayı hesabı değiştirilmedi.
- test-match-motion.cjs: 60/120 Hz ara kareler, aynı fizik sonuçları, duraklatma, gecikme telafisi.
- test-body-motion.cjs: iniş/yerleşme ve fizik korunması.
- test-legendary-conditions.cjs ve test-tempo-duo.cjs: kullanım koşulları, CD rezervasyonu, çift Eksi Tempo ve doğru beyaz/altın ışıklar.
- test-watchability-current-assets.cjs: 4 gerçek kadro maçı; tamamı bitti. 306313 güncel SVG çizimi denemesinde toplam eski çiziciye dönüş 0. 12 saha kimliği, 6 kulüp forması ve geçerli top koordinatları doğrulandı. Hızlandırılmış test, görüntülerin yükleme olaylarına zaman tanımak için düzenli olarak tarayıcıya kontrol verir.

Güncel örnekler: watchability-current-3-tempo-minus.png, watchability-current-3-absolute-read.png, watchability-current-2-pancake.png, watchability-current-3-sync-attack.png. Varsayılan teşhis görselleri bunların yerine sunulmamalı.
