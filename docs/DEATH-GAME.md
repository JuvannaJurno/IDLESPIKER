# Son Işık · Death Game

5 Kasım 2026. Kullanıcının kararıyla gizli voleybol deneyi kaldırıldı; bu oyun onun yerini alır.

Giriş: **Ayarlar → Hileler → Gizli oyun · Son Işık → Oyna**. Bağımsız adres: `death-game.html`.

## Oyun döngüsü

Tek insan oyuncu, 07 numaralı altın renkli yarışmacıyı doğrudan yönetir. Dokuz bilgisayar yarışmacısı aynı tehlikelerle karşılaşır. Beş oda her denemede karışık sırayla birer kez gelir. Odaya girmeden önce kısa kural ekranı vardır; oyuncu onaylamadan süre başlamaz. Bir hata koşuyu bitirir. Başarılı odadan sonra sıradaki kapı açılır; beşinci odadan sonra final ve yeniden deneme vardır. Kanlı/grafik şiddet yoktur; elenen karakterin ışığı söner.

Bir başarılı koşu yaklaşık 75–100 saniye sürer; erken çıkışlı odalarda hız oyuncunun rotasına bağlıdır. Bu süre, duraklatmayı ve kural ekranlarını içermez. En iyi geçilen kapı sayısı, denemeler ve tamamlanan kaçışlar ayrı kayıt alanında saklanır. Ara odadan ana menüye çıkınca da en iyi sonuç kaybolmaz. Aktif koşu sayfa yenilendiğinde sürdürülmez.

## Beş ayrı oyun

| Oda | Amaç | Tehlikenin bildirimi | Başarı koşulu |
| --- | --- | --- | --- |
| Sessiz Koridor | Yeşilde yukarıdaki kapıya ilerle | Yeşil / 0,85 sn sarı uyarı / kırmızı; yazı, ışık ve ses | 24 sn içinde kapıya ulaş. Kırmızıda yürüme veya sıçrama. |
| Son Renk | Gösterilen renk ve simgenin zeminine geç | Renk adı ve simgesi; 2,9 sn hareket süresi, 1,1 sn çöküş | Beş çöküşü atlat. Güvenli hücreler her tur değişir. |
| Saat Kulesi | Dönen kolun üzerinden sıçra | İlk 2 sn hazırlık, sürekli görünen gerçek kol | 21 sn hayatta kal. Merkez makineye girilemez. |
| Açgözlü Kasa | Beş kişisel jetonla kapıdan çık | Görünen baskı kolları ve 6 sn sonra yükselen mürekkep | 25 sn içinde kaç. Jetonları başka yarışmacı alamaz. |
| Son Dalga | Yayılan halkaların üzerinden sıçra | Her halkadan 0,9 sn önce merkez ışığı | 22 sn hayatta kal. |

Yapay ölüm zarı, uzaktan temas veya rakiplere özel bağışıklık yoktur. Oda kuralları aynı fonksiyonda insan ve botlara uygulanır. Botlar hedefe normal hızla gider, aynı sıçrama beklemesini kullanır; elenenler sonraki odada geri gelmez. Bir yarışmacı çıkışa ulaşınca o odanın tehlikelerinden korunur. Kapı odaları bütün kalan yarışmacılar çıkarsa erken tamamlanabilir.

## Kontrol ve fizik

Büyük analog hareketi, tek tuş sıçramayı yönetir. WASD / yön tuşları ve Boşluk da kullanılabilir. Analog ve sıçrama eşzamanlı dokunmayı, alan dışına taşan parmağı ve pointer iptalini destekler. Duraklatınca tutulan bütün girişler ve pointer capture bırakılır. Oyuncu değişimi veya otomatik hareket yoktur.

Sabit fizik adımı 120 Hz; normal hız 3,7 birim/sn. Sıçrama 0,62 sn, bekleme 1,65 sn; sıçramanın ilk bölümünde herkes için aynı küçük ileri ivme vardır. Hareket ve hazard alanları 12×16 ortak dünyada hesaplanır. Görüntü aynı oranda ölçeklenir; halkalar elipsleştirilmez, tehlike alanları resimden farklı bir noktada işlemez. Sıçrama kol ve dalgaları aşar; yanlış zemin renginin yerine geçmez.

## Görsel ve teknik sınırlar

Voleybol sahası, top, takım kontrolleri ve eski native spor karakterleri kullanılmaz. Bu bağımsız oyun için maskeli yarışmacılar, tesis, kapılar ve makineler canvas ile çizilir. Ana oyunun portre tasarımı değişmez. Krem, adaçayı ve altın menü ailesi korunur; karanlık tesis bunun çevresinde ayrı bir sahne olur. Renk bulmacasında şekiller ve yazılar da bilgi taşır. Kapatma ve temel eylemler kayan içerikten ayrıdır. Azaltılmış hareket tercihi geçişlerde korunur.

Tek canvas ve tek simülasyon vardır. Sabit zemin yeniden boyutlandırıldığında önceden çizilir. Parçacıklar sınırlıdır; gölgeler bütün karakterlerden önce çizilir. Menüde, kural ekranında, sonuçta veya duraklatılmış halde RAF/fizik çalışmaz. Odak kaybında oyun otomatik durur. Kısa arayüz sesleri ana ses/efekt tercihlerini yalnız okur; duraklatma ve çıkışta kalan sesler temizlenir.

`scripts/experiments/death-game-launcher.js` yalnız Hileler düğmesini ekler. Açılana kadar oyun HTML/JS/CSS/SVG dosyalarını yüklemez. Açılış ayrı iframe/dialog içindedir. Çıkış mesajının kaynak penceresi kontrol edilir; çıkınca iframe kaldırılır. Ana oyun kayıtlarına veya ekonomisine erişim yoktur. Tek yazılan anahtar: `idle-spiker-death-game-v1`. Eski mini oyun anahtarı okunmaz ve ana kayıtla karıştırılmaz.

## Dosyalar ve doğrulama

- `scripts/experiments/death-game-model.js`: tarayıcıdan bağımsız kurallar ve tohumlu oda sıralaması.
- `scripts/experiments/death-game.js`: çizim, girişler, arayüz, ses ve ayrı kayıt.
- `styles/experiments/death-game.css`: yalnız bu iframe'in stilleri.
- `assets/death-game/controls/`: Kenney Mobile Controls Style B SVG'leri ve CC0 lisansı.
- `tests/test-death-game-rules.cjs`: her oda için sekiz normal giriş çözümü, on tam koşu, gerçek hata koşulları, bekleme/hız sınırları ve 60/120 Hz eşitliği.
- `tests/test-death-game-browser.cjs`: 280/320/390/430/1280 ve yatay 844×390 yerleşimleri, beş sahne, gerçek touch/keyboard, sabit kapatma, duraklatma, tam koşu, ayrı kayıt ve gerçek Hileler değişimi.
- `tests/test-death-game-playable.cjs`: modeli yalnız okuyarak gerçek dokunma olaylarıyla beş oyunu oynayan kayıtlı deneme. Konum, can, süre veya sonuç değiştirilmez.

Raporlar `audits/death-game-*.json`, sahneler aynı önekli PNG dosyaları, oynanış kaydı `audits/death-game-playable.webm` içindedir. Masaüstü dokunma emülasyonu fiziksel telefon ergonomisi ve cihaz FPS garantisi yerine geçmez.
