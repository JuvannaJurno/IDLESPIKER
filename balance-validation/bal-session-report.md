# BAL tempo ve transfer testi

Üç ayrı yeni BAL başlangıcı, gerçek gelir/yükseltme/kamp/transfer/lig kurallarıyla hızlandırılarak oynatıldı. Her koşu 14 maçı tamamladı. Başlangıç: Mahalle aşamasından 10. seviye ana kadro; BAL blokları sıfır. Manuel talimat, çevrimdışı gelir ve hile kaynakları kullanılmadı. Transfer rotası görünür OVR katkısı en yüksek dört adayı seçti.

| Rota | Üretim | Tahmini toplam* | Kart yükseltme | Blok yatırımı | Son sıra |
|---|---:|---:|---:|---:|---:|
| Dengeli | 57 dk | 64 dk | 245 | 144 | 2 |
| Otomasyon ağırlıklı | 49 dk | 56 dk | 242 | 140 | 2 |
| 4 transferli | 59 dk | 66 dk | 222 | 142 | 3 |

* Toplama 14 hızlı maç ve menü kullanımı için toplam 7 dakika varsayımı eklendi. Tüm maçları normal hızda izlemek ve uzun menü kullanımı süreyi uzatır; bu, üç saat boyunca gerçek zamanlı elle oynama testi değildir.

## Bekleme aralıkları

- Dengeli: kart yükseltmesi başına ortalama 14 sn; aralıkların %95’i 34 sn veya daha kısa. Oyuncu veya blok yatırımı arasındaki en uzun aralık 62 sn.
- Otomasyon ağırlıklı: kart yükseltmesi başına ortalama 12 sn; aralıkların %95’i 30 sn veya daha kısa. Oyuncu veya blok yatırımı arasındaki en uzun aralık 54 sn.
- 4 transferli: kart yükseltmesi başına ortalama 16 sn; aralıkların %95’i 39 sn veya daha kısa. Oyuncu veya blok yatırımı arasındaki en uzun aralık 51 sn.

## Değişiklikler

- BAL otomatik üretimi %40 artırıldı. Temel üretim göstergesi aynı hesabı kullanır.
- BAL oyuncu yükseltmesinin başlangıç bedeli ve ileri OVR maliyet eğrisi yumuşatıldı. Aynı güçteki iki oyuncu aynı AP bedelini öder; düşük seviye transfer ederek maliyeti sıfırlama avantajı yok.
- BAL blok bedelleri ilk beş seviyede %10, sonraki seviyelerde %15 indirildi.
- Yeni BAL adaylarında potansiyel profili kaldırıldı. Adaylar mevcut güçleriyle gelir. Fiyat yalnızca mevcut OVR ve pazarlık indirimiyle belirlenir.
- Örnek bedeller (pazarlık indirimsiz): 50 OVR 7.800; 70 OVR 20.400; 90 OVR 40.200 bütçe.
- Kart açılışı ve katalogda aynı pozisyondaki ilk kadroya göre doğrudan OVR farkı gösterilir. Parlama da aynı karşılaştırmayı kullanır.
- Transfer önerileri gelecekte ucuz gelişir diye zayıf aday önermiyor.
- Kamp sonrası AP indirimi eklenmedi. Mahalle ve 2. Lig üretim/yükseltme/fiyat eğrileri korundu. Mevcut kayıtlar sıfırlanmadı.

## Doğrulama

- Üç son kayıt ayrı, temiz Edge oturumunda açıldı; 14 sonuç, kadro, pozitif kaynaklar, mobil görünüm ve yenileme sonrası kalıcılık doğrulandı.
- 30 dakikalık ekonomi testinde her 10 dakikada 36 / 25 / 25 yatırım; en uzun yatırım aralığı 35 sn.
- Transfer/kamp maliyet, prolog değişmezliği ve kamp indirimi olmaması testleri geçti.
- Oyuncu yetenekleri, lig kapıları ve BAL’da Legendary bulunmaması testleri geçti.

Ham koşular: `bal-three-runs.json`. Tekrar çalıştırma: `node simulate-bal-session.cjs`, ardından `node test-bal-three-saves.cjs`.
