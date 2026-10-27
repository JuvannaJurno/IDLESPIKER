# Masaüstü beta — 27 Ekim 2026

Giriş: `index-beta.html`. Bu yalnız bir masaüstü denemesidir; onaylanan mobil tasarımın yerine geçmez.

- 1000px ve üzerinde solda dikey mevcut gezinme; yanında 300px takvim/lig/kaynak özeti; sağda geniş talimat hattı. Departman ve blok görselleri, portreler ve kart anatomisi korunur.
- Takım ekranı 1000–1399px'te üç, 1400px ve üzerinde dört kart sütunu kullanır. Koyu tema desteklenir. Küçük ekranlar tek sütuna döner.
- Maç, kaynak, satın alma, lig, yetenek ve geliştirme kodları aynen mevcut dosyalardan yüklenir; mevcut kaynak dosyalarında hiçbir değişiklik yapılmaz. Maç sahasının mobil açı/yerleşimi bu taslakta ayrıca yeniden tasarlanmamıştır.
- `desktop-beta-storage.js` yalnız beta sayfasında yerel kayıtları `idlespiker-desktop-beta:` alanına ayırır. İlk açılışta aynı kökendeki mevcut kayıt bir kez kopyalanır; beta menüsündeki ilerleme ve denemeler bu kopyaya yazılır. Gerçek sayfaya yüklenmez. Mevcut maç iframe'i aynı native maçtır.
- `desktop-beta.js` yalnız sayfa elemanlarının yerleşimini değiştirir. `desktop-beta.css` yalnız bu giriş dosyasında yüklenir. Sağ üstteki Mobil sürüme dön bağlantısı gerçek `index.html` dosyasını açar.

Giriş dosyasını mevcut HTML ile tekrar eşitlemek için `node build-desktop-beta.cjs`. Bu komut yalnız `index-beta.html` yazar; mekanik dosyalarını veya asıl giriş dosyasını değiştirmez. Beta CSS/JS referanslarını hash ile sürümler. Ortak dosyalar için mevcut `node version-assets.cjs` çalıştırıldıktan sonra beta oluşturulabilir.

Doğrulama: `node test-desktop-beta.cjs`. 1024/1440/1920px yatay sınırlar, bağımsız kayıt, gerçek talimat tıklaması, orijinal oyun kaydının değişmemesi, gezinme, dört kart sütunu ve 2. Lig departmanları. Görsel kontrol: `audits/desktop-beta-club.png`, `audits/desktop-beta-team.png`, `audits/desktop-beta-dark.png`.
