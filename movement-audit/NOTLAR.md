# Hareket kontrol notları

Bu çalışma model eğitimi değil; tekrar oynatılan maçlardan bulunan hareket hatalarının düzeltilmesidir.

- İlk tarama: 16 tam maç. Normal rallilerde gövde çakışması yoktu; tek karede sert dönüş sayısı 1096 idi.
- Düzeltme sonrası: 16 tam maç. Aynı eşikte sert dönüş 0; normal ralli çakışması 0.
- Ek görsel tarama: 4 tam maç, 3140 aktif ralli görüntüsü. Yerdeki takım arkadaşlarının 24 birimin altına giren çizilmiş gövde çakışması 0.
- Her maç farklı başlangıç tohumu kullanır. Altyapı ve 2. lig ayarları; düşük/yüksek özellikler; skiller açık/kapalı senaryoları denenir.

## Düzeltilen anlar

1. Servis başlarken ve topun yönü değişirken oyuncular anlık olarak arkasını dönebiliyordu. Tohum 0, adım 175 örneği pins.json içinde. Dönüş artık yerde, yaklaşırken ve havadayken farklı hız sınırı kullanır.
2. Koşu yönü değişince hız da aniden değişiyordu. Hızlanma kademeli; son karar çarpışma denetiminde kalır. Topa koşan oyuncunun önceliği korunur.
3. Rotasyonda düz çizgiyle hedefe sürüklenen oyuncular birbirlerinin içinden geçebiliyordu. Tohum 20 ve 21 kayıtları rotation-before.json içinde. Rotasyon artık aynı kaçınma kurallarıyla yürür; herkes yerine ulaşmadan tamamlanmaz.
4. Hatalı karşılamada oyuncu topa gitmeyi erkenden bırakıyordu. Artık yetişmeye çalışır; yetiştiği fakat kontrol edemediği topa kısa karşılama hareketi yapar. Servis/smaç dışarı hatasında topu bırakabilir.
5. Smaçta ön kol değişince gövde yönü sıçrayabiliyordu. Gövde yönü iki elin geçişine göre kesintisiz hesaplanır; onaylı pozlar korunur.

Sayısal hata olasılıkları ve oyuncu özellikleri kaldırılmadı. Yetişememe, kontrol hatası ve dışarı vurma ayrı durumlar olarak kalıyor. Bu testler tüm olası görsel tuhaflıkların bittiği anlamına gelmez; gözlenen hataları tekrar üretip sınamak içindir.

Ham kayıtlar: before.json, after.json, visual-after.json, rotation-before.json, rotation-after.json, pins.json.

## Sonuç

40 tam maçlık önce/sonra kontrolü tamamlandı. Ek rotasyon karşılaştırmasında aynı iki maçta üst üste binme tespitleri 124 → 0 oldu. İki maç da tamamlandı; takılma yok.

Ek kontroller: 12 tam maçlık hareket testi; ikili geçiş ve file kenarında kaçınma; dışarı topu bırakma / hatalı karşılamada çabalama ayrımı; 27 hücum olayı; 36 skill önizlemesi; 1. ve 3. aşamada ana oyundan maç açma; performans önbelleği.
