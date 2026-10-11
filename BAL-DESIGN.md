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
test-bal-economy.cjs: 200 bütçelik sıfır BAL başlangıcında, gelir ve hız öncelikli örnek rotada manuel talimat/maç ödülü olmadan 435 saniyede 13 yatırım, yatırımlar arasında en fazla 56 saniye. Bu örnek rota bir garanti değildir; üst seviyelerin 2/3 günlük koşulları korunur. Mobil 320/390/480 genişlikleri kontrol edilir.

BAL bütçe ölçeği 10: mevcut kayıtlar budgetScale=10 işaretiyle bir kez taşınır. Bakiye, bekleyen nakit ödemeler ve mevcut aday fiyatları dönüşür; AP ve takvim korunur. Kampın nakit ücreti, yeni transfer fiyatları, maç bütçeleri ve çevrimdışı gelir aynı oranda büyür. test-budget-scale.cjs dönüşümün tekrarlanmadığını doğrular. Bütçe kartındaki küçük kazanç etiketi ve parlama yalnız kulüp görünümünde çalışır; hareket azaltma ayarına uyar.
