# Kariyer akışı, tutorial ve altı özellik — 28 Ekim 2026

Kullanıcının 15 maddelik isteği ve son düzeltmesi esas alınmıştır: sürekli daha yüksek OVR veren katalog **BAL kataloğudur**, Ulusal 2. Lig değil. Bu rapor test senaryolarını ve sınırlarını kaydeder; insan oyuncu tutunması veya garanti lig terfisi iddiası değildir.

## Uygulanan davranışlar

| İstek | Son davranış |
|---|---|
| 1. Önce sezon sırası | `LeagueSeason.showCompletion` önce mevcut sezon sonuç penceresini açar: sıra, galibiyet, puan. Uygun ligde Devam, ardından geçiş seçenekleri gelir. Sezonu incele ve Kulübe dön korunur. Geçiş artık sonucu atlamaz. |
| 2. Sekmeye girmeden ödül | Sosyal girişteki Ödülü al eylemi ilk hazır ödülü aynı ekranda alır. Klavye ile giriş düğmesini etkinleştirmek de hazır ödülü alır. Başlık bölgesine tıklamak yolculuğu incelemeye devam eder. Aynı kayıt/tek alım denetimi kullanılır; gizli yolculuk kartı için boş yere animasyon beklenmez. |
| 3. Kare baykuş / nota | Sosyal alt navigasyonu kullanıcının `square_owl.png` dosyasını kullanır. Boş video sırasında veya hazır paylaşımda Double Note Strip döngüsü 3 saniyedir. Hareket azaltma tercihi korunur. |
| 4. Ralli Legendary'leri | Eksi Tempo hücumcusu manşet sırasında kısa hücum pozisyonuna hazırlanır. Aday konum uzaklığı 24 → 70; ön sıra ve libero olmama koşulları vardır. Sıradan yeteneğin 1,7 sn beklemesi, kendi beklemesi dolmuş Legendary’yi artık engellemez. Ralli Legendary ağırlığı 2 → 3, ralli beklemesi 8 → 6 sn, servis sonrasındaki ralli beklemesi 2,5 → 1,5 sn. Servis beklemesi 14 sn, ralli başına iki Legendary sınırı ve oyuncunun sahip olma/açılma koşulları korunur. |
| 5. Kaydırarak kart açma | Kart sahnesinde en az 48px yatay ve dikeyden 1,5 kat belirgin hareket sonraki kartı açar. Dikey kaydırma, karşılaştırma/düğmeler ve form alanları çekiliş değildir. Native resim sürüklemesi engellenir; pointer capture ve cancel kontrolü vardır. Dokunarak açma da kalır. |
| 6. Rakip Legendary bütçesi | BAL'de güç sırasındaki ilk üç rakip as kadromuzdaki açık Legendary sayısını takip eder; diğerleri bu yolla Legendary açmaz. 2. Lig sekiz takımlıdır: bizim takımla birlikte üst beşliyi oluşturan dört güçlü rakip bizi takip eder, son üç rakip BAL çıkışındaki açık sayıyla sınırlanır. Yedi rakip olduğu için beş güçlü **rakip** + üç zayıf rakip üretilmez. |
| 7. Video sırası rehberi | Video sırası ilk kez gerçekten görünür olduğunda ortak rehberden tek cümle: “＋ ile video ekle. Sıradakiler tek tek hazırlanır ve otomatik paylaşılır.” Başka modalın arkasında gösterilmez, görüldüğünde kayıt tutulur. |
| 8. Karanlık alan tıklamaları | Tutorial açıkken bilgi kutusu ve gerçek hedef dışındaki pointer/click olayları oyun denetimlerine ulaşmaz. Hedefte gereken eylem veya Devam/Anladım çalışır; karanlıkta ayarlar/navigasyon tetiklenmez. |
| 9. Yalnız Legendary karşılaştır | Transfer karşılaştırmasındaki yetenek bölümü aday ve kendi oyuncumuzu iki sütunda yalnız Legendary üzerinden gösterir. Kilitli isimler açılmaz. İkinci gizli potansiyel, mevcut gümüş/6 kamp görünürlük kapısından önce sızdırılmaz. Özellik/OVR tablosu korunur. |
| 10. Kart materyali | İki oyuncunun OVR'sinin altında ayrı Siyah / Gümüş / Altın / Mor kart etiketi vardır. Normal kart kamp geçmişinden, gerçek elit kart elit görünümünden hesaplanır. Potansiyel kartta gizli materyal açılmaz. |
| 11. Yeni tüpü gösterme | Yeni standart/medya hattı gelince uygun anda Kulüp → hat başlığına kayılır; yeni tüp 1,8 sn'lik açılış/vurgu alır. Modal, tutorial ve lig geçişi beklenir. Her kapasite yükseltmesi yeni tüp sayılmaz. İlk yüklemenin veri hazırlığı mevcut tüplere tekrar açılış oynatmaz. |
| 12. BAL öncesi karakter | Sezon sonucunun ardından yeni lige ilerleme seçilince aynı kulüp sorumlusu iki replik söyler: Mahalle başarısı/amatör lig daveti; ilk üçle profesyonel 2. Lig fırsatı. Aynı visual novel yüzeyi ve tek görülme kaydı kullanılır, sonra arma/kulüp oluşturma veya geçiş devam eder. |
| 13. İsim sonrası yön | İlk karakteri oluşturmak profil özetini tekrar açmaz; pencere kapanır, tutorial tercihi ve seçildiyse karakter konuşması gelir. Sonraki normal profil düzenlemesi değişmez. |
| 14. BAL fırsat sıklığı | İlk transferin güçlü adayı korunur. Normal BAL fırsat tabanı %55 → %22, bloklarla en çok %46. Büyük fırsat en çok %7. Üç kuru katalogdan sonra sonraki katalogda fırsat koruması vardır. Ulusal 2. Lig'in mevcut %55 tabanı ve kendi blok artışları korunur. |
| 15. Mental kaldırma | Altı aktif özellik: smaç, blok, servis, manşet, pas, dayanıklılık. Mental eğitim/arayüz/karşılaştırma/akademi yönü ve maç baskı etkisi değildir. Eski yatırım tek seferlik ağırlıklı dayanıklılık aktarımıyla korunur. |

## Rakip açılma hesabının ayrıntısı

`TeamRules.legendaryCount`, as slotlarındaki gerçekten açık Legendary'leri sayar; yedekte bir oyuncuyu almak tek başına sahadaki rakibi güçlendirmez. `rivalLegendaryBudget` yalnız yetenek bütçesini belirler; rakip stat/OVR'sini oyuncuyla birlikte büyütmez. Bütçe en çok yedi rakip oyuncuya dağıtılır. Önce pasör/smaçör/çapraz/orta rolleri gelir. Bütçe verilmeyen oyuncu özel isim taşısa bile kamp kapısını atlayarak Legendary kullanmaz; diğer normal yetenekleri için mevcut 0–2 kamp ilerleyişi korunur.

2. Lig'e gerçek geçişte açık as Legendary sayısı `balLegendaryCount` olarak oda kaydına yazılır; normalize ve yeniden yüklemede korunur. Eski 2. Lig kayıtlarında bulunmuyorsa alt grup için üçlük uyum değeri kullanılır, yine de bizim mevcut açık sayımızı aşmaz. Güç grupları sabit rakip güç sırasıdır; her maç canlı puan sırasına göre değişip durmaz. BAL açılışındaki servis gösterisi de ancak bütçe verilmiş uygun oyuncuyla yapılabilir; sıfır açık yetenekte zorla Legendary açılmaz.

## Mental yatırımının taşınması

Eski ağırlıklar rol bazında korunarak mental payı dayanıklılık payına eklenir. Eski dayanıklılık/mental ağırlıkları `wD/wM` ise:

```
yeni dayanıklılık = yuvarla((eski dayanıklılık × wD + eski mental × wM) / (wD + wM))
yeni OVR dayanıklılık ağırlığı = wD + wM
```

Diğer beş özelliğe dokunulmaz. Kart seviyesi, yıldız/kamp geçmişi ve sınırlar sıfırlanmaz. Tam sayı yuvarlaması nedeniyle OVR farkı en çok 1; bu 125 eski değer/rol kombinasyonunda denetlendi. Başlangıç özelliği ve kazanılmış dayanıklılık kaydı birlikte düzeltilir; tekrar yükleme ikinci kez aktarım yapmaz (`mentalRemovedVersion=1`). İlk geçişten önce eski kadro `idle-spiker-pre-mental-removal-v1` anahtarına, depolama elveriyorsa bir defa yedeklenir.

Yeni eğitim hâlâ tam kazançta altı puan verir: 3 + 2 + 1. Fiyat/indirim ve kısmi kazanım hesabı gerçek kazanca bağlıdır. Zihinsel Hazırlık bloğunun aktif adı Dayanıklılık Çalışması, indirimi yalnız dayanıklılıktır. Akademi yönlerindeki eski mental katkı dayanıklılık olur. Rakip baskı çarpanı kaldırılır; pas aldatmasında mental yerine blok okuması kullanılır. Eski dosyaların okunabilmesi korunur, yeni aktif roster ve teklifler mental gerektirmez.

## Denetim sonuçları

- `test-career-polish-rules.cjs`: 125 eski kart aktarımı, altı puan eğitim, tüm 0–7 açık Legendary bütçeleri ve kayıt kararlılığı. 500 ardışık BAL kataloğunda **180 fırsatlı katalog (%36)**; en uzun kuru seri üç. Bu ölçüm blokları alınmamış, ilk transferi geçmiş sabit kadroya aittir. Bloklar ve ilk transfer farklıdır.
- `test-career-polish-browser.cjs`: gerçek UI'de karanlık alanın ayarları açamaması; hedef talimatın çalışması; sonuç → iki replik → kulüp oluşturma; yatay/dikey kart jestleri; materyal ve Legendary bölümü; video sırası mini rehberi; sekme değiştirmeden ödül; kare ikon/3 saniye; yeni tüp kamerası. **56 gerçek `MatchIntro` rakip kadrosunda** açık yetenek sayısı beklenen bütçeyle aynı. 320/390/1440 genişlikler ve kısa/yatay sezon sonucu kontrol edildi.
- `test-club-introduction.cjs`: gerçek profil oluşturulduğunda profilin tekrar açılmaması; evet/hayır, yenileme, Escape, normal tutoriala dönüş; 10 tema/viewport birleşimi. `test-tutorial-seen-once-browser.cjs` otomatik tekrar etmeme davranışını doğrular.
- `test-inplay-legendary-frequency.cjs`: `65bb810` ile aynı kontrollü kadro koşullarında **12 önce + 12 sonra native maç**. Oyun içi Legendary / 100 sayı **11,88 → 19,00**; Eksi Tempo toplam **0 → 2**, iki yeni kullanımda da gerçek hücuma geçiş, sıfır konum-temas hatası. Kilitli oyuncu kontrolü ayrıca geçti. Bu örnek orta oyunculara açık Eksi Tempo verilmiş test kadrosudur; tüm rastgele gerçek kadroların oranı değildir.
- 36 sıfır ekonomi rotası / **108 sezon** yeniden çalıştı. Ücretli dengeli rotalarda Bölgesel ortanca kamp aktif 3, seyrek/çevrimdışı 2; 2. Lig aktif 8, seyrek/çevrimdışı 9. Talimat/takvim süreleri yavaşlatılmadı.
- Transfer kullanılan **10 yeni rota / 30 sezon**: aktif BAL sonu 4–7, seyrek dönüşte 3–4 oyuncu alımı; tüm rotalar takvim modelini tamamladı. Bunlar üretim rotasyon stat hesabıdır; terfi varsayılır, tam native sıralama garantisi değildir. Ham kayıt `audits/career-polish-market-routes.json`.
- 20 ilk kamp dönüşü yine toplu doldur/tekrar gönder döngüsüne girmedi. Gerçek arayüz örneği: 780.777 AP, altı dönüş, **25 ücretli yükseltme**, seviyeler 13/13/13/12/12/12, 13.784 AP kaldı, sıfır tekrar kamp. Bilinçli tek oyuncuya yoğunlaşma seçeneği önceki politika gibi korunur.
- 875 kamp/rol/aşama durumu, 113.750 fiyat teklifi; 96 kamp dönüşü; sabit fiyat/indirim ve terfi sınırı testleri; 4.400 teklif/50 alım tutarlılığı; gerçek alım/yeniden yükleme ve tam üç transfer indirim hakkı geçti. `test-mental-save-migration.cjs` ayrıca gerçek tarayıcıda 12 kişilik eski mental kayıtlı kadroyu açtı: kimlik/seviye/kamp korundu, eski yedek oluştu ve yeniden yükleme aynı sonuçla kaldı.
- 1. Lig akademisi kural testi: genç katalog, kararlar, çevrimdışı mezuniyet, siyah/gümüş/altın sonuç, dolu kadro ve tek mezuniyet çalışıyor. 1. Lig hâlâ taslaktır; uygulanmamış aşamalar için ekonomi dengesi sonucu çıkarılmaz.

## Görseller ve tekrar çalıştırma

İncelenen görseller `audits/career-polish-season-result.png`, `career-polish-promotion-guide.png`, `career-polish-comparison.png`, `career-polish-legendary-comparison.png`, `career-polish-social.png`, `career-polish-tube-reveal.png` ve güncel `club-introduction-{light,dark,small}.png`. Sonuç penceresinde yalnız Devam ana eylem; karşılaştırmada materyal küçük ayrı etiket; karakter ortak tutorial paletinde aşağıda durur. Üretim tasarım notları `DESIGN-SYSTEM.md` içinde güncellendi.

```
node test-career-polish-rules.cjs
node test-mental-save-migration.cjs
node test-career-polish-browser.cjs
node test-club-introduction.cjs
node test-inplay-legendary-frequency.cjs
node audit-career-polish-market.cjs
node audit-camp-economy-pacing.cjs
node audit-first-camp-return.cjs
node audit-first-camp-return-browser.cjs
node audit-camp-cap-matrix.cjs
node test-transfer-progression-consistency.cjs
node test-transfer-reload.cjs
node test-first-league-academy.cjs
```

Tarayıcı testleri izole profillerde çalışır; kullanıcının kaydı okunup harcanmaz. Gerçek telefon çentiği/OS davranışı ayrıca cihaz üstünde gözlenmelidir; masaüstü testleri fiziksel cihaz doğrulaması değildir.
