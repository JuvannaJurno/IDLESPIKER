# Bölgesel Lig geçişi — güncel görünüm notu

Güncelleme: 24 Ekim 2026. Tasarımın tek referansı [DESIGN-SYSTEM.md](DESIGN-SYSTEM.md) dosyasıdır. Bu belge yalnız geçiş uygulamasının kısa yol haritasıdır; eski ekonomik denge değerleri için kaynak değildir.

## Lig akışı

İlk üç oynanabilir aşama Mahalle, Bölgesel Lig ve Ulusal Voleybol 2. Ligi'dir. Bölgesel Lig artık son aşama değildir. Sekiz aşamalı uzun vadeli liste görünüm rehberinde kayıtlıdır.

Sezon bitimindeki yönlendirme `league-season.js` tarafından yapılır. Mahalle tamamlanınca kulüp kimliği/geçiş akışı, Bölgesel Lig'de yükselme koşulları sağlanınca 3. aşama geçiş onayı açılır. Test menüsündeki geçişler üretimdeki sezon tamamlama koşullarını temsil etmez.

## Ortak görünüm

1→2 ve 2→3 aynı `GameUI.stage` bileşenini kullanır (`ui-components.js/css`). Üstte ortalanan sabit krem panelin başlığı, açıklaması ve “Animasyonu geç” düğmesi vardır. Lige/işlem adımına göre metin değişebilir; panel ailesi değişmez. Karanlık tema ortak tokenları kullanır.

Mevcut kulüp ekranı yerinde dönüşür. Kartlar departmanlarına toplanır; içerik aynı kart içinde değişir. `CardMotion` ailesi ve `BalVisual` sahne yakalama/geri yükleme işlevleri kullanılır. Kamera ilgili departmanı izler. 2→3'te atlama işlemi çalışan animasyonları bitirir ve kalan adımları hızlı tamamlar; kayıt/yerleşim güncellemelerini atlamaz.

## Kayıt ve temizlik

- 1→2: `bal-stage.js`, `bal-recovery.js`, `idle-spiker-bal-transition-v1`.
- 2→3: `division-three.js`, `idle-spiker-division-transition-v1`.
- Kimlik, forma/portre, kadro ve taşınan ekonomik durum için ilgili aşama kuralları kaynak alınır; bu dosyaya ikinci bir sayı listesi yazılmaz.
- Başarıda geçici panel, kart yüzleri ve sınıflar kaldırılır; departman ankrajı korunur. Hata halinde geri yükleme/kurtarma davranışı korunur.
- `prefers-reduced-motion` işlemi iptal etmez; yalnız hareketleri kısaltır.

Kontroller: `test-visual-consistency.cjs`, `test-stage-transition-flow.cjs`. İkincisi normal ve azaltılmış hareketle iki geçişi, departman sırasını ve sosyal medya kilidini denetler.
