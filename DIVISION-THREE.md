# Türkiye Voleybol 2. Ligi — ilk sürüm

- BAL sezonu tamamlanıp kulüp ilk üçteyse lig ekranından yükselme açılır. Sıralamadaki diğer iki kulüp aynı kimlikleriyle yeni lige taşınır; kalan beş rakip yenidir.
- İlk üç dışında kalınırsa aynı alandan BAL yeniden oynanabilir. Yeni sezonun maç kimlikleri farklıdır; önceki ödüller tekrar kullanılamaz.
- Oyuncuların seviyeleri, statları, takım arması ve blok yatırımları korunur. Yeni takvim 1. günden başlar. Devam eden kamp kaydı kaybolmaz; yeni takvimde üç gün sürer.
- Departman adları ve SVG sahneleri değişir. Teknik Ekip ve Oyuncu Keşfi, Sportif Direktörlük altında birlikte görünür; işlevleri ve yükseltmeleri devam eder. Medya ve İletişim en alttadır.
- 14 maç ve 282 oyun günü, devralınan yüksek otomasyonla yaklaşık 143 dakikalık üretim hedefler: dengeli BAL'ın yaklaşık bir saat üzeri. Bu ilk tahmindir; insan kararları, izlenen maçlar ve önceki otomasyon yatırımı süreyi değiştirir.
- Sosyal menüsünde kulüp, oyuncu ve taraftar paylaşımları; beğeniler ve oyun günleri bulunur. Maç sonuçları, transferler, kamp dönüşleri ve zamanla gelen oyuncu günlükleri akışa işlenir. Kayıt yenilemede aynı olay tekrar paylaşılmaz; akış son 80 paylaşımı tutar.
- Ayarlar → Test seçenekleri → 3. aşama testi ile BAL'dan hızlı geçiş yapılabilir.
- Geçiş, kesinti sonrasında yeniden yüklemede tamamlanan bir kayıt günlüğü kullanır. BAL arşivi saklanır.

Doğrulama: `node test-division-three-rules.cjs`, `node test-division-three-browser.cjs`.

Sosyal ekran doğrulaması: `node test-social-live-ui.cjs`, `node test-social-light-ui.cjs`, `node test-social-publishing.cjs`.

- Takipçi kalıcıdır; beğeni ve yorum ekonomik kaynak değildir. Reklam ve günlük destek, takipçi sayısının 0,65 kuvvetiyle ve sponsor eşikleriyle büyür. Gelir oda kaydındaki makbuzlarla tekrar ödemeye karşı korunur. Günlük gelir gerçek oyun günü değiştikçe ödenir.
Stüdyo doğrulaması: `node test-social-studio.cjs`. Bu ilk denemenin fiyat ve gelirleri henüz tam sezon temposuyla dengelenmedi.
- Sosyal ekran sadeleştirildi: Tek gelen içerik tuşuna basılır, 7–10 saniyelik hazırlık dolumu sonunda paylaşılır. Klip, oyuncu hikâyesi ve sponsor içeriği sırayla gelir; seçim, yayın sırası, ikinci ekip ve otomatik sıra kaldırıldı. Eski kayıttaki başlamış içeriklerin ödülleri korunur.
- Canlı akış kendi alanında yaklaşık 22 piksel/saniye kayar. Dokunma, fare ve klavye ile inceleme 8 saniye duraklatır. Azaltılmış hareket tercihinde otomatik kayma kapalıdır. Gizli ekranda kare döngüsü durur. En fazla 12 gönderi tutulur; eski gönderiler ve bunlara ait beğeniler silinir.
- Oyuncu ve başka hesapların gönderileri 10–14 saniyede gelir. Otobüs, soyunma odası, tribün ve ev arka planlarına polaroid, ikili karakter, maç bileti ve taktik çizimi kompozisyonları eklendi.

- Son sosyal düzenleme: hazırlık süreleri klip 60, oyuncu hikâyesi 90, sponsor 75 saniye (Çekim Ekibi hızlandırır). Hazırlık diğer menülerde devam eder. Kompakt önizleme son tamamlanan gönderiyi saklar; yeni gönderi akışta görünür alana getirilir ve okunabilmesi için otomatik kayma 12 saniye durur. Görsel ve açıklama iş kaydındaki aynı taslaktan paylaşılır.

- Akış artık otomatik kaydırılmaz: yeni gönderiler üstte görünür, eski bir gönderi okunurken görünür konum korunur. Hazırlık önizlemesinde görselin taşıma/boyutlandırma tutamaçları, başlık ve açıklamanın metin kutusu seçim çerçeveleri görünür; paylaşılan görselde bu düzenleme işaretleri yoktur.
