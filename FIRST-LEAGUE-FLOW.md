# 1. Lig — Akış Atölyesi

2 Kasım 2026. Önceki taslağın eksik kalan özel blok/hat gelişimini tamamlayan ikinci üretim katı. Akademinin üç kartı korunur; yalnız 1. Lig'deki Yönetim katının yeni yatırımları değişir. Eski otomasyon, vardiya ve Ortak Tempo blokları Önceki aşama çekmecesinde kalır. Kayıtlı seviyeleri, etkileri ve yükseltmeleri kaybolmaz.

| Yeni blok | Beş seviyenin tek katkısı | Sırayla bütçe |
|---|---|---|
| Dağıtım Ünitesi | Bir yeni standart hat: %20 / 40 / 60 / 80 / 100 kapasite | 12k / 24k / 48k / 96k / 180k |
| Talimat Paketleme | Otomatik talimat başına AP +%10 / 20 / 30 / 40 / 50 | 14k / 28k / 56k / 110k / 210k |
| Akış Volanı | Otomatik üretim sıklığı +%5 / 10 / 15 / 20 / 25 | 16k / 32k / 64k / 125k / 240k |

Toplam 15 yatırım 1.255.000 bütçe. Akademi katıyla birlikte iki yeni katın tüm yatırımları 2.005.000 bütçedir. Önceki 750.000 toplamı yalnız akademi katının bedelidir. Bunlar taslak değerlerdir; gerçek oyuncu rotasında ilk sezonun hepsini doldurması zorunlu tutulmaz.

## Hat davranışı

Yeni hat şans atışı değildir: aynı laneCarry hesabını kullanır. İlk seviyede her beş üretim çevriminde bir talimat gönderir; yükseldikçe 2/5, 3/5, 4/5 ve 5/5 olur. Normal üretim, çevrimdışı üretim ve fiziksel boncuklar aynı kapasiteyi sayar. Önceki standart hatların kapasitesi ve mavi medyanın güzergâhı değiştirilmez. Altı tam standart hatla girilmişse yeni hat yedinci olur; daha az hatla girilmişse mevcutların sonuna eklenir.

Paketleme clickAP'yi değiştirmez; autoAP'yi çarpar. Mevcut sosyal dalga hesabı da otomatik AP tabanını kullandığından AP desteğini alır; mavi boncuğun görünümü aynı kalır. Paketleme seviyeleri 1 / 2–3 / 4–5 olduğunda normal otomatik boncukta bir / iki / üç açık bant görünür. Boncuk büyük bir parıltıya dönüştürülmez. Elle gönderilen boncuk her zaman en üstte çizilir.

Volan yolculuk süresini yapay olarak kısaltmaz; gerçek üretim sayısını artırır. Hatlardan daha sık paket geçer. Üretim açıklaması da bunu söyler. Standart başlıklarda küçük bir bağlantı parçası görülür. Yeni boruda doğal yeşil kenar ve kapasite başlığı vardır; bütün departmanlar yeşile/maviye boyanmaz. Yeni hat mevcut yukarıdan aşağı kurulum animasyonuna katılır ve kurulum bitene kadar o hattan boncuk geçmez.

Tam yatırımla, altı tam eski hattın yalnız temel otomatik AP üretimi için örnek çarpan: `7/6 × 1,50 × 1,25 = 2,1875`. Kritik, her N. talimat AP'si, takvim ve diğer ayrı katkılar aynı çarpana sahip değildir; gerçek toplam kazancın tam 2,1875 katı olduğu iddia edilmez. Otomatik talimat adedi yaklaşık `7/6 × 1,25`, elle basış AP'si ise aynı kalır. Daha hızlı takvim/kamp ritmi doğal sezon testinde yeniden ölçülmelidir.

## Tasarım tutarlılığı

Yeni kartlar için ayrı krem, farklı yeşil kenar ve 13px/12px gibi ayrı yazı kuralları eklenmez. Önceki taslaktaki `.first-league-card` font/biçim istisnaları kaldırıldı. Yalnız 1. Lig’in bütün blokları için tek bir okunabilir boyut seti kullanılır; aynı kat içindeki kartlar birlikte uzar. Gerçek blok şablonu ve ortak SVG ikon haritası kullanılır; seçici de aynı ikonları verir. Ölçümde yeni kartlar ve önceki aşama kartlarında aynı Trebuchet/Segoe ailesi, 12px başlık, 10px açıklama, ortak en az 260px yükseklik ve 13px köşe çıktı. Tamamlanmış ve yükseltilebilir durumların farklı renkleri işlevseldir, korunur.

Akış Atölyesi başlığı, seçici adı, erişilebilirlik etiketi ve açıklaması aynı departmanı tarif eder. Yeni üç kart kurulduktan sonra fazladan Yeni alan aç kartı kalmaz. Akademi katında da aynı kural geçerlidir.

## Doğrulama

- `test-first-league-flow-rules.cjs`: üç kartın beş seviyesi, artan fiyat, kayıt/normalizasyon, on çevrimde 2/4/6/8/10 ek gönderim, autoAP ve autoRate ayrımı, elle AP'nin korunması, gerçek çevrimdışı üretim.
- `test-first-league-flow-browser.cjs`: üç gerçek satın alma, eski kartların çekmecesi, yeni boru, 1/5 ve 5/5 kapasite, paket başlıkları, ortak tipografi/köşe, 320/390/1280, gerçek otomatik akışta tek canvas ve sınırlı sprite önbelleği.
- `test-first-league-prior-stage-isolation.cjs`: önceki üç aşamanın 9 kayıt/ekonomi ve 441 rakip örneği aynı.
- Akademi, proje ve sıralı yedek testleriyle birlikte kontrol edilir.

Görseller: `audits/first-league-special-blocks.png`, `audits/first-league-flow-fittings.png`. Ham yazı ölçüleri: `audits/first-league-block-typography.json`. Çalışan akış örneği: `audits/first-league-flow-runtime.json`; örnekte 28 görünür paket, tek canvas ve iki sprite vardı. Bu tek bir çalışma anıdır; telefon FPS garantisi değildir.

Kalan doğal 1. Lig ekonomi turu ve telefon performans testi önceki taslak notundaki gibi hâlâ gereklidir. Bu çalışma 1–3. aşamaları dengelemek için kullanılmadı; onlara yeni blok/hat verilmedi.

Ek kontrol: 1. Lig’de otomatik paket AP’si artınca Talimat ver düğmesinde yanlışlıkla otomatik kazanç yazılmaması sağlandı; düğme elle basış değerini gösterir. 11.574 eski boncuk yörüngesi/süresi ve 120 etki portföyü eşitlik testi, eski hat kapasitesi ve uçuş halindeki AP’nin yalnız bir kez teslimi testleri geçti. Genel test-block-contributions.cjs, BAL’daki eski bal_contacts kayıt geçişi beklentisinde başarısızdır; aynı hata değişiklik öncesi HEAD kaynaklarıyla da yeniden üretildi. Önceki aşamalara müdahale etmemek için bu bağımsız eski test/kayıt geçişi bu çalışmada değiştirilmedi.

Cila: Atölye departmanı aynı yerel SVG paletiyle boru/gösterge/kontrol paneli görseli kullanır; görsel önbelleği 1. Lig’e özeldir. Aşama değişiminde eski ofis görseli geri gelir. Koyu temada yeni borunun dış kenarı ayrıca uyarlanır. Taşınmış bir ileri-aşama kaydında önceki aşama görüntülenirse gelecekteki kartlar ana sırada gösterilmez; kayıtlı yatırım silinmez. Tarayıcı testi geri dönüşte yeni başlık, paket bandı, boru ve atölye görselinin önceki aşamaya sızmadığını da doğrular.
