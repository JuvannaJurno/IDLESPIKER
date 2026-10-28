# Görünüm korunarak akış optimizasyonu

Kaynak karşılaştırması: 803b671.

- 11.574 rota örneğinde konum/süre aynı; 120 portföyde effects aynı.
- Sabit 120 auto/manual/social paketin önce/sonra PNG içeriği aynı.
- Biten nesnelerin tekrar kullanımında eski kaynak, kritik, ödül ve başlık kalmıyor.
- Gerçek düğme, altı hatlı kesintisiz akış, kısmi kapasite ve tek sefer ödeme testleri geçti.

Edge, 390x844, 4x CPU yavaşlatma, yaklaşık 4 saniyelik örnek:
- Önce: 22 kare, p95 333.3000000000002ms.
- Sonra: 55 kare, p95 166.69999999999982ms.
- Script CPU süresi 559 → 906ms; toplam task 3982 → 3983ms. Daha fazla talimat/kare işleniyor; bu sayıları doğrudan aynı iş yükünün CPU kazancı diye yorumlama.

Tek kısa sentetik örnek, fiziksel telefon FPS ölçümü veya kasmanın tamamen bittiği iddiası değildir. Sayı/hız/görsel kota eklenmedi.
