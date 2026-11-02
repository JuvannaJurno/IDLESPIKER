# 1. Lig — oynanabilir geliştirme taslağı

2 Kasım 2026. Kapsam yalnız **aşama 4 / Ulusal Voleybol 1. Ligi**. Bu dosya 25 Ekim akademi planındaki üç seviyeli kapasite ve iki saatlik yeni eğitim tarifini bu aşama için günceller. Kesin ekonomi veya çıkış onayı değildir.

## Deneme ve ulaşım

- Ayarlar → Hileler → aşama seçimi ile 1. Lig'e geçilir. Bu mevcut test geçişi kaynak ve tamamlanmış önceki yatırımlar verdiğinden doğal başlangıç ekonomisini temsil etmez.
- Normal oyuncunun 2. Lig sonundaki **beta bitişi korunur**. Önceki aşamalardan otomatik olarak yeni taslağa gönderilmez.
- Akademinin tek girişi **Takım → Oyuncu Merkezi → Akademi** olarak kalır. Yeni alt navigasyon veya ikinci akademi kısayolu yok.
- Kulüpte, bütçe/AP kartlarının hemen üstündeki **Sezon planı** yalnız çalışma projelerini açar. Akademi salonunun yerini almaz.

## Oynanış döngüsü

Transferden potansiyelli genci keşfet → akademiye yerleştir → gerçek antrenman sahnesinde gelişimini izle → yön/yetenek sorusunu cevapla → mezuniyeti incele → gerçek kadro kartını al. Mevcut as/yedek slotları ve alternatif oyuncular korunur.

Beklerken üç yatırım birbirinden farklı fayda sağlar: kontenjan, süre, mezunun ana özelliği. Talimatlarla ilerleyen tek bir çalışma da AP, bütçe veya eğitim desteği arasında seçim sunar. Yeni para birimi ve sürekli tıklanması gereken bakım sistemi eklenmedi. Çalışmalar isteğe bağlıdır; sıradaki çalışma kendiliğinden başlamaz.

## Gelişim Kampüsü kartları

Departman 1'in yeni katında yalnız şu üç kart vardır. Eski profesyonel üretim kartları silinmez; Önceki aşama çekmecesinde kalır, etkileri sürer.

| Kart | Beş seviyenin katkısı | Sırayla bütçe bedelleri |
|---|---|---|
| Altyapı Akademisi | 2 / 3 / 4 / 5 / 6 eğitim yeri | 6.000 / 12.000 / 24.000 / 48.000 / 96.000 |
| Antrenman Düzeni | Yeni eğitim %5 / 10 / 15 / 20 / 25 kısa | 8.000 / 18.000 / 36.000 / 70.000 / 120.000 |
| Yetiştirici Antrenör | Yeni gencin seçtiği ana özelliğe mezuniyette +2 / 4 / 6 / 8 / 10 ek gelişim | 10.000 / 22.000 / 45.000 / 85.000 / 150.000 |

Her kart beş seviyeli ve **tek katkılıdır**. Toplam tüm yatırım bedeli 750.000 bütçedir. Önceki denemedeki on kat yüksek bedeller, temel üretimle aşırı uzun bekleme yarattığından düşürüldü. Birikmiş gerçek kaynaklarla hızlı kurulum engellenmez; oyuncu kazandığı bütçe için cezalandırılmaz.

Satın alma anında çalışan gençlerin bitiş saati veya kazancı değiştirilmez. Yeni süre ve antrenör desteği, yeni genç kabul edilirken kayda sabitlenir. Eski kayıttaki üç akademi seviyesi dört kontenjan olarak kalır; yatırımlar sıfırlanmaz.

## Akademi matematiği

- İlk kabul edilen genç: 20 dakika; sonraki kabul: 45 dakika. Azami süre yatırımıyla 15 dakika / 33 dakika 45 saniye.
- İlk genç indirimi akademinin kayıtlı kabul sayısına bağlıdır; mezunu almak veya sayfayı yenilemek indirimi tekrar vermez.
- Mevcut karar eşikleri korunur: %25 yön, %60 normal yetenek, %82 Legendary çalışması, %100 mezuniyet.
- Süre gerçek saatten hesaplanır; çevrimdışı ilerler. Yeni yatırımlar eski gençleri geriye dönük hızlandırmaz.
- Mevcut garanti gelişim: ana özellik +12, ikinci özellik +5, diğerleri +2. Yeni antrenör yalnız ana özelliğe +2…10 ekler. Altın sonucun mevcut ana yön +6 katkısı ayrıca korunur.
- Sonuç siyah / gümüş / altın olabilir; doğrudan mor elit veya signature verilmez. Potansiyel, altın ihtimalini belirler; garanti değildir.
- Mezun dosyasında gerçek **önce → sonra OVR** ve ana özellik kazanımı kartın üstünde gösterilir. Ayrı sahte stat veya dekoratif seviye yok.
- Kadro doluysa mezun kaybolmaz; akademide bekler. Aynı genç ikinci kez mezun edilemez.

## Sezon planı

Bir aktif çalışma veya alınmayı bekleyen bir ödül bulunabilir:

| Seçim | Ödül |
|---|---|
| Kadro çalışması | AP |
| Tesis desteği | Bütçe |
| Özel antrenman | Seçilen gencin tam eğitim süresinin %10'u kadar ilerleme |

Özel antrenman seçimi, destek alabilecek genç yokken pasiftir. Başladıktan sonra genç mezun olmuşsa veya destek sınırına ulaşmışsa ödül AP'ye çevrilebilir. Genç başına toplam destek **%30** ile sınırlıdır; kalan süre daha azsa yalnız o kadar ilerletilir. Hem başlangıç hem bitiş saati aynı miktarda kaydırılır; eğitim uzunluğu ve karar evreleri bozulmaz.

### Hesap

`hız = autoRate × (1 + doubleChance)`, hesapta 1…2.000 aralığı.

İlk çalışma yaklaşık 90 saniyelik, sonrası yaklaşık 240 saniyelik üretim ister. Talimat hedefi ilkinde en az 1.000, sonrakinde en az 3.000; en fazla 400.000. Yuvarlama 100 talimattır. Bunlar duvar saati sayacı değildir: üretim durmuşsa ilerleme durur; elle verilen talimat hızlandırır. Gerçek çevrimdışı talimatlar sayılır.

Başlangıç ödülü temel üretimin %6'sıdır:

- `AP = hedef × otomatik AP × 0,06 × ritim katsayısı`
- `bütçe = hedef × on talimattaki bütçe / 10 × 0,06 × ritim katsayısı`
- Ödül sınırı 1.000…1.000.000.000. Düşük sentetik üretimde alt sınır oranı büyütebilir; gerçek 1. Lig örneklerinde temel oran korunmuştur.

Sezon ritmi I…V: **0 / 1 / 3 / 6 / 10 tamamlanan çalışma**. Her seviye yeni çalışmaların temel ödülüne %5 ekler; son durumda normal üretime oranı %7,2'dir. Devam eden çalışmanın hedefi/ödülü yatırım sonrasında yeniden hesaplanmaz.

Üretim zaten AP iadesi, kritik ve başka bonuslar da verdiğinden bu oran tüm gerçek kazancın %6'sı iddiası değildir. Çalışma üretime küçük ek katkıdır; ana ekonomi yerine geçmez.

### Kayıt ve sınırlar

`room.firstLeagueDraft`: sıra numarası, tamamlanma sayısı, tek proje, son sekiz çalışmanın geçmişi. Ayrı kayıt anahtarı yok. Başlatma/ödül işlemi mevcut atomik oda kaydını kullanır. Kayıt yazılamazsa ödül/proje geri alınır ve tekrar denenebilir. Lig geçişinde yeni başlatma veya ödül işlemi kabul edilmez.

Aynı 1. Lig sezonu yeniden kurulursa yalnız kazanılmış proje ilerlemesi taşınır; eski toplam talimat yeni projeye bedava yazılmaz. Önceki aşamalarda alan eklenmez, proje API'si çalışmaz.

## Rakip ve sezon denemeleri

1. Lig, 2. Lig'in çok yüksek iki rakip farkını aynen kullanıyordu. Yalnız aşama 4 için ayrı eğri eklendi. Giriş kadro gücü sezon başında sabit kalır; her yükseltmede rakip güçlenmez. Takım farkları: `-12, +12, -6, -2, +6, -8, +20`; sezon artışı +8. Gerçek OVR, rol şekillendirmesi ve özel oyuncular nedeniyle bu sayıların doğrudan kendisi değildir. Güçlü rakiplerin Legendary bütçesi de aynı 1. Lig sıralamasını kullanır.

24 sabit tohum × dört gelişim rotası × eski/yeni ayar = **192 hesap sezonu / 10.752 maç**. Aynı kontrol kadrosu, fikstür ve maç tohumları kullanıldı.

| Sezon içi OVR artışı | Eski ortalama galibiyet | Yeni ortalama galibiyet | Yeni ilk 3 | Yeni şampiyonluk |
|---|---:|---:|---:|---:|
| +0 | 2,33 | 3,83 | 0/24 | 0/24 |
| +18 | 4,13 | 6,46 | 0/24 | 0/24 |
| +36 | 6,08 | 9,50 | 16/24 | 0/24 |
| +54 | 7,50 | 11,00 | 22/24 | 5/24 |

Bu **kontrollü stat rotasıdır**, doğal ekonomiden +54 OVR kazanılacağı veya bu şampiyonluk oranının oyunculara aynen uygulanacağı anlamına gelmez. Hesap modeli Legendary/CD/çizim içermez. Ayrıca gerçek maç motorunda 1/7/14. turlardan iki gelişim rotası ve iki tohumla **12 maç** oynatıldı; hepsi tamamlandı, sayfa hatası/takılan ralli yok. Mevcut Legendary motoru/animasyonları değiştirilmedi.

## Akıcılık ve tasarım

- Ortak krem, adaçayı, teal ve sıcak altın. Standart GameUI.selection modalı, sabit kapatma/alt eylem, tek iç kaydırma.
- 280 / 320 / 390 / 1280 genişlikleri, 320×480 kısa ekran ve koyu tema kontrol edildi. Mobil düzen masaüstünde genişletilmez.
- Gerçek portreler, native salon, koçlar ve mevcut driller korunur. Altı gençle gerçek sahne doğrulandı; yeni uydurma oyuncu animasyonu yok.
- Proje/akademi ekranı açık değilse ve aktif proje yoksa yeni çalışma zamanlayıcısı çalışmaz. Önceki aşamalarda giriş/zamanlayıcı oluşmaz. Sabit panel her saniye yeniden oluşturulmaz; yalnız sayı/ilerleme güncellenir.
- Akademi saniye döngüsünde tek oda kopyası kullanılır; önceki aşamalarda gereksiz akademi saniye kopyası yok.
- Altı genç salonu açıkken 180 ana pencere karesi: son ölçüm ortanca 16,7 ms, %95 yaklaşık 16,8 ms, 50 ms üstü sıçrama 0. **Başsız Edge / bu geliştirme bilgisayarı**; telefon FPS garantisi ve native çizim süresi ölçümü değildir.

## Doğrulama ve kanıtlar

- `test-first-league-draft-rules.cjs`: 3×5 kart bedeli, 36 ödül ekonomisi çevrimi, 75 rol/sonuç/yatırım mezuniyet örneği, çevrimdışı üretim, %30 destek, bozuk kimlik/saat, tekrar ödül engeli.
- `test-first-league-prior-stage-isolation.cjs`: önceki üç aşamanın 9 tam ekonomi/kayıt örneği ve **441 rakip stat örneği** değişiklik öncesiyle birebir aynı.
- `test-first-league-academy.cjs`: mevcut geçiş/kadro/mezuniyet/yetenek regresyonu.
- `test-first-league-workshop-browser.cjs`: gerçek geçiş; başlangıç/ödül yazma hatasında geri alma; yeni kartlar/çekmece; destek; altı genç; mezuniyet kazanımı; yenilemede devam; aşama çıkışında temizlik; görsel ölçüler; kare örneği.
- `test-rival-styles.cjs`: rol stili, özel oyuncu, eski lig ayrımı.
- `audit-first-league-season-draft.cjs`, `audit-first-league-native-draft.cjs`: yukarıdaki sezon/native maç verileri.
- Görseller ve ham sonuçlar `audits/first-league-*` altında. Ekran testinin yapay tamamlanmış eski başarımları başlangıçta görülmüş kabul edilir; birikmiş test bildirimleri yeni ekranın başlığını örtmez.

## Kalan işler / sonraki çalışma

1. **Önemli:** sıfırdan doğal bir kayıtla, gerçek transfer/kamp/yükseltme kararlarını içeren tam 1. Lig ekonomi turu henüz yapılmadı. Kontrollü stat sezonları bunu ikame etmez. Sonraki denge adımı budur.
2. Düşük/orta sınıf Android ve iOS'ta altı genç salonu, modal açıkken kaydırma ve en yoğun tüp durumunda 10–15 dakikalık ölçüm gerekir.
3. Üç kartın toplam bedeli ve sonraki 45 dakikalık eğitim gerçek oyuncu geri bildirimiyle tekrar ayarlanmalı. Mevcut tablo taslaktır.
4. Yeni transfer gencinin as/yedek kadroya gerçekten ne sıklıkla girdiği ve mezuniyet başına beklenen OVR kazancı doğal rotada ölçülmeli. Henüz “her mezun kadroya girer” garantisi yok.
5. Sezon ritmi için yeni başarımlar, özel mezuniyet sahnesi, signature, otomatik yedek değişimi, mola ve 5. aşama eklenmedi. Bunlar mevcut taslak için zorunlu değil.

Devam ederken önce bu dosya ve DESIGN-SYSTEM.md okunmalı. 1–3. aşamaların dengesini bu taslağı iyileştirmek için değiştirmeyin. Önceki aşama testleri değişirse 1. Lig koruması eksik demektir.
