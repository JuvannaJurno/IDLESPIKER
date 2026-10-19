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
- Kombine Hücum'un gerçek çıkış noktası sağ ve sol elde hesaplanan el noktasıyla aynı (0 birim fark). Canvas üzerinden ölçülen son temas çevresi farkı yaklaşık 0–3 birim; temas yaklaşırken top ele oturuyor. Bu ölçüm iki Kombine Hücum örneğidir; bütün pozlar için kapsamlı piksel taraması değildir.
- İnişin yönlü devamı, diz kırma, denge adımı ve rahat/zor pas pozları test-body-motion.cjs ile ayrıca kontrol edildi. 31 önizleme ve 60/120 Hz fizik/çizim ayrımı testleri önceki değişiklik doğrulamasında geçti.

## Legendary ve sonuçlar
İlerleme kayıtlarından alınan 6 adet 2. Lig maçında toplam 1 Legendary görüldü. Kayıtların aktif kadrolarında yetenek ve kamp koşulları aynı değil; bu sayı tek başına bir denge hatası kanıtı değil.

| Tohum | Açık skor | Kapalı skor | Açık Legendary (biz/rakip) |
|---|---|---|---|
| 1 | 6–4 | 6–4 | 2/1 |
| 2 | 3–5 | 2–5 | 1/2 |
| 3 | 8–6 | 6–4 | 1/2 |
| 4 | 6–4 | 6–4 | 2/2 |

Bu örneklerde açık takım başına toplam 3–4 Legendary/maç görüldü; iki taraf da kullanabildi. Açık ve kapalı koşullarda galibiyet sayısı aynı (3/4). Dört çift, dengeyi kesin doğrulamaya yetmez. Skill tetiklenince RNG akışı ve top yolları değiştiği için skor farkı doğrudan tek bir skillin net kazancı değildir.

## Kalan hareket sorunu
**P2 — Aynı takım oyuncuları zaman zaman fazla yakın kalıyor.** 28 saha biriminden küçük merkez mesafesini izledik. İlerleme kadrolarında en uzun kesintisiz yakınlaşma 0.65 saniyelik adım karşılığı; eşit kadrolarda da yaklaşık 0.62. Bu bir merkez mesafesi ölçümüdür; her örnek sprite'ın fiziksel olarak çarpıştığını kanıtlamaz. Hareket düzenini tamamen temiz kabul etmiyoruz. Sonraki düzeltme, bekleme/rotasyon sonrası ralliye çıkışta oyuncu hedeflerini daha erken ayırmak ve kalan yakınlaşmaların görüntüsünü incelemek olmalı. Bu kontrolde oyun davranışı değiştirilmedi.

## Mobil tarayıcı örneği
390×844 CSS piksel, DPR 2; her koşul 5 saniye, normal maçın erken rallileri. Fiziksel telefon testi değildir; uzun maç ve bütün Legendary efektleri için sürekli performans ölçümü de değildir.

| CPU yavaşlatma | FPS | 50 ms üzeri boşluk | En uzun boşluk |
|---|---:|---:|---:|
| 1× | 58.5 | 1 | 116.6 ms |
| 4× | 60.2 | 0 | 17.0 ms |

1× örnekte başlangıçta bir kısa takılma var; 4× örnekte yok. Kısa masaüstü ölçümünü gerçek telefon garantisi olarak yorumlamıyoruz.

## Kanıtlar
- matches.json: 12 ilerleme kaydı maçı ve yakınlaşma ölçümleri.
- focused.json: normal olasılıkla 4 açık/kapalı çift.
- left.json: sol elle Kombine Hücum teması.
- mobile.json, normal-match-mobile.png: kısa mobil tarayıcı örneği.
- run.cjs; run.cjs --focused; run.cjs --focused --left; mobile.cjs ile tekrarlanabilir.
