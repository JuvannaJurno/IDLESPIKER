# Tempo, kamp ve transfer dengelemesi — 28 Ekim 2026

Bu rapor `fe629e6` sürümünü yeni ayarla karşılaştırır. İlk üç aşama test edildi; 1. Lig taslağı ve uygulanmamış 5–8. aşamalar için tamamlanmış denge iddiası yoktur. Önceki [kamp raporundaki](CAMP-ECONOMY-BALANCE.md) 120.000 AP tabanı bu revizyonla değişmiştir.

## Oyuncunun hissettiği sorun

Önceki denetim geliştirme, blok satın alma ve kamp işlemlerini tek bir “eylem” sayısında topluyordu. Bu yüzden oyuncu kartını geliştiremediği bir bekleyiş, blok satın alabildiği için kısa görünüyordu. Yeni ölçümde **oyuncu yükseltmeleri arasındaki süre**, ziyaret başına yükseltme, kamp dönüşünde harcanabilen AP, gerçek kadro gücü ve maç sonuçları ayrı tutuldu.

Bölgesel başlangıcında kartlar 10 sınırına erken geliyor; ilk kampın 1.000 bütçesi ve ardından 120.000 AP eğitim tabanı iki ayrı bekleme oluşturuyordu. Aktif beş başlangıçta da kart yükseltmeden geçen en uzun süre 330 saniyeydi. Transferlerde ise hedef OVR, kamp sayısı ve seviye farklı formüllerden geliyordu. Aynı OVR'ye sahip transferin şişirilmiş başlangıç özellikleri daha düşük seviyeye sığabiliyor, sonraki eğitimi kendi yetiştirdiğin oyuncuya göre aşırı avantajlı olabiliyordu.

## Psikolojik çerçeve ve kaynaklar

- [Przybylski, Rigby ve Ryan — A Motivational Model of Video Game Engagement](https://doi.org/10.1037/a0019440): oyun ilgisini yalnız ödül sayısıyla açıklamak yerine yeterlik, özerklik ve ilişki ihtiyaçlarıyla ele alır. Buradaki tasarım çıkarımı: oyuncu yaptığı yatırımın işe yaradığını görmeli ve kaynakları farklı oyunculara ayırma kararı anlam taşımalı.
- [Cutting, Gundry ve Cairns — Busy doing nothing? What do players do in idle games?](https://ray.yorksj.ac.uk/id/eprint/7953/): Neko Atsume oyuncularıyla yapılan 1.972 katılımcılı araştırma idle katılımın kontrol etme ve oyun dışındaki etkileşimleri de içerdiğini gösterir. “Her X saniyede ödül gerekir” sonucu vermez.
- [Player Engagement with Idle Games: A Mixed-Methods Exploration with Design Implications](https://escholarship.org/uc/item/0b07v51w): geri dönüşte yapılacak az şey bulmanın ve gelişimin görünürlüğünün önemini tartışır. Bulgular bu oyunun tutunma oranını doğrudan tahmin etmez.

Bu kaynaklardan **evrensel bir ödül aralığı çıkarmadım**. 120 saniye burada bilimsel optimum değil; oyunun mevcut takvimi ve gelirleri içinde sınanan bir bekleme ölçüsüdür. Amaç bildirim sıklığını artırmak değil: dönüşte birkaç anlamlı yatırım, görünen seviye/yıldız gelişimi ve “tek oyuncuya yoğunlaş / takımı dengeli geliştir” seçimini korumak. İnsan oyuncularla uzun süreli oynanış ve geri dönüş verisi olmadan sıkıcılık veya tutunmanın çözüldüğü söylenemez.

## Üretimde değişen hesaplar

### Eğitim ve ilk kamp

`TeamRules.trainingEconomy`:

```
Seviye 10 altı: mevcut açılış fiyatı korunur.
Seviye >= 10: taban AP = 45.000 × (seviye / 10)^1,8
İleri OVR eğrisinin seviye 48 sonrası çarpanı:
  (1 + max(0, seviye - 48) / 16)^1,45
  (önce: /10 ve ^1,65)
Temel fiyat = max(OVR eğrisi, seviye tabanı)
Son teklif = gerçek kazanılan puan, bina indirimi ve transfer uyumu uygulanmış fiyat
```

| Mevcut seviye | Önceki altı puanlık taban | Yeni altı puanlık taban |
|---|---:|---:|
| 10 | 120.000 | 45.000 |
| 15 | 203.282 | 93.364 |
| 20 | 295.475 | 156.700 |
| 30 | 500.540 | 325.111 |
| 50 | 972.394 | 815.378 |
| 70 | 1.505.944 | 1.494.133 |

Tablo indirimsiz alt sınırdır; doğrudan her kartın düğme bedeli değildir. Kazanılmayan özellik için ödeme alınmaz. Aynı oyuncunun aynı durumdaki fiyatı bankadaki AP'ye veya giriş sıklığına göre değişmez. Erken maliyet yumuşarken ileri seviye bedeli büyümeye devam eder.

İlk kamp **200 bütçe** oldu; sonraki kampların bütçesi 2.000, 3.000… şeklindeki mevcut çarpanla sürer. İlk kampın AP'si 6.000; üç oyun günlük süre ve hazırlık koşulları korunur. Başlangıç yardımı her oyuncunun ilk kampına aittir; yalnız ilk açılan pencereye bağlı değildir.

Talimatların hızı, blokların üretim katsayıları, vardiya/mesai, rakip güçleri ve Legendary olasılıkları değiştirilmedi. Kamptan gelen oyuncu hâlâ eski seviyesinde döner; kamp yeni sınırı açar. Normal taban 10, biten kamp başına +10 seviye sınırı ve +30 özellik sınırı; hazırlık 8 + 10 × kamp sayısıdır. Her kamp yarım yıldız; 6/12/18 kamp renk geçişi aynıdır.

### Transferlerin aynı gelişim sistemine bağlanması

Yeni adayın doğal başlangıç özellikleri ve rolü alınır; hedef OVR'ye gerçek `cardGains` artışlarıyla ulaşacağı seviye bulunur. O seviyeyi taşıyacak kamp geçmişi birlikte hesaplanır. Son özellikler gerçek kazanımlarla yeniden oluşturulur. Hedef gücü düşük seviyeye sığdırmak için başlangıç özelliklerini şişirme kaldırılır.

- Aynı OVR farklı rollerde aynı seviye demek değildir; rol ağırlıkları farklıdır. Kontrol edilen eşitlik: başlangıç özellikleri + o seviyeye kadar kazanılan puanlar = gösterilen özellikler.
- Kamp toplamı hem yıldız/rengi hem sınırı taşır. “Seviye 58, yarım yıldız, sınır 58” gibi eski alınmış kartlarda güç ve seviye korunarak geçmiş düzeltilir; bu örnek 5 kamp, sınır 60 olur. Onluk sınıra yuvarlandığı için küçük sınır artışı mümkündür.
- Alınmış eski kartların özellikleri/OVR'si düşürülmez. Eski aşırı yüksek doğal özellikler geriye dönük budanmaz; bu kartlar yeni adaylarla tamamen aynı gelişim şekline zorlanmaz.
- Bekleyen eski teklifler bir kez düzeltilir; OVR, kimlik ve fiyat korunur. Sonraki açılışta yeniden rastgele aday oluşturulmaz. Tutulan teklif ve satın alma sonrası kayıt kararlıdır.
- Fırsat şansı, fiyat katsayıları ve ilk transferin avantajı değiştirilmedi. Potansiyelli kartın gizleme/akademi davranışı korunur.

## Tekrarlanan sonuçlar

### 40 önce/sonra rota, 120 sezon

`node audit-tempo-and-transfers.cjs` sıfır kadro/ekonomiyle beş seed, dört karar düzeni, iki sürüm çalıştırır. Aktif kontrol 30 saniyede bir; dönüş profili beş dakikada bir. Transfer kullanan profil her ziyarette en az +3 OVR sağlayan ve bütçenin %35'inden ucuz bir aday alabilir; gizli potansiyeller alınmaz. Kadro sınırı 30'dur.

Seed 41, Bölgesel örneği:

| Rota | Ücretli oyuncu yükseltmesi önce → sonra | En uzun yükseltmesiz aralık | Sezon sonu OVR |
|---|---|---|---|
| Aktif, transfersiz | 128 → 169 | 330 → 120 sn | 57,8 → 67,8 |
| Aktif, transferli | 136 → 148 | 210 → 60 sn | 79,5 → 79,3 |
| 5 dk dönüş, transferli | 85 → 96 | 900 → 601 sn | 60,8 → 59,7 |
| 5 dk dönüş, transfersiz | 73 → 110 | 900 → 900 sn | 44,5 → 53,0 |

Aktif transfersiz sonuç beş seedde de 330 → 120 saniye. Transferli son OVR'nin her yerde yükselmesi hedeflenmedi: önceki fiziksel gelişimden kopuk transfer avantajı giderildi. Örneğin transferli aktif 2. Lig sonunda 172,2 → 161,5 OVR, toplam ücretli yükseltme 389 → 357; kamplar 7 → 9 oldu. Bu yüzden “tüm profiller daha çok tıklıyor” denemez.

Seyrek dönüşte tüm hazır oyuncuları aynı anda kampa yollamak hâlâ boşluk oluşturuyor. Transfersiz beş dakikalık rotada Bölgesel maksimumu 15 dakika olarak kaldı; 2. Lig'de 5 → 10 dakikalık maksimum görüldü. Bunlar özellikle raporlandı: aktif temponun iyileşmesi her idle karar düzeninde beklemenin azaldığı anlamına gelmez. Dönüşte başka yatırımlar mevcut; sırf bu ölçüyü güzelleştirmek için bedava yıldız veya AP eklenmedi.

### 72 gerçek saha maçı

`node audit-tempo-native-court.cjs`, ekonomik rotalardan kazanılmış kadroları gerçek `mac.html` motoruna, oyunun kadro mesajı/kurulumu üzerinden verir. Altılı + libero, yer değiştirme, yorgunluk ve yetenekler dahil; ilk Bölgesel rakibin açılış Legendary'si de eklenir. İki sabit maç seed'i, aktif/seyrek dönüş ve önce/sonra. Her maç yeni sayfada başlar; boş skor veya eski sonuç ekranı başarı sayılmaz.

| Rota | Bölgesel, seçilen 6 maç önce → sonra | 2. Lig, seçilen 6 maç önce → sonra |
|---|---|---|
| Aktif, transferli | 5 → 6 galibiyet | 6 → 6 |
| 5 dk dönüş, transferli | 3 → 3 | 3 → 3 |

Mahalle her iki rotada da 5/6 kaldı. Bu örneklerde zorluk gerilemesi yok. Ancak seçilen 1/7/14. maçlar ve iki seed tüm sezon kazanma oranı değildir. Simülasyon hızlandırılmıştır; render performansı veya insan oyunu testi olarak sunulmaz. Rakiplerin bazı görsel kimlik/portre ayrıntıları testte yoktur.

Ekonomik rotaların maç hesabı üretimdeki rotasyon kurallarını ve libero düzenini kullanır; yine de **terfi varsayılır**, tam sıralama kapısı çalıştırılmaz. İlk üç lig kesin şu sürede bitirilir veya herkes terfi eder iddiası yoktur.

### Kamp dönüşü: 20 başlangıç + gerçek düğmeler

Aktif/beş dakikalık dönüş, kamp sırasında harcama/biriktirme ve beş seed: 20/20 dengeli dağıtımda tüm dönenleri fulleme ve tekrar topluca kampa gönderme engellendi. Aktif örnekte ilk dönüş gün 4, 278.079 AP; tek oyuncu beş tıklamayla 9 → 14. Beş dakikalık örnekte altı oyuncu gün 10'da döndü: 754.856 AP, seviyeler 9/9/8/8/8/8.

Gerçek Edge arayüzünde **24 ücretli tıklama**, sonuç 13/13/12/12/12/12, kalan 48.836 AP; yeniden gönderilen oyuncu sıfır. Görsel: [ilk dönüş](audits/first-camp-return-balanced.png).

Yeni kabul koşulu özellikle farklı: birikimin tamamını **tek kişiye** ayıran bazı seyrek dönüşlerde seviye 18 hazırlığına ulaşmak mümkün (20 rotanın 10'unda). Bu bir tercih; tüm takımı doldurmak değil. Hiçbirinde tek döneni bile 20'ye fullemek için birikmiş AP yeterli değil. Uzun süre bilinçli biriktiren eski kayıtlar daha ileri gidebilir; birikimi silen veya sonuca göre fiyat artıran sistem yok.

### Ek kontroller

- 36 yeni başlangıç rotası / 108 sezon: aktif, seyrek dönüş, çevrimdışı; şanslı bedava yükseltme, odak yatırımı ve sosyal medya kullanmama varyantları. Ücretli dengeli rotada Bölgesel ortanca kamp 3/2/2; 2. Lig 8/9/9. Eski 6–8 kamp yumuşak hedefinin seyrek dönüşte bir adım üstüne çıkılabiliyor; kapı veya garanti değil.
- 875 rol/kamp/aşama durumu ve 113.750 seviye teklifi: sabit durum sabit fiyat, artan seviye bedeli, kamp/sınırda ödeme alınmaması. 5–8. aşamalarda bu yalnız matematiksel sınır testi, gelir dengesi değil.
- 4.400 teklif, 50 alım, on aşama/güç kombinasyonu: özelliklerin gerçek kazanımlardan yeniden üretimi, seviye/yıldız/sınır, kayıt kararlılığı; eski 58. seviye kartın gücü kaybolmadan onarımı. Bekleyen eski teklif ve tutulan aday testi de dahil.
- Gerçek tarayıcıda alım/kadro seçimi, aynı oyuncunun yeniden yüklenmesi, ilk üç uyum indiriminin tam üç yükseltmede bitmesi, sekiz kartlık kataloğun kapatılıp yeniden açılması ve yetenek tutorialı geçti.
- 500 ilk katalog ve 1.000 tekrar katalog güç testleri geçti. Katalog üretiminin yerel Node ölçümünde 100 örneklik medyanı güç 35/140/230 için yaklaşık 1,6/14,5/10,1 ms; mobil cihaz performans garantisi değildir.

Eski test beklentileri anlamlarına göre düzeltildi: kadro seçimi artık satın almadan önce gelir; eski teklifin seviyesini 38'e kırpma beklenmez; elit render örneği yalnız elit açılan 6. aşamada hazırlanır. Eski `test-scout-catalog-balance.cjs` hâlâ mevcut %55 fırsat yerine %25 varsayıyor; bu revizyonun geçtiği testlere dahil değildir. `test-transfer-opportunities.cjs` eski açılış/kayıt kurulumu ile boot zaman aşımına uğradı; dil kurulumu düzeltilerek denendiğinde eski tahta bağlantısı seçicisinde durdu. Bu eski bütünleşik test başarılı kabul edilmedi ve bu görevde değiştirilmedi. Geçen tarayıcı senaryoları bunun yerine yukarıdaki ayrı satın alma, katalog ve yeniden yükleme yollarını doğrular.

## Yeniden çalıştırma ve kalan belirsizlik

```
node audit-tempo-and-transfers.cjs
node audit-tempo-native-court.cjs
node audit-first-camp-return.cjs
node audit-first-camp-return-browser.cjs
node audit-camp-economy-pacing.cjs
node audit-camp-cap-matrix.cjs
node test-transfer-progression-consistency.cjs
node test-transfer-reload.cjs
node test-transfer-lineup.cjs
node test-transfer-unopened-catalog.cjs
```

Ham veriler `audits/tempo-market-routes.json`, `tempo-native-samples.json`, `tempo-native-court-results.json`, `transfer-progression-consistency.json` ve mevcut kamp denetim dosyalarındadır. Kullanıcı kayıtları okunmadı/değiştirilmedi; tarayıcılar izole profiller kullandı.

Sıradaki karar için gerçek oyuncunun ilk kamp öncesi ayrıldığı an, dönüşte harcadığı AP, oynadığı maçların sonucu ve yeniden gelişim yapabildiği süre izlenmeli. Kaybetmek tek başına kusur değildir; **neden kaybettiğini anlayıp makul bir gelişimle cevap verememek** öncelikli sorundur. Bu revizyon fiyat/transfer tutarlılığı ve erken aktif beklemeyi çözer; tüm ilerleyişin eğlenceli olduğunu laboratuvar testiyle kanıtlamaz.
