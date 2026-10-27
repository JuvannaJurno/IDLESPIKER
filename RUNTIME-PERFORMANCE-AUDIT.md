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

## Yoğun akış için çizim bütçesi ve yeniden kullanım

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
