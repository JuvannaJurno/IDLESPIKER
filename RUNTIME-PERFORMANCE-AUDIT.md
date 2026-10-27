# Talimat akışı performans kontrolü — 27 Ekim 2026

Aynı 390×844 Edge headless penceresinde, aynı altı standart hat ve hızlı test girdisiyle 1,2 saniye ısınma + 4 saniye ölçüm. Önceki room-rules/menu/flow-lanes/league-rules sürümleri 3ff420c referansından yüklenir; diğer dosyalar ve yeni altı hat kuralı aynıdır. CPU örnekleri Profiler, zamanlar Performance CDP metrikleridir. Sonuç tek yerel karşılaştırmadır, cihaz FPS garantisi değildir.

|Ölçüm|Önce|Sonra|
|---|---:|---:|
|JS süresi (ms)|1806|608|
|Toplam görev süresi (ms)|3269|2369|
|İşlenen talimat|2964|3390|
|Örnek sonunda DOM düğümü|3763|3769|
|Örnek sonunda hareketli paket|108|114|

JS süresi yaklaşık %66 azaldı. Önceki profilde pairings ve blok seviye hesabı öne çıkıyordu; yeni profilde bunlar baskın değil. Rota dizileri paket başına önbellekte, aynı üretim etkileri durum anahtarıyla önbellekte ve fikstür sabit kaldığı sürece yeniden oluşturulmuyor. Dış API’ler taze kopya döndürür; çağıran tarafından değiştirilmesi önbelleği bozmaz. Fon/yanlış teslimat veya ekstra AP üretmek için animasyon atlanmaz.

Ortak Tempo ilk ek özellik açılışında standart hatları aynı kapasitede ikiye katlar, mavi medya hatları değişmez. Lazer ve lazerin ek AP’si kapalıdır. Yeni alımlarda koordinatör 6. seviyede tamamlanır; daha önce satın alınmış 7–10 seviyeler silinmez.

Maç çizimi ayrıca 4× CPU yavaşlatmada 120 kareyle kontrol edildi: ortalama 3,57 ms, p95 10,5 ms; tekil en kötü kare 41,2 ms. Bu bir çizim örneğidir; tüm maç/ses/yükleme için uçtan uca FPS ölçümü değildir.

## Yoğun akış için çizim bütçesi ve yeniden kullanım (sonradan kaldırıldı)

Son uygulamada oyun hesabı ve görsel paket ayrı tutulur. Aynı anda en fazla 36 span/WAAPI animasyonu (18 otomatik, 6 medya, 12 manuel) çizilir. Ek talimatlar hesaplanmaya, kendi rotalarında ilerlemeye ve varışlarında kazanç vermeye devam eder. Biten düğümler en fazla 36 öğelik havuza alınır; tekrar kullanımda sınıf/stil temizlenir. Tüplerin tasarımı korunur. Kamera dışında kritik varış efekti ve aynı öğe için yinelenen kritik timer üretilmez.

`node audit-flow-density.cjs baseline` yalnız menu.js dosyasını 7537d73 referansından yükler. `node audit-flow-density.cjs optimized` güncel dosyayı kullanır. Diğer dosyalar, altı tam standart hat, 390×844 pencere, 1,2 saniye ısınma ve 4 saniye hızlı-test süresi aynıdır. Profiler ve Performance CDP ölçümleri kaydedilir.

| Ölçüm | Önce | Sonra |
|---|---:|---:|
| Hareketli HTML öğesi | 114 | 30 |
| Workflow DOM değişikliği | 2926 | 1049 |
| JS süresi (ms) | 1006 | 963 |
| Toplam görev süresi (ms) | 3276 | 2990 |
| İşlenen talimat | 3234 | 3384 |

Hareketli öğeler yaklaşık %74, DOM değişiklikleri %64, toplam görev süresi %9 azaldı. JS iyileşmesi bu örnekte yaklaşık %4; ana kazanım daha az DOM/animasyon yüküdür. Talimat sayısındaki fark örnekleme/cihaz zamanlamasıyla ilgilidir; üretim katsayıları değiştirilmemiştir. Bunlar tek yerel çalışma değerleridir; gerçek telefonda FPS veya tüm takılmaların bittiği iddiası değildir.

`test-flow-density-budget.cjs` gerçek varışları bekleyerek 33 görsel sınırı içinde, 100 ek görünmez mantıksal paketle AP/bütçenin tam geldiğini; tekrar durdurmanın tekrar ödeme yapmadığını ve düğümlerin doğru sınıflarla yeniden kullanıldığını denetler. Görseli `audits/flow-density-bounded-mobile.png` içindedir. Eski teslimat/hat/medya testleri de geçer.

Güncel Ortak Tempo kararı: 6–10 seviyeleri ek hatları 1/5’ten 5/5’e geliştirir. Önceki bölümdeki seviye 6’da tek açılış bilgisi geçmiş sürüm ölçümüne aittir.

## Güncel: Kota yerine kesintisiz Canvas akışı

Önceki 36 düğüm/hat başına üç paket sınırı kullanıcıda gönderimlerin duraklaması hissini yarattığından kaldırıldı. Artık her paket aynı simülasyon konumunda tek bir dar canvas üzerinde çizilir. Akış sayısına göre çizim kesilmez; yalnız ekran dışında kalan alan çizilmez. Küçük sprite'lar önbelleklidir. Canvas geometri ölçümü scroll/resize/rota değişimi dışında tekrarlanmaz. Hat başlığı DOM sorguları da gönderim başına yapılmaz. Üretim katsayıları ve gelir kuralları değişmedi.

`audit-flow-canvas.cjs original` menu.js ve flow-lanes.js dosyalarını 7537d73'ten, `bounded` d95b0f4'ten yükler. `canvas` güncel sürümü kullanır. Diğer kaynaklar aynıdır. Görünür workflow, altı tam standart hat, 390×844, 1,2 sn ısınma ve 4 sn hızlı test kullanılır. Ek üçüncü argüman `4`, CDP ile 4× CPU yavaşlatması uygular. Kare aralığı requestAnimationFrame ile, süreler Performance/Profiler ile kaydedilir. Farklı çalışmalarda işletim sistemi/timer zamanlaması nedeniyle işlenen talimat sayısı değişebilir.

| Normal CPU, 4 sn | Eski sınırsız DOM | Reddedilen kota | Canvas |
|---|---:|---:|---:|
| Çizilen kare | 202 | 212 | 236 |
| Kare aralığı p95 (ms) | 50 | 33,4 | 16,8 |
| 50 ms üstü kare | 7 | 3 | 1 |
| Workflow DOM değişikliği | 2943 | 1080 | 511 |
| Toplam görev süresi (ms) | 3120 | 3330 | 2466 |
| JS süresi (ms) | 873 | 1170 | 861 |

| 4× CPU, 4 sn | Eski sınırsız DOM | Canvas |
|---|---:|---:|
| Çizilen kare | 104 | 151 |
| Kare aralığı p95 (ms) | 66,7 | 50 |
| 50 ms üstü kare | 18 | 5 |
| İşlenen talimat | 2616 | 3054 |
| Toplam görev süresi (ms) | 3958 | 3951 |

Normal örnekte toplam görev süresi yaklaşık %21 azaldı; 4× CPU koşulunda görev süresi azalmadı ve CPU doygunluğu sürüyor, ancak kare ilerlemesi daha iyi. Bu bir fiziksel telefon FPS garantisi değildir. Önceki kota uygulamasındaki 30 öğe sayısı artık hedef değildir: Canvas'ta yüzlerce mantıksal paket, bunların ekranda kalanları için tek HTML çizim yüzeyi vardır. AP/bütçe tutarlılığı ve akışta kota boşluğu olmaması ilgili testlerle ayrı doğrulanır.
