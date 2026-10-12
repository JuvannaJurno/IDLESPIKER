# BAL — güncel geçiş

Lig tamamlanınca **Sıradaki lige geç → BAL’e başla**. Test için **Ayarlar → Aşama atla → BAL**; lig tamamlama şartını atlar. BAL’den sonrası henüz olmadığı için bu düğme BAL’de pasiftir.

Geçiş ayrı bir animasyon penceresi açmaz. Kulüp ekranı açılır; mevcut blok kartları kendi departmanına toplanır. Kantin, antrenmana birleşir. İsimler doğrudan aynı ekranda değişir; gelir merkezi ve oyuncu keşfi görünür. Ekran ilgili departmana kayar. Hareket azaltma tercihi desteklenir.

## Yeni başlangıç
- 200 bütçe, 0 AP, 0 talimat, boş bloklar, kartlar 1. seviye, başlangıç statları.
- Takvim 1. günden, BAL ligi 0 puandan başlar. İlk maç 5. gün.
- Kulüp kimliği, oyuncu kimlikleri/görünümleri ve kadro seçimi korunur.
- Kamp gelişimi ve eski ödül kayıtları yeni aşamaya taşınmaz.
- Önceki aşama geçiş arşivinde tutulur; yarım kalan kayıt işlemi açılışta tamamlanır.

## Hızlı toparlanma
- Eski temel blokların fiyatları 100 / 150 / 250 bütçe.
- Başlangıç 200 bütçe ile asistan ve temel antrenman açılır.
- Eski asistan 2 kat hızlıdır: 1,7 / 3,6 / 6 talimat/sn.
- Temel talimat AP’si prologun 2,5 katıdır; ilk kart seviyeleri %40 daha ucuzdur.
- Gelir Merkezi ilk dokunuşta ücretsiz açılır; ardından blok kurulmadan da ulaşan her 10 talimata 20 bütçe verir. Yerel Sponsor buna ek gelir sağlar.
- Sponsor fiyatları 400 / 1200 / 3000 / 9000 / 26000; yardımcı antrenör 600 / 1500 / 3600 / 10000 / 28000 bütçedir. Diğer BAL blokları taban fiyatın 5 / 11 / 24 / 55 / 120 katını kullanır. Blok başına oyun günü beklemeleri korunur.
- Çevrimdışı AP için asistan ve vardiya hâlâ gereklidir. Vardiyada günler ve bütçe de ilerler; ilk oynanmamış maçın saatinde üretim ve takvim bekler.

14 maçlık BAL, 500 talimatlık günler ve uzun vadeli blok seviyeleri korunur. Eski devralma ekonomisi için ölçülen süreler yeni başlangıca uygulanmaz.

Kontroller: `test-bal-browser.cjs`, `test-bal-rules.cjs`, mevcut prolog departman ve kart testleri.

## Son arayüz düzenlemeleri
Birleşen departmanlar dikey yerlerini korur; kantin yukarı kayarak antrenmana katılır. Yeni içerik kartın içinde kayar. Gelir Merkezi ayrı bir yeni açılışla görünür. İlk 3 seviye yalnız bütçeyle, 4 ve 5 ise bütçe + önceki yükseltmeden itibaren 2 / 3 oyun günü beklemeyle açılır; bu seviyelerin çubukları mordur. Kaynak kutuları AP ve bütçeyi üretim bilgisinden ayırır. Maçta kulüp renkleri ve forma şeridi uygulanır; libero ters renk kullanır. Kamp duyurusu maliyetleri gösterir; ayrı kamp penceresi ve iki adımlı ilk kullanım yönlendirmesi vardır.

## Oyuncu Keşfi
BAL’a özel departman, ekipman atölyesinin yerini alır. Takım menüsündeki Transfer alanından açılır. Adaylar aynı pozisyondaki ilk 7 ve yedek oyuncularla kart ve stat bazında karşılaştırılır. Oyuncu Keşfi ilk dokunuşta ücretsiz açılır. İlk katalog açılıştan 6 oyun günü sonra hazır olur: 3 aday, bütçeyle transfer, 30 oyunculuk kadro. Oyuncular yedek kadroya eklenir; eğitim, kamp, kadro seçimi ve maç sistemiyle çalışır.
- Keşif Ağı: katalog aralığı 6 günden 5 / 4 / 3 / 2 / 1 güne iner.
- Yerel Bağlantılar: yeni katalogda 4 / 5 / 6 / 7 / 8 aday.
- Yetenek Tarama: aday başına yüksek overall ihtimali %8 tabandan %15 / 23 / 32 / 42 / 55’e çıkar. Sabit stat bonusu vermez; yeni raporda her aday ayrı zar atar.
- Hazır rapor elle açılır; mevcut adaylar otomatik silinmez. Yenileme günü yeni sürenin başlangıcıdır. Çevrimdışı vardiyada ilerleyen günler keşif takvimine de sayılır.
- Eski ekipman blokları kaldırılır ve harcanan bütçe bir kez iade edilir. Transfer bedeli ile işe alım kaydı birlikte kaydedilir; takım kaydı kesilirse işe alım kaydından geri yüklenir.

Yeni BAL başlangıcında Gelir Merkezi ve Oyuncu Keşfi kilitlidir. Departman açılmadan bloklar alınamaz, kaynak üretimi ve keşif raporu başlamaz. Beslenme temelleri Performans Merkezinde açık kalır. Mevcut eski BAL kayıtlarındaki açık departmanlar korunur; açılış bedeli tekrar alınmaz.

Geçiş sırası: 1) Gönüllü Kulüp Asistanı → Kulüp Yönetimi, 2) Antrenman + Kantin → Performans Merkezi, 3) Kara Tahta → Teknik Ekip, 4) yeni Gelir Merkezi, 5) yeni Oyuncu Keşfi. Kantin bütün şeridiyle dikey birleşir; beslenme temelleri ardından yatay kayar. Yeni departmanlar en alta, ayrı ayrı ve ücretsiz keşif işaretiyle eklenir. Normal BAL ekranı ve yeniden yükleme de 1 / 0 / 3 / 2 / 4 kat sırasını korur.

Yeni departmanlar kapalı görünür; ＋ Keşfet işaretine dokununca bedelsiz açılır. Oyuncu Keşfi ilk açılışta ilk aşamayla ortak karartma, odak ve baloncuk sistemini kullanır. Keşif blokları → Takım → Transfer → katalog sayacı → bütçe sırasıyla ekranda aydınlatılır; Takım ve Transfer düğmelerine dokunmak öğreticiyi ilerletir. Bitirilen veya geçilen öğretici tekrar gösterilmez.

## BAL bütçe temposu
Sponsor ek geliri her 10 talimatta 20 / 40 / 70 / 120 / 200 bütçedir; Gelir Merkezi tabanı 20 bütçe olarak kalır. Mağaza toplam merkez gelirini çarpar. Gelir aynı departmana ulaştığında ödenir; Prolog ekonomisi değişmez.
Bütçe kartı otomatik merkez gelirini saniye başına, sıradaki ödemeyi talimat sayısıyla gösterir. Merkez kapalıysa ücretsiz keşif düğmesine kaydıran kısa yol vardır.
test-bal-economy.cjs: 200 bütçelik sıfır BAL başlangıcında, gelir ve hız öncelikli örnek rotada manuel talimat/maç ödülü olmadan 8 dakika içinde 13 yatırım. Bu örnek rota bir garanti değildir; teknik/keşif bloklarında 2/3 günlük koşullar korunur. Mobil 320/390/480 genişlikleri kontrol edilir.

BAL bütçe ölçeği 10: mevcut kayıtlar budgetScale=10 işaretiyle bir kez taşınır. Bakiye, bekleyen nakit ödemeler ve mevcut aday fiyatları dönüşür; AP ve takvim korunur. Kampın nakit ücreti, yeni transfer fiyatları, maç bütçeleri ve çevrimdışı gelir aynı oranda büyür. test-budget-scale.cjs dönüşümün tekrarlanmadığını doğrular. Bütçe kartındaki küçük kazanç etiketi ve parlama yalnız kulüp görünümünde çalışır; hareket azaltma ayarına uyar.

Transfer Merkezi arayüzü: Oyuncular ve Keşif raporu sekmeleri. Katalog kartında büyük OVR ve en yüksek üç özellik; incelemede yalnız seçilen aday, kadrodaki aynı pozisyon seçimi, yan yana kartlar, OVR farkı ve sekiz satırlık özellik karşılaştırması. Ekonomi ve transfer kuralları değişmez. Ortak number-ui.js kaynakları ve ücretleri k/m/b/t ile kısaltır; gerçek miktarlar değişmez. Ana kaynak sayaçlarının title ve erişilebilir etiketi tam tutarı korur. test-resource-scout-ui.cjs büyük sayılar ve 320/390/480 piksel arayüzü doğrular.

Transfer arayüzü son düzenleme: ayrı Keşif raporu sekmesi kaldırıldı; katalog durumu ve yenileme düğmesi tek ekranın üstünde. Oyuncu kartında yedi özellik görünür; rolün temel özellikleri altın renkle vurgulanır. Portreler kutuyu doldurur. Takım menüsünde ikonlu Transfer Merkezi girişi kullanılır.
Çevrimdışı vardiya maça ulaştığında offlineMatchId kaydedilir. Açılış ekranından sonra Maç saati geldi penceresi gösterilir; maça hazırlık veya kulübe bakma seçilir. Ertelemek bekleyen maçı ve ilerleme kilidini kaldırmaz. Popup bir görünür oturumda tekrarlanmaz.

Kamp güncellemesi: kamp başına cap +20, BAL tavanı 140 (100 → 120 → 140). CampRules version=2 eski +5/+10 kayıtları +20/+40 olarak bir kez dönüştürür; bitiş günleri ve oyuncu statları korunur. Üç yuvaya dokunma veya sürükleme ile taslak kadro hazırlanır. Tek gönderme düğmesi toplam AP/bütçeyi gösterir; tüm kayıtlar tek işlemde doğrulanıp kaydedilir, hata halinde hiçbir oyuncu gönderilmez. Kamp süresi 7 oyun günü, duyuru beklemesi 7 gün, ilk ücret 1200 AP + 5000 BAL bütçe olarak kalır. test-camp-board.cjs masaüstü ve mobil sürükleme, kontenjan, yetersiz bütçe, eski kayıt, toplu ödeme ve başarısız kayıt geri alımını doğrular.


BAL beş seviye dengesi: bütün BAL blokları beş seviyelidir; üretim blokları özgün beş belirgin etki basamağını kullanır. Yeni açılma koşulu eklenmedi. Genel fiyat çarpanları 0,5 / 0,95 / 1,65 / 2,7 / 4,2. Sponsor fiyatları 400 / 1000 / 2200 / 4400 / 8000; yardımcı antrenör 600 / 1300 / 2600 / 4900 / 8500 bütçe. Üretimde ilk üç seviye bütçeyle, sonraki iki yükseltme 0,5 ve 1 gün beklemeyle açılır; teknik/keşif mevcut 2/3 gün koşullarını korur.
On seviyeli kayıtlar balBlockVersion=3 ile 1/2/2/3/3/4/4/5/5/5 seviyelerine taşınır; ara seviyeler yukarı yuvarlanarak üretim kaybı önlenir. Eski beş seviyeli kayıtlar değişmez. Bakiye, AP ve bekleyen zamanlayıcı korunur.
Test-bal-pacing.cjs: otomasyonla en ucuz uygun yatırımı seçen 30 dakikalık ekonomi simülasyonunda on dakikalık dilimlerde 19/17/17 yatırım, en uzun aralık 48 saniye. Maç süresi/ödülü, manuel tıklamalar ve kamp/transfer harcamaları hariçtir. Bu rota gerçek oturum için süre garantisi değildir. Kayıt dönüşümü, tekrar yükleme ve fiyat sıçramaları ayrıca doğrulanır.

BAL geçişinde Prolog blokları artık seviyeleriyle korunur; görsel olarak birleşmek yerine tek tek departmana yerleşir. Bloklar çekmecesi tamamlanma şartı olmadan ayrı kartları açar; antrenman ve beslenme grupları Performans Merkezi içinde ayrı kalır. Geçiş sonrasında çekmece görünümü hemen güncellenir. Mobil çapraz kaydırma doğrudan konum günceller ve dokunma bitiminde sınırlı momentum uygular; yeni dokunuş momentumu durdurur.

BAL devam blokları: 15 ilk nesil BAL bloğunun her biri tamamlandığında ortak Bloklar çekmecesine taşınır ve kendi devam bloğunu açar. İlk nesil etkisi korunur; devam blokları beş seviyeli ve düşük giriş fiyatlıdır. Prolog blokları değişmez. Çift Talimat, Yardımcı Antrenör sonrası %20/40/60/80/100 ihtimalle iki mantıksal talimatı tek mavi sinyalde taşır; AP ve bütçe varışta, sayaçlar iki adımda hesaplanır. Maç eşiğinde ikinci adım iptal edilir. Çevrimdışı beklenen çift-talimat oranını kullanır, vardiya ve maç sınırlarını korur. Hızlı test 100 tıklama/sn ve bekleyen maçta durur.

Tamamlanan BAL kartları için ayrı arşiv penceresi veya ayrı devam kartı yoktur. Mevcut kart departmanın arkasına yatay kayar; tamamlanan kartlar ortak çekmecede önce gösterilir. Yeni seçenekler mevcut Yeni alan aç seçicisindedir. Her yenilemede çekmece düğmesinin güncel DOM elemanlarına bağlanması sağlanır.

2026-10-13 yeni seviye düzeni (önceki devam bloğu tasarımının yerine geçer): Prolog 5 seviye; eski 1/2/3 etkileri 1/3/5’te, bu eşiklerin toplam maliyetleri korunur. Prolog maç/takvim/süre kuralları değişmedi. BAL 10 seviye; ilk 5 ana etkiyi yükseltir, 6–10 aynı bloğun ek özelliğini geliştirir. Ayrı devam blokları, tamamlanınca gizlenme ve gün kilitleri kaldırıldı. Yalnız aşama geçişindeki Prolog blokları departmana yerleşir; ortak normal blok kartlarıyla gösterilir. prologBlockVersion=2 ve balBlockVersion=4: eski Prolog seviyeleri ve ayrı devam bloğu yatırımları bir kez dönüştürülür. Ana gösterge sayısal seviye + tek şerit; ek özellik ayrı 1/5–5/5 etiketi. test-stage-levels.cjs toplam fiyat eşikleri, bütçe/etki koruma, yeni ek özellikler ve kayıt tekrar yüklemelerini doğrular. test-stage-level-ui.cjs tamamlanan kartın yerinde kalması, normal miras kartları ve 320/390/480 piksel taşma kontrollerini doğrular.
