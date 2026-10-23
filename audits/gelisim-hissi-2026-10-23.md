# Gelişim hissi düzenlemesi — 23 Ekim 2026

## Oyundaki değişiklikler

- Bölgesel ligde seçili blokların 6–10. seviyeleri ayrı fiyat eğrileri kullanıyor. Video Destekli Çalışma ve Yerel Bağlantılar daha geç olgunlaşan hedefler. Bu iki bloğun ana seviyeleri de ek özelliğe geçerken tek bir büyük fiyat sıçraması yaratmamak için kademelendirildi.
- Vardiya veriminin ilk ek seviyeleri daha erişilebilir. Diğer üretim yatırımları küçük adımlar olarak kalıyor. Maç veya gün kilidi eklenmedi. Tamamlanmış seviyeler korunuyor; kart AP bedelleri ve üçüncü aşamanın fiyatları değişmedi.
- Gerçek kart yükseltmesinden sonra OVR veya seviye önce/sonra, en çok artan iki özellik gösteriliyor. Başarısız işlemler geri bildirim üretmiyor. Oyuncunun gücü arttıkça portre çerçevesi ve küçük gelişim izi belirginleşiyor. Kamp yıldızları ve portreler korunuyor.
- Bölgesel/ulusal departman çizimleri gerçek yatırım oranında %20 / %50 / %85 eşiklerinde bitki, flama ve kupa ayrıntıları kazanıyor. Yüksek gelişimli departmanın çerçevesi hafif vurgulanıyor. Yeni panel veya devamlı animasyon eklenmedi.
- Blok 6. seviyeye ulaşınca açılan ek özellik yerinde kısa süre vurgulanıyor. Azaltılmış hareket tercihi destekleniyor. Yenilemede yükseltme animasyonu tekrarlanmıyor.

## Önce / sonra

Aynı aktif yatırım politikasında Video ve Bağlantılar'ın ek özellikleri yaklaşık 5–6. maç yerine 9–10. maç çevresine kaydı. Beş dakikada bir kontrol eden profilde yaklaşık 11–12. maç. Bu tarihler zorunlu kilit değil, testteki satın alma politikasının sonucu.

Dört son koşuda Bölgesel Lig: aktif 66,5 dakika, seyrek kontrol 100 dakika; önce 67,5 / 100 dakika. Bölgesel maç izleme ve menüde düşünme bu sürelere dahil değil. Aktif rotalarda 243–244, seyrek kontrolde 242 kart yükseltmesi; takım gelişimi benzer kaldı. Bu, yeni bir mekanik veya insanlarla yapılmış sıkıcılık testi değildir; ilerleme dağılımını değiştirip somut gelişimi daha görünür yapan ilk düzenlemedir.

## Doğrulama

- `test-progression-visuals.cjs`: gerçek tıklamayla kart yükseltme, doğru AP harcaması, gerçek özellik artışı, 6. seviyede özellik açma, gelişmiş departman çizimi, 320/390/1000 px taşma kontrolü, azaltılmış hareket ve kayıt yenilemede kalıcılık geçti.
- `test-progression-prices.cjs`, `test-transfer-camp-balance.cjs`, `test-stage-block-balance.cjs`, `test-country-pools-and-card-cap.cjs` geçti.
- Gün 1'de yeterli kaynakla seçili bölgesel blokların 10. seviyeye kadar alınabildiği; fiyatların artışı ve kayıt seviyelerinin korunması ayrıca doğrulandı.
- Eski `test-bal-pacing.cjs`, değişiklik öncesinde de mevcut olan `bal_coach` fiyat oranında takılıyor (eski oran 3,33, test sınırı 2,5); tüm katalogların 10 seviyeli olduğu varsayımı da güncel değil. Bu eski testi geçiriyor gibi raporlamadım veya sınırını gevşetmedim.

Ham karşılaştırma: `retest-20261023-season-before-feel-weekly14.json`, `retest-20261023-season-after-feel-weekly14.json`, `progression-feel-summary.json`.
