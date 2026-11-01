# Kullanılmayan assetler

Oyunda, lablerde, editörlerde ve üretim/test araçlarında referansı bulunamayan 471 asset burada toplandı. Dosyalar silinmedi; `files/` altında eski klasör yapıları korundu. Daha önceki `no need` arşivi `previous/` altında.

`manifest.json` eski ve yeni konumları, boyutları ve SHA-256 doğrulama değerlerini içerir. Dinamik karakter, bayrak, ses ve benzeri gruplar güvenli tarafta kalmak için taşınmadı. Test ekran görüntüleri ve denetim videoları oyun asseti sayılmadı, yerlerinde kaldı.

Geri almak için bu klasörde `node restore.cjs` çalıştırın. Üzerine yazma yapmaz; önce bütün hedefleri kontrol eder.
