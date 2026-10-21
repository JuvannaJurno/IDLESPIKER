# Rakip oyun tarzları — 22 Ekim 2026

| Takım | Tarz | Rövanşta çalışan oyuncu |
|---|---|---|
| Ankara File | Servis baskısı | 6 numaralı çapraz, servis |
| Uludağ Akademi | Savunmadan kontrollü hücum | Melis Arıgöl, pas |
| Eskişehir Voleybol | Uzun ralli savunması | Libero, manşet |
| İstanbul Voleybol | İkili blok | İkinci orta oyuncu, blok |
| Başkent Akademi | Blok duvarı | Nadia Volkova, blok |
| Antalya Yıldızları | Yerleşimli servis | 5 numaralı smaçör, servis |
| Karadeniz Gücü | Sert servis ve hücum | Derin Ateş, servis |

Sadece 3. aşamada uygulanır. Güç dağılımı değişir; ilk karşılaşmanın oyuncu OVR değerleri korunur. Libero dönüşümündeki farklı ağırlıklar da hesaba katılır. Özel karakterler en güçlü takım arkadaşından +4 OVR güçlü kalır; görünüşleri ve Legendary kimlikleri korunur. Rövanşta 8. haftadan itibaren tek oyuncunun ilgili özelliği küçük ve sabit bir artış alır; oyuncunun kendi takım gücüne bakılmaz. Eski 28 maçlık kayıtlarda sonraki karşılaşmalar bu artışı tekrar tekrar eklemez.

Servis tipi 1,8 yerine 1,5 saniyelik servis uçuşu ve seçili hedef ağırlıkları kullanır. Blok tipi iki blokçuyu fileye 10 birim daha yakın kurar. Savunma tipi daha güçlü manşet, dayanıklılık ve +12 hareket hızı kullanır; libero mevcut Plonjon yeteneğine erişir. Beceri seçimleri yalnızca zaten sahip olunan ve açık yetenekler arasından tarzı destekler.

Maç öncesi rapor ve dizilişte tek satır tarz bilgisi vardır. Sahadaki kısa bildirimler gerçek servis, ikili blok teması ve çıkarılan top olaylarına bağlıdır. Rövanş bildirimi gelişen oyuncuyu adıyla söyler. Bildirimler sınırlı sıklıkta ve simülasyon zamanına bağlıdır; duraklatma ve hızla birlikte davranır.

## Doğrulama

- 120 bin ortak tohumlu çözüm: nötr servis 1.529 ace / servis tipi 3.559; nötr blok 1.197 / blok tipi 2.481; nötr savunma 12.176 dig / savunma tipi 14.945. Bunlar eşit OVR örnekleridir, lig galibiyet oranı değildir.
- Yedi takımın ilk maç ve rövanşları: 14 gerçek saha maçı. Uçuş süreleri, blok hedefleri, savunma hareket hızı, rövanş bildirimleri ve tarayıcı hataları kontrol edildi.
- 9 tam sezon: 126 kendi maçımız ve 378 diğer resmi fikstür.
- Smaç temas testi: 48 poz ve 12 gerçek top çıkışı geçti.
- BAL libero giriş/çıkış, hakem pozları, özel oyuncuların +4 OVR ve görünüş kararlılığı geçti.
- Genel maç kuralları testi, beş prolog maçına uygun günlük bütçe beklentisi ve yeni modül bağımlılığıyla güncellendi; 24 zayıf / 24 güçlü deterministik saha koşusu geçti.

| Oynayış | Test sıraları |
|---|---|
| casual | 3., 3., 3. |
| regular | 2., 2., 2. |
| focused | 1., 1., 2. |

Küçük örneklem, kesin sıralama garantisi değildir. Uludağ tüm dokuz koşuda ilk üçte kaldı.

Eski test-bal-rivals-special.cjs güncel katalog süresinden kısa aralıklar ve kaldırılmış bir transfer profili garantisi bekliyor; bu eski test bu çalışma kapsamında değiştirilmedi. Alt lig izolasyonu yeni stil testinde ayrıca doğrulandı.
