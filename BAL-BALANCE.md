# BAL dengesi

Bu ayarların hedefi, maçları izleyen oyuncu için yaklaşık 90–150 dakikalık aktif sezon. Takvim 14 maç ve günde 500 talimat kullanır. Çevrimdışı ilerleme ve maç atlama toplam süreyi kısaltabilir.

## Geçiş ve ilerleme

- Prolog oyuncularının statları, OVR'leri, kart seviyeleri ve gelişim kayıtları korunur.
- Eski bloklar yeni departmanlarda etkilerini sürdürür. BAL blokları bütçe ile 10 seviyeye çıkar; takvim kilidi yoktur.
- BAL'de devralınan asistan hız çarpanı 1,4'tür. Yardımcı Antrenör ve 6–10. seviyelerdeki çift talimat eklenerek hız artar.
- Dengeli yatırımlarda ilk tamamlanan BAL bloklarının 11. maç civarında, diğer ana yatırımların son maçlarda bitmesi hedeflenir. Tek alana yoğunlaşmak daha erken tamamlamaya izin verir.

## Kart ve kamp maliyetleri

Tam 6 stat puanı veren bir BAL kart yükseltmesinin indirim öncesi tabanı:

`2500 × 1,14 ^ min(25, max(0, OVR − 25)) × 1,125 ^ max(0, OVR − 50)`

| OVR | AP tabanı |
| --- | ---: |
| 30 | 4.814 |
| 40 | 17.845 |
| 50 | 66.155 |
| 60 | yaklaşık 214.800 |
| 70 | yaklaşık 697.400 |

Gerçek bedel kazanılabilen stat puanları ve mevcut blok indirimlerine göre hesaplanır. Gücü aynı olan bir transfer, yalnızca kart seviyesi düşük diye daha ucuz gelişmez.

Kamp duyurulduğu gün kayıt açılır; 6 oyuncu, 3 oyun günü ve +30 stat sınırı kullanır. Kampın AP bedeli kart seviyesi ve önceki kamp sayısıyla yükselir. Seçim ekranı gerçek toplamı gösterir. Kamp sırasında normal gelişim kapanır. Kamp yalnızca stat/kart gelişim sınırını artırır. Kamp dönüşünde AP indirimi yoktur; mevcut boost ve kayıtlar korunur.

## Lig

Takımların kalıcı güçleri ve güçlü/zayıf özellikleri vardır. Bursa ve Trakya alt sıra, Toros ve Marmara orta sıra, Ege ilk üç, Başkent ikincilik, Karadeniz şampiyonluk rakibidir. Küçük sezon gelişimi oyuncu gücünden bağımsızdır.

Yeni sezonda favoriler iki devrenin sonuna gelir. Önceden oynanmış sonuçları bulunan kayıtlar eski fikstürlerini korur. Analiz, maç kadrosu ve diğer takımların sonuçları aynı takım profillerini kullanır.

5 sayılık maçlarda sürpriz sonuçlar mümkündür; sıralama veya galibiyet oyuncuya zorla verilmez.

## Özel transferler

- Katalog başına %10 başlangıç şansı, keşif geliştirmeleriyle en fazla %20.
- Altı katalog özel oyuncusuz geçerse yedincide garanti. Sayaç kayıtta saklanır.
- Pozisyon uzmanı: ana özelliğe kalıcı +6 başlangıç puanı.
- Yüksek potansiyel: başlangıç stat sınırı 110; BAL azami sınırı 160.
- Benzer normal oyuncuya göre fiyat çarpanı 1,5. Adayların sezon bonusu en fazla +10 stat, özel oyuncuların ek sezon bonusu en fazla +8 stattır.
- Tek aday sonraki kataloğa saklanabilir. Saklanan aday yeni garantili özel oyuncuyu silmez.
- Özel işareti ve profil bilgisi transferden sonra takım kartında korunur.

## Doğrulama

`node test-bal-season-balance.cjs` gerçek gelir, blok satın alma, kart geliştirme, kamp, transfer ve lig kurallarını birlikte çalıştırır. Dengeli yatırım, otomasyon odağı ve transfer odağı ayrı denenir. Maç animasyon süresi bu üretim ölçümüne eklenmez.

Diğer kontroller:

- `node test-bal-rivals-special.cjs`
- `node test-special-transfer-browser.cjs`
- `node test-bal-seamless.cjs`
- `node test-camp-rebalance.cjs`
- `node test-scout-levels.cjs`
- `node test-transfer-camp-balance.cjs`

Son ayarlamada dengeli üretim yaklaşık 83 dakika, otomasyon odaklı üretim yaklaşık 71 dakika sürdü. Transferlere tasarruf eden denemelerde üretim yaklaşık 90–100 dakika sürdü. Gerçek oyuncu tercihleri ve prologdan taşınan bloklar bu süreleri değiştirir. Maçları izlemek bu sürelerin üzerine eklenir.

Son tempo ayarı: BAL bloklarında 9. seviyeye geçiş %5, 10. seviyeye geçiş %10 ucuzlatıldı. İlk sekiz seviye ve Prolog maliyetleri korunur.

İndirimsiz tempo kontrolü: dengeli rota yaklaşık 84 dakika, transfer rotası yaklaşık 89 dakika üretim süresi. Son seviyeler sezon sonuna yayılıyor; transfer rotası da iki bloğu tamamladı. Bunlar otomatik yatırım simülasyonudur, maç izleme süresi dahil değildir.
