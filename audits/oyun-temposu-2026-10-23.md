# İlerleme temposu tekrar testi — 23 Ekim 2026

Sonuç: Oyun ekonomik olarak tıkanmıyor; ikinci aşamanın son bölümünde aynı eylemlerin tekrarı sıkıcılık riski taşıyor. Aşamayı uzatmak mevcut sorunu büyütebilir.

## Kapsam ve sınırlar

- Temiz başlangıçtan üç aşamaya ilerleyen 3 profil × 2 tohum: 18 aşama simülasyonu. Aktif profil 30 saniyede, açık idle profil 5 dakikada, çevrimdışı profil 15 dakikada bir kontrol yapıyor.
- Gerçek oda, AP, kart, kamp, vardiya ve mesai kuralları kullanıldı. Çevrimdışı profile vardiya açılana kadar açık oyun verildi: mahallede vardiya bulunmadığından önceki testin beş dakika sonra tamamen çevrimdışına geçmesi geçerli bir başlangıç değildi.
- Ulusal ligde maç başına 120 saniye izleme ve bu sırada gerçek sınırlı mesai hesabı var. Bölgesel lig süreleri maç izleme ve menüde düşünme hariç. Oyuncu bu işlemleri daha yavaş yaparsa süre uzar.
- Bu ana ekonomi deneyinde maç sonuçları %50 kazanma varsayımı, yükselme varsayımı ve transfer kullanılmaması vardır. Bunlar oyuncu deneyimi veya kesin lig başarısı ölçümü değildir.
- Ek olarak gerçek maç sonucu simülasyonu kullanan iki Bölgesel Lig rotası tamamlandı: dengeli ve dört transfer hedefleyen rota. Bu iki test hazır 10. seviye başlangıç ve tamamlanmış mahalle yatırımları kullanır; temiz başlangıç süreleriyle aynı karşılaştırma değildir.
- İki son kayıt ayrı temiz Edge oturumunda açıldı. 14 sonuç, 12/16 kişilik kadro, pozitif kaynaklar, mobil taşma ve yenileme kalıcılığı doğrulandı. Kullanıcının gerçek kaydı değiştirilmedi.

## İkinci aşama

- Temiz başlangıçtan aktif profil yaklaşık 67,5 dakika; beş dakikada bir kontrol yaklaşık 100 dakika. Maç izleme süreleri hariç.
- Aktif profilde ilk çeyrek 185–187 geliştirme/yatırım, son çeyrek yaklaşık 39. Son bölümde hâlâ yaklaşık 25 kart gelişimi, 12 blok yatırımı ve 3 kamp var. Bu sayılar farklı kararların sayısı değildir: aynı karta tekrar basmak ayrı olay sayılıyor.
- Son çeyrekte ana altılı ortalama gücü yaklaşık 81 → 87. Gelişim durmuyor, fakat başlangıçtaki sıçrama hissi kayboluyor.
- Aktif oyunda en uzun temel gelişim aralığı yaklaşık 90 saniye. Oda yatırımları sezon sonuna kadar devam ediyor; 'beşinci maçta her şey bitti' problemi bu politikalarda tekrarlanmadı.
- Gerçek maç simülasyonlu dengeli rota 56 dakika, üçüncülük, 243 kart yükseltmesi; transferli rota 57 dakika, ikincilik, 224 yükseltme. Dört hedefli transfer 10,5–24,3. dakikalarda gerçekleşti. Transfer politikasının üst sınırı dört olduğu için buradan 'sonradan iyi transfer çıkmıyor' sonucu çıkarılamaz.

## Üçüncü aşama

- Aktif profil yaklaşık 119 dakika, seyrek kontrol 162 dakika. Bu aşamada maç başına iki dakika izleme dahil.
- İlk çeyrekte yaklaşık 205 temel gelişim olayı, son çeyrekte 45; ilk maç yaklaşık 21. dakikada. Özellikle ilk maç öncesi hazırlık ve sezon sonunda kart/kamp döngüsü tekrar riski taşıyor.
- Mesai bu hesapta çalışıyor ve kaynak üretiyor. Sorun gelir kesilmesinden çok gelirin benzer düğmelere harcanması.

## Çevrimdışı profil

- İkinci aşama yaklaşık 15,5 saat gerçek takvim süresi; bunun aktif oynama süresi olduğu söylenemez.
- 69 kontrolden 46–47'si yeni işlem üretmedi. En uzun temel gelişim boşluğu 4 saat 15 dakika.
- Vardiya tükenince dört saat dinlenme kuralı ile 15 dakikalık düzenli dönüş birleşince sonuçsuz kontroller oluşuyor. Bu, mevcut kuralın etkisi; çevrimdışı kazanç tamamen bozuk değil.

## Tasarım önerisi

1. İkinci aşamayı şu anda uzatmamak. Son 4–5 maçta ayrı bir hedef/karar olmadan süre eklemek tekrarı artırır.
2. Son bölüme yeni sistem eklemeden mevcut içerikten belirgin hedefler koymak: rakibe göre kadro/rol değişimi, hedef oyuncunun kamp dönüşü, anlamlı transfer tercihi. Tekrar eden AP yükseltmelerinden farklı sonuçları sahada göstermek.
3. Vardiya molasında geri dönüş zamanını açık göstermek ve oyuncuyu gereksiz kontrole çağırmamak. Bekleme süresini değiştirmek ayrı bir denge kararıdır.
4. AP fiyatlarını genel olarak indirmemek: bu testlerde para duvarı yok. Hedeflerin ve seçeneklerin sezon içindeki dağılımını düzeltmek daha doğrudan çözüm.

Denge değerleri değiştirilmedi. Tarayıcı testinde bulunan somut bir yükleme hatası giderildi: transferli kayıttaki kamp sınırına ulaşmış kartlar, RoomSystem henüz kurulmadan ona erişiyordu. Başlangıç kontrolü eklendi; iki kayıt tekrar testini geçti.

Ham veriler: `retest-20261023-season-observed-weekly14.json`, `bal-retest-2026-10-23.json`.
Tekrar: `node audit-pacing-retest-20261023.cjs` ve `node audit-browser-retest-20261023.cjs`.
