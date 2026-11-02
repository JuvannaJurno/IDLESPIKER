# Kulüp ekranı performans düzeltmesi — 19 Ekim 2026

Aynı 2. Lig orta-sezon kaydı, 390×844 headless Edge, işlemci 4× yavaşlatılmış. Ölçüm sırasında takvimdeki maç durması testte devre dışı; gerçek otomasyon ve kaynak üretimi açık. Fiziksel telefon ölçümü değildir.

| Ölçüm | Süre | FPS | >50 ms kare | p95 kare | Stil hesaplama |
|---|---:|---:|---:|---:|---:|
| Önce | 30 sn | 7.0 | 181/211 | 249.9 ms | 22.63 sn |
| Sonra | 30 sn | 54.2 | 18/1628 | 33.3 ms | 2.89 sn |
| Uzun kontrol | 60 sn | 56.8 | 20/3406 | 16.9 ms | 6.20 sn |

30 sn'de işlenen talimat: önce 1710, sonra 1712. Aradaki küçük fark çift talimat/zamanlama rastgeleliğidir; kaynak üretim kuralları veya hızları değiştirilmedi. 60 sn'de 3394 talimat işlendi, aynı anda görülen talimat görseli en fazla 17; konsol hatası yok.

## Değişiklikler
- Kulüp/transfer/kart düzenindeki ilişkisel :has() seçicileri aynı durumu ifade eden açık sınıflara dönüştürüldü. Sınıflar oluşturma veya durum değişiminde güncelleniyor; tarayıcının her DOM değişiminde alt ağacı tekrar sorgulaması önlendi.
- Blok seviyesi/etkisi değişmedikçe açıklama, seviye çubuğu ve bonus düğümleri yeniden oluşturulmuyor. Sadece gerekli fiyat/kaynak metni güncelleniyor.
- Değişmeyen sayaç metinleri tekrar yazılmıyor. Ekran dışındaki bütçe/AP sayıları için animasyon yürütülmüyor.
- Talimat, Ortak Tempo, neon, kaynak miktarları ve ilerleme kuralları korunuyor.

## Kontrol
Açık/koyu temada mevcut CSS ile önceki ilişkisel seçicilerin hesaplanan ölçü, renk, boşluk ve gölgeleri karşılaştırıldı; eşit. Önceki aşama çekmeceleri, mobil blok satın alma ve transfer/kayıt tutarlılığı testleri geçti. Ham veriler aynı klasördeki JSON dosyalarında; measure.cjs ile tekrar ölçülebilir.

Sınır: Her telefon için sabit 60 FPS garantisi değildir. Uzun kontrolde hâlâ 20 kare 50 ms'yi aştı; ancak önceki sürekli donma belirgin biçimde azaldı.
