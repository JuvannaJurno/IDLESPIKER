# Masaüstü beta — ikinci taslak, 27 Ekim 2026

Giriş: `index-beta.html`. Bu ayrı bir masaüstü denemesidir; asıl `index.html`, mekanik kaynakları ve onaylanan mobil tasarım değiştirilmez.

## Yerleşim

- Sol menü ve yan yana üç dar ekran düzeni kaldırıldı. Aynı gerçek gezinme düğmeleri üst başlıkta yatay sekmelerdir. Aktif ekran krem seçim yüzeyiyle belirginleşir.
- Kulüp merkezinde kaynaklar ve gerçek Talimat ver / Maça geç düğmesi tek üst sıradadır. Başlık ve bu sıra kaydırırken erişilebilir kalır; alt içeriğin üstüne binen sabit düğme yoktur. Asıl energy-dock elemanı korunur.
- Takvim, lig ve sıradaki karşılaşma tek yatay özet yüzeyidir. Lig kendi renk/arma kimliğini korur. 1024px'te maç bölümü kendi içinde iki kısa satıra döner.
- Talimat hattı sayfanın merkezindeki geniş alandır. Kartlar 218×246px; başlıklar 14px, açıklamalar 12px. Mevcut oda görselleri, düğmeler, bağlantılar, akışlar ve ilerleme aynıdır. Hat içerik genişliğine göre merkezlenir; sığmayan uzun hat aynı doğal yatay kaydırmayı kullanır. Üretim sayıları kendi üst şeridindedir.
- Kamp/vardiya yalnız gerçekten görünür olduklarında özetle hat arasına gelir. Boş satır bırakılmaz.
- Takım kartları 1000–1199px'te üç, 1200px ve üzerinde dört sütundur. Gerçek portre kırpması ve kart anatomisi korunur; değerler/düğmeler daha okunurdur. Boş tavsiye satırı gösterilmez; tahta düğmesi tüm ekran genişliğine yayılmaz. Oyuncuya yönlendirme sabit başlığı hesaba katar.
- Koyu tema aynı yerleşimi kullanır. Baykuşun sıra boş işareti üst navigasyonun dışına taşmayacak şekilde yanına alınır. Telefon ölçüsünde beta sarmalayıcıları tek akışa döner; gerçek mobil sürüm ayrıca `index.html` olarak korunur.

## Sınırlar ve kayıt

Maç, kaynak, satın alma, lig, yetenek ve geliştirme kodları mevcut dosyalardan aynen yüklenir. Bu çalışma yalnız beta HTML/CSS ve yerleşim betiğini değiştirir. Saha açısı ve modal aileleri bu taslakta ayrıca yeniden tasarlanmaz.

`desktop-beta-storage.js` yalnız beta sayfasında yerel kayıtları `idlespiker-desktop-beta:` alanına ayırır. İlk açılışta aynı kökendeki mevcut kayıt bir kez kopyalanır; beta menüsündeki ilerleme ve denemeler bu kopyaya yazılır. Gerçek sayfaya yüklenmez. Mevcut maç iframe'i aynı native maçtır.

`desktop-beta.js` yeni mekanik veya paralel oyun başlatmaz; mevcut elemanları yerleştirir. Yalnız sayfa seçimi ve kamp/vardiya görünürlüğü değişimleri izlenir; talimat başına ek DOM ölçüm döngüsü yoktur. İlk yerleşimden sonra mevcut ekran koordinatları bir resize olayıyla yenilenir.

Girişi tekrar eşitlemek için `node build-desktop-beta.cjs`. Yalnız `index-beta.html` yazar; mekanik dosyalarını veya asıl girişi değiştirmez. CSS/JS referansları içerik hash'iyle sürümlenir. Ortak dosyalar için `node version-assets.cjs` çalıştırıldıktan sonra beta yeniden oluşturulabilir.

## Doğrulama

`node test-desktop-beta.cjs`: 1024/1440/1920px, gerçek tam ekran giriş/çıkış, bağımsız kayıt ve gerçek oyun kaydının korunması, talimatın gerçek canvas'ta görünmesi, gerçek hızlı yükselt tıklaması, üst başlığa takılmadan oyuncuya yönlendirme, Lig/Sosyal gezinmesi, 2. Lig departmanları ve koyu tema. Test ayrıca asıl HTML ve mekanik dosyalarının içerik hash'lerini karşılaştırır. Görsel kayıt sırasında yalnız geçici başarım toastları gizlenir; betanın gerçek bildirimleri değişmez.

Görseller: `audits/desktop-beta-club.png`, `desktop-beta-compact.png`, `desktop-beta-club-dark.png`, `desktop-beta-team.png`, `desktop-beta-dark.png`, `desktop-beta-second-league.png`.
