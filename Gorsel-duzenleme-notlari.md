# Karakter görsellerini düzenleme

## Maç karakterinin temel parçaları

Maçta renkleri kodla verilen temel kaynaklar proje kökünde:

- arm.png: iki kolun ortak görseli.
- arm_jersey.png: iki koldaki forma parçası.
- jersey_1.png: gövde/formanın ana görseli.
- skin_1.png: başın temel görseli.

Saç maçın oluşturulmuş HTML dosyalarında hair_1.png adıyla gömülü. Şu anda bu adla ayrı kaynak PNG proje kökünde bulunmuyor; üretim scriptlerini yeniden çalıştırmadan önce bu kaynak eksikliği giderilmeli.

Bu temel parçaların renk varyantlarını ayrı ayrı çizmek gerekmiyor. Mevcut en/boy ölçülerini ve şeffaf alanları korumak pozların hizasını korur.

## Portreler

Takım ve transfer portreleri PNG klasöründeki farklı saç modellerini, tenleri, yüzleri ve kıyafet parçalarını ayrıca kullanıyor. Bunlar maçın temel parça dosyalarından bağımsızdır. Renk varyantlarını tamamen kaldırmak için önce portre üretimini tek temel görselden renklendirecek şekilde dönüştürmek gerekir.

## Değişikliği oyunda görmek

Bir PNG'yi düzenlemek, mevcut gömülü HTML/JS görsellerini kendiliğinden yenilemez. Düzenlenen kaynaklar ilgili paketlere tekrar aktarılmalıdır. Bu düzenleme sırasında mevcut paketler yeniden üretilmedi veya değiştirilmedi.

## Ayrılanlar

Kullanılmayan 7 saç dosyası no need/PNG/Hair/... altına taşındı. Klasörde dosya listesi var; hiçbir dosya silinmedi.
