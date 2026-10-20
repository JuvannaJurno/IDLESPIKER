# Animasyon ve ekonomi düzeltmeleri

- Normal smaçta varıştan sonraki yaklaşık 0,18 saniyelik bekleme kaldırıldı. Son el-top hizalaması son 70 milisaniyeye alındı; yeni uçuşun ilk karesinde vuran oyuncu eski poza geri karıştırılmıyor.
- Kusursuz Hücum Okuma'nın gelecek konum kopyaları ortak çizim yardımcısıyla mavi gösteriliyor.
- Ayakla Kurtarış temasında oyuncu ve top, Pancake gibi siyah arka planda gösteriliyor.
- Kort Görüşü Rare yeteneği eklendi. Uygun hücumcuların yaklaşık dörtte birinde bulunur. Rakiplerin konumlarından boşluk seçer; hücumcu havadayken 0,5 saniye duruş ve tek açıklık aydınlatması uygular. Sonrasında normal hızla boşluğa hücum eder. Sayıyı garanti etmez.
- Transfer adayları mevcut kadroya göre üretiliyor. BAL için 92 OVR sınırı kaldırıldı. Faydalı aday olasılığı yükseltildi ve iki başarısız katalogdan sonra uygun gelişim tavanı içinde faydalı aday hazırlanıyor.
- İlk ücretsiz tutorial adayı daha güçlü ve gizli yetenekli geliyor. Tutorial OVR işaretini, karşılaştırmayı ve yeteneklerin kamp koşullarını gösteriyor. Eski tutorialı görmüş ama transfer yapmamış kayıtlar da destekleniyor.
- Kart AP fiyatı lig numarasına göre sıçramıyor; aynı güçte ve aynı gelişim durumundaki oyuncu lig değişiminde aynı fiyatı koruyor. Mahalle ligi fiyat formülü korunuyor.
- Lab görsel yardımcısını oyunla paylaşıyor ve yeni skill önizlemesini içeriyor.

## Kontroller

- `test-animation-economy-fixes.cjs`: iki ligde 100'er katalog; her seride 62 faydalı katalog, en fazla iki ardışık başarısız katalog. Gizli yetenekli tutorial adayı, eski kayıt geçişi, fiyat sürekliliği, artan OVR ile artan maliyet ve Rare dağılımı geçti.
- `test-guided-flows.cjs`: mobil yayın, gelir, kamp, kayıttan devam, OVR işareti, gizli yetenek karşılaştırması ve ücretsiz transfer geçti.
- `test-new-skill-visuals.cjs`: gerçek maçta Kort Görüşü 30 kare / 0,5 saniye duruş; sabit simülasyon zamanı, havadaki oyuncu, aydınlık açıklık ve normal devam geçti. Lab önizlemeleri hatasız; ayak kurtarışında arka plan siyah.
- `audit-match-animations.cjs`: üç kontrollü maç tamamlandı; 62 smaç/servis temasında 15 pikselden fazla el-top ayrılığı veya JavaScript hatası bulunmadı.
- `test-match-motion.cjs`: 60/120 Hz'de aynı simülasyon, duraklatma ve yumuşatılmış hareket geçti.
- `test-social-journey-rules.cjs`: ücretsiz ilk transfer ile topluluk indirimlerinin tek seferlik kullanımı geçti.

Kontrollü testler tüm olası maç ve cihaz kombinasyonlarını kapsamaz.
