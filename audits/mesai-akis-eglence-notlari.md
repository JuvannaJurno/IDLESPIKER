# Mesai akışı ve lig temposu

22 Ekim 2026. Kullanıcı kaydı değiştirilmeden sıfırdan 9 ekonomi koşusu. Aktif kontrol 30 saniye, aralıklı giriş 5 dakika, offline giriş 15 dakika. Bu ölçümler kişisel eğlenceyi kanıtlamaz; yapılacak iş, gelişim ve boş bekleme aralıklarını gösterir.

| Oynayış | Tohum | Lig dakika | Blokların bittiği maç | İlk 2 yıldız dakika | En uzun geliştirmesiz aralık dakika |
|---|---|---|---|---|---|
| active | 41 | 90.0 | 11 | 33.5 | 2.0 |
| active | 42 | 90.5 | 11 | 34.0 | 2.0 |
| active | 43 | 90.0 | 11 | 31.5 | 2.0 |
| idle | 41 | 155.0 | 9 | 60.0 | 5.0 |
| idle | 42 | 155.0 | 9 | 60.0 | 5.0 |
| idle | 43 | 155.0 | 9 | 60.0 | 10.0 |
| offline | 41 | 2840.0 | 8 | 1385.0 | 1350.0 |
| offline | 42 | 2840.0 | 8 | 1385.0 | 1350.0 |
| offline | 43 | 2840.0 | 8 | 1385.0 | 1350.0 |

## Değerlendirme

- Aktif oynayışın temposu yeterli: son çeyrekte hâlâ 15–17 oyuncu kartı yükseliyor. En uzun geliştirmesiz aralık iki dakika. Bloklar son üç maç kala bitiyor.
- Beş dakikalık girişlerde her dönüşte genellikle yapılacak iş var, ancak bloklar 9. maçta bitiyor. Son çeyrekte 28–29 oyuncu yükseltmesi kalıyor; tamamen durmuyor, seçenek çeşitliliği azalıyor.
- Offline oynayış en sorunlu bölüm: vardiya tüketilince 22,5 saate varan geliştirmesiz aralık var. Ligi 47 saat 20 dakikaya uzatıyor. Günlük vardiya yenilenmesiyle bağlı bu bekleme, yeni mesai sınırından önce de vardı.
- Bu yüzden aktif oynayış canlı, aralıklı girişin sonu tekrarlı, offline ağırlıklı oynayış sıkıcılaşmaya açık. Bu görevde fiyatlar, vardiya bütçesi veya takım güçleri değiştirilmedi.

## Arayüz doğrulaması

Geri sayım Talimat Hattı başlığında. Mesai ödemesi başarılı olduğunda mevcut enerji hattı görsel olarak çalışır ve görünür katlar aydınlanır. AP döngüsü hareket eder. Bu görseller talimat, takvim veya ek kaynak üretmez. Süre bitince yeni akış durur, yoldaki akışlar tamamlanır. Kartta parlama korunur, eski kart içi geri sayım kaldırılır.

Tarayıcıda 320/390 piksel, azalan sayaç, görünür katların aydınlanması, süre bitişi, gerçek maç, reload, gün değişimi ve aynı vardiyadan düşme kontrolleri geçti.

Gerçek saha testi: 9 sezon, 126 kendi maçımız ve 378 diğer resmi karşılaşma tamamlandı. Az gelişim sıraları 4/4/4; düzenli gelişim 3/1/2; odaklı gelişim 3/3/2. Uludağ tüm sezonlarda ilk üçte. Düzenli gelişimde bir koşu 14 galibiyetle bitti; zorluk hedefi her senaryoda tutarlı değil. Dokuz koşu kesin bir kazanma olasılığı vermez.
