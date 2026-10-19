# Transfer katalog dengesi — 19 Ekim 2026

Yeni katalogların katkı sayısı katalog başında belirlenir. Küçük fırsat +1–3 OVR, büyük fırsat +4–7 OVR veya iki küçük katkıdır. Yeni normal adaylarda en fazla iki katkılı oyuncu üretilir. Saklanan aday bu kura dışında aynen taşınır. Aşama tavanı yüzünden her fırsat mutlaka yükseltme sağlayamayabilir.

## 8.800 katalogluk dağılım testi

| Keşif yatırımı | Hedef katkılı katalog | Ölçülen | Hedef büyük fırsat | Ölçülen |
|---|---:|---:|---:|---:|
| Yeni keşif | %25 | %24,8 | %3 | %3,4 |
| BAL temel bloklar tam | %45 | %45,0 | %5 | %5,0 |
| BAL Bölgesel Bağlantılar tam | %50 | %50,2 | %7 | %7,4 |
| 2. Lig kalite blokları tam | %55 | %55,2 | %10 | %10,6 |

Her profil için 2.200 katalog test edildi. Hiçbirinde yeni katkılı aday sayısı ikiyi aşmadı. Bu yüzdeler farklı sabit kadrolarla kontrollü üretim ölçümüdür; gerçek ilerlemede tavanlar, saklanan aday ve kadro değişiklikleri görünen sonucu etkiler.

## Blokların etkileri

- Keşif Ağı: süre. Yerel Bağlantılar: aday sayısı ve küçük fırsat katkısı.
- Yetenek Tarama: katkılı katalog ve büyük fırsat sıklığı.
- Bölgesel Bağlantılar: her ek seviyede +1 puan katkılı katalog, +0,4 puan büyük fırsat.
- Ulusal Gözlem Ağı: her temel seviyede +1 puan katkılı katalog, +0,6 puan büyük fırsat.
- İhtiyaç Analizi: bir aday zayıf pozisyondan gelir; mevcut fırsatı bu adaya yönlendirme olasılığı artar.
- Eski kayıtlardaki Akademi İşbirliği: ek seviyeler ve kalite aralığı içinde daha yüksek başlangıç gücü.
- Transfer Görüşmeleri: mevcut fiyat indirimleri. Elit Oyuncu Bağlantıları: ayrı %2,5–3 elit ihtimali.
- Gözlemci / Maç Sonu İnceleme: öneriler ve galibiyet AP bonusu.

## İşlev kontrolleri

- Kart seviyeleri gerçek kart gelişim kazanımlarıyla tekrar oluşturuldu: statlar ve eğitim kayıtları eşleşiyor.
- OVR yükseldikçe yıldız ortalaması artıyor; stat/seviye sınırları korunuyor.
- Saklanan teklif, mevcut kadro, bloklar ve açık katalog değişmeden kaydedilip yükleniyor.
- Son tamamlanan maçın ilk kadrosu aday üretimine referans oluyor. Henüz maç yoksa mevcut ilk kadro kullanılıyor.
- Mevcut kayıtla 12 katalog yenilemesi, 390 px mobil transfer ekranı, katkı işaretleri ve güncel olasılık etiketleri tarayıcıda kontrol edildi.
- Uzman profili için kötü şans koruması ek katkılı aday üretmiyor. Eski Akademi bonusu ve toplam %35 transfer indirimi ayrı doğrulandı.

## İlerleme koşuları

Üç stratejiyle BAL → 2. Lig kuralları simüle edildi. Ayrıntılı sonuçlar: catalog-balance-stage-runs.json. Bunlar hızlandırılmış kural/ekonomi simülasyonlarıdır; gerçek zamanlı üç manuel oynanış veya animasyon incelemesi değildir. BAL süreleri otomasyon varsayımlarına bağlı tahmindir.

| Strateji | BAL maç | BAL tahmini dakika | 2. Lig maç | 2. Lig katalog | 2. Lig transfer |
|---|---:|---:|---:|---:|---:|
| balanced | 14 | 56 | 14 | 56 | 3 |
| automation | 14 | 50 | 14 | 56 | 3 |
| transfers | 14 | 56 | 14 | 56 | 2 |

Toplam 84 maç tamamlandı. 2. Lig’de koşu başına 56 katalog ve 2–3 transfer gerçekleşti.

## Testler

- test-scout-catalog-balance.cjs
- test-scout-bonus-edges.cjs
- test-scout-balance-browser.cjs
- test-scout-consistency.cjs
- test-scout-star-ovr.cjs
- test-scout-cadence.cjs
- test-bal-restored-bonuses.cjs
- test-existing-run-gradient-scout.cjs
- test-scout-stage-runs.cjs

İki eski genel test güncel olmayan beklentilerde duruyor: test-transfer-shared-card.cjs üç kamp sonrası Legendary açılmasını bekliyor (güncel eşik dört); test-transfer-camp-balance.cjs mevcut keşif süresinden önce katalog açmayı deniyor. Bunlar bu değişiklikte değiştirilmedi; ilgili davranışlar yukarıdaki odaklı testlerle doğrulandı.
