# 30 Ekim takip düzeltmeleri

## Mahalle dengesi
- Eski öneri rakiple eşitliği yeterli sayıyordu. Mahalle'de artık görev özelliğinde +3 tampon hedeflenir; gösterilen rakip sayısı değiştirilmez.
- Rakip seviye eğrisi 18/19/21/23 yerine 18/19/20/21. BAL ve sonraki ligler değişmedi.
- audit-mahalle-advice.cjs: 60 kariyer × 5 maç × 4 politika = 1.200 model maçı. Rastgele kaynaklar test içinde seedlidir; iki çalıştırmada aynı sonuç alındı. Eski eğri/eşitlik hedefi ilk4 30/60; yeni eğri/+3 hedefi 37/60; üçüncülük 6'dan 11'e çıktı. Bu strateji modeli gerçek cihazda oynanmış sezon veya galibiyet garantisi değildir. Önceki ara ölçümler kriptografik oyuncu üretimi sabitlenmediğinden nihai karşılaştırma olarak kullanılmaz.
- Tarihi 3 mağlubiyet vardır: tüm kalan maçları kazanmak da tablonun zirvesine ulaşmayı garanti etmez. Sıra sabitlenmez.

## Doğrulama / sınırlar
- Kadro iki kart, sürükleme eşiği/geri dönüş, sonuç→diyalog→arma akışı, rapor metni/zamanı/izleme olayı, tam opak desen ve forma önizleme kaldırılması için yeni browser testleri eklendi.
- 4 viewport anons portreleri ve native yaka regresyonu geçti.
- Test kayıt kodunun saklama, yeniden yükleme, otomatik 3. aşama kodu, görüntüleyici, filtre ve XSS kontrolleri geçti; IndexedDB reddedilince oyun/AP çalışmaya devam etti.
- Eski test-lineup-picker.cjs, UI'ye ulaşmadan ilgisiz blok bekleme süresi beklentisinde; test-advice-accuracy.cjs eski transfer metni beklentisinde; test-transfer-pointer.cjs katalog açıldıktan sonra eski garantili elit örneği beklentisinde başarısız. Bunlar yeşil olarak raporlanmaz.
- Eski isim testi ilk tıklamada tüm oyuncuları bekler; artık ilk mod aktif oyunculardır. Yeni mod testi hem aktif filtreyi hem 12 kişinin tümünü gösterme seçeneğini doğrular.
- Headless Edge testinde kare medyanı 16.7ms fakat p95 ~50–67ms kaldı. Fiziksel telefonda kasma tamamen giderildi denemez; görüntüyü azaltmadan sabit saha ve DOM/kayıt yükü düşürüldü.
