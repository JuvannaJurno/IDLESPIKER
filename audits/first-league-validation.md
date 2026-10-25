# 1. Lig ve akademi — 25 Ekim 2026

İlk oynanabilir taslak. Son denge veya tüm depo testlerinin geçtiği iddiası değildir.

Geçen kontroller:

- `test-first-league-academy.cjs`: takvim, ulusal üretim, transfer gençleri, kapasite, karar zamanları, normal/elit sonuç, kazanılan yetenek, dolu kadro ve tek mezuniyet.
- `test-first-league-academy-browser.cjs`: mevcut takımı koruyan yükseliş, yeni oyundan Ayarlar ile 4. aşamaya ulaşma, tesis, transfer kararı, native salon, yön ve yetenek, kayıt hatasında geri alma, 320/390/1440 yerleşim, yeniden açılışta eğitim, mor mezun ve gerçek 1. Lig maçı.
- `test-scout-consistency.cjs`: 30 eşlenmiş katalog; stat, kamp, seviye ve kayıt tutarlılığı.
- `test-transfer-unopened-catalog.cjs`: kapalı katalog kapat/aç/yenile ve tamamlanmış katalog beklemesi.
- `test-stage-training-cost-parity.cjs`: 2/3. aşama AP maliyetleri, 456 yükseltme.
- `test-announcement-layout.cjs`: anonslarda sabit saha, tek açılış ve mobil/masaüstü/yatay yerleşim.
- `test-social-match-offline.cjs`: maçta ve çevrimdışı paylaşım kuyruğu.
- Değişen JavaScript dosyalarında sözdizimi ve `git diff --check`.

Eski testlerde görülen, aynı testler değişiklik öncesi HEAD kaynaklarıyla çalıştırılarak doğrulanan mevcut hatalar:

- `test-division-three-rules.cjs`: eski blok dizisi beklentisi Hızlı İnternet göçünü içermiyor.
- `test-weekly-division.cjs`: maksimum otomasyonda ilk maç öncesi en az 15 dakika beklentisi.
- `test-player-skill-progression.cjs`: üç skill beklerken mevcut sistem dört slot döndürüyor.
- `test-camp-skill-rules.cjs`: bütün rastgele karakterlerde Legendary bekliyor; mevcut potansiyel kuralı bunu garanti etmiyor.
- `test-match-skills.cjs`: Bölgesel Lig'de Legendary olmaması beklentisi mevcut oyunla uyuşmuyor.
- `test-open-ended-camps.cjs`: kamp uyarısının diğer gelişim sınırı uyarısından önce gelmesi beklentisi.

`test-stage-position.cjs` ayrıca aşama değişiminde sayfa `load` olayı bekleyerek zaman aşımına uğruyor; mevcut yerinde geçişi test etmiyor. Bu görevde bu eski testlerin beklentileri veya oyun dengesi değiştirilmedi.

Ekran görüntüleri `first-league-*.png` dosyalarıdır. Transfer seçenekleri sabit alanda; native salon, seçim ekranları, gerçek mor kart ve maç görsel olarak incelendi. Kulüp girişi yatay workflow dışına alındı; tüpleri kesmeden ekran genişliğinde durur.
