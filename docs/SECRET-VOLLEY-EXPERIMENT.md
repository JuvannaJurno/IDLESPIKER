# Karşılıklı saha — bağımsız mini oyun

4 Kasım 2026. Giriş: **Ayarlar → Hileler → Gizli salon · Karşılıklı saha → Oyna**.

## Kapsam ve kararlar

Ana oyunun lig, kamp, transfer, kadro, ekonomi ve maç simülasyonuna dokunulmaz. `index.html` yalnız küçük açıcı dosyayı yükler. Kullanıcı açmadıkça mini oyunun HTML'i, fiziği, karakter verileri veya kontrol görselleri yüklenmez. Aktif mini oyun ayrı bir iframe/dialog içindedir; çıkışta iframe kaldırılır, kendi kare döngüsü, girişler ve sesi kapatılır. Ana oyun normal kayıt/idle davranışını korur.

Bir adet 6'ya 6 maç hesabı ve **tek ortak saha görüntüsü** vardır. Ekran iki kameraya bölünmez; iki oyuncu aynı sahaya, topa ve skora bakar. Birinin kontrolleri altta, diğerininki üsttedir. Yalnız üst kontrol paneli telefonun karşı ucundaki oyuncuya döner. Tek kişilik modda üst kontroller kaldırılır, karşı takımı bot yönetir. Maç 11 sayıda, iki farkla; en geç 21'de biter.

Kontroller için kullanıcının eklediği Kenney Mobile Controls paketinin Style B yuvarlak pad/nub/button görselleri seçildi. Kullanılan üç SVG ve CC0 lisansı `assets/secret-volley/controls/` içindedir; ham paket yerinde korunur. Ana oyunun güncel SVG karakter çizicisi, mevcut yürüme/manşet/pas/smaç/blok pozları, saç ve kol ekipmanı paylaşılır. Eski raster karakter çizicisine geri dönüş yoktur. Native çizici değiştirilmez.

## Kontrol düzenleri

- **Tek analog:** aktif oyuncuyu hareket ettirir. Ortak sahadaki oyuncuya dokunarak o takımın aktif oyuncusu seçilir; kendi Değiştir tuşun da kullanılabilir. Analog tutulurken otomatik seçim el değiştirmez. Elle seçim kısa süre korunur; sonra yaklaşan top için uygun oyuncu önerilir.
- **Altı analog:** her takımın 1–6 numaralı ayrı kontrolü vardır. Aynı anda farklı analoglar tutulabilir; Oyna tuşu son seçilen oyuncuyu kullanır. Numaralar saha kontrol işaretleridir, forma numarası değildir.
- **Oyna:** servis sırası sendeyken servisi başlatır. Rallide 0,7 saniyelik fiziksel temas isteği oluşturur; uygun konum/yükseklik yoksa topa uzaktan vurmaz. Yüksek üçüncü topta sıçrama/smaç, file yanında sıçrama/blok, diğer durumlarda manşet veya pas olur. Çok erken/alçak üçüncü temas güvenli karşı top olur.
- **Hedef:** ortak sahada boş bir alana dokunmak veya sürüklemek, karşı yarıdaki takımın hücum hedefini belirler. Birinin Oyna tuşu tutuluyorsa hedef onun takımına aittir. Oyuncuya doğrudan dokunmak seçim yapar. Aynı anda iki saha dokunuşu bağımsız izlenir. Sabit artı hücum hedefini, kesik halka yaklaşan topun erişilebilir yerini gösterir.
- **Takım yardımı:** menüde kapatılabilir. Seçilmemiş oyuncuların normal ilk/ikinci paslara yardım etmesine izin verir. Aktif oyuncunun hareketi ve üçüncü hücum kullanıcıda kalır. Skill veya Legendary yoktur.
- Masaüstü denemesi: alt oyuncu yön tuşları / Space / Q; üst oyuncu WASD / E. İkinci kişinin seçiminde üst kameradaki gerçek kontroller kullanılabilir.

İlk kullanılacak düzen olarak tek analog önerilir: küçük ekranda daha büyük hedefler bırakır, aynı anda altı oyuncu düşünmeyi gerektirmez. Bu bir insan kullanılabilirlik araştırmasının sonucu değildir; iki düzen de gerçek çoklu dokunma ile teknik olarak doğrulandı. Altı analog karşılaştırma/deney sürümü olarak tutulur.

## Fizik ve bot

Saha 9×18 metre, file 2,43 metre, yerçekimi 9,8 m/s²; sabit hesap adımı 120 Hz. Oyuncu hızı her iki tarafta da 4,7 m/s; çapraz hareket normalize edilir. Topun temasta gerçek konumu/yüksekliği korunur. Servis atan oyuncu çizginin arkasından oyuna yürüyerek dönebilir, başlangıçta çizginin içine sıçratılmaz.

Bot hareket, sıçrama, erişim ve net temasında aynı kuralları kullanır. Tepki gecikmesi, konum tahmin hatası ve blok zamanlaması vardır; skoru belirleyen rastgele kazanma zarı yoktur. Hücum hedefi yalnız boş iniş karesine göre değil, topun erişilebilir uçuş yolu ve file yüksekliğine göre seçilir. Botun hareketi sahayı kayarak/ışınlanarak kapatmaz.

Sayı; yere değme, dışarı, file/anten, dördüncü temas veya çift dokunuşla gelir. Ralli süresine göre yapay sayı verilmez. Bu yüzden iki hatasız otomatik giriş uzun ralli sürdürebilir. İnsan giriş testlerindeki periyodik tereddütler yalnız girişleri geciktirir; sayı/topa temas doğrudan değiştirilmez. Servis el değiştirince altılı düzen döner. Sayı arasındaki hareketler eve/servise doğru yürür, sonraki sayı başında zorunlu büyük konum atlaması azaltılır.

## Dosyalar ve kayıt

- `secret-volley.html`: bağımsız giriş ve menü.
- `styles/experiments/secret-volley.css`: yalnız iframe içinde kullanılan görünüm.
- `scripts/experiments/secret-volley-model.js`: DOM ve storage bilmeyen fizik/ralli modeli; Node'da da çalışır.
- `scripts/experiments/secret-volley-native.js`: güncel native çizicinin bu sayfadaki sınırlı veri/yardımcı sözleşmesi.
- `scripts/experiments/secret-volley.js`: kameralar, kontroller, ses, yaşam döngüsü.
- `scripts/experiments/secret-volley-launcher.js`: Hileler girişi; açık iframe'den gelen kapatma mesajını kaynak pencere kontrolüyle kabul eder.

Tek yazılan anahtar `idle-spiker-secret-volley-v1`: kontrol/mod/yardım tercihleri ve tamamlanan mini maçların sayı/galibiyet kaydı. Devam eden ralli yeniden açılışta sürdürülmez. Ana oyunun kayıt anahtarlarına yazılmaz. Ses açık/kapalı ve efekt seviyesi yalnız okunur, değiştirilmez.

Saha arka planı boyut değişiminde önceden çizilir. Karakter parçaları ve hareketli gövde grupları menü hazırlanırken ısıtılır. Oyuncuların yerel gövdeleri 2× ara görüntüye çizilir; sabit duran oyuncunun görüntüsü sonraki karelerde yeniden kullanılır. Hareket ve eylem pozları güncel kalır. Ekran kapalıyken veya duraklatılmışken fizik/kare döngüsü çalışmaz. Sekme/pencere odağı kaybolunca girişler bırakılır ve maç duraklar. 2× üstü ekran yoğunluğunda çizim çözünürlüğü sınırlanır. Tek saha ve tek fizik hesabı vardır.

## Doğrulama

`node tests/test-secret-volley-rules.cjs`

Fiziksel servis/manşet/pas/smaç/blok; uzaktan ve file ötesinden temasın engellenmesi; çift/dördüncü dokunuş, file ve dışarı; topun temasta konumunu koruması; iki analogun bağımsız hareketi; tutulan analogda seçimin değişmemesi; hız sınırı; 60/120 adım eşitliği. 32 bot maçı ve doğrudan normal kontrol API'sini kullanan 16 maç tamamlanır. Kanıt: `audits/secret-volley-simulation.json`.

`node tests/test-secret-volley-browser.cjs`

280/320/390/430/1280 genişlikler ve 844×390 yatay ekran; iki mod × iki kontrol düzeni = 24 yerleşim. Her durumda yalnız tek saha canvas'ı vardır. Gerçek tarayıcı touch/pointer capture ile iki takımın eşzamanlı analogları, pad dışına taşan parmak ve iptal; ortak sahada iki takımın oyuncu/hedef seçimi; pause/resume; gerçek native çiziciyle canlı ralli; eski sprite'a sıfır dönüş; gövde ara görüntüsünde pozların kırpılmaması; yalnız özel kayıt anahtarına yazma; gerçek Hileler girişi; çıkışta iframe'in ve çalışma döngüsünün kaldırılması.

Görseller `audits/secret-volley-menu.png`, `secret-volley-local-smart.png`, `secret-volley-local-six.png`, `secret-volley-bot-smart.png`, `secret-volley-rally.png`.

## Deneyin sınırları

Bu sürüm ana oyuna bağlı rekabetçi multiplayer değildir: ağ/çevrimiçi eşleştirme yoktur. Gerçek telefonun parmak sınırı, cihaz ısınması ve donanım FPS'i masaüstü dokunma emülasyonuyla tamamen doğrulanamaz; fiziksel iki kişilik deneme gerekir. Çok kısa yatay ekranda saha küçülür; amaçlanan kullanım telefonu dikey tutmaktır. Bot ve yardım dengesi ilk oynanabilir taslaktır. Kontrollerin rahatlığı sonraki gerçek oynanışa göre ayarlanabilir.
