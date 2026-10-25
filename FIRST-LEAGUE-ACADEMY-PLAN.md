# 1. Lig — Altyapı Akademisi taslağı

Durum: 25 Ekim 2026 — 1. Lig ve gerçek kayda bağlı akademinin ilk oynanabilir taslağı eklendi. Aşağıdaki güncel kararlar önceki prototip taslağının üstündedir. Ekonomi ve süreler son denge değildir.

## Güncel üretim planı ve uygulanan kapsam

- Aşama 4, Ulusal Voleybol 1. Ligi. 2. Lig sezonunu ilk üçte bitirince mevcut sezon sonu yönlendirmesi ortak seçim kabuğunda 1. Lig geçişini açar. 14 maçlık haftalık takvim, 2.500 talimat/gün, 1.500 talimatta maç hazırlığı korunur. Mevcut ulusal rakip havuzu ilk taslakta tekrar kullanılır; ayrı 1. Lig takımları ve denge sonraki çalışmadır.
- Oyuncular, AP, bütçe, departman yatırımları, sosyal medya ve akademi kaydı korunur. Takvim yeni sezon için başlar; devam eden kamplar yeni günlere taşınır. 1. Lig temel özellik sınırı 220'dir; kazanılmış kamp hakları devam eder. Profesyonel üretim/transfer/sosyal medya kuralları Bölgesel değerlere dönmez.
- Ayarlar → Aşamaya geç → 4 · Ulusal Voleybol 1. Ligi · Akademi taslağı. Test başlangıcında önceki aşamaların blokları tamamlanır ve deneme için en az 1m bütçe/10m AP verilir; normal yükseliş bu kaynakları vermez. Başlangıç seçimi yeni akademi bloğunu boş, son seçim tamamlanmış getirir.
- Kulüp Performans Merkezi'ndeki Altyapı Akademisi kurulum bloğu 2 eğitim kontenjanı açar. Sonraki iki yükseltmeyle 3 ve 4 olur. Mevcut blok satın alma/yükseltme sistemini kullanır; yanında kısa tesis girişi vardır. Takım ekranında Transfer Merkezi'nin altında kalıcı akademi girişi bulunur. Yeni alt navigasyon sekmesi yok.
- Transferde bazı gençler akademiye uygundur; yaşları 16–18 olarak gösterilir. Hazır özel elit karakterler akademiye gönderilemez. Genç seçilince “A takıma transfer et” ve “Akademiye transfer et” çıkar. İki yolda da aynı transfer bedeli ödenir; akademi için ek giriş ücreti yoktur. Kontenjan yoksa nedeni görünür ve işlem kapalıdır.
- İlk eğitim 20 dakika, sonrakiler 2 saat; elit ihtimali %25. Bunlar açıkça gösterilen taslak değerlerdir. Bedel ve adayın katalogdan ayrılması aynı oda kaydı işlemiyle saklanır. Aday, mezun olana kadar maç kadrosuna katılmaz.
- Eğitim aşamaları: %0–25 adaptasyon; %25–60 gelişim yönü; %60–100 yetenek çalışması; %100 mezuniyet. Başlangıç yönü ve önerilen yetenek otomatik devam eder. Seçimler eğitimi durdurmaz/sıfırlamaz; bitmiş aşamalar geriye dönük değişmez. Çevrimdışı ve maç sırasında gerçek zamanla ilerler.
- Pozisyona göre iki yön vardır. Seçilen yön ana/yan özellik gelişimini ve önerilen yetenek çiftini belirler. Yetenek aşamasında iki seçenek sunulur: normal mezuniyette kazanılacak Rare yetenek ve elit olursa açılacak Legendary potansiyeli ayrı yazılır. Eğitimde kazanılan Rare yetenek mezuniyette çalışabilir; Legendary mevcut 3 kamp koşuluna bağlıdır. Kamp yıldızı uydurulmaz.
- Her mezun güçlenir ve çalıştığı yeteneği kazanır. Elit mezun güçlü yönünde ek gelişim, aynı kimlikle mor elit kart ve seçilen Legendary potansiyeli kazanır. Normal mezun kayıp/başarısızlık gibi sunulmaz. İlk sürümde erken ayrılma veya oyuncu kaybetme yoktur.
- Elitlik çekilişi kayıt sırasında bir kere saklanır; sonuç yalnız tamamlanınca gösterilir. Yenileme yeni çekiliş oluşturmaz. Mezuniyet oda kaydında recruit olarak saklanır, mevcut gerçek kadro içe alma zinciriyle eklenir. Kadro doluysa mezun bekler; otomatik silme/değiştirme yoktur. Tek mezun ikinci kez alınamaz.
- Akademi mevcut GameUI.selection kabuğunda açılır. Canlı native antrenman salonu merkezdir; altında portre seçimi ve yalnız seçilen gencin durumu/kararı vardır. Gerçek maç açısı, karakterler, antrenörler, istasyonlar ve profil sahası/topu kullanılır. Ayrı lab kayıtları üretim sistemine bağlanmaz.
- Akademi kaydı idle-spiker-rooms-v2 içindeki academy alanıdır. academy-career-rules.js saf kuralları, academy-career.js/css üretim ekranlarını, first-league.js geçişi yönetir. Eski academy-rules.js ve academy-preview.js izole görsel deneme olarak kalır; üretim kaydını yönetmez.
- Sonraki genişlemeler: daha fazla yön/yetenek, erken uyum değerlendirmesi, koç ve ekipman geliştirmeleri, sahnede daha zengin mezuniyet tepkisi. Eğitim süreleri, olasılıklar, mezun gücü ve 1. Lig rakipleri gerçek sezon üzerinde ayrıca dengelenecek.

## Doğrulama

test-first-league-academy.cjs: 1. Lig takvimi, profesyonel etkilerin korunması, genç transfer üretimi, eğitim seçimlerinin sınırları, normal/elit sonuçlar, kadro doluluğu, tekrar mezuniyet ve beceri kazanımı.

test-first-league-academy-browser.cjs: gerçek geçiş, mevcut kadronun korunması, tesis kurulumu, transfer seçimi, native salon, yön/yetenek seçimi, 320/390/1440 genişlik, çevrimdışı tamamlanma, kalıcı mor mezun kartı, doğal sezon sonu yükselişi ve gerçek 1. Lig maçı. Görseller audits/first-league-*.png.

## Arşiv — 24 Ekim izole prototip taslağı

Bu bölüm geçmiş tasarımın kaydıdır. Aşağıdaki doğrudan üç aday seçme, deneme bütçesi ve yalnız normal mezun üretme akışı üretim akademisinin güncel kararı değildir.

## Amaç
Oyuncu ihtiyaç duyduğu pozisyonda bir genç seçip gelişim yönünü belirleyerek kendi kadro oyuncusunu yetiştirir. Fayda, kontrollü pozisyon ve özellik dağılımı ile geleceğe yatırım; sınırsız otomatik üstün oyuncu üretimi değildir. Oyuncunun kendi yetiştirdiği karaktere bağlanması ve tesiste kalıcı büyüme görmesi hedeflenir.

## Mevcut sistemden gelen sınırlar
- Kamp mevcut oyuncunun stat/seviye sınırını artırır, kamp sayısı yıldız ve yetenek açılımlarıyla bağlantılıdır. Akademi ilerlemesi kamp yıldızı değildir.
- Transfer kataloğu hazır oyuncu, rol karşılaştırması ve özel karakterler sunar. Akademi özel elit karakterleri üretmez.
- Gerçek oyuncu kartı, TeamAppearance portresi, TeamRules OVR ve gelişim kuralları tekrar kullanılır.
- Kadro üst sınırı 30; kamp ve kayıt doğrulaması player-0..29 kimliklerini kullanır. Mezunlar için kontrolsüz yeni kimlik veya 31. oyuncu oluşturulmaz.
- Kodda division===3 / diğer lig ayrımları yaygın. Aşama 4 doğrudan eklenirse bazı kurallar Bölgesel değerlere döner. Önce lig gelişim profili açıkça tanımlanmalı: stat sınırı, kart seviyesi, kamp ve transfer üretimi aynı kaynaktan beslenmeli.

## Erişim ve görünüş
- Yeni alt navigasyon sekmesi yok. Takım ekranında Transfer Merkezi ile aynı aileden kısa Akademi girişi: iki küçük gerçek portre, '2 genç yetişiyor', en yakın tamamlanma.
- Kulüp talimat hattında 1. Lig Altyapı Akademisi departmanı bulunur. Departmanın tesis görseline basmak aynı ekranı açar; ilk kurulum kartı akademiyi açar.
- Kulübe her gelişte akademiye otomatik scroll yapılmaz. Mezun hazırken girişte tek sakin işaret yeterli.
- Akademi mevcut GameUI.selection kabuğunda açılır. Mobil ve masaüstü aynı genişlik. Başlık/kapat, tek içerik scroll'u, arka plan ve odak davranışı mevcut aileyle aynı.
- Üstte kısa tesis illüstrasyonu: küçük salon, file ve duvar kulüp arması. İlk sürümde tek alan; ikinci yuva açılınca ikinci antrenman alanı görünür. Tema krem, adaçayı ve teal; altın yalnız eylem/vurgu için.
- Altta yetişen gençler dikey kartlar: mevcut portre, ad/pozisyon, gelişim odağı, hazırlık aşaması, kalan gerçek süre. Ayrı yıldız/potansiyel para birimi eklenmez.
- Ayrıntıda gerçek oyuncu kartı ve mezuniyet tahmini karşılaştırması. Tahmin bir aralık olarak açıkça belirtilir; garanti olmayan gelecekteki OVR kesin sayı gibi sunulmaz.
- Portre ilk günden görünür, kimliği değişmez. İlerlemeyle antrenman dosyası ve güçlü yön bilgisi açılır. Mezuniyette kulüp forması ve standart kart görünür; yeni kart anatomisi yok.

## İlk döngü
1. 1. Lig başlangıcında kurulum kartıyla bir yuva açılır. İlk yetiştirme tanıtım amaçlı kaynak ücreti olmadan başlar.
2. Oyuncu beş pozisyondan ihtiyacını seçer. O pozisyonda üç genç aday gösterilir: örneğin servis odaklı, manşet odaklı veya dengeli smaçör. İsimler seçili ülke havuzundan, portreler mevcut üreticiden gelir.
3. Başlangıçta program seçilir. Program özellik dağılımını değiştirir; toplam güç bütçesini bedelsiz artırmaz. Başlangıç seçimi tüm dönem için yeterlidir.
4. Eğitim gerçek zamanla, çevrimdışı ve maç sırasında ilerler. Vardiya veya bekleyen maç akademi saatini durdurmaz.
5. Dönemin ortasında isteğe bağlı gelişim raporu gelir. Oyuncu isterse kalan gelişimi başka yöne çevirebilir. Karar beklenirken eğitim durmaz; otomatik tamamlanmış bir döneme geriye dönük bonus uygulanmaz.
6. Tamamlanınca 'A takıma al'. Mevcut aynı pozisyondaki oyuncuyla OVR ve özellik karşılaştırması gösterilir. Oyuncu otomatik ilk yediye yerleştirilmez.
7. Kadro doluysa mezun akademide güvenle bekler; otomatik silme/değiştirme yok. Uygun yedek değişimi mevcut kadro güvenlik koşullarıyla yapılır. Alternatif olarak oyuncu bir kereye mahsus önceden gösterilen sınırlı maliyet iadesiyle uğurlanabilir; kârlı para üretim döngüsü oluşmaz.

## Süre ve ekonomi: test edilecek başlangıç değerleri
- İlk tanıtım dönemi 15–20 dakika; normal dönem yaklaşık 2 saat. Bunlar sezon süresi ölçülmeden kesinleşmez. Amaç ilk oturumda ilerleme, 1. Lig boyunca birkaç mezun görmektir.
- Başlangıç 1 yuva, lig ortasında 2 yuva; daha fazla yuva sonraki aşamalara bırakılır.
- Normal dönem maliyeti başlangıçta tek bütçe ödemesi. AP oyuncu yükseltme ve kampta kalır; bakım borcu veya devamlı ücret yok.
- Bütçe hedefi benzer kullanışlılıktaki transferin yaklaşık %40–60'ı; toplam maliyete mezuniyet sonrası AP ihtiyacı da dahil değerlendirilir. Süre, seçim avantajının karşılığıdır.
- İlk mezun hedefi aynı pozisyondaki makul lig referansına yakın, kullanışlı bir yedek; açıkça zayıf pozisyonda ilk yedi adayı. Her mezun en iyi mevcut oyuncudan güçlü doğmaz.
- Güç, kayıt anındaki lig seviyesi ve kadro referansıyla belirlenip saklanır. Mezun almayı geciktirmek veya kadroyu değiştirip tekrar hesaplatmak güç kazandırmaz. Olağandışı elit oyuncular referansı şişirmez.
- İlerleme yüzdesi akademi hazırlığıdır; stat, kart seviyesi ve kamp/yıldız temsili mezun oluşturulurken tutarlı doğrulanır. Başlangıç gelişim geçmişi ancak geçerli ve açık biçimde gösterilirse kullanılabilir; hayali yıldız eklenmez.
- Mezun olduktan sonra normal AP gelişimi ve kamp devam eder. Gizli yetenek her mezunda garanti değildir; mevcut yetenek açılma koşulları korunur. Akademiye özel üstün skill ilk sürümde yok.

## Tüpler ve tesis gelişimi
Akademi departmanına ulaşan mevcut talimatlar küçük antrenman hareketlerini tetikler. Paket başına kalıcı karakter üretimi veya her genç için yeni tüp yok. Başlangıç sürümünde gerçek eğitim hızı yalnız tanımlı tesis yükseltmelerinden gelir; görsel talimat tepkisi ekstra süre kazandırıyormuş gibi sunulmaz. İkinci alan, daha iyi antrenman ekipmanı ve sakin ışık hareketleri tesisin büyüdüğünü gösterir. İleride talimatla hızlandırma eklenirse çevrimdışı hesapla aynı üretim modeline ve açık üst sınıra sahip olmalı.

## Diğer sistemlerle sınır
| Sistem | Asıl kullanım | Akademiyle ilişki |
| --- | --- | --- |
| Transfer | Hemen kadro takviyesi, hazır gelişim, elit oyuncu bulma | Akademi uzun vadeli ve seçilen role yönelik; transfer acil çözüm olarak kalır |
| Kamp | Sevilen/mevcut oyuncunun gelişimini sürdürme, sınır ve yetenek açma | Mezun da normal kamplara ihtiyaç duyar |
| AP yükseltme | Oyuncuyu hemen güçlendirme | Akademi AP üretmez, mezun sonrası yatırım gerektirir |
| Sosyal medya | Takipçi, ödül ve üretim dalgaları | Akademi için paylaşım veya takipçi zorunluluğu yok |
| Akademi | Seçilen pozisyonda, seçilen güçlü yönle yeni oyuncu yetiştirme | Kendi karakterini kurma ve uzun vadeli kadro planlama |

## Kullanma isteğini ne sağlar?
- Aranan pozisyon transferde çıkmadığında hedefli çözüm.
- İsim ve portre ilk günden tanıdık; gelişim seçimi gerçek özellik dağılımını değiştirir.
- İlk mezun başlangıç kadrosu için anlamlı olur, beklemenin sonucu görünür.
- Güçlü kadroda yan uzmanlık/yedek yetiştirme değer taşır; bütün mezunların otomatik yükseltme olması vaat edilmez.
- Kullanıcı eğitimi ihmal ettiği için oyuncu kaybetmez, sınırlı zamanda tıklama zorunluluğu yok.

## Riskler ve prototip ölçütleri
- Kamp kopyası hissi: mevcut oyuncuyu tekrar sıraya koymak yerine yeni karakter + rol ve yön seçimi.
- Çöp mezun hissi: başlangıçta dürüst güç tahmini ve mevcut kadroyla karşılaştırma; ilk mezunun kullanışlılığı test edilir.
- Transferi gereksiz kılma: süre, yuva sınırı, hazır elit üretmemesi ve mezun sonrası AP maliyetiyle dengelenir.
- Menü kalabalığı: kısa takım girişi, mevcut departmandan erişim, tek modal. Yeni HUD kaynağı yok.
- Sonsuz güç basamağı: her mezunda en güçlü oyuncuyu aşma formülü kullanılmaz.
- Tamamlanmış çevrimdışı eğitim tek sefer kaydedilir; yenileme çift oyuncu/ödül üretmez. Ertelenen mezun kaybolmaz.
- Testte izlenecek: ilk mezuniyet süresi, ilk yedi/yedek kullanım oranı, mezun sonrası AP maliyeti, transfer kullanımı, aynı rolde tekrar yetiştirme isteği. İlk üç mezun hiç kullanılmıyorsa sistem sayı artışıyla örtülmeden yeniden dengelenir.

## Uygulama sırası
1. player-card-design-lab-v3.html içinde tek seçilmiş taslak: giriş, boş yuva, yetişiyor, rapor, mezuniyet ve kadro dolu durumları. Gerçek portre/kart ailesi; gerçek kayıt değişmez.
2. Hızlandırılmış prototip: 1 yuva, 3 aday, 2 program, tek mezuniyet. Gelişim ve görünüş birlikte değerlendirilir.
3. Aşama 4 gelişim profili + kalıcı akademi durum makinesi; mevcut oyuncu kayıt sistemiyle tek işlemde mezuniyet.
4. Gerçek çevrimdışı süre, maçta ilerleme, ikinci yuva ve mevcut tutorial ile bir kez tanıtım.
5. Ekonomi ve kadro testinden sonra üretime entegrasyon. Diğer 1. Lig mekanikleri bu prototipe eklenmez.

## İlk çalışan prototip — 24 Ekim

- Giriş: player-card-design-lab-v3.html#academy-design-lab; ayrı ekran index.html?academyPreview=1.
- academy-rules.js eğitim, adaylar, program, yön değiştirme, mezuniyet ve ikinci yuva kurallarını içerir. academy-preview.js mevcut gerçek kart/portre/UI kabuğunu kullanır.
- İlk eğitim ücretsiz 20 dakika, sonrası 25.000 bütçe / 2 saat; ilk mezundan sonra 50.000 karşılığı ikinci alan. Bunlar deneme değerleridir, gerçek oyun ekonomisine uygulanmaz.
- Deneme bütçesi 250.000. Oyuncu seçimi, süre ve mezunlar native storage içinde idle-spiker-academy-preview: alanında saklanır. Normal oyun localStorage anahtarlarına yazılmaz. Akademi dışındaki oyun modalı/tanıtımı yalnız bu izole URL içinde engellenir.
- Oyuncu havuzu ve dosya görünüşü gerçek TeamRules/TeamAppearance/TeamView kaynaklarından gelir. Prototip gelişim sınırı mevcut Ulusal 2. Lig profilini kullanır; 1. Lig ekonomisinin uygulanmış olduğu anlamına gelmez.
- Eğitim çubuğu program değişiminde sıfırlanmaz; kazanılan özellik korunur, yalnız kalan gelişim yön değiştirir. Tamamlanan mezun yeniden alınamaz.
- Kadro dolunca oyuncu bekler. Yedek değiştirme/uğurlama, gerçek departman kurulum kartı, 1. Lig açılışı ve tutorial sonraki üretim entegrasyonuna aittir; bu prototipte yoktur.
- Kullanıcı ara rapora ilerlet / eğitimi tamamla kontrolleriyle beklemeden deneyebilir. Normal süre arka planda ve yeniden açılışta işler.
- Kontrol: test-academy-browser.cjs; 320/390/1440 ölçü, gerçek portreler, kayıt, kapalıyken geçen süre, program yön değişimi, bir kez mezuniyet, bütçe, kapasite ve gerçek kaydın korunması. Görseller audits/academy-*.png.

## Canlı salon tasarım revizyonu

Kullanıcı 24 Ekim'de salonu merkez alan tasarımı istedi: gençler sürekli maçtaki karakterleriyle çeşitli antrenmanlar yapar. Statik tesis görseli yerine native renderer kullanan canlı sahne; sahne altından oyuncu seçimi; yalnız seçilen gencin ilerleme kartı; açıklamalar minimum. academy-native-training.js, mac.html?academyTraining=1 içinde gerçek poz/karakter kaynaklarını kullanır; maç simülasyonu ve ödüller çalışmaz. Bu ekran hâlâ izole akademi prototipidir.

Kamera/animasyon son kararı: Kullanıcı yeni hazırlanmış akademi animasyonlarını reddetti. Özel hareket çizelgesi kaldırıldı; mevcut maç tickScenario ve drawPlayer zinciri doğrudan kullanılır, kamera da maçtaki -90 derecelik açıdır.

Yaşayan salon revizyonu: Maç sahası kopyası yerine bank, top arabaları, taktik panosu, minder/ağırlık köşesi, hedefler ve koordinasyon ekipmanı olan ayrı bir tesis eklendi. İki native hoca partnerlik yapar ve dolaşır. Bireysel çalışmalar, ortak pas/smaç ve karşılıklı hücum-blok otomatik sırayla değişir; iki genç aynı çalışma bağlamını paylaşır. Ekonomi ve seçilen gelişim programı değişmez.

Son sandbox revizyonu: Gençler banklarına yürür, dinlenir ve yanlarına gelen koçlarla mevcut konuşma stripleriyle sohbet eder. Koç pası ve smaç gerçek tick/launch zincirini paylaşır. Sepetlerde gerçek maç topları vardır; zemin gölgeleri karakterlerden önce çizilir. Sahne dönemsel olarak gerçek profilde seçili sahaya geçer; gençler çizgiler ve direkler dışındaki rotada koşar. Bu seçimler salt okunur; akademi gelişim ekonomisi ve gerçek oyun kaydı değişmez.

Sürekli istasyon revizyonu: Kalıcı hücum kuyruğu ve servis kuyruğu eklendi. Koç geri pası, pasör ve sıradaki hücumcu tek top akışını sürdürür; vuran oyuncu yürüyerek arka sıraya katılır. Servisler ayrı toplar kullanır, toplar sekip zeminde kalır. Native hareketler ve gerçek sıra korunur; ekonomi değişmez. Top seçicinin bütün seçeneklerinde aynı siluet konturu vardır.


## 25 Ekim 2026 — Top seçimi ve akademi sahnesi

- Profilde “Maç topum → Top seç” mevcut ortak seçim ekranını kullanır. Altı yeni top şimdilik ücretsiz ve açık; seçim kaydedilir ve gerçek maça aktarılır. Topların ortak dış çizgisi korunur. Eski spiral top ve iki kopya dosyası kaldırıldı.
- Akademide dörtten fazla oyuncuyla deneme maçı yapılabilir. Beş kişide bir, yedi ve üzeri tek sayıda üç kişi kenarda izler; çift sayıda herkes oynar. Oyuncu sayısı deneme menüsünden seçilir. Maç gerçek oyun kamerasını ve animasyonlarını kullanır.
- Yükleme ekranında logonun altında iki oyuncu native perspektifte pepper yapar. Bu sahne yüklemeyi bekletmez; ek animasyon laboratuvarı açmaz.
- Doğrulama: profil top seçimi ve gerçek maça aktarımı, 5/7/9/çift sayılı deneme maçı, native pepper; mobil ekran görüntüleri audits/profile-ball-picker-mobile.png ve audits/boot-pepper-loading-mobile.png.
