# BAL yeniden test sonucu

Kamp dönüşünde AP indirimi olmayan güncel kurallar test edildi. Bu turda tempo değerleri değiştirilmedi. Önceki görevde eklenen rakip libero sistemi tamamlandı ve giriş/çıkış kontrolleri geçti.

| Rota | Üretim süresi | İlk 10. seviye blok | Tamamlanan blok | En uzun kaynak kaynaklı aksiyon aralığı |
|---|---:|---:|---:|---:|
| Dengeli, Prolog blokları 5 | 84 dk | 66,5 dk | 4 | 75 sn |
| Otomasyon | 70 dk | 49,8 dk | 3 | 61 sn |
| Transfer | 89 dk | 75,7 dk | 2 | 86 sn |
| Dengeli, Prolog blokları 3 | 109 dk | 87 dk | 4 | 83 sn |

Süreler maç izleme, menülerde düşünme ve çevrimdışı oturum aralarını içermez. Otomatik yatırım, yedi oyuncunun en uygun kart yükseltmesini seçer. Bunlar insan oyun süresi ölçümü değildir. Bir canlı BAL maçının hızlandırılmamış eşdeğeri 67 saniye/5 ralli olarak ölçüldü; tek maç bütün sezonun izleme süresini temsil etmez.

## İyi çalışanlar

- İlk 10 dakikada dengeli rotada 58 kart yükseltmesi ve 32 blok yatırımı mümkün oldu; üretim 4,2'den 5,4 talimat/sn'ye çıktı.
- Dengeli rotada 11 kamp tamamlandı. Sürekli kamp dönüşü bekleyerek büyüyen bir AP kilidi görülmedi.
- Son blok seviyeleri dengeli rotada son dört maça denk geldi; transfer rotası da iki bloğu tamamladı.
- Prolog → BAL geçişinde OVR ve kart seviyeleri korunuyor; normal, azaltılmış animasyon ve yeniden deneme yolları geçti.
- Vardiya olmadan çevrimdışı gün ilerlemiyor. Vardiyada AP/bütçe/gün doğru ilerliyor ve maçta duruyor. Yeniden yükleme aynı kazancı tekrar vermiyor. Bildirim ilk sefer çıkıyor, sonraki girişte maç alt düğmeden açılıyor.
- Canlı BAL maçında kadro → sonuç → ödül → yeniden yükleme zinciri geçti. Ödül iki kez verilmedi.
- Rakip libero duraklamada yürüyerek giriyor, ralli sırasında değişmiyor ve ön hatta orta oyuncu geri dönüyor.

## Kalan denge riskleri

1. İlk 10 dakikada çok sayıda yükseltme mümkün: kaynak kıtlığından çok menü/tıklama yorgunluğu riski var.
2. Tam gelişmiş Prolog altyapısı ile 3. seviyede altyapı arasında yaklaşık 25 dakika fark var. Geçişteki hissiyat oyuncunun eski yatırımlarına güçlü biçimde bağlı.
3. Son bölümde yaklaşık 1–1,5 dakikalık kaynak bekleme aralıkları kalıyor. Bunlar kilitlenme değil; yatırım fırsatları arasındaki en uzun ölçülen boşluklar.
4. Transfer kadrosu geç oyunda hâlâ daha güçlü. Son kadroların Karadeniz'e karşı 100 kısa maçlık testinde dengeli rota %43, transfer %73 kazandı. Canlı saha/libero hareketleri bu kısa simülasyonda temsil edilmez.
5. Sabit gelişim anlık görüntüleriyle 40'ar sezon tekrarında dengeli rota 38/40 ilk üç, 11/40 ilk iki, 1/40 şampiyon oldu; transfer rotası 36/40 ilk üç, 8/40 ilk iki ve 0/40 şampiyon oldu. Transferin sonradan güçlenmesi erken kaybedilen puanları geri getirmiyor. Şampiyonluk fazla erken puan kaybına bağlı kalıyor olabilir. Bu örneklem kesin olasılık değildir; her sonuçta ekonomi yeniden hesaplanmaz.

## Test kapsamı

Geçen güncel kontroller: `test-bal-seamless.cjs`, `test-camp-rebalance.cjs`, `test-transfer-camp-balance.cjs`, `test-bal-rivals-special.cjs`, BAL ortamında `test-match-integration.cjs`, `test-rival-libero-browser.cjs`, `test-special-transfer-browser.cjs`, `test-block-bonus-ui.cjs`, `test-offline-progress.cjs`.

Eski `test-camp-runtime.cjs` DOM maketi artık güncel departman yapısını desteklemiyor. `test-match-arrival-navigation.cjs` eski açılış ekonomisini ve kaldırılmış gün kilidini bekliyor. `test-scouting.cjs` ilk normalize karşılaştırmasında yeni varsayılan `heldId` alanı yüzünden duruyor. Bu eski test başarısızlıkları güncel tarayıcı senaryolarından ayrı tutuldu; bütün eski testler geçti denmiyor.

Ölçümler: `bal-tempo-audit.json`, `bal-ranking-audit.json`.
