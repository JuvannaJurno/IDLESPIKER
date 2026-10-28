# Kamp ekonomisi ve yıldız temposu — 28 Ekim 2026

**Güncel revizyon:** Aşağıdaki ilk dengeleme tarihsel kayıttır. Oyuncu geri bildirimi sonrası 45.000 × (seviye / 10)^1,8 tabanı, ilk kamp 200 bütçe ve düzeltilmiş transfer geçmişi uygulanmıştır. Güncel gerekçe, önce/sonra ve test sınırları [TEMPO-AND-TRANSFER-AUDIT.md](TEMPO-AND-TRANSFER-AUDIT.md) içindedir. Aşağıdaki 120.000 tabanı, 1.000 ilk kamp ve 14 tıklamalı örnek artık üretim ayarı değildir.

Bu revizyon ilk üç aşamayı hedefler. İlk kamp dönüşünde yeni gelir olmadan kadroyu doldurup yeniden gönderebilme sorunu, sıfır kayıt testlerinde giderildi. Talimat üretimi ve lig takvimi yavaşlatılmadı. Taslak 1. Lig ve uygulanmamış son dört aşama için tamamlanmış denge iddiası değildir.

## Sorun ve seçilen çözüm

Önceki gerçek arayüz testinde beş oyuncu 9, 9, 8, 8, 8 seviyelerinde döndü. Elde 757.448,91 AP vardı; beşini 20 yapmak toplam 320.358 AP tuttu. Yeni gelir olmadan dört kişi tekrar gönderilebildi. Hazırlığı 18 yapmak ucuz eğitimi tek başına çözmedi.

Eski fiyat OVR'ye çok bağlıydı: düşük OVR'li oyuncunun yeni açılan seviyeleri büyüyen blok gelirlerinin yanında ucuz kalıyordu. Sabit ×10/30/60 çarpanlar ilerideki oyuncuları da gereksiz pahalılaştırdı. Bunlar uygulanmadı; tarihsel sonuçları `audits/camp-pace-variants.json` içinde.

Yeni politika `TeamRules.trainingEconomy` içinde sabittir:

```
Seviye < 10: mevcut başlangıç bedeli
Seviye >= 10: seviye tabanı = 120.000 × (seviye / 10)^1,3
BAL temel bedel = max(eski OVR bedeli, seviye tabanı)
Fiyat = yukarı yuvarla(temel bedel × indirim sonrası kazanılan puan / 6 × transfer uyumu)
```

Gerçek kazanım altı puandan azsa alınmayan özellik için ücret yoktur. Bina indirimleri ve ilk üç transfer yükseltmesinin uyumu tabana da uygulanır. Fiyat bankadaki AP'ye, kontrol sıklığına veya rakibe göre değişmez. Aynı oyuncu aynı özellikler/indirimlerle lig değiştirdiğinde fiyat değişmez; özellik sınırına dayanan kısmi kazanım farklıdır. İlk dokuz seviyenin ve Mahalle'nin bedeli korunur. İleri OVR'nin eski bedeli tabandan yüksekse o korunur.

| Mevcut seviye → sonraki | Altı puanlık taban, indirimsiz | Tam %35 indirimle yaklaşık |
|---|---:|---:|
| 10 → 11 | 120.000 AP | 78.000 AP |
| 15 → 16 | 203.282 AP | 132.134 AP |
| 20 → 21 | 295.475 AP | 192.059 AP |
| 30 → 31 | 500.540 AP | 325.351 AP |
| 50 → 51 | 972.394 AP | 632.056 AP |
| 70 → 71 | 1.505.944 AP | 978.863 AP |

Bu sabit menü fiyatı değildir: OVR, kazanılan puanların özellikleri, indirim ve transfer uyumu son teklifi etkiler.

## Seviye, yıldız ve kamp

- Normal seviye tabanı 10; biten her kamp +10 sınır. Lig atlamak tabanı büyütmez; eski kazanılmış tabanlar korunur.
- Hazırlık normal oyuncuda `8 + 10 × toplam kamp`: 8, 18, 28, 38… İlk kamp dışında özellik sınırına yakınlık bu eşiği atlatmaz.
- Her kamp +30 özellik sınırı ve yarım yıldız. 6/12/18 toplam kampta siyah → gümüş → altın → mor; yerel yıldızlar sıfırlanır, seviye/özellikler korunur.
- Kamp üç oyun günü; 2. Lig'in ilgili bloğuyla en çok iki güne iner. Aynı anda altı oyuncu.
- Kamp AP'si korunur: `100'e yukarı yuvarla(6.000 × (kamp sayısı + 1) × (1 + max(0, seviye − 10) / 8)^2)`.
- BAL bütçesi `1.000 × (kamp sayısı + 1)`; mevcut kamp indirimi/topluluk kuponu geçerli.
- İlk kamp seviye 8–10'da 6.000 AP + 1.000 bütçe. İkinci kamp seviye 18'de 48.000 AP + 2.000 bütçe; 20'de 60.800 AP + 2.000 bütçe. Hazır olunca göndermek veya iki seviye daha geliştirmek farklı maliyetlidir.

Blok gelirleri, otomasyon, talimat hızı/dalgaları, vardiya/mesai ve günlük bütçe katsayıları değiştirilmedi. Yeni bekleme kilidi, AP silme veya oyuncunun birikimine göre fiyatlandırma eklenmedi.

## İlk dönüş: 20 ekonomik başlangıç ve gerçek arayüz

Aktif/beş dakikalık kontrol × kamp sırasında biriktirme/açık oyuncuları geliştirme × beş seed. Başlangıç 0 AP / 20 bütçe; kamp ve bloklar kazanılan kaynaklardan ödendi. Dönüş anında yeni gelir ve rastgele bedava yükseltme yok.

- 20/20 durumda bütün dönenleri hemen doldurmak mümkün olmadı.
- 20/20 durumda dönüş AP'sinin tümünü tek bir dönen oyuncuya ayırmak bile hazırlığa yetmedi.
- 20/20 durumda hemen tekrar gönderilen oyuncu sayısı sıfır.
- Aktif örnekte tek erken dönen oyuncu 10'dan 16'ya çıktı; 18 için tekrar üretim gerekti.
- Beş kişilik örnekte aynı 757.448,91 AP ile 14 gerçek düğme tıklaması yapıldı. Seviyeler **12, 11, 11, 11, 11**; kalan AP **37.571,91**. Bütçe 8.340 kaldı; beş kamp adayı da hazırlık nedeniyle kapalıydı.

İzole Edge profilinde gerçek Hızlı Yükselt/kamp düğmeleriyle doğrulandı. Kullanıcının kaydı değiştirilmedi. Simülasyonun seviyeleri/tıklama sayısı arayüzle aynı; tarayıcı hatası yok. Görsel `audits/first-camp-return-balanced.png`.

Uzun süre bilinçli AP biriktiren eski kayıt yine hızlanabilir; birikim korunur. Bedava yükseltme şansı da avantajdır. İlk dönüşün kesin fiyat karşılaştırması ücretli duruma aittir; şans açık ilerleyiş ayrıca uzun sezon testindedir.

## 36 rota / 108 sezon

Beş seed ile aktif, beş dakikalık kontrol, çevrimdışı profil; bedava yükseltme kapalı/açık. Ek olarak tek oyuncuya yoğunlaşma, sosyal medya kullanmama ve üretim rotasyonlu maç hesabı rotaları. Ham sonuç `audits/camp-economy-pacing.json`.

| Profil | Mahalle sonu kamp | Bölgesel sonu ortanca kamp | 2. Lig sonu ortanca kamp |
|---|---:|---:|---:|
| Aktif, ücretli | 0 | 2 | 8 |
| Beş dakikalık, ücretli | 0 | 2 | 8 |
| Aktif, bedava şansı açık | 0 | 2–3 | 8 |
| Beş dakikalık, şans açık | 0 | 2 | 8 |
| Çevrimdışı, ücretli | 0 | 1 tamamlanan; altı kişinin ikinci kampı sürüyor | 8 |
| Çevrimdışı, şans açık | 0 | 2 | 7–8 |

Ortanca takım dağılımıdır; her oyuncunun garantisi değildir. Tek oyuncuya odaklanılan rotada Bölgesel'de 4 kamp yapan oyuncu varken geridekiler 1 kampta kalabildi. 2. Lig sonu ortanca 6–7 oldu. Dengeli kadro ve yıldız oyuncu yatırımı farklı sonuçlar veriyor.

Çevrimdışı model 15 dakikalık dönüşleri ve gerçek üretim verimini kullanır. Mahalle'de vardiya yoktur; bu profilde ilk aşama açık oyunla geçilir. Bölgesel ücretli senaryoda altı oyuncu son maç civarında ikinci kampa girdiği için henüz tamamlanmış sayılmaz. Bu gecikme gizlenmedi; sırf lige çıkıldı diye bedava yıldız verilmedi. 2. Lig'de yetişebiliyorlar.

### Aynı seed/karar düzeniyle önce → sonra

| Profil | Mahalle dakika | Bölgesel dakika | 2. Lig dakika | Bölgesel ortanca kamp |
|---|---|---|---|---|
| Aktif | 16,5 → 16,5 | 39,5 → 39,5 | 78,7 → 78,7 | 4 → 2 |
| Beş dakikalık | 30 → 30 | 70 → 70 | 112 → 112 | 4 → 2 |
| Çevrimdışı | 79,5 → 79,5 | 260 → 260 | 348 → 348 | 3 → 1 tamamlanan |

Aktif Bölgesel'de en uzun gelişim/satın alma aralığı önce de sonra da 60 saniye; beş dakikalık profilde 301 saniye. Aktif 2. Lig'de seed 41 için 151 → 121 saniye; tüm ücretli seedlerde en çok 150 saniye. Bunlar eğlence ölçüsü değil, boş bekleme artmadığına dair kontrollerdir. Takvim süreleri terfi varsayar; insan oyuncunun galibiyetlerini garanti etmez.

Örnek aktif kadroda Bölgesel sonu otomatik hız 11,48, otomatik talimat temel AP'si 204,375; 2. Lig sonu 28,28 ve 1.704,375. Kritik/tekrar/günlük primler ayrıca çalışır. Bu üretim büyümesi daha pahalı seviyeleri ulaşılır tutar. Ham AP büyüklüğü tek başına değil, eğitim/kamp bedeliyle değerlendirilmelidir.

Üretim `MatchRules.simulateRotationSet` kullanan iki ek rotada Bölgesel galibiyetleri 9/14 ve 10/14; 2. Lig'de 10/14 ve 10/14. Bu, saha animasyonunu baştan sona izleme testi değildir; gerçek rotasyon hesabıdır. Promosyon denetim tarafından yapılır; sıralama garantisi yoktur.

## Sonraki aşamalarla tutarlılık

| Aşama | Yumuşak hedef toplam kamp | Kart / yıldız | Normal seviye sınırı |
|---|---|---|---|
| Mahalle | 0 | Siyah 0 | 10 |
| Bölgesel | 2–4 | Siyah 1–2 | 30–50 |
| Ulusal 2. Lig | 6–8 | Gümüş 0–1 | 70–90 |
| Ulusal 1. Lig, taslak | 12–14 | Altın 0–1 | 130–150 |
| Sultanlar, gelecek | 18 | Mor 0 | 190 |
| Milletler, gelecek | 18–20 | Mor 0–1; elit/signature ayrı | 190–210 |
| Dünya, gelecek | 20–22 | Mor 1–2 | 210–230 |
| Olimpus, gelecek | 22–24 | Mor 2–3 | 230–250 |

Mahalle'nin gerçek kamp kilidiyle çelişen `[0,2]` hedef verisi `[0,0]` yapıldı. Skill kapıları ve diğer hedefler aynı. Akademi/transferlerin ileri renkli mezunları bu rotalara dahil değil; 1. Lig bu turda denge hedefi olarak zorlanmadı. 5–8 için oynanabilir gelir içeriği yok; alt satırlar kanıtlanmış oyun sonucu değildir. 24 kamp son sınırı eklenmedi.

## Tekrar çalıştırılabilir kontroller

- `audit-first-camp-return.cjs`: 20 sıfır kayıt dönüşü; grup ve tek kişiye odaklanma maliyet sınırı.
- `audit-first-camp-return-browser.cjs`: kazanılmış kayıtla gerçek düğmeler/bakiyeler ve kapalı adaylar.
- `audit-camp-economy-pacing.cjs`: 108 sezon; gelir, ücretli/bedava eğitim, kamp ve sosyal medya.
- `test-camp-economy-curve.cjs`: sabit fiyat, etkili indirim, tam ödeme sınırı, ilk eğitim/kalıcı limit.
- `audit-camp-cap-matrix.cjs`: 875 rol/kamp/aşama ve 113.750 seviye teklifi. Gelecek aşamalarda yalnız aritmetik.
- Kamp dönüş kilidi, lig geçişi, skill göçü ve gerçek eğitim tutorialı testleri.

Simülasyon transfer, tek özellik eğitimi, akademi, reklam veya satın alınan kazanç kullanmaz. Çoğu rota %50 seedli maç ve doğrudan promosyon varsayar; iki rota gerçek maç hesabı kullanır. Sosyal blok limitleri, video süreleri/dalga AP'si günceldir; çevrimdışı video ve maç sırasında yayın takvimi yaklaşık modellenir. İnsan seçimleri ve gerçek maçlarla son denge ayrıca izlenmelidir.


## Sonraki revizyon: Toparlanma kartının Çalışma Planı ile birleşmesi

28 Ekim aynı gün sonraki kullanıcı kararıyla ayrı Toparlanma Ünitesi kaldırılıp etkisi Çalışma Planı’nın 6–10 ek seviyelerine taşındı. Bu nedenle yukarıdaki ilk fiyat revizyonunun tablo/sabit seed karşılaştırmaları tarihsel ölçümlerdir. Ham camp-economy-pacing ve first-camp-return sonuçları yeni kart düzeniyle tekrar üretildi. 20 dönüşte yeni gelir olmadan tekrar gönderim hâlâ sıfır. Beş kişilik gerçek arayüz sonucu yine 12/11/11/11/11; aktif erken dönüş artık iki kişilik olabilir. Yeni 108 sezonda aktif/beş dakikalık Bölgesel ortancası 2, 2. Lig 8; aktif 2. Lig süresi seedlere göre 78,7–79,2 dakika. Çevrimdışı ücretli 2. Lig ortancası 7–9; bu stilin sonucu sabit bir yıldıza zorlanmadı. Eski yatırımlar idempotent aktarılır, eski ayrı ücretli ek faydalar korunur. Eğitim fiyatı, kamp bedeli ve seviye/yıldız sınır formülleri bu birleşimde değişmedi.


## Son karar: Toparlanma birleşimi geri alındı

Kullanıcı birleşimden vazgeçti. Ayrı Toparlanma Ünitesi ve Çalışma Planı’nın Birebir Çalışma ek özelliği geri geldi; yukarıdaki birleşim bölümü tarihsel kayıttır. Birleşimi yüklemiş kayıtların etkileri özgün kart seviyelerine geri çevrilir; AP/bütçe eksilmez. Ham 20 dönüş/108 sezon verisi ayrı kart düzeniyle yeniden üretildi ve ilk fiyat revizyonunun hedefleri korundu. Eğitim ve kamp fiyat formülleri değişmedi.
