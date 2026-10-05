# BAL — güncel geçiş

Lig tamamlanınca **Sıradaki lige geç → BAL’e başla**. Test için **Ayarlar → Aşama atla → BAL**; lig tamamlama şartını atlar. BAL’den sonrası henüz olmadığı için bu düğme BAL’de pasiftir.

Geçiş ayrı bir animasyon penceresi açmaz. Kulüp ekranı açılır; mevcut blok kartları kendi departmanına toplanır. Kantin, antrenmana birleşir. İsimler doğrudan aynı ekranda değişir; gelir merkezi ve atölye görünür. Ekran ilgili departmana kayar. Hareket azaltma tercihi desteklenir.

## Yeni başlangıç
- 20 bütçe, 0 AP, 0 talimat, boş bloklar, kartlar 1. seviye, başlangıç statları.
- Takvim 1. günden, BAL ligi 0 puandan başlar. İlk maç 5. gün.
- Kulüp kimliği, oyuncu kimlikleri/görünümleri ve kadro seçimi korunur.
- Kamp gelişimi ve eski ödül kayıtları yeni aşamaya taşınmaz.
- Önceki aşama geçiş arşivinde tutulur; yarım kalan kayıt işlemi açılışta tamamlanır.

## Hızlı toparlanma
- Eski temel blokların fiyatları 10 / 15 / 25 bütçe.
- Başlangıç 20 bütçe ile asistan ve temel antrenman açılır.
- Eski asistan 2 kat hızlıdır: 1,7 / 3,6 / 6 talimat/sn.
- Temel talimat AP’si prologun 2,5 katıdır; ilk kart seviyeleri %40 daha ucuzdur.
- Gelir Merkezi, blok kurulmadan da ulaşan her 10 talimata 2 bütçe verir. Yerel Sponsor buna ek gelir sağlar.
- İlk sponsor 40, ilk yardımcı antrenör 60 bütçedir. Üst seviyelerde normal BAL fiyatları ve talimat eşikleri geçerlidir.
- Çevrimdışı AP için asistan ve vardiya hâlâ gereklidir. Çevrimdışı bütçe/takvim ilerlemez.

14 maçlık BAL, 500 talimatlık günler ve uzun vadeli blok seviyeleri korunur. Eski devralma ekonomisi için ölçülen süreler yeni başlangıca uygulanmaz.

Kontroller: `test-bal-browser.cjs`, `test-bal-rules.cjs`, mevcut prolog departman ve kart testleri.

## Son arayüz düzenlemeleri
Birleşen departmanlar dikey yerlerini korur; kantin yukarı kayarak antrenmana katılır. Yeni içerik kartın içinde kayar. Gelir Merkezi ayrı bir yeni açılışla görünür. İlk 3 seviye yalnız bütçeyle, 4 ve 5 ise bütçe + talimat eşiğiyle açılır; bu seviyelerin çubukları mordur. Kaynak kutuları AP ve bütçeyi üretim bilgisinden ayırır. Maçta kulüp renkleri ve forma şeridi uygulanır; libero ters renk kullanır. Kamp duyurusu maliyetleri gösterir; ayrı kamp penceresi ve iki adımlı ilk kullanım yönlendirmesi vardır.
