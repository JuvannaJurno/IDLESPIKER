# Yıldız ve yetenek ilerlemesi — taslak hesap

Bu bir denge hedefidir; lig bitiş garantisi veya yeni lig takvimi değildir. Oyun şu anda 1–4. aşamaları içerir; 5–8 hedefleri gelecek aşamaların ayarlarıdır.

Kamp yarım yıldız, renk başına 6 kamp: gümüş 6, altın 12, mor 18. Normal yetenekler 0/1/2/8; Legendary 3/14. İkinci Legendary ayrıca seçilmiş çalışma ister (3 kamp veya altın akademi hazırlığı).

| Aşama | Hedef kamp | 7 oyuncu yükseltme AP | Kamp AP | Kamp bütçesi | Altı yuva ile gün | Örnek AP/gün | AP kaynağı için gün |
|---|---:|---:|---:|---:|---:|---:|---:|
| 2 | 4 | 331.031 | 1.022.700 | 70.000 | 15 | 30.000 | 45.1 |
| 3 | 8 | 2.858.264 | 9.273.600 | 182.000 | 10 | 3.900.000 | 3.1 |
| 4 | 14 | 52.325.176 | 67.451.300 | 483.000 | 14 | 3.900.000 | 30.7 |
| 5 | 18 | 197.222.720 | 120.901.200 | 462.000 | 10 | 3.900.000 | 81.6 |

Hesap gerçek CampRules.price/enrollMany/update ve TeamRules.cardQuote/upgradeCard ile çalışır. Yedi oyuncu, altı kamp yuvası ve mevcut üç günlük süre (2. Lig ve sonrasında 5 Kamp Organizasyonu ile iki gün) kullanılır. Dengeli oyunculara sıra verilerek en az kampı olanlar önce gönderilir. Akademiden renkli mezun veya transfer kullanımı hesaba katılmadığı için onlar süreyi kısaltabilir.

AP/gün yalnız belirtilen örnek portföyde otomatik talimatın temel kazancıdır. Kritik, günlük ekler, maç ödülleri ve indirimler hariçtir. Bunlar yıldız hedefinin asgari hazırlığıdır; ligde galibiyet için gereken ek oyuncu yükseltmeleri ve kadro uyumu bu hesaba dahil değildir. Portföyü kurma maliyeti, diğer kulüp harcamaları, vardiya dinlenmesi, maç izleme süresi, oyuncunun yeniden kamp gönderme sıklığı ve bütçe biriktirme beklemesi bu alt sınıra dahil değildir. Bunlar gerçek oynanış süresini uzatır. Lig 3/4 mevcut haftalık takviminde yaklaşık 112–118 oyun günü vardır; hedeflerin yetişme payı bununla karşılaştırılır.

Kamp hazırlığı, aşama hedefi içindeyken kart seviyesi 8 + 3 × mevcut kamp sayısıyla da sağlanır. Hedefi aşmak isteyen oyuncu mevcut stat/seviye sınırı hazırlığını yapar; yıldız için sert lig kilidi yoktur. Örneğin 18. kampa girişte seviye 59 yeterlidir. Bu yol, her +30 özellik sınırını doldurmaya zorlayarak kamp AP maliyetini katlamayı önler.

Altın akademi mezuniyet oranı elmaslara göre %15 / %25 / %40; kalan sonuçların %55’i gümüş, %45’i siyahtır. Ortalama başlangıç kamp karşılığı sırasıyla 4.605 / 5.475 / 6.780. Altın mezun 12 kamp karşılığıyla gelir; mora ulaşmak için 6 kampı daha vardır. Her mezunun seçilen Legendary yolu korunur; siyah sonuçta da gerekli kamplarla ulaşılabilir. Yeni mezuna doğrudan elit/signature verilmez. Mevcut kazanılmış elit kayıtlar korunur.

Legendary nadirlik ağırlıkları yalnız yeni oyuncunun hangi yeteneğe yatkın çıktığını etkiler; maç gücünü veya kullanım sıklığını artırmaz. 10.000 aday/rol dağılımı JSON raporundadır. Seçilen akademi/kamp yolu bu rastgele dağılımı aşarak belirli yeteneği hedeflemeyi sağlar. Üç hazırlık eğrisi denendi: kamp başına +2 kart seviyesi mor hedefini çok erkene çekerken, +4 seviyeyle sonraki kaynak ihtiyacı bu örnekte yaklaşık 315 günü buldu. Seçilen +3 seviyeyle altından mora kaynak alt sınırı yaklaşık 75 gündür. Otomasyon hızından hesaplanan dinlenmesiz asgari dakika JSON içinde ayrıca vardır; gerçek oturum süresi değildir. --preparation-step=2/3/4 ile deney tekrar edilebilir. Signature için ayrı kayıt/6. aşama kapısı vardır; yeni signature hareketi bu taslağa uydurularak eklenmedi.
