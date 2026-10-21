# Mesai sınırı sonrası lig testi

22 Ekim 2026. Kullanıcı kaydına dokunulmadan, sıfırdan 9 ekonomi koşusu. Aktif kontrol 30 saniye, aralıklı kontrol 5 dakika, offline kontrol 15 dakika. Maç sonucu ekonomi hesabında sabit tohumlu %50 kazanma olasılığı; gerçek maç testi ayrı.

| Oynayış | Tohum | Lig (dk) | Blokların bittiği dakika | Bitirdiği maç | İlk 2 yıldız (dk) | En uzun geliştirmesiz aralık (dk) |
|---|---|---|---|---|---|---|
| active | 41 | 90.0 | 76.5 | 11 | 33.0 | 2.0 |
| active | 42 | 90.5 | 76.5 | 11 | 33.5 | 2.0 |
| active | 43 | 90.0 | 76.0 | 11 | 32.0 | 2.0 |
| idle | 41 | 155.0 | 110.0 | 9 | 60.0 | 10.0 |
| idle | 42 | 155.0 | 110.0 | 9 | 60.0 | 10.0 |
| idle | 43 | 155.0 | 110.0 | 9 | 60.0 | 10.0 |
| offline | 41 | 2840.0 | 1400.0 | 8 | 1385.0 | 1350.0 |
| offline | 42 | 2840.0 | 1400.0 | 8 | 1385.0 | 1350.0 |
| offline | 43 | 2840.0 | 1400.0 | 8 | 1385.0 | 1350.0 |

- Aktif oynayışta blok fiyatları hedeflenen 75–80 dakika aralığını koruyor. Fiyat değiştirilmedi.
- Beş dakikada bir dönüşte bloklar 9. maçta tamamlanıyor. Son 5 maçta blok geliştirmesi kalmaması takip edilecek bir pacing sorunu; oyuncu geliştirmeleri devam ediyor.
- Offline ağırlıklı senaryoda lig 47 saat 20 dakika. En uzun geliştirmesiz aralık 22,5 saat: vardiya bitince günlük yenilenmesini bekliyor. Bu bekleme mesai limitinden önce de vardı; yeni sınır tek başına çözmüyor.
- Mesai sınırları 10/15/20/25/30 dakika; üst seviyeler 30 dakikayı koruyor. Gün değişimi, reload, tekrar hesaplama, ortak vardiya bütçesi ve maç değişimi testleri geçti.
- Kart yalnızca mesai üretebildiğinde parlıyor. Kartta ve vardiya özetinde saniyeli kalan süre var. Süre bitince parlama duruyor.

## Gerçek saha sonuçları

9 sezon, 126 kendi maçımız ve 378 diğer lig karşılaşması tamamlandı.

- casual: 4., 4., 4.
- regular: 3., 1., 2.
- focused: 3., 3., 2.

Uludağ Akademi tüm koşularda ilk üçte. Normal gelişimle bir koşu 14/14 galibiyetle bitti; az gelişimde üç koşu da 4. sıra oldu. Bu sonuçlar “3. kolay, 2. zor, 1. daha zor” hedefinin her koşulda tutmadığını gösteriyor. Bu çalışmada takım güçleri değiştirilmedi; 9 koşu kesin kazanma olasılığı ölçmez.
