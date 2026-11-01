# Legendary koşulları ve CD — 1 Kasım 2026

Durum: yerelde uygulandı; commit/push yapılmadı.

## Değişen davranış

- Servis Legendary'leri servis sırası ve CD ile seçilir. Aynı oyuncuda birden fazla hazır servis varsa son kullanılan dışındaki tercih edilir; özel rakibin ilk gösterimi önceliğini korur.
- Eksi Tempo: ikinci dokunuştan hücuma çıkarken ön sıra ve ulaşılabilir hızlı pas gerekir. Pasör/vuran sahipliği ve çift sahiplik güçlendirmesi korunur. Ön hazırlığı ezen ikinci playerGoal sarmalayıcısı düzeltildi. Aynı uygun pasta hazır Eksi Tempo, Kombine Hücum'dan önce seçilir.
- Kombine Hücum: başka hücumcu bulunan pas kuruluşlarında, Eksi Tempo veya önceden hazırlanmış bir pas kurtarışı o dokunuşu kullanmıyorsa seçilir. Mevcut koşu ve tek sıçrama animasyonu korunur.
- Hayalet Plase: üçüncü dokunuşa hazırlanan hücumcunun karşısında blok planı bulunmalıdır. Yeni bir savunma-boşluğu sistemi eklenmedi.
- Kusursuz Hücum Okuma: planlanan ve yetişebilen blokçuların tümünde açık/hazır skill aranır. Önce ana blokçuyu seçip yanındaki Legendary sahibini dışlama hatası giderildi.
- Zor Toplara Pas: ikinci dokunuştaki mevcut uzun yol hesabı korunur (ilk mesafe en az 105, mevcut açıklık en az 24); oyuncu yetişebilmelidir. Kolay pasta çıkmaz.
- Tek Elle Pas: ikinci dokunuşta en az 24 açıklık ve kalan hareket payının en az %30'unu kullanma veya son 0,3 saniyeye kalma durumu aranır. Yetişilemeyen topa girmez. Bu durumda hazır Tek Elle Pas, Zor Toplara Pas'tan önce gelir. İlk sıkı eşik kullanımını fazla düşürdüğü için gevşetildi.
- Pancake: birinci/ikinci dokunuşta asıl karşılayıcı başarısız olacak ve başka kurtarıcı yetişebilecek. Normal hücumlara da cevap verir. Süre CD'si gerçek kurtarma temasından başlar.
- Takımın Kalbi: mevcut sayı arası toplanma ve takımın ortak iki ardışık kayıp ile dolan CD'si korunur. İlk kullanım hazırdır.
- Hazırlık yeteneği rezerve eder; aynı yetenek ikinci kez seçilmez. CD gerçek eylem/temasta tüketilir. İptal edilen hazırlık sayı sonunda veya top değişiminde bırakılır. Eksi Tempo ikilisinin iki rezervasyonu da birlikte bırakılır.
- Normal Pasör Aldatmacası aynı pasta yalnız bir kez şans dener; her kare tekrar deneyerek Legendary hücumları engellemez.

## Aynı başlangıçlarla karşılaştırma

Her sürümde 24 tam maç: dengeli, hızlı hücum, kurtarış ve tüm skiller açık stres kadroları; her sette 6 sabit başlangıç. Eski kaynaklar git HEAD'den, yeni kaynaklar çalışmanın başında belleğe alınır; test sürerken dosya değişmesi sonucu kirletmez. Tabloda iki takımın gerçekten tamamlanan skill bildirimleri sayılır; başlamış ama tamamlanmamış hazırlıklar kullanım sayılmaz.

| Legendary | Önce / 24 maç | Sonra / 24 maç |
|---|---:|---:|
| Takımın Kalbi | 22 | 20 |
| Sky Ball | 22 | 25 |
| Kombine Hücum | 88 | 47 |
| Eksi Tempo | 9 | 45 |
| Kusursuz Hücum Okuma | 136 | 145 |
| Yıldırım Smaç Servis | 29 | 22 |
| Jump Float | 32 | 35 |
| Zor Toplara Pas | 23 | 14 |
| Tek Elle Pas | 20 | 27 |
| Pancake | 222 | 160 |
| Hayalet Plase | 194 | 172 |

Toplam sayı: 203 → 204. Tamamlanan Legendary: 797 → 712. 10 sayı başına: 39.26 → 34.90. Normal hızda dış tick sürelerine göre dakika başına: 7.20 → 8.00. Dış tick süresi yavaş çekim beklemelerini de içerir; hızlandırılmış testin bilgisayarda kaç saniyede çalıştığı değildir.

Kombine Hücum ve Eksi Tempo aynı pas fırsatını paylaştığı için ayrı sayılar yeniden dağılıyor. İkisinin toplamı 97 → 92. Zor Toplara Pas ve Tek Elle Pas toplamı 43 → 41. Servis Legendary toplamı 83 → 82.

Bu tablo normal kadronun ortalaması değildir: tüm oyuncuların Pancake/Legendary taşıdığı stres durumları içerir. Sayı başına toplam yaklaşık %11 düşse de ralliler kısaldığı için zaman başına sıklık artmıştır. Kazanma şansı garanti edilmedi ve maç sonucu rastgeleliği değiştirilmedi.

## Doğrulama

- test-legendary-conditions.cjs: kolay/uzak/son erişim pası, kilitli yetenek, ikinci blokçu, bloksuz plase, iptal edilen çift Eksi Tempo ve altı gerçek servis temasında dönüşüm. Teste özel probe yalnız tarayıcıya verilen kaynakta eklenir; üretimde yoktur.
- test-legendary-point-cooldown.cjs: rezervasyon, temas, iptal, üç sayı CD ve Pancake'in temastan başlayan 12 saniyesi.
- test-legendary-real-rosters.cjs: BAL ve 2. Lig'de gerçek TeamView/MatchIntro kadroları, ilk/gelişmiş güçler, 12 tam maç, gerçek portreler ve libero değişimleri. Bu testte yetenekler açılmıştır; kariyer ilerleme temposu ölçülmez.
- test-tempo-live-contact.cjs: 48 yakın/uzak temas durumu ve 8 tamamlanan Eksi Tempo maçı; gerçek sayı alabiliyor.
- test-tempo-duo.cjs: yalnız pasör, yalnız vurucu, iki sahip, kilitli sahip; doğru altın/beyaz ışık, geçici çift güçlendirmesi, iki CD.
- test-legendary-cooldown-matches.cjs: 4 ek tamamlanan maç ve sıradan toplarda birinci/ikinci dokunuş Pancake.
- test-team-heart-cooldown-native.cjs: ortak CD ve ardışık kayıp mantığı.
- test-match-motion.cjs: 60/120 Hz yavaş çekim ara kareleri, aynı fizik sonucu, duraklama ve kare gecikmesi telafisi.
- 11 Legendary için native saha görüntüsü alındı; toplu görüntü: legendary-conditions-contact-sheet.png.

## Performans

legendary-conditions-performance.json: 390×844, DPR2, Edge headless, CPU 4× yavaşlatma; eski/yeni/yeni/eski sırası. Her koşuda 60 ısıtma çizimi ardından 720 native gösterim karesi. Kaynaklar batch boyunca sabittir. Ölçüm gerçek telefon FPS'si değildir. Mevcut çizim maliyetinde soğuk efekt/poz hazırlığından gelen tekil büyük kareler iki sürümde de görülebilir; bütün kasmaların giderildiği iddia edilmez.

Son ölçüm: toplam kare işi 10.065 → 10.050 ms; fizik/skill tick işi 0.656 → 0.644 ms. Toplam değişim -0.14%; bu örnekte ölçülebilir ek yavaşlama görülmedi.
