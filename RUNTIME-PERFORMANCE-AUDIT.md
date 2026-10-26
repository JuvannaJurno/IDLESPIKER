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
