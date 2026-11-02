# Aşamaların farkı ve 1. Lig'in yeni kimliği

2 Kasım 2026 — ikinci taslak. Kaynak incelemesi: room-rules.js, bal-rules.js, bal-stage.js, division-three.js, social-studio.js, social-journey.js, academy-career.js ve team.js. Önceki aşamalar referans; kuralları değiştirilmedi.

| Aşama | Oyuncunun yaptığı yeni şey | Görsel karşılığı |
|---|---|---|
| 1 — Mahalle | Elle talimatla küçük kulübü kurmak; asistanı ve ek hattı açmak; kartları geliştirmeyi öğrenmek | Başlangıç departmanları, ilk boncuklar ve daha basit saha |
| 2 — BAL | Vardiya/üretim düzeni kurmak, kamp ile kartı büyütmek; keşif ve sponsorluk yatırımı | Departman birleşmesi, daha gelişmiş hatlar, yıldız/kart dönüşümü |
| 3 — 2. Lig | Sosyal medya yayın sırası, takipçi ve ödüller üzerinden ikinci bir üretim döngüsü yönetmek | Yeni medya departmanı, ayrı mavi hat, paylaşım dalgası ve ödül görünümleri |
| 4 — 1. Lig | Hazır oyuncu aramaya ek olarak genç yetiştirmek ve beş pozisyonluk bir kulübeyi sezon içinde kurmak | Canlı akademi salonu, gerçek mezun kartı ve açılan/oyuncuyla dolan yedek yerleri |

İlk 1. Lig taslağındaki sorun: üç akademi yatırımı ve AP/bütçe projeleri vardı, fakat beş yedek yerinin birden verilmesi sezonun ortasında yeni bir şey açıldığı hissini azaltıyordu. Proje penceresindeki soyut beş simgeli yol da gerçek kadro ilerlemesini temsil etmiyordu.

## Yeni sezon akışı

| Tamamlanan 1. Lig maçı | Açılan yer |
|---:|---|
| Giriş | Yedek pasör |
| 2 | Yedek smaçör |
| 5 | Yedek pasör çaprazı |
| 8 | Yedek orta oyuncu |
| 11 | Yedek libero |

Maç atlanmış olsa da tamamlanmış maç sayılır; kazanma zorunluluğu yok. Son yer, sezonun son üç maçına girerken açılır. Bir sonraki sezon sıfırdan kulübe kurdurulmaz: kazanılmış yerler kalıcıdır. Önceki kayıttaki atanmış oyuncu hiçbir zaman kilit arkasına alınmaz.

Yeni boş yer açılınca **“Yedek … kim olsun?”** sorulur. Mevcut kadro karşılaştırma ekranı kullanılır. Oyuncu seçimi, Legendary karşılaştırması ve onay aynı görsel ailede kalır. Başka modal, maç veya tutorial varsa soru bekler. Soru görüldüğü anda kayda alınır; Sonra seçerim ile kapatılabilir ve tekrar zorla açılmaz. Boş yedek seçerken as kadrodaki oyuncu alınarak as slotu boş bırakılmaz. Dolu yedek ile as kadro arasındaki mevcut takas korunur.

Yeterli alternatif yoksa kullanıcı kilitlenmez; sonradan transfer veya akademi mezunuyla doldurabilir. Akademi otomatik olarak seçilmiş bir oyuncuyu kulübeye zorla atamaz.

## Görsel ve kullanım düzeni

- Yedek ekranı: gerçek atanmış kartlar, gelecekte açılacak pozisyonlar ve kalan maç bilgisi.
- Başında tek, aynı koşullara bağlı bir açık yer sayacı. Aynı yer için iki farklı eşik veya sahte ilerleme yok.
- Sezon planı: beş kişilik küçük kulübe. Açık boş yer seçilebilir, dolu yerde gerçek portre, kapalı yerde saat ve açılacağı maç vardır. Tıklama aynı kadro seçicisine gider.
- Soyut beş proje simgesinden oluşan ikinci yol kaldırıldı. Projelerin gerçek ödül seviyesi korunur; yedek kapasitesiyle karıştırılmaz.
- Önceden tamamlanmış as/yedek kart anatomisi, portre ve Legendary karşılaştırması yeniden icat edilmedi.
- Ana font, krem/adaçayı/teal malzeme ve mobil genişlik korunur. 1. Lig'e özgü görünüm 1–3. aşamalara yayılmaz.

## Gerçek fayda ve sınır

Yedekler maç öncesi as kadroyla değiştirilebilir ve akademi mezununa yer sağlar. **Otomatik maç içi değişiklik, yorgunluk cezası veya zorunlu rotasyon eklenmedi.** Kulübeye alınmak gizli stat bonusu değildir. İleride bu fayda büyütülecekse oyuncuya görünen, ayrı bir taslakla test edilmelidir.

## Teknik ve doğrulama

Saf eşikler TeamRules.reservePlan içindedir; kullanılabilir yerler tüm atama yollarında aynı kaynaktan gelir. Yeni açılma/görülme anahtarları idle-spiker-bench-unlocks-v1 ve idle-spiker-bench-introductions-v1. Genel ilerleme sıfırlama her iki anahtarı da temizler. Sürekli kontrol tam kadro/salon snapshot'ı üretmez; yalnız beş yedek kimliğini okur. Arka sekmede zamanlayıcı durur.

test-first-league-sequential-bench.cjs: iki gerçek seçim, as kadroyu boşaltmama, kilitli yere API ile girememe, beş eşik, eski atanmış yer, kazanılmış boş yer, yenileme, soruların tekrar açılmaması, 320/390/1280 genişlik ve Sezon planı kulübesi. test-roster-switch.cjs ayrıca as/yedek takasını, maç öncesi kadro işlemini, alternatiflere geri almayı, yeniden açmayı, koyu temayı ve mobil sınırları kontrol eder; güncel başlangıç profili/kararlı gezinme fixture’ını ve ilk aşamada tek açık yer beklentisini kullanır. Önceki aşama 9 ekonomi/kayıt ve 441 rakip karşılaştırması ayrıca korunur.

Görseller: audits/first-league-bench-two-slots.png ve audits/first-league-bench-season-plan.png. İlk taslağın doğal ekonomi turu/telefon testi gibi kalan işleri FIRST-LEAGUE-DRAFT-2026-11-02.md içinde geçerlidir.
