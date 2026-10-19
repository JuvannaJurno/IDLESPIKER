# Normal maç animasyonu kontrolü
19 Ekim 2026

## Kapsam
- 21 tam maç: önceki üç ilerleme koşusunun BAL/2. Lig orta ve son kayıtlarından 12 maç; eşit 75 statlı, Legendary yeteneği açılmış örnek kadrolarla 4 açık/kapalı çift (8 maç); sol el için 1 ek maç.
- Normal maç motoru ve normal skill olasılıkları kullanıldı. animationLab/epicTeam yoğunluğu açılmadı. İlerleme kayıtlarının kadroları değişmedi. Eşit güçte karşılaştırmalar ayrı test verisidir; doğal ilerleme koşusu gibi sunulmadı.
- 60 Hz adımlarla hızlandırılmış maçlar; aralıklı gerçek canvas çizimi ve temasa yakın daha sık çizim. Tüm maçları normal süresinde elle izleme değildir. Gerçek roster/libero eşlemesi kullanıldı. Kamp sayıları ana oyunun maç verisi gibi snapshot'a aktarıldı.

## Geçen kontroller
- 21/21 maç tamamlandı, JavaScript hatası yok, çizim fizik koordinatlarını değiştirmedi.
- Ralli sırasında tek adımda en yüksek yer değiştirme 3.48 saha birimi; ralli içinde ışınlanma görülmedi. Bekleme sırasındaki libero oyuncu kimliği değişimi bu ölçümden ayrı tutuldu.
- BAL'daki 6 maçta Legendary yok. Kilitli karşılaştırmalarda iki tarafın da Legendary kullanımı sıfır.
- Kombine Hücum'un gerçek çıkış noktası sağ ve sol elde hesaplanan el noktasıyla aynı (0 birim fark). Canvas üzerinden ölçülen son temas çevresi farkı yaklaşık 0–3 birim; temas yaklaşırken top ele oturuyor. Bu ölçüm az sayıdaki Kombine Hücum örneğidir; bütün pozlar için kapsamlı piksel taraması değildir.
- İnişin yönlü devamı, diz kırma, denge adımı ve rahat/zor pas pozları test-body-motion.cjs ile ayrıca kontrol edildi. 31 önizleme ve 60/120 Hz fizik/çizim ayrımı testleri önceki değişiklik doğrulamasında geçti.

## Legendary ve sonuçlar
İlerleme kayıtlarından alınan 6 adet 2. Lig maçında toplam 1 Legendary görüldü. Kayıtların aktif kadrolarında yetenek ve kamp koşulları aynı değil; bu sayı tek başına bir denge hatası kanıtı değil.

| Tohum | Açık skor | Kapalı skor | Açık Legendary (biz/rakip) |
|---|---|---|---|
| 1 | 6–4 | 6–4 | 3/2 |
| 2 | 3–5 | 2–5 | 1/1 |
| 3 | 11–9 | 6–4 | 5/2 |
| 4 | 7–5 | 6–4 | 1/2 |

Bu örneklerde açık eşleşmelerde iki takım toplam 2–7 Legendary/maç kullandı (uzayan skorlar dahil); iki taraf da kullanabildi. Açık ve kapalı koşullarda galibiyet sayısı aynı (3/4). Dört çift, dengeyi kesin doğrulamaya yetmez. Skill tetiklenince RNG akışı ve top yolları değiştiği için skor farkı doğrudan tek bir skillin net kazancı değildir.

## Yakınlaşma düzeltmesi — kapandı
File/saha sınırı, yana kaçış hareketini kesip oyuncuyu takım arkadaşına yaklaştırıyordu. Kaçış yönü açık sahaya çevrildi; sınır uygulandıktan sonraki gerçek adım da kontrol ediliyor. Uygun yan adım seçiliyor, oyuncu ışınlanmıyor veya sonradan itilerek ayrılmıyor. Değişiklik mac.html, deneme-modu.html ve lab'in gömülü motorunda aynı.

Önceki 12 kayıt maçında toplam 12,73 saniyelik adım karşılığı yakınlaşma ve en uzun 0,65 saniyelik kesintisiz olay vardı (spacing-before.json). Aynı 12 kayıtla tekrar koşuda ve 9 ek normal sıklıklı örnekte 28 saha birimi altına iniş 0. En düşük ölçülen mesafe yaklaşık 40 birim. Ölçüm ralli sırasında; rotasyonun görsel geçişi ve libero kimlik değişimi ayrı. test-match-movement.cjs, iki tarafta file kenarında açık sahadan dolaşmayı, en az 40 birim aralığı, hız sınırını ve takılmadan geçişi ayrıca doğruluyor. Fiziksel telefon ve daha geniş örneklem gereği sürüyor.

## Mobil tarayıcı örneği
390×844 CSS piksel, DPR 2; her koşul 5 saniye, normal maçın erken rallileri. Fiziksel telefon testi değildir; uzun maç ve bütün Legendary efektleri için sürekli performans ölçümü de değildir.

| CPU yavaşlatma | FPS | 50 ms üzeri boşluk | En uzun boşluk |
|---|---:|---:|---:|
| 1× | 57.5 | 2 | 133.4 ms |
| 4× | 60.3 | 0 | 16.9 ms |

1× örnekte başlangıçta kısa takılmalar var; 4× örnekte yok. Kısa masaüstü ölçümünü gerçek telefon garantisi olarak yorumlamıyoruz.

## Kanıtlar
- matches.json: 12 ilerleme kaydı maçı ve yakınlaşma ölçümleri.
- focused.json: normal olasılıkla 4 açık/kapalı çift.
- left.json: sol elle Kombine Hücum teması.
- mobile.json, normal-match-mobile.png: kısa mobil tarayıcı örneği.
- run.cjs; run.cjs --focused; run.cjs --focused --left; mobile.cjs ile tekrarlanabilir.
