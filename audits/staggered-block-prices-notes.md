# Dağıtılmış blok ücretleri — 22 Ekim 2026

- İlk 5 seviyenin fiyatları aynı. Eski takvimli kayıtlar ve ilk iki aşama aynı fiyatlarla devam ediyor.
- Ulusal 2. Lig'in 6–10. seviyeleri artık bloklara göre farklı ücretlerde. Ucuz ara adımlar dört departmana dağıtıldı.
- 350 bin bütçe örneği: Gelişim Takibi 282 bin, Fazladan Mesai 274 bin, Lig Sponsorluğu 336,5 bin, Ulusal Gözlem Ağı 313 bin. Koordinatörün 438,5 binlik seviyesine biriktirirken bunlardan biri alınabiliyor.
- Ücret her seviyede artıyor; hiçbir blok sonraki seviyede ucuzlamıyor. Satın alınmış seviyeler korunuyor.

## Tekrarlanan testler

Fiyat denemelerinde farklı eğriler ve harcama sıraları oluştu. Aşırı pahalı son seviyeler bırakan adaylar elendi. Test hesabında mağazanın takipçi geliri eksikti; düzeltildi. Karar yalnızca düzeltilmiş koşulara göre verildi. Deney özeti: `stagger-price-experiments.json`.

Son sürüm: sıfırdan 9 ekonomi koşusu, üç aktif / üç beş dakikalık giriş / üç offline giriş. Detaylar `idle-pacing-weekly14.json`.

| Oynayış | Lig | Blokların tamamlanması | İlk 2 yıldız |
|---|---|---|---|
| Aktif | 90–91 dk | 75,5 dk, 11. maç | 33–36 dk |
| Beş dakikada bir giriş | 155 dk | 145–150 dk, 13. maç | 60 dk |
| Offline ağırlıklı | 47 sa 20 dk | 8. maç | 23 sa 5 dk |

Aktif ve beş dakikalık girişlerde sezonun ikinci yarısında dört departmanda toplam 22 blok yükseltmesi yapıldı. Bunların 19–21'inde birden fazla departmanda bütçenin yettiği seçenek vardı. Son çeyrekte aktif oyuncu 15–16, aralıklı giren oyuncu 27–29 oyuncu kartı geliştirdi. AP maliyetleri değişmedi. Altı oyuncu da iki yıldız fırsatına ulaşabildi.

Tarayıcıda farklı departmanlardaki uygun fiyatlar, gerçek satın alma, AP'nin korunması ve kayıt yükleme doğrulandı. Eski takvim, ilk aşamalar, kamp, transfer ve mesai testleri geçti.

Offline vardiya tükenince oluşan uzun günlük bekleme devam ediyor; bu fiyat değişikliği o sistemi değiştirmiyor. Ekonomi koşuları %50 maç kazanımı ve bütçenin %30'unu saklayan satın alma politikası kullanır; her insanın aynı maçta tamamlamasını garanti etmez.

Son fiyatlarla gerçek saha kontrolü de tamamlandı: 9 sezon, 126 kendi maçımız ve 378 diğer resmi karşılaşma. Az geliştiren takım 3/3/4, düzenli geliştiren 1/3/3, odaklı geliştiren 1/3/1. Uludağ her koşuda ilk üçte kaldı. Bunlar küçük örneklemli sonuçlardır; kesin sıralama garantisi değildir.
