# 29 Ekim kontrol notu

Yapılanlar: loading pepper geçici kaldırıldı (kaynak dosyalar arşivde), Mahalle departman karakterleri kaldırıldı, replikte yalnız profil adı açık/koyu temada mavi, yerel IndexedDB test günlüğü ve bağımsız kod inceleyici eklendi. Kod dialogundaki gereksiz tam ekran yüksekliği gerçek görsel incelemede bulundu ve içeriğe göre boylanacak şekilde düzeltildi.

Geçen kontroller:
- test-playtest-recorder.cjs: blok/oyuncu/transfer/kamp/maç, kaynak/RNG değişmezliği, otomatik üçüncü aşama kodu, reload, yeni oyundan önceki koda erişim, ayrı boş tarayıcı bağlamında inceleme, bozuk kod/XSS, 320–1440 ve yatay görünüm.
- test-playtest-failure-safety.cjs: veritabanı izni yokken oyun ve AP çalışır; ham kod desteği.
- test-club-introduction.cjs: seçilen isim, mavi span, on tema/viewport, normal rehbere dönüş.
- test-boot-owl-playback.cjs: artık sade loading / video isteği yok / normal kapanış.
- test-fullscreen-layout.cjs, test-club-responsive-dock.cjs, test-tutorial-highlight-input.cjs geçti.
- test-flow-density-budget.cjs: kesintisiz çoklu hat, tek Canvas, AP/bütçe tam ve bir kez.
- test-visual-consistency.cjs başlangıç taramasında ortak seçiciler ve aşama panellerini geçti.

Tam geçmeyen eski senaryolar:
- test-device-safe-area.cjs: testte tutorialChoice modalı gerçek enerji düğmesi tıklamasının önüne geldi.
- test-training-flow-limits-browser.cjs: beklenen guided-training-team otomatik rehber adımı görünmedi.
Bu iki başarısızlık tüm testlerin geçtiği iddiasına dahil edilmedi; ana değişikliklerin gerçek yeni profil, görünür hedef ve kaynak testleri ayrı doğrulandı.

Fiziksel telefonlarda bütün görünüm/performans kombinasyonlarının tarandığı veya veri kaybının imkânsız olduğu iddiası yoktur. Kayıtlar kuruldukları andan başlar; önceki hamleler geriye dönük üretilmez.
