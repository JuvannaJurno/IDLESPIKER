# Sıfır kayıt → ilk kamp dönüşü ve lig ilerleyişi — 28 Ekim 2026

Sonuç: Kamp hazırlık kilidi çalışıyor, fakat ekonomik sorun sürüyor. Denenen sekiz senaryonun sekizinde, ilk kamptan dönen bütün oyuncular yeni gelir olmadan tekrar seviye sınırına ulaşabildi. Bu bir denge başarısı değil, yeniden üretilebilen sorun kaydıdır.

## Gerçek arayüz doğrulaması

0 AP / 20 bütçeden başlayan kurallı ekonomi simülasyonunun ilk dönüş kaydı izole tarayıcıda açıldı. Kullanıcının kayıtları okunmadı veya değiştirilmedi. Otomatik üretim durduruldu; ücretsiz yükseltme ihtimali kapatıldı. Gerçek Hızlı Yükselt düğmeleri ve kamp gönderme düğmesi kullanıldı.

- Dönüşte AP: 757448.91.
- Gelen oyuncuların seviyeleri: 9, 9, 8, 8, 8; hepsinin yeni sınırı 20.
- 58 tıklama sonunda seviyeler: 20, 20, 20, 20, 20.
- Toplam harcanan AP: 320358.00; kalan AP: 437090.91.
- Beşinin tekrar kamp AP bedeli 304000, bütçesi 10000. Elde 8340 bütçe olduğu için beşi birlikte gidemez; dört oyuncu gerçek düğmeyle tekrar gönderilebildi. Dolayısıyla yalnız bireysel satın alınabilirlik değil, toplam grup bütçesi de kontrol edildi.

## İlk dört lig

Aşağıdaki sonuçlar aynı yedi oyuncuyla, transfer/akademi kullanılmadan yapılan karşılaştırmalardır. Otomasyon/gelir blokları bütçeden gerçekten satın alınır. Aktif oyuncu 30 saniyede, seyrek kontrol eden oyuncu 5 dakikada karar verir. Maç sonucu sabit RNG ile %50 kazanım kabul edilir; bu model gerçek maç gücünün veya herkesin yükselmesinin garantisi değildir. 1. Lig'de akademiden ileri kademeli mezun alınması bu tabloyu değiştirebilir.

| Eğitim maliyeti deneyi | Profil | Mahalle sonu kamp | Bölgesel sonu | 2. Lig sonu | 1. Lig sonu |
|---|---|---:|---:|---:|---:|
| Mevcut | active | 0 | 4 | 8 | 8 |
| Mevcut | idle | 0 | 4 | 8 | 8 |
| Kamp sonrası ×10 | active | 0 | 3 | 5 | 6 |
| Kamp sonrası ×10 | idle | 0 | 2 | 5 | 6 |
| Kamp sonrası ×30 | active | 0 | 2 | 5 | 5 |
| Kamp sonrası ×30 | idle | 0 | 2 | 5 | 5 |
| Kamp sonrası ×60 | active | 0 | 2 | 4 | 4 |
| Kamp sonrası ×60 | idle | 0 | 2 | 4 | 5 |

Değerler kadronun ortanca toplam kamp sayısıdır. Toplu maliyet artışı erken döngüyü frenlerken sonraki liglerde yıldız ilerlemesini de düşürüyor. Bu deney çarpanları üretim koduna uygulanmadı.

## Bütün oyunla tutarlılık

Mevcut taslak yıldız hedefleri bir oyuncu için şöyledir; oyuncunun her lig sonunda kesin ulaşacağı değerler değildir. İlk aşamada kamp kapalıdır; eski stageTargets[1]=[0,2] metadata değeri bu nedenle gerçek açılışla çelişiyor ve denge hedefi olarak kullanılmamalıdır.

| Aşama | Taslak toplam kamp | Kart/yıldız | Normal seviye sınırı | Doğrulama durumu |
|---|---|---|---|---|
| Mahalle | 0 | Siyah, 0 yıldız | 10 | Gerçek ekonomi modeli |
| Bölgesel | 2–4 | Siyah, 1–2 yıldız | 30–50 | Gerçek ekonomi modeli |
| Ulusal 2. Lig | 6–8 | Gümüş, 0–1 yıldız | 70–90 | Gerçek ekonomi modeli |
| Ulusal 1. Lig | 12–14 | Altın, 0–1 yıldız | 130–150 | Gerçek ekonomi modeli; akademi hariç |
| Sultanlar | 18 | Mor, 0 yıldız | 190 | Gelecek aşama hedefi |
| Milletler | 18–20 | Mor, 0–1 yıldız; elit/signature ayrı | 190–210 | Gelecek aşama hedefi |
| Dünya | 20–22 | Mor, 1–2 yıldız | 210–230 | Gelecek aşama hedefi |
| Olimpus | 22–24 | Mor, 2–3 yıldız | 230–250 | Gelecek aşama hedefi |

5–8. aşamaların oynanabilir ekonomi içeriği henüz yok; bunlarda tam oyun testi yapılmış gibi değerlendirme yapılmadı. Mevcut sınır formülü ve kamp/yıldız eşlemesi bu hedeflere kadar kontrol edilebilir; gelir, lig süresi, yeni bloklar ve academy/transfer etkileri eklenmeden hedef süre garanti edilemez.

## Sonraki denge değişikliğinin kabul ölçütleri

1. Normal sıfır başlangıç rotasında ilk kamp dönüşündeki AP, tüm gelen oyuncuları bir anda yeni sınıra taşımamalı. Çok uzun AP biriktiren oyuncunun bilinçli hızlanması ayrı ölçülmeli; biriktirmeyi cezalandıran dinamik fiyat uygulanmamalı.
2. Sadece kampın aynı seviyede tekrar açılmasını engellemek yeterli değildir. Dönüş AP'si / bir sonraki hazırlık maliyeti oranı, tüm takımı doldurma oranı ve tekrar gönderilebilen oyuncu sayısı ölçülmeli.
3. Yükseltme maliyeti, talimat başına AP ve kamp süresi birlikte ayarlanmalı. Toplu ×10/30/60 maliyet artışı tek başına onaylanmamalı.
4. Lig sonu kadro dağılımı ve geride kalan oyuncular ayrı izlenmeli; yalnız en güçlü oyuncunun yıldızıyla sonuç çıkarılmamalı.
5. 1. Lig akademiyle ve akademisiz tekrar denenmeli. 5–8 hedefleri gelecekteki yeni üretim kaynaklarıyla sayısal olarak yeniden doğrulanmalı.

Bu çalışmada ekonomik katsayılar değiştirilmedi. İzole dönüş kaydı açılırken bulunan, sınırdaki/kamptaki oyuncuların RoomSystem kurulmadan çizilmesindeki açılış hatası ayrıca düzeltildi.
