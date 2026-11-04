# Karşılıklı saha — bağımsız mini oyun

4 Kasım 2026. Giriş: **Ayarlar → Hileler → Gizli salon · Karşılıklı saha → Oyna**.

## Kapsam ve kararlar

Ana oyunun lig, kamp, transfer, kadro, ekonomi ve maç simülasyonuna dokunulmaz. `index.html` yalnız küçük açıcı dosyayı yükler. Kullanıcı açmadıkça mini oyunun HTML'i, fiziği, karakter verileri veya kontrol görselleri yüklenmez. Aktif mini oyun ayrı bir iframe/dialog içindedir; çıkışta iframe kaldırılır, kendi kare döngüsü, girişler ve sesi kapatılır. Ana oyun normal kayıt/idle davranışını korur.

Bir adet 6'ya 6 maç hesabı ve **tek ortak saha görüntüsü** vardır. Ekran iki kameraya bölünmez; iki oyuncu aynı sahaya, topa ve skora bakar. Birinin kontrolleri altta, diğerininki üsttedir. Yalnız üst kontrol paneli telefonun karşı ucundaki oyuncuya döner. Tek kişilik modda üst kontroller kaldırılır, karşı takımı bot yönetir. Maç 11 sayıda, iki farkla; en geç 21'de biter.

Kontroller için kullanıcının eklediği Kenney Mobile Controls paketinin Style B yuvarlak pad/nub/button görselleri seçildi. Kullanılan üç SVG ve CC0 lisansı `assets/secret-volley/controls/` içindedir; ham paket yerinde korunur. Ana oyunun güncel SVG karakter çizicisi, mevcut yürüme/manşet/pas/smaç/blok pozları, saç ve kol ekipmanı paylaşılır. Eski raster karakter çizicisine geri dönüş yoktur. Native çizici değiştirilmez.

## Kontrol düzenleri

- **Tek analog:** ilgili karşılayıcı, pasör, hücumcu ve blokçu otomatik seçilir. Analog tutulurken de yeni oyuncuya geçilir; yön ona aktarılır, parmak bırakıldığında yeni oyuncu da durur. Aynı top için eşit uygunlukta oyuncular arasında sürekli gidip gelme önlenir. Manuel seçim düğmesi gösterilmez.
- **Altı analog:** her takımın 1–6 numaralı ayrı kontrolü vardır. Kullanıcının kendi bakışında ilk sırada öndeki üç, ikinci sırada arkadaki üç oyuncu bulunur. Düzen servis dönüşünde yenilenir; ralli ortasında kontrol yer değiştirmez. Aynı anda farklı analoglar tutulabilir; Oyna tuşu son seçilen oyuncuyu kullanır. Numaralar saha kontrol işaretleridir, forma numarası değildir. Pad boyları altılıda 52–62px, teklide 88–104px'tir; küçük ekranda da bu alt sınırlar korunur. Parmağın köşegen yönü, sahanın farklı X/Y ölçekleriyle hizalanır; tam itişte fiziksel oyuncu hızı düşürülmez.
- **Oyna:** dokunup bırakmak normal vuruş; basılı tutmak güç; sürüklemek hedef sağlar. Güç ince altın halkayla gösterilir. Servis sırandaysa bırakışta servis atılır. Rallide bırakış 0,7 saniyelik fiziksel temas isteği oluşturur; uygun konum/yükseklik yoksa topa uzaktan vurmaz. Yüksek üçüncü topta sıçrama/smaç, file yanında sıçrama/blok, diğer durumlarda manşet veya pas olur. Çok erken/alçak üçüncü temas güvenli karşı top olur. İptal edilen dokunma vuruş yapmaz; aynı tuşta ikinci parmak ilk tutuşu bozmaz.
- **Hedef:** ortak sahada boş bir alana dokunmak veya sürüklemek, karşı yarıdaki takımın hücum hedefini belirler. Birinin Oyna tuşu tutuluyorsa hedef onun takımına aittir. Altı analogda oyuncuya doğrudan dokunmak seçim yapar; tek analogda ilgili oyuncu otomatik seçilir. Aynı anda iki saha dokunuşu bağımsız izlenir. Sabit artı planlanan hücum hedefini, Düşüş halkası mevcut topun dokunulmazsa yere ineceği noktayı gösterir.
- **Takım yardımı:** menüde kapatılabilir. Tek analogda aktif oyuncu da topa gerçekten yetiştiyse ilk manşet/pas otomatik yapılır. Aktif oyuncunun hareketi ve üçüncü hücum kullanıcıda kalır. Altılı düzende seçilmemiş oyuncular normal ilk/ikinci paslara yardım eder. Pasörün temas yerini başka bir oyuncu işgal ediyorsa o oyuncu normal hızla yana açılır. Skill veya Legendary yoktur.
- Masaüstü denemesi: alt oyuncu yön tuşları / Space / Q; üst oyuncu WASD / E. İkinci kişinin seçiminde üst kontrol paneli kullanılabilir.

İlk kullanılacak düzen olarak tek analog önerilir: küçük ekranda daha büyük hedefler bırakır, aynı anda altı oyuncu düşünmeyi gerektirmez. Bu bir insan kullanılabilirlik araştırmasının sonucu değildir; iki düzen de gerçek çoklu dokunma ile teknik olarak doğrulandı. Altı analog karşılaştırma/deney sürümü olarak tutulur.

## Fizik ve bot

Saha 9×18 metre, file 2,43 metre, yerçekimi 9,8 m/s²; sabit hesap adımı 120 Hz. Oyuncu hızı her iki tarafta da 4,7 m/s; çapraz hareket normalize edilir. Topun temasta gerçek konumu/yüksekliği korunur. Servis atan oyuncu çizginin arkasından oyuna yürüyerek dönebilir, başlangıçta çizginin içine sıçratılmaz.

Bot hareket, sıçrama, erişim ve net temasında aynı kuralları kullanır. Tepki gecikmesi, konum tahmin hatası ve blok zamanlaması vardır; skoru belirleyen rastgele kazanma zarı yoktur. Hücum hedefi yalnız boş iniş karesine göre değil, topun erişilebilir uçuş yolu ve file yüksekliğine göre seçilir. Botun hareketi sahayı kayarak/ışınlanarak kapatmaz.

Sayı; yere değme, dışarı, file/anten, dördüncü temas veya çift dokunuşla gelir. Ralli süresine göre yapay sayı verilmez. Bu yüzden iki hatasız otomatik giriş uzun ralli sürdürebilir. İnsan giriş testlerindeki periyodik tereddütler yalnız girişleri geciktirir; sayı/topa temas doğrudan değiştirilmez. Servis el değiştirince altılı düzen döner. Sayı arasında top sönümlenerek seker; oyuncular eve/servise yürür. En az kısa bir sayı arası geçip yerlerine yaklaşınca servis hazırlanır; normal hareketin büyük konum atlamasına dönüşmesi önlenir.

Hedef doğruluğu: önceki prototipte atış hedefte 0,2/0,4 metre yüksekte bitiyor, gösterge ise 1,35 metrelik karşılama noktasını gösteriyordu. Servis/hücum artık aynı `shot` / `trajectory` hesabında hedefin zemindeki noktasına gider. Fileyi geçmek için gereken yay süresi aynı hesapta belirlenir. Canlı Düşüş halkası gerçek mevcut hızdan z=0 köküdür; hedef değiştirmenin havadaki eski topun rotasını değiştirdiği izlenimi verilmez. Zemin teması sabit adımın sonuna bırakılmaz; o adım içindeki gerçek temas anında yer/sayı kararı verilir. Gövdenin vuruş pozu da topa temas anına hizalanır. File görselinin üstü fiziksel yüksekliği izler, sıçrayan file önü oyuncusu ağın arkasında kaybolmaz.

Rahat / Dengeli / Zorlu rakip temposu vardır; varsayılan Rahat'tır. Botun tepki/konum algısı ve normal hücum gücü değişir, ulaşma ve hareket kuralları değişmez. Bot hücumlarının azami yatay hızları sırasıyla 15 / 18,5 / 21,5 m/s'dir; fileyi geçen aynı gerçek yay hesapları bunları daha da sınırlayabilir. Maç sayısında sıcak altın vurgu görünür. Sonuçta iki takımın gerçek vuruş/blok sayıları ve en uzun ralli gösterilir; Rövanş aynı ayarlarla temiz maç başlatır.

## Dosyalar ve kayıt

- `secret-volley.html`: bağımsız giriş ve menü.
- `styles/experiments/secret-volley.css`: yalnız iframe içinde kullanılan görünüm.
- `scripts/experiments/secret-volley-model.js`: DOM ve storage bilmeyen fizik/ralli modeli; Node'da da çalışır.
- `scripts/experiments/secret-volley-native.js`: güncel native çizicinin bu sayfadaki sınırlı veri/yardımcı sözleşmesi.
- `scripts/experiments/secret-volley.js`: ortak saha çizimi, kontroller, ses, yaşam döngüsü.
- `scripts/experiments/secret-volley-launcher.js`: Hileler girişi; açık iframe'den gelen kapatma mesajını kaynak pencere kontrolüyle kabul eder.

Tek yazılan anahtar `idle-spiker-secret-volley-v1`: kontrol/mod/yardım tercihleri ve tamamlanan mini maçların sayı/galibiyet kaydı. Devam eden ralli yeniden açılışta sürdürülmez. Ana oyunun kayıt anahtarlarına yazılmaz. Ses açık/kapalı ve efekt seviyesi yalnız okunur, değiştirilmez.

Bot temposu da aynı özel kayıt alanındadır. Mevcut `VFX/Ball` top sesleri ayrı küçük havuzdan çalınır; duraklatma/çıkışta durur. Ana menünün kapatma başlığı ve Sahaya çık altlığı kaydırmadan ayrı kalır; duraklatma/sonuç başlığı da kayan içerikten ayrıdır. Çıkış ve kayıt izolasyonu korunur. Hileler açıcı URL'si bu sürümde `secret-volley.html?v=playable-2` olup eski HTML önbelleği yeni kontrolleri gizlemez.

Saha arka planı boyut değişiminde önceden çizilir. Karakter parçaları ve hareketli gövde grupları menü hazırlanırken ısıtılır. Oyuncuların yerel gövdeleri 2× ara görüntüye çizilir; sabit duran oyuncunun görüntüsü sonraki karelerde yeniden kullanılır. Hareket ve eylem pozları güncel kalır. Ekran kapalıyken veya duraklatılmışken fizik/kare döngüsü çalışmaz. Sekme/pencere odağı kaybolunca girişler bırakılır ve maç duraklar. 2× üstü ekran yoğunluğunda çizim çözünürlüğü sınırlanır. Tek saha ve tek fizik hesabı vardır.

## Doğrulama

`node tests/test-secret-volley-rules.cjs`

Fiziksel servis/manşet/pas/smaç/blok; uzaktan ve file ötesinden temasın engellenmesi; çift/dördüncü dokunuş, file ve dışarı; topun temasta konumunu koruması; iki analogun bağımsız hareketi; tutulan analogda seçimin değişmemesi; hız sınırı; 60/120 adım eşitliği. 32 bot maçı ve doğrudan normal kontrol API'sini kullanan 16 maç tamamlanır. Kanıt: `audits/secret-volley-simulation.json`.

`node tests/test-secret-volley-browser.cjs`

280/320/390/430/1280 genişlikler ve 844×390 yatay ekran; iki mod × iki kontrol düzeni = 24 yerleşim. Her durumda yalnız tek saha canvas'ı vardır. Gerçek tarayıcı touch/pointer capture ile iki takımın eşzamanlı analogları, pad dışına taşan parmak ve iptal; ortak sahada iki takımın oyuncu/hedef seçimi; pause/resume; gerçek native çiziciyle canlı ralli; eski sprite'a sıfır dönüş; gövde ara görüntüsünde pozların kırpılmaması; yalnız özel kayıt anahtarına yazma; gerçek Hileler girişi; çıkışta iframe'in ve çalışma döngüsünün kaldırılması.

Ek kontroller:

- `test-secret-volley-autoswitch.cjs`: manşet → pasör → hücumcu, ilgili blokçu, iki tarafta tutulan yönün yeni oyuncuya aktarılması/bırakılması; altılı kontrolün bağımsız kalması.
- `test-secret-volley-trajectory.cjs`: 120 gerçek servis ve 162 hücum/güvenli top yayı; hedef, canlı gösterge ve gerçek yer teması aynı noktadır. Güç seçenekleri ve file geçişi de doğrulanır. `audits/secret-volley-aim.json` en büyük sapmayı kaydeder.
- `test-secret-volley-difficulty.cjs`: üç tempo × üç tohum, hız sınırları ve doğal sayılar; rapor gerçek tamamlanma durumunu taşır.
- `test-secret-volley-playable.cjs`: doğrudan model vuruşu çağırmadan gerçek touch/pointer olaylarıyla analog, hedef ve vuruş tuşu kullanılır. Servis–manşet–pas–smaç, tutulan analogda oyuncu değişimi ve sayı alınması sınanır. Kayıt `audits/secret-volley-playable.webm` ve JSON raporudur. Bu emülasyon fiziksel telefon ergonomisi araştırması yerine geçmez.

Tarayıcı testi ayrıca 6 servis dönüşünün iki taraftaki analog sırasını, büyütülmüş dokunma alanlarını, köşegen hizasını, tut-bırak/sürükle servisini, iptal edilen vuruşu, sabit kapatmayı ve gerçek kazandıran sayıdan sonraki Rövanş sıfırlamasını kontrol eder.

Görseller `audits/secret-volley-menu.png`, `secret-volley-local-smart.png`, `secret-volley-local-six.png`, `secret-volley-bot-smart.png`, `secret-volley-rally.png`.

## Deneyin sınırları

Bu sürüm ana oyuna bağlı rekabetçi multiplayer değildir: ağ/çevrimiçi eşleştirme yoktur. Gerçek telefonun parmak sınırı, cihaz ısınması ve donanım FPS'i masaüstü dokunma emülasyonuyla tamamen doğrulanamaz; fiziksel iki kişilik deneme gerekir. Çok kısa yatay ekranda saha küçülür; amaçlanan kullanım telefonu dikey tutmaktır. Bot ve yardım dengesi ilk oynanabilir taslaktır. Kontrollerin rahatlığı sonraki gerçek oynanışa göre ayarlanabilir.
