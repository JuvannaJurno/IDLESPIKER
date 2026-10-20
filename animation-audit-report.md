# Hareket ve temas kontrolü — 20 Ekim 2026

Maç motorunda üç ayrı, deterministik atölye maçı tamamlandı. Mahalle, BAL ve 2. Lig aşama/stat ayarları kullanıldı; BAL ve 2. Lig mobil görünümde çalıştırıldı. Test kadroları özel skill içerir; bunlar normal kariyer ilerleme veya gerçek cihaz performans testleri değildir.

| Ayar | Skor | Skill olayı | Ölçülen servis/smaç | 15 px üzeri el–top ayrılığı | JS hatası |
|---|---|---|---|---|---|
| mahalle | 6–4 | 41 | 26 | 0 | 0 |
| bal | 3–5 | 37 | 23 | 0 | 0 |
| ikinci-lig | 5–1 | 58 | 19 | 0 | 0 |

Düzeltmeler: normal smaç çıkışını vuran ele bağlama; Hayalet Plase için doğru el ve tek kollu poz hesabı; kayarak hücumun temas pozunu hesaba katma; normal hücum pasının son bölümünü ele yaklaştırma; Kusursuz Hücum Okuma için erişim mesafesi sınırı, fileye temas öncesi varış ve havadaki blok pozunun korunması; fileden uzakta blok pozuna girilmesinin önlenmesi. Oyun, deneme modu ve animasyon laboratuvarı eşitlendi.

Ek kontroller: normal pas kaldırma, mesafeye bağlı yürüyüş/koşu adımları ve 60/120 Hz yavaş çekim sürekliliği testleri geçti. Eski servis/pancake ve bağlamsal skill testlerinde güncel fonksiyon imzaları/pozlarla uyuşmayan test kancaları var; bu iki test geçmedi ve doğrulama sayılmadı.

Açık inceleme: otomatik yakınlık taraması her maçta 12 piksel altı aynı takım yakınlaşmaları buluyor; bunlar kutlama ve ortak blok durumlarından henüz ayrıştırılmadı. Tüm çarpışmaların giderildiği iddia edilmiyor. Gerçek mobil cihazda görsel ve performans kontrolü ayrıca gerekli.
