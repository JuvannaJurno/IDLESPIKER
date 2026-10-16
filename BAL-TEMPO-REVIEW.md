# BAL tempo incelemesi

Mevcut kurallarla otomatik yatırım yapan dört üretim simülasyonu, iki kadro rotası için 40'ar sezon ve seçilmiş kadrolarla rakip başına 100 kısa maç denendi. Oyun dengesi değiştirilmedi.

## Kapsam

- Süreler üretim süresidir; maç animasyonu, menülerde karar verme ve çevrimdışı oturum araları dahil değildir.
- Üç rota Prolog bloklarını 5. seviyede, bir rota 3. seviyede devralır. Başlangıç kadrosu 10. kart seviyesinde, yaklaşık 31 OVR'dir.
- Otomatik yatırım ve sürekli en ucuz kart yükseltmesi insan davranışını temsil etmez. Bekleme ölçümü kaynakların izin verdiği aksiyonlar arasındaki aralıktır.
- Kazanma oranları MatchRules.simulateSet ile ölçülür; canlı sahadaki hareket, libero ve konum hatalarının birebir tahmini değildir.
- Sıralama denemeleri sabit gelişim anlık görüntüleriyle maç sonuçlarını tekrar örnekler; her sonuçta ekonomiyi yeniden simüle etmez. Bunlar küçük örneklemli karşılaştırmalardır.

## İlk on dakika

| Rota | Talimat/sn başlangıç → 10.dk | Üretilen AP | Kart yükseltmesi | Blok satın alma/yükseltme |
|---|---:|---:|---:|---:|
| Dengeli, Prolog blokları 5 | 4,2 → 5,4 | 708.878 | 56 | 32 |
| Otomasyon, Prolog blokları 5 | 4,2 → 7,2 | 783.282 | 59 | 31 |
| Dengeli, Prolog blokları 3 | 2,52 → 3,72 | 279.169 | 33 | 20 |

Başlangıç kaynak açısından boş değil. İnsan oyuncu bütün fırsatları kullanırsa sık menü etkileşimi gerekebilir. Devir alınan Prolog seviyeleri hissedilir fark yaratıyor.

## Orta bölüm

Dengeli rotada 30–50. dakikalar arasında 23 kart, 23 blok yatırımı gerçekleşti. 40. dakikada altı kamp tamamlanmıştı. Sezon boyunca 10 kamp gidişi/dönüşü gerçekleşti. Transfer rotasında sezonluk transfer harcaması 987.200 bütçeydi.

Her iki kaynak için yatırım seçenekleri var. Buna rağmen transfer rotası sezon sonunda yaklaşık 78 OVR'ye çıkarken mevcut kadroyu geliştiren rota yaklaşık 72 OVR'de kalıyor. Son kadroyla Karadeniz'e karşı 100 kısa maçta kazanma oranı %75'e karşı %40. Transferin toplam maliyeti daha yüksek, bloklar daha geride; dolayısıyla bedelsiz üstünlük değil. Ancak kampın rekabet gücüne katkısı transfer kadar belirgin değil.

En uzun kaynak kaynaklı aksiyon aralığı dengeli rotada 75 saniye, otomasyonda 66 saniye, transfer rotasında 120 saniye. Transfer için biriktirmek blok gelişimini duraklatabiliyor.

## Sezon sonu

| Rota | Üretim süresi | İlk 10. seviye | Sezon sonunda 10. seviye blok |
|---|---:|---:|---:|
| Dengeli, Prolog blokları 5 | 83 dk | 70.dk, son dört maç civarı | 4 |
| Otomasyon | 71 dk | 52.dk, yaklaşık 10. maç | 3 |
| Transfer | 93 dk | Sezon içinde yok | 0 |
| Dengeli, Prolog blokları 3 | 108 dk | 91.dk | 4 |

Genel olarak son seviyeler sezon sonuna denk geliyor. Transfer rotasında hiçbir bloğun tamamlanamaması bitiş tatminini zayıflatabilir.

40'ar sezonluk sabit gelişim denemesinde dengeli kadro 38/40 ilk üç, 11/40 ilk iki, 1/40 şampiyonluk aldı. Transfer kadrosu 40/40 ilk üç, 28/40 ilk iki, 9/40 şampiyonluk aldı. İlk üç kolay / ikincilik orta / şampiyonluk zor ayrımı görülüyor, fakat dengeli kadro için şampiyonluk fazla düşük kalabilir.

## Önerilen sonraki ayar

1. İlk on dakikanın üretimini yavaşlatmadan, kart ve blok etkileşim yükünü insan oyunuyla doğrula.
2. Mevcut oyuncuya yatırımı rekabetçi kıl; doğrudan transferleri değersizleştirme.
3. Transfer ağırlıklı rotanın sezon sonunda en az bir seçili bloğu tamamlayabilmesini hedefle.
4. Şampiyonluk hedefini canlı maçlarla doğrula; bu kısa maç örneklemlerine dayanarak rakipleri topluca zayıflatma.

Veriler: `bal-tempo-audit.json`, `bal-ranking-audit.json`.
Tekrar üretim: `node audit-bal-tempo.cjs`, `node audit-bal-ranking.cjs`.
