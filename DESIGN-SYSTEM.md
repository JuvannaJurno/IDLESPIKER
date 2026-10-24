# Idle Spiker — Görünüm ve davranış rehberi

Son inceleme ve tutarlılık düzeltmeleri: 24 Ekim 2026. Bu dosya, kullanıcının tekrar tekrar tarif etmek zorunda kalmaması için oluşturuldu.

## Bu dosyanın anlamı

- Kullanıcının açıkça istediği davranışlar aşağıdaki **korunacak kararlar** bölümündedir.
- **Kodda gözlenen** bilgi, tasarım onayı anlamına gelmez. Mevcut tutarsızlığı yeni ekranlara örnek alma.
- **Tutarsızlık kaydı** durum ve kanıt içerir. “Giderildi” kaydı yalnız uygulama ve kontrol tamamlandıysa kullanılır.
- Bir hatayı düzeltirken bileşenin düzenini, boyunu, animasyonunu veya temasını kendiliğinden yeniden tasarlama. Önce aynı bileşenin diğer kullanımını bul.
- Yeni bir varyant yalnız farklı anlam/durum taşıyorsa oluşturulur. Aynı işlevi gören iki özellik farklı birer tasarım sistemi kurmaz.
- Kullanıcının sonraki talimatı bu dosyadan üstündür. Değişen kararı bu dosyada güncelle; eskiyle çelişen bir madde ekleyerek bırakma.

## Korunacak kararlar

1. Oyun sakin, sıcak, okunabilir, mobil ölçülerinde bir idle voleybol oyunu. Gelişim görünmeli; ekranda kalabalık ve aşırı efekt oluşmamalı.
2. Mobilde onaylanan görünüm masaüstünde genişletilip başka bir tasarıma dönüştürülmemeli. Özellikle saha/müzik seçicileri birebir aynı ölçü ve düzende olmalı.
3. Kullanıcının yaptığı karakter portrelerini ve kırpma sistemini koru. Görsel sorunu düzeltmek için portreyi yeniden çizme veya farklı bir temsil koyma.
4. Normal oyuncu kartı referanstır. Elit kart aynı anatomiyi kullanır; mor çerçeve ve mora çalan iç renkler, portrede beyaza yakın zemin. Ayrı “Elit oyuncu” etiketi yok.
5. Tutorial görülünce tekrar otomatik gösterilmez. “Anladım”a basılmamış olması yeniden gösterme sebebi değildir. Kullanıcının bilerek açtığı tekrar inceleme ayrı durumdur.
6. Tutorialın rengi, kutusu, karartması, hedef vurgusu ve düğme düzeni yeni özellik başına değiştirilmez. Yerleşim hedefe göre değişebilir; görsel aile değişmez.
7. Küçük modal açıkken arka plan kararır ve arka sayfa kaymaz. Modal/tour kapandığında karartma ve kaydırma kilidi kalmaz. Normal menü gezinmesinde kalıcı karartma yok.
8. Maç anonsu tek yüzeydir. Portre/oyuncu ve yetenek/sayı sebebi aynı satırdadır. Yetenekleri ayrı aşağıdaki satıra taşıma.
9. Maç anonsunun içeriği değişince saha ve skor kartının ölçüleri oynamaz. Portre aynı kutuda kalır; takım hatasında oyuncu yerine takım arması kullanılabilir; boşsa harfli sahte portre gösterilmez.
10. Kendi ekseninde aşağı dönüş **SAYI! kutlamasından sayı sebebine geçişte** kullanılır. Normal yetenek kullanımına eklenmez. Sebep kaybolunca yeniden açılış oynatılmaz.
11. Saha ve müzik profilin içinde uzun listeler halinde durmaz. “Saha seç” / “Sayı müziği seç” düğmeleri aynı ailede ayrı seçici açar.
12. Saha iki yarıda oyunculara dönük arma kullanır. Armalı/armasız ayrıca seçilir. Ev sahibi saha kimliğini belirler. Rakip kulüplerin bir bölümünde de kalıcı arma kullanılır; yalnız İstanbul'a özel değildir.
13. Beyaz tahtada doodle olabilir; kara tahtada doodle yok. Doodlelar boşluklara dağıtılır, yazıya/portreye girmez. Rakip portresi sağ üstte bantla iliştirilmiş fotoğraf gibi; altında güçlü yönünü anlatan lakap olabilir.
14. Tüp/akış geliştirmeleri mevcut oyunun sıcak temasına oturur. Kullanıcının el talimatı fark edilir; medya dalgası sadece mavi medya tüpünden gider. Tüm departmanı düz maviye boyama.
15. Alternatif tasarımlar `player-card-design-lab-v3.html` içindedir. Alternatif üretmek, üretimde hepsini uygulamak veya seçilmiş saymak değildir.

## Tema kaynakları ve bileşen anatomisi

Ortak bileşen tokenlarının kaynağı `ui-components.css`, davranış/kabuk fabrikasının kaynağı `ui-components.js`tir. Tutorial, aşama bildirimi, seçici, modal arka planı ve açık/koyu varyantları buradan beslenir. Oyuncu kartı, medya bloğu ve maç gibi anlamlı aileler kendi dosyalarını korur. Son CSS sırasını ve gerçek hesaplanmış stili kontrol et; ilk gördüğün renk güncel referans olmayabilir.

| Alan | Gerçek kaynaklar | Korunacak aile |
| --- | --- | --- |
| Kulüp kabuğu, kaynaklar, kartlar | `menu.css`, `menu-game.css`, `bal-stage.css`, `theme.css` | Krem kâğıt yüzeyler, yumuşak yeşil/teal yazı, sıcak altın eylemler, yuvarlak köşe, kısa alt gölge |
| Ortak eylemler | `.team-action`, `.team-secondary`, `.close-dialog`; `team.css`, `theme.css` | Yeni düğme stili üretmeden mevcut eylem hiyerarşisini kullan |
| Oyuncu/transfer kartı | `styles/ui/player-club-card.css`, `styles/ui/transfer-center.css`, `team.css` | Pozisyon/numara başlık, portre/OVR/yıldız, isim, gelişim, özellikler; elit aynı sıra |
| Rehber | `onboarding.js`, `menu-game.css`, `ui-components.css` | Hedefe bağlı tek ipucu kutusu + kesikli değil, hedefi açık bırakan spotlight |
| Profil ve seçiciler | `player-profile.js`, `player-profile.css`, `court-picker.js`, `ui-components.js/css` | Profilde kısa giriş, ayrı modalda seçim; aynı başlık/kapat/iç kaydırma/alt eylem düzeni |
| Tahtalar | `blackboard.js`, `board-presentation.js/css`, `board-doodles.js/css` | Aynı öneri anatomisi; kara ve beyaz yüzey anlamlı varyant |
| Akış | `flow-lanes.js/css`, `flow-effects.css`, `flow-media-theme.css` | Atölye kablosu; altın normal, mavi medya; kaynak başlığı ve blok tepkisi uyumlu |
| Maç | `mac.html`, `match-mobile.css`, `match-announcement.css`, `match-presentation.js`, `match-server.js` | Maç teması kendine ait fakat aynı sıcak kâğıt dili; anons düzeltmesi saha ölçüsünü değiştirmez |
| Saha çizimi | `match-court-surface.js`, `social-journey-rules.js` | Oyun ve seçici aynı çizim işlevlerini kullanır |
| Aşama geçişi | `bal-stage.js/css`, `bal-visual.js`, `division-three.js/css`, `card-motion.js` | Mevcut kulübün yerinde dönüşmesi; ortak `GameUI.stage` üst paneli |

### Kodda gözlenen renkler

Bunlar yeni bir palet önerisi değil, mevcut referanslardır:

- Seçici kâğıdı `#f9f5e6`, yazı `#466b70`, sınır `#fff9e7`, önizleme yüzeyi `#e9eddd`.
- Ortak tutorial kutusu `#fff7dd`, yazı `#665437`, sınır `#e4cd96`; gölge `#516b7926`.
- Tutorial spotlight `rgb(17 29 38 / 68%)`.
- Normal modal arka planı `rgb(24 43 41 / 60%)`, 2px arka plan blur'u. Karanlık tema aynı bileşenin `--ui-backdrop` tokenını kullanır.
- Maç kâğıdı `#fff7e5`, ana yazı ailesi `#426b72` çevresinde.
- Karanlık tema ana aile `#192d31`, `#293d3b`, yazı `#e1e8d7`; ortak seçiciler ve tanıtımlar aynı `--ui-paper`, `--ui-ink`, `--ui-muted` ailesini kullanır. Medya/elit gibi anlamlı renk varyantları ayrı kalır.
- Mavi medya bloğu kendi okunabilir başlık/metin/kilitli panel/düğme/seviye noktası paletini `flow-media-theme.css`ten alır. Yalnız arka planı maviye çevirmek eksiktir.

## Tutorial: tek davranış, bilinen istisnalar

### Ortak sistemin bugünkü işleyişi

- Sahibi `onboarding.js`, API `GuidedTutorial`.
- Görünür yüzey `#learningHint`, karartma `#learningSpotlight`, hedef sınıfı `.learning-focus`.
- Kutunun başlangıç CSS'i 280px genişlik, en çok `100vw - 20px`, 11px/13px iç boşluk, 12px köşe, 12px metin / 1.5 satır oranı. Dosyada ek kurallar bulunduğundan son hesaplanan stili kontrol et.
- Hedefin görünen/kırpılan bölgesi hesaplanır; ipucu nav, ekran kenarı ve eylem düğmesinden kaçınır. Hedef kapalı/başka menüdeyse havada işaretçi bırakılmaz.
- Modal içindeki hedef için ipucu ve spotlight o modalın içine taşınır. Top-layer yerine sadece z-index artırmak çözüm değildir.
- Bilgilendirme adımı: “Devam” / son adım “Anladım”. Eylem adımı: hedefi kullanarak ilerler; erteleme eylemi farklı metin taşıyabilir. Bunlar yeni kutu tasarımı değil, aynı bileşenin durumlarıdır.
- Kalıcılık: `idle-spiker-onboarding-v1`, `idle-spiker-guides-v2`, `idle-spiker-tutorial-seen-v1`. Görülen adım/tur gösterim sırasında işaretlenir; geçiş veya menü değişimi bu bilgiyi sıfırlamamalı.
- Manuel tekrar: `tutorial-review.js`; otomatik ilk-görüş davranışıyla karıştırma.
- Kamp giriş yönlendirmesi de `GuidedTutorial` kullanıyor (`camp-intro`); eski `idle-spiker-camp-tour-v1` anahtarı ayrıca mevcut.

### Profil ödülleri de ortak rehberi kullanır

İlk saha ve sayı müziği ödülleri artık ayrı dialog açmaz. `GuidedTutorial`, profil düğmesini aynı ipucu/spotlight ile gösterir ve ilgili seçiciye nasıl ulaşılacağını anlatır. Tur kimlikleri `profile-reward-court` ve `profile-reward-music`tir. Profil düğmesine dokunmak veya Anladım ile kapatmak mümkündür.

Eski `idle-spiker-profile-reward-help-v1` görüldü kayıtları korunur. Daha önce ayrı tanıtımı gören oyuncuya yeni biçimde tekrar gösterilmez. Ayrı `#profileUnlockHelp` kaldırıldı; yeni özelliklerde kopyalanacak alternatif tutorial kabuğu yok.

## Aşama geçişleri: ortak görünüm

Her iki geçiş de `GameUI.stage` kullanır. Görsel kaynak `ui-components.css` içindeki `.stage-transition-banner`dır. Başlık, açıklama ve “Animasyonu geç” aynı anatomidedir; konum fixed, üst 12px, ortalı, en çok 440px, köşe 17px. Eski `.bal-live-banner` / `.division-banner` sınıfları tanıma/test için durur; ayrı görsel kuralları yoktur.

1→2, `BalVisual.play` ile; 2→3, aynı `CardMotion` kart toplama/yenileme ailesiyle kendi departman adımlarını yürütür. İçerik ve departman sırası lige göre farklıdır, bildirim görünüşü değildir. İki geçişte de atlama, kayıt işlemini atlamaz. İkinci geçişte çalışan animasyonlar bitirilip kalan adımlar hızlandırılır.

Kulüp yerinde dönüşür; ilgili departmana kontrollü odaklanılır; kart kimliği kaybolmaz; keskin reload olmaz; kayıt geçişi güvenli yapılır; reduced-motion desteklenir; bitince geçici yüzeyler temizlenir. Üretim geçişini yalnız test düğmesinin görünüşüne bakarak doğrulama.

## Animasyonun hangi olaya ait olduğu

| Olay | Kullanılacak hareket / kısıt |
| --- | --- |
| Aşama dönüşümü | Mevcut kartlar departmana toplanır, yerinde içerik değişir; `CardMotion` ailesi |
| Kart içeriği değişmesi | `CardMotion.reveal`; eski yüz yukarı, yeni yüz aşağıdan, ölçü kontrollü |
| Yeni özellik vurgusu | Mevcut tutorial/odak ailesi; her seferinde yeni pencere/karartma uydurma |
| Maç tanıtımı | Gerçek kadro/saha tanıtım sırasında yüklenir, simülasyon bekler; tanıtım sonu hazır maç başlar |
| Sayı kazanılması | Mevcut skor sayfası dönüşü; tek kutlama, tekrar açılış yok |
| SAYI! → sayı sebebi | Anons yüzeyi merkez ekseninde aşağıya 180° döner; `turnPointExplanation`, `.notice-turn-leaf`, ön/arka yüz |
| Normal yetenek kullanımı | Aynı satırda bilgi değişir; sayı-sebebi dönüşü burada kullanılmaz |
| Sayı sebebi sona ermesi | Normal anonsa döner; ikinci bir açılış/dönüş tetiklenmez |
| Saha/müzik seçimi | Ayrı native dialog, otomatik kayıt, Tamam/×/Escape ile profile dönüş |

Ortak hareket kaynağı `card-motion.js`: ease `cubic-bezier(.22,1,.36,1)`, kart toplama ease `cubic-bezier(.45,0,.2,1)`. Her hareketi tek süreye zorlamak yerine olayın anlamını koru. Reduced-motion açıldığında işlem/kayıt/temizleme devam eder, uzun hareket kaldırılır.

## Maç anonsu sözleşmesi

- `#serveTeam` tek canlı anons; dönüşteki kopyalar aynı CSS'i kullanır ve ID taşımaz.
- Geometri tek sahibi `match-announcement.css` ve `--announcement-height:62px`tir. Canlı şerit, portreler ve dönüş kopyaları aynı tanımı kullanır. Önceden anons henüz kurulmamışken eski 66px alt sınırı etkiliydi; bu başlangıç/kopya çakışması temizlendi. İçerik/sayı durumu saha konumunu değiştirmez.
- Normal portre 38×38px; dar yatay görünümde 28×32px. Oyuncu görseli cover, takım arması contain + 4px iç boşluk.
- Yetenek varken aynı satır: portre / oyuncu bilgisi / yetenek-sebep / forma numarası. Yoksa portre / oyuncu / numara. Boş alt satır yok.
- Uzun isim tek satır kısalabilir; tam metin DOM/erişilebilir açıklamada tutulur. Yetenek en fazla üç kısa satır, ayrı aşağı şeride dönüşmez.
- Portre önceden decode edilir; eski portre/forma/harf geçici olarak sızmaz. Kopya ve canlı kutu aynı ölçüdedir.
- Sayı sebebi dönüşünün sahibi `match-server.js`; CSS-only yeni döndürme ekleyerek farklı olaylara yayma.
- Animasyon cleanup: sonraki sayı, reset, süre sonu ve animasyon sonu geçici yaprakları temizler. `transform` ile hareket eden ölçüyü kalıcı kutu boyutu sanma.
- Yakın geçmişte reddedilen denemeler: yeteneği ikinci satıra taşımak; sonra boş alt satırı yalnız ortalamayla örtmek; normal yeteneğe dönüş eklemek. Bunları “eski iyi tasarım” diye geri getirme.

## Maç içi AP baloncukları — ilk deneme

Kaynaklar: `match-ap-bubbles.js/css`; galibiyet ödülü önizlemesi `match-gateway.js` içinden `matchInfo.victoryAP` ile gelir.

- Mevcut AP ekonomisini değiştirmez. AP yalnız mevcut maç sonuç/kayıt sistemiyle verilir; efekt storage'a yazmaz veya yeni ödül istemez.
- **Galibiyet AP** sayacı sürekli görünmez. Pozitif AP baloncuğu tetiklenince köşeye yukarıdan girer; otomatik toplama bittikten yaklaşık 3 aktif saniye sonra kaybolur. Yeni kazanım süreyi yeniler; duraklatma/arka sekmede süre bekler. Galibiyet koşulunu gizleyip, henüz kesinleşmemiş ödülü kesin kazanç gibi sunma.
- Bizim kazandığımız sayıda, maç ödülünün beşte biri kadar görsel baloncuk sahanın sağ kenarında belirir ve sayaca süzülür. Görsel toplam ödül tavanını aşmaz; uzatmada ek ödül üretmez.
- Başarılı sayının öncesinde bizim legendary kullanımımız varsa baloncuğun çevresinde takım renginde hafif vurgu olur. Her skill kullanımında ek AP veya yeni baloncuk yok.
- Normal AP baloncuğu 2,2 saniye sürer; önce belirgin kalır, sonra sayaca süzülür. Uçuşun tamamına hızlı ease-out uygulayıp görünür beklemeyi kısaltma.
- Aynı anda en çok iki baloncuk. Efekt tıklama istemez, işaretçi yakalamaz, saha/scoreboard ölçüsünü değiştirmez. Krem/altın yüzey, sakin teal yazı; anonsla yarışan büyük mesaj yok.
- Duraklatma/arka sekmede hareket bekler. Azaltılmış harekette uçuş yerine kısa belirme/sönme kullanılır. Maçı atla ve reset efektleri temizler.
- Maç sonunda gerçek ödül cevabı geçerlidir; yenilgide 0 AP olabilir. Sonuç ekranındaki mevcut AP hücresi “Maçtan kazanılan AP” der; ayrı mükerrer ödül kartı eklenmez.
- Görsel referans: `audits/match-ap-bubbles-mobile.png`. Kontrol: `test-match-ap-bubbles.cjs` (otomatik toplama, pause/resume, legendary, kaynak değişmemesi, yenilgi tutarı ve saha sabitliği).

## Paylaşım → takipçi sayacı

Kaynaklar: `social-studio.js`, `social-follower-counter.js/css`.

- Başarılı ve kaydı tamamlanmış yayın, post kimliği/olay kimliği, kazanılan takipçi ve gerçek toplamla `spiker-social-published` olayı üretir.
- Gerçek takipçi ödülü mevcut paylaşım işlemiyle hemen kaydolur. Uçuş yalnız görseldir; takipçi/bütçe ödülünü yeniden vermez.
- Paylaşılan posttan, üst sayaçtaki **aynı takipçi simgesi** çıkar. Yeni bir ikon ailesi yok. Yanında küçük +takipçi miktarı olabilir.
- Üst takipçi sayacı, uçuşta olan yayın miktarını geçici olarak görsel toplamdan ayırır; simge ulaştığında artış animasyonu başlar. Düzenli render bu beklemeyi atlamaz.
- Sosyal medya başlığı kaydırırken üstte kalır; hedef sayaç görünürdür. Kaynak post ekran dışındaysa uçuş ekranın post yönündeki görünür kenarından başlar; oyuncunun scroll konumu zorla değiştirilmez.
- En çok üç simge aynı anda uçar; yayın olayı kimliği tekrar edilirse efekt/kazanç çoğalmaz. Kuyruk, hedefe göre işlem görür.
- Menüden ayrılma, pencere boyutu değişimi veya arka sekmeye geçişte geçici simgeler temizlenir, görünüm gerçek toplama eşitlenir. Geri dönünce eski yayın efektleri tekrar oynatılmaz.
- Çevrimdışı/maçta yayınlar normal devam eder; görünmeyen sosyal ekran için uçuş bekletilmez. Reduced-motion seçeneğinde uçuş yok, sayı doğrudan güncellenir.
- Açık/koyu görünüş mevcut sosyal medya değişkenlerinden gelir. Efekt işaretçi/tıklama yakalamaz ve post yerleşimini değiştirmez.
- Görsel: `audits/social-follower-flight-mobile.png`. Kontrol: `test-social-follower-flight.cjs` ve `test-social-match-offline.cjs`.

## Maç saati bildirimi

Kullanıcının 24 Ekim son kararıyla otomatik maç bildirimi geri açıldı. Sahibi `match-arrival.js`, görünüşü `menu-game.css` içindeki `#matchArrival`dır; önceki krem/altın, saat simgeli kısa modal ailesi kullanılır.

- Kulüp ekranında maç gerçekten hazır olduğunda bir kez açılır. Başka modal/tutorial, aşama geçişi, açık maç veya arka sekme üstüne binmez.
- “Maça hazırlan” mevcut kadro onay ekranına götürür; “Önce kulübe bak” kapatır. Maçı kendiliğinden başlatmaz.
- Görülmüş maç kimliği `idle-spiker-match-arrival-seen-v1` ile korunur. Aynı maç için gezinme/yenileme sonrasında tekrar gösterilmez; yeni maçın kimliği geldiğinde tekrar açılabilir.
- Kontrol: `test-match-arrival-restored.cjs`; görsel: `audits/match-arrival-restored.png`.

## Legendary sıklığı — oyun içi kullanımlar artırıldı

Kullanıcının 24 Ekim kararı: servis legendary'leri görünürken oyun içi legendary'ler çok seyrek kalıyordu. Eski ayarda servis ilk fırsatı kullanıyor ve ortak 14 saniyelik bekleme ile %10 ikinci legendary şansı, sonraki oyun içi kullanımları bastırıyordu.

Güncel kaynak `match-skills.js` içindeki `legendaryCadence`tır:

| Parametre | Önce | Güncel |
| --- | --- | --- |
| Servis legendary seçim çarpanı | 1,18 | 1,18 |
| Oyun içi legendary seçim çarpanı | 1,18 | 2 |
| Servis legendary beklemesi | 14 sn | 14 sn |
| Legendary servisten sonra oyun içi legendary beklemesi | 14 sn | 2,5 sn |
| Oyun içi legendary'den sonra diğer oyun içi legendary beklemesi | 14 sn | 8 sn |
| Bir rallide ikinci legendary şansı | %10 | %45 |
| Ralli başına üst sınır | 2 | 2 |

İki bekleme ayrı izlenir; oyun içi sıklık artışı servislerin ağırlığını yükseltmez. Genel skill deneme olasılığı, normal skill beklemesi, sahiplik/kamp koşulları, zor top/pozisyon uygunluğu ve tekrarlanan son skill kısıtı korunur. Açılmamış legendary'ler sıklık ayarıyla açılmaz. Animation lab'in özel gösterim oranı ve 2,2 sn beklemesi korunur.

Doğrulama: `test-legendary-cadence.cjs`, gerçek maç motorunda aynı 12 seed'i eski ve yeni ayarla oynatır (24 maç). Legendary'leri açık örnek kadrolarda 107 sayı boyunca oyun içi kullanım **21 → 28** (+%33), servis kullanımı **19 → 19** oldu. Bu örneklem oyuncunun her maçına garanti oran değildir. Ralli başına en çok iki legendary ve kilitli oyuncularda sıfır legendary de kontrol edilir. Rapor: `audits/legendary-cadence-comparison.json`.

## Ev sahibi saha kimliği ve takım tanıtımı

- Rakip sahalarında arma kararı `MatchCourtSurface.teamCrest(name)` ile takım adına bağlı ve sabittir. İstanbul korunur; diğer kulüplerin yaklaşık üçte biri armalı, kalanlar armasızdır. Örneğin mevcut Türkçe adlarda Karadeniz Gücü ve Uludağ Akademi de armalıdır. Her maçta rastgele yeniden seçilmez.
- Her ligde en güçlü üç rakip, maç motorunun pozisyona göre gerçek oyuncu gücü ortalamasıyla belirlenir; lig tablosundaki anlık sıralama kullanılmaz. Bu üç kulübün ev sahibi sahasında takım renklerinden türetilen özel zemin/dış alan tonu ve hafif doku bulunur. Diğer rakipler lig varsayılanını kullanır. Sıralama lig/kimlik bazlıdır; maçtan maça rastgele renk seçilmez. Kaynak `ClubJourney.matchCourt`, çizim varyantları `MatchCourtSurface.featuredCourt`; kontrol `test-featured-courts.cjs`. Gerçek maç aktarımı/profil önceliği ayrıca `test-court-match-integration.cjs` ile denetlenir.
- Kullanıcının son kararı: lig varsayılanları klasik ve şık parke ailesidir; beyaz/mor gibi özel tam zemin renkleri ödül seçimi veya güçlü rakibin özel sahası içindir. Mahallede sade, birleşim çizgileri görünen tahta parke vardır; render edilen hakem ve hakem platformu yoktur. Diğer liglerde hakem korunur. Bu çizim kuralı lig kimliğine bağlıdır; profil sahası seçimi hakemi geri açmaz.
- Varsayılan zemin ve takım renkleri bütün sahalarda devam eder. Biz ev sahibiyken profilin Armalı/Armasız seçimi otomatik kulüp kararının önüne geçer; deplasmanda rakibin saha kimliği kullanılır.
- Takım tanıtımında takım adının altındaki mevcut açıklama satırına **EV SAHİBİ / DEPLASMAN** küçük rozeti eklenir. İki taraf değiştirildiğinde rozet de gerçek fikstüre göre değişir. Bizim takım her zaman ev sahibi varsayılmaz.
- Üst karşılaşma isimleri ev sahibi / deplasman sırasında yazılır. Yeni tanıtım penceresi, portre değişimi veya maçın sahasına etki eden geometri yok.
- Kaynaklar: `match-court-surface.js`, `match-gateway.js`, `match-intro.js`, `menu-game.css`. Kontroller: `test-match-venue.cjs`, `test-match-preload.cjs`. Görsel: `audits/match-intro-venue.png`.

## Profil kimlik kartı

- Mevcut gerçek portre ve kırpma kaynağı korunur. Normal kutu 76×90px, dar mobilde 68×81px; çerçeve 1px, köşe 12px. Bronz/gümüş/altın ödül çerçevesi ince sınır rengiyle görünür, kalın bantla değil.
- Kart kremden açık adaçayına yumuşak yüzey, 1px sınır ve 16px köşe kullanır. İçerik tek sıra portre + sol hizalı isim/açıklama/ülke; fazladan simge veya bilgi yok.
- İsim 22px (dar mobil 20px), açıklama 10px; ülke ince sınırla küçük bir satır rozeti, bayrak 18×13px. Uzun isim sarılır, taşmaz.
- Açık/koyu tema birlikte tanımlıdır. Bu değişiklik profil kimliğine özeldir; oyuncu kartları ve maç portreleri aynı ölçülere çevrilmez.
- Kaynak `player-profile.css`. Görseller `audits/profile-identity-light.png`, `audits/profile-identity-dark.png`; uzun isim ve 320/390/1440px görünümü kontrol edildi.

## Profil seçicileri sözleşmesi

- Profil yalnız kısa giriş düğmesi ve mevcut seçim özetini gösterir.
- Saha ve müzik modalları: genişlik `min(366px, 100vw - 24px)`, yükseklik `min(776px, 92dvh)`. Desktopta büyütme yok.
- Başlık/kapat üstte sabit; yalnız içerik kayar; Tamam ve otomatik kayıt bilgisi altta sabit. Kapatınca asıl profil açık kalır, odak açan düğmeye döner.
- Saha: büyük gerçek çizim önizlemesi, Armalı/Armasız, ikişerli paketler, takipçi kilidi, Lig sahası varsayılanı. Seçim ev sahibi maçlarında geçerli.
- Müzik: en fazla iki seçim, ayrı dinleme düğmesi, Müziksiz seçeneği. Kapanınca preview sesi durur. Sayaç/maç müziği davranışını seçim ekranını değiştirirken değiştirme.
- İki pencere `GameUI.selection` ile aynı kabuktan üretilir: başlık/kapat, içerik kaydırması, alt eylemler, Escape, odak geri dönüşü ortak. Eski 760px/366px üst üste kurallar ve profil içi saha listesi stilleri kaldırıldı.

### Saha paketleri ve lig varsayılanları

Kaynak: `social-journey-rules.js`. Kilit follower değerine değil **ödülün alınmasına** bağlıdır.

| Takipçi ödülü | Paket | İki zemin |
| --- | --- | --- |
| 2.500 | Doğal zeminler | Açık akçaağaç, Adaçayı |
| 5.000 | Serin arena | Gece mavisi, Buz beyazı |
| 10.000 | Sıcak tribünler | Kil ve kiremit, Bal rengi |
| 25.000 | Final ışıkları | Lavanta, Topluluk halkaları |

Kullanıcının 24 Ekim kararıyla orijinale çok benzeyen “Kulüp klasikleri” paketi kaldırıldı. Sade parke ve Klasik turuncu yalnız lig varsayılanı olarak korunur; özel seçici seçenekleri/500 takipçi ödülü değildir. Eski bu seçimler Lig sahası varsayılanına döner. İlk saha paketi artık 2.500 takipçide açılır; tanıtım da gerçekten bir saha paketi alındığında gösterilir.

Armalı/armasız ayrı ödül veya iki ayrı saha değildir; her zeminin kullanım ayarıdır. Standart arma boyutu 150 çizim birimi; özel lab dev arma denemesi ayrı varyanttır.

| Aşama | Lig | Varsayılan |
| --- | --- | --- |
| 1 | Mahalle Spor Kulübü – Yerel Altyapı | Basit tahta parke; hakem yok |
| 2 | Bölgesel Voleybol Ligi | Klasik parke · adaçayı çevre |
| 3 | Ulusal Voleybol 2. Ligi | Klasik parke · mat mavi çevre |
| 4 | Ulusal Voleybol 1. Ligi | Klasik açık parke · yeşil çevre |
| 5 | Voleybolun Sultanları Ligi | Klasik parke · mat mor çevre |
| 6 | Milletler Kupası karşılığı; son adı belirlenmedi | Klasik açık parke · gri mavi çevre |
| 7 | Dünya Şampiyonası | Klasik parke · koyu yeşil çevre |
| 8 | Olimpus Küresel Oyunları — Büyük Final | Klasik parke · koyu mavi çevre |

İlk üç aşama uygulanmış durumda. Sonraki beş aşama için burada görünüm eşlemesi bulunması, o liglerin oynanabilir olduğu anlamına gelmez.

## Topluluk Yolculuğu girişinde hazır ödül

- Normal giriş aynı sade karttır. Alınabilir ödül olduğunda mevcut ikon setinin `award` simgesi, küçük ödül sayısı rozeti ve **Ödülü al ›** eylemi görünür.
- Başlık Topluluk Yolculuğu olarak kalır; alt metin “N ödül açıldı” der. Krem/altın hazır durum, açık/koyu temada okunaklıdır. Sürekli yanıp sönme veya yeni büyük panel yok.
- Kartın tamamı aynı ödül yolculuğu ekranını açar; sağdaki eylem görünüşü ayrı iç içe düğme değildir. Ödül hazır değilken sayı rozeti ve altın eylem görünmez.
- Kaynak: `social-journey.js/css`, ikon eşlemesi `ui-icons.js`. 320/390px taşma, iki tema ve ödül ekranına giriş kontrol edildi. Görseller: `audits/journey-ready-reward-light.png`, `audits/journey-ready-reward-dark.png`.

## Transfer eylemleri

Kullanıcının 24 Ekim kararıyla **Sonraki kataloğa sakla** düğmesi transfer kartından kaldırıldı. Kartta karşılaştırma ve transfer eylemi kalır. Eski saklama kayıtlarını temizlemek veya katalog ekonomisini değiştirmek bu görsel değişikliğin kapsamı değildir. Kaynak `scouting.js`; gerçek katalogda düğmenin yokluğu `test-transfer-pointer.cjs` ile kontrol edildi.

## Diğer anlamlı varyantlar

- Blok: kilitli / kurulabilir / yükseltilebilir / tamam / ek özellik kilitli / ek özellik açık. Bunlar aynı kart anatomisi.
- Medya ile güçlenen blok: ana/ek panel, yazılar, düğme, seviye noktaları uyumlu mavi aile. Departman sanatını düz boyama. Kaynak `flow-media-theme.css`.
- Vardiya: çalışma / dinlenmeye kalan süre / maç mesaisi. Aynı kart ailesi ve hizalama. Mesai üretim hızını azaltmaz. Çevrimdışı rapor aynı alanda geçici görünür, ince countdown bitince normal haline döner.
- Kamp: gidebilecek oyuncu yoksa giriş görünmez. Yeni kamp hazır olduğunda ilgili bölüm kullanıcıya görünür hale gelir; her seferinde tutorial yeniden başlamaz.
- Oyuncu: normal / elit; ilk yedi / yedek / transfer karşılaştırma. Portre sistemi ve kart anatomisi korunur.
- Tahta: kara tahta ve beyaz sportif direktörlük. Fark yüzey/çizim dilinde; öneri ve yönlendirme mantığı ortaktır.
- Talimat: otomatik, oyuncunun manuel talimatı, sosyal medya dalgası. Kaynakları ayırt et; medyayı normal hatta gönderme. Boyut/renk ödül ödemesini etkilemez.

## Tutarsızlık kaydı — 24 Ekim düzeltme durumu

| Kimlik | Durum | Yapılan ve kanıt |
| --- | --- | --- |
| VIS-01 | Giderildi | İki aşama da `GameUI.stage` kullanıyor; aynı fixed panel/başlık/açıklama/atlama. Gerçek iki geçiş, normal/reduced hareket ve atlama test edildi. |
| VIS-02 | Giderildi | Profil ödülleri ortak `GuidedTutorial`a taşındı; eski seen kayıtları korunuyor. İki ödül ayrı birer kez, eski kayıtla hiç gösterilmiyor. |
| VIS-03 | Giderildi | `BAL-DESIGN.md` güncel uygulama yol haritasıyla yeniden yazıldı; “BAL sonrası yok” ve kopya eski ekonomi iddiaları kaldırıldı. |
| VIS-04 | Giderildi — geometri | Canlı/kopya anons geometrisi `match-announcement.css`e taşındı; eski container/çocuk ölçü çakışmaları çıkarıldı. Skor/sayı animasyonlarının anlamı korundu. Tarihsel renk/animasyon kurallarının tümünü yeniden tasarlama çalışması yapılmadı. |
| VIS-05 | Giderildi | Profil CSS'indeki inline saha listesi ve 760px/366px tekrarlı seçici kabukları kaldırıldı. Ortak CSS tek ölçü kaynağı. |
| VIS-06 | Giderildi | Yanıltıcı `no-screen-dimming.css` kaldırıldı. Ana UI ortak tokenları kullanıyor; bağımsız maç/lab sayfaları açık isimli `modal-backdrop.css` kullanıyor. |
| VIS-07 | Giderildi — ortak aileler | Tutorial, aşama paneli, seçici ve modal açık/koyu tokenları ortaklaştırıldı. Seçici seçili/kilitli durumları ve medya bloğu kontrastları iki temada kontrol edildi. Her eski ekranın bütün tema/dil kombinasyonları tarandı iddiası yok. |
| VIS-08 | Giderildi | Saha/müzik pencereleri `GameUI.selection` ile aynı DOM/kapat/odak kabuğunu kullanıyor. Mobil/masaüstü ölçü ve tema paritesi test edildi. |
| VIS-09 | Giderildi | Anons testleri aynı satır, sabit saha, sabit portre ve yalnız sayı sebebinde dönüşü denetliyor. Profil ödül testi yeni ortak tutorialı denetleyecek şekilde güncellendi. |
| VIS-10 | Giderildi | Eski başlangıç 66px alt sınırı ile son 62px kuralı çakışması tek geometri tanımıyla kaldırıldı. Portreli gerçek anons ve bütün sayı evreleri farklı viewportlarda kontrol edildi. |

### Bu düzeltmelerin sınırı

Yeni bir görsel tema tasarlanmadı. Ortak bileşenler, tema varyantları ve kayıtlı davranışlar birleştirildi. Oyuncu portresi, elit kart anatomisi, tüp ekonomisi veya maç fiziği değiştirilmedi. Tarihsel CSS'in bütün dosyalarda tümden tokenlara taşınması ayrı teknik bakım konusudur; burada giderilmiş gibi gösterilmez.

## Görsel referanslar ve doğrulama

- `audits/consistency-court-light.png`, `audits/consistency-court-dark.png`: ayrı saha seçici ailesi; mobil örnek. Masaüstü aynı ölçüde olmalı.
- `audits/consistency-stage-one.png`, `audits/consistency-stage-two.png`: aynı panel ailesini kullanan iki gerçek aşama geçişi.
- `audits/consistency-tutorial-light.png`, `audits/consistency-tutorial-dark.png`: ortak tutorial ailesi.
- `audits/announcement-stable-row.png`: son test çalıştırıldığında güncellenen aynı-satır anons örneği. Bu dosya değişebilir; kalıcı onaylı tasarım arşivi değildir.
- `audits/media-blocks-light.png`, `audits/media-blocks-dark.png`: medya bloklarının iki tema örnekleri.
- `player-card-design-lab-v3.html#court-design-lab`, `#elite-design-lab`, `#flow-design-lab`: karşılaştırma laboratuvarları; üretim onayı değildir.

İlgili kontroller (gereken alanı seç, hepsini körlemesine koşturma):

- Ortak görünüm ve kayıt uyumu: `test-visual-consistency.cjs` (iki seçici, iki tema, viewport paritesi, eski tutorial kayıtları, iki gerçek geçiş ve atlama).
- Tutorial: `test-tutorial-seen-once-browser.cjs`, `test-tutorial-visual-regressions.cjs`, `test-tutorial-scroll.cjs`.
- Aşama: `test-stage-transition-flow.cjs`, `test-stage-seamless.cjs`, `test-league-next-transition.cjs`; eski fixture varsayımlarını doğrula.
- Profil: `test-court-picker.cjs`, `test-music-picker.cjs`, `test-court-packs.cjs`.
- Anons: `test-announcement-layout.cjs`, `test-announcement-portraits.cjs`, `test-announcement-content-fit.cjs`. İlki sayı-sebebi dönüşünü ve normal yetenekte dönüş olmamasını da denetler.
- Maç hazırlığı: `test-match-preload.cjs`, `test-match-render-cache.cjs`.
- Medya: `test-media-block-palette.cjs`, `test-second-media-tube.cjs`.

### Her görsel değişiklikten önce

1. Bu dosyadaki bileşenin kararını ve ilgili tutarsızlık kaydını oku.
2. Aynı bileşenin diğer kullanımını ve gerçek üretim DOM'unu bul; sadece lab'a bakma.
3. Değişecek durum ile korunacak ölçü/animasyonu belirle. Hata düzeltmesini yeniden tasarıma çevirmeme sınırını açık tut.
4. Tek bir olayın hareketini başka olaya kopyalama. Özellikle sayı sebebi / yetenek / ilk açılışı ayır.
5. Değişiklikten sonra ilgili ekranı gerçek içerikle küçük mobil, referans mobil ve masaüstünde karşılaştır. Uzun metin, eksik görsel ve kilitli durumu atlama.
6. Yetkili kullanıcı kararı değiştiyse bu dosyayı da güncelle. Tek seferlik görsel düzenleme için yeni test yazmak zorunlu değil; ortak davranış veya geometri riski varsa mevcut anlamlı kontrolleri kullan.

Bu rehber, tutarlılığı korumak içindir; kendi başına izin/onarım onayı isteme kapısı değildir. Kullanıcının verdiği kapsam içinde ilerle.

## Altyapı Akademisi — ilk çalışan taslak

24 Ekim: 1. Lig için oynanabilir prototip, player-card-design-lab-v3.html#academy-design-lab bölümüne eklendi. Ayrı URL index.html?academyPreview=1. Üretim lig geçişi değildir; ilk üç aşamanın menüsüne giriş eklenmez.

- Akademi ana ekranının merkezi canlı antrenman salonudur. Yalnız kaydedilen gençler burada maçtaki vektör karakter çizimi ve onaylı pozlarla antrenman yapar; statik tesis illüstrasyonu kaldırıldı. Bütçe altta tek satır, deneme kontrolleri kapalı details içindedir.
- Aday ve oyuncu dosyaları mevcut GameUI.selection kabuğunu kullanır. Mobil/masaüstü aynı ölçü; mevcut karartma, tek içerik kaydırması, kapat/Tamam ailesi.
- Oyuncu portresi TeamAppearance, mezun kartı TeamView.transferCard üzerinden gelir. Kartın dikey anatomisi, üst yıldız yerleşimi ve orijinal görünüşü korunur. Akademi için ayrı kart veya portre çizimi yok.
- Eğitim raporu isteğe bağlı; karar gelmeyince süre durmaz. Program değişimi süre çubuğunu geriye götürmez ve kazanılan özellikleri silmez.
- Mezunlar ayrı deneme kadrosuna gelir. Gerçek oyunculara ekleme/ilk yedi değişikliği yapılmaz. Deneme storage alanı idle-spiker-academy-preview: ile ayrıdır; akademi dışı modallar yalnız bu URL içinde bastırılır.
- Yetiştirme ve ikinci alan değerleri deneme içindir; gerçek 1. Lig profili henüz yoktur. Tam taslak FIRST-LEAGUE-ACADEMY-PLAN.md dosyasında, kaynaklar academy-rules.js / academy-preview.js / academy.css / academy-design-lab.js.
- Kontrol test-academy-browser.cjs; ekran görüntüleri audits/academy-home-mobile.png, academy-candidates-mobile.png, academy-report-mobile.png, academy-graduation-mobile.png, academy-dark-mobile.png.

### Akademi canlı salon düzeni — son kullanıcı kararı

- Kullanıcı küçük açıklama yazılarını azaltıp oyuncuyu eylemlerle yönlendirmeyi istedi. Üstte Altyapı Akademisi ve yuva sayısı; Antrenman/Mezunlar; geniş canlı salon; oyuncu seçim düğmeleri; yalnız seçili gencin ilerleme kartı. Boş yuvada açık Oyuncu ekle eylemi.
- Salondaki karakter maçın kendisiyle aynıdır: mac.html?academyTraining=1 içindeki gerçek drawPlayer ve mevcut tickScenario kullanılır; bunlar MatchVectorCharacters, EquipmentActionPoses ve authored walk kaynaklarını kendileri seçer. Portreyi oynatarak animasyon yapılmaz; animation lab bağımlılığı yok.
- academy-native-training.js yalnız bu query içinde çalışır. Maç simülasyonu durur; tek sahne kendi 30 FPS çizimini yürütür. Maç sonucu, puan, ödül veya oyuncu kaydı üretmez. Normal maç çizimi bu query dışında değişmez.
- Son kullanıcı düzeltmesi: yeni animasyon kurgulamak yasak. Smaç, pas ve blok için oyunun mevcut tickScenario fonksiyonu ve drawPlayer zinciri doğrudan çağrılır. Özel pose blend, kol/ten geçişi, değiştirilmiş açı, zıplama eğrisi ve özel top uçuşu kaldırıldı. Gençlerin görünüşü kaydedilmiş appearance üzerinden native renderer'a verilir.
- Tüm gençler salonda birlikte görünür. Oyuncuya dokunma veya sahne altındaki isim düğmesi seçim yapar; alt kart seçili oyuncuyu gösterir. Eğitim ve ekonomik kurallar değişmez.
- Tek iframe korunur; seçim/kayıt güncellemesi sahneyi yeniden yüklemez. Ekran dışında, Mezunlar sekmesinde ve arka sekmede çizim durur. Reduced-motion'da antrenman pozu sabittir; eğitim süresi devam eder.
- İlk sürümdeki uzun tanıtım, tesis açıklaması ve sürekli görünür deneme metinleri kaldırıldı. Yeni gereksiz açıklama katmanı ekleme.
- Test test-academy-browser.cjs artık iki native karakter, değişen görüntü, seçim, sekme duraklaması ve reduced-motion kontrolünü de içerir. Referans audits/academy-live-gym-mobile.png.

### Akademi kamera/animasyon düzeltmesi

Kullanıcı ilk canlı salon animasyonunu reddetti: yalnız aynı parçaları kullanmak yeterli değil, açı ve hareketler de oyunla aynı olmalı. academy-native-training.js içindeki özel blend/handPoint/athlete zaman çizelgesi tamamen kaldırıldı. Mevcut tickScenario ve drawPlayer değiştirilmeden çağrılır. Kamera maç mobil görünüşündeki -90 derecedir; karakter açısı, ölçeği ve hareket parametreleri akademiye özel yeniden yorumlanmaz. Karakter çizimi için ana 1000×620 maç canvas'ı korunur, tamamlanmış görüntü kamera dönüşüyle akademi canvas'ına aktarılır. Sonraki salon revizyonunda maç sahasının zemini ve ekipmanı ayrı antrenman tesisiyle değiştirildi; karakter kamerası ve animasyonları korunur. Test kamera metadatasını ve file çizgisinin yatay görüntü piksellerini doğrular.

### Akademi yaşayan tesis ve ortak çalışmalar — 24 Ekim

Kullanıcı daha doğal, ekipman ve hocaları olan bir sandbox ve zaman zaman birlikte çalışan gençler istedi.

- academy-gym-scene.js, aynı -90 derece kamera için native dünya koordinatlarında çizilen ayrı bir tesis zemini sağlar. Tam maç sahası kopyası yerine kısa antrenman filesi, ahşap zemin, iki top arabası, taktik panosu, bank/su/havlu, minder/ağırlık/roller köşesi, koordinasyon merdiveni, koniler, iniş hedefleri ve ekipman rafı bulunur. Statik zemin bir kez rasterize edilip tekrar kullanılır.
- İki hoca mevcut TeamAppearance üretimi ve native drawPlayer ile çizilir. Hocalar öğrenci yuvası/kadro sayılmaz; nötr yeşil kıyafet kullanır. Bireysel çalışmada karşıdaki partner olur; boşta salonda mevcut native yürüyüşle dolaşırlar.
- Otomatik çalışma planı 6,8 saniyelik bölümlerde bireysel temel çalışma, diğer temel çalışma, ortak pas, ortak smaç, koordinasyon/ayak çalışması ve karşılıklı hücum-blok arasında değişir. Ortak çalışmalar yalnız iki genç varsa devreye girer; tek genç hocasıyla çalışır.
- Eşli çalışmada iki gencin aynı native senaryo bağlamını paylaşması gerekir; iki bağımsız top/animasyonu eşli gibi sunma. Pas çalışmasında pasör/hücumcu, ardından smaç çalışmasında aynı ikili; blok çalışmasında vurucu/blokçu rolleri görünür. Hoca diğer tarafta hedef/partner olur.
- Vuruş, pas ve blok hâlâ mevcut tickScenario/drawPlayer kullanır. Koordinasyon ve hocaların dolaşması mevcut moveCourtPlayer/updateFacing ve native yürüyüştür. Özel kol animasyonu, yeni pose blending veya kamera açısı yok.
- Çalışma çeşitliliği görseldir; seçilmiş gelişim programının özellik kazancını, eğitim süresini veya ekonomisini değiştirmez.
- Akademi testi artık iki hoca, ekipmanlar, ortak pas/smaç/blok, bireysel ayak çalışması, aynı native kamera ve ekran dışı duraklamayı da doğrular. Görseller: audits/academy-paired-passing-mobile.png, academy-paired-attack-mobile.png, academy-footwork-mobile.png.

### Akademi dinlenme, sohbet, gölgeler ve seçili saha — son karar

- Gençler banklarına mevcut native yürüyüşle gider; fileyi geçmeleri gerekiyorsa kenardan dolaşır. Bankta native dinlenme gövdesi oturma yüzeyine yerleşir, bankın ön çıtası üst katmanda çizilir. Konuşma başlamadan önce koçun da öğrencinin yanına varması gerekir.
- Konuşma balonları yeni çizim değildir: MatchReactionArt içindeki dot-dot ve lightbulb stripleri kullanılır. Konuşma için ek küçük açıklama yazısı yoktur.
- Koç pası → yaklaşma → smaç, gerçek maçın launch ve temel tick fonksiyonlarıyla aynı top üzerinden çalışır. Bu döngüde sadece görünür pasör koç, hücumcu ve karşılayan partner simüle edilir; görünmeyen oyuncu çarpışması yoktur. Sonuç/ekonomi üretmeden, karşıdaki partnerin temasından önce çalışma yeniden hazırlanır.
- Bağımsız çalışmalar ayrı koridorlarda tutulur; eşli çalışmada tek ortak top vardır. Yere yakın topun kendi çalışma grubunun dışındaki bir karaktere mesafesi deneme metriklerinde izlenir.
- Gölge, karakter ve top üç ayrı çizim katmanıdır. Bütün zemin gölgeleri önce çizilir, sonra derinliğe göre karakterler, en son uçan toplar. Native drawPlayer'ın kendi gölgesi yalnız akademideki bu çizim çağrısında bastırılır; gerçek maç görünüşü değiştirilmez.
- Sepetler ve yerdeki yedek toplar ball_volley1.png / ballSprites kaynağını kullanır. Elle çizilmiş benzer toplar kaldırıldı. Statik tesis zemini yine önbellektedir; top görselleri üstüne gerçek assetten çizilir.
- Çalışma planına dinlenme ve sohbet bölümleri eklendi. Koşu bölümü 22 sn, dinlenme 8 sn, sohbet 9 sn sürer; temel antrenman bölümleri 6,8 sn. Tüm süreler görseldir, akademi gelişim saati ve ekonomisi değişmez.
- Koşu ve saha çalışmasında gerçek oyunda profilden seçilmiş saha, Armalı/Armasız ayarı ve kulüp kimliği kullanılır. Akademi denemesi bu seçimleri salt okur; gerçek profil/kulüp/kaynak kaydına yazmaz. Saha ödülü kilidi mevcut SocialJourneyRules kontrolünden geçer. Seçim değişikliği ve sekmeye dönüş sahne verisini yeniler.
- Salon ve saha arasında 0,5 sn geçiş vardır. Kamera açısı yine maçtaki -90 derecedir. Saha sahnesinde tam saha ve dış koşu yolu görünsün diye bütün kamera eşit oranda uzaklaştırılır; karakterin native rig ölçeği veya pozları değiştirilmez.
- Koşu rotası çizgilerin ve file direklerinin dışındadır. Native moveCourtPlayer'a akademi için isteğe bağlı sınırlar tanımlanır; normal maçta bu alan yoktur ve eski sınırlar aynen geçerlidir.
- Test test-academy-browser.cjs: bankta iki genç, dört konuşma stripi, native pasın gerçek smaç uçuşuna dönüşmesi, sepette gerçek top kaynağı, gölge katmanı, gerçek profilin seçili gece sahası ve saha dışı koşu rotası. Görseller audits/academy-bench-mobile.png, academy-coach-talk-mobile.png, academy-selected-court-running-mobile.png.

### Akademi pas tamamlama, koşu yönü ve kalabalık denemesi

- Pas gösterimi olarak kalan bütün toss çalışmaları gerçek native launch/tick zincirine bağlandı. İki genç varsa biri pasör, diğeri hücumcu olur; tek gençte koç diğer rolü üstlenir. Koç pası çalışması da aynı zinciri kullanır. Yeni çalışma bölümü başlayacak olsa bile uçuş/vuruş tamamlanmadan sahne kesilmez.
- Çizim için kimlik uygulaması native simülasyon oyuncusunu değiştirmemelidir. character artık kopyayı süsler; pasör/hücumcu rolü kareler arasında değişip hedef noktasını bozamaz.
- Koşucular ve yürüyen koçlar maçın fileye dönük kalma kısıtını kullanmaz. Mevcut native dönüş serbest dolaşım modunda çağrılır; ters yönde adımlamadan önce yön değişir. Kamera ve yürüme rig'i aynıdır.
- Koç hedefe sekiz birim yaklaşınca durur; gerçek yer değiştirme çok düşükse yürüyüş fazı ilerlemez. Hedefte/yol tıkalıyken yerinde koşma yoktur.
- Görünür 10 oyuncuyla dene düğmesi, gerçek eğitim girişlerine örnek karakterler ekleyip on genç + iki hoca gösterir. Gerçek kadro, yuva, bütçe ve kayıt değişmez. Aynı düğme Normal görünüme dön olur. Örnekler salonda ayrı köşelerde, saha sahnesinde eşit aralıklı koşu rotasında görünür. Ek top kalabalığı oluşturulmaz.
- Test: öğrenci pasının smaç uçuşuna dönüşmesi, koşu yönü/hız vektörü uyumu, sohbet eden koçların durması, on genç + iki hoca ve düğmenin kayıt değiştirmeden açılıp kapanması. Görseller audits/academy-crowd-gym-mobile.png ve academy-crowd-court-mobile.png.

### Akademide top görsellerini deneme

- Kullanıcının balls.png atlasındaki altı top, salonun altındaki Top satırında görsel düğmelerle seçilir. Mevcut maç topu da ilk seçenek olarak korunur. Renk adları aria-label/title içindedir; gereksiz ek açıklama yoktur.
- Seçim, uçan toplara, sepetlere ve yerdeki yedek toplara birlikte uygulanır. Aynı görüntü alanına normalize edilir; top fiziği, vuruş anı, sahne saati ve karakter animasyonu değişmez.
- Atlasın kendisi değiştirilmez. sync-academy-balls.cjs kaynak dosyayı file:// canvas güvenliği için academy-ball-atlas-data.js içine gömer. version-assets.cjs bunu yeniler. Atlas yalnız akademi önizlemesi açıldığında yüklenir.
- academy-ball-picker.js her hücrenin saydam sınırını kırpıp eşit 128px kutuda hazırlar; native sahne seçilen PNG'yi aynı top çapında çizer. Yeni top seçimi antrenmanı yeniden başlatmaz.
- Tercih, ayrı akademi deneme alanında ball-choice-v1 anahtarına kaydolur; gerçek oyun profili ve ekonomi değişmez. Hızlı seçimlerde eski resmin geç yüklenip son seçimi ezmesi engellenir.
- Kontrol test-academy-balls.cjs: altı saydam kırpım, yedi seçenek, canlı değişim, hızlı seçim sırası, yeniden açılışta tercih, kayıt/ekonomi korunması ve 320/1440 taşmama. Görsel audits/academy-ball-picker-mobile.png.

### Sürekli antrenman istasyonları ve ortak top konturu — son karar

Kullanıcı, başa sardığı belli olan klipler yerine topun geri döndüğü, oyuncuların sırayla çalışıp arkasına geçtiği akış istedi.

- academy-training-stations.js kalıcı istasyon durumunu tutar. Salonun ilk dört bölümü aynı hücum istasyonunu sürdürür; saat/oyuncu/top her bölümde sıfırlanmaz. Sahne değişimi yalnız devam eden top teması ve vuruş tamamlandıktan sonra yapılır. İstasyonlar tekrar görünürken önceki durum ve sıra korunur.
- Hücum sırası: koç topu pasör koça geri atar, pasör sıradaki gence kaldırır, genç native yaklaşma/smaç hareketiyle vurur. Vuruş sonrası takip hareketi biter, oyuncu kenardan dolaşıp sıranın arkasına yürür; sıradaki genç yaklaşma yerine gelir. Koç tuttuğu topu geri döndürür; bütün turda aynı top kimliği korunur.
- Normal ve 10 oyunculu denemede bütün gençler gerçek sıraya dahildir. Bekleyenler art arda zıplayan sahte klipler oynatmaz; sırayı takip eder. Sadece aktif ve seçilmiş oyuncunun adı gösterilerek kalabalık isim çakışması azaltılır.
- Saha sahnesinde ayrı native servis sırası vardır. Oyuncu servis noktasına yürür, sahaya döner, native servis hazırlığı/vuruşunu yapar ve arka sıraya geçer. Her servis yeni bir top kullanır. Servis sahnesi 28 sn sürer; küçük top arabası servis noktasının yanındadır.
- Zemine gelen toplar native sekme hesabını kullanır ve durunca dönmeyi bırakır. Birden fazla top yerde kalır. Sekizden fazla top biriktiğinde koç, atış yapılmayan arada bir topu alıp güvenli yerine döner; koç geri dönmeden sonraki servis başlamaz.
- Vuruşlar native tick/launch/serve, hareketler native yürüyüş ve dönüş üzerinden çalışır. Yeni özel kol pozu veya sıfırlanan keyframe klibi yoktur. Bekleyenlerin konumları ve sıra dönüşü gerçek hareketle ilerler.
- Bütün yedi top seçeneği ortak koyu bir siluet konturu kullanır: saydam kenardan yaklaşık 3px dışarı, 1px içeri taşar (128px önizleme ölçeğinde). Bu ayrı daire/halo değildir; topun gerçek dış biçimini sarar. Kontur seçici, uçuş, sepet ve yerdeki toplarda aynıdır; orijinal balls.png değiştirilmez.
- Test test-academy-stations.cjs: on oyuncuda iki sıra dönüşü, tek top kimliğiyle koç geri dönüşü, konum sıçramaması, sırada kayıp/tekrar olmaması, iki native servis ve birden fazla yerde top. test-academy-browser.cjs ve test-academy-balls.cjs de devam eder. Görseller audits/academy-attack-queue-mobile.png ve academy-serve-queue-mobile.png.
