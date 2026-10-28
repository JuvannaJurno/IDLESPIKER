# 28 Ekim doğrulaması

- test-transfer-actions.cjs: 320/390/480px; taşma, 44px transfer hedefi, karşılaştırma açılışı geçti. Gerçek kart ekran görüntüleri incelendi.
- test-optional-match-names.cjs: native maç, varsayılan kapalı, taraflara göre isim konumu geçti. Ekran görüntüsü incelendi.
- test-name-label-cache.cjs: 12 etiket x 300 kare; sıcak yolda ölçüm/rasterizasyon sıfır. Telefon FPS ölçümü değildir.
- test-stage-transition-flow.cjs: normal/azaltılmış hareket, birleşme, yeni medya kartı kimliği, kilit/açma ve yeniden yükleme geçti.
- Eski test-transfer-shared-card.cjs ilk assertionda 3 skill bekliyor, güncel model 6 döndürüyor. Bu test güncel skill modeline taşınmadığından mevcut başlangıç assertionı başarısız; bu çalışma skill sayılarını değiştirmedi.
