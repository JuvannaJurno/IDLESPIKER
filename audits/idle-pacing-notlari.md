# Idle pacing incelemesi — 21 Ekim 2026

**Karar önerisi:** Ulusal Voleybol 2. Ligi'nde 28 maç fazla tekrar ve zorunlu dönüş yaratıyor. İlk tercih 14 maç / her rakiple iç saha ve deplasman; gelişim bütçesi ve 2 yıldız fırsatı korunmalı. İlk 14 haftayı bırakıp sezonu orada kesmek uygun değil. Canlı oyunun dengesi bu incelemede değiştirilmedi.

## Nasıl test edildi?

- Gerçek başlangıç kaynağı (20 bütçe, sıfır AP), üretilen başlangıç kadrosu, boş odalar. Önceki deneydeki hazır kart seviyeleri veya tamamlanmış BAL yatırımları başlangıca verilmedi.
- 3 farklı rastgele tohum. Mevcut düzende 3 oyuncu profili; üç alternatif düzende iki profil: **27 ekonomi yolu / 81 aşama koşusu**.
- Aktif profil: 30 saniyede bir yatırım/gelişim kontrolü; ortalama 0,3 elle talimat/sn. Oyun açık idle profil: 5 dakikada bir kontrol, elle talimat yok. Çevrimdışı profil: her aşamada önce 5 dakika açık başlangıç, sonra 15 dakikada bir dönüş. Vardiya sınırı ve gün yenilenmesi gerçek kurallardan.
- Gerçek oda fiyatları/üretimi, kart fiyatları ve kazanımları, kamp koşulları/ücreti/süresi, maç ödülleri ve maçın önünde üretimin durması kullanıldı. Hız yatırımı yapılabiliyor. Kamp ve yükseltmeler kontrol anlarında yapılıyor.
- Ekonomi karşılaştırmasında maç sonucu sabit tohumla %50 kazanma varsayımıyla üretiliyor, maç anında çözülüyor ve aşama yükselmesi varsayılıyor. **Bu, yeni oyuncunun bu kadroyla kesin ilk üçe girdiği anlamına gelmez.** Yeni alternatifler için sıralama dengesi henüz doğrulanmadı.
- Transferler, kupon kullanımı ve topluluk nakit ödülleri modele dahil değil. Üretim yatırımları görece düzenli yapılıyor. Sosyal yayınlar kontrol anlarında; taslak süreleri gerçek arayüzden, maçta bekleme yaklaşık. Bunlar süre tahminleri; oyuncu davranışının birebir kaydı değil.
- Hızlandırılmış üretim hesabı ayrıca 3 aşamada toplam **6.000 gerçek talimat** ile AP/bütçe/sayaç açısından eşleşti.
- Tarayıcıda tamamen temiz açılış, gerçek dil seçimi, başlangıç yatırımları ve otomatik AP teslimi test edildi. Çevrimdışı kazanç, maç kapısı, yeniden yüklemede tekrar kazanç verilmemesi ve maç sonrasında üretimin sürmesi testi geçti. Eski testlerdeki dil seçimi ve yuvarlanmış hız yazısı varsayımları test sarmalayıcılarında düzeltildi; bunlar oyun hatası değildi.
- Ayrıca gerçek saha motorunda erken/orta/geç kadrolarla Ankara File, Uludağ Akademi, Karadeniz Gücü'ne karşı **9 tamamlanmış maçın süresi** ölçüldü. Önceki 364 saha maçı bu yeni test sayısına dahil edilmedi.

## Süre karşılaştırması

Aşağıdaki süreler **maç izleme, kadro inceleme ve menülerde düşünme süresi hariç**. Gelişim kontrolleri arasındaki bekleme dahil. Her satır üç tohumda benzer sonuç verdi.

| Deneme | Aktif profil | 5 dakikada bir bakan | İlk 2 yıldız: aktif / seyrek kontrol | Değerlendirme |
|---|---:|---:|---:|---|
| Mevcut: 28 maç / 534 gün | 90 dk | 140 dk | 33–35 / 60–65 dk | Gelişim devam ediyor; tekrar ve maç kapısı ağır basıyor. |
| İlk 14 maçta bitir / 282 gün | 48 dk | 70 dk | 32–35 / 60–65 dk | Daha kısa ama seyrek bakan oyuncunun 2 yıldız sonrası zamanı çok dar. |
| 28 maç, günleri %28 sıkıştır | 63,5 dk | 140 dk | 32–34 / 75–80 dk | Idle için kötü takas: sık maçlar gelişim fırsatını daraltıyor, seyrek bakanın sezonu kısalmıyor. |
| 14 maç, 534 güne yay | 84 dk | 135 dk | 30–34 / 60–65 dk | 2 yıldız korunuyor, tekrar yarıya iniyor; ekonomi süresi tek başına fazla kısalmıyor. |

Önceden söylenen 3 saat 15 dakika, önceki ligden maksimum otomasyonla gelinip **yeni hız yatırımı yapılmayan** sabit hesap idi. Yeni ligde yatırım yapan bu profillerin tamamlanma süresi değildir. İkisi aynı süre gibi kullanılmamalı.

## Sıkıcılık riski nerede?

### 1. En büyük sorun: idle oyunun sık sık maça dönmeyi istemesi

Mevcut aktif koşuda maç aralığının medyanı 3 dakika. Üretim bekleyen maçta duruyor. Beş dakikada bir bakan profilde 28 maç neredeyse her kontrolde bir maça dönüştü. Günleri sıkıştırmak bu oyuncuya yarar sağlamadı: yine 28 ayrı maç kapısı var.

14 maçı geniş takvime yayma deneyinde aralık aktif profilde medyan 6,5 dakika, seyrek kontrolde 10 dakika oldu. Aynı rakiple dört yerine iki karşılaşma da tekrar hissini azaltır. Bu ikincisi bir tasarım çıkarımı; kullanıcı testiyle doğrulanmalı.

**Öneri:** 14 maçlık adil iç/dış saha sezonunu temel almak. Daha uzun vadede bekleyen maçın üretimi tamamen durdurması ayrıca ele alınmalı: hazırlık üretimi, sınırlı birikim veya oyuncunun açtığı otomatik sonuç seçeneği denenebilir. Bunlar mevcut oyuna uygulanmadı; ödül ve rekabet dengesi ayrıca test edilmeli.

### 2. Son yaklaşık üçte birlik bölüm: işler var, yeni kararlar azalıyor

Mevcut aktif profilde bütün oda yatırımları yaklaşık 54,5. dakikada tamamlandı; sezon 90. dakikada bitti. Beş dakika kontrolünde odalar yaklaşık 85. dakikada, sezon 140. dakikada bitti. Yani son yaklaşık %40'ta oda seçimleri tükenebiliyor.

Aktif örnekte ilk çeyrekte yaklaşık 188 gelişim/yatırım eylemine karşılık son çeyrekte 20 eylem var. Son çeyrek yaklaşık 22,5 dakika. Ortalama ilk altılı OVR son çeyrekte yaklaşık 121 → 124 artıyor. Büyük bir üretim duvarı yok; fakat aynı kart düğmesine daha seyrek basmak yeni içerik gibi hissettirmeyebilir.

**Öneri:** Bu bölümde basit +AP odaları ekleyerek listeyi uzatmak yerine, birkaç belirgin hedef bırakmak: takım oyun tarzı seçimi, rakibe hazırlık, kadro değişimi veya mevcut gelişimin sahada farkını gösteren net geri bildirim. Erken dönemde tüm seçenekleri bitiren ucuz yatırım dağılımı da gözden geçirilmeli.

### 3. İki yıldız hedefi bitmeden geliyor, sonrasında bir amaç gerekli

Mevcut aktif profilde ilk iki yıldız yaklaşık 33–35. dakikada. Sezon sonunda ilk altı oyuncunun tamamı iki yıldıza ulaşabildi. Seyrek kontrol profili ilkini 60–65. dakikada aldı; son altılıda 4–5 oyuncu iki yıldız, kalanlar 1,5 yıldız oldu. Libero için tüm kadro aynı şekilde tamamlanmadı.

İlk 14 maçta bitirme deneyinde aktif oyuncunun bile altılısından yalnız üçü iki yıldızdı. Seyrek kontrol profilinde ilk iki yıldız ile sezon sonu arasında sadece 5–10 dakika kaldı. Bu nedenle doğrudan 282. günde kesmek hedefle uyumsuz olabilir.

14 maçı 534 güne yayma deneyinde hem aktif hem seyrek kontrol koşularında ilk altı oyuncunun tamamı iki yıldızı tamamladı. Bu, gelişim fırsatının maç sayısından ayrı ayarlanabileceğini gösteriyor.

### 4. Çevrimdışı profilde gerçek bir uzun durak var

15 dakikada bir dönen örnekte günlük vardiya tüketilince sonraki yenilenmeye kadar çekirdek gelişim durdu. Modelde BAL yaklaşık 45,6 saat, sonraki 2. lig yaklaşık 24,1 saat takvim süresi aldı. 2. ligde çekirdek gelişimsiz en uzun aralık yaklaşık 17,5 saat; ortadaki iki çeyrekte kart/kamp/oda eylemi yoktu.

Bu 24 saatlik süre, 24 saat aktif oynama değildir. Ayrıca bütün oyuncular için sabit bir süre değildir: dönüş saati, günlük hakkın ne kadarının taşındığı ve yatırımlar sonucu değiştirir. Model sosyal paylaşım gibi küçük eylemlerin çekirdek gelişim durmuşken de yapılabildiğini ayırıyor.

**Öneri:** Vardiya bittiğinde bunu açıkça anlatmak; boş bir oyuna dönmüş hissini azaltmak. İlk iki aşamadaki 30 dakikalık sınır kullanıcının mevcut tercihi, inceleme bunu geri almadı. Bu sınır korunacaksa çevrimdışı dönüşteki ödül paketi ve uzun vadeli hedefler ayrıca tasarlanmalı. Daha çok kontrol etmeye zorlayan bildirimler çözüm sayılmamalı.

### 5. Sosyal medya uzun vadeli ama ilk lig döngüsüne tam oturmuyor

Mevcut aktif örnekler sezon sonunda yaklaşık 7,6 bin, beş dakika kontrol edenler yaklaşık 2,5 bin takipçiye ulaştı. Hazırlama hızının yüksek seviyede 35–53 saniyeye düşmesi, daha sık yayınlamayı teşvik ediyor. Taslak hazırlanıyor ama oyuncu dönene kadar sonraki taslak başlamıyor.

10 bin takipçideki kamp indirimi bu koşularda ilk iki yıldızı desteklemedi; sezon bitiminden sonraki hedef olarak kaldı. 15/25/40 bin hedefleri hata değil, uzun vadeli hedef olabilir. Ancak ana lig bitişinde başka içerik yoksa bunların art arda aynı paylaşımı beklemeye dönüşme riski var.

**Öneri:** Gelecekte birkaç taslaklık birikim/planlı yayın veya dönüşte toplu karar fırsatı incelemek. Büyük sosyal ödüllerin uzun vadeli olduğunun anlaşılması ve lig sonunda yeni bir hedefe bağlanması iyi olur.

## Maç izleme yükü

9 gerçek maçın simülasyon süresi 1×'te yaklaşık 97–114 saniye. Ortalama yaklaşık 104 saniye.

- 28 maçı 1× izlemek: yaklaşık **49 dakika** ek süre; 2×'te yaklaşık **24 dakika**.
- 14 maç: yaklaşık **24 dakika / 12 dakika**.
- Giriş ekranı ve oyuncunun menüde harcadığı süre dahil değil. Maçları atlayan oyuncu bu süreyi harcamaz. Üretim maç izlerken durduğu için süre üretime paralel işlemiyor.

Bu nedenle maç sayısını yarıya indirmek, takvimde üretim süresi korunurken bile gerçekten izleyen oyuncunun toplam sezon süresini düşürür.

## Uygulama önceliği

1. **Önce 14 maçlık, adil iç/dış saha alternatifini oynanabilir prototipte dene.** İlk aday gelişim takvimini koruyan sürüm; burada 2 yıldız fırsatı korunuyor. Sonraki adım toplam takvimi küçük oranlarda kısaltmayı ayrı deney yapmak. Doğrudan 28 maçın takvimini sıkıştırmayı önermiyorum.
2. Son üçte birdeki karar çeşitliliğini iyileştir. Amaç her 30 saniyede tıklama yaratmak değil; 5–15 dakika sonra dönünce anlamlı bir seçim bırakmak.
3. Bekleyen maç / günlük vardiya nedeniyle ilerlemeyen zamanı görünür kıl; farklı bekleme nedenlerini aynı “hiçbir şey olmuyor” görünümüne bırakma.
4. Alternatif sezon için Uludağ/Karadeniz güçlerini, 3./2./1. olma zorluğunu ve maç ödüllerini yeniden gerçek saha motorunda dengele. Bu ekonomi deneyi onların otomatik olarak doğru kaldığını kanıtlamıyor.
5. Kullanıcı testi: bir oyuncudan 10–15 dakika uzaklaşıp dönmesini iste. “Şimdi ne yapmak istiyorsun?” ve “Bir sonraki dönüşte neyi bekliyorsun?” sorularıyla hedefin anlaşılır olup olmadığına bak. Ölçüm, sıkılma hissinin kendisini kesin kanıtlamaz.

Ham veriler: `idle-pacing-current.json`, `idle-pacing-14-rounds.json`, `idle-pacing-28-compressed.json`, `idle-pacing-14-spread.json`, `idle-pacing-summary.json`, `match-duration.json`. Yeniden üretim için kökte `audit-idle-pacing.cjs` ve tarayıcı denemeleri var.
